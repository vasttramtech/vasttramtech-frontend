import { useState } from "react";
import FormLabel from "../purchase/FormLabel";
import FormInput from "../utility/FormInput";
import SelectionTable from "../../smartTable/SelectionTable";

const statesOfIndia = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

const SalesReturn = () => {
  const [selctionHeader, setSelectionHeader] = useState([
    "SO ID",
    "Bill Id",
    "Bill To",
    "Release Date",
    "Exp Date",
    "Design Name",
    "Remarks",
    "Job Note",
    "Qty",
    "total Qty",
    "colour",
    "Other Changes",
    "Total Charges",
  ]);
  const [selectionData, setSelectionData] = useState([
    {
      So_id: "SO-24105",
      SalebillId: "ID1234",
      BillTo: "ABC",
      RleaseDate: "15-02-2025",
      ExpDate: "15-02-2025",
      DesignName: "ABC",
      Remarks: "",
      JobNote: "",
      Qty: 1,
      totalQty: 1,
      Colour: "ABC",
      OtherChanges: 1,
      TotalCharges: 1,
    },
  ]);
  const [displayModal, setDisplayModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState([]);
  const [setOfSelectedIndex, setSetOfSelectedIndex] = useState(new Set());

  return (
    <div>
      <h1 className="text-3xl font-bold text-blue-900 mb-4">Sales Return</h1>

      {/* Selection Modal */}
      {displayModal && (
        <div className="fixed w-[90vw] bg-gray-200 border shadow-2xl p-2">
          <div className="flex justify-between">
            <h3 className="text-center text-xl">Bill of Purchase</h3>
          </div>
          <SelectionTable
            NoOfColumns={selctionHeader.length}
            data={selectionData}
            headers={selctionHeader}
            setSelectedRow={setSelectedRow}
            setOfSelectedIndex={setOfSelectedIndex}
            setSetOfSelectedIndex={setSetOfSelectedIndex}
          />
          <div
            onClick={() => setDisplayModal(!displayModal)}
            className="flex justify-center items-center"
          >
            <button
              type="button"
              className="bg-gray-400 px-2 hover:bg-gray-300"
            >
              Save
            </button>
          </div>
        </div>
      )}

      <form className="grid grid-cols-2 gap-6 p-2 mb-16">
        <div className="col-span-2 flex border border-blue-500 justify-center mt-4 rounded p-2">
          <div className="  ">
            <button
              type="button"
              className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-700 transition"
              onClick={() => setDisplayModal(!displayModal)}
            >
              Choose Sales Order
            </button>
          </div>
        </div>
        
        {/* So Id */}
        <FormInput
          label={"SO ID"}
          type={"text"}
          name={"so_id"}
          placeholder={"SO ID"}
        />

        {/* Bill Not Received */}
        <div className="flex items-center">
          <div>
            <label className="text-gray-700 font-semibold mr-4">
              Bill Not Received:
            </label>
            <input type="checkbox" />
          </div>
        </div>

        {/* Customer */}
        <FormInput
          label={"Customer"}
          type={"text"}
          name={"customer"}
          placeholder={"Customer"}
        />

        {/* State */}
        <div className="flex flex-col">
          <label className="text-gray-700 font-semibold">Jobber State</label>
          <select
            className="border border-gray-300 bg-gray-100 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            name="state"
          >
            <option value="" className="text-gray-400">
              State
            </option>
            {statesOfIndia.map((state, index) => (
              <option key={index} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>

        {/* Transporter */}
        <FormInput
          label={"Transporter"}
          type={"text"}
          name={"transporter"}
          placeholder={"Transporter"}
        />

        {/* Goods */}
        <FormInput
          label={"Goods"}
          type={"text"}
          name={"goods"}
          placeholder={"Goods"}
        />

        {/* Bill Number */}
        <FormInput
          label={"Bill Number"}
          type={"text"}
          name={"bill_no"}
          placeholder={"Bill Number"}
        />

        {/* CN Number */}
        <FormInput
          label={"CN Number"}
          type={"text"}
          name={"cn_no"}
          placeholder={"CN Number"}
        />

        {/* Return Date */}
        <FormInput
          label={"Return Date"}
          type={"text"}
          name={"return_date"}
          placeholder={"Return Date"}
        />

        {/* Remarks */}
        <div className="flex flex-col">
          <label className="text-gray-700 font-semibold">Remarks:</label>
          <textarea
            className="border border-gray-300 bg-gray-100 rounded-md p-2 h-40 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            placeholder="Remarks"
            name="remarks"
          ></textarea>
        </div>

        {/* Button */}
        <div className="col-span-2 flex justify-end mt-4 gap-4">
          <button
            type="button"
            className="bg-gray-200 px-4 py-1 rounded hover:bg-gray-600 hover:text-white transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-gray-200 px-4 py-1 rounded hover:bg-gray-600 hover:text-white transition"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default SalesReturn;
