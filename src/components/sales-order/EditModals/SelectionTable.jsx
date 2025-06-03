
import { useEffect, useState } from "react";
import SmartTable2 from "../../../smartTable/SmartTable2";
import { toast } from "react-toastify";

const SelectionTable = ({
  NoOfColumns,
  data,
  headers,
  setSelectedRow,
  setOfSelectedIndex,
  setSetOfSelectedIndex,
  NonUpdatableId,
}) => {
  const [updatedData, setupdatedData] = useState([]);
  const [updatedHeader] = useState(["select", ...headers]);
  const [NonUpdatableIndex, setNonUpdatableIndex] = useState(new Set());

  // ✅ Update NonUpdatableIndex on change of data or NonUpdatableId
  useEffect(() => {
    if (!Array.isArray(NonUpdatableId)) return;

    const newSet = new Set();
    NonUpdatableId.forEach((id) => {
      const idx = data.findIndex((item) => item.id == id);
      if (idx !== -1) newSet.add(idx);
    });
    setNonUpdatableIndex(newSet);
  }, [NonUpdatableId, data]);

  // ✅ When NonUpdatableIndex OR selectedSet OR data changes, update table
  useEffect(() => {
    const updatedValues = data.map((item, index) => ({
      select: (
        <input
          type="checkbox"
          checked={setOfSelectedIndex.has(index)}
          disabled={NonUpdatableIndex.has(index)}
          onChange={() => handleClick(index)}
          key={index}
        />
      ),
      ...item,
    }));

    const selectedRows = data.filter((_, index) => setOfSelectedIndex.has(index));
    setSelectedRow(selectedRows);

    setupdatedData(
      updatedValues.map((item) =>
        Object.fromEntries(Object.entries(item).slice(0, NoOfColumns + 1))
      )
    );
  }, [data, setOfSelectedIndex, NonUpdatableIndex]);

  const handleClick = (index) => {
    if (NonUpdatableIndex.has(index)) {
      toast.error("Already started processing");
      return;
    }
    setSetOfSelectedIndex((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) newSet.delete(index);
      else newSet.add(index);
      return newSet;
    });
  };

  return <SmartTable2 data={updatedData} headers={updatedHeader} />;
};

export default SelectionTable;
