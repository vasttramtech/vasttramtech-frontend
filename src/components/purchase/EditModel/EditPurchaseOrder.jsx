import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { PuffLoader, BounceLoader } from "react-spinners";
import { useParams, useNavigate } from "react-router-dom";
import FormLabel from "../FormLabel";
import { toast } from "react-toastify";
import SelectionTable from "../../../smartTable/SelectionTable";
import { MdCancel } from "react-icons/md";


const EditPurchaseOrder = ({ setOpenEditModal, selectedRowData, fetchPurchaseOrderList }) => {

    const [selctionHeader, setSelectionHeader] = useState([
        "Group",
        "Item Name",
        "Unit",
        "HSN/SAC Code",
        "Description",
        "Color",
        "Price",
        "Qty",
        "Total"
    ]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { token } = useSelector((state) => state.auth);
    const [submitting, setSubmitting] = useState(false);
    const [displayModal, setDisplayModal] = useState(false);
    const [supplier, setSupplier] = useState([]);
    const [selectedRow, setSelectedRow] = useState([]);
    const [setOfSelectedIndex, setSetOfSelectedIndex] = useState(new Set());
    const [finalSelectedRows, setFinalSelectedRows] = useState([]);
    const [selectionData, setSelectionData] = useState([]);

    const [formData, setFormData] = useState({
        supplier: "",
        date: "",
        remark: "",
        total: "",
        raw_materials: [],
        purchase_order_status: "",
    });
    console.log("selectedRow: ", selectedRow)

    // function handleSaveSelection() {
    //     const updatedRows = selectedRow.map((row) => ({
    //         Group: row.Group,
    //         "Item Name": row["Item Name"], // Ensure proper case & spacing
    //         Unit: row.Unit,
    //         "HSN/SAC Code": row["HSN/SAC Code"], // Fix this key
    //         Description: row.Description,
    //         Color: row.Color,
    //         Price: row.Price || 0,
    //         Qty: 1,
    //         Total: row.Price || 0,
    //     }));

    //     const uniqueRows = [...finalSelectedRows];

    //     selectedRow.forEach((row) => {
    //         if (!uniqueRows.some((existingRow) => existingRow.id === row.id)) {
    //             uniqueRows.push({
    //                 Group: row.Group,
    //                 "Item Name": row["Item Name"],
    //                 Unit: row.Unit,
    //                 "HSN/SAC Code": row["HSN/SAC Code"],
    //                 Description: row.Description,
    //                 Color: row.Color,
    //                 Price: row.Price || 0,
    //                 Qty: 1,
    //                 Total: row.Price || 0,
    //                 id: row.id, // Ensure each row has a unique id
    //             });
    //         }
    //     });

    //     setFinalSelectedRows(uniqueRows);
    //     setDisplayModal(false);
    // }

    function handleSaveSelection() {
        const uniqueRows = [...finalSelectedRows];

        selectedRow.forEach((row) => {
            if (!uniqueRows.some((existingRow) => existingRow.id === row.id)) {
                uniqueRows.push({
                    ...row,
                    Qty: 1,
                    Total: row.Price || 0,
                });
            }
        });

        setFinalSelectedRows(uniqueRows);
        setDisplayModal(false);
    }


    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    function handleSelectRawmaterial() {
        const selectedIds = new Set(finalSelectedRows.map((row) => row.id)); // Track selected row IDs

        const selectedIndices = new Set();
        selectionData.forEach((item, index) => {
            if (selectedIds.has(item.id)) {
                selectedIndices.add(index);
            }
        });

        setSetOfSelectedIndex(selectedIndices); // Store updated selection indices
        setSelectedRow(finalSelectedRows);
        setDisplayModal(true);
    }

    function handleQtyChange(index, qty) {
        const updatedRows = [...finalSelectedRows];
        updatedRows[index].Qty = qty;
        updatedRows[index].Total = qty * updatedRows[index].Price; // Update total

        setFinalSelectedRows(updatedRows);
    }

    function handlePriceChange(index, price) {
        const updatedRows = [...finalSelectedRows];
        updatedRows[index].Price = price;
        updatedRows[index].Total = price * updatedRows[index].Qty; // Update total based on price change

        setFinalSelectedRows(updatedRows);
    }

    function handleDeleteRow(index) {
        const itemToDelete = finalSelectedRows[index];

        // Remove from finalSelectedRows
        const updatedRows = finalSelectedRows.filter((_, i) => i !== index);
        setFinalSelectedRows(updatedRows);

        // Remove deleted row ID from the selection set
        const updatedSet = new Set(setOfSelectedIndex);
        selectionData.forEach((item, i) => {
            if (item.id === itemToDelete.id) {
                updatedSet.delete(i); // Remove corresponding index
            }
        });

        setSetOfSelectedIndex(updatedRows.length > 0 ? updatedSet : new Set()); // Reset if empty
    }

    const grandTotal = finalSelectedRows.reduce((acc, row) => acc + row.Total, 0);

    useEffect(() => {
        setFormData(prev => ({
            ...prev,
            total: grandTotal.toFixed(2),
        }));
    }, [grandTotal]);

    const fetchPurchaseOrder = async () => {

        try {
            setLoading(true);
            const response = await axios.get(
                `${process.env.REACT_APP_BACKEND_URL}/api/purchase-orders/${selectedRowData?.id}?populate[supplier][populate]=concerned_person_details&populate[raw_materials][populate][raw_material_master][populate][group]=*&populate[raw_materials][populate][raw_material_master][populate][unit]=*&populate[raw_materials][populate][raw_material_master][populate][color]=*&populate[raw_materials][populate][raw_material_master][populate][hsn_sac_code]=*`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            const data = response.data.data;
            console.log("Fetched Data:", data);

            setFormData({
                supplier: data?.supplier?.id || "",
                date: data?.date || "",
                remark: data?.remark || "",
                total: data?.total_amount || "",
                raw_materials: [],
                purchase_order_status: data.purchase_order_status
            });

            setFinalSelectedRows(
                Array.isArray(data?.raw_materials)
                    ? data.raw_materials.map(material => ({
                        id: material.raw_material_master?.id,
                        Group: material.raw_material_master?.group?.group_name || "N/A",
                        "Item Name": material.raw_material_master?.item_name || "N/A",
                        Unit: material.raw_material_master?.unit?.unit_name || "N/A",
                        "HSN/SAC Code": material.raw_material_master?.hsn_sac_code?.hsn_sac_code || "N/A",
                        Description: material.raw_material_master?.description || "N/A",
                        Color: material.raw_material_master?.color?.color_name || "N/A",
                        Price: material?.price_per_unit || 0,
                        Qty: material.qty || 1,
                        Total: material.price_per_unit * (material.qty || 1),
                    }))
                    : []
            );
        } catch (error) {
            console.error("Error fetching purchase order:", error);
            if (error.response?.status === 401) {
                navigate("/login");
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchDropdownData = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/raw-material-masters?populate=*`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const response1 = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/supplier-masters?populate=*`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log("response1: ", response1)

            const data = Array.isArray(response.data.data) ? response.data.data : [];
            // console.log("data: ", data);
            const formattedData = data.map((item) => ({
                Group: item.group?.group_name || "N/A",
                "Item Name": item.item_name || "N/A",
                Unit: item.unit?.unit_name || "N/A",
                "HSN/SAC Code": item.hsn_sac_code?.hsn_sac_code || "N/A",
                Description: item.description || "N/A",
                Color: item.color?.color_name || "N/A",
                Price: item?.price_per_unit,
                qty: "",
                total: "",
                id: item.id,
            }));

            setSelectionData(formattedData);
            const supplierData = Array.isArray(response1.data.data)
                ? response1.data.data
                : [];
            setSupplier(supplierData);
        } catch (error) {
            console.error("Error fetching dropdown data:", error);
            if (error.response?.status === 401) {
                navigate("/login");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchPurchaseOrder();
            fetchDropdownData();
        } else {
            navigate("/login");
        }
    }, [token]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        const postData = {
            data: {
                supplier: formData.supplier,
                date: formData.date,
                remark: formData.remark,
                total: formData.total,
                raw_materials: finalSelectedRows.map(row => ({
                    raw_material_master: row.id,
                    price_per_unit: row.Price,
                    qty: row.Qty,
                    total_price: row.Total,
                }))
            },
            purchase_order_status: formData.purchase_order_status
        };
        console.log("postData: ", postData);

        try {
            await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/purchase-orders/${selectedRowData?.id}`, postData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success("Purchase Order Updated Successfully", { position: "top-right" });
            setFormData({
                supplier: "",
                date: "",
                remark: "",
                total: "",
                raw_materials: []
            })
            setFinalSelectedRows([]);
            fetchPurchaseOrderList();
            setOpenEditModal(false);
        } catch (error) {
            console.error("Error updateing purchase order:", error);
            toast.error("Error updateing purchase order");
        } finally {
            setSubmitting(false);
        }
    };


    console.log("formData: ", formData)
    console.log("finalSelectedRows: ", finalSelectedRows)

    // if (loading) return (
    //     <div className="absolute inset-0 flex justify-center items-center bg-opacity-50 bg-gray-200 z-10">
    //         <BounceLoader size={100} color={"#1e3a8a"} loading={loading} />
    //     </div>
    // );

    return (
        <div className=" w-full">
            <div className="flex justify-between items-center mb-4 pb-2 border-b">
                <h1 className="text-xl font-bold ">Edit Purchase Order</h1>
                <button onClick={() => setOpenEditModal(false)} className="text-red-500 hover:text-red-700 hover:scale-105 duration-200 transition-all ease-in-out ">
                    <MdCancel className="w-8 h-8" />
                </button>
            </div>

            {displayModal && (
                <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50">
                    <div className="relative w-[90vw] bg-gray-200 border shadow-2xl p-4 rounded-lg">
                        {/* Close Button */}

                        <div>


                            <button
                                className="absolute top-2 right-2 text-red-700 hover:text-red-500 hover:scale-105 duration-200 transition-all ease-in-out text-2xl font-bold"
                                onClick={() => setDisplayModal(false)}
                            >
                                <MdCancel className="w-8 h-8" />
                            </button>
                        </div>

                        <h2 className="text-2xl font-bold mb-4 text-center">
                            Select Raw Material
                        </h2>

                        <SelectionTable
                            NoOfColumns={selctionHeader.length}
                            data={selectionData}
                            headers={selctionHeader}
                            setSelectedRow={setSelectedRow}
                            setOfSelectedIndex={setOfSelectedIndex}
                            setSetOfSelectedIndex={setSetOfSelectedIndex}
                        />

                        {/* Add Button */}
                        <div className="flex justify-center items-center mt-4">
                            <button
                                type="button"
                                className="bg-blue-900 px-4 py-1 rounded text-white hover:bg-blue-700"
                                onClick={handleSaveSelection}
                            >
                                Add
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <form className="grid grid-cols-2 gap-6 p-2 " onSubmit={handleUpdate}>
                <div className="flex flex-col">
                    <FormLabel title={"Supplier"} />
                    <select
                        className="border border-gray-300 bg-gray-100 rounded-md p-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        name="supplier"
                        onChange={handleFormChange}
                        value={formData.supplier}
                    >
                        <option value="" disabled selected>
                            Supplier
                        </option>
                        {supplier.map((supplier, index) => (
                            <option key={index} value={supplier?.id}>
                                {supplier?.company_name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex flex-col">
                    <FormLabel title={"Date"} />
                    <input
                        type="date"
                        className="border border-gray-300 bg-gray-100 rounded-md p-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        name="date"
                        onChange={handleFormChange}
                        value={formData.date}
                    />
                </div>
                <div className="flex flex-col">
                    <FormLabel title={"Remarks"} />
                    <textarea
                        className="border border-gray-300 bg-gray-100 rounded-md p-2 h-40 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                        placeholder="Remarks"
                        name="remark"
                        onChange={handleFormChange}
                        value={formData.remark}
                    ></textarea>
                </div>
                <div className="col-span-2 flex border border-blue-500 justify-center mt-4 rounded p-2">
                    <button
                        type="button"
                        className="bg-blue-900 text-white px-4 py-1 rounded hover:bg-blue-700 transition-all duration-200"
                        onClick={handleSelectRawmaterial}
                    >
                        Choose Raw Material
                    </button>
                </div>

                {/* Selected Items Table */}
                {finalSelectedRows.length > 0 && (
                    <div className="col-span-2 mt-4 border p-2 rounded bg-gray-100">
                        <h3 className="text-lg font-bold mb-2">Selected Items</h3>
                        <table className="w-full border-collapse border border-gray-400">
                            <thead>
                                <tr className="bg-gray-300">
                                    {selctionHeader.map((header, index) => (
                                        <th key={index} className="border p-2">
                                            {header}
                                        </th>
                                    ))}
                                    <th className="border p-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {finalSelectedRows.map((row, index) => (
                                    <tr key={index} className="text-center bg-white">
                                        {selctionHeader.map((header, i) => (
                                            <td key={i} className="border p-2">
                                                {header === "Price" ? (
                                                    <input
                                                        type="number"
                                                        value={row.Price}
                                                        step="any"
                                                        min="0"
                                                        className="w-16 border p-1 text-center"
                                                        onChange={(e) => handlePriceChange(index, Number(e.target.value))}
                                                    />
                                                ) : header === "Qty" ? (
                                                    <input
                                                        type="number"
                                                        value={row.Qty}
                                                        step="any"
                                                        min="1"
                                                        className="w-16 border p-1 text-center"
                                                        onChange={(e) => handleQtyChange(index, Number(e.target.value))}
                                                    />
                                                ) : header === "Total" ? (
                                                    row.Total.toFixed(2)
                                                ) : (
                                                    row[header] || "N/A"
                                                )}
                                            </td>
                                        ))}

                                        <td className="border p-2">
                                            <button
                                                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700 transition"
                                                onClick={() => handleDeleteRow(index)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                <div className="col-span-2 mt-4 flex justify-end">
                    <h3 className="text-xl font-bold"
                        name="total"
                        onChange={handleFormChange}
                        value={formData.total}
                    >Grand Total: ₹{grandTotal.toFixed(2)}</h3>
                </div>


                <div className="col-span-2 flex justify-end mt-4">
                    <button type="button" className="bg-gray-200 px-4 py-1 rounded hover:bg-gray-600 hover:text-white transition">
                        Clear
                    </button>
                    <button
                        type="submit"
                        className={`bg-blue-900 ml-2 px-6 py-2 rounded text-white font-semibold transition-all ease-in-out duration-300 transform ${submitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
                            }`}
                        disabled={submitting}
                    >
                        {submitting ? (
                            <div className="flex justify-center items-center space-x-2">
                                <PuffLoader size={20} color="#fff" />
                                <span>Updating...</span>
                            </div>
                        ) : (
                            'Update'
                        )}
                    </button>
                </div>
            </form>

        </div>
    )
};

export default EditPurchaseOrder;

