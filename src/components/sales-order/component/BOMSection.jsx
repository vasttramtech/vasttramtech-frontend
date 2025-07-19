import React, { useEffect, useState } from "react";
import AddBOMSection from "./AddBOMSection";
import SFGDataTable from "../../master/component/SFGDataTable";
import { MdCancel } from "react-icons/md";

const BOMSection = ({
  token,
  allJobber,
  allRawMaterial,
  sfgmGroup,
  showAddBomModal,
  setShowAddBomModal,
  dataDesign,
  allSemiFinishedGoods,
  allSavedSemiFinishedGoods,
  setAllSavedSemiFinishedGoods,
  setAllSemiFinishedGoods,
  sfglist,
  setsfglist,
}) => {
  const [FinalSFGData, setFinalSFGData] = useState([]);
  const [SavedSfgData, setSavedSfgData] = useState([]);
  const [listedSFG, setListedSFG] = useState([]);

  //delet sfg
  const handleDeleteSfg = (index) => {
    const updatedSfgData = [...SavedSfgData];
    updatedSfgData.splice(index, 1);
    setSavedSfgData(updatedSfgData);
    const updatedfinalSfgdata = [...FinalSFGData];
    updatedfinalSfgdata.splice(index, 1);
    setFinalSFGData(updatedfinalSfgdata);
  };

  //   useEffect(() => {
  //     console.log("Ekkdum final data", FinalSFGData);
  //     console.log("Design Data", dataDesign);
  //   }, [FinalSFGData]);

  const handleAddBOm = () => {
    setAllSavedSemiFinishedGoods(prev => [...prev, ...SavedSfgData]);
    setAllSemiFinishedGoods([...allSemiFinishedGoods, ...FinalSFGData]);
    setsfglist([...sfglist, ...listedSFG]);
    setFinalSFGData([]);
    setSavedSfgData([]);
    setListedSFG([]);
    setShowAddBomModal(!showAddBomModal);
  };



  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-[2px] flex justify-center items-center z-40 transition-opacity duration-300">
      <div className="relative w-full max-w-3xl mx-auto max-h-[90vh] overflow-y-auto bg-white/90 border border-gray-100 p-5 shadow-2xl rounded-2xl
    animate-fade-in"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-gray-300 pb-2 mb-4">
          <h3 className="text-2xl font-bold text-blue-900 tracking-tight">Add Bom</h3>
          <button
            className=""
            aria-label="Close modal"
            onClick={() => {
              setShowAddBomModal(!showAddBomModal)
              setFinalSFGData([])
              setSavedSfgData([])
            }}
            type="button"
          >
            <MdCancel className=" text-red-500 w-6 h-6 hover:text-red-700 hover:scale-105 transition-all duration-200 ease-in-out" />
          </button>
        </div>

        {/* Add BOM Section (child component) */}
        <AddBOMSection
          token={token}
          allJobber={allJobber}
          allRawMaterial={allRawMaterial}
          sfgmGroup={sfgmGroup}
          FinalSFGData={FinalSFGData}
          setFinalSFGData={setFinalSFGData}
          SavedSfgData={SavedSfgData}
          setSavedSfgData={setSavedSfgData}
          dataDesign={dataDesign}
          allSemiFinishedGoods={allSemiFinishedGoods}
          allSavedSemiFinishedGoods={allSavedSemiFinishedGoods}
          listedSFG={listedSFG}
          setListedSFG={setListedSFG}
        />

        {/* SFG Data Table */}
        {SavedSfgData && Array.isArray(SavedSfgData) && SavedSfgData.length > 0 && (
          <div className="mt-6">
            <SFGDataTable
              onDeleteSfg={handleDeleteSfg}
              savedSfgData={SavedSfgData}
            />
          </div>
        )}

        {/* Modal Footer / Actions */}
        <div className="flex justify-end mt-8 border-t pt-4">
          <button
            className="px-6 py-2 bg-blue-800 text-white text-lg rounded-xl shadow-lg hover:bg-blue-600 focus:ring focus:ring-blue-300 
        active:scale-95 transition font-semibold tracking-wide"
            onClick={handleAddBOm}
          >
            Add All BOM
          </button>
        </div>
      </div>
    </div>

  );
};

export default BOMSection;
