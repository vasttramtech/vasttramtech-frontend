import { useEffect, useState } from "react";
import SmartTable from "../../smartTable/SmartTable";
import EditIcon from "../../assets/Others/EditIcon.png";
import EditSalesOrderModel from "./EditModals/EditSalesOrderModel";
import axios from "axios";
import { toast } from "react-toastify";
import SmartTable1 from "../../smartTable/SmartTable1";
import { BounceLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import Pagination from "../utility/Pagination";
import { useSelector } from "react-redux";
const SalesOrderReport = () => {
  const [salesDatas, setSalesData] = useState([]);
  const [headers] = useState([
    " ",
    "SO Id",
    "Convert Id",
    "Order No",
    "Customer Name",
    "Group Name",
    "Design Name",
    "Order Date",
    "Delivery Date",
    "Qty",
    "Status",
    "Edit",
    "View",
    // "Add SFG/Raw Material",
  ]);
  const [loading, setLoading] = useState(true);
  const [updateData, setUpdatedData] = useState([]);
  const [DisplayEditModal, setDisplayEditModal] = useState(false);

  //  adding pagination logic
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [paginationLoading, setPaginationLoading] = useState(false);

  const {token,email,designation , id  } = useSelector((state) => state.auth);

  const navigate = useNavigate();
  // console.log(salesDatas);
  useEffect(() => {
    // console.log(updateData);
    setUpdatedData(
      salesDatas.map((item, index) => ({
        ...item,
        edit:
          (item?.status === "In Process" || item?.status === "Process Due") && item.convert_id==="N/A" ? (
            <img
              src={EditIcon}
              alt="Edit"
              className="w-4"
              onClick={() => {
                // console.log(1)
                if (!item?.id) {
                  alert("Not valid data");
                  return;
                }
                const type =
                  item?.customer_name === "Vasttram Admin"
                    ? "internal"
                    : "external";
                navigate(`/sales-order-report/edit/${type}/${item?.id}`);
              }}
            />
          ) : (
            <img src={EditIcon} alt="Edit" className="w-4 opacity-50" />
          ),
        view: (
          <div className="flex justify-center items-center space-x-2">
            <button
              type="button"
              className="bg-green-600 px-4 py-1 rounded-lg hover:bg-green-700 transition ml-4 text-white"
              onClick={(e) => {
                e.preventDefault();
                if (!item?.id) {
                  alert("Not valid data");
                  return;
                }

                const type =
                  item?.customer_name === "Vasttram Admin"
                    ? "internal"
                    : "external";
                navigate(`/sales-order-report/report/${type}/${item?.id}`);
              }}
            >
              View
            </button>
          </div>
        ),
        // add: (
        //   <div className="flex justify-center items-center space-x-2">
        //     <button
        //       type="button"
        //       className="bg-gray-600 px-4 py-1 rounded-lg hover:bg-gray-700 transition ml-4 text-white"
        //       onClick={(e) => {
        //         e.preventDefault();
        //         if (!item?.id) {
        //           alert("Not valid data");
        //           return;
        //         }

        //         const type =
        //           item?.customer_name === "Vasttram Admin"
        //             ? "internal"
        //             : "external";
        //         navigate(`/sales-order-report/add/raw-material-sfg/${type}/${item?.id}`);
        //       }}
        //     >
        //       Add
        //     </button>
        //   </div>
        // ),
      }))
    );
  }, [salesDatas]);

  const fetchSalesData = async () => {
    try {
      setPaginationLoading(true);
      const response = await axios.get(

        `${process.env.REACT_APP_BACKEND_URL}/api/sales-oder-entries/get-all-orders?page=${page}&pageSize=${pageSize}&designation=${designation}&userId=${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response?.data?.data) {
        toast.error("Error fetching sales data");
        return;
      }

      const salesData = response.data.data.map((item) => ({
        id: item?.id,
        so_id: item?.so_id,
        convert_id: item?.convert_id || "N/A",
        order_no: item?.order_no,
        customer_name: item?.customer?.company_name || "Vasttram Admin",
        group_name: item?.group?.group_name || "",
        design_name: item?.design_number?.design_number || "",
        order_date: formateDate(item?.order_date),
        delivery_date: formateDate(item?.delivery_date),
        qty: item?.qty,
        status: item?.order_status,
      }));

      // Assuming backend gives pagination meta like totalPages
      setTotalPages(response.data.totalPages || 1);
      setSalesData(salesData);
    } catch (error) {
      console.error("Error fetching sales orders:", error);
      toast.error(
        error?.response?.data?.message || "Failed to load sales orders"
      );
    } finally {
      setPaginationLoading(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalesData();
  }, [page, pageSize]);

  const formateDate = (date) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(date).toLocaleDateString(undefined, options);
  }

  if (loading)
    return (
      <div className="absolute inset-0 flex justify-center items-center mt-64 bg-opacity-50 bg-gray-200 z-10">
        <BounceLoader size={100} color={"#1e3a8a"} loading={loading} />
      </div>
    );

  return (
    <div>
      <h1 className="text-3xl font-bold text-blue-900 mb-4">
        Sales Order Report
      </h1>
      {DisplayEditModal && (
        <div>
          <div className="fixed w-screen h-screen flex justify-center items-center z-50">
            <div className="relative bg-white p-6 rounded-lg shadow-lg max-h-[90vh] overflow-y-auto w-[90%] max-w-4xl">
              <EditSalesOrderModel
                order_id={1}
                setDisplayEditModal={setDisplayEditModal}
                DisplayEditModal={DisplayEditModal}
              />
            </div>
          </div>
        </div>
      )}
      <>
        {paginationLoading ? (
          <div className="flex p-5 justify-center items-center space-x-2 mt-4 border border-gray-400 rounded-lg">
            <BounceLoader size={20} color="#1e3a8a" />
          </div>
        ) : updateData && updateData.length > 0 ? (
          <>
            <SmartTable headers={headers} data={updateData} />

            <Pagination
              setPage={setPage}
              totalPages={totalPages}
              page={page}
              setPageSize={setPageSize}
              pageSize={pageSize}
            />
          </>
        ) : (
          <div className="text-center text-gray-500 mt-6">No data found.</div>
        )}
      </>
    </div>
  );
};
export default SalesOrderReport;
