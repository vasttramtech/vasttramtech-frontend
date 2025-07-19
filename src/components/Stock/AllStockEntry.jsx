import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { BounceLoader } from "react-spinners";
import SmartTable from "../../smartTable/SmartTable";
import Pagination10 from "../utility/Pagination10";
import SmartTable1 from "../../smartTable/SmartTable1";

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

  
  const fetchStock = async () => {
    try {
      setPaginationLoading(true);

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
        processes: <div className=" flex flex-wrap gap-1 justify-center rounded-lg p-1">
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
      setPaginationLoading(false);
      setLoading(false);
    }
  };

 console.log("stock::",stock)

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

      <SmartTable1
        headers={headers}
        data={stock}
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

export default AllStockEntry;
