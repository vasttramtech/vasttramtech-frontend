
import React, { useEffect, useRef, useState } from 'react'
import SmartTable1 from '../../smartTable/SmartTable1';
import { BounceLoader } from "react-spinners";
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import Pagination from '../utility/Pagination';
import ReportTable from '../../smartTable/ReportTable';
import ExportToExcel from '../utility/ExportToExcel';




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
    "Pur Qty",
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
    const [pageSize, setPageSize] = useState(5);
    const [paginationLoading, setPaginationLoading] = useState(false);

    // date filter states
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);


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
                "pagination[page]": page,
                "pagination[pageSize]": pageSize,
                "sort[0]": "createdAt:desc",
            };

            // Add filters if dates are selected
            if (fromDate) params["filters[createdAt][$gte]"] = fromDate;
            if (toDate) params["filters[createdAt][$lte]"] = toDate;

            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/bill-of-purchases?populate[bom_billOfPurchase][populate]=*&populate[billOfSale][populate]=sales_order_entry&populate[billOfSale][populate]=internal_sales_order_entry&populate[processor][fields][0]=name`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params,
            });
            const data = Array.isArray(response.data.data) ? response.data.data : [];
            setTotalPages(response.data.meta.pagination.pageCount);
            console.log("data: ", response.data);

            const mappedData = data.map((bills) => {
                const salesOrder = bills.sales_order_entry || bills.internal_sales_order_entry || null;

                return {
                    so: bills?.so_id || "N/A",
                    bill_No: bills?.reference_bill || "N/A",
                    jobber: bills?.bom_billOfPurchase?.jobber?.jobber_name || "N/A",
                    design: bills?.design || "N/A",
                    colour: bills?.bom_billOfPurchase?.bom_detail[0]?.color?.color_name || "N/A",
                    item:  bills?.bom_billOfSale?.semi_finished_goods?.semi_finished_goods_name || "N/A",
                    note: bills?.jobNote || "N/A",
                    sale_date: formatDate(bills?.date) || "N/A",
                    clear_date: formatDate(bills?.clearDate) || "N/A",
                    ex_date: formatDate(bills?.ex_date) || "N/A",
                    pur_date: formatDate(bills?.sales_order_entry?.delivery_date) || "N/A",
                    sale_qty: bills?.sales_order_entry?.qty || "N/A",
                    pur_qty: "N/A",
                    balance_qty: "N/A",
                    processor: bills?.processor?.name || "N/A",
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

    useEffect(() => {
        if (!token) {
            navigate("/login");
            return;
        }
        fetchBillOfSales();
    }, [token, page, pageSize]);

    console.log("purchaseData: ", purchaseData)




    const enhancedData = purchaseData.map((item) => ({
        ...item,

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
                    <div className="my-8" >
                     

                        {paginationLoading ? (
                            <div className="flex p-5 justify-center items-center space-x-2 mt-4 border border-gray-400 rounded-lg">
                                <BounceLoader size={20} color="#1e3a8a" />
                            </div>
                        ) : (
                            <>
                                <ReportTable headers={headersForTable} data={enhancedData} fromDate={fromDate} setFromDate={setFromDate} toDate={toDate} setToDate={setToDate} api={fetchBillOfSales}/>

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



                </div>)}
        </div>
    )
}



export default PurchaseBillDetailsReport
