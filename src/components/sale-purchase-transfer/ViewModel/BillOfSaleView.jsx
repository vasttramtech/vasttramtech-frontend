import axios from "axios";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { BounceLoader } from "react-spinners";


const BillOfSaleView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useSelector(state => state.auth);
  const [loading, setLoading] = useState(true);
  const [billOfSale, setBillOfSale] = useState(null);
  const [error, setError] = useState(null);
  const [data, setData] = useState();
  const [updating, setUpdating] = useState(null);
  const [isInternal, setIsInternal] = useState(null);
  const [type, setType] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log("Id", id);
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/custom-bill-of-sale/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        console.log("Bill of Sale Data: ", response.data);
        if (response.data) {

          setBillOfSale(response.data);
          if (response.data.internal_sales_order_entry != null) {
            setIsInternal(true);
            setData(response.data.internal_sales_order_entry);
            setType("internal");
          }
          else {
            setIsInternal(false);
            setData(response.data.sales_order_entry);
            setType("external");
          }
          console.log("Bill of Sale Data: ", response.data);
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



  const handlePrint = () => {
    const data = billOfSale;
    const salesOrderData = billOfSale?.sales_order_entry || billOfSale?.internal_sales_order_entry;

    const printWindow = window.open('', '_blank', 'width=900,height=650');
    if (!printWindow) return;

    const rawMaterialsRows = data?.bom_billOfSale?.rm?.map(entry => `
      <tr>
        <td>${entry.raw_material?.item_name}</td>
        <td>${entry.raw_material?.description}</td>
        <td>${entry.rm_qty}</td>
        <td>₹${entry.raw_material?.price_per_unit}</td>
        <td>₹${entry.rm_qty * entry.raw_material?.price_per_unit}</td>
      </tr>
    `).join('') || '';

    const orderItemsRows = Object.entries(salesOrderData?.order_items).map(([part, details]) => (
      `
        <tr>
          <td>${part}</td>
          <td>${details?.work || '-'}</td>
          <td>${details?.khaka || '-'}</td>
          <td>${details?.colour || '-'}</td>
          <td>${details?.others || '-'}</td>
          <td>${details?.measurement || '-'}</td>
        </tr>
      `
    )).join('') || '';


    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice - ${data?.documentId}</title>
          <style>
            * {
              box-sizing: border-box;
            }
  
            body {
              font-family: 'Arial', sans-serif;
              margin: 20px;
              padding: 20px;
              background: #fff;
              color: #000;
            }
  
            .invoice-container {
              width:600px;
              margin: 20px auto;
              padding: 20px;
              border: 1px solid #ccc;
              box-shadow: 0 0 10px rgba(0,0,0,0.15);
            }
  
            .company-header {
              text-align: center;
              margin-bottom: 40px;
            }
  
            .company-header h2 {
              margin: 0;
              font-size: 28px;
              color: #1d4ed8;
            }
  
            .company-header p {
              margin: 2px 0;
              font-size: 12px;
              color: #555;
            }
  
            .section {
              margin-bottom: 30px;
            }
  
            .section-title {
              font-weight: bold;
              font-size: 16px;
              margin-bottom: 10px;
              border-bottom: 1px solid #ccc;
              padding-bottom: 4px;
            }
  
            .info-grid {
              display: flex;
              justify-content: space-between;
            }
  
            .info-box {
              width: 48%;
              font-size: 14px;
            }
  
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 10px;
            }
  
            table th, table td {
              border: 1px solid #ccc;
              padding: 10px;
              text-align: left;
            }
  
            table th {
              background-color: #f0f0f0;
            }
  
            table td:last-child, table th:last-child {
              text-align: right;
            }
  
            .total-box {
              text-align: right;
              font-size: 16px;
              font-weight: bold;
              margin-top: 20px;
            }
  
            .signature-box {
              margin-top: 30px;
              text-align: left;
            }
  
            .footer {
              text-align: center;
              margin-top: 50px;
              font-size: 12px;
              color: #555;
              border-top: 1px dashed #ccc;
              padding-top: 10px;
            }
  
            @media print {
              body {
                margin: 0;
              }
  
              .invoice-container {
                border: none;
                box-shadow: none;
                padding: 0;
                width: 100%;
              }
            }
          </style>
        </head>
        <body onload="window.print();">
        <h3>Vasttram</h3>
          <div class="invoice-container">
            <div class="company-header">
              <h2>Bill of Sale</h2>
            </div>
  
            <div class="info-grid section">
              <div class="info-box">
                <p><strong>Invoice No:</strong> ${data?.documentId}</p>
                <p><strong>Date:</strong> ${data?.date}</p>
                <p><strong>Status:</strong> ${data?.billOfSales_status}</p>
              </div>
              <div class="info-box" style="text-align:right;">
                <p><strong>Seller:</strong> ${data?.seller_detail}</p>
                <p><strong>Purchaser:</strong> ${data?.purchaser_Details}</p>
              </div>
            </div>
  
            <div class="section">
              <div class="section-title">Order Information</div>
              <p><strong>Sales Order ID:</strong> ${data?.so_id}</p>
              <p><strong>Expected Delivery:</strong> ${data?.ex_date}</p>
              <p><strong>Remarks:</strong> ${data?.remarks}</p>
            </div>
  
            <div class="section">
              <div class="section-title">Design Details</div>
              <p><strong>Design No:</strong> ${data?.design?.design_number}</p>
              <p><strong>Description:</strong> ${data?.design?.description}</p>
            </div>
  
            <div class="section">
              <div class="section-title">Raw Materials Used</div>
              <table>
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Description</th>
                    <th>Qty</th>
                    <th>Rate</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${rawMaterialsRows}
                </tbody>
              </table>
            </div>


  
            <div class="section">
              <div class="section-title">Jobber Cost</div>
              <p><strong>Rate:</strong> ₹${data?.bom_billOfSale?.jobber_rate} / unit</p>
              <p><strong>Total:</strong> ₹${data?.bom_billOfSale?.total_jobber_cost_on_sfg}</p>
              <p><strong>Other Charges: </strong>₹${data?.other_charges}</p>
            </div>
  
            <div class="">
            </div>
  
            <div class="section total-box">
              Total Bill Amount: ₹${data?.Total_Bill_of_sales_Amount}
            </div>
  
            <div class="signature-box">
              <p><strong>Processed By:</strong> ${data?.processor?.name}</p>
              <p>Email: ${data?.processor?.email}</p>
              <p>Designation: ${data?.processor?.designation}</p>
            </div>
  
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.onafterprint = () => {
      printWindow.close();
    };
    printWindow.focus();
  };



  if (loading)
    return (
      <div className="absolute inset-0 flex justify-center items-center bg-opacity-50 bg-gray-200 z-10">
        <BounceLoader size={100} color={"#1e3a8a"} loading={loading} />
      </div>
    );


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

        <button
          onClick={handlePrint}
          className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-lg shadow-md transition duration-300 flex items-center gap-2"
        >
          Print Report
        </button>



      </div>

      <div id="printable-content" className="bg-white p-6 rounded-lg shadow-md max-w-6xl mx-auto my-8 print:shadow-none print:my-0 print:p-2 print-container text-sm font-sans text-gray-900">



        {/* Header Section */}
        <div className="border-b pb-4  mb-6">
          <h1 className="text-3xl font-bold text-center text-blue-800 border-b border-gray-300 pb-4">Bill of Sale</h1>
          <div className="grid grid-cols-2 gap-4 mt-4 text-gray-700">
            <div>
              <p className="font-bold text-start text-blue-800 text-lg"><strong>Bill Of Sale ID:</strong> {billOfSale?.id}</p>
              <p><strong>Date:</strong> {billOfSale?.date}</p>
              <p><strong>Status:</strong> {billOfSale?.billOfSales_status}</p>
            </div>
            <div className="">
              <p><strong>SO ID:</strong> {billOfSale?.so_id}</p>
              <p><strong>Expected Delivery:</strong> {billOfSale?.ex_date}</p>
            </div>
          </div>
        </div>

        {/* Seller and Purchaser */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div>
            <h2 className="text-lg font-semibold text-blue-700 mb-1">Seller Details</h2>
            <p>{billOfSale?.bom_billOfSale?.jobber?.jobber_name}</p>
            <p>{billOfSale?.bom_billOfSale?.jobber?.jobber_address}</p>
            <p>{billOfSale?.bom_billOfSale?.jobber?.state}</p>
            <p>{billOfSale?.bom_billOfSale?.jobber?.jobber_gstin}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-blue-700 mb-1">Purchaser Details</h2>
            <p>{billOfSale?.purchaser_Details?.comapny_name}</p>
            <p>{billOfSale?.purchaser_Details?.gst_no}</p>
            <p>{billOfSale?.purchaser_Details?.address}</p>
            <p>{billOfSale?.purchaser_Details?.phone}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-blue-700 mb-1">Job Detail</h2>
            <p>Jobber Name : {billOfSale?.bom_billOfSale?.jobber?.jobber_name}</p>
            <p>Jobber Code: {billOfSale?.bom_billOfSale?.jobber?.jobber_code}</p>
            <p className="font-semibold text-lg">Process: {billOfSale?.bom_billOfSale?.jobber?.work_type}</p>
          </div>
        </div>




        {/* Design Info */}
        {billOfSale?.design && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-blue-700 mb-1">Design Details</h2>
            <p><strong>Design No:</strong> {billOfSale.design.design_number}</p>
            <p><strong>Description:</strong> {billOfSale.design.description}</p>
          </div>
        )}

        {/* Remarks and Notes */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-blue-700 mb-1">Remarks & Job Notes</h2>
          <p className="mb-1"><strong>Remarks:</strong> {billOfSale?.remarks}</p>
          <p><strong>Notes:</strong> {billOfSale?.job_note}</p>
        </div>




        {/* Raw Materials Table */}
        {billOfSale?.bom_billOfSale?.rm?.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-blue-700 mb-3">Raw Materials Used</h2>
            <table className="min-w-full border border-gray-200">
              <thead className="bg-gray-100 text-left text-blue-800 text-sm">
                <tr>
                  <th className="border px-4 py-2">Item</th>
                  <th className="border px-4 py-2">Description</th>
                  <th className="border px-4 py-2">Quantity</th>
                </tr>
              </thead>
              <tbody>
                {billOfSale.bom_billOfSale.rm.map((entry, idx) => (
                  <tr key={idx} className="border-t text-sm">
                    <td className="px-4 py-2">{entry.raw_material?.item_name}</td>
                    <td className="px-4 py-2">{entry.raw_material?.description}</td>
                    <td className="px-4 py-2">{entry.rm_qty}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}




        {/* Jobber Cost */}
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
            {billOfSale?.bom_billOfSale?.bom_detail?.map((item, index) => (
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
                  {item?.jobber_rate || 0}
                </td>
                <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                  {item?.total || 0}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <hr className="w-full border-t-2 border-gray-300 my-2" />

        <div className="flex justify-end mb-4">
          <p className="text-lg font-semibold">
            Total Cost: ₹
            {billOfSale.bom_billOfSale.total_jobber_cost_on_sfg || 0}
          </p>
        </div>



        {/* Totals Section */}
        <div className="mt-6 border-t pt-4">
          <p><strong>Other Charges:</strong> ₹{billOfSale?.other_charges}</p>
          <p className="text-xl font-bold text-gray-900 mt-2">
            Total Bill Amount: ₹{billOfSale?.Total_Bill_of_sales_Amount}
          </p>
        </div>

        {/* Processor Info */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-blue-700 mb-1">Processed By</h2>
          <p><strong>Name:</strong> {billOfSale.processor?.name}</p>
          <p><strong>Email:</strong> {billOfSale.processor?.email}</p>
          <p><strong>Designation:</strong> {billOfSale.processor?.designation}</p>
        </div>


      </div>

    </div>
  )
};

export default BillOfSaleView;