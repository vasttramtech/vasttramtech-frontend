import { useLocation, useNavigate } from "react-router-dom";
import SmartTable from "../../smartTable/SmartTable";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { BounceLoader, PuffLoader } from "react-spinners";
import EditIcon from "../../assets/Others/EditIcon.png";
import EditPurchaseOrder from "./EditModel/EditPurchaseOrder";
import Pagination from "../utility/Pagination";
import Swal from "sweetalert2";

const headers = [
  "document_id",
  "PO Id",
  "PO Date",
  "Supplier",
  "Remarks",
  "Total Amount",
  "Status",
  "Details",
  "Edit",
  "Reject Order"
];


const PurchaseOrderList = () => {
  const location = useLocation();
  const [showDetails, setShowDetails] = useState(false);
  const [purchaseOrderData, setPurchaseOrderData] = useState([]);
  const title = location.state?.title;
  const [loading, setLoading] = useState(false);
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [openEditModal, setOpenEditModal] = useState(false);


  //  adding pagination logic
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [paginationLoading, setPaginationLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchPurchaseOrderList = async () => {
    try {
      setPaginationLoading(true);
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/purchase-orders?populate=*`, {
        params: {
          "pagination[page]": page,
          "pagination[pageSize]": pageSize,
          "sort[0]": "createdAt:desc",
          ...(searchTerm && {
            "filters[$or][0][id][$containsi]": searchTerm,
            "filters[$or][1][date][$containsi]": searchTerm,
            "filters[$or][2][supplier][company_name][$containsi]": searchTerm,
            "filters[$or][3][remark][$containsi]": searchTerm,
            "filters[$or][4][purchase_order_status][$containsi]": searchTerm,
            "filters[$or][5][total][$containsi]": searchTerm,
          }),

        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = Array.isArray(response.data.data) ? response.data.data : [];
      setTotalPages(response.data.meta.pagination.pageCount);

      const mappedSFGMaterial = data.map(goods => ({
        id: goods?.documentId,
        purchase_id: goods?.id,
        date: goods?.date ? new Date(goods.date).toLocaleDateString('en-GB') : "N/A",
        supplier: goods?.supplier?.company_name || "N/A",
        remark: goods?.remark || "N/A",
        total_amount: goods?.total || "N/A",
        status: goods?.purchase_order_status || "N/A"
      }));

      setPurchaseOrderData(mappedSFGMaterial);
    } catch (error) {
      console.error("Error fetching jobber data:", error);
      if (error.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setPaginationLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (token) {
        fetchPurchaseOrderList();
      } else {
        navigate("/login");
      }
    }, 1000);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, page, pageSize]);

  const handleView = (rowData) => {
    navigate(`/purchase-order-list/${rowData.id}`, { state: { purchase_id: rowData.purchase_id } });
  };

  const handleEdit = (rowData) => {
    console.log("Edit Clicked:", rowData);
    setSelectedRowData(rowData);
    setOpenEditModal(true);
  };

  const handleReject = async (rowData) => {
    console.log("Reject Clicked:", rowData);

    // Show confirmation dialog
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to reject this Purchase Order?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, Reject it!",
    });

    // If user confirms, proceed with API call
    if (result.isConfirmed) {
      try {
        setLoading(true);
        const postData = { status: "Rejected" }; // Payload (Modify as needed)
        const response = await axios.put(
          `${process.env.REACT_APP_BACKEND_URL}/api/order-status-reject/${rowData.purchase_id}/reject`,
          postData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("Response:", response.data);
        fetchPurchaseOrderList();

        // Show success message
        Swal.fire("Rejected!", "The purchase order has been rejected.", "success");
      } catch (error) {
        console.error("Error rejecting PO:", error);
        Swal.fire("Error!", "Something went wrong. Try again.", "error");
      } finally {
        setLoading(false);
      }
    }
  };
  const handleClosePO = async (rowData) => {
    console.log("Closed Clicked:", rowData);

    // Show confirmation dialog
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to Close this Purchase Order?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, Close it!",
    });

    // If user confirms, proceed with API call
    if (result.isConfirmed) {
      try {
        setLoading(true);
        const postData = { status: "Closed" }; // Payload (Modify as needed)
        const response = await axios.put(
          `${process.env.REACT_APP_BACKEND_URL}/api/order-status-closed/${rowData.purchase_id}/closed`,
          postData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("Response:", response.data);
        fetchPurchaseOrderList();

        // Show success message
        Swal.fire("Closed!", "The purchase order has been Closed.", "success");
      } catch (error) {
        console.error("Error Closing PO:", error);
        Swal.fire("Error!", "Something went wrong. Try again.", "error");
      } finally {
        setLoading(false);
      }
    }
  };


  const updatedRawData = purchaseOrderData.map((raw, index) => ({
    ...raw, // Spread existing properties
    details: (
      <span
        className="bg-blue-900 rounded-md text-white shadow-md font-semibold px-4 hover:bg-blue-950 cursor-pointer"
        onClick={() => handleView(raw)}
      >
        Details
      </span>
    ),
    Actions: (
      <div className="flex justify-center items-center space-x-2">
        <button
          onClick={() => handleEdit(raw)}
          disabled={raw.status === "Complete" || raw.status === "Rejected" || raw.status === "Closed" || raw.status === "Partially Receive"}
          className={`w-4 transition-opacity ${raw.status === "Complete" || raw.status === "Rejected" || raw.status === "Closed" || raw.status === "Partially Receive"
            ? "opacity-50 cursor-not-allowed"
            : "opacity-100 hover:opacity-80"
            }`}
        >
          <img src={EditIcon} alt="Edit" className="w-4" />
        </button>
      </div>
    ),
    // Reject: raw.status === "Complete" ? (
    //   <span className="text-green-900 font-bold">Already Received</span>
    // ) : raw.status === "Rejected" ? (
    //   <span className="text-red-900 font-bold">Rejected</span>
    // ) : (
    //   <span
    //     className="bg-red-900 rounded-md text-white shadow-md font-semibold px-4 hover:bg-red-950 cursor-pointer"
    //     onClick={() => handleReject(raw)}
    //   >
    //     Reject PO
    //   </span>
    // ),
    // Reject: raw.status === "Complete" ? (
    //   <span className="text-green-900 font-bold">Already Received</span>
    // ) : raw.status === "Rejected" ? (
    //   <span className="text-red-900 font-bold">Rejected</span>
    // ) : raw.status === "Partially Receive" ? (
    //   <span
    //     className="bg-yellow-600 rounded-md text-white shadow-md font-semibold px-4 hover:bg-yellow-700 cursor-pointer"
    //     onClick={() => handleClosePO(raw)}
    //   >
    //     Close PO
    //   </span>
    // ) : (
    //   <span
    //     className="bg-red-900 rounded-md text-white shadow-md font-semibold px-4 hover:bg-red-950 cursor-pointer"
    //     onClick={() => handleReject(raw)}
    //   >
    //     Reject PO
    //   </span>
    // )
    Reject: raw.status === "Complete" ? (
      <span className="text-green-900 font-bold">Already Received</span>
    ) : raw.status === "Rejected" ? (
      <span className="text-red-900 font-bold">Rejected</span>
    ) : raw.status === "Partially Receive" ? (
      <span
        className="bg-yellow-600 rounded-md text-white shadow-md font-semibold px-4 hover:bg-yellow-700 cursor-pointer"
        onClick={() => handleClosePO(raw)}
      >
        Close PO
      </span>
    ) : raw.status === "Closed" ? (
      <span className="text-gray-700 font-bold">Closed</span>
    ) : (
      <span
        className="bg-red-900 rounded-md text-white shadow-md font-semibold px-4 hover:bg-red-950 cursor-pointer"
        onClick={() => handleReject(raw)}
      >
        Reject PO
      </span>
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
          {/* <h1 className="text-3xl font-bold text-blue-900 mb-4">{title}</h1> */}
          <h1 className="text-3xl font-bold text-blue-900 mb-4">Purchase Order List</h1>

          {openEditModal && (
            <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50 overflow-y-auto">
              <div className="bg-white p-6 rounded-lg shadow-lg max-h-[90vh] overflow-y-auto w-[100%] max-w-4xl">
                <EditPurchaseOrder
                  selectedRowData={selectedRowData}
                  setOpenEditModal={setOpenEditModal}
                  fetchPurchaseOrderList={fetchPurchaseOrderList}
                />
              </div>
            </div>
          )}

          <div className="mb-16">
            {paginationLoading ? (
              <div className="flex p-5 justify-center items-center space-x-2 mt-4 border border-gray-400 rounded-lg">
                <BounceLoader size={20} color="#1e3a8a" />
              </div>
            ) : (
              <SmartTable
                headers={headers}
                data={updatedRawData}
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
export default PurchaseOrderList;
