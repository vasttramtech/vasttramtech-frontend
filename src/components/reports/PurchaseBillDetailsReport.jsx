
import React, { useEffect, useRef, useState } from 'react'
import SmartTable1 from '../../smartTable/SmartTable1';
import { BounceLoader } from "react-spinners";
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import Pagination from '../utility/Pagination';
import ReportTable from '../../smartTable/ReportTable';
import ExportToExcel from '../utility/ExportToExcel';
import TableWithoutSearch from '../../smartTable/TableWithoutSearch';
import Search from "../../assets/Others/Search.png";



const headersForTable = [
    "So",
    "Bill No",
    "Jobber",
    "Design",
    "Colour",
    "Item",
    "Note",
    "Sale Date",
    "Clear Date",
    "Ex Date",
    "Pur Date",
    "Sale Qty",
    "Already Pur Qty",
    "Balance Qty",
    "Processor",
]

const PurchaseBillDetailsReport = () => {

    const location = useLocation();
    const title = location.state?.title || 'Purchase Bill Details Report';
    const { token } = useSelector(state => state.auth);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [purchaseData, setPurchaseData] = useState([]);


    //  adding pagination logic
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [paginationLoading, setPaginationLoading] = useState(false);

    // date filter states
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    // search state
    const [searchTerm, setSearchTerm] = useState('');
    const [clearTrigger, setClearTrigger] = useState(false);

    function formatDate(dateString) {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
        const year = String(date.getFullYear()).slice(-2); // Get last 2 digits of year
        return `${day}/${month}/${year}`;
    }

    const fetchBillOfSales = async () => {
        try {
            setPaginationLoading(true);
            const params = {
                page, pageSize
            };


            // Add filters if dates are selected
            if (fromDate) params.fromDate = fromDate;
            if (toDate) params.toDate = toDate;

            if (searchTerm?.trim()) {
                //     setFromDate(null);
                //     setToDate(null);
                params.searchTerm = searchTerm.trim();
            }
            // else if(!searchTerm?.trim() && (fromDate || toDate)){
            //     params.fromDate = fromDate;
            //     params.toDate = toDate;
            // }

            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/bill-of-purchase/get-purchase-bill-report`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params,
            })
            console.log("data: ", response);

            const data = Array.isArray(response.data.data) ? response.data.data : [];
            setTotalPages(response?.data?.meta?.pageCount);

            const mappedData = data.map((bills) => {

                return {
                    so: bills?.so_id || "N/A",
                    bill_No: bills?.reference_bill || "-",
                    jobber: bills?.jobber?.jobber_name || "N/A",
                    design: bills?.design || "N/A",
                    colour: bills?.color?.color_name || "N/A",
                    item: bills?.item.semi_finished_goods_name || "N/A",
                    note: bills?.jobNote || "N/A",
                    sale_date: formatDate(bills?.billDate) || "-",
                    clear_date: formatDate(bills?.clearDate) || "-",
                    ex_date: formatDate(bills?.ex_date) || "-",
                    pur_date: formatDate(bills?.purDate) || "-",
                    sale_qty: bills?.qty || "0",
                    already_received_qty: bills?.alreadyReceived || "0",
                    balance_qty: (bills?.qty - bills?.alreadyReceived) || "0",
                    processor: bills?.processor || "N/A",
                };
            });

            setPurchaseData(mappedData);

        } catch (error) {
            console.error("Error fetching jobber data:", error);
            if (error.response?.status === 401) {
                navigate("/login");
            }
        } finally {
            setLoading(false);
            setPaginationLoading(false);
        }
    }


    const enhancedData = purchaseData.map((item) => ({
        ...item,

    }));


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
        if (clearTrigger) {
            fetchBillOfSales();
            setPage(1);
            setClearTrigger(false);
        }
    }, [clearTrigger]);


    useEffect(() => {
        setPage(1);
    }, [searchTerm, clearTrigger]);


    const clearHandler = () => {
        setFromDate('');
        setToDate('');
        setClearTrigger(true);
    }

    return (
        <div className="py-2 bg-white rounded-lg relative">
            {loading ? (
                <div className="absolute inset-0 flex justify-center items-center mt-64 bg-opacity-50 bg-gray-200 z-10">
                    <BounceLoader size={100} color={"#1e3a8a"} loading={loading} />
                </div>
            ) : (
                <div>
                    <h1 className="text-3xl font-bold text-blue-900 mb-4">{title}</h1>
                    <div className="my-8" >


                        {paginationLoading ? (
                            <div className="flex p-5 justify-center items-center space-x-2 mt-4 border border-gray-400 rounded-lg">
                                <BounceLoader size={20} color="#1e3a8a" />
                            </div>
                        ) : (
                            <>
                                <div className='flex justify-between items-center w-[90%]'>

                                    <div className="flex items-center">
                                        <input
                                            type="text"
                                            placeholder="Auto Search..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="px-3 py-2 border rounded-lg border-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        />
                                    </div>

                                    <div className="flex gap-4 mb-4">
                                        <div>
                                            <label className="block text-sm text-gray-700">From Date:</label>
                                            <input
                                                type="date"
                                                value={fromDate || ""}
                                                onChange={(e) => setFromDate(e.target.value)}
                                                className="border border-gray-300 rounded px-2 py-1"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-gray-700">To Date:</label>
                                            <input
                                                type="date"
                                                value={toDate || ""}
                                                onChange={(e) => setToDate(e.target.value)}
                                                className="border border-gray-300 rounded px-2 py-1"
                                            />
                                        </div>
                                        <button
                                            type='button'
                                            onClick={() => {
                                                fetchBillOfSales();
                                                setPage(1);
                                            }}
                                            className="self-end bg-blue-600 text-white text-lg px-4 py-1 rounded hover:bg-blue-700"
                                        >
                                            Filter
                                        </button>
                                        <button
                                            type='button'
                                            onClick={clearHandler}
                                            className="self-end bg-red-600 text-white text-lg px-4 py-1 rounded hover:bg-red-700"
                                        >
                                            Clear
                                        </button>
                                    </div>

                                </div>

                                <TableWithoutSearch headers={headersForTable} data={enhancedData} />

                                <div className='px-5 flex justify-between items-center'>
                                    <ExportToExcel data={purchaseData} reportName={"Sale Bill Report"} />

                                    <Pagination
                                        setPage={setPage}
                                        totalPages={totalPages}
                                        page={page}
                                        setPageSize={setPageSize}
                                        pageSize={pageSize}
                                    />
                                </div>
                            </>
                        )}
                    </div>



                </div>)
            }
        </div >
    )
}



export default PurchaseBillDetailsReport
