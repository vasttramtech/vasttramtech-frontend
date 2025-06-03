
import { useSelector } from "react-redux";
import SFGBomComponent from "../master/SFGBomComponent";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import RawMaterialBOM from "../master/RawMaterialBOM";
import axios from "axios";
import { BounceLoader, PuffLoader } from "react-spinners";
import { toast } from "react-toastify";
import { ArrowLeft } from "lucide-react";

// Table component for displaying saved data
const DataTable = ({ title, data, headers }) => {
  if (!data || data.length === 0) {
    return (
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-blue-700 mb-2">{title}</h3>
        <div className="bg-white p-4 rounded-md shadow-sm border border-gray-200">
          <p className="text-gray-500">No data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-blue-700 mb-2">{title}</h3>
      <div className="overflow-x-auto bg-white rounded-md shadow-sm border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-blue-700 text-white">
            <tr>
              {headers.map((header, index) => (
                <th
                  key={index}
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item, idx) => (
              <tr key={idx}>
                {Object.keys(item).map((key, keyIdx) => (
                  <td
                    key={keyIdx}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-700"
                  >
                    {item[key] !== null ? item[key] : "-"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const AdditionalSFGRawMaterial = () => {
  const { token } = useSelector((state) => state.auth);
  const { type, id } = useParams();
  const { load, error, availableSfgmGroups, availableRawMaterialGroups } =
    useSelector((state) => state.fetchData);

  // States for form data
  const [SavedSfgData, setSavedSfgData] = useState([]);
  const [FinalSFGData, setFinalSFGData] = useState([]);
  const [FinalRawMaterialData, setFinalRawMaterialData] = useState([]);
  const [SavedRawMaterialData, setSavedRawMaterialData] = useState([]);

  // States for API data
  const [extraRawMaterials, setExtraRawMaterials] = useState([]);
  const [extraSemiGoods, setExtraSemiGoods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const navigate = useNavigate();

  //   console.log(FinalRawMaterialData, FinalSFGData);

  // API endpoint configuration based on type
  const apiConfig = {
    external: {
      get: `/api/sales-oder-entries/get-extra-rm-sfg/${id}`,
      put: `/api/sales-oder-entries/${id}/add-extra-rm-sfg`,
    },
    internal: {
        get: `/api/internal-sales-oder-entries/get-extra-rm-sfg/${id}`,
        put: `/api/internal-sales-oder-entries/${id}/add-extra-rm-sfg`,
    },
    // Add more types as needed
  };

  const activeApi = type ? apiConfig[type] : null;

  // Function to fetch saved data
  const fetchSavedData = async () => {
    if (!activeApi) return;

    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}${activeApi.get}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data) {
        setExtraRawMaterials(response.data.extra_rm || []);
        setExtraSemiGoods(response.data.extra_semi_goods || []);
      }
    } catch (error) {
      console.log("Error fetching saved data:", error);
      toast.error("Failed to fetch saved data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Function to save data
  const handleSaveData = async () => {
    if (!activeApi) return;

    setIsSaving(true);
    try {
      const data = {
        extra_rm: FinalRawMaterialData,
        extra_semi_goods: FinalSFGData,
      };
      console.log("Data to save:", data);

      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}${activeApi.put}`,
        data,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Clear the form data after successful save
      setFinalRawMaterialData([]);
      setFinalSFGData([]);
      setSavedRawMaterialData([]);
      setSavedSfgData([]);
      toast.success("Data saved successfully!");

      await fetchSavedData();
    } catch (error) {
      console.error("Error saving data:", error);
      toast.error(
        error?.response?.data?.error?.message ||
          "Failed to save data. Please try again."
      );
    } finally {
      setIsSaving(false);
    }
  };

  // Handle cancel operation
  const handleCancel = () => {
    // Clear all form data
    setFinalRawMaterialData([]);
    setFinalSFGData([]);
    setSavedRawMaterialData([]);
    setSavedSfgData([]);

    // Navigate back or to a specified route
    navigate(-1);
  };

  useEffect(() => {
    if (!token) navigate("/login");
    else fetchSavedData();
  }, [token, type, id]);

  // Table headers
  const rmHeaders = [
    "SO ID",
    "Description",
    "Quantity",
    "Jobber",
    "Raw Material",
    "Total Price",
  ];
  const sfgHeaders = [
    "SO ID",
    "Description",
    "Quantity",
    "Jobber",
    "Semi-Finished Good",
    "Total Price",
  ];
  if (load || loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <BounceLoader size={100} color={"#1e3a8a"} loading={loading} />
      </div>
    );

  return (
    <div className="p-6 bg-gray-50">
      <div className="bg-blue-700 text-white p-4 rounded-t-lg mb-6 flex gap-4 items-center print:bg-blue-700">
        <button
          className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-black rounded-lg transition"
          onClick={() => navigate("/sales-order-report")}
        >
          <ArrowLeft size={18} />
          Back
        </button>
        <h1 className="text-xl font-bold">
          Additional Raw Material and Semi-Finished Good Items
        </h1>
      </div>

      <DataTable
        title="Saved Semi-Finished Goods"
        data={extraSemiGoods}
        headers={sfgHeaders}
      />

      <SFGBomComponent
        token={token}
        sfgmGroup={availableSfgmGroups}
        SavedSfgData={SavedSfgData}
        setSavedSfgData={setSavedSfgData}
        FinalSFGData={FinalSFGData}
        setFinalSFGData={setFinalSFGData}
      />

      <DataTable
        title="Saved Raw Materials"
        data={extraRawMaterials}
        headers={rmHeaders}
      />

      <RawMaterialBOM
        token={token}
        rawMaterialGroups={availableRawMaterialGroups}
        finalRawMaterialData={FinalRawMaterialData}
        setFinalRawMaterialData={setFinalRawMaterialData}
        savedRawMaterialData={SavedRawMaterialData}
        setSavedRawMaterialData={setSavedRawMaterialData}
      />

      <div className="flex justify-end gap-4 mt-8">
        <button
          onClick={handleCancel}
          className="px-6 py-2 bg-white text-blue-700 border border-blue-700 rounded-md hover:bg-blue-50 transition-colors"
          disabled={isSaving}
        >
          Cancel
        </button>

        <button
          onClick={handleSaveData}
          className="px-6 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-800 transition-colors flex items-center justify-center"
          disabled={isSaving}
        >
          {isSaving ? (
            <>
              <PuffLoader color="#ffffff" size={24} />
              <span className="ml-2">Saving...</span>
            </>
          ) : (
            "Save"
          )}
        </button>
      </div>
    </div>
  );
};

export default AdditionalSFGRawMaterial;
