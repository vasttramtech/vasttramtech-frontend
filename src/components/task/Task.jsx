import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Users,
  BarChart,
  ChevronDown,
  Plus,
  X,
} from "lucide-react";
import { useSelector } from "react-redux";
import axios from "axios";
import KanbanBoard from "./components/KanbanBoard";
import TaskModal from "./components/TaskModal";
import { toast } from "react-toastify";
import { BounceLoader } from "react-spinners";
import AssigneeFilter from "./components/AssigneeFilter";

// API Service
export const apiService = {
  // Base headers with auth token
  getHeaders: (token) => ({
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  }),

  // Get all tasks for current user
  getTasks: async (token) => {
    if (!token) {
      return;
    }
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/tasks`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error(
        error?.response?.data?.error?.message || "Failed to fetch Task"
      );
    }
  },

  // Create new task
  createTask: async (token, taskData) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/tasks`,
        { data: taskData },
        apiService.getHeaders(token)
      );
      toast.success("Task created successfully");
      return response.data;
    } catch (error) {
      console.error("Error creating task:", error);
      toast.error(
        error?.response?.data?.error?.message || "Failed to create task"
      );
    }
  },

  // Update task
  updateTask: async (token, taskId, taskData) => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/tasks/${taskId}`,
        { data: taskData },
        apiService.getHeaders(token)
      );
      toast.success("Task updated successfully");
      return response.data;
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error(error?.response?.data?.error?.message || "Failed to update");
    }
  },

  // Add comment to task
  addComment: async (token, taskId, content) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/tasks/${taskId}/comments`,
        { content },
        apiService.getHeaders(token)
      );
      return response.data;
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error(
        error?.response?.data?.error?.message || "Failed to add Comment"
      );
    }
  },

  // Get users for assignment
  getUsers: async (token) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/users`,
        apiService.getHeaders(token)
      );
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  },
};

// Create task modal
const CreateTaskModal = ({
  onClose,
  onTaskCreate,
  token,
  currentUser,
  users,
}) => {
  useEffect(() => {
    if (!currentUser || !currentUser.email) {
      toast.error("Please login first");
      onClose();
    }
  }, [currentUser]);
  const [formData, setFormData] = useState({
    subject: "",
    description: "",
    assignees: [],
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAssigneeChange = (e) => {
    const selectedOptions = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setFormData((prev) => ({ ...prev, assignees: selectedOptions }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.subject.trim()) {
      alert("Subject is required");
      return;
    }

    setLoading(true);
    try {
      const newTask = await apiService.createTask(token, formData);
      onTaskCreate(newTask);
      onClose();
    } catch (error) {
      console.error("Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-lg">
        <div className="p-4 bg-gray-100 flex justify-between items-center border-b">
          <h2 className="text-xl font-bold">Create New Task</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        {loading && (
          <div className="inset-0 flex justify-center items-center bg-opacity-50 bg-gray-200 z-10">
            <BounceLoader size={100} color={"#1e3a8a"} />
          </div>
        )}

        {!loading && (
          <form onSubmit={handleSubmit} className="p-4">
            <div className="mb-4">
              <label className="block text-gray-700 mb-2 font-medium">
                Subject *
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full border rounded-md p-2"
                placeholder="Enter subject"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2 font-medium">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full border rounded-md p-2 h-32"
                placeholder="Enter description"
              ></textarea>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2 font-medium">
                Assignees
              </label>
              <select
                multiple
                name="assignees"
                value={formData.assignees}
                onChange={handleAssigneeChange}
                className="w-full border rounded-md p-2 h-32"
              >
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user?.email}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Hold Ctrl/Cmd to select multiple
              </p>
            </div>

            <div className="flex justify-end space-x-2 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Task"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

const SearchBar = ({ value, onSearch }) => {
  return (
    <div className="flex gap-3">
      <input
        type="text"
        placeholder="Search tasks..."
        value={value}
        onChange={(e) => onSearch(e.target.value)}
        className="bg-gray-200 p-2 rounded-xl shadow border-gray-400 border-[1px] w-64"
      />
      <div className="flex space-x-2">
        <button className="bg-blue-500 p-3 rounded-xl flex justify-center items-center">
          <Search size={18} className="text-white" />
        </button>
        <button className="bg-blue-500 p-3 rounded-xl flex justify-center items-center">
          <Filter size={18} className="text-white" />
        </button>
      </div>
    </div>
  );
};

const Task = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedAssignee, setSelectedAssignee] = useState(""); // New state for selected assignee

  // Get auth token from Redux store
  const { token, email, designation } = useSelector((state) => state.auth);
  const currentUser = { email }; // Mock user object with email

  useEffect(() => {
    // Fetch tasks when component mounts
    if (token && currentUser) {
      fetchTasks();
      fetchUsers();
    }
  }, [token]);

  useEffect(() => {
    // Filter tasks when search term or selected assignee changes
    let filtered = [...tasks];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter((task) =>
        task.subject.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply assignee filter
    if (selectedAssignee) {
      filtered = filtered.filter((task) =>
        task.assignees.some((assignee) => assignee?.email === selectedAssignee)
      );
    }

    setFilteredTasks(filtered);
  }, [tasks, searchTerm, selectedAssignee]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const data = await apiService.getTasks(token);
      setTasks(data);
      setFilteredTasks(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleAssigneeSelect = (email) => {
    setSelectedAssignee(email);
  };

  const fetchUsers = async () => {
    try {
      const usersData = await apiService.getUsers(token);
      // const data = usersData
      //   ? usersData.filter((user) => user.email !== currentUser.email)
      //   : [];
      setUsers(usersData);
    } catch (error) {
      console.error("Failed to fetch users", error);
    }
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
  };

  const handleCreateTask = (newTask) => {
    setTasks((prev) => [newTask, ...prev]);
  };

  const handleTaskUpdate = (updatedTask) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
    setSelectedTask(updatedTask);
  };

  return (
    <>
      <h1 className="text-3xl pt-8">Task Management</h1>

      {/* Search and Action Bar */}
      <div className="flex justify-between items-center pt-6">
        <div className="flex gap-3 items-center">
          <SearchBar value={searchTerm} onSearch={handleSearch} />

          {designation === "Admin" && (
            <AssigneeFilter
              users={users}
              onSelect={handleAssigneeSelect}
              selectedAssignee={selectedAssignee}
            />
          )}
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-blue-800 text-white p-2 rounded-xl flex items-center gap-1 mr-4"
        >
          <Plus size={18} /> New Task
        </button>
      </div>

      {/* Loading, Error, and Board States */}
      {loading && <div className="text-center p-10">Loading tasks...</div>}

      {error && !loading && (
        <div className="text-center p-10 text-red-500">{error}</div>
      )}

      {!loading && !error && (
        <KanbanBoard
          tasks={filteredTasks}
          onTaskClick={handleTaskClick}
          onAddClick={() => setIsCreateModalOpen(true)}
          designation={designation}
        />
      )}

      {/* Task Detail Modal */}
      {selectedTask && (
        <TaskModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdate={handleTaskUpdate}
          token={token}
          currentUser={currentUser}
          users={users}
          designation={designation}
        />
      )}

      {/* Create Task Modal */}
      {isCreateModalOpen && (
        <CreateTaskModal
          onClose={() => setIsCreateModalOpen(false)}
          onTaskCreate={handleCreateTask}
          token={token}
          currentUser={currentUser}
          users={users}
        />
      )}
    </>
  );
};

export default Task;
