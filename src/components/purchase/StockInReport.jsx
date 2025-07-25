import React, { useEffect, useRef, useState } from 'react'
import SmartTable from '../../smartTable/SmartTable';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import Pagination10 from '../utility/Pagination10';
import { BounceLoader } from 'react-spinners';



const headersForTable = [
  "StockIn Id",
  "StockIn Date",
  "Supplier Name",
  "Invoice No",
  "Invoice Data",
  "Challan No",
  "Remarks",
  "PO ID",
  "State Name",
  "Details"
];



const StockInReport = () => {
  const location = useLocation()
  const title = location.state?.title || 'Stock In Report';
  const { token } = useSelector(state => state.auth);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stockData, setBillData] = useState([]);


  //  adding pagination logic
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
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


  const fetchStockInData = async () => {
    try {

      setPaginationLoading(true);
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/stock-ins`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          "pagination[page]": page,
          "pagination[pageSize]": pageSize,
          "sort[0]": "createdAt:desc",
          ...(searchTerm && {
            "filters[$or][0][id][$containsi]": searchTerm,
            "filters[$or][1][date][$containsi]": searchTerm,
            "filters[$or][2][invoice_no][$containsi]": searchTerm,
            "filters[$or][3][invoice_date][$containsi]": searchTerm,
            "filters[$or][4][challan_no][$containsi]": searchTerm,
            "filters[$or][5][remark][$containsi]": searchTerm,
            "filters[$or][6][purchase_order][id][$containsi]": searchTerm,
            "filters[$or][7][purchase_order][supplier][company_name][$containsi]": searchTerm,
            "filters[$or][8][purchase_order][supplier][state][$containsi]": searchTerm,
          }),
        }
      });

      const data = Array.isArray(response.data.data) ? response.data.data : [];
      setTotalPages(response.data.meta.pagination.pageCount);
      console.log("data of stock in report : ", response.data);
      const mappedData = data?.map((stocks) => {
        return {
          id: stocks.id,
          date: formatDate(stocks?.date) || "N/A",
          supplier_name: stocks?.purchase_order?.supplier?.company_name || "N/A",
          invoice_number: stocks.invoice_no,
          invoice_date: formatDate(stocks.invoice_date),
          challan_number: stocks.challan_no,
          remarks: stocks.remark,
          po_id: stocks?.purchase_order?.id,
          state_name: stocks?.purchase_order?.supplier?.state

        };
      });

      setBillData(mappedData);

    } catch (error) {
      console.error("Error fetching jobber data:", error);
      if (error.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setPaginationLoading(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (!token) {
        navigate("/login");
        return;
      }
      fetchStockInData();
    }, 1000);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, page, pageSize]);

  useEffect(() => {
    setPage(1);
  }, [searchTerm]);

  console.log("stockData: ", stockData)

  const enhancedData = stockData.map((item) => ({
    ...item,
    Actions: (
      <div className="flex justify-center items-center space-x-2 border border-gray-500 bg-blue-500 hover:bg-blue-700 text-white px-2 py-1 rounded duration-200 transition-all ease-in-out">
        <button onClick={() => handleView(item)}>
          Details
        </button>
      </div >
    )
  }));

  const handleView = (rowData) => {
    navigate(`/stock-in-view/${rowData.id}`);
    // console.log("item: ", rowData);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <BounceLoader color="#1e3a8a" />
      </div>
    )
  }


  return (
    <div className="p-6 bg-white rounded-lg relative">

      <div>
        <h1 className="text-2xl border-b pb-2 font-bold text-blue-900 ">{title}</h1>
        <div className="" ref={printableTableRef}>



          <SmartTable
            headers={headersForTable}
            data={enhancedData}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            loading={paginationLoading}
            setLoading={setPaginationLoading}
          />
        </div>


        <div className='flex items-center justify-between'>
          <button onClick={handlePrint} className="mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Print Table
          </button>

          <Pagination10
            setPage={setPage}
            totalPages={totalPages}
            page={page}
            setPageSize={setPageSize}
            pageSize={pageSize}
            loading={paginationLoading}
            setLoading={setPaginationLoading}
          />

        </div>
      </div>
    </div>
  )
}

export default StockInReport
