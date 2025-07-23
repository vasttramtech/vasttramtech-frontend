import { useEffect, useState } from "react";
import FormLabel from "../purchase/FormLabel";
import FormInput from "../utility/FormInput";
import SingleAddTable from "../../smartTable/SingleAddTable";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { BounceLoader, PuffLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import DesignDetails from "./component/DesignDetails";
import EditSfgComponent from "./component/EditSfgComponent";
import BOMSection from "./component/BOMSection";
import ExtraBOMSfgCreate from "./component/ExtraBOMSfgCreate";
import ConvertIDSfgDataTable from "./component/ConvertIDSfgDataTable";
import { MdCancel } from "react-icons/md";

const SalesOrderEntry = () => {
  const { token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [availableDesignMaster, setAvailableDesignMaster] = useState([]);
  const [fetchingData, setFetching] = useState(false);
  const [approvedSFG, setApprovedSFG] = useState([]);
  const {
    designGroups,
    load,
    error,
    availableCustomers,
    userList,
    availableSfgmGroups,
  } = useSelector((state) => state.fetchData);
  const [formData, setFormData] = useState({
    so_id: "",
    convert_id: "",
    group: "",
    qty: 0,
    customer: "",
    order_no: "",
    design_number: "",
    order_date: "",
    delivery_date: "",
    processor: "",
    remark: "",
    goods_received_remark: "",
    order_status: "",
    merchandiser: "",
  });
  const [showEditSfgModal, setShowEditSfgModal] = useState(false);
  const [selectedSFGindex, setSelectedSFGIndex] = useState();
  // console.log(availableCustomers);
  // console.log("LOGGED IN USER",email,designation)

  const [order_items, setOrder_items] = useState({
    LH: {
      colour: "",
      khaka: "",
      measurement: "",
      work: "",
      others: "",
    },
    BP: {
      colour: "",
      khaka: "",
      measurement: "",
      work: "",
      others: "",
    },
    DUP1: {
      colour: "",
      khaka: "",
      measurement: "",
      work: "",
      others: "",
    },
    DUP2: {
      colour: "",
      khaka: "",
      measurement: "",
      work: "",
      others: "",
    },
    Others: {
      colour: "",
      khaka: "",
      measurement: "",
      work: "",
      others: "",
    },
  });
  const navigate = useNavigate();
  const updateField = (section, field, value) => {
    setOrder_items((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const [NoOfColumns] = useState(4);

  const [headersForDesignTable] = useState([
    "Id",
    "Design No",
    "Group Name",
    "Colour Name",
  ]);

  const [headersforConvertId] = useState([
    "ID",
    "SO_ID",
    "Design Number",
    "Quanity",
    "Remaining Quantity",
    "Order Date",
    "Stock order Status",
  ]);

  const [covertIds, setConvertIds] = useState([]);

  const fetchIndividualGroupDesignMasters = async () => {
    if (!token) return;
    setFetching(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/design-masters/group/${formData.group}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      //  setavailb
      if (!response.data) {
        toast.error("Can't fetch Design master details");
      } else {
        // console.log(response.data)
        setAvailableDesignMaster(response.data);
      }
    } catch (error) {
      console.log("Failed to fetch design master data", error);
      toast.error(
        error?.response?.data?.message || "Failed to fetch design master data"
      );
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (!formData.group) return;
    fetchIndividualGroupDesignMasters();
  }, [formData.group]);

  const [selectedRow, setSelectedRow] = useState();
  const [showDesignTable, setShowDesignTable] = useState(false);
  const [selectedData, setSelectedData] = useState({});
  const [formattedDesignMasters, setFormattedDesignMasters] = useState({});
  const [showTables, setShowTables] = useState(false);
  const [submitting, setsubmitting] = useState(false);
  const [changeSoid, setChangeSoid] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedConvertIdRow, setSelectedConvertIdRow] = useState();
  const [selectedConvertIdData, setSelectedConvertIdData] = useState({});
  const [showConvertIdTable, setShowConvertIdTable] = useState(false);
  const [convertIdDatas, setConvertIdDatas] = useState([]);
  const [processorOptions, setProcessorOptions] = useState([]);
  const [jobberList, setJobberList] = useState([]);
  const [RawMaterialList, setRawMateralList] = useState([]);
  const [designData, setDesignData] = useState(null);
  const [allSemiFinishedGoods, setAllSemiFinishedGoods] = useState([]);
  const [allSavedSemiFinishedGoods, setAllSavedSemiFinishedGoods] = useState(
    []
  );
  const [stockList, setStockList] = useState([]);
  const [sfgStock, setSfgStock] = useState([]);
  const [sfgStockCategories, setSfgStockCategories] = useState(new Map());
  const [refresh, setRefresh] = useState(false);
  const [SFGStatusStock, setSFGstatusStock] = useState();

  //  adding add bom section
  const [addBomData, setAddBomData] = useState({});
  const [showAddBomModal, setShowAddBomModal] = useState(false);
  const [sfglist, setsfglist] = useState([]);

  const [addSfgModal, setAddSfgModal] = useState(false);
  const [soViewModal, setSOViewModal] = useState(false);
  const [salesOrder, setSalesOrder] = useState([]);
  const [bom, setBom] = useState(null);
  const [selectSOModal, setSelectSOModal] = useState(false);
  const [jobberSelectionMap, setJobberSelectionMap] = useState({});
  const [selectedRows, setSelectedRows] = useState([]);
  const [bomModalVisible, setBomModalVisible] = useState(false);
  const [currentBomRow, setCurrentBomRow] = useState(null);
  const [MerchandiserOptions, setMerchandiserOptions] = useState([]);
  const [setOfNewlyAddedStockSfg, setSetOfNewlyAddedStockSfg] = useState(
    new Set()
  );

  useEffect(() => {
    // console.log(1);
    const handleBeforeUnload = (e) => {
      if (setOfNewlyAddedStockSfg.size > 0) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    if (setOfNewlyAddedStockSfg.size > 0) {
      window.addEventListener("beforeunload", handleBeforeUnload);
    }

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [setOfNewlyAddedStockSfg]);

  const fetchConvertId = async () => {
    // console.log(formData.group, selectedData.design_number);
    if (!formData.group || !selectedData?.design_number) {
      toast.error("Please select group and design number to get convert id");
      return;
    }
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/internal-sales-order-entry/get-convert-id`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            group: formData.group,
            design_number: selectedData?.design_number,
          },
        }
      );
      if (!response.data || !response.data.convertIds)
        toast.error("Error at getting convert id");
      else {
        // console.log(response.data.convertIds);
        const updatedConvertIds = response.data.convertIds.map((item) => ({
          id: item?.id,
          so_id: item?.so_id,
          design_number: item?.design_number?.design_number,
          quantity: item?.qty,
          remaining_quantity: item?.remaining_qty,
          order_date: item?.order_date,
          order_status: item?.order_status,
        }));
        setConvertIdDatas(updatedConvertIds);
      }
    } catch (error) {
      console.log("Error at getting convert id", error);
      toast.error(
        error?.response?.data?.error?.message || "Error at getting convert id"
      );
    }
  };

  const fetchSFGStock = async () => {
    try {
      const stock = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/custom/getAllStockSfg`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const sfgStock = stock?.data?.data?.map((entry) => ({
        semi_finished_goods_master: entry?.semi_finished_goods_master?.id,
        color: entry?.color?.id,
        qty: entry?.qty,
        process: entry?.processes,
      }));
      console.log(sfgStock);
      setSfgStock(sfgStock);
    } catch (error) {
      console.log(error);
      toast.error(
        error?.response?.data?.error?.message || "Error at getting SFG stock"
      );
    }
  };

  const fetchPageData = async () => {
    try {
      const [availableRawMaterial, availableJobbers, allStock, allSFGStock] =
        await Promise.all([
          axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/api/custom/all-raw-material`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          ),
          axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/api/jobber-master/custom/all-jobber`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          ),
          axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/api/custom/getAllStock`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          ),
          axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/api/custom/getAllStockSfg`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          ),
        ]);
      const rawMaterials = availableRawMaterial?.data?.map((entry) => ({
        item_name: entry.item_name,
        price_per_unit: entry.price_per_unit,
        unit: entry.unit?.unit_name || null,
        color: entry.color?.color_name || null,
        group: entry.group?.group_name || null,
        hsn_sac_code: entry.hsn_sac_code?.hsn_sac_code || null,
        id: entry.id,
      }));
      const jobbers = availableJobbers?.data?.map((entry) => ({
        jobber_name: entry.jobber_name,
        jobber_id: entry.jobber_id,
        work_type: entry.work_type,
        jobber_address: entry.jobber_address,
        id: entry.id,
      }));
      const stock = allStock?.data?.data?.map((entry) => ({
        raw_material: entry?.raw_material_master?.id,
        stock: entry?.Total_Qty,
      }));
      const sfgStock = allSFGStock?.data?.data?.map((entry) => ({
        semi_finished_goods_master: entry?.semi_finished_goods_master?.id,
        color: entry?.color?.id,
        qty: entry?.qty,
        process: entry?.processes,
      }));
      // console.log(allStock,stock)
      setStockList(stock);
      setRawMateralList(rawMaterials);
      setJobberList(jobbers);
      setSfgStock(sfgStock);
    } catch (error) {
      console.log(error);
      toast.error(
        error?.response?.data?.error?.message || "Failed to fetch data."
      );
    }
  };

  useEffect(() => {
    fetchPageData();
  }, [refresh]);

  useEffect(() => {
    const map = new Map();

    sfgStock.forEach((item) => {
      const { color, semi_finished_goods_master, qty } = item;

      // create a unique key based on both fields
      const key = `${color}|${semi_finished_goods_master}`;

      // add qty to existing or set initial
      map.set(key, (map.get(key) || 0) + qty);
    });

    setSfgStockCategories(map);
  }, [sfgStock]);

  useEffect(() => {
    if (
      !load &&
      availableDesignMaster &&
      Array.isArray(availableDesignMaster)
    ) {
      // console.log(availableDesignMaster);
      const formattedData = availableDesignMaster.map((item) => ({
        id: item.id,
        design_number: item.design_number,
        group_name: item.design_group?.group_name,
        colour_name: item.color?.color_name,
      }));
      setFormattedDesignMasters(formattedData);
      // console.log(formattedDesignMasters)
    }
  }, [load, availableDesignMaster]);

  useEffect(() => {
    setSelectedConvertIdData({});
    setSelectedConvertIdRow();
    formData.convert_id = "";
    if (!selectedData) return;
    if (Object.keys(selectedData).length > 0) {
      setShowDesignTable(false);
      setShowTables(true);
    } else {
      setShowTables(false);
    }
  }, [selectedData]);

  async function fetchDetails(id) {
    if (!id) {
      toast.error("Invalid Data");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/internal-sales-order-entry/edit/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(res.data);
      setFormData((prev) => ({
        ...prev,
        processor: res?.data?.processor?.id,
        merchandiser: res?.data?.merchandiser?.id,
        remark: res?.data?.remark,
        goods_received_remark: res?.data?.goods_received_remark,
      }));
      setOrder_items(res.data?.order_items)
      const exta_bom = res?.data?.extra_bom_so[0]?.Extra_bom || [];
      const transformedData = exta_bom?.map((entry) => ({
        semi_finished_goods:
          entry.semi_finished_goods?.semi_finished_goods_name || "",
        qty: Number(entry.qty),
        total_price: Number(entry.total_price),
        sfg_description: entry.sfg_description || "",
        color: entry?.color?.color_name,
        unit: entry?.unit?.unit_name,
        raw_material_bom: (entry.raw_material_bom || []).map((rm) => ({
          raw_material_id: rm.raw_material_master?.id || "",
          raw_material_master: rm.raw_material_master?.item_name || "",
          rm_qty: rm.rm_qty || 1,
          color: rm.raw_material_master?.color?.color_name || "",
          price_per_unit: rm.raw_material_master?.price_per_unit || "",
          unit: rm.raw_material_master?.unit?.unit_name || "",
          new_sfg: false,
        })),
        jobber_master_sfg: (entry.jobber_master_sfg || []).map((jobber) => ({
          jobber_master: jobber.jobber_master?.jobber_name || "",
          jobber_rate: jobber.jobber_rate || 0,
          jobber_work_type: jobber.jobber_work_type || "",
          jobber_description: jobber.jobber_description || "",
          jobber_id: jobber.jobber_master?.jobber_id || "",
          jobber_address: jobber.jobber_master?.jobber_address || "",
          completed: jobber?.completed,
        })),
        color: entry.color,
        bom_status: entry?.bom_status,
        new_sfg: false,
        stock_status: entry?.stock_status,
        fromStock: entry?.fromStock,
      }));
      setAllSavedSemiFinishedGoods(transformedData);
      const savedData = exta_bom?.map((entry) => ({
        semi_finished_goods: entry?.semi_finished_goods?.id,
        qty: Number(entry?.qty),
        color: entry?.color?.id,
        processes: entry?.processes.map((item) => ({
          process: item?.process,
          jobber: item?.jobber?.id,
        })),
        bom_status: entry?.bom_status,
        total_price: Number(entry?.total_price),
        sfg_description: entry?.sfg_description,
        raw_material_bom: entry?.raw_material_bom.map((rm) => ({
          raw_material_master: rm?.raw_material_master?.id,
          rm_qty: rm?.rm_qty,
        })),
        jobber_master_sfg: entry?.jobber_master_sfg.map((jobber) => ({
          jobber_master: jobber?.jobber_master?.id,
          jobber_rate: jobber?.jobber_rate,
          jobber_work_type: jobber?.jobber_work_type,
          jobber_description: jobber?.jobber_description,
          completed: jobber?.completed,
        })),
      }));
      setAllSemiFinishedGoods(savedData);
      setsfglist(exta_bom.map((item) => item?.semi_finished_goods));
    } catch (error) {
      console.error("Error fetching design details:", error);
      toast.error(
        error?.response?.data?.error?.message || "Error fetching convert ID"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!selectedConvertIdData || !Object.keys(selectedConvertIdData).length)
      return;
    // console.log(selectedConvertIdData);
    setShowConvertIdTable(false);
    fetchDetails(selectedConvertIdData?.id);
  }, [selectedConvertIdData]);

  useEffect(() => {
    if (load || !userList || !Array.isArray(userList)) return;
    const nonAdminUsers = userList.filter(
      (user) =>
        user.designation !== "Admin" && user.designation !== "Merchandiser"
    );
    const merchant = userList.filter(
      (user) => user.designation === "Merchandiser"
    );
    setMerchandiserOptions(merchant);
    setProcessorOptions(nonAdminUsers);
  }, [load, userList]);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }
  // console.log(allSemiFinishedGoods);

  function updateOrderItemStatus(orderItems) {
    const updatedItems = {};

    for (const key in orderItems) {
      const item = orderItems[key];

      const allEmpty = Object.entries(item).every(([field, value]) => {
        // Skip status field
        if (field === "status") return true;

        const isEmpty =
          value === null ||
          value === undefined ||
          (typeof value === "string" && value.trim() === "");

        return isEmpty;
      });

      updatedItems[key] = {
        ...item,
        status: !allEmpty,
      };
    }

    return updatedItems;
  }

  const handleSubmitInternalSalesOrder = async () => {
    if (!token) {
      navigate("/login");
    }
    setsubmitting(true);
    try {
      const extrabomso = allSemiFinishedGoods.map((item, ind) => ({
        ...item,
        stock_status: SFGStatusStock[ind],
        qty: item.qty,
      }));
      const postData = {
        data: {
          customer: formData.customer,
          so_id: formData.so_id,
          group: formData.group,
          qty: formData.qty,
          order_no: formData.order_no,
          design_number: selectedData?.id,
          order_date: formData.order_date,
          delivery_date: formData.delivery_date,
          processor: formData.processor,
          remark: formData.remark,
          goods_received_remark: formData.goods_received_remark,
          order_items: updateOrderItemStatus(order_items),
          merchandiser: formData.merchandiser,
          remaining_qty: Number(formData.qty),
          extra_bom_so: [{ Extra_bom: extrabomso }],
        },
      };
      console.log(postData);
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/internal-sales-oder-entries/custom-create`,
        postData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response || !response.data) {
        toast.error("Error at creating Sales Order");
      } else {
        toast.success("Internal Sales Order created successfully");
        const reduceStock = approvedSFG.map((item) =>
          item?.raw_material_bom?.map((rm) => ({
            raw_material_master: rm.raw_material_id,
            qty: rm.total_rm_qty,
          }))
        );

        const reduce = reduceStock.flat();
        // console.log(reduce);
        if (reduce.length > 0 && !selectedConvertIdData?.so_id) {
          await axios.post(
            `${process.env.REACT_APP_BACKEND_URL}/api/custom/redact-stock-inBulk`,
            reduce,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          toast.success("Stock updated successfully");
        }
        navigate(`/sales-order-report/report/internal/${response.data.id}`);
      }
    } catch (error) {
      console.log("Error at creating Sales Order", error);
      toast.error(
        error?.response?.data?.error?.message ||
        "Error at creating Sales Order Entry"
      );
    } finally {
      setsubmitting(false);
    }
  };

  const handleSubmitSalesOrder = async () => {
    if (!token) {
      navigate("/login");
    }
    setsubmitting(true);
    try {
      const extrabomso = allSemiFinishedGoods.map((item, ind) => ({
        ...item,
        stock_status: selectedConvertIdData?.so_id ? true : SFGStatusStock[ind],
        qty: item.qty * formData.qty,
      }));
      const postData = {
        data: {
          so_id: formData.so_id,
          convert_id: selectedConvertIdData?.so_id || "",
          group: formData.group,
          qty: formData.qty,
          customer: formData.customer,
          order_no: formData.order_no,
          design_number: selectedData?.id,
          order_date: formData.order_date,
          delivery_date: formData.delivery_date,
          processor: formData.processor,
          remark: formData.remark,
          merchandiser: formData.merchandiser,
          goods_received_remark: formData.goods_received_remark,
          order_items: updateOrderItemStatus(order_items),
          extra_bom_so: [{ Extra_bom: extrabomso }],
        },
      };
      // console.log(postData);
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/sales-oder-entries/custom-create`,
        postData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // console.log(response);

      if (!response || !response.data) {
        toast.error("Error at creating Sales Order");
      } else {
        toast.success("Sales Order created successfully");
        const reduceStock = approvedSFG.map((item) =>
          item?.raw_material_bom?.map((rm) => ({
            raw_material_master: rm.raw_material_id,
            qty: rm.total_rm_qty,
          }))
        );

        const reduce = reduceStock.flat();
        // console.log(reduce);
        if (reduce.length > 0 && !selectedConvertIdData?.so_id) {
          await axios.post(
            `${process.env.REACT_APP_BACKEND_URL}/api/custom/redact-stock-inBulk`,
            reduce,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          toast.success("Stock updated successfully");
        }
        if (selectedConvertIdData?.so_id) {
          navigate(`/sales-order-report/report/internal/${response.data.id}`);
        } else
          navigate(`/sales-order-report/report/external/${response.data.id}`);
      }
    } catch (error) {
      console.log("Error at creating Sales Order", error);
      toast.warn("Order id already taken by order. Please re-select the customer to generate new SO ID")
    } finally {
      // setLoading(false);
      setsubmitting(false);
    }
  };
  // console.log(allSemiFinishedGoods,allSavedSemiFinishedGoods);

  useEffect(() => {
    // console.log(selectedConvertIdData);
    if (!isAdmin && selectedConvertIdData.so_id)
      setFormData({ ...formData, qty: 1 });
  }, [selectedConvertIdData, isAdmin]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.so_id ||
      !formData.group ||
      !formData.qty ||
      !formData.delivery_date ||
      !formData.order_date ||
      !formData.processor
    ) {
      toast.error("Enter required Fields");
      return;
    }
    try {
      if (isAdmin) {
        const res = await handleSubmitInternalSalesOrder();
        // console.log("Res from internal", res);
      } else {
        const res2 = await handleSubmitSalesOrder();
        // console.log("Res from external", res2);
      }
      setChangeSoid(!changeSoid);
    } catch (error) {
      console.log("Error at creating Sales Order Entry", error);
    }
  };
  async function GenerateSoid() {
    // e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/sales-order-entry/generate-soid`
      );
      if (!response || !response.data) {
        toast.error("Error at generating SO Id");
      } else {
        setFormData((prevData) => ({
          ...prevData,
          so_id: response?.data?.SOID,
        }));
      }
    } catch (error) {
      console.log("Error at generating SO Id", error);
      toast.error("Error at generating SO Id");
    } finally {
      setLoading(false);
    }
  }

  async function GenerateSoidInternal(e) {
    // e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/sales-order-entry/generate-soid`
      );
      if (!response || !response.data) {
        toast.error("Error at generating SO Id");
      } else {
        setFormData((prevData) => ({
          ...prevData,
          so_id: response?.data?.SOID,
        }));
      }
    } catch (error) {
      console.log("Error at generating SO Id", error);
      toast.error("Error at generating SO Id");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let isCustomerAdmin = false;
    if (formData.customer === process.env.REACT_APP_CUSTOMER_ADMIN_ID) {
      isCustomerAdmin = true;
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
    if (!formData.customer) return;
    if (isCustomerAdmin) formData.convert_id = "";
    if (!isCustomerAdmin) GenerateSoid();
    else GenerateSoidInternal();
  }, [formData.customer]);

  useEffect(() => {
    // setAllSavedSemiFinishedGoods((prev)=>prev.map((item)=>({...item,total_order_qty: item.})))
    if (
      !allSavedSemiFinishedGoods ||
      !Array.isArray(allSavedSemiFinishedGoods) ||
      allSavedSemiFinishedGoods.length == 0
    )
      return;
    setAllSavedSemiFinishedGoods((prev) =>
      prev.map((itemp) => ({
        ...itemp,
        raw_material_bom: itemp?.raw_material_bom?.map((itemm) => ({
          ...itemm,
          total_rm_qty: itemm?.rm_qty * (formData.qty || 0),
        })),
      }))
    );
  }, [formData.qty, allSemiFinishedGoods]);

  useEffect(() => {
    formData.design_number = "";
    setShowDesignTable(false);
    setSelectedData({});
    setSelectedRow();
  }, [formData.group]);

  const clearHandler = (e) => {
    e.preventDefault();
    setRefresh(!refresh);
    setAllSavedSemiFinishedGoods([]);
    setAllSemiFinishedGoods([]);
    setFormData({
      so_id: "",
      convert_id: "",
      group: "",
      qty: 0,
      customer: "",
      order_no: "",
      design_number: "",
      order_date: "",
      delivery_date: "",
      processor: "",
      remark: "",
      goods_received_remark: "",
    });
    setSelectedRow();
    setSelectedData({});
    setShowDesignTable(false);
    setShowTables(false);
    setOrder_items({
      LH: {
        colour: "",
        khaka: "",
        measurement: "",
        work: "",
        others: "",
      },
      BP: {
        colour: "",
        khaka: "",
        measurement: "",
        work: "",
        others: "",
      },
      DUP1: {
        colour: "",
        khaka: "",
        measurement: "",
        work: "",
        others: "",
      },
      DUP2: {
        colour: "",
        khaka: "",
        measurement: "",
        work: "",
        others: "",
      },
      Others: {
        colour: "",
        khaka: "",
        measurement: "",
        work: "",
        others: "",
      },
    });
  };
  // console.log(allSemiFinishedGoods,allSavedSemiFinishedGoods)


  console.log("formData: ", formData);

  if ((load && !error) || fetchingData || loading) {

    return (
      <div className="flex justify-center items-center h-screen">
        <BounceLoader color="#1e3a8a" />
      </div>
    )
  }

  return (
    <div className="p-6 rounded-lg bg-white">
      <h1 className="text-2xl font-bold text-blue-900 mb-4 pb-2 border-b">
        Sales Order Entry
      </h1>
      {showEditSfgModal && (

        <div className="fixed inset-0 bg-gray-900 backdrop-blur-md bg-opacity-50 flex justify-center items-center z-40 rounded-lg animate-fade-in">

          <div className="fixed w-[70vw] h-[80vh] overflow-auto p-5 border border-gray-400 bg-white rounded-xl">
            <div className="flex justify-between  items-center mb-4 pb-2 border-b border-gray-300">
              <h3 className="text-xl font-bold text-blue-900 ">Update Semi Finished Goods</h3>
              <p
                className=" text-red-500 rounded hover:text-red-700 duration-200 hover:scale-100 transition-all ease-in-out cursor-pointer"
                onClick={() => {
                  setShowEditSfgModal(!showEditSfgModal);
                }}
              >
                <MdCancel className="w-8 h-8" />
              </p>
            </div>
            <EditSfgComponent
              index={selectedSFGindex}
              token={token}
              allJobber={jobberList}
              allRawMaterial={RawMaterialList}
              sfgmGroup={availableSfgmGroups}
              dataDesign={designData}
              allSemiFinishedGoods={allSemiFinishedGoods}
              allSavedSemiFinishedGoods={allSavedSemiFinishedGoods}
              setAllSavedSemiFinishedGoods={setAllSavedSemiFinishedGoods}
              setAllSemiFinishedGoods={setAllSemiFinishedGoods}
              sfglist={sfglist}
              setShowEditSfgModal={setShowEditSfgModal}
            />
          </div>
        </div>
      )}
      {showDesignTable && (

        <div className="fixed inset-0 bg-gray-900 backdrop-blur-md bg-opacity-50 flex justify-center items-center z-40 animate-fade-in">

          <div className="fixed w-[80vw] p-5 border border-gray-400 bg-gray-100 rounded-xl">
            <div className="flex justify-between items-center pb-2  border-b">
              <h3 className="text-xl font-bold text-blue-900  ">Select Design</h3>
              <p
                className="text-xl border px-2 bg-red-600 rounded-full text-white hover:bg-red-400 cursor-pointer"
                onClick={() => {
                  setShowDesignTable(!showDesignTable);
                }}
              >
                X
              </p>
            </div>
            <SingleAddTable
              data={formattedDesignMasters}
              setSelectedData={setSelectedData}
              setSelectedRow={setSelectedRow}
              NoOfColumns={NoOfColumns}
              headers={headersForDesignTable}
            />
          </div>
        </div>
      )}

      {showConvertIdTable && (
        <div className="fixed inset-0 bg-gray-900 backdrop-blur-md bg-opacity-50 flex justify-center items-center z-40 animate-fade-in">

          <div className="fixed w-[80vw] z-10 bg-gray-100 border rounded-xl p-5">
            <div className="flex justify-between items-center pb-2 border-b">
              <h3 className="text-xl font-bold text-blue-900">Select Convert ID</h3>
              <p
                className="text-xl px-2 border bg-red-600 rounded-full text-white hover:bg-red-500 cursor-pointer"
                onClick={() => {
                  setShowConvertIdTable(!showConvertIdTable);
                }}
              >
                X
              </p>
            </div>
            <SingleAddTable
              data={convertIdDatas}
              setSelectedData={setSelectedConvertIdData}
              setSelectedRow={setSelectedConvertIdRow}
              NoOfColumns={headersforConvertId.length}
              headers={headersforConvertId}
            />
          </div>
        </div>
      )}

      {/* Add other BOM in current one  */}
      {showAddBomModal && (
        <BOMSection
          showAddBomModal={showAddBomModal}
          setShowAddBomModal={setShowAddBomModal}
          token={token}
          allJobber={jobberList}
          allRawMaterial={RawMaterialList}
          sfgmGroup={availableSfgmGroups}
          dataDesign={designData}
          allSemiFinishedGoods={allSemiFinishedGoods}
          allSavedSemiFinishedGoods={allSavedSemiFinishedGoods}
          setAllSavedSemiFinishedGoods={setAllSavedSemiFinishedGoods}
          setAllSemiFinishedGoods={setAllSemiFinishedGoods}
          sfglist={sfglist}
          setsfglist={setsfglist}
        />
      )}

      {addSfgModal && (
        <ExtraBOMSfgCreate
          onClose={() => setAddSfgModal(false)}
          so_id={formData?.so_id}
          // type={type}
          setSOViewModal={setSOViewModal}
          // id={id}
          setSalesOrder={setSalesOrder}
          setBom={setBom}
          setSelectSOModal={setSelectSOModal}
          // company={company}
          setFormData={setFormData}
          setAllSemiFinishedGoods={setAllSemiFinishedGoods}
          setAllSavedSemiFinishedGoods={setAllSavedSemiFinishedGoods}
          setsfglist={setsfglist}
          fetchSFGStock={fetchSFGStock}
          setOfNewlyAddedStockSfg={setOfNewlyAddedStockSfg}
          setSetOfNewlyAddedStockSfg={setSetOfNewlyAddedStockSfg}
          allSemiFinishedGoods={allSemiFinishedGoods}
          SalessorderQty={formData.qty}
        />
      )}

      {soViewModal && (
        <div className="my-8 overflow-x-auto animate-fade-in">
          <table className="min-w-full table-auto bg-white shadow-lg rounded-2xl overflow-hidden">
            <thead className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-900">
              <tr>
                <th className="px-6 py-4 text-left font-semibold">#</th>
                <th className="px-6 py-4 text-left font-semibold">
                  Semi-Finished Goods
                </th>
                <th className="px-6 py-4 text-left font-semibold">Color</th>
                <th className="px-6 py-4 text-left font-semibold">Quantity</th>
                <th className="px-6 py-4 text-left font-semibold">
                  Select Jobber
                </th>
                <th className="px-6 py-4 text-left font-semibold">
                  Stock Reduced
                </th>
                <th className="px-6 py-4 text-left font-semibold">Status</th>
                <th className="px-6 py-4 text-left font-semibold">Processes</th>
                <th className="px-6 py-4 text-left font-semibold">Select</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {bom?.Extra_bom?.map((item, index) => {
                // Disable checkbox based on stock_status and bom_status
                const isButtonDisabled =
                  item?.stock_status === false ||
                  [
                    "sendToJobber",
                    "readyToStitch",
                    "SendToStitcher",
                    "completed",
                  ].includes(item?.bom_status);

                return (
                  <tr key={item.id} className="hover:bg-blue-50 transition">
                    <td className="px-6 py-4 text-gray-700">{index + 1}</td>
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                      {item?.semi_finished_goods?.semi_finished_goods_name}
                    </td>
                    <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                      {item?.color?.color_name}
                    </td>
                    <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                      {item?.qty}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white"
                        value={
                          jobberSelectionMap[item.id]?.jobber_master?.id || ""
                        }
                        onChange={(e) => {
                          const selectedJobber = item?.jobber_master_sfg?.find(
                            (jobber) =>
                              jobber?.jobber_master?.id ===
                              parseInt(e.target.value)
                          );

                          if (selectedJobber) {
                            setJobberSelectionMap((prev) => ({
                              ...prev,
                              [item.id]: selectedJobber,
                            }));
                          }
                        }}
                        disabled={isButtonDisabled}
                      >
                        <option value="" disabled>
                          -- Select Jobber --
                        </option>
                        {item?.jobber_master_sfg
                          ?.filter(
                            (jobber) =>
                              jobber.completed === "Incomplete" ||
                              jobber.completed === "Processing"
                          )
                          .map((jobber) => (
                            <option
                              key={jobber.id}
                              value={jobber?.jobber_master?.id}
                            >
                              {jobber?.jobber_master?.id} -{" "}
                              {jobber?.jobber_master?.jobber_name} -{" "}
                              {jobber?.jobber_master?.work_type}
                            </option>
                          ))}
                      </select>
                    </td>

                    <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                      {item?.stock_status === true ? "Yes" : "No"}
                    </td>
                    <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                      {item?.bom_status}
                    </td>

                    <tr key={`${item.id}-process`} className="bg-gray-50">
                      <td
                        colSpan={6}
                        className="px-6 py-4 text-gray-600 whitespace-nowrap"
                      >
                        {item?.processes?.length > 0 ? (
                          <div className="flex gap-4 items-center">
                            <select
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 text-gray-700 cursor-not-allowed"
                              defaultValue="placeholder"
                            >
                              <option value="placeholder" disabled>
                                Process - Done by - Jobber
                              </option>
                              {item?.processes?.map((process, index) => (
                                <option
                                  key={index}
                                  value={process?.process}
                                  disabled
                                >
                                  {process?.process} - Done by -{" "}
                                  {process?.jobber?.jobber_name}
                                </option>
                              ))}
                            </select>
                          </div>
                        ) : (
                          <span className="text-gray-500 italic">
                            No Process Yet
                          </span>
                        )}
                      </td>
                    </tr>

                    {/* Checkbox for row selection */}
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(item.id)}
                        disabled={isButtonDisabled}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedRows((prev) => [...prev, item.id]);
                          } else {
                            setSelectedRows((prev) =>
                              prev.filter((id) => id !== item.id)
                            );
                          }
                        }}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <form
        className="rounded-lg mb-4 "
        onSubmit={handleSubmit}
      >
        <div className="grid grid-cols-2 gap-6 p-2 mb-16">
          {/* Customer */}
          <div className="flex flex-col">
            <FormLabel title={"Customer"} />
            <select
              value={formData.customer}
              name="customer"
              onChange={handleChange}
              className="border border-gray-300 bg-gray-100 rounded-md p-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled selected>
                Select Customer
              </option>
              {availableCustomers &&
                Array.isArray(availableCustomers) &&
                availableCustomers?.length > 0 &&
                availableCustomers.map((item, index) => (
                  <option key={item?.id} value={item?.id}>
                    {item?.company_name}
                  </option>
                ))}
            </select>
          </div>

          {/* SO ID */}
          <FormInput
            type={"text"}
            placeholder={"SO ID"}
            label={"SO ID"}
            value={formData.so_id}
            name={"so_id"}
            onChange={handleChange}
            editable={false}
          />

          {/* Quantity */}
          <FormInput
            type={"number"}
            placeholder={"Quantity"}
            label={"Quantity"}
            onChange={handleChange}
            value={formData.qty}
            name={"qty"}
            editable={isAdmin || (!isAdmin && selectedConvertIdData?.so_id)}
          />

          {/* Group */}
          <div className="flex flex-col">
            <FormLabel title={"Group"} />
            <select
              value={formData.group}
              name="group"
              onChange={handleChange}
              className="border border-gray-300 bg-gray-100 rounded-md p-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled selected>
                Select Design Group
              </option>
              {designGroups &&
                Array.isArray(designGroups) &&
                designGroups?.length > 0 &&
                designGroups.map((item, index) => (
                  <option key={item?.id} value={item?.id}>
                    {item?.group_name}
                  </option>
                ))}
            </select>
          </div>

          {/* Design Number */}
          <div className="flex flex-col">
            <FormLabel title={"Design Number"} />
            <div className="flex gap-2">
              <input
                type="text"
                value={selectedData?.design_number || ""}
                placeholder="Design Number"
                className="w-2/3 bg-gray-100 border broder-gray-300 broder-gray-100 rounded-md p-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                className="bg-blue-900 rounded-lg px-3 hover:bg-blue-800 text-white"
                onClick={(e) => {
                  e.preventDefault();
                  if (!formData.group) {
                    toast.error("Please select group first");
                    return;
                  }
                  setShowDesignTable(!showDesignTable);
                }}
              >
                Choose Design
              </button>
            </div>
          </div>
        </div>

        {showTables && !selectedConvertIdData?.so_id && (
          <div>
            <DesignDetails
              selectedData={selectedData}
              fetchConvertId={fetchConvertId}
              setShowEditTable={setShowEditSfgModal}
              setEditSFGIndex={setSelectedSFGIndex}
              designData={designData}
              setDesignData={setDesignData}
              allSemiFinishedGoods={allSemiFinishedGoods}
              setAllSemiFinishedGoods={setAllSemiFinishedGoods}
              SavedSfgData={allSavedSemiFinishedGoods}
              setSavedSfgData={setAllSavedSemiFinishedGoods}
              addBomData={addBomData}
              setAddBomData={setAddBomData}
              setShowAddBomModal={setShowAddBomModal}
              stockList={stockList}
              setapprovedsfg={setApprovedSFG}
              setSFGstatusStock={setSFGstatusStock}
              setsfglist={setsfglist}
              sfgStock={sfgStock}
              sfgStockCategories={sfgStockCategories}
              sfglist={sfglist}
              fetchSFGStock={fetchSFGStock}
              setSetOfNewlyAddedStockSfg={setSetOfNewlyAddedStockSfg}
              setOfNewlyAddedStockSfg={setOfNewlyAddedStockSfg}
              SalesOrderQty={formData.qty}
            />
            <button
              className="my-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:scale-100 hover:shadow-2xl transition-all duration-300 ease-in-out flex items-center gap-2"
              onClick={() => setAddSfgModal(true)}
              type="button"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.75v14.5M4.75 12h14.5"
                />
              </svg>
              Add SFG from Stock
            </button>
          </div>
        )}

        {selectedConvertIdData?.so_id && (
          <ConvertIDSfgDataTable
            allSavedSemiFinishedGoods={allSavedSemiFinishedGoods}
            allSemiFinishedGoods={allSemiFinishedGoods}
            sfglist={sfglist}
            convertId={selectedConvertIdData?.so_id}
          />
        )}

        <div className="grid grid-cols-2 gap-6 p-2 mb-16">
          {/* Convert ID */}

          <div className="flex flex-col">
            <FormLabel title={"Convert ID"} />
            <div className="flex gap-2">
              <input
                type="text"
                value={selectedConvertIdData?.so_id || ""}
                placeholder="Convert ID"
                className="w-2/3 bg-gray-100 border broder-gray-300 broder-gray-100 rounded-md p-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                className="bg-blue-900 rounded-lg px-3 hover:bg-blue-800 text-white"
                disabled={isAdmin}
                onClick={(e) => {
                  e.preventDefault();
                  if (!selectedData || !formData.group) {
                    toast.error("Please select group and Design number first");
                    return;
                  }
                  setShowConvertIdTable(!showConvertIdTable);
                }}
              >
                Choose Convert ID
              </button>
            </div>
          </div>

          {/* Order Number */}
          <FormInput
            type={"text"}
            placeholder={"Order Number"}
            label={"Order Number"}
            onChange={handleChange}
            value={formData.order_no}
            name={"order_no"}
          />

          {/* Order Date */}
          <FormInput
            type={"date"}
            placeholder={"Order Date"}
            label={"Order Date"}
            value={formData.order_date}
            onChange={handleChange}
            name={"order_date"}
          />

          {/* Processor */}
          <div className="flex flex-col">
            <FormLabel title={"Processor"} />
            <select
              value={formData.processor}
              name="processor"
              onChange={handleChange}
              disabled={selectedConvertIdData?.so_id}
              className="border border-gray-300 bg-gray-100 rounded-md p-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled selected>
                Select Processor
              </option>
              {processorOptions &&
                Array.isArray(processorOptions) &&
                processorOptions.map((item, index) => (
                  <option key={item?.id} value={item?.id}>
                    {item?.name + " - " + item?.designation}
                  </option>
                ))}
            </select>
          </div>

          {/* Merchandiser */}
          <div className="flex flex-col">
            <FormLabel title={"Merchandiser"} />
            <select
              value={formData.merchandiser}
              name="merchandiser"
              onChange={handleChange}
              disabled={selectedConvertIdData?.so_id}
              className="border border-gray-300 bg-gray-100 rounded-md p-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled selected>
                Select Merchandiser
              </option>
              {MerchandiserOptions &&
                Array.isArray(MerchandiserOptions) &&
                MerchandiserOptions.map((item, index) => (
                  <option key={item?.id} value={item?.id}>
                    {item?.name + " - " + item?.designation}
                  </option>
                ))}
            </select>
          </div>

          {/* Delivery Date */}
          <FormInput
            type={"date"}
            placeholder={"Delivery Date"}
            label={"Delivery Date"}
            value={formData.delivery_date}
            onChange={handleChange}
            name={"delivery_date"}
          />

          {/* Remarks */}
          <div className="flex flex-col">
            <FormLabel title={"SO Remarks"} />
            <textarea
              className="border border-gray-300 bg-gray-100 rounded-md p-2 h-40 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              placeholder="Remarks"
              value={formData.remark}
              onChange={handleChange}
              name="remark"
            ></textarea>
          </div>

          {/* Goods Received Remarks */}
          <div className="flex flex-col">
            <FormLabel title={"Goods receieved remarks"} />
            <textarea
              className="border border-gray-300 bg-gray-100 rounded-md p-2 h-40 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              placeholder="Goods Received Remarks"
              value={formData.goods_received_remark}
              onChange={handleChange}
              name="goods_received_remark"
            ></textarea>
          </div>

          {/* Table */}
          <div className="col-span-2 border rounded border-gray-300">
            <table className="w-full border-collapse border border-gray-300">
              {/* Table Header */}
              <thead>
                <tr className="text-blue-500 bg-gray-200">
                  <th className="border border-gray-300 px-4 py-2">Group</th>
                  <th className="border border-gray-300 px-4 py-2">Colour</th>
                  <th className="border border-gray-300 px-4 py-2">
                    Design/Khaka
                  </th>
                  <th className="border border-gray-300 px-4 py-2">
                    Measurement
                  </th>
                  <th className="border border-gray-300 px-4 py-2">Work</th>
                  <th className="border border-gray-300 px-4 py-2">Others</th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody>
                {/* LH */}
                <tr className="hover:bg-gray-100">
                  <td className="border border-gray-300 px-4 py-2">LH:</td>
                  <td className="border border-gray-300 px-4 py-2">
                    <input
                      type="text"
                      value={order_items.LH.colour}
                      onChange={(e) =>
                        updateField("LH", "colour", e.target.value)
                      }
                      className="w-full bg-gray-100 border border-gray-300 rounded-md p-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <input
                      type="text"
                      value={order_items.LH.khaka}
                      onChange={(e) =>
                        updateField("LH", "khaka", e.target.value)
                      }
                      className="w-full bg-gray-100 border border-gray-300 rounded-md p-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <input
                      type="text"
                      value={order_items.LH.measurement}
                      onChange={(e) =>
                        updateField("LH", "measurement", e.target.value)
                      }
                      className="w-full bg-gray-100 border border-gray-300 rounded-md p-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {" "}
                    <input
                      type="text"
                      value={order_items.LH.work}
                      onChange={(e) =>
                        updateField("LH", "work", e.target.value)
                      }
                      className="w-full bg-gray-100 border border-gray-300 rounded-md p-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {" "}
                    <input
                      type="text"
                      value={order_items.LH.others}
                      onChange={(e) =>
                        updateField("LH", "others", e.target.value)
                      }
                      className="w-full bg-gray-100 border border-gray-300 rounded-md p-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </td>
                </tr>

                {/* BP */}
                <tr className="hover:bg-gray-100">
                  <td className="border border-gray-300 px-4 py-2">BP:</td>
                  <td className="border border-gray-300 px-4 py-2">
                    <input
                      type="text"
                      value={order_items.BP.colour}
                      onChange={(e) =>
                        updateField("BP", "colour", e.target.value)
                      }
                      className="w-full bg-gray-100 border border-gray-300 rounded-md p-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <input
                      type="text"
                      value={order_items.BP.khaka}
                      onChange={(e) =>
                        updateField("BP", "khaka", e.target.value)
                      }
                      className="w-full bg-gray-100 border border-gray-300 rounded-md p-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <input
                      type="text"
                      value={order_items.BP.measurement}
                      onChange={(e) =>
                        updateField("BP", "measurement", e.target.value)
                      }
                      className="w-full bg-gray-100 border border-gray-300 rounded-md p-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {" "}
                    <input
                      type="text"
                      value={order_items.BP.work}
                      onChange={(e) =>
                        updateField("BP", "work", e.target.value)
                      }
                      className="w-full bg-gray-100 border border-gray-300 rounded-md p-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {" "}
                    <input
                      type="text"
                      value={order_items.BP.others}
                      onChange={(e) =>
                        updateField("BP", "others", e.target.value)
                      }
                      className="w-full bg-gray-100 border border-gray-300 rounded-md p-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </td>
                </tr>

                {/* DUP1 */}
                <tr className="hover:bg-gray-100">
                  <td className="border border-gray-300 px-4 py-2">DUP1:</td>
                  <td className="border border-gray-300 px-4 py-2">
                    <input
                      type="text"
                      value={order_items.DUP1.colour}
                      onChange={(e) =>
                        updateField("DUP1", "colour", e.target.value)
                      }
                      className="w-full bg-gray-100 border border-gray-300 rounded-md p-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <input
                      type="text"
                      value={order_items.DUP1.khaka}
                      onChange={(e) =>
                        updateField("DUP1", "khaka", e.target.value)
                      }
                      className="w-full bg-gray-100 border border-gray-300 rounded-md p-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <input
                      type="text"
                      value={order_items.DUP1.measurement}
                      onChange={(e) =>
                        updateField("DUP1", "measurement", e.target.value)
                      }
                      className="w-full bg-gray-100 border border-gray-300 rounded-md p-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {" "}
                    <input
                      type="text"
                      value={order_items.DUP1.work}
                      onChange={(e) =>
                        updateField("DUP1", "work", e.target.value)
                      }
                      className="w-full bg-gray-100 border border-gray-300 rounded-md p-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {" "}
                    <input
                      type="text"
                      value={order_items.DUP1.others}
                      onChange={(e) =>
                        updateField("DUP1", "others", e.target.value)
                      }
                      className="w-full bg-gray-100 border border-gray-300 rounded-md p-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </td>
                </tr>

                {/* DUP2 */}
                <tr className="hover:bg-gray-100">
                  <td className="border border-gray-300 px-4 py-2">DUP2:</td>
                  <td className="border border-gray-300 px-4 py-2">
                    <input
                      type="text"
                      value={order_items.DUP2.colour}
                      onChange={(e) =>
                        updateField("DUP2", "colour", e.target.value)
                      }
                      className="w-full bg-gray-100 border border-gray-300 rounded-md p-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <input
                      type="text"
                      value={order_items.DUP2.khaka}
                      onChange={(e) =>
                        updateField("DUP2", "khaka", e.target.value)
                      }
                      className="w-full bg-gray-100 border border-gray-300 rounded-md p-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <input
                      type="text"
                      value={order_items.DUP2.measurement}
                      onChange={(e) =>
                        updateField("DUP2", "measurement", e.target.value)
                      }
                      className="w-full bg-gray-100 border border-gray-300 rounded-md p-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {" "}
                    <input
                      type="text"
                      value={order_items.DUP2.work}
                      onChange={(e) =>
                        updateField("DUP2", "work", e.target.value)
                      }
                      className="w-full bg-gray-100 border border-gray-300 rounded-md p-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {" "}
                    <input
                      type="text"
                      value={order_items.DUP2.others}
                      onChange={(e) =>
                        updateField("DUP2", "others", e.target.value)
                      }
                      className="w-full bg-gray-100 border border-gray-300 rounded-md p-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </td>
                </tr>
                {/* Other */}
                <tr className="hover:bg-gray-100">
                  <td className="border border-gray-300 px-4 py-2">Others:</td>
                  <td className="border border-gray-300 px-4 py-2">
                    <input
                      type="text"
                      value={order_items.Others.colour}
                      onChange={(e) =>
                        updateField("Others", "colour", e.target.value)
                      }
                      className="w-full bg-gray-100 border border-gray-300 rounded-md p-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <input
                      type="text"
                      value={order_items.Others.khaka}
                      onChange={(e) =>
                        updateField("Others", "khaka", e.target.value)
                      }
                      className="w-full bg-gray-100 border border-gray-300 rounded-md p-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <input
                      type="text"
                      value={order_items.Others.measurement}
                      onChange={(e) =>
                        updateField("Others", "measurement", e.target.value)
                      }
                      className="w-full bg-gray-100 border border-gray-300 rounded-md p-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {" "}
                    <input
                      type="text"
                      value={order_items.Others.work}
                      onChange={(e) =>
                        updateField("Others", "work", e.target.value)
                      }
                      className="w-full bg-gray-100 border border-gray-300 rounded-md p-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {" "}
                    <input
                      type="text"
                      value={order_items.Others.others}
                      onChange={(e) =>
                        updateField("Others", "others", e.target.value)
                      }
                      className="w-full bg-gray-100 border border-gray-300 rounded-md p-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* button */}
          <div className="col-span-2 flex justify-end mt-4 gap-4">
            <button
              onClick={clearHandler}
              type="button"
              className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-600 hover:text-white transition"
            >
              Clear
            </button>
            <button
              type="submit"
              className={`bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-800 hover:text-white transition duration-200 ease-in-out
              `}
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
        </div>
      </form>
    </div>
  );
};

export default SalesOrderEntry;
