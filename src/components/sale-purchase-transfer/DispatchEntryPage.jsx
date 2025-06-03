import React, { useState } from 'react'

const DispatchEntryPage = () => {
    const title = "Dispatch Entry";
    const [chooseDataModal, setChooseDataModal] = useState(false);

    const chooseSalesOrderHandler = (e) => {
        e.preventDefault();
        setChooseDataModal(true);
    }


    // form data
    const [formData, setFormData] = useState({
        so_id:"",
        customer:"",
        design_name:"",
        so_qty:"",
        cn_no:"",
        invoice_date:"",
        remarks:"",
        invoice_no:"",
    });


    // form data handler
    const formDataHandler = (e) => {
        const { name, type, checked, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: type === "checkbox" ? checked : value,
            full_set: name === "full_set" ? checked : prevData.full_set && !checked,
            parcial_set: name === "parcial_set" ? checked : prevData.parcial_set && !checked
        }));
    };
    

    // clear form handler
    const clearButtonHandler = (e) => {
        e.preventDefault();
        setFormData({
            full_set:false,
            parcial_set:false,
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

            <div className=' flex items-center justify-center gap-4'>

            {/*  two tick boxes */}
            <div className='flex items-center gap-2'>
                <label htmlFor="full_set" className=''>FullSet</label>
                <input type="checkbox"
                checked={formData.full_set}
                name='full_set'
                onChange={formDataHandler}
                className='p-2 border border-gray-400 rounded-md w-full'
                 />
            </div>
            <div className=' flex items-center gap-2'>
                <label htmlFor="parcial_set">ParcialSet</label>
                <input type="checkbox"
                checked={formData.parcial_set}
                name='parcial_set'
                onChange={formDataHandler}
                className='p-2 border border-gray-400 rounded-md w-full'
                 />
            </div>
        
            <div className='flex items-center justify-center gap-4'>
                <label htmlFor="chooseSalesOrder">From SO Id:</label>
                <button 
                id='chooseSalesOrder'
                onClick={chooseSalesOrderHandler}
                className='p-2 bg-blue-500 rounded-md text-white hover:bg-blue-600 hover:scale-105'>
                    Choose Sales Order
                </button>
            </div>

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
            {/* CN no */}
            <div>
                <label htmlFor="cn_no"> CN No:</label>
                <input
                    type="text"
                    id="cn_no"
                    placeholder="Enter CN No"
                    value={formData.cn_no}
                    name='cn_no'
                    className='p-2 border border-gray-400 rounded-md w-full'
                    onChange={formDataHandler}
                    required
                />
            </div>

            {/*  date */}
            <div>
                <label htmlFor="invoice_date">Invoice Date:</label>
                <input
                    type="date"
                    id="invoice_date"
                    name="invoice_date"
                    value={formData.invoice_date}
                    onChange={formDataHandler}
                    required
                    className='p-2 border border-gray-400 rounded-md w-full'
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

            {/*  invoice no */}
            <div>
                <label htmlFor="invoice_no">Invoice No:</label>
                <input
                    type="text"
                    id="invoice_no"
                    name="invoice_no"
                    value={formData.invoice_no}
                    onChange={formDataHandler}
                    required
                    className='p-2 border border-gray-400 rounded-md w-full'
                />
            </div>

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

export default DispatchEntryPage
