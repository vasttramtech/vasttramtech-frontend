// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { FaArrowLeft, FaPrint, FaSearchPlus } from "react-icons/fa";
// import { BounceLoader } from "react-spinners";
// import { useSelector } from "react-redux";

// const SemiFinishedGoodsView = () => {
//     const { id } = useParams();
//     const navigate = useNavigate();
//     const [semiFinishedGoods, setSemiFinishedGoods] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [selectedImage, setSelectedImage] = useState(null); // Lightbox Effect
//     const { token } = useSelector(state => state.auth);

//     useEffect(() => {
//         const fetchDesignData = async () => {
//             try {
//                 setLoading(true);
//                 const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/semi-finished-goods-masters/${id}?populate[unit]=*&populate[group]=*&populate[add_karigar][populate]=jobber`, {
//                     headers: { Authorization: `Bearer ${token}` },
//                 });

//                 if (response.data && response.data.data) {
//                     setSemiFinishedGoods(response.data.data);
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

//     console.log("semifinishedGoods: ",semiFinishedGoods)


//     if (loading) return (
//         <div className="absolute inset-0 flex justify-center items-center bg-opacity-50 bg-gray-200 z-10">
//             <BounceLoader size={100} color={"#1e3a8a"} loading={loading} />
//         </div>
//     );

//     if (error) return <div className="text-center text-red-500 mt-10">{error}</div>;

//     return (
//         <div className="w-11/12 max-w-4xl mx-auto mt-6 p-8 bg-white shadow-lg rounded-2xl border border-gray-200 relative">
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
//                     onClick={() => navigate("/semi-finished-goods-master")}
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

// export default SemiFinishedGoodsView;




import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft, FaPrint } from "react-icons/fa";
import { BounceLoader } from "react-spinners";
import { useSelector } from "react-redux";

const SemiFinishedGoodsView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [semiFinishedGoods, setSemiFinishedGoods] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { token } = useSelector(state => state.auth);

    useEffect(() => {
        const fetchDesignData = async () => {
            try {
                setLoading(true);
                const response = await axios.get(
                    `${process.env.REACT_APP_BACKEND_URL}/api/semi-finished-goods-masters/${id}?populate[unit]=*&populate[group]=*`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                console.log(response.data);
                if (response.data && response.data.data) {
                    setSemiFinishedGoods(response.data.data);
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
        const semi = semiFinishedGoods;
      
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
          <html>
            <head>
              <title>Semi-Finished Goods Report</title>
              <style>
                body {
                  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                  margin: 40px;
                  color: #333;
                }
                header {
                  text-align: center;
                  margin-bottom: 30px;
                  border-bottom: 2px solid #444;
                  padding-bottom: 10px;
                }
                .container {
                  display: flex;
                  flex-direction: column;
                  justify-content: space-between;
                }
                  .jobber-section {
            background-color: #f2f2f2;
            padding: 20px;
            border-radius: 8px;
            border: 1px solid #ccc;
          }
          .jobber-item {
            display: flex;
            justify-content: space-between;
            border-bottom: 1px solid #ddd;
            padding: 10px 0;
          }
          .jobber-item:last-child {
            border-bottom: none;
          }
        .vasttram {
            text-align: left;
            color: #2c3e90;
            font-size: 28px;
            font-weight: 600;
          }
        </style>
      </head>
      <body>
        
        <p class="vasttram"> Vasttram </p>

        <header> 
            <h1>Semi-Finished Goods Report</h1>
            <p>Generated on: ${new Date().toLocaleString()}</p>
            </header>

        <div class="container">
          <div class="column">
            <h2>${semi?.semi_finished_goods_name || 'N/A'}</h2>
            <p><strong>ID:</strong> ${semi?.semi_finished_goods_id || 'N/A'}</p>
            <p><strong>Description:</strong> ${semi?.description || 'N/A'}</p>
          </div>
          <div class="column">
            <p><strong>Unit:</strong> ${semi?.unit?.unit_name || 'N/A'}</p>
            <p><strong>Group:</strong> ${semi?.group?.group_name || 'N/A'}</p>
            <p><strong>Created:</strong> ${semi?.createdAt ? new Date(semi.createdAt).toLocaleDateString() : 'N/A'}</p>
          </div>
        </div>

        <h3>Assigned Jobbers</h3>
        <div class="jobber-section">
          ${
            semi?.add_karigar?.length > 0
              ? semi.add_karigar.map(jobberItem => `
                <div class="jobber-item">
                  <p><strong>Name:</strong> ${jobberItem?.jobber?.jobber_name || 'N/A'}</p>
                  <p><strong>Rate:</strong> ${jobberItem?.rate || '-'}</p>
                </div>
              `).join('')
              : `<p>No jobbers assigned.</p>`
          }
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
        `);
        printWindow.document.close();
      };
      

    // console.log("semiFinishedGoods:", semiFinishedGoods);

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
                    onClick={() => navigate("/semi-finished-goods-master")}
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

            {/* Product Information */}
            <div className="grid grid-cols-2 gap-8">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">{semiFinishedGoods?.semi_finished_goods_name}</h2>
                    <p className="text-lg text-gray-600">ID: {semiFinishedGoods?.semi_finished_goods_id}</p>
                    <p className="text-lg text-gray-600">Description: {semiFinishedGoods?.description}</p>
                </div>
                <div className="mt-8">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4"></h2>
                    <p className="text-lg text-gray-600">Unit: {semiFinishedGoods?.unit?.unit_name}</p>
                    <p className="text-lg text-gray-600">Group: {semiFinishedGoods?.group?.group_name}</p>
                    <p className="text-lg text-gray-600">Created: {new Date(semiFinishedGoods?.createdAt).toLocaleDateString()}</p>
                </div>
            </div>

          
        </div>
    );
};

export default SemiFinishedGoodsView;