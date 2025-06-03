import React, {  useState } from "react";
import AddBOMSection from "./AddBOMSection";
import SFGDataTable from "../../master/component/SFGDataTable";
import { UploadIcon } from "lucide-react";

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

  const handleAddBOm = () => {
    setAllSavedSemiFinishedGoods((prev) => [...prev, ...SavedSfgData]);
    setAllSemiFinishedGoods([...allSemiFinishedGoods, ...FinalSFGData]);
    setsfglist([...sfglist, ...listedSFG]);
    setFinalSFGData([]);
    setSavedSfgData([]);
    setListedSFG([]);
    setShowAddBomModal(!showAddBomModal);
  };

  return (
    <div>
      <div className="fixed top-11 w-[90vw] max-h-[90vh] overflow-y-auto z-10 bg-gray-200 border border-gray-300 rounded-xl p-4">
        <div className="flex justify-between my-1 items-center">
          <h3 className="text-2xl font-bold">Add Bom</h3>
          <p
            className="text-xl px-2 border bg-red-600 rounded text-white hover:bg-red-500 cursor-pointer"
            onClick={() => {
              setShowAddBomModal(!showAddBomModal);
              setFinalSFGData([]);
              setSavedSfgData([]);
            }}
          >
            X
          </p>
        </div>
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

        {SavedSfgData &&
          Array.isArray(SavedSfgData) &&
          SavedSfgData.length > 0 && (
            <SFGDataTable
              onDeleteSfg={handleDeleteSfg}
              savedSfgData={SavedSfgData}
            />
          )}

        <div className="flex justify-center mt-4">
          <button
            className="px-5 py-3 flex  items-center gap-2 bg-blue-900 text-white rounded-md shadow-md hover:bg-blue-800 transition"
            onClick={handleAddBOm}
          >

            Add This BOMs <span><UploadIcon/></span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BOMSection;
