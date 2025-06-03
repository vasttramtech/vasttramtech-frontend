import React, { useState, useEffect } from "react";
import { Edit, Plus, Trash2, CheckCircle, XCircle } from "lucide-react";

export default function ExtraBOMStockStatus({
  savedSfgData,
  stockList,
  token,
  setapprovedSFG,
  setSFGstatusStock,
}) {
  const [expandedRows, setExpandedRows] = useState({});
  const [availableStock, setAvailableStock] = useState({});
  const [sfgStatus, setSfgStatus] = useState({});
  const [temporaryStock, setTemporaryStock] = useState({});
  // console.log(savedSfgData)
  useEffect(() => {
    if (stockList && stockList.length > 0) {
      const initialStock = {};
      stockList.forEach((item) => {
        initialStock[item.raw_material] = item.stock;
      });
      setAvailableStock(initialStock);
      calculateSfgStatus(savedSfgData, initialStock);
    }
  }, [stockList, savedSfgData]);
  // Recalculate stock status when savedSfgData changes
  useEffect(() => {
    if (stockList && stockList.length > 0) {
      const initialStock = {};
      stockList.forEach((item) => {
        initialStock[item.raw_material] = item.stock;
      });
      setTemporaryStock(initialStock);
      calculateSfgStatus(savedSfgData, initialStock);
    }
  }, [savedSfgData, stockList]);

  // console.log(sfgStatus);
  useEffect(() => {
    setSFGstatusStock(sfgStatus);
  }, [sfgStatus]);

  // Calculate if each SFG has sufficient materials
  const calculateSfgStatus = (sfgData, stockData) => {
    if (!sfgData || !stockData) return;

    const tempStock = { ...stockData };
    const status = {};

    sfgData.forEach((sfg, index) => {
      let isSufficient = true;

      // Check each raw material in this SFG
      for (const rm of sfg.raw_material_bom) {
        const materialId = rm.raw_material_id;
        const requiredQty = rm.total_rm_qty;

        // If this material is not in our stock list or quantity is insufficient
        if (!tempStock[materialId] || tempStock[materialId] < requiredQty) {
          isSufficient = false;
          break;
        }
      }

      status[index] = isSufficient;

      // Only deduct stock if sufficient
      if (isSufficient) {
        for (const rm of sfg.raw_material_bom) {
          const materialId = rm.raw_material_id;
          tempStock[materialId] -= rm.total_rm_qty;
        }
      }
    });

    setSfgStatus(status);
  };

  useEffect(() => {
    const approvedSfgs = Object.entries(sfgStatus)
      .filter(([_, isApproved]) => isApproved)
      .map(([index]) => savedSfgData[index]);
    //  console.log(approvedSfgs);
    setapprovedSFG(approvedSfgs);
    const totalApproved = approvedSfgs.length;
    const totalSfgs = savedSfgData.length;
  }, [sfgStatus]);

  const toggleRowExpand = (e, index) => {
    e.preventDefault();
    setExpandedRows({
      ...expandedRows,
      [index]: !expandedRows[index],
    });
  };

  if (!savedSfgData || savedSfgData.length === 0) {
    return (
      <div className="p-4 text-center bg-blue-50 rounded-md border border-blue-200 mt-4">
        <p className="text-blue-700">No semi-finished goods data available to deduct.</p>
      </div>
    );
  }
  // console.log(sfgStatus)
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden mt-4 border-gray-300 border-2 py-2">
      <table className="min-w-full divide-y divide-blue-200">
        <thead className="bg-blue-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
              SFG Name
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
              Quantity
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
              Total Price
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
              Description
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
              Stock Status
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
              Details
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-blue-100">
          {savedSfgData.map((sfg, index) => (
            <React.Fragment key={index}>
              <tr className={index % 2 === 0 ? "bg-white" : "bg-blue-50"}>
                <td className="px-4 py-3 text-sm font-medium text-gray-800">
                  {sfg.semi_finished_goods}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">{sfg.qty}</td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  ₹{sfg.total_price.toFixed(2)}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700 max-w-xs truncate">
                  {sfg.sfg_description || "N/A"}
                </td>
                <td className="px-4 py-3 text-sm">
                  {sfgStatus[index] !== undefined && (
                    <div className="flex items-center">
                      {sfgStatus[index] ? (
                        <>
                          <CheckCircle
                            size={18}
                            className="text-green-500 mr-1"
                          />
                          <span className="text-green-700">Approved</span>
                        </>
                      ) : (
                        <>
                          <XCircle size={18} className="text-red-500 mr-1" />
                          <span className="text-red-700">
                            Insufficient Stock
                          </span>
                        </>
                      )}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 text-sm">
                  <button
                    onClick={(e) => toggleRowExpand(e, index)}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    {expandedRows[index] ? "Hide" : "Show"}
                  </button>
                </td>
              </tr>
              {expandedRows[index] && (
                <tr className={index % 2 === 0 ? "bg-white" : "bg-blue-50"}>
                  <td colSpan="7" className="px-4 py-2">
                    <div className="pl-4 border-l-2 border-blue-300 mb-3">
                      <h4 className="text-sm font-medium text-blue-700 mb-2">
                        Raw Materials
                      </h4>
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        {sfg.raw_material_bom.map((rm, rmIndex) => {
                          const materialId = rm.raw_material_id;
                          const requiredQty = rm.total_rm_qty;
                          const currentStock = availableStock[materialId] || 0;
                          const hasEnough = currentStock >= requiredQty;

                          return (
                            <div
                              key={rmIndex}
                              className={`p-2 rounded text-sm ${
                                hasEnough ? "bg-green-50" : "bg-red-50"
                              }`}
                            >
                              <div className="flex justify-between">
                                <span className="font-medium">
                                  {rm.raw_material_master}: {rm.rm_qty} unit
                                </span>
                                <span>
                                  <strong>Total:</strong>
                                  {requiredQty} units
                                  <span
                                    className={
                                      hasEnough
                                        ? "text-green-600"
                                        : "text-red-600"
                                    }
                                  >
                                    {` (${currentStock} in stock)`}
                                  </span>
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <h4 className="text-sm font-medium text-blue-700 mb-2">
                        Jobbers
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {sfg.jobber_master_sfg.map((jobber, jobberIndex) => (
                          <div
                            key={jobberIndex}
                            className="bg-blue-50 p-2 rounded text-sm"
                          >
                            <div>
                              <span className="font-medium">
                                {jobber.jobber_master}
                              </span>
                            </div>
                            <div>Work: {jobber.jobber_work_type}</div>
                            <div>Rate: ₹{jobber.jobber_rate.toFixed(2)}</div>
                            <div>Description: {jobber.jobber_description}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
