import React from "react";

const SemiFinishedGoodsTable = ({ design }) => {
  if (!design || !design.semi_finished_goods_entries?.length) {
    return <p className="text-center text-gray-500">No data available</p>;
  }
console.log(design)
  return (
    <div className="w-full p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-lg font-semibold mb-2 text-center">
        Semi-Finished Goods Entries
      </h2>
      <table className="w-full border-collapse border border-gray-300 text-sm ">
        <thead className="bg-gray-100 ">
          <tr className="text-center">
            <th className="p-2 border">Semi-Finished Goods</th>
            <th className="p-2 border">Qty</th>
            <th className="p-2 border">Total Price</th>
            <th className="p-2 border">Remarks</th>
          </tr>
        </thead>
        <tbody>
          {design?.semi_finished_goods_entries.map((entry) => (
            <tr key={entry.id} className="text-gray-700 text-center">
              <td className="p-2 border">{entry?.semi_finished_goods?.semi_finished_goods_name}</td>
              <td className="p-2 border">{entry?.qty}</td>
              <td className="p-2 border">{entry?.total_price}</td>
              <td className="p-2 border">{entry?.sfg_description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SemiFinishedGoodsTable;
