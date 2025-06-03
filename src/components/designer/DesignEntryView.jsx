// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { FaArrowLeft, FaPrint } from "react-icons/fa";
// import { BounceLoader } from "react-spinners";
// import { useSelector } from "react-redux";

// const DesignEntryView = () => {
//     const { id } = useParams();
//     const navigate = useNavigate();
//     const [designEntry, setDesignEntry] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const { token } = useSelector(state => state.auth);

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 setLoading(true);
//                 const response = await axios.get(
//                     `${process.env.REACT_APP_BACKEND_URL}/api/design-entry-pages/${id}?populate=*`,
//                     { headers: { Authorization: `Bearer ${token}` } }
//                 );
//                 if (response.data && response.data.data) {
//                     setDesignEntry(response.data.data);
//                 } else {
//                     setError("No design entry data found.");
//                 }
//             } catch (error) {
//                 console.error("Error fetching design entry data:", error);
//                 setError("Failed to fetch design entry data.");
//                 if (error.response?.status === 401) {
//                     navigate("/login");
//                 }
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchData();
//     }, [id, navigate, token]);

//     const handlePrint = () => {
//         window.print();
//     };

//     console.log("designEntry: ", designEntry)

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
//                     onClick={() => navigate("/color-master")}
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

// export default DesignEntryView;






import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft, FaPrint } from "react-icons/fa";
import { BounceLoader } from "react-spinners";
import { useSelector } from "react-redux";

const DesignEntryView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [designEntry, setDesignEntry] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { token } = useSelector(state => state.auth);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await axios.get(
                    `${process.env.REACT_APP_BACKEND_URL}/api/design-entry-pages/${id}?populate=*`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                if (response.data && response.data.data) {
                    console.log("Design Data: ", response.data.data);
                    setDesignEntry(response.data.data);
                } else {
                    setError("No design entry data found.");
                }
            } catch (error) {
                console.error("Error fetching design entry data:", error);
                setError("Failed to fetch design entry data.");
                if (error.response?.status === 401) {
                    navigate("/login");
                }
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, navigate, token]);

    const handlePrint = (designEntry) => {
        const printWindow = window.open('', '_blank', 'width=900,height=700');
      
        if (!printWindow) return;
      
        const style = `
          <style>
            body { font-family: Arial, sans-serif; padding: 30px; color: #000; }
            h1, h2, h3 { margin-bottom: 10px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            td, th { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .section { margin-bottom: 40px; }
            .images img { width: 100px; height: 100px; object-fit: cover; margin-right: 10px; margin-top: 10px; border: 1px solid #ddd; border-radius: 6px; }
            .vasttram{
                            text-align: left;
                            color: #236;
                        }
                        
                        header {
                            text-align: center;
                            margin-bottom: 40px;
                            border-bottom: 2px solid #444;
                            padding-bottom: 10px;
                        }
            </style>
        `;
      
        const formatDate = (date) => (date ? new Date(date).toLocaleDateString() : "-");
      
        const content = `
          <html>
            <head>
              <title> Design Report</title>
              ${style}
            </head>
            <body>
              <h3 class="vasttram"> Vasttram</h3>
                    <header>
                        <h1>Raw Materials Stock Report</h1>
                        <p>Generated on: <script>document.write(new Date().toLocaleString());</script></p>
                    </header>
              <div class="section">
                <h2>General Information</h2>
                <table>
                  <tr><th>Design Name</th><td>${designEntry?.design?.design_name || '-'}</td></tr>
                  <tr><th>Designer</th><td>${designEntry?.designer_name || '-'}</td></tr>
                  <tr><th>Status</th><td>${designEntry?.design_status || '-'}</td></tr>
                  <tr><th>Tag</th><td>${designEntry?.tag || '-'}</td></tr>
                  <tr><th>Start Date</th><td>${formatDate(designEntry?.start_date)}</td></tr>
                  <tr><th>End Date</th><td>${formatDate(designEntry?.end_date)}</td></tr>
                  <tr><th>Process</th><td>${designEntry?.process || '-'}</td></tr>
                  <tr><th>Processor</th><td>${designEntry?.processor?.design_number || '-'}</td></tr>
                  <tr><th>Remark</th><td>${designEntry?.remark || '-'}</td></tr>
                  <tr><th>Comments</th><td>${designEntry?.comments || '-'}</td></tr>
                </table>
              </div>
      
              <div class="section">
                <h2>Uploaded Images</h2>
                <div class="images">
                  ${(designEntry?.img_upload || [])
                    .map((img) => `<img src="${process.env.REACT_APP_BACKEND_URL}${img.url}" alt="${img.name}" />`)
                    .join('')}
                </div>
              </div>
      
              <div class="section">
                <h2>Final Images</h2>
                <div class="images">
                  ${(designEntry?.final_img_upload || [])
                    .map((img) => `<img src="${process.env.REACT_APP_BACKEND_URL}${img.url}" alt="${img.name}" />`)
                    .join('')}
                </div>
              </div>
      
              <div class="section">
                <h2>Cost Sheets</h2>
                <div class="images">
                  ${(designEntry?.cost_sheet || [])
                    .map((img) => `<img src="${process.env.REACT_APP_BACKEND_URL}${img.url}" alt="${img.name}" />`)
                    .join('')}
                </div>
              </div>
      
              <script>
                window.onload = () => {
                  window.print();
                  window.onafterprint = () => window.close();
                };
              </script>
            </body>
          </html>
        `;
      
        printWindow.document.write(content);
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
            <style>
                {`
                    @media print {
                        .no-print {
                            display: none;
                        }
                    }
                `}
            </style>
            <div className="flex justify-between items-center mb-6 no-print">
                <button
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition font-semibold text-lg"
                    onClick={() => navigate("/design-entry-report")}
                >
                    <FaArrowLeft /> Back
                </button>
                <button
                    className="flex items-center gap-2 bg-green-600 text-white px-5 py-3 rounded-xl text-lg font-semibold hover:bg-green-700 transition"
                    onClick={()=>handlePrint(designEntry)}
                >
                    <FaPrint /> Print
                </button>
            </div>
            <h1 className="text-2xl font-bold mb-4">Design Entry Details</h1>
            <div className="grid grid-cols-2 gap-6">
                <div>
                    <p><strong>Design Name:</strong> {designEntry?.design?.design_name}</p>
                    <p><strong>Designer:</strong> {designEntry?.designer_name}</p>
                    <p><strong>Status:</strong> {designEntry?.design_status}</p>
                    <p><strong>Tag:</strong> {designEntry?.tag}</p>
                    <p><strong>Start Date:</strong> {designEntry?.start_date}</p>
                    <p><strong>End Date:</strong> {designEntry?.end_date}</p>
                </div>
                <div>
                    <p><strong>Process:</strong> {designEntry?.process}</p>
                    <p><strong>Design Number:</strong> {designEntry?.design?.design_name}</p>
                    <p><strong>processor:</strong> {designEntry?.processor?.design_number}</p>
                    <p><strong>Remark:</strong> {designEntry?.remark}</p>
                </div>
            </div>
            <div className="flex gap-40">
                <div>
                    <h2 className="text-xl font-semibold mt-6">Images</h2>
                    <div className="flex gap-4 mt-4">
                        {designEntry?.img_upload?.map((img, index) => (
                            <img
                                key={index}
                                src={`${img.url}`}
                                alt={img.name || "Design Image"}
                                className="w-32 h-32 object-cover rounded-lg"
                            />
                        ))}
                    </div>
                </div>

                <div>
                    <h2 className="text-xl font-semibold mt-6">Final Images</h2>
                    <div className="flex gap-4 mt-4">
                        {designEntry?.final_img_upload?.map((img, index) => (
                            <img
                                key={index}
                                src={`${img.url}`}
                                alt={img.name || "Final Image"}
                                className="w-32 h-32 object-cover rounded-lg"
                            />
                        ))}
                    </div>
                </div>

                <div>
                    <h2 className="text-xl font-semibold mt-6">Cost Images</h2>
                    <div className="flex gap-4 mt-4">
                        {designEntry?.cost_sheet?.map((img, index) => (
                            <img
                                key={index}
                                src={`${img.url}`}
                                alt={img.name || "Cost Image"}
                                className="w-32 h-32 object-cover rounded-lg"
                            />
                        ))}
                    </div>
                </div>
            </div>

        </div>
    );
};

export default DesignEntryView;