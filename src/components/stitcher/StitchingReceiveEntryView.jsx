import axios from 'axios';
import { ArrowLeft } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom'
import { BounceLoader } from 'react-spinners';

const StitchingReceiveEntryView = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [stitchingData, setStitchingData] = useState(null);
  const [stitchReceiveData, setStitchReceiveData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useSelector(state => state.auth);
  const [stitchStatus, setStitchStatus] = useState(null);

  const fetchStitchingEntry = async () => {
    try {

      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/stitching-receive-entries/find-by-id/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("View Data: ", response.data);

      setStitchingData(response.data.data);
      setStitchStatus(response.data.data)

    } catch (error) {
      console.error("Error fetching Stitching Entry Data:", error);
      if (error.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchStitchingEntry();
  }, [token]);

  if (loading) {
    return (
      <div className="absolute inset-0 flex justify-center items-center bg-opacity-50 bg-gray-200 z-10">
        <BounceLoader size={100} color={"#1e3a8a"} loading={loading} />
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-6xl mx-auto my-8 print:shadow-none print:my-0 print:p-2 print-container">
      {/* Header Section */}
      <div className="bg-blue-700 text-white p-4 rounded-t-lg mb-6 flex justify-between items-center print:bg-blue-700">
        <button
          className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-black rounded-lg transition"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={18} />
          Back
        </button>
        <h1 className="text-2xl font-bold">
          Stitch Receiving Entry Details
        </h1>
      </div>

      {/* Order Details Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold text-blue-700 mb-3 border-b border-blue-200 pb-2">
            Order Information
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-bold text-start text-blue-800 text-lg">Stitching ID</p>
              <p className="font-bold text-start text-blue-800 text-lg">{stitchingData?.id || "N/A"}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">SO ID</p>
              <p className="font-medium">{stitchingData?.so_id || "N/A"}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Entry Process Date</p>
              <p className="font-medium">{stitchingData?.entry_process_date || "N/A"}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Due Date</p>
              <p className="font-medium">{stitchingData?.due_date || "N/A"}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Processor</p>
              <p className="font-medium">{stitchingData?.processor?.name || "N/A"}</p>
            </div>

            <div>
              <p className="text-gray-600 text-sm">Stitch Status</p>
              <p className="font-medium">{stitchingData?.stitching_receiving_status || "N/A"}</p>
            </div>
          </div>
        </div>


        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold text-blue-700 mb-3 border-b border-blue-200 pb-2">
            Additional Information
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600 text-sm">Design Group</p>
              <p className="font-medium">{stitchingData?.design_group || "N/A"}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Design Number</p>
              <p className="font-medium">{stitchingData?.design_number || "N/A"}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Stitching Receive Remarks</p>
              <p className="font-medium">{stitchingData?.remarks || "N/A"}</p>
            </div>
          </div>
        </div>

      </div>


      {/* Stitcher Details */}
      <div className="mb-8 page-break">
        <h2 className="text-lg font-semibold text-blue-700 mb-3 border-b border-blue-200 pb-2">
          Stitcher Details
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-blue-50">
              <tr>
                <th className="py-2 px-4 border-b text-left text-sm font-medium text-blue-800">
                  Sticher Id
                </th>
                <th className="py-2 px-4 border-b text-left text-sm font-medium text-blue-800">
                  Name
                </th>
                <th className="py-2 px-4 border-b text-left text-sm font-medium text-blue-800">
                  Stitcher Type
                </th>
                <th className="py-2 px-4 border-b text-left text-sm font-medium text-blue-800">
                  Stitcher Code
                </th>
                <th className="py-2 px-4 border-b text-left text-sm font-medium text-blue-800">
                  Address
                </th>
                <th className="py-2 px-4 border-b text-left text-sm font-medium text-blue-800">
                  Remarks
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="py-2 px-4 text-sm">
                  {stitchingData?.stitcher?.id || "-"}
                </td>
                <td className="py-2 px-4 text-sm">
                  {stitchingData?.stitcher?.stitcher_name || "-"}

                </td>
                <td className="py-2 px-4 text-sm">
                  {stitchingData?.stitcher?.stitcher_type || "-"}
                </td>
                <td className="py-2 px-4 text-sm">
                  {stitchingData?.stitcher?.stitcher_code || "-"}
                </td>
                <td className="py-2 px-4 text-sm">
                  {stitchingData?.stitcher?.address || "-"}
                </td>
                <td className="py-2 px-4 text-sm">
                  {stitchingData?.stitcher?.remarks || "-"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {stitchingData?.receive_orderItem && (
        <div className="col-span-2">
          <h2 className="text-lg font-semibold text-blue-700 mb-3 border-b border-blue-200 pb-2">
            Order Item Details
          </h2>
          <div className="overflow-x-auto bg-white rounded-lg">
            <table className="w-full border-collapse border border-gray-300 rounded-lg">
              <thead className="bg-blue-50 text-blue-700 font-medium text-sm rounded-lg">
                <tr>
                  {["Group", "Colour", "Design/Khaka", "Measurement", "Work", "Others", "Qty Required", "Already Received", "Receive Qty"].map((header) => (
                    <th className="py-2 px-4 border border-gray-300 text-left text-sm font-medium text-blue-800">{header}</th>
                  ))}
                </tr>
              </thead>


              <tbody>
                {stitchingData?.receive_orderItem?.map((item, index) => {

                  return (
                    <tr key={index} className="even:bg-gray-100 hover:bg-gray-50 transition">
                      <td className="border border-gray-300 p-3 text-center">{item?.group || "N/A"}</td>
                      <td className="border border-gray-300 p-3 text-center">{item?.color || "N/A"}</td>
                      <td className="border border-gray-300 p-3 text-center">{item?.Khaka || "N/A"}</td>
                      <td className="border border-gray-300 p-3 text-center">{item?.measurement || "N/A"}</td>
                      <td className="border border-gray-300 p-3 text-center">{item?.work || "N/A"}</td>
                      <td className="border border-gray-300 p-3 text-center">{item?.others || "N/A"}</td>

                      <td className="border border-gray-300 p-3 text-center">
                        {item?.qty_reveive_required || 0}
                      </td>

                      <td className="border border-gray-300 p-3 text-center">
                        {item?.already_received || 0}
                      </td>

                      <td className="border border-gray-300 p-3 text-center">
                        {item?.receive_qty || 0}
                      </td>
                    </tr>
                  );
                })}
              </tbody>




            </table>
          </div>
        </div>

      )}

      {stitchingData?.measurement?.lehenga_sharara && stitchingData?.measurement?.bp_grown_kurti && (<div className="mt-6 border border-gray-300 rounded-lg p-5 shadow-sm bg-gray-50">
        <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">📏 Measurement Details</h2>

        {/* Lehenga / Sharara Measurements */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-blue-600 mb-2">Lehenga / Sharara</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Object.entries(stitchingData?.measurement?.lehenga_sharara).map(([key, val]) => (
              <div key={key} className="text-sm text-gray-800">
                <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span> {val}
              </div>
            ))}
          </div>
        </div>

        {/* BP / Grown / Kurti Measurements */}
        <div>
          <h3 className="text-lg font-medium text-green-600 mb-2">BP / Grown / Kurti</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Object.entries(stitchingData?.measurement?.bp_grown_kurti).map(([key, val]) => (
              <div key={key} className="text-sm text-gray-800">
                <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span> {val}
              </div>
            ))}
          </div>
        </div>
      </div>)}

      {stitchingData?.bom && stitchingData?.bom?.length > 0 && (
        <div className="col-span-2 mt-4">
          <h2 className="text-lg font-semibold text-blue-700 mb-3 border-b border-blue-200 pb-2">
            SFG Items Details
          </h2>
          <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
            <table className="w-full border-collapse border border-gray-300 rounded-lg">
              <thead className="bg-blue-50 text-blue-700 text-sm uppercase">
                <tr>
                  {["SFG ID", "SFG Name", "Color", "Qty"].map((header) => (
                    <th className="py-2 px-4 border border-gray-300   text-sm font-medium text-blue-800">{header}</th>
                  ))}
                </tr>
              </thead>


              <tbody>
                {stitchingData?.bom?.map((item, index) => {

                  return (
                    <tr key={index} className="even:bg-gray-100 hover:bg-gray-50 transition">
                      <td className="border border-gray-300 p-3 text-center">{item?.semi_finished_goods_master?.semi_finished_goods_id}</td>
                      <td className="border border-gray-300 p-3 text-center">{item?.semi_finished_goods_master?.semi_finished_goods_name}</td>
                      <td className="border border-gray-300 p-3 text-center">{item?.color?.color_name}</td>

                      <td className="border border-gray-300 p-3 text-center">
                        {item?.processed_qty || 0}
                      </td>


                    </tr>
                  );
                })}
              </tbody>




            </table>
          </div>
        </div>

      )}

    </div>
  )
}

export default StitchingReceiveEntryView
