const TableSkeleton = ({ columns = 5, rows = 6 }) => {
    return (
        <tbody>
            {Array.from({ length: rows }).map((_, rowIdx) => (
                <tr key={rowIdx} className="border-t border-gray-200 animate-pulse">
                    {Array.from({ length: columns }).map((_, colIdx) => (
                        <td key={colIdx} className="px-4 py-3 text-center">
                            <div className="h-4 w-full max-w-[150px] bg-gray-200 rounded mx-auto" />
                        </td>
                    ))}
                </tr>
            ))}
        </tbody>
    );
};

export default TableSkeleton;
