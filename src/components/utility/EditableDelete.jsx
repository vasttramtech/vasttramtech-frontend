import { useState } from "react";

const EditableDelete = ({ headers, data, onDataChange }) => {
  const [editedData, setEditedData] = useState([...data]);
  const [editingRows, setEditingRows] = useState(new Set());
  // Handle Delete Row
  const handleDelete = (index) => {
    const newData = editedData.filter((_, i) => i !== index);
    setEditedData(newData);
    onDataChange(newData);
  };

  // Handle Edit Toggle for Multiple Rows
  const toggleEdit = (index) => {
    const updatedEditingRows = new Set(editingRows);
    if (updatedEditingRows.has(index)) {
      updatedEditingRows.delete(index);
    } else {
      updatedEditingRows.add(index);
    }
    setEditingRows(updatedEditingRows);
  };

  // Handle Input Change in Editable Row
  const handleInputChange = (index, key, value) => {
    const newData = [...editedData];
    newData[index] = { ...newData[index], [key]: value };
    setEditedData(newData);
  };

  // Handle Update Changes (Prevent Backend Submission)
  const handleUpdate = (e) => {
    e.preventDefault();
    onDataChange(editedData); // Send updated data back to parent
    setEditingRows(new Set()); // Exit edit mode
  };

  return (
    <div className="p-2">
      {/* Table Container */}
      <div className="rounded-xl px-2">
        <div className="max-h-[400px] overflow-x-auto
         ">
          <table className="w-full border-collapse border border-gray-300">
            {/* Table Header */}
            <thead>
              <tr className="sticky top-0 bg-gray-200 text-blue-600">
                {headers.map((header, index) => (
                  <th
                    key={index}
                    className="px-4 py-2 text-base text-center w-[150px] border border-gray-300"
                  >
                    {header}
                  </th>
                ))}
                <th className="px-4 py-2 text-base text-center w-[180px] border border-gray-300">
                  Actions
                </th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {editedData.length > 0
                ? editedData.map((item, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className="cursor-pointer hover:bg-gray-100 transition"
                  >
                    {Object.keys(item).map((key, colIndex) => (
                      <td
                        key={colIndex}
                        className="px-4 py-2 text-center border border-gray-300"
                      >
                        {editingRows.has(rowIndex) ? (
                          <input
                            type="text"
                            value={item[key]}
                            onChange={(e) =>
                              handleInputChange(rowIndex, key, e.target.value)
                            }
                            className="border border-gray-300 px-2 py-1 rounded w-full"
                          />
                        ) : (
                          item[key]
                        )}
                      </td>
                    ))}

                    {/* Action Buttons */}
                    <td className="px-4 py-2 text-center border border-gray-300">
                      <span className="flex gap-2 justify-center">
                        {editingRows.has(rowIndex) ? (
                          <button
                            className="px-2 py-1 bg-green-500 text-white rounded"
                            onClick={handleUpdate}
                          >
                            Save
                          </button>
                        ) : (
                          <button
                            className="px-2 py-1 bg-yellow-500 text-white rounded"
                            onClick={(e) => { e.preventDefault(); toggleEdit(rowIndex) }}
                          >
                            Edit
                          </button>
                        )}
                        <button
                          className="px-2 py-1 bg-red-500 text-white rounded"
                          onClick={(e) => { e.preventDefault(); handleDelete(rowIndex) }}
                        >
                          Delete
                        </button>
                      </span>
                    </td>
                  </tr>
                ))
                : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EditableDelete;
