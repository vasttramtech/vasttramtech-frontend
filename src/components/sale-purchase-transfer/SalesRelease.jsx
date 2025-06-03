import { useState } from "react";
import SmartTable1 from "../../smartTable/SmartTable1";
import SelectionTable from "../../smartTable/SelectionTable";
import SalesReleaseTable from "./SelectedTable/SalesReleaseTabl";

const SalesRelease = () => {
  const [header] = useState([
    "SaleBillId",
    "SO Id",
    "Date",
    "Design Name",
    "Bill To",
    "Bill To Details",
    "OtherCharges",
    "TotalAmount",
    "Processor",
    "Date",
    "Jobber",
  ]);
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
      <h1 className="text-3xl font-bold text-blue-900 mb-4">Sales Release</h1>
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

      {/* button */}
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

      <div>
        <SalesReleaseTable selectedData={selectedRow} />
        <button
          type="submit"
          className="bg-gray-200 px-4 py-1 rounded hover:bg-gray-600 hover:text-white transition ml-2"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default SalesRelease;
