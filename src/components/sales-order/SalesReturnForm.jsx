import axios from "axios";
import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { BounceLoader, PuffLoader } from 'react-spinners'
import { toast } from "react-toastify";
import SelectionTable from "../../smartTable/SelectionTable";
import SmartTable from "../../smartTable/SmartTable";
import NormalTable from "../../smartTable/NormalTable";
import { MdCancel } from "react-icons/md";

const salesOrderHeaders = [
    "Select",
    "SO ID",
    "Order No",
    "Order Date",
    "Converted Date",
    "Delivery Date",
    "Processor",
    "Qty",
    "Order Status"
]



const SalesOrderTable = ({ salesOrders, selectedSOId, setSelectedSOId }) => {
    const [search, setSearch] = useState("");

    console.log(salesOrders);
    const tableRows = salesOrders.map((so) => ({
        select: (
            <input
                type="checkbox"
                checked={selectedSOId === so.so_id}
                onChange={() => setSelectedSOId(so.so_id)}
            />
        ),
        so_id:
            so?.sourceType === "internal"
                ? so?.orders[0]?.external_orders
                : so?.so_id,
        order_no: so.order_no,
        order_date: so.order_date,
        converted_date: so?.sourceType === "internal" ? so?.converted_date : "",
        delivery_date: so.delivery_date,
        processor: so.processor?.name,
        qty: so.qty,
        order_status: so.order_status,
    }));

    const filteredRows = tableRows.filter(row =>
        // Search in all fields except the select checkbox (row.select)
        Object.entries(row)
            .filter(([key]) => key !== "select")
            .map(([, value]) => value)
            .join(" ")
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    // Use filteredRows if search term, else all tableRows
    const rowsToDisplay = search.trim() ? filteredRows : tableRows;

    return (
        <div className="m-2">
            <input type="text" placeholder="Auto Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="bg-gray-200 p-2 rounded-xl shadow border-gray-400 border-[1px] w-64" />
            <NormalTable data={rowsToDisplay} headers={salesOrderHeaders} />
        </div>
    );
};




const SalesReturnForm = () => {
    const [formData, setFormData] = useState({
        soId: "",
        billNotReceived: false,
        customer: "",
        state: "",
        transporter: "",
        goods: "",
        billNo: "",
        cnNo: "",
        returnDate: "",
        remarks: "",
        returnType: "",
    });
    const statesOfIndia = [
        "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
        "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
        "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
        "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
        "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
        "Uttar Pradesh", "Uttarakhand", "West Bengal"
    ];
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [salesOrders, setSalesOrders] = useState([]);
    const [selectedSO, setSelectedSO] = useState(null);
    const [selectedSOId, setSelectedSOId] = useState(null);
    const { token, designation, id } = useSelector((state) => state.auth);
    const [showModal, setShowModal] = useState(false);
    const [soChecked, setSOChecked] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);
    const [customerNameDisplay, setCustomerNameDisplay] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleCheckboxChange = (key, value) => {
        const exists = selectedItems.some(item => item.key === key);

        if (exists) {
            setSelectedItems(prev => prev.filter(item => item.key !== key));
        } else {
            setSelectedItems(prev => [...prev, { key, value, alterQty: 0 }]);
        }
    };

    const handleClear = () => {
        setFormData({
            soId: "",
            billNotReceived: false,
            customer: "",
            state: "",
            transporter: "",
            goods: "",
            billNo: "",
            cnNo: "",
            returnDate: "",
            remarks: "",
            returnType: "",
        });
    };

    const handleGetOrder = async () => {
        try {
            setLoading(true)
            let response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/mix-orders`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const dispatchedOrders = response?.data || [];

            if (dispatchedOrders.length < 0) {
                toast.error("No Dispatched order found");
            }

            setSalesOrders(dispatchedOrders);
            setShowModal(true);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching orders", error);
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData?.returnType === "") {
            toast.error("Please select the Return Type");
            return;
        }

        if (selectedSO === null) {
            toast.error("Please select the Sales Order");
            return;
        }

        try {
            setSubmitting(true)
            const payload = {
                data: {
                    internal_sales_order_entry: (selectedSO.sourceType === "internal") ? selectedSO?.id : null,
                    sales_oder_entry: (selectedSO.sourceType === "external") ? selectedSO?.id : null,
                    return_type: formData?.returnType,
                    so_id: selectedSO?.so_id,
                    bill_not_receive: formData?.billNotReceived,
                    customer_master: formData?.customer,
                    state: formData?.state || "",
                    transporter: formData?.transporter || "",
                    Goods: formData?.goods || "",
                    bill_No: formData?.billNo || "",
                    cn_no: formData?.cnNo || "",
                    return_date: formData?.returnDate || new Date().toISOString().split("T")[0],
                    remarks: formData?.remarks || "",
                    return_items: (selectedItems.length > 0) ? selectedItems.map((item) => ({
                        ...item,
                        saleQty: Number(selectedSO?.qty)
                    })) : null,
                },
            };

            console.log("payload: ", payload)

            // const res = await axios.post("http://localhost:1337/api/sales-order-returns", payload);
            const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/sales-order-returns`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const res2 = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/update-status-if-dispatched`, {
                id: selectedSO?.id,
                type: selectedSO?.sourceType === "internal" ? "internal-sales-order-entry" : "sales_oder_entries",
                status: formData?.returnType === "Alter Items" ? "Alter" : "Return",
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log("Res: ", res)

            if (res.status === 200 || res.status === 201) {
                toast.success("Sales Order Return posted successfully!");
                setSubmitting(false)
                navigate(`/sales-return-view/${res?.data?.data?.id}`);
            } else {
                toast.error("Failed to post Sales Order Return.");
                setSubmitting(false)
            }

        } catch (err) {
            console.error(err);
            toast.error("Error while posting Sales Order Return");
            setSubmitting(false)
        }
    };



    console.log("formData: ", formData);
    console.log("selectedSO ", selectedSO);
    console.log("selectedItems ", selectedItems);


    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <BounceLoader color="#1e3a8a" />
            </div>
        )
    }
    return (
        <div className="p-6 bg-white relative rounded-lg">

            <div className="">
                <h1 className=" text-2xl font-bold text-blue-900 mb-4 border-b pb-2">
                    Sales Return
                </h1>
                <h1 className="text-center text-2xl font-bold text-red-700 mb-6 border-b pb-2">
                    Please don't use it. We are working on it.
                </h1>

                <div className="text-center border border-gray-200 shadow-sm py-2">
                    <button
                        className="bg-blue-900 hover:bg-blue-700 transition-all ease-in-out duration-200 text-white px-4 py-2 rounded shadow"
                        onClick={handleGetOrder}
                    >
                        Choose Sales Order
                    </button>
                </div>

                {/* Modal */}
                {showModal && (
                    <div className="fixed animate-fade-in inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-md flex justify-center items-center z-50">
                        <div className="bg-white rounded-lg relative w-[80%] p-6 h-[85vh] overflow-hidden">
                            <button
                                onClick={() => setShowModal(false)}
                                className="absolute top-2 right-4 text-red-700 hover:text-red-500 duration-200 ease-in-out transition-all text-xl"
                            >
                                <MdCancel className="w-8 h-8" />
                            </button>
                            <h2 className="text-xl pb-2 border-b font-bold mb-4 text-blue-700">
                                Select Sales Order
                            </h2>

                            <SalesOrderTable salesOrders={salesOrders} selectedSOId={selectedSOId} setSelectedSOId={setSelectedSOId} />

                            {/* <table className="w-full border border-gray-300">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="p-2 border">Select</th>
                                        <th className="p-2 border">SO ID</th>
                                        <th className="p-2 border">Order No</th>
                                        <th className="p-2 border">Order Date</th>
                                        <th className="p-2 border">Converted Date</th>
                                        <th className="p-2 border">Delivery Date</th>
                                        <th className="p-2 border">Processor</th>
                                        <th className="p-2 border">Qty</th>
                                        <th className="p-2 border">Order Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {salesOrders.map((so) => (
                                        <tr key={so.id} className="text-sm hover:bg-gray-50">
                                            <td className="p-2 border text-center">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedSOId === so.so_id}
                                                    onChange={() => setSelectedSOId(so.so_id)}
                                                />
                                            </td>
                                            <td className="p-2 border text-center">
                                                {so?.sourceType === "internal"
                                                    ? so?.orders[0]?.external_orders
                                                    : so?.so_id}
                                            </td>
                                            <td className="p-2 border text-center">{so.order_no}</td>
                                            <td className="p-2 border text-center">
                                                {so?.sourceType === "internal"
                                                    ? so?.converted_date
                                                    : ""}
                                            </td>
                                            <td className="p-2 border text-center">
                                                {so.order_date}
                                            </td>
                                            <td className="p-2 border text-center">
                                                {so.delivery_date}
                                            </td>
                                            <td className="p-2 border text-center">
                                                {so.processor?.name}
                                            </td>
                                            <td className="p-2 border text-center">{so.qty}</td>
                                            <td className="p-2 border text-center">
                                                {so.order_status}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table> */}

                            <div className="mt-4 text-center">
                                <button
                                    className="bg-green-600 hover:bg-green-700 duration-200 ease-in-out transition-all text-white px-4 py-2 rounded"
                                    onClick={() => {
                                        const selectedData = salesOrders.find(
                                            (so) => so.so_id === selectedSOId
                                        );
                                        setSelectedSO(selectedData);
                                        setFormData((prev) => ({
                                            ...prev,
                                            soId: (selectedData?.sourceType === "external") ? selectedData?.so_id : selectedData?.orders[0].external_orders,
                                            customer:
                                                selectedData?.customer?.id || "",
                                            goods: selectedData?.order_items
                                                ? Object.keys(selectedData.order_items).join(", ")
                                                : "",
                                        }));
                                        setCustomerNameDisplay(selectedData?.customer?.company_name || "");
                                        setShowModal(false);
                                    }}
                                    disabled={!selectedSOId}
                                >
                                    Select SO
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex flex-col w-1/2 my-2">
                    <label className="w-3/4 font-medium">Return Type:</label>
                    <select
                        name="returnType"
                        value={formData.returnType}
                        onChange={handleChange}
                        className="bg-gray-100 border border-gray-300 rounded-md p-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"

                        required
                        disabled={selectedSO === null}
                    >
                        <option value="" className="text-gray-400">
                            Select Return Type
                        </option>
                        <option value="Alter Items">Alter Items</option>
                        <option value="SO Return">SO Return</option>
                    </select>
                </div>

                {/* {formData?.returnType === "Alter Items" &&
                            <div className="mt-4 mb-8 col-span-2">
                                <h2 className="text-lg font-semibold text-gray-800 mb-3">Items</h2>
                                <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
                                    <table className="w-full border-collapse border border-gray-300 rounded-lg">
                                        <thead className="bg-gray-200 text-gray-700 text-sm uppercase">
                                            <tr>
                                                {["Group", "Colour", "Design/Khaka", "Measurement", "Work", "Others", "Select"].map((header) => (
                                                    <th key={header} className="border border-gray-300 p-3 text-center">{header}</th>
                                                ))}
                                            </tr>
                                        </thead>



                                        <tbody>
                                            {Object.entries(selectedSO?.order_items).map(([key, value], index) => {
                                                const isChecked = selectedItems.some((item) => item.key === key);

                                                return (
                                                    <tr key={index} className="even:bg-gray-100 hover:bg-gray-50 transition">
                                                        <td className="border border-gray-300 p-3 text-center">{key}</td>
                                                        <td className="border border-gray-300 p-3 text-center">{value.colour}</td>
                                                        <td className="border border-gray-300 p-3 text-center">{value.khaka}</td>
                                                        <td className="border border-gray-300 p-3 text-center">{value.measurement}</td>
                                                        <td className="border border-gray-300 p-3 text-center">{value.work}</td>
                                                        <td className="border border-gray-300 p-3 text-center">{value.others}</td>

                                                        <td className="border border-gray-300 p-3 text-center">
                                                            <input
                                                                type="checkbox"
                                                                checked={isChecked}
                                                                onChange={() => handleCheckboxChange(key, value)}
                                                            />
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>




                                    </table>
                                </div>
                            </div>
                        } */}

                {formData?.returnType === "Alter Items" &&
                    <div className="mt-4 mb-8 col-span-2 animate-fade-in">
                        <h2 className="text-lg font-semibold text-gray-800 mb-3">Items</h2>
                        <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
                            <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
                                <table className="w-full border-collapse border border-gray-300 rounded-lg">
                                    <thead className="bg-gray-200 text-gray-700 text-sm uppercase">
                                        <tr>
                                            {[
                                                "Group",
                                                "Colour",
                                                "Design/Khaka",
                                                "Measurement",
                                                "Work",
                                                "Others",
                                                "Sale Qty",
                                                "Alter Qty",
                                                "Select"
                                            ].map((header) => (
                                                <th key={header} className="border border-gray-300 p-3 text-center">{header}</th>
                                            ))}
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {Object.entries(selectedSO?.order_items || {}).map(([key, value], index) => {
                                            const isChecked = selectedItems.some(item => item.key === key);
                                            const selectedItem = selectedItems.find(item => item.key === key);
                                            const alterQty = selectedItem?.alterQty || "";

                                            return (
                                                <tr key={index} className="even:bg-gray-100 hover:bg-gray-50 transition">
                                                    <td className="border border-gray-300 p-3 text-center">{key}</td>
                                                    <td className="border border-gray-300 p-3 text-center">{value.colour}</td>
                                                    <td className="border border-gray-300 p-3 text-center">{value.khaka}</td>
                                                    <td className="border border-gray-300 p-3 text-center">{value.measurement}</td>
                                                    <td className="border border-gray-300 p-3 text-center">{value.work}</td>
                                                    <td className="border border-gray-300 p-3 text-center">{value.others}</td>
                                                    <td className="border border-gray-300 p-3 text-center">{selectedSO.qty}</td>

                                                    <td className="border border-gray-300 p-3 text-center">
                                                        <input
                                                            type="number"
                                                            className="w-20 border rounded px-2 py-1 text-center"
                                                            value={alterQty}
                                                            onChange={(e) => {
                                                                const newQty = Number(e.target.value);
                                                                if (newQty <= selectedSO.qty) {
                                                                    const updated = selectedItems.map((item) =>
                                                                        item.key === key ? { ...item, alterQty: newQty } : item
                                                                    );
                                                                    setSelectedItems(updated);
                                                                }
                                                            }}
                                                            disabled={!isChecked}
                                                            min="0"
                                                            max={selectedSO.qty}
                                                        />
                                                    </td>

                                                    <td className="border border-gray-300 p-3 text-center">
                                                        <input
                                                            type="checkbox"
                                                            checked={isChecked}
                                                            onChange={() => handleCheckboxChange(key, value)}
                                                        />
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                        </div>
                    </div>
                }


                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                    <div className="flex flex-col">
                        <label className="w-28 font-medium">SO Id:</label>
                        <input
                            type="text"
                            name="soId"
                            value={formData.soId}
                            onChange={handleChange}
                            placeholder="SO-00####"
                            className="border border-gray-300 bg-gray-100 rounded-md p-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <label className="font-medium">Bill Not Received:</label>
                        <input
                            type="checkbox"
                            name="billNotReceived"
                            checked={formData.billNotReceived}
                            onChange={handleChange}
                            className="border border-gray-300 bg-gray-100 rounded-md h-4 w-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="font-medium">Customer:</label>
                        <input
                            type="text"
                            name="customer"
                            value={customerNameDisplay}
                            placeholder="Customer Name"
                            // onChange={handleChange}
                            className="border border-gray-300 bg-gray-100 rounded-md p-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="w-20 font-medium">State:</label>
                        <select
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                            placeholder="State"
                            className="border border-gray-300 bg-gray-100 rounded-md p-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="" className="text-gray-400">
                                State
                            </option>
                            {statesOfIndia.map((state, index) => (
                                <option key={index} value={state}>
                                    {state}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col">
                        <label className="w-28 font-medium">Transporter:</label>
                        <input
                            type="text"
                            name="transporter"
                            value={formData.transporter}
                            onChange={handleChange}
                            placeholder="Transporter"
                            className="border border-gray-300 bg-gray-100 rounded-md p-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="w-20 font-medium">Goods:</label>
                        <input
                            type="text"
                            name="goods"
                            value={formData.goods}
                            placeholder="Goods"
                            onChange={handleChange}
                            className="border border-gray-300 bg-gray-100 rounded-md p-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="w-28 font-medium">Bill No:</label>
                        <input
                            type="text"
                            name="billNo"
                            value={formData.billNo}
                            onChange={handleChange}
                            placeholder="Bill No"
                            className="border border-gray-300 bg-gray-100 rounded-md p-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="w-20 font-medium">CN No:</label>
                        <input
                            type="text"
                            name="cnNo"
                            value={formData.cnNo}
                            onChange={handleChange}
                            placeholder="CN No"
                            className="border border-gray-300 bg-gray-100 rounded-md p-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="w-28 font-medium">Return Date:</label>
                        <input
                            type="date"
                            name="returnDate"
                            value={formData.returnDate}
                            placeholder="Return Date"
                            onChange={handleChange}
                            className="border border-gray-300 bg-gray-100 rounded-md p-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="w-20 font-medium">Remarks:</label>
                        <input
                            type="text"
                            name="remarks"
                            value={formData.remarks}
                            placeholder="Remarks"
                            onChange={handleChange}
                            className="bg-gray-100 border border-gray-300 rounded-md p-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"

                        />
                    </div>

                    <div className="col-span-2 flex justify-center gap-4 mt-6">
                        {/* <button
                                    type="submit"
                                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded shadow"
                                >
                                    Save
                                </button> */}
                        <button
                            type="submit"
                            className={`p-3 bg-green-500 rounded-md transition-all text-white font-semibold duration-100 ease-in-out ${submitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-600 hover:scale-105'
                                }`}
                            disabled={submitting}
                        >
                            {submitting ? (
                                <div className="flex justify-center  items-center gap-2">
                                    <PuffLoader size={20} color="#fff" />
                                    <span>Saving...</span>
                                </div>
                            ) : (
                                'Save'
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={handleClear}
                            className="bg-yellow-400  hover:bg-yellow-500 text-black px-6 py-2 rounded shadow"
                        >
                            Clear
                        </button>
                    </div>
                </form>
            </div>

        </div>
    );


};

export default SalesReturnForm;
