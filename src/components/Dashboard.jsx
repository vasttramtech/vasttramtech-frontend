
import { useEffect, useState } from "react";
import SmartTable from "../smartTable/SmartTable";
import axios from "axios";
import { toast } from "react-toastify";
import { BounceLoader } from "react-spinners";
import { Link, useNavigate } from "react-router-dom";
import Pagination from "./utility/Pagination";
import { useSelector } from "react-redux";
import CountsDashboard from "./CountsDashboard";

const Dashboard = ({  company, setSelectedSOId, setSalesOrder, setBom, setFormData, setFromDashboard, setSelectedItem }) => {
  const [salesDatas, setSalesData] = useState([]);
  const [headers] = useState([
    " ",
    "SO Id",
    "Converted To",
    "Order No",
    "Customer Name",
    "Group Name",
    "Design Name",
    "Order Date",
    "Delivery Date",
    "Qty",
    "Status",
    "View",
    "Bill Of Sale",
    "Bill Of Purchase"
  ]);
  const [loading, setLoading] = useState(true);
  const [updateData, setUpdatedData] = useState([]);
  const [DisplayEditModal, setDisplayEditModal] = useState(false);
  const {token,email,designation , id  } = useSelector((state) => state.auth);

  //  adding pagination logic
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [paginationLoading, setPaginationLoading] = useState(false);
  const navigate = useNavigate();
  // console.log(designation , id)

  //  tabs logic
  const [activeTab, setActiveTab] = useState("dashboard");

  console.log(salesDatas);
  useEffect(() => {
    console.log(updateData);
    setUpdatedData(
      salesDatas.map((item, index) => ({
        ...item,
        view: (
          <div className="flex justify-center items-center space-x-2">
            <button
              type="button"
              className="bg-green-600 px-4 py-1 rounded-lg hover:bg-green-800 transition duration-150 ease-in-out ml-4 text-white"
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
        BOS: (
          <div className="flex justify-center items-center space-x-2">
            {/* <Link to={`/bill-of-sales?type1=sales-oder-entries&dashId=${item.id}`}>BOS</Link> */}
            {/* <Link
              to={`/bill-of-sales?type1=sales-oder-entries&dashId=${item.id}`}
              className="bg-green-800 px-4 py-1 rounded-lg hover:bg-green-900 transition ml-4 text-white"
            >
              BOS
            </Link> */}

            <Link
              to={`/bill-of-sales?type1=${item.customer_name === "Vasttram Admin"
                  ? "internal-sales-order-entries"
                  : "sales-oder-entries"
                }&dashId=${item.id}`}
              className="bg-blue-700 px-4 py-1 rounded-lg hover:bg-blue-900 transition duration-150 ease-in-out ml-4 text-white"
            >
              BOS
            </Link>

          </div>
        ),
        BOP: (
          <div className="flex justify-center items-center space-x-2">
            <Link
              to={`/bill-of-purchase?so_id=${item?.so_id}`}
              className="bg-yellow-500 px-4 py-1 rounded-lg hover:bg-yellow-600 transition duration-150 ease-in-out ml-4 text-white"
            >
              BOP
            </Link>

          </div>
        ),
      }))
    );
  }, [salesDatas]);

  const fetchSalesData = async () => {
    if (!designation || !id) return; 
    try {
      setPaginationLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/sales-oder-entries/get-all-orders?designation=${designation}&userId=${id}&page=${page}&pageSize=${pageSize}`,
        {}
      );

      if (!response?.data?.data) {
        toast.error("Error fetching sales data");
        return;
      }

      const salesData = response.data.data.map((item) => ({
        id: item?.id,
        so_id: item?.so_id,
        convert_id: item?.orders?.[0]?.external_orders || "",
        order_no: item?.order_no,
        customer_name: item?.customer?.company_name || "Vasttram Admin",
        group_name: item?.group?.group_name || "",
        design_name: item?.design_number?.design_number || "",
        order_date: item?.order_date,
        delivery_date: item?.delivery_date,
        qty: item?.qty,
        status: item?.order_status
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

  // useEffect(() => {
  //   fetchSalesData();
  // }, [page, pageSize]);

  useEffect(() => {
    if (designation && id) {
      fetchSalesData();
    }
  }, [designation, id, page, pageSize]);

  if (loading)
    return (
      <div className="absolute inset-0 flex justify-center items-center mt-64 bg-opacity-50 bg-gray-200 z-10">
        <BounceLoader size={100} color={"#1e3a8a"} loading={loading} />
      </div>
    );

  return (
    <div className="  ">
      <h1 className="text-3xl font-bold text-blue-900 mb-4">DashBoard</h1>


      <div className="flex w-full justify-end gap-5">
        {activeTab === 'dashboard' && 
          <div className="border  rounded-lg px-4 py-2 bg-green-500 cursor-pointer hover:bg-green-600 transition-all ease-out duration-200">
            <h1 className="text-xl text-white font-bold">Export to XLS</h1>
          </div>
          }
      <div className="flex">
         <div
          onClick={() => setActiveTab("dashboard")}
          className={`border rounded-l-lg px-4 py-2 cursor-pointer transition-all duration-200 ${
            activeTab === "dashboard" ? "bg-blue-900 hover:bg-blue-700" : "bg-gray-300 hover:bg-gray-400"
          }`}
        >
          <h1 className="text-xl text-white font-bold">Dashboard</h1>
        </div>

        {/* Counts Dashboard Tab */}
        <div
          onClick={() => setActiveTab("counts")}
          className={`border rounded-r-lg px-4 py-2 cursor-pointer transition-all duration-200 ${
            activeTab === "counts" ? "bg-blue-900 hover:bg-blue-700" : "bg-gray-300 hover:bg-gray-400"
          }`}
        >
          <h1 className="text-xl text-white font-bold">Counts Dashboard</h1>
        </div>
      </div>
        
      </div>

      {activeTab === "dashboard" &&
      <>
        {paginationLoading ? (
          <div className="flex p-5 justify-center items-center space-x-2 mt-4 border border-gray-400 rounded-lg">
            <BounceLoader size={20} color="#1e3a8a" />
          </div>
        ) : updateData && (
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
        ) 
        }
        </>
      }

      {activeTab === "counts" && (
        <CountsDashboard data={salesDatas}/>
      )}
    </div>
  );
};
export default Dashboard;
