import { useState, useEffect } from "react";
import { Plus, BarChart3 } from "lucide-react";
import { taskAPI } from "./services/api";
import TicketBoard from "./components/TicketBoard";
import CreateTicketModal from "./components/CreateTicketModal";
import TicketDetailModal from "./components/TicketDetailModal";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const response = await taskAPI.getAllTasks();
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (title, priority = "low") => {
    console.log("App: createTask called with:", { title, priority });

    if (!title || !title.trim()) {
      console.error("App: No title provided");
      alert("Please enter a task title");
      return;
    }

    try {
      console.log("App: Calling taskAPI.createTask...");
      const response = await taskAPI.createTask(title, priority);
      console.log("App: Task created successfully:", response.data);

      setTasks((prev) => {
        console.log("App: Adding task to state, current tasks:", prev.length);
        return [response.data, ...prev];
      });

      console.log("App: Task creation completed");
    } catch (error) {
      console.error("App: Error creating task:", error);
      console.error(
        "App: Error details:",
        error.response?.data || error.message
      );
      alert(
        `Failed to create task: ${error.response?.data?.error || error.message}`
      );
    }
  };

  const deleteTask = async (taskId) => {
    try {
      console.log("Deleting task with ID:", taskId); // Debug log
      const response = await taskAPI.deleteTask(taskId);
      console.log("Delete response:", response); // Debug log

      setTasks((prev) => prev.filter((task) => task._id !== taskId));

      if (selectedTask && selectedTask._id === taskId) {
        setIsDetailModalOpen(false);
        setSelectedTask(null);
      }

      alert("Task deleted successfully!");
    } catch (error) {
      console.error("Error deleting task:", error);
      alert(
        "Failed to delete task. Please check if the backend endpoint exists."
      );
    }
  };

  const addComment = async (taskId, author, content) => {
    try {
      const response = await taskAPI.addComment(taskId, author, content);
      setTasks((prev) =>
        prev.map((task) => (task._id === taskId ? response.data : task))
      );
      if (selectedTask && selectedTask._id === taskId) {
        setSelectedTask(response.data);
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const updateTaskStatus = async (taskId, status) => {
    try {
      const response = await taskAPI.updateTaskStatus(taskId, status);
      setTasks((prev) =>
        prev.map((task) => (task._id === taskId ? response.data : task))
      );

      if (selectedTask && selectedTask._id === taskId) {
        setSelectedTask(response.data);
      }
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const showTaskDetails = (task) => {
    setSelectedTask(task);
    setIsDetailModalOpen(true);
  };

  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedTask(null);
  };

  useEffect(() => {
    fetchTasks();
    const interval = setInterval(fetchTasks, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p className="loading-text">Loading your tasks...</p>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header-content">
          <div className="app-logo">
            <div className="app-logo-icon">
              <BarChart3 size={18} />
            </div>
            <h1 className="app-title">TaskFlow Pro</h1>
          </div>
          <button onClick={() => setIsModalOpen(true)} className="btn-primary">
            <Plus size={16} />
            Create Task
          </button>
        </div>
      </header>

      <main className="app-main">
        <TicketBoard
          tasks={tasks}
          onAddComment={addComment}
          onUpdateStatus={updateTaskStatus}
          onShowDetails={showTaskDetails}
          onDeleteTask={deleteTask}
        />
      </main>

      <CreateTicketModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={createTask}
      />

      <TicketDetailModal
        isOpen={isDetailModalOpen}
        onClose={closeDetailModal}
        task={selectedTask}
        onAddComment={addComment}
        onUpdateStatus={updateTaskStatus}
      />
    </div>
  );
}

export default App;
