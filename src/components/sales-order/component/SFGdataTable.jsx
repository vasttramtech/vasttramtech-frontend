import React, { useState, useEffect } from "react";
import {
  Edit,
  Plus,
  Trash2,
  CheckCircle,
  XCircle,
  View,
  Expand,
} from "lucide-react";
import DisplaySfgStock from "./DisplaySfgStock";

export default function SFGdataTable({
  savedSfgData,
  onDeleteSfg,
  setEditSFg,
  setSFGIndex,
  addBomData,
  setAddBomData,
  setShowAddBomModal,
  stockList,
  token,
  setapprovedSFG,
  setSFGstatusStock,
  sfgStock,
  sfgStockCategories,
  allSemiFinishedGoods,
}) {
  const [expandedRows, setExpandedRows] = useState({});
  const [availableStock, setAvailableStock] = useState({});
  const [sfgStatus, setSfgStatus] = useState({});
  const [temporaryStock, setTemporaryStock] = useState({});
  const [showSfgStock, setShowSfgStock] = useState(false);
  const [viewIndex, setViewIndex] = useState(null);

  // console.log(sfgStock);
  const sfgQty = (ind) => {
    const sfg_id = allSemiFinishedGoods[ind].semi_finished_goods;
    const color = allSemiFinishedGoods[ind].color;
    const key = `${color}|${sfg_id}`;
    return sfgStockCategories.get(key) || 0;
  };

  // Initialize available stock from stockList
  // console.log(savedSfgData);
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
      if (sfg.raw_material_bom) {
        for (const rm of sfg.raw_material_bom) {
          const materialId = rm.raw_material_id;
          const requiredQty = rm.total_rm_qty;

          // If this material is not in our stock list or quantity is insufficient
          if (!tempStock[materialId] || tempStock[materialId] < requiredQty) {
            isSufficient = false;
            break;
          }
        }
      }

      status[index] = isSufficient;

      // Only deduct stock if sufficient
      if (isSufficient && sfg.raw_material_bom) {
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

  const handleEdit = (e, index) => {
    e.preventDefault();
    setEditSFg(true);
    setSFGIndex(index);
  };

  const handleAddBom = (e) => {
    e.preventDefault();
    setShowAddBomModal(true);
  };

  if (!savedSfgData || savedSfgData.length === 0) {
    return (
      <div className="p-4 text-center bg-blue-50 rounded-md border border-blue-200">
        <p className="text-blue-700">No semi-finished goods data available.</p>
      </div>
    );
  }
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {showSfgStock && (
        <DisplaySfgStock
          onClose={() => {
            setShowSfgStock(false);
          }}
          sfgStock={sfgStock}
          sfgMasterId={allSemiFinishedGoods[viewIndex]?.semi_finished_goods}
          colorId={allSemiFinishedGoods[viewIndex]?.color}
        />
      )}
      <button
        onClick={(e) => handleAddBom(e)}
        className="p-1 text-blue-600 hover:text-blue-800 font-bold rounded-full float-right bg-gray-200 my-2 mr-2"
        aria-label="Add BOM"
      >
        <Plus size={28} />
      </button>
      <table className="min-w-full divide-y divide-blue-200">
        <thead className="bg-blue-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
              SFG Name
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
              Color
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
              RM Stock Status
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
              SFG Stock
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
              Jobbers
            </th>
            <th className="px-4 py-3 text-center text-xs font-medium text-blue-700 uppercase tracking-wider">
              Action
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
                <td className="px-4 py-3 text-sm text-gray-700">
                  {sfg?.color?.color_name}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">{sfg.qty}</td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  ₹{sfg?.total_price?.toFixed(2)}
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
                <td className="px-4 py-3 text-sm">{sfgQty(index)}</td>
                <td className="px-4 py-3 text-sm">
                  <div className="bg-blue-50 p-2 rounded text-sm border border-gray-400 flex flex-col items-start justify-center">
                    {sfg.jobber_master_sfg.map((jobber, jobberIndex) => (
                      <span key={jobberIndex} value={jobber.jobber_master}>
                         <span className="font-semibold text-green-600">{jobber.jobber_master}</span> - <span className="font-semibold text-gray-800">{jobber.jobber_work_type}</span>
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-center">
                  <button
                    className="p-1 text-green-600 hover:text-green-800 rounded-full hover:bg-red-50 mr-1"
                    onClick={(e) => {
                      e.preventDefault();
                      setViewIndex(index);
                      setShowSfgStock(true);
                    }}
                  >
                    <Expand size={18} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      onDeleteSfg(index);
                    }}
                    className="p-1 text-red-600 hover:text-red-800 rounded-full hover:bg-red-50 mr-1"
                    aria-label="Delete"
                  >
                    <Trash2 size={18} />
                  </button>

                  {sfg.fromStock !== true && (
                    <button
                      onClick={(e) => handleEdit(e, index)}
                      className="p-1 text-blue-600 hover:text-blue-800 rounded-full hover:bg-blue-50 mr-1"
                      aria-label="Edit"
                    >
                      <Edit size={18} />
                    </button>
                  )}
                </td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
