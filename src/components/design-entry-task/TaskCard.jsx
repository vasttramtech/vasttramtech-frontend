import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Circle,
  Edit2,
  GripVertical,
  MessageCircle,
  MoreHorizontal,
  Trash2,
  User,
} from "lucide-react";
import { useState } from "react";

const TaskCard = ({
  task,
  onEdit,
  onDelete,
  isDragging = false,
  hasDeleteAccess,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const priorityConfig = {
    Low: {
      bg: "bg-green-100",
      text: "text-green-800",
      border: "border-green-200",
    },
    Medium: {
      bg: "bg-yellow-100",
      text: "text-yellow-800",
      border: "border-yellow-200",
    },
    High: {
      bg: "bg-orange-100",
      text: "text-orange-800",
      border: "border-orange-200",
    },
    Urgent: {
      bg: "bg-red-100",
      text: "text-red-800",
      border: "border-red-200",
    },
  };

  const isOverdue = task.due_date && new Date(task.due_date) < new Date();
  const isDueToday =
    task.due_date &&
    new Date(task.due_date).toDateString() === new Date().toDateString();

  return (
    <div
      className={`bg-white rounded-xl shadow-sm border-2 transition-all duration-200 cursor-pointer group
        ${
          isDragging
            ? "shadow-lg rotate-2 scale-105 border-blue-300"
            : "border-gray-100 hover:border-gray-200 hover:shadow-md"
        }
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Drag Handle */}
      <div
        className={`p-3 pb-0 ${
          isHovered ? "opacity-100" : "opacity-0"
        } transition-opacity`}
      >
        <GripVertical className="w-4 h-4 text-gray-400 mx-auto cursor-grab active:cursor-grabbing" />
      </div>

      <div className="p-4 pt-2">
        <div className="flex justify-between items-start mb-3">
          <h4 className="font-medium text-gray-800 text-sm leading-tight pr-2 flex-1">
            {task.subject}
          </h4>
          <div className="relative">
            <button
              className={`text-gray-400 hover:text-gray-600 p-1 rounded transition-all duration-200
                ${
                  isHovered
                    ? "opacity-100"
                    : "opacity-0 group-hover:opacity-100"
                }
              `}
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
            <div className="absolute right-0 top-8 hidden group-hover:block bg-white shadow-lg rounded-lg py-1 z-20 border border-gray-200 min-w-32">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(task);
                }}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left transition-colors"
              >
                <Edit2 className="w-3 h-3 inline mr-2" />
                Edit
              </button>
              {hasDeleteAccess && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(task.id);
                  }}
                  className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left transition-colors"
                >
                  <Trash2 className="w-3 h-3 inline mr-2" />
                  Delete
                </button>
              )}
            </div>
          </div>
        </div>

        {task.description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2 leading-relaxed">
            {task.description}
          </p>
        )}

        <div className="space-y-3">
          {/* Priority and Due Date Row */}
          <div className="flex items-center justify-between">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium border ${
                priorityConfig[task.priority].bg
              } ${priorityConfig[task.priority].text} ${
                priorityConfig[task.priority].border
              }`}
            >
              {task.priority}
            </span>

            {task.due_date && (
              <div
                className={`flex items-center text-xs px-2 py-1 rounded-full
                ${
                  isOverdue
                    ? "text-red-600 bg-red-50"
                    : isDueToday
                    ? "text-orange-600 bg-orange-50"
                    : "text-gray-500 bg-gray-50"
                }
              `}
              >
                <Calendar className="w-3 h-3 mr-1" />
                {new Date(task.due_date).toLocaleDateString()}
                {isOverdue && <AlertCircle className="w-3 h-3 ml-1" />}
              </div>
            )}
          </div>

          {/* Assignees and Comments Row */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-3">
              {task.assignees?.length > 0 && (
                <div className="flex items-center">
                  <User className="w-3 h-3 mr-1" />
                  <span>{task.assignees.length}</span>
                </div>
              )}
              {task.comments?.length > 0 && (
                <div className="flex items-center">
                  <MessageCircle className="w-3 h-3 mr-1" />
                  <span>{task.comments.length}</span>
                </div>
              )}
            </div>

            {/* Task completion indicator */}
            <div className="flex items-center">
              {task.completed ? (
                <CheckCircle2 className="w-4 h-4 text-green-500" />
              ) : (
                <Circle className="w-4 h-4 text-gray-400" />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
