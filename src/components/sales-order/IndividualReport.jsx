import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BounceLoader } from "react-spinners";
import { toast } from "react-toastify";
import axios from "axios";
import { useSelector } from "react-redux";
import { ArrowLeft, AwardIcon, RefreshCw } from "lucide-react";
import SemiFinishedGoodsTable from "./component/SemiFinishedGoodsTable";
import ExtraBOMStockStatus from "./component/ExtraBOMStockStatus";

const IndividualReport = () => {
  const { type, id } = useParams();
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);
  const { token } = useSelector((state) => state.auth);
  const [updating, setUpdating] = useState(null);
  const [refreshingStock, setRefreshingStock] = useState(false);
  const navigate = useNavigate();
  const [stockList, setStockList] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [savedSfgData, setSavedSfgData] = useState([]);
  const [approvedSFG, setapprovedSFG] = useState([]);
  const [SFGStatusStock, setSFGstatusStock] = useState([]);
  const fetchStock = async () => {
    try {
      if (!token) return;
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/custom/getAllStock`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const stock = response?.data?.data?.map((entry) => ({
        raw_material: entry?.raw_material_master?.id,
        stock: entry?.Total_Qty,
      }));
      setStockList(stock);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch stock");
    }
  };
  const fetchData = async () => {
    setLoading(true);
    try {
      const response =
        type === "internal"
          ? await axios.get(
              `${process.env.REACT_APP_BACKEND_URL}/api/internal-sales-order-entry/find-by-id/${id}?populate=*`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            )
          : await axios.get(
              `${process.env.REACT_APP_BACKEND_URL}/api/sales-oder-entries/find-by-id/${id}?populate=*`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
      if (!response || !response.data) {
        toast.error("Error at getting data");
      } else {
        // await fetchStock();
        setData(response.data);
        // console.log(response.data);
        const transformedData = (
          response.data?.extra_bom_so[0]?.Extra_bom || []
        )
          .filter((entry) => entry?.stock_status === false)
          .map((entry) => ({
            bom_id: entry?.id,
            semi_finished_goods:
              entry.semi_finished_goods?.semi_finished_goods_name || "",
            qty: Number(entry.qty),
            total_price: Number(entry.total_price),
            sfg_description: entry.sfg_description || "",
            color: entry?.color?.color_name,
            raw_material_bom: (entry.raw_material_bom || []).map((rm) => ({
              raw_material_id: rm.raw_material_master?.id || "",
              total_rm_qty: Number(rm.rm_qty) * Number(response.data.qty),
              raw_material_master: rm.raw_material_master?.item_name || "",
              rm_qty: rm.rm_qty || 1,
              price_per_unit: rm.raw_material_master?.price_per_unit || "",
            })),
            jobber_master_sfg: (entry.jobber_master_sfg || []).map(
              (jobber) => ({
                jobber_master: jobber.jobber_master?.jobber_name || "",
                jobber_rate: jobber.jobber_rate || 0,
                jobber_work_type: jobber.jobber_work_type || "",
                jobber_description: jobber.jobber_description || "",
                jobber_id: jobber.jobber_master?.jobber_id || "",
                jobber_address: jobber.jobber_master?.jobber_address || "",
              })
            ),
            color: entry.color,
          }));
        setSavedSfgData(transformedData);
      }
    } catch (error) {
      console.log("Error at getting data", error);
      toast.error(
        error?.response?.data?.error?.message || "Error at getting data"
      );
    } finally {
      setLoading(false);
    }
  };
  // console.log(savedSfgData);

  useEffect(() => {
    fetchStock();
  }, [refresh]);

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
    if (!type || !id) return;
    fetchData();
    fetchStock();
  }, [id, type, token]);

  console.log(approvedSFG);

  const refreshStockAndData = async (e) => {
    e.preventDefault();
    setRefreshingStock(true);
    try {
      if (approvedSFG.length === 0) {
        toast.error("Stock is already updated");
        return;
      }
      // console.log(approvedSFG);
      const reduceStock = approvedSFG.map((item) =>
        item?.raw_material_bom?.map((rm) => ({
          raw_material_master: rm.raw_material_id,
          qty: rm.total_rm_qty,
        }))
      );
      console.log(reduceStock);

      const reduce = reduceStock.flat();
      // console.log(reduce);
      if (reduce.length > 0) {
        await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/api/custom/redact-stock-inBulk`,
          reduce,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        toast.success("Stock updated successfully");
        const approved = approvedSFG.map((item) => item.bom_id);
        console.log(approved);
        if (type === "external") {
          const res = await axios.put(
            `${process.env.REACT_APP_BACKEND_URL}/api/sales-order-entry/update-stock-status/${data.id}`,
            { updateID: approved },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        } else {
          const res = await axios.put(
            `${process.env.REACT_APP_BACKEND_URL}/api/internal-sales-order-entries/update-stock-status/${data.id}`,
            { updateID: approved },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        }
        toast.success("Staus of BOM updated successfully");
        setRefresh(!refresh);
        await fetchData();
      }
    } catch (error) {
      console.error("Error refreshing data:", error);
      toast.error(
        error?.response?.data?.error?.message || "Something went wrong"
      );
    } finally {
      setRefreshingStock(false);
    }
  };

  // console.log(approvedSFG)

  if (loading)
    return (
      <div className="absolute inset-0 flex justify-center items-center bg-opacity-50 bg-gray-200 z-10">
        <BounceLoader size={100} color={"#1e3a8a"} loading={loading} />
      </div>
    );

  const updateStatus = async (update) => {
    if (!type || !data || !data.so_id || !data.id || !update) {
      toast.error("Invalid data");
      return;
    }
    const sentData = {
      data: {
        so_id: data.so_id,
        update: update,
        id: data.id,
      },
    };
    setUpdating(update);
    try {
      const response =
        type === "internal"
          ? await axios.put(
              `${process.env.REACT_APP_BACKEND_URL}/api/internal-sales-order-entry/update-status`,
              sentData,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            )
          : await axios.put(
              `${process.env.REACT_APP_BACKEND_URL}/api/sales-order-entry/update-status`,
              sentData,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
      if (!response || !response.data) {
        toast.error("Error at getting data");
      } else {
        await fetchData();
        toast.success(response.data);
      }
    } catch (error) {
      console.log("Error at Updating data", error);
      toast.error(
        error?.response?.data?.error?.message || "Error at Updating data"
      );
    } finally {
      setUpdating(null);
    }
  };

  // console.log(data.convert_id)

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Check if it's an internal order
  const isInternal = type === "internal";

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-6xl mx-auto my-8 print:shadow-none print:my-0 print:p-2 print-container">
      {/* Header Section */}
      <div className="bg-blue-700 text-white p-4 rounded-t-lg mb-6 flex justify-between items-center print:bg-blue-700">
        <button
          className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-black rounded-lg transition"
          onClick={() => navigate("/sales-order-report")}
        >
          <ArrowLeft size={18} />
          Back
        </button>
        <h1 className="text-2xl font-bold">
          {isInternal ? "Internal" : "External"} Sales Order #{data?.order_no}
        </h1>
        <div className="flex items-center space-x-2">
          <span className="font-semibold">Status:</span>
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
            {data?.order_status || "N/A"}
          </span>
        </div>
      </div>

      {/* Order Details Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold text-blue-700 mb-3 border-b border-blue-200 pb-2">
            Order Information
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600 text-sm">Order ID</p>
              <p className="font-medium">{data?.so_id || "N/A"}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Order Number</p>
              <p className="font-medium">{data?.order_no || "N/A"}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Order Date</p>
              <p className="font-medium">{formatDate(data?.order_date)}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Delivery Date</p>
              <p className="font-medium">{formatDate(data?.delivery_date)}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Quantity</p>
              <p className="font-medium">{data?.qty || "N/A"}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Processor</p>
              <p className="font-medium">{data?.processor?.name || "N/A"}</p>
              <p className="font-medium">
                {data?.processor?.designation || "N/A"}
              </p>
              <p className="font-medium">{data?.processor?.email || "N/A"}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Stock Order</p>
              <p className="font-medium">{data?.stock_order ? "Yes" : "No"}</p>
            </div>
            {data?.orders && (
              <div className="col-span-2">
                <p className="text-gray-600 text-sm">Convert ID</p>
                <p className="font-medium">
                  {data?.orders
                    .map((order) => order?.external_orders)
                    .join(", ")}{" "}
                </p>
                <p className="font-medium">
                  Converted Date: {data?.converted_date}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* If it's internal order, show this div instead */}
        {
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold text-blue-700 mb-3 border-b border-blue-200 pb-2">
              Additional Information
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="">
                <p className="text-gray-600 text-sm">Remarks</p>
                <p className="font-medium">{data?.remark || "N/A"}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Goods Received Remarks</p>
                <p className="font-medium">
                  {data?.goods_received_remark || "N/A"}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 border-gray-400 border-2 px-3 py-2 mt-3">
              <div>
                <p className="text-gray-600 text-sm">Customer Name</p>
                <p>{data?.customer?.company_name || "N/A"}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Customer Email</p>
                <p>{data?.customer?.email_id || "N/A"}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Customer Contact</p>
                <p>{data?.customer?.contact_number || "N/A"}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">
                  Customer Billing Address
                </p>
                <p>{data?.customer?.billing_address || "N/A"}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Customer GSTIN</p>
                <p>{data?.customer?.gstin_number || "N/A"}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Customer PAN</p>
                <p>{data?.customer?.pan_number || "N/A"}</p>
              </div>
            </div>
          </div>
        }
      </div>

      {/* Design Information */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h2 className="text-lg font-semibold text-blue-700 mb-3 border-b border-blue-200 pb-2">
          Design Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-gray-600 text-sm">Design Number</p>
            <p className="font-medium">
              {data?.design_number?.design_number || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Group</p>
            <p className="font-medium">{data?.group?.group_name || "N/A"}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Color</p>
            <p className="font-medium">
              {data?.design_number?.color?.color_name || "N/A"} (
              {data?.design_number?.color?.color_id || "N/A"})
            </p>
          </div>{" "}
          <div>
            <p className="text-gray-600 text-sm">Description</p>
            <p className="font-medium">
              {data?.design_number?.description || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Remarks</p>
            <p className="font-medium">{data?.remark || "N/A"}</p>
          </div>
        </div>
      </div>

      <SemiFinishedGoodsTable data={data} />

      <div className="col-span-2 border rounded border-gray-300">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="text-blue-500 bg-gray-200">
              <th className="border border-gray-300 px-4 py-2">Group</th>
              <th className="border border-gray-300 px-4 py-2">Colour</th>
              <th className="border border-gray-300 px-4 py-2">Design/Khaka</th>
              <th className="border border-gray-300 px-4 py-2">Measurement</th>
              <th className="border border-gray-300 px-4 py-2">Work</th>
              <th className="border border-gray-300 px-4 py-2">Others</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(data?.order_items || {}).map(([group, details]) => (
              <tr key={group}>
                <td className="border border-gray-300 px-4 py-2 font-semibold text-blue-600">
                  {group}
                </td>
                {["colour", "khaka", "measurement", "work", "others"].map(
                  (field) => (
                    <td
                      key={field}
                      className="border border-gray-300 px-4 py-2"
                    >
                      <input
                        type="text"
                        value={details?.[field] || ""}
                        disabled
                        className="w-full border rounded-md p-2 text-gray-700"
                      />
                    </td>
                  )
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Additional Information - Concerned Person */}
      {!isInternal && data?.customer?.concerned_person_details?.length > 0 && (
        <div className="mb-8 page-break">
          <h2 className="text-lg font-semibold text-blue-700 mb-3 border-b border-blue-200 pb-2">
            Concerned Person Details
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead className="bg-blue-50">
                <tr>
                  <th className="py-2 px-4 border-b text-left text-sm font-medium text-blue-800">
                    Name
                  </th>
                  <th className="py-2 px-4 border-b text-left text-sm font-medium text-blue-800">
                    Designation
                  </th>
                  <th className="py-2 px-4 border-b text-left text-sm font-medium text-blue-800">
                    Mobile
                  </th>
                  <th className="py-2 px-4 border-b text-left text-sm font-medium text-blue-800">
                    Email
                  </th>
                  <th className="py-2 px-4 border-b text-left text-sm font-medium text-blue-800">
                    Address
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data?.customer?.concerned_person_details?.map(
                  (person, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="py-2 px-4 text-sm">
                        {person?.concerned_person_name || "N/A"}
                      </td>
                      <td className="py-2 px-4 text-sm">
                        {person?.designation || "N/A"}
                      </td>
                      <td className="py-2 px-4 text-sm">
                        {person?.mobile_number_1 || "N/A"}
                      </td>
                      <td className="py-2 px-4 text-sm">
                        {person?.email_id || "N/A"}
                      </td>
                      <td className="py-2 px-4 text-sm">
                        {person?.address || "N/A"}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Stock Status for Extra BOMs */}
      {data?.extra_bom_so && data.extra_bom_so.length > 0 && (
        <ExtraBOMStockStatus
          savedSfgData={savedSfgData}
          stockList={stockList}
          token={token}
          setapprovedSFG={setapprovedSFG}
          setSFGstatusStock={setSFGstatusStock}
        />
      )}

      {/* Summary and Order Cost */}
      <div className="mb-8">
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-end">
            <p className="text-gray-600 font-medium">Grand Total </p>
            <p className="font-bold text-lg text-blue-700">
              ₹
              {(
                (data?.design_number?.total_design_cost || 0) * data?.qty
              )?.toLocaleString() || "N/A"}
            </p>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="mt-8 flex justify-between print:hidden">
        {data && data.order_status && data.order_status === "In Process" && (
          <button
            className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-6 rounded-lg shadow-md transition duration-300 flex items-center gap-2"
            onClick={(e) => {
              e.preventDefault();
              updateStatus("Cancel");
            }}
            disabled={updating}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
            {updating === "Cancel" ? "Updating..." : "Cancel"}
          </button>
        )}

        <div className="flex gap-3">
          {!data?.convert_id && (
            <button
              onClick={refreshStockAndData}
              disabled={refreshingStock}
              className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-lg shadow-md transition duration-300 flex items-center gap-2"
            >
              <RefreshCw
                size={18}
                className={refreshingStock ? "animate-spin" : ""}
              />
              {refreshingStock ? "Refreshing..." : "Refresh Stock"}
            </button>
          )}

          <button
            onClick={() => window.print()}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg shadow-md transition duration-300 flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z"
                clipRule="evenodd"
              />
            </svg>
            Print Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default IndividualReport;
