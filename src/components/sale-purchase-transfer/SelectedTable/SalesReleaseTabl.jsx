import { FormInput } from "lucide-react";

const SalesReleaseTable = ({ selectedData }) => {
  return (
    <div className="overflow-x-auto mt-8 mb-8 border rounded-lg">
      <table className="w-full table-auto border-collapse border border-blue-500">
        <thead className="bg-blue-500 text-white">
          <tr>
            <th className="border border-white px-4 py-2">SaleBillId</th>
            <th className="border border-white px-4 py-2">SO ID</th>
            <th className="border border-white px-4 py-2">Date</th>
            <th className="border border-white px-4 py-2">Design Name</th>
            <th className="border border-white px-4 py-2">Bill To</th>
            <th className="border border-white px-4 py-2">Bill To Details</th>
            <th className="border border-white px-4 py-2">Other Charges</th>
            <th className="border border-white px-4 py-2">Total Bill Amount</th>
            <th className="border border-white px-4 py-2">Processor</th>
            <th className="border border-white px-4 py-2">Date</th>
            <th className="border border-white px-4 py-2">Jobber</th>
          </tr>
        </thead>
        <tbody>
          {selectedData && selectedData.length > 0 ? (
            selectedData.map((item, index) => (
              <tr key={index} className="text-center bg-white border border-blue-500">
                <td className="border px-4 py-2">{item.SalebillId}</td>
                <td className="border px-4 py-2">{item.So_id}</td>
                <td className="border px-4 py-2">{item.RleaseDate}</td>
                <td className="border px-4 py-2">{item.DesignName}</td>
                <td className="border px-4 py-2">{item.BillTo}</td>
                <td className="border px-4 py-2">{item.BillToDetails}</td>
                <td className="border px-4 py-2">{item.OtherChanges}</td>
                <td className="border px-4 py-2">{item.TotalCharges}</td>
                <td className="border px-4 py-2">{item.Processor}</td>
                <td className="border px-4 py-2">
                  {/* <FormInput type="date" className="w-32 px-2 py-1 border border-blue-500 rounded" /> */}
                  <input type="date" className="w-32 px-1 py-1 border border-blue-500 rounded"/>
                </td>
                <td className="border px-4 py-2">
                  <select className="w-40 px-2 py-1 border border-blue-500 rounded bg-white">
                    <option value="" disabled selected>
                      Select Jobber
                    </option>
                  </select>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="11" className="text-center py-4 text-black">
                No data Selected
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SalesReleaseTable;
