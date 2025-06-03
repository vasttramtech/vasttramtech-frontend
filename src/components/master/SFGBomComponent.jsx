// import { useState, useEffect } from "react";
// import { toast } from "react-toastify";
// import DeleteTable from "../../smartTable/DeleteTable";
// import FormLabel from "../purchase/FormLabel";
// import { BounceLoader } from "react-spinners";
// import axios from "axios";

// const SFGBomComponent = ({
//   token,
//   sfgmGroup,
//   SavedSfgData,
//   setSavedSfgData,
//   FinalSFGData,
//   setFinalSFGData,
//   type,
// }) => {
//   const [sfgLoader, setSfgLoader] = useState(false);
//   const [availableSFG, setAvailableSFG] = useState([]);
//   const [sfgMaterials, setsfgMaterials] = useState([]);
//   const [sfgColors, setSfgColors] = useState([]);
//   const [sfgJobber, setSfgJobber] = useState([]);
//   const [availableSFGBasedOnMaterial, setAvailableSFGBasedOnMaterial] =
//     useState([]);
//   const [availableSFGBasedOnColor, setAvailableSFGBasedOnColor] = useState();
//   const [selectedJobber, setSelectedJobber] = useState();

//   const BOMsfgHeader = [
//     "SFG group",
//     "Material",
//     "Color",
//     "Jobber",
//     "Quantity",
//     "Total Cost",
//     "Description",
//   ];

//   // state for BOM's Semi finished goods master
//   const [SfgData, setSfgData] = useState({
//     sfg_group: "",
//     sfg_material: "",
//     sfg_color: "",
//     sfg_jobber: "",
//     sfg_qty: 0,
//     sfg_total_cost: "",
//     sfg_description: "",
//   });

//   const sfgDataHandler = (event) => {
//     event.preventDefault();
//     setSfgData({ ...SfgData, [event.target.name]: event.target.value });
//   };

//   // Handle deletion of SFG data
//   const handleSfgDelete = (ind) => {
//     setSavedSfgData(SavedSfgData.filter((item, index) => index !== ind));
//     setFinalSFGData(FinalSFGData.filter((item, index) => index !== ind));
//   };

//   const fetchIndividualGroupData = async () => {
//     try {
//       if (!SfgData.sfg_group) {
//         return;
//       }

//       setSfgData({
//         ...SfgData,
//         sfg_material: "",
//         sfg_color: "",
//         sfg_jobber: "",
//         sfg_qty: "",
//         sfg_total_cost: "",
//         sfg_description: "",
//       });

//       setSfgLoader(true);
//       const response = await axios.get(
//         `${process.env.REACT_APP_BACKEND_URL}/api/custom-semi-finished-goods/group/${SfgData.sfg_group}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (!response || !response.data) {
//         setAvailableSFG([]);
//       } else {
//         setAvailableSFG(response.data);
//       }
//     } catch (error) {
//       console.error("Error fetching SFG data:", error);
//     } finally {
//       setSfgLoader(false);
//     }
//   };

//   // Update the SFG data
//   const updateSFGdata = (event) => {
//     event.preventDefault();

//     if (
//       !SfgData.sfg_group ||
//       !SfgData.sfg_color ||
//       !SfgData.sfg_material ||
//       !SfgData.sfg_qty ||
//       !SfgData.sfg_total_cost ||
//       !SfgData.sfg_jobber ||
//       !SfgData.sfg_description
//     ) {
//       toast.error("Please fill all the fields.");
//       return;
//     }

//     setFinalSFGData([
//       ...FinalSFGData,
//       {
//         semi_finished_goods: availableSFGBasedOnColor.id,
//         jobber_master: Number(selectedJobber.jobber.id),
//         qty: Number(SfgData.sfg_qty),
//         total_price: Number(SfgData.sfg_total_cost),
//         sfg_description: SfgData.sfg_description,
//       },
//     ]);

//     setSavedSfgData([
//       ...SavedSfgData,
//       {
//         ...SfgData,
//         sfg_jobber:
//           selectedJobber.jobber.jobber_name +
//           "-" +
//           selectedJobber.jobber.work_type,
//       },
//     ]);

//     // Reset form
//     setSfgData({
//       sfg_group: "",
//       sfg_material: "",
//       sfg_color: "",
//       sfg_jobber: "",
//       sfg_qty: 0,
//       sfg_total_cost: "",
//       sfg_description: "",
//     });

//     setAvailableSFGBasedOnMaterial([]);
//     setAvailableSFGBasedOnColor([]);
//     setSfgColors([]);
//     setSfgJobber([]);
//     setsfgMaterials([]);
//     setSelectedJobber({});
//   };

//   // Effect to fetch data when SFG group changes
//   useEffect(() => {
//     fetchIndividualGroupData();
//   }, [SfgData.sfg_group]);

//   // Effect to update materials when available SFG changes
//   useEffect(() => {
//     if (!SfgData.sfg_group) return;
//     setSfgData({
//       ...SfgData,
//       sfg_color: "",
//       sfg_jobber: "",
//       sfg_qty: "",
//       sfg_total_cost: 0,
//       sfg_description: "",
//     });
//     setAvailableSFGBasedOnMaterial([]);
//     setAvailableSFGBasedOnColor([]);
//     setSfgColors([]);
//     setSfgJobber([]);
//     setSelectedJobber();
//     const options = new Set();
//     availableSFG.map((sfg) => {
//       options.add(sfg.semi_finished_goods_name);
//     });
//     setsfgMaterials(Array.from(options));
//   }, [availableSFG]);

//   // Effect to update when material changes
//   useEffect(() => {
//     if (!SfgData.sfg_material) return;
//     setSfgData({ ...SfgData, sfg_color: "", sfg_jobber: "" });
//     setAvailableSFGBasedOnColor([]);
//     setSfgJobber([]);
//     setSelectedJobber();
//     setAvailableSFGBasedOnMaterial(
//       availableSFG.filter(
//         (sfg) => sfg.semi_finished_goods_name == SfgData.sfg_material
//       )
//     );
//   }, [SfgData.sfg_material]);

//   // Effect to update colors when material changes
//   useEffect(() => {
//     if (!SfgData.sfg_material) return;
//     const options = new Set();
//     availableSFGBasedOnMaterial.map((sfg) => {
//       options.add(sfg.color.color_name);
//     });
//     setSfgColors(Array.from(options));
//   }, [availableSFGBasedOnMaterial]);

//   // Effect to update when color changes
//   useEffect(() => {
//     if (!SfgData.sfg_color) return;
//     setSelectedJobber();
//     setSfgData({ ...SfgData, sfg_jobber: "" });
//     setSfgJobber([]);
//     setAvailableSFGBasedOnColor(
//       availableSFGBasedOnMaterial.find(
//         (sfg) => sfg.color.color_name == SfgData.sfg_color
//       ) || {}
//     );
//   }, [SfgData.sfg_color]);

//   // Effect to update jobbers when color changes
//   useEffect(() => {
//     if (
//       !SfgData.sfg_color ||
//       !availableSFGBasedOnColor ||
//       !availableSFGBasedOnColor?.add_karigar ||
//       availableSFGBasedOnColor?.add_karigar.length == 0
//     )
//       return;
//     const option = new Set();
//     availableSFGBasedOnColor?.add_karigar.map((sfg) => {
//       option.add(sfg);
//     });
//     setSfgJobber(Array.from(option));
//   }, [availableSFGBasedOnColor]);

//   // Effect to update selected jobber
//   useEffect(() => {
//     if (!SfgData.sfg_jobber) return;
//     setSelectedJobber(
//       sfgJobber.find((jobber) => jobber.id == SfgData.sfg_jobber)
//     );
//   }, [SfgData.sfg_jobber]);

//   // Effect to calculate total cost
//   useEffect(() => {
//     if (
//       !SfgData.sfg_material ||
//       !SfgData.sfg_color ||
//       !SfgData.sfg_qty ||
//       !selectedJobber ||
//       !availableSFGBasedOnColor
//     ) {
//       setSfgData({ ...SfgData, sfg_total_cost: 0 });
//       return;
//     }

//     setSfgData({
//       ...SfgData,
//       sfg_total_cost:
//         (Number(availableSFGBasedOnColor.price_per_unit) +
//           Number(selectedJobber.rate)) *
//         Number(SfgData.sfg_qty),
//     });
//   }, [
//     selectedJobber,
//     SfgData.sfg_qty,
//     SfgData.sfg_color,
//     SfgData.sfg_material,
//     SfgData.sfg_group,
//   ]);

//   return (
//     <div>
//       <div className="flex items-center gap-2">
//         <p className="text-xl font-semibold">Semi Finished Goods Master </p>
//         <button
//           type="button"
//           className="bg-blue-500 hover:bg-blue-600 text-center rounded-md px-2 text-white font-semibold text-sm"
//           onClick={(event) => updateSFGdata(event)}
//         >
//           Add
//         </button>
//       </div>

//       {sfgLoader ? (
//         <div className="flex justify-center items-center border border-gray-300 shadow-xl p-5 rounded-xl">
//           <BounceLoader />
//         </div>
//       ) : (
//         <>
//           <div className="mt-2 grid grid-cols-2 gap-6 p-5 border border-gray-300 shadow-sm rounded-xl">
//             {/* SFG Group */}
//             <div className="flex flex-col">
//               <FormLabel title={"SFG Group"} />
//               <select
//                 name="sfg_group"
//                 className="border border-gray-300 bg-gray-100 rounded-md p-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 defaultValue=""
//                 onChange={sfgDataHandler}
//                 value={SfgData.sfg_group}
//               >
//                 <option value="" disabled>
//                   Select SFG Group
//                 </option>
//                 {sfgmGroup &&
//                   Array.isArray(sfgmGroup) &&
//                   sfgmGroup.map((group, index) => (
//                     <option key={index} value={group.id}>
//                       {group.group_name}
//                     </option>
//                   ))}
//               </select>
//             </div>

//             {/* SFG Material */}
//             <div className="flex flex-col">
//               <label className="text-gray-700 font-semibold">
//                 SFG Material
//               </label>
//               <select
//                 name="sfg_material"
//                 onChange={sfgDataHandler}
//                 value={SfgData.sfg_material}
//                 className="border border-gray-300 bg-gray-100 rounded-md p-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 defaultValue=""
//                 disabled={!SfgData.sfg_group}
//               >
//                 <option value="" disabled>
//                   Select SFG Material
//                 </option>
//                 {availableSFG &&
//                   availableSFG.length > 0 &&
//                   sfgMaterials &&
//                   sfgMaterials.length > 0 &&
//                   sfgMaterials.map((item, index) => (
//                     <option key={index} value={`${item}`}>
//                       {item}
//                     </option>
//                   ))}
//               </select>
//             </div>

//             {/* Color */}
//             <div className="flex flex-col">
//               <label className="text-gray-700 font-semibold">Color</label>
//               <select
//                 name="sfg_color"
//                 className="border border-gray-300 bg-gray-100 rounded-md p-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 defaultValue=""
//                 onChange={sfgDataHandler}
//                 value={SfgData.sfg_color}
//                 disabled={!SfgData.sfg_material || !SfgData.sfg_group}
//               >
//                 <option value="" disabled>
//                   Select Color
//                 </option>
//                 {availableSFG &&
//                   availableSFG.length > 0 &&
//                   sfgMaterials &&
//                   sfgMaterials.length > 0 &&
//                   sfgColors &&
//                   sfgColors.length > 0 &&
//                   sfgColors.map((item, idx) => (
//                     <option key={idx} value={item}>
//                       {item}
//                     </option>
//                   ))}
//               </select>
//             </div>

//             {/* Jobber */}
//             <div className="flex flex-col">
//               <FormLabel title={"Jobber"} />
//               <select
//                 name="sfg_jobber"
//                 className="border border-gray-300 bg-gray-100 rounded-md p-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 defaultValue=""
//                 value={SfgData.sfg_jobber}
//                 onChange={sfgDataHandler}
//                 disabled={
//                   !SfgData.sfg_material ||
//                   !SfgData.sfg_group ||
//                   !SfgData.sfg_color
//                 }
//               >
//                 <option value="" disabled>
//                   Select Jobber
//                 </option>
//                 {availableSFG &&
//                   availableSFG.length > 0 &&
//                   availableSFGBasedOnMaterial &&
//                   availableSFGBasedOnMaterial.length > 0 &&
//                   availableSFGBasedOnColor &&
//                   sfgJobber &&
//                   sfgJobber.length > 0 &&
//                   sfgJobber.map((item, idx) => (
//                     <option key={idx} value={item.id}>
//                       {item.jobber.jobber_name + " - " + item.jobber.work_type}
//                     </option>
//                   ))}
//               </select>
//             </div>

//             {/* Qty */}
//             <div className="flex flex-col">
//               <label className="text-gray-700 font-semibold">Qty</label>
//               <input
//                 className="p-2 border bg-gray-100 border-gray-300 rounded-md"
//                 type="number"
//                 placeholder="0.0"
//                 name="sfg_qty"
//                 onChange={sfgDataHandler}
//                 value={SfgData.sfg_qty}
//               />
//             </div>

//             {/* Sfg Description */}
//             <div className="flex flex-col">
//               <label className="text-gray-700 font-semibold">Remarks</label>
//               <textarea
//                 className="p-2 border bg-gray-100 border-gray-300 rounded-md"
//                 placeholder="Enter Remarks here"
//                 name="sfg_description"
//                 onChange={sfgDataHandler}
//                 value={SfgData.sfg_description}
//               />
//             </div>

//             {/* Total Cost */}
//             <div className="flex flex-col">
//               <label className="text-gray-700 font-semibold">Total Cost</label>
//               <input
//                 value={SfgData.sfg_total_cost}
//                 className="p-2 border bg-gray-100 border-gray-300 rounded-md"
//                 type="text"
//                 placeholder="0.0"
//                 name="sfg_total_cost"
//                 disabled
//               />
//             </div>

//             {/* Table */}
//             <div className="col-span-2 flex justify-center items-center">
//               <DeleteTable
//                 data={SavedSfgData}
//                 setData={handleSfgDelete}
//                 header={BOMsfgHeader}
//                 key={SavedSfgData.length}
//               />
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default SFGBomComponent;




import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import DeleteTable from "../../smartTable/DeleteTable";
import FormLabel from "../purchase/FormLabel";
import { BounceLoader } from "react-spinners";
import axios from "axios";

const SFGBomComponent = ({
  token,
  sfgmGroup,
  SavedSfgData,
  setSavedSfgData,
  FinalSFGData,
  setFinalSFGData,
}) => {
  const [sfgLoader, setSfgLoader] = useState(false);
  const [availableSFG, setAvailableSFG] = useState([]);
  const [sfgMaterials, setsfgMaterials] = useState([]);
  const [sfgColors, setSfgColors] = useState([]);
  const [sfgJobber, setSfgJobber] = useState([]);
  const [availableSFGBasedOnMaterial, setAvailableSFGBasedOnMaterial] =
    useState([]);
  const [availableSFGBasedOnColor, setAvailableSFGBasedOnColor] = useState();
  const [selectedJobber, setSelectedJobber] = useState();

  const BOMsfgHeader = [
    "SFG group",
    "Material",
    "Color",
    "Jobber",
    "Quantity",
    "Total Cost",
    "Description",
  ];

  // state for BOM's Semi finished goods master
  const [SfgData, setSfgData] = useState({
    sfg_group: "",
    sfg_material: "",
    sfg_color: "",
    sfg_jobber: "",
    sfg_qty: 0,
    sfg_total_cost: "",
    sfg_description: "",
  });

  const sfgDataHandler = (event) => {
    event.preventDefault();
    const { name, value } = event.target;
    
    // Reset dependent fields when a parent field changes
    if (name === "sfg_group") {
      setSfgData({
        ...SfgData,
        [name]: value,
        sfg_material: "",
        sfg_color: "",
        sfg_jobber: "",
        sfg_qty: 0,
        sfg_total_cost: "",
        sfg_description: "",
      });
    } else if (name === "sfg_material") {
      setSfgData({
        ...SfgData,
        [name]: value,
        sfg_color: "",
        sfg_jobber: "",
        sfg_qty: 0,
        sfg_total_cost: "",
      });
    } else if (name === "sfg_color") {
      setSfgData({
        ...SfgData,
        [name]: value,
        sfg_jobber: "",
        sfg_qty: 0,
        sfg_total_cost: "",
      });
    } else {
      setSfgData({ ...SfgData, [name]: value });
    }
  };

  // Handle deletion of SFG data
  const handleSfgDelete = (ind) => {
    setSavedSfgData(SavedSfgData.filter((item, index) => index !== ind));
    setFinalSFGData(FinalSFGData.filter((item, index) => index !== ind));
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

  // Update the SFG data
  const updateSFGdata = (event) => {
    event.preventDefault();

    if (
      !SfgData.sfg_group ||
      !SfgData.sfg_color ||
      !SfgData.sfg_material ||
      !SfgData.sfg_qty ||
      !SfgData.sfg_total_cost ||
      !SfgData.sfg_jobber ||
      !SfgData.sfg_description
    ) {
      toast.error("Please fill all the fields.");
      return;
    }

    setFinalSFGData([
      ...FinalSFGData,
      {
        semi_finished_goods: availableSFGBasedOnColor.id,
        jobber_master: Number(selectedJobber.jobber.id),
        qty: Number(SfgData.sfg_qty),
        total_price: Number(SfgData.sfg_total_cost),
        sfg_description: SfgData.sfg_description,
      },
    ]);

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

    // Reset form
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
    setAvailableSFGBasedOnColor(null);
    setSfgColors([]);
    setSfgJobber([]);
    setsfgMaterials([]);
    setSelectedJobber(null);
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
        (sfg) => sfg.semi_finished_goods_name === SfgData.sfg_material
      );
      setAvailableSFGBasedOnMaterial(filteredSFG);
    } else {
      setAvailableSFGBasedOnMaterial([]);
      setSfgColors([]);
    }
  }, [SfgData.sfg_material, availableSFG]);

  // Effect to update colors when material changes
  useEffect(() => {
    if (availableSFGBasedOnMaterial.length > 0) {
      const options = new Set();
      availableSFGBasedOnMaterial.forEach((sfg) => {
        options.add(sfg.color.color_name);
      });
      setSfgColors(Array.from(options));
    } else {
      setSfgColors([]);
    }
  }, [availableSFGBasedOnMaterial]);

  // Effect to update when color changes
  useEffect(() => {
    if (SfgData.sfg_color && availableSFGBasedOnMaterial.length > 0) {
      const colorSFG = availableSFGBasedOnMaterial.find(
        (sfg) => sfg.color.color_name === SfgData.sfg_color
      );
      setAvailableSFGBasedOnColor(colorSFG || null);
    } else {
      setAvailableSFGBasedOnColor(null);
      setSfgJobber([]);
    }
  }, [SfgData.sfg_color, availableSFGBasedOnMaterial]);

  // Effect to update jobbers when color changes
  useEffect(() => {
    if (
      availableSFGBasedOnColor &&
      availableSFGBasedOnColor.add_karigar &&
      availableSFGBasedOnColor.add_karigar.length > 0
    ) {
      setSfgJobber([...availableSFGBasedOnColor.add_karigar]);
    } else {
      setSfgJobber([]);
    }
  }, [availableSFGBasedOnColor]);

  // Effect to update selected jobber
  useEffect(() => {
    if (SfgData.sfg_jobber && sfgJobber.length > 0) {
      const jobber = sfgJobber.find(
        (jobber) => jobber.id == SfgData.sfg_jobber
      );
      setSelectedJobber(jobber || null);
    } else {
      setSelectedJobber(null);
    }
  }, [SfgData.sfg_jobber, sfgJobber]);

  // Effect to calculate total cost
  useEffect(() => {
    if (
      SfgData.sfg_material &&
      SfgData.sfg_color &&
      SfgData.sfg_qty &&
      selectedJobber &&
      availableSFGBasedOnColor
    ) {
      const totalCost =
        (Number(availableSFGBasedOnColor.price_per_unit) +
          Number(selectedJobber.rate)) *
        Number(SfgData.sfg_qty);
      
      setSfgData({
        ...SfgData,
        sfg_total_cost: totalCost,
      });
    } else {
      setSfgData({
        ...SfgData,
        sfg_total_cost: 0,
      });
    }
  }, [
    selectedJobber,
    SfgData.sfg_qty,
    SfgData.sfg_color,
    SfgData.sfg_material,
    availableSFGBasedOnColor,
  ]);

  return (
    <div>
      <div className="flex items-center gap-2">
        <p className="text-xl font-semibold">Semi Finished Goods Master </p>
        <button
          type="button"
          className="bg-blue-500 hover:bg-blue-600 text-center rounded-md px-2 text-white font-semibold text-sm"
          onClick={(event) => updateSFGdata(event)}
        >
          Add
        </button>
      </div>

      {sfgLoader ? (
        <div className="flex justify-center items-center border border-gray-300 shadow-xl p-5 rounded-xl">
          <BounceLoader />
        </div>
      ) : (
        <>
          <div className="mt-2 grid grid-cols-2 gap-6 p-5 border border-gray-300 shadow-sm rounded-xl">
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

            {/* SFG Material */}
            <div className="flex flex-col">
              <label className="text-gray-700 font-semibold">
                SFG Material
              </label>
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
                {sfgMaterials &&
                  sfgMaterials.length > 0 &&
                  sfgMaterials.map((item, index) => (
                    <option key={index} value={item}>
                      {item}
                    </option>
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
                {sfgColors &&
                  sfgColors.length > 0 &&
                  sfgColors.map((item, idx) => (
                    <option key={idx} value={item}>
                      {item}
                    </option>
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
                  !SfgData.sfg_material ||
                  !SfgData.sfg_group ||
                  !SfgData.sfg_color
                }
              >
                <option value="" disabled>
                  Select Jobber
                </option>
                {sfgJobber &&
                  sfgJobber.length > 0 &&
                  sfgJobber.map((item, idx) => (
                    <option key={idx} value={item.id}>
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

            {/* Total Cost */}
            <div className="flex flex-col">
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

            {/* Table */}
            <div className="col-span-2 flex justify-center items-center">
              <DeleteTable
                data={SavedSfgData}
                setData={handleSfgDelete}
                header={BOMsfgHeader}
                key={SavedSfgData.length}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SFGBomComponent;