import { useEffect, useState } from "react";
import FormLabel from "../purchase/FormLabel";
import FormInput from "../utility/FormInput";
import SingleAddTable from "../../smartTable/SingleAddTable";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { BounceLoader, PuffLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import TablesForRmSfg from "../sales-order/TablesForRmSfg";



const InternalSalesOrder = () => {
  const { token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [availableDesignMaster, setAvailableDesignMaster] = useState([]);
  const [fetchingData, setFetching] = useState(false);
  const {
    designGroups,
    load,
    error,
    colorCategories,
  } = useSelector((state) => state.fetchData);
  const [formData, setFormData] = useState({
    so_id: "",
    group: "",
    qty: 0,
    color: "",
    order_no: "",
    design_number: "",
    order_date: "",
    delivery_date: "",
    processor: "",
    remark: "",
    goods_received_remark: "",
    urgent: false,
    stock_order: "",
  });

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
        console.log(response.data)
        setAvailableDesignMaster(response.data);
      }
    } catch (error) {
      console.log("Failed to fetch design master data", error);
      toast.error(
        error?.response?.data?.message || "Failed to fetch design master data"
      );
    }finally{
      setFetching(false)
    }
  };

  useEffect(() => {
    if (!formData.group) return;
    fetchIndividualGroupDesignMasters();
  }, [formData.group]);

  const [selectedRow, setSelectedRow] = useState();
  const [showDesignTable, setShowDesignTable] = useState(false);
  const [selectedData, setSelectedData] = useState({});
  // console.log(order_items)
  const [formattedDesignMasters, setFormattedDesignMasters] = useState({});
  const [showTables, setShowTables] = useState(false);
  const [submitting, setsubmitting] = useState(false);

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
    if (!selectedData) return;
    if (Object.keys(selectedData).length > 0) {
      setShowDesignTable(false);
      setShowTables(true);
    } else {
      setShowTables(false);
    }
  }, [selectedData]);
  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(selectedData)
    if (!token) {
      navigate("/login");
    }
    setsubmitting(true);
    setLoading(true);
    try {
      console.log(selectedData);
      const postData = {
        data: {
          so_id: formData.so_id,
          group: formData.group,
          qty: formData.qty,
          color: formData.color,
          order_no: formData.order_no,
          design_number: selectedData?.id,
          order_date: formData.order_date,
          delivery_date: formData.delivery_date,
          processor: formData.processor,
          remark: formData.remark,
          goods_received_remark: formData.goods_received_remark,
          urgent: formData.urgent,
          stock_order: formData.stock_order,
          order_items: order_items,
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
        setFormData({
          so_id: "",
          group: "",
          qty: 0,
          color: "",
          order_no: "",
          design_number: "",
          order_date: "",
          delivery_date: "",
          processor: "",
          remark: "",
          goods_received_remark: "",
          urgent: false,
          stock_order: "",
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
      }
    } catch (error) {
      console.log("Error at creating Sales Order", error);
      toast.error(
        error?.response?.data?.error?.message ||
          "Error at creating Sales Order Entry"
      );
    } finally {
      setLoading(false);
      setsubmitting(false);
    }
  };
  async function GenerateSoid(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/internal-sales-order-entry/generate-soid`
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
  if ((load && !error) || fetchingData)
    return (
      <div className="absolute inset-0 flex justify-center items-center mt-64 bg-opacity-50 bg-gray-200 z-10">
        <BounceLoader size={100} color={"#1e3a8a"} />
      </div>
    );

  return (
    <div>
      <h1 className="text-3xl font-bold text-blue-900 mb-4">
        Internal Sales Order Entry
      </h1>
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

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-6 p-2 mb-16">
          {/* SO ID */}
          <div className="flex flex-col">
            <div className="flex gap-2 items-center">
              <div className="w-3/4">
                <FormInput
                  type={"text"}
                  placeholder={"SO ID"}
                  label={"SO ID"}
                  value={formData.so_id}
                  name={"so_id"}
                  onChange={handleChange}
                  editable={false}
                />
              </div>
              <button
                className="bg-blue-900  flex justify-center mt-4 hover:bg-blue-800 items-center h-7 p-5 text-white rounded-md"
                onClick={GenerateSoid}
                disabled={loading}
              >
                {loading ? "Generating..." : "Generate SO ID"}
              </button>
            </div>
          </div>

          {/* Convert ID */}
          {/* <div className="flex flex-col">
            <FormLabel title={"Convert ID"} />
            <select
              value={formData.convert_id}
              onChange={handleChange}
              name="convert_id"
              className="border border-gray-300 bg-gray-100 rounded-md p-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled selected>
                Convert ID
              </option>
              {dummyConvertId.map((item, index) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div> */}

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
          <div className="flex flex-col col-span-2 w-1/2 mx-auto">
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
                  if(!formData.group){
                    toast.error("Please select design group first");
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

        {/*  adding data table for Goods and SFG */}
        {showTables && <TablesForRmSfg selectedData={selectedData} />}
        <div className="grid grid-cols-2 gap-6 p-2 mb-16">
          {/* Colour */}
          <div className="flex flex-col">
            <FormLabel title={"Colour"} />
            <select
              value={formData.color}
              name="color"
              onChange={handleChange}
              className="border border-gray-300 bg-gray-100 rounded-md p-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled selected>
                Select Colour
              </option>
              {colorCategories &&
                Array.isArray(colorCategories) &&
                colorCategories?.length > 0 &&
                colorCategories.map((item, index) => (
                  <option key={item?.id} value={item?.id}>
                    {item?.color_name}
                  </option>
                ))}
            </select>
          </div>

          {/* Customer */}
          {/* <div className="flex flex-col">
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
          </div> */}

          {/* Quantity */}
          <FormInput
            type={"number"}
            placeholder={"Quantity"}
            label={"Quantity"}
            onChange={handleChange}
            value={formData.qty}
            name={"qty"}
          />

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
          <FormInput
            type={"text"}
            placeholder={"Processor"}
            label={"Processor"}
            onChange={handleChange}
            value={formData.processor}
            name={"processor"}
          />

          {/* Delivery Date */}
          <FormInput
            type={"date"}
            placeholder={"Delivery Date"}
            label={"Delivery Date"}
            value={formData.delivery_date}
            onChange={handleChange}
            name={"delivery_date"}
          />

          {/* Urgent */}
          <div className="flex flex-col">
            <FormLabel title={"Urgent"} />
            <select
              value={formData.urgent}
              name="urgent"
              onChange={handleChange}
              className="border border-gray-300 bg-gray-100 rounded-md p-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={true}>Yes</option>
              <option value={false}>No</option>
            </select>
          </div>

          {/* Stock_order */}
          <div className="flex flex-col">
            <FormLabel title={"Stock Order"} />
            <select
              value={formData.stock_order}
              name="stock_order"
              onChange={handleChange}
              className="border border-gray-300 bg-gray-100 rounded-md p-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled selected>
                Select Stock Order Status
              </option>
              <option value={true}>Yes</option>
              <option value={false}>No</option>
            </select>
          </div>

          {/* Remarks */}
          <div className="flex flex-col">
            <FormLabel title={"Remarks"} />
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
              type="button"
              className="bg-gray-200 px-4 py-1 rounded hover:bg-gray-600 hover:text-white transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`bg-gray-200 px-4 py-1 rounded hover:bg-gray-600 hover:text-white transition`}
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

export default InternalSalesOrder;
