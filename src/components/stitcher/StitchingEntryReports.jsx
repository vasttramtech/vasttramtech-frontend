import { FormInput } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import SmartTable1 from "../../smartTable/SmartTable1";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ViewIcon from "../../assets/Others/ViewIcon.png";
import { BounceLoader, PuffLoader } from "react-spinners";
import Pagination from '../utility/Pagination';


const handlePrint = () => {
  console.log("Here")
  const content = document.getElementById('printable-table');
  const printWindow = window.open('', '', 'height=800,width=800');
  printWindow.document.writeln('<html><head><title>Print</title></head><body>');
  printWindow.document.writeln(content.innerHTML);
  printWindow.document.writeln('</body></html>');
  printWindow.document.close();
  printWindow.print();
};

const StitchingEntryReports = () => {
  const [headers] = useState([
    "Stitching Entry Id",
    "SO ID",
    "Design Group",
    "Design Number",
    "Processor",
    "Stitcher Name",
    "Date",
    "Due Date",
    "Remarks",
    "View"
  ]);
  const title = 'Bill of Purchase Report';
  const { token, designation, id } = useSelector(state => state.auth);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stitchingEntry , setStitchingEntry] = useState([])

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [paginationLoading, setPaginationLoading] = useState(false);
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



  const fetchBillOfPurchase = async () => {
    try {
      setLoading(true);

     let params = {
  "filters[stitch_status][$eq]": "stitching_process",
  "pagination[page]": page,
  "pagination[pageSize]": pageSize,
  "sort[0]": "createdAt:desc",
  "populate": "*",
};

// Add conditional filters
if (designation === "Merchandiser" && id) {
  params["filters[$or][0][sales_order_entry][merchandiser][id][$eq]"] = id;
  params["filters[$or][1][internal_sales_order_entry][merchandiser][id][$eq]"] = id;
} else if (designation !== "Admin" && id) {
  params["filters[processor][id][$eq]"] = id;
}

const response = await axios.get(
  `${process.env.REACT_APP_BACKEND_URL}/api/stitching-entries`,
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: params,
  }
);

console.log("Fetched stitching entries:", response.data.data);

      const data = Array.isArray(response.data.data) ? response.data.data : [];
      console.log("Data: ", data)
      setTotalPages(response.data.meta.pagination.pageCount);
      const mappedData = data.map((entry) => {
        return {
         stitchingEntryId : entry?.id,
         so_id : entry?.so_id,
         designGroup : entry?.design_group,
         designNumber : entry?.design_number,
         processor : entry?.processor?.name,
         stitcher : entry?.stitcher?.stitcher_name,
         date : entry?.date,
         dueDate : entry?.due_date,
         remarks : entry?.remarks,
        };
      });

      setStitchingEntry(mappedData);

    } catch (error) {
      console.error("Error fetching jobber data:", error);
      if (error.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchBillOfPurchase();
  }, [token, page, pageSize]);

  const enhancedData = stitchingEntry.map((item) => ({
    ...item,
    Actions: (
      <div className="flex justify-center items-center space-x-2">
        <button onClick={() => handleView(item)}>
          <img src={ViewIcon} alt="View" className="mr-4 w-4" />
        </button>
      </div >
    )
  }));

  const handleView = (rowData) => {
    navigate(`/stitching-entry/${rowData.stitchingEntryId}`);
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
          <h1 className="text-3xl font-bold text-blue-900 mb-4">Stitcher Entry Reports</h1> 
          <div className="my-8" ref={printableTableRef}>

            {paginationLoading ? (
              <div className="flex p-5 justify-center items-center space-x-2 mt-4 border border-gray-400 rounded-lg">
                <BounceLoader size={20} color="#1e3a8a" />
              </div>
            ) : (
              <>
                {/* <SmartTable1 headers={headers} data={updateData} /> */}
                <SmartTable1 headers={headers} data={enhancedData} />

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
  );
};

export default StitchingEntryReports;
