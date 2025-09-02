import { CheckCircle2, Circle, AlertCircle, User } from "lucide-react";

const SubtaskCard = ({ subtask, onUpdateSubtask }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case "done":
        return <CheckCircle2 className="status-icon done" />;
      case "in-progress":
        return <AlertCircle className="status-icon in-progress" />;
      default:
        return <Circle className="status-icon todo" />;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "done":
        return "subtask-card status-done";
      case "in-progress":
        return "subtask-card status-in-progress";
      default:
        return "subtask-card status-todo";
    }
  };

  return (
    <div className={getStatusClass(subtask.status)}>
      <div className="subtask-header">
        <div className="subtask-title-row">
          {getStatusIcon(subtask.status)}
          <h5 className="subtask-title">{subtask.title}</h5>
        </div>
        <div className="subtask-points">{subtask.storyPoints} pts</div>
      </div>

      {subtask.description && (
        <p className="subtask-description">{subtask.description}</p>
      )}

      <div className="subtask-footer">
        <div className="subtask-assignee">
          <User size={12} />
          <span>{subtask.assignee}</span>
        </div>

        <select
          value={subtask.status}
          onChange={(e) => onUpdateSubtask(subtask.id, e.target.value)}
          className="subtask-select"
        >
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>
      </div>
    </div>
  );
};

export default SubtaskCard;
