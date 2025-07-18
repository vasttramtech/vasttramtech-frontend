import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { PuffLoader, BounceLoader } from "react-spinners";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AddKarigar from "../AddKarigar";
import { MdCancel } from "react-icons/md";


const EditColorMaster = ({ setOpenEditModal, selectedRow, fetchColorMasterData }) => {

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { token } = useSelector((state) => state.auth);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        colorId: "",
        colorName: ""
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };

    const fetchColorWithId = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/colors/${selectedRow?.id}?populate=*`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // const data = Array.isArray(response.data.data) ? response.data.data : [];
            const data = response.data.data;
            const updatedFormData = {
                colorId: data?.color_id || "",
                colorName: data?.color_name || "",
            };
            setFormData(updatedFormData)

        } catch (error) {
            console.error("Error fetching jobber data:", error);
            if (error.response?.status === 401) {
                navigate("/login");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchColorWithId();
        } else {
            navigate("/login");
        }
    }, [token, selectedRow]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        const postData = {
            data: {
                color_name: formData.colorName,
                color_id: formData.colorId
            }
        };

        try {
            await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/colors/${selectedRow?.id}`, postData, {
                headers: {
                    Authorization: `Bearer ${token}`, // Send token in the Authorization header
                },
            });
            // Optionally handle success (e.g., notify user, reset form)
            toast.success("Color saved successfully!", { position: "top-right" });

            setFormData({
                colorName: "",
                colorId: ""
            });
            setOpenEditModal(false)
            fetchColorMasterData();

        } catch (error) {
            console.error("Error posting color data:", error);
            toast.error(error?.response?.data?.error?.message);
        } finally {
            setSubmitting(false); // Stop the spinner
        }
    };

    return (
        <div className="bg-white w-full">
            <div className="flex justify-between items-center mb-4 pb-2 border-b">
                <h1 className="text-xl font-bold text-blue-900">Edit Color Master</h1>
                <button onClick={() => setOpenEditModal(false)} className="text-red-500 hover:text-red-700 hover:scale-105 transition-all ease-in-out duration-200">
                    <MdCancel className="w-8 h-8" />
                </button>
            </div>

            <form className="grid grid-cols-2 gap-6 p-2 " onSubmit={handleUpdate}>


                {/* Color ID */}
                <div className="flex flex-col">
                    <label className="text-gray-700 font-semibold">Color Id</label>
                    <input type="text" className="border border-gray-300 bg-gray-100 rounded-md p-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Color Id"
                        name="colorId"
                        value={formData.colorId}
                        onChange={handleInputChange}
                    />
                </div>

                {/* Color Name */}
                <div className="flex flex-col">
                    <label className="text-gray-700 font-semibold">Color Name</label>
                    <input type="text" className="border border-gray-300 bg-gray-100 rounded-md p-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Color Name"
                        name="colorName"
                        value={formData.colorName}
                        onChange={handleInputChange}
                    />
                </div>

                {/* Buttons */}
                <div className="col-span-2 flex justify-end mt-4">
                    <button type="button" className="bg-gray-200 px-4 py-1 rounded hover:bg-gray-600 hover:text-white transition"
                        onClick={() => setOpenEditModal(false)}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className={`bg-blue-900 ml-2 px-6 py-2 rounded text-white font-semibold transition-all ease-in-out duration-300 transform ${submitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
                            }`}
                        disabled={submitting}
                    >
                        {submitting ? (
                            <div className="flex justify-center items-center space-x-2">
                                <PuffLoader size={20} color="#fff" />
                                <span>Updating...</span>
                            </div>
                        ) : (
                            'Update'
                        )}
                    </button>
                </div>
            </form>

        </div>
    )
};

export default EditColorMaster;

