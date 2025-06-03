// import React, { useEffect, useState, useRef } from 'react'
// import { BounceLoader, PuffLoader } from 'react-spinners'
// import { toast } from 'react-toastify'
// import SmartTable from '../../smartTable/SmartTable'
// import { useLocation, useNavigate } from 'react-router-dom'
// import axios from 'axios'
// import { useSelector } from 'react-redux'
// import SelectionTable from '../../smartTable/SelectionTable'
// import SelectSOTable from "./SelectSOTable"


// const ReadyToStitch = () => {
//   const [selctionHeader, setSelectionHeader] = useState([
//           "Group",
//           "Item Name",
//           "Unit",
//           "HSN/SAC Code",
//           "Description",
//           "Color",
//           "Qty",
//       ]);

//       const [selctionHeaderSfg, setSelectionHeaderSfg] = useState([
//           "Group",
//           "Item Name",
//           "Unit",
//           "Description",
//           "Color",
//           "Qty",
//       ]);

//       const [selctionHeaderSO, setSelectionHeaderSO] = useState([
//           "Id",
//           "SO Id",
//           "Group",
//           "Design Number",
//           "Qty",
//           "Urgent"
//       ]);

//       const location = useLocation()
//       const title = location.state?.title || "Bill of Sales";
//       const [loading, setLoading] = useState(false);
//       const [submitting, setSubmitting] = useState(false);
//       const { token } = useSelector((state) => state.auth);
//       const { load, error, availableProcessor } = useSelector((state) => state.fetchData);
//       const navigate = useNavigate();
//       const [selectedSO, setSelectedSO] = useState([]);
//       const [jobberDetail, setJobberDetail] = useState([]);
//      const [color, setColor] = useState([]);
//       const [selectionData, setSelectionData] = useState([]);
//       const [selectionDataSfg, setSelectionDataSfg] = useState([]);
//       const [setOfSelectedIndex, setSetOfSelectedIndex] = useState(new Set());
//       const [selectedRow, setSelectedRow] = useState([]);
//       const [finalSelectedRows, setFinalSelectedRows] = useState([]);
//       const [displayModal, setDisplayModal] = useState(false);
//       const [showSalesPopup, setShowSalesPopup] = useState(false);
//       const popupRef = useRef(null);
//       const [selectSOModal, setSelectSOModal] = useState(false);
//       const [selectedSOId, setSelectedSOId] = useState(null);
//       const [type, setType] = useState("");
//       const [salesOrder, setSalesOrder] = useState([]);
//       const [soViewModal, setSOViewModal] = useState(false);
//       const [setOfSelectedIndexSfg, setSetOfSelectedIndexSfg] = useState(new Set());
//       const [selectedRowSfg, setSelectedRowSfg] = useState([]);
//       const [finalSelectedRowsSfg, setFinalSelectedRowsSfg] = useState([]);
//       const [displayModalSfg, setDisplayModalSfg] = useState(false);
//       const [selectedRawMaterials, setSelectedRawMaterials] = useState([]);
//       const [selectedSFGs, setSelectedSFGs] = useState([]);
//       const [billOfSaleSummary, setBillOfSaleSummary] = useState([]);


//       const [rawMaterialData, setRawMaterialData] = useState([]);
//       const [semiFinishedData, setSemiFinishedData] = useState([]);



//       useEffect(() => {
//           function handleClickOutside(event) {
//               if (popupRef.current && !popupRef.current.contains(event.target)) {
//                   setShowSalesPopup(false);
//               }
//           }

//           if (showSalesPopup) {
//               document.addEventListener("mousedown", handleClickOutside);
//           }

//           return () => {
//               document.removeEventListener("mousedown", handleClickOutside);
//           };
//       }, [showSalesPopup]);


//       const fetchDropDownData = async () => {

//           try {
//               setLoading(true);
//               const headers = {
//                   Authorization: `Bearer ${token}`,
//               };

//               const [
//                   response1,
//                   response2,
//                   response3,
//                   response4,
//               ] = await Promise.all([
//                   axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/custom/getAllStock`, { headers }),
//                   axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/jobber-masters?populate=*`, { headers }),
//                   axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/colors?populate=*`, { headers }),
//                   axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/custom/getAllStockSfg`, { headers }),
//               ]);

//               const data = Array.isArray(response1.data.data)
//                   ? response1.data.data
//                   : [];
//               const formattedData = data.map((item) => ({
//                   Group: item.raw_material_master?.group?.group_name || "N/A",
//                   "Item Name": item?.raw_material_master?.item_name || "N/A",
//                   Unit: item?.raw_material_master?.unit?.unit_name || "N/A",
//                   "HSN/SAC Code": item?.raw_material_master?.hsn_sac_code?.hsn_sac_code || "N/A",
//                   Description: item?.raw_material_master?.description || "N/A",
//                   Color: item?.raw_material_master?.color?.color_name || "N/A",
//                   AvailableStock: item?.Total_Qty,
//                   qty: "",
//                   id: item.raw_material_master?.id,
//               }));

//               console.log("")

//               setSelectionData(formattedData);
//               const jobbers = Array.isArray(response2.data.data)
//                   ? response2.data.data
//                   : [];
//               setJobberDetail(jobbers);
//               const colorGroup = Array.isArray(response3.data.data) ? response3.data.data : [];
//               setColor(colorGroup);
//               const Sfgdata = Array.isArray(response4.data.data)
//                   ? response4.data.data
//                   : [];
//               const formattedDataSfg = Sfgdata.map((item) => ({
//                   Group: item?.semi_finished_goods_master?.group?.group_name || "N/A",
//                   "Item Name": item?.semi_finished_goods_master?.semi_finished_goods_name || "N/A",
//                   Unit: item?.semi_finished_goods_master?.unit?.unit_name || "N/A",
//                   Description: item?.semi_finished_goods_master?.description || "N/A",
//                   Color: item?.semi_finished_goods_master?.color?.color_name || "N/A",
//                   AvailableStock: item?.Quantity,
//                   qty: "",
//                   id: item?.semi_finished_goods_master?.id,
//               }));

//               setSelectionDataSfg(formattedDataSfg);
//           } catch (error) {
//               console.error("Error fetching jobber data:", error);
//               if (error.response?.status === 401) {
//                   navigate("/login");
//               }
//           } finally {
//               setLoading(false);
//           }
//       };


//       useEffect(() => {
//           if (token) {
//               fetchDropDownData();
//           } else {
//               navigate("/login");
//           }
//       }, [token, navigate]);


//       const handleSalesOrderType = async (type) => {

//           let api_key;

//           type === 'vasttram' ? api_key = "internal-sales-order-entries" : api_key = "sales-oder-entries"
//           setType(api_key);
//           try {
//               setLoading(true);
//               setSelectedSOId(null);
//               const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/${api_key}?filters[order_status][$eq]=In%20Process&populate=*`, {
//                   headers: {
//                       Authorization: `Bearer ${token}`,
//                   },
//               });

//               const OrderData = Array.isArray(response.data.data) ? response.data.data : [];
//               const data = OrderData.map((order) => (
//                   {
//                       id: order?.id,
//                       so_id: order?.so_id,
//                       group: order?.group?.group_name,
//                       design_number: order?.design_number?.design_number,
//                       qty: order?.qty,
//                       urgent: (order?.urgent === true) ? "Yes" : "No"
//                   }
//               ))
//               setSelectedSO(data);
//               if (OrderData.length > 0) setSelectSOModal(true);

//           } catch (error) {
//               console.error("Error fetching jobber data:", error);
//               if (error.response?.status === 401) {
//                   navigate("/login");
//               }
//           } finally {
//               setLoading(false);
//           }
//       };




//       function handleSaveSelection() {
//           try {
//               const updatedRows = selectedRow.map((row) => ({
//                   ...row,
//                   Qty: 1,
//                   Total: row.Price || 0,
//               }));

//               const uniqueRows = [...finalSelectedRows];
//               updatedRows.forEach((row) => {
//                   if (!uniqueRows.some((existingRow) => existingRow?.id === row?.id)) {
//                       uniqueRows.push(row);
//                   }
//               });

//               setFinalSelectedRows(uniqueRows);
//               setDisplayModal(false);
//           } catch (error) {
//               console.error("Unexpected error in processing selection:", error);
//               toast.error("Unexpected error while saving selection.");
//           }
//       }

//       console.log("finalSelectedRows: ", finalSelectedRowsSfg)





//       function handleSaveSelectionSfg() {
//           const updatedRows = selectedRowSfg.map((row) => ({
//               ...row,
//               Price: row.Price || 0,
//               Qty: 1,
//               Total: row.Price || 0,
//           }));

//           const uniqueRows = [...finalSelectedRowsSfg];
//           selectedRowSfg.forEach((row) => {
//               if (!uniqueRows.some((existingRow) => existingRow?.id === row?.id)) {
//                   uniqueRows.push({
//                       ...row,
//                       Price: row.Price || 0,
//                       Qty: 1,
//                       Total: row.Price || 0,
//                   });
//               }
//           });

//           setFinalSelectedRowsSfg(uniqueRows);
//           setDisplayModalSfg(false);
//       }

//       const handleRawMaterialProceedToStitch = async (material) => {

//         console.log("Raw material data have to proceed for stitching", material);
//       }

//       const handleSFGProceedToStitch = async (material) => {
//         console.log("SFG data have to proceed for stitching", material);
//       }



//       return (
//           <div>
//               <div className="p-2 bg-white  relative">
//                   <h1 className="text-3xl font-bold text-blue-900 mb-4">{title}</h1>


//                   {/*  locader or main component */}
//                   {loading || load ? (
//                       <div className="absolute inset-0 flex justify-center items-center mt-64 bg-opacity-50 bg-gray-200 z-10">

//                           <BounceLoader size={100} color={"#1e3a8a"} loading={loading} />
//                       </div>
//                   ) : (
//                       <div className='p-5 border border-gray-300 rounded-xl shadow-xl '>

//                           {displayModal && (
//                               <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50">
//                                   <div className="relative w-[90vw] bg-gray-200 border shadow-2xl p-4 rounded-lg">
//                                       {/* Close Button */}
//                                       <button
//                                           className="absolute top-2 right-2 text-gray-700 hover:text-red-500 text-2xl font-bold"
//                                           onClick={() => setDisplayModal(false)}
//                                       >
//                                           ✖
//                                       </button>

//                                       <div className='mt-8'>
//                                           <SelectionTable
//                                               NoOfColumns={selctionHeader.length}
//                                               data={selectionData}
//                                               headers={selctionHeader}
//                                               setSelectedRow={setSelectedRow}
//                                               setOfSelectedIndex={setOfSelectedIndex}
//                                               setSetOfSelectedIndex={setSetOfSelectedIndex}
//                                           />
//                                       </div>

//                                       {/* Add Button */}
//                                       <div className="flex justify-center items-center mt-4">
//                                           <button
//                                               type="button"
//                                               className="bg-gray-400 px-4 py-1 rounded hover:bg-gray-300"
//                                               onClick={handleSaveSelection}
//                                           >
//                                               Add
//                                           </button>
//                                       </div>
//                                   </div>
//                               </div>
//                           )}

//                           {displayModalSfg && (
//                               <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50">
//                                   <div className="relative w-[90vw] bg-gray-200 border shadow-2xl p-4 rounded-lg">
//                                       {/* Close Button */}
//                                       <button
//                                           className="absolute top-2 right-2 text-gray-700 hover:text-red-500 text-2xl font-bold"
//                                           onClick={() => setDisplayModalSfg(false)}
//                                       >
//                                           ✖
//                                       </button>

//                                       <div className='mt-8'>
//                                           <SelectionTable
//                                               NoOfColumns={selctionHeaderSfg.length}
//                                               data={selectionDataSfg}
//                                               headers={selctionHeaderSfg}
//                                               setSelectedRow={setSelectedRowSfg}
//                                               setOfSelectedIndex={setOfSelectedIndexSfg}
//                                               setSetOfSelectedIndex={setSetOfSelectedIndexSfg}
//                                           />
//                                       </div>

//                                       {/* Add Button */}
//                                       <div className="flex justify-center items-center mt-4">
//                                           <button
//                                               type="button"
//                                               className="bg-gray-400 px-4 py-1 rounded hover:bg-gray-300"
//                                               onClick={handleSaveSelectionSfg}
//                                           >
//                                               Add
//                                           </button>
//                                       </div>
//                                   </div>
//                               </div>
//                           )}


//                           {selectSOModal && (
//                               <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50">
//                                   <div className="relative w-[90vw] bg-gray-200 border shadow-2xl p-4 rounded-lg">
//                                       {/* Close Button */}
//                                       <button
//                                           className="absolute top-2 right-2 text-gray-700 hover:text-red-500 text-2xl font-bold"
//                                           onClick={() => setSelectSOModal(false)}
//                                       >
//                                           ✖
//                                       </button>

//                                       <div className="mt-8">
//                                           <SelectSOTable
//                                               NoOfColumns={selctionHeaderSO.length}
//                                               data={selectedSO}
//                                               headers={selctionHeaderSO}
//                                               setSelectedRow={setSelectedRow}
//                                               setSelectSOModal={setSelectSOModal}
//                                               selectedSOId={selectedSOId}
//                                               setSelectedSOId={setSelectedSOId}
//                                               type={type}
//                                               setLoading={setLoading}
//                                               navigate={navigate}
//                                               setSalesOrder={setSalesOrder}
//                                               setSOViewModal={setSOViewModal}
//                                               setBillOfSaleSummary={setBillOfSaleSummary}
//                                               setRawMaterialData={setRawMaterialData}
//                                               setSemiFinishedData={setSemiFinishedData}
//                                           />
//                                       </div>
//                                   </div>
//                               </div>
//                           )}


//                           {/* Choose sales order */}

//                               <div className='flex justify-center items-center relative' ref={popupRef}>
//                                   <button
//                                       className='p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all ease-in-out duration-100 hover:scale-105'
//                                       type="button"
//                                       onClick={() => setShowSalesPopup(prev => !prev)}
//                                   >
//                                       Choose Sales Order
//                                   </button>

//                                   {showSalesPopup && (
//                                       <div className="absolute top-14 bg-white border shadow-lg rounded-lg p-4 z-10 w-64 flex flex-col gap-2">
//                                           <button
//                                               type="button"
//                                               onClick={() => {
//                                                   handleSalesOrderType('vasttram');
//                                                   setShowSalesPopup(false);
//                                               }}
//                                               className="px-4 py-2 rounded hover:bg-blue-100 text-left"
//                                           >
//                                               Vasttram Sales Order
//                                           </button>
//                                           <button
//                                               type="button"
//                                               onClick={() => {
//                                                   handleSalesOrderType('customer');
//                                                   setShowSalesPopup(false);
//                                               }}
//                                               className="px-4 py-2 rounded hover:bg-blue-100 text-left"
//                                           >
//                                               Customer Sales Order
//                                           </button>
//                                       </div>
//                                   )}
//                               </div>


//                               {soViewModal &&
//                                   <div className='my-4'>
//                                       {/* Design Details */}
//                                       <div className="flex flex-wrap items-center gap-6 mb-6 p-4 bg-gray-100 rounded-xl shadow-sm">
//                                           <div className="flex items-center gap-2">
//                                               <span className="font-semibold text-gray-700">Design ID:</span>
//                                               <span className="text-gray-900">{salesOrder.design_number?.id}</span>
//                                           </div>
//                                           <div className="flex items-center gap-2">
//                                               <span className="font-semibold text-gray-700">Design Group:</span>
//                                               <span className="text-gray-900">{salesOrder?.design_number?.design_group?.group_name}</span>
//                                           </div>
//                                           <div className="flex items-center gap-2">
//                                               <span className="font-semibold text-gray-700">Design Number:</span>
//                                               <span className="text-gray-900">{salesOrder.design_number?.design_number}</span>
//                                           </div>
//                                           <div className="flex items-center gap-2">
//                                               <span className="font-semibold text-gray-700">Quantity</span>
//                                               <span className="text-gray-900">{Number(salesOrder.qty)}</span>
//                                           </div>
//                                       </div>

//                                       {/* Raw Materials Table */}

//                                       <div className="overflow-x-auto rounded-xl mb-4">
//                                           <h1 className="text-2xl text-blue-500">Raw Materials</h1>
//                                           <table className="w-full border-collapse border border-gray-300">
//                                               <thead className="bg-blue-800 text-white">
//                                                   <tr>
//                                                       <th className="border p-2">Item Name</th>
//                                                       <th className="border p-2">Color</th>
//                                                       <th className="border p-2">Description</th>
//                                                       <th className="border p-2">Qty</th>
//                                                       <th className="border p-2">Required Qty</th>
//                                                       <th className="border p-2">Available Stock</th>
//                                                       <th className='border p-2'>Already Processed</th>
//                                                       <th className='border p-2'>Process Qty</th>
//                                                       <th className="border p-2">Action</th>

//                                                   </tr>
//                                               </thead>
//                                               <tbody className="text-center">
//                                                   {rawMaterialData?.map((material) => {

//                                                     const rawMaterialInfo = material.raw_material || material.raw_material_master;

//                                                       const requiredQty = Number(material.qty) * Number(salesOrder.qty);
//                                                       const alreadyProcessed = Number(billOfSaleSummary?.raw_materials_summary?.[material?.id] || 0);
//                                                       const selectedItem = selectedRawMaterials.find(item => item?.id === material?.id);
//                                                       const disableRow = alreadyProcessed >= requiredQty;
//                                                       const availableStock = selectionData.find(item => item?.id === material.raw_material?.id)?.AvailableStock || 0;

//                                                       const selectedJobber = selectedItem?.jobber;
//                                                       const selectedRate = selectedItem?.rate || 0;
//                                                       const processQty = selectedItem?.receive_qty || 0; 
//                                                       const totalAmount = selectedRate * processQty; 

//                                                       return (
//                                                           <tr key={material.id}>
//                                                           <td className="border p-2">{rawMaterialInfo.item_name}</td>
//                                                              <td className="border p-2">{rawMaterialInfo.color?.color_name}</td>
//                                                              <td className="border p-2">{material?.design_description}</td>
//                                                              <td className="border p-2">{material?.qty} per pcs</td>
//                                                              <td className="border p-2">{requiredQty}</td>
//                                                              <td className="border p-2">{availableStock}</td>
//                                                              <td className="border p-2">{alreadyProcessed}</td>
//                                                              <td className="border p-2">
//                                                                  <input
//                                                                      type="number"
//                                                                      className="w-20 px-2 py-1 border rounded"
//                                                                      min={0}
//                                                                      max={requiredQty - alreadyProcessed}
//                                                                      value={selectedItem?.receive_qty || ''}
//                                                                      onChange={(e) => {
//                                                                          const inputValue = Number(e.target.value);
//                                                                          if (inputValue + alreadyProcessed > requiredQty) return;

//                                                                          setSelectedRawMaterials(prev =>
//                                                                              prev.map(item =>
//                                                                                  item.id === material.id
//                                                                                      ? {
//                                                                                          ...item,
//                                                                                          receive_qty: inputValue,
//                                                                                          totalPrice: inputValue * (item.rate || 0)
//                                                                                      }
//                                                                                      : item
//                                                                              )
//                                                                          );
//                                                                      }}
//                                                                      disabled={!selectedItem }
//                                                                  />
//                                                              </td>
//                                                               <td className='border p-2'>
//                                                                 <button
//                                                                 className='bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-2 rounded'
//                                                                 onClick={()=> handleRawMaterialProceedToStitch(material)}>
//                                                                     Proceed to Stitch
//                                                                 </button>
//                                                               </td>

//                                                           </tr>
//                                                       );
//                                                   })}
//                                               </tbody>
//                                           </table>
//                                       </div>





//                                       {/* Semi Finished Goods Table */}

//                                       <div className="overflow-x-auto rounded-xl mt-8">
//                                           <h1 className='text-2xl text-blue-500'>Semi Finished Goods</h1>
//                                           <table className="w-full border-collapse border border-gray-300">
//                                               <thead className='bg-blue-800 text-white'>
//                                                   <tr>
//                                                       <th className="border p-2">Name</th>
//                                                       <th className="border p-2">Color</th>
//                                                       <th className="border p-2">Description</th>
//                                                       <th className="border p-2">Qty</th>
//                                                       <th className="border p-2">Required Qty</th>
//                                                       <th className="border p-2">Available Stock</th>
//                                                       <th className="border p-2">Already Processed</th>
//                                                       <th className="border p-2">Process Qty</th>
//                                                       <th className="border p-2">Action</th>

//                                                   </tr>
//                                               </thead>
//                                               <tbody className='text-center'>
//                                                   {semiFinishedData?.map((sfg) => {
//                                                       const requiredQty = Number(sfg.qty) * Number(salesOrder.qty);
//                                                       const selectedItem = selectedSFGs.find(item => item.id === sfg.id);
//                                                       const availableStock = selectionDataSfg.find((item) => item.id === sfg.semi_finished_goods.id)?.AvailableStock || 0;
//                                                     const alreadyProcessed = Number(billOfSaleSummary?.semi_finished_goods_summary?.[sfg.id] || 0)
//                                                     const selectedRate = selectedSFGs.find(item => item.id === sfg.id)
//                                                     const disableRow = alreadyProcessed >= requiredQty
//                                                       return (
//                                                           <tr key={sfg.id}>
//                                                               <td className="border p-2">{sfg?.semi_finished_goods?.semi_finished_goods_name}</td>
//                                                               <td className="border p-2">{sfg?.semi_finished_goods?.color?.color_name}</td>
//                                                               <td className="border p-2">{sfg?.sfg_description}</td>
//                                                               <td className="border p-2">{sfg?.qty} per pcs</td>
//                                                               <td className="border p-2">{requiredQty}</td>
//                                                               <td className="border p-2">{availableStock}</td>
//                                                               <td className="border p-2">{alreadyProcessed}</td>

//                                                               <td className="border p-2">
//                                                                  <input
//                                                                      type="number"
//                                                                      className="w-20 px-2 py-1 border rounded"
//                                                                      min={0}
//                                                                      max={requiredQty - alreadyProcessed}
//                                                                      value={selectedItem?.receive_qty || ''}
//                                                                      onChange={(e) => {
//                                                                          const inputValue = Number(e.target.value);
//                                                                          if (inputValue + alreadyProcessed > requiredQty) return;
//                                                                          setSelectedSFGs(prev =>
//                                                                              prev.map(item =>
//                                                                                  item.id === sfg.id
//                                                                                      ? { ...item, receive_qty: inputValue, totalPrice: inputValue * selectedRate }
//                                                                                      : item
//                                                                              )
//                                                                          );
//                                                                      }}
//                                                                      disabled={!selectedItem || disableRow}
//                                                                  />
//                                                              </td>
//                                                              <td className='border p-2'>
//                                                                 <button className='bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-2 rounded'
//                                                                 onClick={()=> handleSFGProceedToStitch(sfg)}>
//                                                                     Proceed to Stitch
//                                                                 </button>
//                                                               </td>

//                                                           </tr>
//                                                       );
//                                                   })}
//                                               </tbody>
//                                           </table>
//                                       </div>


//                                   </div>
//                               }

//                       </div>


//                   )}

//               </div>
//           </div>
//       )
//   }

// export default ReadyToStitch









import React, { useEffect, useState, useRef } from 'react'
import { BounceLoader, PuffLoader } from 'react-spinners'
import { toast } from 'react-toastify'
import SmartTable from '../../smartTable/SmartTable'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useSelector } from 'react-redux'
import SelectionTable from '../../smartTable/SelectionTable'
import ExtraBOMSfg from "./ExtraBOMSfg";
import SmartTable2 from "../../smartTable/SmartTable2";

const SelectSOTable = ({
    NoOfColumns,
    data,
    headers,
    setSelectedRow,
    setSelectSOModal,
    selectedSOId,
    setSelectedSOId,
    type,
    setLoading,
    navigate,
    setSalesOrder,
    setBom,
    setSOViewModal,
}) => {
    // console.log(setOfSelectedIndex);
    const { token } = useSelector((state) => state.auth);
    const [updatedData, setUpdatedData] = useState([]);
    const [updatedHeader] = useState(["select", ...headers]);
    const updateTableData = () => {
        const updatedValues = data.map((item) => ({
            select: (
                <input
                    type="checkbox"
                    checked={selectedSOId === item.id}
                    onChange={() => handleClick(item.id)}
                    key={item.id}
                />
            ),
            ...item,
        }));

        const selectedRow = data.find((item) => item.id === selectedSOId);
        setSelectedRow(selectedRow ? [selectedRow] : []);
        setUpdatedData(
            updatedValues.map((item) =>
                Object.fromEntries(Object.entries(item).slice(0, NoOfColumns + 1))
            )
        );
    };

    const handleClick = async (id) => {
        setSelectedSOId(id);
        type === "internal-sales-order-entries" ? type = "internal-sales-order-entry" : type = "sales-oder-entries";

        try {
            setLoading(true);

            const { data } = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/${type}/find-by-id/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log(data);

            if (data) {
                console.log("This is response:", data);
                const so_id = data?.so_id;


                setSalesOrder(data);
                // setBom(data.extra_bom_so[0]);
                // Fetch the Extra_bom from the response
                const extraBom = data.extra_bom_so[0]?.Extra_bom || [];

                // Fetch extra_bomSfg_fromStock from the response
                const extraBomFromStock = data?.extra_bomSfg_fromStock || [];

                // Merge extra_bomSfg_fromStock into Extra_bom, without changing the structure
                const mergedExtraBom = [...extraBom, ...extraBomFromStock];

                // Set the merged Extra_bom in the BOM
                setBom({
                    ...data.extra_bom_so[0],  // Keep the other BOM data intact
                    Extra_bom: mergedExtraBom,  // Merge the Extra_bom with extra_bomSfg_fromStock
                });
            }

        } catch (error) {
            console.error("Error fetching jobber data:", error);
            if (error.response?.status === 401) {
                navigate("/login");
            }
        } finally {
            setLoading(false);
        }

        setSelectSOModal(false);
        setSOViewModal(true);
    };

    useEffect(() => {
        updateTableData();
    }, [data, selectedSOId]);
    return <SmartTable2 data={updatedData} headers={updatedHeader} />;
};

const handleProceedForStitching = (itemId) => {
    console.log("Proceed for stitching:", itemId);
    // Add your API call or any other logic here
};

// main component
const ReadyToStitch = () => {
    const [selctionHeader, setSelectionHeader] = useState([
        "Group",
        "Item Name",
        "Unit",
        "HSN/SAC Code",
        "Description",
        "Color",
        "Qty",
    ]);

    const [selctionHeaderSfg, setSelectionHeaderSfg] = useState([
        "Group",
        "Item Name",
        "Unit",
        "Description",
        "Color",
        "Qty",
    ]);

    const [selctionHeaderSO, setSelectionHeaderSO] = useState([
        "Id",
        "SO Id",
        "Group",
        "Design Number",
        "Qty",
        "Urgent"
    ]);

    const location = useLocation()
    const title = location.state?.title || "Bill of Sales";
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const { token } = useSelector((state) => state.auth);
    const { load, error, availableProcessor } = useSelector((state) => state.fetchData);
    const navigate = useNavigate();
    const [selectedSO, setSelectedSO] = useState([]);
    const [selectedRow, setSelectedRow] = useState([]);
    const [showSalesPopup, setShowSalesPopup] = useState(false);
    const popupRef = useRef(null);
    const [selectSOModal, setSelectSOModal] = useState(false);
    const [selectedSOId, setSelectedSOId] = useState(null);
    const [type, setType] = useState("");
    const [salesOrder, setSalesOrder] = useState([]);
    const [bom, setBom] = useState(null);
    const [soViewModal, setSOViewModal] = useState(false);


    useEffect(() => {
        function handleClickOutside(event) {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                setShowSalesPopup(false);
            }
        }

        if (showSalesPopup) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showSalesPopup]);

    const handleSalesOrderType = async (type) => {

        let api_key;

        type === 'vasttram' ? api_key = "internal-sales-order-entries" : api_key = "sales-oder-entries"
        setType(api_key);
        try {
            setLoading(true);
            setSelectedSOId(null);
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/${api_key}?filters[order_status][$eq]=In%20Process&populate=*`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log("Fetching sales order data ", response.data.data);

            const OrderData = Array.isArray(response.data.data) ? response.data.data : [];
            const data = OrderData.map((order) => (
                {
                    id: order?.id,
                    so_id: order?.so_id,
                    group: order?.group?.group_name,
                    design_number: order?.design_number?.design_number,
                    qty: order?.qty,
                    urgent: (order?.urgent === true) ? "Yes" : "No"
                }
            ))
            setSelectedSO(data);
            if (OrderData.length > 0) setSelectSOModal(true);

        } catch (error) {
            console.log(error);
            console.error("Error fetching data:", error);
            if (error.response?.status === 401) {
                navigate("/login");
            }
        } finally {
            setLoading(false);
        }
    };




    return (
        <div>
            <div className="p-2 bg-white  relative">
                <h1 className="text-3xl font-bold text-blue-900 mb-4">{title}</h1>


                {/*  locader or main component */}
                {loading || load ? (
                    <div className="absolute inset-0 flex justify-center items-center mt-64 bg-opacity-50 bg-gray-200 z-10">

                        <BounceLoader size={100} color={"#1e3a8a"} loading={loading} />
                    </div>
                ) : (
                    <div className='p-5 border border-gray-300 rounded-xl shadow-xl '>



                        {selectSOModal && (
                            <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50">
                                <div className="relative w-[90vw] bg-gray-200 border shadow-2xl p-4 rounded-lg">
                                    {/* Close Button */}
                                    <button
                                        className="absolute top-2 right-2 text-gray-700 hover:text-red-500 text-2xl font-bold"
                                        onClick={() => setSelectSOModal(false)}
                                    >
                                        ✖
                                    </button>

                                    <div className="mt-8">
                                        <SelectSOTable
                                            NoOfColumns={selctionHeaderSO.length}
                                            data={selectedSO}
                                            headers={selctionHeaderSO}
                                            setSelectedRow={setSelectedRow}
                                            setSelectSOModal={setSelectSOModal}
                                            selectedSOId={selectedSOId}
                                            setSelectedSOId={setSelectedSOId}
                                            type={type}
                                            setLoading={setLoading}
                                            navigate={navigate}
                                            setSalesOrder={setSalesOrder}
                                            setBom={setBom}
                                            setSOViewModal={setSOViewModal}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}


                        {/* Choose sales order */}

                        <div className='flex justify-center items-center relative' ref={popupRef}>
                            <button
                                className='p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all ease-in-out duration-100 hover:scale-105'
                                type="button"
                                onClick={() => setShowSalesPopup(prev => !prev)}
                            >
                                Choose Sales Order
                            </button>

                            {showSalesPopup && (
                                <div className="absolute top-14 bg-white border shadow-lg rounded-lg p-4 z-10 w-64 flex flex-col gap-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            handleSalesOrderType('vasttram');
                                            setShowSalesPopup(false);
                                        }}
                                        className="px-4 py-2 rounded hover:bg-blue-100 text-left"
                                    >
                                        Vasttram Sales Order
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            handleSalesOrderType('customer');
                                            setShowSalesPopup(false);
                                        }}
                                        className="px-4 py-2 rounded hover:bg-blue-100 text-left"
                                    >
                                        Customer Sales Order
                                    </button>
                                </div>
                            )}
                        </div>


                        {soViewModal && (
                            <div className="my-8 overflow-x-auto">
                                <table className="min-w-full table-auto bg-white shadow-lg rounded-2xl overflow-hidden">
                                    <thead className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-900">
                                        <tr>
                                            <th className="px-6 py-4 text-left font-semibold">#</th>
                                            <th className="px-6 py-4 text-left font-semibold">Semi-Finished Goods</th>
                                            <th className="px-6 py-4 text-left font-semibold">Color</th>
                                            <th className="px-6 py-4 text-left font-semibold">Quantity</th>
                                            <th className="px-6 py-4 text-left font-semibold">Stock Reducted</th>
                                            <th className="px-6 py-4 text-left font-semibold">Status</th>
                                            <th className="px-6 py-4 text-left font-semibold">Processes</th>
                                            <th className="px-6 py-4 text-center font-semibold">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {bom?.Extra_bom?.map((item, index) => (
                                            <tr key={item.id} className="hover:bg-blue-50 transition">
                                                <td className="px-6 py-4 text-gray-700">{index + 1}</td>
                                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                                    {item?.semi_finished_goods?.semi_finished_goods_name}
                                                </td>
                                                <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                                                    {item?.color?.color_name}
                                                </td>
                                                <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                                                    {item?.qty}
                                                </td>

                                                <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                                                    {item?.stock_status === true ? "Yes" : "No"}
                                                </td>
                                                <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                                                    {item?.bom_status}
                                                </td>

                                                <tr key={`${item.id}-process`} className="bg-gray-50">
                                                    <td colSpan={6} className="px-6 py-4 text-gray-600 whitespace-nowrap">
                                                        {item?.processes?.length > 0 ? (
                                                            <div className="flex gap-4 items-center">
                                                                <select
                                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 text-gray-700 cursor-not-allowed"
                                                                    defaultValue="placeholder"
                                                                >
                                                                    <option value="placeholder" disabled>
                                                                        Process - Done by - Jobber
                                                                    </option>
                                                                    {item?.processes?.map((process, index) => (
                                                                        <option key={index} value={process?.process} disabled>
                                                                            {process?.process} - Done by - {process?.jobber?.jobber_name}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                        ) : (
                                                            <span className="text-gray-500 italic">No Process Yet</span>
                                                        )}
                                                    </td>
                                                </tr>


                                                <td className="px-6 py-4 text-center">
                                                    {(() => {
                                                        const isButtonDisabled = ["in_process", "sendToJobber", "readyForStitching", "SendToStitcher", "completed"].includes(item?.bom_status);

                                                        return (
                                                            <button
                                                                className={`px-5 py-2 rounded-xl font-semibold shadow-md transition duration-200
                                                                        ${isButtonDisabled
                                                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                                        : 'bg-blue-600 hover:bg-blue-700 text-white'}
                                                                            `}
                                                                disabled={isButtonDisabled}
                                                                onClick={() => {
                                                                    handleProceedForStitching(item?.id)
                                                                }}
                                                            >
                                                                Proceed For Stitching
                                                            </button>
                                                        );
                                                    })()}
                                                </td>


                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                            </div>
                        )}



                    </div>


                )}

            </div>
        </div>
    )
}

export default ReadyToStitch
