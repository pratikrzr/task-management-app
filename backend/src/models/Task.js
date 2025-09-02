import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  author: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const subtaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: "" },
  storyPoints: { type: Number, default: 1 },
  status: {
    type: String,
    enum: ["todo", "in-progress", "done"],
    default: "todo",
  },
});

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: "" },
  storyPoints: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ["todo", "in-progress", "done"],
    default: "todo",
  },
  subtasks: [subtaskSchema],
  comments: [commentSchema],
  aiProcessed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Task", taskSchema);
