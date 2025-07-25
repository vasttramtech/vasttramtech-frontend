import { useLocation } from "react-router-dom";
import SmartTable from "../../smartTable/SmartTable";
import { useNavigate } from "react-router-dom";
import PinIcon from "../../assets/Others/PinIcon.png";
import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { BounceLoader, PuffLoader } from "react-spinners";
import ViewIcon from "../../assets/Others/ViewIcon.png";
import EditIcon from "../../assets/Others/EditIcon.png";
import EditColorMaster from "./EditModals/EditColorMaster";
import Pagination from "../utility/Pagination";
import { fetchColor } from "../../state/fetchDataSlice";
import MasterTable from "../../smartTable/MasterTable";


const headers = ["document_id", "Color Id", "Color Name", "Edit"];

const ColorMaster = () => {
    const location = useLocation();
    const title = location.state?.title;
    const navigate = useNavigate();
    const [submitting, setSubmitting] = useState(false);
    const { token } = useSelector((state) => state.auth);
    const [refresh, setRefresh] = useState(false);
    const [colors, setColors] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);
    const [loading, setLoading] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        colorId: "",
        colorName: ""
    });

    //  adding pagination logic
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [paginationLoading, setPaginationLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");


    const handleRowClick = (rowData) => {
        navigate(`/profile/${rowData.id}`);
    };

    const handleView = (rowData) => {
        navigate(`/color-master/${rowData.id}`);
    };

    const handleEdit = (rowData) => {
        console.log("Edit Clicked:", rowData);
        setSelectedRow(rowData);
        setOpenEditModal(true);
    };

    const enhancedData = colors.map((item) => ({
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
        )
    }));


    const fetchColorMasterData = async () => {
        try {
            setPaginationLoading(true);
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/colors?populate=*`, {
                params: {
                    "pagination[page]": page,
                    "pagination[pageSize]": pageSize,
                    "sort[0]": "createdAt:desc",
                    ...(searchTerm && {
                        "filters[$or][0][color_id][$containsi]": searchTerm,
                        "filters[$or][1][color_name][$containsi]": searchTerm
                    })
                },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = Array.isArray(response.data.data) ? response.data.data : [];
            setTotalPages(response.data.meta.pagination.pageCount);

            const colorData = data.map(color => ({
                id: color?.documentId,
                colorId: color?.color_id,
                colorName: color?.color_name || "N/A",
            }));

            setColors(colorData);
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
        setSubmitting(true);

        const postData = {
            data: {
                color_name: formData.colorName,
                color_id: formData.colorId
            }
        };

        try {
            await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/colors`, postData, {
                headers: {
                    Authorization: `Bearer ${token}`, // Send token in the Authorization header
                },
            });
            // Optionally handle success (e.g., notify user, reset form)
            toast.success("Color saved successfully!", { position: "top-right" });
            await dispatch(fetchColor(token)).unwrap();

            setFormData({
                colorName: "",
                colorId: ""
            });
            fetchColorMasterData();

        } catch (error) {
            console.error("Error posting color data:", error);
            toast.error(error?.response?.data?.error?.message);
        } finally {
            setSubmitting(false); // Stop the spinner
        }
    };

    useEffect(() => {
        if (token) {
            fetchColorMasterData();
        } else {
            navigate("/login");
        }
    }, [token, navigate, refresh, page, pageSize]);

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (token) {
                fetchColorMasterData();
            } else {
                navigate("/login");
            }
        }, 1000)
        return () => clearTimeout(delayDebounce);

    }, [searchTerm, page, pageSize, token, navigate, refresh])

    useEffect(() => {
        setPage(1);
    }, [searchTerm]);


    const clearHandler = (e) => {
        e.preventDefault();
        setFormData({
            colorName: "",
            colorId: ""
        });
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
                <h1 className="text-2xl font-bold border-b pb-2 text-blue-900 mb-4">{title}</h1>

                {openEditModal && (
                    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-md flex justify-center items-center z-50 overflow-y-auto">
                        <div className="bg-white p-6 rounded-lg shadow-lg max-h-[90vh] overflow-y-auto w-[90%] max-w-4xl">
                            <EditColorMaster
                                selectedRow={selectedRow}
                                setOpenEditModal={setOpenEditModal}
                                fetchColorMasterData={fetchColorMasterData}
                            />
                        </div>
                    </div>
                )}

                <form className="grid grid-cols-2 gap-6 p-5 rounded-lg border border-gray-200 shadow-md mb-16" onSubmit={handleSubmit}>


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

                <div className="">

                    <div className="">
                        <h3 className="text-2xl font-bold text-blue-900 pb-2 border-b">List Of Colors</h3>
                    </div>
                    <MasterTable
                        headers={headers}
                        data={enhancedData}
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        loading={paginationLoading}
                        setLoading={setPaginationLoading}
                    />

                    <Pagination
                        setPage={setPage}
                        totalPages={totalPages}
                        page={page}
                        setPageSize={setPageSize}
                        pageSize={pageSize}
                    />
                </div>

            </div>

        </div>
    );
};

export default ColorMaster;

