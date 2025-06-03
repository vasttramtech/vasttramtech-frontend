import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft, FaPrint } from "react-icons/fa";
import { BounceLoader } from "react-spinners";
import { useSelector } from "react-redux";

const ColorView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [colors, setColors] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { token } = useSelector(state => state.auth);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await axios.get(
                    `${process.env.REACT_APP_BACKEND_URL}/api/colors/${id}?populate=*`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                if (response.data && response.data.data) {
                    setColors(response.data.data);
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
        window.print();
    };

    console.log("colors: ", colors)

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
                    onClick={() => navigate("/color-master")}
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

            <h2 className="text-2xl font-bold text-gray-800 mt-8">Color Details</h2>
                <div className="grid grid-cols-2 gap-4 text-gray-700 mt-4">
                    <div><strong>Color ID:</strong> {colors?.color_id || "N/A"}</div>
                    <div><strong>Color Name:</strong> {colors?.color_name || "N/A"}</div>
                </div>

        </div>
    );
};

export default ColorView;