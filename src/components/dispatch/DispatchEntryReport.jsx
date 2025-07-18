// import axios from 'axios';
// import React, { use, useEffect, useState } from 'react'
// import { useSelector } from 'react-redux';
// import { useParams } from 'react-router-dom'
// import { toast } from 'react-toastify';

// const DispatchEntryReport = () => {
//     const {id} = useParams();
//     const {token, designation} = useSelector((state) => state.auth);
//     const [loading, setLoading] = useState(false);

//     const fetchData =async () => {
//         try {
//             setLoading(true);
//             const res =await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/dispatch-entry/details/${id}`, {}, {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 },
//             });
//             console.log(res?.data);

//             // toast.success("Data fetched successfully!", { position: "top-right" });
//         } catch (error) {
//             toast.error("Failed to fetch data. Please try again.", { position: "top-right" });
//             console.error("Error fetching data:", error);
//         }
//         finally {
//             setLoading(false);
//         }
//     }

//     useEffect(() => {
//         fetchData();
//     }, []);

//     console.log(id);
//   return (
//     <div>

//     </div>
//   )
// }

// export default DispatchEntryReport




import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const DispatchEntryReport = () => {
  const { id } = useParams();
  const { token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [dispatchData, setDispatchData] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/dispatch-entry/details/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDispatchData(res.data);
    } catch (error) {
      toast.error("Failed to fetch data. Please try again.", { position: "top-right" });
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  console.log("dispatchData: ", dispatchData)

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <div className="text-center text-gray-600 py-10">Loading...</div>;
  }

  if (!dispatchData) {
    return <div className="text-center text-red-600 py-10">No data available</div>;
  }

  const {
    so_id,
    convert_id,
    cn_no,
    invoice_no,
    invoice_date,
    remarks,
    qty,
    customer_master,
    design_master,
    internal_sales_order_entry,
    sales_oder_entry,
    dispatchType,
    alter_items
  } = dispatchData;

  const orderInfo = internal_sales_order_entry || sales_oder_entry;
  const orderItems = orderInfo?.order_items || {};

  return (
    <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-lg p-8 font-sans">
      <header className="mb-8 border-b pb-4">
        <h1 className="text-3xl font-bold text-blue-700 text-center">Dispatch Invoice</h1>
        <p className="text-center text-gray-600">Detailed report of dispatch entry</p>
      </header>

      <section className="mb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-3">Dispatch Info</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-800">
          <p><strong>SO ID:</strong> {so_id}</p>
          <p><strong>Convert ID:</strong> {convert_id}</p>
          <p><strong>CN No:</strong> {cn_no}</p>
          <p><strong>Invoice No:</strong> {invoice_no}</p>
          <p><strong>Invoice Date:</strong> {invoice_date}</p>
          <p><strong>Qty:</strong> {qty}</p>
          {dispatchData?.dispatchType === "Alter Item" && <p className="md:col-span-2"><strong>Dispatch Type:</strong> {dispatchType}</p>}
          <p className="md:col-span-2"><strong>Remarks:</strong> {remarks}</p>


        </div>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-3">Customer Info</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-800">
          <p><strong>Company Name:</strong> {customer_master?.company_name}</p>
          <p><strong>Billing Address:</strong> {customer_master?.billing_address}</p>
          <p><strong>Contact Number:</strong> {customer_master?.contact_number}</p>
          <p><strong>Email:</strong> {customer_master?.email_id}</p>
          <p><strong>Group:</strong> {customer_master?.group_name}</p>
          <p><strong>State:</strong> {customer_master?.state}</p>
        </div>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-3">Design Info</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-800">
          <p><strong>Design Number:</strong> {design_master?.design_number}</p>
          <p><strong>Total Cost:</strong> ₹{design_master?.total_design_cost}</p>
        </div>
      </section>

      {orderInfo && (
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-3">Order Info ({internal_sales_order_entry ? 'Internal' : 'External'})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-800">
            <p><strong>Order No:</strong> {orderInfo?.order_no}</p>
            <p><strong>Order Date:</strong> {orderInfo?.order_date}</p>
            <p><strong>Delivery Date:</strong> {orderInfo?.delivery_date}</p>
            <p><strong>Status:</strong> {orderInfo?.order_status}</p>
          </div>
        </section>
      )}

      {/* {dispatchType === "Alter Item" ?  <div className="modal-content p-4 bg-white shadow rounded">
          <h2 className="text-lg font-bold mb-4">Return Items</h2>
          {Array.isArray(alter_items) && alter_items.length > 0 ? (
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
                {alter_items.map((item, index) => (
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
        </div> :

      {orderItems && Object.keys(orderItems).length > 0 && (
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-3">Order Items</h2>
          <div className="overflow-auto rounded-lg shadow border">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-blue-100">
                <tr>
                  <th className="px-4 py-2 text-left font-medium text-gray-600">Item</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-600">Colour</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-600">Khaka</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-600">Measurement</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-600">Others</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-600">Work</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {Object.entries(orderItems).map(([itemName, details], index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-2 font-semibold text-gray-800">{itemName}</td>
                    <td className="px-4 py-2">{details.colour || '-'}</td>
                    <td className="px-4 py-2">{details.khaka || '-'}</td>
                    <td className="px-4 py-2">{details.measurement || '-'}</td>
                    <td className="px-4 py-2">{details.others || '-'}</td>
                    <td className="px-4 py-2">{details.work || '-'}</td>
                    <td className="px-4 py-2">{details.status ? 'Yes' : 'No'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}} */}

      {dispatchType === "Alter Item" ? (
        <div className="modal-content p-4 bg-white shadow rounded">
          <h2 className="text-lg font-bold mb-4">Return Items</h2>
          {Array.isArray(alter_items) && alter_items.length > 0 ? (
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
                {alter_items.map((item, index) => (
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
      ) : (
        orderItems && Object.keys(orderItems).length > 0 && (
          <section className="mb-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-3">Order Items</h2>
            <div className="overflow-auto rounded-lg shadow border">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-blue-100">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium text-gray-600">Item</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-600">Colour</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-600">Khaka</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-600">Measurement</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-600">Others</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-600">Work</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-600">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {Object.entries(orderItems).map(([itemName, details], index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-2 font-semibold text-gray-800">{itemName}</td>
                      <td className="px-4 py-2">{details.colour || '-'}</td>
                      <td className="px-4 py-2">{details.khaka || '-'}</td>
                      <td className="px-4 py-2">{details.measurement || '-'}</td>
                      <td className="px-4 py-2">{details.others || '-'}</td>
                      <td className="px-4 py-2">{details.work || '-'}</td>
                      <td className="px-4 py-2">{details.status ? 'Yes' : 'No'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )
      )}

    </div>
  );
};

export default DispatchEntryReport;
