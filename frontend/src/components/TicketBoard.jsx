import { Circle, Clock, CheckCircle2 } from "lucide-react";
import TicketCard from "./TicketCard";

const TicketBoard = ({
  tasks,
  onAddComment,
  onUpdateStatus,
  onShowDetails,
}) => {
  const todoTasks = tasks.filter((task) => task.status === "todo");
  const inProgressTasks = tasks.filter((task) => task.status === "in-progress");
  const doneTasks = tasks.filter((task) => task.status === "done");

  const ColumnHeader = ({ title, count, className, icon }) => (
    <div className={`column-header ${className}`}>
      <h2 className="column-title">
        {icon}
        {title}
      </h2>
      <span className="column-count">{count}</span>
    </div>
  );

  return (
    <div className="ticket-board">
      {/* To Do Column */}
      <div className="board-column">
        <ColumnHeader
          title="To Do"
          count={todoTasks.length}
          className="todo"
          icon={<Circle size={20} />}
        />
        <div className="column-content">
          {todoTasks.map((task) => (
            <TicketCard
              key={task._id}
              task={task}
              onAddComment={onAddComment}
              onUpdateStatus={onUpdateStatus}
              onShowDetails={onShowDetails}
            />
          ))}
        </div>
      </div>

      {/* In Progress Column */}
      <div className="board-column">
        <ColumnHeader
          title="In Progress"
          count={inProgressTasks.length}
          className="in-progress"
          icon={<Clock size={20} />}
        />
        <div className="column-content">
          {inProgressTasks.map((task) => (
            <TicketCard
              key={task._id}
              task={task}
              onAddComment={onAddComment}
              onUpdateStatus={onUpdateStatus}
              onShowDetails={onShowDetails}
            />
          ))}
        </div>
      </div>

      {/* Done Column */}
      <div className="board-column">
        <ColumnHeader
          title="Done"
          count={doneTasks.length}
          className="done"
          icon={<CheckCircle2 size={20} />}
        />
        <div className="column-content">
          {doneTasks.map((task) => (
            <TicketCard
              key={task._id}
              task={task}
              onAddComment={onAddComment}
              onUpdateStatus={onUpdateStatus}
              onShowDetails={onShowDetails}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TicketBoard;
