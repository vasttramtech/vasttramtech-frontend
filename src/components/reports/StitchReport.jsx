
import React, { useEffect, useRef, useState } from 'react'
import SmartTable1 from '../../smartTable/SmartTable1';
import { BounceLoader } from "react-spinners";
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import Pagination from '../utility/Pagination';
import SmartTable from '../../smartTable/SmartTable';
import Pagination10 from '../utility/Pagination10';




const headersForTable = [
  "Clients",
  "Design Number",
  "Qty",
  "Stich Date",
  "Remarks",
  "BP/Grown/Kurti",
  "Lehenga/Sharara",
  "Dupatta 1",
  "Dupatta 2",
  "Processor",
  "Stitch Status",
  "Clear Status",
  "View",
];

const StitchReport = () => {


  const location = useLocation()
  const title = location.state?.title || 'Dispatch Report';
  const { token } = useSelector(state => state.auth);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);


  const [stitchData, setStitchData] = useState([]);


  //  adding pagination logic
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [paginationLoading, setPaginationLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Using useRef to get the table element reference
  const printableTableRef = useRef();

  /// we have to replace this api with the dispatch entry one
  const fetchStitchData = async () => {
    try {
      setPaginationLoading(true);
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/stitching-entries?populate[sales_order_entry][populate]=customer&populate[stitcher]=*&populate[processor][fields][0]=name&populate[order_Items]=*&populate[bom][populate]=sfg&populate[internal_sales_order_entry][populate]=*&sort=id:desc`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          "pagination[page]": page,
          "pagination[pageSize]": pageSize,
          "sort[0]": "createdAt:desc",
          ...(searchTerm && {
            // "filters[$or][0][sales_order_entry][customer][company_name][$containsi]": searchTerm,
            // "filters[$or][1][internal_sales_order_entry][so_id][$containsi]": searchTerm,
            "filters[$or][0][design_number][$containsi]": searchTerm,
            "filters[$or][1][date][$containsi]": searchTerm,
            "filters[$or][2][remarks][$containsi]": searchTerm,
            "filters[$or][3][processor][name][$containsi]": searchTerm,
          }),

        }
      });
      const data = Array.isArray(response.data.data) ? response.data.data : [];
      setTotalPages(response.data.meta.pagination.pageCount);
      console.log("data: ", response.data);

      const mappedData = data?.map((entry) => {
        const id = entry.id;

        return {
          client: entry?.sales_order_entry?.customer?.company_name || entry?.internal_sales_order_entry?.so_id || "N/A",
          design_number: entry?.design_number || "N/A",
          qty: entry?.sales_order_entry?.qty || entry?.internal_sales_order_entry?.qty || "N/A",
          stitch_date: formatDate(entry?.date) || "N/A",
          remarks: entry?.remarks || "N/A",
          bp_grown_kurti: entry?.order_Items[0]?.Khaka || "-",
          lehenga_sharara: entry?.order_Items[1]?.Khaka || "-",
          dup1: entry?.order_Items[2]?.Khaka || "-",
          dup2: entry?.order_Items[3]?.Khaka || "-",
          processor: entry?.processor?.name || "N/A",
          stitch_status: entry?.stitch_status || "N/A",
          clear_status: formatDate(entry?.due_date) || "N/A",

          View: (
            <div className="flex justify-center items-center space-x-2 border p-2 rounded-lg text-white bg-blue-500 hover:bg-blue-700">
              <button type='button' onClick={() => handleView(id)}>
                View
              </button>
            </div>
          )
        };
      });


      setStitchData(mappedData);

    } catch (error) {
      console.error("Error fetching jobber data:", error);
      if (error.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setPaginationLoading(false);
      setLoading(false);
    }
  }

  // useEffect(() => {
  //   if (!token) {
  //     navigate("/login");
  //     return;
  //   }
  //   fetchStitchData();
  // }, [token, page, pageSize]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (!token) {
        navigate("/login");
        return;
      }
      fetchStitchData();
    }, 1000);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, page, pageSize]);

  useEffect(() => {
    setPage(1);
  }, [searchTerm]);

  console.log("stitchData: ", stitchData)

  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = String(date.getFullYear()).slice(-2); // Get last 2 digits of year
    return `${day}/${month}/${year}`;
  }



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

  const handleView = (rowData) => {
    navigate(`/stitching-entry/${rowData}`);
  }


  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <BounceLoader color="#1e3a8a" />
      </div>
    )
  }


  return (
    <div className="p-6 bg-white rounded-lg relative" style={{ boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)" }}>

      <div>
        <h1 className="text-2xl font-bold text-blue-900 mb-4 pb-2 border-b">{title}</h1>
        <div className="" ref={printableTableRef}>


          {/* <SmartTable1 headers={headers} data={updateData} /> */}
          {/* <SmartTable1 headers={headersForTable} data={stitchData} /> */}
          <SmartTable
            headers={headersForTable}
            data={stitchData}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            loading={paginationLoading}
            setLoading={setPaginationLoading}
          />

          <div className='flex justify-between items-center px-5'>

            <button onClick={handlePrint} className="mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              Print Table
            </button>
            <Pagination10
              setPage={setPage}
              totalPages={totalPages}
              page={page}
              setPageSize={setPageSize}
              pageSize={pageSize}
            />

          </div>
        </div>

      </div>
    </div>
  )
}



export default StitchReport
