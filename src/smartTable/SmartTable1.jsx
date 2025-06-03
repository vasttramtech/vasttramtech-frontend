// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import filter from "../assets/Others/Filter.png";
// import Search from "../assets/Others/Search.png";

// const SmartTable = ({ headers, data, onRowClick }) => {
//     const navigate = useNavigate();
//     const [searchTerm, setSearchTerm] = useState("");

//     // Filter Data Based on Search
//     const filteredData = data.filter((item) =>
//         Object.values(item).some((val) =>
//             val != null && val.toString().toLowerCase().includes(searchTerm.toLowerCase()) // Check if val is not null or undefined
//         )
//     );

//     return (
//         <div className="p-2 w-full">
//             {/* Search & Filter Section */}
//             <div className="flex items-center space-x-4 mb-4">
//                 <input
//                     type="text"
//                     placeholder="Search..."
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
//                 />
//                 <button className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition">
//                     <img src={Search} alt="image" className="w-6 h-6"/>
//                 </button>
//                 <button className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition">
//                     <img src={filter} alt="image" className="w-6 h-6"/>
//                 </button>
//             </div>

//             {/* Table */}
//             <div className="overflow-x-auto rounded-xl">
//                 <table className="w-full border-collapse border border-gray-300">
//                     {/* Table Header */}
//                     <thead>
//                         <tr className="bg-gray-200 text-blue-600">
//                             {headers.map((header, index) => (
//                                 <th key={index} className="px-4 py-2 text-sm">
//                                     {header}
//                                 </th>
//                             ))}
//                         </tr>
//                     </thead>

//                     {/* Table Body */}
//                     <tbody>
//                         {filteredData.length > 0 ? (
//                             filteredData.map((item, rowIndex) => (
//                                 <tr
//                                     key={rowIndex}
//                                     className="cursor-pointer hover:bg-gray-100 transition"
//                                     onClick={() => onRowClick && onRowClick(item)}
//                                 >
//                                     {Object.values(item).map((value, colIndex) => (
//                                         <td key={colIndex} className="px-4 py-2 text-xs text-center">
//                                             {value}
//                                         </td>
//                                     ))}
//                                 </tr>
//                             ))
//                         ) : (
//                             <tr>
//                                 <td colSpan={headers.length} className="px-4 py-2 text-center border border-gray-300">
//                                     No data found
//                                 </td>
//                             </tr>
//                         )}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// };

// export default SmartTable;


import { useState } from "react";
import { useNavigate } from "react-router-dom";
import filter from "../assets/Others/Filter.png";
import Search from "../assets/Others/Search.png";

const SmartTable1 = ({ headers, data, onRowClick }) => {
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



export default SmartTable1;