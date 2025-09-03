import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error(
      "API Error:",
      error.response?.status,
      error.response?.data || error.message
    );
    return Promise.reject(error);
  }
);

export const taskAPI = {
  getAllTasks: () => api.get("/tasks"),

  createTask: (title, priority = "low") =>
    api.post("/tasks", { title, priority }),

  deleteTask: (taskId) => api.delete(`/tasks/${taskId}`),

  addComment: (taskId, author, content) =>
    api.post(`/tasks/${taskId}/comments`, { author, content }),

  updateTaskStatus: (taskId, status) =>
    api.put(`/tasks/${taskId}/status`, { status }),
};
