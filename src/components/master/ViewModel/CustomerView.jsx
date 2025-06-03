import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft, FaPrint } from "react-icons/fa";
import { BounceLoader } from "react-spinners";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const CustomerView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { token } = useSelector(state => state.auth);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await axios.get(
                    `${process.env.REACT_APP_BACKEND_URL}/api/customer-masters/${id}?populate=*`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                if (response.data && response.data.data) {
                    setCustomer(response.data.data);
                } else {
                    setError("No Customer data found.");
                    toast.error("No Customer data found.");
                }
            } catch (error) {
                console.error("Error fetching customer data:", error);
                setError("Failed to fetch customer data.");
                toast.error("Failed to fetch customer data.");
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
        const c = customer;
      
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
          <html>
      <head>
        <title>Customer Details Report</title>
        <style>
          body {
            font-family: 'Segoe UI', sans-serif;
            margin: 20px;
            color: #333;
          }

          header {
                border-bottom: 2px solid #444;
                text-align:center;
                color: #2c3e50;
                margin-bottom: 20px;

                font-size: 28px;
                font-weight: 600;
                }

                .vasttram {
                  text-align: left;
                  color: #2c3e90;
                  font-size: 28px;
                  font-weight: 600;
                }
          section {
            margin-bottom: 10px;
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 15px;
            background-color: #f9f9f9;
          }


          h3 {
            font-size: 20px;
            font-weight: 600;
            margin-bottom: 10px;
            border-bottom: 1px solid #ccc;
            padding-bottom: 5px;
          }

          .row {
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
          }

          .column {
            flex: 0 0 48%;
            margin-bottom: 15px;
          }

          p {
            margin: 6px 0;
            font-size: 16px;
          }

          span {
            font-weight: 600;
            color: #000;
          }

          .concerned-person {
            background: #fff;
            padding: 5px;
            margin-top: 5px;
            border: 1px solid #ccc;
            border-radius: 6px;
          }


        </style>
      </head>
      <body>
        <p class="vasttram"> Vasttram </p>
        <header>
          Customer Details Report
        <p>Generated on: ${new Date().toLocaleString()}</p>
        </header>

        <section>
          <h3>Basic Information</h3>
          <div class="row">
            <div class="column">
              <p><span>Customer ID:</span> ${c?.customer_id || 'N/A'}</p>
              <p><span>Company Name:</span> ${c?.company_name || 'N/A'}</p>
              <p><span>Group Name:</span> ${c?.group_name || 'N/A'}</p>
              <p><span>Website:</span> ${c?.website || 'N/A'}</p>
              <p><span>State:</span> ${c?.state || 'N/A'}</p>
            </div>
            <div class="column">
              <p><span>Contact Number:</span> ${c?.contact_number || 'N/A'}</p>
              <p><span>Email:</span> ${c?.email_id || 'N/A'}</p>
              <p><span>Alternate Email:</span> ${c?.alternate_email_id || 'N/A'}</p>
              <p><span>Fax Number:</span> ${c?.fax_number || 'N/A'}</p>
            </div>
          </div>
        </section>

        <section>
          <h3>Address Details</h3>
          <p><span>Billing Address:</span> ${c?.billing_address || 'N/A'}</p>
          <p><span>Address Category:</span> ${c?.address_category || 'N/A'}</p>
          <p><span>PAN Number:</span> ${c?.pan_number || 'N/A'}</p>
          <p><span>GSTIN:</span> ${c?.gstin_number || 'N/A'}</p>
        </section>

        <section>
          <h3>Credit & Financial Details</h3>
          <p><span>Credit Limit:</span> ${c?.credit_limit || 'N/A'}</p>
          <p><span>Credit Limit Days:</span> ${c?.credit_limit_days || 'N/A'}</p>
        </section>

        ${
          c?.concerned_person_details?.length > 0
            ? `
              <section>
                <h3>Concerned Person Details</h3>
                ${c.concerned_person_details.map((person, index) => `
                  <div class="concerned-person">
                    <p><span>Name:</span> ${person.concerned_person_name || 'N/A'}</p>
                    <p><span>Designation:</span> ${person.designation || 'N/A'}</p>
                    <p><span>Email:</span> ${person.email_id || 'N/A'}</p>
                    <p><span>Phone:</span> ${person.mobile_number_1 || 'N/A'}</p>
                    <p><span>Address:</span> ${person.address || 'N/A'}</p>
                  </div>
                `).join('')}
              </section>
            `
            : ''
        }
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
                    onClick={() => navigate("/customer-master")}
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

            {/* Customer Details */}
            <h2 className="text-2xl font-bold text-gray-800 border-b pb-4">Customer Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                {/* Left Column */}
                <div className="bg-gray-100 p-5 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-gray-700">Basic Information</h3>
                    <p className="text-gray-600"><span className="font-semibold">Customer ID:</span> {customer.customer_id}</p>
                    <p className="text-gray-600"><span className="font-semibold">Company Name:</span> {customer.company_name}</p>
                    <p className="text-gray-600"><span className="font-semibold">Group Name:</span> {customer.group_name}</p>
                    <p className="text-gray-600"><span className="font-semibold">Website:</span> {customer.website}</p>
                    <p className="text-gray-600"><span className="font-semibold">State:</span> {customer.state}</p>
                </div>

                {/* Right Column */}
                <div className="bg-gray-100 p-5 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-gray-700">Contact Information</h3>
                    <p className="text-gray-600"><span className="font-semibold">Contact Number:</span> {customer.contact_number}</p>
                    <p className="text-gray-600"><span className="font-semibold">Email:</span> {customer.email_id}</p>
                    <p className="text-gray-600"><span className="font-semibold">Alternate Email:</span> {customer.alternate_email_id}</p>
                    <p className="text-gray-600"><span className="font-semibold">Fax Number:</span> {customer.fax_number}</p>
                </div>
            </div>

            {/* Address & Billing Section */}
            <div className="mt-8 bg-gray-100 p-5 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-700">Address Details</h3>
                <p className="text-gray-600"><span className="font-semibold">Billing Address:</span> {customer.billing_address}</p>
                <p className="text-gray-600"><span className="font-semibold">Address Category:</span> {customer.address_category}</p>
                <p className="text-gray-600"><span className="font-semibold">PAN Number:</span> {customer.pan_number}</p>
                <p className="text-gray-600"><span className="font-semibold">GSTIN:</span> {customer.gstin_number}</p>
            </div>

            {/* Credit & Financial Details */}
            <div className="mt-8 bg-gray-100 p-5 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-700">Credit & Financial Details</h3>
                <p className="text-gray-600"><span className="font-semibold">Credit Limit:</span> {customer.credit_limit}</p>
                <p className="text-gray-600"><span className="font-semibold">Credit Limit Days:</span> {customer.credit_limit_days}</p>
            </div>

            {/* Concerned Person Details */}
            {customer.concerned_person_details?.length > 0 && (
                <div className="mt-8 bg-gray-100 p-5 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-gray-700">Concerned Person Details</h3>
                    {customer.concerned_person_details.map((person, index) => (
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

export default CustomerView;
