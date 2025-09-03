import { useState } from "react";
import {
  X,
  User,
  BarChart3,
  MessageSquare,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  Circle,
  AlertCircle,
  Clock,
} from "lucide-react";
import SubtaskCard from "./SubTask";

const TicketDetailModal = ({
  isOpen,
  onClose,
  task,
  onAddComment,
  onUpdateStatus,
}) => {
  const [showSubtasks, setShowSubtasks] = useState(true);
  const [showComments, setShowComments] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [author, setAuthor] = useState("");

  if (!isOpen || !task) return null;

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

  const getStatusIcon = (status) => {
    switch (status) {
      case "done":
        return <CheckCircle2 className="status-icon done" />;
      case "in-progress":
        return <Clock className="status-icon in-progress" />;
      default:
        return <Circle className="status-icon todo" />;
    }
  };

  const handleSubtaskUpdate = (subtaskId, newStatus) => {
    console.log(`Update subtask ${subtaskId} to ${newStatus}`);
  };

  const renderDescription = () => {
    const description = task.description || "No description available";
    const shouldTruncate = description.length > 25;

    if (!shouldTruncate) {
      return description;
    }

    return (
      <div>
        <span>
          {showFullDescription
            ? description
            : `${description.substring(0, 25)}...`}
        </span>
        <button
          onClick={() => setShowFullDescription(!showFullDescription)}
          className="show-more-btn"
          style={{
            background: "none",
            border: "none",
            color: "#007bff",
            cursor: "pointer",
            textDecoration: "underline",
            marginLeft: "8px",
            fontSize: "14px",
          }}
        >
          {showFullDescription ? "Show less" : "Show more"}
        </button>
      </div>
    );
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="ticket-detail-modal" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="ticket-detail-header">
          <div className="ticket-detail-title-section">
            <div className="ticket-detail-status-icon">
              {getStatusIcon(task.status)}
            </div>
            <div>
              <h2 className="ticket-detail-title">{task.title}</h2>
              <div className="ticket-detail-meta">
                <span className={getPriorityClass(task.priority)}>
                  {task.priority?.toUpperCase() || "LOW"}
                </span>
                {task.assignee && (
                  <div className="assignee-info">
                    <User size={14} />
                    <span>{task.assignee}</span>
                  </div>
                )}
                <div className="story-points">
                  <BarChart3 size={14} />
                  {task.storyPoints || 0} pts
                </div>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="modal-close-btn">
            <X size={24} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="ticket-detail-body">
          {/* Description Section */}
          <div className="ticket-detail-section">
            <h3 className="section-title">Description</h3>
            <div className="ticket-detail-description">
              {renderDescription()}
            </div>
          </div>

          {/* Status Update Section */}
          <div className="ticket-detail-section">
            <h3 className="section-title">Status</h3>
            <select
              value={task.status}
              onChange={(e) => onUpdateStatus(task._id, e.target.value)}
              className="status-select-modal"
            >
              <option value="todo">📝 To Do</option>
              <option value="in-progress">⚡ In Progress</option>
              <option value="done">✅ Done</option>
            </select>
          </div>

          {/* Subtasks Section */}
          {task.subtasks && task.subtasks.length > 0 && (
            <div className="ticket-detail-section">
              <button
                onClick={() => setShowSubtasks(!showSubtasks)}
                className="section-toggle"
              >
                {showSubtasks ? (
                  <ChevronDown size={18} />
                ) : (
                  <ChevronRight size={18} />
                )}
                <h3 className="section-title">
                  Subtasks ({task.subtasks.length})
                </h3>
              </button>

              {showSubtasks && (
                <div className="subtasks-list-modal">
                  {task.subtasks.map((subtask) => (
                    <SubtaskCard
                      key={subtask._id}
                      subtask={subtask}
                      onUpdateSubtask={handleSubtaskUpdate}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Comments Section */}
          <div className="ticket-detail-section">
            <button
              onClick={() => setShowComments(!showComments)}
              className="section-toggle"
            >
              {showComments ? (
                <ChevronDown size={18} />
              ) : (
                <ChevronRight size={18} />
              )}
              <h3 className="section-title">
                Comments ({task.comments?.length || 0})
              </h3>
            </button>

            {showComments && (
              <div className="comments-section-modal">
                <div className="comments-list-modal">
                  {task.comments?.map((comment, index) => (
                    <div key={index} className="comment-modal">
                      <div className="comment-header-modal">
                        <strong className="comment-author">
                          {comment.author}
                        </strong>
                        <small className="comment-date">
                          {new Date(comment.createdAt).toLocaleString()}
                        </small>
                      </div>
                      <p className="comment-content">{comment.content}</p>
                    </div>
                  ))}
                </div>

                <div className="comment-form-modal">
                  <input
                    type="text"
                    placeholder="Your name"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="comment-input-modal"
                  />
                  <textarea
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="comment-textarea-modal"
                    rows="3"
                  />
                  <button onClick={handleAddComment} className="btn-primary">
                    <MessageSquare size={16} />
                    Add Comment
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetailModal;
