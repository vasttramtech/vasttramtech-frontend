import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaArrowLeft,
  FaMapMarkerAlt,
  FaUser,
  FaIndustry,
  FaCalendar,
  FaIdBadge,
  FaFileInvoice,
  FaPrint
} from "react-icons/fa";
import { BounceLoader } from "react-spinners";

const StitcherMaster = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [stitcher, setStitcher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStitcherData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/stitcher-masters/${id}?populate=*`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.data && response.data.data) {
          setStitcher(response.data.data);
        } else {
          setError("No jobber data found.");
        }
      } catch (error) {
        console.error("Error fetching jobber data:", error);
        setError("Failed to fetch jobber data.");
        if (error.response?.status === 401) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStitcherData();
  }, [id, navigate]);

  const handlePrint = () => {
    const printContent = document.getElementById("printable-content").innerHTML;

    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
          <html>
            <head>
              <title>Jobber Report</title>
              <style>
                body {
                  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                  padding: 40px;
                  color: #333;
                  background: #fff;
                }
      
                header {
                  text-align: center;
                  margin-bottom: 40px;
                  border-bottom: 2px solid #444;
                  padding-bottom: 10px;
                }
      
                header h1 {
                  font-size: 28px;
                  margin: 0;
                  color: #222;
                }
      
                header p {
                  font-size: 14px;
                  margin-top: 6px;
                  color: #666;
                }
      
                .section-title {
                  background: #4f46e5;
                  color: white;
                  padding: 12px;
                  border-radius: 8px;
                  text-align: center;
                  font-size: 22px;
                  margin-bottom: 24px;
                }
      
                .info-box strong {
                  font-weight: 600;
                }
                .print{
                  display:flex;
                  justify:center;
                  flex-direction:column;  
                }
                 .vasttram{
                  text-align: left;
                  color: #236;
                }
                .no-print{
                    display:none;
                }
                @media print {
                  body {
                    margin: 0;
                  }
                }
              </style>
            </head>
            <body>
                 <h3 class="vasttram"> Vasttram</h3>
              <header>
                <h1>Jobber Report</h1>
                <p>Generated on: ${new Date().toLocaleString()}</p>
              </header>
      
              <div class="info-grid">
                ${printContent}
              </div>
      
              <script>
                window.onload = function () {
                  window.print();
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

  console.log("stitcher: ", stitcher)


  if (loading) return (
    <div className="absolute inset-0 flex justify-center items-center bg-opacity-50 bg-gray-200 z-10">
      <BounceLoader size={100} color={"#1e3a8a"} loading={loading} />
    </div>
  );

  if (error) return <div className="text-center text-red-500 mt-10">{error}</div>;

  return (
    <div className="w-4/5 h-[82vh] mx-auto mt-4 p-8 bg-white shadow-2xl rounded-2xl border border-gray-200">
      {/* CSS Inside JSX (For Hiding Elements in Print) */}
      <style>
        {`
                    @media print {
                        .no-print {
                            display: none;
                        }
                    }
                `}
      </style>

      {/* Buttons (Hidden in Print) */}
      <div className="flex justify-between mb-6 no-print">
        <button
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition"
          onClick={() => navigate("/stitcher-master")}
        >
          <FaArrowLeft /> Back to Stitcher
        </button>

        <button
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
          onClick={handlePrint}
        >
          <FaPrint /> Print
        </button>
      </div>

      {/* Printable Content */}
      <div id="printable-content" className="print">
        {/* Jobber Details Header */}
        <div className="text-center bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-4 rounded-lg shadow-md">
          <h2 className="text-3xl font-bold">Stitcher Details</h2>
        </div>

        {/* Jobber Info */}
        <div className="grid grid-cols-2 gap-6 mt-6">
          <div className="flex items-center gap-3 p-4 bg-gray-100 rounded-lg shadow-md">
            <FaIdBadge className="text-blue-500 text-xl no-print" />
            <span><strong>Stitcher ID:</strong> {stitcher.id}</span>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gray-100 rounded-lg shadow-md">
            <FaUser className="text-green-500 text-xl no-print" />
            <span><strong>Name:</strong> {stitcher.stitcher_name}</span>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gray-100 rounded-lg shadow-md">
            <FaIndustry className="text-purple-500 text-xl no-print" />
            <span><strong>Type:</strong> {stitcher.stitcher_type}</span>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gray-100 rounded-lg shadow-md">
            <FaIdBadge className="text-indigo-500 text-xl no-print" />
            <span><strong>Stitcher Code:</strong> {stitcher.stitcher_code}</span>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gray-100 rounded-lg shadow-md">
            <FaMapMarkerAlt className="text-orange-500 text-xl no-print" />
            <span><strong>Address:</strong> {stitcher.address}</span>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gray-100 rounded-lg shadow-md">
            <FaFileInvoice className="text-orange-500 text-xl no-print" />
            <span><strong>Remark:</strong> {stitcher.remarks}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StitcherMaster;

