import { useLocation } from "react-router-dom";
import SmartTable from "../../smartTable/SmartTable";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { PuffLoader, BounceLoader } from "react-spinners";
import ViewImages from "./ViewImges";
import Pagination from "../utility/Pagination";

const headers = ["document_id", "Design Name", "Designer Name", "Status", "Tags", "Remarks", "Last Uploaded Date", "Details", "Photos", "Complete"];



const DesignerEntryReports = () => {
    const location = useLocation();
    const title = location.state?.title || "Design Entry Report";
    const navigate = useNavigate();
    const [selectedImage, setSelectedImage] = useState(null);
    const { token } = useSelector((state) => state.auth);
    const [previewImage, setPreviewImage] = useState(null);
    const [designEntry, setDesignEntry] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openImagesModal , setOpenImagesModal] = useState(false);
    const [selectedDesignId, setSelectedDesignId] = useState(null);

    
    //  adding pagination logic
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [paginationLoading, setPaginationLoading] = useState(false);

    const handleRowClick = (rowData) => {
        navigate(`/profile/${rowData.id}`);
    };

    const handleDetails = (rowData) => {
        console.log("Details Clicked:", rowData);
        navigate(`/design-entry-report/${rowData.id}`);
    };
    
    const handlePhotos = (rowData) => {
        console.log("Photos Clicked:", rowData);
        setOpenImagesModal(true);
        setSelectedDesignId(rowData.id);
    };
    
    const handleCompleteDesign = (rowData) => {
        console.log("Complete Design Clicked:", rowData);
        // Perform pin action
    };

    const fetchDesignEntryData = async () => {
        try {
            setPaginationLoading(true);
            const response = await axios.get(
                `${process.env.REACT_APP_BACKEND_URL}/api/design-entry-pages?populate=*`,
                {
                    params: {
                    "pagination[page]": page,
                    "pagination[pageSize]": pageSize,
                    "sort[0]": "createdAt:desc"
                    },
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setTotalPages(response.data.meta.pagination.pageCount);
            const designEntryData = Array.isArray(response.data.data)
                ? response.data.data
                : [];

            console.log("designEntryData: ", designEntryData)
            const mappedDesignEntry = designEntryData.map((design) => ({
                id: design?.documentId,
                design: design?.design?.design_name,
                designer_name: design.designer_name,
                status: design.design_status,
                tag: design.tag,
                remark: design?.remark,
                updated_date:design?.updatedAt ? new Date(design.updatedAt).toISOString().split("T")[0] : ""
            }));
            setDesignEntry(mappedDesignEntry);
        } catch (error) {
            console.error("Error fetching design master data:", error);
            if (error.response?.status === 401) {
                navigate("/login");
            }
        } finally {
            setPaginationLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchDesignEntryData();
        } else {
            navigate("/login");
        }
    }, [token, navigate]);

    const enhancedData = designEntry.map((item) => ({
        ...item,
        Details: (
            <div className="flex justify-center item-center space-x-2">
                <button onClick={() => handleDetails(item)}>
                    <button className="bg-yellow-600 px-3 py-1 text-sm rounded-xl hover:bg-yellow-800 transition ml-4">
                        Details
                    </button>
                </button>
            </div>
        ),
        Photos: (
            <div className="flex justify-center item-center space-x-2">
                <button onClick={() => handlePhotos(item)}>
                    <button className="bg-green-600 px-3 py-1 text-sm rounded-xl hover:bg-green-800 transition ml-4">
                        Photos
                    </button>
                </button>
            </div>
        ),
        Complete: (
            <div className="flex justify-center item-center space-x-2">
                <button onClick={() => handlePhotos(item)}>
                    <button className="bg-blue-600 px-2 py-1 text-sm rounded-xl hover:bg-blue-800 transition ml-4">
                        Complete Design
                    </button>
                </button>
            </div>
        )
    }));

    return (
        <div className="py-2 bg-white rounded-lg relative">
            {loading ? (
                <div className="absolute inset-0 flex justify-center items-center mt-64 bg-opacity-50 bg-gray-200 z-10">
                    <BounceLoader size={100} color={"#1e3a8a"} loading={loading} />
                </div>
            ) : (
                <div>
                    {openImagesModal &&
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                            {/* <DesgnGroup setDesignGroupModel={setDesignGroupModel} setRefresh={setRefresh} refresh={refresh} /> */}
                            <div className="bg-white p-6 w-[400px] rounded-lg shadow-lg border border-gray-300">
                                <ViewImages 
                                    setOpenImagesModal={setOpenImagesModal}
                                    designId={selectedDesignId}
                                />
                            </div>
                        </div>
                    }
                    <h1 className="text-3xl font-bold text-blue-900 mb-4">{title}</h1>

                    {paginationLoading ? (
              <div className="flex p-5 justify-center items-center space-x-2 mt-4 border border-gray-400 rounded-lg">
                  <BounceLoader size={20} color="#1e3a8a" />
              </div>
            ) : (
              <SmartTable headers={headers} data={enhancedData} />
            )}

            <Pagination
              setPage={setPage}
              totalPages={totalPages}
              page={page}
              setPageSize={setPageSize}
              pageSize={pageSize}
            />
                </div>)}
        </div>
    );
};

export default DesignerEntryReports;

