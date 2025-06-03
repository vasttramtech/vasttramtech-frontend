import { AddButton } from "./AddButton";

export const ShowAddedComponent = ({ data, changeDataFunction }) => {
  function handleDelete(index) {
    changeDataFunction(data.filter((item, i) => i !== index));
  }
  return (
    <div className="flex flex-col">
      {data.map((item, index) => (
        <div className="flex gap-2">
          <input
            type="text"
            className="w-full border border-gray-300 bg-gray-100 rounded-md p-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={item}
            contentEditable={false}
          />
          <div className="flex justify-center items-center" onClick={() => handleDelete(index)}>
            <AddButton content={"Delete"} />
          </div>
        </div>
      ))}
    </div>
  );
};
