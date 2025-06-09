import React, { useState } from "react";
import {
  CheckCircle,
  XCircle,
  Eye,
  X,
  Package,
  User,
  Wrench,
} from "lucide-react";

export default function ConvertIDSfgDataTable({
  allSavedSemiFinishedGoods,
  allSemiFinishedGoods,
  sfglist,
  convertId,
}) {
  const [selectedSfg, setSelectedSfg] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const openModal = (sfg, index) => {
    setSelectedSfg({ ...sfg, index });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedSfg(null);
  };

  if (!allSavedSemiFinishedGoods || allSavedSemiFinishedGoods.length === 0) {
    return (
      <div className="p-4 text-center bg-blue-50 rounded-md border border-blue-200">
        <p className="text-blue-700">No semi-finished goods data available.</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 bg-blue-600 border-b border-blue-200">
          <h3 className="text-lg font-semibold text-white flex items-center">
            <Package className="mr-2" size={20} />
            Semi-Finished Goods Details
            {convertId && (
              <span className="ml-4 text-sm bg-blue-500 px-3 py-1 rounded-full">
                Convert ID: {convertId}
              </span>
            )}
          </h3>
        </div>
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
                BOM Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                Stock Status
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
            {allSavedSemiFinishedGoods.map((sfg, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? "bg-white" : "bg-blue-50"}
              >
                <td className="px-4 py-3 text-sm font-medium text-gray-800">
                  {sfg.semi_finished_goods}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {sfg?.color?.color_name || "N/A"}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">{sfg.qty}</td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  ₹{sfg?.total_price?.toFixed(2)}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700 max-w-xs truncate">
                  {sfg.sfg_description || "N/A"}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {sfg.bom_status !== undefined
                    ? String(sfg.bom_status)
                    : "N/A"}
                </td>
                <td className={`px-2 py-1 text-sm text-white`}>
                  {sfg.stock_status === true
                    ? <span className="bg-green-400 rounded-lg px-1 py-1">Deducted</span>
                    : sfg.stock_status === false
                    ? <span className="bg-red-400 rounded-lg px-1 py-1">Not Deducted</span>
                    : <span className="bg-gray-400 rounded-lg px-1 py-1">N/A</span>}
                </td>

                <td className="px-4 py-3 text-sm">
                  <div className="bg-blue-50 p-2 rounded text-sm border border-gray-400 flex flex-col items-start justify-center">
                    {sfg.jobber_master_sfg &&
                    sfg.jobber_master_sfg.length > 0 ? (
                      sfg.jobber_master_sfg
                        .slice(0, 2)
                        .map((jobber, jobberIndex) => (
                          <span key={jobberIndex} className="text-xs">
                            <span className="font-semibold text-green-600">
                              {jobber.jobber_master}
                            </span>{" "}
                            -{" "}
                            <span className="font-semibold text-gray-800">
                              {jobber.jobber_work_type}
                            </span>
                          </span>
                        ))
                    ) : (
                      <span className="text-xs text-gray-500">No jobbers</span>
                    )}
                    {sfg.jobber_master_sfg &&
                      sfg.jobber_master_sfg.length > 2 && (
                        <span className="text-xs text-blue-600 font-medium">
                          +{sfg.jobber_master_sfg.length - 2} more
                        </span>
                      )}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-center">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      openModal(sfg, index);
                    }}
                    className="p-1 text-blue-600 hover:text-blue-800 rounded-full hover:bg-blue-50"
                    aria-label="View Details"
                  >
                    <Eye size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && selectedSfg && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-6xl max-h-[90vh] overflow-y-auto m-4 w-full">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-blue-600 text-white flex justify-between items-center">
              <h3 className="text-lg font-semibold flex items-center">
                <Package className="mr-2" size={20} />
                SFG Details: {selectedSfg.semi_finished_goods}
              </h3>
              <button
                onClick={closeModal}
                className="text-white hover:text-gray-200 rounded-full p-1"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Basic Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-gray-800 mb-3">
                  Basic Information
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-600">SFG Name:</span>
                    <p className="text-gray-800">
                      {selectedSfg.semi_finished_goods}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Color:</span>
                    <p className="text-gray-800">
                      {selectedSfg?.color?.color_name || "N/A"}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Quantity:</span>
                    <p className="text-gray-800">{selectedSfg.qty}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Unit:</span>
                    <p className="text-gray-800">{selectedSfg.unit || "N/A"}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">
                      Total Price:
                    </span>
                    <p className="text-gray-800">
                      ₹{selectedSfg?.total_price?.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">
                      BOM Status:
                    </span>
                    <p className="text-gray-800">
                      {selectedSfg.bom_status !== undefined
                        ? String(selectedSfg.bom_status)
                        : "N/A"}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">
                      Stock Status:
                    </span>
                    <p className="text-gray-800">
                      {selectedSfg?.stock_status === undefined
                        ? "N/A"
                        : selectedSfg.stock_status === true
                        ? "Deducted"
                        : "Not Deducted"}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <span className="font-medium text-gray-600">
                      Description:
                    </span>
                    <p className="text-gray-800">
                      {selectedSfg.sfg_description || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Raw Materials BOM */}
              {selectedSfg.raw_material_bom &&
                selectedSfg.raw_material_bom.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                      <Package className="mr-2" size={18} />
                      Raw Materials BOM
                    </h4>
                    <div className="bg-white rounded border overflow-hidden">
                      <table className="min-w-full text-sm">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="px-4 py-3 text-left font-medium text-gray-700">
                              Material Name
                            </th>
                            <th className="px-4 py-3 text-left font-medium text-gray-700">
                              Color
                            </th>
                            <th className="px-4 py-3 text-left font-medium text-gray-700">
                              Quantity
                            </th>
                            <th className="px-4 py-3 text-left font-medium text-gray-700">
                              Unit
                            </th>
                            <th className="px-4 py-3 text-left font-medium text-gray-700">
                              Price/Unit
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {selectedSfg.raw_material_bom.map((rm, rmIndex) => (
                            <tr key={rmIndex} className="hover:bg-gray-50">
                              <td className="px-4 py-3 text-gray-800 font-medium">
                                {rm.raw_material_master}
                              </td>
                              <td className="px-4 py-3 text-gray-600">
                                {rm.color || "N/A"}
                              </td>
                              <td className="px-4 py-3 text-gray-600">
                                {rm.rm_qty}
                              </td>
                              <td className="px-4 py-3 text-gray-600">
                                {rm.unit || "N/A"}
                              </td>
                              <td className="px-4 py-3 text-gray-600">
                                ₹{rm.price_per_unit || "0.00"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

              {/* Jobber Information */}
              {selectedSfg.jobber_master_sfg &&
                selectedSfg.jobber_master_sfg.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                      <User className="mr-2" size={18} />
                      Jobber Information
                    </h4>
                    <div className="bg-white rounded border overflow-hidden">
                      <table className="min-w-full text-sm">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="px-4 py-3 text-left font-medium text-gray-700">
                              Jobber Name
                            </th>
                            <th className="px-4 py-3 text-left font-medium text-gray-700">
                              Jobber ID
                            </th>
                            <th className="px-4 py-3 text-left font-medium text-gray-700">
                              Work Type
                            </th>
                            <th className="px-4 py-3 text-left font-medium text-gray-700">
                              Rate
                            </th>
                            <th className="px-4 py-3 text-left font-medium text-gray-700">
                              Address
                            </th>
                            <th className="px-4 py-3 text-left font-medium text-gray-700">
                              Status
                            </th>
                            <th className="px-4 py-3 text-left font-medium text-gray-700">
                              Description
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {selectedSfg.jobber_master_sfg.map(
                            (jobber, jobberIndex) => (
                              <tr
                                key={jobberIndex}
                                className="hover:bg-gray-50"
                              >
                                <td className="px-4 py-3 text-gray-800 font-medium">
                                  {jobber.jobber_master}
                                </td>
                                <td className="px-4 py-3 text-gray-600">
                                  {jobber.jobber_id || "N/A"}
                                </td>
                                <td className="px-4 py-3">
                                  <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                    <Wrench className="mr-1" size={12} />
                                    {jobber.jobber_work_type}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-gray-600">
                                  ₹{jobber.jobber_rate || "0.00"}
                                </td>
                                <td className="px-4 py-3 text-gray-600 max-w-xs truncate">
                                  {jobber.jobber_address || "N/A"}
                                </td>
                                <td className="px-4 py-3">
                                  {jobber.completed !== undefined && (
                                    <span
                                      className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                                        jobber.completed === "Complete"
                                          ? "bg-green-100 text-green-800"
                                          : "bg-yellow-100 text-yellow-800"
                                      }`}
                                    >
                                      {jobber?.completed}
                                    </span>
                                  )}
                                </td>
                                <td className="px-4 py-3 text-gray-600 max-w-xs truncate">
                                  {jobber.jobber_description || "N/A"}
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t flex justify-end">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
