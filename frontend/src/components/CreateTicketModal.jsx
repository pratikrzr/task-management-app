import { useState } from "react";

const CreateTicketModal = ({ isOpen, onClose, onSubmit }) => {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("low");

  const handleSubmit = () => {
    if (title.trim()) {
      onSubmit(title.trim(), priority);
      setTitle("");
      setPriority("low");
      onClose();
    }
  };

  // Add the missing handleKeyPress function
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Create New Task</h2>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label htmlFor="title" className="form-label">
              Task Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter task title..."
              className="form-input"
              autoFocus
            />
          </div>
          <div className="form-group">
            <label htmlFor="priority" className="form-label">
              Priority
            </label>
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="form-input"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button onClick={handleSubmit} className="btn-primary">
              Create Task
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTicketModal;
