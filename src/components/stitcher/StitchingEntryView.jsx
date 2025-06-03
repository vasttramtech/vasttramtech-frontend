import axios from "axios";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { BounceLoader } from "react-spinners";

const StitchingEntryView = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [stitchingData, setStitchingData] = useState(null);

  const [salesOrderData, setSalesOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useSelector(state => state.auth);

  const fetchStitchingEntry = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/stitching-entries/details/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("View Data: ", response.data);

      setStitchingData(response.data.data);
      const salesOrderData = response.data.data.internal_sales_order_entry || response.data.data.sales_order_entry;
      setSalesOrderData(salesOrderData);

    } catch (error) {
      console.error("Error fetching Stitching Entry Data:", error);
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
    fetchStitchingEntry();
  }, [token]);


  const handlePrint = () => {
    const data = stitchingData;
    const printWindow = window.open('', '_blank', 'width=900,height=650');
    if (!printWindow) return;

    const printContent = `
    <html>
      <head>
        <title>Stitching Info - ${data?.id || "N/A"}</title>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            padding: 30px;
            color: #1f2937;
          }
          h1 {
            text-align: center;
            margin-bottom: 30px;
          }
          h2 {
            color: #1d4ed8;
            border-bottom: 2px solid #1d4ed8;
            padding-bottom: 5px;
            margin-top: 15px;
          }
          .section {
            margin-bottom: 15px;
            padding: 20px;
            border: 1px solid #e5e7eb;
            border-radius: 10px;
            background-color: #f9fafb;
          }
          .grid {
            display: flex;
            flex-wrap: wrap;
            gap: 15px;
          }
          .grid > div {
            flex: 1 1 45%;
          }
          .label {
            font-size: 13px;
            color: #6b7280;
          }
          .value {
            font-weight: 600;
            font-size: 14px;
            margin-bottom: 10px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
          }
          th, td {
            border: 1px solid #d1d5db;
            padding: 10px;
            font-size: 13px;
          }
          th {
            background-color: #e5e7eb;
            text-transform: uppercase;
            color: #1e3a8a;
          }
          .page-break {
            page-break-after: always;
          }
          @media print {
            .section {
              page-break-inside: avoid;
            }
          }
        </style>
      </head>
      <body onload="window.print()">
        <h3>Vasttram</h3>
        <h1>Stitching Order Invoice</h1>

        <!-- Order Info -->
        <div class="section">
          <h2>Order Information</h2>
          <div class="grid">
            <div><div class="label">SO ID</div><div class="value">${data?.so_id || "N/A"}</div></div>
            <div><div class="label">Stitching ID</div><div class="value">${data?.id || "N/A"}</div></div>
            <div><div class="label">Order Date</div><div class="value">${data?.date || "N/A"}</div></div>
            <div><div class="label">Due Date</div><div class="value">${data?.due_date || "N/A"}</div></div>
            <div>
              <div class="label">Processor</div>
              <div class="value">
                ${data?.processor?.name || "N/A"}<br/>
                ${data?.processor?.designation || ""}<br/>
                ${data?.processor?.email || ""}
              </div>
            </div>
            <div><div class="label">Stitch Status</div><div class="value">${data?.stitch_status || "N/A"}</div></div>
          </div>
        </div>

        <!-- Additional Info -->
        <div class="section">
          <h2>Additional Information</h2>
          <div class="grid">
            <div><div class="label">Design Group</div><div class="value">${data?.design_group || "N/A"}</div></div>
            <div><div class="label">Design Number</div><div class="value">${data?.design_number || "N/A"}</div></div>
            <div><div class="label">Remarks</div><div class="value">${data?.remarks || "N/A"}</div></div>
          </div>
        </div>

        <!-- Stitcher Info -->
        <div class="section">
          <h2>Stitcher Details</h2>
          <table>
            <tr>
              <th>Stitching ID</th>
              <th>Name</th>
              <th>Type</th>
              <th>Code</th>
              <th>Remarks</th>
              <th>Address</th>
            </tr>
            <tr>
              <td>${data?.stitcher?.id || "N/A"}</td>
              <td>${data?.stitcher?.stitcher_name || "N/A"}</td>
              <td>${data?.stitcher?.stitcher_type || "N/A"}</td>
              <td>${data?.stitcher?.stitcher_code || "N/A"}</td>
              <td>${data?.stitcher?.remarks || "N/A"}</td>
              <td>${data?.stitcher?.address || "N/A"}</td>
            </tr>
          </table>
        </div>

        <!-- Order Items -->
        ${data?.order_Items?.length ? `
        <div class="section">
          <h2>Order Items</h2>
          <table>
            <thead>
              <tr>
                <th>Group</th>
                <th>Colour</th>
                <th>Design/Khaka</th>
                <th>Measurement</th>
                <th>Work</th>
                <th>Others</th>
                <th>Qty Required</th>
                <th>Already Processed</th>
                <th>Process Qty</th>
              </tr>
            </thead>
            <tbody>
              ${data.order_Items.map(item => `
                <tr>
                  <td>${item?.group || ""}</td>
                  <td>${item?.color || ""}</td>
                  <td>${item?.Khaka || ""}</td>
                  <td>${item?.measurement || ""}</td>
                  <td>${item?.work || ""}</td>
                  <td>${item?.others || ""}</td>
                  <td>${item?.qty_required || 0}</td>
                  <td>${item?.already_processed ?? 0}</td>
                  <td>${item?.process_qty ?? 0}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>` : ""}

        <!-- BOM -->
        ${data?.bom?.length ? `
        <div class="section">
          <h2>BOM Details</h2>
          <table>
            <thead>
              <tr>
                <th>BOM ID</th>
                <th>SFG ID</th>
                <th>SFG Name</th>
                <th>Colour</th>
                <th>Processed Qty</th>
              </tr>
            </thead>
            <tbody>
              ${data.bom.map(item => `
                <tr>
                  <td>${item?.bom_id || ""}</td>
                  <td>${item?.sfg?.semi_finished_goods_id || ""}</td>
                  <td>${item?.sfg?.semi_finished_goods_name || ""}</td>
                  <td>${item?.color?.color_name || ""}</td>
                  <td>${item?.processed_qty ?? 0}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>` : ""}

      </body>
    </html>
  `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    printWindow.onafterprint = () => {
      printWindow.close();
    };
  };


  if (loading) {
    return (
      <div className="absolute inset-0 flex justify-center items-center bg-opacity-50 bg-gray-200 z-10">
        <BounceLoader size={100} color={"#1e3a8a"} loading={loading} />
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-6xl mx-auto my-8 print:shadow-none print:my-0 print:p-2 print-container">
      {/* Header Section */}
      <div className="bg-blue-700 text-white p-4 rounded-t-lg mb-6 flex justify-between items-center print:bg-blue-700">
        <button
          className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-black rounded-lg transition"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={18} />
          Back
        </button>
        <h1 className="text-2xl font-bold">
          Stitching Entry Details
        </h1>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
          Print
        </button>
      </div>

      {/* Order Details Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold text-blue-700 mb-3 border-b border-blue-200 pb-2">
            Order Information
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-bold text-start text-blue-800 text-lg">Stitching ID</p>
              <p className="font-bold text-start text-blue-800 text-lg">{stitchingData?.id || "N/A"}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">SO ID</p>
              <p className="font-medium">{stitchingData?.so_id || "N/A"}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Order Date</p>
              <p className="font-medium">{stitchingData?.date}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Due Date</p>
              <p className="font-medium">{stitchingData?.due_date}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Processor</p>
              <p className="font-medium">{stitchingData?.processor?.name}</p>
              <p className="font-medium">{stitchingData?.processor?.designation}</p>
              <p className="font-medium">{stitchingData?.processor?.email}</p>
            </div>

            <div>
              <p className="text-gray-600 text-sm">Stitch Status</p>
              <p className="font-medium">{stitchingData?.stitch_status || "N/A"}</p>
            </div>
          </div>
        </div>


        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold text-blue-700 mb-3 border-b border-blue-200 pb-2">
            Additional Information
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600 text-sm">Design Group</p>
              <p className="font-medium">{stitchingData?.design_group || "N/A"}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Design Number</p>
              <p className="font-medium">{stitchingData?.design_number || "N/A"}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Stitch Order Remarks</p>
              <p className="font-medium">{stitchingData?.remarks || "N/A"}</p>
            </div>
          </div>
        </div>

      </div>


      {/* Stitcher Details */}
      <div className="mb-8 page-break">
        <h2 className="text-lg font-semibold text-blue-700 mb-3 border-b border-blue-200 pb-2">
          Stitcher Details
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-blue-50">
              <tr>
                <th className="py-2 px-4 border-b text-left text-sm font-medium text-blue-800">
                  Sticher Id
                </th>
                <th className="py-2 px-4 border-b text-left text-sm font-medium text-blue-800">
                  Name
                </th>
                <th className="py-2 px-4 border-b text-left text-sm font-medium text-blue-800">
                  Stitcher Type
                </th>
                <th className="py-2 px-4 border-b text-left text-sm font-medium text-blue-800">
                  Stitcher Code
                </th>
                <th className="py-2 px-4 border-b text-left text-sm font-medium text-blue-800">
                  Address
                </th>
                <th className="py-2 px-4 border-b text-left text-sm font-medium text-blue-800">
                  Remarks
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="py-2 px-4 text-sm">
                  {stitchingData?.stitcher?.id || "N/A"}
                </td>
                <td className="py-2 px-4 text-sm">
                  {stitchingData?.stitcher?.stitcher_name || "N/A"}

                </td>
                <td className="py-2 px-4 text-sm">
                  {stitchingData?.stitcher?.stitcher_type || "N/A"}
                </td>
                <td className="py-2 px-4 text-sm">
                  {stitchingData?.stitcher?.stitcher_code || "N/A"}
                </td>
                <td className="py-2 px-4 text-sm">
                  {stitchingData?.stitcher?.address || "N/A"}
                </td>
                <td className="py-2 px-4 text-sm">
                  {stitchingData?.stitcher?.remarks || "N/A"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {stitchingData?.order_Items && stitchingData?.order_Items?.length > 0 && (
        <div className="col-span-2">
          <h2 className="text-lg font-semibold text-blue-800 mb-3">Items Details</h2>
          <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
            <table className="w-full border-collapse border border-gray-300 rounded-lg">
              <thead className="bg-gray-200 text-blue-700 text-sm uppercase">
                <tr>
                  {["Group", "Colour", "Design/Khaka", "Measurement", "Work", "Others", "Qty Required", "Already Processed", "Process Qty"].map((header) => (
                    <th key={header} className="border border-gray-300 p-3 text-center">{header}</th>
                  ))}
                </tr>
              </thead>


              <tbody>
                {stitchingData?.order_Items?.map((item, index) => {

                  console.log("Item: ", item);
                  return (
                    <tr key={index} className="even:bg-gray-100 hover:bg-gray-50 transition">
                      <td className="border border-gray-300 p-3 text-center">{item?.group}</td>
                      <td className="border border-gray-300 p-3 text-center">{item?.color}</td>
                      <td className="border border-gray-300 p-3 text-center">{item?.Khaka}</td>
                      <td className="border border-gray-300 p-3 text-center">{item?.measurement}</td>
                      <td className="border border-gray-300 p-3 text-center">{item?.work}</td>
                      <td className="border border-gray-300 p-3 text-center">{item?.others}</td>

                      <td className="border border-gray-300 p-3 text-center">
                        {item?.qty_required}
                      </td>

                      <td className="border border-gray-300 p-3 text-center">
                        {item?.already_processed == null ? 0 : item?.already_processed}
                      </td>

                      <td className="border border-gray-300 p-3 text-center">
                        {item?.process_qty == null ? 0 : item?.process_qty}
                      </td>
                    </tr>
                  );
                })}
              </tbody>




            </table>
          </div>
        </div>

      )}

      {stitchingData?.bom && stitchingData?.bom.length > 0 &&
        <div className="col-span-2">
          <h2 className="text-lg font-semibold text-blue-800 mb-3">BOM Details</h2>
          <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
            <table className="w-full border-collapse border border-gray-300 rounded-lg">
              <thead className="bg-gray-200 text-blue-700 text-sm uppercase">
                <tr>
                  {["BOM Id", "SFG ID", "SFG Name", "Colour", "Process Qty"].map((header) => (
                    <th key={header} className="border border-gray-300 p-3 text-center">{header}</th>
                  ))}
                </tr>
              </thead>


              <tbody>
                {stitchingData?.bom.map((item, index) => {

                  console.log("Item: ", item);
                  return (
                    <tr key={index} className="even:bg-gray-100 hover:bg-gray-50 transition">
                      <td className="border border-gray-300 p-3 text-center">{item?.bom_id}</td>
                      <td className="border border-gray-300 p-3 text-center">{item?.sfg?.semi_finished_goods_id}</td>
                      <td className="border border-gray-300 p-3 text-center">{item?.sfg?.semi_finished_goods_name}</td>
                      <td className="border border-gray-300 p-3 text-center">{item?.color?.color_name}</td>
                      <td className="border border-gray-300 p-3 text-center">{item?.processed_qty}</td>




                    </tr>
                  );
                })}
              </tbody>




            </table>
          </div>
        </div>
      }


    </div>
  )
}

export default StitchingEntryView;