import { useEffect, useState } from "react";
import SmartTable2 from "./SmartTable2";

const SelectionTable = ({
  NoOfColumns,
  data,
  headers,
  setSelectedRow,
  setOfSelectedIndex,
  setSetOfSelectedIndex,
}) => {
  // console.log(setOfSelectedIndex);
  const [updatedData, setupdatedData] = useState([]);
  const [updatedHeader] = useState(["select", ...headers]);
  const updateTableData = (selectedSet) => {
    const updatedValues = data.map((item, index) => ({
      select: (
        <input
          type="checkbox"
          checked={selectedSet.has(index)}
          onChange={() => handleClick(index)}
          key={index}
        />
      ),
      ...item,
    }));
    const selectedRows = data.filter((_, index) => selectedSet.has(index));
    setSelectedRow(selectedRows);
    setupdatedData(
      updatedValues.map((item) =>
        Object.fromEntries(Object.entries(item).slice(0, NoOfColumns + 1))
      )
    );
  };
 
  const handleClick = (index) => {
    setSetOfSelectedIndex((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  useEffect(() => {
    updateTableData(setOfSelectedIndex);
  }, [data, setOfSelectedIndex]);
  return <SmartTable2 data={updatedData} headers={updatedHeader} />;
};

export default SelectionTable;
