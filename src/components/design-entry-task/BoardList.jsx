import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Plus,
  Search,
  Filter,
  Grid3X3,
  List,
  Calendar,
  Users,
  Clock,
  MoreVertical,
  Edit2,
  Trash2,
  Star,
  StarOff,
  ArrowRight,
  Folder,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import Modal from "./Modal";
import BoardForm from "./BoardForm";
import api from "./Api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { BounceLoader } from "react-spinners";

const BoardCard = ({
  board,
  onEdit,
  onDelete,
  onNavigate,
  onToggleFavorite,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return "No date";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-200 group cursor-pointer">
      {/* Card Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1" onClick={() => onNavigate(board.id)}>
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Folder className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-lg group-hover:text-blue-600 transition-colors">
                  {board.name}
                </h3>
                <p className="text-sm text-gray-500">
                  Updated {formatDate(board.updatedAt)}
                </p>
              </div>
            </div>

            {board.description && (
              <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                {board.description}
              </p>
            )}
          </div>

          {/* Actions Dropdown */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowDropdown(!showDropdown);
              }}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {showDropdown && (
              <div className="absolute right-0 top-10 bg-white shadow-lg rounded-lg py-1 z-20 border border-gray-200 min-w-40">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(board);
                    setShowDropdown(false);
                  }}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left transition-colors"
                >
                  <Edit2 className="w-3 h-3 inline mr-2" />
                  Edit board
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(board.id);
                    setShowDropdown(false);
                  }}
                  className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left transition-colors"
                >
                  <Trash2 className="w-3 h-3 inline mr-2" />
                  Delete board
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Members and Status */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1 text-gray-500">
              <Users className="w-4 h-4" />
              <span>{board.members?.length || 0}</span>
            </div>
            <div className="flex items-center space-x-1 text-gray-500">
              <List className="w-4 h-4" />
              <span>{board.columns?.length || 0} columns</span>
            </div>
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div
        className="px-6 py-4 bg-gray-50 rounded-b-xl border-t border-gray-100 group-hover:bg-blue-50 transition-colors"
        onClick={() => onNavigate(board.id)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>Created {formatDate(board.createdAt)}</span>
          </div>
          <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
        </div>
      </div>
    </div>
  );
};

const BoardsList = () => {
  const [boards, setBoards] = useState([]);
  const [filteredBoards, setFilteredBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'
  const [filterBy, setFilterBy] = useState("all"); // 'all', 'favorites', 'recent'
  const [showBoardForm, setShowBoardForm] = useState(false);
  const [editingBoard, setEditingBoard] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    loadBoards();
  }, [token]);

  useEffect(() => {
    filterBoards();
  }, [boards, searchTerm, filterBy]);

  const onNavigateToBoard = (boardId) => {
    navigate("/kanban/board/" + boardId);
  };

  const loadBoards = async () => {
    if (!token) return;

    try {
      setLoading(true);
      const { success, data, error } = await api.getBoards(token);

      if (!success) {
        console.error("Error loading boards:", error);
        toast.error(error);
        // Optional: toast.error(error);
        return;
      }

      setBoards(data); // ✅ only if success
    } catch (error) {
      toast.error(error || "An unexpected error occurred");
      console.error("Unexpected error loading boards:", error);
    } finally {
      setLoading(false);
    }
  };

  // CREATE BOARD
  const handleCreateBoard = async (boardData) => {
    try {
      const { success, data, error } = await api.createBoard(boardData, token);

      if (!success) {
        toast.error(error || "Failed to create board");
        return;
      }

      toast.success("Board created successfully");
      await loadBoards(); // Reload to get updated data
      setShowBoardForm(false);
    } catch (error) {
      console.error("Error creating board:", error);
      toast.error("Unexpected error while creating board");
    }
  };

  // EDIT BOARD
  const handleEditBoard = async (boardData) => {
    try {
      const { success, data, error } = await api.updateBoard(editingBoard.id, boardData, token);

      if (!success) {
        toast.error(error || "Failed to update board");
        return;
      }

      toast.success("Board updated successfully");
      setBoards((prev) =>
        prev.map((board) =>
          board.id === editingBoard.id ? { ...board, ...boardData } : board
        )
      );
      setEditingBoard(null);
    } catch (error) {
      console.error("Error updating board:", error);
      toast.error("Unexpected error while updating board");
    }
  };

  // DELETE BOARD
  const handleDeleteBoard = async (boardId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this board? This action cannot be undone."
      )
    ) {
      try {
        const { success, error } = await api.deleteBoard(boardId, token);

        if (!success) {
          toast.error(error || "Failed to delete board");
          return;
        }

        toast.success("Board deleted successfully");
        setBoards((prev) => prev.filter((board) => board.id !== boardId));
      } catch (error) {
        console.error("Error deleting board:", error);
        toast.error("Unexpected error while deleting board");
      }
    }
  };


  const filterBoards = () => {
    let filtered = [...boards];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (board) =>
          board.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (board.description &&
            board.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredBoards(filtered);
  };

  //   const handleCreateBoard = async (boardData) => {
  //     try {
  //       const newBoard = await api.createBoard(boardData, token);
  //       if (newBoard) {
  //         await loadBoards(); // Reload to get updated data
  //         setShowBoardForm(false);
  //       }
  //     } catch (error) {
  //       console.error("Error creating board:", error);
  //     }
  //   };

  //   const handleEditBoard = async (boardData) => {
  //     try {
  //       const updatedBoard = await api.updateBoard(
  //         editingBoard.id,
  //         boardData,
  //         token
  //       );
  //       if (updatedBoard) {
  //         setBoards((prev) =>
  //           prev.map((board) =>
  //             board.id === editingBoard.id ? { ...board, ...boardData } : board
  //           )
  //         );
  //         setEditingBoard(null);
  //       }
  //     } catch (error) {
  //       console.error("Error updating board:", error);
  //     }
  //   };

  //   const handleDeleteBoard = async (boardId) => {
  //     if (
  //       window.confirm(
  //         "Are you sure you want to delete this board? This action cannot be undone."
  //       )
  //     ) {
  //       try {
  //         const success = await api.deleteBoard(boardId, token);
  //         if (success) {
  //           setBoards((prev) => prev.filter((board) => board.id !== boardId));
  //         }
  //       } catch (error) {
  //         console.error("Error deleting board:", error);
  //       }
  //     }
  //   };

  const handleToggleFavorite = async (boardId, isFavorite) => {
    try {
      const updatedBoard = await api.updateBoard(
        boardId,
        { is_favorite: isFavorite },
        token
      );
      if (updatedBoard) {
        setBoards((prev) =>
          prev.map((board) =>
            board.id === boardId ? { ...board, is_favorite: isFavorite } : board
          )
        );
      }
    } catch (error) {
      console.error("Error updating board favorite status:", error);
    }
  };

  const getTotalStats = () => {
    const totalBoards = boards.length;
    const totalTasks = boards.reduce(
      (sum, board) => sum + (board.tasks?.length || 0),
      0
    );
    const completedTasks = boards.reduce(
      (sum, board) =>
        sum + (board.tasks?.filter((task) => task.completed).length || 0),
      0
    );
    const favoriteBoards = boards.filter((board) => board.is_favorite).length;

    return { totalBoards, totalTasks, completedTasks, favoriteBoards };
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <BounceLoader color="#1e3a8a" />
      </div>
    )
  }

  const stats = getTotalStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-white rounded-lg  border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Design Boards</h1>
              <p className="text-gray-600 mt-1">
                Manage and organize your projects
              </p>
            </div>
            <button
              onClick={() => setShowBoardForm(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center space-x-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Plus className="w-5 h-5" />
              <span>Create Design Board</span>
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Total Design Boards</p>
                  <p className="text-2xl font-bold">{stats.totalBoards}</p>
                </div>
                <Folder className="w-8 h-8 text-blue-200" />
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search design boards..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              />
            </div>

            {/* Controls */}
            <div className="flex items-center space-x-3">
              {/* View Mode Toggle */}
              <div className="flex border border-gray-300 rounded-lg">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 transition-colors ${viewMode === "grid"
                    ? "bg-blue-600 text-white"
                    : "text-gray-400 hover:text-gray-600"
                    }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 transition-colors ${viewMode === "list"
                    ? "bg-blue-600 text-white"
                    : "text-gray-400 hover:text-gray-600"
                    }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Boards Grid/List */}
      <div className="max-w-7xl mx-auto p-6">
        {filteredBoards.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Folder className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              {searchTerm ? "No design boards found" : "No design boards yet"}
            </h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              {searchTerm
                ? "Try adjusting your search terms or filters"
                : "Create your first design board to start organizing your projects and tasks"}
            </p>
            {!searchTerm && (
              <button
                onClick={() => setShowBoardForm(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Your First design Board
              </button>
            )}
          </div>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-4"
            }
          >
            {filteredBoards.map((board) => (
              <BoardCard
                key={board.id}
                board={board}
                onEdit={setEditingBoard}
                onDelete={handleDeleteBoard}
                onNavigate={onNavigateToBoard}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create Board Modal */}
      <Modal
        isOpen={showBoardForm}
        onClose={() => setShowBoardForm(false)}
        title="Create New design Board"
        maxWidth="max-w-lg"
      >
        <BoardForm
          onSave={handleCreateBoard}
          onCancel={() => setShowBoardForm(false)}
        />
      </Modal>

      {/* Edit Board Modal */}
      <Modal
        isOpen={editingBoard !== null}
        onClose={() => setEditingBoard(null)}
        title="Edit Board"
        maxWidth="max-w-lg"
      >
        {editingBoard && (
          <BoardForm
            board={editingBoard}
            onSave={handleEditBoard}
            onCancel={() => setEditingBoard(null)}
          />
        )}
      </Modal>

      {/* Custom Styles */}
      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default BoardsList;
