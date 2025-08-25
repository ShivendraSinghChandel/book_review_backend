const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const env = require("dotenv");
env.config();
const app = express();
const morgan = require("morgan");
app.use(morgan("tiny"));

let isConnected = false;

async function connectToDatabase() {
  if (isConnected) {
    console.log('Using existing database connection');
    return;
  }
  
  try {
    await mongoose.connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, 
      socketTimeoutMS: 45000, 
    });
    isConnected = mongoose.connection.readyState === 1;
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

app.use(cors({
  origin: [
    "https://book-review-kappa-eight.vercel.app",
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

const userRoute = require("./route/userRoute");
const bookRoute = require("./route/bookRoute");
const feedbackRoute = require("./route/feedbackRoute");

app.use(async (req, res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (error) {
    console.error('Database connection failed:', error);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

app.use("/user", userRoute);
app.use("/book", bookRoute);
app.use("/feedback", feedbackRoute);

app.get("/health", (req, res) => {
  res.status(200).json({ 
    status: "OK", 
    database: isConnected ? "Connected" : "Disconnected" 
  });
});

app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

module.exports = app;