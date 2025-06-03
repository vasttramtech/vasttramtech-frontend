import React, { useEffect, useState } from "react";
import axios from "axios";
import { BounceLoader } from "react-spinners";
import NormalTable from "../../smartTable/NormalTable";

const TablesForRmSfg = ({ selectedData, fetchConvertId }) => {
  const [designData, setDesignData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expandedSfg, setExpandedSfg] = useState(null);

  // This was causing infinite API calls - using selectedData.id as dependency
  useEffect(() => {
    async function fetchDetails() {
      if (!selectedData?.id) return;

      try {
        setLoading(true);
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/design-masters/get-by-id/${selectedData.id}`
        );

        if (response.status === 200) {
          setDesignData(response.data);
        }
      } catch (error) {
        console.error("Error fetching design details:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDetails();
    
    // Only call fetchConvertId once when selectedData changes
    if (fetchConvertId) fetchConvertId();
  }, [selectedData?.id]); // Only depend on the ID, not the entire object

  const toggleExpandSfg = (sfgId) => {
    setExpandedSfg(expandedSfg === sfgId ? null : sfgId);
  };

  // Compact SFG Card with toggle
  const SfgItem = ({ sfg }) => (
    <div className="border rounded mb-2 overflow-hidden">
      <div 
        className="bg-gray-50 p-2 flex justify-between items-center cursor-pointer"
        onClick={() => toggleExpandSfg(sfg.id)}
      >
        <div>
          <span className="font-medium">{sfg.semi_finished_goods?.semi_finished_goods_name || "Unnamed"}</span>
          <span className="text-gray-700 ml-2">Qty: {sfg.qty}</span>
          <span className="text-gray-700 ml-2">Total Price: {sfg.total_price}</span>
        </div>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-4 w-4" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d={expandedSfg === sfg.id ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} 
          />
        </svg>
      </div>
      
      {expandedSfg === sfg.id && (
        <div className="p-2">
          {/* Jobbers Table */}
          {sfg.jobber_master_sfg?.length > 0 && (
            <div className="mb-2">
              <h4 className="font-medium uppercase text-gray-500 mb-1">Jobbers</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full border">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="p-1 border text-left">Name</th>
                      <th className="p-1 border text-left">Work Type</th>
                      <th className="p-1 border text-left">Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sfg.jobber_master_sfg.map((jobber) => (
                      <tr key={jobber.id} className="border-b">
                        <td className="p-1 border">{jobber.jobber_master?.jobber_name || "N/A"}</td>
                        <td className="p-1 border">{jobber.jobber_work_type || "N/A"}</td>
                        <td className="p-1 border">{jobber.jobber_rate || "N/A"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {/* Raw Materials Table */}
          {sfg.raw_material_bom?.length > 0 && (
            <div>
              <h4 className="font-medium uppercase text-gray-500 mb-1">Raw Materials</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full border">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="p-1 border text-left">Item</th>
                      <th className="p-1 border text-left">Group</th>
                      <th className="p-1 border text-left">Qty</th>
                      <th className="p-1 border text-left">Color</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sfg.raw_material_bom.map((material) => (
                      <tr key={material.id} className="border-b">
                        <td className="p-1 border">{material.raw_material_master?.item_name || "N/A"}</td>
                        <td className="p-1 border">{material.raw_material_master?.group?.group_name || "N/A"}</td>
                        <td className="p-1 border">{material.rm_qty || "N/A"}</td>
                        <td className="p-1 border">{material.raw_material_master?.color?.color_name || "N/A"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
  // console.log(designData)

  return (
    <div className="border border-gray-200 rounded p-3">
      {loading ? (
        <div className="flex justify-center items-center p-4">
          <BounceLoader size={20} />
        </div>
      ) : designData ? (
        <>
          {/* Design Info */}
          <div className="flex mb-3">
            {designData.image?.[0]?.url && (
              <div className="mr-3">
                <img 
                  src={designData.image[0].url} 
                  alt="Design" 
                  className="w-24 h-24 object-cover rounded border" 
                />
              </div>
            )}
            <div>
              <h3 className="font-bold">{designData.design_number}</h3>
              <div className="grid grid-cols-2 gap-x-4 mt-1">
                <div>Color: {designData.color?.color_name || "N/A"}</div>
                <div>Unit: {designData.unit?.unit_name || "N/A"}</div>
                <div>Cost: {designData.total_design_cost || 0}</div>
                <div>Description: {designData.description || "N/A"}</div>
              </div>
            </div>
          </div>
          
          {/* SFG Section */}
          <div>
            <h3 className="font-bold mb-2">Semi-Finished Goods</h3>
            {designData.semi_finished_goods_entries?.length > 0 ? (
              designData.semi_finished_goods_entries.map(sfg => (
                <SfgItem key={sfg.id} sfg={sfg} />
              ))
            ) : (
              <p className="text-gray-500">No semi-finished goods found</p>
            )}
          </div>
        </>
      ) : (
        <p className="text-gray-500 text-center p-2">No design selected</p>
      )}
    </div>
  );
};

export default TablesForRmSfg;