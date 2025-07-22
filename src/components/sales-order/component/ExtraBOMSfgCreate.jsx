import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { BounceLoader, PuffLoader } from "react-spinners";
import SmartTable2 from "../../../smartTable/SmartTable2";
import { toast } from "react-toastify";
import { MdCancel } from "react-icons/md";

const SelectSOTable = ({
  NoOfColumns,
  data,
  headers,
  selectedSFG,
  setSelectedSFG,
  onAdd,
}) => {
  const [updatedHeader] = useState([
    "Select",
    ...headers.filter((header) => header !== "Processes"),
    "Processes",
    "Add Qty",
  ]);
  const [tableData, setTableData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (Array.isArray(data)) {
      const filteredData = data.filter((item) =>
        Object.values(item)
          .filter((val) => typeof val === "string" || typeof val === "number")
          .some((val) =>
            val.toString().toLowerCase().includes(searchTerm.toLowerCase())
          )
      );

      const updatedValues = filteredData.map((item) => {
        const { processes, ...itemWithoutProcesses } = item;

        return {
          Select: (
            <input
              type="radio"
              name="sfg-select"
              checked={selectedSFG?.id === item.id}
              onChange={() => setSelectedSFG({ ...item, addQty: 0 })}
              key={item.id}
            />
          ),
          ...itemWithoutProcesses,
          Processes:
            processes?.length > 0 ? (
              <div
                className=" bg-blue-50 rounded px-2 py-1 w-full flex flex-col gap-2"
                defaultValue="placeholder"
              >

                {processes.map((process, index) => (
                  <span key={index} className=" font-semibold text-green-700 border-b border-gray-300">
                    {process}
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-gray-500 italic">No Process</span>
            ),
          "Add Qty": (
            <input
              type="number"
              placeholder="Enter Qty"
              value={
                selectedSFG?.id === item.id ? selectedSFG.addQty || "" : ""
              }
              onChange={(e) => {
                const enteredQty = parseInt(e.target.value) || 0;
                if (enteredQty <= item.AvailableStock) {
                  setSelectedSFG({ ...item, addQty: enteredQty });
                }
              }}
              min="0"
              max={item.AvailableStock}
              disabled={selectedSFG?.id !== item.id}
              className="border rounded px-2 py-1 w-full"
            />
          ),
        };
      });

      setTableData(updatedValues);
    }
  }, [data, selectedSFG, searchTerm]);

  return (
    <div className=" w-full">
      {/* Search & Filter Section */}
      <div className="flex justify-between items-center space-x-4 mb-4 pb-2 border-b border-gray-300">
        <h3 className="text-xl font-bold text-blue-900">Select SFG</h3>
      </div>

      {/* Table Section */}
      <SmartTable2 data={tableData} headers={updatedHeader} />

      <div className="mt-2 text-center">
        <button
          // onClick={onAdd}
          onClick={() => {
            if (!selectedSFG || !selectedSFG.addQty || selectedSFG.addQty <= 0) {
              toast.error("Please enter quantity");
              return;
            }
            onAdd(); // Only call if validation passes
          }}
          className="px-6 py-2 bg-blue-900 hover:bg-blue-700 transition-all ease-in-out duration-200 text-white rounded-full"
        >
          Add
        </button>
      </div>
    </div>
  );
};

const SelectSOTableJobber = ({
  NoOfColumns,
  data,
  headers,
  setSelectJobbers,
  setDisplayModalJobber,
  selectJobbers,
}) => {
  const [updatedHeader] = useState(["Select", ...headers, "Rate", "Note"]);
  const [tableData, setTableData] = useState([]);
  const [selectedJobbers, setSelectedJobbers] = useState([]);

  // Initialize selected jobbers from parent
  useEffect(() => {
    setSelectedJobbers(selectJobbers);
  }, [selectJobbers]);

  useEffect(() => {
    if (Array.isArray(data)) {
      const updatedValues = data.map((item) => {
        const isSelected = selectedJobbers.some(
          (jobber) => jobber.jobberId === item.jobberId
        );
        const selectedJobber =
          selectedJobbers.find((jobber) => jobber.jobberId === item.jobberId) ||
          {};

        return {
          Select: (
            <input
              type="checkbox"
              checked={isSelected}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedJobbers((prev) => {
                    const alreadySelected = prev.find(
                      (jobber) => jobber.jobberId === item.jobberId
                    );
                    if (!alreadySelected) {
                      return [
                        ...prev,
                        {
                          ...item,
                          rate: selectedJobber.rate || "",
                          note: selectedJobber.note || "",
                        },
                      ];
                    }
                    return prev;
                  });
                } else {
                  setSelectedJobbers((prev) =>
                    prev.filter((jobber) => jobber.jobberId !== item.jobberId)
                  );
                }
              }}
            />
          ),
          ...item,
          Rate: (
            <input
              type="number"
              placeholder="Enter Rate"
              value={selectedJobber.rate || ""}
              onChange={(e) => {
                const rate = e.target.value;
                setSelectedJobbers((prev) =>
                  prev.map((jobber) =>
                    jobber.jobberId === item.jobberId
                      ? { ...jobber, rate }
                      : jobber
                  )
                );
              }}
              className="border rounded px-2 py-1 w-full"
              disabled={!isSelected}
            />
          ),
          Note: (
            <input
              type="text"
              placeholder="Enter Note"
              value={selectedJobber.note || ""}
              onChange={(e) => {
                const note = e.target.value;
                setSelectedJobbers((prev) =>
                  prev.map((jobber) =>
                    jobber.jobberId === item.jobberId
                      ? { ...jobber, note }
                      : jobber
                  )
                );
              }}
              className="border rounded px-2 py-1 w-full"
              disabled={!isSelected}
            />
          ),
        };
      });
      setTableData(updatedValues);
    }
  }, [data, selectedJobbers]);

  const handleAddSelectedJobbers = () => {
    // Check if all selected jobbers have a rate
    const hasMissingRate = selectedJobbers.some(
      (jobber) => !jobber.rate || jobber.rate.trim() === ""
    );

    if (hasMissingRate) {
      toast.error("Please enter the jobber Rate for all selected jobbers.");
      return;
    }

    setSelectJobbers(selectedJobbers);
    setDisplayModalJobber(false);
  };

  return (
    <div>
      <SmartTable2 data={tableData} headers={updatedHeader} />
      <div className="mt-4 text-center">
        <button
          onClick={handleAddSelectedJobbers}
          className="px-6 py-2 bg-blue-900 hover:bg-blue-700 transition-all ease-in-out duration-200 text-white rounded-full"
        >
          Add Selected Jobbers
        </button>
      </div>
    </div>
  );
};

const ExtraBOMSfgCreate = ({
  onClose,
  availableStockData,
  so_id,
  type,
  setSOViewModal,
  setSalesOrder,
  setBom,
  setSelectSOModal,
  company,
  setFormData,
  setAllSemiFinishedGoods,
  setAllSavedSemiFinishedGoods,
  setsfglist,
  fetchSFGStock,
  setOfNewlyAddedStockSfg,
  setSetOfNewlyAddedStockSfg,
  allSemiFinishedGoods,
  SalessorderQty
}) => {
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [allSFGStock, setAllSFGStock] = useState([]);
  const [allSFGStockData, setAllSFGStockData] = useState([]);
  const [selectedSFG, setSelectedSFG] = useState(null);
  const [finalselectedSFG, setFinalselectedSFG] = useState(null);
  const [displayModalSfg, setDisplayModalSfg] = useState(false);
  const [displayModalJobber, setDisplayModalJobber] = useState(false);
  const [jobber, setJobber] = useState([]);
  const headersForTable = [
    "id",
    "Group",
    "Item Name",
    "Color",
    "AvailableStock",
    "Processes",
    "Price per Unit",
  ];
  const headersForTableJobber = [
    "JobberId",
    "Jobber Name",
    "Work Type",
    "Jobber GSTIN",
  ];
  const [selectJobbers, setSelectJobbers] = useState([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const [response1, response2] = await Promise.all([
        axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/custom/getAllStockSfg`,
          { headers }
        ),
        axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/jobber-masters?populate=*`,
          { headers }
        ),
      ]);

      console.log("response1.data.data: ", response1.data.data);
      console.log("response2.data.data: ", response2.data.data);

      const data = Array.isArray(response1.data.data)
        ? response1.data.data
        : [];
      const formattedData = data.map((item) => ({
        id: item.id,
        Group: item.semi_finished_goods_master?.group?.group_name || "N/A",
        "Item Name":
          item?.semi_finished_goods_master?.semi_finished_goods_name || "N/A",
        Color: item?.color?.color_name || "N/A",
        AvailableStock: item?.qty,
        processes: item?.processes.map((item) => item?.processes),
        price_per_unit: item?.price_per_unit,
      }));

      console.log("formattedData: ", formattedData);
      setAllSFGStock(formattedData);
      setAllSFGStockData(data);
      const jobbers = Array.isArray(response2.data.data)
        ? response2.data.data
        : [];
      const formattedJobberData = jobbers.map((jobber) => ({
        jobberId: jobber?.id,
        JobberName: jobber?.jobber_name,
        workType: jobber?.work_type,
        gstin: jobber?.jobber_gstin,
      }));
      setJobber(formattedJobberData);
      setDisplayModalSfg(true);
    } catch (error) {
      console.error("Error fetching jobber data:", error);
      if (error.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedSFG && selectedSFG.id) {
      const matchedSFG = allSFGStockData.find(
        (sfg) => sfg.id === selectedSFG.id
      );
      if (matchedSFG) {
        setFinalselectedSFG(matchedSFG);
      }
    }
  }, [selectedSFG, allSFGStockData]);

  // console.log("selectJobber:", selectJobbers);
  // console.log("selectedSFG:", selectedSFG);
  // console.log("allSFGStockData:", allSFGStockData);
  // console.log("finalselectedSFG:", finalselectedSFG);
  // console.log("so_id:", so_id);
  // console.log("type: ", type);

  const handleAddSelectedSFG = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    if (finalselectedSFG === null) {
      toast.error("Please select the Semi finished goods and enter the qty.");
      setSubmitting(false);
      return;
    }
    if (selectJobbers.length === 0) {
      toast.error("Please select the jobber.");
      setSubmitting(false);
      return;
    }
    const api_point =
      type === "internal-sales-order-entries"
        ? "internal-sales-order-entries"
        : "sales-order-entry";

    const jobberCost = selectJobbers.reduce(
      (total, jobber) => Number(Number(total) + Number(jobber.rate)),
      0
    );
    const sz = allSemiFinishedGoods?.length;

    const postData = {
      data: {
        extra_bomSfg_fromStock: [
          {
            semi_finished_goods: finalselectedSFG.semi_finished_goods_master.id,
            color: finalselectedSFG.color.id,
            qty: selectedSFG.addQty,
            total_price: Number(
              Number(selectedSFG.addQty * finalselectedSFG.price_per_unit) +
              Number(jobberCost)
            ),
            jobber_master_sfg:
              selectJobbers.length > 0
                ? selectJobbers.map((jobber) => ({
                  jobber_master: jobber.jobberId,
                  jobber_rate: jobber.rate,
                  jobber_description: jobber.note,
                  jobber_work_type: jobber.workType,
                  completed: "Incomplete",
                }))
                : [],
            stock_status: true,
            fromStock: true,
            bom_status:
              selectJobbers.length > 0 ? "in_process" : "readyToStitch",
            processes: selectedSFG.processes.map((process) => ({
              process: process,
              jobber: null,
            })),
          },
        ],
      },
    };

    const data = {
      data: {
        id: finalselectedSFG.id,
        redact_qty: (selectedSFG.addQty) * (SalessorderQty),
      },
    };

    console.log("postData: ", postData);
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/custom/redact-stock-sfg`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const transformedData = {
        semi_finished_goods:
          finalselectedSFG?.semi_finished_goods_master
            ?.semi_finished_goods_name || "",
        qty: Number(selectedSFG.addQty),
        total_price: Number(
          Number(selectedSFG.addQty * finalselectedSFG.price_per_unit) +
          Number(jobberCost)
        ),
        sfg_description: "",
        raw_material_bom: [],
        jobber_master_sfg: selectJobbers.map((jobber) => ({
          jobber_master: jobber?.JobberName || "",
          jobber_rate: jobber.rate || 0,
          jobber_work_type: jobber.workType || "",
          jobber_description: jobber.note || "",
          jobber_id: jobber.jobberId || "",
          jobber_address: jobber.jobber_master?.jobber_address || "",
        })),
        color: finalselectedSFG.color,
        fromStock: true,
        sfg_stock_id: finalselectedSFG.id,
      };

      const extra_bomSfg_fromStock_added = postData.data.extra_bomSfg_fromStock.map((item) => ({
        ...item,
        raw_material_bom: [],
      }));

      console.log("extra_bomSfg_fromStock: ", postData.data.extra_bomSfg_fromStock);
      console.log("allSemiFinishedGoods: ", allSemiFinishedGoods);

      setAllSemiFinishedGoods((prev) => [
        ...prev,
        ...extra_bomSfg_fromStock_added,
      ]);

      setsfglist((prev) => [
        ...prev,
        finalselectedSFG?.semi_finished_goods_master,
      ]);
      setAllSavedSemiFinishedGoods((prev) => [...prev, transformedData]);

      toast.success("Extra Bom from stock updated successfully", {
        position: "top-right",
      });
      if (fetchSFGStock) await fetchSFGStock();
      const set = new Set(setOfNewlyAddedStockSfg);
      set.add(sz)
      setSetOfNewlyAddedStockSfg(set);
    } catch (error) {
      console.error("Error posting bill of sales:", error);
      toast.error(
        error?.response?.data?.error?.message || "Something went wrong!"
      );
    } finally {
      setSubmitting(false);
      onClose();
    }
  };

  return (
    <div className="">
      {loading ? (
        <div className="absolute inset-0 flex justify-center items-center bg-opacity-70 bg-white z-10 rounded-2xl">
          <BounceLoader size={80} color="#1e3a8a" loading={loading} />
        </div>
      ) : (
        <div className="fixed animate-fade-in inset-0 z-40 flex items-center justify-center max-h-screen bg-opacity-50 backdrop-blur-md overflow-y-auto bg-gray-900">
          <div className=" rounded-2xl shadow-2xl bg-white max-w-4xl w-full p-8 relative h-4/5 overflow-y-auto animate-slide-in">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute right-10 text-red-500 hover:text-red-700 transition-all duration-200"
            >
              <MdCancel className="w-8 h-8" />
            </button>

            <h2 className="text-2xl font-bold text-blue-900 mb-4 border-b pb-2">
              Add SFG from Stock
            </h2>

            {/* Table visibility toggling */}
            {displayModalSfg && (
              <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50 animate-fade-in">
                <div className="relative w-[90vw] bg-gray-200 border shadow-2xl p-4 rounded-lg">
                  <button
                    className="absolute top-2 right-2 text-red-700 hover:text-red-500 hover:scale-105 transition-all ease-in-out  text-2xl font-bold"
                    onClick={() => setDisplayModalSfg(false)}
                  >
                    <MdCancel className="w-8 h-8" />
                  </button>

                  <SelectSOTable
                    NoOfColumns={headersForTable.length}
                    data={allSFGStock}
                    headers={headersForTable}
                    selectedSFG={selectedSFG}
                    setSelectedSFG={setSelectedSFG}
                    onAdd={() => {
                      if (selectedSFG && selectedSFG.addQty > 0) {
                        setDisplayModalSfg(false); // Close table when "Add" is clicked
                      } else {
                        alert(
                          "Please select an SFG and enter a valid Add Qty."
                        );
                      }
                    }}
                  />
                </div>
              </div>
            )}

            {/* Show "Choose SFG" button only if no SFG is selected */}
            {!selectedSFG ? (
              <div className="space-y-6">
                <div className="flex items-center justify-center p-6">
                  <button
                    className="px-6 py-3 rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold shadow-lg hover:from-indigo-700 hover:to-blue-700 transition duration-300"
                    onClick={() => setDisplayModalSfg(true)}
                  >
                    Choose SFG
                  </button>
                </div>
              </div>
            ) : (
              // Display selected SFG details here
              <div className="space-y-2 mt-2">
                <h3 className=" font-semibold text-gray-800">
                  Selected SFG:
                </h3>
                <div className="overflow-x-auto bg-white shadow-xl rounded-2xl ring-1 ring-gray-200">
                  <table className="min-w-full table-auto rounded-2xl">
                    <thead>
                      <tr className="bg-blue-100 text-gray-900 text-base font-bold ">
                        <th className="px-6 py-4 text-left rounded-tl-2xl">Item Name</th>
                        <th className="px-6 py-4 text-left">Color</th>
                        <th className="px-6 py-4 text-left">Available Stock</th>
                        <th className="px-6 py-4 text-left">Quantity</th>
                        <th className="px-6 py-4 text-left rounded-tr-2xl">Processes</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t border-gray-100 hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-6 py-4 text-gray-800 font-medium">
                          {selectedSFG["Item Name"]}
                        </td>
                        <td className="px-6 py-4 text-gray-700">
                          {selectedSFG.Color}
                        </td>
                        <td className="px-6 py-4 text-gray-700 font-semibold">
                          {selectedSFG.AvailableStock}
                        </td>
                        <td className="px-6 py-4 text-gray-700 font-semibold">
                          {selectedSFG.addQty}
                        </td>
                        <td className="px-6 py-4 text-gray-800">
                          <div className="flex flex-wrap gap-2">
                            {selectedSFG.processes.map((process, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-semibold shadow-sm border border-green-200"
                              >
                                {process}
                              </span>
                            ))}
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

              </div>
            )}

            <div className="space-y-6">
              <div className="flex items-center justify-center p-6">
                <button
                  className="px-6 py-3 rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold shadow-lg hover:from-indigo-700 hover:to-blue-700 transition duration-300"
                  onClick={() => setDisplayModalJobber(true)}
                >
                  Select Jobber
                </button>
              </div>
            </div>

            {displayModalJobber && (
              <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-60">
                <div className="relative w-[90vw] bg-gray-200 border shadow-2xl p-4 rounded-lg">
                  <button
                    className="absolute right-5 text-red-700 hover:text-red-500 hover:scale-105 transition-all ease-in-out  text-2xl font-bold"
                    onClick={() => setDisplayModalJobber(false)}
                  >
                    <MdCancel className="w-8 h-8" />
                  </button>

                  <h2 className="text-xl text-blue-900 pb-2 border-b border-gray-300 font-bold mb-4">
                    Select Jobbers
                  </h2>
                  <SelectSOTableJobber
                    NoOfColumns={headersForTableJobber.length}
                    data={jobber}
                    headers={headersForTableJobber}
                    setSelectJobbers={setSelectJobbers}
                    setDisplayModalJobber={setDisplayModalJobber}
                    selectJobbers={selectJobbers}
                  />
                </div>
              </div>
            )}

            {selectJobbers.length > 0 && (
              <div className="overflow-auto">
                <h2 className="font-semibold mb-4 text-gray-800">Selected Jobbers:</h2>
                <div className="overflow-x-auto my-4 bg-white shadow-lg rounded-2xl ring-1 ring-gray-200">
                  <div className="max-h-72 overflow-y-auto"> {/* Adjust max-h as needed */}
                    <table className="min-w-full">
                      <thead className="sticky top-0 bg-blue-100">
                        <tr className="text-gray-900 font-bold">
                          <th className="border-b py-2 px-4">Jobber Name</th>
                          <th className="border-b py-2 px-4">Work Type</th>
                          <th className="border-b py-2 px-4">GSTIN</th>
                          <th className="border-b py-2 px-4">Rate</th>
                          <th className="border-b py-2 px-4">Note</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectJobbers.map((jobber, index) => (
                          <tr key={jobber.jobberId} className="hover:bg-gray-200">
                            <td className="border-b py-2 px-4">{jobber.JobberName}</td>
                            <td className="border-b py-2 px-4">{jobber.workType}</td>
                            <td className="border-b py-2 px-4">{jobber.gstin}</td>
                            <td className="border-b py-2 px-4">{jobber.rate}</td>
                            <td className="border-b py-2 px-4">{jobber.note}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

            )}

            <div className="mt-8 flex justify-end gap-4">
              <button
                onClick={onClose}
                className="px-6 py-2 rounded-lg font-semibold bg-gray-300 text-gray-700 hover:bg-gray-400 transition duration-200"
              >
                Cancel
              </button>
              {/* <button
                                onClick={handleAddSelectedSFG}
                                className="px-6 py-2 rounded-lg font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition duration-200"
                            >
                                Add Selected SFG
                            </button> */}
              <button
                className={`p-3  text-white font-semibold bg-green-500 rounded-md transition-all duration-200 ease-in-out  ${submitting
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-green-600 hover:scale-105"
                  }`}
                disabled={submitting}
                onClick={handleAddSelectedSFG}
              >
                {submitting ? (
                  <div className="flex justify-center items-center gap-2">
                    <PuffLoader size={20} color="#fff" />
                    <span className="">Adding Selected SFG...</span>
                  </div>
                ) : (
                  "Add Selected SFG"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExtraBOMSfgCreate;
