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
import SmartTable from '../../smartTable/SmartTable';
import Pagination10 from '../utility/Pagination10';




const headersForTable = ["SO Return Id", "SO ID", "Return Type", "Return Date", "Customer", "Bill Number", "CN No.", "Remarks", "Details"];

const SalesReturnReports = () => {
    const location = useLocation();
    const title = location.state?.title || 'Bill of Sales Report';
    const { token, designation, id } = useSelector(state => state.auth);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [salesOrderReturn, setSalesOrderReturn] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    //  adding pagination logic
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize, setPageSize] = useState(10);
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

    const fetchSalesReturnData = async () => {
        try {
            setPaginationLoading(true);
            const response = await axios.get(
                `${process.env.REACT_APP_BACKEND_URL}/api/sales-order-returns?populate=*`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    params: {
                        designation: designation,
                        userId: id,
                        "sort[0]": "createdAt:desc",
                        ...(searchTerm && {
                            "filters[$or][0][so_id][$containsi]": searchTerm,
                            "filters[$or][1][return_type][$containsi]": searchTerm,
                            "filters[$or][2][return_date][$containsi]": searchTerm,
                            "filters[$or][3][bill_No][$containsi]": searchTerm,
                            "filters[$or][4][cn_no][$containsi]": searchTerm,
                            "filters[$or][5][remarks][$containsi]": searchTerm,
                            "filters[$or][6][customer_master][company_name][$containsi]": searchTerm
                        }),
                    },
                }
            );

            console.log("response: ", response)

            // Extract the actual data and pagination info
            const data = response.data.data || [];
            const pagination = response.data.meta.pagination || {};

            // Correctly set total pages from pagination data
            setTotalPages(pagination.pageCount || 1);
            const mappedData = data.map((returns) => {
                return {
                    id: returns.id,
                    so_id: returns?.so_id,
                    returnType: returns?.return_type,
                    returnDate: returns?.return_date,
                    customer: returns?.customer_master?.company_name || "",
                    bill_No: returns?.bill_No,
                    cn_no: returns?.cn_no,
                    remarks: returns?.remarks

                };
            });

            setSalesOrderReturn(mappedData);

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
    //     if (!token) {
    //         navigate("/login");
    //         return;
    //     }
    //     fetchSalesReturnData();
    // }, [token, page, pageSize]);

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (!token) {
                navigate("/login");
                return;
            }
            fetchSalesReturnData();
        }, 1000);

        return () => clearTimeout(delayDebounce);
    }, [searchTerm]);

    useEffect(() => {
        if (!token) {
            navigate("/login");
            return;
        }
        fetchSalesReturnData();
    }, [token, page, pageSize]);

    useEffect(() => {
        setPage(1);
    }, [searchTerm]);

    console.log("salesOrderReturn: ", salesOrderReturn)


    const enhancedData = salesOrderReturn.map((item) => ({
        ...item,
        Details: (
            <div className="flex justify-center items-center space-x-2 border p-2 rounded-lg text-white bg-blue-500 hover:bg-blue-700">
                <button type='button' onClick={() => handleView(item)}>
                    Details
                </button>
            </div>

        )
    }));

    const handleView = (rowData) => {
        navigate(`/sales-return-view/${rowData.id}`);
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
                <h1 className="text-2xl font-bold text-blue-900 pb-2 border-b mb-4">{title}</h1>
                <div className="" ref={printableTableRef}>


                    {/* <SmartTable1 headers={headers} data={updateData} /> */}
                    {/* <SmartTable1 headers={headersForTable} data={enhancedData} /> */}

                    <SmartTable
                        headers={headersForTable}
                        data={enhancedData}
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        loading={paginationLoading}
                        setLoading={setPaginationLoading}
                    />

                    <div className='flex justify-between items-center px-4'>

                        <button onClick={handlePrint} className=" py-2 px-4    bg-blue-500 text-white rounded hover:bg-blue-600">
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

export default SalesReturnReports;
