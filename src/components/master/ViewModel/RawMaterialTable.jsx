import React from "react";

const RawMaterialTable = ({ design }) => {


  return (
    <div className="w-full mt-2 p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-lg font-semibold mb-2 text-center">
        Raw Material Entries
      </h2>

      {
       (!design || !design.raw_material_entries?.length) ? <p className="text-center text-gray-500">No data available</p>
        :
      <table className="w-full border-collapse border border-gray-300 text-sm">
        <thead className="bg-gray-100">
          <tr className="text-center">
            <th className="p-2 border">Qty</th>
            <th className="p-2 border">Total Price</th>
            <th className="p-2 border">Item Name</th>
            <th className="p-2 border">Remarks</th>
          </tr>
        </thead>
        <tbody>
          {design.raw_material_entries.map((entry) => (
            <tr key={entry.id} className="text-gray-700 text-center">
              <td className="p-2 border">{entry.qty}</td>
              <td className="p-2 border">{entry.total_price}</td>
              <td className="p-2 border">{entry.raw_material.item_name}</td>
              <td className="p-2 border">{entry.design_description}</td>
            </tr>
          ))}
        </tbody>
      </table>
      }
    </div>
  );
};

export default RawMaterialTable;
