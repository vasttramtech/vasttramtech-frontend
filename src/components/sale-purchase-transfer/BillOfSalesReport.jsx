import React, { useEffect, useRef, useState } from 'react'
import SmartTable1 from '../../smartTable/SmartTable1';
import { FcViewDetails } from 'react-icons/fc';
import { MdOtherHouses, MdOutlineDetails, MdPrint } from 'react-icons/md';
import { BounceLoader, PuffLoader } from "react-spinners";
import { TbListDetails } from 'react-icons/tb';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import ViewIcon from "../../assets/Others/ViewIcon.png";
import Pagination from '../utility/Pagination';


const headersForTable = ["Sale Bill Id", "Design Name", "SO ID", "Date", "Bill To", "Bill To Details", "Other Charges", "Total Bill Amount", "Processor", "Status", "Details", "Print"];

const BillOfSalesReport = () => {
  const location = useLocation();
  const title = location.state?.title || 'Bill of Sales Report';
  const { token, designation, id } = useSelector(state => state.auth);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [billData, setBillData] = useState([]);

  const [billOfSale, setBillOfSale] = useState(null);
  const [data, setData] = useState();

  //  adding pagination logic
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [paginationLoading, setPaginationLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Using useRef to get the table element reference
  const printableTableRef = useRef();

  const handlePrint = () => {
    const content = printableTableRef.current;  // Get the entire table content DOM
    const printWindow = window.open('', '', 'height=800,width=800');
    printWindow.document.write('<html><head><title>Print</title></head><body>');
    // Write the content of the table into the print window

    // Inject styles for the print layout
    printWindow.document.write(`
        <html>
          <head>
            <title>Print</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                margin: 20px;
              }
              table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 20px;
              }
              table th, table td {
                padding: 8px;
                text-align: left;
                border: 1px solid #ddd;
              }
              table th {
                background-color: #f2f2f2;
                font-weight: bold;
              }
              h1 {
                text-align: center;
                font-size: 24px;
                margin-bottom: 30px;
              }
              .table-container {
                margin-bottom: 40px;
              }
            </style>
          </head>
          <body>
            <h1>${title}</h1>
            <div class="table-container">
              ${content.innerHTML}
            </div>
          </body>
        </html>
      `);

    printWindow.document.close();  // Close the document for rendering
    printWindow.print();  // Trigger the print dialog
  }

  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = String(date.getFullYear()).slice(-2); // Get last 2 digits of year
    return `${day}/${month}/${year}`;
  }

  // const fetchBillOfSales = async () => {
  //   try {
  //     setLoading(true);
  //     const response = await axios.get(
  //       `${process.env.REACT_APP_BACKEND_URL}/api/bill-of-sales`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //         params: {
  //           "pagination[page]": page,
  //           "pagination[pageSize]": pageSize,
  //           "sort[0]": "createdAt:desc",
  //           // "filters[designation][$eq]": designation,
  //           // populate if needed
  //           "populate[design]": "*",
  //           "populate[processor]": "*",
  //           "populate[sales_order_entry]": "*",
  //           "populate[internal_sales_order_entry]": "*",
  //           "populate[bom_billOfSale][populate][jobber]": "*",
  //         },
  //       }
  //     );

  //     console.log("response: ", response)
  //     // const data = Array.isArray(response.data.data) ? response.data.data : [];
  //     // setTotalPages(response.data.meta.pagination.pageCount);
  //     // console.log("data: ", response.data);

  //     // Extract the actual data and pagination info
  //     const data = response.data.data || [];
  //     const pagination = response.data.meta.pagination || {};

  //     // Correctly set total pages from pagination data
  //     setTotalPages(pagination.pageCount || 1);
  //     const mappedData = data.map((bills) => {
  //       const isInternal = bills.internal_sales_order_entry;
  //       const isSales = bills.sales_order_entry;

  //       return {
  //         id: bills.id,
  //         design_name: bills?.design?.design_number,
  //         so_id: isInternal?.so_id || isSales?.so_id || "",
  //         date: formatDate(bills.ex_date),
  //         billTo: bills?.bom_billOfSale?.jobber?.jobber_name,
  //         billToDetails: bills?.bom_billOfSale?.jobber?.jobber_gstin,
  //         otherCharges: bills?.other_charges,
  //         Total_Amount: bills?.Total_Bill_of_sales_Amount,
  //         processor: bills.processor?.id ? (bills.processor?.name + "-" + bills.processor?.designation) : "N/A",
  //       };
  //     });

  //     setBillData(mappedData);

  //   } catch (error) {
  //     console.error("Error fetching jobber data:", error);
  //     if (error.response?.status === 401) {
  //       navigate("/login");
  //     }
  //   } finally {
  //     setLoading(false);
  //   }
  // }


  //   const fetchBillOfSales = async () => {
  //     try {
  //       setLoading(true);
  //       // const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/bill-of-sales?`, {
  //       //   headers: {
  //       //     Authorization: `Bearer ${token}`,
  //       //   },
  //       //   params:{
  //       //     "pagination[page]" : page,
  //       //     "pagination[pageSize]" : pageSize,
  //       //     "sort[0]": "createdAt:desc",
  //       //   }
  //       // });
  //     const response = await axios.get(
  //   `${process.env.REACT_APP_BACKEND_URL}/api/custom-get-bill-of-sales?page=${page}&pageSize=${pageSize}`, 
  //   {
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //     },
  //     params: {
  //       designation: designation,
  //       userId: id,
  //       "sort[0]": "createdAt:desc",
  //     },
  //   }
  // );

  //       console.log("response: ", response)
  //       // const data = Array.isArray(response.data.data) ? response.data.data : [];
  //       // setTotalPages(response.data.meta.pagination.pageCount);
  //       // console.log("data: ", response.data);

  //       // Extract the actual data and pagination info
  //       const data = response.data.data || [];
  //       const pagination = response.data.meta.pagination || {};

  //       // Correctly set total pages from pagination data
  //       setTotalPages(pagination.pageCount || 1);
  //       const mappedData = data.map((bills) => {
  //         const isInternal = bills.internal_sales_order_entry;
  //         const isSales = bills.sales_order_entry;

  //         return {
  //           id: bills.id,
  //           design_name: bills?.design?.design_number,
  //           so_id: isInternal?.so_id || isSales?.so_id || "",
  //           date: formatDate(bills.ex_date),
  //           billTo: bills?.bom_billOfSale?.jobber?.jobber_name,
  //           billToDetails: bills?.bom_billOfSale?.jobber?.jobber_gstin,
  //           otherCharges: bills?.other_charges,
  //           Total_Amount: bills?.Total_Bill_of_sales_Amount,
  //           processor: bills.processor?.id ? (bills.processor?.name + "-" + bills.processor?.designation) : "N/A",
  //         };
  //       });

  //       setBillData(mappedData);

  //     } catch (error) {
  //       console.error("Error fetching jobber data:", error);
  //       if (error.response?.status === 401) {
  //         navigate("/login");
  //       }
  //     } finally {
  //       setLoading(false);
  //     }
  //   }


  const fetchBillOfSales = async () => {
    try {
      setLoading(true);

      const params = {
        "pagination[page]": page,
        "pagination[pageSize]": pageSize,
        "sort[0]": "createdAt:desc",

        // Populate all required relations
        "populate[design]": "*",
        "populate[processor]": "*",
        "populate[sales_order_entry][populate][merchandiser]": "*",
        "populate[sales_order_entry][populate][processor]": "*",
        "populate[sales_order_entry][populate][so_items]": "*",
        "populate[internal_sales_order_entry][populate][merchandiser]": "*",
        "populate[internal_sales_order_entry][populate][processor]": "*",
        "populate[internal_sales_order_entry][populate][so_items]": "*",
        "populate[bom_billOfSale][populate][jobber]": "*",
        "populate[bom_billOfSale][populate][raw_material_qty][populate][raw_material_master]": "*",
        "populate[bom_billOfSale][populate][sfg_qty][populate][semi_finished_goods_master]": "*",

      };

      if (designation !== "Admin") {
        if (designation === "Merchandiser") {
          params["filters[$or][0][sales_order_entry][merchandiser][id][$eq]"] = id;
          params["filters[$or][1][internal_sales_order_entry][merchandiser][id][$eq]"] = id;
        } else {
          params["filters[$or][0][sales_order_entry][processor][id][$eq]"] = id;
          params["filters[$or][1][internal_sales_order_entry][processor][id][$eq]"] = id;
        }
      }

      if (searchTerm) {
        params["filters[$or][2][internal_sales_order_entry][so_id][$containsi]"] = searchTerm;
        params["filters[$or][3][sales_order_entry][so_id][$containsi]"] = searchTerm;
        params["filters[$or][4][design][design_number][$containsi]"] = searchTerm;
        params["filters[$or][5][bom_billOfSale][jobber][jobber_name][$containsi]"] = searchTerm;
        params["filters[$or][6][bom_billOfSale][jobber][jobber_gstin][$containsi]"] = searchTerm;
        params["filters[$or][7][processor][name][$containsi]"] = searchTerm;
        params["filters[$or][8][processor][designation][$containsi]"] = searchTerm;
        params["filters[$or][9][billOfSales_status][$containsi]"] = searchTerm;
      }

      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/bill-of-sales`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params,
        }
      );
      console.log("Data: ", response.data.data)
      const data = response.data.data || [];
      const pagination = response.data.meta.pagination || {};
      setTotalPages(pagination.pageCount || 1);


      const mappedData = data.map((bills) => {
        const isInternal = bills.internal_sales_order_entry;
        const isSales = bills.sales_order_entry;

        return {
          id: bills.id,
          design_name: bills?.design?.design_number,
          so_id: isInternal?.so_id || isSales?.so_id || "",
          date: formatDate(bills.ex_date),
          billTo: bills?.bom_billOfSale?.jobber?.jobber_name,
          billToDetails: bills?.bom_billOfSale?.jobber?.jobber_gstin,
          otherCharges: bills?.other_charges,
          Total_Amount: bills?.Total_Bill_of_sales_Amount,
          processor: bills.processor?.id
            ? `${bills.processor.name} - ${bills.processor.designation}`
            : "N/A",
          status: bills?.billOfSales_status
        };
      });

      setBillData(mappedData);
    } catch (error) {
      console.error("Error fetching bill of sales:", error);
      if (error.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };


  // useEffect(() => {
  //   if (!token) {
  //     navigate("/login");
  //     return;
  //   }
  //   fetchBillOfSales();
  // }, [token, page, pageSize]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (!token) {
        navigate("/login");
        return;
      }
      fetchBillOfSales();
    }, 1000);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, page, pageSize]);

  useEffect(() => {
    setPage(1);
  }, [searchTerm]);


  console.log("billData: ", billData)

  const fetchData = async (row) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/custom-bill-of-sale/${row.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Bill of Sale Data: ", response.data);
      if (response.data) {
        setBillOfSale(response.data);
        if (response.data.internal_sales_order_entry != null) {
          setData(response.data.internal_sales_order_entry);
        } else {
          setData(response.data.sales_order_entry);
        }
        return response.data; // ✅ return the fetched data
      }
      return null;
    } catch (error) {
      console.error("Error fetching raw material data:", error);
      if (error.response?.status === 401) {
        navigate("/login");
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleRowDataPrint = async (item) => {
    const data = await fetchData(item); // ✅ use returned data directly
    if (!data) return;

    const salesOrderData = data.sales_order_entry || data.internal_sales_order_entry;

    const printWindow = window.open('', '_blank', 'width=900,height=650');
    if (!printWindow) return;

    const rawMaterialsRows = data?.bom_billOfSale?.bom_detail
      ?.map(detail =>
        detail.rm?.map(entry => `
      <tr>
        <td>${entry.raw_material?.item_name || "-"}</td>
        <td>${entry.raw_material?.description || "-"}</td>
        <td>${entry.rm_qty || 0}</td>
      </tr>
    `).join('')
      ).join('');


    const orderItemsRows = Object.entries(salesOrderData?.order_items || {}).map(([part, details]) => (
      `
      <tr>
        <td>${part}</td>
        <td>${details?.work || '-'}</td>
        <td>${details?.khaka || '-'}</td>
        <td>${details?.colour || '-'}</td>
        <td>${details?.others || '-'}</td>
        <td>${details?.measurement || '-'}</td>
      </tr>
    `
    )).join('') || '';

    console.log(data);
    printWindow.document.write(`
  <html>
    <head>
      <title>Invoice - ${item.so_id}</title>
      <style>
        body {
          font-family: 'Arial', sans-serif;
          margin: 0;
          padding: 40px;
          color: #333;
          background-color: #fff;
        }
        .invoice-box {
          max-width: 1000px;
          margin: auto;
          padding: 30px;
          border: 1px solid #eee;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
          font-size: 16px;
          line-height: 24px;
        }
        .invoice-box table {
          width: 100%;
          border-collapse: collapse;
        }
        .invoice-box table td, .invoice-box table th {
          padding: 8px;
          border: 1px solid #ddd;
        }
        .heading {
          background: #f5f5f5;
          font-weight: bold;
        }
        .title {
          font-size: 30px;
          font-weight: bold;
          color: #333;
        }
        .section-title {
          margin-top: 40px;
          margin-bottom: 10px;
          font-weight: bold;
          font-size: 20px;
          border-bottom: 2px solid #ddd;
          padding-bottom: 5px;
        }
        .total {
          text-align: right;
          font-weight: bold;
          background: #f9f9f9;
        }
        .footer {
          text-align: center;
          margin-top: 50px;
          font-size: 14px;
          color: #777;
        }
        @media print {
          body {
            margin: 0;
            box-shadow: none;
          }
        }
      </style>
    </head>
    <body>
      <div class="invoice-box">
        <table>
          <tr>
            <td class="title" colspan="2">Vasttram</td>
            <td colspan="2" style="text-align:right">
              <strong>Invoice #:</strong> ${data.id}<br />
              <strong>Date:</strong> ${new Date(data.createdAt).toLocaleDateString()}<br />

            </td>
          </tr>
          <tr>
            <td colspan="2">
              <strong>From:</strong><br/>
              ${data?.purchaser_Details?.comapny_name}<br/>
              ${data?.purchaser_Details?.address}<br/>
              ${data?.purchaser_Details?.phone}<br/>
              ${data?.purchaser_Details?.gst_no}<br/>
            </td>
            <td style="text-align:right">
              ${data?.seller_detail}
            </td>
          
          </tr>
        </table>

        <div class="section-title">Design & Order Details</div>
        <table>
          <tr class="heading">
            <th>Design</th>
            <th>Order No</th>
            <th>SO ID</th>
            <th>Qty</th>
          </tr>
          <tr>
            <td>${data.design?.design_number || "-"}</td>
            <td>${data.sales_order_entry?.order_no || "-"}</td>
            <td>${data.so_id || "-"}</td>
            <td>${data.sales_order_entry?.qty || 0}</td>
          </tr>
        </table>

        <div class="section-title">Order Items</div>
        <table>
          <tr class="heading">
            <th>Part</th>
            <th>Work</th>
            <th>Khaka</th>
            <th>Colour</th>
            <th>Others</th>
            <th>Measurement</th>
          </tr>
          ${orderItemsRows}
        </table>

        <div class="section-title">Raw Materials</div>
        <table>
          <tr class="heading">
            <th>Item Name</th>
            <th>Description</th>
            <th>Quantity</th>

          </tr>
          ${rawMaterialsRows}
          <tr>
            <td colspan="4" class="total">Total Raw Material Cost:</td>
            <td class="total">₹${data?.Total_Bill_of_sales_Amount || 0}</td>
          </tr>
        </table>

        <div class="section-title">Additional Info</div>
        <table>
          <tr class="heading">
            <th>Job Note</th>
            <th>Remarks</th>
            <th>Other Charges</th>
            <th>Status</th>
          </tr>
          <tr>
            <td>${data.job_note || '-'}</td>
            <td>${data.remarks || '-'}</td>
            <td>₹${data.other_charges || 0}</td>
            <td>${data.billOfSales_status || '-'}</td>
          </tr>
        </table>

        <div class="section-title">Grand Total</div>
        <table>
          <tr>
            <td colspan="4" class="total">Grand Total Amount:</td>
            <td class="total"><strong>₹${data.Total_Bill_of_sales_Amount + (data.other_charges || 0)}</strong></td>
          </tr>
        </table>

        <p class="footer">Thank you for your business!</p>
      </div>
    </body>
  </html>
`);

    printWindow.document.close();
    printWindow.onafterprint = () => {
      printWindow.close();
    };

    printWindow.onbeforeunload = () => {
      printWindow.close();
    };

    printWindow.onblur = () => {
      printWindow.close();
    };

    printWindow.onafterprint = () => {
      setTimeout(() => printWindow.close(), 100);
    };


    printWindow.focus();
  };




  const enhancedData = billData.map((item) => ({
    ...item,
    Details: (
      <div className="flex justify-center items-center space-x-2 border p-2 rounded-lg text-white bg-blue-500 hover:bg-blue-700">
        <button type='button' onClick={() => handleView(item)}>
          Details
        </button>
      </div>

    ),
    Print: (
      <div className="flex justify-center items-center space-x-2 border p-2 rounded-lg text-white bg-green-500 hover:bg-green-700">
        <button type='button' onClick={() => handleRowDataPrint(item)}>
          Print
        </button>
      </div>

    ),
    // Cancel: (
    //   <div className="flex justify-center items-center space-x-2 border p-2 rounded-lg text-white bg-gray-500 hover:bg-gray-700">
    //     <button type='button' onClick={() => handleView(item)}>
    //       Cancel
    //     </button>
    //   </div>

    // )
  }));

  const handleView = (rowData) => {
    navigate(`/bill-of-sale/${rowData.id}`);
    // console.log("item: ", rowData);
  };


  return (
    <div className="py-2 bg-white rounded-lg relative">
      {loading ? (
        <div className="absolute inset-0 flex justify-center items-center mt-64 bg-opacity-50 bg-gray-200 z-10">
          <BounceLoader size={100} color={"#1e3a8a"} loading={loading} />
        </div>
      ) : (
        <div>
          <h1 className="text-3xl font-bold text-blue-900 mb-4">{title}</h1>
          <div className="my-8" ref={printableTableRef}>

            {paginationLoading ? (
              <div className="flex p-5 justify-center items-center space-x-2 mt-4 border border-gray-400 rounded-lg">
                <BounceLoader size={20} color="#1e3a8a" />
              </div>
            ) : (
              <>
                {/* <SmartTable1 headers={headers} data={updateData} /> */}
                {/* <SmartTable1 headers={headersForTable} data={enhancedData} /> */}

                <SmartTable1
                  headers={headersForTable}
                  data={enhancedData}
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                />


                <Pagination
                  setPage={setPage}
                  totalPages={totalPages}
                  page={page}
                  setPageSize={setPageSize}
                  pageSize={pageSize}
                />
              </>
            )}
          </div>



          <button onClick={handlePrint} className="mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Print Table
          </button>
        </div>)}
    </div>
  )
}

export default BillOfSalesReport;
