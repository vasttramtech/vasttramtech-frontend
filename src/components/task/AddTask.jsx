import { useState } from "react";
import { PuffLoader } from "react-spinners";

const AddTask = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    task_description: "",
    assign_task_to: "",
    task_priority: "",
  });
  const [assigneeList, setAssigneeList] = useState([
    { id: "1", name: "user00" },
    { id: "2", name: "user01" },
  ]);
  const [priority, setPriority] = useState(["Low", "Medium", "High"]);
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevdata) => ({
      ...prevdata,
      [name]: value,
    }));
  };
  function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    console.log("Form Data:", formData);
    setFormData({
      task_description: "",
      assign_task_to: "",
      task_priority: "",
    });
    setSubmitting(false);
  }
  return (
    <div className="py-2">
      <h1 className="text-3xl font-bold text-blue-900 mb-4">Add New Task</h1>
      <form onSubmit={handleSubmit}>
        {/* Description */}
        <div className="flex flex-col">
          <label className="text-gray-700 font-semibold">Description</label>
          <textarea
            name="task_description"
            className="border border-gray-300 bg-gray-100 rounded-md p-2 mt-2 h-24 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Write Something"
            value={formData.task_description}
            onChange={handleInputChange}
          ></textarea>
        </div>

        {/* Task Assign */}
        <div className="grid grid-cols-2 gap-6 p-2 mb-16">
          {/* Assign */}
          <div className="flex flex-col">
            <label className="text-gray-700 font-semibold">
              Assign Task To
            </label>
            <select
              name="assign_task_to"
              className="flex-grow border border-gray-300 bg-gray-100 rounded-md p-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleInputChange}
              defaultValue=""
              value={formData.assign_task_to}
            >
              <option value="" disabled>
                Assign Task To
              </option>
              {assigneeList.map((item, index) => (
                <option value={item.id} id={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          {/* Priority */}
          <div className="flex flex-col">
            <label className="text-gray-700 font-semibold">Task Priority</label>
            <select
              name="task_priority"
              className="flex-grow border border-gray-300 bg-gray-100 rounded-md p-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleInputChange}
              defaultValue=""
              value={formData.task_priority}
            >
              <option value="" disabled>
                Priority
              </option>
              {priority.map((item, index) => (
                <option value={item} id={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>
        {/* Button */}
        <div className="flex justify-center items-center">
          <button
            type="submit"
            className={`bg-blue-500 ml-2 px-6 py-2 rounded text-white font-semibold transition-all ease-in-out duration-300 transform ${
              submitting ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
            }`}
            disabled={submitting}
          >
            {submitting ? (
              <div className="flex justify-center items-center space-x-2">
                <PuffLoader size={20} color="#fff" />
                <span>Saving...</span>
              </div>
            ) : (
              "Save"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTask;
