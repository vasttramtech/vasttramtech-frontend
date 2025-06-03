import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BounceLoader } from "react-spinners";
import { useSelector } from "react-redux";
import { FaTimes } from "react-icons/fa";

const ViewImages = ({ setOpenImagesModal, designId }) => {
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
                    `${process.env.REACT_APP_BACKEND_URL}/api/design-entry-pages/${designId}?populate=*`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                if (response.data && response.data.data) {
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
    }, [designId, navigate, token]);

    if (loading)
        return (
            <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
                <BounceLoader size={100} color={"#1e3a8a"} loading={loading} />
            </div>
        );

    if (error)
        return (
            <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <p className="text-red-500">{error}</p>
                    <button
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-800"
                        onClick={() => setOpenImagesModal(false)}
                    >
                        Close
                    </button>
                </div>
            </div>
        );

    return (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
            {/* Modal Container */}
            <div className="w-11/12 md:w-3/4 lg:w-2/3 max-h-[80vh] overflow-y-auto bg-white shadow-lg rounded-xl p-6 relative">
                {/* Close Button */}
                <button
                    className="absolute mt-2 top-4 right-4 text-gray-600 hover:text-gray-900 text-2xl"
                    onClick={() => setOpenImagesModal(false)}
                >
                    <FaTimes />
                </button>

                {/* Modal Content */}
                <h1 className="text-2xl font-bold text-center mb-6">Design Entry Images</h1>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 ml-8">
                    {/* Images Section */}
                    <div>
                        <h2 className="text-lg font-semibold">Images</h2>
                        <div className="flex flex-wrap gap-4 mt-4">
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

                    {/* Final Images Section */}
                    <div>
                        <h2 className="text-lg font-semibold">Final Images</h2>
                        <div className="flex flex-wrap gap-4 mt-4">
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

                    {/* Cost Images Section */}
                    <div>
                        <h2 className="text-lg font-semibold">Cost Images</h2>
                        <div className="flex flex-wrap gap-4 mt-4">
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
        </div>
    );
};

export default ViewImages;
