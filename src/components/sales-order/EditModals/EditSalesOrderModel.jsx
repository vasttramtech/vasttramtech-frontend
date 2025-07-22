import { useEffect, useState } from "react";
import FormLabel from "../../purchase/FormLabel";
import FormInput from "../../utility/FormInput";
import SingleAddTable from "../../../smartTable/SingleAddTable";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { BounceLoader, PuffLoader } from "react-spinners";
import { useNavigate, useParams } from "react-router-dom";
import EditSfgComponent from "./EditSfgComponent";
import BOMSection from "./BOMSection";
import DesignDetails from "./DesignDetails";
import ExtraBOMSfg from "./ExtraBOMSfg";
import ExtraBOMSfgCreate from "../component/ExtraBOMSfgCreate";
import { ChevronLeft } from "lucide-react";

const EditSalesOrderModel = () => {
  const { token } = useSelector((state) => state.auth);
  const { type, id } = useParams();
  const [loading, setLoading] = useState(false);
  const [availableDesignMaster, setAvailableDesignMaster] = useState([]);
  const [fetchingData, setFetching] = useState(false);
  const [approvedSFG, setApprovedSFG] = useState([]);
  const [data, setData] = useState(null);
  const { designGroups, load, error, userList, availableSfgmGroups } =
    useSelector((state) => state.fetchData);
  const [extra_bom_so, setExtra_bom_so] = useState([]);
  const [extra_bom_so_initial, setExtra_bom_so_initial] = useState([]);

  const [formData, setFormData] = useState({
    so_id: "",
    convert_id: "",
    group: "",
    qty: 0,
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
    "Quanity",
    "Remaining Quantity",
    "Stock order Status",
  ]);

  const [covertIds, setConvertIds] = useState([]);
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
  const [refresh, setRefresh] = useState(false);
  const [SFGStatusStock, setSFGstatusStock] = useState();
  const [addBomData, setAddBomData] = useState({});
  const [showAddBomModal, setShowAddBomModal] = useState(false);
  const [sfglist, setsfglist] = useState([]);
  const [sfgStock, setSfgStock] = useState([]);
  const [sfgStockCategories, setSfgStockCategories] = useState(new Map());
  const [addSfgModal, setAddSfgModal] = useState(false);
  const [soViewModal, setSOViewModal] = useState(false);
  const [salesOrder, setSalesOrder] = useState([]);
  const [bom, setBom] = useState(null);
  const [selectSOModal, setSelectSOModal] = useState(false);
  const [jobberSelectionMap, setJobberSelectionMap] = useState({});
  const [selectedRows, setSelectedRows] = useState([]);
  const [bomModalVisible, setBomModalVisible] = useState(false);
  const [currentBomRow, setCurrentBomRow] = useState(null);
  const [BillOfSaleStatus, setBillOfSaleStatus] = useState(null);
  const [MerchandiserOptions, setMerchandiserOptions] = useState([]);
  const [deletedsfg, setDeletedSfg] = useState([]);
  const [setOfNewlyAddedStockSfg, setSetOfNewlyAddedStockSfg] = useState(
    new Set()
  );
  // console.log(sfglist, allSavedSemiFinishedGoods, allSemiFinishedGoods);
  // console.log(BillOfSaleStatus)
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
      // console.log(sfgStock);
      setSfgStock(sfgStock);
    } catch (error) {
      console.log(error);
      toast.error(
        error?.response?.data?.error?.message || "Error at getting SFG stock"
      );
    }
  };

  function calculateUsedRm() {
    const raw_material_used = extra_bom_so?.flatMap((item) => {
      if (!item?.stock_status) return [];
      return (
        item?.raw_material_bom?.map((rm) => ({
          raw_material: rm?.raw_material_master?.id,
          stock: rm?.rm_qty * formData.qty,
        })) || []
      );
    });
    return raw_material_used;
  }

  useEffect(() => {
    if (!extra_bom_so || extra_bom_so.length === 0 || !formData.qty) return;
    const arr = calculateUsedRm();
    // console.log(arr)
    setStockList((prev) => [...stockList, ...arr]);
  }, [extra_bom_so, formData.qty]);

  console.log("extra_bom_so: ", extra_bom_so)
  console.log("extra_bom_so_initial: ", extra_bom_so_initial)

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

  const fetchPageData = async () => {
    setLoading(true);
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

  const fetchSalesOrder = async () => {
    try {
      const response =
        type === "internal"
          ? await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/api/internal-sales-order-entry/edit/${id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          : await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/api/sales-order-entry/edit/${id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
      // console.log(response);
      if (!response || !response.data) {
        toast.error("Error at getting data");
      } else {
        setData(response.data);
        if (type === "internal") setIsAdmin(true);
        else setIsAdmin(false);
        setBillOfSaleStatus(response.data?.bos);
        setFormData({
          so_id: response.data?.so_id,
          group: response.data?.group?.id,
          qty: response.data?.qty,
          design_number: response.data?.design_number?.id,
          convert_id: undefined,
          order_status: response.data?.order_status,
          remark: response.data?.remark,
          order_no: response.data?.order_no,
          order_date: response.data?.order_date,
          delivery_date: response.data?.delivery_date,
          processor: response.data?.processor?.id,
          goods_received_remark: response.data?.goods_received_remark,
          merchandiser: response.data?.merchandiser?.id,
        });
        setOrder_items(response?.data?.order_items);
        setExtra_bom_so(response?.data?.extra_bom_so[0]?.Extra_bom);
        setExtra_bom_so_initial(response?.data?.extra_bom_so[0]?.Extra_bom);
        setDesignData(response?.data?.design_number);
        setSelectedConvertIdData({
          so_id: response.data?.orders?.[0]?.external_orders || "N/A",
        });
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
  console.log("formData:zzzzzzzz ", formData);

  useEffect(() => {
    fetchPageData();
    fetchSalesOrder();
  }, [refresh]);

  useEffect(() => {
    if (
      !load &&
      availableDesignMaster &&
      Array.isArray(availableDesignMaster)
    ) {
      const formattedData = availableDesignMaster.map((item) => ({
        id: item.id,
        design_number: item.design_number,
        group_name: item.design_group?.group_name,
        colour_name: item.color?.color_name,
      }));
      setFormattedDesignMasters(formattedData);
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

  useEffect(() => {
    const map = new Map();

    sfgStock.forEach((item) => {
      const { color, semi_finished_goods_master, qty } = item;

      const key = `${color}|${semi_finished_goods_master}`;

      map.set(key, (map.get(key) || 0) + qty);
    });

    setSfgStockCategories(map);
  }, [sfgStock]);

  useEffect(() => {
    if (!selectedConvertIdData) return;
    if (Object.keys(selectedConvertIdData).length > 0)
      setShowConvertIdTable(false);
  }, [selectedConvertIdData]);

  useEffect(() => {
    if (load || !userList || !Array.isArray(userList)) return;
    const nonAdminUsers = userList.filter(
      (user) => user.designation !== "Admin"
    );
    setProcessorOptions(nonAdminUsers);
  }, [load, userList]);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }
  // console.log(extra_bom_so);
  // console.log(deletedsfg);
  const handleBulkAddStock = async (someCompleted) => {
    try {
      const result = someCompleted.map((item) => {
        const processes = item.jobber_master_sfg
          .filter((jobber) => jobber.completed !== "Incomplete")
          .map((jobber) => ({ process: jobber.jobber_work_type }));

        return {
          sfg: item.semi_finished_goods,
          color: item.color,
          add_qty: item.qty * formData.qty,
          processes,
        };
      });

      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/custom/bulk-add-stock-sfg`,
        result,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Stock added successfully!");
      // console.log("Bulk add response:", response.data);
    } catch (error) {
      console.error("Bulk add error:", error);
      toast.error(
        error?.response?.data?.error?.message || "Something went wrong"
      );
    }
  };

  console.log("allSemiFinishedGoods456: ", allSemiFinishedGoods);
  const handleSubmitInternalSalesOrder = async () => {
    if (!token) {
      navigate("/login");
    }
    console.log("allSemiFinishedGoods123: ", allSemiFinishedGoods)
    const updatedAllSFG = allSemiFinishedGoods.map(allSFG => {
      const matchedInitial = extra_bom_so_initial.find(initial =>
        initial.semi_finished_goods?.id === allSFG.semi_finished_goods
      );

      const updatedRawMaterialBom = allSFG.raw_material_bom.map(rawItem => {
        if (matchedInitial) {
          const matchedRM = matchedInitial.raw_material_bom.find(initialRM =>
            initialRM.raw_material_master?.id === rawItem.raw_material_master
          );

          if (matchedRM) {
            return {
              ...rawItem,
              rm_qty: (rawItem.rm_qty - matchedRM.rm_qty) * formData.qty,
            };
          } else {
            return {
              ...rawItem,
              rm_qty: rawItem.rm_qty * formData.qty,
            };
          }
        } else {
          // If no matchedInitial, just multiply normally
          return {
            ...rawItem,
            rm_qty: rawItem.rm_qty * formData.qty,
          };
        }
      });

      return {
        ...allSFG,
        raw_material_bom: updatedRawMaterialBom,
      };
    });

    console.log("")

    // const updatedAllSFG = allSemiFinishedGoods.map(allSFG => {
    //   // ✅ Match based on bom_id instead of semi_finished_goods.id
    //   const matchedInitial = extra_bom_so_initial.find(initial =>
    //     initial.id === allSFG.bom_id
    //   );

    //   const updatedRawMaterialBom = allSFG.raw_material_bom.map(rawItem => {
    //     if (matchedInitial) {
    //       const matchedRM = matchedInitial.raw_material_bom.find(initialRM =>
    //         initialRM.raw_material_master?.id === rawItem.raw_material_master
    //       );

    //       if (matchedRM) {
    //         return {
    //           ...rawItem,
    //           rm_qty: (rawItem.rm_qty - matchedRM.rm_qty) * formData.qty,
    //         };
    //       } else {
    //         return {
    //           ...rawItem,
    //           rm_qty: rawItem.rm_qty * formData.qty,
    //         };
    //       }
    //     } else {
    //       // If no matchedInitial, just multiply normally
    //       return {
    //         ...rawItem,
    //         rm_qty: rawItem.rm_qty * formData.qty,
    //       };
    //     }
    //   });

    //   return {
    //     ...allSFG,
    //     raw_material_bom: updatedRawMaterialBom,
    //   };
    // });

    console.log("updatedAllSFG: ", updatedAllSFG)
    // alert("Hellow");
    // return;
    setsubmitting(true);
    try {

      // const extrabomso = allSemiFinishedGoods.map((item, ind) => ({
      //   ...item,
      //   stock_status: SFGStatusStock[ind],
      // }));

      const extrabomso = allSemiFinishedGoods.map((item, ind) => {
        // Check if the current item's semi_finished_goods matches any in extra_bom_so_initial
        const isMatched = extra_bom_so_initial.some(initial =>
          initial.semi_finished_goods?.id === item.semi_finished_goods
        );

        // If NOT matched, multiply qty and raw_material_bom rm_qty
        let updatedQty = item.qty;
        // let updatedRawMaterialBom = item.raw_material_bom;

        if (!isMatched) {
          updatedQty = item.qty * formData.qty;
          // updatedRawMaterialBom = item.raw_material_bom.map(rm => ({
          //   ...rm,
          //   rm_qty: rm.rm_qty * formData.qty,
          // }));
        }

        return {
          ...item,
          qty: updatedQty,
          // raw_material_bom: updatedRawMaterialBom,
          stock_status: selectedConvertIdData?.so_id ? true : SFGStatusStock[ind],
        };
      });

      // console.log("extrabomso-end", extrabomso)

      const postData = {
        data: {
          order_date: formData.order_date,
          delivery_date: formData.delivery_date,
          processor: formData.processor,
          remark: formData.remark,
          goods_received_remark: formData.goods_received_remark,
          order_items: updateOrderItemStatus(order_items),
          remaining_qty: Number(formData.qty),
          merchandiser: formData.merchandiser,
          extra_bom_so: [{ Extra_bom: extrabomso }],
          // extra_bom_so:extrabomso
        },
      };
      console.log(postData);
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/internal-sales-order-entry/update/${id}`,
        postData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // const response = {
      //   data: {
      //     message: "Simulated success",
      //   },
      // };
      if (!response || !response.data) {
        toast.error("Error at creating Sales Order");
      } else {
        toast.success("Internal Sales Order updated successfully");

        const allIncomplete = [];
        const someCompleted = [];
        if (deletedsfg.length > 0) {
          deletedsfg.forEach((item) => {
            const allAreIncomplete = item.jobber_master_sfg.every(
              (jobber) => jobber.completed === "Incomplete"
            );

            if (allAreIncomplete) {
              allIncomplete.push(item);
            } else {
              someCompleted.push(item);
            }
          });
        }
        if (someCompleted.length > 0) {
          await handleBulkAddStock(someCompleted);
        }
        const to_increase_stock = extra_bom_so.filter(
          (item) => item.fromStock === true
        );
        const increaseStock = to_increase_stock.flatMap((item) =>
          item.raw_material_bom.map((rm) => ({
            raw_material_master: rm.raw_material_master.id,
            qty: rm.rm_qty * formData.qty,
          }))
        );
        if (increaseStock.length > 0) {
          await axios.post(
            `${process.env.REACT_APP_BACKEND_URL}/api/custom/increase-stock`,
            increaseStock,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
        }

        const reduceFromApproved = approvedSFG.flatMap((item) =>
          item.raw_material_bom.map((rm) => ({
            raw_material_master: rm.raw_material_id,
            qty: rm.total_rm_qty,
          }))
        );

        // ✅ From someCompleted — uses: raw_material_master.id & rm_qty
        const reduceFromSomeCompleted = someCompleted.flatMap((item) =>
          item.raw_material_bom.map((rm) => ({
            raw_material_master: rm.raw_material_master.id,
            qty: rm.rm_qty,
          }))
        );

        // Combine all reductions
        const reduceStock = [...reduceFromSomeCompleted, ...reduceFromApproved];
        // const reduceStock = approvedSFG.map((item) =>
        //   item?.raw_material_bom?.map((rm) => ({
        //     raw_material_master: rm.raw_material_id,
        //     qty: rm.total_rm_qty,
        //   }))
        // );

        const reduce = reduceStock.flat();
        const updatedReduce = reduce.map(reduceItem => {
          // Search across all updatedAllSFG items and their raw_material_bom arrays
          for (const sfg of updatedAllSFG) {
            for (const bom of sfg.raw_material_bom) {
              if (bom.raw_material_master === reduceItem.raw_material_master) {
                return {
                  ...reduceItem,
                  qty: bom.rm_qty
                };
              }
            }
          }

          // If not matched, return original item
          return reduceItem;
        });

        console.log("updatedReduce: ", updatedReduce);

        console.log("reduce: ", reduce)

        // alert("Hellow")
        // return;

        if (reduce.length > 0) {
          await axios.post(
            `${process.env.REACT_APP_BACKEND_URL}/api/custom/redact-stock-inBulk`,
            updatedReduce,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          toast.success("Stock updated successfully");
        }
        setRefresh(!refresh);
        setAllSavedSemiFinishedGoods([]);
        setAllSemiFinishedGoods([]);
        setIsAdmin(false);
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
        navigate(`/sales-order-report/report/internal/${id}`);
      }
    } catch (error) {
      console.log("Error at creating Sales Order", error);
      toast.error(
        error?.response?.data?.error?.message ||
        "Error at Updating Sales Order Entry"
      );
    } finally {
      setsubmitting(false);
    }
  };

  // console.log(SFGStatusStock,approvedSFG)

  const handleSubmitSalesOrder = async () => {
    if (!token) {
      navigate("/login");
    }
    console.log("allSemiFinishedGoods: ", allSemiFinishedGoods)

    const updatedAllSFG = allSemiFinishedGoods.map(allSFG => {
      const matchedInitial = extra_bom_so_initial.find(initial =>
        initial.semi_finished_goods?.id === allSFG.semi_finished_goods
      );

      const updatedRawMaterialBom = allSFG.raw_material_bom.map(rawItem => {
        if (matchedInitial) {
          const matchedRM = matchedInitial.raw_material_bom.find(initialRM =>
            initialRM.raw_material_master?.id === rawItem.raw_material_master
          );

          if (matchedRM) {
            return {
              ...rawItem,
              rm_qty: (rawItem.rm_qty - matchedRM.rm_qty) * formData.qty,
            };
          } else {
            return {
              ...rawItem,
              rm_qty: rawItem.rm_qty * formData.qty,
            };
          }
        } else {
          // If no matchedInitial, just multiply normally
          return {
            ...rawItem,
            rm_qty: rawItem.rm_qty * formData.qty,
          };
        }
      });

      return {
        ...allSFG,
        raw_material_bom: updatedRawMaterialBom,
      };
    });

    console.log("updatedAllSFG: ", updatedAllSFG)
    // alert("Hellw");
    // return;
    setsubmitting(true);
    try {
      // const extrabomso = allSemiFinishedGoods.map((item, ind) => ({
      //   ...item,
      //   stock_status: selectedConvertIdData?.so_id ? true : SFGStatusStock[ind],
      // }));

      const extrabomso = allSemiFinishedGoods.map((item, ind) => {
        // Check if the current item's semi_finished_goods matches any in extra_bom_so_initial
        const isMatched = extra_bom_so_initial.some(initial =>
          initial.semi_finished_goods?.id === item.semi_finished_goods
        );

        // If NOT matched, multiply qty and raw_material_bom rm_qty
        let updatedQty = item.qty;
        // let updatedRawMaterialBom = item.raw_material_bom;

        if (!isMatched) {
          updatedQty = item.qty * formData.qty;
          // updatedRawMaterialBom = item.raw_material_bom.map(rm => ({
          //   ...rm,
          //   rm_qty: rm.rm_qty * formData.qty,
          // }));
        }

        return {
          ...item,
          qty: updatedQty,
          // raw_material_bom: updatedRawMaterialBom,
          stock_status: selectedConvertIdData?.so_id ? true : SFGStatusStock[ind],
        };
      });

      console.log("extrabomso-end", extrabomso)
      const postData = {
        data: {
          order_no: formData.order_no,
          order_date: formData.order_date,
          delivery_date: formData.delivery_date,
          processor: formData.processor,
          remark: formData.remark,
          goods_received_remark: formData.goods_received_remark,
          order_items: updateOrderItemStatus(order_items),
          merchandiser: formData.merchandiser,
          extra_bom_so: [{ Extra_bom: extrabomso }],
          // extra_bom_so:extrabomso
        },
      };
      console.log("PostData: ", postData)
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/sales-order-entry/update/${id}`,
        postData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // const response = {
      //   data: {
      //     message: "Simulated success",
      //   },
      // };
      if (!response || !response.data) {
        toast.error("Error at creating Sales Order");
      } else {
        toast.success("Sales Order updated successfully");
        // const increaseStock = extra_bom_so.flatMap((item) =>
        //   item.stock_status
        //     ? item.raw_material_bom.map((rm) => ({
        //         raw_material_master: rm.raw_material_master.id,
        //         qty: rm.rm_qty * formData.qty,
        //       }))
        //     : []
        // );
        // if (increaseStock.length > 0) {
        //   await axios.post(
        //     `${process.env.REACT_APP_BACKEND_URL}/api/custom/increase-stock`,
        //     increaseStock,
        //     {
        //       headers: { Authorization: `Bearer ${token}` },
        //     }
        //   );
        // }

        // const reduceStock = approvedSFG.map((item) =>
        //   item?.raw_material_bom?.map((rm) => ({
        //     raw_material_master: rm.raw_material_id,
        //     qty: rm.total_rm_qty,
        //   }))
        // );

        // const reduce = reduceStock.flat();
        // // console.log(reduce);
        // if (reduce.length > 0 && !selectedConvertIdData?.so_id) {
        //   await axios.post(
        //     `${process.env.REACT_APP_BACKEND_URL}/api/custom/redact-stock-inBulk`,
        //     reduce,
        //     {
        //       headers: { Authorization: `Bearer ${token}` },
        //     }
        //   );
        //   toast.success("Stock updated successfully");
        // }

        const allIncomplete = [];
        const someCompleted = [];
        if (deletedsfg.length > 0) {
          deletedsfg.forEach((item) => {
            const allAreIncomplete = item.jobber_master_sfg.every(
              (jobber) => jobber.completed === "Incomplete"
            );

            if (allAreIncomplete) {
              allIncomplete.push(item);
            } else {
              someCompleted.push(item);
            }
          });
        }
        if (someCompleted.length > 0) {
          await handleBulkAddStock(someCompleted);
        }
        // console.log("extra_bom_so: ", extra_bom_so)
        const to_increase_stock = extra_bom_so.filter(
          (item) => item.fromStock === true
        );
        const increaseStock = to_increase_stock.flatMap((item) =>
          item.raw_material_bom.map((rm) => ({
            raw_material_master: rm.raw_material_master.id,
            qty: rm.rm_qty * formData.qty,
          }))
        );
        // console.log("increaseStock: ",increaseStock);

        if (increaseStock.length > 0) {
          await axios.post(
            `${process.env.REACT_APP_BACKEND_URL}/api/custom/increase-stock`,
            increaseStock,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
        }

        const reduceFromApproved = approvedSFG.flatMap((item) =>
          item.raw_material_bom.map((rm) => ({
            raw_material_master: rm.raw_material_id,
            qty: rm.total_rm_qty,
          }))
        );
        console.log("reduceFromApproved: ", reduceFromApproved)

        // ✅ From someCompleted — uses: raw_material_master.id & rm_qty
        const reduceFromSomeCompleted = someCompleted.flatMap((item) =>
          item.raw_material_bom.map((rm) => ({
            raw_material_master: rm.raw_material_master.id,
            qty: rm.rm_qty * formData.qty,
          }))
        );
        console.log("reduceFromSomeCompleted: ", reduceFromSomeCompleted)

        // Combine all reductions
        const reduceStock = [...reduceFromSomeCompleted, ...reduceFromApproved];
        // const reduceStock = approvedSFG.map((item) =>
        //   item?.raw_material_bom?.map((rm) => ({
        //     raw_material_master: rm.raw_material_id,
        //     qty: rm.total_rm_qty,
        //   }))
        // );

        const reduce = reduceStock.flat();
        const updatedReduce = reduce.map(reduceItem => {
          // Search across all updatedAllSFG items and their raw_material_bom arrays
          for (const sfg of updatedAllSFG) {
            for (const bom of sfg.raw_material_bom) {
              if (bom.raw_material_master === reduceItem.raw_material_master) {
                return {
                  ...reduceItem,
                  qty: bom.rm_qty
                };
              }
            }
          }

          // If not matched, return original item
          return reduceItem;
        });

        console.log("updatedReduce: ", updatedReduce);

        console.log("reduce: ", reduce)
        // alert("Hellow");
        // return;

        if (reduce.length > 0) {
          await axios.post(
            `${process.env.REACT_APP_BACKEND_URL}/api/custom/redact-stock-inBulk`,
            updatedReduce,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          toast.success("Stock updated successfully");
        }
        setRefresh(!refresh);
        setAllSavedSemiFinishedGoods([]);
        setAllSemiFinishedGoods([]);
        setFormData({
          so_id: "",
          convert_id: "",
          group: "",
          qty: 0,
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

        navigate(`/sales-order-report/report/external/${id}`);
      }
    } catch (error) {
      console.log("Error at creating Sales Order", error);
      toast.error(
        error?.response?.data?.error?.message ||
        "Error at Updating Sales Order Entry"
      );
    } finally {
      // setLoading(false);
      setsubmitting(false);
    }
  };

  // useEffect(() => {
  //   // console.log(selectedConvertIdData);
  //   if (!isAdmin && selectedConvertIdData.so_id)
  //     setFormData({ ...formData, qty: 1 });
  // }, [selectedConvertIdData, isAdmin]);

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
        await handleSubmitInternalSalesOrder();
      } else await handleSubmitSalesOrder();
      setChangeSoid(!changeSoid);
    } catch (error) {
      console.log(error);
      console.log("Error at Updating Sales Order Entry", error);
    }
  };

  useEffect(() => {
    if (type === "internal") setIsAdmin(true);
    else setIsAdmin(false);
  }, [type]);

  useEffect(() => {
    if (
      !allSavedSemiFinishedGoods ||
      !Array.isArray(allSavedSemiFinishedGoods) ||
      allSavedSemiFinishedGoods.length == 0
    )
      return;
    setAllSavedSemiFinishedGoods((prev) =>
      prev.map((itemp) => ({
        ...itemp,
        raw_material_bom: itemp?.raw_material_bom.map((itemm) => ({
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

  // console.log(deletedsfg)

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

  if ((load && !error) || fetchingData || loading)
    return (
      <div className="absolute inset-0 flex justify-center items-center mt-64 bg-opacity-50 bg-gray-200 z-10">
        <BounceLoader size={100} color={"#1e3a8a"} />
      </div>
    );

  return (
    <>
      <p className="text-blue-700 flex items-center cursor-pointer px-2" onClick={() => window.history.back()}> <ChevronLeft /> Back</p>
      <div className="bg-white p-6 rounded-lg">
        <h1 className="text-2xl font-bold text-blue-900 mb-4 pb-2 border-b">
          Edit Sales Order Entry
        </h1>
        {showEditSfgModal && (
          <div className="fixed inset-0 animate-fade-in bg-gray-900 backdrop-blur-md bg-opacity-50 flex justify-center items-center z-50">

            <div className=" w-[80vw] h-[90vh] bg-white z-40  rounded-xl p-6 overflow-y-auto  top-2">
              <div className="flex justify-between items-center overflow-y-auto mb-4 pb-2 border-b border-b-gray-300">
                <h3 className="text-xl font-bold text-blue-900 ">Update Semi Finished Goods</h3>
                <p
                  className="text-xl px-2 border bg-red-700 rounded-full text-white hover:bg-red-500 cursor-pointer duration-200 transition-all ease-in-out"
                  onClick={() => {
                    setShowEditSfgModal(!showEditSfgModal);
                  }}
                >
                  X
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
                BillOfSaleStatus={BillOfSaleStatus}
              />
            </div>
          </div>
        )}
        {showDesignTable && (
          <div className="fixed w-[90vw] z-10 bg-gray-200 rounded-xl px-2">
            <div className="flex justify-between my-1 items-center">
              <h3 className="text-xl">Select Design</h3>
              <p
                className="text-xl px-2 border bg-red-600 rounded text-white hover:bg-red-500 cursor-pointer"
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
        )}

        {showConvertIdTable && (
          <div className="fixed w-[80vw] z-10 bg-gray-200 rounded-xl px-2">
            <div className="flex justify-between my-1 items-center">
              <h3 className="text-xl">Select Convert ID</h3>
              <p
                className="text-xl px-2 border bg-red-600 rounded text-white hover:bg-red-500 cursor-pointer"
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
            setSOViewModal={setSOViewModal}
            setSalesOrder={setSalesOrder}
            setBom={setBom}
            setSelectSOModal={setSelectSOModal}
            setFormData={setFormData}
            setAllSemiFinishedGoods={setAllSemiFinishedGoods}
            setAllSavedSemiFinishedGoods={setAllSavedSemiFinishedGoods}
            setsfglist={setsfglist}
            fetchSFGStock={fetchSFGStock}
            setSetOfNewlyAddedStockSfg={setSetOfNewlyAddedStockSfg}
            setOfNewlyAddedStockSfg={setOfNewlyAddedStockSfg}
            SalessorderQty={formData.qty}
          />
        )}

        {soViewModal && (
          <div className="my-8 overflow-x-auto">
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
          className=""
          onSubmit={handleSubmit}
        >
          <div className="grid grid-cols-2 gap-6 p-2 mb-5 ">
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
              editable={false}
            />

            {/* Group */}
            <div className="flex flex-col">
              <FormLabel title={"Group"} />
              <select
                value={formData.group}
                name="group"
                disabled
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
                  value={data?.design_number?.design_number || ""}
                  placeholder="Design Number"
                  disabled
                  readOnly
                  className="w-full bg-gray-100 border broder-gray-300 broder-gray-100 rounded-md p-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/*  adding data table for Goods and SFG */}
          {
            <DesignDetails
              exta_bom={extra_bom_so}
              setShowEditTable={setShowEditSfgModal}
              setEditSFGIndex={setSelectedSFGIndex}
              designData={designData}
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
              setDeletedSfg={setDeletedSfg}
              salesOrderQty={formData.qty}
            />
          }
          <button
            className="my-4 ml-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:scale-100 hover:shadow-2xl transition-all duration-300 ease-in-out flex items-center gap-2"
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

          <div className="grid grid-cols-2 gap-6 p-2 mb-16">
            {/* Convert ID */}
            <div className="flex flex-col">
              <FormLabel title={"Convert ID"} />
              <div className="flex gap-2">
                <input
                  type="text"
                  value={selectedConvertIdData?.so_id || ""}
                  placeholder="Convert ID"
                  className="w-full bg-gray-100 border broder-gray-300 broder-gray-100 rounded-md p-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
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
                className="border border-gray-300 bg-gray-100 rounded-md p-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="" disabled selected>
                  Select Merchandiser
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
                className="bg-gray-200 px-4 py-1 rounded hover:bg-gray-600 hover:text-white transition"
              >
                Clear
              </button>
              <button
                type="submit"
                className={`bg-blue-900 text-white px-4 py-1 rounded hover:bg-blue-800 hover:text-white transition duration-200 ease-in-out
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
    </>
  );
};

export default EditSalesOrderModel;
