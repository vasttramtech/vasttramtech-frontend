
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import filter from "../assets/Others/Filter.png";
import Search from "../assets/Others/Search.png";
import TableSkeleton from "./TableSkeleton";

const ReportTable = ({ headers, data, onRowClick, fromDate, setFromDate, toDate, setToDate, api, loading, setLoading, searchTerm, setSearchTerm, placeholder }) => {
    const navigate = useNavigate();

    // Filter Data Based on Search
    //  const filteredData = data.filter((item) =>
    //      Object.values(item).some((val) =>
    //          val != null && val.toString().toLowerCase().includes(searchTerm.toLowerCase())
    //      )
    //  );
    const filteredData = data;

    return (
        <div className="w-full p-4 bg-white rounded-xl shadow-sm">
            {/* Search & Filter Section */}
            <div className=" flex justify-between items-center">

                <div className="flex flex-wrap items-center gap-3 mb-4">
                    <input
                        type="text"
                        placeholder={placeholder || "Auto Search"}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="px-3 py-2 border rounded-lg focus:ring-2 ring-1 ring-gray-400 focus:ring-blue-400 focus:outline-none"
                    />
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition">
                        <img src={Search} alt="Search" className="w-6 h-6" />
                    </button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition">
                        <img src={filter} alt="Filter" className="w-6 h-6" />
                    </button>
                </div>

                <div className="flex gap-4 mb-4">
                    <div>
                        <label className="block text-sm text-gray-700">From Date:</label>
                        <input
                            type="date"
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                            className="border border-gray-300 rounded px-2 py-1"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-700">To Date:</label>
                        <input
                            type="date"
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                            className="border border-gray-300 rounded px-2 py-1"
                        />
                    </div>
                    <button
                        onClick={() => api()}
                        className="self-end bg-blue-600 text-white text-lg px-4 py-1 rounded hover:bg-blue-700"
                    >
                        Filter
                    </button>
                </div>


            </div>

            {/* Table Container with fixed max height and horizontal scroll */}
            <div className="overflow-x-auto rounded-xl">
                <div className="max-h-[400px] overflow-y-auto">
                    <table className="min-w-full text-sm text-gray-700 border-collapse border border-gray-300">
                        {/* Table Header */}
                        <thead className="">
                            <tr className="sticky top-0 bg-blue-900 text-white text-center z-10">
                                {headers.map((header, index) => (
                                    <th key={index} className="px-4 py-2 font-semibold border-b border-blue-700">
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        {/* Table Body */}
                        {
                            loading ? (
                                <TableSkeleton columns={headers.length} rows={filteredData.length} />
                            ) :
                                (

                                    <tbody>
                                        {filteredData.length > 0 ? (
                                            filteredData.map((item, rowIndex) => (
                                                <tr
                                                    key={rowIndex}
                                                    className="hover:bg-blue-50 cursor-pointer text-black  transition-all duration-200 ease-in-out"
                                                    onClick={() => onRowClick && onRowClick(item)}
                                                >
                                                    {Object.values(item).map((value, colIndex) => (
                                                        <td key={colIndex} className="px-4 py-2 text-base text-center whitespace-nowrap max-w-[250px] overflow-hidden text-ellipsis border-t">
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
                                )
                        }
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ReportTable
