// import React from "react";

// const SemiFinishedGoodsTable = ({ design }) => {
//   if (!design || !design.semi_finished_goods_entries?.length) {
//     return <p className="text-center text-gray-500">No data available</p>;
//   }
// console.log("design: ", design)
//   return (
//     <div className="w-full p-4 bg-white shadow-md rounded-lg">
//       <h2 className="text-lg font-semibold mb-2 text-center">
//         Semi-Finished Goods Entries
//       </h2>
//       <table className="w-full border-collapse border border-gray-300 text-sm ">
//         <thead className="bg-gray-100 ">
//           <tr className="text-center">
//             <th className="p-2 border">Semi-Finished Goods</th>
//             <th className="p-2 border">Qty</th>
//             <th className="p-2 border">Total Price</th>
//             <th className="p-2 border">Remarks</th>
//           </tr>
//         </thead>
//         <tbody>
//           {design?.semi_finished_goods_entries.map((entry) => (
//             <tr key={entry.id} className="text-gray-700 text-center">
//               <td className="p-2 border">{entry?.semi_finished_goods?.semi_finished_goods_name}</td>
//               <td className="p-2 border">{entry?.qty}</td>
//               <td className="p-2 border">{entry?.total_price}</td>
//               <td className="p-2 border">{entry?.sfg_description}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default SemiFinishedGoodsTable;


import React from "react";

const SemiFinishedGoodsTable = ({ design }) => {
  if (!design || !design.semi_finished_goods_entries?.length) {
    return <p className="text-center text-gray-500">No data available</p>;
  }

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-xl font-bold text-center">Semi-Finished Goods Details</h2>

      {design.semi_finished_goods_entries.map((entry) => (
        <div
          key={entry.id}
          className="bg-white rounded-lg shadow-md p-4 border border-gray-200"
        >
          {/* SFG Basic Info */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              {entry?.semi_finished_goods?.semi_finished_goods_name || "Unnamed SFG"}
            </h3>
            <p className="text-sm text-gray-500">{entry?.sfg_description}</p>
            <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-700">
              <p><strong>Qty:</strong> {entry.qty}</p>
              <p><strong>Total Price:</strong> ₹{entry.total_price}</p>
              <p><strong>BOM Status:</strong> {entry.bom_status}</p>
              <p><strong>From Stock:</strong> {entry.fromStock ? "Yes" : "No"}</p>
            </div>
          </div>

          {/* Jobbers Table */}
          <div className="mb-4">
            <h4 className="font-medium text-gray-700 mb-1">Jobber Details</h4>
            <table className="w-full text-sm border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border p-2">Name</th>
                  <th className="border p-2">Work Type</th>
                  <th className="border p-2">Rate</th>
                  <th className="border p-2">Days</th>
                  <th className="border p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {(entry.jobber_master_sfg || []).map((jobber) => (
                  <tr key={jobber.id} className="text-center">
                    <td className="border p-2">{jobber.jobber_master?.jobber_name}</td>
                    <td className="border p-2">{jobber.jobber_work_type}</td>
                    <td className="border p-2">₹{jobber.jobber_rate}</td>
                    <td className="border p-2">{jobber.jobber_master?.days}</td>
                    <td className="border p-2">{jobber.completed}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Raw Materials Table */}
          <div>
            <h4 className="font-medium text-gray-700 mb-1">Raw Materials Used</h4>
            <table className="w-full text-sm border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border p-2">Name</th>
                  <th className="border p-2">Qty</th>
                  <th className="border p-2">Rate</th>
                </tr>
              </thead>
              <tbody>
                {(entry.raw_material_bom || []).map((rm) => (
                  <tr key={rm.id} className="text-center">
                    <td className="border p-2">{rm.raw_material_master?.item_name}</td>
                    <td className="border p-2">{rm.rm_qty}</td>
                    <td className="border p-2">₹{rm.raw_material_master?.price_per_unit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SemiFinishedGoodsTable;

