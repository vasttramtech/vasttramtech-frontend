import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import {
  Plus,
  MoreHorizontal,
  Edit2,
  Trash2,
  X,
  Calendar,
  User,
  MessageCircle,
  CheckCircle2,
  Circle,
  AlertCircle,
  ChevronDown,
  Users,
  Search,
  Filter,
  Clock,
  GripVertical,
} from "lucide-react";
import Modal from "./Modal";
import TaskCard from "./TaskCard";
import TaskForm from "./TaskForm";
import BoardForm from "./BoardForm";
import api from "./Api";
import { useNavigate, useParams } from "react-router-dom";
import BoardSettingsModal from "./BoardSettingModal";
import { toast } from "react-toastify";

const Column = ({
  column,
  tasks,
  onAddTask,
  onEditColumn,
  onDeleteColumn,
  onTaskEdit,
  onTaskDelete,
  token,
  creator,
  email,
  hasDeleteAccess,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [columnName, setColumnName] = useState(column.name);
  const [showAddTask, setShowAddTask] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleSaveColumn = async () => {
    if (columnName.trim() && columnName !== column.name) {
      await onEditColumn(column.id, { name: columnName.trim() });
    }
    setIsEditing(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSaveColumn();
    } else if (e.key === "Escape") {
      setColumnName(column.name);
      setIsEditing(false);
    }
  };

  const completedTasks = tasks.filter((task) => task.completed).length;
  const totalTasks = tasks?.length;

  return (
    <div
      className={`bg-gray-50 rounded-xl border border-gray-200 transition-all duration-300
      ${isCollapsed ? "w-16" : "min-w-80 max-w-80"}
    `}
    >
      {/* Column Header */}
      <div className="p-4 border-b border-gray-200 bg-white rounded-t-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 flex-1">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="text-gray-400 hover:text-gray-600 p-1 rounded transition-colors"
            >
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  isCollapsed ? "-rotate-90" : ""
                }`}
              />
            </button>

            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: column.color || "#6B7280" }}
            />

            {!isCollapsed && (
              <>
                {isEditing ? (
                  <input
                    type="text"
                    value={columnName}
                    onChange={(e) => setColumnName(e.target.value)}
                    onBlur={handleSaveColumn}
                    onKeyDown={handleKeyPress}
                    className="bg-white border border-blue-300 rounded-lg px-3 py-1 text-sm font-medium text-gray-800 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoFocus
                  />
                ) : (
                  <h3
                    className="font-semibold text-gray-800 cursor-pointer hover:text-blue-600 transition-colors"
                    onClick={() => setIsEditing(true)}
                  >
                    {column.name}
                  </h3>
                )}

                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full font-medium">
                    {tasks.length}
                  </span>
                  {totalTasks > 0 && (
                    <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full font-medium">
                      {completedTasks}/{totalTasks}
                    </span>
                  )}
                </div>
              </>
            )}
          </div>

          {!isCollapsed && (
            <div className="relative group">
              <button className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors">
                <MoreHorizontal className="w-4 h-4" />
              </button>
              <div className="absolute right-0 top-8 hidden group-hover:block bg-white shadow-lg rounded-lg py-1 z-10 border border-gray-200 min-w-36">
                <button
                  onClick={() => setIsEditing(true)}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left transition-colors"
                >
                  <Edit2 className="w-3 h-3 inline mr-2" />
                  Rename
                </button>
                <button
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left transition-colors"
                >
                  <ChevronDown className="w-3 h-3 inline mr-2" />
                  {isCollapsed ? "Expand" : "Collapse"}
                </button>
                {!column.is_system && hasDeleteAccess && (
                  <button
                    onClick={() => onDeleteColumn(column.id)}
                    className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left transition-colors"
                  >
                    <Trash2 className="w-3 h-3 inline mr-2" />
                    Delete
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        {!isCollapsed && totalTasks > 0 && (
          <div className="mt-3">
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div
                className="bg-green-500 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${(completedTasks / totalTasks) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Column Content */}
      {!isCollapsed && (
        <div className="p-4">
          {/* Tasks */}
          <div className="space-y-3 mb-4 max-h-96 overflow-y-auto custom-scrollbar">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={onTaskEdit}
                onDelete={onTaskDelete}
                hasDeleteAccess={hasDeleteAccess}
              />
            ))}
          </div>

          {/* Add Task Button */}
          <button
            onClick={() => setShowAddTask(true)}
            className="w-full text-left text-gray-500 hover:text-blue-600 hover:bg-white rounded-xl p-4 transition-all duration-200 border-2 border-dashed border-gray-300 hover:border-blue-300 group"
          >
            <Plus className="w-4 h-4 inline mr-2 group-hover:scale-110 transition-transform" />
            Add a task
          </button>

          {/* Inline Task Form */}
          {showAddTask && (
            <TaskForm
              columnId={column.id}
              onSave={onAddTask}
              onCancel={() => setShowAddTask(false)}
            />
          )}
        </div>
      )}
    </div>
  );
};

// Enhanced Board Header Component
const BoardHeader = ({
  board,
  onEditBoard,
  onAddColumn,
  onOpenSettings,
  creator,
  email,
  hasDeleteAccess,
}) => {
  const [showAddColumn, setShowAddColumn] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [columnName, setColumnName] = useState("");
  const [columnColor, setColumnColor] = useState("#3B82F6");
  // const {email}=useSelector((state) => state.fetchData);
  // console.log(email,creator)

  const handleAddColumn = async (e) => {
    e.preventDefault();
    if (columnName.trim()) {
      await onAddColumn({
        name: columnName.trim(),
        color: columnColor,
        board_id: board.id,
      });
      setColumnName("");
      setColumnColor("#3B82F6");
      setShowAddColumn(false);
    }
  };

  const colorOptions = [
    { color: "#3B82F6", name: "Blue" },
    { color: "#10B981", name: "Green" },
    { color: "#F59E0B", name: "Amber" },
    { color: "#EF4444", name: "Red" },
    { color: "#8B5CF6", name: "Purple" },
    { color: "#EC4899", name: "Pink" },
    { color: "#6B7280", name: "Gray" },
    { color: "#06B6D4", name: "Cyan" },
  ];

  return (
    <>
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-4 mb-2">
                <h1 className="text-2xl font-bold text-gray-800">
                  {board?.name}
                </h1>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Users className="w-4 h-4" />
                  <span>{board?.members?.length || 0} members</span>
                </div>
              </div>
              {board?.description && (
                <p className="text-gray-600 text-sm">{board.description}</p>
              )}
            </div>

            {/* changesmade */}
            <div className="flex items-center space-x-3">
              {/* Search Toggle
              <button
                onClick={() => setShowSearch(!showSearch)}
                className={`p-2 rounded-lg transition-colors ${
                  showSearch
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Search className="w-5 h-5" />
              </button>

              Filter Button 
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <Filter className="w-5 h-5" />
              </button> */}

              {/* Settings Button - ADD THIS */}
              {hasDeleteAccess && (
                <button
                  onClick={onOpenSettings}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Board Settings"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
              )}

              {/* Add Column Button */}
              <button
                onClick={() => setShowAddColumn(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <Plus className="w-4 h-4" />
                <span>Add Column</span>
              </button>
            </div>
            {/* changesmade */}
          </div>

          {/* Search Bar */}
          {showSearch && (
            <div className="mt-4 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Column Modal */}
      <Modal
        isOpen={showAddColumn}
        onClose={() => setShowAddColumn(false)}
        title="Add New Column"
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleAddColumn} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Column Name
            </label>
            <input
              type="text"
              value={columnName}
              onChange={(e) => setColumnName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              placeholder="Enter column name..."
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Choose Color
            </label>
            <div className="grid grid-cols-4 gap-3">
              {colorOptions.map(({ color, name }) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setColumnColor(color)}
                  className={`flex items-center space-x-2 p-3 rounded-lg border-2 transition-all hover:scale-105 ${
                    columnColor === color
                      ? "border-gray-800 bg-gray-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-xs font-medium text-gray-700">
                    {name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setShowAddColumn(false)}
              className="px-6 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleAddColumn}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              Add Column
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};

const KanbanBoard = () => {
  const [boards, setBoards] = useState([]);
  const [currentBoard, setCurrentBoard] = useState(null);
  const [columns, setColumns] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBoardSettings, setShowBoardSettings] = useState(false);
  const [showBoardForm, setShowBoardForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const { token } = useSelector((state) => state.auth);
  const { id } = useParams();
  const navigate = useNavigate();
  const [creator, setCreator] = useState(null);
  const { email, designation } = useSelector((state) => state.auth);
  const [hasDeleteAccess, setHasDeleteAccess] = useState(false);

  useEffect(() => {
    if (designation === "Admin" || (email && email === creator.email)) {
      setHasDeleteAccess(true);
    } else {
      setHasDeleteAccess(false);
    }
  }, [email, designation, creator]);

  useEffect(() => {
    if (!id) navigate("/kanban");
  }, [id]);

  // useEffect(() => {
  //   const loadBoardData = async () => {
  //     if (!token) return;

  //     try {
  //       setLoading(true);

  //       // Get all boards
  //       const boardsData = await api.getBoard(id, token);
  //       setBoards(boardsData);
  //       const firstBoard = boardsData;

  //       // Set first board as current or handle empty state
  //       // if (boardsData && boardsData.length > 0) {
  //       // const firstBoard = boardsData[0];
  //       setCurrentBoard(boardsData);

  //       // Get detailed board data
  //       const boardDetails = await api.getBoard(firstBoard.id, token);
  //       if (boardDetails) {
  //         setCurrentBoard(boardDetails);

  //         // Set columns and tasks from board details
  //         if (boardDetails.columns) {
  //           setColumns(boardDetails.columns);
  //           //   console.log(boardDetails.columns)
  //           const allTasks = boardDetails.columns
  //             .map((col) => {
  //               if (!col.tasks) return null;

  //               // Convert to array if tasks is a single object
  //               return {
  //                 ...col.tasks,
  //                 column: col.id, // Add column reference to task
  //               };
  //             })
  //             .filter(Boolean); // Removes nulls

  //           setTasks(allTasks);
  //         }
  //         if (boardDetails.tasks) {
  //           setTasks(boardDetails.tasks);
  //         }
  //       }
  //       // }
  //     } catch (error) {
  //       console.error("Error loading board data:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   loadBoardData();
  // }, [token]);

  const loadBoardData = async () => {
    if (!token) return;

    try {
      setLoading(true);

      // Fetch the board using ID
      const {
        success,
        data: boardDetails,
        error,
      } = await api.getBoard(id, token);

      if (!success || !boardDetails) {
        toast.error(error || "Failed to load board");
        return;
      }

      setBoards(boardDetails); // if you're showing current board in a list or breadcrumb
      setCurrentBoard(boardDetails);
      setCreator(boardDetails.creator[0]);

      // Set columns and tasks from board details
      if (boardDetails.columns) {
        setColumns(boardDetails?.columns);

        const allTasks = boardDetails.columns
          .map((col) => {
            if (!col.tasks) return null;
            return {
              ...col.tasks,
              column: col.id,
            };
          })
          .filter(Boolean); // Removes nulls

        setTasks(allTasks);
      }

      if (boardDetails.tasks) {
        setTasks(boardDetails.tasks);
      }
    } catch (err) {
      console.error("Error loading board data:", err);
      toast.error("Unexpected error while loading board data");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadBoardData();
  }, [token, id]);

  // const handleAddColumn = async (columnData) => {
  //   try {
  //     const newColumn = await api.createColumn(
  //       {
  //         ...columnData,
  //         position: columns.length,
  //       },
  //       token
  //     );

  //     if (newColumn) {
  //       setColumns((prev) => [...prev, newColumn]);
  //     }
  //   } catch (error) {
  //     console.error("Error adding column:", error);
  //     // You might want to show a toast notification here
  //   }
  // };

  // const handleEditColumn = async (columnId, data) => {
  //   try {
  //     const updatedColumn = await api.updateColumn(columnId, data, token);
  //     if (updatedColumn) {
  //       setColumns((prev) =>
  //         prev.map((col) => (col.id === columnId ? { ...col, ...data } : col))
  //       );
  //     }
  //   } catch (error) {
  //     console.error("Error updating column:", error);
  //     // You might want to show a toast notification here
  //   }
  // };

  // const handleDeleteColumn = async (columnId) => {
  //   if (
  //     window.confirm(
  //       "Are you sure you want to delete this column? All tasks will be moved to the first column."
  //     )
  //   ) {
  //     try {
  //       const success = await api.deleteColumn(columnId, token);
  //       if (success) {
  //         setColumns((prev) => prev.filter((col) => col.id !== columnId));
  //         // Move tasks to first column
  //         setTasks((prev) =>
  //           prev.map((task) =>
  //             task.column === columnId
  //               ? { ...task, column: columns[0]?.id }
  //               : task
  //           )
  //         );
  //       }
  //     } catch (error) {
  //       console.error("Error deleting column:", error);
  //     }
  //   }
  // };

  // const handleAddTask = async (taskData, columnId) => {
  //   try {
  //     const newTask = await api.createTask(
  //       {
  //         ...taskData,
  //         board_id: currentBoard.id,
  //         column_id: columnId,
  //       },
  //       token
  //     );

  //     if (newTask) {
  //       setTasks((prev) => [...prev, { ...newTask, column: columnId }]);
  //     }
  //   } catch (error) {
  //     console.error("Error adding task:", error);
  //   }
  // };

  // const handleUpdateTask = async (taskData) => {
  //   try {
  //     const updatedTask = await api.updateTask(editingTask.id, taskData, token);
  //     if (updatedTask) {
  //       setTasks((prev) =>
  //         prev.map((task) =>
  //           task.id === editingTask.id ? { ...task, ...taskData } : task
  //         )
  //       );
  //       setEditingTask(null);
  //     }
  //   } catch (error) {
  //     console.error("Error updating task:", error);
  //   }
  // };

  // const handleEditTask = (task) => {
  //   setEditingTask(task);
  // };

  // const handleDeleteTask = async (taskId) => {
  //   if (window.confirm("Are you sure you want to delete this task?")) {
  //     try {
  //       const success = await api.deleteTask(taskId, token);
  //       if (success) {
  //         setTasks((prev) => prev.filter((task) => task.id !== taskId));
  //       }
  //     } catch (error) {
  //       console.error("Error deleting task:", error);
  //     }
  //   }
  // };

  // // Add this function inside the KanbanBoard component, before the return statement
  // const handleCreateBoard = async (boardData) => {
  //   try {
  //     const newBoard = await api.createBoard(boardData, token);
  //     if (newBoard) {
  //       setBoards((prev) => [...prev, newBoard]);
  //       setCurrentBoard(newBoard);
  //       setColumns([]);
  //       setTasks([]);
  //       setShowBoardForm(false);

  //       // Create default columns for new board
  //       const defaultColumns = [
  //         { name: "To Do", color: "#3B82F6", position: 0 },
  //         { name: "In Progress", color: "#F59E0B", position: 1 },
  //         { name: "Done", color: "#10B981", position: 2 },
  //       ];

  //       for (const columnData of defaultColumns) {
  //         await handleAddColumn({
  //           ...columnData,
  //           board_id: newBoard.id,
  //         });
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Error creating board:", error);
  //   }
  // };

  // // Add this function in your KanbanBoard component
  // const handleUpdateBoard = async (boardId, data) => {
  //   try {
  //     const updatedBoard = await api.updateBoard(boardId, data, token);
  //     if (updatedBoard) {
  //       setCurrentBoard((prev) => ({ ...prev, ...data }));
  //       return true;
  //     }
  //     return false;
  //   } catch (error) {
  //     console.error("Error updating board:", error);
  //     return false;
  //   }
  // };

  const handleAddColumn = async (columnData) => {
    try {
      const { success, data, error } = await api.createColumn(
        {
          ...columnData,
          position: columns.length,
        },
        token
      );

      if (!success) return toast.error(error || "Failed to add column");
      toast.success("Column added");
      setColumns((prev) => [...prev, data]);
    } catch (error) {
      console.error("Error adding column:", error);
      toast.error("Unexpected error while adding column");
    }
  };

  const handleEditColumn = async (columnId, data) => {
    try {
      const { success, error } = await api.updateColumn(columnId, data, token);
      if (!success) return toast.error(error || "Failed to update column");
      toast.success("Column updated");

      setColumns((prev) =>
        prev.map((col) => (col.id === columnId ? { ...col, ...data } : col))
      );
    } catch (error) {
      console.error("Error updating column:", error);
      toast.error("Unexpected error while updating column");
    }
  };

  const handleDeleteColumn = async (columnId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this column? All tasks will be moved to the first column."
      )
    ) {
      try {
        const { success, error } = await api.deleteColumn(columnId, token);
        if (!success) return toast.error(error || "Failed to delete column");

        toast.success("Column deleted");

        setColumns((prev) => prev.filter((col) => col.id !== columnId));
        setTasks((prev) =>
          prev.map((task) =>
            task.column === columnId
              ? { ...task, column: columns[0]?.id }
              : task
          )
        );
      } catch (error) {
        console.error("Error deleting column:", error);
        toast.error("Unexpected error while deleting column");
      }
    }
  };

  const handleAddTask = async (taskData, columnId) => {
    try {
      const { success, data, error } = await api.createTask(
        {
          ...taskData,
          board_id: currentBoard.id,
          column_id: columnId,
        },
        token
      );

      if (!success) return toast.error(error || "Failed to add task");
      toast.success("Task added");
      setTasks((prev) => [...prev, { ...data, column: columnId }]);
    } catch (error) {
      console.error("Error adding task:", error);
      toast.error("Unexpected error while adding task");
    }
  };

  const handleUpdateTask = async (taskData) => {
    try {
      const { success, error } = await api.updateTask(
        editingTask.id,
        taskData,
        token
      );

      if (!success) return toast.error(error || "Failed to update task");
      toast.success("Task updated");

      setTasks((prev) =>
        prev.map((task) =>
          task.id === editingTask.id ? { ...task, ...taskData } : task
        )
      );
      setEditingTask(null);
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Unexpected error while updating task");
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        const { success, error } = await api.deleteTask(taskId, token);
        if (!success) return toast.error(error || "Failed to delete task");

        toast.success("Task deleted");
        setTasks((prev) => prev.filter((task) => task.id !== taskId));
      } catch (error) {
        console.error("Error deleting task:", error);
        toast.error("Unexpected error while deleting task");
      }
    }
  };

  const handleCreateBoard = async (boardData) => {
    try {
      const {
        success,
        data: newBoard,
        error,
      } = await api.createBoard(boardData, token);

      if (!success) return toast.error(error || "Failed to create board");

      toast.success("Board created");

      setBoards((prev) => [...prev, newBoard]);
      setCurrentBoard(newBoard);
      setColumns([]);
      setTasks([]);
      setShowBoardForm(false);

      const defaultColumns = [
        { name: "To Do", color: "#3B82F6", position: 0 },
        { name: "In Progress", color: "#F59E0B", position: 1 },
        { name: "Done", color: "#10B981", position: 2 },
      ];

      for (const columnData of defaultColumns) {
        await handleAddColumn({
          ...columnData,
          board_id: newBoard.id,
        });
      }
    } catch (error) {
      console.error("Error creating board:", error);
      toast.error("Unexpected error while creating board");
    }
  };

  // console.log(currentBoard);

  const handleUpdateBoard = async (boardId, data) => {
    try {
      const { success, error } = await api.updateBoard(boardId, data, token);
      if (!success) {
        toast.error(error || "Failed to update board");
        return false;
      }

      toast.success("Board updated");
      // setCurrentBoard((prev) => ({ ...prev, ...data }));
      await loadBoardData();
      return true;
    } catch (error) {
      console.error("Error updating board:", error);
      toast.error("Unexpected error while updating board");
      return false;
    }
  };
  const getTasksForColumn = (columnId) => {
    return tasks.filter((task) => task.column == columnId);
  };

  const getColumnStats = () => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((task) => task.completed).length;
    const overdueTasks = tasks.filter(
      (task) =>
        task.due_date && new Date(task.due_date) < new Date() && !task.completed
    ).length;

    return { totalTasks, completedTasks, overdueTasks };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto"></div>
          <p className="mt-6 text-gray-600 text-lg">Loading your board...</p>
          <p className="text-gray-500 text-sm">Setting up your workspace</p>
        </div>
      </div>
    );
  }

  if (!currentBoard) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Plus className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Welcome to Your Kanban Board
            </h2>
            <p className="text-gray-600 mb-6">
              Create your first board to start organizing your projects and
              tasks efficiently.
            </p>
            <button
              onClick={() => setShowBoardForm(true)}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Create New Board
            </button>
          </div>
        </div>

        {/* Move the Board Form Modal here so it's always rendered */}
        <Modal
          isOpen={showBoardForm}
          onClose={() => setShowBoardForm(false)}
          title="Create New Board"
          maxWidth="max-w-lg"
        >
          <BoardForm
            onSave={handleCreateBoard}
            onCancel={() => setShowBoardForm(false)}
          />
        </Modal>
      </div>
    );
  }

  const stats = getColumnStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <BoardHeader
        board={currentBoard}
        onEditBoard={() => {}}
        onAddColumn={handleAddColumn}
        onOpenSettings={() => setShowBoardSettings(true)}
        creator={creator}
        email={email}
        hasDeleteAccess={hasDeleteAccess}
      />

      {/* Board Stats */}
      <div className="px-6 py-4 bg-white border-b border-gray-200">
        <div className="flex items-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-gray-600">
              Total Tasks: <strong>{stats.totalTasks}</strong>
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-600">
              Completed: <strong>{stats.completedTasks}</strong>
            </span>
          </div>
          {stats.overdueTasks > 0 && (
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-red-600">
                Overdue: <strong>{stats.overdueTasks}</strong>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Board Content */}
      <div className="p-6 overflow-x-auto">
        <div
          className="flex space-x-6 pb-6"
          style={{ minWidth: "max-content" }}
        >
          {columns
            .sort((a, b) => a.position - b.position)
            .map((column) => (
              <Column
                key={column.id}
                column={column}
                tasks={getTasksForColumn(column.id)}
                onAddTask={handleAddTask}
                onEditColumn={handleEditColumn}
                onDeleteColumn={handleDeleteColumn}
                onTaskEdit={handleEditTask}
                onTaskDelete={handleDeleteTask}
                email={email}
                creator={creator}
                hasDeleteAccess={hasDeleteAccess}
              />
            ))}
        </div>
      </div>

      {/* Edit Task Modal */}
      <Modal
        isOpen={editingTask !== null}
        onClose={() => setEditingTask(null)}
        title="Edit Task"
        maxWidth="max-w-2xl"
      >
        {editingTask && (
          <TaskForm
            task={editingTask}
            columnId={editingTask.column}
            onSave={handleUpdateTask}
            onCancel={() => setEditingTask(null)}
          />
        )}
      </Modal>

      <Modal
        isOpen={showBoardForm}
        onClose={() => setShowBoardForm(false)}
        title="Create New Board"
        maxWidth="max-w-lg"
      >
        {showBoardForm && (
          <BoardForm
            onSave={handleCreateBoard}
            onCancel={() => setShowBoardForm(false)}
          />
        )}
      </Modal>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
      <BoardSettingsModal
        isOpen={showBoardSettings}
        onClose={() => setShowBoardSettings(false)}
        board={currentBoard}
        onUpdateBoard={handleUpdateBoard}
        token={token}
      />
    </div>
  );
};

export default KanbanBoard;
