import { useEffect, useState } from "react";
import SelectionTable from "../../smartTable/SelectionTable";
import FormLabel from "../purchase/FormLabel";
import FormInput from "../utility/FormInput";
import SmartTable from "../../smartTable/SmartTable";
import SmartTable1 from "../../smartTable/SmartTable1";
import axios from "axios";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { BounceLoader, PuffLoader } from "react-spinners";
import SmartTable2 from "../../smartTable/SmartTable2";
import { toast } from "react-toastify";

const SelectSOTable = ({
  NoOfColumns,
  data,
  headers,
  setSelectedRow,
  selectedRow,
  setDisplayModal,
  billId,
  setBosId,
  setBillOfSale,
  setLoading,
  setBosDisplayModal,
  setFormData,
  setSelectedRows,
  company,
  setSoBom,
  setBom,
  setStitchCreated
}) => {
  // console.log(setOfSelectedIndex);
  const { token } = useSelector((state) => state.auth);
  const [updatedData, setUpdatedData] = useState([]);
  const navigate = useNavigate();
  const [updatedHeader] = useState(["select", ...headers]);
  const updateTableData = () => {
    const updatedValues = data.map((item) => ({
      select: (
        <input
          type="checkbox"
          checked={billId === item.id}
          onChange={() => handleClick(item.id, item.so_id, item.type)}
          key={item.id}
        />
      ),
      ...item,
    }));

    // const selectedRow = data.find((item) => item.id === selectedSOId);
    setSelectedRow(selectedRow ? [selectedRow] : []);
    setUpdatedData(
      updatedValues.map((item) =>
        Object.fromEntries(Object.entries(item).slice(0, NoOfColumns + 1))
      )
    );
  };

  const handleClick = async (id, so_id, type) => {
    setBosId(id);
    setSelectedRows([]);

    const orderType = (type === "Vasttram Sales Order") ? "internal-sales-order-entry" : "sales-oder-entries"

    try {
      setLoading(true);

      // Fetch Bill of Sale
      // const response = await axios.get(
      //   `${process.env.REACT_APP_BACKEND_URL}/api/custom-bill-of-sale/${id}`,
      //   { headers: { Authorization: `Bearer ${token}` } }
      // );

      const [
        response,
        response2,
        response3
      ] = await Promise.all([
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/custom-bill-of-sale/${id}`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/${orderType}/find-by-so_id/${so_id}`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/stitching-entries/exists/${so_id}`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      const responseData = response.data;
      console.log("billOfSale: ", responseData);
      console.log("SaleOrder: ", response2);
      console.log("stitch: ", response3);

      // Set Bill of Sale
      setBillOfSale(responseData);
      const so = responseData.sales_order_entry || responseData.internal_sales_order_entry;
      console.log("so: ", so)
      const extraBom = so.extra_bom_so[0]?.Extra_bom || [];

      // Fetch extra_bomSfg_fromStock from the response
      const extraBomFromStock = so?.extra_bomSfg_fromStock || [];

      // Merge extra_bomSfg_fromStock into Extra_bom, without changing the structure
      const mergedExtraBom = [...extraBom, ...extraBomFromStock];

      // Set the merged Extra_bom in the BOM
      if (so.extra_bom_so && so.extra_bom_so[0]) {
        setSoBom({
          // ...so.extra_bom_so[0],  // Correctly accessing the selected SO's extra_bom_so
          Extra_bom: mergedExtraBom,  // Merged Extra_bom
        });
      } else {
        console.warn("No extra_bom_so found for the selected SO.");
      }

      // Fetch BOM Aggregated Data
      const bomAggregatedResponse = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/bill-of-purchase/by-bill-of-sale/${responseData.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const bomAggregatedData = bomAggregatedResponse.data.bom_aggregated || [];
      console.log("bomAggregatedData: ", bomAggregatedData);

      // Update Already Received in BOM Details
      const updatedBomDetails = responseData?.bom_billOfSale?.bom_detail.map((bom) => {
        const matchingBom = bomAggregatedData.find(item => item.bom_id === bom.bom_id);
        return {
          ...bom,
          alreadyReceived: matchingBom ? matchingBom.total_receive_qty : 0
        };
      });

      // Update Bill of Sale with Aggregated Data
      setBillOfSale({
        ...responseData,
        bom_billOfSale: {
          ...responseData.bom_billOfSale,
          bom_detail: updatedBomDetails
        }
      });

      // Set Form Data
      setFormData(prev => ({
        ...prev,
        billId: responseData?.id || prev.billId,
        date: new Date().toISOString().split("T")[0],
        ex_date: responseData?.ex_date || prev.clearDate,
        so_id: responseData?.internal_sales_order_entry?.so_id || responseData?.sales_order_entry?.so_id || prev.so_id,
        design: responseData?.design?.design_number || prev.design,
        color: responseData?.bom_billOfSale?.color?.id,
        processor: responseData?.processor.id,
        merchandiser: responseData?.merchandiser?.id,
        seller: responseData?.seller_detail,
        purchaserDetails: company.gst_no,
        jobNote: responseData.job_note
      }));

      const data = response2.data;

      const extraBomSO = data.extra_bom_so[0]?.Extra_bom || [];

      // Fetch extra_bomSfg_fromStock from the response
      const extraBomFromStockSO = data?.extra_bomSfg_fromStock || [];

      // Merge extra_bomSfg_fromStock into Extra_bom, without changing the structure
      const mergedExtraBomSO = [...extraBomSO, ...extraBomFromStockSO];

      // Set the merged Extra_bom in the BOM
      setBom({
        ...data.extra_bom_so[0],  // Keep the other BOM data intact
        Extra_bom: mergedExtraBomSO,  // Merge the Extra_bom with extra_bomSfg_fromStock
      });


      setStitchCreated(response3?.data);

      // Close Modal and Open BOS Modal
      setDisplayModal(false);
      setBosDisplayModal(true);

    } catch (error) {
      console.error("Error fetching jobber data:", error);
      if (error.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  // const handleClick = async (id, so_id) => {
  //   setBosId(id);
  //   setSelectedRows([]);

  //   try {
  //     setLoading(true);

  //     // Fetch Bill of Sale
  //     const response = await axios.get(
  //       `${process.env.REACT_APP_BACKEND_URL}/api/custom-bill-of-sale/${id}`,
  //       { headers: { Authorization: `Bearer ${token}` } }
  //     );
  //     const responseData = response.data;
  //     console.log("billOfSale: ", responseData);

  //     //     // Fetch BOM Aggregated Data
  //     const bomAggregatedResponse = await axios.get(
  //       `${process.env.REACT_APP_BACKEND_URL}/api/bill-of-purchase/by-bill-of-sale/${responseData.id}`,
  //       { headers: { Authorization: `Bearer ${token}` } }
  //     );
  //     const bomAggregatedData = bomAggregatedResponse.data.bom_aggregated || [];
  //     console.log("bomAggregatedData: ", bomAggregatedData);

  //     // Update Already Received in BOM Details
  //     const updatedBomDetails = responseData?.bom_billOfSale?.bom_detail.map((bom) => {
  //       const matchingBom = bomAggregatedData.find(item => item.bom_id === bom.bom_id);
  //       return {
  //         ...bom,
  //         alreadyReceived: matchingBom ? matchingBom.total_receive_qty : 0
  //       };
  //     });

  //      // Update Bill of Sale with Aggregated Data
  //     setBillOfSale({
  //       ...responseData,
  //       bom_billOfSale: {
  //         ...responseData.bom_billOfSale,
  //         bom_detail: updatedBomDetails
  //       }
  //     });

  //     // Set Bill of Sale
  //     setBillOfSale(responseData);

  //     // Set Form Data
  //     setFormData((prev) => ({
  //       ...prev,
  //       billId: responseData?.id || prev.billId,
  //       date: new Date().toISOString().split("T")[0],
  //       ex_date: responseData?.ex_date || prev.clearDate,
  //       so_id: responseData?.internal_sales_order_entry?.so_id || responseData?.sales_order_entry?.so_id || prev.so_id,
  //       design: responseData?.design?.design_number || prev.design,
  //       color: responseData?.bom_billOfSale?.color?.id,
  //       processor: responseData?.processor.id,
  //       seller: responseData?.seller_detail,
  //       purchaserDetails: company.gst_no,
  //     }));

  //     // Close Modal and Open BOS Modal immediately
  //     setDisplayModal(false);
  //     setBosDisplayModal(true);

  //     // Merge Extra BOM
  //     const so = responseData.sales_order_entry || responseData.internal_sales_order_entry;
  //     const extraBom = so.extra_bom_so[0]?.Extra_bom || [];
  //     const extraBomFromStock = so?.extra_bomSfg_fromStock || [];
  //     const mergedExtraBom = [...extraBom, ...extraBomFromStock];

  //     // Set the merged Extra_bom in the BOM
  //     if (so.extra_bom_so && so.extra_bom_so[0]) {
  //       setSoBom({
  //         Extra_bom: mergedExtraBom,
  //       });
  //     }

  //   } catch (error) {
  //     console.error("Error fetching jobber data:", error);
  //     if (error.response?.status === 401) {
  //       navigate("/login");
  //     }
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  useEffect(() => {
    updateTableData();
  }, [data]);
  return <SmartTable2 data={updatedData} headers={updatedHeader} />;
};

const processorOption = [
  {
    id: 1,
    name: 'Processor 1'
  },
  {
    id: 2,
    name: 'Processor 2'
  },
  {
    id: 3,
    name: 'Processor 3'
  }
]

const BillOfPurchase = () => {
  const headersForTable = ["Bill of Sales Id", "Bill Type", "SO ID", "Date", "Job Note", "Processor", "Remarks", "Total Bill Amount", "Bill Status"];

  const [displayModal, setDisplayModal] = useState(false);
  const { load, error, availableProcessor } = useSelector((state) => state.fetchData);
  const [selectedRow, setSelectedRow] = useState([]);

  const [sellerName, setSellerName] = useState([
    "seller1",
    "seller2",
    "seller3",
  ]);

  const [displayHeaders, setDisplayHeaders] = useState([
    "item_name",
    "particulars",
    "hsn_code",
    "unit",
    "colour",
    "required_qty",
    "rate",
    "exta_qty",
    "amount",
    "cgst",
    "sgst",
    "igst",
    "total",
  ]);
  const [formData, setFormData] = useState({
    billId: "",
    date: "",
    clearDate: "",
    so_id: "",
    ex_date: "",
    referenceBill: "",
    design: "",
    jobber: "",
    processor: "",
    seller: "",
    purchaserDetails: "",
    remarks: "",
    jobNote: "",
    otherCharges: "",
    totalBillAmount: "",
    merchandiser: ""
  })

  const { token, designation, id } = useSelector(state => state.auth);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [billData, setBillData] = useState([]);
  const [bosId, setBosId] = useState(null);
  const [billOfSale, setBillOfSale] = useState(null);
  const [bosDisplayModal, setBosDisplayModal] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [jobberDetail, setJobberDetail] = useState([]);
  const [color, setColor] = useState([]);
  const [alreadyReceivedQty, setAlreadyReceivedQty] = useState([]);
  const [stitchingSO, setStitchingSO] = useState(null);
  const [allReceivedItemGoods, setAllReceivedItemGoods] = useState(null);
  const [company, setCompany] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [totalCost, setTotalCost] = useState(0);
  const [soBom, setSoBom] = useState([]);
  const [bom, setBom] = useState([]);
  const [stitchCreated, setStitchCreated] = useState(false);
  console.log("bom: ", bom)

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const dash_so_id = queryParams.get("so_id");
  console.log("dash_so_id", dash_so_id)

  const clearData = () => {
    setFormData({
      billId: "",
      date: "",
      clearDate: "",
      so_id: "",
      ex_date: "",
      referenceBill: "",
      design: "",
      jobber: "",
      processor: "",
      seller: "",
      purchaserDetails: "",
      remarks: "",
      jobNote: "",
      otherCharges: "",
      totalBillAmount: "",
      merchandiser: ""
    })
    setBillOfSale(null);
    setBosDisplayModal(false)
    setSoBom([]);
    setTotalCost(0);
    setSelectedItems([]);

  }

  const fetchBillOfSales = async () => {
    try {
      setLoading(true);
      // const billOfSalesUrl = dash_so_id
      //   ? `${process.env.REACT_APP_BACKEND_URL}/api/bill-of-sales?filters[billOfSales_status][$eq]=open&filters[so_id][$eq]=${dash_so_id}&sort=id:desc&populate=*`
      //   : `${process.env.REACT_APP_BACKEND_URL}/api/bill-of-sales?filters[billOfSales_status][$eq]=open&sort=id:desc&populate=*`;


      let billOfSalesUrl = dash_so_id
        ? `${process.env.REACT_APP_BACKEND_URL}/api/bill-of-sales?filters[billOfSales_status][$eq]=open&filters[so_id][$eq]=${encodeURIComponent(dash_so_id)}&sort=id:desc&populate=*`
        : `${process.env.REACT_APP_BACKEND_URL}/api/bill-of-sales?filters[billOfSales_status][$eq]=open&sort=id:desc&populate=*`;

      if (designation !== "Merchandiser" && designation !== "Admin" && id) {
        billOfSalesUrl += `&filters[processor][id][$eq]=${encodeURIComponent(id)}`;
      } else if (designation === "Merchandiser" && id) {
        billOfSalesUrl += `&filters[merchandiser][id][$eq]=${encodeURIComponent(id)}`;
      }

      const [
        response,
        response2,
      ] = await Promise.all([
        // axios.get(
        //   `${process.env.REACT_APP_BACKEND_URL}/api/bill-of-sales?filters[billOfSales_status][$eq]=open&sort=id:desc&populate=*`,
        //   {
        //     headers: {
        //       Authorization: `Bearer ${token}`,
        //     },
        //   }
        // ),
        // axios.get(
        //   `${process.env.REACT_APP_BACKEND_URL}/api/bill-of-sales?filters[billOfSales_status][$eq]=open&filters[so_id][$eq]=${dash_so_id}&sort=id:desc&populate=*`,
        //   {
        //     headers: {
        //       Authorization: `Bearer ${token}`,
        //     },
        //   }
        // ),

        axios.get(
          billOfSalesUrl,
          {
            params: {
              "pagination[page]": 1,
              "pagination[pageSize]": 10000,
            },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        ),
        axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/companies`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        ),
      ]);

      const data = Array.isArray(response.data.data) ? response.data.data : [];
      // const data = response.data.data.results || [];
      console.log("data: ", data);
      const mappedData = data.map((bills) => {
        const isInternal = bills.internal_sales_order_entry;
        const isSales = bills.sales_order_entry;

        return {
          id: bills.id,
          type: bills.type === "internal-sales-order-entries" ? "Vasttram Sales Order" : "Customer Sales Order",
          so_id: isInternal?.so_id || isSales?.so_id || "",
          date: bills.ex_date,
          jobNote: bills.job_note,
          processor: bills.processor.name,
          remarks: bills.remarks,
          Total_Amount: bills.Total_Bill_of_sales_Amount,
          billOfSales_status: bills.billOfSales_status,
        };
      });

      setBillData(mappedData);
      // const jobbers = Array.isArray(response2.data.data)
      //   ? response2.data.data
      //   : [];
      // setJobberDetail(jobbers);
      // const colorGroup = Array.isArray(response3.data.data)
      //   ? response3.data.data
      //   : [];
      // setColor(colorGroup);
      const company = Array.isArray(response2.data.data)
        ? response2.data.data
        : [];
      setCompany(company[0]);

    } catch (error) {
      console.error("Error fetching jobber data:", error);
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
    fetchBillOfSales();
  }, [token]);

  useEffect(() => {
    // Calculate total cost whenever selectedItems change
    const total = selectedItems.reduce(
      (sum, item) => sum + (item.jobber_rate * item.enteredQty || 0),
      0
    );
    setTotalCost(total);
  }, [selectedItems]);

  const handleCheckboxChange = (item, index, enteredQty, alreadyReceived) => {
    const isChecked = selectedItems.some((selected) => selected.id === item.id);
    if (isChecked) {
      // Uncheck
      setSelectedItems(selectedItems.filter((selected) => selected.id !== item.id));
    } else {
      // Check and add item with received qty
      setSelectedItems([
        ...selectedItems,
        {
          ...item,
          alreadyReceived: alreadyReceived || 0,
          enteredQty: enteredQty || 0,
          total: item.jobber_rate * (enteredQty || 0),
        },
      ]);
    }
  };


  const handleQtyChange = (e, item) => {
    const enteredQty = Number(e.target.value);
    const alreadyReceived = item.alreadyReceived || 0;
    const maxQty = item.qty - alreadyReceived;

    if (enteredQty > maxQty) {
      alert(`You cannot enter more than ${maxQty} units.`);
      return;
    }

    setSelectedItems((prevSelected) => {
      // Check if item is already selected
      const updatedItems = prevSelected.map((selected) => {
        if (selected.id === item.id) {
          return {
            ...selected,
            enteredQty,
            alreadyReceived,
            total: item.jobber_rate * enteredQty,
          };
        }
        return selected;
      });

      // Add new item if not already selected
      const itemExists = updatedItems.find((selected) => selected.id === item.id);
      if (!itemExists) {
        updatedItems.push({
          ...item,
          enteredQty,
          alreadyReceived,
          total: item.jobber_rate * enteredQty,
        });
      }

      return updatedItems;
    });
  };

  const formDataChangeHandler = (event) => {

    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value
    }))
    console.log(formData.date)
  }

  const calculatedTotal = () => {
    const otherCharges = Number(formData.otherCharges) || 0;
    return otherCharges + totalCost;
  };

  useEffect(() => {
    if (billOfSale?.bom_billOfSale) {
      setFormData((prevData) => ({
        ...prevData,
        totalBillAmount: calculatedTotal(),
      }));
    }
  }, [formData.otherCharges, totalCost]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    if (formData.billId === "") {
      toast("Please select the Bill of sales.");
      setSubmitting(false);
      return;
    }

    if (formData.clearDate === "") {
      toast.warning("Please select the Clear Date.");
      setSubmitting(false);
      return;
    }

    const fullyReceivedItems = selectedItems
      .filter(item => item.qty === (item.alreadyReceived || 0) + (item.enteredQty || 0))
      .map(item => ({
        ...item,
        bom_id: item.bom_id,
        selectedJobberId: item.selectedJobberId
      }));

    console.log(fullyReceivedItems);

    const postData = {
      data: {
        billOfSale: formData.billId,
        date: formData.date,
        clearDate: formData.clearDate,
        so_id: formData.so_id,
        ex_date: formData.ex_date,
        reference_bill: formData.referenceBill || "",
        design: formData.design,
        // color: formData.color,
        processor: formData.processor,
        seller_detail: formData.seller,
        purchaser_Details: company.id,
        remarks: formData.remarks,
        jobNote: formData.jobNote,
        other_charges: String(formData.otherCharges),
        Total_Bill_Amount_Bop: String(formData.totalBillAmount),
        bom_billOfPurchase: {
          jobber: billOfSale?.bom_billOfSale?.jobber?.id,
          bom_detail: selectedItems.map((item) => ({
            semi_finished_goods: item?.semi_finished_goods.id,
            color: item?.color?.id,
            jobber_rate: item?.jobber_rate,
            total_qty: item?.qty,
            already_received: item?.alreadyReceived,
            receive_qty: item?.enteredQty,
            total: item?.total,
            bom_id: item?.bom_id,
          })),
          total_jobber_cost_on_sfg: totalCost
        },
        merchandiser: formData?.merchandiser
      },
    };

    // data for updation bill of sales receive qty 
    const billOfSaleId = formData?.billId;
    const updates = selectedItems?.map((item) => ({
      bom_id: item?.bom_id,
      receive_qty: item?.enteredQty
    }))

    const api_point = (billOfSale?.type === "sales-oder-entries") ? "sales-order-entry" : "internal-sales-order-entries";



    console.log("postData: ", postData);

    try {
      // Submit main bill-of-purchase data
      const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/bill-of-purchases`, postData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("ressssssss: ", res);


      if (res.data.data === null) {
        toast.error(res?.data?.message, { position: "top-right" });
        setSubmitting(false);
        return;
      }

      if (res.data.data) {
        const updateBomQtyPromise = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/update-receive-qty-bill-of-sales`, {
          billOfSaleId,
          updates
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      console.log("res: ", res);


      if (fullyReceivedItems.length > 0) {
        const updateItems = fullyReceivedItems.map((item) => {
          const matchingBom = soBom.Extra_bom.find(bom => bom.id === item.bom_id);

          // Handle missing jobber_master_sfg
          const jobberList = matchingBom.jobber_master_sfg || [];

          // Check if all other jobbers are complete
          const allOtherJobbersComplete = jobberList
            .filter(jobber => jobber.id !== item.selectedJobberId)
            .every(jobber => jobber.completed === "Complete");

          // Determine the BOM status
          const newBomStatus = allOtherJobbersComplete ? "readyToStitch" : "Process Due";

          return {
            id: item.bom_id,
            bom_status: newBomStatus,
            jobber_id: item.selectedJobberId || null, // Ensure jobber_id is set
            completed: "Complete"
          };
        });

        const processData = fullyReceivedItems.map((item) => ({
          "id": item?.bom_id,
          "process": billOfSale?.bom_billOfSale?.jobber?.work_type,
          "jobber": billOfSale?.bom_billOfSale?.jobber?.id
        }));

        const updateItemsForStatus = updateItems.map(item => ({
          id: item.id,
          bom_status: item.bom_status
        }));

        // const updateBomStatusonly = axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/${api_point}/update-only-bom-status/${billOfSale?.so_id}`, updateItemsForStatus, {
        //   headers: { Authorization: `Bearer ${token}` }
        // });

        const updateBomStatusPromise = axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/${api_point}/update-bom-status/${billOfSale?.so_id}`, updateItems, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const addBomProcessPromise = axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/${api_point}/${billOfSale?.so_id}/add-bom-process`, processData, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const [updateBomStatus, addBomProcess] = await Promise.all([
          updateBomStatusPromise,
          addBomProcessPromise,
        ]);

        console.log("updateBomStatus: ", updateBomStatus);
        console.log("addBomProcess: ", addBomProcess);

        const updateBomStatusonly = await axios.put(
          `${process.env.REACT_APP_BACKEND_URL}/api/${api_point}/update-only-bom-status/${billOfSale?.so_id}`,
          updateItemsForStatus,
          { headers: { Authorization: `Bearer ${token}` } }
        );


        function determineStatus(updateItems, bom) {
          // 1️ updateItems ke IDs collect karo (array of numbers)
          const updateIds = updateItems.map(item => item.id);

          // 2️ Extra_bom ko nikal lo
          const extraBom = bom.Extra_bom || [];

          // 3️ Extra_bom se updateItems ke ids wale elements ko hata do
          const filteredExtraBom = extraBom.filter(b => !updateIds.includes(b.id));

          // 4️ Bache huye Extra_bom me status check karo
          const hasSendToJobber = filteredExtraBom.some(b => b.bom_status === "sendToJobber");
          const allReadyToStitchExtra = filteredExtraBom.every(b => b.bom_status === "readyToStitch");

          // 5️ updateItems me koi Process Due hai ya sab readyToStitch
          const anyProcessDue = updateItems.some(item => item.bom_status === "Process Due");
          const allReadyToStitch = updateItems.every(item => item.bom_status === "readyToStitch");

          // 6️ Final status decide karo
          if (allReadyToStitch) {
            if (hasSendToJobber) {
              return "In Process";
            } else if (allReadyToStitchExtra) {
              return "readyToStitch";
            } else {
              return "Process Due";
            }
          } else if (anyProcessDue) {
            if (hasSendToJobber) {
              return "In Process";
            } else {
              return "Process Due";
            }
          }

          // agar koi condition match nahi hui to default
          return "Process Due";
        }

        const status = determineStatus(updateItems, bom);
        console.log(status);

        if (status === "readyToStitch") {
          const type = (billOfSale.type === "internal-sales-order-entries")
            ? "internal-sales-order-entry"
            : "sales-order-entry";

          const endpoint = stitchCreated
            ? `${process.env.REACT_APP_BACKEND_URL}/api/${type}/update-status/${billOfSale?.so_id}/In%20Stitching`
            : `${process.env.REACT_APP_BACKEND_URL}/api/${type}/update-status/${billOfSale?.so_id}/readyToStitch`;

          await axios.put(endpoint, postData, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        } else if (status === "Process Due") {
          const type = (billOfSale.type === "internal-sales-order-entries")
            ? "internal-sales-order-entry"
            : "sales-order-entry";

          await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/${type}/update-status/${billOfSale?.so_id}/Process%20Due`, postData, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        }
      }


      // await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/${api_point}/update-bom-status/${billOfSale?.so_id}`, data, {
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //   },
      // });

      // await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/${api_point}/${billOfSale?.so_id}/add-bom-process`, processData, {
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //   },
      // });

      function isFullyReceived(billOfSale, selectedItems) {
        // Extract all bom_detail items
        const bomDetails = billOfSale.bom_billOfSale.bom_detail || [];

        // Find selected items that are fully received
        const fullyReceivedItems = selectedItems.filter(item => item.qty === (item.alreadyReceived || 0) + (item.enteredQty || 0));

        // Extract all bom_ids from fully received selected items
        const fullyReceivedBomIds = new Set(fullyReceivedItems.map(item => item.bom_id));

        // Check if all remaining items are also fully received
        const allReceived = bomDetails.every(item => {
          // If this item is part of fully received items, ignore it
          if (fullyReceivedBomIds.has(item.bom_id)) return true;

          // Check if this item's qty is fully received
          return item.qty === (item.alreadyReceived || 0);
        });

        return allReceived;
      }

      console.log(isFullyReceived(billOfSale, selectedItems));

      if (isFullyReceived(billOfSale, selectedItems)) {
        await axios.put(
          `${process.env.REACT_APP_BACKEND_URL}/api/bill-of-sales/${formData.billId}/close`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      toast.success("Bill of purchases created successfully", { position: "top-right" });

      setTimeout(() => {
        navigate(`/bill-of-purchase/${res.data.data.id}`);
      }, 1000)


      console.log("Data submitted successfully!", postData);
    } catch (error) {
      console.error("Error posting bill of sales:", error);
      toast.error(error?.response?.data?.error?.message || "Something went wrong!");
    } finally {
      setSubmitting(false);
    }
  };

  // console.log("billOfSale: ", billOfSale)
  // console.log("company: ", company)
  // console.log("selectedItems: ", selectedItems)
  // console.log("soBom: ", soBom)

  if (loading || load) {
    return (
      <div className="flex justify-center items-center h-screen">
        <BounceLoader color="#1e3a8a" />
      </div>
    )
  }

  return (
    <div className="p-6 bg-white rounded-lg relative">

      <div>
        <h1 className="text-2xl pb-2 border-b font-bold text-blue-900 mb-4">
          Bill of Purchase
        </h1>

        <div className="col-span-2 flex border border-blue-500 justify-center mt-4 rounded p-2">
          <div className=" flex items-center gap-2 ">
            <p className="text-gray-500 text-md">Choose Bill of Sale:</p>
            <button
              type="button"
              className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-700 transition-all duration-200 "
              onClick={() => {
                setDisplayModal(!displayModal);
              }}
            >
              Choose Bill of Sale
            </button>
          </div>
        </div>

        {bosDisplayModal && (
          <div className="w-full mt-4 mb-4">
            <div className="bg-white p-6 rounded-xl w-full shadow-lg">
              <h2 className="text-xl font-bold mb-6 border-b pb-2 text-blue-900">
                Bill of Sale Details
              </h2>

              <div className="mb-4">
                {/* Jobber Details */}

                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg shadow-md mb-6">
                  <h3 className="text-xl font-semibold text-blue-900 mb-3 border-b pb-2">Jobber Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p><span className="font-semibold">Name:</span> {billOfSale?.bom_billOfSale?.jobber.jobber_name}</p>
                      <p><span className="font-semibold">Address:</span> {billOfSale?.bom_billOfSale?.jobber.jobber_address}</p>
                    </div>
                    <div>
                      <p><span className="font-semibold">GSTIN:</span> {billOfSale?.bom_billOfSale?.jobber.jobber_gstin}</p>
                      <p><span className="font-semibold">Process:</span> {billOfSale?.bom_billOfSale?.jobber.work_type}</p>
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="text-lg font-semibold text-blue-900">
                      Total Cost: ₹{billOfSale?.bom_billOfSale?.total_jobber_cost_on_sfg}
                    </div>
                  </div>
                </div>

                {/* BOS Table */}
                {/* <table className="w-full mb-4 border border-gray-300 rounded-lg overflow-hidden">
                    <thead className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-900">
                      <tr>
                        <th className="px-6 py-4 text-left font-semibold">#</th>
                        <th className="px-6 py-4 text-left font-semibold">Semi-Finished Goods</th>
                        <th className="px-6 py-4 text-left font-semibold">Color</th>
                        <th className="px-6 py-4 text-left font-semibold">Jobber Rate</th>
                        <th className="px-6 py-4 text-left font-semibold">Quantity</th>
                        <th className="px-6 py-4 text-left font-semibold">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {billOfSale?.bom_billOfSale?.bom_detail.map((item, index) => (
                        <tr key={item.id} className="hover:bg-blue-50 transition">
                          <td className="px-6 py-4 text-gray-700">{index + 1}</td>
                          <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                            {item?.semi_finished_goods?.semi_finished_goods_name || 'N/A'}
                          </td>
                          <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                            {item?.color?.color_name || 'N/A'}
                          </td>
                          <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                            {item?.jobber_rate || 0}
                          </td>
                          <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                            {item?.qty || 0}
                          </td>
                          <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                            {(item?.total || 0)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table> */}

                <table className="w-full mb-4 border border-gray-300 rounded-lg overflow-hidden">
                  <thead className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-900">
                    <tr>
                      <th className="px-6 py-4 text-left font-semibold">#</th>
                      <th className="px-6 py-4 text-left font-semibold">Semi-Finished Goods</th>
                      <th className="px-6 py-4 text-left font-semibold">Color</th>
                      <th className="px-6 py-4 text-left font-semibold">Jobber Rate</th>
                      <th className="px-6 py-4 text-left font-semibold">Quantity</th>
                      <th className="px-6 py-4 text-left font-semibold">Already Received</th>
                      <th className="px-6 py-4 text-left font-semibold">Enter Receive Qty</th>
                      <th className="px-6 py-4 text-left font-semibold">Total</th>
                      <th className="px-6 py-4 text-center font-semibold">Select</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {billOfSale?.bom_billOfSale?.bom_detail.map((item, index) => {
                      const alreadyReceived = item.alreadyReceived || 0;
                      const maxQty = item.qty - alreadyReceived;
                      const selectedItem = selectedItems.find((selected) => selected.id === item.id);
                      const enteredQty = selectedItem ? selectedItem.enteredQty : 0;
                      const isDisabled = item.qty === alreadyReceived;

                      return (
                        <tr key={item.id} className="hover:bg-blue-50 transition">
                          <td className="px-6 py-4 text-gray-700">{index + 1}</td>
                          <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                            {item?.semi_finished_goods?.semi_finished_goods_name || 'N/A'}
                          </td>
                          <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                            {item?.color?.color_name || 'N/A'}
                          </td>
                          <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                            {item?.jobber_rate || 0}
                          </td>
                          <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                            {item?.qty || 0}
                          </td>
                          <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                            {alreadyReceived}
                          </td>
                          <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                            <input
                              type="number"
                              min="0"
                              max={maxQty}
                              value={enteredQty}
                              onChange={(e) => handleQtyChange(e, item, index, alreadyReceived)}
                              className="w-full px-2 py-1 border border-gray-300 rounded"
                            />
                          </td>
                          <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                            {item.jobber_rate * enteredQty || 0}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <input
                              type="checkbox"
                              disabled={isDisabled}
                              checked={selectedItem !== undefined}
                              onChange={() => {
                                if (enteredQty <= 0) {
                                  alert("Please enter the qty");
                                  return;
                                }
                                handleCheckboxChange(item, index, enteredQty, alreadyReceived)
                              }}
                              className="w-4 h-4"
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                <hr className="w-full border-t-2 border-gray-300 my-2" />

                <div className="flex justify-end">
                  <div className="text-lg font-semibold text-blue-900">
                    Total Cost: ₹{totalCost}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal */}
        {displayModal && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-md animate-fade-in flex justify-center items-center z-50">
            <div className="relative w-[90vw] bg-gray-200 ml-10 border shadow-2xl p-4 rounded-lg ">

              <div className='flex justify-between items-center border-b border-b-gray-300'>
                <h3 className='text-xl font-bold text-blue-900'>Select Bill of Sale</h3>
                <p
                  className="text-xl px-2 border bg-red-600 rounded-full text-white hover:bg-red-500 cursor-pointer"
                  onClick={() => {
                    setDisplayModal(false);
                  }}
                >
                  X
                </p>
              </div>

              <div className="">
                <SelectSOTable
                  NoOfColumns={headersForTable.length}
                  data={billData}
                  headers={headersForTable}
                  setSelectedRow={setSelectedRow}
                  selectedRow={selectedRow}
                  setDisplayModal={setDisplayModal}
                  bosId={bosId}
                  setBosId={setBosId}
                  setBillOfSale={setBillOfSale}
                  setLoading={setLoading}
                  setBosDisplayModal={setBosDisplayModal}
                  setFormData={setFormData}
                  setSelectedRows={setSelectedRows}
                  setAlreadyReceivedQty={setAlreadyReceivedQty}
                  setStitchingSO={setStitchingSO}
                  setAllReceivedItemGoods={setAllReceivedItemGoods}
                  company={company}
                  setSoBom={setSoBom}
                  setBom={setBom}
                  setStitchCreated={setStitchCreated}
                />
              </div>
            </div>
          </div>
        )}

        {/* Bill of Purchase */}
        {/* Form */}
        <form className="grid grid-cols-2 gap-x-6 gap-y-3 mt-5 p-5 rounded-lg border border-gray-200 shadow-md mb-16" onSubmit={handleSubmit}>

          <FormInput type={"input"} placeholder={"Bill Of Sale Id"} label={"Bill Of Sale ID"} value={formData.billId} />
          {/* Date */}
          <FormInput type={"date"} placeholder={"Date"} label={"Date"} value={formData.date} />
          <FormInput
            type={"date"}
            placeholder={"Clear Date"}
            label={"Clear Date"}
            value={formData.clearDate}
            name="clearDate"
            onChange={formDataChangeHandler}
          />
          {/* SO id */}
          <FormInput type={"text"} placeholder={"So Id"} label={"So Id"} value={formData.so_id} />
          {/* Date */}
          <FormInput type={"date"} placeholder={"Ex Date"} label={"EX Date"} value={formData.ex_date} name="ex_date" />
          {/* Reference bill */}
          <FormInput
            type={"text"}
            placeholder={"Enter Reference Bill No"}
            label={"Reference Bil"}
            name="referenceBill"
            value={formData.referenceBill}
            onChange={formDataChangeHandler}
          />
          {/* Choose Design */}
          <div className="mb-4">
            <label className="text-sm font-medium text-gray-700 mr-4" htmlFor="design">
              Design: <span className=' text-red-600 '>*</span>
            </label>
            <input
              className="border border-gray-300 bg-gray-100 rounded-md w-full p-2"
              type="text"
              id="design"
              name="design"
              placeholder="Selected Design"
              value={formData.design}
              onChange={formDataChangeHandler}
              required
              readOnly
            />
          </div>

          {/* Processor */}
          <div className="flex flex-col">
            <label className="text-gray-700 font-semibold">Processor  <span className=' text-red-600 '>*</span></label>
            <select className="border border-gray-300 bg-gray-100 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              name="processor"
              value={formData.processor}
              onChange={formDataChangeHandler}
            >
              <option value="" className="text-gray-400">Select Processor</option>
              {
                availableProcessor &&
                Array.isArray(availableProcessor) &&
                availableProcessor
                  .filter(processor => processor.designation !== "Merchandiser")
                  .map(processor => (
                    <option key={processor.id} value={processor.id}>
                      {processor.name + " - " + processor.designation}
                    </option>
                  ))
              }
            </select>
          </div>

          {/* merchandiser */}
          <div className="flex flex-col">
            <label className="text-gray-700 font-semibold">Merchandiser  <span className=' text-red-600 '>*</span></label>
            <select className="border border-gray-300 bg-gray-100 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              name="merchandiser"
              value={formData.merchandiser}
              onChange={formDataChangeHandler}
            >
              <option value="" className="text-gray-400">Select Processor</option>
              {
                availableProcessor &&
                Array.isArray(availableProcessor) &&
                availableProcessor
                  .filter(processor => processor.designation === "Merchandiser")
                  .map(processor => (
                    <option key={processor.id} value={processor.id}>
                      {processor.name + " - " + processor.designation}
                    </option>
                  ))
              }
            </select>
          </div>
          <FormInput
            type={"text"}
            placeholder={"Seller"}
            label={"Seller Detail"}
            name="seller"
            value={formData.seller}
            onChange={formDataChangeHandler}
          />
          <FormInput
            type={"text"}
            placeholder={"Purchaser Details"}
            label={"Purchaser Details"}
            name="purchaserDetails"
            value={formData.purchaserDetails}
            onChange={formDataChangeHandler}
          />

          {/* Notes */}
          <FormInput
            type={"text"}
            placeholder={"BOS Job Notes"}
            label={"BOS Job Notes"}
            name="jobNote"
            value={formData.jobNote}
            onChange={formDataChangeHandler}
          />

          <div className="flex flex-col">
            <FormLabel title={"BOP Remarks"} />
            <textarea
              className="border border-gray-300 bg-gray-100 rounded-md p-2 h-40 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              placeholder="BOP Remarks..."
              name="remarks"
              value={formData.remarks}
              onChange={formDataChangeHandler}
            ></textarea>
          </div>

          {/* Charges */}
          <div className="col-span-2 flex justify-center gap-4 mt-4">
            <FormInput
              type={"text"}
              placeholder={"0.00"}
              label={"Other Charges"}
              name="otherCharges"
              value={formData.otherCharges}
              onChange={formDataChangeHandler}
            />
            <FormInput
              type={"text"}
              placeholder={"0.00"}
              label={"Total Bill Amount"}
              name="totalBillAmount"
              value={formData.totalBillAmount}
              onChange={formDataChangeHandler}
            />
          </div>
          {/* button */}
          <div className="col-span-2 flex justify-end mt-4">
            <button
              type="button"
              className="bg-gray-200 px-4 py-1 rounded hover:bg-gray-600 hover:text-white transition"
              onClick={clearData}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`p-3 ml-4 bg-blue-900 text-white rounded-md transition-all duration-100 ease-in-out ${submitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700 hover:scale-105'
                }`}
              disabled={submitting}
            >
              {submitting ? (
                <div className="flex justify-center items-center gap-2">
                  <PuffLoader size={20} color="#fff" />
                  <span>Saving...</span>
                </div>
              ) : (
                'Save'
              )}
            </button>
            {/* <button
                type="button"
                className="bg-gray-200 px-4 py-1 rounded hover:bg-gray-600 hover:text-white transition ml-4"
              >
                Calculate
              </button> */}
          </div>
        </form>
      </div>
    </div>
  );
};

export default BillOfPurchase;

