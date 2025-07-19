import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { BounceLoader } from "react-spinners";
import SmartTable from "../../smartTable/SmartTable";
import Pagination10 from "../utility/Pagination10";

const AllStockEntry = () => {
  const { token } = useSelector((state) => state.auth);
  const [stock, setStock] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [paginationLoading, setPaginationLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // const fetchStock = async () => {
  //   try {
  //     setLoading(true);
  //     const params = {
  //       "pagination[page]": page,
  //       "pagination[pageSize]": pageSize,
  //       "sort[0]": "createdAt:desc",

  //       // Populate all required relations
  //       // "populate[design]": "*",
  //       // "populate[processor]": "*",
  //       // "populate[sales_order_entry][populate][merchandiser]": "*",
  //       // "populate[sales_order_entry][populate][processor]": "*",
  //       // "populate[sales_order_entry][populate][so_items]": "*",
  //       // "populate[internal_sales_order_entry][populate][merchandiser]": "*",
  //       // "populate[internal_sales_order_entry][populate][processor]": "*",
  //       // "populate[internal_sales_order_entry][populate][so_items]": "*",
  //       // "populate[bom_billOfSale][populate][jobber]": "*",
  //       // "populate[bom_billOfSale][populate][raw_material_qty][populate][raw_material_master]": "*",
  //       // "populate[bom_billOfSale][populate][sfg_qty][populate][semi_finished_goods_master]": "*",

  //     };

  //     if (searchTerm) {
  //       // params["filters[$or][2][internal_sales_order_entry][so_id][$containsi]"] = searchTerm;
  //       // params["filters[$or][3][sales_order_entry][so_id][$containsi]"] = searchTerm;
  //       // params["filters[$or][4][design][design_number][$containsi]"] = searchTerm;
  //       // params["filters[$or][5][bom_billOfSale][jobber][jobber_name][$containsi]"] = searchTerm;
  //       // params["filters[$or][6][bom_billOfSale][jobber][jobber_gstin][$containsi]"] = searchTerm;
  //       // params["filters[$or][7][processor][name][$containsi]"] = searchTerm;
  //       // params["filters[$or][8][processor][designation][$containsi]"] = searchTerm;
  //       // params["filters[$or][9][billOfSales_status][$containsi]"] = searchTerm;
  //     }
  //     const response = await axios.get(
  //       `${process.env.REACT_APP_BACKEND_URL}/api/custom-all-sfg-stock`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //         params,
  //       }
  //     );
  //     // const response = await axios.get(
  //     //   `${process.env.REACT_APP_BACKEND_URL}/api/custom-all-sfg-stock`,
  //     //   { headers: { Authorization: `Bearer ${token}` } }
  //     // );
  //     if (!response) toast.error("Failed to fetch data.");
  //     else {
  //       console.log(response);
  //       const formattedData = response.data.map((item) => ({
  //         sfg: item?.sfg?.semi_finished_goods_name,
  //         color: item?.color?.color_name,
  //         entry_date: item?.entry_date,
  //         so_id: item?.so_id,
  //         processes: <div className="bg-gray-100 flex flex-col gap-1 rounded-lg p-1">
  //           {item?.processes?.map((process) => (
  //             <span key={process.id} >{process.processes}</span>
  //           ))}
  //         </div>,
  //         qty: item?.qty,
  //       }));
  //       setStock(formattedData);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     toast.error(
  //       error?.response?.data?.error?.message || "Failed to fetch data."
  //     );
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  console.log("")
  // const fetchStock = async () => {
  //   try {
  //     setLoading(true);
  //     const response = await axios.get(
  //       `${process.env.REACT_APP_BACKEND_URL}/api/custom-all-sfg-stock`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     if (!response) toast.error("Failed to fetch data.");
  //     else {
  //       const fullData = response.data;

  //       // Filter by search term
  //       const filtered = fullData.filter(item => {
  //         const sfg = item?.sfg?.semi_finished_goods_name?.toLowerCase() || "";
  //         const color = item?.color?.color_name?.toLowerCase() || "";
  //         const soId = item?.so_id?.toLowerCase() || "";
  //         const processes = item?.processes?.map(p => p.processes?.toLowerCase()).join(" ") || "";

  //         return (
  //           sfg.includes(searchTerm.toLowerCase()) ||
  //           color.includes(searchTerm.toLowerCase()) ||
  //           soId.includes(searchTerm.toLowerCase()) ||
  //           processes.includes(searchTerm.toLowerCase())
  //         );
  //       });

  //       // Pagination (client-side)
  //       const startIndex = (page - 1) * pageSize;
  //       const paginatedData = filtered.slice(startIndex, startIndex + pageSize);
  //       const total = filtered.length;
  //       const totalPageCount = Math.ceil(total / pageSize);
  //       setTotalPages(totalPageCount);

  //       const formattedData = paginatedData.map((item) => ({
  //         sfg: item?.sfg?.semi_finished_goods_name,
  //         color: item?.color?.color_name,
  //         entry_date: item?.entry_date,
  //         so_id: item?.so_id,
  //         processes: (
  //           <div className="bg-gray-100 flex flex-col gap-1 rounded-lg p-1">
  //             {item?.processes?.map((process) => (
  //               <span key={process.id}>{process.processes}</span>
  //             ))}
  //           </div>
  //         ),
  //         qty: item?.qty,
  //       }));

  //       setStock(formattedData);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     toast.error(
  //       error?.response?.data?.error?.message || "Failed to fetch data."
  //     );
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchStock = async () => {
    try {
      setLoading(true);

      const params = {
        "pagination[page]": page,
        "pagination[pageSize]": pageSize,
        "sort[0]": "createdAt:desc",

        // Populate relational and component fields
        "populate[sfg]": true,
        "populate[color]": true,
        "populate[processes]": true,
      };

      if (searchTerm) {
        params["filters[$or][1][sfg][semi_finished_goods_name][$containsi]"] = searchTerm;
        params["filters[$or][2][color][color_name][$containsi]"] = searchTerm;
        params["filters[$or][3][entry_date][$containsi]"] = searchTerm;
        params["filters[$or][4][so_id][$containsi]"] = searchTerm;
        // params["filters[$or][5][bom_billOfPurchase][jobber][jobber_gstin][$containsi]"] = searchTerm;
      }

      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/sfg-stock-entries`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params,
        }
      );

      const data = response.data?.data || [];
      console.log("data111: ", data)
      const pagination = response.data?.meta?.pagination || {};
      setTotalPages(pagination.pageCount || 1);

      const formattedData = data.map((item) => ({
        sfg: item?.sfg?.semi_finished_goods_name,
        color: item?.color?.color_name,
        entry_date: item?.entry_date,
        so_id: item?.so_id,
        processes: <div className=" flex flex-wrap gap-1 rounded-lg p-1">
          {item?.processes?.map((process) => (
            <span key={process.id} className="bg-gray-200 rounded-md p-1 text-black" >{process.processes}</span>
          ))}
        </div>,
        qty: item?.qty,
      }));

      setStock(formattedData);
    } catch (error) {
      console.error("Error fetching SFG stock:", error);
      toast.error(
        error?.response?.data?.error?.message || "Failed to fetch SFG stock."
      );
    } finally {
      setLoading(false);
    }
  };



  // useEffect(() => {
  //   if (!token) navigate("/login");
  //   fetchStock();
  // }, [token]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (!token) navigate("/login");
      fetchStock();
    }, 1000);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm, page, pageSize]);

  useEffect(() => {
    setPage(1);
  }, [searchTerm]);

  //   console.log(stock);
  const headers = ["SFG", "Color", "Entry Date", "SO ID", "Processes", "Qty"];
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <BounceLoader color="#1e3a8a" />
      </div>
    )
  }
  return (
    <div className="p-6 bg-white rounded-lg">
      <h1 className="text-2xl font-bold text-blue-900 mb-4 border-b pb-2">
        Semi Finished Goods Stock Entries
      </h1>
      {/* <SmartTable1 data={stock} headers={headers} /> */}

      <SmartTable
        headers={headers}
        data={stock}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        loading={loading}
        setLoading={setLoading}
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

export default AllStockEntry;
