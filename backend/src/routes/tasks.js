import express from "express";
import {
  createTask,
  getTasks,
  addComment,
  updateTaskStatus,
} from "../controllers/taskController.js";

const router = express.Router();

router.post("/", createTask);
router.get("/", getTasks);
router.post("/:id/comments", addComment);
router.put("/:id/status", updateTaskStatus);

export default router;
