import { useLocation } from "react-router-dom";
import SmartTable from "../../smartTable/SmartTable";
import { useNavigate } from "react-router-dom";
import { BACKEND_API } from "../../assets/Constant";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { ClipLoader, BounceLoader, HashLoader, RingLoader, CircleLoader, MoonLoader, PuffLoader } from "react-spinners";
import { toast } from "react-toastify";
import { fetchJobberMasters } from "../../state/jobberMastersSlice";
import EditIcon from "../../assets/Others/EditIcon.png";
import ViewIcon from "../../assets/Others/ViewIcon.png";
import Pagination from "../utility/Pagination";
import MasterTable from "../../smartTable/MasterTable";


const headers = ["document_id", "Stitcher id", "Stitcher Name", "Stitcher Type", "Stitcher Code", "Stitcher Address", "Remarks", "Edit"];

const statesOfIndia = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
    "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
    "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
    "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
    "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

const type = ["In House", "External"];

const StitcherMaster = () => {
    const location = useLocation();
    const title = location.state?.title;

    const [stitcher, setstitcher] = useState([]);
    const [jobberData, setJobberData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [updatesubmitting, setUpdateSubmitting] = useState(false);
    const navigate = useNavigate();
    const { token } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const [openEditModal, setOpenEditModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");


    //  adding pagination logic
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [paginationLoading, setPaginationLoading] = useState(false);

    const [formData, setFormData] = useState({
        stitcher_name: "",
        type: "",
        stitcher_address: "",
        stitcher_code: "",
        remarks: "",
    });
    const [updateFormData, setUpdateFormData] = useState({
        stitcher_name: "",
        type: "",
        stitcher_address: "",
        stitcher_code: "",
        remarks: "",
    });


    // const handleRowClick = (rowData) => {
    //     navigate(`/jobber-master/${rowData.id}`); 
    // };

    const handleView = (rowData) => {
        navigate(`/stitcher-master/${rowData.id}`);
    };

    const handleEditClick = (row) => {
        console.log("Row data:", row);
        setUpdateFormData({ ...row });  // Fill modal with row data
        setOpenEditModal(true);
    };


    const fetchStitcherData = useCallback(async () => {
        try {
            setPaginationLoading(true);
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/stitcher-masters`, {
                params: {
                    "pagination[page]": page,
                    "pagination[pageSize]": pageSize,
                    "sort[0]": "createdAt:desc",
                    ...(searchTerm && {
                        "filters[$or][0][stitcher_name][$containsi]": searchTerm,
                        "filters[$or][1][stitcher_type][$containsi]": searchTerm,
                        "filters[$or][2][stitcher_code][$containsi]": searchTerm,
                        "filters[$or][3][address][$containsi]": searchTerm,
                        "filters[$or][4][remarks][$containsi]": searchTerm,
                        "filters[$or][5][id][$containsi]": searchTerm,
                    }),
                },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const StitcherData = Array.isArray(response.data.data) ? response.data.data : [];
            setTotalPages(response.data.meta.pagination.pageCount);

            const mappedStitcher = StitcherData.map(stitcher => ({
                id: stitcher.documentId,
                stitcher_id: stitcher.id,
                stitcher_name: stitcher.stitcher_name,
                stitcher_type: stitcher.stitcher_type,
                stitcher_code: stitcher.stitcher_code,
                stitcher_address: stitcher.address,
                remarks: stitcher.remarks
            }));

            setstitcher(mappedStitcher);
        } catch (error) {
            console.error("Error fetching jobber data:", error);
            if (error.response?.status === 401) {
                navigate("/login");
            }
        } finally {
            setLoading(false);
            setPaginationLoading(false);
        }
    }, [page, token, pageSize, navigate, searchTerm])

    // Fetch jobber data when component mounts
    // useEffect(() => {
    //     if (!token) {
    //         navigate("/login");
    //         return;
    //     }
    //     fetchStitcherData();
    // }, [token, page, pageSize]);

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (!token) {
                navigate("/login");
                return;
            }
            fetchStitcherData();
        }, 1000);

        return () => clearTimeout(delayDebounce);
    }, [searchTerm, page, pageSize]);

    useEffect(() => {
        setPage(1);
    }, [searchTerm]);



    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };
    const handleUpdateInputChange = (e) => {
        const { name, value } = e.target;
        setUpdateFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.stitcher_name == "" || formData.stitcher_type == "") {
            alert("Stitcher Name, Stitcher Address and Type is required");
            return;
        }
        setSubmitting(true);

        const postData = {
            data: {
                stitcher_name: formData.stitcher_name,
                address: formData.stitcher_address,
                stitcher_code: formData.stitcher_code,
                stitcher_type: formData.type,
                remarks: formData.remarks,
            },
        };

        try {
            await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/stitcher-masters`, postData, {
                headers: {
                    Authorization: `Bearer ${token}`, // Send token in the Authorization header
                },
            });
            // Optionally handle success (e.g., notify user, reset form)
            toast.success("Stitcher data saved successfully!", { position: "top-right" });

            setFormData({
                stitcher_name: "",
                type: "",
                stitcher_address: "",
                stitcher_code: "",
                remarks: "",
            });

            fetchStitcherData();
        } catch (error) {
            console.error("Error posting Stitcher data:", error);
            // Optionally handle errors
        } finally {
            setSubmitting(false); // Stop the spinner
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setUpdateSubmitting(true);

        console.log("formData: ", formData)

        const updateData = {
            data: {
                stitcher_name: updateFormData.stitcher_name,
                address: updateFormData.stitcher_address,
                stitcher_code: updateFormData.stitcher_code,
                stitcher_type: updateFormData.type,
                remarks: updateFormData.remarks,
            },
        };

        try {
            await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/stitcher-masters/${updateFormData.id}`, updateData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            toast.success("Stitcher data updated successfully!", { position: "top-right" });

            // Clear form after update
            setUpdateFormData({
                stitcher_name: "",
                type: "",
                stitcher_address: "",
                stitcher_code: "",
                remarks: "",
            });
            setOpenEditModal(false);

            fetchStitcherData();
        } catch (error) {
            console.error("Error updating Stitcher data:", error);
            toast.error("Failed to update Stitcher data!");
        } finally {
            setUpdateSubmitting(false);
        }
    };



    const enhancedData = stitcher.map((item) => ({
        ...item,
        Actions: (
            <div className="flex justify-center items-center space-x-2">
                <button onClick={() => handleView(item)}>
                    <img src={ViewIcon} alt="View" className="mr-4 w-4" />
                </button>
                <button onClick={() => handleEditClick(item)}>
                    <img src={EditIcon} alt="Edit" className="w-4 pointer" />
                </button>
            </div >
        )
    }));

    const clearHandler = (e) => {
        e.preventDefault();
        setFormData({
            stitcher_name: "",
            type: "",
            stitcher_address: "",
            stitcher_code: "",
            remarks: "",
        })

    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <BounceLoader color="#1e3a8a" />
            </div>
        )
    }


    return (
        <div className="p-6 bg-white rounded-lg relative">

            <div>
                {/* <h1 className="text-3xl font-bold text-blue-900 mb-4">{title}</h1> */}
                <h1 className="text-2xl font-bold text-blue-900  border-b pb-2  mb-4">Stitcher Master</h1>

                {openEditModal && (

                    <div className="fixed inset-0 bg-gray-900 backdrop-blur-md bg-opacity-50 flex justify-center items-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
                            <h2 className="text-xl font-bold mb-4">Edit Stitcher Details</h2>
                            <form className="grid grid-cols-2 gap-6 p-2 mb-4" onSubmit={handleUpdate}>
                                {/* Stitcher Name */}
                                <div className="flex flex-col">
                                    <label className="text-gray-700 font-semibold">Stitcher Name</label>
                                    <input type="text" className="border border-gray-300 bg-gray-100 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Stitcher Name" name="stitcher_name"
                                        value={updateFormData.stitcher_name}
                                        onChange={handleUpdateInputChange} />
                                </div>

                                {/* Stitcher Address */}
                                <div className="flex flex-col">
                                    <label className="text-gray-700 font-semibold">Stitcher Address</label>
                                    <input type="text" className="border border-gray-300 bg-gray-100 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Stitcher Address" name="stitcher_address"
                                        value={updateFormData.stitcher_address}
                                        onChange={handleUpdateInputChange} />
                                </div>

                                {/* Stitcher Code */}
                                <div className="flex flex-col">
                                    <label className="text-gray-700 font-semibold">Stitcher Code</label>
                                    <input type="text" className="border border-gray-300 bg-gray-100 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Stitcher Code" name="stitcher_code"
                                        value={updateFormData.stitcher_code}
                                        onChange={handleUpdateInputChange} />
                                </div>

                                {/* Work Type */}
                                <div className="flex flex-col">
                                    <label className="text-gray-700 font-semibold">Stitcher Type</label>
                                    <select className="border border-gray-300 bg-gray-100 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" name="type"
                                        value={updateFormData.type}
                                        onChange={handleUpdateInputChange}>
                                        <option value="" className="text-gray-400">Stitcher Type</option>
                                        {type.map((type, index) => (
                                            <option key={index} value={type}>{type}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Remarks  */}
                                <div className="flex flex-col">
                                    <label className="text-gray-700 font-semibold">
                                        Remarks
                                    </label>
                                    <textarea
                                        className="p-2 border bg-gray-100 border-gray-300 rounded-md"

                                        placeholder="Enter Remarks here"
                                        name="remarks"
                                        id=""
                                        onChange={handleUpdateInputChange}
                                        value={updateFormData.remarks}
                                    />
                                </div>

                                {/* Buttons aligned to the right */}
                                <div className="col-span-2 flex justify-end mt-4">
                                    <button type="button" className="bg-gray-200 px-4 py-1 rounded hover:bg-gray-600 hover:text-white transition" onClick={() => setOpenEditModal(false)}>
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className={`bg-blue-900 ml-2 px-6 py-2 rounded text-white font-semibold transition-all ease-in-out duration-300 transform ${updatesubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blule-700'
                                            }`}
                                        disabled={updatesubmitting}
                                    >
                                        {updatesubmitting ? (
                                            <span className="flex justify-center items-center space-x-2">
                                                <PuffLoader size={20} color="#fff" />
                                                <span>Updating...</span>
                                            </span>
                                        ) : (
                                            'Update'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}


                <form className="grid grid-cols-2 gap-6 p-5 rounded-lg mb-4 border border-gray-200 shadow-md" onSubmit={handleSubmit}>
                    {/* Stitcher Name */}
                    <div className="flex flex-col">
                        <label className="text-gray-700 font-semibold">Stitcher Name</label>
                        <input type="text" className="border border-gray-300 bg-gray-100 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Stitcher Name" name="stitcher_name"
                            value={formData.stitcher_name}
                            onChange={handleInputChange} />
                    </div>

                    {/* Stitcher Address */}
                    <div className="flex flex-col">
                        <label className="text-gray-700 font-semibold">Stitcher Address</label>
                        <input type="text" className="border border-gray-300 bg-gray-100 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Stitcher Address" name="stitcher_address"
                            value={formData.stitcher_address}
                            onChange={handleInputChange} />
                    </div>

                    {/* Stitcher Code */}
                    <div className="flex flex-col">
                        <label className="text-gray-700 font-semibold">Stitcher Code</label>
                        <input type="text" className="border border-gray-300 bg-gray-100 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Stitcher Code" name="stitcher_code"
                            value={formData.stitcher_code}
                            onChange={handleInputChange} />
                    </div>

                    {/* Work Type */}
                    <div className="flex flex-col">
                        <label className="text-gray-700 font-semibold">Stitcher Type</label>
                        <select className="border border-gray-300 bg-gray-100 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" name="type"
                            value={formData.type}
                            onChange={handleInputChange}>
                            <option value="" className="text-gray-400">Stitcher Type</option>
                            {type.map((type, index) => (
                                <option key={index} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>

                    {/* Remarks  */}
                    <div className="flex flex-col">
                        <label className="text-gray-700 font-semibold">
                            Remarks
                        </label>
                        <textarea
                            className="p-2 border bg-gray-100 border-gray-300 rounded-md"

                            placeholder="Enter Remarks here"
                            name="remarks"
                            id=""
                            onChange={handleInputChange}
                            value={formData.remarks}
                        />
                    </div>

                    {/* Buttons aligned to the right */}
                    <div className="col-span-2 flex justify-end mt-4">
                        <button
                            onClick={clearHandler}
                            type="button" className="bg-gray-200 px-4 py-1 rounded hover:bg-gray-600 hover:text-white transition">
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
                                    <span>Saving...</span>
                                </div>
                            ) : (
                                'Save'
                            )}
                        </button>
                    </div>
                </form>

                <div className="mt-10">
                    {/* <SmartTable headers={headers} data={enhancedData}
                        // onRowClick={handleRowClick} 
                        /> */}


                    <div className="">
                        <h3 className="text-2xl font-bold text-blue-900 pb-2 border-b">List Of Stitchers</h3>
                    </div>

                    <MasterTable
                        headers={headers}
                        data={enhancedData}
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        loading={paginationLoading}
                        setLoading={setPaginationLoading}
                    />

                    <Pagination setPage={setPage} totalPages={totalPages}
                        page={page} setPageSize={setPageSize} pageSize={pageSize} />
                </div>
            </div>


        </div>
    );
};

export default StitcherMaster;
