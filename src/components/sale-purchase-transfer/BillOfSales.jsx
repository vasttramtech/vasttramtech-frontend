import React, { useEffect, useState, useRef } from 'react'
import { BounceLoader, PuffLoader } from 'react-spinners'
import { toast } from 'react-toastify'
import SmartTable from '../../smartTable/SmartTable'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useSelector } from 'react-redux'
import SelectionTable from '../../smartTable/SelectionTable'
import SelectSOTable from "./SelectSOTable";
import ExtraBOMSfg from "./ExtraBOMSfg";
import Dashboard from "../Dashboard";




// main component
const BillOfSales = () => {
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
    const { token ,designation , id } = useSelector((state) => state.auth);
    const { load, error, availableProcessor } = useSelector((state) => state.fetchData);
    const navigate = useNavigate();
    const [selectedSO, setSelectedSO] = useState([]);
    const [jobberDetail, setJobberDetail] = useState([]);
    const [color, setColor] = useState([]);
    const [selectionData, setSelectionData] = useState([]);
    const [selectedRow, setSelectedRow] = useState([]);
    const [showSalesPopup, setShowSalesPopup] = useState(false);
    const popupRef = useRef(null);
    const [selectSOModal, setSelectSOModal] = useState(false);
    const [selectedSOId, setSelectedSOId] = useState(null);
    const [type, setType] = useState("");
    const [salesOrder, setSalesOrder] = useState([]);
    const [bom, setBom] = useState(null);
    const [soViewModal, setSOViewModal] = useState(false);
    const [otherCharges, setOtherCharges] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);

    const [bomModalVisible, setBomModalVisible] = useState(false);
    const [currentBomRow, setCurrentBomRow] = useState(null);
    const [jobberSelectionMap, setJobberSelectionMap] = useState({});
    const [confirmedBosList, setConfirmedBosList] = useState([]);
    const [selectedBOSIndex, setSelectedBOSIndex] = useState(null);
    const [calculatedBosList, setCalculatedBosList] = useState([]);
    const [addSfgModal, setAddSfgModal] = useState(false);
    const [company, setCompany] = useState(null);
    const [fromDashboard, setFromDashboard] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const [selectedRows, setSelectedRows] = useState([]);
    const queryParams = new URLSearchParams(location.search);
    const type1 = queryParams.get("type1");
    const dashId = queryParams.get("dashId");


    useEffect(() => {
        if (type1) {
            // Example API call
            handleClick(dashId, type1);
        }
    }, [type1]);





    // form data 
    const [formData, setFormData] = useState({
        date: "",
        ex_date: "",
        remarks: "",
        color: "",
        job_note: "",
        processor: "",
        merchandiser: "",
        seller_datails: "",
        purchaser_details: ""
    });

    const clearData = () => {
        setFormData({
            ex_date: "",
            remarks: "",
            color: "",
            job_note: "",
            processor: "",
            merchandiser: "",
            seller_datails: "",
            purchaser_details: ""
        });
        setSelectedSO([])
        setSalesOrder(null)
        setSelectSOModal(false);
        setShowSalesPopup(false)
        setSOViewModal(false);
        setBomModalVisible(false);
        setBomModalVisible(false)
        setCurrentBomRow([])
        setBom([])
        setOtherCharges(0)
        setTotalAmount(0)
        setConfirmedBosList([])
        setSelectedBOSIndex(null)
        setSelectedRows([])
        setJobberSelectionMap({})
    }

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

    // useEffect(() => {
    //     if (fromDashboard && selectedItem) {
    //         HandleBOSClick({
    //             item: selectedItem,
    //             token,
    //             type: selectedItem?.customer_name === "Vasttram Admin"
    //                 ? "internal-sales-order-entries"
    //                 : "sales-oder-entries",
    //             company,
    //             navigate,
    //             setSelectedSOId,
    //             setSalesOrder,
    //             setBom,
    //             setFormData,
    //             setLoading,
    //         });
    //     }
    // }, [fromDashboard, selectedItem]);

    console.log("availableProcessor: ", availableProcessor)

    const fetchDropDownData = async () => {

        try {
            setLoading(true);
            const headers = {
                Authorization: `Bearer ${token}`,
            };

            const [
                response1,
                // response2,
                // response3,
                response4,
            ] = await Promise.all([
                axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/custom/getAllStock`, { headers }),
                // axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/jobber-masters?populate=*`, { headers }),
                // axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/colors?populate=*`, { headers }),
                axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/companies`, { headers }),
            ]);

            console.log("response1.data.data: ", response1.data.data)
            // console.log("response2.data.data: ", response2.data.data)
            // console.log("response3.data.data: ", response3.data.data)
            console.log("response4.data.data: ", response4.data.data)



            const data = Array.isArray(response1.data.data)
                ? response1.data.data
                : [];
            const formattedData = data.map((item) => ({
                Group: item.raw_material_master?.group?.group_name || "N/A",
                "Item Name": item?.raw_material_master?.item_name || "N/A",
                Unit: item?.raw_material_master?.unit?.unit_name || "N/A",
                "HSN/SAC Code": item?.raw_material_master?.hsn_sac_code?.hsn_sac_code || "N/A",
                Description: item?.raw_material_master?.description || "N/A",
                Color: item?.raw_material_master?.color?.color_name || "N/A",
                AvailableStock: item?.Total_Qty,
                qty: "",
                id: item.raw_material_master?.id,
            }));


            console.log("formattedData: ", formattedData)
            setSelectionData(formattedData);
            // const jobbers = Array.isArray(response2.data.data)
            //     ? response2.data.data
            //     : [];
            // setJobberDetail(jobbers);
            // const colorGroup = Array.isArray(response3.data.data) ? response3.data.data : [];
            // setColor(colorGroup);
            const company = Array.isArray(response4.data.data)
                ? response4.data.data
                : [];
            setCompany(company[0]);
            setFormData(prev => ({
                ...prev,
                purchaser_details: company[0]?.gst_no
            }));


        } catch (error) {
            console.error("Error fetching jobber data:", error);
            if (error.response?.status === 401) {
                navigate("/login");
            }
        } finally {
            setLoading(false);
        }
    };

    // console.log("selectedRawMaterials: ", selectedRawMaterials)
    // console.log("selectedSFGs: ", selectedSFGs)

    useEffect(() => {
        if (token) {
            fetchDropDownData();
        } else {
            navigate("/login");
        }
    }, [token, navigate]);



    const handleSalesOrderType = async (type) => {

        let api_key;
        let response;

        type === 'vasttram' ? api_key = "internal-sales-order-entries" : api_key = "sales-oder-entries"
        setType(api_key);
        try {
            setLoading(true);
            setSelectedSOId(null);
            // const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/${api_key}?filters[order_status][$eq]=In%20Process&populate=*`, {
            //     headers: {
            //         Authorization: `Bearer ${token}`,
            //     },
            // });
            if (type === "vasttram") {
                // response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/internal-sales-order-entries?filters[order_status][$eq]=In%20Process&sort=id:desc&populate=*`, {
                //     headers: {
                //         Authorization: `Bearer ${token}`,
                //     },
                // });
                // response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/internal-sales-order-entries?filters[order_status][$in]=In%20Process&filters[order_status][$in]=Process%20Due&sort=id:desc&populate=*`, {
                //     headers: {
                //         Authorization: `Bearer ${token}`,
                //     },
                // });
                response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/custom-get-internal-sales-orders?designation=${designation}&userId=${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log("Fetching sales order data ", response.data.data);
            }
            else {

                // response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/sales-oder-entries?filters[order_status][$in]=In%20Process&filters[order_status][$in]=Process%20Due&filters[convert_id][$null]=true&sort=id:desc&populate=*`, {
                //     headers: {
                //         Authorization: `Bearer ${token}`,
                //     },
                // });
                response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/custom-get-external-sales-orders?designation=${designation}&userId=${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            }
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

    const formDataChangeHandler = (event) => {

        setFormData((prev) => ({
            ...prev,
            [event.target.name]: event.target.value
        }))
        console.log(formData.date)
    }

    const handleConfirmBos = (e) => {
        e.preventDefault();
        setConfirmedBosList(prev => [...prev, currentBomRow]);
        setSelectedBOSIndex(confirmedBosList.length);
        if (currentBomRow.length > 0 && currentBomRow[0]?.selectedJobber?.jobber_master) {
            setFormData((prev) => ({
                ...prev,
                seller_datails: currentBomRow[0].selectedJobber.jobber_master.jobber_gstin
            }));
        }
        setBomModalVisible(false);
        setSOViewModal(false);
    };

    const totalChargesHandler = () => {
        // Check if confirmedBosList has items and selectedBOSIndex is valid
        if (confirmedBosList && confirmedBosList.length > 0 && selectedBOSIndex !== null && selectedBOSIndex >= 0 && selectedBOSIndex < confirmedBosList.length) {
            const selectedBOM = confirmedBosList[selectedBOSIndex];

            // Calculate total SFG charges
            const sfgCharges = selectedBOM.reduce((total, item) => {
                const qty = item?.qty || 0;
                const rate = item?.selectedJobber?.jobber_rate || 0;
                return total + (qty * rate);
            }, 0);

            const final = sfgCharges + (otherCharges || 0);

            // Debug: Check final amount
            console.log("Final Amount: ", final);

            setTotalAmount(final);
        } else {
            console.log("Selected BOS data is missing or invalid.");
        }
    };


    useEffect(() => {
        totalChargesHandler();
    }, [otherCharges, confirmedBosList, selectedBOSIndex]);

    useEffect(() => {
        // Flatten the nested array first
        const flattenedBosList = confirmedBosList.flat();

        // Calculate the total row amount
        const totalRowAmount = flattenedBosList.reduce((acc, bos) => acc + (bos.rowCost || 0), 0);

        const firstJobberId = flattenedBosList[0]?.selectedJobber?.jobber_master?.id || null;

        // Update the currentBomRow with the calculated total amount
        setCurrentBomRow((prev) => {
            // Ensure prev is an array before adding the total amount
            const updatedRows = Array.isArray(prev) ? [...prev] : [];
            updatedRows.total_row_amount = totalRowAmount;
            updatedRows.jobber_id = firstJobberId;
            return updatedRows;
        });
    }, [confirmedBosList, otherCharges]);

    const handleClick = async (id, type) => {
        setSelectedSOId(id);
        setType(type)
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
                setFormData(prev => ({
                    ...prev,
                    date : new Date().toISOString().split("T")[0],
                    remarks: data?.remark,
                    processor:data?.processor?.id,
                    merchandiser:data?.merchandiser?.id,
                    purchaser_details: company?.gst_no
                }));
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




    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        // const api_point = (type === "sales-oder-entries") ? "sales-order-entry" : "internal-sales-order-entries";
        const api_point = (type === "internal-sales-order-entries") ? "internal-sales-order-entries" : "sales-order-entry" ;
        const orderType = (type === "internal-sales-order-entries") ? "internal-sales-order-entry" : "sales-order-entry"  ;                                                                  

        const postData = {
            data: {
                type: type,
                ...(type === "internal-sales-order-entries"
                    ? { internal_sales_order_entry: selectedSOId }
                    : { sales_order_entry: selectedSOId }
                ),
                date: formData?.date,
                so_id: salesOrder?.so_id ?? "",
                ex_date: formData.ex_date,
                design: salesOrder?.design_number?.id ?? null,
                remarks: formData?.remarks,
                job_note: formData?.job_note,
                processor: Number(formData.processor),
                seller_detail: formData?.seller_datails,
                purchaser_Details: company.id,
                other_charges: otherCharges || 0,
                Total_Bill_of_sales_Amount: totalAmount || 0,
                billOfSales_status: "open",
                bom_billOfSale: {
                    jobber: currentBomRow.jobber_id,
                    bom_detail: currentBomRow.map((item) => ({
                        semi_finished_goods: item?.semi_finished_goods?.id,
                        color: item?.color?.id,
                        qty: item?.qty,
                        jobber_rate: item?.selectedJobber?.jobber_rate,
                        total: item?.rowCost,
                        bom_id: item?.id,
                        rm: (item?.raw_material_bom || []).map((row) => ({
                            raw_material: row?.raw_material_master?.id || null,
                            rm_qty: row?.rm_qty || 0
                        })),
                        selectedJobberId: item?.selectedJobber?.id,
                        receive_qty: 0
                    })),
                    total_jobber_cost_on_sfg: currentBomRow.total_row_amount
                },
                merchandiser:formData?.merchandiser
            }
        };
        // const data = {
        //     "id": currentBomRow.id,
        //     "bom_status": "sendToJobber"
        // }

        const updateItems = currentBomRow.map((item) => ({
            id: item.id,
            bom_status: "sendToJobber",
            jobber_id: item.selectedJobber.id,
            completed: "Processing"
        }))

        console.log("postData: ", postData)
        console.log("updateItems: ", updateItems)

        try {
            const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/bill-of-sales`, postData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/${api_point}/update-bom-status/${salesOrder?.so_id}`, updateItems, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/${orderType}/update-status/${salesOrder?.so_id}/In%20Process`, postData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            toast.success("Bill of sales created successfully", { position: "top-right" });
            // console.log("res: ", res);

            setTimeout(() => {
                navigate(`/bill-of-sale/${res.data.data.id}`)
            }, 1000)

        } catch (error) {
            console.error("Error posting bill of sales:", error);
            toast.error(error?.response?.data?.error?.message || "Something went wrong!");
        } finally {
            setSubmitting(false);
        }
    };

    console.log("salesOrder: ", salesOrder);
    console.log('bom', bom);
    // console.log("jobberSelectionMap: ", jobberSelectionMap);
    // console.log("currentBomRow: ", currentBomRow);
    // console.log("confirmedBosList: ", confirmedBosList);
    console.log("type: ", type);


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
                                    <div className="relative w-[90vw] bg-gray-100 border shadow-2xl p-4 rounded-lg">
                                        <div className='flex justify-between items-center'>
                                            <h3 className='text-2xl font-semibold'>Select Sales Order</h3>
                                            <p
                                                className="text-xl px-2 border bg-red-600 rounded-full text-white hover:bg-red-500 cursor-pointer"
                                                onClick={() => {
                                                    setSelectSOModal(false);
                                                }}
                                            >
                                                X
                                            </p>
                                        </div>

                                    <div className="">
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
                                            company={company}
                                            setFormData={setFormData}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}


                        {/* Choose sales order */}
                        <form className='' onSubmit={handleSubmit}>

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


                            {bomModalVisible && currentBomRow && (
                                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                    <div className="bg-white p-6 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-lg">
                                        <h2 className="text-2xl font-bold mb-6 border-b pb-2">BOS Details</h2>
                                        <h3 className="text-lg font-semibold mb-2 border-b pb-1 mt-4">Jobber Detail</h3>
                                        {currentBomRow.length > 0 && currentBomRow[0]?.selectedJobber?.jobber_master && (
                                            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg shadow-md mb-6">
                                                <h3 className="text-xl font-semibold text-blue-900 mb-3 border-b pb-2">Jobber Details</h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <p><span className="font-semibold">Name:</span> {currentBomRow[0].selectedJobber.jobber_master.jobber_name}</p>
                                                        <p><span className="font-semibold">Address:</span> {currentBomRow[0].selectedJobber.jobber_master.jobber_address}</p>
                                                    </div>
                                                    <div>
                                                        <p><span className="font-semibold">GSTIN:</span> {currentBomRow[0].selectedJobber.jobber_master.jobber_gstin}</p>
                                                        <p><span className="font-semibold">Process:</span> {currentBomRow[0].selectedJobber.jobber_master.work_type}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}


                                        <table>
                                            <thead className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-900">
                                                <tr>
                                                    <th className="px-6 py-4 text-left font-semibold">#</th>
                                                    <th className="px-6 py-4 text-left font-semibold">Semi-Finished Goods</th>
                                                    <th className="px-6 py-4 text-left font-semibold">Color</th>
                                                    <th className="px-6 py-4 text-left font-semibold">Quantity</th>
                                                    <th className="px-6 py-4 text-left font-semibold">Jobber Rate</th>
                                                    <th className="px-6 py-4 text-left font-semibold">Total</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200">
                                                {currentBomRow.map((item, index) => {
                                                    // Disable checkbox based on stock_status and bom_status


                                                    return (
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
                                                                {item?.selectedJobber?.jobber_rate}
                                                            </td>
                                                            <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                                                                {item?.qty * item?.selectedJobber?.jobber_rate}
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>

                                        <hr className="w-full border-t-2 border-gray-300 my-2" />

                                        <div className="flex justify-end mb-4">
                                            <p className="text-lg font-semibold">
                                                Total Cost: ₹
                                                {currentBomRow.reduce((total, item) => {
                                                    const qty = item?.qty || 0;
                                                    const rate = item?.selectedJobber?.jobber_rate || 0;
                                                    return total + (qty * rate);
                                                }, 0)}
                                            </p>
                                        </div>


                                        <div className="mt-6 flex justify-end gap-4">
                                            <button
                                                type='button'
                                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                                                onClick={() => setBomModalVisible(false)}
                                            >
                                                Cancel
                                            </button>
                                            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                                onClick={handleConfirmBos}
                                                type="button"
                                            >
                                                Confirm BOS
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}


                            {soViewModal && (
                                <div className="my-8 overflow-x-auto">
                                    <table className="min-w-full table-auto bg-white shadow-lg rounded-2xl overflow-hidden">
                                        <thead className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-900">
                                            <tr>
                                                <th className="px-6 py-4 text-left font-semibold">#</th>
                                                <th className="px-6 py-4 text-left font-semibold">Semi-Finished Goods</th>
                                                <th className="px-6 py-4 text-left font-semibold">Color</th>
                                                <th className="px-6 py-4 text-left font-semibold">Quantity</th>
                                                <th className="px-6 py-4 text-left font-semibold">Select Jobber</th>
                                                <th className="px-6 py-4 text-left font-semibold">Stock Reduced</th>
                                                <th className="px-6 py-4 text-left font-semibold">Status</th>
                                                <th className="px-6 py-4 text-left font-semibold">Processes</th>
                                                <th className="px-6 py-4 text-left font-semibold">Select</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {bom?.Extra_bom?.map((item, index) => {
                                                // Disable checkbox based on stock_status and bom_status
                                                const isButtonDisabled =
                                                    item?.stock_status === false ||
                                                    ["sendToJobber", "readyToStitch", "SendToStitcher", "completed"].includes(item?.bom_status);

                                                return (
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

                                                        {/* Jobber Selection */}
                                                        {/* <td className="px-6 py-4">
                                                            <select
                                                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white"
                                                                value={jobberSelectionMap[item.id]?.jobber_master?.id || ""}
                                                                onChange={(e) => {
                                                                    const selectedJobber = item?.jobber_master_sfg?.find(
                                                                        (jobber) => jobber?.jobber_master?.id === parseInt(e.target.value)
                                                                    );

                                                                    if (selectedJobber) {
                                                                        setJobberSelectionMap((prev) => ({
                                                                            ...prev,
                                                                            [item.id]: selectedJobber,
                                                                        }));
                                                                    }
                                                                }}
                                                                disabled={isButtonDisabled}
                                                            >
                                                                <option value="" disabled>
                                                                    -- Select Jobber --
                                                                </option>
                                                                {item?.jobber_master_sfg?.map((jobber) => (
                                                                    <option key={jobber.id} value={jobber?.jobber_master?.id}>
                                                                        {jobber?.jobber_master?.id} - {jobber?.jobber_master?.jobber_name} - {jobber?.jobber_master?.work_type}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </td> */}

                                                        <td className="px-6 py-4">
                                                            <select
                                                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white"
                                                                value={jobberSelectionMap[item.id]?.jobber_master?.id || ""}
                                                                onChange={(e) => {
                                                                    const selectedJobber = item?.jobber_master_sfg?.find(
                                                                        (jobber) => jobber?.jobber_master?.id === parseInt(e.target.value)
                                                                    );

                                                                    if (selectedJobber) {
                                                                        setJobberSelectionMap((prev) => ({
                                                                            ...prev,
                                                                            [item.id]: selectedJobber,
                                                                        }));
                                                                    }
                                                                }}
                                                                disabled={isButtonDisabled}
                                                            >
                                                                <option value="" disabled>
                                                                    -- Select Jobber --
                                                                </option>
                                                                {item?.jobber_master_sfg
                                                                    ?.filter(
                                                                        (jobber) =>
                                                                            jobber.completed === "Incomplete" || jobber.completed === "Processing"
                                                                    )
                                                                    .map((jobber) => (
                                                                        <option key={jobber.id} value={jobber?.jobber_master?.id}>
                                                                            {jobber?.jobber_master?.id} - {jobber?.jobber_master?.jobber_name} - {jobber?.jobber_master?.work_type}
                                                                        </option>
                                                                    ))}
                                                            </select>
                                                        </td>


                                                        <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                                                            {item?.stock_status === true ? "Yes" : "No"}
                                                        </td>
                                                        <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                                                            {/* {item?.bom_status} */}
                                                            {item?.bom_status === "in_process" ? "No Process Done" : item?.bom_status}
                                                        </td>

                                                        {/* <tr key={`${item.id}-process`} className="bg-gray-50">
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
                                                        </tr> */}

                                                        <tr key={`${item.id}-process`} className="bg-gray-50">
                                                            <td colSpan={6} className="px-6 py-4 text-gray-600 whitespace-nowrap">
                                                                {item?.processes?.length > 0 ? (
                                                                    <div className="flex flex-col gap-1">
                                                                        {item?.processes?.map((process, index) => (
                                                                            <div key={index} className="text-sm text-gray-700">
                                                                                <span className="font-medium">{process?.process}</span>
                                                                                {" - Done by - "}
                                                                                <span className="text-green-800 font-semibold">{process?.jobber?.jobber_name}</span>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                ) : (
                                                                    <span className="text-gray-500 italic">No Process Yet</span>
                                                                )}
                                                            </td>
                                                        </tr>


                                                        {/* Checkbox for row selection */}
                                                        <td className="px-6 py-4">
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedRows.includes(item.id)}
                                                                disabled={isButtonDisabled}
                                                                onChange={(e) => {
                                                                    if (e.target.checked) {
                                                                        setSelectedRows((prev) => [...prev, item.id]);
                                                                    } else {
                                                                        setSelectedRows((prev) => prev.filter((id) => id !== item.id));
                                                                    }
                                                                }}
                                                            />
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>


                                    <div className="mt-4 flex justify-end items-center">
                                        {/* <button
                                            className="mt-4 ml-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:scale-100 hover:shadow-2xl transition-all duration-300 ease-in-out flex items-center gap-2"
                                            onClick={() => setAddSfgModal(true)}
                                            type="button"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.75v14.5M4.75 12h14.5" />
                                            </svg>
                                            Add SFG from Stock
                                        </button> */}

                                        <button
                                            className="bg-gradient-to-r from-green-400 via-blue-500 to-teal-600 text-white font-semibold py-3 px-8 mr-4 rounded-full shadow-lg hover:scale-100 hover:shadow-2xl hover:text-lg  transition-all duration-300 ease-in-out flex items-center gap-2"
                                            type="button"
                                            onClick={() => {
                                                if (selectedRows.length === 0) {
                                                    alert("Please select at least one row.");
                                                    return;
                                                }

                                                const selectedJobbers = selectedRows.map((id) => jobberSelectionMap[id]?.jobber_master?.id);
                                                const uniqueJobbers = [...new Set(selectedJobbers)];

                                                if (uniqueJobbers.length !== 1 || !uniqueJobbers[0]) {
                                                    alert("Please select the same jobber for every selected row.");
                                                    return;
                                                }

                                                // const selectedBomRows = bom?.Extra_bom?.filter((item) => selectedRows.includes(item.id));
                                                const selectedBomRows = bom?.Extra_bom?.filter((item) => selectedRows.includes(item.id)).map((item) => ({
                                                    ...item,
                                                    selectedJobber: jobberSelectionMap[item.id],
                                                    rowCost: item.qty * jobberSelectionMap[item.id]?.jobber_rate
                                                }));
                                                console.log("Selected BOM Rows:", selectedBomRows);
                                                setCurrentBomRow(selectedBomRows);
                                                setBomModalVisible(true);
                                            }}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
                                            </svg>
                                            Proceed For BOS
                                        </button>
                                    </div>



                                </div>
                            )}



                            {addSfgModal &&
                                <ExtraBOMSfg
                                    onClose={() => setAddSfgModal(false)}
                                    so_id={salesOrder?.so_id}
                                    type={type}
                                    setSOViewModal={setSOViewModal}
                                    id={salesOrder.id}
                                    setSalesOrder={setSalesOrder}
                                    setBom={setBom}
                                    setSelectSOModal={setSelectSOModal}
                                    company={company}
                                    setFormData={setFormData}
                                />
                            }

                            {/* {confirmedBosList.length > 0 && (
                                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                    <div className="bg-white p-6 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-lg">
                                        <h2 className="text-2xl font-bold mb-6 border-b pb-2">BOS Details</h2>
                                        <h3 className="text-lg font-semibold mb-2 border-b pb-1 mt-4">Jobber Detail</h3>
                                        {currentBomRow.length > 0 && currentBomRow[0]?.selectedJobber?.jobber_master && (
                                            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg shadow-md mb-6">
                                                <h3 className="text-xl font-semibold text-blue-900 mb-3 border-b pb-2">Jobber Details</h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <p><span className="font-semibold">Name:</span> {currentBomRow[0].selectedJobber.jobber_master.jobber_name}</p>
                                                        <p><span className="font-semibold">Address:</span> {currentBomRow[0].selectedJobber.jobber_master.jobber_address}</p>
                                                    </div>
                                                    <div>
                                                        <p><span className="font-semibold">GSTIN:</span> {currentBomRow[0].selectedJobber.jobber_master.jobber_gstin}</p>
                                                        <p><span className="font-semibold">Process:</span> {currentBomRow[0].selectedJobber.jobber_master.work_type}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}


                                        <table>
                                            <thead className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-900">
                                                <tr>
                                                    <th className="px-6 py-4 text-left font-semibold">#</th>
                                                    <th className="px-6 py-4 text-left font-semibold">Semi-Finished Goods</th>
                                                    <th className="px-6 py-4 text-left font-semibold">Color</th>
                                                    <th className="px-6 py-4 text-left font-semibold">Quantity</th>
                                                    <th className="px-6 py-4 text-left font-semibold">Jobber Rate</th>
                                                    <th className="px-6 py-4 text-left font-semibold">Total</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200">
                                                {currentBomRow.map((item, index) => {


                                                    return (
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
                                                                {item?.selectedJobber?.jobber_rate}
                                                            </td>
                                                            <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                                                                {item?.qty * item?.selectedJobber?.jobber_rate}
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>

                                        <div className="flex justify-end mb-4">
                                            <p className="text-lg font-semibold">
                                                Total Cost: ₹
                                                {currentBomRow.reduce((total, item) => {
                                                    const qty = item?.qty || 0;
                                                    const rate = item?.selectedJobber?.jobber_rate || 0;
                                                    return total + (qty * rate);
                                                }, 0)}
                                            </p>
                                        </div>


                                        <div className="mt-6 flex justify-end gap-4">
                                            <button
                                                type='button'
                                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                                                onClick={() => setBomModalVisible(false)}
                                            >
                                                Cancel
                                            </button>
                                            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                                onClick={handleConfirmBos}
                                            >
                                                Confirm BOS
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )} */}

                            {confirmedBosList.length > 0 && (
                                <div className="bg-white p-6 rounded-xl mb-4 shadow-lg">
                                    <h2 className="text-2xl font-bold mb-6 border-b pb-2">Confirmed BOS Details</h2>

                                    {confirmedBosList.map((bom, bosIndex) => (
                                        <div key={bosIndex} className="mb-8">
                                            {/* Jobber Details */}
                                            {bom.length > 0 && bom[0]?.selectedJobber?.jobber_master && (
                                                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg shadow-md mb-6">
                                                    <h3 className="text-xl font-semibold text-blue-900 mb-3 border-b pb-2">Jobber Details</h3>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div>
                                                            <p><span className="font-semibold">Name:</span> {bom[0].selectedJobber.jobber_master.jobber_name}</p>
                                                            <p><span className="font-semibold">Address:</span> {bom[0].selectedJobber.jobber_master.jobber_address}</p>
                                                        </div>
                                                        <div>
                                                            <p><span className="font-semibold">GSTIN:</span> {bom[0].selectedJobber.jobber_master.jobber_gstin}</p>
                                                            <p><span className="font-semibold">Process:</span> {bom[0].selectedJobber.jobber_master.work_type}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* BOS Table */}
                                            <table className="w-full mb-4 border border-gray-300 rounded-lg overflow-hidden">
                                                <thead className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-900">
                                                    <tr>
                                                        <th className="px-6 py-4 text-left font-semibold">#</th>
                                                        <th className="px-6 py-4 text-left font-semibold">Semi-Finished Goods</th>
                                                        <th className="px-6 py-4 text-left font-semibold">Color</th>
                                                        <th className="px-6 py-4 text-left font-semibold">Quantity</th>
                                                        <th className="px-6 py-4 text-left font-semibold">Jobber Rate</th>
                                                        <th className="px-6 py-4 text-left font-semibold">Total</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-200">
                                                    {bom.map((item, index) => (
                                                        <tr key={item.id} className="hover:bg-blue-50 transition">
                                                            <td className="px-6 py-4 text-gray-700">{index + 1}</td>
                                                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                                                {item?.semi_finished_goods?.semi_finished_goods_name || 'N/A'}
                                                            </td>
                                                            <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                                                                {item?.color?.color_name || 'N/A'}
                                                            </td>
                                                            <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                                                                {item?.qty || 0}
                                                            </td>
                                                            <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                                                                {item?.selectedJobber?.jobber_rate || 0}
                                                            </td>
                                                            <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                                                                {(item?.qty || 0) * (item?.selectedJobber?.jobber_rate || 0)}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>

                                            <hr className="w-full border-t-2 border-gray-300 my-2" />
                                            {/* Total Cost */}
                                            <div className="flex justify-end mb-4">
                                                <p className="text-lg font-semibold">
                                                    Total Cost: ₹
                                                    {bom.reduce((total, item) => {
                                                        const qty = item?.qty || 0;
                                                        const rate = item?.selectedJobber?.jobber_rate || 0;
                                                        return total + (qty * rate);
                                                    }, 0)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}







                            {/*  form started */}

                            {/* Your Bill of Sales Form */}



                            <div className=' grid grid-cols-2 gap-6 p-2 mb-16'>

                                {/* adding date */}
                                <div className=" mb-4">
                                    <label className="text-sm font-medium text-gray-700 mr-4" htmlFor="date">
                                        Date: <span className=' text-red-600 '>*</span>
                                    </label>
                                    <input
                                        className="border border-gray-300 rounded-md w-full p-2"
                                        type="date"
                                        id="date"
                                        name="date"
                                        value={formData.date}
                                        onChange={formDataChangeHandler}
                                        required
                                        readOnly
                                    />
                                </div>


                                {/* So Id */}
                                <div className=" mb-4">
                                    <label className="text-sm font-medium  text-gray-700 mr-4" htmlFor="so_id">
                                        SO ID:  <span className=' text-red-600 '>*</span>
                                    </label>
                                    <input
                                        className="border border-gray-300 rounded-md w-full p-2"
                                        type="text"
                                        id="so_id"
                                        name="so_id"
                                        value={salesOrder?.so_id || ""}
                                        onChange={formDataChangeHandler}
                                        required
                                        readOnly
                                    />
                                </div>

                                {/* Design  */}
                                <div className="mb-4">
                                    <label className="text-sm font-medium text-gray-700 mr-4" htmlFor="design">
                                        Design: <span className=' text-red-600 '>*</span>
                                    </label>
                                    <input
                                        className="border border-gray-300 rounded-md w-full p-2"
                                        type="text"
                                        id="design"
                                        name="design"
                                        value={salesOrder?.design_number?.design_number || ""}
                                        onChange={formDataChangeHandler}
                                        required
                                        readOnly
                                    />
                                </div>

                                {/*  Ex Date */}
                                <div className="mb-4">
                                    <label className="text-sm font-medium text-gray-700 " htmlFor="exDate">
                                        Ex Date:  <span className=' text-red-600 '>*</span>
                                    </label>
                                    <input
                                        className="border border-gray-300 rounded-md w-full p-2"
                                        type="date"
                                        id="exDate"
                                        name="ex_date"
                                        placeholder='SO-24105'
                                        value={formData.ex_date}
                                        onChange={formDataChangeHandler}
                                        required
                                    />
                                </div>


                                {/* Remarks */}
                                <div className="mb-4">
                                    <label className="text-sm font-medium text-gray-700 mr-4" htmlFor="remarks">
                                        SO Remarks:
                                    </label>
                                    <input
                                        className="border border-gray-300 rounded-md w-full p-2"
                                        type="text"
                                        id="remarks"
                                        name="remarks"

                                        value={formData.remarks}
                                        onChange={formDataChangeHandler}
                                   
                                    />
                                </div>

                                {/* Job Note */}
                                <div className=" mb-4">
                                    <label className="text-sm font-medium text-gray-700 mr-4" htmlFor="jobNote">
                                        Job Note:
                                    </label>
                                    <input
                                        className="border border-gray-300 rounded-md w-full p-2"
                                        type="text"
                                        id="job_note"
                                        name="job_note"
                                        value={formData.job_note}
                                        onChange={formDataChangeHandler}
                                     
                                    />
                                </div>


                                {/* Processor selector */}
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

                                <div className="flex flex-col">
                                    <label className="text-gray-700 font-semibold">Merchandiser  <span className=' text-red-600 '>*</span></label>
                                    <select className="border border-gray-300 bg-gray-100 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        name="merchandiser"
                                        value={formData.merchandiser}
                                        onChange={formDataChangeHandler}
                                    >
                                        <option value="" className="text-gray-400">Select Merchandiser</option>
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

                                {/*  Seller Details */}
                                <div>
                                    <label htmlFor="seller_details" className='text-sm font-medium text-gray-700 mr-4'>Seller Details  <span className=' text-red-600 '>*</span></label>
                                    <input
                                        className="border border-gray-300 rounded-md w-full p-2"
                                        type="text"
                                        name='seller_datails'
                                        placeholder='19AAECG772L1Z9'
                                        value={formData.seller_datails}
                                        onChange={formDataChangeHandler}
                                        required
                                        readOnly
                                    />
                                </div>

                                {/* purchaser details */}
                                <div className='flex flex-col'>
                                    <label htmlFor="purchase_details" className='text-sm font-medium text-gray-700 mr-4'>Purchaser Details  <span className=' text-red-600 '>*</span></label>
                                    <input
                                        className="border border-gray-300 rounded-md w-full p-2"
                                        type="text"
                                        name='purchaser_details'
                                        placeholder='purchaser details'
                                        value={formData.purchaser_details}
                                        onChange={formDataChangeHandler}
                                        required
                                        readOnly
                                    />
                                </div>

                            </div>



                            {/*  last ohter charges and total bill amount  */}
                            <div className=' flex justify-center items-center gap-2 mt-10'>
                                <div className='flex gap-2 justify-center items-center'>
                                    <label htmlFor="other_charges">Other Charges:  
                                        {/* <span className=' text-red-600 '>*</span> */}
                                        </label>
                                    <input
                                        type="text"
                                        className='p-2  border-gray-300 border rounded-md'
                                        placeholder='0.00'
                                        name='other_charges'
                                        id='other_charges'
                                        value={otherCharges}
                                        onChange={(e) => {
                                            setOtherCharges(parseFloat(e.target.value || 0));
                                            setSelectedBOSIndex(0); // or let user choose the index dynamically
                                        }}
                                    />
                                </div>

                                <div className='flex gap-2 justify-center items-center'>
                                    <label htmlFor="total_amount">Total Bill Amount:  <span className=' text-red-600 '>*</span></label>
                                    <input
                                        type="text"
                                        className='p-2 border-gray-300 border rounded-md'
                                        placeholder='0.00'
                                        name='total_amount'
                                        id='total_amount'
                                        value={totalAmount}
                                        readOnly
                                    />
                                </div>
                            </div>

                            <div className=' flex justify-center items-center m-5 gap-2 text-white'>
                                <button
                                    type="submit"
                                    className={`p-3 bg-green-500 rounded-md transition-all duration-100 ease-in-out ${submitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-600 hover:scale-105'
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

                                <button className='p-3 bg-yellow-500 rounded-md hover:bg-yellow-600 hover:scale-105 transition-all duration-100 ease-in-out' onClick={clearData}> Clear </button>


                                {/* <button className='p-3 bg-blue-500 rounded-md hover:bg-blue-600 hover:scale-105 transition-all duration-100 ease-in-out' type="button" onClick={totalChargesHandler}> Calculate</button> */}
                            </div>

                        </form>

                    </div>


                )}

            </div>
        </div>
    )
}

export default BillOfSales