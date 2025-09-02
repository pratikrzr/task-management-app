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

  const createTask = async (title) => {
    try {
      const response = await taskAPI.createTask(title);
      setTasks((prev) => [response.data, ...prev]);
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  const addComment = async (taskId, author, content) => {
    try {
      const response = await taskAPI.addComment(taskId, author, content);
      setTasks((prev) =>
        prev.map((task) => (task._id === taskId ? response.data : task))
      );
      // Update selected task if it's the same task
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
      // Update selected task if it's the same task
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

  // Fetch tasks on component mount and then poll every 5 seconds
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
