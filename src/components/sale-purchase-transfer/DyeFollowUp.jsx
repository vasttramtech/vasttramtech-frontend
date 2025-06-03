import { useState } from "react";
import SmartTable from "../../smartTable/SmartTable";
import FormInput from "../utility/FormInput";
import SmartTable1 from "../../smartTable/SmartTable1";

const DyeFollowUp = () => {
  const headers = [
    "So Id",
    "Convert Id",
    "Order No",
    "Date",
    "Customer Name",
    "Design Number",
    "Colour",
    "Delivery Date",
    "Remarks",
    "Qty",
    "Processor",
    "Day Out Status",
    "DYE Out",
    "Day In Status",
    "DYE IN",
    "Dye Due",
    "Additional Remarks",
    "Dye Out Remarks",
    "Dye In Remarks",
  ];

  const [dyeData, setDyeData] = useState([
    {
      so_id: "SO-24105",
      convert_id: "ID1234",
      order_No: 78283,
      date: "15-02-2025",
      customer_name: "ABC",
      design_number: "123",
      colour: "red",
      delivery_date: "15-02-2025",
      remarks: "abc",
      qty: 12,
      processor: "shaheen",
    },
    {
      so_id: "SO-24105",
      convert_id: "ID1234",
      order_No: 78283,
      date: "15-02-2025",
      customer_name: "ABC",
      design_number: "123",
      colour: "red",
      delivery_date: "15-02-2025",
      remarks: "abc",
      qty: 12,
      processor: "shaheen",
    },
  ]);

  return (
    <div>
      <h1 className="text-3xl font-bold text-blue-900 mb-4">Dye Follow Up</h1>
      <SmartTable1
        headers={headers}
        data={dyeData.map((item) => ({
          ...item,
          day_out_status: <FormInput type="number" />,
          dye_out: <FormInput type="date" />,
          day_in_status: <FormInput type="number" />,
          dye_in: <FormInput type="date" />,
          dye_due: <FormInput type="number" />,
          additional_remarks: <FormInput type="text" />,
          dye_out_remarks: <FormInput type="text" />,
          dye_in_remarks: <FormInput type="text" />,
        }))}
      />
    </div>
  );
};

export default DyeFollowUp;
