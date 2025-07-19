
import { useEffect, useState } from "react";
import SmartTable from "../smartTable/SmartTable";
import axios from "axios";
import { toast } from "react-toastify";
import { BounceLoader } from "react-spinners";
import { Link, useNavigate } from "react-router-dom";
import Pagination10 from "./utility/Pagination10";
import { useSelector } from "react-redux";
import CountsDashboard from "./CountsDashboard";
import ExportToExcel from "./utility/ExportToExcel";


const Dashboard = ({ company, setSelectedSOId, setSalesOrder, setBom, setFormData, setFromDashboard, setSelectedItem }) => {
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
    "Order Stock",
    "View",
    "Bill Of Sale",
    "Bill Of Purchase"
  ]);
  const [loading, setLoading] = useState(true);
  const [updateData, setUpdatedData] = useState([]);
  const [DisplayEditModal, setDisplayEditModal] = useState(false);
  const { token, email, designation, id } = useSelector((state) => state.auth);

  //  adding pagination logic
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [paginationLoading, setPaginationLoading] = useState(false);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
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
                  item?.customerType === "Vasttram Admin"
                    ? "internal"
                    : "external";
                navigate(`/dashboard-sales-order-report/report/${type}/${item?.id}`);
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
              to={`/bill-of-sales?type1=${item.customerType === "Vasttram Admin"
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

      // Split pagination for both APIs
      const halfPageSize = Math.ceil(pageSize / 2);

      // Common filters
      const commonFilters = {
        ...(designation === "Merchandiser"
          ? { "filters[merchandiser][id][$eq]": id }
          : designation === "Admin"
            ? {}
            : { "filters[processor][id][$eq]": id }),
      };

      const searchFilters = searchTerm
        ? {
          "filters[$or][0][so_id][$containsi]": searchTerm,
          "filters[$or][1][order_no][$containsi]": searchTerm,
          "filters[$or][2][design_number][design_number][$containsi]": searchTerm,
          "filters[$or][3][customer][company_name][$containsi]": searchTerm,
          "filters[$or][4][group][group_name][$containsi]": searchTerm,
          "filters[$or][5][order_status][$containsi]": searchTerm,
        }
        : {};

      const internalSearchFilters = searchTerm
        ? {
          "filters[$or][0][so_id][$containsi]": searchTerm,
          "filters[$or][1][order_no][$containsi]": searchTerm,
          "filters[$or][2][design_number][design_number][$containsi]": searchTerm,
          "filters[$or][3][customer][company_name][$containsi]": searchTerm,
          "filters[$or][4][group][group_name][$containsi]": searchTerm,
          "filters[$or][5][orders][external_orders][$containsi]": searchTerm,
          "filters[$or][6][order_status]": searchTerm,
        }
        : {};

      const basePopulate = {
        "populate[customer]": true,
        "populate[group]": true,
        "populate[design_number]": true,
      };

      const externalParams = {
        "pagination[page]": page,
        "pagination[pageSize]": halfPageSize,
        "sort[0]": "order_date:desc",
        ...commonFilters,
        ...searchFilters,
        ...basePopulate,
      };

      const internalParams = {
        "pagination[page]": page,
        "pagination[pageSize]": halfPageSize,
        "sort[0]": "order_date:desc",
        ...commonFilters,
        ...internalSearchFilters,
        ...basePopulate,
        "populate[orders]": true, // only for internal orders
      };

      const [extRes, intRes] = await Promise.all([
        axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/sales-oder-entries`,
          {
            headers: { Authorization: `Bearer ${token}` },
            params: externalParams,
          }
        ),
        axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/internal-sales-order-entries`,
          {
            headers: { Authorization: `Bearer ${token}` },
            params: internalParams,
          }
        ),
      ]);

      const extData = extRes.data?.data || [];
      const intData = intRes.data?.data || [];

      console.log("extData: ", extData)
      console.log("intData: ", intData)

      // Combine and sort by order_date descending
      const combinedData = [...extData, ...intData].sort(
        (a, b) =>
          new Date(b.attributes?.order_date).getTime() -
          new Date(a.attributes?.order_date).getTime()
      );
      const salesData = combinedData.map((item) => {
        const isInternal = !!item.orders; // only internal-sales-order-entries have `orders`
        const customerType = isInternal ? "Vasttram Admin" : "External";

        const customer =
          item.customer?.data?.attributes?.company_name || item.customer?.company_name;
        const group =
          item.group?.data?.attributes?.group_name || item.group?.group_name;
        const design =
          item.design_number?.data?.attributes?.design_number || item.design_number?.design_number;

        const convert_id = isInternal
          ? item.orders?.data?.[0]?.attributes?.external_orders || ""
          : "";

        return {
          id: item.id,
          so_id: item.so_id,
          convert_id: item?.orders?.[0]?.external_orders || "",
          order_no: item.order_no,
          customer_name: customer || "Vasttram Admin",
          group_name: group || "",
          design_name: design || "",
          order_date: item.order_date,
          delivery_date: item.delivery_date,
          qty: item.qty,
          status: item.order_status,
          customerType
        };
      });

      // Assuming external + internal total count can be derived later
      // setTotalPages(Math.ceil((extData.length + intData.length) / pageSize));
      const extTotal = extRes.data?.meta?.pagination?.total || 0;
      const intTotal = intRes.data?.meta?.pagination?.total || 0;
      const totalCombined = extTotal + intTotal;

      setTotalPages(Math.ceil(totalCombined / pageSize));
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

  console.log("salesDatas: ", salesDatas)

  useEffect(() => {
    if (designation && id) {
      fetchSalesData();
    }
  }, [designation, id, page, pageSize]);

  useEffect(() => {
    setPage(1);
  }, [searchTerm]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (designation && id) {
        fetchSalesData();
      }
    }, 1000);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);



  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <BounceLoader color="#1e3a8a" />
      </div>
    )
  }


  return (
    <div className="p-6 bg-white rounded-lg relative min-h-screen">

      <h1 className="text-2xl font-bold text-blue-900">DashBoard</h1>


      <div className="flex w-full justify-end gap-4 items-center flex-wrap">
        {activeTab === 'dashboard' && (
          <div className="bg-green-500 hover:bg-green-600 text-white font-medium rounded-md shadow-sm cursor-pointer transition-all duration-200">
            <ExportToExcel data={salesDatas} reportName="Sales Orders" />
          </div>

        )}

        <div className="flex items-center border border-gray-200 bg-white shadow-sm rounded-md overflow-hidden">
          {/* Dashboard Tab */}
          <div
            onClick={() => setActiveTab("dashboard")}
            className={`px-5 py-2 text-sm font-semibold cursor-pointer transition duration-200 ${activeTab === "dashboard"
              ? "bg-blue-900 text-white"
              : "text-blue-900 hover:bg-blue-50"
              }`}
          >
            Dashboard
          </div>

          {/* Counts Dashboard Tab */}
          <div
            onClick={() => setActiveTab("counts")}
            className={`px-5 py-2 text-sm font-semibold cursor-pointer transition duration-200 ${activeTab === "counts"
              ? "bg-blue-900 text-white"
              : "text-blue-900 hover:bg-blue-50"
              }`}
          >
            Counts Dashboard
          </div>
        </div>
      </div>



      {activeTab === "dashboard" &&
        updateData && (
          <>
            {/* <SmartTable headers={headers} data={updateData} /> */}
            <SmartTable
              headers={headers}
              data={updateData}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              setLoading={setPaginationLoading}
              loading={paginationLoading}
            />

            <Pagination10
              setPage={setPage}
              totalPages={totalPages}
              page={page}
              setPageSize={setPageSize}
              pageSize={pageSize}
            />
          </>
        )
      }

      {activeTab === "counts" && (
        <CountsDashboard data={salesDatas} />
      )}
    </div>
  );
};
export default Dashboard;
