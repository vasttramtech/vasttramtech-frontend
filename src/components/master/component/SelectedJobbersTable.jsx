import React, { useState, useEffect } from "react";

const SelectedJobbersTable = ({
  selectedJobbers,
  updateJobberRate,
  removeJobber,
  onTotalCostChange,
  updateDescription,
}) => {
  const [totalJobberCost, setTotalJobberCost] = useState(0);

  const handleRateChange = (id, newRate) => {
    updateJobberRate(id, newRate);
  };

  // Calculate total cost whenever selected jobbers change
  useEffect(() => {
    const totalCost = selectedJobbers.reduce(
      (sum, jobber) => sum + (jobber?.Rate || 0) * (jobber.Qty || 1),
      0
    );
    setTotalJobberCost(totalCost);

    // Call the parent component's handler with the new total cost
    if (onTotalCostChange) {
      onTotalCostChange(totalCost);
    }
  }, [selectedJobbers, onTotalCostChange]);

  if (!selectedJobbers || selectedJobbers.length === 0) {
    return (
      <div className="w-full p-4 text-center border border-gray-300 rounded-md bg-gray-50">
        <p className="text-gray-500">No jobbers selected</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto border border-gray-300 rounded-lg shadow-sm">
      <table className="w-full text-sm text-gray-700">
        <thead className="bg-blue-500 text-white">
          <tr>
            <th className="py-2 px-4 text-left">Jobber Name</th>
            <th className="py-2 px-4 text-left">Jobber ID</th>
            <th className="py-2 px-4 text-left">Work Type</th>
            <th className="py-2 px-4 text-left">Address</th>
            <th className="py-2 px-4 text-left">Rate</th>
            <th className="py-2 px-4 text-left">Jobber Description</th>
          </tr>
        </thead>
        <tbody>
          {selectedJobbers.map((jobber, index) => (
            <tr
              key={index}
              className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
            >
              <td className="py-2 px-4">{jobber?.jobber_name}</td>
              <td className="py-2 px-4">{jobber?.jobber_id}</td>
              <td className="py-2 px-4">{jobber?.work_type}</td>
              <td className="py-2 px-4">{jobber?.jobber_address}</td>
              <td className="py-2 px-4">
                <input
                  type="number"
                  className="w-20 p-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={jobber.Rate || 0}
                  onChange={(e) =>
                    handleRateChange(jobber.id, parseFloat(e.target.value) || 0)
                  }
                />
              </td>
              <td className="py-2 px-4">
                <input
                  type="text"
                  className="w-full p-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={jobber.jobber_description}
                  onChange={(e) => updateDescription(jobber.id, e.target.value)}
                />
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot className="bg-gray-100 font-semibold">
          <tr>
            <td colSpan="5" className="py-2 px-4 text-right">
              Total Cost:
            </td>
            <td className="py-2 px-4">{totalJobberCost.toFixed(2)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default SelectedJobbersTable;
