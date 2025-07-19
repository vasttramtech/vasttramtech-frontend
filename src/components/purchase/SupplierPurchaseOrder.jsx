import { useLocation, useNavigate } from "react-router-dom";
import FormLabel from "./FormLabel";
import { useEffect, useState } from "react";
import SelectionTable from "../../smartTable/SelectionTable";
import axios from "axios";
import { BounceLoader, PuffLoader } from "react-spinners";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Plus } from "lucide-react";
import { MdCancel } from "react-icons/md";


const SupplierPurchaseOrder = () => {
  const [selctionHeader, setSelectionHeader] = useState([
    "Group",
    "Item Name",
    "Unit",
    "HSN/SAC Code",
    "Description",
    "Color",
    "Price",
    "Qty",
    "Total"
  ]);

  const [selectionData, setSelectionData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [displayModal, setDisplayModal] = useState(false);
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [selectedRow, setSelectedRow] = useState([]);
  const [setOfSelectedIndex, setSetOfSelectedIndex] = useState(new Set());
  const [finalSelectedRows, setFinalSelectedRows] = useState([]);
  const [supplier, setSupplier] = useState([]);
  const [formData, setFormData] = useState({
    supplier: "",
    date: "",
    remark: "",
    total: "",
    raw_materials: []
  });

  const location = useLocation();
  const title = location.state?.title;

  function handleSelectRawmaterial() {
    const selectedIds = new Set(finalSelectedRows.map((row) => row.id)); // Track selected row IDs

    const selectedIndices = new Set();
    selectionData.forEach((item, index) => {
      if (selectedIds.has(item.id)) {
        selectedIndices.add(index);
      }
    });

    setSetOfSelectedIndex(selectedIndices); // Store updated selection indices
    setSelectedRow(finalSelectedRows);
    setDisplayModal(true);
  }





  function handleSaveSelection() {
    const updatedRows = selectedRow.map((row) => ({
      Group: row.Group,
      "Item Name": row["Item Name"], // Ensure proper case & spacing
      Unit: row.Unit,
      "HSN/SAC Code": row["HSN/SAC Code"], // Fix this key
      Description: row.Description,
      Color: row.Color,
      Price: row.Price || 0,
      Qty: 1,
      Total: row.Price || 0,
    }));

    const uniqueRows = [...finalSelectedRows];

    selectedRow.forEach((row) => {
      if (!uniqueRows.some((existingRow) => existingRow.id === row.id)) {
        uniqueRows.push({
          Group: row.Group,
          "Item Name": row["Item Name"],
          Unit: row.Unit,
          "HSN/SAC Code": row["HSN/SAC Code"],
          Description: row.Description,
          Color: row.Color,
          Price: row.Price || 0,
          Qty: 1,
          Total: row.Price || 0,
          id: row.id, // Ensure each row has a unique id
        });
      }
    });

    setFinalSelectedRows(uniqueRows);
    setDisplayModal(false);
  }

  function handleQtyChange(index, qty) {
    const updatedRows = [...finalSelectedRows];
    updatedRows[index].Qty = qty;
    updatedRows[index].Total = qty * updatedRows[index].Price; // Update total

    setFinalSelectedRows(updatedRows);
  }

  function handlePriceChange(index, price) {
    const updatedRows = [...finalSelectedRows];
    updatedRows[index].Price = price;
    updatedRows[index].Total = price * updatedRows[index].Qty; // Update total based on price change

    setFinalSelectedRows(updatedRows);
  }

  function handleDeleteRow(index) {
    const itemToDelete = finalSelectedRows[index];

    // Remove from finalSelectedRows
    const updatedRows = finalSelectedRows.filter((_, i) => i !== index);
    setFinalSelectedRows(updatedRows);

    // Remove deleted row ID from the selection set
    const updatedSet = new Set(setOfSelectedIndex);
    selectionData.forEach((item, i) => {
      if (item.id === itemToDelete.id) {
        updatedSet.delete(i); // Remove corresponding index
      }
    });

    setSetOfSelectedIndex(updatedRows.length > 0 ? updatedSet : new Set()); // Reset if empty
  }

  const grandTotal = finalSelectedRows.reduce((acc, row) => acc + row.Total, 0);

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      total: grandTotal.toFixed(2),
    }));
  }, [grandTotal]);



  const fetchDropdownData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/raw-material-masters?populate=*`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const response1 = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/supplier-masters?populate=*`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // console.log("response1: ", response1)

      const data = Array.isArray(response.data.data) ? response.data.data : [];
      // console.log("data: ", data);
      const formattedData = data.map((item) => ({
        Group: item.group?.group_name || "N/A",
        "Item Name": item.item_name || "N/A",
        Unit: item.unit?.unit_name || "N/A",
        "HSN/SAC Code": item.hsn_sac_code?.hsn_sac_code || "N/A",
        Description: item.description || "N/A",
        Color: item.color?.color_name || "N/A",
        Price: item?.price_per_unit,
        qty: "",
        total: "",
        id: item.id,
      }));

      setSelectionData(formattedData);
      const supplierData = Array.isArray(response1.data.data)
        ? response1.data.data
        : [];
      setSupplier(supplierData);
    } catch (error) {
      console.error("Error fetching dropdown data:", error);
      if (error.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  console.log("selectionData: ", selectionData);

  useEffect(() => {
    if (token) {
      fetchDropdownData();
    } else {
      navigate("/login");
    }
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const postData = {
      data: {
        supplier: formData.supplier,
        date: formData.date,
        remark: formData.remark,
        total: formData.total,
        raw_materials: finalSelectedRows.map(row => ({
          raw_material_master: row.id,
          price_per_unit: row.Price,
          qty: row.Qty,
          total_price: row.Total,
        }))
      },
      purchase_order_status: "Pending"
    };
    console.log("postData: ", postData);

    try {
      const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/purchase-orders`, postData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Purchase Order Created Successfully", { position: "top-right" });
      setFormData({
        supplier: "",
        date: "",
        remark: "",
        total: "",
        raw_materials: []
      })
      console.log("res: ", res)
      setFinalSelectedRows([]);
      setTimeout(() => {
        navigate(`/purchase-order-list/${res.data.data.documentId}`, {
          state: { purchase_id: res.data.data.id },
        });
      }, 1000);
    } catch (error) {
      console.error("Error creating purchase order:", error);
      toast.error("Error creating purchase order");
    } finally {
      setSubmitting(false);
    }
  };

  const clearHandler = () => {
    setFormData({
      supplier: "",
      date: "",
      remark: "",
      total: "",
      raw_materials: []
    })
    setFinalSelectedRows([]);
    setSelectedRow([]);
    setSetOfSelectedIndex(new Set());
  }

  // console.log("formData: ", formData);
  // console.log("finalSelectedRows", finalSelectedRows);

  return (
    <div className="p-6 bg-white rounded-lg relative">

      <div>
        {/* <h1 className="text-3xl font-bold text-blue-900 mb-4">{title}</h1> */}
        <h1 className="text-2xl font-bold text-blue-900 pb-2 border-b mb-4">Purchase order</h1>

        {/* Selection Modal */}

        {displayModal && (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50">
            <div className="relative w-[90vw] bg-gray-200 border shadow-2xl p-4 rounded-lg">
              {/* Close Button */}

              <div>


                <button
                  className="absolute top-2 right-2 text-red-700 hover:text-red-500 hover:scale-105 duration-200 transition-all ease-in-out text-2xl font-bold"
                  onClick={() => setDisplayModal(false)}
                >
                  <MdCancel className="w-8 h-8" />
                </button>
              </div>

              <h2 className="text-2xl font-bold mb-4 text-center">
                Select Raw Material
              </h2>

              <SelectionTable
                NoOfColumns={selctionHeader.length}
                data={selectionData}
                headers={selctionHeader}
                setSelectedRow={setSelectedRow}
                setOfSelectedIndex={setOfSelectedIndex}
                setSetOfSelectedIndex={setSetOfSelectedIndex}
              />

              {/* Add Button */}
              <div className="flex justify-center items-center mt-4">
                <button
                  type="button"
                  className="bg-blue-900 px-4 py-1 rounded hover:bg-blue-700 duration-200 ease-in-out transition-all  text-white"
                  onClick={handleSaveSelection}
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}


        <form className="grid grid-cols-2 gap-6 p-5 rounded-lg border border-gray-200 shadow-md " onSubmit={handleSubmit}>
          <div className="flex flex-col">
            <FormLabel title={"Supplier"} />
            <select
              className="border border-gray-300 bg-gray-100 rounded-md p-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              name="supplier"
              onChange={handleFormChange}
              value={formData.supplier}
            >
              <option value="" disabled selected>
                Supplier
              </option>
              {supplier.map((supplier, index) => (
                <option key={index} value={supplier?.id}>
                  {supplier?.company_name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col">
            <FormLabel title={"Date"} />
            <input
              type="date"
              className="border border-gray-300 bg-gray-100 rounded-md p-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              name="date"
              onChange={handleFormChange}
              value={formData.date}
            />
          </div>
          <div className="flex flex-col">
            <FormLabel title={"Remarks"} />
            <textarea
              className="border border-gray-300 bg-gray-100 rounded-md p-2 h-40 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              placeholder="Remarks"
              name="remark"
              onChange={handleFormChange}
              value={formData.remark}
            ></textarea>
          </div>
          <div className="col-span-2 flex border border-blue-500 justify-center mt-4 rounded p-2">
            <button
              type="button"
              className="bg-blue-900 flex items-center gap-2 text-white px-4 py-1 rounded hover:bg-blue-700 transition-all duration-200 ease-in-out"
              onClick={handleSelectRawmaterial}
            >
              Choose Raw Material <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Selected Items Table */}
          {finalSelectedRows.length > 0 && (
            <div className="col-span-2 mt-4 border p-2 rounded bg-gray-100">
              <h3 className="text-lg font-bold mb-2">Selected Items</h3>
              <table className="w-full border-collapse border border-gray-400">
                <thead>
                  <tr className="bg-gray-300">
                    {selctionHeader.map((header, index) => (
                      <th key={index} className="border p-2">
                        {header}
                      </th>
                    ))}
                    <th className="border p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {finalSelectedRows.map((row, index) => (
                    <tr key={index} className="text-center bg-white">
                      {selctionHeader.map((header, i) => (
                        <td key={i} className="border p-2">
                          {header === "Price" ? (
                            <input
                              type="number"
                              value={row.Price}
                              min="0"
                              step="any"
                              className="w-16 border p-1 text-center"
                              onChange={(e) => handlePriceChange(index, Number(e.target.value))}
                            />
                          ) : header === "Qty" ? (
                            <input
                              type="number"
                              value={row.Qty}
                              min="1"
                              step="any"
                              className="w-16 border p-1 text-center"
                              onChange={(e) => handleQtyChange(index, Number(e.target.value))}
                            />
                          ) : header === "Total" ? (
                            row.Total.toFixed(2)
                          ) : (
                            row[header] || "N/A"
                          )}
                        </td>
                      ))}

                      <td className="border p-2">
                        <button
                          className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700 transition"
                          onClick={() => handleDeleteRow(index)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="col-span-2 mt-4 flex justify-end">
            <h3 className="text-xl font-bold"
              name="total"
              onChange={handleFormChange}
              value={formData.total}
            >Grand Total: ₹{grandTotal.toFixed(2)}</h3>
          </div>


          <div className="col-span-2 flex justify-end mt-4">
            <button type="button"
              onClick={clearHandler}
              className="bg-gray-200 px-4 py-1 rounded hover:bg-gray-600 hover:text-white transition">
              Clear
            </button>
            <button
              type="submit"
              className={`bg-blue-900 ml-2 px-6 py-2 rounded text-white font-semibold transition-all ease-in-out duration-300 transform ${submitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
                }`}
              disabled={submitting}
            >
              {submitting ? (
                <div className="flex justify-center items-center space-x-2">
                  <PuffLoader size={20} color="#fff" />
                  <span>Saving...</span>
                </div>
              ) : (
                'Save'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SupplierPurchaseOrder;

