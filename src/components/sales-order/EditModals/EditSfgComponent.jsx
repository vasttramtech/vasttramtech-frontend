import { useEffect, useState } from "react";
import UpdateBOM from "./UpdateBOM";

const EditSfgComponent = ({
  index,
  token,
  sfgmGroup,
  allJobber,
  allRawMaterial,
  dataDesign,
  allSemiFinishedGoods,
  allSavedSemiFinishedGoods,
  setAllSemiFinishedGoods,
  setAllSavedSemiFinishedGoods,
  sfglist,
  setShowEditSfgModal,
  BillOfSaleStatus
}) => {
  const [SavedSfgData, setSavedSfgData] = useState([]);
  const [FinalSFGData, setFinalSFGData] = useState([]);
  const [individualsfg, setIndividualsfg] = useState();

  useEffect(() => {
    setIndividualsfg(sfglist[index]);
    // setIndividualsfg(dataDesign?.semi_finished_goods_entries[index]);
    setFinalSFGData(allSemiFinishedGoods[index]);
    setSavedSfgData(allSavedSemiFinishedGoods[index]);
  }, [dataDesign, allSemiFinishedGoods, allSavedSemiFinishedGoods, index]);

  // console.log("All saved semi data ",allSavedSemiFinishedGoods)
  return (
    <div className="z-10 shadow-lg rounded-md p-4 bg-gray-200 overflow-y-auto">
      <UpdateBOM
        token={token}
        sfgmGroup={sfgmGroup}
        SavedSfgData={SavedSfgData}
        FinalSFGData={FinalSFGData}
        setFinalSFGData={setFinalSFGData}
        setSavedSfgData={setSavedSfgData}
        allJobber={allJobber}
        allRawMaterial={allRawMaterial}
        IndividualSfg={individualsfg}
        DataSFg={dataDesign}
        setAllSavedSemiFinishedGoods={setAllSavedSemiFinishedGoods}
        setAllSemiFinishedGoods={setAllSemiFinishedGoods}
        AllSavedSemiFinishedGoods={allSavedSemiFinishedGoods}
        AllSemiFinishedGoods={setAllSemiFinishedGoods}
        index={index}
        setShowEditSfgModal={setShowEditSfgModal}
        BillOfSaleStatus={BillOfSaleStatus}
      />
    </div>
  );
};

export default EditSfgComponent;
