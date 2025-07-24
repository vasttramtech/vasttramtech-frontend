import axios from "axios";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { BounceLoader } from "react-spinners";


const BillOfPurchaseView = () => {
  const { id } = useParams();
  // console.log("ID: ", id);

  const navigate = useNavigate();
  const { token } = useSelector(state => state.auth);
  const [loading, setLoading] = useState(true);
  const [billOfPurchaseData, setBillOfPurchaseData] = useState(null);

  const [billOfSalesData, setBillOfSalesData] = useState(null);
  const [salesOrderData, setSalesOrderData] = useState(null);


  const [error, setError] = useState(null);
  const [showData, setShowData] = useState(false);
  const [updating, setUpdating] = useState(null);
  const [isInternal, setIsInternal] = useState(null);
  const [type, setType] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/bill-of-purchase/get-by-id/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("Bill of Pruchase Data: ", response.data);
        if (response.data) {

          setBillOfPurchaseData(response.data);
          setBillOfSalesData(response.data.billOfSale);
          if (response.data.billOfSale.internal_sales_order_entry != null) {
            setIsInternal(true);
            setSalesOrderData(response.data.billOfSale.internal_sales_order_entry);
            setType("internal");
          }
          else {
            setIsInternal(false);
            setSalesOrderData(response.data.billOfSale.sales_order_entry);
            setType("external");
          }
          // console.log("Bill of Pruchase Data: ", response.data);
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
    const billWindow = window.open('', '_blank', 'width=800,height=1000');

    if (!billWindow) {
      return;
    }
    const billContent = `
        <html>
          <head>
            <title>Invoice - ${billOfPurchaseData?.documentId}</title>
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
                width: 700px;
                margin: auto;
                padding: 30px;
                border: 1px solid #ccc;
                box-shadow: 0 0 10px rgba(0,0,0,0.1);
              }
        
              .header {
                text-align: center;
                margin-bottom: 30px;
              }
        
              .header h2 {
                margin: 0;
                font-size: 28px;
                color: #1d4ed8;
              }
        
              .header p {
                font-size: 13px;
                margin: 2px 0;
                color: #555;
              }
        
              .info-grid {
                display: flex;
                justify-content: space-between;
                margin-bottom: 30px;
              }
        
              .info-box {
                width: 48%;
                font-size: 14px;
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
        
              table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 10px;
              }
        
              table th, table td {
                border: 1px solid #ccc;
                padding: 10px;
                text-align: left;
                font-size: 13px;
              }
        
              table th {
                background-color: #f9f9f9;
              }
        
              .total-box {
                text-align: right;
                font-size: 16px;
                font-weight: bold;
              }
        
              .signature-box {
                margin-top: 30px;
                font-size: 13px;
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
              <div class="header">
                <h2>Bill of Purchase</h2>
              </div>
        
              <div class="info-grid">
                <div class="info-box">
                  <p><strong>Invoice No:</strong> ${billOfPurchaseData?.documentId}</p>
                  <p><strong>Date:</strong> ${billOfPurchaseData?.date}</p>
                  <p><strong>Status:</strong> ${billOfSalesData?.billOfSales_status}</p>
                </div>
                <div class="info-box" style="text-align:right;">
                  <p><strong>Seller:</strong> ${billOfPurchaseData?.seller_detail}</p>
                  <p><strong>Purchaser:</strong> ${billOfPurchaseData?.purchaser_Details}</p>
                </div>
              </div>
        
              <div class="section">
                <div class="section-title">Raw Materials Used</div>
                <table>
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Description</th>
                      <th>Qty</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${billOfPurchaseData?.bom_billOfPurchase?.rm?.map(entry => `
                      <tr>
                        <td>${entry.raw_material.item_name}</td>
                        <td>${entry.raw_material.description}</td>
                        <td>${entry.rm_qty}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
        
              <div class="section">
                <div class="section-title">Semi-Finished Goods</div>
                <table>
                  <thead>
                    <tr>
                      <th>SFG ID</th>
                      <th>Group</th>
                      <th>Item Name</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>${billOfPurchaseData?.bom_billOfPurchase?.semi_finished_goods?.semi_finished_goods_id}</td>
                      <td>${billOfPurchaseData?.bom_billOfPurchase?.semi_finished_goods?.group?.group_name}</td>
                      <td>${billOfPurchaseData?.bom_billOfPurchase?.semi_finished_goods?.semi_finished_goods_name}</td>
                      <td>${billOfPurchaseData?.bom_billOfPurchase?.semi_finished_goods?.description}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
        
              <div class="section">
                <div class="section-title">Jobber Information</div>
                <p><strong>Name:</strong> ${billOfPurchaseData?.bom_billOfPurchase?.jobber?.jobber_name}</p>
                <p><strong>Work Type:</strong> ${billOfPurchaseData?.bom_billOfPurchase?.jobber?.work_type}</p>
                <p><strong>Rate:</strong> ₹${billOfPurchaseData?.bom_billOfPurchase?.jobber_rate}</p>
                <p><strong>Total Cost:</strong> ₹${billOfPurchaseData?.bom_billOfPurchase?.total_jobber_cost_on_sfg}</p>
              </div>
        
              <div class="section">
                <div class="section-title">Other Charges</div>
                <p>₹${billOfPurchaseData?.other_charges || 0}</p>
              </div>
        
              <div class="total-box">
                Total Bill Amount: ₹${billOfPurchaseData?.Total_Bill_Amount_Bop}
              </div>
        
              <div class="signature-box">
                <p><strong>Processed By:</strong> ${billOfPurchaseData?.processor?.name}</p>
                <p>Email: ${billOfPurchaseData?.processor?.email}</p>
                <p>Designation: ${billOfPurchaseData?.processor?.designation}</p>
              </div>
       
            </div>
          </body>
        </html>
        `;


    billWindow.document.open();
    billWindow.document.write(billContent);
    billWindow.document.close();
    billWindow.onafterprint = () => {
      billWindow.close();
    };
    billWindow.focus();
  };


  if (loading)
    return (
      <div className="absolute inset-0 flex justify-center items-center bg-opacity-50 bg-gray-200 z-10">
        <BounceLoader size={100} color={"#1e3a8a"} loading={loading} />
      </div>
    );


  return (


    <div className="bg-white p-10 rounded-md shadow-lg max-w-5xl mx-auto my-10 print:p-4 print:shadow-none">
      {/* Company Header */}

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

      <div className="text-center border-b-2 pb-4 mb-6">
        <h1 className="text-3xl font-bold text-blue-800 uppercase">Bill Of Purchase </h1>

      </div>

      {/* Bill Info */}
      <div className="flex justify-between mb-6 text-sm">
        <div>
          <p className="font-bold text-start text-blue-800 text-lg"><strong>Bill Of Purchase ID:</strong> {billOfPurchaseData?.id}</p>
          <p><strong>Date:</strong> {billOfPurchaseData?.date}</p>
          <p><strong>SO ID:</strong> {billOfPurchaseData?.so_id}</p>
          <p><strong>Reference Bill:</strong> {billOfPurchaseData?.reference_bill}</p>
        </div>
        <div>
          {/* <p><strong>Status:</strong> {billOfSalesData?.billOfSales_status}</p> */}
          <p><strong>Clear Date:</strong> {billOfPurchaseData?.clearDate}</p>
        </div>
      </div>

      {/* Parties Info */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <h3 className="font-semibold text-blue-700">Seller</h3>
          <p>{billOfPurchaseData?.bom_billOfPurchase?.jobber?.jobber_name}</p>
          <p>{billOfPurchaseData?.bom_billOfPurchase?.jobber?.jobber_address}</p>
          <p>{billOfPurchaseData?.bom_billOfPurchase?.jobber?.state}</p>
          <p>{billOfPurchaseData?.bom_billOfPurchase?.jobber?.jobber_gstin}</p>
        </div>
        <div>
          <h3 className="font-semibold text-blue-700">Purchaser</h3>
          <p>{billOfPurchaseData?.purchaser_Details?.comapny_name}</p>
          <p>{billOfPurchaseData?.purchaser_Details?.gst_no}</p>
          <p>{billOfPurchaseData?.purchaser_Details?.address}</p>
          <p>{billOfPurchaseData?.purchaser_Details?.phone}</p>
        </div>
      </div>

      {/* Order Info */}
      <div className="mb-6">
        <h3 className="text-blue-700 font-semibold border-b pb-2 mb-2">Order Information</h3>
        {/* <p><strong>SO ID:</strong> {billOfPurchaseData?.so_id}</p>
        <p><strong>Expected Delivery:</strong> {billOfPurchaseData?.ex_date}</p> */}
        <p><strong>Design:</strong> {billOfPurchaseData?.design}</p>
        <p><strong>BOP Remarks:</strong> {billOfPurchaseData?.remarks}</p>
      </div>

      {/* Raw Materials */}
      {/* <div className="mb-6">
        <h3 className="text-blue-700 font-semibold border-b pb-2 mb-2">Raw Materials</h3>
        <table className="w-full border border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-2 py-1 text-left">Item</th>
              <th className="border px-2 py-1 text-left">Description</th>
              <th className="border px-2 py-1 text-left">Qty</th>
            </tr>
          </thead>
          <tbody>
            {billOfPurchaseData?.bom_billOfPurchase?.rm?.map((entry, index) => (
              <tr key={index}>
                <td className="border px-2 py-1">{entry.raw_material.item_name}</td>
                <td className="border px-2 py-1">{entry.raw_material.description}</td>
                <td className="border px-2 py-1">{entry.rm_qty}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div> */}
      {/* Semi Finished Goods  */}
      {/* <div className="mb-6">
        <h3 className="text-blue-700 font-semibold border-b pb-2 mb-2">Semi Finished Goods</h3>
        <table className="w-full border border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-2 py-1 text-left">SFG Id</th>
              <th className="border px-2 py-1 text-left">Group</th>
              <th className="border px-2 py-1 text-left">Item Name</th>
              <th className="border px-2 py-1 text-left">Description</th>

            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border px-2 py-1">{billOfPurchaseData?.bom_billOfPurchase?.semi_finished_goods?.semi_finished_goods_id}</td>
              <td className="border px-2 py-1">{billOfPurchaseData?.bom_billOfPurchase?.semi_finished_goods?.group.group_name}</td>
              <td className="border px-2 py-1">{billOfPurchaseData?.bom_billOfPurchase?.semi_finished_goods?.semi_finished_goods_name}</td>
              <td className="border px-2 py-1">{billOfPurchaseData?.bom_billOfPurchase?.semi_finished_goods?.description}</td>
            </tr>
          </tbody>
        </table>
      </div> */}

      <table className="w-full mb-4 border border-gray-300 rounded-lg overflow-hidden">
        <thead className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-900">
          <tr>
            <th className="px-6 py-4 text-left font-semibold">#</th>
            <th className="px-6 py-4 text-left font-semibold">Semi-Finished Goods</th>
            <th className="px-6 py-4 text-left font-semibold">Color</th>
            <th className="px-6 py-4 text-left font-semibold">Jobber Rate</th>
            <th className="px-6 py-4 text-left font-semibold">Quantity</th>
            <th className="px-6 py-4 text-left font-semibold">Already Received</th>
            <th className="px-6 py-4 text-left font-semibold">Receive Qty</th>
            <th className="px-6 py-4 text-left font-semibold">Total</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {billOfPurchaseData.bom_billOfPurchase?.bom_detail.map((item, index) => {

            return (
              <tr key={item.id} className="hover:bg-blue-50 transition">
                <td className="px-6 py-4 text-gray-700">{index + 1}</td>
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                  {item?.semi_finished_goods?.semi_finished_goods_name || 'N/A'}
                </td>
                <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                  {item?.color?.color_name || 'N/A'}
                </td>
                <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                  {item?.jobber_rate || 0}
                </td>
                <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                  {item?.total_qty || 0}
                </td>
                <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                  {item?.already_received}
                </td>
                <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                  {item?.receive_qty}
                </td>
                <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                  {item?.total}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <hr className="w-full border-t-2 border-gray-300 my-2" />

      <div className="flex justify-end">
        <div className="text-lg font-semibold text-blue-900">
          Total Cost: ₹{billOfPurchaseData.bom_billOfPurchase?.total_jobber_cost_on_sfg}
        </div>
      </div>

      {/* Jobber Info */}
      <div className="mb-6">
        <h3 className="text-blue-700 font-semibold border-b pb-2 mb-2">Jobber Details</h3>
        <p><strong>Name:</strong> {billOfPurchaseData?.bom_billOfPurchase?.jobber?.jobber_name}</p>
        <p><strong>GSTIN:</strong> {billOfPurchaseData?.bom_billOfPurchase?.jobber?.jobber_gstin}</p>
        <p><strong>Work Type:</strong> {billOfPurchaseData?.bom_billOfPurchase?.jobber?.work_type}</p>
        <p><strong>Total Cost:</strong> ₹{billOfPurchaseData?.bom_billOfPurchase?.total_jobber_cost_on_sfg}</p>
      </div>

      {/* Processor */}
      <div className="mb-6">
        <h3 className="text-blue-700 font-semibold border-b pb-2 mb-2">Processed By</h3>
        <p><strong>Name:</strong> {billOfPurchaseData?.processor?.name}</p>
        <p><strong>Email:</strong> {billOfPurchaseData?.processor?.email}</p>
        <p><strong>Designation:</strong> {billOfPurchaseData?.processor?.designation}</p>
      </div>

      {/* Other Charges + Total */}
      <div className="text-right border-t pt-4">
        <p className="mb-2"><strong>Other Charges:</strong> ₹{billOfPurchaseData?.other_charges || 0}</p>
        <p className="text-xl font-bold"><strong>Total Bill Amount:</strong> ₹{billOfPurchaseData?.Total_Bill_Amount_Bop}</p>
      </div>


    </div>


  )
};

export default BillOfPurchaseView;