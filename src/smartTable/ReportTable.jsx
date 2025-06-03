
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import filter from "../assets/Others/Filter.png";
import Search from "../assets/Others/Search.png";

const ReportTable = ({ headers, data, onRowClick, fromDate, setFromDate, toDate, setToDate, api }) => {
    const navigate = useNavigate();
     const [searchTerm, setSearchTerm] = useState("");
 
     // Filter Data Based on Search
     const filteredData = data.filter((item) =>
         Object.values(item).some((val) =>
             val != null && val.toString().toLowerCase().includes(searchTerm.toLowerCase())
         )
     );
 
     return (
         <div className="p-2 w-full">
             {/* Search & Filter Section */}
             <div className=" flex justify-between items-center">
 
             <div className="flex items-center space-x-4 mb-4">      
                 <input
                     type="text"
                     placeholder="Search..."
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                     className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                 />
                 <button className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition">
                     <img src={Search} alt="Search" className="w-6 h-6"/>
                 </button>
                 <button className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition">
                     <img src={filter} alt="Filter" className="w-6 h-6"/>
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
                     <table className="w-full border-collapse border border-gray-300">
                         {/* Table Header */}
                         <thead>
                             <tr className="sticky top-0 bg-blue-900 text-white">
                                 {headers.map((header, index) => (
                                     <th key={index} className="px-4 py-2 text-base">
                                         {header}
                                     </th>
                                 ))}
                             </tr>
                         </thead>
 
                         {/* Table Body */}
                         <tbody>
                             {filteredData.length > 0 ? (
                                 filteredData.map((item, rowIndex) => (
                                     <tr
                                         key={rowIndex}
                                         className="cursor-pointer hover:bg-gray-100 transition"
                                         onClick={() => onRowClick && onRowClick(item)}
                                     >
                                         {Object.values(item).map((value, colIndex) => (
                                             <td key={colIndex} className="px-4 py-2 text-base text-center">
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
 
export default ReportTable
