
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import ReportTable from '../../smartTable/ReportTable';
import SmartTable1 from '../../smartTable/SmartTable1';
import { BounceLoader } from 'react-spinners';
import Pagination from '../utility/Pagination';
import ExportToExcel from '../utility/ExportToExcel';
import axios from 'axios';
import { useSelector } from 'react-redux';
import SmartTable2 from '../../smartTable/SmartTable2';
import { toast } from 'react-toastify';
import Select from 'react-select';
import { Download, ListRestart } from 'lucide-react';
import TableWithoutSearch from '../../smartTable/TableWithoutSearch';
import Pagination10 from '../utility/Pagination10';

const headersForTable = [
    "SO Id",
    "Bill No",
    "Jobber",
    "Processor",
    "Design",
    "Colour",
    "Item",
    "Work Type",
    "Sale Date",
    // "Clear Date",
    "Ex Date",
    // "Pur Date",
    "Sale Qty",
    "Pur Qty",
    "Balance Qty",
    "Status",
]


const DyerWiseSalePurchaseReport = () => {


    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const title = location.state?.title || 'Dyer Wise Sale Purchase Report';
    const { token, designation, id } = useSelector((state) => state.auth);
    //console.log("Designation", designation, "id", id)
    //  adding pagination logic
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [paginationLoading, setPaginationLoading] = useState(false);

    // date filter states
    //  i want to set from date to previous one month date and to date to current date
    const [fromDate, setFromDate] = useState(null)
    const [toDate, setToDate] = useState(null);

    // jobber filter states
    const [fetchJobberLoader, setFetchJobberLoader] = useState(true);
    const [jobber, setJobber] = useState([]);
    const [workType, setWorkType] = useState([]);

    const [reportData, setReportData] = useState([]);

    //  selected items 
    const [selectedJobber, setSelectedJobber] = useState({ label: "", value: "" });
    const [selectedWorkType, setSelectedWorkType] = useState({ label: "", value: "" });

    // triggers
    const [clearTrigger, setClearTrigger] = useState(false);
    const [fetchTrigger, setFetchTrigger] = useState(false);

    useEffect(() => {
        // Get today's date
        setTimings();
    }, []);

    const setTimings = () => {
        const today = new Date();

        // Create a date one month ago
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(today.getMonth() - 1);

        // Format to YYYY-MM-DD (suitable for input[type="date"])
        const formatDate = (date) => date.toISOString().split('T')[0];

        setFromDate(formatDate(oneMonthAgo));
        setToDate(formatDate(today));
    }

    const formateDate = (date) => {

        const day = new Date(date).getDay();
        const month = new Date(date).getMonth();
        const year = new Date(date).getFullYear();
        return `${day}/${month + 1}/${year}`
    }


    const fetchReportData = async () => {
        try {
            setPaginationLoading(true);
            let url = `${process.env.REACT_APP_BACKEND_URL}/api/jobber-wise-report?designation=${designation}&userId=${id}`

            //console.log("Selected Items", selectedJobber, selectedWorkType, fromDate, toDate)
            if (selectedJobber.value !== "") {
                url += `&jobberId=${selectedJobber?.value}`
            }
            if (selectedWorkType.value !== "") {
                url += `&jobberWorkType=${selectedWorkType?.value}`
            }
            if (fromDate) {
                url += `&fromDate=${fromDate}`
            }
            if (toDate) {
                url += `&toDate=${toDate}`
            }

            //console.log("url: ", url)
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = Array.isArray(response.data.data) ? response.data.data : [];
            console.log("response: ", response)
            setTotalPages(response.data.meta.pageCount);
            //  there have to be three status (completed, partially completed, sended)
            const mappedData = data?.map((item) => {
                return {
                    so_id: item?.so_id,
                    bill_no: item?.billOfSaleId || "-",
                    jobber: item?.jobber?.jobber_name,
                    processor: item?.processor,
                    design: item?.design,
                    colour: item?.color?.color_name,
                    item: item?.item?.semi_finished_goods_name,
                    work_type: item?.jobber?.work_type,
                    sale_date: formateDate(item?.sale_date) || "-",
                    // clear: item?.clear || "-",   
                    // clear_date: item?.clear_date|| "-",
                    ex_date: formateDate(item?.ex_date),
                    // pur_date: item?.pur_date,
                    sale_qty: item?.qty,
                    pur_qty: item?.receive_qty,
                    balance_qty: Math.abs(item?.qty - item?.receive_qty),
                    status: (item?.qty - item?.receive_qty) === 0 ? "Completed" : "Partially Received",
                };
            })

            setReportData(mappedData);

        } catch (error) {
            toast.error(error?.response?.data?.error?.message || "Failed to fetch data");
        } finally {
            setPaginationLoading(false);
            setLoading(false);
        }

    }

    const fetchJobber = async () => {
        try {
            setFetchJobberLoader(true);
            const jobberRes = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/jobber-masters`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            //console.log("Jobber Res", jobberRes)
            setJobber(jobberRes.data.data.map((jobber) =>

            ({
                value: jobber.id,
                label: jobber.jobber_name
            })
            ))

            setWorkType(jobberRes.data.data.map((jobber) => jobber.work_type).filter((value, index, self) => self.indexOf(value) === index).map((workType) => ({
                value: workType,
                label: workType
            }))
            )
        } catch (error) {
            toast.error(error?.response?.data?.error?.message || "Failed to fetch jobber");
        }
        finally {
            setFetchJobberLoader(false);
        }
    }

    useEffect(() => {
        fetchReportData();
        fetchJobber();
    }, [page, pageSize, clearTrigger, fetchTrigger]);

    useEffect(() => {
        // Reset page to 1 whenever any filter changes
        setPage(1);
    }, [clearTrigger, fetchTrigger]);



    const clearFilter = () => {
        setSelectedJobber({ label: "", value: "" });
        setSelectedWorkType({ label: "", value: "" });
        setTimings();
        setClearTrigger(!clearTrigger);
        setPage(1);

    }


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
                    <h1 className="text-2xl font-bold text-blue-900 mb-4 pb-2 border-b">{title}</h1>
                    <div className="my-8" >
                        <div className='border border-gray-300 rounded-xl shadow-sm shadow-gray-400 p-5'>

                            <div className='text-red-500 text-sm text-center mb-5'>(Please select any one from Jobber and Work Type)</div>

                            <div className='grid grid-cols-2 gap-4 '>
                                <div>
                                    <label id=''>Fetch Jobber Wise Report</label>
                                    <Select
                                        placeholder={fetchJobberLoader ? "Loading..." : "Select Jobber"}
                                        options={jobber}
                                        onChange={(selectedOption) => {
                                            setSelectedJobber(selectedOption);
                                        }}
                                        isDisabled={selectedWorkType.value !== ""}
                                        value={selectedJobber}
                                    />
                                </div>
                                <div>
                                    <label id=''>Fetch Work Type Wise Report</label>
                                    <Select
                                        placeholder={fetchJobberLoader ? "Loading..." : "Select Work Type"}
                                        options={workType}
                                        isDisabled={selectedJobber.value !== ""}
                                        onChange={(e) => {
                                            setSelectedWorkType(e);
                                        }}
                                        value={selectedWorkType}
                                    />
                                </div>

                                <div className='flex  flex-col'>
                                    <label id='fromDate'>From Date</label>
                                    <input
                                        type="date"
                                        className='px-3 py-2 border border-gray-300 rounded-md'
                                        name='fromDate'
                                        value={fromDate}
                                        onChange={(e) => setFromDate(e.target.value)}
                                    />
                                </div>
                                <div className='flex  flex-col'>
                                    <label id='toDate'>From Date</label>
                                    <input
                                        type="date"
                                        className='px-3 py-2 border border-gray-300 rounded-md'
                                        name='toDate'
                                        value={toDate}
                                        onChange={(e) => setToDate(e.target.value)}
                                    />
                                </div>

                            </div>
                            <div className='flex justify-center mt-8 gap-5'>
                                <button
                                    type='button'
                                    onClick={() => setFetchTrigger(!fetchTrigger)}
                                    className='bg-blue-900 text-white px-5 py-2 rounded hover:bg-blue-700 transition-all ease-in-out duration-200 flex items-center gap-2'>Fetch Report <Download /></button>

                                <button
                                    type='button'
                                    onClick={clearFilter}
                                    className='bg-red-700 text-white flex items-center gap-2 px-5 py-2 rounded hover:bg-red-500 transition-all ease-in-out duration-200'>Clear Filter <ListRestart /> </button>
                            </div>

                        </div>

                        <div className='mt-8'>
                            <h3 className='font-bold  text-2xl pb-2 border-b mb-4 text-blue-900'>Dyer/Jobber Wise Report</h3>

                            <TableWithoutSearch
                                headers={headersForTable}
                                data={reportData}
                                loading={paginationLoading}
                                setLoading={setPaginationLoading}
                            />
                            <div className='px-5 flex justify-between items-center'>
                                <ExportToExcel data={reportData} reportName={"Sale Bill Report"} />


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
            </div>

        </div>
    )
}




export default DyerWiseSalePurchaseReport
