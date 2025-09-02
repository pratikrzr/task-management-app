import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  MessageSquare,
  User,
  BarChart3,
} from "lucide-react";
import SubtaskCard from "./SubTask";

const TicketCard = ({ task, onAddComment, onUpdateStatus }) => {
  const [showComments, setShowComments] = useState(false);
  const [showSubtasks, setShowSubtasks] = useState(true);
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

  const handleSubtaskUpdate = (subtaskId, newStatus) => {
    // This would typically update the subtask status via API
    console.log(`Update subtask ${subtaskId} to ${newStatus}`);
    // For now, we'll just log it. In a real app, you'd update the state/API
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
        <div className="story-points">
          <BarChart3 size={12} />
          {task.storyPoints || 0}
        </div>
      </div>

      {/* Description */}
      <div className="ticket-description">
        {task.aiProcessed ? (
          task.description || "No description available"
        ) : (
          <div className="ai-loading">
            <div className="ai-spinner"></div>
            AI is generating description...
          </div>
        )}
      </div>

      {/* Subtasks */}
      {task.subtasks && task.subtasks.length > 0 && (
        <div className="subtasks-section">
          <button
            onClick={() => setShowSubtasks(!showSubtasks)}
            className="subtasks-toggle"
          >
            {showSubtasks ? (
              <ChevronDown size={16} />
            ) : (
              <ChevronRight size={16} />
            )}
            Subtasks ({task.subtasks.length})
          </button>

          {showSubtasks && (
            <div className="subtasks-list">
              {task.subtasks.map((subtask) => (
                <SubtaskCard
                  key={subtask.id}
                  subtask={subtask}
                  onUpdateSubtask={handleSubtaskUpdate}
                />
              ))}
            </div>
          )}
        </div>
      )}

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
