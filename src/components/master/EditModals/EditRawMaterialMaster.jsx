import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { PuffLoader, BounceLoader } from "react-spinners";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AddKarigar from "../AddKarigar";
import { MdCancel } from "react-icons/md";


const EditRawMaterialMaster = ({ setOpenEditModal, selectedRow, materialGroup, unit, HSN_SAC_Code, colors, fetchRawMaterialData }) => {

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { token } = useSelector((state) => state.auth);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        item_name: "",
        description: "",
        unit: "",
        pricePerUnit: "",
        group: "",
        color: "",
        hsn_sac_code: "",
    });



    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };

    const fetchRawMaterialDataWithId = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/raw-material-masters/${selectedRow?.id}?populate[unit]=*&populate[group]=*&populate[color]=*&populate[hsn_sac_code]=*`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // console.log("response: ", response)
            // const data = Array.isArray(response.data.data) ? response.data.data : [];
            const data = response.data.data;
            const updatedFormData = {
                item_name: data?.item_name || "",
                group: data?.group?.id || "",
                color: data?.color?.id || "",
                unit: data?.unit?.id || "",
                pricePerUnit: data?.price_per_unit || "",
                description: data?.description || "",
                hsn_sac_code: data?.hsn_sac_code?.id || "",

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
            fetchRawMaterialDataWithId();
        } else {
            navigate("/login");
        }
    }, [token, selectedRow]);




    const handleUpdate = async (e) => {
        e.preventDefault();
        setSubmitting(true);


        const postData = {
            data: {
                item_id: selectedRow.item_id,
                item_name: formData.item_name,
                description: formData.description,
                unit: formData.unit,  // These should be IDs
                price_per_unit: formData.pricePerUnit,
                group: formData.group,
                color: formData.color,
                hsn_sac_code: formData.hsn_sac_code,
            }
        };

        try {
            const response = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/raw-material-masters/${selectedRow?.id}`, postData, {
                headers: {
                    Authorization: `Bearer ${token}`, // Send token in the Authorization header
                },
            });
            console.log("Raw Material Data:", response);
            toast.success("Raw Material data updated successfully!", { position: "top-right" });

            setFormData({
                item_name: "",
                description: "",
                unit: "",
                pricePerUnit: "",
                group: "",
                color: "",
                hsn_sac_code: "",
            });
            setOpenEditModal(false);
            fetchRawMaterialData();

        } catch (error) {
            console.error("Error posting jobber data:", error);
            toast.error(error?.response?.data?.error?.message);
        } finally {
            setSubmitting(false); // Stop the spinner
        }
    };



    return (
        <div className=" rounded-lg  w-full">

            <div className="flex justify-between items-center border-b  pb-2 mb-4">
                <h1 className="text-xl text-blue-900 font-bold">Edit Raw Material Master</h1>
                <button onClick={() => setOpenEditModal(false)} className="text-red-500 hover:text-red-700 duration-200 ease-in-out transition-all hover:scale-105">
                    <MdCancel className="w-8 h-8" />
                </button>
            </div>

            {
                loading ? (
                    <div className="flex justify-center items-center h-full">
                        <BounceLoader size={50} color={"black"} loading={loading} />
                    </div>

                ) : (


                    <form className="grid grid-cols-2 gap-6 p-2 mb-16" onSubmit={handleUpdate}>
                        {/* Group */}
                        <div className="flex flex-col">
                            <label className="text-gray-700 font-semibold">Group</label>
                            <div className="flex items-center gap-2">
                                <select className="flex-grow border border-gray-300 bg-gray-100 rounded-md p-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500" name="group"
                                    value={formData.group}
                                    onChange={handleInputChange}
                                >
                                    <option value="" disabled selected>Group</option>
                                    {materialGroup.map((group, index) => (
                                        <option key={index} value={group?.id
                                        }>{group?.group_name
                                            }</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* HSN/SAC Code */}
                        <div className="flex flex-col">
                            <label className="text-gray-700 font-semibold">HSN/SAC Code</label>
                            <div className="flex items-center gap-2">
                                <select className="flex-grow border border-gray-300 bg-gray-100 rounded-md p-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500" name="hsn_sac_code"
                                    value={formData.hsn_sac_code}
                                    onChange={handleInputChange}
                                >
                                    <option value="" disabled selected>HSN/SAC Code</option>
                                    {HSN_SAC_Code.map((group, index) => (
                                        <option key={index} value={group?.id
                                        }>{group?.hsn_sac_code
                                            }</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Item Name */}
                        <div className="flex flex-col">
                            <label className="text-gray-700 font-semibold">Item Name</label>
                            <input type="text" className="border border-gray-300 bg-gray-100 rounded-md p-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="semi-Finished Goods Name"
                                name="item_name"
                                value={formData.item_name}
                                onChange={handleInputChange}
                            />
                        </div>

                        {/* Unit */}
                        <div className="flex flex-col">
                            <label className="text-gray-700 font-semibold">Unit</label>
                            <div className="flex items-center gap-2">
                                <select
                                    name="unit"
                                    className="flex-grow border border-gray-300 bg-gray-100 rounded-md p-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={formData.unit}
                                    onChange={handleInputChange}
                                >
                                    <option value="" disabled>
                                        Select Jobber Code
                                    </option>
                                    {unit.map((unit) => (
                                        <option key={unit.id} value={unit.
                                            id}>
                                            {unit.
                                                unit_name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Price per unit */}
                        <div className="flex flex-col">
                            <label className="text-gray-700 font-semibold">Price per unit</label>
                            <input type="number" className="border border-gray-300 bg-gray-100 rounded-md p-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="semi-Finished Goods Name"
                                name="pricePerUnit"
                                value={formData.pricePerUnit}
                                onChange={handleInputChange}
                            />
                        </div>

                        {/* Color */}
                        <div className="flex flex-col">
                            <label className="text-gray-700 font-semibold">Color</label>
                            <div className="flex items-center gap-2">
                                <select className="flex-grow border border-gray-300 bg-gray-100 rounded-md p-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    name="color"
                                    value={formData.color}
                                    onChange={handleInputChange}
                                >
                                    <option value="" disabled selected>Color</option>
                                    {colors.map((color) => (
                                        <option key={color.id} value={color.
                                            id}>
                                            {`${color.color_id} - ${color.color_name}`}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="flex flex-col">
                            <label className="text-gray-700 font-semibold">Description</label>
                            <textarea className="border border-gray-300 bg-gray-100 rounded-md p-2 h-40 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full" placeholder="Description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                            ></textarea>
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

                )}
        </div>
    )
};

export default EditRawMaterialMaster;