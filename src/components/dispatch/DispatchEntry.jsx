import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import SmartTable2 from '../../smartTable/SmartTable2';
import { BounceLoader } from 'react-spinners';
import FormLabel from '../purchase/FormLabel';
const headersForTable = ["Id", "SO ID", "Convert ID", "Customer Name", "Design Group", "Design Name", "Qty", "Urgent", "Order Status"];


const SelectSOTable = ({
    NoOfColumns,
    data,
    headers,
    setSelectedRow,
    selectedRow,
    setSelectedSO,
    setFormData,
    setOrderItem,
    setLoading,
    setSelectedSOId,
    setSOViewModal,
    setBom,
    type,
    setSalesOrder,
    setSelectedSOModal,
    setAllBomIds,
    allBomIds,
    allreadyProcessedQtyOfBOM,
    setAllreadyProcessedQtyOfBOM,
    allreadyProcessedOrderItems,
    setAllreadyProcessedOrderItems,
    setReturnItemsModal,
    setReturnItems,
    setDispatchType,
    setIdOfSO
}) => {
    const { token } = useSelector((state) => state.auth);
    const [updatedData, setUpdatedData] = useState([]);
    const navigate = useNavigate();
    const [updatedHeader] = useState(["select", ...headers]);


    const handleClick = async (id, convertId, status, so_id) => {

        console.log(convertId, status, so_id)
        setIdOfSO(id)
        setDispatchType(status)

        setSelectedSOId(id);
        let so_type;
        type === "internal-sales-order-entries" ? so_type = "internal-sales-order-entry" : so_type = "sales-oder-entries";
        console.log(so_type);
        try {
            setLoading(true);

            // const { data } = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/${so_type}/find-by-id/${id}`, {
            //     headers: {
            //         Authorization: `Bearer ${token}`,
            //     },
            // });

            // let data;

            if (status === "Alter") {
                const returnId = convertId !== "" ? convertId : so_id;
                const response = await axios.get(
                    `${process.env.REACT_APP_BACKEND_URL}/api/custom-sales-order-returns/${returnId}/details`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                data = response.data;
                if (data) {
                    console.log("This is response:", data);

                    setOrderItem(data?.order_items);
                    setSelectedSO(data);

                    let so_id = data?.so_id;
                    if (so_type === "internal-sales-order-entry") {
                        so_id = data?.orders[0]?.external_orders;
                    }

                    let sales_order = data?.internal_sales_order_entry || data?.sales_oder_entry;
                    setFormData(pre => ({
                        ...pre,
                        so_id: so_id,
                        customer: data?.customer_master?.company_name,
                        design_name: sales_order?.design_number?.design_number,
                        so_qty: sales_order?.qty,
                        date: new Date().toISOString().split("T")[0],
                        processor: data?.processor?.id
                    }));
                    setReturnItems(data.return_items);
                    setSalesOrder(sales_order);
                    setReturnItemsModal(true)
                    console.log("Data", data);
                }
            } else {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/${so_type}/find-by-id/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                data = response.data;

                if (data) {
                    console.log("This is response:", data);

                    setOrderItem(data?.order_items);
                    setSelectedSO(data);

                    let so_id = data?.so_id;
                    if (so_type === "internal-sales-order-entry") {
                        so_id = data?.orders[0]?.external_orders;
                    }
                    setFormData(pre => ({
                        ...pre,
                        so_id: so_id,
                        customer: (status !== "Return") ? data?.customer?.company_name : "",
                        design_name: data?.design_number?.design_number,
                        so_qty: data?.qty,
                        date: new Date().toISOString().split("T")[0],
                        processor: data?.processor?.id
                    }));
                    setSalesOrder(data);
                    console.log("Data", data);
                }
            }
            console.log("Fetch data", data);

        } catch (error) {
            console.error("Error fetching jobber data:", error);
            if (error.response?.status === 401) {
                navigate("/login");
            }
        } finally {
            setLoading(false);
        }

        setSOViewModal(true);
        setSelectedSOModal(false);
    };
    console.log("data:   zz", data)

    useEffect(() => {
        const updatedValues = data.map((item) => ({
            select: (
                <input
                    type="checkbox"
                    onChange={() => handleClick(item.id, item?.convert_id, item?.status, item?.so_id)}
                    key={item.id}
                />
            ),
            ...item,
        }));

        setSelectedRow(selectedRow ? [selectedRow] : []);

        const finalData = updatedValues.map((item) =>
            Object.fromEntries(Object.entries(item).slice(0, NoOfColumns + 1))
        );

        setUpdatedData(finalData);
    }, [data, NoOfColumns]);


    useEffect(() => {
        console.log("Updated data:", updatedData);
    }, [data]);

    return <SmartTable2 data={updatedData} headers={updatedHeader} />;
};

const DispatchEntry = () => {
    const title = "Dispatch Entry";
    const [chooseDataModal, setChooseDataModal] = useState(false);

    const [displayModal, setDisplayModal] = useState(false);
    const [selectedRow, setSelectedRow] = useState([]);

    const { token, designation, id } = useSelector(state => state.auth);
    const { load, error, availableProcessor } = useSelector((state) => state.fetchData);
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);


    const [selectedRows, setSelectedRows] = useState([]);
    const [stitcherDetail, setStitcherDetail] = useState([]);


    const [salesOrderList, setSalesOrderList] = useState([]);
    const [selectedSO, setSelectedSO] = useState(null);

    const [bom, setBom] = useState(null);
    const [soViewModal, setSOViewModal] = useState(false);

    const [salesOrder, setSalesOrder] = useState([]);
    const [selectedSalesOrderRows, setSelectedSalesOrderRows] = useState([]);
    const [processQuantities, setProcessQuantities] = useState({});


    const [allreadyProcessedQtyOfBOM, setAllreadyProcessedQtyOfBOM] = useState({});
    const [allreadyProcessedOrderItems, setAllreadyProcessedOrderItems] = useState({});

    const [selectedStitchRows, setSelectedStitchRows] = useState([]);
    const [selectedSOModal, setSelectedSOModal] = useState(false);


    const [orderItem, setOrderItem] = useState([]);

    //  newly added states 
    const [type, setType] = useState();
    const [selectedSOId, setSelectedSOId] = useState();

    // bom ids
    const [allBomIds, setAllBomIds] = useState([]);

    const [returnItemsModal, setReturnItemsModal] = useState(false);
    const [returnItems, setReturnItems] = useState([]);
    const [dispatchType, setDispatchType] = useState("");

    const { availableCustomers } = useSelector((state) => state.fetchData);
    const [idOfSo, setIdOfSO] = useState(null);




    const chooseSalesOrderHandler = (e) => {
        e.preventDefault();
        setChooseDataModal(true);
    }


    // form data
    const [formData, setFormData] = useState({
        so_id: "",
        customer: "",
        design_name: "",
        so_qty: "",
        cn_no: "",
        invoice_date: "",
        remarks: "",
        invoice_no: "",
    });


    // form data handler
    const formDataHandler = (e) => {
        const { name, type, checked, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: type === "checkbox" ? checked : value,
            full_set: name === "full_set" ? checked : prevData.full_set && !checked,
            parcial_set: name === "parcial_set" ? checked : prevData.parcial_set && !checked
        }));
    };


    // clear form handler
    const clearButtonHandler = (e) => {
        e.preventDefault();
        setFormData({
            full_set: false,
            parcial_set: false,
            so_id: "",
            customer: "",
            group: "",
            design_number: "",
            design_name: "",
            so_qty: "",
            remarks: "",
            stitch_remarks: "",
            stitch_date: "",
            qty: ""
        })
        setReturnItemsModal(false)
        setReturnItems([])
    }

    console.log("returnItems: ", returnItems);

    const handleSalesOrderType = async (type) => {

        let api_key;

        type === 'vasttram' ? api_key = "internal-sales-order-entries" : api_key = "sales-oder-entries"
        setType(api_key);
        try {
            setLoading(true);
            setSelectedSOId(null);


            console.log("Designation ", designation, "  Id ", id);

            let url = '';
            let params = {
                "filters[order_status][$in]": ["readyToDispatch", "Alter", "Return"],
                "sort": "id:desc",
                "populate": "*"
            };

            if (type === "vasttram") {
                url = `${process.env.REACT_APP_BACKEND_URL}/api/internal-sales-order-entries`;
                // params["filters[orders][external_orders][$notNull]"] = true;
                params["filters[orders][id][$notNull]"] = true;
            } else {
                url = `${process.env.REACT_APP_BACKEND_URL}/api/sales-oder-entries`;
                params["filters[convert_id][$null]"] = true;
            }

            if (designation === "Merchandiser" && id) {
                params["filters[merchandiser][id][$eq]"] = id;
            } else if (designation !== "Admin" && id) {
                params["filters[processor][id][$eq]"] = id;
            }
            // make the API request
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params
            });
            console.log("Fetching sales order data ", response.data.data);

            if (response.data.data.length === 0) {
                toast.info("No data found");
                return;
            }

            const OrderData = Array.isArray(response.data.data) ? response.data.data : [];
            const data = OrderData?.map((order) => (
                {
                    id: order?.id,
                    so_id: order?.so_id,
                    convert_id: type === "vasttram" ? (order?.orders?.[0]?.external_orders || "") : "",
                    customer: order?.customer?.company_name || "",
                    group: order?.group?.group_name,
                    design_number: order?.design_number?.design_number,
                    // order_items: order?.order_items,
                    qty: order?.qty,
                    urgent: (order?.urgent === true) ? "Yes" : "No",
                    status: order?.order_status
                }
            ))


            setSalesOrderList(data);
            if (OrderData.length > 0) setSelectedSOModal(true);


        } catch (error) {
            console.log(error);
            console.error("Error fetching data:", error);
            if (error.response?.status === 401) {
                navigate("/login");
            }
        } finally {
            setLoading(false);
        }
    };

    console.log("salesOrder11111111", salesOrder)


    //  save handler for form submission
    const saveHandler = async (e) => {
        e.preventDefault();

        let data = salesOrder;

        if (formData.so_id === "") {
            toast.error("Please select the Order id")
            return
        }
        if (dispatchType === "Return") {
            if (formData.customer === "") {
                toast.error("Please select the customer")
                return
            }
        }


        let postData = {
            so_id: formData.so_id,
            customer_master: dispatchType === "Return" ? Number(formData.customer) : salesOrder?.customer?.id,
            design_master: salesOrder?.design_number?.id,
            qty: formData.so_qty,
            cn_no: formData.cn_no,
            invoice_date: formData.invoice_date,
            remarks: formData.remarks,
            invoice_no: formData.invoice_no,
            dispatchType: dispatchType === "Alter" ? "Alter Item" : dispatchType === "Return" ? "Return SO" : "Fresh Sale",
            alter_items: dispatchType !== "Alter" ? null : returnItems,
        }
        console.log(type);

        if (type === "internal-sales-order-entries") {
            postData = {
                ...postData,
                convert_id: data?.so_id,
                internal_sales_order_entry: data?.id,
                sales_oder_entry: null
            }
        }
        else {
            postData = {
                ...postData,
                sales_oder_entry: data?.id,
                internal_sales_order_entry: null,
                convert_id: null
            }
        }
        console.log(postData);

        try {
            setLoading(true);
            const url = `${process.env.REACT_APP_BACKEND_URL}/api/dispatch-entries`;
            if (dispatchType === "Return") {
                const res = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/${type}/${idOfSo}/update-customer/${Number(formData.customer)}`, { data: postData }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
            }
            const response = await axios.post(url, { data: postData }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            console.log(response.data);
            toast.success("Dispatch Entry Saved Successfully");

            if (!response.data?.data) {
                toast.error("Error while saving dispatch entry");
                return
            }

            if (response.data?.data) {
                const endpoint = (type === "internal-sales-order-entries")
                    ? `${process.env.REACT_APP_BACKEND_URL}/api/internal-sales-order-entry/update-status/${data?.so_id}/dispatched`
                    : `${process.env.REACT_APP_BACKEND_URL}/api/sales-order-entry/update-status/${data?.so_id}/dispatched`;

                await axios.put(endpoint, {}, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                toast.success("Sales Order status change to Dispatched.", {
                    position: "top-right",
                });

            }

            navigate(`/dispatch-entry-report/${response.data?.data?.id}`);
        } catch (error) {
            toast.error("Error while saving dispatch entry");
            console.log(error);
        }
        finally {
            setLoading(false);
        }

    }

    console.log(formData)
    if (loading || load) {
        return (
            <div className="flex justify-center items-center h-screen">
                <BounceLoader color="#1e3a8a" />
            </div>
        )
    }
    return (
        <div>
            <div className='p-6 rounded-lg relative bg-white'>
                <h1 className="text-2xl pb-2 border-b  font-bold text-blue-900 mb-4">{title}</h1>
                <div className='p-5'>
                    <form action="">

                        <div className=' flex items-center justify-center gap-4'>


                            <div className='relative w-full py-2 flex items-center justify-center gap-3 border border-blue-700 '>
                                <label htmlFor="chooseSalesOrder">From SO Id:</label>
                                <button
                                    id='chooseSalesOrder'
                                    type='button'
                                    onClick={() => setDisplayModal(true)}
                                    className='p-2 bg-blue-900 rounded-md text-white hover:bg-blue-700 duration-200 transition-all ease-in-out'>
                                    Choose Sales Order
                                </button>
                                {displayModal && (
                                    <div className="absolute top-12 left-96 mt-2  bg-white border border-gray-200 shadow-lg rounded-md p-3 z-20 w-72">

                                        <div className="flex justify-end">
                                            <button
                                                className=" text-gray-700 hover:text-red-500 text-sm font-bold"
                                                onClick={() => setDisplayModal(false)}
                                            >
                                                ✖
                                            </button>
                                        </div>

                                        <button
                                            type="button"
                                            className="w-full px-4 py-2 text-left rounded hover:bg-blue-100 transition"
                                            onClick={() => {
                                                handleSalesOrderType('vasttram');
                                                setDisplayModal(false);
                                            }
                                            }
                                        >
                                            Vasttram Sales Order
                                        </button>
                                        <button
                                            type="button"
                                            className="w-full px-4 py-2 text-left rounded hover:bg-blue-100 transition"
                                            onClick={() => {
                                                handleSalesOrderType('customer');
                                                setDisplayModal(false);
                                            }}
                                        >
                                            Customer Sales Order
                                        </button>
                                    </div>
                                )}

                                {selectedSOModal && (
                                    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-md flex justify-center items-center z-50">
                                        <div className="relative w-[90vw] bg-gray-200 border shadow-2xl p-4 rounded-lg">

                                            <div className="flex justify-between items-center pb-2 border-b border-b-gray-300">
                                                <h3 className="text-2xl font-bold text-blue-900">Choose Sales Order</h3>

                                                <p
                                                    className="text-xl px-2 border bg-red-600 rounded-full text-white hover:bg-red-500 cursor-pointer"
                                                    onClick={() => {
                                                        setSelectedSOModal(false);
                                                    }}
                                                >
                                                    X
                                                </p>
                                            </div>

                                            <div className="mt-1">
                                                <SelectSOTable
                                                    NoOfColumns={headersForTable.length}
                                                    data={salesOrderList}
                                                    headers={headersForTable}
                                                    setSelectedRow={setSelectedRows}
                                                    selectedRow={selectedRow}
                                                    setSelectedSO={setSelectedSO}
                                                    setSelectedSOId={setSelectedSOId}
                                                    setFormData={setFormData}
                                                    setOrderItem={setOrderItem}
                                                    setLoading={setLoading}
                                                    setBom={setBom}
                                                    type={type}
                                                    setSalesOrder={setSalesOrder}
                                                    setSOViewModal={setSOViewModal}
                                                    setSelectedSOModal={setSelectedSOModal}
                                                    setAllBomIds={setAllBomIds}
                                                    allBomIds={allBomIds}
                                                    allreadyProcessedQtyOfBOM={allreadyProcessedQtyOfBOM}
                                                    setAllreadyProcessedQtyOfBOM={setAllreadyProcessedQtyOfBOM}
                                                    allreadyProcessedOrderItems={allreadyProcessedOrderItems}
                                                    setAllreadyProcessedOrderItems={setAllreadyProcessedOrderItems}
                                                    setReturnItemsModal={setReturnItemsModal}
                                                    setReturnItems={setReturnItems}
                                                    setDispatchType={setDispatchType}
                                                    setIdOfSO={setIdOfSO}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                        </div>

                        {returnItemsModal && (
                            <div className="modal-content p-4 bg-white shadow rounded">
                                <h2 className="text-lg font-bold mb-4">Return Items</h2>
                                {Array.isArray(returnItems) && returnItems.length > 0 ? (
                                    <table className="table-auto w-full border">
                                        <thead>
                                            <tr className="bg-gray-100">
                                                <th className="border px-4 py-2">Key</th>
                                                <th className="border px-4 py-2">Colour</th>
                                                <th className="border px-4 py-2">Khaka</th>
                                                <th className="border px-4 py-2">Measurement</th>
                                                <th className="border px-4 py-2">Others</th>
                                                <th className="border px-4 py-2">Work</th>
                                                <th className="border px-4 py-2">Sale Qty</th>
                                                <th className="border px-4 py-2">Alter Qty</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {returnItems.map((item, index) => (
                                                <tr key={index}>
                                                    <td className="border px-4 py-2 text-center">{item.key}</td>
                                                    <td className="border px-4 py-2 text-center">{item.value?.colour}</td>
                                                    <td className="border px-4 py-2 text-center">{item.value?.khaka}</td>
                                                    <td className="border px-4 py-2 text-center">{item.value?.measurement}</td>
                                                    <td className="border px-4 py-2 text-center">{item.value?.others}</td>
                                                    <td className="border px-4 py-2 text-center">{item.value?.work}</td>
                                                    <td className="border px-4 py-2 text-center">{item.saleQty}</td>
                                                    <td className="border px-4 py-2 text-center">{item.alterQty}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <p>No return items available.</p>
                                )}
                            </div>
                        )}

                        <div className=' grid grid-cols-2 gap-6 mt-5'>
                            <div>
                                <label htmlFor="so_id">So Id:</label>
                                <input
                                    type="text"
                                    id="so_id"
                                    placeholder="Enter So Id"
                                    value={formData.so_id}
                                    name='so_id'
                                    className='p-2 border border-gray-400 bg-gray-100 rounded-md w-full'
                                    onChange={formDataHandler}
                                    disabled
                                    required
                                />
                            </div>
                            {/* Customer */}
                            {/* <div>
                                    <label htmlFor="customer">Customer:</label>
                                    <input
                                        type="text"
                                        id="customer"
                                        placeholder="Enter Customer Name"
                                        value={formData.customer}
                                        className='p-2 border border-gray-400 bg-gray-100 rounded-md w-full'
                                        name='customer'
                                        onChange={formDataHandler}
                                        required
                                        disabled
                                    />
                                </div>

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
                                </div> */}

                            {dispatchType !== "Return" ? (
                                <div>
                                    <label htmlFor="customer">Customer:</label>
                                    <input
                                        type="text"
                                        id="customer"
                                        placeholder="Enter Customer Name"
                                        value={formData.customer}
                                        className="p-2 border border-gray-400 bg-gray-100 rounded-md w-full"
                                        name="customer"
                                        onChange={formDataHandler}
                                        required
                                        disabled
                                    />
                                </div>
                            ) : (
                                <div className="flex flex-col">
                                    <FormLabel title={"Customer"} />
                                    <select
                                        value={formData.customer}
                                        name="customer"
                                        onChange={formDataHandler}
                                        className="border border-gray-300 bg-gray-100 rounded-md p-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="" disabled>
                                            Select Customer
                                        </option>
                                        {availableCustomers &&
                                            Array.isArray(availableCustomers) &&
                                            availableCustomers.length > 0 &&
                                            availableCustomers.map((item, index) => (
                                                <option key={item?.id} value={item?.id}>
                                                    {item?.company_name}
                                                </option>
                                            ))}
                                    </select>
                                </div>
                            )}


                            {/* Design Name */}
                            <div>
                                <label htmlFor="design_name">Design Name:</label>
                                <input
                                    type="text"
                                    id="design_name"
                                    placeholder="Enter Design Name"
                                    className='p-2 border border-gray-400 bg-gray-100 rounded-md w-full'
                                    value={formData.design_name}
                                    name='design_name'
                                    onChange={formDataHandler}
                                    required
                                    disabled
                                />
                            </div>
                            {/* Quantity */}
                            <div>
                                <label htmlFor="so_qty"> SO Qty:</label>
                                <input
                                    type="text"
                                    id="so_qty"
                                    placeholder="Enter SO Qty"
                                    value={formData.so_qty}
                                    name='so_qty'
                                    className='p-2 border border-gray-400 bg-gray-100 rounded-md w-full'
                                    onChange={formDataHandler}
                                    required
                                    disabled
                                />
                            </div>
                            {/* CN no */}
                            <div>
                                <label htmlFor="cn_no"> CN No:</label>
                                <input
                                    type="text"
                                    id="cn_no"
                                    placeholder="Enter CN No"
                                    value={formData.cn_no}
                                    name='cn_no'
                                    className='p-2 border border-gray-400 rounded-md w-full'
                                    onChange={formDataHandler}
                                    required
                                />
                            </div>

                            {/*  date */}
                            <div>
                                <label htmlFor="invoice_date">Invoice Date:</label>
                                <input
                                    type="date"
                                    id="invoice_date"
                                    name="invoice_date"
                                    value={formData.invoice_date}
                                    onChange={formDataHandler}
                                    required
                                    className='p-2 border border-gray-400 rounded-md w-full'
                                />
                            </div>
                            {/* // remarks and stitch remarks  */}
                            <div className='w-full'>
                                <label htmlFor="remarks">Remarks:</label>
                                <textarea
                                    name="remarks"
                                    value={formData.remarks}
                                    onChange={formDataHandler}
                                    placeholder='Enter Remarks'
                                    className='p-4 border border-gray-400 rounded-md w-full'
                                    id="" />
                            </div>

                            {/*  invoice no */}
                            <div>
                                <label htmlFor="invoice_no">Invoice No:</label>
                                <input
                                    type="text"
                                    id="invoice_no"
                                    name="invoice_no"
                                    placeholder='Enter Invoice No'
                                    value={formData.invoice_no}
                                    onChange={formDataHandler}
                                    required
                                    className='p-2 border border-gray-400 rounded-md w-full'
                                />
                            </div>

                        </div>




                        <div className=' flex justify-center items-center m-5 gap-2 text-white'>
                            <button
                                type='submit'
                                onClick={saveHandler}
                                className='p-3 bg-green-500 rounded-md hover:bg-green-600 hover:scale-105 transition-all duration-100 ease-in-out'> Save </button>

                            <button
                                onClick={clearButtonHandler}
                                className='p-3 bg-yellow-500 rounded-md hover:bg-yellow-600 hover:scale-105 transition-all duration-100 ease-in-out'> Clear </button>

                        </div>
                    </form>
                </div>
            </div>
        </div>

    )
}

export default DispatchEntry
