import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { PuffLoader, BounceLoader } from "react-spinners";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AddKarigar from "../AddKarigar";
import { MdCancel } from "react-icons/md";
import { Plus } from "lucide-react";


const EditSemiFinishedGoodsMaster = ({ selectedRow, setOpenEditModal, semiFinishedGoods, setSemiGoodsModel, unit, setUnitModel, fetchSemiFinishedGoodsData, colors }) => {

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { token } = useSelector((state) => state.auth);
    const [submitting, setSubmitting] = useState(false);
    const [selectedJobbers, setSelectedJobbers] = useState([]);
    const [jobberModal, setJobberModal] = useState(false);
    const [addedJobber, setAddedJobber] = useState([]);
    const [jobber, setJobber] = useState([]);
    const [formData, setFormData] = useState({
        group: "",
        semi_finished_goods_name: "",
        unit: "",
        description: "",
    });

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };





    useEffect(() => {
        const fetchSemifinishedGoodsData = async () => {
            try {
                setLoading(true);
                const response = await axios.get(
                    `${process.env.REACT_APP_BACKEND_URL}/api/semi-finished-goods-masters/${selectedRow?.id}?populate[unit]=*&populate[group]=*`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (response.data && response.data.data) {
                    console.log("response.data.data", response.data.data);
                    const data = response.data.data;
                    const updatedFormData = {
                        group: data?.group?.id || "",
                        semi_finished_goods_name: data?.semi_finished_goods_name || "",
                        unit: data?.unit?.id || "",
                        description: data?.description || "",

                    };

                    setFormData(updatedFormData);

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

        if (selectedRow?.id) {
            fetchSemifinishedGoodsData();
        }
    }, [token, selectedRow]);


    const handleUpdate = async (e) => {
        e.preventDefault();
        setSubmitting(true);


        const postData = {
            data: {
                item_id: selectedRow.item_id,
                semi_finished_goods_name: formData.semi_finished_goods_name,
                description: formData.description,
                unit: formData.unit,
                group: formData.group,
            }
        };

        try {
            await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/semi-finished-goods-masters/${selectedRow?.id}`, postData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            // Optionally handle success (e.g., notify user, reset form)
            toast.success("Semi Finished Goods data updated successfully!", { position: "top-right" });

            setFormData({
                group: "",
                semi_finished_goods_name: "",
                unit: "",
                description: "",
            });

            setOpenEditModal(false);
            fetchSemiFinishedGoodsData();

        } catch (error) {
            console.error("Error posting jobber data:", error);
            toast.error(error?.response?.data?.error?.message);
        } finally {
            setSubmitting(false); // Stop the spinner
        }
    }

    // console.log("formData: ", formData)
    // console.log("selectedJobbers: ", selectedJobbers)
    // console.log("jobber: ", jobber)

    return (
        <div className="  rounded-lg w-full z-30">
            <div className="flex justify-between mb-4 border-b pb-2">
                <h1 className="text-lg font-bold text-blue-900">Edit Semi Finished Goods Master</h1>
                <button onClick={() => setOpenEditModal(false)} className="text-red-500 hover:text-red-700 hover:scale-105 duration-200 ease-in-out transition-all">
                    <MdCancel className=" h-8 w-8" />
                </button>
            </div>



            <form className="grid grid-cols-2 gap-6 " onSubmit={handleUpdate}>
                {/* Design Group */}
                <div className="flex flex-col">
                    <label className="text-gray-700 font-semibold">Group</label>
                    <div className="flex items-center gap-2">
                        <select name="group" value={formData.group} className="flex-grow border border-gray-300 bg-gray-100 rounded-md p-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500" onChange={handleFormChange} >
                            <option value="" disabled selected>Select Design Group</option>
                            {semiFinishedGoods.map((group, index) => (
                                <option key={index} value={group?.id
                                }>{group?.group_name
                                    }</option>
                            ))}
                        </select>
                        <button
                            type="button"
                            className="flex items-center justify-center w-8 h-8 bg-blue-900 text-white rounded-full text-xl hover:bg-blue-700 transition"
                            onClick={() => setSemiGoodsModel(true)}
                        >
                            <Plus className="w-4 h-4" />

                        </button>
                    </div>
                </div>




                {/* Semi-Finished Goods Name */}
                <div className="flex flex-col">
                    <label className="text-gray-700 font-semibold">Semi-Finished Goods Name</label>
                    <input type="text" name="semi_finished_goods_name" onChange={handleFormChange} value={formData.semi_finished_goods_name} className="border border-gray-300 bg-gray-100 rounded-md p-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="semi-Finished Goods Name" />
                </div>

                {/* Unit */}
                <div className="flex flex-col">
                    <label className="text-gray-700 font-semibold">Unit</label>
                    <div className="flex items-center gap-2">
                        <select value={formData.unit} name="unit" className="flex-grow border border-gray-300 bg-gray-100 rounded-md p-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500" onChange={(e) => { e.target.classList.add('text-black'); setFormData(prev => ({ ...prev, [e.target.name]: e.target.value })) }}>
                            <option value="" disabled selected>Unit</option>
                            {unit.map((unit) => (
                                <option key={unit.id} value={unit.id}>
                                    {unit.
                                        unit_name}
                                </option>
                            ))}
                        </select>
                        <button
                            type="button"
                            className="flex items-center justify-center w-8 h-8 bg-blue-900 text-white rounded-full text-xl hover:bg-blue-700 transition"
                            onClick={() => setUnitModel(true)}
                        >
                            <Plus className="w-4 h-4" />

                        </button>
                    </div>
                </div>



                {/* Description - Full width of Semi-Finished Goods Name + Unit */}
                <div className="flex flex-col col-span-2">
                    <label className="text-gray-700 font-semibold">Description</label>
                    <textarea name="description" onChange={handleFormChange} value={formData.description} className="border border-gray-300 bg-gray-100 rounded-md p-2 h-40 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full" placeholder="Description"></textarea>
                </div>



                {/* Buttons */}
                <div className="col-span-2 flex justify-end mt-4">
                    <button type="button" className="bg-gray-200 px-4 py-1 rounded hover:bg-gray-600 hover:text-white transition" onClick={() => setOpenEditModal(false)}>
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

export default EditSemiFinishedGoodsMaster;