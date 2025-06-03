import { useEffect, useState } from "react";
import SmartTable from "../../smartTable/SmartTable";

const SalesOrderStatusReport = () => {
  const [salesDatas, setSalesData] = useState([
    {
      so_id: "1",
      order_no: "1",
      customer_name: "1",
      group_name: "1",
      design_name: "1",
      order_date: "1",
      delivery_date: "1",
      remarks: "1",
      qty: "1",
      status: "1",
      processor: "1",
    },
    {
      so_id: "2",
      order_no: "2",
      customer_name: "2",
      group_name: "2",
      design_name: "2",
      order_date: "2",
      delivery_date: "2",
      remarks: "2",
      qty: "2",
      status: "2",
      processor: "2",
    },
  ]);
  const [headers] = useState([
    "SO Id",
    "Order No",
    "Customer Name",
    "Group Name",
    "Design Name",
    "Order Date",
    "Delivery Date",
    "Remarks",
    "Qty",
    "Status",
    "Processor",
    "Details",
  ]);
  const [updateData, setUpdatedData] = useState([]);

  useEffect(() => {
    setUpdatedData(
      salesDatas.map((item, index) => ({
        ...item,
        Details: (
          <div className="flex justify-center item-center space-x-2">
            <button
              type="button"
              className="bg-blue-800 px-4 py-1 rounded-lg hover:bg-blue-900 transition ml-4 text-white"
            >
              Details
            </button>
          </div>
        ),
      }))
    );
  }, [salesDatas]);

  return (
    <div>
      {updateData && updateData.length > 0 && (
        <SmartTable headers={headers} data={updateData} />
      )}
    </div>
  );
};

export default SalesOrderStatusReport;
