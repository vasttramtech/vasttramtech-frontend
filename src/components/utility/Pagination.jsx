import React from 'react'

const Pagination = ({ page, setPage, pageSize, setPageSize, totalPages}) => {
  return (
    <div className="flex items-center justify-center space-x-4 mt-4">
                                {/* Dropdown for selecting page size */}
                                <select
                                    value={pageSize}
                                    onChange={(e) => {
                                        setPage(1); // Reset to first page when changing size
                                        setPageSize(Number(e.target.value));
                                    }}
                                    className="px-3 py-2 border border-blue-400 rounded-md bg-white text-blue-600 shadow-md cursor-pointer focus:outline-none"
                                >
                                    
                                    <option value="5">5 results per page</option>
                                    <option value="10">10 results per page</option>
                                    <option value="20">20 results per page</option>
                                </select>

                                {/* Prev Button */}
                                <button
                                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                                    disabled={page === 1}
                                    className={`px-4 py-2 rounded-md text-white transition ${
                                        page === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-blue-400 hover:bg-blue-500"
                                    }`}
                                >
                                    Prev
                                </button>

                                 <div className="flex space-x-2">
                                    {page > 2 && (
                                        <>
                                            <button
                                                onClick={() => setPage(1)}
                                                className={`px-3 py-2 rounded-md text-white transition ${
                                                    page === 1 ? "bg-blue-600 font-bold" : "bg-blue-400 hover:bg-blue-500"
                                                }`}
                                            >
                                                1
                                            </button>
                                            {page > 3 && <span className="text-blue-500">...</span>}
                                        </>
                                    )}

                        {/* Current Page & Nearby Pages */}
                        {Array.from({ length: totalPages }, (_, index) => index + 1)
                            .filter((pageNumber) => 
                                pageNumber === page || 
                                pageNumber === page - 1 || 
                                pageNumber === page + 1
                            )
                            .map((pageNumber) => (
                                <button
                                    key={pageNumber}
                                    onClick={() => setPage(pageNumber)}
                                    className={`px-3 py-2 rounded-md text-white transition ${
                                        page === pageNumber ? "bg-blue-600 font-bold" : "bg-blue-300 hover:bg-blue-400"
                                    }`}
                                >
                                    {pageNumber}
                                </button>
                            ))}

                        {/* Last Page with "..." logic */}
                        {page < totalPages - 1 && (
                                <>
                                    {page < totalPages - 2 && <span className="text-blue-500">...</span>}
                                    <button
                                        onClick={() => setPage(totalPages)}
                                        className={`px-3 py-2 rounded-md text-white transition ${
                                            page === totalPages ? "bg-blue-600 font-bold" : "bg-blue-300 hover:bg-blue-400"
                                        }`}
                                    >
                                        {totalPages}
                                    </button>
                                </>
                            )}
                        </div>

                                {/* Next Button */}
                                <button
                                    onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                                    disabled={page === totalPages}
                                    className={`px-4 py-2 rounded-md text-white transition ${
                                        page === totalPages ? "bg-gray-300 cursor-not-allowed" : "bg-blue-300 hover:bg-blue-400"
                                    }`}
                                >
                                    Next
                                </button>
                            </div>
  )
}

export default Pagination
