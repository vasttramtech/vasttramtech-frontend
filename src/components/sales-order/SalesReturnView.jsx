import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft, FaPrint } from "react-icons/fa";
import { BounceLoader } from "react-spinners";
import { useSelector } from "react-redux";

const SalesReturnView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [returnData, setReturnData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { token } = useSelector(state => state.auth);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_BACKEND_URL}/api/sales-order-returns/${id}/details`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                console.log(response.data)
                if (response.data) setReturnData(response.data);
                else setError("No data found.");
            } catch (err) {
                setError("Failed to fetch data.");
                if (err.response?.status === 401) navigate("/login");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, navigate, token]);

    const handlePrint = () => window.print();

    if (loading) {
        return (
            <div className="absolute inset-0 flex justify-center items-center bg-white z-10">
                <BounceLoader size={80} color="#2563eb" />
            </div>
        );
    }

    if (error) {
        return <div className="text-center text-red-500 mt-10">{error}</div>;
    }

    const {
        so_id,
        return_date,
        return_type,
        bill_No,
        cn_no,
        bill_not_receive,
        Goods,
        remarks,
        customer_master,
        internal_sales_order_entry,
        sales_oder_entry,
        return_items,
        state,
        transporter,
    } = returnData || {};

    const salesOrder = internal_sales_order_entry || sales_oder_entry;
    const order_items = salesOrder?.order_items;

    const displayItems =
        return_type === "SO Return"
            ? Object.entries(order_items || {}).map(([key, value]) => ({ key, ...value }))
            : return_items || [];

    return (
        <div className="max-w-5xl mx-auto mt-6 bg-white p-8 rounded-2xl shadow-md border border-gray-200 print:p-2">
            <style>{`@media print { .no-print { display: none; }}`}</style>

            <div className="flex justify-between items-center no-print mb-6">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-blue-600 font-medium hover:text-blue-800">
                    <FaArrowLeft /> Back
                </button>
                <button onClick={handlePrint} className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700">
                    <FaPrint /> Print
                </button>
            </div>

            <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Sales Return Summary</h1>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 mb-6">
                <div><span className="font-semibold">Return ID:</span> {id}</div>
                <div><span className="font-semibold">SO ID:</span> {so_id}</div>
                <div><span className="font-semibold">Return Date:</span> {return_date}</div>
                <div><span className="font-semibold">Return Type:</span> {return_type}</div>
                <div><span className="font-semibold">Bill No:</span> {bill_No}</div>
                <div><span className="font-semibold">CN No:</span> {cn_no}</div>
                <div><span className="font-semibold">Bill Not Received:</span> {bill_not_receive ? "Yes" : "No"}</div>
                <div><span className="font-semibold">Goods:</span> {Goods}</div>
                <div><span className="font-semibold">State:</span> {state}</div>
                <div><span className="font-semibold">Remarks:</span> {remarks}</div>
                <div><span className="font-semibold">Transporter:</span> {transporter}</div>
            </div>

            <h2 className="text-lg font-semibold text-gray-800 mb-2">Customer Info</h2>
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 mb-6">
                <div><strong>Name:</strong> {customer_master?.company_name}</div>
                <div><strong>Customer ID:</strong> {customer_master?.customer_id}</div>
                <div><strong>Contact:</strong> {customer_master?.contact_number}</div>
                <div><strong>Email:</strong> {customer_master?.email_id}</div>
                <div><strong>GSTIN:</strong> {customer_master?.gstin_number}</div>
                <div><strong>State:</strong> {customer_master?.state}</div>
                <div><strong>Address:</strong> {customer_master?.billing_address}</div>
            </div>

            <h2 className="text-lg font-semibold text-gray-800 mb-2">Returned Items</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-300 text-sm">
                    <thead className="bg-gray-100 text-gray-800">
                        <tr>
                            <th className="border px-2 py-1">Key</th>

                            <th className="border px-2 py-1">Colour</th>
                            <th className="border px-2 py-1">Design/Khaka</th>
                            <th className="border px-2 py-1">Measurement</th>
                            <th className="border px-2 py-1">Work</th>
                            <th className="border px-2 py-1">Others</th>
                            {return_type === "Alter Items" && (
                                <>
                                    <th className="border px-2 py-1">Sale Qty</th>
                                    <th className="border px-2 py-1">Alter Qty</th>
                                </>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {displayItems.map((item, idx) => (
                            <tr key={idx} className="odd:bg-white even:bg-gray-50">
                                <td className="border px-2 py-1 text-center">{item.key || ""}</td>
                                <td className="border px-2 py-1 text-center">{item.colour || item.value?.colour || ""}</td>
                                <td className="border px-2 py-1 text-center">{item.khaka || item.value?.khaka || ""}</td>
                                <td className="border px-2 py-1 text-center">{item.measurement || item.value?.measurement || ""}</td>
                                <td className="border px-2 py-1 text-center">{item.work || item.value?.work || ""}</td>
                                <td className="border px-2 py-1 text-center">{item.others || item.value?.others || ""}</td>
                                {return_type === "Alter Items" && (
                                    <>
                                        <td className="border px-2 py-1 text-center">{item.saleQty || item.qty || ""}</td>
                                        <td className="border px-2 py-1 text-center">{item.alterQty || ""}</td>
                                    </>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SalesReturnView;
