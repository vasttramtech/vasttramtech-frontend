import React, { useState } from "react";

const SalesReturnForm = () => {
    const [formData, setFormData] = useState({
        soId: "",
        billNotReceived: false,
        customer: "",
        state: "",
        transporter: "",
        goods: "",
        billNo: "",
        cnNo: "",
        returnDate: "",
        remarks: "",
    });
    const statesOfIndia = [
        "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
        "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
        "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
        "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
        "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
        "Uttar Pradesh", "Uttarakhand", "West Bengal"
    ];

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Sales Return Data:", formData);
        // API call here
    };

    const handleClear = () => {
        setFormData({
            soId: "",
            billNotReceived: false,
            customer: "",
            state: "",
            transporter: "",
            goods: "",
            billNo: "",
            cnNo: "",
            returnDate: "",
            remarks: "",
        });
    };
    console.log(formData)

    return (
        <div className="max-w-6xl mx-auto my-8 p-6 bg-white shadow-md rounded">

            <h1 className="text-center text-2xl font-bold text-red-700 mb-6 border-b pb-2">Please don't use it We are working on it.</h1>
            <h1 className="text-center text-2xl font-bold text-blue-700 mb-6 border-b pb-2">Sales Return</h1>

            <div className="text-center mb-6">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow">
                    Choose Sales Order
                </button>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* SO ID and Checkbox */}
                <div className="flex items-center gap-2">
                    <label className="w-28 font-medium">SO Id:</label>
                    <input
                        type="text"
                        name="soId"
                        value={formData.soId}
                        onChange={handleChange}
                        className="flex-1 border p-2 rounded"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <label className="font-medium">Bill Not Received:</label>
                    <input
                        type="checkbox"
                        name="billNotReceived"
                        checked={formData.billNotReceived}
                        onChange={handleChange}
                        className="w-5 h-5"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <label className="w-28 font-medium">Customer:</label>
                    <input
                        type="text"
                        name="customer"
                        value={formData.customer}
                        onChange={handleChange}
                        className="flex-1 border p-2 rounded"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <label className="w-20 font-medium">State:</label>
                    <select
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        className="flex-1 border p-2 rounded"
                    >
                        <option value="" className="text-gray-400">State</option>
                        {statesOfIndia.map((state, index) => (
                            <option key={index} value={state}>{state}</option>
                        ))}
                    </select>
                </div>

                <div className="flex items-center gap-2">
                    <label className="w-28 font-medium">Transporter:</label>
                    <input
                        type="text"
                        name="transporter"
                        value={formData.transporter}
                        onChange={handleChange}
                        className="flex-1 border p-2 rounded"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <label className="w-20 font-medium">Goods:</label>
                    <input
                        type="text"
                        name="goods"
                        value={formData.goods}
                        onChange={handleChange}
                        className="flex-1 border p-2 rounded"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <label className="w-28 font-medium">Bill No:</label>
                    <input
                        type="text"
                        name="billNo"
                        value={formData.billNo}
                        onChange={handleChange}
                        className="flex-1 border p-2 rounded"
                        required
                    />
                </div>
                <div className="flex items-center gap-2">
                    <label className="w-20 font-medium">CN No:</label>
                    <input
                        type="text"
                        name="cnNo"
                        value={formData.cnNo}
                        onChange={handleChange}
                        className="flex-1 border p-2 rounded"
                        required
                    />
                </div>

                <div className="flex items-center gap-2">
                    <label className="w-28 font-medium">Return Date:</label>
                    <input
                        type="date"
                        name="returnDate"
                        value={formData.returnDate}
                        onChange={handleChange}
                        className="flex-1 border p-2 rounded"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <label className="w-20 font-medium">Remarks:</label>
                    <input
                        type="text"
                        name="remarks"
                        value={formData.remarks}
                        onChange={handleChange}
                        className="flex-1 border p-2 rounded"
                    />
                </div>

                {/* Buttons */}
                <div className="col-span-2 flex justify-center gap-4 mt-6">
                    <button
                        type="submit"
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded shadow"
                    >
                        Save
                    </button>
                    <button
                        type="button"
                        onClick={handleClear}
                        className="bg-yellow-400 hover:bg-yellow-500 text-white px-6 py-2 rounded shadow"
                    >
                        Clear
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SalesReturnForm;
