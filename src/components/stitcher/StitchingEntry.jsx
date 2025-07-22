
import { useActionState, useEffect, useState } from "react";
import FormLabel from "../purchase/FormLabel";
import FormInput from "../utility/FormInput";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { BounceLoader, PuffLoader } from "react-spinners";
import SmartTable2 from "../../smartTable/SmartTable2";
import { toast } from "react-toastify";
import MeasurementModal from "./MeasurementModal";
import { MdCancel } from "react-icons/md";

const SelectSOTable = ({
    NoOfColumns,
    data,
    headers,
    setSelectedRow,
    selectedRow,
    setSelectedSO,
    setFormData,
    setOrderItem,
    setLoading,
    setSelectedSOId,
    setSOViewModal,
    setBom,
    type,
    setSalesOrder,
    setSelectedSOModal,
    setAllBomIds,
    allBomIds,
    allreadyProcessedQtyOfBOM,
    setAllreadyProcessedQtyOfBOM,
    allreadyProcessedOrderItems,
    setAllreadyProcessedOrderItems

}) => {
    const { token } = useSelector((state) => state.auth);
    const [updatedData, setUpdatedData] = useState([]);
    const navigate = useNavigate();
    const [updatedHeader] = useState(["select", ...headers]);


    const handleClick = async (id) => {

        setSelectedSOId(id);
        let so_type;
        type === "internal-sales-order-entries" ? so_type = "internal-sales-order-entry" : so_type = "sales-oder-entries";
        console.log(so_type);
        try {
            setLoading(true);

            const { data } = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/${so_type}/find-by-id/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log("Fetch data", data);

            if (data) {
                console.log("This is response:", data);
                const so_id = data?.so_id;

                setOrderItem(data?.order_items);
                setSelectedSO(data);

                setFormData(pre => ({
                    ...pre,
                    so_id: data?.so_id,
                    design_group: data?.group?.group_name,
                    design_number: data?.design_number?.design_number,
                    date: new Date().toISOString().split("T")[0],
                    processor: data?.processor?.id
                }));
                setSalesOrder(data);
                console.log("Data", data);
                const extraBom = data.extra_bom_so[0]?.Extra_bom || [];

                const extraBomFromStock = data?.extra_bomSfg_fromStock || [];

                const mergedExtraBom = [...extraBom, ...extraBomFromStock];



                const filteredExtraBom = mergedExtraBom.filter((item) =>
                    ((item?.bom_status === "readyToStitch") || (item?.bom_status === "completed") || (item?.bom_status === "SendToStitcher")));

                console.log(filteredExtraBom);
                const allId = filteredExtraBom.map((item) => item?.id);
                setAllBomIds(allId);
                console.log("All boms ids", allId);

                // fetching already processed data from here
                let idsString
                if (allId.length > 0) {
                    idsString = allId.join(",");
                }
                else {
                    idsString = " "
                }
                console.log("idsString", idsString);

                try {
                    let response;
                    if (idsString.length > 0 && allId.length > 0) {

                        response = await axios.get(
                            `${process.env.REACT_APP_BACKEND_URL}/api/stitching-entries/bom-processed-qty?ids=${idsString}`, {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                        );
                    }
                    let response2;
                    response2 = await axios.get(
                        `${process.env.REACT_APP_BACKEND_URL}/api/stitching-entry/getProcessedQtyById/${data?.so_id}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                    )

                    const processedQtyMap = {};
                    console.log("response.data", response.data);
                    console.log("response2.data", response2.data);


                    // Loop over each entry
                    response.data.forEach(entry => {
                        entry.bom.forEach(bomItem => {
                            // If you want to sum quantities if bom_id repeats:
                            if (processedQtyMap[bomItem.bom_id]) {
                                processedQtyMap[bomItem.bom_id] += bomItem.processed_qty;
                            } else {
                                processedQtyMap[bomItem.bom_id] = bomItem.processed_qty;
                            }
                        });
                    });

                    setAllreadyProcessedOrderItems(response2.data.data);
                    setAllreadyProcessedQtyOfBOM(processedQtyMap);
                    console.log("allreadyProcessedQtyOfBOM", processedQtyMap);

                } catch (error) {
                    console.error("Failed to fetch processed quantities", error);
                }

                setBom({
                    ...data.extra_bom_so[0],  // Keep the other BOM data intact
                    Extra_bom: filteredExtraBom,  // Merge the Extra_bom with extra_bomSfg_fromStock
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

        setSOViewModal(true);
        setSelectedSOModal(false);
    };

    useEffect(() => {
        const updatedValues = data.map((item) => ({
            select: (
                <input
                    type="checkbox"
                    onChange={() => handleClick(item.id)}
                    key={item.id}
                />
            ),
            ...item,
        }));

        setSelectedRow(selectedRow ? [selectedRow] : []);

        const finalData = updatedValues.map((item) =>
            Object.fromEntries(Object.entries(item).slice(0, NoOfColumns + 1))
        );

        setUpdatedData(finalData);
    }, [data, NoOfColumns]);


    useEffect(() => {
        console.log("Updated data:", updatedData);
    }, [data]);

    return <SmartTable2 data={updatedData} headers={updatedHeader} />;
};



const StitchingEntry = () => {
    const headersForTable = ["Stitching Id", "SO Type", "SO ID", "Design Group", "Design Name", "Qty", "Remarks"];

    const [displayModal, setDisplayModal] = useState(false);
    const [selectedRow, setSelectedRow] = useState([]);

    const [formData, setFormData] = useState({
        so_id: "",
        design_group: "",
        design_number: "",
        date: "",
        due_date: "",
        selected_stiitcher: "",
        processor: "",
        remarks: ""
    })

    const { token, designation, id } = useSelector(state => state.auth);
    const { load, error, availableProcessor } = useSelector((state) => state.fetchData);
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);


    const [selectedRows, setSelectedRows] = useState([]);
    const [stitcherDetail, setStitcherDetail] = useState([]);


    const [salesOrderList, setSalesOrderList] = useState([]);
    const [selectedSO, setSelectedSO] = useState(null);

    const [bom, setBom] = useState(null);
    const [soViewModal, setSOViewModal] = useState(false);

    const [salesOrder, setSalesOrder] = useState([]);
    const [selectedSalesOrderRows, setSelectedSalesOrderRows] = useState([]);
    const [processQuantities, setProcessQuantities] = useState({});


    const [allreadyProcessedQtyOfBOM, setAllreadyProcessedQtyOfBOM] = useState({});
    const [allreadyProcessedOrderItems, setAllreadyProcessedOrderItems] = useState({});

    const [selectedStitchRows, setSelectedStitchRows] = useState([]);
    const [selectedSOModal, setSelectedSOModal] = useState(false);


    const [orderItem, setOrderItem] = useState([]);

    //  newly added states 
    const [type, setType] = useState();
    const [selectedSOId, setSelectedSOId] = useState();

    // bom ids
    const [allBomIds, setAllBomIds] = useState([]);

    // measurement modal
    const [measurementModal, setMeasurementModal] = useState(false);
    const [showMeasurement, setShowMeasurement] = useState(false);

    const [lhSh, setLhSh] = useState({
        backLength: 0,
        hip: 0,
        croch: 0,
        calf: 0,
        others1: 0,
        dupatta1: 0,
        frontLength: 0,
        waist1: 0,
        thigh: 0,
        knee: 0,
        ankle: 0,
        sideLength: 0,
        dupatta2: 0,
    })

    const [bpGrownKurti, setBpGrownKurti] = useState({
        yokeLength: 0,
        shoulder: 0,
        upperChest: 0,
        waist2: 0,
        backNeck: 0,
        crossBack: 0,
        sleeveLength: 0,
        mori: 0,
        grownLength: 0,
        blouseLength: 0,
        dartPoint: 0,
        chest: 0,
        frontNeck: 0,
        crossFront: 0,
        armhole: 0,
        bicap: 0,
        others2: 0,
    })

    const fetchReadyToStitchSO = async () => {
        try {

            const response2 = await axios.get(
                `${process.env.REACT_APP_BACKEND_URL}/api/stitcher-masters?populate=*`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            //     setStitchReadySO(mappedData);
            const stitcher = Array.isArray(response2.data.data)
                ? response2.data.data
                : [];
            setStitcherDetail(stitcher);
            //     const colorGroup = Array.isArray(response3.data.data)
            //         ? response3.data.data
            //         : [];
            //     setColor(colorGroup);

            // } catch (error) {
            //     console.error("Error fetching jobber data:", error);
            //     if (error.response?.status === 401) {
            //         navigate("/login");
            //     }
            // } finally {
            //     setLoading(false);
        }
        catch (error) {
            console.error("Error fetching jobber data:", error);
        }
        finally {
            setLoading(false);
        }

    }

    useEffect(() => {
        if (!token) {
            navigate("/login");
            return;
        }
        fetchReadyToStitchSO();
    }, [token]);

    const handleCheckboxChange = (key, value) => {
        const requiredQty = Number(selectedSO.internal_SO?.qty || selectedSO.external_So?.qty || 0);
        const alreadyProcessed = allreadyProcessedOrderItems[key] || 0;

        setSelectedStitchRows(prev => {
            const exists = prev.find(row => row.key === key);

            if (exists) {
                // Remove if already selected
                return prev.filter(row => row.key !== key);
            } else {
                // Add with numeric requiredQty
                return [
                    ...prev,
                    {
                        key,
                        colour: value.colour,
                        khaka: value.khaka,
                        measurement: value.measurement,
                        work: value.work,
                        others: value.others,
                        requiredQty: requiredQty,
                        alreadyProcessed: alreadyProcessed,
                        processQty: 0
                    }
                ];
            }
        });
    };




    const handleProcessQtyChange = (key, newQty) => {
        setSelectedStitchRows(prev =>
            prev.map(item =>
                item.key === key ? { ...item, processQty: newQty } : item
            )
        );
    };


    const formDataChangeHandler = (event) => {

        setFormData((prev) => ({
            ...prev,
            [event.target.name]: event.target.value
        }))
        console.log(formData.date)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        if (showMeasurement === false) {
            toast.error("Please add measurements!!");
            setSubmitting(false);
            return;
        }

        if (salesOrder.length === 0) {
            alert("Please select a sales order");
            setSubmitting(false);
            return
        }
        if (selectedSalesOrderRows.length === 0 && selectedStitchRows.length === 0) {
            alert("Please select at least one stitch row or sales order row");
            setSubmitting(false);
            return
        }
        if (formData.due_date === "") {
            toast.warning("Please select a due date");
            setSubmitting(false);
            return;
        }

        if (formData.selected_stiitcher === "") {
            toast.warning("Please select a stitcher");
            setSubmitting(false);
            return;
        }


        console.log("Selected Stitch Rows: ", selectedStitchRows);
        console.log("Selected Sales Order Rows:", selectedSalesOrderRows);
        console.log("Form Data: ", formData);
        console.log("Choosen Sales order", salesOrder);




        // const orderItemWithQty = Object.entries(orderItem).map(([key, item]) => ({
        //     key, // preserve key like "BP", "LH", etc.
        //     ...item,
        //     requiredQty: Number(selectedSO?.qty || 0),
        // }));

        // console.log("orderItemWithQty: ", orderItemWithQty)


        // const validateAllRowsCompleted = () => {
        //     return Object.entries(orderItem).every(([key, item]) => {
        //         const requiredQty = Number(selectedSO.internal_SO?.qty || selectedSO.external_So?.qty || 0);

        //         // check if this row is selected
        //         const selectedRow = selectedStitchRows.find(row => row.key === key);

        //         if (selectedRow) {
        //             const already = selectedRow.alreadyProcessed || 0;
        //             const process = selectedRow.processQty || 0;
        //             return requiredQty === already + process;
        //         } else {
        //             const already = allreadyProcessedOrderItems[key] || 0;
        //             return requiredQty === already;
        //         }
        //     });
        // };


        // const isValid = validateAllRowsCompleted();
        console.log("Selected SO", selectedSalesOrderRows)
        console.log("Selected SO", selectedSalesOrderRows[0]?.semi_finished_goods.id);
        const baseData = {
            so_id: formData?.so_id,
            design_group: formData?.design_group,
            design_number: formData?.design_number,
            date: formData?.date,
            due_date: formData?.due_date,
            stitcher: formData?.selected_stiitcher,
            processor: formData?.processor,
            remarks: formData?.remarks,
            stitch_status: "stitching_process",
            order_Items: selectedStitchRows?.map((row) => ({
                group: row.key,
                color: row.colour,
                Khaka: row.khaka,
                measurement: row.measurement,
                work: row.work,
                others: row.others,
                qty_required: row.requiredQty,
                already_processed: row.already_processed,
                process_qty: row.processQty
            })),
            bom: selectedSalesOrderRows?.map((row) => ({
                sfg: Number(row?.semi_finished_goods?.id),
                color: row?.color?.id,
                bom_id: String(row?.id),
                processed_qty: row?.processQty,
            })),
            measurement: {
                lehenga_sharara: lhSh,
                bp_grown_kurti: bpGrownKurti
            }
        };

        const relationKey =
            type === "internal-sales-order-entries"
                ? { internal_sales_order_entry: selectedSOId }
                : { sales_order_entry: selectedSOId };

        const postData = {
            data: {
                ...relationKey,
                ...baseData,
            },
        };


        console.log("PostData: ", postData);

        try {
            // Submit main bill-of-purchase data


            // ✅ Use the correct map (already set previously)
            const bomStatusUpdates = [];
            console.log("Selected Sales Order Rows: ", selectedSalesOrderRows);

            selectedSalesOrderRows?.forEach((row) => {
                const bomId = String(row?.id);
                const required_qty = Number(row?.processQty || 0);
                const alreadyProcessed = allreadyProcessedQtyOfBOM[bomId] || 0;
                console.log("alreadyProcessed: ", alreadyProcessed);
                console.log("required_qty: ", required_qty);


                if (row?.qty === (alreadyProcessed + required_qty)) {
                    bomStatusUpdates.push({
                        id: Number(bomId),
                        bom_status: "completed"
                    });
                }
                else if (required_qty > 0) {
                    bomStatusUpdates.push({
                        id: Number(bomId),
                        bom_status: "SendToStitcher"
                    });
                }
            });

            console.log("bomStatusUpdates: ", bomStatusUpdates);

            const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/stitching-entries`, postData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            toast.success("Stitching Process created successfully", { position: "top-right" });

            console.log("Res", res);
            //   Send  API call only 
            if (bomStatusUpdates.length > 0) {
                const orderType = type === "internal-sales-order-entries" ? "internal-sales-order-entries" : "sales-order-entry";

                await axios.put(
                    `${process.env.REACT_APP_BACKEND_URL}/api/${orderType}/update-bom-status/${selectedSO.so_id}`,
                    bomStatusUpdates,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        }
                    }
                )

                toast.success("BOM Status updated successfully", { position: "top-right" });
            }






            setSelectedSalesOrderRows([]);
            setSelectedStitchRows([]);
            setSelectedSO(null);
            setSelectedSOId(null);
            setFormData({
                so_id: "",
                design_group: "",
                design_number: "",
                date: "",
                due_date: "",
                selected_stiitcher: "",
                processor: "",
                remarks: ""
            });
            setSalesOrder([]);
            setBom(null);

            setAllreadyProcessedOrderItems({});
            setAllreadyProcessedQtyOfBOM({});

            fetchReadyToStitchSO();
            navigate(`/stitching-entry/${res?.data?.data?.id}`);
        } catch (error) {
            console.log("Error: ", error);
            console.error("Error posting bill of sales:", error);
            toast.error(error?.response?.data?.error?.message || "Something went wrong!");
        } finally {
            setSubmitting(false);
        }
    };


    const handleSalesOrderType = async (type) => {

        let api_key;

        type === 'vasttram' ? api_key = "internal-sales-order-entries" : api_key = "sales-oder-entries"
        setType(api_key);
        try {
            setLoading(true);
            setSelectedSOId(null);


            console.log("Designation ", designation, "  Id ", id);

            // if (type === "vasttram") {
            //     response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/internal-sales-order-entries?filters[order_status][$eq]=In%20Process&sort=id:desc&populate=*`, {
            //         headers: {
            //             Authorization: `Bearer ${token}`,
            //         },
            //     });
            //     console.log("Fetching sales order data ", response.data.data);
            // }
            // else {

            //     response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/sales-oder-entries?filters[order_status][$in]=In%20Process&filters[order_status][$in]=Process%20Due&filters[convert_id][$null]=true&filters[processor][id][$eq]=${id}&sort=id:desc&populate=*`, {
            //         headers: {
            //             Authorization: `Bearer ${token}`,
            //         },
            //     });
            // }


            // let url = "";

            // console.log("type ", type);
            // if (type === "vasttram") {
            //     url = `${process.env.REACT_APP_BACKEND_URL}/api/internal-sales-order-entries?filters[order_status][$eq]=In%20Process&filters[order_status][$in]=Process%20Due&filters[order_status][$in]=readyToStitch&filters[order_status][$in]=In%20Stitching`;
            // } 
            // else {
            //     url = `${process.env.REACT_APP_BACKEND_URL}/api/sales-oder-entries?filters[order_status][$in]=In%20Process&filters[order_status][$in]=Process%20Due&filters[order_status][$in]=readyToStitch&filters[order_status][$in]=In%20Stitching&filters[convert_id][$null]=true`;
            // }

            // if(designation === "Admin"){
            //     url +=""
            // }
            // else if(designation === "Merchandiser" && id){
            //     url += `&filters[merchandiser][id][$eq]=${id}`;
            // }
            // else{
            //     url += `&filters[processor][id][$eq]=${id}`;
            // }

            // url += `&sort=id:desc&populate=*`;
            let url = '';
            let params = {
                "filters[order_status][$in]": ["In Process", "Process Due", "readyToStitch", "In Stitching"],
                "populate": "*",
                "pagination[page]": 1,
                "pagination[pageSize]": 10000,
                "sort": "id:desc",
            };

            if (type === "vasttram") {
                url = `${process.env.REACT_APP_BACKEND_URL}/api/internal-sales-order-entries`;
            } else {
                url = `${process.env.REACT_APP_BACKEND_URL}/api/sales-oder-entries`;
                params["filters[convert_id][$null]"] = true;
            }

            if (designation === "Merchandiser" && id) {
                params["filters[merchandiser][id][$eq]"] = id;
            } else if (designation !== "Admin" && id) {
                params["filters[processor][id][$eq]"] = id;
            }
            // make the API request
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params
            });
            console.log("Fetching sales order data ", response.data.data.length);

            if (response.data.data.length === 0) {
                toast.info("No data found");
            }

            const OrderData = Array.isArray(response.data.data) ? response.data.data : [];
            const data = OrderData?.map((order) => (
                {
                    id: order?.id,
                    so_id: order?.so_id,
                    group: order?.group?.group_name,
                    design_number: order?.design_number?.design_number,
                    // order_items: order?.order_items,
                    qty: order?.qty,
                    urgent: (order?.urgent === true) ? "Yes" : "No"
                }
            ))


            setSalesOrderList(data);
            if (OrderData.length > 0) setSelectedSOModal(true);

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


    useEffect(() => {
        setSelectedSalesOrderRows([]);
        setSelectedStitchRows([]);

    }, [selectedSO, selectedSOId])



    const cancelHandler = () => {
        setSelectedSalesOrderRows([]);
        setSelectedStitchRows([]);
        setSelectedSO(null);
        setSelectedSOId(null);
        setFormData({
            so_id: "",
            design_group: "",
            design_number: "",
            date: "",
            due_date: "",
            selected_stiitcher: "",
            processor: "",
            remarks: ""
        });
        setSalesOrder([]);
        setBom(null);

        setAllreadyProcessedOrderItems({});
        setAllreadyProcessedQtyOfBOM({});

    }

    console.log("lhSh: ", lhSh);
    console.log("bpGrownKurti: ", bpGrownKurti);


    if (loading || load) {
        return (
            <div className="flex justify-center items-center h-screen">
                <BounceLoader color="#1e3a8a" />
            </div>
        )
    }

    return (
        <div className="p-6 bg-white rounded-lg relative">

            <div className="">
                <h1 className="text-2xl font-bold pb-2 border-b text-blue-900 mb-4">
                    Stitching Entry
                </h1>


                {/* Form */}
                <form className="" onSubmit={handleSubmit}>
                    <div className="col-span-2 my-5 flex border border-blue-500 justify-center mt-4 rounded-lg p-2">
                        <div className="relative inline-flex flex-col gap-2">
                            <div className="flex items-center gap-3">
                                <p className="text-gray-700 font-medium">Choose Sales Order:</p>
                                <button
                                    type="button"
                                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                                    onClick={() => setDisplayModal(true)}
                                >
                                    Choose Sales Order
                                </button>
                            </div>

                            {displayModal && (
                                <div className="absolute top-full mt-2 left-0 bg-white border border-gray-200 shadow-lg rounded-md p-3 z-20 w-72">

                                    <div className="flex justify-end">
                                        <button
                                            className=" text-gray-700 hover:text-red-500 text-sm font-bold"
                                            onClick={() => setDisplayModal(false)}
                                        >
                                            ✖
                                        </button>
                                    </div>

                                    <button
                                        type="button"
                                        className="w-full px-4 py-2 text-left rounded hover:bg-blue-100 transition"
                                        onClick={() => {
                                            handleSalesOrderType('vasttram');
                                            setDisplayModal(false);
                                        }
                                        }
                                    >
                                        Vasttram Sales Order
                                    </button>
                                    <button
                                        type="button"
                                        className="w-full px-4 py-2 text-left rounded hover:bg-blue-100 transition"
                                        onClick={() => {
                                            handleSalesOrderType('customer');
                                            setDisplayModal(false);
                                        }}
                                    >
                                        Customer Sales Order
                                    </button>
                                </div>
                            )}
                        </div>

                    </div>



                    {/* Modal */}
                    {selectedSOModal && (
                        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-md flex justify-center items-center z-50">
                            <div className="relative w-[90vw] bg-gray-200 border shadow-2xl p-4 rounded-lg">

                                <div className="flex justify-between items-center mb-2 pb-2 border-b border-b-gray-300">
                                    <h3 className="text-xl font-bold text-blue-900 ">Choose Sales Order</h3>

                                    <p
                                        className=" text-red-700 rounded-full pr-5 hover:text-red-500 cursor-pointer duration-200 ease-in-out transition-all"
                                        onClick={() => {
                                            setSelectedSOModal(false);
                                        }}
                                    >
                                        <MdCancel className="w-8 h-8" />
                                    </p>
                                </div>

                                <div className="mt-1">
                                    <SelectSOTable
                                        NoOfColumns={headersForTable.length}
                                        data={salesOrderList}
                                        headers={headersForTable}
                                        setSelectedRow={setSelectedRows}
                                        selectedRow={selectedRow}
                                        setSelectedSO={setSelectedSO}
                                        setSelectedSOId={setSelectedSOId}
                                        setFormData={setFormData}
                                        setOrderItem={setOrderItem}
                                        setLoading={setLoading}
                                        setBom={setBom}
                                        type={type}
                                        setSalesOrder={setSalesOrder}
                                        setSOViewModal={setSOViewModal}
                                        setSelectedSOModal={setSelectedSOModal}
                                        setAllBomIds={setAllBomIds}
                                        allBomIds={allBomIds}
                                        allreadyProcessedQtyOfBOM={allreadyProcessedQtyOfBOM}
                                        setAllreadyProcessedQtyOfBOM={setAllreadyProcessedQtyOfBOM}
                                        allreadyProcessedOrderItems={allreadyProcessedOrderItems}
                                        setAllreadyProcessedOrderItems={setAllreadyProcessedOrderItems}
                                    />
                                </div>
                            </div>
                        </div>
                    )}


                    {selectedSO !== null && (
                        <div className="my-8 col-span-2">
                            <h2 className="text-lg font-semibold text-gray-800 mb-3">Stitching Details</h2>
                            <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
                                <table className="w-full border-collapse border border-gray-300 rounded-lg">
                                    <thead className="bg-gray-200 text-gray-700 text-sm uppercase">
                                        <tr>
                                            {["Group", "Colour", "Design/Khaka", "Measurement", "Work", "Others", "Qty Required", "Already Processed", "Process Qty", "Select"].map((header) => (
                                                <th key={header} className="border border-gray-300 p-3 text-center">{header}</th>
                                            ))}
                                        </tr>
                                    </thead>



                                    <tbody>
                                        {Object.entries(orderItem).map(([key, value], index) => {
                                            {/* console.log(selectedSO); */ }
                                            const requiredQty = Number(selectedSO.qty || 0);
                                            const alreadyProcessed = allreadyProcessedOrderItems[key] || 0;
                                            const selected = selectedStitchRows.find(row => row.key === key);
                                            const processQty = selected?.processQty || 0;

                                            const maxQty = requiredQty - alreadyProcessed;
                                            const isDisabled = requiredQty <= alreadyProcessed;

                                            return (
                                                <tr key={index} className="even:bg-gray-100 hover:bg-gray-50 transition">
                                                    <td className="border border-gray-300 p-3 text-center">{key}</td>
                                                    <td className="border border-gray-300 p-3 text-center">{value.colour}</td>
                                                    <td className="border border-gray-300 p-3 text-center">{value.khaka}</td>
                                                    <td className="border border-gray-300 p-3 text-center">{value.measurement}</td>
                                                    <td className="border border-gray-300 p-3 text-center">{value.work}</td>
                                                    <td className="border border-gray-300 p-3 text-center">{value.others}</td>
                                                    <td className="border border-gray-300 p-3 text-center">{requiredQty}</td>
                                                    <td className="border border-gray-300 p-3 text-center">{alreadyProcessed}</td>

                                                    <td className="border border-gray-300 p-3 text-center">
                                                        <input
                                                            type="number"
                                                            className="w-20 border rounded px-2 py-1"
                                                            min={0}
                                                            max={maxQty}
                                                            value={processQty}
                                                            disabled={!selected || isDisabled}
                                                            onInput={(e) => {
                                                                let value = Number(e.target.value);
                                                                if (value > maxQty) value = maxQty;
                                                                handleProcessQtyChange(key, value);
                                                            }}
                                                        />
                                                    </td>

                                                    <td className="border border-gray-300 p-3 text-center">
                                                        <input
                                                            type="checkbox"
                                                            checked={!!selected}
                                                            onChange={() => handleCheckboxChange(key, value)}
                                                            disabled={isDisabled}
                                                        />
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>




                                </table>
                            </div>
                        </div>
                    )}
                    {soViewModal && bom?.Extra_bom.length > 0 &&
                        <div className="my-8 overflow-x-auto rounded-lg shadow-lg">
                            <h2 className="text-lg font-semibold text-gray-800 mb-3">Semi Finished Goods Details</h2>

                            <table className="min-w-full table-auto overflow-hidden">
                                <thead className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-900">
                                    <tr>
                                        <th className="px-6 py-4 text-left font-semibold">#</th>
                                        <th className="px-6 py-4 text-left font-semibold">Semi-Finished Goods</th>
                                        <th className="px-6 py-4 text-left font-semibold">Color</th>
                                        <th className="px-6 py-4 text-left font-semibold">Stock Reduced</th>
                                        <th className="px-6 py-4 text-left font-semibold">Status</th>
                                        <th className="px-6 py-4 text-left font-semibold">Processes</th>
                                        <th className="px-6 py-4 text-left font-semibold">Quantity</th>
                                        <th className="px-6 py-4 text-left font-semibold">Already Processed Qty</th>
                                        <th className="px-6 py-4 text-left font-semibold">Process Qty</th>
                                        <th className="px-6 py-4 text-left font-semibold">Select</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {bom?.Extra_bom?.map((item, index) => {
                                        // Disable checkbox based on stock_status and bom_status
                                        const isButtonDisabled = (item?.bom_status === "completed")

                                        const maxQty = item?.qty - (allreadyProcessedQtyOfBOM[item?.id] || 0);


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
                                                    {item?.stock_status === true ? "Yes" : "No"}
                                                </td>
                                                <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                                                    {item?.bom_status}
                                                </td>

                                                <tr key={`${item.id}-process`} className="bg-gray-50">
                                                    <td colSpan={6} className="px-6 py-4 text-gray-600 whitespace-nowrap">
                                                        {item?.processes?.length > 0 ? (
                                                            <div className="flex flex-col gap-1 items-center">

                                                                {item?.processes?.map((process, index) => (
                                                                    <div>
                                                                        {process?.process} - Done by - <span className="font-semibold text-green-700">{process?.jobber?.jobber_name}</span>
                                                                    </div>
                                                                ))}

                                                            </div>
                                                        ) : (
                                                            <span className="text-gray-500 italic">No Process Yet</span>
                                                        )}
                                                    </td>
                                                </tr>
                                                <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                                                    {item?.qty}
                                                </td>
                                                <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                                                    <input
                                                        type="number"
                                                        className="w-20 border rounded px-2 py-1"
                                                        min={0}
                                                        max={maxQty}
                                                        value={allreadyProcessedQtyOfBOM[item.id] || 0}
                                                        disabled
                                                        onChange={(e) => {
                                                            let value = Number(e.target.value);
                                                            if (value > maxQty) value = maxQty;


                                                        }}
                                                    />
                                                </td>
                                                {/* <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                                                        <input
                                                            type="number"
                                                            className="w-20 border rounded px-2 py-1"
                                                            min={0}
                                                            max={maxQty}
                                                            value={processQuantities[item.id] || ""}
                                                            onChange={(e) => {
                                                                let value = Number(e.target.value);
                                                                if (value > maxQty) value = maxQty;

                                                                setProcessQuantities((prev) => ({
                                                                    ...prev,
                                                                    [item.id]: value
                                                                }));

                                                                // Also update the selected item with new processQty if it's already selected
                                                                setSelectedSalesOrderRows((prevSelected) =>
                                                                    prevSelected.map((row) =>
                                                                        row.id === item.id ? { ...row, processQty: value } : row
                                                                    )
                                                                );
                                                            }}
                                                        />
                                                    </td> */}

                                                <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                                                    <input
                                                        type="number"
                                                        className="w-20 border rounded px-2 py-1"
                                                        min={0}
                                                        max={maxQty}
                                                        value={processQuantities[item.id] || 0}
                                                        onChange={(e) => {
                                                            const value = Math.max(0, Math.min(Number(e.target.value), maxQty));
                                                            if (!isNaN(value)) {
                                                                setProcessQuantities(prev => ({
                                                                    ...prev,
                                                                    [item.id]: value
                                                                }));
                                                                // Update selected row's quantity
                                                                setSelectedSalesOrderRows(prev =>
                                                                    prev.map(row =>
                                                                        row.id === item.id ? { ...row, processQty: value } : row
                                                                    )
                                                                );
                                                            }
                                                        }}
                                                        disabled={!selectedSalesOrderRows.some(row => row.id === item.id) || isButtonDisabled}
                                                    />
                                                </td>


                                                <td className="px-6 py-4">
                                                    {/* Checkbox for row selection */}
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedSalesOrderRows.some((row) => row.id === item.id)}
                                                        disabled={isButtonDisabled}
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                setSelectedSalesOrderRows((prev) => [
                                                                    ...prev,
                                                                    { ...item, processQty: processQuantities[item.id] || 0 }
                                                                ]);
                                                            } else {
                                                                setSelectedSalesOrderRows((prev) =>
                                                                    prev.filter((row) => row.id !== item.id)
                                                                );
                                                            }
                                                        }}
                                                    />
                                                </td>

                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    }

                    <div className="border flex justify-center border-blue-500 rounded-lg py-2  gap-2">
                        <p className="text-gray-700 font-medium">Add Measurements:</p>
                        <button type="button"
                            onClick={() => setMeasurementModal(true)}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                        >Add Measurements</button>
                    </div>

                    {
                        measurementModal && (
                            <MeasurementModal
                                setMeasurementModal={setMeasurementModal}
                                lhSh={lhSh}
                                setLhSh={setLhSh}
                                bpGrownKurti={bpGrownKurti}
                                setBpGrownKurti={setBpGrownKurti}
                                setShowMeasurement={setShowMeasurement}
                            />
                        )
                    }

                    {showMeasurement && (
                        <div className="mt-6 border border-gray-300 rounded-lg p-5 shadow-sm bg-blue-50">
                            <h2 className="text-xl font-semibold mb-4 text-blue-900 border-b pb-2">📏 Measurement Details</h2>

                            {/* Lehenga / Sharara Measurements */}
                            <div className="mb-6">
                                <h3 className="text-lg font-medium text-blue-600 mb-2">Lehenga / Sharara</h3>
                                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                    {Object.entries(lhSh).map(([key, val]) => (
                                        <div key={key} className="text-sm text-gray-800">
                                            <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span> {val}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* BP / Grown / Kurti Measurements */}
                            <div>
                                <h3 className="text-lg font-medium text-green-600 mb-2">BP / Grown / Kurti</h3>
                                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                    {Object.entries(bpGrownKurti).map(([key, val]) => (
                                        <div key={key} className="text-sm text-gray-800">
                                            <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span> {val}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}



                    <div className="grid grid-cols-2 gap-4 mt-4">

                        <FormInput type={"input"} placeholder={"Sales Order Id"} label={"Sales Order Id"} name="so_id" value={formData.so_id} />
                        <FormInput type={"input"} placeholder={"Design Group"} label={"Design Group"} name="design_group" value={formData.design_group} />
                        <FormInput type={"input"} placeholder={"Design Name"} label={"Design Name"} name="design_number" value={formData.design_number} />
                        {/* Date */}
                        <FormInput type={"date"} placeholder={"Date"} label={"Date"} name="date" value={formData.date} onChange={formDataChangeHandler} />
                        <FormInput
                            type={"date"}
                            placeholder={"Due Date"}
                            label={"Due Date"}
                            name="due_date"
                            value={formData.due_date}
                            onChange={formDataChangeHandler}
                        />
                        {/* Choose Stittcher */}
                        <div className="flex flex-col">
                            <FormLabel title={"Select Stitcher"} />
                            <select className="border border-gray-300 bg-gray-100 rounded-md p-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500" name="selected_stiitcher" value={formData.selected_stiitcher} onChange={formDataChangeHandler}>
                                <option value="" disabled selected>
                                    Choose Stitcher
                                </option>
                                {stitcherDetail.map((stitcher) => (
                                    <option key={stitcher.id} value={stitcher.id}>
                                        {`${stitcher.id} - ${stitcher.stitcher_name}`}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Processor */}
                        <div className="flex flex-col">
                            <label className="text-gray-700 font-semibold">Processor  <span className=' text-red-600 '>*</span></label>
                            <select className="border border-gray-300 bg-gray-100 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                name="processor"
                                value={formData.processor}
                                onChange={formDataChangeHandler}
                                disabled
                            >
                                <option value="" className="text-gray-400">Select Processor</option>
                                {
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
                            <FormLabel title={"Stitch Order Remarks"} />
                            <textarea
                                className="border border-gray-300 bg-gray-100 rounded-md p-2 h-40 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                                placeholder="Stitch Order Remarks..."
                                name="remarks"
                                value={formData.remarks}
                                onChange={formDataChangeHandler}
                            ></textarea>
                        </div>
                    </div>

                    <div className="my-2">
                        {/* <div className="border flex justify-center border-gray-200 rounded-xl p-4">
                                <button type="button"
                                    onClick={() => setMeasurementModal(true)}
                                    className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-700 transition"
                                >Add Measurements</button>
                            </div> */}
                        {/* button */}
                        <div className="col-span-2 flex justify-end mt-4">
                            <button
                                type="button"
                                onClick={cancelHandler}
                                className="bg-gray-200 px-4 py-1 rounded hover:bg-gray-600 hover:text-white transition"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className={`p-3 ml-4 bg-blue-900 rounded-md text-white transition-all duration-100 ease-in-out ${submitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700 hover:scale-105'
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
                        </div>

                    </div>

                </form>
            </div>
        </div>
    )
};

export default StitchingEntry;