import React, { useState, useEffect } from "react";

const SelectedRawMaterialsTable = ({
  selectedMaterials,
  updateQuantity,
  removeItem,
  onTotalCostChange
}) => {
  const [totalMaterialCost, setTotalMaterialCost] = useState(0);

  const handleQuantityChange = (id, newQty) => {
    updateQuantity(id, newQty);
  };

  // Calculate and update total cost whenever selected materials change
  useEffect(() => {
    const totalCost = selectedMaterials.reduce(
      (sum, material) =>
        sum + (material?.price_per_unit || 0) * (material.Qty || 0),
      0
    );
    setTotalMaterialCost(totalCost);
    
    // Call the parent component's handler with the new total cost
    if (onTotalCostChange) {
      onTotalCostChange(totalCost);
    }
  }, [selectedMaterials, onTotalCostChange]);

  if (!selectedMaterials || selectedMaterials.length === 0) {
    return (
      <div className="w-full p-4 text-center border border-gray-300 rounded-md bg-gray-50">
        <p className="text-gray-500">No raw materials selected</p>
      </div>
    );
  }
//   console.log(selectedMaterials)

  return (
    <div className="w-full overflow-x-auto border border-gray-300 rounded-lg shadow-sm">
      <table className="w-full text-sm text-gray-700">
        <thead className="bg-blue-900 text-white">
          <tr>
            <th className="py-2 px-4 text-left">Item Name</th>
            <th className="py-2 px-4 text-left">Color</th>
            <th className="py-2 px-4 text-left">Unit</th>
            <th className="py-2 px-4 text-left">Price Per Unit</th>
            <th className="py-2 px-4 text-left">Quantity</th>
            <th className="py-2 px-4 text-left">Total</th>
          </tr>
        </thead>
        <tbody>
          {selectedMaterials.map((material, index) => (
            <tr
              key={index}
              className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
            >
              <td className="py-2 px-4">{material?.item_name}</td>
              <td className="py-2 px-4">{material?.color}</td>
              <td className="py-2 px-4">{material?.unit}</td>
              <td className="py-2 px-4">{material?.price_per_unit || 0}</td>
              <td className="py-2 px-4">
                <input
                  type="number"
                  defaultValue={material?.Qty || 0}
                  className="w-20 p-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={material.Qty || 0}
                  min={0}
                  onChange={(e) =>
                    handleQuantityChange(
                      material.id,
                      parseFloat(e.target.value) || 0
                    )
                  }
                />
              </td>
              <td className="py-2 px-4">
                {(
                  (material?.price_per_unit || 0) * (material.Qty || 0)
                ).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot className="bg-gray-100 font-semibold">
          <tr>
            <td colSpan="5" className="py-2 px-4 text-right">
              Total Cost:
            </td>
            <td colSpan="2" className="py-2 px-4">
              {totalMaterialCost.toFixed(2)}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default SelectedRawMaterialsTable;