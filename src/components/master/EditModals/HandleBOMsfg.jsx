import { useEffect, useState } from "react";
import FormLabel from "../../purchase/FormLabel";
import DeleteTable from "../../../smartTable/DeleteTable";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BOMsfgHeader = [
  "SFG group",
  "Material",
  "Color",
  "Jobber",
  "Quantity",
  "Total Cost",
  "Remarks"
];

const HandleBOMsfg = ({
  token,
  sfgmGroup,
  ExistingSfgItems,
  FinalSFGData,
  setFinalSFGData,
}) => {
  const [loading, setLoading] = useState(false);
  const [sfgMaterials, setsfgMaterials] = useState([]);
  const [sfgColors, setSfgColors] = useState([]);
  const [sfgJobber, setSfgJobber] = useState([]);

  const [availableSFG, setAvailableSFG] = useState([]);
  const [availableSFGBasedOnMaterial, setAvailableSFGBasedOnMaterial] =
    useState([]);
  const [availableSFGBasedOnColor, setAvailableSFGBasedOnColor] = useState();
  const [selectedJobber, setSelectedJobber] = useState();
  //   const [FinalSFGData, setFinalSFGData] = useState([]);
  const [SavedSfgData, setSavedSfgData] = useState([]);
//   console.log(FinalSFGData);
  const [SfgData, setSfgData] = useState({
    sfg_group: "",
    sfg_material: "",
    sfg_color: "",
    sfg_jobber: "",
    sfg_qty: 0,
    sfg_total_cost: "",
    sfg_description: "",
  });
  const navigate = useNavigate();
  const sfgDataHandler = (event) => {
    event.preventDefault();
    setSfgData((prevData) => ({
      ...prevData,
      [event.target.name]: event.target.value,
    }));
  };

  useEffect(() => {
    if (!SfgData.sfg_group) return;
    setSfgData({
      ...SfgData,
      sfg_color: "",
      sfg_jobber: "",
      sfg_qty: "",
      sfg_total_cost: 0,
    });
    setAvailableSFGBasedOnMaterial([]);
    setAvailableSFGBasedOnColor([]);
    setSfgColors([]);
    setSfgJobber([]);
    setSelectedJobber();
    const options = new Set();
    availableSFG.map((sfg) => {
      options.add(sfg.semi_finished_goods_name);
    });
    setsfgMaterials(Array.from(options));
  }, [availableSFG]);

  useEffect(() => {
    if (!SfgData.sfg_material) return;
    setSfgData({ ...SfgData, sfg_color: "", sfg_jobber: "" });
    setAvailableSFGBasedOnColor([]);
    setSfgJobber([]);
    setSelectedJobber();
    setAvailableSFGBasedOnMaterial(
      availableSFG.filter(
        (sfg) => sfg.semi_finished_goods_name == SfgData.sfg_material
      )
    );
  }, [SfgData.sfg_material]);

  const handleSfgDelete = (ind) => {
    setSavedSfgData(SavedSfgData.filter((item, index) => index !== ind));
    setFinalSFGData(FinalSFGData.filter((item, index) => index !== ind));
  };

  useEffect(() => {
    if (!SfgData.sfg_material) return;
    const options = new Set();
    availableSFGBasedOnMaterial.map((sfg) => {
      options.add(sfg.color.color_name);
    });
    setSfgColors(Array.from(options));
  }, [availableSFGBasedOnMaterial]);

  useEffect(() => {
    if (!SfgData.sfg_color) return;
    setSelectedJobber();
    setSfgData({ ...SfgData, sfg_jobber: "" });
    setSfgJobber([]);
    setAvailableSFGBasedOnColor(
      availableSFGBasedOnMaterial.find(
        (sfg) => sfg.color.color_name == SfgData.sfg_color
      ) || {}
    );
  }, [SfgData.sfg_color]);

  useEffect(() => {
    if (
      !SfgData.sfg_color ||
      !availableSFGBasedOnColor ||
      !availableSFGBasedOnColor.add_karigar ||
      availableSFGBasedOnColor.add_karigar.length == 0
    )
      return;
    const option = new Set();
    availableSFGBasedOnColor.add_karigar.map((sfg) => {
      option.add(sfg);
    });
    setSfgJobber(Array.from(option));
  }, [availableSFGBasedOnColor]);

  useEffect(() => {
    if (!SfgData.sfg_jobber) return;
    console.log(sfgJobber);
    setSelectedJobber(
      sfgJobber.find((jobber) => jobber.id == SfgData.sfg_jobber)
    );
  }, [SfgData.sfg_jobber]);

  //   console.log(selectedJobber)
  const UpdateSFGdata = (event) => {
    event.preventDefault();
    setFinalSFGData((prevData) => [
      ...prevData,
      {
        semi_finished_goods: availableSFGBasedOnColor.id,
        jobber_master: Number(selectedJobber.jobber.id),
        qty: Number(SfgData.sfg_qty),
        total_price: Number(SfgData.sfg_total_cost),
        sfg_description:SfgData.sfg_description
      },
    ]);
    // console.log(selectedJobber)
    setSavedSfgData([
      ...SavedSfgData,
      {
        ...SfgData,
        sfg_jobber:
          selectedJobber.jobber.jobber_name +
          "-" +
          selectedJobber.jobber.work_type,
      },
    ]);

    setSfgData({
      sfg_group: "",
      sfg_material: "",
      sfg_color: "",
      sfg_jobber: "",
      sfg_qty: 0,
      sfg_total_cost: "",
      sfg_description: "",
    });

    setAvailableSFGBasedOnMaterial([]);
    setAvailableSFGBasedOnColor([]);
    setSfgColors([]);
    setSfgJobber([]);
    setsfgMaterials([]);
    setSelectedJobber({});
  };
  //   console.log(FinalSFGData);
  useEffect(() => {
    if (!ExistingSfgItems || ExistingSfgItems.length == 0) return;
    setSavedSfgData(
      ExistingSfgItems.map((item) => ({
        group: item?.semi_finished_goods?.group?.id,
        material: item?.semi_finished_goods?.semi_finished_goods_name,
        color: item?.semi_finished_goods?.color?.color_name,
        jobber:
          item?.jobber_master?.jobber_name +
          "-" +
          item?.jobber_master?.work_type,
        qty: item?.qty,
        total_price: item?.total_price,
        sfg_description: item?.sfg_description
      }))
    );
    setFinalSFGData(
      ExistingSfgItems.map((item) => ({
        jobber_master: Number(item?.jobber_master?.id),
        qty: Number(item?.qty),
        total_price: Number(item?.total_price),
        semi_finished_goods: Number(item?.semi_finished_goods?.id),
        sfg_description:item?.sfg_description
      }))
    );
  }, [ExistingSfgItems]);
  // console.log(availableSFGBasedOnColor)
  useEffect(() => {
    if (
      !SfgData.sfg_material ||
      !SfgData.sfg_color ||
      !SfgData.sfg_qty ||
      !selectedJobber ||
      !availableSFGBasedOnColor
    ) {
      SfgData.sfg_total_cost = 0;
      return;
    }
    setSfgData({
      ...SfgData,
      sfg_total_cost:
        (Number(availableSFGBasedOnColor.price_per_unit) +
          Number(selectedJobber.rate)) *
        Number(SfgData.sfg_qty),
    });
  }, [
    selectedJobber,
    SfgData.sfg_qty,
    SfgData.sfg_color,
    SfgData.sfg_material,
    SfgData.sfg_group,
  ]);

  const fetchIndividualGroupData = async () => {
    try {
      if (!SfgData.sfg_group) {
        return;
      }
      setSfgData({
        ...SfgData,
        sfg_material: "",
        sfg_color: "",
        sfg_jobber: "",
        sfg_qty: "",
        sfg_total_cost: "",
        sfg_description:""
      });

      setLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/custom-semi-finished-goods/group/${SfgData.sfg_group}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      //   console.log(response);
      if (!response || !response.data) {
        setAvailableSFG([]);
      } else {
        setAvailableSFG(response.data);
      }
    } catch (error) {
      console.error("Error fetching jobber data:", error);
      if (error.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchIndividualGroupData();
  }, [SfgData.sfg_group]);

  return (
    <div className="col-span-2 mt-8">
      <div className=" flex items-center gap-2 col-span-2">
        <p className=" text-xl font-semibold">Semi Finished Goods Master </p>
        <button
          type="button"
         className="bg-blue-500 hover:bg-blue-600 text-center rounded-md px-2 text-white font-semibold text-sm"
          onClick={(event) => UpdateSFGdata(event)}
        >
          Add
        </button>
      </div>

      <div className=" mt-2 grid grid-cols-2 gap-6 p-5 border border-gray-300 shadow-sm rounded-xl">
        {/*  new SFG Group */}
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
        {/* SFG Material   */}
        <div className="flex flex-col">
          <label className="text-gray-700 font-semibold">SFG Material</label>
          <select
            name="sfg_material"
            onChange={sfgDataHandler}
            value={SfgData.sfg_material}
            className="border border-gray-300 bg-gray-100 rounded-md p-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            defaultValue=""
            disabled={!SfgData.sfg_group}
          >
            <option value="" disabled>
              Select SFG Material
            </option>
            {availableSFG &&
              availableSFG.length > 0 &&
              sfgMaterials &&
              sfgMaterials.length > 0 &&
              sfgMaterials.map((item, index) => (
                <option value={`${item}`}>{item}</option>
              ))}
          </select>
        </div>
        {/* Color */}
        <div className="flex flex-col">
          <label className="text-gray-700 font-semibold">Color</label>
          <select
            name="sfg_color"
            className="border border-gray-300 bg-gray-100 rounded-md p-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            defaultValue=""
            onChange={sfgDataHandler}
            value={SfgData.sfg_color}
            disabled={!SfgData.sfg_material || !SfgData.sfg_group}
          >
            <option value="" disabled>
              Select Color
            </option>
            {availableSFG &&
              availableSFG.length > 0 &&
              sfgMaterials &&
              sfgMaterials.length > 0 &&
              sfgColors &&
              sfgColors.length > 0 &&
              sfgColors.map((item, idx) => (
                <option value={item}>{item}</option>
              ))}
          </select>
        </div>
        {/* Jobber */}
        <div className="flex flex-col">
          <FormLabel title={"Jobber"} />
          <select
            name="sfg_jobber"
            className="border border-gray-300 bg-gray-100 rounded-md p-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            defaultValue=""
            value={SfgData.sfg_jobber}
            onChange={sfgDataHandler}
            disabled={
              !SfgData.sfg_material || !SfgData.sfg_group || !SfgData.sfg_color
            }
          >
            <option value="" disabled>
              Select Jobber
            </option>
            {availableSFG &&
              availableSFG.length > 0 &&
              availableSFGBasedOnMaterial &&
              availableSFGBasedOnMaterial.length > 0 &&
              availableSFGBasedOnColor &&
              sfgJobber &&
              sfgJobber.length > 0 &&
              sfgJobber.map((item, idx) => (
                <option value={item.id}>
                  {item.jobber.jobber_name + " - " + item.jobber.work_type}
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
            id=""
            onChange={sfgDataHandler}
            value={SfgData.sfg_qty}
          />
        </div>
        {/*  total cost  */}
        <div className="flex flex-col">
          <label className="text-gray-700 font-semibold">Total Cost</label>
          <input
            value={SfgData.sfg_total_cost}
            className="p-2 border bg-gray-100 border-gray-300 rounded-md"
            type="text"
            placeholder="0.0"
            name="sfg_total_cost"
            id=""
            disabled
          />
        </div>
        {/* Remarks */}
        <div className="flex flex-col">
          <label className="text-gray-700 font-semibold">Remarks</label>
          <textarea
            className="p-2 border bg-gray-100 border-gray-300 rounded-md"
            type="text"
            placeholder="Remarks"
            name="sfg_description"
            id=""
            onChange={sfgDataHandler}
            value={SfgData.sfg_remarks}
          />
        </div>

        {/*  Table will be added here */}
        <div className="col-span-2 flex justify-center items-center">
          <DeleteTable
            data={SavedSfgData}
            setData={handleSfgDelete}
            header={BOMsfgHeader}
            key={SavedSfgData.length}
          />
        </div>
      </div>
    </div>
  );
};

export default HandleBOMsfg;
