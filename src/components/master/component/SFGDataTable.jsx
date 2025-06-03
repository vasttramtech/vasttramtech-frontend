import React, { useState } from "react";
import { Trash2 } from "lucide-react";

export default function SFGDataTable({ savedSfgData, onDeleteSfg }) {
  const [expandedRows, setExpandedRows] = useState({});

  // console.log("savedSfgData", savedSfgData);

  const toggleRowExpand = (e, index) => {
    e.preventDefault();
    setExpandedRows({
      ...expandedRows,
      [index]: !expandedRows[index],
    });
  };

  if (!savedSfgData || savedSfgData.length === 0) {
    return (
      <div className="p-4 text-center bg-blue-50 rounded-md border border-blue-200">
        <p className="text-blue-700">No semi-finished goods data available.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden my-5">
      <table className="min-w-full divide-y divide-blue-200">
        <thead className="bg-blue-900 text-white">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
              SFG Name
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Quantity
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Total Price
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium  uppercase tracking-wider">
              Description
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium  uppercase tracking-wider">
              Details
            </th>
            <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-blue-100">
          {savedSfgData?.map((sfg, index) => (
            <React.Fragment key={index}>
              <tr className={index % 2 === 0 ? "bg-white" : "bg-blue-50"}>
                <td className="px-4 py-3 text-sm font-medium text-gray-800">
                  {sfg?.semi_finished_goods?.semi_finished_goods_name || sfg?.semi_finished_goods}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">{sfg.qty}</td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  ₹{sfg?.total_price.toFixed(2)}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700 max-w-xs truncate">
                  {sfg?.sfg_description || "N/A"}
                </td>
                <td className="px-4 py-3 text-sm">
                  <button
                    onClick={(e) => toggleRowExpand(e, index)}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    {expandedRows[index] ? "Hide" : "Show"}
                  </button>
                </td>
                <td className="px-4 py-3 text-sm text-center">
                  <button
                    type="button"
                    onClick={() => onDeleteSfg(index)}
                    className="p-1 text-red-600 hover:text-red-800 rounded-full hover:bg-red-50"
                    aria-label="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
              {expandedRows[index] && (
  <tr className={index % 2 === 0 ? "bg-white" : "bg-blue-50"}>
    <td colSpan="6" className="px-4 py-2">
      <div className="pl-4 border-l-2 border-blue-300 mb-3">
        <h4 className="text-sm font-medium text-blue-700 mb-2">Raw Materials</h4>
        <table className="min-w-full text-sm mb-4 border border-blue-200">
          <thead className="bg-blue-100">
            <tr>
              <th className="px-2 py-1 text-left border border-blue-200">Item Name</th>
              <th className="px-2 py-1 text-left border border-blue-200">Quantity</th>
            </tr>
          </thead>
          <tbody>
            {sfg?.raw_material_bom?.map((rm, rmIndex) => (
              <tr key={rmIndex}>
                <td className="px-2 py-1 border border-blue-200">
                  {rm?.raw_material_master?.item_name || rm?.raw_material_master}
                </td>
                <td className="px-2 py-1 border border-blue-200">{rm.rm_qty} units</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h4 className="text-sm font-medium text-blue-700 mb-2">Jobbers</h4>
        <table className="min-w-full text-sm border border-blue-200">
          <thead className="bg-blue-100">
            <tr>
              <th className="px-2 py-1 text-left border border-blue-200">Name</th>
              <th className="px-2 py-1 text-left border border-blue-200">Work</th>
              <th className="px-2 py-1 text-left border border-blue-200">Rate</th>
              <th className="px-2 py-1 text-left border border-blue-200">Description</th>
            </tr>
          </thead>
          <tbody>
            {sfg?.jobber_master_sfg?.map((jobber, jobberIndex) => (
              <tr key={jobberIndex}>
                <td className="px-2 py-1 border border-blue-200">
                  {jobber?.jobber_master?.jobber_name || jobber?.jobber_master}
                </td>
                <td className="px-2 py-1 border border-blue-200">{jobber.jobber_work_type}</td>
                <td className="px-2 py-1 border border-blue-200">₹{jobber.jobber_rate.toFixed(2)}</td>
                <td className="px-2 py-1 border border-blue-200">{jobber.jobber_description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </td>
  </tr>
)}

              {/* {expandedRows[index] && (
                <tr className={index % 2 === 0 ? "bg-white" : "bg-blue-50"}>
                  <td colSpan="6" className="px-4 py-2">
                    <div className="pl-4 border-l-2 border-blue-300 mb-3">
                      <h4 className="text-sm font-medium text-blue-700 mb-2">
                        Raw Materials
                      </h4>
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        {sfg?.raw_material_bom?.map((rm, rmIndex) => (
                          <div
                            key={rmIndex}
                            className="bg-blue-50 p-2 rounded text-sm"
                          >
                          <div>

                            <span className="font-medium">
                              {rm?.raw_material_master?.item_name || rm?.raw_material_master}:
                            </span>{" "}
                            <span>
                              {rm.rm_qty} units
                            </span>
                          </div>

                          </div>
                        ))}
                      </div>

                      <h4 className="text-sm font-medium text-blue-700 mb-2">
                        Jobbers
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {sfg?.jobber_master_sfg?.map((jobber, jobberIndex) => (
                          <div
                            key={jobberIndex}
                            className="bg-blue-50 p-2 rounded text-sm"
                          >
                            <div>
                              <span className="font-medium">Name: {" "} 
                                { jobber?.jobber_master?.jobber_name || jobber?.jobber_master }
                              </span>
                            </div>
                            <div>Work: {jobber.jobber_work_type}</div>
                            <div>Rate: ₹{jobber.jobber_rate.toFixed(2)}</div>
                            <div>Descripton: {jobber.jobber_description}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </td>
                </tr>
              )} */}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
