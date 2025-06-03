import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import ReportTable from '../../smartTable/ReportTable';
import { BounceLoader } from 'react-spinners';
import Pagination from '../utility/Pagination';
import ExportToExcel from '../utility/ExportToExcel';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useSelector } from 'react-redux';

const headersForTable =[
        "SO",
    "Design",
    "Category",
    "Out Qty",
    "Out Remarks",
    "Out Date",
    "In Qty",
    "In Date",
    "In Remarks",
    "Clear Out Date",
    "Status",
    "Processor"
]


const StitchClearDateWiseReport = () => {
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const title = location.state?.title || 'Stitch Clear Date Wise Report';
    const token = useSelector((state) => state.auth.token);

      //  adding pagination logic
        const [page, setPage] = useState(1);
        const [totalPages, setTotalPages] = useState(1);
        const [pageSize, setPageSize] = useState(5);
        const [paginationLoading, setPaginationLoading] = useState(false);
    
        // date filter states
        const [fromDate, setFromDate] =  useState(() => {
            const d = new Date();
            d.setMonth(d.getMonth() - 1);
            return d.toISOString().split('T')[0];
        });
        const [toDate, setToDate] = useState(() => new Date().toISOString().split('T')[0]);
    
        const [stitchClearData, setStitchClearData] = useState([]);



        const fetchStitchData = async () => {

    setPaginationLoading(true);
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/stitching-receive-entries/list-all-receive-order-items?fromDate=${fromDate}&toDate=${toDate}&page=${page}&pageSize=${pageSize}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ); 



      console.log("Res",res);

      if (res.data.data && res.data.meta) {
        const mappedData = res.data.data.map((item)=>{
            return{
                so: item.stitchingEntry.so_id || "N/A",
                design: item.stitchingEntry.design_number || "N/A",
                category: item.group || "N/A",
                out_qty: item.qty_reveive_required || "N/A",
                out_remarks: item.stitchingEntry.remarks || "N/A",
                out_date: item.stitchingEntry.date || "N/A",
                in_qty: item.receive_qty || "N/A",
                in_date: item.entryProcessDate || "",
                in_remarks:item.receiveRemarks || "N/A",
                clear_out_date: item.receiveDate || "N/A",
                status: item.stitching_receiving_status || "N/A",
                processor: item.processor.name || "N/A",
            }
        })
        setStitchClearData(mappedData);
        setTotalPages(res.data.meta.pageCount);
      } else {
        setStitchClearData([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      // Optionally use a toast or alert here
    } finally {
      setLoading(false);
      setPaginationLoading(false);
    }
  };
        

        useEffect(() => {
            fetchStitchData();
        }, [page, pageSize]);
    
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
                                <BounceLoader size={20} color="#1e3a90" />
                            </div>
                        ) : (
                            <>
                                <ReportTable headers={headersForTable} data={stitchClearData} fromDate={fromDate} setFromDate={setFromDate} toDate={toDate} setToDate={setToDate} api={fetchStitchData}/>

                                <div className='px-5 flex justify-between items-center'>
                                <ExportToExcel data={stitchClearData} reportName={"Sale Bill Report"} />

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

export default StitchClearDateWiseReport
