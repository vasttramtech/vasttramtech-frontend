import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import FormLabel from "../../purchase/FormLabel";
import { BounceLoader } from "react-spinners";
import axios from "axios";
import SelectionTable from "../../../smartTable/SelectionTable";
import SelectedJobbersTable from "../component/SelectedJobbersTable"
import SelectedRawMaterialsTable from "../component/SelectedRawMaterialsTable";
import { Plus } from "lucide-react";
import Select from "react-select"
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

const SFGBomSection = ({
  token,
  sfgmGroup,
  SavedSfgData,
  setSavedSfgData,
  FinalSFGData,
  setFinalSFGData,
  allJobber,
  allRawMaterial,
  dataDesign,
  listedSFG,
  setListedSFG,
}) => {
  const [sfgLoader, setSfgLoader] = useState(false);
  const [availableSFG, setAvailableSFG] = useState([]);
  const [sfgMaterials, setsfgMaterials] = useState([]);
  const [sfgColors, setSfgColors] = useState([]);
  const [availableSFGBasedOnMaterial, setAvailableSFGBasedOnMaterial] =
    useState([]);
  const [availableSFGBasedOnColor, setAvailableSFGBasedOnColor] = useState();

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

  // custom color states
  const [sfgCustomColor, setSfgCustomColor] = useState([]);

  //  Fetchin all colors
  const fetchColors = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/colors?populate=*`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSfgCustomColor(response.data.data);
      console.log("Color Names:", sfgCustomColor);
    } catch (error) {
      console.error("Error fetching colors:", error);
    }
  };

  useEffect(() => {
    fetchColors();
  }, []);

  const BOMsfgHeader = [
    "SFG group",
    "Material",
    "Color",
    "Quantity",
    "Total Cost",
    "Description",
  ];

  // state for BOM's Semi finished goods master
  const [SfgData, setSfgData] = useState({
    sfg_group: "",
    sfg_material: "",
    sfg_color: "",
    sfg_color1: "",
    sfg_qty: 0,
    // sfg_total_cost: "",
    sfg_description: "",
  });

  const sfgDataHandler = (event) => {

    const { name, value } = event.target;

    // Reset dependent fields when a parent field changes
    if (name === "sfg_group") {
      setSfgData({
        ...SfgData,
        [name]: value,
        sfg_material: "",
        sfg_color: "",
        sfg_color1: "",
        sfg_qty: 0,
        // sfg_total_cost: "",
        sfg_description: "",
      });
    } else if (name === "sfg_material") {
      setSfgData({
        ...SfgData,
        [name]: value,
        sfg_color: "",
        sfg_color1: "",
        sfg_qty: 0,
        // sfg_total_cost: "",
      });
    } else if (name === "sfg_color") {
      setSfgData({
        ...SfgData,
        [name]: value,
        sfg_qty: 0,
        // sfg_total_cost: "",
      });
    } else {
      setSfgData({ ...SfgData, [name]: value });
    }
  };

  // Raw Material Selection Functions
  function handleSaveRawMaterialSelection() {
    try {
      const selectedIds = new Set(
        finalSelectedRawMaterials.map((row) => row.id)
      );

      const updatedFinalData = selectedRawMaterialRow.map((row) => {
        if (selectedIds.has(row.id)) {
          return finalSelectedRawMaterials.filter(
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
      finalSelectedRawMaterials.map((row) =>
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
      finalSelectedRawMaterials.filter((row) => row.id !== id)
    );
    setSelectedRawMaterialRow(
      selectedRawMaterialRow.filter((row) => row.id !== id)
    );
  };

  function handleSelectRawMaterial() {
    setSelectedRawMaterialRow(finalSelectedRawMaterials);
    setDisplayRawMaterialModal(true);
  }

  // Handle raw material total cost change
  const handleRawMaterialTotalCostChange = (totalCost) => {
    setRawMaterialTotalCost(totalCost);
  };

  // Jobber Selection Functions
  function handleSaveJobberSelection() {
    try {
      const selectedIds = new Set(finalSelectedJobbers.map((row) => row.id));

      // console.log(selectedJobberRow)

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

  const removeJobber = (id) => {
    setFinalSelectedJobbers(
      finalSelectedJobbers.filter((row) => row.id !== id)
    );
    setSelectedJobberRow(selectedJobberRow.filter((row) => row.id !== id));
  };

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

  const updateSFGdata = (event) => {
    event.preventDefault();

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

    console.log("Available SFG", SfgData);

    const newSfgEntry = {
      semi_finished_goods: availableSFGBasedOnMaterial.id,
      qty: Number(SfgData.sfg_qty),
      total_price: Number(SfgData.sfg_total_cost),
      sfg_description: SfgData.sfg_description,
      raw_material_bom: finalSelectedRawMaterials.map((item) => ({
        raw_material_master: item.id,
        rm_qty: item.Qty || 1,
      })),
      jobber_master_sfg: finalSelectedJobbers.map((item) => ({
        jobber_master: item.id,
        jobber_rate: item.Rate || 0,
        jobber_work_type: item.work_type,
        jobber_description: item.jobber_description || "",
      })),
      color: Number(SfgData.sfg_color1),
    };

    setListedSFG([...listedSFG, availableSFGBasedOnMaterial]);
    setFinalSFGData([...FinalSFGData, newSfgEntry]);
    const selectedColor = sfgCustomColor.find(
      (color) => color.id == SfgData.sfg_color1
    );
    setSavedSfgData([
      ...SavedSfgData,
      {
        semi_finished_goods:
          availableSFGBasedOnMaterial.semi_finished_goods_name,
        qty: Number(SfgData.sfg_qty),
        total_price: Number(SfgData.sfg_total_cost),
        sfg_description: SfgData.sfg_description,
        raw_material_bom: finalSelectedRawMaterials?.map((item) => ({
          raw_material_master: item.item_name,
          rm_qty: item.Qty || 1,
          unit: item?.unit,
          price_per_unit: item?.price_per_unit,
          color: item?.color,
          raw_material_id: item?.id,
        })),
        jobber_master_sfg: finalSelectedJobbers.map((item) => ({
          jobber_master: item.jobber_name,
          jobber_rate: item.Rate || 0,
          jobber_work_type: item.work_type,
          jobber_id: item?.jobber_id,
          jobber_address: item?.jobber_address,
          jobber_description: item.jobber_description || "",
        })),
        color: selectedColor,
        bom_status: "in_process",
        new_sfg: true,
      },
    ]);

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
    setSfgColors([]);
    setsfgMaterials([]);

    // Reset SFG data if needed
    setSfgData({
      sfg_group: "",
      sfg_material: "",
      sfg_color: "",
      sfg_color1: "",
      sfg_qty: 0,
      sfg_total_cost: "",
      sfg_description: "",
    });
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
  // console.log(sfgMaterials);

  // Effect to update when material changes
  useEffect(() => {
    if (SfgData.sfg_material) {
      const filteredSFG = availableSFG.find(
        (sfg) => sfg.semi_finished_goods_name === SfgData.sfg_material
      );
      setAvailableSFGBasedOnMaterial(filteredSFG);
    } else {
      setAvailableSFGBasedOnMaterial([]);
      setSfgColors([]);
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
  }, [rawMaterialTotalCost, jobberTotalCost]);

  return (
    <div className="w-[77vw]">
      {/* Raw Material Selection Modal */}
      {displayRawMaterialModal && (
        <div className="fixed inset-0 animate-fade-in bg-gray-900 backdrop-blur-md bg-opacity-80 flex justify-center items-center z-50 ">
          <div className="relative w-[70vw] bg-gray-100 border shadow-2xl p-4 rounded-lg">
            <button
              className="absolute top-2 right-2 text-red-700 hover:text-red-500 duration-200 ease-in-out transition-all text-2xl font-bold"
              onClick={() => setDisplayRawMaterialModal(false)}
            >
              <MdCancel className="w-8 h-8" />
            </button>

            <div className="">
              <h2 className="text-xl font-bold mb-4 text-blue-900 border-b border-b-gray-300 pb-2 text-center">
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
                className="bg-blue-900 border border-gray-400 px-4 py-1 rounded hover:bg-blue-700 text-white"
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
        <div className="fixed animate-fade-in inset-0 bg-gray-900 backdrop-blur-md bg-opacity-50 flex justify-center items-center z-50 ">
          <div className="relative w-[80vw] bg-gray-100 border shadow-2xl p-4 rounded-lg">
            <button
              className="absolute top-2 right-2 text-red-700 hover:text-red-500 duration-200 ease-in-out transition-all text-2xl font-bold"
              onClick={() => setDisplayJobberModal(false)}
            >
              <MdCancel className="w-8 h-8" />
            </button>

            <div className="">
              <h2 className="text-xl text-blue-900 pb-2 border-b border-b-gray-300 font-bold mb-4 text-center">
                Select Jobbers
              </h2>
              <SelectionTable
                NoOfColumns={jobberHeader.length}
                data={allJobber}
                headers={jobberHeader}
                setSelectedRow={setSelectedJobberRow}
                setOfSelectedIndex={jobberSetOfSelectedIndex}
                setSetOfSelectedIndex={setJobberSetOfSelectedIndex}
              />
            </div>

            <div className="flex justify-center items-center mt-4">
              <button
                type="button"
                className="bg-blue-900 border border-gray-400 px-4 py-1 rounded hover:bg-blue-700 text-white duration-200 ease-in-out transition-all"
                onClick={handleSaveJobberSelection}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2">
        <p className="text-xl font-semibold">Semi Finished Goods Master </p>

      </div>


      <div className="mt-2 border bg-white border-gray-400 shadow-xl rounded-xl p-5">
        <div className="mt-2 grid grid-cols-2 gap-6 ">
          {/* SFG Group */}
          <div className="flex flex-col">
            <FormLabel title={"SFG Group"} />
            <select
              name="sfg_group"
              className="border border-gray-300 bg-gray-100 rounded-md p-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              defaultValue=""
              onChange={sfgDataHandler}
              value={SfgData.sfg_group}
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


          <div className="flex flex-col">
            <label className="text-gray-700 font-semibold mb-1">
              SFG Material
            </label>
            <Select
              name="sfg_material"
              classNames={
                "border border-gray-300 bg-gray-100 rounded-md p-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"}
              isLoading={sfgLoader}
              isDisabled={!SfgData.sfg_group}
              placeholder={sfgLoader ? "Loading SFG Materials..." : "Select SFG Material"}
              options={
                sfgMaterials?.map((item) => ({
                  label: item,
                  value: item,
                })) || []
              }
              value={
                SfgData.sfg_material
                  ? { label: SfgData.sfg_material, value: SfgData.sfg_material }
                  : null
              }
              onChange={(selectedOption) =>
                sfgDataHandler({
                  target: {
                    name: "sfg_material",
                    value: selectedOption?.value || "",
                  },
                })
              }
              className="react-select-container"
              classNamePrefix="react-select"
            />
          </div>

          {/* Color1 */}
          <div className="flex flex-col">
            <label className="text-gray-700 font-semibold">Color </label>
            <select
              name="sfg_color1"
              className="border border-gray-300 bg-gray-100 rounded-md p-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              defaultValue=""
              onChange={sfgDataHandler}
              value={SfgData.sfg_color1}
            >
              <option value="" disabled>
                Select Color
              </option>
              {sfgCustomColor &&
                sfgCustomColor.length > 0 &&
                sfgCustomColor.map((item, idx) => (
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
            />
          </div>
          {/* Sfg Description */}
          <div className="flex flex-col">
            <label className="text-gray-700 font-semibold">Remarks</label>
            <textarea
              className="p-2 border bg-gray-100 border-gray-300 rounded-md"
              placeholder="Enter Remarks here"
              name="sfg_description"
              onChange={sfgDataHandler}
              value={SfgData.sfg_description}
            />
          </div>

        </div>

        <div className=" flex flex-col gap-3 p-4">
          {/* Selection buttons */}
          <div className=" w-1/2">
            <button
              className="p-2 bg-blue-900 hover:bg-blue-800 text-white rounded-md w-full"
              type="button"
              onClick={handleSelectRawMaterial}
            >
              Choose Raw Material
            </button>
          </div>

          <div className="w-1/2 ">
            <button
              className="p-2 bg-blue-900 hover:bg-blue-800 text-white rounded-md  w-full"
              type="button"
              onClick={handleSelectJobber}
            >
              Choose Jobber
            </button>
          </div>

          {/* Raw Materials Section */}
          {finalSelectedRawMaterials.length > 0 && (
            <div className="col-span-2 flex flex-col justify-center items-center">
              <h3 className="text-xl font-semibold mb-1">
                Selected Raw Materials
              </h3>
              <SelectedRawMaterialsTable
                selectedMaterials={finalSelectedRawMaterials}
                updateQuantity={updateRawMaterialQty}
                removeItem={removeRawMaterial}
                onTotalCostChange={handleRawMaterialTotalCostChange}
                new_sfg={SavedSfgData?.new_sfg !== false}
              />
            </div>
          )}

          {/* Jobbers Section */}
          {finalSelectedJobbers.length > 0 && (
            <div className="col-span-2 flex flex-col justify-center items-center">
              <h3 className="text-xl font-semibold mb-1">Selected Jobbers</h3>
              <SelectedJobbersTable
                selectedJobbers={finalSelectedJobbers}
                updateJobberRate={updateJobberRate}
                removeJobber={removeJobber}
                onTotalCostChange={handleJobberTotalCostChange}
                updateDescription={updateDescription}
              />
            </div>
          )}
          {/* Total Cost */}
          <div className="flex flex-col w-1/2">
            <label className="text-gray-700 font-semibold">Total Cost</label>
            <input
              value={SfgData.sfg_total_cost}
              className="p-2 border bg-gray-100 border-gray-300 rounded-md"
              type="text"
              placeholder="0.0"
              name="sfg_total_cost"
              disabled
            />
          </div>
        </div>

        <div className="flex justify-end">

          <button
            type="button"
            className="bg-green-600 hover:bg-green-700 flex items-center  gap-3 text-center rounded-md px-4 py-3 text-white font-semibold text-md"
            onClick={(event) => updateSFGdata(event)}
          >
            Add <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
};

export default SFGBomSection;
