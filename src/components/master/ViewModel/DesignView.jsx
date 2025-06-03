// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import {
//     FaArrowLeft,
//     FaMapMarkerAlt,
//     FaUser,
//     FaIndustry,
//     FaCalendar,
//     FaIdBadge,
//     FaFileInvoice,
//     FaPrint
// } from "react-icons/fa";
// import { BounceLoader } from "react-spinners";
// import { useSelector } from "react-redux";

// const DesignView = () => {
//     const { id } = useParams();
//     const navigate = useNavigate();
//     const [jobber, setJobber] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const { token } = useSelector(state => state.auth);

//     useEffect(() => {
//         const fetchJobberData = async () => {
//             console.log("Token:", token);
//             try {
//                 setLoading(true);
//                 const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/design-masters/${id}?populate=*`, {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                     },
//                 });

//                 if (response.data && response.data.data) {
//                     setJobber(response.data.data);
//                 } else {
//                     setError("No jobber data found.");
//                 }
//             } catch (error) {
//                 console.error("Error fetching jobber data:", error);
//                 setError("Failed to fetch jobber data.");
//                 if (error.response?.status === 401) {
//                     navigate("/login");
//                 }
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchJobberData();
//     }, [id, navigate]);

//     const handlePrint = () => {
//         window.print();
//     };

//     if (loading) return (
//         <div className="absolute inset-0 flex justify-center items-center bg-opacity-50 bg-gray-200 z-10">
//             <BounceLoader size={100} color={"#1e3a8a"} loading={loading} />
//         </div>
//     );

//     if (error) return <div className="text-center text-red-500 mt-10">{error}</div>;

//     return (
//         <div className="w-4/5 h-[82vh] mx-auto mt-4 p-8 bg-white shadow-2xl rounded-2xl border border-gray-200">
//             {/* CSS Inside JSX (For Hiding Elements in Print) */}
//             <style>
//                 {`
//                     @media print {
//                         .no-print {
//                             display: none;
//                         }
//                     }
//                 `}
//             </style>

//             {/* Buttons (Hidden in Print) */}
//             <div className="flex justify-between mb-6 no-print">
//                 <button
//                     className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition"
//                     onClick={() => navigate("/jobber-master")}
//                 >
//                     <FaArrowLeft /> Back to Jobbers
//                 </button>

//                 <button
//                     className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
//                     onClick={handlePrint}
//                 >
//                     <FaPrint /> Print
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default DesignView;

// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { FaArrowLeft, FaPrint } from "react-icons/fa";
// import { BounceLoader } from "react-spinners";
// import { useSelector } from "react-redux";

// const DesignView = () => {
//     const { id } = useParams();
//     const navigate = useNavigate();
//     const [design, setDesign] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const { token } = useSelector(state => state.auth);

//     useEffect(() => {
//         const fetchDesignData = async () => {
//             try {
//                 setLoading(true);
//                 const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/design-masters/${id}?populate=*`, {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                     },
//                 });

//                 if (response.data && response.data.data) {
//                     setDesign(response.data.data);
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

//     console.log(design)

//     if (loading) return (
//         <div className="absolute inset-0 flex justify-center items-center bg-opacity-50 bg-gray-200 z-10">
//             <BounceLoader size={100} color={"#1e3a8a"} loading={loading} />
//         </div>
//     );

//     if (error) return <div className="text-center text-red-500 mt-10">{error}</div>;

//     return (
//         <div className="w-11/12 max-w-4xl mx-auto mt-6 p-8 bg-white shadow-lg rounded-2xl border border-gray-200">
//             {/* CSS Inside JSX (For Hiding Elements in Print) */}
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
//                     className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition font-semibold"
//                     onClick={() => navigate("/design-master")}
//                 >
//                     <FaArrowLeft /> Back to Jobbers
//                 </button>
//                 <button
//                     className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
//                     onClick={handlePrint}
//                 >
//                     <FaPrint /> Print
//                 </button>
//             </div>

//             {/* Title */}
//             <h1 className="text-2xl font-bold text-gray-800 mb-4">{design?.description}</h1>

//             {/* Details */}
//             <div className="grid grid-cols-2 gap-6">
//                 {/* Left Column */}
//                 <div className="space-y-4">
//                     <p><span className="font-semibold">Color:</span> {design?.color}</p>
//                     <p><span className="font-semibold">Design Number:</span> {design?.design_number}</p>
//                     <p><span className="font-semibold">Process:</span> {design?.process}</p>
//                     <p><span className="font-semibold">Rate:</span> ₹{design?.rate}</p>
//                     <p><span className="font-semibold">Quantity:</span> {design?.qty}</p>
//                 </div>

//                 {/* Right Column */}
//                 <div className="space-y-4">
//                     <p><span className="font-semibold">BOM Description:</span> {design?.bom_description}</p>
//                     <p><span className="font-semibold">Unit:</span> {design?.unit?.unit_name}</p>
//                     <p><span className="font-semibold">Created At:</span> {new Date(design?.createdAt).toLocaleString()}</p>
//                     <p><span className="font-semibold">Updated At:</span> {new Date(design?.updatedAt).toLocaleString()}</p>
//                 </div>
//             </div>

//             {/* Related Data */}
//             <div className="mt-8 space-y-4">
//                 {design?.design_group && (
//                     <div className="p-4 bg-blue-100 rounded-lg">
//                         <h3 className="font-semibold text-lg">Design Group</h3>
//                         <p><span className="font-semibold">Name:</span> {design?.design_group?.group_name}</p>
//                         <p><span className="font-semibold">Description:</span> {design?.design_group?.group_description}</p>
//                     </div>
//                 )}

//                 {design?.sfg_material && (
//                     <div className="p-4 bg-green-100 rounded-lg">
//                         <h3 className="font-semibold text-lg">SFG Material</h3>
//                         <p>{design?.sfg_material?.semi_finished_goods_name}</p>
//                     </div>
//                 )}

//                 {design?.raw_material && (
//                     <div className="p-4 bg-yellow-100 rounded-lg">
//                         <h3 className="font-semibold text-lg">Raw Material</h3>
//                         <p>{design?.raw_material?.item_name}</p>
//                     </div>
//                 )}

//                 {design?.sfg_group && (
//                     <div className="p-4 bg-purple-100 rounded-lg">
//                         <h3 className="font-semibold text-lg">SFG Group</h3>
//                         <p>{design?.sfg_group?.group_name}</p>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default DesignView;

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft, FaPrint, FaSearchPlus } from "react-icons/fa";
import { BounceLoader } from "react-spinners";
import { useSelector } from "react-redux";
import SemiFinishedGoodsTable from "./SemiFinishedGoodModel";
import RawMaterialTable from "./RawMaterialTable";

const formatDate = (isoString) => {
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `Date: ${day}-${month}-${year}, Time: ${hours}:${minutes}:${seconds}`;
};
const DesignView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [design, setDesign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null); // Lightbox Effect
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchDesignData = async () => {
      try {
        setLoading(true);
        console.log(id);
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/design-masters/custom/${id}?populate=*`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("View Design Data", response)
        if (response.data) {
          setDesign(response.data);
        } else {
          setError("No design data found.");
        }
      } catch (error) {
        console.error("Error fetching design data:", error);
        setError("Failed to fetch design data.");
        if (error.response?.status === 401) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDesignData();
  }, [id, navigate, token]);

const handlePrint = () => {
  const printContents = document.getElementById("print-report").innerHTML;

  const printWindow = window.open('', '_blank', 'width=800,height=900');

  if (!printWindow) {
    alert("Popup blocked! Please allow popups for this site.");
    return;
  }

  printWindow.document.write(`
    <html>
      <head>
        <title>Print Design Report</title>
        <style>
          body {
            font-family: 'Segoe UI', sans-serif;
            padding: 40px;
            background: white;
            color: #333;
          }
          h1, h2 {
            margin-bottom: 8px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
            font-size: 14px;
          }
          table, th, td {
            border: 1px solid #ccc;
          }
          th, td {
            padding: 8px;
            text-align: left;
          }
          img {
            max-width: 150px;
            max-height: 150px;
            margin: 5px;
            border: 1px solid #ccc;
            border-radius: 8px;
          }
        </style>
      </head>
      <body>
        ${printContents}
        <script>
          // Close tab on print complete or timeout
          window.onload = function () {
            const printPromise = window.print();
            const fallbackClose = setTimeout(() => window.close(), 1000);

            if (printPromise && typeof printPromise.finally === 'function') {
              printPromise.finally(() => {
                clearTimeout(fallbackClose);
                setTimeout(() => window.close(), 500);
              });
            }

            // Extra: close on click anywhere
            document.body.addEventListener('click', () => {
              window.close();
            });
          };
        </script>
      </body>
    </html>
  `);

  printWindow.document.close();
};





  console.log(design);

  if (loading)
    return (
      <div className="absolute inset-0 flex justify-center items-center bg-opacity-50 bg-gray-200 z-10">
        <BounceLoader size={100} color={"#1e3a8a"} loading={loading} />
      </div>
    );

  if (error)
    return <div className="text-center text-red-500 mt-10">{error}</div>;
  return (
 <div className="w-[210mm] mx-auto my-8 bg-white shadow-lg rounded-md border border-gray-300 text-gray-800 p-10 text-sm leading-relaxed font-sans" id="print-report">
  <style>{`@media print { .no-print { display: none; } }`}</style>

  {/* Header */}
  <div className="flex justify-between items-center mb-8 no-print">
    <button
      onClick={() => navigate("/design-master")}
      className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
    >
      <FaArrowLeft />
      Back
    </button>

    <button
      onClick={handlePrint}
      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center gap-2 shadow"
    >
      <FaPrint />
      Print
    </button>
  </div>

  {/* Company / Document Header */}
  <div className="text-center mb-8" id="print-report">
    <h1 className="text-2xl font-bold uppercase">Design Report</h1>
  </div>

  {/* Design Info */}
  <table className="w-full mb-6 border border-gray-400 text-left text-sm">
    <tbody>
      <Row label="Design Number" value={design?.design_number} />
      <Row label="Description" value={design?.description} />
      <Row label="Color Name" value={design?.color?.color_name} />
      <Row label="Color Code" value={design?.color?.color_id} />
      <Row label="Design Group" value={design?.design_group?.group_name} />
      <Row label="Unit" value={design?.unit?.unit_name} />
      <Row label="Rate (₹)" value={design?.total_design_cost} />
      <Row label="Created At" value={formatDate(design?.createdAt)} />
    </tbody>
  </table>

  {/* Images Section */}
  {design?.image?.length > 0 && (
    <div className="mb-8">
      <h2 className="text-lg font-semibold mb-2 ">Design Images</h2>
      <div className="flex flex-wrap gap-4 no-print">
        {design.image.map((img, idx) => (
          <img
            key={idx}
            src={img.url}
            alt={img.alternativeText}
            className="w-40 h-40 object-cover border rounded shadow"
            onClick={() => setSelectedImage(img.url)}
          />
        ))}
      </div>
    </div>
  )}

  {/* Modal View */}
  {selectedImage && (
    <div
      className="fixed inset-0 z-50 bg-black bg-opacity-70 flex justify-center items-center"
      onClick={() => setSelectedImage(null)}
    >
      <img src={selectedImage} alt="Preview" className="max-w-[90%] max-h-[90%] rounded shadow-2xl" />
    </div>
  )}

  {/* Related Design Group */}
  {design?.design_group && (
    <div className="mb-6">
      <h2 className="text-lg font-semibold ">Design Group Details</h2>
      <table className="w-full mt-2 border border-gray-400 text-sm">
        <tbody>
          <Row label="Group Name" value={design.design_group.group_name} />
          <Row label="Group Description" value={design.design_group.group_description} />
        </tbody>
      </table>
    </div>
  )}

  {/* SFG Material */}
  {design?.sfg_material && (
    <div className="mb-6">
      <h2 className="text-lg font-semibold underline">SFG Material</h2>
      <p className="mt-1">{design?.sfg_material?.semi_finished_goods_name}</p>
    </div>
  )}

  {/* Semi-Finished Goods Table */}
  <div className="mt-8" id="printable-table-2">
    <SemiFinishedGoodsTable design={design} />
  </div>
</div>



  );
};


const Row = ({ label, value }) => (
  <tr className="border-b border-gray-300">
    <td className="p-2 font-semibold w-1/3">{label}</td>
    <td className="p-2">{value || "N/A"}</td>
  </tr>
);

export default DesignView;
