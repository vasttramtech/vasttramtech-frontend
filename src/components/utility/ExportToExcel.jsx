import React from 'react';
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const ExportToExcel = ({ data, reportName }) => {

    const handleExportExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, reportName);

        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        
        const blob = new Blob([excelBuffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8"
        });
        
        saveAs(blob, `${reportName}.xlsx`);
    };

    return (
        <div>
            <button
                className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded'
                onClick={handleExportExcel}
            >
                Export to Excel
            </button>
        </div>
    );
};

export default ExportToExcel;
