import { useEffect, useState } from "react";
import DeleteTable from "../../../smartTable/DeleteTable";
import axios from "axios";

const BOMRawMaterial = [
  "Raw Material Group",
  "Name",
  "Color",
  "Quantity",
  "Total Cost",
  "Remarks"
];
const HandeBOMrawMaterial = ({
  token,
  rawMaterialGroup,
  existingRawMaterial,
  finalRawMaterialData,
  setFinaalRawMaterialData
}) => {
  const [loading, setLoading] = useState(false);
  const [SavedRawMaterialData, setSavedRawMaterialData] = useState([]);
  const [
    availableRawMaterialBasedOnGroup,
    setAvailableRawMaterialBasedOnGroup,
  ] = useState([]);
  const [
    availablrRawMaterialbasedOnmaterial,
    setAvailablrRawMaterialbasedOnmaterial,
  ] = useState([]);
  const [
    availableRawMaterialBasedOnMaterial,
    setAvailableRawMaterialBasedOnMaterial,
  ] = useState();
  const [selectedRaWMaterial, setSelectedRaWMaterial] = useState();
  const [rawMaterialName, setRawMaterialName] = useState([]);
  const [rawMaterialColor, setRawMaterialColor] = useState([]);
//   const [finalRawMaterialData, setFinaalRawMaterialData] = useState([]);
  const [rawMaterialMasterData, setRawMaterialMasterData] = useState({
    material_group: "",
    material_name: "",
    material_color: "",
    material_qty: "",
    material_total_cost: "",
    material_description: "",
  });

  const handleRawMaterialDelet = (ind) => {
    setSavedRawMaterialData(
      SavedRawMaterialData.filter((item, index) => index !== ind)
    );
    setFinaalRawMaterialData(
      finalRawMaterialData.filter((item, index) => index !== ind)
    );
  };

  const UpdateRawMaterialData = (event) => {
    event.preventDefault();
    setFinaalRawMaterialData([
      ...finalRawMaterialData,
      {
        raw_material: selectedRaWMaterial.id,
        qty: Number(rawMaterialMasterData.material_qty),
        total_price: Number(rawMaterialMasterData.material_total_cost),
        design_description: rawMaterialMasterData.material_description,
      },
    ]);
    setSavedRawMaterialData([...SavedRawMaterialData, rawMaterialMasterData]);
    setRawMaterialMasterData({
      material_group: "",
      material_name: "",
      material_color: "",
      material_qty: "",
      material_total_cost: "",
      material_description: "",
    });
    setSelectedRaWMaterial();
    setRawMaterialColor([]);
    setAvailableRawMaterialBasedOnMaterial([]);
    setAvailableRawMaterialBasedOnGroup([]);
  };
//   console.log(finalRawMaterialData);
  useEffect(() => {
    if (!existingRawMaterial || existingRawMaterial.length == 0) return;
    setSavedRawMaterialData(
      existingRawMaterial.map((item) => ({
        group: item?.raw_material?.group?.id,
        name: item?.raw_material?.item_name,
        color: item?.raw_material?.color?.color_name,
        qty: item?.qty,
        total_cost: item.total_price,
        design_description: item?.design_description
      }))
    );
    console.log(existingRawMaterial)
    setFinaalRawMaterialData(
      existingRawMaterial.map((item) => ({
        qty: Number(item?.qty),
        total_price: Number(item?.total_price),
        raw_material: Number(item?.raw_material?.id),
        design_description: item?.design_description
      }))
    );
  }, [existingRawMaterial]);
  const rawMaterialDataHandler = (event) => {
    setRawMaterialMasterData({
      ...rawMaterialMasterData,
      [event.target.name]: event.target.value,
    });
  };

  const fetchIndividualRawMaterialGroup = async () => {
    try {
      setLoading(true);
      if (!rawMaterialMasterData.material_group) return;
      setLoading(true);
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
      console.error("Error fetching jobber data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setRawMaterialMasterData({
      ...rawMaterialMasterData,
      material_color: "",
      material_qty: 0,
      material_total_cost: 0,
      material_name: "",
      material_description: "",
    });
    setSelectedRaWMaterial();
    setRawMaterialColor([]);
    fetchIndividualRawMaterialGroup();
  }, [rawMaterialMasterData.material_group]);

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
    // console.log(options)
    setRawMaterialName(Array.from(options));
  }, [availableRawMaterialBasedOnGroup]);

  useEffect(() => {
    if (
      !rawMaterialMasterData.material_name ||
      availableRawMaterialBasedOnGroup.length === 0
    )
      return;
    setSelectedRaWMaterial();
    setRawMaterialMasterData({
      ...rawMaterialMasterData,
      material_color: "",
    });
    setAvailableRawMaterialBasedOnMaterial(
      availableRawMaterialBasedOnGroup.filter(
        (rawMaterial) =>
          rawMaterial.item_name === rawMaterialMasterData.material_name
      )
    );
  }, [rawMaterialMasterData.material_name]);
  // console.log(availableRawMaterialBasedOnMaterial)
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

  useEffect(() => {
    if (
      !rawMaterialMasterData.material_color ||
      availableRawMaterialBasedOnMaterial.length === 0
    )
      return;
    setSelectedRaWMaterial(
      availableRawMaterialBasedOnMaterial.find(
        (rawMaterial) =>
          rawMaterial.color.color_name === rawMaterialMasterData.material_color
      )
    );
  }, [rawMaterialMasterData.material_color]);

  useEffect(() => {
    if (!selectedRaWMaterial || !rawMaterialMasterData.material_qty) {
      setRawMaterialMasterData({
        ...rawMaterialMasterData,
        material_total_cost: 0,
      });
      return;
    }
    setRawMaterialMasterData({
      ...rawMaterialMasterData,
      material_total_cost:
        selectedRaWMaterial.price_per_unit * rawMaterialMasterData.material_qty,
    });
  }, [
    selectedRaWMaterial,
    rawMaterialMasterData.material_qty,
    rawMaterialMasterData.material_color,
  ]);

  return (
    <div>
      <div>
        <div className=" flex items-center gap-2">
          <p className=" text-xl font-semibold">Raw Material Master </p>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-center rounded-md px-2 text-white font-semibold text-sm"
            onClick={UpdateRawMaterialData}
          >
            Add
          </button>
        </div>

        <div className=" mt-4 grid grid-cols-2 gap-6 p-5 border border-gray-300 shadow-xl rounded-xl">
          {/*  new material Group */}
          <div className="flex flex-col">
            <label className="text-gray-700 font-semibold">
              Material Group
            </label>
            <select
              name="material_group"
              value={rawMaterialMasterData.material_group}
              onChange={rawMaterialDataHandler}
              className="border border-gray-300 bg-gray-100 rounded-md p-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              defaultValue=""
            >
              <option value="" disabled>
                Select Material Group
              </option>
              {rawMaterialGroup &&
                rawMaterialGroup.length > 0 &&
                rawMaterialGroup.map((item, idx) => (
                  <option value={item.id} key={item.id}>
                    {item.group_name}
                  </option>
                ))}
            </select>
          </div>
          {/* Material Name    */}
          <div className="flex flex-col">
            <label className="text-gray-700 font-semibold">
              {" "}
              Material Name
            </label>
            <select
              name="material_name"
              value={rawMaterialMasterData.material_name}
              className="border border-gray-300 bg-gray-100 rounded-md p-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              defaultValue=""
              onChange={rawMaterialDataHandler}
              disabled={!rawMaterialMasterData.material_group}
            >
              <option value="" disabled>
                Select Material Name
              </option>
              {availableRawMaterialBasedOnGroup &&
                availableRawMaterialBasedOnGroup.length > 0 &&
                rawMaterialName &&
                rawMaterialName.length > 0 &&
                rawMaterialName.map((item, idx) => (
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
              defaultValue=""
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
              {availableRawMaterialBasedOnGroup &&
                availableRawMaterialBasedOnGroup.length > 0 &&
                rawMaterialColor &&
                rawMaterialColor.length > 0 &&
                rawMaterialColor.map((item, idx) => (
                  <option value={item} key={item}>
                    {item}
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
              name="material_qty"
              id=""
              onChange={rawMaterialDataHandler}
              value={rawMaterialMasterData.material_qty}
            />
          </div>
          {/*  total cost  */}
          <div className="flex flex-col">
            <label className="text-gray-700 font-semibold">Total Cost</label>
            <input
              className="p-2 border bg-gray-100 border-gray-300 rounded-md"
              type="text"
              placeholder="0.0"
              name="material_total_cost"
              id=""
              value={rawMaterialMasterData.material_total_cost}
              disabled
            />
          </div>

          {/* Remarks */}
          <div className="flex flex-col">
            <label className="text-gray-700 font-semibold">Remarks</label>
            <textarea
              className="p-2 border bg-gray-100 border-gray-300 rounded-md"
              type="text"
              placeholder="Enter Remarks here"
              name="material_description"
              value={rawMaterialMasterData.material_description}
              onChange={rawMaterialDataHandler}
            />
          </div>


          <div className="col-span-2 flex justify-center items-center">
            <DeleteTable
              data={SavedRawMaterialData}
              header={BOMRawMaterial}
              setData={handleRawMaterialDelet}
              key={SavedRawMaterialData.length}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HandeBOMrawMaterial;
