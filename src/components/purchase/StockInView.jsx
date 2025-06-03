import axios from 'axios';
import { ArrowLeft } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { BounceLoader } from 'react-spinners';

const StockInView = () => {

    const { id } = useParams();
    console.log("id: ", id);
    const navigate = useNavigate();
    const [stockDetail, setStockDetail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { token } = useSelector(state => state.auth);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await axios.get(
                    `${process.env.REACT_APP_BACKEND_URL}/api/get-stock-details/${id}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                console.log("response of raw material view : ", response)
                if (response.data) {
                    setStockDetail(response.data);
                } else {
                    setError("No raw material data found.");
                }
            } catch (error) {
                console.error("Error fetching raw material data:", error);
                setError("Failed to fetch raw material data.");
                if (error.response?.status === 401) {
                    navigate("/login");
                }
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, navigate, token]);
    console.log("stockDetail: ", stockDetail);

    const handlePrint = () => {
        const printContents = document.getElementById("printable-content").innerHTML;
        const printWindow = window.open("", "", "height=600,width=800");

        printWindow.document.write(`
    <html>
      <head>
        <title>Stock In Print View</title>
        <style>
          body {
            font-family: sans-serif;
            margin: 20px;
            color: #1a202c;
          }
          h1, h2 {
            color: #1e3a8a;
            border-bottom: 1px solid #ccc;
            padding-bottom: 8px;
          }
          .section {
            margin-bottom: 24px;
          }
          .label {
            font-weight: bold;
            margin-right: 4px;
          }
          .grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 16px;
          }
          th, td {
            border: 1px solid #ccc;
            padding: 8px;
            font-size: 14px;
            text-align: left;
          }
          .img{
            width: 100px;
            height: 100px;
          }
          th {
            background-color: #f3f4f6;
          }
        </style>
      </head>
      <body>
        ${printContents}
      </body>
    </html>
  `);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 500);
    };



    if (loading) {
        return <div className="absolute inset-0 flex justify-center items-center bg-opacity-50 bg-gray-200 z-10">
            <BounceLoader size={100} color={"#1e3a8a"} loading={loading} />
        </div>;
    }

    return (

        <div>

            <div className="bg-blue-700 text-white p-4 rounded-t-lg mb-6 flex justify-between items-center print:bg-blue-700">
                <button
                    className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-black rounded-lg transition"
                    onClick={() => navigate(-1)}
                >
                    <ArrowLeft size={18} />
                    Back
                </button>

                <button className='flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition' onClick={handlePrint}>
                    Print
                </button>

            </div>

            <div id="printable-content" className="bg-white p-6 rounded-lg shadow-md max-w-6xl mx-auto my-8 print:shadow-none print:my-0 print:p-2 text-sm font-sans text-gray-900">

                {/* Header Section */}
                <div className="border-b pb-4 mb-6">
                    <h1 className="text-3xl font-bold text-center text-blue-800 border-b border-gray-300 pb-4">Stock In Details</h1>
                    <div className="grid grid-cols-2 gap-4 mt-4 text-gray-700">
                        <div>
                            <p><strong>Date:</strong> {stockDetail?.date}</p>
                            <p><strong>Challan No:</strong> {stockDetail?.challan_no}</p>
                            <p><strong>Challan Date:</strong> {stockDetail?.challan_date}</p>
                        </div>
                        <div>
                            <p><strong>Invoice No:</strong> {stockDetail?.invoice_no}</p>
                            <p><strong>Invoice Date:</strong> {stockDetail?.invoice_date}</p>
                            <p><strong>Status:</strong> {stockDetail?.purchase_order?.purchase_order_status}</p>
                        </div>
                    </div>
                </div>

                {/* Supplier Details */}
                <div className="mb-6">
                    <h2 className="text-lg font-semibold text-blue-700 mb-2">Supplier Details</h2>
                    <p><strong>Name:</strong> {stockDetail?.purchase_order?.supplier?.company_name}</p>
                    <p><strong>Address:</strong> {stockDetail?.purchase_order?.supplier?.address}</p>
                    <p><strong>State:</strong> {stockDetail?.purchase_order?.supplier?.state}</p>
                    <p><strong>GSTIN:</strong> {stockDetail?.purchase_order?.supplier?.gstin_number}</p>
                    <p><strong>Contact:</strong> {stockDetail?.purchase_order?.supplier?.contact_number}</p>
                    <p><strong>Email:</strong> {stockDetail?.purchase_order?.supplier?.email_id}</p>
                </div>

                {/* Raw Material Items */}
                <div className="mb-6">
                    <h2 className="text-lg font-semibold text-blue-700 mb-2">Raw Material Details</h2>
                    <table className="w-full text-left border border-gray-300 text-xs">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-2 border">Item Name</th>
                                <th className="p-2 border">Required Qty</th>
                                <th className="p-2 border">Already Received</th>
                                <th className="p-2 border">Newly Received</th>
                                <th className="p-2 border">Amount</th>
                                <th className="p-2 border">Total Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stockDetail?.RM_receive_deatils?.map((item, index) => (
                                <tr key={index}>
                                    <td className="p-2 border">{item.raw_material_master?.item_name}</td>
                                    <td className="p-2 border">{item.required_qty}</td>
                                    <td className="p-2 border">{item.already_received}</td>
                                    <td className="p-2 border">{item.receive_qty}</td>
                                    <td className="p-2 border">₹{item.amount}</td>
                                    <td className="p-2 border">₹{item.Total_price}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Images Section */}
                <div className='grid grid-cols-2 mb-5'>
                    
                {stockDetail?.upload_challan && (
                    <div className="mt-8 img">
                        <h2 className="text-lg font-semibold text-blue-700 mb-2">Challan Image </h2>
                       {
                        stockDetail?.upload_challan?.map((img, idx) => (
                             <img
                             key={idx}
                            src={img?.url}
                            alt="Challan Image"
                            className="w-[200px] h-auto rounded border shadow"
                        />
                        ))
                       }
                    </div>
                )}

                {/* Image 2 Section */}
                {stockDetail?.upload_invoice && (
                    <div className="mt-8 img">
                        <h2 className="text-lg font-semibold text-blue-700 mb-2">Invoice Image</h2>
                        {
                            stockDetail?.upload_invoice?.map((img, idx) => (
                                <img
                                    key={idx}
                                    src={img?.url}
                                    alt="Invoice Image"
                                    className="w-[200px] h-auto rounded border shadow"
                                />
                            ))
                        }
                    </div>
                )}

                </div>


                {/* Charges Summary */}
                <div className="grid grid-cols-2 gap-4 mt-6">
                    <div>
                        <p><strong>Freight Charges:</strong> ₹{stockDetail?.freight}</p>
                        <p><strong>Other Charges:</strong> ₹{stockDetail?.other_charges}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-lg font-bold"><strong>Total Bill Amount:</strong> ₹{stockDetail?.Total_Bill_Amount}</p>
                    </div>
                </div>

                {/* Remark Section */}
                {stockDetail?.remark && (
                    <div className="mt-6">
                        <h2 className="text-lg font-semibold text-blue-700 mb-1">Remark</h2>
                        <p className="text-gray-700">{stockDetail.remark}</p>
                    </div>
                )}

            </div>



        </div>
    )
}

export default StockInView
