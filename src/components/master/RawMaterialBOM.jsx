import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { BounceLoader } from "react-spinners";
import DeleteTable from "../../smartTable/DeleteTable";
import FormLabel from "../purchase/FormLabel";
import axios from "axios";

const RawMaterialBOM = ({
  token,
  finalRawMaterialData,
  setFinalRawMaterialData,
  savedRawMaterialData,
  setSavedRawMaterialData,
  rawMaterialGroups,
}) => {
  const [rmLoader, setRmLoader] = useState(false);
  const [
    availableRawMaterialBasedOnGroup,
    setAvailableRawMaterialBasedOnGroup,
  ] = useState([]);
  const [
    availableRawMaterialBasedOnMaterial,
    setAvailableRawMaterialBasedOnMaterial,
  ] = useState([]);
  const [selectedRawMaterial, setSelectedRawMaterial] = useState(null);
  const [rawMaterialJobber, setRawMaterialJobber] = useState([]);
  const [rawMaterialName, setRawMaterialName] = useState([]);
  const [rawMaterialColor, setRawMaterialColor] = useState([]);

  const [rawMaterialMasterData, setRawMaterialMasterData] = useState({
    material_group: "",
    material_name: "",
    material_color: "",
    material_qty: "",
    material_total_cost: "",
    material_description: "",
    material_jobber: "",
  });

  const BOMRawMaterial = [
    "Raw Material Group",
    "Name",
    "Color",
    "Jobber",
    "Quantity",
    "Total Cost",
    "Description",
  ];

  const rawMaterialDataHandler = (event) => {
    setRawMaterialMasterData({
      ...rawMaterialMasterData,
      [event.target.name]: event.target.value,
    });
  };

  const fetchIndividualRawMaterialGroup = async () => {
    try {
      if (!rawMaterialMasterData.material_group) return;

      setRmLoader(true);

      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/custom-raw-material/group/${rawMaterialMasterData.material_group}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response || !response.data) {
        setAvailableRawMaterialBasedOnGroup([]);
      } else {
        setAvailableRawMaterialBasedOnGroup(response.data);
      }
    } catch (error) {
      console.error("Error fetching raw material data:", error);
      toast.error("Failed to fetch raw material data");
    } finally {
      setRmLoader(false);
    }
  };

  // Reset fields when material group changes
  useEffect(() => {
    setRawMaterialMasterData({
      ...rawMaterialMasterData,
      material_color: "",
      material_qty: 0,
      material_total_cost: 0,
      material_name: "",
      material_description: "",
      material_jobber: "",
    });
    setSelectedRawMaterial(null);
    setRawMaterialColor([]);
    setRawMaterialJobber([]);
    fetchIndividualRawMaterialGroup();
  }, [rawMaterialMasterData.material_group]);

  // Update material names based on group selection
  useEffect(() => {
    if (
      !rawMaterialMasterData.material_group ||
      availableRawMaterialBasedOnGroup.length === 0
    )
      return;

    const options = new Set();
    availableRawMaterialBasedOnGroup.forEach((rawMaterial) => {
      options.add(rawMaterial.item_name);
    });

    setRawMaterialName(Array.from(options));
  }, [availableRawMaterialBasedOnGroup]);

  // Filter materials based on selected name
  useEffect(() => {
    if (
      !rawMaterialMasterData.material_name ||
      availableRawMaterialBasedOnGroup.length === 0
    )
      return;

    setSelectedRawMaterial(null);
    setRawMaterialMasterData({
      ...rawMaterialMasterData,
      material_color: "",
      material_jobber: "",
    });
    setRawMaterialJobber([]);

    setAvailableRawMaterialBasedOnMaterial(
      availableRawMaterialBasedOnGroup.filter(
        (rawMaterial) =>
          rawMaterial.item_name === rawMaterialMasterData.material_name
      )
    );
  }, [rawMaterialMasterData.material_name]);

  // Get colors based on selected material
  useEffect(() => {
    if (
      !rawMaterialMasterData.material_name ||
      availableRawMaterialBasedOnMaterial.length === 0
    )
      return;

    const option = new Set();
    availableRawMaterialBasedOnMaterial.forEach((rawMaterial) => {
      option.add(rawMaterial.color.color_name);
    });

    setRawMaterialColor(Array.from(option));
  }, [availableRawMaterialBasedOnMaterial]);

  // Set selected raw material when color is selected
  useEffect(() => {
    if (
      !rawMaterialMasterData.material_color ||
      availableRawMaterialBasedOnMaterial.length === 0
    )
      return;

    const finallySelectedRawMaterial = availableRawMaterialBasedOnMaterial.find(
      (rawMaterial) =>
        rawMaterial.color.color_name === rawMaterialMasterData.material_color
    );

    setSelectedRawMaterial(finallySelectedRawMaterial);
    setRawMaterialJobber(finallySelectedRawMaterial?.add_karigar || []);
  }, [rawMaterialMasterData.material_color]);

  // Calculate total cost
  useEffect(() => {
    if (
      !selectedRawMaterial ||
      !rawMaterialMasterData.material_qty ||
      !rawMaterialMasterData.material_jobber
    ) {
      setRawMaterialMasterData({
        ...rawMaterialMasterData,
        material_total_cost: 0,
      });
      return;
    }

    const jobber_rate = selectedRawMaterial.add_karigar.find(
      (item) => item.jobber.id == rawMaterialMasterData.material_jobber
    );

    if (!jobber_rate) return;

    setRawMaterialMasterData({
      ...rawMaterialMasterData,
      material_total_cost:
        (Number(selectedRawMaterial.price_per_unit) +
          Number(jobber_rate.rate)) *
        Number(rawMaterialMasterData.material_qty),
    });
  }, [
    selectedRawMaterial,
    rawMaterialMasterData.material_qty,
    rawMaterialMasterData.material_jobber,
  ]);

  const handleRawMaterialDelete = (ind) => {
    setSavedRawMaterialData(
      savedRawMaterialData.filter((item, index) => index !== ind)
    );
    setFinalRawMaterialData(
      finalRawMaterialData.filter((item, index) => index !== ind)
    );
  };

  const UpdateRawMaterialData = (event) => {
    event.preventDefault();

    if (
      !rawMaterialMasterData.material_group ||
      !rawMaterialMasterData.material_name ||
      !rawMaterialMasterData.material_color ||
      !rawMaterialMasterData.material_qty ||
      !rawMaterialMasterData.material_description ||
      !rawMaterialMasterData.material_jobber
    ) {
      toast.error("Please fill all the required fields.");
      return;
    }

    if (!selectedRawMaterial) {
      toast.error("Raw material data is incomplete.");
      return;
    }

    const dyer = selectedRawMaterial.add_karigar.find(
      (item) => item.jobber.id == rawMaterialMasterData.material_jobber
    );

    if (!dyer) {
      toast.error("Selected jobber information not found.");
      return;
    }

    setFinalRawMaterialData([
      ...finalRawMaterialData,
      {
        raw_material_master: selectedRawMaterial.id,
        jobber_master: Number(rawMaterialMasterData.material_jobber),
        qty: Number(rawMaterialMasterData.material_qty),
        total_price: Number(rawMaterialMasterData.material_total_cost),
        design_description: rawMaterialMasterData.material_description,
      },
    ]);

    setSavedRawMaterialData([
      ...savedRawMaterialData,
      {
        group: rawMaterialMasterData.material_group,
        name: rawMaterialMasterData.material_name,
        color: rawMaterialMasterData.material_color,
        jobber: dyer.jobber.jobber_name + "-" + dyer.jobber.work_type,
        qty: rawMaterialMasterData.material_qty,
        total_cost: rawMaterialMasterData.material_total_cost,
        description: rawMaterialMasterData.material_description,
      },
    ]);

    // Reset form
    setRawMaterialMasterData({
      material_group: "",
      material_name: "",
      material_color: "",
      material_qty: "",
      material_total_cost: "",
      material_description: "",
      material_jobber: "",
    });
    setSelectedRawMaterial(null);
    setRawMaterialColor([]);
    setRawMaterialJobber([]);
    setAvailableRawMaterialBasedOnMaterial([]);
  };

  return (
    <div className="my-8">
      <div className="flex items-center gap-2">
        <p className="text-xl font-semibold">Raw Material Master</p>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-center rounded-md px-2 text-white font-semibold text-sm"
          onClick={UpdateRawMaterialData}
          type="button"
        >
          Add
        </button>
      </div>

      {rmLoader ? (
        <div className="flex justify-center items-center border border-gray-300 shadow-xl p-5 rounded-xl">
          <BounceLoader size={50} loading={true} color="#1e3a8a" />
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-2 gap-6 p-5 border border-gray-300 shadow-xl rounded-xl">
          {/* Material Group */}
          <div className="flex flex-col">
            <label className="text-gray-700 font-semibold">
              Material Group
            </label>
            <select
              name="material_group"
              value={rawMaterialMasterData.material_group}
              onChange={rawMaterialDataHandler}
              className="border border-gray-300 bg-gray-100 rounded-md p-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>
                Select Material Group
              </option>
              {rawMaterialGroups &&
                rawMaterialGroups.length > 0 &&
                rawMaterialGroups.map((item) => (
                  <option value={item.id} key={item.id}>
                    {item.group_name}
                  </option>
                ))}
            </select>
          </div>

          {/* Material Name */}
          <div className="flex flex-col">
            <label className="text-gray-700 font-semibold">Material Name</label>
            <select
              name="material_name"
              value={rawMaterialMasterData.material_name}
              className="border border-gray-300 bg-gray-100 rounded-md p-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={rawMaterialDataHandler}
              disabled={!rawMaterialMasterData.material_group}
            >
              <option value="" disabled>
                Select Material Name
              </option>
              {rawMaterialName &&
                rawMaterialName.length > 0 &&
                rawMaterialName.map((item) => (
                  <option value={item} key={item}>
                    {item}
                  </option>
                ))}
            </select>
          </div>

          {/* Color */}
          <div className="flex flex-col">
            <label className="text-gray-700 font-semibold">Color</label>
            <select
              name="material_color"
              className="border border-gray-300 bg-gray-100 rounded-md p-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={rawMaterialDataHandler}
              value={rawMaterialMasterData.material_color}
              disabled={
                !rawMaterialMasterData.material_name ||
                !rawMaterialMasterData.material_group
              }
            >
              <option value="" disabled>
                Select Color
              </option>
              {rawMaterialColor &&
                rawMaterialColor.length > 0 &&
                rawMaterialColor.map((item) => (
                  <option value={item} key={item}>
                    {item}
                  </option>
                ))}
            </select>
          </div>

          {/* Dyer/Jobber */}
          <div className="flex flex-col">
            <FormLabel title={"Dyer"} />
            <select
              name="material_jobber"
              className="border border-gray-300 bg-gray-100 rounded-md p-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={rawMaterialMasterData.material_jobber}
              onChange={rawMaterialDataHandler}
              disabled={
                !rawMaterialMasterData.material_group ||
                !rawMaterialMasterData.material_name ||
                !rawMaterialMasterData.material_color
              }
            >
              <option value="" disabled>
                Select Dyer
              </option>
              {rawMaterialJobber &&
                rawMaterialJobber.length > 0 &&
                rawMaterialJobber.map((item) => (
                  <option value={item.jobber.id} key={item.jobber.id}>
                    {item.jobber.jobber_name + " - " + item.jobber.work_type}
                  </option>
                ))}
            </select>
          </div>

          {/* Quantity */}
          <div className="flex flex-col">
            <label className="text-gray-700 font-semibold">Qty</label>
            <input
              className="p-2 border bg-gray-100 border-gray-300 rounded-md"
              type="number"
              placeholder="0.0"
              name="material_qty"
              onChange={rawMaterialDataHandler}
              value={rawMaterialMasterData.material_qty}
            />
          </div>

          {/* Remarks/Description */}
          <div className="flex flex-col">
            <label className="text-gray-700 font-semibold">Remarks</label>
            <textarea
              className="p-2 border bg-gray-100 border-gray-300 rounded-md"
              placeholder="Enter Remarks"
              name="material_description"
              onChange={rawMaterialDataHandler}
              value={rawMaterialMasterData.material_description}
            />
          </div>

          {/* Total Cost */}
          <div className="flex flex-col">
            <label className="text-gray-700 font-semibold">Total Cost</label>
            <input
              className="p-2 border bg-gray-100 border-gray-300 rounded-md"
              type="text"
              placeholder="0.0"
              name="material_total_cost"
              value={rawMaterialMasterData.material_total_cost}
              disabled
            />
          </div>

          {/* Table to display added raw materials */}
          <div className="col-span-2 flex justify-center items-center">
            <DeleteTable
              data={savedRawMaterialData}
              header={BOMRawMaterial}
              setData={handleRawMaterialDelete}
              key={savedRawMaterialData.length}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default RawMaterialBOM;
