import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import ReportTable from '../../smartTable/ReportTable';
import { BounceLoader } from 'react-spinners';
import Pagination from '../utility/Pagination';
import ExportToExcel from '../utility/ExportToExcel';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useSelector } from 'react-redux';

const headersForTable = [
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
  const [pageSize, setPageSize] = useState(10);
  const [paginationLoading, setPaginationLoading] = useState(false);

  // date filter states
  const [fromDate, setFromDate] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    return d.toISOString().split('T')[0];
  });
  const [toDate, setToDate] = useState(() => new Date().toISOString().split('T')[0]);

  const [stitchClearData, setStitchClearData] = useState([]);

  const [searchTerm, setSearchTerm] = useState('')


  const fetchStitchData = async () => {

    setPaginationLoading(true);
    try {

      const params = {
        fromDate,
        toDate
      }

      if (searchTerm !== '') {
        params['searchTerm'] = searchTerm.trim();
      }

      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/stitching-receive-entries/list-all-receive-order-items?page=${page}&pageSize=${pageSize}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params
        }
      );



      console.log("Res", res);

      if (res.data.data && res.data.meta) {
        const mappedData = res.data.data.map((item) => {
          return {
            so: item.stitchingEntry.so_id || "N/A",
            design: item.stitchingEntry.design_number || "N/A",
            category: item.group || "N/A",
            out_qty: item.qty_reveive_required || "N/A",
            out_remarks: item.stitchingEntry.remarks || "N/A",
            out_date: item.stitchingEntry.date || "N/A",
            in_qty: item.receive_qty || "0",
            in_date: item.entryProcessDate || "",
            in_remarks: item.receiveRemarks || "N/A",
            clear_out_date: item.receiveDate || "N/A",
            status: (item.stitching_receiving_status === "partially_completed" ? "Partially Completed" : item.stitching_receiving_status) || "N/A",
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
    const counter = setTimeout(() => {
      fetchStitchData();
    }, 1000);

    return () => clearTimeout(counter);
  }, [searchTerm]);

  useEffect(() => {
    setPage(1);
  }, [searchTerm])


  useEffect(() => {
    fetchStitchData();
  }, [page, pageSize]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <BounceLoader color="#1e3a8a" />
      </div>
    )
  }

  return (
    <div>
      <div className="p-6 bg-white rounded-lg relative">

        <div>
          <h1 className="text-2xl pb-2 border-b font-bold text-blue-900 mb-4">{title}</h1>
          <div className="">


            <ReportTable headers={headersForTable} data={stitchClearData} fromDate={fromDate} setFromDate={setFromDate} toDate={toDate} setToDate={setToDate} api={fetchStitchData} searchTerm={searchTerm} setSearchTerm={setSearchTerm} placeholder={"Search by SO or Design"} loading={paginationLoading} setLoading={setPaginationLoading}
            />

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

          </div>



        </div>
      </div>

    </div>
  )
}

export default StitchClearDateWiseReport
