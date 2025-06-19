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


const headers = ["document_id","Jobber id", "Jobber Name", "Jobber Plan", "Jobber GSTIN", "Jobber Address", "Jobber Code", "State Name", "Days", "Work Type", "Edit"];

const statesOfIndia = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
    "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
    "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
    "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
    "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

const workTypes = ["Dye", "Print", "CMC", "Mchn", "Dori", "Hand", "CMC/Hand", "Mchn/Hand"];

const JobberMaster = () => {
    const location = useLocation();
    const title = location.state?.title;

    const [jobbers, setJobbers] = useState([]);  // To store jobber data
    const [jobberData, setJobberData] = useState([]);
    const [loading, setLoading] = useState(true); // For loading state
    const [submitting, setSubmitting] = useState(false);
    const [updatesubmitting, setUpdateSubmitting] = useState(false);
    const navigate = useNavigate();
    const { token } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const [openEditModal, setOpenEditModal] = useState(false);


    //  adding pagination logic
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize, setPageSize] = useState(5);


    const [formData, setFormData] = useState({
        jobber_name: "",
        jobber_plan: "",
        jobber_gstin: "",
        jobber_address: "",
        jobber_code: "",
        state: "",
        work_type: "",
        days: "",
    });

    const [updateFormData, setUpdateFormData] = useState({
        jobber_name: "",
        jobber_plan: "",
        jobber_gstin: "",
        jobber_address: "",
        jobber_code: "",
        state: "",
        work_type: "",
        days: "",
    });


    // const handleRowClick = (rowData) => {
    //     navigate(`/jobber-master/${rowData.id}`); 
    // };

    const handleView = (rowData) => {
        navigate(`/jobber-master/${rowData.id}`);
    };

    const handleEditClick = (row) => {
        console.log("Row data:", row);
        setUpdateFormData({ ...row });  // Fill modal with row data
        setOpenEditModal(true);
    };


    const fetchJobberData = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/jobber-masters`, {
                params: {
                    "pagination[page]": page,
                    "pagination[pageSize]": pageSize,
                    "sort[0]": "createdAt:desc"
                },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const jobberData = Array.isArray(response.data.data) ? response.data.data : [];
            setTotalPages(response.data.meta.pagination.pageCount);

            setJobberData(jobberData);

            const mappedJobbers = jobberData.map(jobber => ({
                id:jobber.documentId,
                jobber_id: jobber.jobber_id,
                jobber_name: jobber.jobber_name,
                jobber_plan: jobber.jobber_plan,
                jobber_gstin: jobber.jobber_gstin,
                jobber_address: jobber.jobber_address,
                jobber_code: jobber.jobber_code,
                state_name: jobber.state,
                days: jobber.days,
                work_type: jobber.work_type,
            }));

            setJobbers(mappedJobbers);
        } catch (error) {
            console.error("Error fetching jobber data:", error);
            if (error.response?.status === 401) {
                navigate("/login");
            }
        } finally {
            setLoading(false);
        }
    }, [page, token, pageSize, navigate])

    // Fetch jobber data when component mounts
    useEffect(() => {
    if (!token) {
        navigate("/login");
        return;
    }
    fetchJobberData();
}, [token, page, pageSize]);


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

        if(formData.jobber_name == "" || formData.jobber_gstin == "" || formData.work_type == ""){
            alert("Jobber Name, Jobber GSTIN and Work Type is required");
            return;
        }

        setSubmitting(true);

        const postData = {
            data: {
                jobber_name: formData.jobber_name,
                jobber_plan: formData.jobber_plan,
                jobber_gstin: formData.jobber_gstin,
                jobber_address: formData.jobber_address,
                jobber_code: formData.jobber_code,
                state: formData.state,
                work_type: formData.work_type,
                days: formData.days,
            },
        };

        try {
            await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/jobber-masters?populate=*`, postData, {
                headers: {
                    Authorization: `Bearer ${token}`, // Send token in the Authorization header
                },
            });
            // Optionally handle success (e.g., notify user, reset form)
            toast.success("Jobber data saved successfully!", { position: "top-right" });

            setFormData({
                jobber_name: "",
                jobber_plan: "",
                jobber_gstin: "",
                jobber_address: "",
                jobber_code: "",
                state: "",
                work_type: "",
                days: "",
            });

            fetchJobberData();
            dispatch(fetchJobberMasters(token));
        } catch (error) {
            console.error("Error posting jobber data:", error);
            // Optionally handle errors
        } finally {
            setSubmitting(false); // Stop the spinner
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setUpdateSubmitting(true);

    
        const updateData = {
            data: {
                jobber_name: updateFormData.jobber_name,
                jobber_plan: updateFormData.jobber_plan,
                jobber_gstin: updateFormData.jobber_gstin,
                jobber_address: updateFormData.jobber_address,
                jobber_code: updateFormData.jobber_code,
                state: updateFormData.state_name,
                work_type: updateFormData.work_type,
                days: updateFormData.days,
            },
        };
    
        try {
            await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/jobber-masters/${updateFormData.id}`, updateData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
    
            toast.success("Jobber data updated successfully!", { position: "top-right" });
    
            // Clear form after update
            setUpdateFormData({
                jobber_name: "",
                jobber_plan: "",
                jobber_gstin: "",
                jobber_address: "",
                jobber_code: "",
                state: "",
                work_type: "",
                days: "",
            });
            setOpenEditModal(false);
    
            fetchJobberData();
            dispatch(fetchJobberMasters(token));
        } catch (error) {
            console.error("Error updating jobber data:", error);
            toast.error("Failed to update jobber data!");
        } finally {
            setUpdateSubmitting(false);
        }
    };
    
    

    const enhancedData = jobbers.map((item) => ({
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

    // clear function
    const clearFunction = (e) =>{
        e.preventDefault();
        setFormData({
            jobber_name: "",
            jobber_plan: "",
            jobber_gstin: "",
            jobber_address: "",
            jobber_code: "",
            state: "",
            work_type: "",
            days: "",
        });
       

        
    }

    return (
        <div className="py-2 bg-white rounded-lg relative">
            {loading ? (
                <div className="absolute inset-0 flex justify-center items-center mt-64 bg-opacity-50 bg-gray-200 z-10">
                    {/* <ClipLoader size={100} color={"#3498db"} loading={loading} /> */}
                    {/* <ClipLoader size={100} color={"#9D1C1C"} loading={loading} /> */}
                    {/* <HashLoader size={100} color={"#9D1C1C"} loading={loading} /> */}
                    {/* <RingLoader  size={100} color={"#9D1C1C"} loading={loading} /> */}
                    {/* <CircleLoader  size={100} color={"#9D1C1C"} loading={loading} /> */}
                    {/* <MoonLoader  size={100} color={"#9D1C1C"} loading={loading} /> */}
                    {/* <PuffLoader size={100} color={"#2F1C85"} loading={loading} /> */}
                    <BounceLoader size={100} color={"#1e3a8a"} loading={loading} />
                </div>
            ) : (
                <div>
                    <h1 className="text-3xl font-bold text-blue-900 mb-4">{title}</h1>

                    {openEditModal && (
                        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
                            <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
                                <h2 className="text-xl font-bold mb-4">Edit Jobber Details</h2>
                                <form className="grid grid-cols-2 gap-6" onSubmit={handleUpdate}>
                                    {/* Jobber Name */}
                                    <div className="flex flex-col">
                                        <label className="text-gray-700 font-semibold">Jobber Name</label>
                                        <input type="text" className="border border-gray-300 bg-gray-100 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Jobber Name" name="jobber_name"
                                            value={updateFormData.jobber_name}
                                            onChange={handleUpdateInputChange} />
                                    </div>

                                    {/* Jobber Plan */}
                                    <div className="flex flex-col">
                                        <label className="text-gray-700 font-semibold">Jobber Pan</label>
                                        <input type="text" className="border border-gray-300 bg-gray-100 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Jobber Pan" name="jobber_plan"
                                            value={updateFormData.jobber_plan}
                                            onChange={handleUpdateInputChange} />
                                    </div>

                                    {/* Jobber GSTIN */}
                                    <div className="flex flex-col">
                                        <label className="text-gray-700 font-semibold">Jobber GSTIN</label>
                                        <input type="text" className="border border-gray-300 bg-gray-100 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Jobber GSTIN" name="jobber_gstin"
                                            value={updateFormData.jobber_gstin}
                                            onChange={handleUpdateInputChange} />
                                    </div>

                                    {/* Jobber Address */}
                                    <div className="flex flex-col">
                                        <label className="text-gray-700 font-semibold">Jobber Address</label>
                                        <input type="text" className="border border-gray-300 bg-gray-100 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Jobber Address" name="jobber_address"
                                            value={updateFormData.jobber_address}
                                            onChange={handleUpdateInputChange} />
                                    </div>

                                    {/* Jobber Code */}
                                    <div className="flex flex-col">
                                        <label className="text-gray-700 font-semibold">Jobber Code</label>
                                        <input type="text" className="border border-gray-300 bg-gray-100 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Jobber Code" name="jobber_code"
                                            value={updateFormData.jobber_code}
                                            onChange={handleUpdateInputChange} />
                                    </div>

                                    {/* Jobber State */}
                                    <div className="flex flex-col">
                                        <label className="text-gray-700 font-semibold">Jobber State</label>
                                        <select className="border border-gray-300 bg-gray-100 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" name="state"
                                            value={updateFormData.state_name}
                                            onChange={handleUpdateInputChange}>
                                            <option value="" className="text-gray-400">State</option>
                                            {statesOfIndia.map((state, index) => (
                                                <option key={index} value={state}>{state}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Days Required */}
                                    <div className="flex flex-col">
                                        <label className="text-gray-700 font-semibold">Days Required</label>
                                        <input type="number" className="border border-gray-300 bg-gray-100 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Days Required" name="days"
                                            value={updateFormData.days}
                                            onChange={handleUpdateInputChange} />
                                    </div>

                                    {/* Work Type */}
                                    <div className="flex flex-col">
                                        <label className="text-gray-700 font-semibold">Work Type</label>
                                        <select className="border border-gray-300 bg-gray-100 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" name="work_type"
                                            value={updateFormData.work_type}
                                            onChange={handleUpdateInputChange}>
                                            <option value="" className="text-gray-400">Work Type</option>
                                            {workTypes.map((type, index) => (
                                                <option key={index} value={type}>{type}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Buttons aligned to the right */}
                                    <div className="col-span-2 flex justify-end mt-4">
                                        <button type="button" className="bg-gray-200 px-4 py-1 rounded hover:bg-gray-600 hover:text-white transition" onClick={() => setOpenEditModal(false)}>
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className={`bg-gray-500 ml-2 px-6 py-2 rounded text-white font-semibold transition-all ease-in-out duration-300 transform ${submitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-700'
                                                }`}
                                            disabled={updatesubmitting}
                                        >
                                            {updatesubmitting ? (
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
                        </div>
                    )}


                    <form className="grid grid-cols-2 gap-6 p-5 rounded-lg mb-4 border border-gray-200 shadow-md" onSubmit={handleSubmit}>
                        {/* Jobber Name */}
                        <div className="flex flex-col">
                            <label className="text-gray-700 font-semibold">Jobber Name</label>
                            <input type="text" className="border border-gray-300 bg-gray-100 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Jobber Name" name="jobber_name"
                                value={formData.jobber_name}
                                onChange={handleInputChange} />
                        </div>

                        {/* Jobber Plan */}
                        <div className="flex flex-col">
                            <label className="text-gray-700 font-semibold">Jobber Pan</label>
                            <input type="text" className="border border-gray-300 bg-gray-100 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Jobber Pan" name="jobber_plan"
                                value={formData.jobber_plan}
                                onChange={handleInputChange} />
                        </div>

                        {/* Jobber GSTIN */}
                        <div className="flex flex-col">
                            <label className="text-gray-700 font-semibold">Jobber GSTIN</label>
                            <input type="text" className="border border-gray-300 bg-gray-100 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Jobber GSTIN" name="jobber_gstin"
                                value={formData.jobber_gstin}
                                onChange={handleInputChange} />
                        </div>

                        {/* Jobber Address */}
                        <div className="flex flex-col">
                            <label className="text-gray-700 font-semibold">Jobber Address</label>
                            <input type="text" className="border border-gray-300 bg-gray-100 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Jobber Address" name="jobber_address"
                                value={formData.jobber_address}
                                onChange={handleInputChange} />
                        </div>

                        {/* Jobber Code */}
                        <div className="flex flex-col">
                            <label className="text-gray-700 font-semibold">Jobber Code</label>
                            <input type="text" className="border border-gray-300 bg-gray-100 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Jobber Code" name="jobber_code"
                                value={formData.jobber_code}
                                onChange={handleInputChange} />
                        </div>

                        {/* Jobber State */}
                        <div className="flex flex-col">
                            <label className="text-gray-700 font-semibold">Jobber State</label>
                            <select className="border border-gray-300 bg-gray-100 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" name="state"
                                value={formData.state}
                                onChange={handleInputChange}>
                                <option value="" className="text-gray-400">State</option>
                                {statesOfIndia.map((state, index) => (
                                    <option key={index} value={state}>{state}</option>
                                ))}
                            </select>
                        </div>

                        {/* Days Required */}
                        <div className="flex flex-col">
                            <label className="text-gray-700 font-semibold">Days Required</label>
                            <input type="number" className="border border-gray-300 bg-gray-100 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Days Required" name="days"
                                value={formData.days}
                                onChange={handleInputChange} />
                        </div>

                        {/* Work Type */}
                        <div className="flex flex-col">
                            <label className="text-gray-700 font-semibold">Work Type</label>
                            <select className="border border-gray-300 bg-gray-100 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" name="work_type"
                                value={formData.work_type}
                                onChange={handleInputChange}>
                                <option value="" className="text-gray-400">Work Type</option>
                                {workTypes.map((type, index) => (
                                    <option key={index} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>

                        {/* Buttons aligned to the right */}
                        <div className="col-span-2 flex justify-end mt-4">
                            <button 
                            onClick={clearFunction}

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

                    <div className="mb-16">
                        <SmartTable headers={headers} data={enhancedData}
                        // onRowClick={handleRowClick} 
                        />
                        
                    <Pagination setPage={setPage} totalPages={totalPages}
                        page={page} setPageSize={setPageSize} pageSize={pageSize} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default JobberMaster;
