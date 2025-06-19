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

const JobberMaster = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [jobber, setJobber] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        const fetchJobberData = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/jobber-masters/${id}?populate=*`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });

                if (response.data && response.data.data) {
                    setJobber(response.data.data);
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

        fetchJobberData();
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
                    onClick={() => navigate("/jobber-master")}
                >
                    <FaArrowLeft /> Back to Jobbers
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
                    <h2 className="text-3xl font-bold">Jobber Details</h2>
                </div>

                {/* Jobber Info */}
                <div className="grid grid-cols-2 gap-6 mt-6">
                    <div className="flex items-center gap-3 p-4 bg-gray-100 rounded-lg shadow-md">
                        <FaIdBadge className="text-blue-500 text-xl no-print" />
                        <span><strong>Jobber ID:</strong> {jobber.jobber_id}</span>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-gray-100 rounded-lg shadow-md">
                        <FaUser className="text-green-500 text-xl no-print" />
                        <span><strong>Name:</strong> {jobber.jobber_name}</span>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-gray-100 rounded-lg shadow-md">
                        <FaIndustry className="text-purple-500 text-xl no-print" />
                        <span><strong>Work Type:</strong> {jobber.work_type}</span>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-gray-100 rounded-lg shadow-md">
                        <FaCalendar className="text-yellow-500 text-xl no-print" />
                        <span><strong>Days:</strong> {jobber.days}</span>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-gray-100 rounded-lg shadow-md">
                        <FaMapMarkerAlt className="text-red-500 text-xl no-print" />
                        <span><strong>State:</strong> {jobber.state}</span>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-gray-100 rounded-lg shadow-md">
                        <FaIdBadge className="text-indigo-500 text-xl no-print" />
                        <span><strong>Jobber Code:</strong> {jobber.jobber_code}</span>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-gray-100 rounded-lg shadow-md">
                        <FaFileInvoice className="text-teal-500 text-xl no-print" />
                        <span><strong>GSTIN:</strong> {jobber.jobber_gstin}</span>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-gray-100 rounded-lg shadow-md">
                        <FaMapMarkerAlt className="text-orange-500 text-xl no-print" />
                        <span><strong>Address:</strong> {jobber.jobber_address}</span>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-gray-100 rounded-lg shadow-md col-span-2">
                        <FaFileInvoice className="text-orange-500 text-xl no-print" />
                        <span><strong>Jobber Pan:</strong> {jobber.jobber_plan}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobberMaster;

