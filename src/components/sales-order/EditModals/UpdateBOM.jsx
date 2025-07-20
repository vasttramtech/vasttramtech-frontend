import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import FormLabel from "../../purchase/FormLabel";
import { BounceLoader } from "react-spinners";
import axios from "axios";
import SelectionTable from "./SelectionTable";
import SelectedJobbersTable from "./SelectedJobbersTable";
import SelectedRawMaterialsTable from "./SelectedRawMaterialsTable";
import { GrUpdate } from "react-icons/gr";
import { MdCancel } from "react-icons/md";

const rawmaterialHeader = [
  "Item Name",
  "Price Per Unit",
  "Unit",
  "Color",
  "Group",
  "HSN/SAC Code",
];

const jobberHeader = ["Jobber Name", "Jobber ID", "Work Type", "Address"];

const UpdateBOM = ({
  token,
  sfgmGroup,
  SavedSfgData,
  setSavedSfgData,
  FinalSFGData,
  setFinalSFGData,
  allJobber,
  allRawMaterial,
  IndividualSfg,
  DataSFg,
  setAllSemiFinishedGoods,
  setAllSavedSemiFinishedGoods,
  AllSemiFinishedGoods,
  AllSavedSemiFinishedGoods,
  index,
  setShowEditSfgModal,
  BillOfSaleStatus
}) => {
  const [sfgLoader, setSfgLoader] = useState(false);
  const [availableSFG, setAvailableSFG] = useState([]);
  const [sfgMaterials, setsfgMaterials] = useState([]);
  // const [sfgColors, setSfgColors] = useState([]);
  const [availableSFGBasedOnMaterial, setAvailableSFGBasedOnMaterial] =
    useState([]);
  const [availableSFGBasedOnColor, setAvailableSFGBasedOnColor] = useState();
  //   console.log(SavedSfgData);

  // Raw Material States
  const [rawMaterialSetOfSelectedIndex, setRawMaterialSetOfSelectedIndex] =
    useState(new Set());
  const [selectedRawMaterialRow, setSelectedRawMaterialRow] = useState([]);
  const [finalSelectedRawMaterials, setFinalSelectedRawMaterials] = useState(
    []
  );
  const [displayRawMaterialModal, setDisplayRawMaterialModal] = useState(false);

  // Jobber States
  const [jobberSetOfSelectedIndex, setJobberSetOfSelectedIndex] = useState(
    new Set()
  );
  const [selectedJobberRow, setSelectedJobberRow] = useState([]);
  const [finalSelectedJobbers, setFinalSelectedJobbers] = useState([]);
  const [displayJobberModal, setDisplayJobberModal] = useState(false);

  // Cost Tracking
  const [rawMaterialTotalCost, setRawMaterialTotalCost] = useState(0);
  const [jobberTotalCost, setJobberTotalCost] = useState(0);
  const [overallTotalCost, setOverallTotalCost] = useState(0);
  const [nonUpdateJobber, setNonUpdateJobber] = useState([]);

  const [colors, setColors] = useState([]);

  // state for BOM's Semi finished goods master
  const [SfgData, setSfgData] = useState({
    sfg_group: "",
    sfg_material_name: "",
    sfg_material: "",
    sfg_color: "",
    sfg_color1: "",
    sfg_qty: 0,
    // sfg_total_cost:"",
    sfg_description: "",
  });

  useEffect(() => {
    if (!IndividualSfg) return;
    setSfgData({
      sfg_group: IndividualSfg?.group?.id,
      sfg_material_name: IndividualSfg?.semi_finished_goods_name,
      sfg_material: IndividualSfg?.id,
      sfg_color1: FinalSFGData?.color,
      sfg_qty: Number(FinalSFGData.qty),
      sfg_description: FinalSFGData?.sfg_description,
    });

    setAvailableSFGBasedOnColor(IndividualSfg);
    // console.log(FinalSFGData)

    const selectedIds = new Set(
      FinalSFGData?.raw_material_bom.map((row) => row?.raw_material_master)
    );

    const selectedJobbers = new Set(
      FinalSFGData?.jobber_master_sfg?.map((row) => row?.jobber_master)
    );
    // console.log(FinalSFGData)

    setFinalSelectedRawMaterials(
      FinalSFGData?.raw_material_bom?.map((row, ind) => ({
        item_name: SavedSfgData?.raw_material_bom[ind]?.raw_material_master,
        id: row?.raw_material_master,
        raw_material_master: row?.raw_material_master,
        color: SavedSfgData?.raw_material_bom[ind]?.color,
        unit: SavedSfgData?.raw_material_bom[ind]?.unit,
        price_per_unit: SavedSfgData?.raw_material_bom[ind]?.price_per_unit,
        Qty: row?.rm_qty,
        Total:
          row?.rm_qty * SavedSfgData?.raw_material_bom[ind]?.price_per_unit,
      }))
    );

    setFinalSelectedJobbers(
      FinalSFGData?.jobber_master_sfg?.map((row, ind) => ({
        id: row?.jobber_master,
        jobber_master: row?.jobber_master,
        Rate: row?.jobber_rate,
        jobber_description: row.jobber_description || "",
        jobber_name: SavedSfgData?.jobber_master_sfg[ind]?.jobber_master,
        jobber_id: row?.jobber_master,
        work_type: row?.jobber_work_type,
        jobber_address: SavedSfgData?.jobber_master_sfg[ind]?.jobber_address,
        completed: SavedSfgData?.jobber_master_sfg[ind]?.completed,
      }))
    );

    setJobberSetOfSelectedIndex(
      new Set(
        allJobber
          .map((row, index) => (selectedJobbers.has(row.id) ? index : null))
          .filter((index) => index !== null)
      )
    );
    setRawMaterialSetOfSelectedIndex(
      new Set(
        allRawMaterial
          .map((row, index) => (selectedIds.has(row.id) ? index : null))
          .filter((index) => index !== null)
      )
    );
    // console.log(SavedSfgData)
  }, [IndividualSfg]);

  useEffect(() => {
    const newset = finalSelectedJobbers.reduce((acc, row) => {
      if (row.completed == "Complete" || row.completed == "Processing")
        acc.push(row.id);
      return acc;
    }, []);
    setNonUpdateJobber(newset);
  }, [finalSelectedJobbers]);

  // const sfgDataHandler = (event) => {
  //   event.preventDefault();
  //   const { name, value } = event.target;

  //   if (name === "sfg_group") {
  //     setSfgData({
  //       ...SfgData,
  //       [name]: value,
  //       sfg_material: "",
  //       sfg_color1: "",
  //       sfg_qty: 0,
  //       sfg_description: "",
  //     });
  //   } else if (name === "sfg_material") {
  //     setSfgData({
  //       ...SfgData,
  //       [name]: value,
  //       sfg_color1: "",
  //       sfg_qty: 0,
  //     });
  //   } else if (name === "sfg_color") {
  //     setSfgData({
  //       ...SfgData,
  //       [name]: value,
  //       sfg_qty: 0,
  //     });
  //   } else {
  //     setSfgData({ ...SfgData, [name]: value });
  //   }
  // };

  // Raw Material Selection Functions

  const sfgDataHandler = (event) => {
    event.preventDefault();
    const { name, value } = event.target;

    // Convert numeric fields
    const numericValue = name === "sfg_qty" ? parseFloat(value) || 0 : value;

    if (name === "sfg_group") {
      setSfgData({
        ...SfgData,
        sfg_material_name: "",
        [name]: value,
        sfg_material: "",
        sfg_color1: "",
        sfg_qty: 0,
        sfg_description: "",
      });
    } else if (name === "sfg_material") {
      setSfgData({
        ...SfgData,
        [name]: value,
        sfg_color1: "",
        sfg_qty: 0,
      });
    } else if (name === "sfg_color") {
      setSfgData({
        ...SfgData,
        [name]: value,
        sfg_qty: 0,
      });
    } else if (name === "sfg_qty") {
      const newQty = parseFloat(value) || 0;

      // Calculate ratio-based updated RM list
      const updatedRM = finalSelectedRawMaterials.map((rm) => {
        // Assume we store the initial ratio when first added
        const initialRatio = rm.Qty / (SfgData.sfg_qty || 1); // fallback for 0

        const updatedQty = initialRatio * newQty;
        const updatedTotal = updatedQty * rm.price_per_unit;

        return {
          ...rm,
          Qty: parseFloat(updatedQty.toFixed(2)),
          Total: parseFloat(updatedTotal.toFixed(2)),
        };
      });

      // Update both SfgData and raw materials
      setSfgData({ ...SfgData, sfg_qty: newQty });
      setFinalSelectedRawMaterials(updatedRM);
    } else {
      setSfgData({ ...SfgData, [name]: value });
    }
  };

  function handleSaveRawMaterialSelection() {
    try {
      const selectedIds = new Set(
        finalSelectedRawMaterials?.map((row) => row.id)
      );

      const updatedFinalData = selectedRawMaterialRow.map((row) => {
        if (selectedIds.has(row.id)) {
          return finalSelectedRawMaterials?.filter(
            (item) => item.id === row.id
          )[0];
        } else {
          return {
            ...row,
            Qty: row.Qty || 1,
            Total: (row.price_per_unit || 0) * (row.Qty || 1),
          };
        }
      });
      setFinalSelectedRawMaterials(updatedFinalData);
      setDisplayRawMaterialModal(false);
    } catch (error) {
      console.error(
        "Unexpected error in processing raw material selection:",
        error
      );
      toast.error("Unexpected error while saving raw material selection.");
    }
  }

  const updateRawMaterialQty = (id, newQty) => {
    setFinalSelectedRawMaterials(
      finalSelectedRawMaterials?.map((row) =>
        row.id === id
          ? {
            ...row,
            Qty: newQty,
            Total: newQty * (row.price_per_unit || 0),
          }
          : row
      )
    );
  };

  const removeRawMaterial = (id) => {
    setFinalSelectedRawMaterials(
      finalSelectedRawMaterials?.filter((row) => row.id !== id)
    );
    setSelectedRawMaterialRow(
      selectedRawMaterialRow.filter((row) => row.id !== id)
    );
  };

  function handleSelectRawMaterial() {
    setSelectedRawMaterialRow(finalSelectedRawMaterials);
    setDisplayRawMaterialModal(true);
  }

  const handleRawMaterialTotalCostChange = (totalCost) => {
    setRawMaterialTotalCost(totalCost);
  };

  function handleSaveJobberSelection() {
    try {
      const selectedIds = new Set(finalSelectedJobbers.map((row) => row.id));

      const updatedFinalJobbers = selectedJobberRow.map((row) => {
        if (selectedIds.has(row.id)) {
          return finalSelectedJobbers.filter((item) => item.id === row.id)[0];
        } else {
          return {
            ...row,
            Rate: row.Rate || 0,
            jobber_description: row.jobber_description || "",
          };
        }
      });
      setFinalSelectedJobbers(updatedFinalJobbers);
      setDisplayJobberModal(false);
    } catch (error) {
      console.error("Unexpected error in processing jobber selection:", error);
      toast.error("Unexpected error while saving jobber selection.");
    }
  }

  const updateJobberRate = (id, newRate) => {
    setFinalSelectedJobbers(
      finalSelectedJobbers.map((row) =>
        row.id === id
          ? {
            ...row,
            Rate: newRate,
          }
          : row
      )
    );
  };

  const updateDescription = (id, value) => {
    setFinalSelectedJobbers(
      finalSelectedJobbers.map((row) =>
        row.id === id
          ? {
            ...row,
            jobber_description: value,
          }
          : row
      )
    );
  };
  //   console.log(finalSelectedJobbers);
  const removeJobber = (id) => {
    setFinalSelectedJobbers(
      finalSelectedJobbers.filter((row) => row.id !== id)
    );
    setSelectedJobberRow(selectedJobberRow.filter((row) => row.id !== id));
  };
  //   console.log("xh", nonUpdateJobber);
  function handleSelectJobber() {
    setSelectedJobberRow(finalSelectedJobbers);
    setDisplayJobberModal(true);
  }

  // Handle jobber total cost change
  const handleJobberTotalCostChange = (totalCost) => {
    setJobberTotalCost(totalCost);
  };

  const fetchIndividualGroupData = async () => {
    try {
      if (!SfgData.sfg_group) {
        return;
      }

      setSfgLoader(true);
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/custom-semi-finished-goods/group/${SfgData.sfg_group}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response || !response.data) {
        setAvailableSFG([]);
      } else {
        setAvailableSFG(response.data);
      }
    } catch (error) {
      console.error("Error fetching SFG data:", error);
    } finally {
      setSfgLoader(false);
    }
  };

  // Fetching color data
  const fetchColorData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/colors?populate=*`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log("Color Data", response.data.data);
      if (!response || !response.data.data) {
        setColors([]);
      } else {
        setColors(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching color data:", error);
    }
  };

  useEffect(() => {
    fetchColorData();
  }, []);


  const updateSFGdata = (event) => {
    if (event) event.preventDefault();

    if (
      !SfgData.sfg_group ||
      !SfgData.sfg_color1 ||
      !SfgData.sfg_material ||
      !SfgData.sfg_qty ||
      !SfgData.sfg_total_cost
    ) {
      toast.error("Please fill all the fields.");
      return;
    }

    console.log(AllSemiFinishedGoods[index]);

    const newSfgEntry = {
      semi_finished_goods: Number(availableSFGBasedOnMaterial[0].id),
      qty: Number(SfgData.sfg_qty),
      total_price: Number(SfgData.sfg_total_cost),
      sfg_description: SfgData.sfg_description,
      raw_material_bom: finalSelectedRawMaterials?.map((item) => ({
        raw_material_master: item.id,
        rm_qty: item.Qty || 1,
      })),
      jobber_master_sfg: finalSelectedJobbers.map((item) => ({
        completed: item.completed || "Incomplete",
        jobber_master: item.id,
        jobber_rate: item.Rate || 0,
        jobber_work_type: item.work_type,
        jobber_description: item.jobber_description || "",
      })),
      color: Number(SfgData.sfg_color1),
      bom_status: FinalSFGData?.bom_status || "in_process",
      processes: FinalSFGData?.processes || [],
    };

    console.log("New SFG Entry", newSfgEntry);
    setFinalSFGData(newSfgEntry);
    setAllSemiFinishedGoods((prev) =>
      prev.map((item, ind) => (ind === index ? newSfgEntry : item))
    );
    const color_name = colors.filter(
      (item) => item.id == SfgData.sfg_color1
    )[0];
    const payload = {
      semi_finished_goods: availableSFGBasedOnColor.semi_finished_goods_name,
      qty: Number(SfgData.sfg_qty),
      total_price: Number(SfgData.sfg_total_cost),
      sfg_description: SfgData.sfg_description,
      raw_material_bom: finalSelectedRawMaterials?.map((rm) => ({
        raw_material_id: rm?.id,
        raw_material_master: rm?.item_name || "",
        rm_qty: rm.Qty || 1,
        color: rm?.color || "",
        price_per_unit: rm?.price_per_unit || "",
        unit: rm?.unit || "",
      })),
      jobber_master_sfg: finalSelectedJobbers.map((jobber) => ({
        ...jobber,
        jobber_master: jobber?.jobber_name || "",
        jobber_rate: jobber.Rate || 0,
        jobber_work_type: jobber.work_type || "",
        jobber_description: jobber.jobber_description || "",
        jobber_id: jobber?.jobber_id || "",
        jobber_address: jobber?.jobber_address || "",
      })),
      color: color_name || "",
    };

    console.log("Payload to be saved:", payload);
    setSavedSfgData(payload);
    setAllSavedSemiFinishedGoods((prev) =>
      prev.map((item, ind) =>
        ind === index ? JSON.parse(JSON.stringify({ ...item, ...payload })) : item
      )
    );
    console.log("Updated SavedSfgData:", AllSavedSemiFinishedGoods);

    // Clear selected items after adding SFG
    setFinalSelectedRawMaterials([]);
    setFinalSelectedJobbers([]);
    setJobberSetOfSelectedIndex(new Set());
    setRawMaterialSetOfSelectedIndex(new Set());
    setAvailableSFG([]);
    setSelectedJobberRow([]);
    setSelectedRawMaterialRow([]);
    setFinalSelectedJobbers([]);
    setFinalSelectedRawMaterials([]);

    // Reset other state
    setAvailableSFGBasedOnMaterial([]);
    setAvailableSFGBasedOnColor(null);
    // setSfgColors([]);
    setsfgMaterials([]);

    setSfgData({
      sfg_group: "",
      sfg_material_name : "",
      sfg_material: "",
      sfg_color1: "",
      sfg_qty: 0,
      sfg_total_cost: "",
      sfg_description: "",
    });
    setShowEditSfgModal(false);
  };

  // Effect to fetch data when SFG group changes
  useEffect(() => {
    if (SfgData.sfg_group) {
      fetchIndividualGroupData();
    }
  }, [SfgData.sfg_group]);

  // Effect to update materials when available SFG changes
  useEffect(() => {
    if (availableSFG.length > 0) {
      const options = new Set();
      availableSFG.forEach((sfg) => {
        options.add(sfg.semi_finished_goods_name);
      });
      setsfgMaterials(Array.from(options));
    } else {
      setsfgMaterials([]);
    }
  }, [availableSFG]);

  // Effect to update when material changes
  useEffect(() => {
    if (SfgData.sfg_material) {
      const filteredSFG = availableSFG.filter(
        (sfg) => sfg.id === SfgData.sfg_material
      );
      setAvailableSFGBasedOnMaterial(filteredSFG);
    } else {
      setAvailableSFGBasedOnMaterial([]);
      // setSfgColors([]);
    }
  }, [SfgData.sfg_material, availableSFG]);

  // Update overall total cost when any components change
  useEffect(() => {
    setOverallTotalCost(rawMaterialTotalCost + jobberTotalCost);
    const totalRawMaterial = finalSelectedRawMaterials?.reduce(
      (sum, item) => sum + (item.Qty || 0),
      0
    );
    const totalCost = rawMaterialTotalCost + jobberTotalCost * totalRawMaterial;
    setSfgData({
      ...SfgData,
      sfg_total_cost: totalCost,
    });
  }, [
    rawMaterialTotalCost,
    jobberTotalCost,
    finalSelectedJobbers,
    finalSelectedRawMaterials,
  ]);

  console.log(finalSelectedRawMaterials);

  //  useEffect(() => {
  //   const newSfgQty = SfgData.sfg_qty;
  //   if (!newSfgQty || newSfgQty <= 0) return;

  //   const updated = finalSelectedRawMaterials.map((material) => {
  //     const initialRatio = material.Qty / initialSfgQtyRef.current;
  //     const newQty = newSfgQty * initialRatio;
  //     const newTotal = newQty * material.price_per_unit;

  //     return {
  //       ...material,
  //       Qty: parseFloat(newQty.toFixed(2)),
  //       Total: parseFloat(newTotal.toFixed(2))
  //     };
  //   });

  //   setFinalSelectedRawMaterials(updated);
  // }, [SfgData.sfg_qty]);

  return (
    <div>
      {/* Raw Material Selection Modal */}
      {displayRawMaterialModal && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50">
          <div className="relative w-[90vw] bg-gray-200 border shadow-2xl p-4 rounded-lg">
            <button
              className="absolute top-2 right-2 text-gray-700 hover:text-red-500 text-2xl font-bold"
              onClick={() => setDisplayRawMaterialModal(false)}
            >
              ✖
            </button>

            <div className="mt-8">
              <h2 className="text-xl font-bold mb-4 text-center">
                Select Raw Materials
              </h2>
              <SelectionTable
                NoOfColumns={rawmaterialHeader.length}
                data={allRawMaterial}
                headers={rawmaterialHeader}
                setSelectedRow={setSelectedRawMaterialRow}
                setOfSelectedIndex={rawMaterialSetOfSelectedIndex}
                setSetOfSelectedIndex={setRawMaterialSetOfSelectedIndex}
              />
            </div>

            <div className="flex justify-center items-center mt-4">
              <button
                type="button"
                className="bg-gray-400 border border-gray-700 px-4 py-1 rounded hover:bg-gray-300"
                onClick={handleSaveRawMaterialSelection}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Jobber Selection Modal */}
      {displayJobberModal && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50">
          <div className="relative w-[90vw] bg-gray-200 border shadow-2xl p-4 rounded-lg">
            <button
              className="absolute top-2 right-2 text-red-700 hover:text-red-500 hover:scale-105 duration-200 ease-in-out transition-all text-2xl font-bold"
              onClick={() => setDisplayJobberModal(false)}
            >
              <MdCancel className="w-8 h-8" />
            </button>

            <div className="">
              <h2 className="text-xl font-bold mb-4 text-center text-blue-900 border-b border-b-gray-300 pb-2">
                Select Jobbers
              </h2>
              <SelectionTable
                NoOfColumns={jobberHeader.length}
                data={allJobber}
                headers={jobberHeader}
                setSelectedRow={setSelectedJobberRow}
                setOfSelectedIndex={jobberSetOfSelectedIndex}
                setSetOfSelectedIndex={setJobberSetOfSelectedIndex}
                NonUpdatableId={nonUpdateJobber}
              />
            </div>

            <div className="flex justify-center items-center mt-4">
              <button
                type="button"
                className="bg-blue-900 px-4 py-1 rounded hover:bg-blue-700 duration-200 ease-in-out transition-all text-white"
                onClick={handleSaveJobberSelection}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}


      {sfgLoader ? (
        <div className="flex h-screen justify-center items-center ">
          <BounceLoader className="text-blue-900" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-6">
            {/* SFG Group */}
            <div className="flex flex-col">
              <FormLabel title={"SFG Group"} />
              <select
                name="sfg_group"
                className="border border-gray-300 bg-gray-100 rounded-md p-2 text-gray-500"
                // onChange={sfgDataHandler}
                value={SfgData.sfg_group}
                disabled
              >
                <option value="" disabled>
                  Select SFG Group
                </option>
                {sfgmGroup &&
                  Array.isArray(sfgmGroup) &&
                  sfgmGroup.map((group, index) => (
                    <option key={index} value={group.id}>
                      {group.group_name}
                    </option>
                  ))}
              </select>
            </div>

            {/* SFG Material */}
            <div className="flex flex-col">
              <label className="text-gray-700 font-semibold">
                SFG Material
              </label>
              {/* <input type="text" className="border border-gray-300 bg-gray-100 rounded-md p-2 text-gray-500" name="sfg_material" value={SfgData.sfg_material} disabled></input> */}
              <select
                name="sfg_material"
                // onChange={sfgDataHandler}
                value={SfgData.sfg_material_name}
                className="border border-gray-300 bg-gray-100 rounded-md p-2 text-gray-500"
                disabled
              >
                <option value="" disabled>
                  Select SFG Material
                </option>
                {sfgMaterials &&
                  sfgMaterials.length > 0 &&
                  sfgMaterials.map((item, index) => (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  ))}
              </select>
            </div>

            {/* Color1 */}
            <div className="flex flex-col">
              <label className="text-gray-700 font-semibold">Color</label>
              <select
                name="sfg_color1"
                className="border border-gray-300 bg-gray-100 rounded-md p-2 text-gray-500"
                onChange={sfgDataHandler}
                value={SfgData.sfg_color1}
              >
                <option value="" disabled>
                  Select Color
                </option>
                {colors &&
                  colors.length > 0 &&
                  colors.map((item, idx) => (
                    <option key={idx} value={item.id}>
                      {item.color_name}
                    </option>
                  ))}
              </select>
            </div>

            {/* Qty */}
            <div className="flex flex-col">
              <label className="text-gray-700 font-semibold">Qty</label>
              <input
                className="p-2 border bg-gray-100 border-gray-300 rounded-md"
                type="number"
                placeholder="0.0"
                name="sfg_qty"
                onChange={sfgDataHandler}
                value={SfgData.sfg_qty}
                readOnly={BillOfSaleStatus}
              />
            </div>

            {/* Sfg Description */}
            <div className="flex flex-col col-span-2">
              <label className="text-gray-700 font-semibold">Remarks</label>
              <textarea
                className="p-2 border bg-gray-100 border-gray-300 rounded-md"
                placeholder="Enter Remarks here"
                name="sfg_description"
                onChange={sfgDataHandler}
                value={SfgData.sfg_description}
              />
            </div>

            {/* Selection buttons */}
            {SavedSfgData && (SavedSfgData.new_sfg !== false || BillOfSaleStatus === false) && (
              <div className="flex items-center gap-3">
                <button
                  className="p-2 bg-blue-900 hover:bg-blue-800 text-white rounded-md w-full"
                  type="button"
                  onClick={handleSelectRawMaterial}
                >
                  Choose Raw Material
                </button>
              </div>
            )}

            <div className="flex items-center gap-3">
              <button
                className="p-2 bg-blue-900 hover:bg-blue-800 text-white rounded-md  w-full"
                type="button"
                onClick={handleSelectJobber}
              >
                Choose Jobber
              </button>
            </div>

            {/* Raw Materials Section */}
            <div className="w-full col-span-2 bg-blue-100 p-2 rounded-md">
              {finalSelectedRawMaterials &&
                finalSelectedRawMaterials.length > 0 && (
                  <div className="col-span-2 flex flex-col justify-center items-center mb-4">
                    <h3 className="text-lg font-bold text-blue-900 mb-2">
                      Selected Raw Materials
                    </h3>
                    <SelectedRawMaterialsTable
                      selectedMaterials={finalSelectedRawMaterials}
                      updateQuantity={updateRawMaterialQty}
                      removeItem={removeRawMaterial}
                      onTotalCostChange={handleRawMaterialTotalCostChange}
                      new_sfg={SavedSfgData.new_sfg !== false}
                      BillOfSaleStatus={BillOfSaleStatus}
                    />
                  </div>
                )}

              {/* Jobbers Section */}
              {finalSelectedJobbers && finalSelectedJobbers.length > 0 && (
                <div className="col-span-2 flex flex-col justify-center items-center">
                  <h3 className="text-lg font-bold text-blue-900 mb-2">
                    Selected Jobbers
                  </h3>
                  <SelectedJobbersTable
                    selectedJobbers={finalSelectedJobbers}
                    updateJobberRate={updateJobberRate}
                    removeJobber={removeJobber}
                    onTotalCostChange={handleJobberTotalCostChange}
                    updateDescription={updateDescription}
                  />
                </div>
              )}
            </div>
          </div>
          {/* Total Cost */}
          <div className="flex flex-col w-1/3 gap-2 mt-2">
            <label className="text-blue-700 font-semibold">Total Cost</label>
            <input
              value={SfgData.sfg_total_cost}
              className="p-2 border bg-gray-100 border-gray-300 rounded-md"
              type="text"
              placeholder="0.0"
              name="sfg_total_cost"
              disabled
            />
          </div>
        </>
      )}
      <div className=" w-full flex justify-end mt-2">
        <button
          type="button"
          className="bg-blue-900 hover:bg-blue-800 flex items-center gap-2 px-4 py-3  text-center rounded-md text-white font-semibold text-sm"
          onClick={(event) => updateSFGdata(event)}
        >
          Update <GrUpdate className="text-sm" />
        </button>
      </div>
    </div>
  );
};

export default UpdateBOM;
