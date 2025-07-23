import { useEffect, useState } from "react";
import FormLabel from "../purchase/FormLabel";
import FormInput from "../utility/FormInput";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { BounceLoader, PuffLoader } from "react-spinners";
import SmartTable2 from "../../smartTable/SmartTable2";
import { toast } from "react-toastify";
import { MdCancel } from "react-icons/md";


const SelectSOTable = ({
    NoOfColumns,
    data,
    headers,
    setSelectedRow,
    selectedRow,
    setDisplayModal,
    setFormData,
    setLoading,
    setSelectedEntry,
    setStitcherDetail,
    setAllReceivedItem
}) => {
    const { token } = useSelector((state) => state.auth);
    const [updatedData, setUpdatedData] = useState([]);
    const navigate = useNavigate();
    const [updatedHeader] = useState(["select", ...headers]);


    const handleClick = async (id, so_id) => {
        try {
            setLoading(true);

            const headers = { Authorization: `Bearer ${token}` };

            // Trigger all API calls in parallel
            const [res, summaryRes, getAllReceivedItem] = await Promise.all([
                axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/stitching-entries/details/${id}`, { headers }),
                axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/stitching-receive-entry/receive-summary/${id}`, { headers }),
                axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/stitching-receive-entries/summary/by-so-id/${so_id}`, { headers }),
            ]);

            const stitchingData = res?.data?.data;
            console.log("stitchingData:", stitchingData)
            const summaryData = summaryRes?.data?.group_summary || {};

            // Merge receive summary into order_Items
            const enrichedItems = stitchingData?.order_Items?.map((item) => ({
                ...item,
                already_received: summaryData[item.group] || 0,
            }));

            const enrichedStitchingData = {
                ...stitchingData,
                order_Items: enrichedItems,
            };

            // Set in state
            setSelectedEntry(enrichedStitchingData);
            console.log("Selected Entry: ", enrichedStitchingData);


            setFormData(pre => ({
                ...pre,
                stitchingEntryId: stitchingData?.id,
                so_id: stitchingData?.so_id,
                design_group: stitchingData?.design_group,
                design_number: stitchingData?.design_number,
                entry_created_date: stitchingData?.date,
                due_date: stitchingData?.due_date,
                selected_stiitcher: stitchingData?.stitcher.id,
                processor: stitchingData?.processor.id
            }));
            setAllReceivedItem(getAllReceivedItem?.data);

        } catch (error) {
            console.error("Failed to fetch entry or summary:", error);
        } finally {
            setLoading(false);
            setDisplayModal(false);
        }
    };

    const updateTableData = () => {
        const updatedValues = data.map((item) => ({
            select: (
                <input
                    type="checkbox"
                    onChange={() => handleClick(item.stitchingEntryId, item.so_id)}
                    key={item.stitchingEntryId}
                />
            ),
            ...item,
        }));

        setSelectedRow(selectedRow ? [selectedRow] : []);
        setUpdatedData(
            updatedValues.map((item) =>
                Object.fromEntries(Object.entries(item).slice(0, NoOfColumns + 1))
            )
        );
    };

    useEffect(() => {
        updateTableData();
    }, [data]);

    return <SmartTable2 data={updatedData} headers={updatedHeader} />;
};




const StitchingReceive = () => {
    const headersForTable = [
        "Stitching Entry Id",
        "SO ID",
        "Design Group",
        "Design Number",
        "Processor",
        "Stitcher Name",
        "Date",
        "Due Date",
        "Remarks",
    ];

    const [displayModal, setDisplayModal] = useState(false);
    const [selectedRow, setSelectedRow] = useState([]);

    const [formData, setFormData] = useState({
        stitchingEntryId: "",
        so_id: "",
        design_group: "",
        design_number: "",
        entry_created_date: "",
        due_date: "",
        receiving_date: "",
        selected_stiitcher: "",
        processor: "",
        remarks: ""
    })

    const { token, designation, id } = useSelector(state => state.auth);
    const { load, error, availableProcessor } = useSelector((state) => state.fetchData);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [allStitchingEntry, setallStitchingEntry] = useState([]);
    const [selectedEntry, setSelectedEntry] = useState(null);
    const [stitcherDetail, setStitcherDetail] = useState([]);

    const [receivedItems, setReceivedItems] = useState([]);
    const [receivedBom, setReceivedBom] = useState([]);

    const [selectedBomQty, setSelectedBomQty] = useState([]);

    const [color, setColor] = useState([]);
    const [allReceivedItem, setAllReceivedItem] = useState(null);

    const fetchStitchingEntryData = async () => {
        try {
            setLoading(true);

            let url = `${process.env.REACT_APP_BACKEND_URL}/api/stitching-entries?populate=*&filters[stitch_status][$eq]=stitching_process`


            if (designation === "Merchandiser") {
                url += `&filters[$or][0][sales_order_entry][merchandiser][id][$eq]=${id}`;
                url += `&filters[$or][1][internal_sales_order_entry][merchandiser][id][$eq]=${id}`;
            }
            else if (designation !== "Admin") {
                url += `&filters[processor][id][$eq]=${id}`
            }

            url += "&sort=id:desc";

            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const response2 = await axios.get(
                `${process.env.REACT_APP_BACKEND_URL}/api/stitcher-masters?populate=*`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const response3 = await axios.get(
                `${process.env.REACT_APP_BACKEND_URL}/api/colors?populate=*`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const data = Array.isArray(response.data.data) ? response.data.data : [];
            console.log("data: ", data);
            const mappedData = data.map((entry) => {
                return {
                    stitchingEntryId: entry?.id,
                    so_id: entry?.so_id,
                    designGroup: entry?.design_group,
                    designNumber: entry?.design_number,
                    processor: entry?.processor.name,
                    stitcher: entry?.stitcher?.stitcher_name,
                    date: entry?.date,
                    dueDate: entry?.due_date,
                    remarks: entry?.remarks
                };
            });

            setallStitchingEntry(mappedData);
            const stitcher = Array.isArray(response2.data.data)
                ? response2.data.data
                : [];
            setStitcherDetail(stitcher);
            const colorGroup = Array.isArray(response3.data.data)
                ? response3.data.data
                : [];
            setColor(colorGroup);

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
        fetchStitchingEntryData();
    }, [token]);

    console.log("selectedEntry zzz: ", selectedEntry)

    const handleCheckboxChange = (entry, index) => {
        setReceivedItems((prevItems) => {
            const exists = prevItems.find((item) => item.index === index);

            if (exists) {
                // Remove item when unchecked
                return prevItems.filter((item) => item.index !== index);
            } else {
                // Add item with default values when checked
                return [
                    ...prevItems,
                    {
                        index,
                        qty_required: entry.process_qty,
                        already_received: entry.already_received,
                        receive_qty: 0,
                        entryData: entry,
                    },
                ];
            }
        });
    };

    // Replace your existing handleCheckBoxChangeOfBom and handleBomQtyChange with these:

    // const handleBomCheckboxChange = (bomItem, index) => {
    //     setReceivedBom(prev => {
    //         const exists = prev.find(item => item.bom_id === bomItem.id);

    //         if (exists) {
    //             return prev.filter(item => item.bom_id !== bomItem.id);
    //         } else {
    //             return [
    //                 ...prev,
    //                 {
    //                     bom_id: bomItem.id,
    //                     sfg_id: bomItem.sfg.id,
    //                     color_id: bomItem.color.id,
    //                     max_receivable: bomItem.processed_qty,
    //                     receive_qty: 0,
    //                     index
    //                 }
    //             ];
    //         }
    //     });
    // };

    // const handleBomQtyChange = (bomId, value, maxQty) => {
    //     const qty = Math.min(Math.max(Number(value), 0), maxQty);
    //     setReceivedBom(prev =>
    //         prev.map(item =>
    //             item.bom_id === bomId ? { ...item, receive_qty: qty } : item
    //         )
    //     );
    // };

    const handleQtyChange = (index, value, maxReceiveQty) => {
        const qty = Math.min(Math.max(Number(value), 0), maxReceiveQty); // Clamp the value
        setReceivedItems((prevItems) =>
            prevItems.map((item) =>
                item.index === index ? { ...item, receive_qty: qty } : item
            )
        );
        console.log(receivedItems)
    };



    const formDataChangeHandler = (event) => {

        setFormData((prev) => ({
            ...prev,
            [event.target.name]: event.target.value
        }))
        console.log(formData.date)
    }

    const checkValidation = () => {
        const hasInvalidStitchRow = receivedItems?.some(item => {
            if (item.receive_qty <= 0) {
                toast.warning("Please enter process quantity for order items");
                return true;
            }
            return false;
        });
        if (hasInvalidStitchRow) return false;
        return true
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);


        if (receivedItems.length < 0) {
            toast.error("Please add the Order Receive Items.", { position: "top-right" });
            setSubmitting(false)
            return;
        }

        if (formData.receiving_date === "") {
            toast.warning("Please select the Receiving Date.", { position: "top-right" });
            setSubmitting(false)
            return;
        }

        if (checkValidation() === false) {
            setSubmitting(false)
            return;
        }


        const getStitchingStatus = () => {
            if (!selectedEntry || !selectedEntry.order_Items) return "partially_completed";

            const allItems = selectedEntry.order_Items;

            const isAllDone = allItems.every(entry => {
                const receivedMatch = receivedItems.find(
                    item => item.entryData?.group === entry.group
                );

                if (receivedMatch) {
                    return (
                        Number(entry.process_qty) ===
                        Number(entry.already_received) + Number(receivedMatch.receive_qty)
                    );
                } else {
                    return (
                        Number(entry.process_qty) === Number(entry.already_received)
                    );
                }
            });

            return isAllDone ? "completed" : "partially_completed";
        };

        //     const getStitchingStatus = () => {
        // if (!selectedEntry) return "partially_completed";

        // // Check regular stitching items
        // const allStitchingItemsDone = selectedEntry.order_Items 
        //     ? selectedEntry.order_Items.every(entry => {
        //         const receivedMatch = receivedItems.find(
        //             item => item.entryData?.group === entry.group
        //         );

        //         if (receivedMatch) {
        //             return (
        //                 Number(entry.process_qty) ===
        //                 Number(entry.already_received) + Number(receivedMatch.receive_qty)
        //             );
        //         } else {
        //             return (
        //                 Number(entry.process_qty) === Number(entry.already_received)
        //             );
        //         }
        //     })
        //     : true; // If no order items, consider them "done"

        // // Check BOM items
        // const allBomItemsDone = selectedEntry.bom 
        //     ? selectedEntry.bom.every(bomItem => {
        //         const receivedMatch = receivedBom.find(
        //             item => item.bom_id === bomItem.id
        //         );

        //         if (receivedMatch) {
        //             return (
        //                 Number(bomItem.processed_qty) ===
        //                 Number(receivedMatch.receive_qty)
        //             );
        //         } else {
        //             // If not in receivedBom, consider it not received (0)
        //             return Number(bomItem.processed_qty) === 0;
        //         }
        //     })
        //     : true; // If no BOM items, consider them "done"

        // console.log("Stitching items done:", allStitchingItemsDone);
        // console.log("BOM items done:", allBomItemsDone);

        // return (allStitchingItemsDone && allBomItemsDone) 
        //     ? "completed" 
        //     : "partially_completed";
        //     };


        console.log("Selected ", selectedEntry);
        const salesOrder = selectedEntry?.sales_order_entry || selectedEntry?.internal_sales_order_entry;

        // STEP 1: itemsNeedToReceive
        const itemsNeedToReceive = Object.entries(salesOrder?.order_items || {}).map(([group, details]) => ({
            ...details,
            group,
            qty: Number(salesOrder?.qty),
        }));
        console.log("itemsNeedToReceive", itemsNeedToReceive);

        const updatedGroupSummary = { ...allReceivedItem.group_summary };


        receivedItems.forEach((item, idx) => {
            const groupKey = item.entryData?.group;
            const receiveQty = Number(item.receive_qty || 0);

            // Force conversion of existing value to number before adding
            const prevQty = Number(updatedGroupSummary[groupKey] || 0);
            updatedGroupSummary[groupKey] = prevQty + receiveQty;

            console.log(`🔹 Item ${idx}: groupKey=${groupKey}, receiveQty=${receiveQty}, prevQty=${prevQty}, newQty=${updatedGroupSummary[groupKey]}`);
        });


        const receivingItemsDetail = {
            so_id: allReceivedItem.so_id,
            group_summary: updatedGroupSummary
        };

        // Final check: all items fully received or not
        const isFullyReceived = itemsNeedToReceive.every(item => {
            const group = item.group;
            const requiredQty = Number(item.qty);
            const receivedQty = Number(updatedGroupSummary[group]);

            if (updatedGroupSummary[group] === undefined) {
                console.log(`roup missing in updated summary: "${group}"`);
                return false;
            }

            if (requiredQty !== receivedQty) {
                console.log(`Qty mismatch for group "${group}" → Expected: ${requiredQty}, Received: ${receivedQty}`);
                return false;
            }

            console.log(`Group "${group}" is fully received with qty: ${receivedQty}`);
            return true;
        });

        console.log("Stitching Is Fully Received?", isFullyReceived);


        const postData = {
            data: {
                stitchingEntry: formData?.stitchingEntryId,
                so_id: formData?.so_id,
                design_group: formData?.design_group,
                design_number: formData?.design_number,
                entry_process_date: formData?.entry_created_date,
                due_date: formData?.due_date,
                reveive_date: formData?.receiving_date,
                stitcher: formData?.selected_stiitcher,
                processor: formData.processor,
                remarks: formData.remarks,
                stitching_receiving_status: getStitchingStatus(),
                receive_orderItem: receivedItems.map((row) => ({
                    group: row.entryData?.group,
                    color: row.entryData?.color,
                    Khaka: row.entryData?.Khaka,
                    measurement: row.entryData?.measurement,
                    work: row.entryData?.work,
                    others: row.entryData?.others,
                    qty_reveive_required: row.qty_required,
                    already_received: row.already_received,
                    receive_qty: row.receive_qty
                })),
                bom: selectedEntry?.bom?.map((row) => ({
                    bom_id: String(row?.bom_id),
                    semi_finished_goods_master: row?.sfg?.id,
                    color: row?.color?.id,
                    processed_qty: row?.processed_qty,

                })),
                measurement: selectedEntry.measurement
            },
        };

        console.log("PostData: ", postData)
        let res;
        try {
            // Submit main bill-of-purchase data
            res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/stitching-receive-entries`, postData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log("Res", res)
            toast.success("Stitching item received successfully", { position: "top-right" });

            if (getStitchingStatus() === "completed") {
                await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/stitching-entries/${formData.stitchingEntryId}/update-status/completed`, postData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                toast.success(`Stitching Entry of ${formData.stitchingEntryId} id fully received.`, { position: "top-right" });
            }

            if (isFullyReceived) {
                const orderType = selectedEntry?.sales_order_entry === null ? "internal-sales-order-entry" : "sales-order-entry";

                console.log("orderType: ", orderType)
                await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/${orderType}/update-status/${selectedEntry.so_id}/readyToDispatch`, postData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                // await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/stitching-so/update-status/${selectedEntry.so_id}/completed`, postData, {
                //     headers: {
                //         Authorization: `Bearer ${token}`,
                //     },
                // });

                toast.success("Sales Order status change to Ready to Dispatch.", { position: "top-right" });
            }

            setSelectedEntry(null);
            setDisplayModal(false);
            setallStitchingEntry([]);
            setStitcherDetail([]);
            setReceivedItems([]);
            setAllReceivedItem(null);
            setFormData({
                stitchingEntryId: "",
                so_id: "",
                design_group: "",
                design_number: "",
                entry_created_date: "",
                due_date: "",
                receiving_date: "",
                selected_stiitcher: "",
                processor: "",
                remarks: ""
            });
            navigate(`/stitching-receive-entry/${res?.data?.data?.id}`);
            console.log("Data submitted successfully!", postData);
            fetchStitchingEntryData();
        } catch (error) {
            console.error("Error posting bill of sales:", error);
            toast.error(error?.response?.data?.error?.message || "Something went wrong!");
        } finally {
            setSubmitting(false);
        }
    };

    const clearHandler = () => {
        setSelectedEntry(null);
        setDisplayModal(false);
        setallStitchingEntry([]);
        setStitcherDetail([]);
        setReceivedItems([]);
        setAllReceivedItem(null);
        setFormData({
            stitchingEntryId: "",
            so_id: "",
            design_group: "",
            design_number: "",
            entry_created_date: "",
            due_date: "",
            receiving_date: "",
            selected_stiitcher: "",
            processor: "",
            remarks: ""
        });
    }

    // console.log("allStitchingEntry: ", allStitchingEntry)
    // console.log("selectedEntry: ", selectedEntry)
    // console.log("receivedItems: ", receivedItems)
    // console.log("allReceivedItem: ", allReceivedItem)
    // console.log("formData: ", formData)

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <BounceLoader color="#1e3a8a" />
            </div>
        )
    }

    return (
        <div className="p-6 bg-white rounded-lg relative">

            <div>
                <h1 className="text-2xl font-bold text-blue-900 mb-4 pb-2 border-b">
                    Stitching Receive Entry
                </h1>



                {/* Stitching Entry */}
                {/* Form */}
                <form className=" " onSubmit={handleSubmit}>
                    <div className="col-span-2 flex border border-blue-700 justify-center my-2 mb-3 rounded p-2">
                        <div className=" flex items-center gap-2">
                            <p className="text-gray-600 ">Choose Stitching Entry:</p>
                            <button
                                type="button"
                                className="bg-blue-900 text-white px-4 py-1 rounded hover:bg-blue-700 transition-all duration-200"
                                onClick={() => {
                                    setDisplayModal(!displayModal);
                                }}
                            >
                                Choose Stitching Entry
                            </button>
                        </div>
                    </div>

                    {/* Modal */}
                    {displayModal && (
                        <div className="fixed inset-0 bg-gray-900 backdrop-blur-md bg-opacity-80 flex justify-center items-center z-50">
                            <div className="relative w-[90vw] bg-gray-200 border shadow-2xl p-4 rounded-lg">

                                <div className="flex justify-between items-center mb-2 border-b border-b-gray-300">
                                    <h3 className="text-xl text-blue-900 font-bold">Choose Stitching Entry</h3>

                                    <p
                                        className="text-xl px-2 border text-red-600 rounded-full hover:text-red-500 cursor-pointer transition-all ease-in-out duration-200 pr-5"
                                        onClick={() => {
                                            setDisplayModal(false);
                                        }}
                                    >
                                        <MdCancel className="w-8 h-8" />
                                    </p>
                                </div>
                                <div className="">
                                    <SelectSOTable
                                        NoOfColumns={headersForTable.length}
                                        data={allStitchingEntry}
                                        headers={headersForTable}
                                        setSelectedRow={setSelectedRow}
                                        selectedRow={selectedRow}
                                        setDisplayModal={setDisplayModal}
                                        setFormData={setFormData}
                                        setLoading={setLoading}
                                        setSelectedEntry={setSelectedEntry}
                                        setStitcherDetail={setStitcherDetail}
                                        setAllReceivedItem={setAllReceivedItem}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {selectedEntry !== null && selectedEntry?.order_Items?.length > 0 && (
                        <div className="col-span-2">
                            <h2 className="text-lg font-semibold text-gray-800 mb-3">Stitching Entry Details</h2>
                            <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
                                <table className="w-full border-collapse border border-gray-300 rounded-lg">
                                    <thead className="bg-gray-200 text-gray-700 text-sm uppercase">
                                        <tr>
                                            {["Group", "Colour", "Design/Khaka", "Measurement", "Work", "Others", "Qty Required", "Already Received", "Receive Qty", "Select"].map((header) => (
                                                <th key={header} className="border border-gray-300 p-3 text-center">{header}</th>
                                            ))}
                                        </tr>
                                    </thead>


                                    <tbody>
                                        {selectedEntry?.order_Items?.map((entry, index) => {
                                            const alreadyProcessed = entry.already_received || 0;
                                            const maxReceiveQty = entry.process_qty - alreadyProcessed;

                                            const isChecked = receivedItems.some(
                                                (item) => item.index === index
                                            );
                                            const currentQty =
                                                receivedItems.find((item) => item.index === index)
                                                    ?.receive_qty || 0;

                                            return (
                                                <tr key={index} className="even:bg-gray-100 hover:bg-gray-50 transition">
                                                    <td className="border border-gray-300 p-3 text-center">{entry.group}</td>
                                                    <td className="border border-gray-300 p-3 text-center">{entry.color}</td>
                                                    <td className="border border-gray-300 p-3 text-center">{entry.Khaka}</td>
                                                    <td className="border border-gray-300 p-3 text-center">{entry.measurement}</td>
                                                    <td className="border border-gray-300 p-3 text-center">{entry.work}</td>
                                                    <td className="border border-gray-300 p-3 text-center">{entry.others}</td>
                                                    <td className="border border-gray-300 p-3 text-center">{entry.process_qty
                                                    }</td>
                                                    <td className="border border-gray-300 p-3 text-center">{alreadyProcessed}</td>

                                                    <td className="border border-gray-300 p-3 text-center">
                                                        <input
                                                            type="number"
                                                            className="w-20 border rounded px-2 py-1"
                                                            min={0}
                                                            max={maxReceiveQty}
                                                            value={currentQty}
                                                            disabled={!isChecked}
                                                            onChange={(e) =>
                                                                handleQtyChange(index, e.target.value, maxReceiveQty)
                                                            }
                                                        />
                                                    </td>

                                                    <td className="border border-gray-300 p-3 text-center">
                                                        <input
                                                            type="checkbox"
                                                            checked={isChecked}
                                                            onChange={() => handleCheckboxChange(entry, index)}
                                                            disabled={entry.process_qty === alreadyProcessed}
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

                    {selectedEntry?.measurement?.lehenga_sharara && selectedEntry?.measurement?.bp_grown_kurti && (<div className="mt-6 border border-gray-300 rounded-lg p-5 shadow-sm bg-gray-50">
                        <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">📏 Measurement Details</h2>

                        {/* Lehenga / Sharara Measurements */}
                        <div className="mb-6">
                            <h3 className="text-lg font-medium text-blue-600 mb-2">Lehenga / Sharara</h3>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                {Object.entries(selectedEntry?.measurement?.lehenga_sharara).map(([key, val]) => (
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
                                {Object.entries(selectedEntry?.measurement?.bp_grown_kurti).map(([key, val]) => (
                                    <div key={key} className="text-sm text-gray-800">
                                        <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span> {val}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>)}

                    {selectedEntry?.bom?.length > 0 && (
                        <div className="my-8 overflow-x-auto rounded-lg shadow-lg">
                            <h2 className="text-lg font-semibold text-gray-800 mb-3">Semi Finished Goods Details</h2>
                            <table className="min-w-full table-auto overflow-hidden">
                                <thead className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-900">
                                    <tr>
                                        <th className="px-6 py-4 text-left font-semibold">#</th>
                                        <th className="px-6 py-4 text-left font-semibold">Semi-Finished Goods</th>
                                        <th className="px-6 py-4 text-left font-semibold">Color</th>
                                        <th className="px-6 py-4 text-left font-semibold">Processed Qty</th>
                                        {/* <th className="px-6 py-4 text-left font-semibold">Receive Qty</th>
                                            <th className="px-6 py-4 text-left font-semibold">Select</th> */}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {selectedEntry?.bom?.map((item, index) => {
                                        const isSelected = receivedBom.some(bom => bom.bom_id === item.id);
                                        const currentQty = isSelected
                                            ? receivedBom.find(bom => bom.bom_id === item.id)?.receive_qty || 0
                                            : 0;
                                        const maxQty = item.processed_qty;
                                        const isDisabled = ["sendToJobber", "readyForStitching", "SendToStitcher", "completed"].includes(item?.bom_status);

                                        return (
                                            <tr key={item.id} className="hover:bg-blue-50 transition">
                                                <td className="px-6 py-4 text-gray-700">{index + 1}</td>
                                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                                    {item?.sfg?.semi_finished_goods_name}
                                                </td>
                                                <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                                                    {item?.color?.color_name}
                                                </td>
                                                <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                                                    {item.processed_qty}
                                                </td>
                                                {/* <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                                                        <input
                                                            type="number"
                                                            className="w-20 border rounded px-2 py-1"
                                                            min={0}
                                                            max={maxQty}
                                                            value={currentQty}
                                                            disabled={!isSelected || isDisabled}
                                                            onChange={(e) => handleBomQtyChange(item.id, e.target.value, maxQty)}
                                                        />
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <input
                                                            type="checkbox"
                                                            checked={isSelected}
                                                            disabled={isDisabled}
                                                            onChange={() => handleBomCheckboxChange(item, index)}
                                                        />
                                                    </td> */}
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                    <div className="grid grid-cols-2 gap-6 ">


                        <FormInput type={"input"} placeholder={"Stitching Entry Id"} label={"Stitching Entry Id"} name="stitchingEntryId" value={formData.stitchingEntryId} readOnly />
                        <FormInput type={"input"} placeholder={"Sales Order Id"} label={"Sales Order Id"} name="so_id" value={formData.so_id} readOnly />
                        <FormInput type={"input"} placeholder={"Design Group"} label={"Design Group"} name="design_group" value={formData.design_group} readOnly />
                        <FormInput type={"input"} placeholder={"Design Name"} label={"Design Name"} name="design_number"
                            value={formData.design_number} readOnly
                        />
                        {/* Date */}
                        <FormInput type={"date"} placeholder={"Entry Created Date"} label={"Entry Created Date"} name="entry_created_date"
                            value={formData.entry_created_date} onChange={formDataChangeHandler} disabled
                        />
                        <FormInput
                            type={"date"}
                            placeholder={"Due Date"}
                            label={"Due Date"}
                            name="due_date"
                            value={formData.due_date}
                            onChange={formDataChangeHandler}
                            disabled
                        />


                        {/* Choose Stittcher */}
                        <div className="flex flex-col">
                            <FormLabel title={"Select Stitcher"} />
                            <select className="border border-gray-300 bg-gray-100 rounded-md p-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500" name="selected_stiitcher"
                                value={formData.selected_stiitcher} onChange={formDataChangeHandler} disabled
                            >
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
                                    availableProcessor && Array.isArray(availableProcessor) && availableProcessor.map((processor, index) => {
                                        return (
                                            <option key={processor.id} value={processor.id}>
                                                {processor.name}-{processor.designation}
                                            </option>
                                        )
                                    })
                                }
                            </select>
                        </div>

                        <FormInput
                            type={"date"}
                            placeholder={"Receive Date"}
                            label={"Receive Date"}
                            name="receiving_date"
                            value={formData.receiving_date}
                            onChange={formDataChangeHandler}
                        />

                        <div className="flex flex-col">
                            <FormLabel title={"Stitching Receive Remarks"} />
                            <textarea
                                className="border border-gray-300 bg-gray-100 rounded-md p-2 h-40 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                                placeholder="Stitching Receive Remarks..."
                                name="remarks"
                                value={formData.remarks}
                                onChange={formDataChangeHandler}
                            ></textarea>
                        </div>
                        {/* button */}
                        <div className="col-span-2 flex justify-end mt-4">
                            <button
                                type="button"
                                onClick={clearHandler}
                                className="bg-gray-200 px-4 py-1 rounded hover:bg-gray-600 hover:text-white transition"
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
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
};


export default StitchingReceive;