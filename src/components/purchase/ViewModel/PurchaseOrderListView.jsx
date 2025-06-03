import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft, FaPrint } from "react-icons/fa";
import { BounceLoader } from "react-spinners";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const PurchaseOrderListView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { token } = useSelector(state => state.auth);
    const location = useLocation();
    const purchase_id = location.state?.purchase_id;
    const [stockIn, setStockIn] = useState([]);
    const [message, setMessage] = useState(null);

    const [showDetails, setShowDetails] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await axios.get(
                    `${process.env.REACT_APP_BACKEND_URL}/api/purchase-orders/${id}?populate[supplier][populate]=concerned_person_details&populate[raw_materials][populate]=raw_material_master`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                if (response.data?.data) {
                    setData(response.data.data);
                    console.log("Data ", response.data.data)
                } else {
                    setError("No Purchase Order data found.");
                    toast.error("No Purchase Order data found.");
                }
            } catch (error) {
                console.error("Error fetching purchase order data:", error);
                setError("Failed to fetch purchase order data.");
                toast.error("Failed to fetch purchase order data.");
                if (error.response?.status === 401) {
                    navigate("/login");
                }
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, navigate, token]);

    useEffect(() => {
        const fetchStockInData = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await axios.get(
                    `${process.env.REACT_APP_BACKEND_URL}/api/stock-ins/po-receive-details/${purchase_id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                console.log("API Response:", response.data);

                if (Array.isArray(response.data) && response.data.length > 0) {
                    setStockIn(response.data);
                    setMessage(null);
                } else {
                    setStockIn([]);
                    setMessage(response.data.message || "No stock-in records found.");
                }
            } catch (error) {
                console.error("Error fetching purchase order receive data:", error);
                setError("Failed to fetch purchase order receive data.");
                toast.error("Failed to fetch purchase order receive data.");
            } finally {
                setLoading(false);
            }
        };

        fetchStockInData(); // Fetch data on page load
    }, [purchase_id, token]);

    const handleToggleView = () => {
        setShowDetails((prev) => !prev);
    };

    // console.log("stockIn: ", stockIn)

    const handlePrint = () => {
        const invoiceContent = document.getElementById("invoice-content").innerHTML;

        const printWindow = window.open("", "_blank");
        printWindow.document.write(`
    <html>
    <head>
        <title>Vasttram Purchase Order</title>
        <style>
            /* General Print Styles */
            body {
                font-family: Arial, sans-serif;
                padding: 20px;
                -webkit-print-color-adjust: exact;
            }
            .purchase{
                text-align:center;
            }
            h2 {
                font-size: 24px;
                border-bottom: 2px solid black;
                padding-bottom: 10px;
            }
            .print-container {
                max-width: 900px;
                margin: auto;
            }
            .print-table {
                width: 100%;
                border-collapse: collapse;
                font-size: 14px;
            }
            .print-table th, .print-table td {
                border: 1px solid black;
                padding: 8px;
                text-align: left;
            }
            .border-b {
                border-bottom: 2px solid black;
                padding-bottom: 5px;
                margin-bottom: 5px;
            }
            .supplier-container {
                display: flex;
                flex-direction:column;
                justify-content: space-between;
                margin-top: 10px;
            }
            .concerned-person {
                margin-top: 5px;
                padding: 10px 20px;
                border-radius: 5px;
            }
            .supplier-heading{
                border-bottom:1px solid gray;
            }
            .vasttram-heading{
                color: #2563eb
            }
            .no-print {
                display: none !important;
            }
            .hide{
                display: hidden;
            }
            .right{
                text-align:right;
            }
            /* Ensure Flex Layouts are Preserved */
            .flex { display: flex; }
            .justify-between { justify-content: space-between; }
            .w-1-2 { width: 48%; }
            .p-3 { padding: 12px; }
            .border { border: 1px solid #ccc; }
            .rounded { border-radius: 5px; }
            .bg-gray-50 { background-color: #f9f9f9; }
            .shadow-sm { box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.1); }
        </style>
    </head>
    <body>
        <div class="print-container">
            <h1 class="vasttram-heading">Vasttram</h1>
            ${invoiceContent}
        </div>
        <script>
            window.onload = function() {
                window.print();
                setTimeout(() => { window.close(); }, 1000);
            };
        </script>
    </body>
    </html>
    `);

        printWindow.document.close();
    };

    console.log("stockIn: ", stockIn);

    if (loading) return (
        <div className="absolute inset-0 flex justify-center items-center bg-opacity-50 bg-gray-200 z-10">
            <BounceLoader size={100} color={"#1e3a8a"} loading={loading} />
        </div>
    );

    if (error) return <div className="text-center text-red-500 mt-10">{error}</div>;

    // const { supplier, raw_materials, documentId, date, total, remark } = data;
    return (
        <div className="w-4/5 mx-auto mt-6 p-10 bg-white shadow-lg rounded-2xl border border-gray-200">
            {/* Print Styles */}

            {/* Navigation & Print Button */}
            <div className="flex justify-between items-center mb-6 no-print">
                <button className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold"
                    onClick={() => navigate("/purchase-order-list")}>
                    <FaArrowLeft /> Back
                </button>
                <button className="flex items-center gap-2 bg-green-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-green-700"
                    onClick={handlePrint}>
                    <FaPrint /> Print
                </button>
            </div>

            {/* Invoice Header */}
            <div className="print-container" id="invoice-content">
                <h2 className="text-3xl font-bold text-center border-b pb-4 mb-4 purchase">Purchase Order</h2>

                {/* Single Column Layout for Purchase Order & Supplier Details */}
                <div className="border-b pb-4">
                    <h3 className="font-bold text-xl">Purchase Order Details</h3>
                    <div className="flex justify-between">
                        {/* Left Section: Purchase Order Details */}
                        <div className="w-1/2">
                            <p><strong>Purchase Order ID:</strong> {data?.id}</p>
                            <p><strong>Date:</strong> {data?.date}</p>
                            <p className="no-print"><strong>Total:</strong> ₹{data?.total}</p>
                            <p><strong>Remark:</strong> {data?.remark}</p>
                        </div>


                    </div>
                </div>

                {/* Supplier Details and Concerned Person in the Same Row */}
                {data?.supplier.concerned_person_details.length > 0 && (
                    <div className="flex flex-col justify-between mt-6 supplier-container">
                        {/* Header for Supplier & Concerned Person Details */}

                        {/* Main Container - Flex Row for Side-by-Side Layout */}
                        <div className="flex justify-between">
                            {/* Supplier Details Section */}
                            <div className="w-1/2 pr-4">
                                <h3 className="font-bold text-xl">Supplier Details</h3>
                                <p><strong>Company:</strong> {data?.supplier.company_name}</p>
                                <p><strong>Type:</strong> {data?.supplier.company_type}</p>
                                <p><strong>Contact:</strong> {data?.supplier.contact_number}</p>
                                <p><strong>Email:</strong> {data?.supplier.email_id}</p>
                                <p><strong>Address:</strong> {data?.supplier.address}</p>
                                <p><strong>GSTIN:</strong> {data?.supplier.gstin_number}</p>
                            </div>

                            {/* Concerned Person Details Section */}
                            <div className="w-1/2 pl-4">
                                <h3 className="font-bold text-xl">Concerned Persons</h3>
                                {data?.supplier.concerned_person_details.map((person, index) => (
                                    <div key={index} className="mt-2 p-3 border rounded bg-gray-50 shadow-sm">
                                        <p><strong>Name:</strong> {person.concerned_person_name}</p>
                                        <p><strong>Designation:</strong> {person.designation}</p>
                                        <p><strong>Email:</strong> {person.email_id}</p>
                                        <p><strong>Phone:</strong> {person.mobile_number_1}</p>
                                        <p><strong>Address:</strong> {person.address}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                 {/* adding two images for preview

                <div className="my-6 h-full">
                    <div>
                        <h3 className="font-bold text-xl border-b pb-2">Challan & Invoice Image</h3>
                        <div className="flex  justify-between gap-4">
                            {Array.isArray(stockIn) && stockIn.map((imgSrc, index) => (
                                imgSrc?.upload_challan && imgSrc.upload_challan.length > 0 && (
                                    <div key={index} className="mb-4 h-80 overflow-hidden">
                                        <p className="text-xs text-gray-500">{imgSrc.upload_challan[0]?.name}</p>
                                        <img src={imgSrc.upload_challan[0]?.url} alt={imgSrc.upload_challan[0]?.name || 'challan image'} className="max-w-xs h-full" />
                                    </div>
                                )
                            ))}

                            {
                                Array.isArray(stockIn) && stockIn.map((imgSrc, index) => (
                                    imgSrc?.upload_invoice && imgSrc.upload_invoice.length > 0 && (
                                        <div key={index} className="mb-4 h-80 overflow-hidden">
                                            <p className="text-xs text-gray-500">{imgSrc.upload_invoice[0]?.name}</p>
                                            <img
                                                src={imgSrc.upload_invoice[0]?.url}
                                                alt={imgSrc.upload_invoice[0]?.name || 'invoice image'}
                                                className="max-w-xs h-full"
                                            />
                                        </div>
                                    )
                                ))
                            }

                        </div>
                    </div>
                </div> */}




                {/* Raw Material Table */}
                <div className="mt-6">
                    <h3 className="font-bold text-xl border-b pb-2">Raw Materials</h3>
                    <table className="print-table w-full mt-4">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="border border-gray-300 px-4 py-2">Item</th>
                                <th className="border border-gray-300 px-4 py-2">Description</th>
                                <th className="border border-gray-300 px-4 py-2">Price per Unit</th>
                                <th className="border border-gray-300 px-4 py-2">Quantity</th>
                                <th className="border border-gray-300 px-4 py-2">Total Price</th>
                            </tr>
                        </thead>
                        <tbody className="text-center">
                            {data?.raw_materials.map((material, index) => (
                                <tr key={index}>
                                    <td className="border border-gray-300 px-4 py-2">{material.raw_material_master.item_name}</td>
                                    <td className="border border-gray-300 px-4 py-2">{material.raw_material_master.description}</td>
                                    <td className="border border-gray-300 px-4 py-2">₹{material.price_per_unit}</td>
                                    <td className="border border-gray-300 px-4 py-2">{material.qty}</td>
                                    <td className="border border-gray-300 px-4 py-2">₹{material.total_price}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Grand Total */}
                <div className="text-right right mt-6 font-bold text-xl">
                    <p>Grand Total: ₹{data?.total}</p>
                </div>
            </div>


            <div className="flex justify-end mt-8">
                <button
                    className={`${showDetails ? "bg-red-600  hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"} text-white font-semibold py-2 px-4 rounded-md shadow-md transition-all duration-300`}
                    onClick={handleToggleView}
                >
                    {showDetails ? "Hide Receiving Details" : "View Receiving Details"}
                </button>
            </div>

            {message !== null && (
                <div className="mt-4 p-4 rounded-lg shadow-md bg-green-100 border-l-4 border-green-500">
                    <h1 className="text-lg font-semibold text-red-800 text-center">{message}</h1>
                </div>
            )}


            {showDetails && (
                <div className="mt-6">
                    <h2 className="text-2xl font-bold text-gray-800 border-b pb-4">Stock-In Details</h2>

                    {stockIn.map((stock, index) => (
                        <div key={index} className="mt-4 p-4 bg-gray-100 rounded-lg shadow">
                            <p><strong>Stock ID:</strong> {stock.id}</p>
                            <p><strong>Purchase Order ID:</strong> {stock.purchase_order.id}</p>
                            <p><strong>Challan Date:</strong> {stock.challan_date}</p>
                            <p><strong>Challan No:</strong> {stock.challan_no}</p>
                            <p><strong>Invoice Date:</strong> {stock.invoice_date}</p>
                            <p><strong>Invoice No:</strong> {stock.invoice_no}</p>
                            <p><strong>Total Bill Amount:</strong> ₹{stock.Total_Bill_Amount}</p>
                            <p><strong>Freight:</strong> ₹{stock.freight}</p>
                            <p><strong>Other Charges:</strong> ₹{stock.other_charges}</p>

                            {stock.RM_receive_deatils?.length > 0 && (
                                <div className="mt-4">
                                    <h3 className="text-xl font-semibold mb-2">Received Raw Materials</h3>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow">
                                            <thead className="bg-gray-200">
                                                <tr>
                                                    <th className="border px-4 py-2">Material ID</th>
                                                    <th className="border px-4 py-2">Item Name</th>
                                                    <th className="border px-4 py-2">Required Qty</th>
                                                    <th className="border px-4 py-2">Already Received</th>
                                                    <th className="border px-4 py-2">Received Qty</th>
                                                    <th className="border px-4 py-2">Extra Qty</th>
                                                    <th className="border px-4 py-2">Amount</th>
                                                    <th className="border px-4 py-2">CGST %</th>
                                                    <th className="border px-4 py-2">SGST %</th>
                                                    <th className="border px-4 py-2">IGST %</th>
                                                    <th className="border px-4 py-2">Total Price</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {stock.RM_receive_deatils.map((item, i) => (
                                                    <tr key={i} className="border-t">
                                                        <td className="border px-4 py-2 text-center">{item.raw_material_master.id}</td>
                                                        <td className="border px-4 py-2 text-center">{item.raw_material_master.item_name}</td>
                                                        <td className="border px-4 py-2 text-center">{item.required_qty}</td>
                                                        <td className="border px-4 py-2 text-center">{item.already_received}</td>
                                                        <td className="border px-4 py-2 text-center">{item.receive_qty}</td>
                                                        <td className="border px-4 py-2 text-center">{item.extra_qty}</td>
                                                        <td className="border px-4 py-2 text-center">₹{item.amount}</td>
                                                        <td className="border px-4 py-2 text-center">{item.cgst}</td>
                                                        <td className="border px-4 py-2 text-center">{item.sgst}</td>
                                                        <td className="border px-4 py-2 text-center">{item.igst}</td>
                                                        <td className="border px-4 py-2 text-center">₹{item.Total_price}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}


        </div>
    );
};

export default PurchaseOrderListView;

