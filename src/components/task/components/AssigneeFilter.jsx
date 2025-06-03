import { ChevronDown } from "lucide-react";

const AssigneeFilter = ({ users, onSelect, selectedAssignee }) => {
  return (
    <div className="relative">
      <select
        className="bg-gray-200 p-2 rounded-xl shadow border-gray-400 border-[1px] w-48 appearance-none"
        value={selectedAssignee || ""}
        onChange={(e) => onSelect(e.target.value)}
      >
        <option value="">All Assignees</option>
        {users.map((user) => (
          <option key={user.id} value={user?.email}>
            {user?.email}
          </option>
        ))}
      </select>
      <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
        <ChevronDown size={16} className="text-gray-600" />
      </div>
    </div>
  );
};

export default AssigneeFilter;