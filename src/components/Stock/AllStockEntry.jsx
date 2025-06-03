import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import SmartTable1 from "../../smartTable/SmartTable1";
import { BounceLoader } from "react-spinners";

const AllStockEntry = () => {
  const { token } = useSelector((state) => state.auth);
  const [stock, setStock] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const fetchStock = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/custom-all-sfg-stock`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!response) toast.error("Failed to fetch data.");
      else {
        console.log(response);
        const formattedData = response.data.map((item) => ({
          sfg: item?.sfg?.semi_finished_goods_name,
          color: item?.color?.color_name,
          entry_date: item?.entry_date,
          so_id: item?.so_id,
          processes: <div className="bg-gray-100 flex flex-col gap-1 rounded-lg p-1">
            {item?.processes?.map((process) => (
              <span key={process.id} >{process.processes}</span>
            ))}
          </div>,
          qty: item?.qty,
        }));
        setStock(formattedData);
      }
    } catch (error) {
      console.log(error);
      toast.error(
        error?.response?.data?.error?.message || "Failed to fetch data."
      );
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (!token) navigate("/login");
    fetchStock();
  }, [token]);
//   console.log(stock);
  const headers=["SFG","Color","Entry Date","SO ID","Processes","Qty"];
  if(loading)return (
    <div className="flex items-center justify-center h-screen">
      <BounceLoader size={100} color={"#1e3a8a"} loading={loading} />
    </div>
  )
  return (
    <div>
      <h1 className="text-3xl font-bold text-blue-900 mb-6 border-b pb-3">
        Semi Finished Goods Stock Entries
      </h1>
      <SmartTable1 data={stock}  headers={headers}/>
    </div>
  );
};

export default AllStockEntry;
