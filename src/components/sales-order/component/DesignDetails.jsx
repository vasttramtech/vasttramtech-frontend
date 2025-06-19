import React, { useEffect, useState } from "react";
import axios from "axios";
import { BounceLoader } from "react-spinners";
import SFGdataTable from "./SFGdataTable";
import { toast } from "react-toastify";

const DesignDetails = ({
  selectedData,
  fetchConvertId,
  setShowEditTable,
  setEditSFGIndex,
  token,
  designData,
  setDesignData,
  allSemiFinishedGoods,
  setAllSemiFinishedGoods,
  SavedSfgData,
  setSavedSfgData,
  addBomData,
  setAddBomData,
  setShowAddBomModal,
  stockList,
  setapprovedsfg,
  setSFGstatusStock,
  setsfglist,
  sfgStock,
  sfgStockCategories,
  sfglist,
  fetchSFGStock,
  setSetOfNewlyAddedStockSfg,
  setOfNewlyAddedStockSfg,
  SalesOrderQty
}) => {
  const [loading, setLoading] = useState(false);

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
          // console.log("Design details",response.data);
          setsfglist(
            response.data?.semi_finished_goods_entries?.map(
              (item) => item.semi_finished_goods
            )
          );
          const transformedData =
            response.data?.semi_finished_goods_entries.map((entry) => ({
              semi_finished_goods:
                entry.semi_finished_goods?.semi_finished_goods_name || "",
              qty: Number(entry.qty),
              total_price: Number(entry.total_price),
              sfg_description: entry.sfg_description || "",
              color: entry?.color?.color_name,
              unit: entry?.unit?.unit_name,
              raw_material_bom: (entry.raw_material_bom || []).map((rm) => ({
                raw_material_id: rm.raw_material_master?.id || "",
                raw_material_master: rm.raw_material_master?.item_name || "",
                rm_qty: rm.rm_qty || 1,
                color: rm.raw_material_master?.color?.color_name || "",
                price_per_unit: rm.raw_material_master?.price_per_unit || "",
                unit: rm.raw_material_master?.unit?.unit_name || "",
              })),
              jobber_master_sfg: (entry.jobber_master_sfg || []).map(
                (jobber) => ({
                  jobber_master: jobber.jobber_master?.jobber_name || "",
                  jobber_rate: jobber.jobber_rate || 0,
                  jobber_work_type: jobber.jobber_work_type || "",
                  jobber_description: jobber.jobber_description || "",
                  jobber_id: jobber.jobber_master?.jobber_id || "",
                  jobber_address: jobber.jobber_master?.jobber_address || "",
                })
              ),
              color: entry.color,
            }));
          setSavedSfgData(transformedData);
          const savedData = response.data.semi_finished_goods_entries.map(
            (entry) => ({
              semi_finished_goods: entry?.semi_finished_goods?.id,
              qty: Number(entry?.qty),
              color: entry?.color?.id,
              total_price: Number(entry?.total_price),
              sfg_description: entry?.sfg_description,
              raw_material_bom: entry?.raw_material_bom.map((rm) => ({
                raw_material_master: rm?.raw_material_master?.id,
                rm_qty: rm?.rm_qty,
              })),
              jobber_master_sfg: entry?.jobber_master_sfg.map((jobber) => ({
                jobber_master: jobber?.jobber_master?.id,
                jobber_rate: jobber?.jobber_rate,
                jobber_work_type: jobber?.jobber_work_type,
                jobber_description: jobber?.jobber_description,
              })),
            })
          );
          setAllSemiFinishedGoods(savedData);
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

  const handleDeleteSfg = async (index) => {
    // setSetOfNewlyAddedStockSfg = { setSetOfNewlyAddedStockSfg };
    // setOfNewlyAddedStockSfg = { setOfNewlyAddedStockSfg };
    const updatedSfgData = [...SavedSfgData];
    const data = updatedSfgData[index];
    if (data.fromStock) {
      const postData = {
        id: data.sfg_stock_id,
        add_qty: (data.qty)* Number(SalesOrderQty),
      };
      if (!postData.id || !postData.add_qty) {
        toast.error("Please select the Semi finished goods and enter the qty.");
        return;
      }
      console.log(postData);
      try {
        setLoading(true);
        await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/api/custom/add-stock-sfg`,
          postData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success("Stock updated successfully");
        await fetchSFGStock();
      } catch (error) {
        console.log("Error fetching design details:", error);
        toast.error(
          error?.response?.data?.error?.message || "Error updating Stock"
        );
      } finally {
        setLoading(false);
      }
    }
    const set = setOfNewlyAddedStockSfg;
    if (set.has(index)) {
      set.delete(index);
      const array = Array.from(set);
      const update = array.map((item) => (item > index ? item - 1 : item));
      setSetOfNewlyAddedStockSfg(new Set(update));
    }
    updatedSfgData.splice(index, 1);
    setSavedSfgData(updatedSfgData);
    const updatedfinalSfgdata = [...allSemiFinishedGoods];
    updatedfinalSfgdata.splice(index, 1);
    setAllSemiFinishedGoods(updatedfinalSfgdata);
    const updatedSfgList = [...sfglist];
    updatedSfgList.splice(index, 1);
    setsfglist(updatedSfgList);
  };

  return (
    <div className="border border-gray-300 shadow-md rounded-lg p-3">
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
            <SFGdataTable
              savedSfgData={SavedSfgData}
              onDeleteSfg={handleDeleteSfg}
              setEditSFg={setShowEditTable}
              setSFGIndex={setEditSFGIndex}
              addBomData={addBomData}
              setAddBomData={setAddBomData}
              setShowAddBomModal={setShowAddBomModal}
              stockList={stockList}
              setapprovedSFG={setapprovedsfg}
              setSFGstatusStock={setSFGstatusStock}
              sfgStock={sfgStock}
              sfgStockCategories={sfgStockCategories}
              allSemiFinishedGoods={allSemiFinishedGoods}
            />
          </div>
        </>
      ) : (
        <p className="text-gray-500 text-center p-2">No design selected</p>
      )}
    </div>
  );
};

export default DesignDetails;
