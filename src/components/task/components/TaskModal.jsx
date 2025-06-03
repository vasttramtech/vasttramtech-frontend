import { useState, useEffect } from "react";
import { apiService } from "../Task";
import { X, MessageSquare, Save } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

const Comment = ({ comment }) => {
  return (
    <div className="p-3 border-b border-gray-200">
      <div className="flex justify-between items-center mb-1">
        <span className="font-semibold text-sm">{comment.author?.email}</span>
        <span className="text-xs text-gray-500">
          {new Date(comment.createdAt).toLocaleString()}
        </span>
      </div>
      <p className="text-sm">{comment.content}</p>
    </div>
  );
};

// Task modal for viewing and editing task details
const TaskModal = ({
  task,
  onClose,
  onUpdate,
  token,
  currentUser,
  users,
  designation,
}) => {
  const [editMode, setEditMode] = useState(false);
  const [taskData, setTaskData] = useState({
    subject: "",
    description: "",
    task_status: "To Do",
    assignees: [],
  });
  const [submit, setsubmit] = useState(false);
  const [commentsubmitting, setCommentSubmitting] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState();
  const [isCreator, setIsCreator] = useState(false);

  useEffect(() => {
    setIsCreator(data?.creator?.email === currentUser?.email);
  }, [data, currentUser]);

  const fetchTaskDetails = async () => {
    try {
      const taskDetails = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/task-by-id/${task.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const sortedComments = taskDetails.data?.comments.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      taskDetails.data.comments = sortedComments;
      setData(taskDetails.data);
      setTaskData((prev) => ({
        subject: taskDetails.data?.subject || "",
        description: taskDetails.data.description || "",
        task_status: taskDetails.data?.task_status || "To Do",
        assignees: taskDetails.data?.assignees?.map((a) => a.id) || [],
      }));
    } catch (error) {
      console.log("Failed to fetch task details", error);
      toast.error(
        error?.response?.data?.error?.message || "Failed to fetch task details"
      );
    }
  };

  useEffect(() => {
    if (!task || !task.id || !token) return;

    fetchTaskDetails();
  }, [task, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAssigneeChange = (e) => {
    const selectedOptions = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setTaskData((prev) => ({ ...prev, assignees: selectedOptions }));
  };

  const handleSave = async () => {
    // setLoading(true);
    setsubmit(true);
    try {
      const response = await apiService.updateTask(token, task.id, taskData);
      if (!response) return;
      if (response.updateData) setData(response.updateData);
      if (response.data) onUpdate(response.data);
      setEditMode(false);
    } catch (error) {
      console.error("Failed to update task");
    } finally {
      // setLoading(false);
      setsubmit(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setCommentSubmitting(true);
    try {
      const updatedTask = await apiService.addComment(
        token,
        task.id,
        newComment
      );
      setNewComment("");
      onUpdate(updatedTask);
      await fetchTaskDetails();
      toast.success("Comment added successfully");
    } catch (error) {
      console.error("Failed to add comment");
    } finally {
      setCommentSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 w-screen">
      <div className="bg-white rounded-lg w-[80%] h-screen overflow-auto">
        <div className="p-4 bg-gray-100 flex justify-between items-center border-b">
          {editMode ? (
            <input
              type="text"
              name="subject"
              value={taskData.subject}
              onChange={handleChange}
              className="font-bold text-xl p-1 border-b-2 border-blue-500 bg-white w-full"
            />
          ) : (
            <h2 className="text-xl font-bold">{task.subject}</h2>
          )}
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4 p-4 overflow-y-auto">
          <div className="col-span-2">
            {/* Task Description */}
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Description</h3>
              {editMode ? (
                <textarea
                  name="description"
                  value={taskData.description}
                  onChange={handleChange}
                  className="w-full border rounded-md p-2 h-32"
                  placeholder="Enter task description..."
                ></textarea>
              ) : (
                <p className="text-gray-700 bg-gray-50 p-3 rounded-md">
                  {data?.description || "No description provided"}
                </p>
              )}
            </div>

            {/* Comments Section */}
            <div className="mt-6">
              <h3 className="font-semibold mb-2 flex items-center">
                <MessageSquare size={16} className="mr-1" /> Comments
              </h3>
              <div className="bg-gray-50 rounded-md mb-3 max-h-96 overflow-y-auto">
                {data && data.comments && data.comments?.length ? (
                  data.comments.map((comment) => (
                    <Comment key={comment.id} comment={comment} />
                  ))
                ) : (
                  <p className="p-3 text-gray-500 text-sm">No comments yet</p>
                )}
              </div>
              <form onSubmit={handleCommentSubmit} className="flex">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-grow border rounded-l-md p-2 text-sm"
                />
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-3 py-2 rounded-r-md"
                  disabled={!newComment.trim() || commentsubmitting}
                >
                  {commentsubmitting ? "Updating" : "Add Comment"}
                </button>
              </form>
            </div>
          </div>

          <div className="col-span-1 bg-gray-50 p-3 rounded-md">
            {/* Status */}
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Status</h3>
              <select
                value={taskData.task_status}
                // onChange={handleStatusChange}
                onChange={handleChange}
                name="task_status"
                className="w-full border rounded-md p-2 bg-white"
                disabled={!editMode}
              >
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Blocked">Blocked</option>
                <option value="Complete">Complete</option>
              </select>
            </div>

            {/* Assignees */}
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Assignees</h3>
              {editMode && isCreator ? (
                <select
                  multiple
                  name="assignees"
                  value={taskData.assignees}
                  onChange={handleAssigneeChange}
                  className="w-full border rounded-md p-2 bg-white max-h-44 overflow-auto"
                >
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.email}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="space-y-1">
                  {data?.assignees?.length ? (
                    data.assignees.map((assignee) => (
                      <div
                        key={assignee.id}
                        className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs inline-block mr-1 mb-1"
                      >
                        {assignee.email}
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">No assignees</p>
                  )}
                </div>
              )}
            </div>

            {/* Creator */}
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Created by</h3>
              <p className="text-sm">{data?.creator?.email || "Unknown"}</p>
            </div>

            {/* Dates */}
            <div className="mb-4">
              <div className="text-xs text-gray-500">
                Created:{" "}
                {data && data.createdAt
                  ? new Date(data.createdAt).toLocaleDateString()
                  : "Unknown"}
              </div>
              <div className="text-xs text-gray-500">
                Updated:{" "}
                {data && data.updatedAt
                  ? new Date(data?.updatedAt).toLocaleDateString()
                  : "Unknown"}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6">
              {!editMode && (isCreator || designation === "Admin") && (
                <button
                  onClick={() => setEditMode(true)}
                  className="bg-blue-500 text-white w-full py-2 rounded-md hover:bg-blue-600"
                >
                  Edit Task
                </button>
              )}
              {editMode && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => setEditMode(false)}
                    className="bg-gray-300 text-gray-700 flex-1 py-2 rounded-md hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="bg-blue-500 text-white flex-1 py-2 rounded-md hover:bg-blue-600 flex justify-center items-center"
                    disabled={submit}
                  >
                    {submit ? (
                      "Saving..."
                    ) : (
                      <>
                        <Save size={16} className="mr-1" /> Save
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
