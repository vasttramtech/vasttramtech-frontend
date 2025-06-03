import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft, FaPrint } from "react-icons/fa";
import { BounceLoader } from "react-spinners";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const SupplierView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [supplier, setSupplier] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { token } = useSelector(state => state.auth);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await axios.get(
                    `${process.env.REACT_APP_BACKEND_URL}/api/supplier-masters/${id}?populate=*`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                if (response.data && response.data.data) {
                    setSupplier(response.data.data);
                } else {
                    setError("No Supplier data found.");
                    toast.error("No Supplier data found.");
                }
            } catch (error) {
                console.error("Error fetching supplier data:", error);
                setError("Failed to fetch supplier data.");
                toast.error("Failed to fetch supplier data.");
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
              <title>Supplier Details Report</title>
              <style>
                body {
                  font-family: 'Segoe UI', sans-serif;
                  padding: 40px;
                  color: #333;
                  background-color: #fff;
                }
                h1{
                    text-align:center;
                    font-size: 28px; 
                }
                h2 {
                  font-size: 28px;
                  font-weight: bold;
                  border-bottom: 2px solid #444;
                  padding-bottom: 10px;
                  margin-bottom: 30px;
                  color: #222;
                }
                h3 {
                  font-size: 20px;
                  font-weight: 600;
                  margin-top: 30px;
                  color: #333;
                  margin-bottom: 10px;
                  border-bottom: 1px solid #ccc;
                  padding-bottom: 6px;
                }
                .section {
                  margin-bottom: 25px;
                  padding: 10px;
                  background-color: #f9f9f9;
                  border: 1px solid #ddd;
                  border-radius: 8px;
                }
                .field {
                  margin: 6px 0;
                  font-size: 16px;
                }
                .label {
                  font-weight: 600;
                  color: #000;
                }
                .vasttram {
                    text-align: left;
                    color: #2c3e90;
                    font-size: 28px;
                    font-weight: 600;
                }
                header {
                    border-bottom: 2px solid #444;
                    text-align:center;
                    font-size: 28px;
                    margin-bottom: 20px;
                    font-weight: 600;
                }
                p{
                  font-size: 16px;
                }
                .person-box {
                  margin-top: 12px;
                  padding: 12px;
                  border: 1px solid #ccc;
                  background: #fff;
                  border-radius: 8px;
                }
              </style>
            </head>
            <body>

            <p class="vasttram"> Vasttram </p>
            
            <header> 
                <h1>Supplier Details</h1>
                <p>Generated on: ${new Date().toLocaleString()}</p>
            </header>
              <div class="section">
                <h3>Basic Information</h3>
                <div class="field"><span class="label">Supplier ID:</span> ${supplier.supplier_id}</div>
                <div class="field"><span class="label">Company Name:</span> ${supplier.company_name}</div>
                <div class="field"><span class="label">Company Type:</span> ${supplier.company_type}</div>
                <div class="field"><span class="label">Group Name:</span> ${supplier.group_name}</div>
                <div class="field"><span class="label">Website:</span> ${supplier.website}</div>
              </div>
      
              <div class="section">
                <h3>Contact Information</h3>
                <div class="field"><span class="label">Contact Number:</span> ${supplier.contact_number}</div>
                <div class="field"><span class="label">Email:</span> ${supplier.email_id}</div>
                <div class="field"><span class="label">State:</span> ${supplier.state}</div>
              </div>
      
              <div class="section">
                <h3>Address Details</h3>
                <div class="field"><span class="label">Address Category:</span> ${supplier.address_category}</div>
                <div class="field"><span class="label">PAN Number:</span> ${supplier.pan_number}</div>
                <div class="field"><span class="label">GSTIN:</span> ${supplier.gstin_number}</div>
              </div>
      
              <div class="section">
                <h3>Credit & Financial Details</h3>
                <div class="field"><span class="label">Credit Limit:</span> ${supplier.credit_limit}</div>
                <div class="field"><span class="label">Credit Limit Days:</span> ${supplier.credit_limit_days}</div>
              </div>
      
              ${
                supplier.concerned_person_details?.length > 0
                  ? `
                  <div class="section">
                    <h3>Concerned Person Details</h3>
                    ${supplier.concerned_person_details
                      .map(
                        (person, index) => `
                          <div class="person-box">
                            <div class="field"><span class="label">Name:</span> ${person.concerned_person_name}</div>
                            <div class="field"><span class="label">Designation:</span> ${person.designation}</div>
                            <div class="field"><span class="label">Email:</span> ${person.email_id}</div>
                            <div class="field"><span class="label">Phone:</span> ${person.mobile_number_1}</div>
                            <div class="field"><span class="label">Address:</span> ${person.address}</div>
                          </div>
                        `
                      )
                      .join("")}
                  </div>
                `
                  : ""
              }
      
              <script>
                window.onload = function () {
                  window.print();
                  setTimeout(()=> window.close(), 500);
                  window.onafterprint = function () {
                    window.close();
                  };
                };
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
                    onClick={() => navigate("/supplier-master")}
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

            {/* Supplier Details */}
            <h2 className="text-2xl font-bold text-gray-800 border-b pb-4">Supplier Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                {/* Left Column */}
                <div className="bg-gray-100 p-5 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-gray-700">Basic Information</h3>
                    <p className="text-gray-600"><span className="font-semibold">Supplier ID:</span> {supplier.supplier_id}</p>
                    <p className="text-gray-600"><span className="font-semibold">Company Name:</span> {supplier.company_name}</p>
                    <p className="text-gray-600"><span className="font-semibold">Company Type:</span> {supplier.company_type}</p>
                    <p className="text-gray-600"><span className="font-semibold">Group Name:</span> {supplier.group_name}</p>
                    <p className="text-gray-600"><span className="font-semibold">Website:</span> {supplier.website}</p>
                </div>

                {/* Right Column */}
                <div className="bg-gray-100 p-5 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-gray-700">Contact Information</h3>
                    <p className="text-gray-600"><span className="font-semibold">Contact Number:</span> {supplier.contact_number}</p>
                    <p className="text-gray-600"><span className="font-semibold">Email:</span> {supplier.email_id}</p>
                    <p className="text-gray-600"><span className="font-semibold">State:</span> {supplier.state}</p>
                </div>
            </div>

            {/* Address & Billing Section */}
            <div className="mt-8 bg-gray-100 p-5 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-700">Address Details</h3>
                <p className="text-gray-600"><span className="font-semibold">Address Category:</span> {supplier.address_category}</p>
                <p className="text-gray-600"><span className="font-semibold">PAN Number:</span> {supplier.pan_number}</p>
                <p className="text-gray-600"><span className="font-semibold">GSTIN:</span> {supplier.gstin_number}</p>
            </div>

            {/* Credit & Financial Details */}
            <div className="mt-8 bg-gray-100 p-5 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-700">Credit & Financial Details</h3>
                <p className="text-gray-600"><span className="font-semibold">Credit Limit:</span> {supplier.credit_limit}</p>
                <p className="text-gray-600"><span className="font-semibold">Credit Limit Days:</span> {supplier.credit_limit_days}</p>
            </div>

            {/* Concerned Person Details */}
            {supplier.concerned_person_details?.length > 0 && (
                <div className="mt-8 bg-gray-100 p-5 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-gray-700">Concerned Person Details</h3>
                    {supplier.concerned_person_details.map((person, index) => (
                        <div key={index} className="mt-4 p-4 bg-white rounded-lg shadow">
                            <p className="text-gray-600"><span className="font-semibold">Name:</span> {person.concerned_person_name}</p>
                            <p className="text-gray-600"><span className="font-semibold">Designation:</span> {person.designation}</p>
                            <p className="text-gray-600"><span className="font-semibold">Email:</span> {person.email_id}</p>
                            <p className="text-gray-600"><span className="font-semibold">Phone:</span> {person.mobile_number_1}</p>
                            <p className="text-gray-600"><span className="font-semibold">Address:</span> {person.address}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SupplierView;
