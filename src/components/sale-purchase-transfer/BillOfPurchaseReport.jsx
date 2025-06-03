import { FormInput } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import SmartTable1 from "../../smartTable/SmartTable1";
import SmartTable from "../../smartTable/SmartTable";
import SelectionTable from "../../smartTable/SelectionTable";
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

const BillOfPurchaseReport = () => {
  const [data, setData] = useState(["AB1", "AB2", "AB3"]);
  const [headers] = useState([
    "Purchase Id",
    "SO ID",
    "Bill Id",
    "Bill To",
    "Processor",
    "Bill Date",
    "Release Date",
    "Ex Date",
    "Design Name",
    "Job Note",
    "Remarks",
    "Other Charges",
    "Total Bill Amount",
    "View"
  ]);
  const title = 'Bill of Purchase Report';
  const [tableData, setTableData] = useState([]);
  const { token, designation, id } = useSelector(state => state.auth);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [BillOfPurchase, setBillOfPurchase] = useState([])

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
      let url = `${process.env.REACT_APP_BACKEND_URL}/api/bill-of-purchase/get-all-billOfPurchase?page=${page}&pageSize=${pageSize}`;

      // Add filters based on designation and id
      if (designation && id) {
        if (designation !== "Merchandiser" && designation !== "Admin") {
          url += `&filters[processor][id][$eq]=${encodeURIComponent(id)}`;
        } else if (designation === "Merchandiser") {
          url += `&filters[merchandiser][id][$eq]=${encodeURIComponent(id)}`;
        }
      }

      // Optional: add sorting if needed (example)
      url += `&sort=id:desc`;

      // const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/bill-of-purchase/get-all-billOfPurchase?page=${page}&pageSize=${pageSize}`, {
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //   },
      // });
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          designation, userId:id
        }
      });
      const data = Array.isArray(response.data.data) ? response.data.data : [];
      console.log("Data: ", response)
      setTotalPages(response.data.totalPages);
      // setTotalPages(response.data.meta.pagination.pageCount);
      const mappedData = data.map((bills) => {
        const isInternal = bills.billOfSale?.internal_sales_order_entry;
        const isSales = bills.billOfSale?.sales_order_entry;

        return {
          purchaseId: bills?.id,
          so_id: bills?.so_id,
          BillId: bills?.billOfSale?.id,
          // type: bills?.billOfSale?.type === "internal-sales-order-entries" ? "Vasttram Sales Order" : "Customer Sales Order", 
          BillTo: bills?.bom_billOfPurchase?.jobber?.jobber_name,
          processor: bills.processor?.name + "-" + bills.processor?.designation,
          billDate: bills?.date,
          releaseDate: bills.clearDate,
          exDate: bills.ex_date,
          designName: bills.design,
          jobNote: bills.jobNote,
          remarks: bills?.remarks,
          otherCharges: bills?.other_charges,
          totalBillAmount: bills?.Total_Bill_Amount_Bop
        };
      });

      setBillOfPurchase(mappedData);

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

  const enhancedData = BillOfPurchase.map((item) => ({
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
    navigate(`/bill-of-purchase/${rowData.purchaseId}`);
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
          <h1 className="text-3xl font-bold text-blue-900 mb-4">Bill Of Purchase Reports</h1>
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

export default BillOfPurchaseReport;
