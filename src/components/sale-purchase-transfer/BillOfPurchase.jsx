// import { useEffect, useState } from "react";
// import SelectionTable from "../../smartTable/SelectionTable";
// import FormLabel from "../purchase/FormLabel";
// import FormInput from "../utility/FormInput";
// import SmartTable from "../../smartTable/SmartTable";
// import SmartTable1 from "../../smartTable/SmartTable1";
// import axios from "axios";
// import { useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { BounceLoader, PuffLoader } from "react-spinners";
// import SmartTable2 from "../../smartTable/SmartTable2";
// import { toast } from "react-toastify";

// const SelectSOTable = ({
//   NoOfColumns,
//   data,
//   headers,
//   setSelectedRow,
//   selectedRow,
//   setDisplayModal,
//   billId,
//   setBosId,
//   setBillOfSale,
//   setLoading,
//   setBosDisplayModal,
//   setFormData,
//   setSelectedRows,
//   setAlreadyReceivedQty,
//   setStitchingSO,
//   setAllReceivedItemGoods
// }) => {
//   // console.log(setOfSelectedIndex);
//   const { token } = useSelector((state) => state.auth);
//   const [updatedData, setUpdatedData] = useState([]);
//   const navigate = useNavigate();
//   const [updatedHeader] = useState(["select", ...headers]);
//   const updateTableData = () => {
//     const updatedValues = data.map((item) => ({
//       select: (
//         <input
//           type="checkbox"
//           checked={billId === item.id}
//           onChange={() => handleClick(item.id, item.so_id)}
//           key={item.id}
//         />
//       ),
//       ...item,
//     }));

//     // const selectedRow = data.find((item) => item.id === selectedSOId);
//     setSelectedRow(selectedRow ? [selectedRow] : []);
//     setUpdatedData(
//       updatedValues.map((item) =>
//         Object.fromEntries(Object.entries(item).slice(0, NoOfColumns + 1))
//       )
//     );
//   };

//   const handleClick = async (id, so_id) => {
//     setBosId(id);
//     setSelectedRows([]);
//     try {
//       setLoading(true);
//       const [response, response2, response3, response4] = await Promise.all([
//         axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/custom-bill-of-sale/${id}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//         axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/bill-of-purchase/by-bill-of-sale/${id}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//         axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/stitching-so/by-so-id/${so_id}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//         axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/bill-of-purchase/aggregate-by-so/${so_id}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//       ]);

//       const responseData = response.data;
//       const receivedData = response2.data;
//       setAlreadyReceivedQty(receivedData);

//       // Create maps for quick lookup
//       const rawReceivedMap = {};
//       const sfgReceivedMap = {};

//       for (const item of receivedData.raw_materials || []) {
//         rawReceivedMap[item.raw_material_entries_id] = item.total_receive_qty;
//       }

//       for (const item of receivedData.semi_finished_goods || []) {
//         sfgReceivedMap[item.semi_finished_goods_entries_id] = item.total_receive_qty;
//       }

//       // Merge the already received data into stitch_ready arrays
//       const enrichedStitchReadyRM = (responseData.stitch_ready_rm || []).map(item => ({
//         ...item,
//         already_received_bop: rawReceivedMap[item.raw_material_entries_id] || 0
//       }));

//       const enrichedStitchReadySFG = (responseData.stitch_ready_sfg || []).map(item => ({
//         ...item,
//         already_received_bop: sfgReceivedMap[item.semi_finished_goods_entries_id] || 0
//       }));

//       setBillOfSale(responseData);
//       if (response3.data && response3.data.data !== null) {
//         setStitchingSO(response3.data.data);
//       } else {
//         setStitchingSO(null);
//       }
//       setFormData(prev => ({
//         ...prev,
//         billId: responseData?.id || prev.billId,
//         rawMaterial: Array.isArray(responseData.raw_materials_send)
//           ? responseData.raw_materials_send
//           : prev.rawMaterial,

//         semiFinishedGoods: Array.isArray(responseData.sfg_send)
//           ? responseData.sfg_send
//           : prev.semiFinishedGoods,

//         date: responseData?.date || prev.date,
//         clearDate: responseData?.ex_date || prev.clearDate,
//         so_id: responseData?.internal_sales_order_entry?.so_id || responseData?.sales_order_entry?.so_id || prev.so_id,
//         design: responseData?.design?.design_number || prev.design,
//         processor: responseData?.processor,
//         stitch_ready_rm: enrichedStitchReadyRM,
//         stitch_ready_sfg: enrichedStitchReadySFG,
//       }));
//       setAllReceivedItemGoods(response4.data);
//       setDisplayModal(false);
//       setBosDisplayModal(true);
//     } catch (error) {
//       console.error("Error fetching jobber data:", error);
//       if (error.response?.status === 401) {
//         navigate("/login");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     updateTableData();
//   }, [data]);
//   return <SmartTable2 data={updatedData} headers={updatedHeader} />;
// };

// const processorOption = [
//   {
//     id: 1,
//     name: 'Processor 1'
//   },
//   {
//     id: 2,
//     name: 'Processor 2'
//   },
//   {
//     id: 3,
//     name: 'Processor 3'
//   }
// ]

// const BillOfPurchase = () => {
//   const headersForTable = ["Bill of Sales Id", "Bill Type", "SO ID", "Date", "Job Note", "Processor", "Remarks", "Total Bill Amount", "Bill Status"];

//   const [displayModal, setDisplayModal] = useState(false);
//   const { load, error, availableProcessor } = useSelector((state) => state.fetchData);
//   const [selectedRow, setSelectedRow] = useState([]);
//   const [setOfSelectedIndex, setSetOfSelectedIndex] = useState(new Set());
//   const [design, setDesign] = useState([1, 2, 3]);
//   const [nextJobber, setNextjobber] = useState(["jb1", "jb2", "jb3"]);
//   const [sellerName, setSellerName] = useState([
//     "seller1",
//     "seller2",
//     "seller3",
//   ]);

//   const [displayHeaders, setDisplayHeaders] = useState([
//     "item_name",
//     "particulars",
//     "hsn_code",
//     "unit",
//     "colour",
//     "required_qty",
//     "rate",
//     "exta_qty",
//     "amount",
//     "cgst",
//     "sgst",
//     "igst",
//     "total",
//   ]);
//   const [formData, setFormData] = useState({
//     billId: "",
//     stitch_ready_rm: [],
//     stitch_ready_sfg: [],
//     date: "",
//     clearDate: "",
//     so_id: "",
//     ex_date: "",
//     referenceBill: "",
//     design: "",
//     jobber: "",
//     color: "",
//     processor: "",
//     seller: "",
//     purchaserDetails: "",
//     remarks: "",
//     jobNote: "",
//     otherCharges: "",
//     totalBillAmount: "",
//   })

//   const { token } = useSelector(state => state.auth);
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);
//   const [billData, setBillData] = useState([]);
//   const [bosId, setBosId] = useState(null);
//   const [billOfSale, setBillOfSale] = useState(null);
//   const [bosDisplayModal, setBosDisplayModal] = useState(false);
//   const [selectedRows, setSelectedRows] = useState([]);
//   const [receiveQuantities, setReceiveQuantities] = useState({});
//   const [extraQuantities, setExtraQuantities] = useState({});
//   const [selectedSfgRows, setSelectedSfgRows] = useState([]);
//   const [sfgReceiveQuantities, setSfgReceiveQuantities] = useState({});
//   const [sfgExtraQuantities, setSfgExtraQuantities] = useState({});
//   const [jobberDetail, setJobberDetail] = useState([]);
//   const [color, setColor] = useState([]);
//   const [alreadyReceivedQty, setAlreadyReceivedQty] = useState([]);
//   const [stitchingSO, setStitchingSO] = useState(null);
//   const [allReceivedItemGoods, setAllReceivedItemGoods] = useState(null);

//   const fetchBillOfSales = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/bill-of-sales?filters[billOfSales_status][$eq]=open&populate=*`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       const response2 = await axios.get(
//         `${process.env.REACT_APP_BACKEND_URL}/api/jobber-masters?populate=*`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       const response3 = await axios.get(
//         `${process.env.REACT_APP_BACKEND_URL}/api/colors?populate=*`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       const data = Array.isArray(response.data.data) ? response.data.data : [];
//       console.log("data: ", data);
//       const mappedData = data.map((bills) => {
//         const isInternal = bills.internal_sales_order_entry;
//         const isSales = bills.sales_order_entry;

//         return {
//           id: bills.id,
//           type: bills.type === "internal-sales-order-entries" ? "Vasttram Sales Order" : "Customer Sales Order",
//           so_id: isInternal?.so_id || isSales?.so_id || "",
//           date: bills.ex_date,
//           jobNote: bills.job_note,
//           processor: bills.processor.name,
//           remarks: bills.remarks,
//           Total_Amount: bills.Total_Bill_of_sales_Amount,
//           billOfSales_status: bills.billOfSales_status,
//         };
//       });

//       setBillData(mappedData);
//       const jobbers = Array.isArray(response2.data.data)
//         ? response2.data.data
//         : [];
//       setJobberDetail(jobbers);
//       const colorGroup = Array.isArray(response3.data.data)
//         ? response3.data.data
//         : [];
//       setColor(colorGroup);

//     } catch (error) {
//       console.error("Error fetching jobber data:", error);
//       if (error.response?.status === 401) {
//         navigate("/login");
//       }
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     if (!token) {
//       navigate("/login");
//       return;
//     }
//     fetchBillOfSales();
//   }, [token]);

//   const handleInputChange = (index, field, value) => {
//     setFormData((prev) => {
//       const updatedRawMaterial = [...prev.rawMaterial];
//       const row = updatedRawMaterial[index];

//       if (field === "receiveQty" && value > row.Quantity) {
//         alert("Receive Qty cannot be more than Sale Qty");
//         return prev; // Don't update
//       }

//       updatedRawMaterial[index] = {
//         ...row,
//         [field]: value,
//       };

//       return {
//         ...prev,
//         rawMaterial: updatedRawMaterial,
//       };
//     });
//   };


//   const formDataChangeHandler = (event) => {

//     setFormData((prev) => ({
//       ...prev,
//       [event.target.name]: event.target.value
//     }))
//     console.log(formData.date)
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSubmitting(true);

//     if (formData.billId === "") {
//       toast("Please select the Bill of sales.");
//       setSubmitting(false);
//       return;
//     }

//     if (selectedRows.length <= 0 && selectedSfgRows.length <= 0) {
//       toast.warning("Please add at least one raw material or semi-finished good.", {
//         position: "top-right",
//       });
//       setSubmitting(false);
//       return;
//     }

//     const invalidRawMaterialExtraQty = selectedRows.some((row) => {
//       const totalReceived = (row.already_received_bop || 0) + (row.entered_qty || 0);
//       return row.extra_qty > 0 && row.receive_qty !== totalReceived;
//     });

//     const invalidSfgExtraQty = selectedSfgRows.some((row) => {
//       const totalReceived = (row.already_received_bop || 0) + (row.entered_qty || 0);
//       return row.extra_qty > 0 && row.receive_qty !== totalReceived;
//     });

//     if (invalidRawMaterialExtraQty || invalidSfgExtraQty) {
//       toast.warning("You can add extra quantity only when Sale Qty is fully received.", {
//         position: "top-right",
//       });
//       setSubmitting(false);
//       return;
//     }

//     const postData = {
//       data: {
//         billOfSale: formData.billId,
//         date: formData.date,
//         clearDate: formData.clearDate,
//         so_id: formData.so_id,
//         ex_date: formData.ex_date,
//         reference_bill: formData.referenceBill,
//         design: formData.design,
//         next_jobber: formData.jobber,
//         color: formData.color,
//         processor: formData.processor,
//         seller_detail: formData.seller,
//         purchaser_Details: formData.purchaserDetails,
//         remarks: formData.remarks,
//         jobNote: formData.jobNote,
//         other_charges: formData.otherCharges,
//         Total_Bill_Amount_Bop: formData.totalBillAmount,
//         bop_stitchReady_rm: selectedRows.map((row) => ({
//           raw_materials: row.raw_materials.id ?? null,
//           description: row.description,
//           sale_qty: row.receive_qty,
//           already_received: row.already_received_bop,
//           receive_qty: row.entered_qty,
//           extra_qty: row.extra_qty,
//           raw_material_entries_id: row.raw_material_entries_id,
//         })),
//         bop_receive_sfg: selectedSfgRows.map((row) => ({
//           sfgs: row.sfg.id,
//           description: row.description,
//           sale_qty: row.receive_qty,
//           already_received: row.already_received_bop,
//           receive_qty: row.entered_qty,
//           extra_qty: row.extra_qty,
//           semi_finished_goods_entries_id: row.semi_finished_goods_entries_id,
//         })),
//       },
//     };

//     try {
//       // Submit main bill-of-purchase data
//       await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/bill-of-purchases`, postData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       toast.success("Bill of purchases created successfully", { position: "top-right" });

//       // RAW MATERIAL STOCK UPDATE
//       const rawMaterialWithExtraQty = selectedRows.filter((row) => row.extra_qty > 0);

//       if (rawMaterialWithExtraQty.length > 0) {
//         const updateStockData = {
//           data: {
//             raw_material_master: rawMaterialWithExtraQty.map((row) => ({
//               raw_material_master: row.raw_materials.id,
//               Total_Qty: row.extra_qty,
//             })),
//           },
//         };

//         await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/custom/update-stock`, updateStockData, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         toast.success("Raw material stock updated for extra quantity", { position: "top-right" });
//       }

//       // SEMI-FINISHED GOODS STOCK UPDATE
//       const sfgWithExtraQty = selectedSfgRows.filter((row) => row.extra_qty > 0);

//       if (sfgWithExtraQty.length > 0) {
//         const updateSfgStockData = {
//           data: {
//             semi_finished_goods_master: sfgWithExtraQty.map((row) => ({
//               semi_finished_goods_master: row.sfg.id,
//               Quantity: row.extra_qty,
//             })),
//           },
//         };

//         await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/custom/update-stock-sfg`, updateSfgStockData, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         toast.success("Semi-finished goods stock updated for extra quantity", { position: "top-right" });
//       }

//       const so = billOfSale.internal_sales_order_entry || billOfSale.sales_order_entry;
//       const soQty = parseFloat(so.qty || 0);

//       // Step 1: Prepare required RM and SFG with multiplied qty
//       const requiredRawMaterials = so.design_number.raw_material_entries?.map((entry) => ({
//         id: parseInt(entry.id),
//         required_qty: parseFloat(entry.qty || 0) * soQty,
//       })) || [];

//       const requiredSFGs = so.design_number.semi_finished_goods_entries?.map((entry) => ({
//         id: parseInt(entry.id),
//         required_qty: parseFloat(entry.qty || 0) * soQty,
//       })) || [];

//       console.log("requiredRawMaterials: ", requiredRawMaterials)
//       console.log("requiredSFGs: ", requiredSFGs)

//       const mergedRawMaterials = [...allReceivedItemGoods.raw_materials];
//       const mergedSFGs = [...allReceivedItemGoods.semi_finished_goods];

//       // Process raw materials
//       selectedRows.forEach((row) => {
//         const matchIndex = mergedRawMaterials.findIndex(
//           (item) => item.raw_material_entries_id === row.raw_material_entries_id
//         );

//         if (matchIndex !== -1) {
//           // Match found, update total_receive_qty
//           mergedRawMaterials[matchIndex].total_receive_qty += parseFloat(row.entered_qty || 0);
//         } else {
//           // No match, add new entry
//           mergedRawMaterials.push({
//             raw_material_entries_id: row.raw_material_entries_id,
//             total_receive_qty: parseFloat(row.entered_qty || 0),
//           });
//         }
//       });

//       // Process semi-finished goods
//       selectedSfgRows.forEach((row) => {
//         const matchIndex = mergedSFGs.findIndex(
//           (item) => item.semi_finished_goods_entries_id === row.semi_finished_goods_entries_id
//         );

//         if (matchIndex !== -1) {
//           // Match found, update total_receive_qty
//           mergedSFGs[matchIndex].total_receive_qty += parseFloat(row.entered_qty || 0);
//         } else {
//           // No match, add new entry
//           mergedSFGs.push({
//             semi_finished_goods_entries_id: row.semi_finished_goods_entries_id,
//             total_receive_qty: parseFloat(row.entered_qty || 0),
//           });
//         }
//       });

//       // Final merged result
//       const finalMergedData = {
//         raw_materials: mergedRawMaterials,
//         semi_finished_goods: mergedSFGs,
//       };

//       console.log('Final Merged Data:', finalMergedData);

//       function isAllRequiredQtyReceived(requiredRawMaterials, requiredSFGs, finalMergedData) {
//         // Check for raw materials
//         const rawMaterialCheck = requiredRawMaterials.every((req) => {
//           const match = finalMergedData.raw_materials.find(
//             (item) => item.raw_material_entries_id === req.id
//           );
//           return match && parseFloat(match.total_receive_qty) === parseFloat(req.required_qty);
//         });

//         // Check for semi-finished goods
//         const sfgCheck = requiredSFGs.every((req) => {
//           const match = finalMergedData.semi_finished_goods.find(
//             (item) => item.semi_finished_goods_entries_id === req.id
//           );
//           return match && parseFloat(match.total_receive_qty) === parseFloat(req.required_qty);
//         });

//         // Return true only if both are fully matched
//         return rawMaterialCheck && sfgCheck;
//       }

//       const isComplete = isAllRequiredQtyReceived(requiredRawMaterials, requiredSFGs, finalMergedData);
//       console.log("All quantities match exactly:", isComplete);



//       if (stitchingSO === null) {

//         const stitchingStatus = isComplete ? "readyToStitch" : "receiving_material";
//         const postDataStitchingSO = {
//           data: {
//             internal_SO: billOfSale?.internal_sales_order_entry?.id || null,
//             external_So: billOfSale?.sales_order_entry?.id || null,
//             so_id: billOfSale?.so_id,
//             rm: selectedRows.map((row) => ({
//               raw_materials: row.raw_materials.id ?? null,
//               required_qty: row.receive_qty,
//               available_qty: row.entered_qty,
//               raw_material_entries_id: String(row.raw_material_entries_id),
//             })),
//             semi_goods: selectedSfgRows.map((row) => ({
//               sfg: row.sfg.id,
//               required_qty: row.receive_qty,
//               available_qty: row.entered_qty,
//               semi_finished_goods_entries_id: String(row.semi_finished_goods_entries_id),
//             })),
//             stitching_status: stitchingStatus
//           }
//         }

//         console.log("postDataStitchingSO: ", postDataStitchingSO);

//         await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/stitching-sos`, postDataStitchingSO, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         toast.success("Material added for Stitching", { position: "top-right" });
//         if (isComplete) {
//           const orderType = billOfSale.sales_order_entry === null ? "internal-sales-order-entry" : "sales-order-entry";
//           console.log("orderType: ", orderType);
//           const postData = {
//             data : {
//               orderType : orderType
//             }
//           }
//           await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/${orderType}/update-status/${billOfSale.so_id}/readyToStitch`,postData , {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           });
//           toast.success("Sales Order status change to Ready to Stitch.", { position: "top-right" });
//         }
//       } else {

//         const stitchingStatus = isComplete ? "readyToStitch" : "receiving_material";
//         const postDataStitchingSO = {
//           data: {
//             rm: selectedRows.map((row) => ({
//               raw_materials: row.raw_materials.id ?? null,
//               required_qty: row.receive_qty,
//               available_qty: row.entered_qty,
//               raw_material_entries_id: String(row.raw_material_entries_id),
//             })),
//             semi_goods: selectedSfgRows.map((row) => ({
//               sfg: row.sfg.id,
//               required_qty: row.receive_qty,
//               available_qty: row.entered_qty,
//               semi_finished_goods_entries_id: String(row.semi_finished_goods_entries_id),
//             })),
//             stitching_status: stitchingStatus
//           }
//         }
//         console.log("postDataStitchingSO: ", postDataStitchingSO)

//         await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/stitching-so/update/${billOfSale.so_id}`, postDataStitchingSO, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         toast.success("Material added for Stitching", { position: "top-right" });

//         if (isComplete) {
//           const orderType = stitchingSO.external_So === null ? "internal-sales-order-entry" : "sales-order-entry";
//           console.log("orderType: ", orderType);
//           const postData = {
//             data : {
//               orderType : orderType
//             }
//           }
//           await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/${orderType}/update-status/${billOfSale.so_id}/readyToStitch`,postData , {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           });
//           toast.success("Sales Order status change to Ready to Stitch.", { position: "top-right" });
//         }
//       }

//       const isAllFullyReceived = (
//         billRows,
//         selectedRows,
//         alreadyReceivedList,
//         key = 'raw_material_entries_id'
//       ) => {
//         return billRows.every((row) => {
//           const rowKey = row[key];

//           const selected = selectedRows.find(sel => sel[key] === rowKey);
//           const pastReceived = alreadyReceivedList.find(item => item[key] === rowKey);

//           const alreadyReceived = Number(pastReceived?.total_receive_qty || row.already_received_bop || 0);
//           const newlyEntered = Number(selected?.entered_qty || 0);

//           const totalReceived = alreadyReceived + newlyEntered;
//           const targetQty = Number(row.receive_qty);

//           return totalReceived >= targetQty;
//         });
//       };

//       const allRawMaterialsDone = isAllFullyReceived(
//         billOfSale.stitch_ready_rm,
//         selectedRows,
//         alreadyReceivedQty.raw_materials,
//         'raw_material_entries_id'
//       );

//       const allSfgsDone = isAllFullyReceived(
//         billOfSale.stitch_ready_sfg,
//         selectedSfgRows,
//         alreadyReceivedQty.semi_finished_goods,
//         'semi_finished_goods_entries_id'
//       );

//       if (allRawMaterialsDone && allSfgsDone) {
//         await axios.put(
//           `${process.env.REACT_APP_BACKEND_URL}/api/bill-of-sales/${formData.billId}/close`,
//           {},
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//         toast.success("Bill of Sale closed successfully!", { position: "top-right" });
//       }
//       setBosDisplayModal(false);
//       setSelectedRows([]);
//       setSelectedSfgRows([]);
//       setBillOfSale(null);
//       setReceiveQuantities({});
//       setExtraQuantities({});
//       setSfgReceiveQuantities({});
//       setSfgExtraQuantities({});
//       setAllReceivedItemGoods(null);
//       setFormData({
//         billId: "",
//         stitch_ready_rm: [],
//         stitch_ready_sfg: [],
//         date: "",
//         clearDate: "",
//         so_id: "",
//         ex_date: "",
//         referenceBill: "",
//         design: "",
//         jobber: "",
//         color: "",
//         processor: "",
//         seller: "",
//         purchaserDetails: "",
//         remarks: "",
//         jobNote: "",
//         otherCharges: "",
//         totalBillAmount: "",
//       })
//       fetchBillOfSales();
//       console.log("Data submitted successfully!", postData);
//     } catch (error) {
//       console.error("Error posting bill of sales:", error);
//       toast.error(error?.response?.data?.error?.message || "Something went wrong!");
//     } finally {
//       setSubmitting(false);
//     }
//   };


//   // console.log("billof sale: ", billOfSale);
//   // console.log("FormData: ", formData);
//   // console.log("selectedRows: ", selectedRows);
//   // console.log("receiveQuantities: ", receiveQuantities);
//   // console.log("selectedSfgRows: ", selectedSfgRows);
//   // console.log("sfgReceiveQuantities: ", sfgReceiveQuantities);
//   // console.log("JobberDetails: ", jobberDetail)
//   // console.log("alreadyReceivedQty: ", alreadyReceivedQty)
//   // console.log("stitchingSO: ", stitchingSO)
//   // console.log("allReceivedItemGoods: ", allReceivedItemGoods)

//   return (
//     <div className="py-2 bg-white rounded-lg relative">
//       {loading || load ? (
//         <div className="absolute inset-0 flex justify-center items-center mt-64 bg-opacity-50 bg-gray-200 z-10">
//           <BounceLoader size={100} color={"#1e3a8a"} loading={loading} />
//         </div>
//       ) : (
//         <div>
//           <h1 className="text-3xl font-bold text-blue-900 mb-4">
//             Bill of Purchase
//           </h1>



//           {/* Bill of Purchase */}
//           {/* Form */}
//           <form className="grid grid-cols-2 gap-6 p-2 mb-16" onSubmit={handleSubmit}>
//             <div className="col-span-2 flex border border-blue-500 justify-center mt-4 rounded p-2">
//               <div className="  ">
//                 <button
//                   type="button"
//                   className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-700 transition"
//                   onClick={() => {
//                     setDisplayModal(!displayModal);
//                   }}
//                 >
//                   Choose Bill of Sale
//                 </button>
//               </div>
//             </div>

//             {/* Modal */}
//             {displayModal && (
//               <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50">
//                 <div className="relative w-[90vw] bg-gray-200 border shadow-2xl p-4 rounded-lg">
//                   {/* Close Button */}
//                   <button
//                     className="absolute top-2 right-2 text-gray-700 hover:text-red-500 text-2xl font-bold"
//                     onClick={() => setDisplayModal(false)}
//                   >
//                     ✖
//                   </button>

//                   <div className="mt-8">
//                     <SelectSOTable
//                       NoOfColumns={headersForTable.length}
//                       data={billData}
//                       headers={headersForTable}
//                       setSelectedRow={setSelectedRow}
//                       selectedRow={selectedRow}
//                       setDisplayModal={setDisplayModal}
//                       bosId={bosId}
//                       setBosId={setBosId}
//                       setBillOfSale={setBillOfSale}
//                       setLoading={setLoading}
//                       setBosDisplayModal={setBosDisplayModal}
//                       setFormData={setFormData}
//                       setSelectedRows={setSelectedRows}
//                       setAlreadyReceivedQty={setAlreadyReceivedQty}
//                       setStitchingSO={setStitchingSO}
//                       setAllReceivedItemGoods={setAllReceivedItemGoods}
//                     />
//                   </div>
//                 </div>
//               </div>
//             )}


//             {formData.stitch_ready_rm.length > 0 && (
//               <div className="col-span-2">
//                 <h2 className="text-lg font-semibold text-gray-800 mb-3">Raw Material Details</h2>
//                 <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
//                   <table className="w-full border-collapse border border-gray-300 rounded-lg">
//                     <thead className="bg-gray-200 text-gray-700 text-sm uppercase">
//                       <tr>
//                         {["RM Id", "RM Name", "Description", "HSN Code", "Color", "Sale Qty", "Already Received", "Receive Qty", "Extra Qty", "Select"].map((header) => (
//                           <th key={header} className="border border-gray-300 p-3 text-center">{header}</th>
//                         ))}
//                       </tr>
//                     </thead>

//                     <tbody>
//                       {formData.stitch_ready_rm.map((row, index) => {
//                         // const alreadyReceived = 0; 
//                         const alreadyReceived = row.already_received_bop || 0;
//                         const saleQty = row.sale_qty || row.receive_qty;
//                         const receiveQty = saleQty - alreadyReceived;

//                         const currentQty = receiveQuantities[row.raw_material_entries_id] || "";
//                         const extraQty = extraQuantities?.[row.raw_material_entries_id] || "";

//                         const isChecked = selectedRows.some(
//                           (r) => r.raw_material_entries_id === row.raw_material_entries_id
//                         );
//                         const disabled = saleQty <= alreadyReceived;
//                         return (
//                           <tr key={index} className="even:bg-gray-100 hover:bg-gray-50 transition">
//                             <td className="border border-gray-300 p-3 text-center">{row.raw_material_entries_id}</td>
//                             <td className="border border-gray-300 p-3 text-center">{row.raw_materials.item_name}</td>
//                             <td className="border border-gray-300 p-3 text-center">{row.description}</td>
//                             <td className="border border-gray-300 p-3 text-center">{row.raw_materials.hsn_sac_code.hsn_sac_code}</td>
//                             <td className="border border-gray-300 p-3 text-center">{row.raw_materials.color.color_name}</td>
//                             <td className="border border-gray-300 p-3 text-center">{saleQty}</td>

//                             {/* Already Received */}
//                             <td className="border border-gray-300 p-3 text-center">{alreadyReceived}</td>

//                             {/* Receive Qty Input */}
//                             <td className="border border-gray-300 p-3 text-center">
//                               <input
//                                 type="number"
//                                 className="w-20 border rounded px-2 py-1"
//                                 min={0}
//                                 max={receiveQty}
//                                 value={currentQty}
//                                 onChange={(e) => {
//                                   const val = Math.min(Number(e.target.value), receiveQty);
//                                   setReceiveQuantities((prev) => ({
//                                     ...prev,
//                                     [row.raw_material_entries_id]: val,
//                                   }));

//                                   // Auto update if already selected
//                                   setSelectedRows((prev) =>
//                                     prev.map((r) =>
//                                       r.raw_material_entries_id === row.raw_material_entries_id
//                                         ? { ...r, entered_qty: val }
//                                         : r
//                                     )
//                                   );
//                                 }}
//                               />
//                             </td>

//                             {/* Extra Qty */}
//                             <td className="border border-gray-300 p-3 text-center">
//                               <input
//                                 type="number"
//                                 className="w-20 border rounded px-2 py-1"
//                                 min={0}
//                                 value={extraQty}
//                                 disabled={Number(currentQty) !== receiveQty}
//                                 onChange={(e) => {
//                                   const val = Number(e.target.value);
//                                   setExtraQuantities((prev) => ({
//                                     ...prev,
//                                     [row.raw_material_entries_id]: val,
//                                   }));

//                                   // Optional: Sync with selected row if needed
//                                   setSelectedRows((prev) =>
//                                     prev.map((r) =>
//                                       r.raw_material_entries_id === row.raw_material_entries_id
//                                         ? { ...r, extra_qty: val }
//                                         : r
//                                     )
//                                   );
//                                 }}
//                               />
//                             </td>

//                             {/* Checkbox */}
//                             <td className="border border-gray-300 p-3 text-center">
//                               <input
//                                 type="checkbox"
//                                 checked={isChecked}
//                                 disabled = {disabled}
//                                 onChange={(e) => {
//                                   const isSelected = e.target.checked;
//                                   const enteredQty = receiveQuantities[row.raw_material_entries_id] || 0;
//                                   const extraQtyVal = extraQuantities?.[row.raw_material_entries_id] || 0;
//                                   if (isSelected) {
//                                     setSelectedRows((prev) => [
//                                       ...prev,
//                                       {
//                                         ...row,
//                                         already_received_bop: alreadyReceived,
//                                         entered_qty: enteredQty,
//                                         extra_qty: extraQtyVal,
//                                       },
//                                     ]);
//                                   } else {
//                                     setSelectedRows((prev) =>
//                                       prev.filter(
//                                         (r) => r.raw_material_entries_id !== row.raw_material_entries_id
//                                       )
//                                     );
//                                   }
//                                 }}
//                               />
//                             </td>
//                           </tr>
//                         );
//                       })}
//                     </tbody>

//                   </table>
//                 </div>
//               </div>
//             )}

//             {formData.stitch_ready_sfg.length > 0 && (
//               <div className="col-span-2 mt-6">
//                 <h2 className="text-lg font-semibold text-gray-800 mb-3">Semi-Finished Goods Details</h2>
//                 <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
//                   <table className="w-full border-collapse border border-gray-300 rounded-lg">
//                     <thead className="bg-gray-200 text-gray-700 text-sm uppercase">
//                       <tr>
//                         {["SFG ID", "SFG Name", "Description", "Group", "Color", "Sale Qty", "Already Received", "Receive Qty", "Extra Qty", "Select"].map((header) => (
//                           <th key={header} className="border border-gray-300 p-3 text-center">{header}</th>
//                         ))}
//                       </tr>
//                     </thead>

//                     <tbody>
//                       {formData.stitch_ready_sfg.map((row, index) => {
//                         // const alreadyReceived = 0; 
//                         const alreadyReceived = row.already_received_bop || 0;
//                         const saleQty = row.sale_qty || row.receive_qty;
//                         const receiveQty = saleQty - alreadyReceived;

//                         const currentQty = sfgReceiveQuantities[row.semi_finished_goods_entries_id] || "";
//                         const extraQty = sfgExtraQuantities?.[row.semi_finished_goods_entries_id] || "";

//                         const isChecked = selectedSfgRows.some(
//                           (r) => r.semi_finished_goods_entries_id === row.semi_finished_goods_entries_id
//                         );

//                         const disabled = saleQty <= alreadyReceived;

//                         return (
//                           <tr key={index} className="even:bg-gray-100 hover:bg-gray-50 transition">
//                             <td className="border border-gray-300 p-3 text-center">{row.semi_finished_goods_entries_id}</td>
//                             <td className="border border-gray-300 p-3 text-center">{row.sfg.semi_finished_goods_name}</td>
//                             <td className="border border-gray-300 p-3 text-center">{row.description}</td>
//                             <td className="border border-gray-300 p-3 text-center">{row.sfg.group.group_name}</td>
//                             <td className="border border-gray-300 p-3 text-center">{row.sfg.color.color_name}</td>
//                             <td className="border border-gray-300 p-3 text-center">{saleQty}</td>

//                             {/* Already Received */}
//                             <td className="border border-gray-300 p-3 text-center">{alreadyReceived}</td>

//                             {/* Receive Qty Input */}
//                             <td className="border border-gray-300 p-3 text-center">
//                               <input
//                                 type="number"
//                                 className="w-20 border rounded px-2 py-1"
//                                 min={0}
//                                 max={receiveQty}
//                                 value={currentQty}
//                                 onChange={(e) => {
//                                   const val = Math.min(Number(e.target.value), receiveQty);
//                                   setSfgReceiveQuantities((prev) => ({
//                                     ...prev,
//                                     [row.semi_finished_goods_entries_id]: val,
//                                   }));

//                                   setSelectedSfgRows((prev) =>
//                                     prev.map((r) =>
//                                       r.semi_finished_goods_entries_id === row.semi_finished_goods_entries_id
//                                         ? { ...r, entered_qty: val }
//                                         : r
//                                     )
//                                   );
//                                 }}
//                               />
//                             </td>

//                             {/* Extra Qty */}
//                             <td className="border border-gray-300 p-3 text-center">
//                               <input
//                                 type="number"
//                                 className="w-20 border rounded px-2 py-1"
//                                 min={0}
//                                 value={extraQty}
//                                 disabled={Number(currentQty) !== receiveQty}
//                                 onChange={(e) => {
//                                   const val = Number(e.target.value);
//                                   setSfgExtraQuantities((prev) => ({
//                                     ...prev,
//                                     [row.semi_finished_goods_entries_id]: val,
//                                   }));

//                                   setSelectedSfgRows((prev) =>
//                                     prev.map((r) =>
//                                       r.semi_finished_goods_entries_id === row.semi_finished_goods_entries_id
//                                         ? { ...r, extra_qty: val }
//                                         : r
//                                     )
//                                   );
//                                 }}
//                               />
//                             </td>

//                             {/* Checkbox */}
//                             <td className="border border-gray-300 p-3 text-center">
//                               <input
//                                 type="checkbox"
//                                 checked={isChecked}
//                                 disabled = {disabled}
//                                 onChange={(e) => {
//                                   const isSelected = e.target.checked;
//                                   const enteredQty = sfgReceiveQuantities[row.semi_finished_goods_entries_id] || 0;
//                                   const extraQtyVal = sfgExtraQuantities?.[row.semi_finished_goods_entries_id] || 0;

//                                   if (isSelected) {
//                                     setSelectedSfgRows((prev) => [
//                                       ...prev,
//                                       {
//                                         ...row,
//                                         already_received_bop: alreadyReceived,
//                                         entered_qty: enteredQty,
//                                         extra_qty: extraQtyVal,
//                                       },
//                                     ]);
//                                   } else {
//                                     setSelectedSfgRows((prev) =>
//                                       prev.filter(
//                                         (r) => r.semi_finished_goods_entries_id !== row.semi_finished_goods_entries_id
//                                       )
//                                     );
//                                   }
//                                 }}
//                               />
//                             </td>
//                           </tr>
//                         );
//                       })}
//                     </tbody>

//                   </table>
//                 </div>
//               </div>
//             )}



//             <FormInput type={"input"} placeholder={"Bill Of Sale Id"} label={"Bill Of Sale ID"} value={formData.billId} />
//             {/* Date */}
//             <FormInput type={"date"} placeholder={"Date"} label={"Date"} value={formData.date} />
//             <FormInput
//               type={"date"}
//               placeholder={"Clear Date"}
//               label={"Clear Date"}
//               value={formData.clearDate}
//             />
//             {/* SO id */}
//             <FormInput type={"text"} placeholder={"So Id"} label={"So Id"} value={formData.so_id} />
//             {/* Date */}
//             <FormInput type={"date"} placeholder={"Ex Date"} label={"EX Date"} value={formData.ex_date} name="ex_date" onChange={formDataChangeHandler} />
//             {/* Reference bill */}
//             <FormInput
//               type={"text"}
//               placeholder={"Reference Bill"}
//               label={"Reference Bil"}
//               name="referenceBill"
//               value={formData.referenceBill}
//               onChange={formDataChangeHandler}
//             />
//             {/* Choose Design */}
//             <div className="mb-4">
//               <label className="text-sm font-medium text-gray-700 mr-4" htmlFor="design">
//                 Design: <span className=' text-red-600 '>*</span>
//               </label>
//               <input
//                 className="border border-gray-300 rounded-md w-full p-2"
//                 type="text"
//                 id="design"
//                 name="design"
//                 value={formData.design}
//                 onChange={formDataChangeHandler}
//                 required
//                 readOnly
//               />
//             </div>
//             {/* Choose Next Jobber */}
//             <div className="flex flex-col">
//               <FormLabel title={"Next Jobber"} />
//               <select className="border border-gray-300 bg-gray-100 rounded-md p-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500" onChange={formDataChangeHandler} name="jobber" value={formData.jobber}>
//                 <option value="" disabled selected>
//                   Choose Next Jobber
//                 </option>
//                 {jobberDetail.map((jobber) => (
//                   <option key={jobber.id} value={jobber.id}>
//                     {`${jobber.id} - ${jobber.jobber_name} - ${jobber.work_type}`}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Colour */}
//             {/* <FormInput type={"text"} placeholder={"Colour"} label={"Colour"} /> */}
//             <div className="flex flex-col">
//               <FormLabel title={"Colour"} />
//               <select className="border border-gray-300 bg-gray-100 rounded-md p-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500" onChange={formDataChangeHandler} name="color" value={formData.color}>
//                 <option value="" disabled selected>
//                   Choose Color
//                 </option>
//                 {color.map((color) => (
//                   <option key={color.id} value={color.id}>
//                     {`${color.color_id} - ${color.color_name}`}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             {/* Processor */}
//             <div className="flex flex-col">
//               <label className="text-gray-700 font-semibold">Processor  <span className=' text-red-600 '>*</span></label>
//               <select className="border border-gray-300 bg-gray-100 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 name="processor"
//                 value={formData.processor}
//                 onChange={formDataChangeHandler}
//               >
//                 <option value="" className="text-gray-400">Select Processor</option>
//                 {
//                   availableProcessor && Array.isArray(availableProcessor) && availableProcessor.map((processor, index) => {
//                     return (
//                       <option key={processor.id} value={processor.id}>
//                         {processor.name}-{processor.designation}
//                       </option>
//                     )
//                   })
//                 }
//               </select>
//             </div>
//             <FormInput
//               type={"text"}
//               placeholder={"Seller"}
//               label={"Seller Detail"}
//               name="seller"
//               value={formData.seller}
//               onChange={formDataChangeHandler}
//             />
//             <FormInput
//               type={"text"}
//               placeholder={"Purchaser Details"}
//               label={"Purchaser Details"}
//               name="purchaserDetails"
//               value={formData.purchaserDetails}
//               onChange={formDataChangeHandler}
//             />
//             <div className="flex flex-col">
//               <FormLabel title={"Remarks"} />
//               <textarea
//                 className="border border-gray-300 bg-gray-100 rounded-md p-2 h-40 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
//                 placeholder="Remarks..."
//                 name="remarks"
//                 value={formData.remarks}
//                 onChange={formDataChangeHandler}
//               ></textarea>
//             </div>
//             {/* Notes */}
//             <FormInput
//               type={"text"}
//               placeholder={"Job Notes"}
//               label={"Job Notes"}
//               name="jobNote"
//               value={formData.jobNote}
//               onChange={formDataChangeHandler}
//             />
//             {/* Charges */}
//             <div className="col-span-2 flex justify-center gap-4 mt-4">
//               <FormInput
//                 type={"text"}
//                 placeholder={"0.00"}
//                 label={"Other Charges"}
//                 name="otherCharges"
//                 value={formData.otherCharges}
//                 onChange={formDataChangeHandler}
//               />
//               <FormInput
//                 type={"text"}
//                 placeholder={"0.00"}
//                 label={"Total Bill Amount"}
//                 name="totalBillAmount"
//                 value={formData.totalBillAmount}
//                 onChange={formDataChangeHandler}
//               />
//             </div>
//             {/* button */}
//             <div className="col-span-2 flex justify-end mt-4">
//               <button
//                 type="button"
//                 className="bg-gray-200 px-4 py-1 rounded hover:bg-gray-600 hover:text-white transition"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 className={`p-3 ml-4 bg-gray-200 rounded-md transition-all duration-100 ease-in-out ${submitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-600 hover:scale-105'
//                   }`}
//                 disabled={submitting}
//               >
//                 {submitting ? (
//                   <div className="flex justify-center items-center gap-2">
//                     <PuffLoader size={20} color="#fff" />
//                     <span>Saving...</span>
//                   </div>
//                 ) : (
//                   'Save'
//                 )}
//               </button>
//               <button
//                 type="button"
//                 className="bg-gray-200 px-4 py-1 rounded hover:bg-gray-600 hover:text-white transition ml-4"
//               >
//                 Calculate
//               </button>
//             </div>
//           </form>
//         </div>)}
//     </div>
//   );
// };

// export default BillOfPurchase;






















import { useEffect, useState } from "react";
import SelectionTable from "../../smartTable/SelectionTable";
import FormLabel from "../purchase/FormLabel";
import FormInput from "../utility/FormInput";
import SmartTable from "../../smartTable/SmartTable";
import SmartTable1 from "../../smartTable/SmartTable1";
import axios from "axios";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { BounceLoader, PuffLoader } from "react-spinners";
import SmartTable2 from "../../smartTable/SmartTable2";
import { toast } from "react-toastify";

const SelectSOTable = ({
  NoOfColumns,
  data,
  headers,
  setSelectedRow,
  selectedRow,
  setDisplayModal,
  billId,
  setBosId,
  setBillOfSale,
  setLoading,
  setBosDisplayModal,
  setFormData,
  setSelectedRows,
  company,
  setSoBom,
  setBom,
  setStitchCreated
}) => {
  // console.log(setOfSelectedIndex);
  const { token } = useSelector((state) => state.auth);
  const [updatedData, setUpdatedData] = useState([]);
  const navigate = useNavigate();
  const [updatedHeader] = useState(["select", ...headers]);
  const updateTableData = () => {
    const updatedValues = data.map((item) => ({
      select: (
        <input
          type="checkbox"
          checked={billId === item.id}
          onChange={() => handleClick(item.id, item.so_id, item.type)}
          key={item.id}
        />
      ),
      ...item,
    }));

    // const selectedRow = data.find((item) => item.id === selectedSOId);
    setSelectedRow(selectedRow ? [selectedRow] : []);
    setUpdatedData(
      updatedValues.map((item) =>
        Object.fromEntries(Object.entries(item).slice(0, NoOfColumns + 1))
      )
    );
  };

  const handleClick = async (id, so_id, type) => {
    setBosId(id);
    setSelectedRows([]);

    const orderType = (type === "Vasttram Sales Order") ? "internal-sales-order-entry" : "sales-oder-entries"

    try {
      setLoading(true);

      // Fetch Bill of Sale
      // const response = await axios.get(
      //   `${process.env.REACT_APP_BACKEND_URL}/api/custom-bill-of-sale/${id}`,
      //   { headers: { Authorization: `Bearer ${token}` } }
      // );

      const [
        response,
        response2,
        response3
      ] = await Promise.all([
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/custom-bill-of-sale/${id}`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/${orderType}/find-by-so_id/${so_id}`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/stitching-entries/exists/${so_id}`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      const responseData = response.data;
      console.log("billOfSale: ", responseData);
      console.log("SaleOrder: ", response2);
      console.log("stitch: ", response3);

      // Set Bill of Sale
      setBillOfSale(responseData);
      const so = responseData.sales_order_entry || responseData.internal_sales_order_entry;
      console.log("so: ", so)
      const extraBom = so.extra_bom_so[0]?.Extra_bom || [];

      // Fetch extra_bomSfg_fromStock from the response
      const extraBomFromStock = so?.extra_bomSfg_fromStock || [];

      // Merge extra_bomSfg_fromStock into Extra_bom, without changing the structure
      const mergedExtraBom = [...extraBom, ...extraBomFromStock];

      // Set the merged Extra_bom in the BOM
      if (so.extra_bom_so && so.extra_bom_so[0]) {
        setSoBom({
          // ...so.extra_bom_so[0],  // Correctly accessing the selected SO's extra_bom_so
          Extra_bom: mergedExtraBom,  // Merged Extra_bom
        });
      } else {
        console.warn("No extra_bom_so found for the selected SO.");
      }

      // Fetch BOM Aggregated Data
      const bomAggregatedResponse = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/bill-of-purchase/by-bill-of-sale/${responseData.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const bomAggregatedData = bomAggregatedResponse.data.bom_aggregated || [];
      console.log("bomAggregatedData: ", bomAggregatedData);

      // Update Already Received in BOM Details
      const updatedBomDetails = responseData?.bom_billOfSale?.bom_detail.map((bom) => {
        const matchingBom = bomAggregatedData.find(item => item.bom_id === bom.bom_id);
        return {
          ...bom,
          alreadyReceived: matchingBom ? matchingBom.total_receive_qty : 0
        };
      });

      // Update Bill of Sale with Aggregated Data
      setBillOfSale({
        ...responseData,
        bom_billOfSale: {
          ...responseData.bom_billOfSale,
          bom_detail: updatedBomDetails
        }
      });

      // Set Form Data
      setFormData(prev => ({
        ...prev,
        billId: responseData?.id || prev.billId,
        date: new Date().toISOString().split("T")[0],
        ex_date: responseData?.ex_date || prev.clearDate,
        so_id: responseData?.internal_sales_order_entry?.so_id || responseData?.sales_order_entry?.so_id || prev.so_id,
        design: responseData?.design?.design_number || prev.design,
        color: responseData?.bom_billOfSale?.color?.id,
        processor: responseData?.processor.id,
        merchandiser: responseData?.merchandiser?.id,
        seller: responseData?.seller_detail,
        purchaserDetails: company.gst_no,
        jobNote: responseData.job_note
      }));

      const data = response2.data;

      const extraBomSO = data.extra_bom_so[0]?.Extra_bom || [];

      // Fetch extra_bomSfg_fromStock from the response
      const extraBomFromStockSO = data?.extra_bomSfg_fromStock || [];

      // Merge extra_bomSfg_fromStock into Extra_bom, without changing the structure
      const mergedExtraBomSO = [...extraBomSO, ...extraBomFromStockSO];

      // Set the merged Extra_bom in the BOM
      setBom({
        ...data.extra_bom_so[0],  // Keep the other BOM data intact
        Extra_bom: mergedExtraBomSO,  // Merge the Extra_bom with extra_bomSfg_fromStock
      });


      setStitchCreated(response3?.data);

      // Close Modal and Open BOS Modal
      setDisplayModal(false);
      setBosDisplayModal(true);

    } catch (error) {
      console.error("Error fetching jobber data:", error);
      if (error.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  // const handleClick = async (id, so_id) => {
  //   setBosId(id);
  //   setSelectedRows([]);

  //   try {
  //     setLoading(true);

  //     // Fetch Bill of Sale
  //     const response = await axios.get(
  //       `${process.env.REACT_APP_BACKEND_URL}/api/custom-bill-of-sale/${id}`,
  //       { headers: { Authorization: `Bearer ${token}` } }
  //     );
  //     const responseData = response.data;
  //     console.log("billOfSale: ", responseData);

  //     //     // Fetch BOM Aggregated Data
  //     const bomAggregatedResponse = await axios.get(
  //       `${process.env.REACT_APP_BACKEND_URL}/api/bill-of-purchase/by-bill-of-sale/${responseData.id}`,
  //       { headers: { Authorization: `Bearer ${token}` } }
  //     );
  //     const bomAggregatedData = bomAggregatedResponse.data.bom_aggregated || [];
  //     console.log("bomAggregatedData: ", bomAggregatedData);

  //     // Update Already Received in BOM Details
  //     const updatedBomDetails = responseData?.bom_billOfSale?.bom_detail.map((bom) => {
  //       const matchingBom = bomAggregatedData.find(item => item.bom_id === bom.bom_id);
  //       return {
  //         ...bom,
  //         alreadyReceived: matchingBom ? matchingBom.total_receive_qty : 0
  //       };
  //     });

  //      // Update Bill of Sale with Aggregated Data
  //     setBillOfSale({
  //       ...responseData,
  //       bom_billOfSale: {
  //         ...responseData.bom_billOfSale,
  //         bom_detail: updatedBomDetails
  //       }
  //     });

  //     // Set Bill of Sale
  //     setBillOfSale(responseData);

  //     // Set Form Data
  //     setFormData((prev) => ({
  //       ...prev,
  //       billId: responseData?.id || prev.billId,
  //       date: new Date().toISOString().split("T")[0],
  //       ex_date: responseData?.ex_date || prev.clearDate,
  //       so_id: responseData?.internal_sales_order_entry?.so_id || responseData?.sales_order_entry?.so_id || prev.so_id,
  //       design: responseData?.design?.design_number || prev.design,
  //       color: responseData?.bom_billOfSale?.color?.id,
  //       processor: responseData?.processor.id,
  //       seller: responseData?.seller_detail,
  //       purchaserDetails: company.gst_no,
  //     }));

  //     // Close Modal and Open BOS Modal immediately
  //     setDisplayModal(false);
  //     setBosDisplayModal(true);

  //     // Merge Extra BOM
  //     const so = responseData.sales_order_entry || responseData.internal_sales_order_entry;
  //     const extraBom = so.extra_bom_so[0]?.Extra_bom || [];
  //     const extraBomFromStock = so?.extra_bomSfg_fromStock || [];
  //     const mergedExtraBom = [...extraBom, ...extraBomFromStock];

  //     // Set the merged Extra_bom in the BOM
  //     if (so.extra_bom_so && so.extra_bom_so[0]) {
  //       setSoBom({
  //         Extra_bom: mergedExtraBom,
  //       });
  //     }

  //   } catch (error) {
  //     console.error("Error fetching jobber data:", error);
  //     if (error.response?.status === 401) {
  //       navigate("/login");
  //     }
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  useEffect(() => {
    updateTableData();
  }, [data]);
  return <SmartTable2 data={updatedData} headers={updatedHeader} />;
};

const processorOption = [
  {
    id: 1,
    name: 'Processor 1'
  },
  {
    id: 2,
    name: 'Processor 2'
  },
  {
    id: 3,
    name: 'Processor 3'
  }
]

const BillOfPurchase = () => {
  const headersForTable = ["Bill of Sales Id", "Bill Type", "SO ID", "Date", "Job Note", "Processor", "Remarks", "Total Bill Amount", "Bill Status"];

  const [displayModal, setDisplayModal] = useState(false);
  const { load, error, availableProcessor } = useSelector((state) => state.fetchData);
  const [selectedRow, setSelectedRow] = useState([]);

  const [sellerName, setSellerName] = useState([
    "seller1",
    "seller2",
    "seller3",
  ]);

  const [displayHeaders, setDisplayHeaders] = useState([
    "item_name",
    "particulars",
    "hsn_code",
    "unit",
    "colour",
    "required_qty",
    "rate",
    "exta_qty",
    "amount",
    "cgst",
    "sgst",
    "igst",
    "total",
  ]);
  const [formData, setFormData] = useState({
    billId: "",
    date: "",
    clearDate: "",
    so_id: "",
    ex_date: "",
    referenceBill: "",
    design: "",
    jobber: "",
    processor: "",
    seller: "",
    purchaserDetails: "",
    remarks: "",
    jobNote: "",
    otherCharges: "",
    totalBillAmount: "",
    merchandiser: ""
  })

  const { token, designation, id } = useSelector(state => state.auth);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [billData, setBillData] = useState([]);
  const [bosId, setBosId] = useState(null);
  const [billOfSale, setBillOfSale] = useState(null);
  const [bosDisplayModal, setBosDisplayModal] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [jobberDetail, setJobberDetail] = useState([]);
  const [color, setColor] = useState([]);
  const [alreadyReceivedQty, setAlreadyReceivedQty] = useState([]);
  const [stitchingSO, setStitchingSO] = useState(null);
  const [allReceivedItemGoods, setAllReceivedItemGoods] = useState(null);
  const [company, setCompany] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [totalCost, setTotalCost] = useState(0);
  const [soBom, setSoBom] = useState([]);
  const [bom, setBom] = useState([]);
  const [stitchCreated, setStitchCreated] = useState(false);
  console.log("bom: ", bom)

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const dash_so_id = queryParams.get("so_id");
  console.log("dash_so_id", dash_so_id)

  const clearData = () => {
    setFormData({
      billId: "",
      date: "",
      clearDate: "",
      so_id: "",
      ex_date: "",
      referenceBill: "",
      design: "",
      jobber: "",
      processor: "",
      seller: "",
      purchaserDetails: "",
      remarks: "",
      jobNote: "",
      otherCharges: "",
      totalBillAmount: "",
      merchandiser: ""
    })
    setBillOfSale(null);
    setBosDisplayModal(false)
    setSoBom([]);
    setTotalCost(0);
    setSelectedItems([]);

  }

  const fetchBillOfSales = async () => {
    try {
      setLoading(true);
      // const billOfSalesUrl = dash_so_id
      //   ? `${process.env.REACT_APP_BACKEND_URL}/api/bill-of-sales?filters[billOfSales_status][$eq]=open&filters[so_id][$eq]=${dash_so_id}&sort=id:desc&populate=*`
      //   : `${process.env.REACT_APP_BACKEND_URL}/api/bill-of-sales?filters[billOfSales_status][$eq]=open&sort=id:desc&populate=*`;


      let billOfSalesUrl = dash_so_id
        ? `${process.env.REACT_APP_BACKEND_URL}/api/bill-of-sales?filters[billOfSales_status][$eq]=open&filters[so_id][$eq]=${encodeURIComponent(dash_so_id)}&sort=id:desc&populate=*`
        : `${process.env.REACT_APP_BACKEND_URL}/api/bill-of-sales?filters[billOfSales_status][$eq]=open&sort=id:desc&populate=*`;

      if (designation !== "Merchandiser" && designation !== "Admin" && id) {
        billOfSalesUrl += `&filters[processor][id][$eq]=${encodeURIComponent(id)}`;
      } else if (designation === "Merchandiser" && id) {
        billOfSalesUrl += `&filters[merchandiser][id][$eq]=${encodeURIComponent(id)}`;
      }

      const [
        response,
        response2,
      ] = await Promise.all([
        // axios.get(
        //   `${process.env.REACT_APP_BACKEND_URL}/api/bill-of-sales?filters[billOfSales_status][$eq]=open&sort=id:desc&populate=*`,
        //   {
        //     headers: {
        //       Authorization: `Bearer ${token}`,
        //     },
        //   }
        // ),
        // axios.get(
        //   `${process.env.REACT_APP_BACKEND_URL}/api/bill-of-sales?filters[billOfSales_status][$eq]=open&filters[so_id][$eq]=${dash_so_id}&sort=id:desc&populate=*`,
        //   {
        //     headers: {
        //       Authorization: `Bearer ${token}`,
        //     },
        //   }
        // ),

        axios.get(
          billOfSalesUrl,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        ),
        axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/companies`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        ),
      ]);

      const data = Array.isArray(response.data.data) ? response.data.data : [];
      // const data = response.data.data.results || [];
      console.log("data: ", data);
      const mappedData = data.map((bills) => {
        const isInternal = bills.internal_sales_order_entry;
        const isSales = bills.sales_order_entry;

        return {
          id: bills.id,
          type: bills.type === "internal-sales-order-entries" ? "Vasttram Sales Order" : "Customer Sales Order",
          so_id: isInternal?.so_id || isSales?.so_id || "",
          date: bills.ex_date,
          jobNote: bills.job_note,
          processor: bills.processor.name,
          remarks: bills.remarks,
          Total_Amount: bills.Total_Bill_of_sales_Amount,
          billOfSales_status: bills.billOfSales_status,
        };
      });

      setBillData(mappedData);
      // const jobbers = Array.isArray(response2.data.data)
      //   ? response2.data.data
      //   : [];
      // setJobberDetail(jobbers);
      // const colorGroup = Array.isArray(response3.data.data)
      //   ? response3.data.data
      //   : [];
      // setColor(colorGroup);
      const company = Array.isArray(response2.data.data)
        ? response2.data.data
        : [];
      setCompany(company[0]);

    } catch (error) {
      console.error("Error fetching jobber data:", error);
      if (error.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchBillOfSales();
  }, [token]);

  useEffect(() => {
    // Calculate total cost whenever selectedItems change
    const total = selectedItems.reduce(
      (sum, item) => sum + (item.jobber_rate * item.enteredQty || 0),
      0
    );
    setTotalCost(total);
  }, [selectedItems]);

  const handleCheckboxChange = (item, index, enteredQty, alreadyReceived) => {
    const isChecked = selectedItems.some((selected) => selected.id === item.id);
    if (isChecked) {
      // Uncheck
      setSelectedItems(selectedItems.filter((selected) => selected.id !== item.id));
    } else {
      // Check and add item with received qty
      setSelectedItems([
        ...selectedItems,
        {
          ...item,
          alreadyReceived: alreadyReceived || 0,
          enteredQty: enteredQty || 0,
          total: item.jobber_rate * (enteredQty || 0),
        },
      ]);
    }
  };


  const handleQtyChange = (e, item) => {
    const enteredQty = Number(e.target.value);
    const alreadyReceived = item.alreadyReceived || 0;
    const maxQty = item.qty - alreadyReceived;

    if (enteredQty > maxQty) {
      alert(`You cannot enter more than ${maxQty} units.`);
      return;
    }

    setSelectedItems((prevSelected) => {
      // Check if item is already selected
      const updatedItems = prevSelected.map((selected) => {
        if (selected.id === item.id) {
          return {
            ...selected,
            enteredQty,
            alreadyReceived,
            total: item.jobber_rate * enteredQty,
          };
        }
        return selected;
      });

      // Add new item if not already selected
      const itemExists = updatedItems.find((selected) => selected.id === item.id);
      if (!itemExists) {
        updatedItems.push({
          ...item,
          enteredQty,
          alreadyReceived,
          total: item.jobber_rate * enteredQty,
        });
      }

      return updatedItems;
    });
  };

  const formDataChangeHandler = (event) => {

    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value
    }))
    console.log(formData.date)
  }

  const calculatedTotal = () => {
    const otherCharges = Number(formData.otherCharges) || 0;
    return otherCharges + totalCost;
  };

  useEffect(() => {
    if (billOfSale?.bom_billOfSale) {
      setFormData((prevData) => ({
        ...prevData,
        totalBillAmount: calculatedTotal(),
      }));
    }
  }, [formData.otherCharges, totalCost]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    if (formData.billId === "") {
      toast("Please select the Bill of sales.");
      setSubmitting(false);
      return;
    }

    if(formData.clearDate === "") {
      toast.warning("Please select the Clear Date.");
      setSubmitting(false);
      return;
    }

    const fullyReceivedItems = selectedItems
      .filter(item => item.qty === (item.alreadyReceived || 0) + (item.enteredQty || 0))
      .map(item => ({
        ...item,
        bom_id: item.bom_id,
        selectedJobberId: item.selectedJobberId
      }));

    console.log(fullyReceivedItems);

    const postData = {
      data: {
        billOfSale: formData.billId,
        date: formData.date,
        clearDate: formData.clearDate,
        so_id: formData.so_id,
        ex_date: formData.ex_date,
        reference_bill: formData.referenceBill || "",
        design: formData.design,
        // color: formData.color,
        processor: formData.processor,
        seller_detail: formData.seller,
        purchaser_Details: company.id,
        remarks: formData.remarks,
        jobNote: formData.jobNote,
        other_charges: String(formData.otherCharges),
        Total_Bill_Amount_Bop: String(formData.totalBillAmount),
        bom_billOfPurchase: {
          jobber: billOfSale?.bom_billOfSale?.jobber?.id,
          bom_detail: selectedItems.map((item) => ({
            semi_finished_goods: item?.semi_finished_goods.id,
            color: item?.color?.id,
            jobber_rate: item?.jobber_rate,
            total_qty: item?.qty,
            already_received: item?.alreadyReceived,
            receive_qty: item?.enteredQty,
            total: item?.total,
            bom_id: item?.bom_id,
          })),
          total_jobber_cost_on_sfg: totalCost
        },
        merchandiser: formData?.merchandiser
      },
    };

    // data for updation bill of sales receive qty 
    const billOfSaleId = formData?.billId;
    const updates = selectedItems?.map((item)=> ({
      bom_id: item?.bom_id,
      receive_qty: item?.enteredQty
    }))

    const api_point = (billOfSale?.type === "sales-oder-entries") ? "sales-order-entry" : "internal-sales-order-entries";



    console.log("postData: ", postData);

    try {
      // Submit main bill-of-purchase data
      const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/bill-of-purchases`, postData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if(res.status !== 200) {
        toast.error(res?.data?.message, { position: "top-right" });
        setSubmitting(false);
        return;
      }


      const updateBomQtyPromise = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/update-receive-qty-bill-of-sales`, {
        billOfSaleId,
        updates
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log("res: ", res);


      if (fullyReceivedItems.length > 0) {
        const updateItems = fullyReceivedItems.map((item) => {
          const matchingBom = soBom.Extra_bom.find(bom => bom.id === item.bom_id);

          // Handle missing jobber_master_sfg
          const jobberList = matchingBom.jobber_master_sfg || [];

          // Check if all other jobbers are complete
          const allOtherJobbersComplete = jobberList
            .filter(jobber => jobber.id !== item.selectedJobberId)
            .every(jobber => jobber.completed === "Complete");

          // Determine the BOM status
          const newBomStatus = allOtherJobbersComplete ? "readyToStitch" : "Process Due";

          return {
            id: item.bom_id,
            bom_status: newBomStatus,
            jobber_id: item.selectedJobberId || null, // Ensure jobber_id is set
            completed: "Complete"
          };
        });

        const processData = fullyReceivedItems.map((item) => ({
          "id": item?.bom_id,
          "process": billOfSale?.bom_billOfSale?.jobber?.work_type,
          "jobber": billOfSale?.bom_billOfSale?.jobber?.id
        }));

            

const updateBomStatusPromise = axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/${api_point}/update-bom-status/${billOfSale?.so_id}`, updateItems, {
  headers: { Authorization: `Bearer ${token}` }
});

const addBomProcessPromise = axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/${api_point}/${billOfSale?.so_id}/add-bom-process`, processData, {
  headers: { Authorization: `Bearer ${token}` }
});

const [updateBomStatus, addBomProcess] = await Promise.all([
  updateBomStatusPromise,
  addBomProcessPromise,
]);

console.log("updateBomStatus: ", updateBomStatus);
console.log("addBomProcess: ", addBomProcess);


        function determineStatus(updateItems, bom) {
          // 1️ updateItems ke IDs collect karo (array of numbers)
          const updateIds = updateItems.map(item => item.id);

          // 2️ Extra_bom ko nikal lo
          const extraBom = bom.Extra_bom || [];

          // 3️ Extra_bom se updateItems ke ids wale elements ko hata do
          const filteredExtraBom = extraBom.filter(b => !updateIds.includes(b.id));

          // 4️ Bache huye Extra_bom me status check karo
          const hasSendToJobber = filteredExtraBom.some(b => b.bom_status === "sendToJobber");
          const allReadyToStitchExtra = filteredExtraBom.every(b => b.bom_status === "readyToStitch");

          // 5️ updateItems me koi Process Due hai ya sab readyToStitch
          const anyProcessDue = updateItems.some(item => item.bom_status === "Process Due");
          const allReadyToStitch = updateItems.every(item => item.bom_status === "readyToStitch");

          // 6️ Final status decide karo
          if (allReadyToStitch) {
            if (hasSendToJobber) {
              return "In Process";
            } else if (allReadyToStitchExtra) {
              return "readyToStitch";
            } else {
              return "Process Due";
            }
          } else if (anyProcessDue) {
            if (hasSendToJobber) {
              return "In Process";
            } else {
              return "Process Due";
            }
          }

          // agar koi condition match nahi hui to default
          return "Process Due";
        }

        const status = determineStatus(updateItems, bom);
        console.log(status);

        if (status === "readyToStitch") {
          const type = (billOfSale.type === "internal-sales-order-entries")
            ? "internal-sales-order-entry"
            : "sales-order-entry";

          const endpoint = stitchCreated
            ? `${process.env.REACT_APP_BACKEND_URL}/api/${type}/update-status/${billOfSale?.so_id}/In%20Stitching`
            : `${process.env.REACT_APP_BACKEND_URL}/api/${type}/update-status/${billOfSale?.so_id}/readyToStitch`;

          await axios.put(endpoint, postData, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        } else if (status === "Process Due") {
          const type = (billOfSale.type === "internal-sales-order-entries")
            ? "internal-sales-order-entry"
            : "sales-order-entry";

          await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/${type}/update-status/${billOfSale?.so_id}/Process%20Due`, postData, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        }
      }


      // await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/${api_point}/update-bom-status/${billOfSale?.so_id}`, data, {
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //   },
      // });

      // await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/${api_point}/${billOfSale?.so_id}/add-bom-process`, processData, {
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //   },
      // });

      function isFullyReceived(billOfSale, selectedItems) {
        // Extract all bom_detail items
        const bomDetails = billOfSale.bom_billOfSale.bom_detail || [];

        // Find selected items that are fully received
        const fullyReceivedItems = selectedItems.filter(item => item.qty === (item.alreadyReceived || 0) + (item.enteredQty || 0));

        // Extract all bom_ids from fully received selected items
        const fullyReceivedBomIds = new Set(fullyReceivedItems.map(item => item.bom_id));

        // Check if all remaining items are also fully received
        const allReceived = bomDetails.every(item => {
          // If this item is part of fully received items, ignore it
          if (fullyReceivedBomIds.has(item.bom_id)) return true;

          // Check if this item's qty is fully received
          return item.qty === (item.alreadyReceived || 0);
        });

        return allReceived;
      }

      console.log(isFullyReceived(billOfSale, selectedItems));

      if (isFullyReceived(billOfSale, selectedItems)) {
        await axios.put(
          `${process.env.REACT_APP_BACKEND_URL}/api/bill-of-sales/${formData.billId}/close`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      toast.success("Bill of purchases created successfully", { position: "top-right" });

      setTimeout(() => {
        navigate(`/bill-of-purchase/${res.data.data.id}`);
      }, 1000)


      console.log("Data submitted successfully!", postData);
    } catch (error) {
      console.error("Error posting bill of sales:", error);
      toast.error(error?.response?.data?.error?.message || "Something went wrong!");
    } finally {
      setSubmitting(false);
    }
  };

  console.log("billOfSale: ", billOfSale)
  console.log("company: ", company)
  console.log("selectedItems: ", selectedItems)
  console.log("soBom: ", soBom)

  return (
    <div className="py-2 bg-white rounded-lg relative">
      {loading || load ? (
        <div className="absolute inset-0 flex justify-center items-center mt-64 bg-opacity-50 bg-gray-200 z-10">
          <BounceLoader size={100} color={"#1e3a8a"} loading={loading} />
        </div>
      ) : (
        <div>
          <h1 className="text-3xl font-bold text-blue-900 mb-4">
            Bill of Purchase
          </h1>

          <div className="col-span-2 flex border border-blue-500 justify-center mt-4 rounded p-2">
            <div className="  ">
              <button
                type="button"
                className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-700 transition"
                onClick={() => {
                  setDisplayModal(!displayModal);
                }}
              >
                Choose Bill of Sale
              </button>
            </div>
          </div>

          {bosDisplayModal && (
            <div className="w-full mt-4 mb-8">
              <div className="bg-white p-6 rounded-xl w-full shadow-lg">
                <h2 className="text-2xl font-bold mb-6 border-b pb-2 text-blue-900">
                  Bill of Sale Details
                </h2>

                <div className="mb-8">
                  {/* Jobber Details */}

                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg shadow-md mb-6">
                    <h3 className="text-xl font-semibold text-blue-900 mb-3 border-b pb-2">Jobber Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p><span className="font-semibold">Name:</span> {billOfSale?.bom_billOfSale?.jobber.jobber_name}</p>
                        <p><span className="font-semibold">Address:</span> {billOfSale?.bom_billOfSale?.jobber.jobber_address}</p>
                      </div>
                      <div>
                        <p><span className="font-semibold">GSTIN:</span> {billOfSale?.bom_billOfSale?.jobber.jobber_gstin}</p>
                        <p><span className="font-semibold">Process:</span> {billOfSale?.bom_billOfSale?.jobber.work_type}</p>
                      </div>
                    </div>
                    <div className="flex justify-start">
                      <div className="text-lg font-semibold text-blue-900">
                        Total Cost: ₹{billOfSale?.bom_billOfSale?.total_jobber_cost_on_sfg}
                      </div>
                    </div>
                  </div>

                  {/* BOS Table */}
                  {/* <table className="w-full mb-4 border border-gray-300 rounded-lg overflow-hidden">
                    <thead className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-900">
                      <tr>
                        <th className="px-6 py-4 text-left font-semibold">#</th>
                        <th className="px-6 py-4 text-left font-semibold">Semi-Finished Goods</th>
                        <th className="px-6 py-4 text-left font-semibold">Color</th>
                        <th className="px-6 py-4 text-left font-semibold">Jobber Rate</th>
                        <th className="px-6 py-4 text-left font-semibold">Quantity</th>
                        <th className="px-6 py-4 text-left font-semibold">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {billOfSale?.bom_billOfSale?.bom_detail.map((item, index) => (
                        <tr key={item.id} className="hover:bg-blue-50 transition">
                          <td className="px-6 py-4 text-gray-700">{index + 1}</td>
                          <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                            {item?.semi_finished_goods?.semi_finished_goods_name || 'N/A'}
                          </td>
                          <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                            {item?.color?.color_name || 'N/A'}
                          </td>
                          <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                            {item?.jobber_rate || 0}
                          </td>
                          <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                            {item?.qty || 0}
                          </td>
                          <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                            {(item?.total || 0)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table> */}

                  <table className="w-full mb-4 border border-gray-300 rounded-lg overflow-hidden">
                    <thead className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-900">
                      <tr>
                        <th className="px-6 py-4 text-left font-semibold">#</th>
                        <th className="px-6 py-4 text-left font-semibold">Semi-Finished Goods</th>
                        <th className="px-6 py-4 text-left font-semibold">Color</th>
                        <th className="px-6 py-4 text-left font-semibold">Jobber Rate</th>
                        <th className="px-6 py-4 text-left font-semibold">Quantity</th>
                        <th className="px-6 py-4 text-left font-semibold">Already Received</th>
                        <th className="px-6 py-4 text-left font-semibold">Enter Receive Qty</th>
                        <th className="px-6 py-4 text-left font-semibold">Total</th>
                        <th className="px-6 py-4 text-center font-semibold">Select</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {billOfSale?.bom_billOfSale?.bom_detail.map((item, index) => {
                        const alreadyReceived = item.alreadyReceived || 0;
                        const maxQty = item.qty - alreadyReceived;
                        const selectedItem = selectedItems.find((selected) => selected.id === item.id);
                        const enteredQty = selectedItem ? selectedItem.enteredQty : 0;
                        const isDisabled = item.qty === alreadyReceived;

                        return (
                          <tr key={item.id} className="hover:bg-blue-50 transition">
                            <td className="px-6 py-4 text-gray-700">{index + 1}</td>
                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                              {item?.semi_finished_goods?.semi_finished_goods_name || 'N/A'}
                            </td>
                            <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                              {item?.color?.color_name || 'N/A'}
                            </td>
                            <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                              {item?.jobber_rate || 0}
                            </td>
                            <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                              {item?.qty || 0}
                            </td>
                            <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                              {alreadyReceived}
                            </td>
                            <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                              <input
                                type="number"
                                min="0"
                                max={maxQty}
                                value={enteredQty}
                                onChange={(e) => handleQtyChange(e, item, index, alreadyReceived)}
                                className="w-full px-2 py-1 border border-gray-300 rounded"
                              />
                            </td>
                            <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                              {item.jobber_rate * enteredQty || 0}
                            </td>
                            <td className="px-6 py-4 text-center">
                              <input
                                type="checkbox"
                                disabled={isDisabled}
                                checked={selectedItem !== undefined}
                                onChange={() => {
                                  if (enteredQty <= 0) {
                                    alert("Please enter the qty");
                                    return;
                                  }
                                  handleCheckboxChange(item, index, enteredQty, alreadyReceived)
                                }}
                                className="w-4 h-4"
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>

                  <hr className="w-full border-t-2 border-gray-300 my-2" />

                  <div className="flex justify-end">
                    <div className="text-lg font-semibold text-blue-900">
                      Total Cost: ₹{totalCost}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Modal */}
          {displayModal && (
            <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50">
              <div className="relative w-[90vw] bg-gray-200 ml-10 border shadow-2xl p-4 rounded-lg ">

                <div className='flex justify-between items-center'>
                  <h3 className='text-2xl font-semibold'>Select Bill of Sale</h3>
                  <p
                    className="text-xl px-2 border bg-red-600 rounded-full text-white hover:bg-red-500 cursor-pointer"
                    onClick={() => {
                      setDisplayModal(false);
                    }}
                  >
                    X
                  </p>
                </div>

                <div className="">
                  <SelectSOTable
                    NoOfColumns={headersForTable.length}
                    data={billData}
                    headers={headersForTable}
                    setSelectedRow={setSelectedRow}
                    selectedRow={selectedRow}
                    setDisplayModal={setDisplayModal}
                    bosId={bosId}
                    setBosId={setBosId}
                    setBillOfSale={setBillOfSale}
                    setLoading={setLoading}
                    setBosDisplayModal={setBosDisplayModal}
                    setFormData={setFormData}
                    setSelectedRows={setSelectedRows}
                    setAlreadyReceivedQty={setAlreadyReceivedQty}
                    setStitchingSO={setStitchingSO}
                    setAllReceivedItemGoods={setAllReceivedItemGoods}
                    company={company}
                    setSoBom={setSoBom}
                    setBom={setBom}
                    setStitchCreated={setStitchCreated}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Bill of Purchase */}
          {/* Form */}
          <form className="grid grid-cols-2 gap-6 mt-5 p-5 rounded-lg border border-gray-200 shadow-md mb-16" onSubmit={handleSubmit}>

            <FormInput type={"input"} placeholder={"Bill Of Sale Id"} label={"Bill Of Sale ID"} value={formData.billId} />
            {/* Date */}
            <FormInput type={"date"} placeholder={"Date"} label={"Date"} value={formData.date} />
            <FormInput
              type={"date"}
              placeholder={"Clear Date"}
              label={"Clear Date"}
              value={formData.clearDate}
              name="clearDate"
              onChange={formDataChangeHandler}
            />
            {/* SO id */}
            <FormInput type={"text"} placeholder={"So Id"} label={"So Id"} value={formData.so_id} />
            {/* Date */}
            <FormInput type={"date"} placeholder={"Ex Date"} label={"EX Date"} value={formData.ex_date} name="ex_date" />
            {/* Reference bill */}
            <FormInput
              type={"text"}
              placeholder={"Reference Bill"}
              label={"Reference Bil"}
              name="referenceBill"
              value={formData.referenceBill}
              onChange={formDataChangeHandler}
            />
            {/* Choose Design */}
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700 mr-4" htmlFor="design">
                Design: <span className=' text-red-600 '>*</span>
              </label>
              <input
                className="border border-gray-300 rounded-md w-full p-2"
                type="text"
                id="design"
                name="design"
                value={formData.design}
                onChange={formDataChangeHandler}
                required
                readOnly
              />
            </div>

            {/* Processor */}
            <div className="flex flex-col">
              <label className="text-gray-700 font-semibold">Processor  <span className=' text-red-600 '>*</span></label>
              <select className="border border-gray-300 bg-gray-100 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                name="processor"
                value={formData.processor}
                onChange={formDataChangeHandler}
              >
                <option value="" className="text-gray-400">Select Processor</option>
                {
                  availableProcessor &&
                  Array.isArray(availableProcessor) &&
                  availableProcessor
                    .filter(processor => processor.designation !== "Merchandiser")
                    .map(processor => (
                      <option key={processor.id} value={processor.id}>
                        {processor.name + " - " + processor.designation}
                      </option>
                    ))
                }
              </select>
            </div>

            {/* merchandiser */}
            <div className="flex flex-col">
              <label className="text-gray-700 font-semibold">Merchandiser  <span className=' text-red-600 '>*</span></label>
              <select className="border border-gray-300 bg-gray-100 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                name="merchandiser"
                value={formData.merchandiser}
                onChange={formDataChangeHandler}
              >
                <option value="" className="text-gray-400">Select Processor</option>
                {
                  availableProcessor &&
                  Array.isArray(availableProcessor) &&
                  availableProcessor
                    .filter(processor => processor.designation === "Merchandiser")
                    .map(processor => (
                      <option key={processor.id} value={processor.id}>
                        {processor.name + " - " + processor.designation}
                      </option>
                    ))
                }
              </select>
            </div>
            <FormInput
              type={"text"}
              placeholder={"Seller"}
              label={"Seller Detail"}
              name="seller"
              value={formData.seller}
              onChange={formDataChangeHandler}
            />
            <FormInput
              type={"text"}
              placeholder={"Purchaser Details"}
              label={"Purchaser Details"}
              name="purchaserDetails"
              value={formData.purchaserDetails}
              onChange={formDataChangeHandler}
            />

            {/* Notes */}
            <FormInput
              type={"text"}
              placeholder={"BOS Job Notes"}
              label={"BOS Job Notes"}
              name="jobNote"
              value={formData.jobNote}
              onChange={formDataChangeHandler}
            />

            <div className="flex flex-col">
              <FormLabel title={"BOP Remarks"} />
              <textarea
                className="border border-gray-300 bg-gray-100 rounded-md p-2 h-40 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                placeholder="BOP Remarks..."
                name="remarks"
                value={formData.remarks}
                onChange={formDataChangeHandler}
              ></textarea>
            </div>

            {/* Charges */}
            <div className="col-span-2 flex justify-center gap-4 mt-4">
              <FormInput
                type={"text"}
                placeholder={"0.00"}
                label={"Other Charges"}
                name="otherCharges"
                value={formData.otherCharges}
                onChange={formDataChangeHandler}
              />
              <FormInput
                type={"text"}
                placeholder={"0.00"}
                label={"Total Bill Amount"}
                name="totalBillAmount"
                value={formData.totalBillAmount}
                onChange={formDataChangeHandler}
              />
            </div>
            {/* button */}
            <div className="col-span-2 flex justify-end mt-4">
              <button
                type="button"
                className="bg-gray-200 px-4 py-1 rounded hover:bg-gray-600 hover:text-white transition"
                onClick={clearData}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`p-3 ml-4 bg-blue-900 text-white rounded-md transition-all duration-100 ease-in-out ${submitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700 hover:scale-105'
                  }`}
                disabled={submitting}
              >
                {submitting ? (
                  <div className="flex justify-center items-center gap-2">
                    <PuffLoader size={20} color="#fff" />
                    <span>Saving...</span>
                  </div>
                ) : (
                  'Save'
                )}
              </button>
              {/* <button
                type="button"
                className="bg-gray-200 px-4 py-1 rounded hover:bg-gray-600 hover:text-white transition ml-4"
              >
                Calculate
              </button> */}
            </div>
          </form>
        </div>)}
    </div>
  );
};

export default BillOfPurchase;

