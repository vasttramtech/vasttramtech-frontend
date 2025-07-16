import { useLocation } from "react-router-dom";
import SmartTable from "../../smartTable/SmartTable";
import { useNavigate } from "react-router-dom";
import PinIcon from "../../assets/Others/PinIcon.png";
import ViewIcon from "../../assets/Others/ViewIcon.png";
import EditIcon from "../../assets/Others/EditIcon.png";
import { useEffect, useState } from "react";
import SemiFinishGoodsGroup from "./SemiFinishGoodsGroup";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import UnitGroup from "./UnitGroup";
import { toast } from "react-toastify";
import AddKarigar from "./AddKarigar";
import ColorGroup from "./ColorGroup";
import { BounceLoader, PuffLoader } from "react-spinners";
import EditSemiFinishedGoodsMaster from "./EditModals/EditSemiFinishedGoodsMaster";
import Pagination from "../utility/Pagination";

const headers = ["document_id", "Id", "Semi-Finished Goods Id", "Group", "Semi-Finished Goods Name", "Description", "Unit", "View/Edit", "Pin"];


const SemiFinishedGoodsMaster = () => {
    const location = useLocation();
    const title = location.state?.title;
    const navigate = useNavigate();
    const { token } = useSelector((state) => state.auth);
    const [semiGoodsModel, setSemiGoodsModel] = useState(false);
    const [unitModel, setUnitModel] = useState(false);
    const [colorModel, setColorModel] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [semiFinishedGoods, setSemiFinishedGoods] = useState([]);
    const [semiFinishedGoodsData, setSemiFinishedGoodsData] = useState([]);
    const [unit, setUnit] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [colors, setColors] = useState([]);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");



    // const [jobberModal, setJobberModal] = useState(false);
    // const [jobber, setJobber] = useState([]);
    // const [selectedJobbers, setSelectedJobbers] = useState([]);
    // const [jobberDetail, setJobberDetail] = useState([]);


    const [formData, setFormData] = useState({
        group: "",
        semi_finished_goods_name: "",
        unit: "",
        description: "",
    });
    const [submitting, setSubmitting] = useState(false);
    const dispatch = useDispatch();
    const [addedJobber, setAddedJobber] = useState([]);

    const [dataLoading, setDataLoading] = useState(false);


    //  adding pagination logic
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [paginationLoading, setPaginationLoading] = useState(false);

    const fetchSemiFinishedGoodsData = async () => {
        try {
            setPaginationLoading(true);
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/semi-finished-goods-masters?populate[unit]=*&populate[group]=*`, {
                params: {
                    "pagination[page]": page,
                    "pagination[pageSize]": pageSize,
                    "sort[0]": "createdAt:desc",
                    ...(searchTerm && {
                        "filters[$or][0][semi_finished_goods_id][$containsi]": searchTerm,
                        "filters[$or][1][group][group_name][$containsi]": searchTerm,
                        "filters[$or][2][semi_finished_goods_name][$containsi]": searchTerm,
                        "filters[$or][3][description][$containsi]": searchTerm,
                        "filters[$or][4][unit][unit_name][$containsi]": searchTerm,
                    }),

                },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log("data returned", response);
            const data = Array.isArray(response.data.data) ? response.data.data : [];
            setTotalPages(response.data.meta.pagination.pageCount);

            const mappedSFGMaterial = data.map(goods => ({
                id: goods?.documentId,
                item_id: goods?.id,
                semi_finished_goods_id: goods?.semi_finished_goods_id,
                group: goods?.group?.group_name || "N/A",
                semi_finished_goods_name: goods?.semi_finished_goods_name || "N/A",
                description: goods?.description || "N/A",
                unit: goods?.unit?.unit_name || "N/A",
            }));

            setSemiFinishedGoodsData(mappedSFGMaterial);
        } catch (error) {
            console.error("Error fetching jobber data:", error);
            if (error.response?.status === 401) {
                navigate("/login");
            }
        } finally {
            setPaginationLoading(false);
        }
    };


    const handleRowClick = (rowData) => {
        navigate(`/profile/${rowData.id}`);
    };

    const handlePin = (rowData) => {
        console.log("Pin Clicked:", rowData);
        // Perform pin action
    };
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.semi_finished_goods_name == "" || formData.unit == "" || formData.group == "") {
            alert("Semi Finished Goods Name, Unit and Group is required");
            return;
        }

        setSubmitting(true);


        const postData = {
            data: {
                semi_finished_goods_name: formData.semi_finished_goods_name,
                description: formData.description,
                unit: formData.unit,
                group: formData.group,
            }
        };



        try {
            await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/semi-finished-goods-masters`, postData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            // Optionally handle success (e.g., notify user, reset form)
            toast.success("Semi Finished Goods data saved successfully!", { position: "top-right" });

            setFormData({
                group: "",
                semi_finished_goods_name: "",
                unit: "",
                description: "",
            });

            fetchSemiFinishedGoodsData();
            fetchSemiFinishedGoodsAndUnit();


        } catch (error) {
            console.error("Error posting semifinishedgoods data:", error);
            toast.error(error?.response?.data?.error?.message);
        } finally {
            setSubmitting(false); // Stop the spinner
        }
    }


    const fetchSemiFinishedGoodsAndUnit = async () => {
        try {

            setLoading(true);
            const headers = {
                Authorization: `Bearer ${token}`,
            };

            const endpoints = [
                `${process.env.REACT_APP_BACKEND_URL}/api/sfgm-groups?populate=*`,
                `${process.env.REACT_APP_BACKEND_URL}/api/units?populate=*`,
            ];

            const [sfgmRes, unitRes] = await Promise.all(
                endpoints.map((url) => axios.get(url, { headers }))
            );

            setSemiFinishedGoods(Array.isArray(sfgmRes.data.data) ? sfgmRes.data.data : []);
            setUnit(Array.isArray(unitRes.data.data) ? unitRes.data.data : []);
        } catch (error) {
            console.error("Error fetching data:", error);
            if (error.response?.status === 401) {
                navigate("/login");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            // fetchJobberData();
            fetchSemiFinishedGoodsAndUnit();
        } else {
            navigate("/login");
        }
    }, [token, navigate, refresh]);

    // useEffect(() => {
    //     if (token) {
    //         fetchSemiFinishedGoodsData();
    //     }
    //     else {
    //         navigate("/token");
    //     }
    // }, [page, pageSize, refresh])

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (token) {
                fetchSemiFinishedGoodsData();
            }
            else {
                navigate("/token");
            }
        }, 1000);

        return () => clearTimeout(delayDebounce);
    }, [searchTerm, page, pageSize, refresh]);

    useEffect(() => {
        setPage(1);
    }, [searchTerm]);


    const enhancedData = semiFinishedGoodsData.map((item) => ({
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

    const handleView = (rowData) => {
        navigate(`/semi-finished-goods-master/${rowData.id}`);
    };

    const handleEdit = (rowData) => {
        setSelectedRow(rowData);
        setOpenEditModal(true);
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCancel = () => {

        setFormData({
            group: "",
            semi_finished_goods_name: "",
            unit: "",
            description: "",
        });
    };

    return (
        <div className="py-2 bg-white rounded-lg relative">
            {loading ? (
                <div className="absolute inset-0 flex justify-center items-center mt-64 bg-opacity-50 bg-gray-200 z-10">
                    <BounceLoader size={100} color={"#1e3a8a"} loading={loading} />
                </div>
            ) : (
                <div>
                    {/* <h1 className="text-3xl font-bold text-blue-900 mb-4">{title}</h1> */}
                    <h1 className="text-3xl font-bold text-blue-900 mb-4">Semi Finished Goods Master</h1>

                    {semiGoodsModel &&
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                            <SemiFinishGoodsGroup setSemiGoodsModel={setSemiGoodsModel} setRefresh={setRefresh} refresh={refresh} />
                        </div>
                    }

                    {unitModel &&
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                            <UnitGroup setUnitModel={setUnitModel} setRefresh={setRefresh} refresh={refresh} />
                        </div>
                    }





                    {openEditModal && (
                        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50 overflow-y-auto">
                            <div className="bg-white p-6 rounded-lg shadow-lg max-h-[90vh] overflow-y-auto w-[90%] max-w-4xl">
                                <EditSemiFinishedGoodsMaster
                                    selectedRow={selectedRow}
                                    setOpenEditModal={setOpenEditModal}
                                    semiFinishedGoods={semiFinishedGoods}
                                    setSemiGoodsModel={setSemiGoodsModel}
                                    unit={unit}
                                    setUnitModel={setUnitModel}
                                    // setJobberModal={setJobberModal}
                                    fetchSemiFinishedGoodsData={fetchSemiFinishedGoodsData}
                                    colors={colors}
                                />
                            </div>
                        </div>
                    )}

                    <form className="grid grid-cols-2 gap-6 p-5 rounded-lg mb-4 border border-gray-200 shadow-md" onSubmit={handleSubmit}>
                        {/* Design Group */}
                        <div className="flex flex-col">
                            <label className="text-gray-700 font-semibold">Group</label>
                            <div className="flex items-center gap-2">
                                <select name="group" value={formData.group} className="flex-grow border border-gray-300 bg-gray-100 rounded-md p-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500" onChange={handleFormChange} >
                                    <option value="" disabled selected>{dataLoading ? "Loading..." : "Select Group"}</option>
                                    {semiFinishedGoods.map((group, index) => (
                                        <option key={index} value={group?.id
                                        }>{group?.group_name
                                            }</option>
                                    ))}
                                </select>
                                <button
                                    type="button"
                                    className="flex items-center justify-center w-8 h-8 bg-blue-500 text-white rounded-full text-xl hover:bg-blue-700 transition"
                                    onClick={() => setSemiGoodsModel(true)}
                                >
                                    +
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
                                    className="flex items-center justify-center w-8 h-8 bg-blue-500 text-white rounded-full text-xl hover:bg-blue-700 transition"
                                    onClick={() => setUnitModel(true)}
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {/* Price per unit */}
                        {/* <div className="flex flex-col">
                            <label className="text-gray-700 font-semibold">Price per unit</label>
                            <input type="number" className="border border-gray-300 bg-gray-100 rounded-md p-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="semi-Finished Goods Name"
                                name="pricePerUnit"
                                value={formData.pricePerUnit}
                                onChange={handleFormChange}
                            />
                        </div> */}

                        {/* Description - Full width of Semi-Finished Goods Name + Unit */}
                        <div className="flex flex-col">
                            <label className="text-gray-700 font-semibold">Description</label>
                            <textarea name="description" onChange={handleFormChange} value={formData.description} className="border border-gray-300 bg-gray-100 rounded-md p-2 h-40 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full" placeholder="Description"></textarea>
                        </div>







                        {/* Buttons */}
                        <div className="col-span-2 flex justify-end mt-4">
                            <button type="button"
                                onClick={handleCancel}
                                className="bg-gray-200 px-4 py-1 rounded hover:bg-gray-600 hover:text-white transition">
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

export default SemiFinishedGoodsMaster;
