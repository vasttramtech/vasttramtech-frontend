import { useState } from "react";
import { useNavigate } from "react-router-dom";
import filter from "../assets/Others/Filter.png";
import SearchIcon from "../assets/Others/Search.png"; // renamed for clarity

const SmartTable2 = ({ headers, data, onRowClick }) => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");

    const filteredData = data.filter((item) =>
        Object.values(item).some((val) =>
            val != null && val.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    return (
        <div className="p-2 w-full">
            <div className="flex items-center justify-start mb-2 gap-2">
                <input
                    type="text"
                    placeholder="Search..."
                    className="border border-gray-300 px-3 py-1 rounded-md w-[200px]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Table Container */}
            <div className="overflow-x-auto rounded-xl bg-white">
                <div className="max-h-[400px] overflow-y-auto">
                    <table className="w-full border-collapse border border-gray-300">
                        <thead>
                            <tr className="sticky top-0 bg-blue-900 text-white">
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
                                    <tr
                                        key={rowIndex}
                                        className="cursor-pointer hover:bg-blue-100 transition"
                                        onClick={() => onRowClick && onRowClick(item)}
                                    >
                                        {Object.values(item).map((value, colIndex) => (
                                            <td key={colIndex} className="px-4 border-t py-2 text-base text-center">
                                                {value}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={headers.length} className="px-4 py-2 text-center border border-gray-300">
                                        No data found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SmartTable2;
