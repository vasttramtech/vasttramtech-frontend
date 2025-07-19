// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { FaArrowLeft, FaPrint, FaSearchPlus } from "react-icons/fa";
// import { BounceLoader } from "react-spinners";
// import { useSelector } from "react-redux";
// import SemiFinishedGoodsTable from "./SemiFinishedGoodModel";
// import RawMaterialTable from "./RawMaterialTable";

// const formatDate = (isoString) => {
//   const date = new Date(isoString);
//   const year = date.getFullYear();
//   const month = String(date.getMonth() + 1).padStart(2, "0");
//   const day = String(date.getDate()).padStart(2, "0");
//   const hours = String(date.getHours()).padStart(2, "0");
//   const minutes = String(date.getMinutes()).padStart(2, "0");
//   const seconds = String(date.getSeconds()).padStart(2, "0");

//   return `Date: ${day}-${month}-${year}, Time: ${hours}:${minutes}:${seconds}`;
// };
// const DesignView = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [design, setDesign] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedImage, setSelectedImage] = useState(null); // Lightbox Effect
//   const { token } = useSelector((state) => state.auth);

//   useEffect(() => {
//     const fetchDesignData = async () => {
//       try {
//         setLoading(true);
//         console.log(id);
//         const response = await axios.get(
//           `${process.env.REACT_APP_BACKEND_URL}/api/design-masters/custom/${id}?populate=*`,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );
//         console.log("View Design Data", response)
//         if (response.data) {
//           setDesign(response.data);
//         } else {
//           setError("No design data found.");
//         }
//       } catch (error) {
//         console.error("Error fetching design data:", error);
//         setError("Failed to fetch design data.");
//         if (error.response?.status === 401) {
//           navigate("/login");
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDesignData();
//   }, [id, navigate, token]);

// const handlePrint = () => {
//   const printContents = document.getElementById("print-report").innerHTML;

//   const printWindow = window.open('', '_blank', 'width=800,height=900');

//   if (!printWindow) {
//     alert("Popup blocked! Please allow popups for this site.");
//     return;
//   }

//   printWindow.document.write(`
//     <html>
//       <head>
//         <title>Print Design Report</title>
//         <style>
//           body {
//             font-family: 'Segoe UI', sans-serif;
//             padding: 40px;
//             background: white;
//             color: #333;
//           }
//           h1, h2 {
//             margin-bottom: 8px;
//           }
//           table {
//             width: 100%;
//             border-collapse: collapse;
//             margin-bottom: 20px;
//             font-size: 14px;
//           }
//           table, th, td {
//             border: 1px solid #ccc;
//           }
//           th, td {
//             padding: 8px;
//             text-align: left;
//           }
//           img {
//             max-width: 150px;
//             max-height: 150px;
//             margin: 5px;
//             border: 1px solid #ccc;
//             border-radius: 8px;
//           }
//         </style>
//       </head>
//       <body>
//         ${printContents}
//         <script>
//           // Close tab on print complete or timeout
//           window.onload = function () {
//             const printPromise = window.print();
//             const fallbackClose = setTimeout(() => window.close(), 1000);

//             if (printPromise && typeof printPromise.finally === 'function') {
//               printPromise.finally(() => {
//                 clearTimeout(fallbackClose);
//                 setTimeout(() => window.close(), 500);
//               });
//             }

//             // Extra: close on click anywhere
//             document.body.addEventListener('click', () => {
//               window.close();
//             });
//           };
//         </script>
//       </body>
//     </html>
//   `);

//   printWindow.document.close();
// };





//   console.log(design);

//   if (loading)
//     return (
//       <div className="absolute inset-0 flex justify-center items-center bg-opacity-50 bg-gray-200 z-10">
//         <BounceLoader size={100} color={"#1e3a8a"} loading={loading} />
//       </div>
//     );

//   if (error)
//     return <div className="text-center text-red-500 mt-10">{error}</div>;
//   return (
//  <div className="w-[210mm] mx-auto my-8 bg-white shadow-lg rounded-md border border-gray-300 text-gray-800 p-10 text-sm leading-relaxed font-sans" id="print-report">
//   <style>{`@media print { .no-print { display: none; } }`}</style>

//   {/* Header */}
//   <div className="flex justify-between items-center mb-8 no-print">
//     <button
//       onClick={() => navigate("/design-master")}
//       className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
//     >
//       <FaArrowLeft />
//       Back
//     </button>

//     <button
//       onClick={handlePrint}
//       className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center gap-2 shadow"
//     >
//       <FaPrint />
//       Print
//     </button>
//   </div>

//   {/* Company / Document Header */}
//   <div className="text-center mb-8" id="print-report">
//     <h1 className="text-2xl font-bold uppercase">Design Report</h1>
//   </div>

//   {/* Design Info */}
//   <table className="w-full mb-6 border border-gray-400 text-left text-sm">
//     <tbody>
//       <Row label="Design Number" value={design?.design_number} />
//       <Row label="Description" value={design?.description} />
//       <Row label="Color Name" value={design?.color?.color_name} />
//       <Row label="Color Code" value={design?.color?.color_id} />
//       <Row label="Design Group" value={design?.design_group?.group_name} />
//       <Row label="Unit" value={design?.unit?.unit_name} />
//       <Row label="Rate (₹)" value={design?.total_design_cost} />
//       <Row label="Created At" value={formatDate(design?.createdAt)} />
//     </tbody>
//   </table>

//   {/* Images Section */}
//   {design?.image?.length > 0 && (
//     <div className="mb-8">
//       <h2 className="text-lg font-semibold mb-2 ">Design Images</h2>
//       <div className="flex flex-wrap gap-4 no-print">
//         {design.image.map((img, idx) => (
//           <img
//             key={idx}
//             src={img.url}
//             alt={img.alternativeText}
//             className="w-40 h-40 object-cover border rounded shadow"
//             onClick={() => setSelectedImage(img.url)}
//           />
//         ))}
//       </div>
//     </div>
//   )}

//   {/* Modal View */}
//   {selectedImage && (
//     <div
//       className="fixed inset-0 z-50 bg-black bg-opacity-70 flex justify-center items-center"
//       onClick={() => setSelectedImage(null)}
//     >
//       <img src={selectedImage} alt="Preview" className="max-w-[90%] max-h-[90%] rounded shadow-2xl" />
//     </div>
//   )}

//   {/* Related Design Group */}
//   {design?.design_group && (
//     <div className="mb-6">
//       <h2 className="text-lg font-semibold ">Design Group Details</h2>
//       <table className="w-full mt-2 border border-gray-400 text-sm">
//         <tbody>
//           <Row label="Group Name" value={design.design_group.group_name} />
//           <Row label="Group Description" value={design.design_group.group_description} />
//         </tbody>
//       </table>
//     </div>
//   )}

//   {/* SFG Material */}
//   {design?.sfg_material && (
//     <div className="mb-6">
//       <h2 className="text-lg font-semibold underline">SFG Material</h2>
//       <p className="mt-1">{design?.sfg_material?.semi_finished_goods_name}</p>
//     </div>
//   )}

//   {/* Semi-Finished Goods Table */}
//   <div className="mt-8" id="printable-table-2">
//     <SemiFinishedGoodsTable design={design} />
//   </div>
// </div>



//   );
// };


// const Row = ({ label, value }) => (
//   <tr className="border-b border-gray-300">
//     <td className="p-2 font-semibold w-1/3">{label}</td>
//     <td className="p-2">{value || "N/A"}</td>
//   </tr>
// );

// export default DesignView;


import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft, FaPrint } from "react-icons/fa";
import { BounceLoader } from "react-spinners";
import { useSelector } from "react-redux";

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
  const [selectedImage, setSelectedImage] = useState(null);
  const { token } = useSelector((state) => state.auth);
  const [showRMModal, setShowRMModal] = useState(false);

  useEffect(() => {
    const fetchDesignData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/design-masters/custom/${id}?populate=*`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.data) setDesign(response.data);
        else setError("No design data found.");
      } catch (error) {
        console.error("Error fetching design data:", error);
        setError("Failed to fetch design data.");
        if (error.response?.status === 401) navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchDesignData();
  }, [id, navigate, token]);

  console.log("design: ", design)

  const handlePrint = () => {
    const printContents = document.getElementById("print-report").innerHTML;
    const printWindow = window.open('', '_blank', 'width=800,height=900');
    if (!printWindow) return alert("Popup blocked!");
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Design Report</title>
          <style>
            body { font-family: 'Segoe UI'; padding: 40px; color: #333; }
            table { width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 20px; }
            th, td { border: 1px solid #ccc; padding: 8px; }
            img { max-width: 150px; max-height: 150px; border-radius: 8px; margin: 5px; }
          </style>
        </head>
        <body>${printContents}<script>
          window.onload = function () {
            const printPromise = window.print();
            const fallback = setTimeout(() => window.close(), 1000);
            if (printPromise?.finally) {
              printPromise.finally(() => {
                clearTimeout(fallback);
                setTimeout(() => window.close(), 500);
              });
            }
            document.body.addEventListener('click', () => window.close());
          };
        </script></body></html>
    `);
    printWindow.document.close();
  };

  if (loading)
    return (
      <div className="absolute inset-0 flex justify-center items-center bg-opacity-50 bg-gray-200 z-10">
        <BounceLoader size={100} color={"#1e3a8a"} loading={loading} />
      </div>
    );

  if (error)
    return <div className="text-center text-red-500 mt-10">{error}</div>;

  // return (
  //   <div className="w-[273mm] mx-auto my-8 bg-white shadow-lg rounded-md border border-gray-300 text-gray-800 p-10 text-sm leading-relaxed font-sans" id="print-report">
  //     <style>{`@media print { .no-print { display: none; } }`}</style>

  //     {/* Header */}
  //     <div className="flex justify-between items-center mb-8 no-print">
  //       <button onClick={() => navigate("/design-master")} className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1">
  //         <FaArrowLeft /> Back
  //       </button>
  //       <button onClick={handlePrint} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center gap-2 shadow">
  //         <FaPrint /> Print
  //       </button>
  //     </div>

  //     {/* Title */}
  //     <div className="text-center mb-8">
  //       <h1 className="text-2xl font-bold uppercase">Design Report</h1>
  //     </div>

  //     {/* Design Info */}
  //     <table className="w-full mb-6 border border-gray-400 text-left text-sm">
  //       <tbody>
  //         <Row label="Design Number" value={design?.design_number} />
  //         <Row label="Description" value={design?.description} />
  //         <Row label="Color Name" value={design?.color?.color_name} />
  //         <Row label="Color Code" value={design?.color?.color_id} />
  //         <Row label="Design Group" value={design?.design_group?.group_name} />
  //         <Row label="Unit" value={design?.unit?.unit_name} />
  //         <Row label="Rate (₹)" value={design?.total_design_cost} />
  //         <Row label="Created At" value={formatDate(design?.createdAt)} />
  //       </tbody>
  //     </table>

  //     {/* Images */}
  //     {design?.image?.length > 0 && (
  //       <div className="mb-8">
  //         <h2 className="text-lg font-semibold mb-2">Design Images</h2>
  //         <div className="flex flex-wrap gap-4 no-print">
  //           {design.image.map((img, idx) => (
  //             <img key={idx} src={img.url} alt={img.alternativeText} className="w-40 h-40 object-cover border rounded shadow" onClick={() => setSelectedImage(img.url)} />
  //           ))}
  //         </div>
  //       </div>
  //     )}
  //     {selectedImage && (
  //       <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex justify-center items-center" onClick={() => setSelectedImage(null)}>
  //         <img src={selectedImage} alt="Preview" className="max-w-[90%] max-h-[90%] rounded shadow-2xl" />
  //       </div>
  //     )}

  //     {/* Design Group Info */}
  //     {design?.design_group && (
  //       <div className="mb-6">
  //         <h2 className="text-lg font-semibold">Design Group Details</h2>
  //         <table className="w-full mt-2 border border-gray-400 text-sm">
  //           <tbody>
  //             <Row label="Group Name" value={design.design_group.group_name} />
  //             <Row label="Group Description" value={design.design_group.group_description} />
  //           </tbody>
  //         </table>
  //       </div>
  //     )}

  //     {/* SFG Material */}
  //     {design?.sfg_material && (
  //       <div className="mb-6">
  //         <h2 className="text-lg font-semibold underline">SFG Material</h2>
  //         <p className="mt-1">{design?.sfg_material?.semi_finished_goods_name}</p>
  //       </div>
  //     )}

  //     {/* SFG Embedded Section */}
  //     {design?.semi_finished_goods_entries?.length > 0 && (
  //       <div className="p-4 space-y-6">
  //         <h2 className="text-xl font-bold text-center">Semi-Finished Goods Details</h2>

  //         {design.semi_finished_goods_entries.map((entry) => (
  //           <div key={entry.id} className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
  //             <div className="mb-4">
  //               <h3 className="text-lg font-semibold text-gray-800">{entry?.semi_finished_goods?.semi_finished_goods_name || "Unnamed SFG"}</h3>
  //               <p className="text-sm text-gray-500">{entry?.sfg_description}</p>
  //               <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-700">
  //                 <p><strong>Qty:</strong> {entry.qty}</p>
  //                 <p><strong>Total Price:</strong> ₹{entry.total_price}</p>
  //                 <p><strong>BOM Status:</strong> {entry.bom_status}</p>
  //                 <p><strong>From Stock:</strong> {entry.fromStock ? "Yes" : "No"}</p>
  //               </div>
  //             </div>

  //             {/* Jobber Table */}
  //             {entry.jobber_master_sfg?.length > 0 && (
  //               <div className="mb-4">
  //                 <h4 className="font-medium text-gray-700 mb-1">Jobber Details</h4>
  //                 <table className="w-full text-sm border border-gray-300">
  //                   <thead className="bg-gray-100">
  //                     <tr>
  //                       <th className="border p-2">Name</th>
  //                       <th className="border p-2">Work Type</th>
  //                       <th className="border p-2">Rate</th>
  //                       <th className="border p-2">Days</th>
  //                       <th className="border p-2">Status</th>
  //                     </tr>
  //                   </thead>
  //                   <tbody>
  //                     {entry.jobber_master_sfg.map((jobber) => (
  //                       <tr key={jobber.id} className="text-center">
  //                         <td className="border p-2">{jobber.jobber_master?.jobber_name}</td>
  //                         <td className="border p-2">{jobber.jobber_work_type}</td>
  //                         <td className="border p-2">₹{jobber.jobber_rate}</td>
  //                         <td className="border p-2">{jobber.jobber_master?.days}</td>
  //                         <td className="border p-2">{jobber.completed}</td>
  //                       </tr>
  //                     ))}
  //                   </tbody>
  //                 </table>
  //               </div>
  //             )}

  //             {/* Raw Materials Table */}
  //             {entry.raw_material_bom?.length > 0 && (
  //               <div>
  //                 <h4 className="font-medium text-gray-700 mb-1">Raw Materials Used</h4>
  //                 <table className="w-full text-sm border border-gray-300">
  //                   <thead className="bg-gray-100">
  //                     <tr>
  //                       <th className="border p-2">Name</th>
  //                       <th className="border p-2">Qty</th>
  //                       <th className="border p-2">Rate</th>
  //                     </tr>
  //                   </thead>
  //                   <tbody>
  //                     {entry.raw_material_bom.map((rm) => (
  //                       <tr key={rm.id} className="text-center">
  //                         <td className="border p-2">{rm.raw_material_master?.item_name}</td>
  //                         <td className="border p-2">{rm.rm_qty}</td>
  //                         <td className="border p-2">₹{rm.raw_material_master?.price_per_unit}</td>
  //                       </tr>
  //                     ))}
  //                   </tbody>
  //                 </table>
  //               </div>
  //             )}
  //           </div>
  //         ))}
  //       </div>
  //     )}
  //   </div>
  // );

  return (
    <div className="w-[285mm] mx-auto my-8 bg-white shadow-lg rounded-md border border-gray-300 text-gray-800 p-10 text-sm leading-relaxed font-sans" id="print-report">
      <style>{`@media print { .no-print { display: none; } }`}</style>

      {/* Header */}
      <div className="flex justify-between items-center mb-8 no-print">
        <button onClick={() => navigate("/design-master")} className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1">
          <FaArrowLeft /> Back
        </button>
        <button onClick={handlePrint} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center gap-2 shadow">
          <FaPrint /> Print
        </button>
      </div>

      {/* Title */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold uppercase">Design Report</h1>
      </div>

      {/* Compact Design Info Grid - 3 per row */}
      <div className="grid grid-cols-3 gap-y-4 gap-x-8 mb-10 text-sm">
        <GridItem label="Design Number" value={design?.design_number} />
        <GridItem label="Description" value={design?.description} />
        <GridItem label="Color Name" value={design?.color?.color_name} />
        <GridItem label="Color Code" value={design?.color?.color_id} />
        <GridItem label="Design Group" value={design?.design_group?.group_name} />
        <GridItem label="Unit" value={design?.unit?.unit_name} />
        <GridItem label="Rate " value={`₹- ${design?.total_design_cost}`} />
        <GridItem label="Created At" value={formatDate(design?.createdAt)} />
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => setShowRMModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 shadow no-print"
        >
          View Raw Materials
        </button>
      </div>

      {showRMModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center px-4">
          <div className="bg-white max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-md shadow-lg p-6 relative">
            <button
              onClick={() => setShowRMModal(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-black text-xl"
            >
              ✕
            </button>

            <h2 className="text-xl font-bold mb-4 text-center">Raw Materials Used</h2>

            {design?.semi_finished_goods_entries?.map((entry) => (
              <div key={entry.id} className="mb-6">
                <div className="flex">
                  <h3 className="text-lg font-semibold text-gray-800">
                    SFG: {entry?.semi_finished_goods?.semi_finished_goods_name || "Unnamed"}
                  </h3>
                  <h3 className="text-lg text-gray-800 ml-5">
                    Quantity: {`${entry?.qty} ${entry?.semi_finished_goods?.unit?.unit_name} per design`}
                  </h3>
                </div>

                {entry?.raw_material_bom?.length > 0 ? (
                  <table className="w-full text-sm mt-2 border border-gray-300">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="border p-2">Group</th>
                        <th className="border p-2">Raw Material</th>
                        <th className="border p-2">Color</th>
                        <th className="border p-2">Quantity</th>
                        <th className="border p-2">Unit</th>
                        <th className="border p-2">Rate (₹)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {entry.raw_material_bom.map((rm) => (
                        <tr key={rm.id} className="text-center">
                          <td className="border p-2">{rm.raw_material_master?.group?.group_name || "N/A"}</td>
                          <td className="border p-2">{rm.raw_material_master?.item_name || "N/A"}</td>
                          <td className="border p-2">{rm.raw_material_master?.color?.color_name || "N/A"}</td>
                          <td className="border p-2">{rm.rm_qty}</td>
                          <td className="border p-2">{rm.raw_material_master?.unit?.unit_name || "N/A"}</td>
                          <td className="border p-2">{rm.raw_material_master?.price_per_unit}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-gray-600 mt-2 italic">No raw materials found for this SFG.</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}



      {/* Images */}
      {design?.image?.length > 0 && (
        <div className="mb-10">
          <h2 className="text-lg font-semibold mb-2">Design Images</h2>
          <div className="flex flex-wrap gap-4 no-print">
            {design.image.map((img, idx) => (
              <img key={idx} src={img.url} alt={img.alternativeText} className="w-40 h-40 object-cover border rounded shadow" onClick={() => setSelectedImage(img.url)} />
            ))}
          </div>
        </div>
      )}
      {selectedImage && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex justify-center items-center" onClick={() => setSelectedImage(null)}>
          <img src={selectedImage} alt="Preview" className="max-w-[90%] max-h-[90%] rounded shadow-2xl" />
        </div>
      )}

      {/* Design Group Info */}
      {design?.design_group && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold">Design Group Details</h2>
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

      {/* SFG Embedded Section */}
      {design?.semi_finished_goods_entries?.length > 0 && (
        <div className="p-4 space-y-6">
          <h2 className="text-xl font-bold text-center">Semi-Finished Goods Details</h2>

          {design.semi_finished_goods_entries.map((entry) => (
            <div key={entry.id} className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-800">{entry?.semi_finished_goods?.semi_finished_goods_name || "Unnamed SFG"}</h3>
                <p className="text-sm text-gray-500">{entry?.sfg_description}</p>
                <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-700">
                  {/* <p><strong>Qty:</strong> {entry.qty}</p> */}
                  <p><strong>Qty:</strong> {`${entry?.qty} ${entry?.semi_finished_goods?.unit?.unit_name}/design`}</p>
                  <p><strong>Total Price:</strong> ₹{entry.total_price}</p>
                  <p><strong>BOM Status:</strong> {entry.bom_status}</p>
                  <p><strong>From Stock:</strong> {entry.fromStock ? "Yes" : "No"}</p>
                </div>
              </div>

              {/* Jobber Table */}
              {entry.jobber_master_sfg?.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-medium text-gray-700 mb-1">Jobber Details</h4>
                  <table className="w-full text-sm border border-gray-300">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="border p-2">Name</th>
                        <th className="border p-2">Work Type</th>
                        <th className="border p-2">Rate</th>
                        <th className="border p-2">Days</th>
                        {/* <th className="border p-2">Status</th> */}
                      </tr>
                    </thead>
                    <tbody>
                      {entry.jobber_master_sfg.map((jobber) => (
                        <tr key={jobber.id} className="text-center">
                          <td className="border p-2">{jobber.jobber_master?.jobber_name}</td>
                          <td className="border p-2">{jobber.jobber_work_type}</td>
                          <td className="border p-2">₹{jobber.jobber_rate}</td>
                          <td className="border p-2">{jobber.jobber_master?.days}</td>
                          {/* <td className="border p-2">{jobber.completed}</td> */}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Raw Materials Table */}
              {entry.raw_material_bom?.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-700 mb-1">Raw Materials Used</h4>
                  <table className="w-full text-sm border border-gray-300">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="border p-2">Group</th>
                        <th className="border p-2">Name</th>
                        <th className="border p-2">Color</th>
                        <th className="border p-2">Qty</th>
                        <th className="border p-2">Unit</th>
                        <th className="border p-2">Rate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {entry.raw_material_bom.map((rm) => (
                        <tr key={rm.id} className="text-center">
                          <td className="border p-2">{rm.raw_material_master?.group?.group_name}</td>
                          <td className="border p-2">{rm.raw_material_master?.item_name}</td>
                          <td className="border p-2">{rm.raw_material_master?.color?.color_name}</td>
                          <td className="border p-2">{rm.rm_qty}</td>
                          <td className="border p-2">{rm.raw_material_master?.unit?.unit_name || "N/A"}</td>
                          <td className="border p-2">₹{rm.raw_material_master?.price_per_unit}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );


};

const Row = ({ label, value }) => (
  <tr className="border-b border-gray-300">
    <td className="p-2 font-semibold w-1/3">{label}</td>
    <td className="p-2">{value || "N/A"}</td>
  </tr>
);

const GridItem = ({ label, value }) => (
  <div className="flex flex-col">
    <span className="font-semibold text-gray-700">{label}</span>
    <span className="text-gray-800">{value || "N/A"}</span>
  </div>
);

export default DesignView;

