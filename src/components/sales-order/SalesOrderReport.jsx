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
import Pagination10 from "../utility/Pagination10";
import MasterTable from "../../smartTable/MasterTable";
const SalesOrderReport = () => {
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
    // "Edit",
    "View",
    // "Add SFG/Raw Material",
  ]);
  const [loading, setLoading] = useState(true);
  const [updateData, setUpdatedData] = useState([]);
  const [DisplayEditModal, setDisplayEditModal] = useState(false);

  //  adding pagination logic
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [paginationLoading, setPaginationLoading] = useState(false);

  const { token, email, designation, id } = useSelector((state) => state.auth);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();
  // console.log(salesDatas);
  useEffect(() => {
    // console.log(updateData);
    setUpdatedData(
      salesDatas.map((item, index) => ({
        ...item,
        // edit:
        //   (item?.status === "In Process" || item?.status === "Process Due") ? (
        //     <img
        //       src={EditIcon}
        //       alt="Edit"
        //       className="w-4"
        //       onClick={() => {
        //         // console.log(1)
        //         if (!item?.id) {
        //           alert("Not valid data");
        //           return;
        //         }
        //         const type =
        //           item?.customerType === "Vasttram Admin"
        //             ? "internal"
        //             : "external";
        //         navigate(`/sales-order-report/edit/${type}/${item?.id}`);
        //       }}
        //     />
        //   ) : (
        //     <img src={EditIcon} alt="Edit" className="w-4 opacity-50" />
        //   ),
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
                  item?.customerType === "Vasttram Admin"
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

  // const fetchSalesData = async () => {
  //   try {
  //     setPaginationLoading(true);
  //     const response = await axios.get(
  //       `${process.env.REACT_APP_BACKEND_URL}/api/sales-oder-entries/get-all-orders?page=${page}&pageSize=${pageSize}&designation=${designation}&userId=${id}`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     if (!response?.data?.data) {
  //       toast.error("Error fetching sales data");
  //       return;
  //     }

  //     const salesData = response.data.data.map((item) => ({
  //       id: item?.id,
  //       so_id: item?.so_id,
  //       convert_id: item?.orders?.[0]?.external_orders || "N/A",
  //       order_no: item?.order_no,
  //       customer_name: item?.customer?.company_name || "Vasttram Admin",
  //       group_name: item?.group?.group_name || "",
  //       design_name: item?.design_number?.design_number || "",
  //       order_date: formateDate(item?.order_date),
  //       delivery_date: formateDate(item?.delivery_date),
  //       qty: item?.qty,
  //       status: item?.order_status,
  //     }));

  //     // Assuming backend gives pagination meta like totalPages
  //     setTotalPages(response.data.totalPages || 1);
  //     setSalesData(salesData);
  //   } catch (error) {
  //     console.error("Error fetching sales orders:", error);
  //     toast.error(
  //       error?.response?.data?.message || "Failed to load sales orders"
  //     );
  //   } finally {
  //     setPaginationLoading(false);
  //     setLoading(false);
  //   }
  // };

  console.log("")
  // const fetchSalesData = async () => {
  //   try {
  //     setPaginationLoading(true);

  //     const params = new URLSearchParams({
  //       page: page,
  //       pageSize: pageSize,
  //       designation: designation,
  //       userId: id,
  //     });

  //     if (searchTerm) {
  //       params.append("filters[$or][0][so_id][$containsi]", searchTerm);
  //       params.append("filters[$or][1][order_no][$containsi]", searchTerm);
  //       params.append("filters[$or][2][customer][company_name][$containsi]", searchTerm);
  //       params.append("filters[$or][3][group][group_name][$containsi]", searchTerm);
  //       params.append("filters[$or][4][design_number][design_number][$containsi]", searchTerm);
  //       params.append("filters[$or][5][order_date][$containsi]", searchTerm);
  //       params.append("filters[$or][6][delivery_date][$containsi]", searchTerm);
  //       params.append("filters[$or][7][qty][$containsi]", searchTerm);
  //       params.append("filters[$or][8][order_status][$containsi]", searchTerm);
  //     }

  //     const response = await axios.get(
  //       `${process.env.REACT_APP_BACKEND_URL}/api/sales-oder-entries/get-all-orders?${params.toString()}`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     if (!response?.data?.data) {
  //       toast.error("Error fetching sales data");
  //       return;
  //     }

  //     const salesData = response.data.data.map((item) => ({
  //       id: item?.id,
  //       so_id: item?.so_id,
  //       convert_id: item?.orders?.[0]?.external_orders || "N/A",
  //       order_no: item?.order_no,
  //       customer_name: item?.customer?.company_name || "Vasttram Admin",
  //       group_name: item?.group?.group_name || "",
  //       design_name: item?.design_number?.design_number || "",
  //       order_date: formateDate(item?.order_date),
  //       delivery_date: formateDate(item?.delivery_date),
  //       qty: item?.qty,
  //       status: item?.order_status,
  //     }));

  //     setTotalPages(response.data.totalPages || 1);
  //     setSalesData(salesData);
  //   } catch (error) {
  //     console.error("Error fetching sales orders:", error);
  //     toast.error(
  //       error?.response?.data?.message || "Failed to load sales orders"
  //     );
  //   } finally {
  //     setPaginationLoading(false);
  //     setLoading(false);
  //   }
  // };

  console.log("")

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

  // useEffect(() => {
  //   fetchSalesData();
  // }, [page, pageSize]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchSalesData();
    }, 1000);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, page, pageSize]);

  useEffect(() => {
    setPage(1);
  }, [searchTerm]);


  const formateDate = (date) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(date).toLocaleDateString(undefined, options);
  };


  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <BounceLoader color="#1e3a8a" />
      </div>
    )
  }
  return (
    <div className="rounded-lg bg-white p-6">
      <h1 className="text-2xl font-bold text-blue-900 mb-4 pb-2 border-b">
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

      <MasterTable
        headers={headers}
        data={updateData}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        loading={paginationLoading}
        setLoading={setPaginationLoading}
      />


      <Pagination10
        setPage={setPage}
        totalPages={totalPages}
        page={page}
        setPageSize={setPageSize}
        pageSize={pageSize}
      />
    </div>
  );
};
export default SalesOrderReport;
