import express from "express";
import {
  createTask,
  getTasks,
  addComment,
  updateTaskStatus,
  deleteTask, // ADD this import
} from "../controllers/taskController.js";

const router = express.Router();

router.post("/", createTask);
router.get("/", getTasks);
router.delete("/:id", deleteTask); // ADD this route
router.post("/:id/comments", addComment);
router.put("/:id/status", updateTaskStatus);

export default router;
