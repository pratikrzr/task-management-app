import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const taskAPI = {
  getAllTasks: () => api.get("/tasks"),
  createTask: (title) => api.post("/tasks", { title }),
  addComment: (taskId, author, content) =>
    api.post(`/tasks/${taskId}/comments`, { author, content }),
  updateTaskStatus: (taskId, status) =>
    api.put(`/tasks/${taskId}/status`, { status }),
};
