
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import ReportTable from '../../smartTable/ReportTable';
import { BounceLoader } from 'react-spinners';
import Pagination from '../utility/Pagination';
import ExportToExcel from '../utility/ExportToExcel';

const headersForTable =[
        "SO Id",
    "Convert Id",
    "Order No",
    "Invoice No",
    "CN no",
    "Bill No",
    "Invoice Date",
    "Customer Name",
    "Design Number",
    "Colour",
    "Qty",
    "Remarks",
    "Transpoter",
    "Goods",
    "Bill Status",
    "Processor",
    "Detr",
    "Account Entry"
]


const SoReturnReports = () => {
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const title = location.state?.title || 'Stitch Clear Date Wise Report';


      //  adding pagination logic
        const [page, setPage] = useState(1);
        const [totalPages, setTotalPages] = useState(1);
        const [pageSize, setPageSize] = useState(5);
        const [paginationLoading, setPaginationLoading] = useState(false);
    
        // date filter states
        const [fromDate, setFromDate] = useState(null);
        const [toDate, setToDate] = useState(null);
    
        const [soReturnData, setSoReturnData] = useState([]);

        const fetchSoReturnData = () =>{

        }

        useEffect(() => {
            fetchSoReturnData();
        }, [page, pageSize, fromDate, toDate]);
    
  return (
    <div>
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
                                <ReportTable headers={headersForTable} data={soReturnData} fromDate={fromDate} setFromDate={setFromDate} toDate={toDate} setToDate={setToDate} api={fetchSoReturnData}/>

                                <div className='px-5 flex justify-between items-center'>
                                <ExportToExcel data={soReturnData} reportName={"Sale Bill Report"} />

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
    
    </div>
  )
}


export default SoReturnReports
