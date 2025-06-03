import React from 'react'

const NormalTable = ({headers, data}) => {

    return (
        <div className="p-2 w-full">
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
                            {data.length > 0 ? (
                                data.map((item, rowIndex) => (
                                    <tr
                                        key={rowIndex}
                                        className="cursor-pointer hover:bg-gray-100 transition"
                                        
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
)
}

export default NormalTable
