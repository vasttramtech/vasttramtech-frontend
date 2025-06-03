import React, { useState } from 'react'
import SmartTable1 from '../../smartTable/SmartTable1';



// structure of component
//  All inputs are structured in a form and clear buttons clear all form
// all data is stored in the formdata 
//  smart table 1 is also added
//  choose sales order only open a modal does not have values its value has to be added in the form

const headers = [ "Category", "Out Quantity", "Out Remarks", "Out Date", "Clear Stitch Date", "Receive", "In Quantity", "In Remarks", "In Date"]
const StitchStatusPage = () => {
    
    const title = "Stitch Status";
    const [chooseDataModal, setChooseDataModal] = useState(false);

    const chooseSalesOrderHandler = (e) => {
        e.preventDefault();
        setChooseDataModal(true);
    }


    // form data
    const [formData, setFormData] = useState({
        so_id:"",
        customer:"",
        group:"",
        design_number:"",
        design_name:"",
        so_qty:"",
        remarks:"",
        stitch_remarks:"",
        stitch_date:"",
        qty:""
    });

    const [tableData, setTableData] = useState([]);

    // form data handler
    const formDataHandler = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({...prevData, [name]: value }));
    }

    // clear form handler
    const clearButtonHandler = (e) => {
        e.preventDefault();
        setFormData({
            so_id:"",
            customer:"",
            group:"",
            design_number:"",
            design_name:"",
            so_qty:"",
            remarks:"",
            stitch_remarks:"",
            stitch_date:"",
            qty:""
        })
    }

    //  save handler for form submission
    const saveHandler = (e) => {
        e.preventDefault();
        // add your save logic here
        console.log(formData);
    }

  return (
    <div>
      {   
        chooseDataModal && <div className='absolute m-auto flex flex-col justify-center items-center bg-gray-500 w-full h-96 '>
            <h3 className=" text-xl font-bold text-blue-900">Choose Sales Order</h3>
            <button
                onClick={() => setChooseDataModal(false)}
                className="p-2 bg-blue-500 rounded-md text-white hover:bg-blue-600 hover:scale-105"
            >
                Close
            </button>

            <h4>It have to be changed with choose saled order</h4>
            {/* Add your choose sales order component here */}
            {/* <ChooseSalesOrder /> */}
        </div>
    }
    <div>
    <h1 className="text-3xl font-bold text-blue-900 mb-4">{title}</h1>
        <div className=' border-gray-200 border p-5 rounded-xl shadow-xl'>
        <form action="">
    
        
            <div className='flex items-center justify-center gap-4'>
                <label htmlFor="chooseSalesOrder">From SO Id:</label>
                <button 
                id='chooseSalesOrder'
                onClick={chooseSalesOrderHandler}
                className='p-2 bg-blue-500 rounded-md text-white hover:bg-blue-600 hover:scale-105'>
                    Choose Sales Order
                </button>
            </div>

            <div className=' grid grid-cols-2 gap-6 mt-5'>
            <div>
                <label htmlFor="so_id">So Id:</label>
                <input
                    type="text"
                    id="so_id"
                    placeholder="Enter So Id"
                    value={formData.so_id}
                    name='so_id'
                    className='p-2 border border-gray-400 rounded-md w-full'
                    onChange={formDataHandler}
                    required
                />
            </div>
            {/* Customer */}
            <div>
                <label htmlFor="customer">Customer:</label>
                <input
                    type="text"
                    id="customer"
                    placeholder="Enter Customer Name"
                    value={formData.customer}
                    className='p-2 border border-gray-400 rounded-md w-full'
                    name='customer'
                    onChange={formDataHandler}
                    required
                />
            </div>

            {/* Group */}
            <div>
                <label htmlFor="group">Group:</label>
                <input
                    type="text"
                    id="group"
                    placeholder="Group Name"
                    className='p-2 border border-gray-400 rounded-md w-full'
                    value={formData.group}
                    name='group'
                    onChange={formDataHandler}
                    required
                />
            </div>
            {/* Design Number */}
            <div>
                <label htmlFor="design_number">Design Number:</label>
                <input
                    type="text"
                    id="design_number"
                    placeholder="Enter Design Number"
                    className='p-2 border border-gray-400 rounded-md w-full'
                    value={formData.design_number}
                    name='design_number'
                    onChange={formDataHandler}
                    required
                />
            </div>
            {/* Design Name */}
            <div>
                <label htmlFor="design_name">Design Name:</label>
                <input
                    type="text"
                    id="design_name"
                    placeholder="Enter Design Name"
                    className='p-2 border border-gray-400 rounded-md w-full'
                    value={formData.design_name}
                    name='design_name'
                    onChange={formDataHandler}
                    required
                />
            </div>
            {/* Quantity */}
            <div>
                <label htmlFor="so_qty"> SO Qty:</label>
                <input
                    type="text"
                    id="so_qty"
                    placeholder="Enter SO Qty"
                    value={formData.so_qty}
                    name='so_qty'
                    className='p-2 border border-gray-400 rounded-md w-full'
                    onChange={formDataHandler}
                    required
                />
            </div>
            {/* // remarks and stitch remarks  */}
            <div className='w-full'>
                <label htmlFor="remarks">Remarks:</label>
                <textarea 
                    name="remarks"
                    value={formData.remarks}
                    onChange={formDataHandler}
                    className='p-4 border border-gray-400 rounded-md w-full'
                    id="" />
            </div>
            
            <div className='w-full'>
                <label htmlFor="stitch_remarks">Stitch Remarks:</label>
                <textarea 
                    name="stitch_remarks"
                    value={formData.stitch_remarks}
                    onChange={formDataHandler}
                    className='p-4 border border-gray-400 rounded-md w-full'
                    id="" />
            </div>

            {/*  date */}
            <div>
                <label htmlFor="stitch_date">Stitch Date:</label>
                <input
                    type="date"
                    id="stitch_date"
                    name="stitch_date"
                    value={formData.stitch_date}
                    onChange={formDataHandler}
                    required
                    className='p-2 border border-gray-400 rounded-md w-full'
                />
            </div>

            {/*  qty */}
            <div>
                <label htmlFor="qty">Qty:</label>
                <input
                    type="text"
                    id="qty"
                    name="qty"
                    value={formData.qty}
                    onChange={formDataHandler}
                    required
                    className='p-2 border border-gray-400 rounded-md w-full'
                />
            </div>

            </div>

            {/*  data table area */}
            <div>
                <SmartTable1 headers={headers} data={tableData}/>
            </div>


            <div className=' flex justify-center items-center m-5 gap-2 text-white'>
                <button 
                type='submit'
                onClick={saveHandler}
                className='p-3 bg-green-500 rounded-md hover:bg-green-600 hover:scale-105 transition-all duration-100 ease-in-out'> Save </button>
                
                <button 
                onClick={clearButtonHandler}
                className='p-3 bg-yellow-500 rounded-md hover:bg-yellow-600 hover:scale-105 transition-all duration-100 ease-in-out'> Clear </button>
    
            </div>
        </form>
    </div>
    </div>
    </div>
  )
}

export default StitchStatusPage
