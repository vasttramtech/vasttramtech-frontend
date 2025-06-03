import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { BounceLoader, PuffLoader } from "react-spinners";
import SmartTable2 from "../../smartTable/SmartTable2";
import { toast } from "react-toastify";

// const SelectSOTable = ({ NoOfColumns, data, headers, selectedSFG, setSelectedSFG, onAdd }) => {
//     const [updatedHeader] = useState(["Select", ...headers,"Processes", "Add Qty"]);
//     const [tableData, setTableData] = useState([]);

//     useEffect(() => {
//         if (Array.isArray(data)) {
//             const updatedValues = data.map((item) => ({
//                 Select: (
//                     <input
//                         type="radio"
//                         name="sfg-select"
//                         checked={selectedSFG?.id === item.id}
//                         onChange={() => setSelectedSFG({ ...item, addQty: 0 })}
//                         key={item.id}
//                     />
//                 ),
//                 ...item,
//                 Processes: (
//                     item.processes?.length > 0 ? (
//                         <select
//                             className="border rounded px-2 py-1 w-full"
//                             defaultValue="placeholder"
//                         >
//                             <option value="placeholder" disabled>
//                                 Select Process
//                             </option>
//                             {item.processes.map((process, index) => (
//                                 <option key={index} value={process}>
//                                     {process}
//                                 </option>
//                             ))}
//                         </select>
//                     ) : (
//                         <span className="text-gray-500 italic">No Process</span>
//                     )
//                 ),
//                 "Add Qty": (
//                     <input
//                         type="number"
//                         value={selectedSFG?.id === item.id ? selectedSFG.addQty || "" : ""}
//                         onChange={(e) => {
//                             const enteredQty = parseInt(e.target.value) || 0;
//                             if (enteredQty <= item.AvailableStock) {
//                                 setSelectedSFG({ ...item, addQty: enteredQty });
//                             }
//                         }}
//                         min="0"
//                         max={item.AvailableStock}
//                         disabled={selectedSFG?.id !== item.id}
//                         className="border rounded px-2 py-1 w-full"
//                     />
//                 ),
//             }));
//             setTableData(updatedValues);
//         }
//     }, [data, selectedSFG]);

//     return (
//         <div>
//             <SmartTable2 data={tableData} headers={updatedHeader} />
//             <div className="mt-4 text-center">
//                 <button
//                     onClick={onAdd}
//                     className="px-6 py-2 bg-blue-600 text-white rounded-full"
//                 >
//                     Add
//                 </button>
//             </div>
//         </div>
//     );
// };

// const SelectSOTable = ({ NoOfColumns, data, headers, selectedSFG, setSelectedSFG, onAdd }) => {
//     // Remove "Processes" from headers
//     const [updatedHeader] = useState(["Select", ...headers.filter(header => header !== "Processes"), "Processes", "Add Qty"]);
//     const [tableData, setTableData] = useState([]);

//     useEffect(() => {
//         if (Array.isArray(data)) {
//             const updatedValues = data.map((item) => {
//                 // Create a copy without the "processes" field
//                 const { processes, ...itemWithoutProcesses } = item;

//                 return {
//                     Select: (
//                         <input
//                             type="radio"
//                             name="sfg-select"
//                             checked={selectedSFG?.id === item.id}
//                             onChange={() => setSelectedSFG({ ...item, addQty: 0 })}
//                             key={item.id}
//                         />
//                     ),
//                     ...itemWithoutProcesses,
//                     Processes: (
//                         processes?.length > 0 ? (
//                             <select
//                                 className="border rounded px-2 py-1 w-full"
//                                 defaultValue="placeholder"
//                             >
//                                 <option value="placeholder" disabled>
//                                     Process Done
//                                 </option>
//                                 {processes.map((process, index) => (
//                                     <option key={index} value={process} disabled>
//                                         {process}
//                                     </option>
//                                 ))}
//                             </select>
//                         ) : (
//                             <span className="text-gray-500 italic">No Process</span>
//                         )
//                     ),
//                     "Add Qty": (
//                         <input
//                             type="number"
//                             value={selectedSFG?.id === item.id ? selectedSFG.addQty || "" : ""}
//                             onChange={(e) => {
//                                 const enteredQty = parseInt(e.target.value) || 0;
//                                 if (enteredQty <= item.AvailableStock) {
//                                     setSelectedSFG({ ...item, addQty: enteredQty });
//                                 }
//                             }}
//                             min="0"
//                             max={item.AvailableStock}
//                             disabled={selectedSFG?.id !== item.id}
//                             className="border rounded px-2 py-1 w-full"
//                         />
//                     ),
//                 };
//             });

//             setTableData(updatedValues);
//         }
//     }, [data, selectedSFG]);

//     return (
//         <div>
//             <SmartTable2 data={tableData} headers={updatedHeader} />
//             <div className="mt-4 text-center">
//                 <button
//                     onClick={onAdd}
//                     className="px-6 py-2 bg-blue-600 text-white rounded-full"
//                 >
//                     Add
//                 </button>
//             </div>
//         </div>
//     );


// };

const SelectSOTable = ({ NoOfColumns, data, headers, selectedSFG, setSelectedSFG, onAdd }) => {
    const [updatedHeader] = useState(["Select", ...headers.filter(header => header !== "Processes"), "Processes", "Add Qty"]);
    const [tableData, setTableData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        if (Array.isArray(data)) {
            const filteredData = data.filter((item) =>
                Object.values(item)
                    .filter(val => typeof val === "string" || typeof val === "number")
                    .some(val =>
                        val.toString().toLowerCase().includes(searchTerm.toLowerCase())
                    )
            );

            const updatedValues = filteredData.map((item) => {
                const { processes, ...itemWithoutProcesses } = item;

                return {
                    Select: (
                        <input
                            type="radio"
                            name="sfg-select"
                            checked={selectedSFG?.id === item.id}
                            onChange={() => setSelectedSFG({ ...item, addQty: 0 })}
                            key={item.id}
                        />
                    ),
                    ...itemWithoutProcesses,
                    Processes: (
                        processes?.length > 0 ? (
                            <select
                                className="border rounded px-2 py-1 w-full"
                                defaultValue="placeholder"
                            >
                                <option value="placeholder" disabled>
                                    Process Done
                                </option>
                                {processes.map((process, index) => (
                                    <option key={index} value={process} disabled>
                                        {process}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <span className="text-gray-500 italic">No Process</span>
                        )
                    ),
                    "Add Qty": (
                        <input
                            type="number"
                            value={selectedSFG?.id === item.id ? selectedSFG.addQty || "" : ""}
                            onChange={(e) => {
                                const enteredQty = parseInt(e.target.value) || 0;
                                if (enteredQty <= item.AvailableStock) {
                                    setSelectedSFG({ ...item, addQty: enteredQty });
                                }
                            }}
                            min="0"
                            max={item.AvailableStock}
                            disabled={selectedSFG?.id !== item.id}
                            className="border rounded px-2 py-1 w-full"
                        />
                    ),
                };
            });

            setTableData(updatedValues);
        }
    }, [data, selectedSFG, searchTerm]);

    return (
        <div className="p-2 w-full">
            {/* Search & Filter Section */}
            <div className="flex items-center space-x-4 mb-4">
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="px-3 py-2 w-3/12 border border-blue-400 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition">
                    <span>🔍</span>
                </button>
            </div>

            {/* Table Section */}
            <SmartTable2 data={tableData} headers={updatedHeader} />

            <div className="mt-4 text-center">
                <button
                    onClick={onAdd}
                    className="px-6 py-2 bg-blue-600 text-white rounded-full"
                >
                    Add
                </button>
            </div>
        </div>
    );
};

const SelectSOTableJobber = ({ NoOfColumns, data, headers, setSelectJobbers, setDisplayModalJobber, selectJobbers }) => {
    const [updatedHeader] = useState(["Select", ...headers, "Rate", "Note"]);
    const [tableData, setTableData] = useState([]);
    const [selectedJobbers, setSelectedJobbers] = useState([]);

    // Initialize selected jobbers from parent
    useEffect(() => {
        setSelectedJobbers(selectJobbers);
    }, [selectJobbers]);

    useEffect(() => {
        if (Array.isArray(data)) {
            const updatedValues = data.map((item) => {
                const isSelected = selectedJobbers.some(jobber => jobber.jobberId === item.jobberId);
                const selectedJobber = selectedJobbers.find(jobber => jobber.jobberId === item.jobberId) || {};

                return {
                    Select: (
                        <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => {
                                if (e.target.checked) {
                                    setSelectedJobbers(prev => {
                                        const alreadySelected = prev.find(jobber => jobber.jobberId === item.jobberId);
                                        if (!alreadySelected) {
                                            return [...prev, { ...item, rate: selectedJobber.rate || '', note: selectedJobber.note || '' }];
                                        }
                                        return prev;
                                    });
                                } else {
                                    setSelectedJobbers(prev => prev.filter(jobber => jobber.jobberId !== item.jobberId));
                                }
                            }}
                        />
                    ),
                    ...item,
                    Rate: (
                        <input
                            type="number"
                            value={selectedJobber.rate || ''}
                            onChange={(e) => {
                                const rate = e.target.value;
                                setSelectedJobbers(prev => prev.map(jobber =>
                                    jobber.jobberId === item.jobberId ? { ...jobber, rate } : jobber
                                ));
                            }}
                            className="border rounded px-2 py-1 w-full"
                            disabled={!isSelected}
                        />
                    ),
                    Note: (
                        <input
                            type="text"
                            value={selectedJobber.note || ''}
                            onChange={(e) => {
                                const note = e.target.value;
                                setSelectedJobbers(prev => prev.map(jobber =>
                                    jobber.jobberId === item.jobberId ? { ...jobber, note } : jobber
                                ));
                            }}
                            className="border rounded px-2 py-1 w-full"
                            disabled={!isSelected}
                        />
                    ),
                };
            });
            setTableData(updatedValues);
        }
    }, [data, selectedJobbers]);

    const handleAddSelectedJobbers = () => {
        // Check if all selected jobbers have a rate
        const hasMissingRate = selectedJobbers.some(jobber => !jobber.rate || jobber.rate.trim() === "");

        if (hasMissingRate) {
            alert("Please enter the jobber Rate for all selected jobbers.");
            return;
        }

        setSelectJobbers(selectedJobbers);
        setDisplayModalJobber(false);
    };

    return (
        <div>
            <SmartTable2 data={tableData} headers={updatedHeader} />
            <div className="mt-4 text-center">
                <button
                    onClick={handleAddSelectedJobbers}
                    className="px-6 py-2 bg-blue-600 text-white rounded-full"
                >
                    Add Selected Jobbers
                </button>
            </div>
        </div>
    );
};


const ExtraBOMSfg = ({ onClose, availableStockData, so_id, type, setSOViewModal, id, setSalesOrder, setBom, setSelectSOModal, company, setFormData }) => {
    const { token } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [allSFGStock, setAllSFGStock] = useState([]);
    const [allSFGStockData, setAllSFGStockData] = useState([]);
    const [selectedSFG, setSelectedSFG] = useState(null);
    const [finalselectedSFG, setFinalselectedSFG] = useState(null);
    const [displayModalSfg, setDisplayModalSfg] = useState(false);
    const [displayModalJobber, setDisplayModalJobber] = useState(false);
    const [jobber, setJobber] = useState([]);
    const headersForTable = ["id", "Group", "Item Name", "Color", "AvailableStock", "Processes"];
    const headersForTableJobber = ["JobberId", "Jobber Name", "Work Type", "Jobber GSTIN",];
    const [selectJobbers, setSelectJobbers] = useState([]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const headers = {
                Authorization: `Bearer ${token}`,
            };

            const [
                response1,
                response2,
            ] = await Promise.all([
                axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/custom/getAllStockSfg`, { headers }),
                axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/jobber-masters?populate=*`, { headers }),
            ]);

            console.log("response1.data.data: ", response1.data.data)
            console.log("response2.data.data: ", response2.data.data)



            const data = Array.isArray(response1.data.data)
                ? response1.data.data
                : [];
            const formattedData = data.map((item) => ({
                id: item.id,
                Group: item.semi_finished_goods_master?.group?.group_name || "N/A",
                "Item Name": item?.semi_finished_goods_master?.semi_finished_goods_name || "N/A",
                Color: item?.color?.color_name || "N/A",
                AvailableStock: item?.qty,
                processes: item?.processes.map((item) => item?.processes),
            }));


            console.log("formattedData: ", formattedData)
            setAllSFGStock(formattedData);
            setAllSFGStockData(data);
            const jobbers = Array.isArray(response2.data.data)
                ? response2.data.data
                : [];
            const formattedJobberData = jobbers.map((jobber) => ({
                jobberId: jobber?.id,
                JobberName: jobber?.jobber_name,
                workType: jobber?.work_type,
                gstin: jobber?.jobber_gstin
            }));
            setJobber(formattedJobberData);
            setDisplayModalSfg(true);


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
        fetchData();
    }, []);

    useEffect(() => {
        if (selectedSFG && selectedSFG.id) {
            const matchedSFG = allSFGStockData.find(
                (sfg) => sfg.id === selectedSFG.id
            );
            if (matchedSFG) {
                setFinalselectedSFG(matchedSFG);
            }
        }
    }, [selectedSFG, allSFGStockData]);

    // console.log("jobber:", jobber);
    console.log("selectJobber:", selectJobbers);
    console.log("selectedSFG:", selectedSFG);
    console.log("allSFGStockData:", allSFGStockData);
    console.log("finalselectedSFG:", finalselectedSFG);
    console.log("so_id:", so_id);
    console.log("type: ", type);

    const handleAddSelectedSFG = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        if (finalselectedSFG === null) {
            toast.error("Please select the Semi finished goods and enter the qty.");
            setSubmitting(false);
            return
        }
        const api_point = (type === "internal-sales-order-entries") ? "internal-sales-order-entries" : "sales-order-entry";

        const postData = {
            data: {
                extra_bomSfg_fromStock: [
                    {
                        semi_finished_goods: finalselectedSFG.semi_finished_goods_master.id,
                        color: finalselectedSFG.color.id,
                        qty: selectedSFG.addQty,
                        jobber_master_sfg: selectJobbers.length > 0 ? selectJobbers.map((jobber) => ({
                            jobber_master: jobber.jobberId,
                            jobber_rate: jobber.rate,
                            jobber_description: jobber.note,
                            jobber_work_type: jobber.workType,
                            completed: "Incomplete"
                        })) : [],
                        stock_status: true,
                        // bom_status: selectJobbers.length > 0 ? "in_process" : "readyToStitch",
                        bom_status: selectJobbers.length > 0 ? "in_process" : "readyToStitch",
                        processes: selectedSFG.processes.map((process) => ({
                            process: process,
                            jobber: null
                        }))
                    }
                ]
            }
        };

        const data = {
            data: {
                id: finalselectedSFG.id,
                redact_qty: selectedSFG.addQty
            }
        }

        console.log("postData: ", postData)
        try {
            const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/custom/redact-stock-sfg`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/${api_point}/${so_id}/extra-bom-from-stock`, postData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            toast.success("Extra Bom from stock added successfully", { position: "top-right" });

            setTimeout(async () => {
                if (res.status === 200) {
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
                                purchaser_details: company.gst_no
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
                    onClose();
                }
            }, 1000)

        } catch (error) {
            console.error("Error posting bill of sales:", error);
            toast.error(error?.response?.data?.error?.message || "Something went wrong!");
        } finally {
            setSubmitting(false);
        }
        setSubmitting(false);

    }

    return (
        <div>
            {loading ? (
                <div className="absolute inset-0 flex justify-center items-center bg-opacity-70 bg-white z-10 rounded-2xl">
                    <BounceLoader size={80} color="#1e3a8a" loading={loading} />
                </div>
            ) : (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full p-8 relative animate-slide-in">
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition duration-200"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-4">
                            Add SFG from Stock
                        </h2>

                        {/* Table visibility toggling */}
                        {displayModalSfg && (
                            <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-60">
                                <div className="relative w-[90vw] bg-gray-200 border shadow-2xl p-4 rounded-lg">
                                    <button
                                        className="absolute top-2 right-2 text-gray-700 hover:text-red-500 text-2xl font-bold"
                                        onClick={() => setDisplayModalSfg(false)}
                                    >
                                        ✖
                                    </button>

                                    <SelectSOTable
                                        NoOfColumns={headersForTable.length}
                                        data={allSFGStock}
                                        headers={headersForTable}
                                        selectedSFG={selectedSFG}
                                        setSelectedSFG={setSelectedSFG}
                                        onAdd={() => {
                                            if (selectedSFG && selectedSFG.addQty > 0) {
                                                setDisplayModalSfg(false); // Close table when "Add" is clicked
                                            } else {
                                                alert("Please select an SFG and enter a valid Add Qty.");
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Show "Choose SFG" button only if no SFG is selected */}
                        {!selectedSFG ? (
                            <div className="space-y-6">
                                <div className="flex items-center justify-center p-6" >
                                    <button className="px-6 py-3 rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold shadow-lg hover:from-indigo-700 hover:to-blue-700 transition duration-300" onClick={() => setDisplayModalSfg(true)}>
                                        Choose SFG
                                    </button>
                                </div>
                            </div>
                        ) : (
                            // Display selected SFG details here
                            <div className="space-y-4 mt-8">
                                <h3 className="text-xl font-semibold text-gray-800">Selected SFG:</h3>
                                <div className="overflow-x-auto bg-gray-50 shadow-lg rounded-lg">
                                    <table className="min-w-full table-auto">
                                        <thead>
                                            <tr className="bg-gray-200 text-gray-600 text-sm font-medium">
                                                <th className="px-6 py-3 text-left">Item Name</th>
                                                <th className="px-6 py-3 text-left">Color</th>
                                                <th className="px-6 py-3 text-left">Available Stock</th>
                                                <th className="px-6 py-3 text-left">Quantity</th>
                                                <th className="px-6 py-3 text-left">Processes</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr className="border-t border-gray-200">
                                                <td className="px-6 py-4 text-gray-800">{selectedSFG["Item Name"]}</td>
                                                <td className="px-6 py-4 text-gray-800">{selectedSFG.Color}</td>
                                                <td className="px-6 py-4 text-gray-800">{selectedSFG.AvailableStock}</td>
                                                <td className="px-6 py-4 text-gray-800">{selectedSFG.addQty}</td>
                                                <td className="px-6 py-4 text-gray-800">
                                                    <select className="w-full border rounded px-2 py-1 bg-gray-100 text-gray-700" defaultValue="placeholder">
                                                        <option value="placeholder" disabled>
                                                            Processes Done
                                                        </option>
                                                        {selectedSFG.processes.map((process, index) => (
                                                            <option key={index} value={process} disabled>
                                                                {process}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        <div className="space-y-6">
                            <div className="flex items-center justify-center p-6"
                            >
                                <button className="px-6 py-3 rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold shadow-lg hover:from-indigo-700 hover:to-blue-700 transition duration-300"
                                    onClick={() => setDisplayModalJobber(true)}>
                                    Select Jobber
                                </button>
                            </div>
                        </div>

                        {displayModalJobber && (
                            <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-60">
                                <div className="relative w-[90vw] bg-gray-200 border shadow-2xl p-4 rounded-lg">
                                    <button
                                        className="absolute top-2 right-2 text-gray-700 hover:text-red-500 text-2xl font-bold"
                                        onClick={() => setDisplayModalJobber(false)}
                                    >
                                        ✖
                                    </button>

                                    <SelectSOTableJobber
                                        NoOfColumns={headersForTableJobber.length}
                                        data={jobber}
                                        headers={headersForTableJobber}
                                        setSelectJobbers={setSelectJobbers}
                                        setDisplayModalJobber={setDisplayModalJobber}
                                        selectJobbers={selectJobbers}
                                    />
                                </div>
                            </div>
                        )}

                        {selectJobbers.length > 0 && (
                            <div className="mt-6 p-4 bg-gray-100 rounded-lg shadow-md">
                                <h2 className="text-lg font-semibold mb-4">Selected Jobbers</h2>
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr>
                                            <th className="border-b py-2 px-4">Jobber Name</th>
                                            <th className="border-b py-2 px-4">Work Type</th>
                                            <th className="border-b py-2 px-4">GSTIN</th>
                                            <th className="border-b py-2 px-4">Rate</th>
                                            <th className="border-b py-2 px-4">Note</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectJobbers.map((jobber, index) => (
                                            <tr key={jobber.jobberId} className="hover:bg-gray-200">
                                                <td className="border-b py-2 px-4">{jobber.JobberName}</td>
                                                <td className="border-b py-2 px-4">{jobber.workType}</td>
                                                <td className="border-b py-2 px-4">{jobber.gstin}</td>
                                                <td className="border-b py-2 px-4">{jobber.rate}</td>
                                                <td className="border-b py-2 px-4">{jobber.note}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        <div className="mt-8 flex justify-end gap-4">
                            <button
                                onClick={onClose}
                                className="px-6 py-2 rounded-lg font-semibold bg-gray-300 text-gray-700 hover:bg-gray-400 transition duration-200"
                            >
                                Cancel
                            </button>
                            {/* <button
                                onClick={handleAddSelectedSFG}
                                className="px-6 py-2 rounded-lg font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition duration-200"
                            >
                                Add Selected SFG
                            </button> */}
                            <button
                                className={`p-3 bg-green-500 rounded-md transition-all duration-100 ease-in-out ${submitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-600 hover:scale-105'
                                    }`}
                                disabled={submitting}
                                onClick={handleAddSelectedSFG}
                            >
                                {submitting ? (
                                    <div className="flex justify-center items-center gap-2">
                                        <PuffLoader size={20} color="#fff" />
                                        <span>Adding Selected SFG...</span>
                                    </div>
                                ) : (
                                    'Add Selected SFG'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExtraBOMSfg;
