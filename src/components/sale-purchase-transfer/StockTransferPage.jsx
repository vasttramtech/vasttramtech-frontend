import React, { useEffect, useState } from 'react'

const StockTransferPage = () => {
    const title = "Stock Transfer"

    const [ fromSOFormData, setFromSOFormData ] = useState({
        so_id:'',
        transferId:'',
        customer:'',
        design_number:'',
        design_name:'',
        quantity:'',
        colour:'',
        total_rate:'',
        total_stock_quantity:'',

    });

    const [ toSOFormData, setToSOFormData ] = useState({
        so_id:'',
        customer:'',
        design_number:'',
        design_name:'',
        quantity:'',
        colour:'',
        amount:'',
        transfer_qty:'',
        transfer_remarks:'',
        transfer_date:'',
    }) 

    // useEffect(() =>{
    //     console.log(fromSOFormData);
    // }, [fromSOFormData]);
    
    const fromInputChangeHandler = (e) => {
        const { name, value } = e.target;
        setFromSOFormData(prevData => ({
           ...prevData,
            [name]: value,
        }));
    }

    const toInputChangeHandler = (e) => {
        const { name, value } = e.target;
        setToSOFormData(prevData => ({
           ...prevData,
            [name]: value,
        }));
    }


    // clear button handler
    const clearButtonHandler = (event) => {
        event.preventDefault();
        setFromSOFormData({
            so_id:'',
            transferId:'',
            customer:'',
            design_number:'',
            design_name:'',
            quantity:'',
            colour:'',
            total_rate:'',
            total_stock_quantity:'',
    
        });

        setToSOFormData({
            so_id:'',
            customer:'',
            design_number:'',
            design_name:'',
            quantity:'',
            colour:'',
            amount:'',
            transfer_qty:'',
            transfer_remarks:'',
            transfer_date:'',
        }) 
    }


    // on submiting save handler will handler
    const saveHandler = (event) =>{
        event.preventDefault();
        console.log(fromSOFormData, toSOFormData);
    }

    // modal for choosing data from sales order
    const [ chooseDataModal, setChooseDataModal] = useState(false);

    const chooseSalesOrderHandler = (event) => {
        event.preventDefault();
        setChooseDataModal(true);
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
      <h1 className="text-3xl font-bold text-blue-900 mb-4">{title}</h1>
        <div className=' border-gray-200 border p-5 rounded-xl shadow-xl'>
        <form action="">
            <div className=' grid grid-cols-2 justify-between items-center'>
    
        
            <div className='flex items-center gap-4'>
                <label htmlFor="chooseSalesOrder">From SO Id:</label>
                <button 
                id='chooseSalesOrder'
                onClick={chooseSalesOrderHandler}
                className='p-2 bg-blue-500 rounded-md text-white hover:bg-blue-600 hover:scale-105'>
                    Choose Sales Order
                </button>
            </div>

            {/* transfer id */}
            <div className=' flex items-center gap-3 '>
                <label htmlFor="transferId">Transfer Id: </label>
                <input
                    type="text"
                    id="transferId"
                    placeholder="TRANS/24-25/1"
                    name='transferId'
                    value={fromSOFormData.transferId}
                    className='p-2 border border-gray-400 rounded-md'
                    onChange={fromInputChangeHandler}
                    required
                />
            </div>
        </div>
        <div className=' pt-5 grid grid-cols-2 gap-4 gap-x-10'>
            {/*  so id */}
            <div>
                <label htmlFor="so_id">So Id:</label>
                <input
                    type="text"
                    id="so_id"
                    placeholder="Enter So Id"
                    value={fromSOFormData.so_id}
                    name='so_id'
                    className='p-2 border border-gray-400 rounded-md w-full'
                    onChange={fromInputChangeHandler}
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
                    value={fromSOFormData.customer}
                    className='p-2 border border-gray-400 rounded-md w-full'
                    name='customer'
                    onChange={fromInputChangeHandler}
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
                    value={fromSOFormData.design_number}
                    name='design_number'
                    onChange={fromInputChangeHandler}
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
                    value={fromSOFormData.design_name}
                    name='design_name'
                    onChange={fromInputChangeHandler}
                    required
                />
            </div>
            {/* Quantity */}
            <div>
                <label htmlFor="quantity">Quantity:</label>
                <input
                    type="text"
                    id="quantity"
                    placeholder="Enter Quantity"
                    value={fromSOFormData.quantity}
                    name='quantity'
                    className='p-2 border border-gray-400 rounded-md w-full'
                    onChange={fromInputChangeHandler}
                    required
                />
            </div>

            {/* Colour */}
            <div>
                <label htmlFor="colour">Colour:</label>
                <input
                    type="text"
                    id="colour"
                    placeholder="Enter Colour"
                    value={fromSOFormData.colour}
                    className='p-2 border border-gray-400 rounded-md w-full'
                    name='colour'
                    onChange={fromInputChangeHandler}
                    required
                />
            </div>
            {/* Total Rate */}
            <div>
                <label htmlFor="total_rate">Total Rate:</label>
                <input
                    type="text"
                    id="total_rate"
                    placeholder="Enter Total Rate"
                    value={fromSOFormData.total_rate}
                    name='total_rate'
                    onChange={fromInputChangeHandler}
                    className='p-2 border border-gray-400 rounded-md w-full'
                    required
                />
            </div>
            {/* Total Stock Quantity */}
            <div>
                <label htmlFor="total_stock_quantity">Total Stock Quantity:</label>
                <input
                    type="text"
                    id="total_stock_quantity"
                    placeholder="Enter Total Stock Quantity"
                    value={fromSOFormData.total_stock_quantity}
                    className='p-2 border border-gray-400 rounded-md w-full'
                    name='total_stock_quantity'
                    onChange={fromInputChangeHandler}
                    required
                />
            </div>
        </div>      
        
            <div className=' my-10 flex items-center gap-4'>
            <label htmlFor="">To SO Id:</label>
                <button
                onClick={chooseSalesOrderHandler}
                className=' p-2  bg-blue-500 rounded-md text-white hover:bg-blue-600 hover:scale-105'>
                    Choose Sales Order
                </button>
            </div>

        <div className=' grid grid-cols-2 gap-4 gap-x-4 justify-between items-center'>
          
            <div>
                <label htmlFor="so_id">SO Id:</label>
                <input
                    type="text"
                    id="so_id"
                    placeholder="Enter SO Id"
                    value={toSOFormData.so_id}
                    name='so_id'
                    onChange={toInputChangeHandler}
                    required
                    className='p-2 border border-gray-400 rounded-md w-full'
                />
            </div>
            {/* Customer */}
            <div>
                <label htmlFor="customer">Customer:</label>
                <input
                    type="text"
                    id="customer"
                    placeholder="Enter Customer Name"
                    value={toSOFormData.customer}
                    name='customer'
                    onChange={toInputChangeHandler}
                    className='p-2 border border-gray-400 rounded-md w-full'
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
                    value={toSOFormData.design_number}
                    className='p-2 border border-gray-400 rounded-md w-full'
                    name='design_number'
                    onChange={toInputChangeHandler}
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
                    value={toSOFormData.design_name}
                    name='design_name'
                    className='p-2 border border-gray-400 rounded-md w-full'
                    onChange={toInputChangeHandler}
                    required
                />
            </div>
            {/* Quantity */}
            <div>
                <label htmlFor="quantity">Quantity:</label>
                <input
                    type="text"
                    id="quantity"
                    placeholder="Enter Quantity"
                    className='p-2 border border-gray-400 rounded-md w-full'
                    value={toSOFormData.quantity}
                    name='quantity'
                    onChange={toInputChangeHandler}
                    required
                />
            </div>

            {/* Colour */}
            <div>
                <label htmlFor="colour">Colour:</label>
                <input
                    type="text"
                    id="colour"
                    placeholder="Enter Colour"
                    value={toSOFormData.colour}
                    name='colour'
                    className='p-2 border border-gray-400 rounded-md w-full'
                    onChange={toInputChangeHandler}
                    required
                />
            </div>
            {/* Amount */}
            <div>
                <label htmlFor="amount">Amount:</label>
                <input
                    type="text"
                    id="amount"
                    placeholder="Enter Amount"
                    value={toSOFormData.amount}
                    className='p-2 border border-gray-400 rounded-md w-full'
                    name='amount'
                    onChange={toInputChangeHandler}
                    required
                />
            </div>
            {/* Transfer quantity */}
            <div>
                <label htmlFor="transfer_qty">Transfer Qty:</label>
                <input
                    type="text"
                    id="transfer_qty"
                    placeholder="Enter here"
                    value={toSOFormData.transfer_qty}
                    name='transfer_qty'
                    className='p-2 border border-gray-400 rounded-md w-full'
                    onChange={toInputChangeHandler}
                    required
                />
            </div>
            

        </div>      
        <div className='flex justify-between items-start gap-4 mt-4'>
            <div className='w-full'>
                <label htmlFor="transfer_remarks"> Transfer Remarks:</label>
                <textarea 
                    name="transfer_remarks"
                    value={toSOFormData.transfer_remarks}
                    onChange={toInputChangeHandler}
                    className='p-4 border border-gray-400 rounded-md w-full'
                    id="" />
            </div>

            <div>
                <label htmlFor="transfer_date">Transfer Date:</label>
                <input
                    type="date"
                    id="transfer_date"
                    name="transfer_date"
                    value={toSOFormData.transfer_date}
                    onChange={toInputChangeHandler}
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

            
            <button className='p-3 bg-blue-500 rounded-md hover:bg-blue-600 hover:scale-105 transition-all duration-100 ease-in-out'> Calculate</button>
        </div>
    </form>
        </div>
    </div>
  )
}

export default StockTransferPage
