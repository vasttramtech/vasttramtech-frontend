import { useLocation, useNavigate } from "react-router-dom";
import FormLabel from "./FormLabel";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { PuffLoader, BounceLoader } from "react-spinners";
import { toast } from "react-toastify";
import { checkFileSize } from "../utility/ImgCheck";

const StockIn = () => {
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const [selectedRow, setSelectedRow] = useState([]);
  const [setOfSelectedIndex, setSetOfSelectedIndex] = useState(new Set());
  
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [selectedPO, setSelectedPO] = useState(null);
  
  const [rowMaterials, setRawMaterials] = useState([]);
  // const [selectedRows, setSelectedRows] = useState([]);
  
  const [freight, setFreight] = useState(0);
  const [otherCharges, setOtherCharges] = useState(0);
  const [totalBillAmount, setTotalBillAmount] = useState(0);
  const [selectedImages, setSelectedImages] = useState({
    img_upload: null,
    final_img_upload: null,
    cost_sheet: null
  });
  const [previewImages, setPreviewImages] = useState({
    img_upload: null,
    final_img_upload: null,
    cost_sheet: null
  });

  const [formData, setFormData] = useState({
    date: "",
    challan_no: "",
    challan_date: "",
    invoice_no: "",
    invoice_date: "",
    remark: "",
    isModified: false,
  });

  const fetchPurchaseOrderList = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/custom-purchase-order-by-status`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPurchaseOrders(Array.isArray(response.data) ? response.data : []);
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
    if (token) {
      fetchPurchaseOrderList();
    } else {
      navigate("/login");
    }
  }, [token, navigate]);

  console.log("Purchse Orders: ", selectedPO);

  useEffect(() => {
    if (selectedPO) {
      const po = purchaseOrders.find((order) => order.id === Number(selectedPO));

      if (po) {
        setFormData((prevData) => ({
          ...prevData,
          date: po.date,
        }));
      }

      // Fetch already received quantities for the selected PO
      const fetchReceivedQuantities = async () => {
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/api/stock-ins/already-received/${selectedPO}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          console.log("API Response:", response); // Debugging

          // Extract the actual data array from the response
          const receivedData = response.data?.data || [];

          console.log("Extracted receivedData:", receivedData); // Debugging

          const rawmaterial = po?.raw_materials?.map((material) => {
            const receivedEntry = receivedData.find(
              (entry) => entry.raw_material_id === material?.raw_material_master?.id
            );

            return {
              raw_material_master: material?.raw_material_master?.id,
              rm_name: material?.raw_material_master?.item_name,
              description: material?.raw_material_master?.description,
              hsnCode: material?.raw_material_master?.hsn_sac_code?.hsn_sac_code,
              color: material?.raw_material_master?.color?.color_name,
              rate: material?.price_per_unit,
              requiredQty: material?.qty,
              alreadyReceived: receivedEntry ? receivedEntry.total_received_qty : 0, // Set received quantity dynamically
              receiveQty: 0,
              extraQty: 0,
              amount: 0,
              cgst: 0,
              sgst: 0,
              igst: 0,
              total: 0
            };
          });

          setRawMaterials(rawmaterial);
        } catch (error) {
          console.error("Error fetching received quantities:", error);
        }
      };

      fetchReceivedQuantities();
    }
  }, [selectedPO, purchaseOrders]);


  console.log("Raw Materials: ", rowMaterials)

  // const handleInputChange = (index, field, value) => {
  //   setRawMaterials((prev) =>
  //     prev.map((row, i) =>
  //       i === index
  //         ? {
  //           ...row,
  //           [field]: field === "receiveQty"
  //             ? Math.min(value, row.requiredQty - row.alreadyReceived) // Enforce limit
  //             : value,
  //         }
  //         : row
  //     )
  //   );
  // };

  const handleInputChange = (index, field, value) => {
    setRawMaterials(prev => {
      const newMaterials = [...prev];
      newMaterials[index] = { 
        ...newMaterials[index],
        [field]: value,
        isModified: true // Mark as modified
      };
      
      // Recalculate amounts if needed
      if (['receiveQty', 'extraQty', 'cgst', 'sgst', 'igst'].includes(field)) {
        const baseAmount = (Number(newMaterials[index].receiveQty) + Number(newMaterials[index].extraQty)) * newMaterials[index].rate;
        const taxAmount = ((Number(newMaterials[index].cgst) + Number(newMaterials[index].sgst) + Number(newMaterials[index].igst)) / 100 * baseAmount);
        
        newMaterials[index].amount = baseAmount.toFixed(2);
        newMaterials[index].total = (baseAmount + taxAmount).toFixed(2);
      }
      
      return newMaterials;
    });
  };

  const getModifiedRows = () => {
    return rowMaterials.filter(row => 
      row.isModified && 
      (row.receiveQty > 0 || row.extraQty > 0) // Only include rows with actual quantities
    );
  };

  // const handleCheckboxChange = (index) => {
  //   setSelectedRows((prev) => {
  //     const existing = prev.find((r) => r.raw_material_master === rowMaterials[index].raw_material_master);

  //     // Calculate baseAmount and totalAmount before updating selectedRows
  //     const row = rowMaterials[index];
  //     const baseAmount = (row.receiveQty + row.extraQty) * row.rate;
  //     const taxAmount = ((row.cgst + row.sgst + row.igst) / 100) * baseAmount;
  //     const totalAmount = baseAmount + taxAmount;

  //     const updatedRow = {
  //       ...row,
  //       amount: baseAmount.toFixed(2), // Ensure amount is stored
  //       total: totalAmount.toFixed(2), // Ensure total is stored
  //     };

  //     let updatedSelectedRows;
  //     if (existing) {
  //       updatedSelectedRows = prev.filter((r) => r.raw_material_master !== row.raw_material_master);
  //     } else {
  //       updatedSelectedRows = [...prev, updatedRow];
  //     }

  //     // Calculate the new total bill amount
  //     const newTotalAmount =
  //       updatedSelectedRows.reduce((sum, row) => sum + Number(row.total), 0) + Number(freight) + Number(otherCharges);

  //     setTotalBillAmount(newTotalAmount.toFixed(2)); // Update total bill amount
  //     return updatedSelectedRows;
  //   });
  // };

  // useEffect(() => {
  //   const newTotalAmount =
  //     selectedRows.reduce((sum, row) => sum + Number(row.total), 0) + Number(freight) + Number(otherCharges);
  //   setTotalBillAmount(newTotalAmount.toFixed(2));
  // }, [freight, otherCharges, selectedRows]);

  // console.log("selected row: ", selectedRows);


  const handleInputChangeCompay = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { name } = e.target;
    const file = e.target.files[0];

    //  check file size have two  params ( file, size ) by default it is 1024
    if (file && checkFileSize(file, 1024 * 1024)) {
      setSelectedImages((prevImages) => ({
        ...prevImages,
        [name]: file, // Store the file object
      }));

      setPreviewImages((prevPreviews) => ({
        ...prevPreviews,
        [name]: URL.createObjectURL(file),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    // if (selectedRows.length <= 0) {
    //   toast.error("Please select the row of raw materials.");
    //   setSubmitting(false);
    //   return;
    // }
    const modifiedRows = getModifiedRows();
    if (modifiedRows.length <= 0) {
      toast.error("Please select the row of raw materials.");
      setSubmitting(false);
      return;
    }

    const checkExtraQty = modifiedRows.some((material) => {
      const requiredQty = Number(material.requiredQty);
      const alreadyReceived = Number(material.alreadyReceived);
      const receiveQty = Number(material.receiveQty);
      const extraQty = Number(material.extraQty);
    
      // Condition: Extra quantity is added before receiving the full required quantity
      const isInvalidExtraQty = extraQty > 0 && (alreadyReceived + receiveQty !== requiredQty);
    
      console.log(`Checking Material:`, material);
      console.log(
        `Condition: ${requiredQty} === ${alreadyReceived} + ${receiveQty} && extraQty: ${extraQty}`
      );
    
      return isInvalidExtraQty; // Return true if validation fails
    });
    
    console.log("checkExtraQty: ", checkExtraQty);
    
    if (checkExtraQty) {
      alert("You can only add Extra Qty after receiving all required quantity.");
      setSubmitting(false);
      return;
    }
    

    let uploadedImageIds = {}; // Object to store uploaded image IDs

    try {
      // Upload each image separately

      try{
      for (const key of Object.keys(selectedImages)) {
        if (selectedImages[key]) {
          const formDataUpload = new FormData();
          formDataUpload.append("files", selectedImages[key]);

          console.log(formDataUpload);

          const uploadResponse = await axios.post(
            `${process.env.REACT_APP_BACKEND_URL}/api/upload`,
            formDataUpload,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
              },
            }
          );
          console.log(uploadResponse.data);

          if (
            uploadResponse.data &&
            Array.isArray(uploadResponse.data) &&
            uploadResponse.data.length > 0
          ) {
            uploadedImageIds[key] = uploadResponse.data[0].id; // Save image URL
          }
        }
      }
    } catch(error){
      toast.error("Image upload failed");
      console.log(error);
      setSubmitting(false);
      return;
    }

      // Now send the main form data with image URLs
      const postData = {
        data: {
          purchase_order: selectedPO,
          date: formData.date,
          challan_no: formData.challan_no,
          challan_date: formData.challan_date,
          invoice_no: formData.invoice_no,
          invoice_date: formData.invoice_date,
          // upload_challan: uploadedImageUrls.final_img_upload || "",
          // upload_invoice: uploadedImageUrls.img_upload || "",
          upload_challan: uploadedImageIds.final_img_upload || null,  // Ensure it's an ID
          upload_invoice: uploadedImageIds.img_upload || null,  // Ensure it's an ID
          remark: formData.remark,
          RM_receive_deatils: modifiedRows.map((row) => (
            {
              raw_material_master: row.raw_material_master,
              required_qty: row.requiredQty,
              already_received: row.alreadyReceived,
              receive_qty: row.receiveQty,
              extra_qty: row.extraQty,
              amount: row.amount,
              cgst: row.cgst,
              sgst: row.sgst,
              igst: row.igst,
              Total_price: row.total

            }
          )),
          freight: freight,
          other_charges: otherCharges,
          Total_Bill_Amount: totalBillAmount
        },
      };

      console.log("postData stock in:", postData);
      const updateStockData = {
        data: {
          raw_material_master: modifiedRows.map((row) => (
            {
              raw_material_master: row.raw_material_master,
              Total_Qty: row.receiveQty + row.extraQty,

            }))
        }
      }
      console.log("postData:", postData);
      console.log("updateStockData:", updateStockData);

      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/stock-ins`,
        postData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Raw Material Stock In Successfully Done.", { position: "top-right" });

      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/custom/update-stock`,
        updateStockData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Raw Material Added In Stock Successfully.", { position: "top-right" });

      // const isValid = rowMaterials.every((material) => {
      //   const selectedRow = selectedRows.find(row => row.raw_material_master === material.raw_material_master);
        
      //   if (selectedRow) {
      //     // If present in selectedRows, check if alreadyReceived + receiveQty == requiredQty
      //     return (selectedRow.alreadyReceived + selectedRow.receiveQty === selectedRow.requiredQty && material.alreadyReceived === material.requiredQty);
      //   } else {
      //     // If not present in selectedRows, check if alreadyReceived == requiredQty
      //     return material.alreadyReceived === material.requiredQty;
      //   }
      // });

      const isValid = rowMaterials.every((material) => {
        const selectedRow = modifiedRows.find(row => row.raw_material_master === material.raw_material_master);
      
        if (selectedRow) {
          // If the raw material is in selectedRows, check alreadyReceived + receiveQty === requiredQty
          return selectedRow.alreadyReceived + selectedRow.receiveQty === selectedRow.requiredQty;
        } else {
          // If the raw material is NOT in selectedRows, check alreadyReceived === requiredQty
          return material.alreadyReceived === material.requiredQty;
        }
      });

      if (isValid){
        await axios.put(
          `${process.env.REACT_APP_BACKEND_URL}/api/order-status-update/${selectedPO}/complete`,
          postData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success("PO Fully received.")
      }else{
        await axios.put(
          `${process.env.REACT_APP_BACKEND_URL}/api/order-status-partial/${selectedPO}/partial`,
          postData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success("PO Partially received.")
      }

      // Reset form state
      setFormData({
        date: "",
        challan_no: "",
        challan_date: "",
        invoice_no: "",
        invoice_date: "",
        remark: "",
      });
      setSelectedImages({ img_upload: null, final_img_upload: null, cost_sheet: null });
      setPreviewImages({ img_upload: null, final_img_upload: null, cost_sheet: null });
      setSelectedPO(null);
      // setSelectedRows([]);
      setRawMaterials([]);
      setFreight(0);
      setOtherCharges(0);
      setTotalBillAmount(0);
      fetchPurchaseOrderList();
      setTimeout(() => {
        navigate(`/stock-in-view/${res.data.data.id}`);
      }, 1000)
    } catch (error) {

      console.error("Error In adding raw material:", error);
      
      // Delete uploaded images in case of failure
      if (uploadedImageIds && Object.keys(uploadedImageIds).length > 0) {
        for (const key in uploadedImageIds) {
          const imageId = uploadedImageIds[key];
          try {
            await axios.delete(
              `${process.env.REACT_APP_BACKEND_URL}/api/upload/files/${imageId}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            console.log(`Deleted image with ID: ${imageId}`);
          } catch (deleteError) {
            console.error(`Failed to delete image with ID: ${imageId}`, deleteError);
          }
        }
      }

      
      toast.error(error?.response?.data?.error?.message);
    } finally {
      setSubmitting(false); // Stop the spinner
    }
  };

  useEffect(() => {
    const modifiedRows = rowMaterials.filter(row => row.isModified);
    const newTotalAmount = modifiedRows.reduce((sum, row) => sum + Number(row.total || 0), 0) + 
                          Number(freight || 0) + 
                          Number(otherCharges || 0);
    setTotalBillAmount(newTotalAmount.toFixed(2));
  }, [rowMaterials, freight, otherCharges]);


  const location = useLocation();
  const title = location.state?.title;


  const clearHandler = (e) => {
    e.preventDefault();
    setFormData({
      date: "",
      challan_no: "",
      challan_date: "",
      invoice_no: "",
      invoice_date: "",
      remark: "",
    });
    setSelectedImages({ img_upload: null, final_img_upload: null, cost_sheet: null });
    setPreviewImages({ img_upload: null, final_img_upload: null, cost_sheet: null });
    setSelectedPO(null);
    // setSelectedRows([]);
    setRawMaterials([]);
    setFreight(0);
    setOtherCharges(0);
    setTotalBillAmount(0);
  }



  return (
    <div className="py-2 bg-white rounded-lg relative">
      {loading ? (
        <div className="absolute inset-0 flex justify-center items-center mt-64 bg-opacity-50 bg-gray-200 z-10">
          <BounceLoader size={100} color={"#1e3a8a"} loading={loading} />
        </div>
      ) : (
        <div>
          <h1 className="text-3xl font-bold text-blue-900 mb-4">{title}</h1>


          <form className="grid grid-cols-2 gap-6 p-5 rounded-lg border border-gray-200 shadow-md mb-16" onSubmit={handleSubmit}>
            <div className="flex flex-col">
              <FormLabel title={"Select Purchase Order"} />
              <select
                className="border border-gray-300 bg-gray-100 rounded-md p-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setSelectedPO(e.target.value)}
              >
                <option value="" disabled selected>
                  PO ID - Company Name
                </option>
                {purchaseOrders.map((order, index) => (
                  <option key={index} value={order?.id}>
                    {`${order?.id} - ${order?.supplier?.company_name}`}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col">
              <FormLabel title={"Date"} />
              <input
                type="date"
                className="bg-gray-100 border broder-gray-300 broder-gray-100 rounded-md p-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                readOnly
                name="date"
                value={formData.date}
                onChange={handleInputChangeCompay}
              />
            </div>

            <div className="flex flex-col">
              <label className="text-gray-700 font-semibold">Challan No</label>
              <input
                type="text"
                className="border border-gray-300 bg-gray-100 rounded-md p-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Challan No"
                name="challan_no"
                value={formData.challan_no}
                onChange={handleInputChangeCompay}
              />
            </div>

            <div className="flex flex-col">
              <FormLabel title={"Challan Date"} />
              <input
                type="date"
                className="bg-gray-100 border broder-gray-300 broder-gray-100 rounded-md p-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                name="challan_date"
                value={formData.challan_date}
                onChange={handleInputChangeCompay}
              />
            </div>

            <div className="flex flex-col">
              <label className="text-gray-700 font-semibold">Invoice No</label>
              <input
                type="text"
                className="border border-gray-300 bg-gray-100 rounded-md p-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Invoice No"
                name="invoice_no"
                value={formData.invoice_no}
                onChange={handleInputChangeCompay}
              />
            </div>

            <div className="flex flex-col">
              <FormLabel title={"Invoice Date"} />
              <input
                type="date"
                className="bg-gray-100 border broder-gray-300 broder-gray-100 rounded-md p-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                name="invoice_date"
                value={formData.invoice_date}
                onChange={handleInputChangeCompay}
              />
            </div>

            <div className="flex flex-row gap-8">
              {/* Upload Challan */}

              <div className="flex flex-col">
                <label className="text-gray-700 font-semibold mb-2">Upload Challan</label>
                <div className="relative">
                  <input
                    type="file"
                    id="upload_challan"
                    className="hidden"
                    name="final_img_upload"
                    onChange={handleFileChange}
                  />
                  <label htmlFor="upload_challan" className="bg-blue-500 text-white px-4 py-1 rounded-xl cursor-pointer">
                    Choose File
                  </label>
                  <span className="text-gray-500 ml-2">
                    {selectedImages.final_img_upload ? selectedImages.final_img_upload.name : "No file chosen"}
                  </span>
                </div>
                {previewImages.final_img_upload && (
                  <img src={previewImages.final_img_upload} alt="Preview" className="mt-2 w-32 h-auto" />
                )}
              </div>

              {/* Upload Invoice */}
              <div className="flex flex-col">
                <label className="text-gray-700 font-semibold mb-2">Upload Invoice</label>
                <div className="relative">
                  <input
                    type="file"
                    id="upload_invoice"
                    className="hidden"
                    name="img_upload"
                    onChange={handleFileChange}
                  />
                  <label htmlFor="upload_invoice" className="bg-blue-500 text-white px-4 py-1 rounded-xl cursor-pointer">
                    Choose File
                  </label>
                  <span className="text-gray-500 ml-2">
                    {selectedImages.img_upload ? selectedImages.img_upload.name : "No file chosen"}
                  </span>
                </div>
                {previewImages.img_upload && (
                  <img src={previewImages.img_upload} alt="Preview" className="mt-2 w-32 h-auto" />
                )}
              </div>
            </div>


            <div className="flex flex-col">
              <FormLabel title={"Remarks"} />
              <textarea
                className="border border-gray-300 bg-gray-100 rounded-md p-2 h-40 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                placeholder="Remarks"
                name="remark"
                value={formData.remark}
                onChange={handleInputChangeCompay}
              ></textarea>
            </div>

            {/* Dynamic Table */}
            {rowMaterials.length > 0 && (
              <div className="col-span-2">
                <h2 className="text-lg font-semibold text-gray-800 mb-3">Raw Material Details</h2>
                <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
                  <table className="w-full border-collapse border border-gray-300 rounded-lg">
                    <thead className="bg-gray-200 text-gray-700 text-sm uppercase">
                      <tr>
                        {["RM Id", "RM Name", "Description", "HSN Code", "Color", "Rate", "Required Qty", "Already Received Qty", "Receive Qty", "Extra Qty", "Amount", "CGST %", "SGST %", "IGST %", "Total"].map((header) => (
                          <th key={header} className="border border-gray-300 p-3 text-left">{header}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {rowMaterials.map((row, index) => {
                        const baseAmount = (row.receiveQty + row.extraQty) * row.rate;
                        const taxAmount = ((row.cgst + row.sgst + row.igst) / 100) * baseAmount;
                        const totalAmount = baseAmount + taxAmount;

                        return (
                          <tr key={index} className="even:bg-gray-100 hover:bg-gray-50 transition">
                            <td className="border border-gray-300 p-3 text-center">{row.raw_material_master}</td>
                            <td className="border border-gray-300 p-3 text-center">{row.rm_name}</td>
                            <td className="border border-gray-300 p-3 text-center">{row.description}</td>
                            <td className="border border-gray-300 p-3 text-center">{row.hsnCode}</td>
                            <td className="border border-gray-300 p-3 text-center">{row.color}</td>
                            <td className="border border-gray-300 p-3 text-center">{row.rate}</td>
                            <td className="border border-gray-300 p-3 text-center">{row.requiredQty}</td>
                            <td className="border border-gray-300 p-3 text-center">{row.alreadyReceived}</td>

                            <td className="border border-gray-300 px-2 py-3 text-center">
                              <input
                                type="number"
                                className="w-16 px-2 py-1 border rounded-md text-center focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                value={row.receiveQty}
                                max={row.requiredQty - row.alreadyReceived}
                                min={0}
                                step="any"
                                onChange={(e) => {
                                  const value = Number(e.target.value);
                                  const min = 0;
                                  const max = row.requiredQty - row.alreadyReceived;

                                  const clampedValue = Math.max(min, Math.min(max, value));

                                  handleInputChange(index, "receiveQty", clampedValue);
                                }}

                              />
                            </td>

                            <td className="border border-gray-300 px-2 py-3 text-center">
                              <input
                                type="number"
                                min={0}
                                step="any"
                                className="w-16 px-2 py-1 border rounded-md text-center focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                value={row.extraQty}
                                onChange={(e) => handleInputChange(index, "extraQty", Number(e.target.value))}
                                disabled={row.receiveQty !== row.requiredQty - row.alreadyReceived}
                              />
                            </td>

                            <td className="border border-gray-300 px-2 py-3 text-center">{baseAmount.toFixed(2)}</td>

                            <td className="border border-gray-300 px-2 py-3 text-center">
                              <input
                                type="number"
                                min={0}
                                step="any"
                                className="w-16 px-2 py-1 border rounded-md text-center focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                value={row.cgst}
                                onChange={(e) => handleInputChange(index, "cgst", Number(e.target.value))}
                              />
                            </td>

                            <td className="border border-gray-300 px-2 py-3 text-center">
                              <input
                                type="number"
                                min={0}
                                step="any"
                                className="w-16 px-2 py-1 border rounded-md text-center focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                value={row.sgst}
                                onChange={(e) => handleInputChange(index, "sgst", Number(e.target.value))}
                              />
                            </td>

                            <td className="border border-gray-300 px-2 py-3 text-center">
                              <input
                                type="number"
                                min={0}
                                step="any"
                                className="w-16 px-2 py-1 border rounded-md text-center focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                value={row.igst}
                                onChange={(e) => handleInputChange(index, "igst", Number(e.target.value))}
                              />
                            </td>

                            <td className="border border-gray-300 p-3 text-center">{totalAmount.toFixed(2)}</td>
{/* 
                            <td className="border border-gray-300 p-3 text-center">
                              <input
                                type="checkbox"
                                onChange={() => handleCheckboxChange(index)}
                                checked={selectedRows.some((r) => r.raw_material_master === row.raw_material_master)}
                              />
                            </td> */}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Charges */}
            <div className="col-span-2 flex justify-between">
              <div className="flex flex-col">
                <FormLabel title={"Freight"} />
                <input
                  type="number"
                  placeholder="0.00"
                  step="any"
                  className="bg-gray-100 border broder-gray-300 broder-gray-100 rounded-md p-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={freight}
                  onChange={(e) => setFreight(Number(e.target.value))}
                />
              </div>
              <div className="flex flex-col">
                <FormLabel title={"Other charges"} />
                <input
                  type="number"
                  placeholder="0.00"
                  step="any"
                  className="bg-gray-100 border broder-gray-300 broder-gray-100 rounded-md p-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={otherCharges}
                  onChange={(e) => setOtherCharges(Number(e.target.value))}
                />
              </div>
              <div className="flex flex-col">
                <FormLabel title={"Total Bill Amount"} />
                <input
                  type="number"
                  placeholder="0.00"
                  className="bg-gray-100 border broder-gray-300 broder-gray-100 rounded-md p-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={totalBillAmount}
                  readOnly
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="col-span-2 flex justify-end mt-4">
              <button
                type="button"
                onClick={clearHandler}
                className="bg-gray-200 px-4 py-1 rounded hover:bg-gray-600 hover:text-white transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`bg-blue-900 ml-2 px-6 py-2 rounded text-white font-semibold transition-all ease-in-out duration-300 transform ${submitting
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-blue-700"
                  }`}
                disabled={submitting}
              >
                {submitting ? (
                  <div className="flex justify-center items-center space-x-2">
                    <PuffLoader size={20} color="#fff" />
                    <span>Saving...</span>
                  </div>
                ) : (
                  "Save"
                )}
              </button>
            </div>
          </form>
        </div>)}
    </div>
  );
};
export default StockIn;
