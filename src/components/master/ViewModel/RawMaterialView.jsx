// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { FaArrowLeft, FaPrint } from "react-icons/fa";
// import { BounceLoader } from "react-spinners";
// import { useSelector } from "react-redux";

// const RawMaterialView = () => {
//     const { id } = useParams();
//     const navigate = useNavigate();
//     const [rawMaterial, setRawMaterial] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const { token } = useSelector(state => state.auth);

//     useEffect(() => {
//         const fetchDesignData = async () => {
//             try {
//                 setLoading(true);
//                 const response = await axios.get(
//                     `${process.env.REACT_APP_BACKEND_URL}/api/raw-material-masters/${id}?populate=*`,
//                     { headers: { Authorization: `Bearer ${token}` } }
//                 );
//                 if (response.data && response.data.data) {
//                     setRawMaterial(response.data.data);
//                 } else {
//                     setError("No design data found.");
//                 }
//             } catch (error) {
//                 console.error("Error fetching design data:", error);
//                 setError("Failed to fetch design data.");
//                 if (error.response?.status === 401) {
//                     navigate("/login");
//                 }
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchDesignData();
//     }, [id, navigate, token]);

//     const handlePrint = () => {
//         window.print();
//     };

//     console.log("semiFinishedGoods:", rawMaterial);

//     if (loading) return (
//         <div className="absolute inset-0 flex justify-center items-center bg-opacity-50 bg-gray-200 z-10">
//             <BounceLoader size={100} color={"#1e3a8a"} loading={loading} />
//         </div>
//     );

//     if (error) return <div className="text-center text-red-500 mt-10">{error}</div>;

//     return (
//         <div className="w-4/5 mx-auto mt-6 p-10 bg-white shadow-lg rounded-2xl border border-gray-200 relative">
//             {/* Print Styling */}
//             <style>
//                 {`
//                     @media print {
//                         .no-print {
//                             display: none;
//                         }
//                     }
//                 `}
//             </style>

//             {/* Header */}
//             <div className="flex justify-between items-center mb-6 no-print">
//                 <button
//                     className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition font-semibold text-lg"
//                     onClick={() => navigate("/semi-finished-goods-master")}
//                 >
//                     <FaArrowLeft /> Back
//                 </button>
//                 <button
//                     className="flex items-center gap-2 bg-green-600 text-white px-5 py-3 rounded-xl text-lg font-semibold hover:bg-green-700 transition"
//                     onClick={handlePrint}
//                 >
//                     <FaPrint /> Print
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default RawMaterialView;




import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft, FaPrint } from "react-icons/fa";
import { BounceLoader } from "react-spinners";
import { useSelector } from "react-redux";

const RawMaterialView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [rawMaterial, setRawMaterial] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { token } = useSelector(state => state.auth);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await axios.get(
                    `${process.env.REACT_APP_BACKEND_URL}/api/raw-material-masters/${id}?populate[unit]=*&populate[group]=*&populate[color]=*&populate[hsn_sac_code]=*`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                // console.log("response of raw material view : ", response)
                if (response.data && response.data.data) {
                    setRawMaterial(response.data.data);
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
        const printContent = `
          <html>
            <head>
              <title>Raw Material Report</title>
              <style>
                body {
                  font-family: 'Segoe UI', sans-serif;
                  margin: 40px;
                  color: #333;
                  line-height: 1.6;
                }
                h2 {
                  font-size: 26px;
                  font-weight: bold;
                  margin-bottom: 30px;
                  border-bottom: 2px solid #444;
                  padding-bottom: 10px;
                  color: #222;
                }
                .section {
                  display: grid;
                  grid-template-columns: 1fr 1fr;
                  gap: 12px 30px;
                  margin-bottom: 25px;
                  color: #2c3e50;
                }
                .field {
                  font-size: 16px;
                }
                .label {
                  font-weight: 600;
                  color: #000;
                }
                
                header {
                    border-bottom: 2px solid #444;
                    text-align:center;
                    color: #2c3e50;
                    font-size: 28px;
                    margin-bottom: 20px;
                    font-weight: 600;
                }
                p{
                  font-size: 16px;
                }

                .vasttram {
                  text-align: left;
                  color: #2c3e90;
                  font-size: 28px;
                  font-weight: 600;
                }

                .description-box {
                  background-color: #f7f7f7;
                  padding: 15px;
                  border-radius: 8px;
                  border: 1px solid #ccc;
                  margin-top: 25px;
                }
              </style>
            </head>
            <body>

            <p class="vasttram"> Vasttram </p>
        <header>
            Raw Material Details         
            <p>Generated on: ${new Date().toLocaleString()}</p>
        </header>

              <div class="section">
                <div class="field"><span class="label">Item Name:</span> ${rawMaterial?.item_name || "N/A"}</div>
                <div class="field"><span class="label">Color:</span> ${rawMaterial?.color?.color_name || "N/A"}</div>
                <div class="field"><span class="label">Group Name:</span> ${rawMaterial?.group?.group_name || "N/A"}</div>
                <div class="field"><span class="label">Group Description:</span> ${rawMaterial?.group?.group_description || "N/A"}</div>
                <div class="field"><span class="label">HSN/SAC Code:</span> ${rawMaterial?.hsn_sac_code?.hsn_sac_code || "N/A"}</div>
                <div class="field"><span class="label">Unit:</span> ${rawMaterial?.unit?.unit_name || "N/A"}</div>
                <div class="field"><span class="label">Price:</span> ${rawMaterial?.price_per_unit || "N/A"} per ${rawMaterial?.unit?.unit_name || ""}</div>
                <div class="field"><span class="label">CGST:</span> ${rawMaterial?.hsn_sac_code?.cgst || "N/A"}%</div>
                <div class="field"><span class="label">SGST:</span> ${rawMaterial?.hsn_sac_code?.sgst || "N/A"}%</div>
                <div class="field"><span class="label">Cess:</span> ${rawMaterial?.hsn_sac_code?.cess || "N/A"}%</div>
                <div class="field"><span class="label">Created At:</span> ${new Date(rawMaterial?.createdAt).toLocaleString()}</div>
                <div class="field"><span class="label">Updated At:</span> ${new Date(rawMaterial?.updatedAt).toLocaleString()}</div>
              </div>
      
              <div class="description-box">
                <strong>Description:</strong>
                <p>${rawMaterial?.description || "No description available."}</p>
              </div>
      
              <script>
                window.onload = function () {
                  window.print();
                  setTimeout(()=> window.close(), 500);
                  window.onafterprint = function () {
                    window.close();
                  }
                }
              </script>
            </body>
          </html>
        `;
      
        const printWindow = window.open('', '_blank');
        printWindow.document.open();
        printWindow.document.write(printContent);
        printWindow.document.close();
      };
      

    if (loading) return (
        <div className="absolute inset-0 flex justify-center items-center bg-opacity-50 bg-gray-200 z-10">
            <BounceLoader size={100} color={"#1e3a8a"} loading={loading} />
        </div>
    );

    if (error) return <div className="text-center text-red-500 mt-10">{error}</div>;

    return (
        <div className="w-4/5 mx-auto mt-6 p-10 bg-white shadow-lg rounded-2xl border border-gray-200 relative">
            {/* Print Styling */}
            <style>
                {`
                    @media print {
                        .no-print {
                            display: none;
                        }
                    }
                `}
            </style>

            {/* Header */}
            <div className="flex justify-between items-center mb-6 no-print">
                <button
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition font-semibold text-lg"
                    onClick={() => navigate("/raw-material-master")}
                >
                    <FaArrowLeft /> Back
                </button>
                <button
                    className="flex items-center gap-2 bg-green-600 text-white px-5 py-3 rounded-xl text-lg font-semibold hover:bg-green-700 transition"
                    onClick={handlePrint}
                >
                    <FaPrint /> Print
                </button>
            </div>

            {/* Data Display */}
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800">Raw Material Details</h2>
                <div className="grid grid-cols-2 gap-4 text-gray-700">
                    <div><strong>Item Name:</strong> {rawMaterial?.item_name || "N/A"}</div>
                    <div><strong>Color:</strong> {rawMaterial?.color?.color_name || "N/A"}</div>
                    <div><strong>Group Name:</strong> {rawMaterial?.group?.group_name || "N/A"}</div>
                    <div><strong>Group Description:</strong> {rawMaterial?.group?.group_description || "N/A"}</div>
                    <div><strong>HSN/SAC Code:</strong> {rawMaterial?.hsn_sac_code?.hsn_sac_code || "N/A"}</div>
                    <div><strong>Unit:</strong> {rawMaterial?.unit?.unit_name || "N/A"}</div>
                    <div><strong>Price:</strong> {`${rawMaterial?.price_per_unit} per ${rawMaterial?.unit?.unit_name}` || "N/A"}</div>
                    <div><strong>CGST:</strong> {rawMaterial?.hsn_sac_code?.cgst || "N/A"}%</div>
                    <div><strong>SGST:</strong> {rawMaterial?.hsn_sac_code?.sgst || "N/A"}%</div>
                    <div><strong>Cess:</strong> {rawMaterial?.hsn_sac_code?.cess || "N/A"}%</div>
                    <div><strong>Created At:</strong> {new Date(rawMaterial?.createdAt).toLocaleString()}</div>
                    <div><strong>Updated At:</strong> {new Date(rawMaterial?.updatedAt).toLocaleString()}</div>
                </div>

                <div className="bg-gray-100 p-4 rounded-lg">
                    <strong>Description:</strong>
                    <p className="mt-2 text-gray-600">{rawMaterial?.description || "No description available."}</p>
                </div>

          
            </div>
        </div>
    );
};

export default RawMaterialView;