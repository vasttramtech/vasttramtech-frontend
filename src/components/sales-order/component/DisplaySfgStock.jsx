import { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function DisplaySfgStock({
  colorId,
  sfgMasterId,
  sfgStock,
  onClose,
}) {
  const [filteredItems, setFilteredItems] = useState([]);

  useEffect(() => {

    // Filter items that match both colorId and sfgMasterId
    const filtered = sfgStock.filter(
      (item) =>
        item.color === parseInt(colorId) &&
        item.semi_finished_goods_master === parseInt(sfgMasterId)
    );

    setFilteredItems(filtered);
  }, [colorId, sfgMasterId, sfgStock]);

  return (
    <div className="fixed inset-0 bg-gray-900 backdrop-blur-md bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-blue-800 text-white px-4 py-3 flex justify-between items-center">
          <h2 className="text-lg font-semibold">
            SFG Details (ID: {sfgMasterId}, Color: {colorId})
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:text-blue-200 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {filteredItems.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No matching items found.
            </div>
          ) : (
            <div className="space-y-4">
              {filteredItems.map((item, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-md p-4 bg-blue-50"
                >
                  <div className="flex justify-between mb-2">
                    <span className="font-medium text-blue-800">Quantity:</span>
                    <span className="font-bold">{item.qty}</span>
                  </div>

                  <div className="mt-2">
                    <div className="font-medium text-blue-800 mb-1">
                      Processes:
                    </div>
                    <div className="bg-white rounded-md border border-gray-200">
                      {item.process && item.process.length > 0 ? (
                        <ul className="divide-y divide-gray-200">
                          {item.process.map((proc) => (
                            <li
                              key={proc.id}
                              className="px-3 py-2 flex justify-between"
                            >
                              <span>{proc.processes}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="p-3 text-gray-500 text-center">
                          No processes available
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-100 px-4 py-3 flex justify-end">
          <button
            onClick={onClose}
            className="bg-blue-800 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
