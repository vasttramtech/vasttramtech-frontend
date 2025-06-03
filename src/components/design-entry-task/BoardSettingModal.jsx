import React, { useState, useEffect } from "react";
import {
  X,
  Plus,
  Trash2,
  Users,
  Edit2,
  Save,
  User,
  Mail,
  Crown,
  Search,
  Check,
} from "lucide-react";
import Modal from "./Modal";
import { useSelector } from "react-redux";

const BoardSettingsModal = ({
  isOpen,
  onClose,
  board,
  onUpdateBoard,
  token,
}) => {
  const [activeTab, setActiveTab] = useState("general");
  const [boardName, setBoardName] = useState(board?.name || "");
  const [boardDescription, setBoardDescription] = useState(
    board?.description || ""
  );
  const [members, setMembers] = useState(board?.members || []);
  const [loading, setLoading] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState(new Set());
  const { userList } = useSelector((state) => state.fetchData);

  useEffect(() => {
    if (board) {
      setBoardName(board.name || "");
      setBoardDescription(board.description || "");
      setMembers(board.members || []);
    }
  }, [board]);

  const handleSaveBoardInfo = async () => {
    if (!boardName.trim()) return;

    setLoading(true);
    try {
      const success = await onUpdateBoard(board.id, {
        name: boardName.trim(),
        description: boardDescription.trim(),
      });

      if (success) {
        setIsEditingName(false);
        setIsEditingDescription(false);
      }
    } catch (error) {
      console.error("Error updating board:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSelectedMembers = async () => {
    if (selectedUsers.size === 0) return;

    setLoading(true);
    try {
      // Get member IDs from selected users
      const memberIds = [...members.map(m => m.id), ...Array.from(selectedUsers)];
      
      const success = await onUpdateBoard(board.id, {
        name: boardName,
        description: boardDescription,
        members: memberIds,
      });

      if (success) {
        // Update local members state
        const newMembers = userList.filter(user => selectedUsers.has(user.id));
        setMembers([...members, ...newMembers]);
        setSelectedUsers(new Set());
        setSearchTerm("");
      }
    } catch (error) {
      console.error("Error adding members:", error);
      alert("Failed to add members. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (
      window.confirm(
        "Are you sure you want to remove this member from the board?"
      )
    ) {
      setLoading(true);
      try {
        const updatedMemberIds = members
          .filter(member => member.id !== memberId)
          .map(member => member.id);

        const success = await onUpdateBoard(board.id, {
          name: boardName,
          description: boardDescription,
          members: updatedMemberIds,
        });

        if (success) {
          setMembers(members.filter((member) => member.id !== memberId));
        }
      } catch (error) {
        console.error("Error removing member:", error);
        alert("Failed to remove member. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const isCreator = (member) => {
    return board?.creator?.some((creator) => creator.id === member.id);
  };

  const toggleUserSelection = (userId) => {
    const newSelection = new Set(selectedUsers);
    if (newSelection.has(userId)) {
      newSelection.delete(userId);
    } else {
      newSelection.add(userId);
    }
    setSelectedUsers(newSelection);
  };

  const filteredUsers = userList?.filter(user => {
    const matchesSearch =( user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.designation.toLowerCase().includes(searchTerm.toLowerCase()))&& user.designation !== "Admin";
    const notAlreadyMember = !members.some(member => member.id === user.id);
    return matchesSearch && notAlreadyMember;
  }) || [];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Design Board Settings"
      maxWidth="max-w-4xl"
    >
      <div className="flex h-[500px]">
        {/* Sidebar */}
        <div className="w-48 bg-gray-50 rounded-l-lg border-r border-gray-200">
          <div className="p-4 space-y-2">
            <button
              onClick={() => setActiveTab("general")}
              className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                activeTab === "general"
                  ? "bg-blue-100 text-blue-700 font-medium"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Edit2 className="w-4 h-4 inline mr-2" />
              General
            </button>
            <button
              onClick={() => setActiveTab("members")}
              className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                activeTab === "members"
                  ? "bg-blue-100 text-blue-700 font-medium"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Users className="w-4 h-4 inline mr-2" />
              Members ({members.length})
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {activeTab === "general" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Design Board Information
                </h3>

                {/* Board Name */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Design Board Name
                  </label>
                  <div className="flex items-center space-x-2">
                    {isEditingName ? (
                      <>
                        <input
                          type="text"
                          value={boardName}
                          onChange={(e) => setBoardName(e.target.value)}
                          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          autoFocus
                        />
                        <button
                          onClick={handleSaveBoardInfo}
                          disabled={loading}
                          className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                        >
                          <Save className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setBoardName(board.name);
                            setIsEditingName(false);
                          }}
                          className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <span className="flex-1 text-gray-800">
                          {boardName}
                        </span>
                        <button
                          onClick={() => setIsEditingName(true)}
                          className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Board Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <div className="flex items-start space-x-2">
                    {isEditingDescription ? (
                      <>
                        <textarea
                          value={boardDescription}
                          onChange={(e) => setBoardDescription(e.target.value)}
                          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-20"
                          placeholder="Add a description for your Design board..."
                          autoFocus
                        />
                        <div className="flex flex-col space-y-1">
                          <button
                            onClick={handleSaveBoardInfo}
                            disabled={loading}
                            className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                          >
                            <Save className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setBoardDescription(board.description || "");
                              setIsEditingDescription(false);
                            }}
                            className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex-1">
                          {boardDescription ? (
                            <p className="text-gray-800 whitespace-pre-wrap">
                              {boardDescription}
                            </p>
                          ) : (
                            <p className="text-gray-500 italic">
                              No description added
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => setIsEditingDescription(true)}
                          className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "members" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Design Board Members
                </h3>

                {/* Add Members Section */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Add Members to Design Board
                    </label>
                    {selectedUsers.size > 0 && (
                      <button
                        onClick={handleAddSelectedMembers}
                        disabled={loading}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Selected ({selectedUsers.size})</span>
                      </button>
                    )}
                  </div>

                  {/* Search */}
                  <div className="relative mb-3">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search users by name, email, or designation..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Users Table */}
                  <div className="border border-gray-200 rounded-lg max-h-48 overflow-y-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 sticky top-0">
                        <tr>
                          <th className="px-3 py-2 text-left w-10"></th>
                          <th className="px-3 py-2 text-left">Name</th>
                          <th className="px-3 py-2 text-left">Email</th>
                          <th className="px-3 py-2 text-left">Role</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.map((user) => (
                          <tr
                            key={user.id}
                            className={`border-t border-gray-100 hover:bg-gray-50 cursor-pointer ${
                              selectedUsers.has(user.id) ? 'bg-blue-50' : ''
                            }`}
                            onClick={() => toggleUserSelection(user.id)}
                          >
                            <td className="px-3 py-2">
                              <div className="w-4 h-4 border border-gray-300 rounded flex items-center justify-center">
                                {selectedUsers.has(user.id) && (
                                  <Check className="w-3 h-3 text-blue-600" />
                                )}
                              </div>
                            </td>
                            <td className="px-3 py-2 font-medium text-gray-800">
                              {user.name}
                            </td>
                            <td className="px-3 py-2 text-gray-600">
                              {user.email}
                            </td>
                            <td className="px-3 py-2">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                user.designation === 'Admin' 
                                  ? 'bg-red-100 text-red-700'
                                  : user.designation === 'Supervisor'
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-blue-100 text-blue-700'
                              }`}>
                                {user.designation}
                              </span>
                            </td>
                          </tr>
                        ))}
                        {filteredUsers.length === 0 && (
                          <tr>
                            <td colSpan={4} className="px-3 py-6 text-center text-gray-500">
                              {searchTerm ? 'No users found matching your search' : 'All users are already members of this design board'}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Current Members List */}
                <div>
                  <h4 className="text-md font-medium text-gray-800 mb-3">
                    Current Members ({members.length})
                  </h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {members.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-medium text-gray-800">
                                {member.name || member.email}
                              </span>
                              {isCreator(member) && (
                                <Crown
                                  className="w-4 h-4 text-yellow-500"
                                  title="Design Board Creator"
                                />
                              )}
                            </div>
                            <div className="flex items-center space-x-2 text-xs text-gray-500">
                              <Mail className="w-3 h-3" />
                              <span>{member.email}</span>
                              {member.designation && (
                                <>
                                  <span>•</span>
                                  <span>{member.designation}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        {!isCreator(member) && (
                          <button
                            onClick={() => handleRemoveMember(member.id)}
                            disabled={loading}
                            className="text-red-600 hover:bg-red-50 p-1 rounded transition-colors disabled:opacity-50"
                            title="Remove member"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}

                    {members.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p>No members added yet</p>
                        <p className="text-sm">
                          Select users above to add them to this design board
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 mt-6">
        <button
          onClick={onClose}
          className="px-6 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
        >
          Close
        </button>
      </div>
    </Modal>
  );
};

export default BoardSettingsModal;