import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { serve } from "inngest/express";
import taskRoutes from "./routes/tasks.js";
import { inngest, processTicketWithAI } from "./inngest/functions.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Routes
app.use("/api/tasks", taskRoutes);

// Inngest endpoint
app.use(
  "/api/inngest",
  serve({
    client: inngest,
    functions: [processTicketWithAI],
    signingKey: process.env.INNGEST_SIGNING_KEY,
  })
);

app.get("/", (req, res) => {
  res.json({ message: "Task Management API is running!" });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});
