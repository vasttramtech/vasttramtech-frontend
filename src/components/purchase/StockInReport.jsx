import React, { useEffect, useRef, useState } from 'react'
import SmartTable from '../../smartTable/SmartTable';
import { FcViewDetails } from 'react-icons/fc';
import { MdOutlineDetails, MdPrint } from 'react-icons/md';
import { BounceLoader, PuffLoader } from "react-spinners";
import { TbListDetails } from 'react-icons/tb';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import ViewIcon from "../../assets/Others/ViewIcon.png";
import Pagination from '../utility/Pagination';
import SmartTable1 from '../../smartTable/SmartTable1';



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


  const fetchStockInData = async () => {
    try {

      setLoading(true);
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

  console.log("stockData: ", stockData)

  const enhancedData = stockData.map((item) => ({
    ...item,
    Actions: (
      <div className="flex justify-center items-center space-x-2 border border-gray-500 bg-gray-500 hover:bg-gray-700 text-white px-2 py-1 rounded">
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

export default StockInReport
