import { useState } from "react";
import { useNavigate } from "react-router-dom";
import filter from "../assets/Others/Filter.png";
import Search from "../assets/Others/Search.png";
import TableSkeleton from "./TableSkeleton";

const SmartTable = ({ headers, data, onRowClick, searchTerm, setSearchTerm, loading, setLoading }) => {
    const navigate = useNavigate();
    const visibleHeaders = headers.slice(1);

    return (
        <div className="w-full p-4 bg-white rounded-xl shadow-sm">
            {/* Search & Filter Section */}
            <div className="flex flex-wrap items-center gap-4 mb-4">
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="px-4 py-2 w-full sm:w-1/4 border border-blue-400 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none transition text-sm"
                />

                <button
                    className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition flex items-center justify-center shadow-sm"
                    title="Search"
                >
                    <img src={Search} alt="Search" className="w-5 h-5" />
                </button>

                <button
                    className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition flex items-center justify-center shadow-sm"
                    title="Filter"
                >
                    <img src={filter} alt="Filter" className="w-5 h-5" />
                </button>
            </div>

            {/* Table Container */}
            <div className="overflow-x-auto rounded-lg border border-gray-200">
                <div className="max-h-[400px] overflow-y-auto">
                    <table className="min-w-full text-sm text-gray-700">
                        {/* Table Header */}
                        <thead className="sticky top-0 bg-blue-900 text-white text-center z-10">
                            <tr>
                                {visibleHeaders.map((header, index) => (
                                    <th key={index} className="px-4 py-3 font-semibold border-b border-blue-700">
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        {/* Table Body */}
                        {
                            loading ? (
                                <TableSkeleton columns={visibleHeaders.length} rows={data.length} />
                            ) : (
                                <tbody>
                                    {data.length > 0 ? (
                                        data.map((item, rowIndex) => (
                                            <tr
                                                key={rowIndex}
                                                className="hover:bg-blue-50 text-black cursor-pointer transition-colors"
                                                onClick={() => onRowClick && onRowClick(item)}
                                            >
                                                {Object.values(item)
                                                    .slice(1)
                                                    .map((value, colIndex) => (
                                                        <td
                                                            key={colIndex}
                                                            className="px-4 py-3 border-t border-gray-200 text-center whitespace-nowrap max-w-[250px] overflow-hidden text-ellipsis"
                                                        >
                                                            {typeof value === "string" && value.length > 100
                                                                ? value.slice(0, 100) + "..."
                                                                : value}
                                                        </td>
                                                    ))}
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan={visibleHeaders.length}
                                                className="px-4 py-6 text-center text-gray-500"
                                            >
                                                No data found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            )}

                    </table>
                </div>
            </div>
        </div>

    );
};

export default SmartTable;

