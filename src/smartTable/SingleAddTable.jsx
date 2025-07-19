import { useEffect, useState } from "react";

const SingleAddTable = ({
  NoOfColumns,
  data,
  headers,
  setSelectedRow,
  setSelectedData,
}) => {
  const [originalData, setOriginalData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (data && data.length > 0) {
      const formatted = data.map((item) =>
        Object.fromEntries(Object.entries(item).slice(0, NoOfColumns))
      );
      setOriginalData(formatted);
    } else {
      setOriginalData([]);
    }
  }, [data, NoOfColumns]);

  function handleClick(rowIndex) {
    setSelectedRow(rowIndex);
    setSelectedData(data[rowIndex]);
  }

  const filteredData = originalData.filter((row) =>
    Object.values(row)
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="my-4">

      <div className="flex justify-start mb-2" >
        <input
          type="text"
          placeholder="Search..."
          className="border border-gray-300 px-3 py-1 rounded-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="max-h-[400px] overflow-auto rounded-xl bg-white">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="sticky top-0 bg-blue-900 text-white">
              <th></th>
              {headers.map((header, index) => (
                <th key={index} className="px-4 py-2 text-base">
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((item, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-gray-100 transition">
                  <td>
                    <button
                      className="border border-gray-400 hover:bg-gray-400 bg-gray-300 font-semibold py-1 px-3 rounded-md ml-3"
                      onClick={() => handleClick(rowIndex)}
                    >
                      Add
                    </button>
                  </td>
                  {Object.values(item).map((value, colIndex) => (
                    <td
                      key={colIndex}
                      className="px-4 py-2 text-base text-center"
                    >
                      {value}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={headers.length + 1}
                  className="px-4 py-2 text-center border border-gray-300"
                >
                  No data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div >
  );
};

export default SingleAddTable;
