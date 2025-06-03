const DeleteTable = ({ header, data, setData }) => {
  const handleDelete = (index) => {
    setData(index)
  };
  if (!data || !Array.isArray(data) || data.length === 0) return null;

  return (
    <div className="p-2 w-[90vw] overflow-scroll">
      {/* Table Container */}
      <div className="rounded-xl">
        <div className="max-h-[400px]">
          <table className="w-full border-collapse border border-gray-300">
            {/* Table Header */}
            <thead>
              <tr className="sticky top-0 bg-gray-200 text-blue-600">
                {header.map((header, index) => (
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
              {data.length > 0
                ? data.map((item, rowIndex) => (
                    <tr
                      key={rowIndex}
                      className="cursor-pointer hover:bg-gray-100 transition"
                    >
                      {Object.keys(item).map((key, colIndex) => (
                        <td
                          key={colIndex}
                          className="px-4 py-2 text-center border border-gray-300"
                        >
                          {item[key]}
                        </td>
                      ))}

                      {/* Action Buttons */}
                      <td className="px-4 py-2 text-center border border-gray-300">
                        <span className="flex gap-2 justify-center">
                          <button
                            className="px-2 py-1 bg-red-500 text-white rounded"
                            onClick={(e) => {
                              e.preventDefault();
                              handleDelete(rowIndex);
                            }}
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

export default DeleteTable;
