import { useEffect, useState, useRef } from "react";
import FormLabel from "../purchase/FormLabel";
import axios from "axios";
import { toast } from "react-toastify";
import { BounceLoader, PuffLoader } from "react-spinners";
import { useSelector } from "react-redux";
import SingleAddTable from "../../smartTable/SingleAddTable";
import { useNavigate } from "react-router-dom";
import FormInput from "../utility/FormInput";

const SemiFinishedGoodStock = () => {
  const [formData, setFormData] = useState({
    so_id: "",
    sfg_group: "",
    qty: 0,
    color: "",
    processes: [],
    date: "",
    total_price: 0,
  });
  const [SOIDs, setSOIDs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [AvailableSFG, setAvailableSFG] = useState([]);
  const { token } = useSelector((state) => state.auth);
  const { load, availableSfgmGroups, colorCategories } = useSelector(
    (state) => state.fetchData
  );
  const [showSFGTable, setShowSFGTable] = useState(false);
  const sfghHeaders = ["SFG Group", "SFG Name", "unit"];
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedData, setSelectedData] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  // For processes multi-select dropdown
  const [isProcessesDropdownOpen, setIsProcessesDropdownOpen] = useState(false);
  const processesDropdownRef = useRef(null);
  const processOptions = [
    "Dye",
    "Print",
    "CMC",
    "Mchn",
    "Dori",
    "Hand",
    "CMC/Hand",
    "Mchn/Hand",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedData || !selectedData.id) {
      toast.error("Please select SFG");
      return;
    }
    if (
      !formData.so_id ||
      !formData.sfg_group ||
      !formData.qty ||
      !formData.color ||
      !formData.processes.length
    ) {
      toast.error("Please select all fields");
      return;
    }
    setSubmitting(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/custom-sfg-stock`,
        { ...formData, sfg_id: selectedData.id },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Semi Finished Stock added successfully", {
        position: "top-right",
      });
      setAvailableSFG([]);
      setSelectedData(null);
      setFormData({
        so_id: "",
        sfg_group: "",
        qty: 0,
        color: "",
        processes: [],
        date: "",
        total_price: 0,
      });
    } catch (error) {
      console.log("Error at fetching SO ID", error);
      toast.error(
        error?.response?.data?.error?.message || "Error at suubmitting data"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const fetchSOID = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/sales-order-entry/get-soid`
      );
      if (!response || !response.data) {
        toast.error("Error at fetching SO ID");
      } else {
        setSOIDs(response.data);
      }
    } catch (error) {
      console.log("Error at fetching SO ID", error);
      toast.error(
        error?.response?.data?.error?.message || "Error at fetching SO ID"
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchSFG = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/custom-semi-finished-goods/group/${formData.sfg_group}`
      );
      if (!response || !response.data) {
        toast.error("Error at fetching SFG");
      } else {
        const formattedData = response.data.map((item) => ({
          group_name: item?.group?.group_name,
          sfg_name: item?.semi_finished_goods_name,
          unit: item?.unit?.unit_name,
          id: item?.id,
        }));
        setAvailableSFG(formattedData);
      }
    } catch (error) {
      console.log(error);
      toast.error(
        error?.response?.data?.error?.message || "Error at fetching SFG"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (formData.sfg_group) fetchSFG();
  }, [formData.sfg_group]);

  useEffect(() => {
    if (!token) navigate("/login");
    fetchSOID();
  }, [token]);

  useEffect(() => {
    if (!selectedData) return;
    setShowSFGTable(false);
  }, [selectedData]);

  // Click outside to close processes dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        processesDropdownRef.current &&
        !processesDropdownRef.current.contains(event.target)
      ) {
        setIsProcessesDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle process checkbox change
  const handleProcessChange = (process) => {
    setFormData((prevData) => {
      if (prevData.processes.includes(process)) {
        return {
          ...prevData,
          processes: prevData.processes.filter((p) => p !== process),
        };
      } else {
        return {
          ...prevData,
          processes: [...prevData.processes, process],
        };
      }
    });
  };

  if (loading || load)
    return (
      <div className="absolute inset-0 flex justify-center items-center bg-opacity-50 bg-gray-200 z-10">
        <BounceLoader size={100} color={"#1e3a8a"} loading={loading} />
      </div>
    );

  return (
    <div className="mx-auto">
      {/* Modal for SFG Table */}
      {showSFGTable && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-lg w-4/5 max-h-[80vh] overflow-hidden">
            <div className="bg-blue-900 text-white px-6 py-3 flex justify-between items-center">
              <h3 className="text-xl font-semibold">
                Select Semi Finished Good
              </h3>
              <button
                className="text-xl px-2 hover:bg-blue-800 rounded-full h-8 w-8 flex items-center justify-center"
                onClick={() => setShowSFGTable(false)}
              >
                ×
              </button>
            </div>
            <div className="p-4 overflow-auto max-h-[calc(80vh-60px)]">
              <SingleAddTable
                data={AvailableSFG}
                setSelectedData={setSelectedData}
                setSelectedRow={setSelectedRow}
                NoOfColumns={3}
                headers={sfghHeaders}
              />
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg p-6">
        <h1 className="text-3xl font-bold text-blue-900 mb-6 border-b pb-3">
          Semi Finished Goods Stock Entry
        </h1>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Entry Date */}
            <FormInput
              label={"Entry Date"}
              type={"date"}
              name={"entry_date"}
              value={formData.entry_date}
              onChange={handleChange}
            />
            {/* SO ID */}
            <div className="flex flex-col">
              <FormLabel title={"SO ID"} />
              <select
                value={formData.so_id}
                name="so_id"
                onChange={handleChange}
                className="border border-gray-300 bg-gray-100 rounded-md p-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="" disabled>
                  Select SO ID
                </option>
                {SOIDs &&
                  Array.isArray(SOIDs) &&
                  SOIDs.map((item) => (
                    <option key={item?.id} value={item?.so_id}>
                      {item?.so_id}
                    </option>
                  ))}
              </select>
            </div>

            {/* Group and SFG */}
            <div className="flex gap-2 items-start">
              <div className="flex flex-col justify-center w-1/2">
                <FormLabel title={"Group"} />
                <select
                  className="border border-gray-300 bg-gray-100 rounded-md p-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  name="sfg_group"
                  onChange={handleChange}
                  value={formData.sfg_group}
                >
                  <option value="" disabled>
                    Select Group
                  </option>
                  {availableSfgmGroups &&
                    Array.isArray(availableSfgmGroups) &&
                    availableSfgmGroups?.map((group) => (
                      <option key={group.id} value={group.id}>
                        {group.group_name}
                      </option>
                    ))}
                </select>
              </div>
              <button
                className="bg-blue-900 rounded-lg px-3 hover:bg-blue-800 text-white h-10 mt-5"
                onClick={(e) => {
                  e.preventDefault();
                  if (!formData.sfg_group) {
                    toast.error("Please select group first");
                    return;
                  }
                  setShowSFGTable(true);
                }}
              >
                Choose Semi Finished Goods
              </button>
            </div>

            {/* Qty */}
            <div className="flex flex-col">
              <FormLabel title={"Qty"} />
              <input
                className="p-2 border bg-gray-100 border-gray-300 rounded-md"
                type="number"
                placeholder="0"
                name="qty"
                onChange={handleChange}
                value={formData.qty}
                min={0}
              />
            </div>

            {/* Color */}
            <div className="flex flex-col">
              <FormLabel title={"Color"} />
              <select
                className="border border-gray-300 bg-gray-100 rounded-md p-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                name="color"
                onChange={handleChange}
                value={formData.color}
              >
                <option value="" disabled>
                  Select Color
                </option>
                {colorCategories &&
                  Array.isArray(colorCategories) &&
                  colorCategories?.map((color) => (
                    <option key={color.id} value={color.id}>
                      {color.color_name}
                    </option>
                  ))}
              </select>
            </div>

            {/* Processes Multi-Select */}
            <div className="flex flex-col relative" ref={processesDropdownRef}>
              <FormLabel title={"Processes"} />
              <div
                className="border border-gray-300 bg-gray-100 rounded-md p-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer flex justify-between items-center"
                onClick={() =>
                  setIsProcessesDropdownOpen(!isProcessesDropdownOpen)
                }
              >
                <div className="flex flex-wrap gap-1">
                  {formData.processes.length === 0 ? (
                    <span className="text-gray-400">Select Processes</span>
                  ) : (
                    formData.processes.map((process, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded"
                      >
                        {process}
                      </span>
                    ))
                  )}
                </div>
                <svg
                  className={`w-4 h-4 transition-transform ${
                    isProcessesDropdownOpen ? "transform rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>

              {/* Dropdown Options */}
              {isProcessesDropdownOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto top-full">
                  {processOptions.map((process, index) => (
                    <div
                      key={index}
                      className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleProcessChange(process)}
                    >
                      <input
                        type="checkbox"
                        id={`process-${index}`}
                        checked={formData.processes.includes(process)}
                        onChange={() => {}}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label
                        htmlFor={`process-${index}`}
                        className="ml-2 block text-sm text-gray-700 cursor-pointer w-full"
                      >
                        {process}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="w-1/2">
            <FormInput
              type={"number"}
              name={"total_price"}
              label={"Total Price"}
              placeholder={0}
              value={formData.total_price}
              onChange={handleChange}
              editable={true}
            />
          </div>

          {/* Selected SFG Info Card */}
          {selectedData && (
            <div className="mt-6 p-4 border border-blue-200 bg-blue-50 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                Selected Semi Finished Good
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col">
                  <span className="text-gray-500 text-sm">Group</span>
                  <span className="font-medium">{selectedData.group_name}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-500 text-sm">
                    Semi Finished Good
                  </span>
                  <span className="font-medium">{selectedData.sfg_name}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-500 text-sm">Unit</span>
                  <span className="font-medium">{selectedData.unit}</span>
                </div>
              </div>
            </div>
          )}

          {/* Selected Processes Summary */}
          {formData.processes.length > 0 && (
            <div className="mt-3">
              <p className="text-sm text-gray-600">
                Selected Processes:
                <span className="font-medium ml-2">
                  {formData.processes.join(", ")}
                </span>
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end pt-4 border-t">
            <button
              type="submit"
              //   ={hanonSubmitdleSubmit}
              disabled={submitting}
              className="px-6 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {submitting ? (
                <div className="flex justify-center items-center space-x-2">
                  <PuffLoader size={20} color="#fff" />
                  <span>Updating...</span>
                </div>
              ) : (
                "Update"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SemiFinishedGoodStock;
