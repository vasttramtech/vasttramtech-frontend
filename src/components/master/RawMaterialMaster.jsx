import { useLocation } from "react-router-dom";
import SmartTable from "../../smartTable/SmartTable";
import { useNavigate } from "react-router-dom";
import PinIcon from "../../assets/Others/PinIcon.png";
import { useEffect, useState } from "react";
import RawMaterialGroup from "./RawMaterialGroup";
import axios from "axios";
import { useSelector } from "react-redux";
import UnitGroup from "./UnitGroup";
import HSNCodeGroup from "./HSNCodeGroup";
import ColorGroup from "./ColorGroup";
import { toast } from "react-toastify";
import { BounceLoader, PuffLoader } from "react-spinners";
import ViewIcon from "../../assets/Others/ViewIcon.png";
import EditIcon from "../../assets/Others/EditIcon.png";
import EditRawMaterialMaster from "./EditModals/EditRawMaterialMaster";
import Pagination from "../utility/Pagination";
import AddKarigar from "./AddKarigar";

const headers = ["document_id", "Item Id", "Group", "Item Name", "Unit", "HSN/SAC Code", "Description", "Color", "Price/unit", "Edit", ""];

const RawMaterialMaster = () => {
    const location = useLocation();
    const title = location.state?.title;
    const navigate = useNavigate();
    const [submitting, setSubmitting] = useState(false);
    const { token } = useSelector((state) => state.auth);
    const [rawMaterialModel, setRawMaterialModel] = useState(false);
    const [unitModel, setUnitModel] = useState(false);
    const [hsnModel, setHsnModel] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [materialGroup, setMaterialGroup] = useState([]);
    const [unit, setUnit] = useState([]);
    const [HSN_SAC_Code, setHSN_SAC_Code] = useState([]);
    const [colors, setColors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [rawMaterialData, setRawMaterialData] = useState([]);
    const [rawMaterial, setRawMaterial] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [formData, setFormData] = useState({
        item_name: "",
        description: "",
        unit: "",
        pricePerUnit: "",
        group: "",
        color: "",
        hsn_sac_code: "",
        add_jobber: []
    });

    // //  jobber states
    // const [jobberModal, setJobberModal] = useState(false);  
    // const [selectedJobbers, setSelectedJobbers] = useState([]);
    // const [jobber, setJobber] = useState([]);
    // const [jobberDetail, setJobberDetail] = useState([]);
    // const [addedJobber, setAddedJobber] = useState([]);

    //  adding pagination logic
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [paginationLoading, setPaginationLoading] = useState(false);
    const [dataLoading, setDataLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");


    const handleRowClick = (rowData) => {
        navigate(`/profile/${rowData.id}`);
    };

    const handleView = (rowData) => {
        navigate(`/raw-material-master/${rowData.id}`);
    };

    const handleEdit = (rowData) => {
        console.log("Edit Clicked:", rowData);
        setSelectedRow(rowData);
        setOpenEditModal(true);
    };

    const handlePin = (rowData) => {
        console.log("Pin Clicked:", rowData);
        // Perform pin action
    };

    const enhancedData = rawMaterial.map((item) => ({
        ...item,
        Actions: (
            <div className="flex justify-center items-center space-x-2">
                <button onClick={() => handleView(item)}>
                    <img src={ViewIcon} alt="View" className="mr-4 w-4" />
                </button>
                <button onClick={() => handleEdit(item)}>
                    <img src={EditIcon} alt="Edit" className="w-4" />
                </button>
            </div>
        ),
        Pin: (
            <button onClick={() => handlePin(item)}>
                <img src={PinIcon} alt="Pin" className="" />
            </button>
        ),
    }));

    const fetchDropDownData = async () => {
        try {
            setLoading(true);
            const headers = {
                Authorization: `Bearer ${token}`,
            };

            const endpoints = [
                `${process.env.REACT_APP_BACKEND_URL}/api/row-material-groups?populate=*`,
                `${process.env.REACT_APP_BACKEND_URL}/api/units?populate=*`,
                `${process.env.REACT_APP_BACKEND_URL}/api/hsn-sac-code-masters?populate=*`,
                `${process.env.REACT_APP_BACKEND_URL}/api/colors?populate=*`,
            ];

            const [res1, res2, res3, res4] = await Promise.all(
                endpoints.map((url) => axios.get(url, { headers }))
            );

            setMaterialGroup(Array.isArray(res1.data.data) ? res1.data.data : []);
            setUnit(Array.isArray(res2.data.data) ? res2.data.data : []);
            setHSN_SAC_Code(Array.isArray(res3.data.data) ? res3.data.data : []);
            setColors(Array.isArray(res4.data.data) ? res4.data.data : []);
        } catch (error) {
            console.error("Error fetching dropdown data:", error);
            if (error.response?.status === 401) {
                navigate("/login");
            }
        } finally {
            setLoading(false);
        }
    };


    const fetchRawMaterialData = async () => {
        try {
            setPaginationLoading(true);
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/raw-material-masters?populate=*`, {
                params: {
                    "pagination[page]": page,
                    "pagination[pageSize]": pageSize,
                    "sort[0]": "createdAt:desc",
                    ...(searchTerm && {
                        "filters[$or][0][group][group_name][$containsi]": searchTerm,
                        "filters[$or][1][item_name][$containsi]": searchTerm,
                        "filters[$or][2][unit][unit_name][$containsi]": searchTerm,
                        "filters[$or][3][hsn_sac_code][hsn_sac_code][$containsi]": searchTerm,
                        "filters[$or][4][description][$containsi]": searchTerm,
                        "filters[$or][5][color][color_name][$containsi]": searchTerm,
                        "filters[$or][6][price_per_unit][$containsi]": searchTerm,
                    }),
                },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = Array.isArray(response.data.data) ? response.data.data : [];

            setRawMaterialData(data);
            setTotalPages(response.data.meta.pagination.pageCount);
            console.log("data: ", data)

            const mappedRawMaterial = data.map(material => ({
                id: material?.documentId,
                item_id: material.id,
                group: material.group?.group_name || "N/A",
                item_name: material.item_name || "N/A",
                unit: material.unit?.unit_name || "N/A",
                hsn_sac_code: material.hsn_sac_code?.hsn_sac_code || "N/A",
                description: material.description || "N/A",
                color: material.color?.color_name || "N/A",
                price: material?.price_per_unit || "N/A"
            }));

            setRawMaterial(mappedRawMaterial);
        } catch (error) {
            console.error("Error fetching jobber data:", error);
            if (error.response?.status === 401) {
                navigate("/login");
            }
        } finally {
            setPaginationLoading(false);
        }
    };


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.item_name === '' || formData.unit === '' || formData.group === '') {
            alert("Item Name, Unit and Group is required");
            return;
        }

        setSubmitting(true);

        // const formattedJobbers = selectedJobbers.map(jobber => ({
        //     jobber: jobber.id,  // Ensure this matches API structure
        //     rate: jobber.rate || 0,  // Default value if not entered
        //     notes: jobber.notes || ""
        // }));

        const postData = {
            data: {
                item_name: formData.item_name,
                description: formData.description,
                unit: formData.unit,  // These should be IDs
                price_per_unit: formData.pricePerUnit,
                group: formData.group,
                color: formData.color,
                hsn_sac_code: formData.hsn_sac_code,

            }
        };

        console.log("Raw Material Data:", postData);
        try {
            const respoonse = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/raw-material-masters`, postData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log("Posting Raw Material Data:", respoonse);
            toast.success("Raw Material data saved successfully!", { position: "top-right" });

            setFormData({
                item_name: "",
                description: "",
                unit: "",
                pricePerUnit: "",
                group: "",
                color: "",
                hsn_sac_code: "",
            });


            fetchRawMaterialData();

        } catch (error) {
            console.error("Error posting raw material data:", error);
            toast.error(error?.response?.data?.error?.message);
        } finally {
            setSubmitting(false); // Stop the spinner
        }
    };

    useEffect(() => {
        if (token) {
            fetchDropDownData();
        } else {
            navigate("/login");
        }
    }, [token, navigate, refresh]);

    // useEffect(() => {
    //     if (token) {
    //         fetchRawMaterialData();
    //     }
    //     else {
    //         navigate("/login")
    //     }

    // }, [page, pageSize])

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (token) {
                fetchRawMaterialData();
            }
            else {
                navigate("/login")
            }
        }, 1000);

        return () => clearTimeout(delayDebounce);
    }, [searchTerm, page, pageSize]);


    const clearHandler = (e) => {
        e.preventDefault();
        setFormData({
            item_name: "",
            description: "",
            unit: "",
            pricePerUnit: "",
            group: "",
            color: "",
            hsn_sac_code: "",
        });

    }
    return (
        <div className="py-2 bg-white rounded-lg relative">
            {loading ? (
                <div className="absolute inset-0 flex justify-center items-center mt-64 bg-opacity-50 bg-gray-200 z-10">
                    <BounceLoader size={100} color={"#1e3a8a"} loading={loading} />
                </div>
            ) : (
                <div>
                    {/* <h1 className="text-3xl font-bold text-blue-900 mb-4">{title}</h1> */}
                    <h1 className="text-3xl font-bold text-blue-900 mb-4">Raw Material Master</h1>

                    {rawMaterialModel &&
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                            <RawMaterialGroup setRawMaterialModel={setRawMaterialModel} setRefresh={setRefresh} refresh={refresh} />
                        </div>
                    }

                    {unitModel &&
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                            <UnitGroup setUnitModel={setUnitModel} setRefresh={setRefresh} refresh={refresh} />
                        </div>
                    }

                    {hsnModel &&
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                            <HSNCodeGroup setHsnModel={setHsnModel} setRefresh={setRefresh} refresh={refresh} />
                        </div>
                    }

                    {openEditModal && (
                        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50 overflow-y-auto">
                            <div className="bg-white p-6 rounded-lg shadow-lg max-h-[90vh] overflow-y-auto w-[90%] max-w-4xl">
                                <EditRawMaterialMaster
                                    selectedRow={selectedRow}
                                    setOpenEditModal={setOpenEditModal}
                                    materialGroup={materialGroup}
                                    fetchRawMaterialData={fetchRawMaterialData}
                                    unit={unit}
                                    HSN_SAC_Code={HSN_SAC_Code}
                                    colors={colors}
                                />
                            </div>
                        </div>
                    )}



                    <form className="grid grid-cols-2 gap-6 p-5 rounded-lg border border-gray-200 shadow-md mb-16" onSubmit={handleSubmit}>
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
                                <button
                                    type="button"
                                    className="flex items-center justify-center w-8 h-8 bg-blue-500 text-white rounded-full text-xl hover:bg-blue-700 transition"
                                    onClick={() => setRawMaterialModel(true)}
                                >
                                    +
                                </button>
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
                                <button
                                    type="button"
                                    className="flex items-center justify-center w-8 h-8 bg-blue-500 text-white rounded-full text-xl hover:bg-blue-700 transition"
                                    onClick={() => setHsnModel(true)}
                                >
                                    +
                                </button>
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
                                        Select Unit
                                    </option>
                                    {unit.map((unit) => (
                                        <option key={unit.id} value={unit.
                                            id}>
                                            {unit.
                                                unit_name}
                                        </option>
                                    ))}
                                </select>
                                <button
                                    type="button"
                                    className="flex items-center justify-center w-8 h-8 bg-blue-500 text-white rounded-full text-xl hover:bg-blue-700 transition"
                                    onClick={() => setUnitModel(true)}
                                >
                                    +
                                </button>
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
                            <select className="border border-gray-300 bg-gray-100 rounded-md p-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
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

                    <div className="mb-16">
                        {paginationLoading ? (
                            <div className="flex p-5 justify-center items-center space-x-2 mt-4 border border-gray-400 rounded-lg">
                                <BounceLoader size={20} color="#1e3a8a" />
                            </div>
                        ) : (
                            // <SmartTable headers={headers} data={enhancedData} />
                            <SmartTable
                                headers={headers}
                                data={enhancedData}
                                searchTerm={searchTerm}
                                setSearchTerm={setSearchTerm}
                            />
                        )}

                        <Pagination
                            setPage={setPage}
                            totalPages={totalPages}
                            page={page}
                            setPageSize={setPageSize}
                            pageSize={pageSize}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default RawMaterialMaster;

