import React from "react";

const SemiFinishedGoodsTable = ({ data }) => {
// const entries=data?.extra_bom_so.filter((item)=>item?.Extra_bom?.stock_status===false)
  const allSfgEntries =
    data?.extra_bom_so?.flatMap((item) => item.Extra_bom) || [];

  // Calculate total price of all extra SFGs
  const totalPrice =
    allSfgEntries.reduce((sum, item) => sum + (item?.total_price || 0), 0) || 0;

  // Helper function to display jobbers in a compact way
  const renderJobbers = (jobbers) => {
    if (!jobbers || jobbers.length === 0) return "None";

    return jobbers.map((jobber, idx) => (
      <div key={idx} className="text-xs">
        <span className="font-medium">{jobber.jobber_master.jobber_name}</span>
        <span className="text-gray-500">
          {" "}
          ({jobber.jobber_work_type}, ₹{jobber.jobber_rate})
        </span>
      </div>
    ));
  };

  // Helper function to render raw materials
  const renderRawMaterials = (materials) => {
    if (!materials || materials.length === 0) return "None";

    return materials.map((material, idx) => (
      <div key={idx} className="text-xs">
        <span className="font-medium">
          {material.raw_material_master.item_name}
        </span>
        <span className="text-gray-500"> (Qty: {material.rm_qty})</span>
      </div>
    ));
  };

  // Helper function to display stock status
  const renderStockStatus = (status) => {
    return status ? (
      <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
        Stock Deducted
      </span>
    ) : (
      <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
        Stock Not Deducted
      </span>
    );
  };

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-blue-700 mb-3 border-b border-blue-200 pb-2">
        BOM Semi-Finished Goods
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-blue-50">
            <tr>
              <th className="py-2 px-3 border-b text-left text-sm font-medium text-blue-800">
                Item Name / ID
              </th>
              <th className="py-2 px-3 border-b text-left text-sm font-medium text-blue-800">
                Description
              </th>
              <th className="py-2 px-3 border-b text-center text-sm font-medium text-blue-800">
                Color
              </th>
              <th className="py-2 px-3 border-b text-center text-sm font-medium text-blue-800">
                Qty / Unit
              </th>
              <th className="py-2 px-3 border-b text-right text-sm font-medium text-blue-800">
                Total Price
              </th>
              <th className="py-2 px-3 border-b text-left text-sm font-medium text-blue-800">
                Raw Materials
              </th>
              <th className="py-2 px-3 border-b text-left text-sm font-medium text-blue-800">
                Jobbers
              </th>
              <th className="py-2 px-3 border-b text-center text-sm font-medium text-blue-800">
                Stock Status
              </th>
              <th className="py-2 px-3 border-b text-center text-sm font-medium text-blue-800">
                SFG status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {allSfgEntries.map((item, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="py-3 px-3 text-sm">
                  <div className="font-medium text-blue-700">
                    {item?.semi_finished_goods?.semi_finished_goods_name ||
                      "N/A"}
                  </div>
                  <div className="text-xs text-gray-500">
                    {item?.semi_finished_goods?.semi_finished_goods_id || "N/A"}
                  </div>
                  <div className="text-xs text-gray-600">
                    Group:{" "}
                    {item?.semi_finished_goods?.group?.group_name || "N/A"}
                  </div>
                </td>
                <td className="py-3 px-3 text-sm">
                  {item?.sfg_description ||
                    item?.semi_finished_goods?.description ||
                    "N/A"}
                </td>
                <td className="py-3 px-3 text-sm text-center">
                  {item?.color ? (
                    <div>
                      <div className="font-medium">{item.color.color_name}</div>
                      <div className="text-xs text-gray-500">
                        {item.color.color_id}
                      </div>
                    </div>
                  ) : (
                    "N/A"
                  )}
                </td>
                <td className="py-3 px-3 text-sm text-center">
                  <div className="font-medium">{item?.qty || 0}</div>
                  <div className="text-xs text-gray-500">
                    {item?.semi_finished_goods?.unit?.unit_name || "N/A"}
                  </div>
                </td>
                <td className="py-3 px-3 text-sm text-right font-medium">
                  ₹{item?.total_price || 0}
                </td>
                <td className="py-3 px-3 text-sm">
                  {renderRawMaterials(item?.raw_material_bom)}
                </td>
                <td className="py-3 px-3 text-sm">
                  {renderJobbers(item?.jobber_master_sfg)}
                </td>
                <td className="py-3 px-3 text-sm text-center">
                  {renderStockStatus(item?.stock_status )}
                </td>
                <td className="py-3 px-3 text-sm text-center">
                    {(item?.bom_status === "in_process" ? "No Process Done" : item?.bom_status)}
                </td>
              </tr>
            ))}
            <tr className="bg-blue-50 font-medium">
              <td colSpan={4} className="py-2 px-3 text-right text-sm">
                Total:
              </td>
              <td className="py-2 px-3 text-right text-sm font-bold">
                ₹{totalPrice}
              </td>
              <td colSpan={4}></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SemiFinishedGoodsTable;
