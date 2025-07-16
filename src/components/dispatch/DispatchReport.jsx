import React, { useEffect, useRef, useState } from 'react'
import SmartTable1 from '../../smartTable/SmartTable1';
import { BounceLoader, PuffLoader } from "react-spinners";
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import Pagination from '../utility/Pagination';




const headersForTable = [
  "Invoice No",
  "SO ID",
  "Convert Id",
  // "Order No", 
  "Invoice",
  "CN No",
  // "Status", 
  "Invoice Date",
  "Customer Name",
  "Design Number",
  "Colour",
  "Qty",
  "Remarks",
  "Processor",
  "Detr",
  "View"
];

const DispatchReport = () => {
  const location = useLocation()
  const title = location.state?.title || 'Dispatch Report';
  const { token, designation, id } = useSelector(state => state.auth);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);


  const [dispatchData, setDispatchData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");


  //  adding pagination logic
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [paginationLoading, setPaginationLoading] = useState(false);

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


  /// we have to replace this api with the dispatch entry one
  const fetchDispatchData = async () => {
    try {
      setLoading(true);
      let params = {
        "pagination[page]": page,
        "pagination[pageSize]": pageSize,
        "sort[0]": "createdAt:desc",

        // populate all required relations
        "populate[design_master][populate]": "color",
        "populate[customer_master][fields][0]": "company_name",
        "populate[sales_oder_entry][populate]": "processor",
        "populate[internal_sales_order_entry][populate]": "processor",
      };

      // Add conditional access control filters
      if (designation === "Merchandiser" && id) {
        params["filters[$or][0][sales_oder_entry][merchandiser][id][$eq]"] = id;
        params["filters[$or][1][internal_sales_order_entry][merchandiser][id][$eq]"] = id;
      } else if (designation !== "Admin" && id) {
        params["filters[$or][0][sales_oder_entry][processor][id][$eq]"] = id;
        params["filters[$or][1][internal_sales_order_entry][processor][id][$eq]"] = id;
      }

      if (searchTerm) {
        params = {
          ...params,
          "filters[$or][0][id][$containsi]": searchTerm,
          "filters[$or][1][so_id][$containsi]": searchTerm,
          "filters[$or][2][convert_id][$containsi]": searchTerm,
          "filters[$or][3][invoice_no][$containsi]": searchTerm,
          "filters[$or][4][cn_no][$containsi]": searchTerm,
          "filters[$or][5][invoice_date][$containsi]": searchTerm,
          "filters[$or][6][customer_master][company_name][$containsi]": searchTerm,
          "filters[$or][7][design_master][design_number][$containsi]": searchTerm,
          "filters[$or][8][design_master][color][color_name][$containsi]": searchTerm,
          "filters[$or][9][qty][$containsi]": searchTerm,
          "filters[$or][10][remarks][$containsi]": searchTerm,
          "filters[$or][11][sales_oder_entry][processor][name][$containsi]": searchTerm,
          "filters[$or][12][internal_sales_order_entry][processor][name][$containsi]": searchTerm,
        };
      }

      // API call
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/dispatch-entries`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: params,
        }
      );

      const data = Array.isArray(response.data.data) ? response.data.data : [];
      setTotalPages(response.data.meta.pagination.pageCount);
      console.log("data: ", response.data);

      const mappedData = data?.map((dispatches) => {

        return {
          invoiceNo: dispatches?.id,
          so_id: dispatches?.so_id || "N/A",
          convert_id: dispatches?.convert_id || "-",
          // order_no: dispatches?.order_no || "N/A",
          invoice: dispatches?.invoice_no || "N/A",
          cn_no: dispatches?.cn_no || "N/A",
          // status: dispatches?.status || "N/A",
          invoice_date: formatDate(dispatches?.invoice_date) || "N/A",
          customer_name: dispatches?.customer_master?.company_name || "-",
          design_number: dispatches?.design_master?.design_number || "N/A",
          colour: dispatches?.design_master?.color?.color_name || "N/A",
          qty: dispatches?.qty || "N/A",
          remarks: dispatches?.remarks || "N/A",
          processor: dispatches?.sales_oder_entry?.processor?.name || dispatches?.internal_sales_order_entry?.processor?.name || "N/A",
        };
      });

      setDispatchData(mappedData);

    } catch (error) {
      console.error("Error fetching jobber data:", error);
      if (error.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  }

  // useEffect(() => {
  //   if (!token) {
  //     navigate("/login");
  //     return;
  //   }
  //   fetchDispatchData();
  // }, [token, page, pageSize]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (!token) {
        navigate("/login");
        return;
      }
      fetchDispatchData();
    }, 1000);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, page, pageSize]);

  useEffect(() => {
    setPage(1);
  }, [searchTerm]);

  console.log("dispatchData: ", dispatchData)






  const enhancedData = dispatchData.map((item) => ({
    ...item,

    Print: (
      <div className="flex justify-center items-center space-x-2 border p-2 rounded-lg text-white bg-blue-500 hover:bg-blue-700">
        <button type='button' onClick={() => console.log("Detr Clicked")}>
          Detr
        </button>
      </div >
    ),
    View: (
      <div className="flex justify-center items-center space-x-2 border p-2 rounded-lg text-white bg-green-500 hover:bg-green-700">
        <button type='button' onClick={() => navigate(`/dispatch-entry-report/${item.invoiceNo}`)}>
          View
        </button>
      </div >
    )

  }));


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


export default DispatchReport
