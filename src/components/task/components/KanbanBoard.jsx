const Card = ({ task, onClick }) => {
  return (
    <div
      className="bg-[#d9d9d9] rounded-lg p-3 shadow-md hover:bg-blue-900 hover:text-white cursor-pointer"
      onClick={() => onClick(task)}
    >
      <h3 className="font-semibold">{task.subject}</h3>
      <div className="mt-2 flex justify-between text-xs">
        <span>Assignees: {task?.numberOfAssignees || 0}</span>
        <span>Comments: {task?.numberOfComments || 0}</span>
      </div>
    </div>
  );
};

const AdminCard = ({ task, onClick }) => {
    return (
      <div
        className="bg-[#d9d9d9] rounded-lg p-4 shadow-md hover:bg-blue-900 hover:text-white cursor-pointer"
        onClick={() => onClick(task)}
      >
        <h3 className="font-semibold text-lg">{task.subject}</h3>
  
        <div className="text-sm mt-1">
          <span className="font-medium">Creator: </span>
          <span>{task.creator?.email || "Unknown"}</span>
        </div>
  
        <div className="mt-3 text-sm">
          <span className="font-medium">Assignees: </span>
          <div className="flex flex-wrap gap-2 mt-1">
            {task.assignees && task.assignees.length > 0 ? (
              task.assignees.map((user, idx) => (
                <span
                  key={idx}
                  className="bg-blue-200 text-blue-900 text-xs font-medium px-2 py-1 rounded-full"
                >
                  {user.email}
                </span>
              ))
            ) : (
              <span className="italic text-gray-600">None</span>
            )}
          </div>
        </div>
      </div>
    );
  };
  

const Column = ({ title, tasks, onTaskClick, designation }) => {
  const getColumnColor = (columnTitle) => {
    switch (columnTitle) {
      case "To Do":
        return "border-blue-300";
      case "In Progress":
        return "border-yellow-300";
      case "Blocked":
        return "border-red-300";
      case "Complete":
        return "border-green-300";
      default:
        return "border-gray-300";
    }
  };
  // console.log(tasks)

  return (
    <div
      className={`w-1/4 p-3 rounded-lg bg-[#f5f5f5] shadow-md shadow-gray-500 border-t-4 ${getColumnColor(
        title
      )}`}
    >
      <h2 className="font-semibold mb-3">{title}</h2>
      <div className="flex flex-col gap-3 h-[450px]  overflow-y-auto">
        {tasks.length > 0 ? (
          tasks.map((task) =>
            designation === "Admin" ? (
              <AdminCard key={task.id} task={task} onClick={onTaskClick} />
            ) : (
              <Card key={task.id} task={task} onClick={onTaskClick} />
            )
          )
        ) : (
          <div className="text-gray-400 text-center p-4">No tasks</div>
        )}
      </div>
    </div>
  );
};

// Board component
const KanbanBoard = ({ tasks, onTaskClick, onAddClick, designation }) => {
    // console.log(designation)
  const columns = {
    "To Do": tasks.filter((task) => task?.task_status === "To Do"),
    "In Progress": tasks.filter((task) => task?.task_status === "In Progress"),
    Blocked: tasks.filter((task) => task?.task_status === "Blocked"),
    Complete: tasks.filter((task) => task?.task_status === "Complete"),
  };

  return (
    <div className="flex space-x-4 p-4 pl-10">
      {Object.entries(columns).map(([section, sectionTasks]) => (
        <Column
          key={section}
          title={section}
          tasks={sectionTasks}
          onTaskClick={onTaskClick}
          designation={designation}
        />
      ))}
    </div>
  );
};

export default KanbanBoard;
