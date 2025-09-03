import { useState } from "react";
import {
  ChevronRight,
  MessageSquare,
  User,
  BarChart3,
  Trash2,
  Eye,
} from "lucide-react";

const TicketCard = ({
  task,
  onAddComment,
  onUpdateStatus,
  onDeleteTask,
  onShowDetails,
}) => {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [author, setAuthor] = useState("");

  const handleAddComment = () => {
    if (author.trim() && newComment.trim()) {
      onAddComment(task._id, author.trim(), newComment.trim());
      setNewComment("");
      setAuthor("");
    }
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case "high":
        return "priority-badge priority-high";
      case "medium":
        return "priority-badge priority-medium";
      default:
        return "priority-badge priority-low";
    }
  };

  const handleDeleteTask = (e) => {
    e.stopPropagation(); // Prevent any parent click events
    console.log("Delete button clicked for task:", task._id); // Debug log
    if (window.confirm(`Are you sure you want to delete "${task.title}"?`)) {
      console.log("User confirmed deletion"); // Debug log
      onDeleteTask(task._id);
    } else {
      console.log("User cancelled deletion"); // Debug log
    }
  };

  const renderTruncatedDescription = () => {
    if (!task.aiProcessed) {
      return (
        <div className="ai-loading">
          <div className="ai-spinner"></div>
          AI is generating description...
        </div>
      );
    }

    const description = task.description || "No description available";
    const truncatedDescription =
      description.length > 30
        ? `${description.substring(0, 30)}...`
        : description;

    return (
      <div className="ticket-description-preview">{truncatedDescription}</div>
    );
  };

  return (
    <div className="ticket-card">
      {/* Header */}
      <div className="ticket-header">
        <div>
          <h3 className="ticket-title">{task.title}</h3>
          <div className="ticket-meta">
            <span className={getPriorityClass(task.priority)}>
              {task.priority?.toUpperCase() || "LOW"}
            </span>
            {task.assignee && (
              <div className="assignee-info">
                <User size={12} />
                <span>{task.assignee}</span>
              </div>
            )}
          </div>
        </div>
        <div className="ticket-header-actions">
          <div className="story-points">
            <BarChart3 size={12} />
            {task.storyPoints || 0}
          </div>
          <button
            onClick={handleDeleteTask}
            className="delete-btn"
            title="Delete task"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Truncated Description */}
      {renderTruncatedDescription()}

      {/* Actions */}
      <div className="ticket-actions">
        <select
          value={task.status}
          onChange={(e) => onUpdateStatus(task._id, e.target.value)}
          className="status-select"
        >
          <option value="todo">📝 To Do</option>
          <option value="in-progress">⚡ In Progress</option>
          <option value="done">✅ Done</option>
        </select>

        <button
          onClick={() => setShowComments(!showComments)}
          className="comments-toggle"
        >
          <MessageSquare size={16} />
          {task.comments?.length || 0}
        </button>

        <button
          onClick={() => onShowDetails(task)}
          className="details-btn"
          title="View details"
        >
          <Eye size={16} />
          Details
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="comments-section">
          <div className="comments-list">
            {task.comments?.map((comment, index) => (
              <div key={index} className="comment">
                <div className="comment-author">{comment.author}</div>
                <p className="comment-content">{comment.content}</p>
                <small className="comment-date">
                  {new Date(comment.createdAt).toLocaleString()}
                </small>
              </div>
            ))}
          </div>

          <div className="comment-form">
            <input
              type="text"
              placeholder="Your name"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="comment-input"
            />
            <textarea
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="comment-textarea"
            />
            <button onClick={handleAddComment} className="btn-primary">
              Add Comment
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketCard;
