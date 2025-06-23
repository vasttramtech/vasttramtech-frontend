import React, { useState } from 'react'

const CountsDashboard = ({data}) => {
    console.log(data);
    
    const [selectedCategory, setSelectedCategory] = useState(null);
    
    // Sample data for demonstration
    
    const ordersData = data;
    
    // Helper function to check if delivery is within next 7 days
    const isDeliveryWithin7Days = (deliveryDate) => {
        const today = new Date();
        const delivery = new Date(deliveryDate);
        const diffTime = delivery - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 7 && diffDays >= 0;
    };
    
    // Helper function to check if delivery is overdue
    const isDeliveryOverdue = (deliveryDate) => {
        const today = new Date();
        const delivery = new Date(deliveryDate);
        return delivery < today;
    };
    
    // Categorize orders
    const overdueOrders = ordersData.filter(order => isDeliveryOverdue(order.delivery_date));
    const processDueOrders = ordersData.filter(order => order.status.toLowerCase() === 'process due');
    const dispatchNext7DaysOrders = ordersData.filter(order => 
        isDeliveryWithin7Days(order.delivery_date) && order.status.toLowerCase() !== 'process due'
    );
    
    // Dashboard counts
    const dashboardData = [
        {
            count: overdueOrders.length,
            title: "Delivery Overdue",
            color: "red",
            category: "overdue"
        },
        {
            count: processDueOrders.length,
            title: "Process Due",
            color: "yellow",
            category: "processDue"
        },
        {
            count: dispatchNext7DaysOrders.length,
            title: "Dispatch Next 7 Days",
            color: "green",
            category: "dispatchNext7Days"
        }
    ];
    
    // Get orders for selected category
    const getOrdersForCategory = (category) => {
        switch(category) {
            case 'overdue':
                return overdueOrders;
            case 'processDue':
                return processDueOrders;
            case 'dispatchNext7Days':
                return dispatchNext7DaysOrders;
            default:
                return [];
        }
    };
    
    const selectedOrders = selectedCategory ? getOrdersForCategory(selectedCategory) : [];
    
    return (
        <div className='mt-10'>
            {/* Dashboard Cards */}
            <div className='flex flex-wrap justify-center items-center gap-4'>
                {dashboardData.map((item, index) => (
                    <div 
                        key={index}
                        className={`text-center shadow-xl shadow-gray-400 w-52 h-52 rounded-2xl duration-200 ease-out transition-all ${
                            item.color === 'green' ? 'bg-green-500 hover:bg-green-600' :
                            item.color === 'yellow' ? 'bg-yellow-500 hover:bg-yellow-600' :
                            'bg-red-500 hover:bg-red-600'
                        }`}
                    >
                        <div className='h-44 flex justify-center items-center flex-col'>
                            <h1 className='text-3xl font-bold text-white'>{item.count}</h1>
                            <h4 className='text-lg font-semibold text-white'>{item.title}</h4>
                        </div>
                        <div className='flex justify-center items-center w-full h-10'>
                            <button 
                                onClick={() => setSelectedCategory(selectedCategory === item.category ? null : item.category)}
                                className='no-underline border border-gray-400 rounded-xl px-4 py-2 bg-gray-200 hover:bg-white text-gray-800'
                            >
                                {selectedCategory === item.category ? 'Hide Details' : 'More Info'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            
            {/* Order Details Section */}
            {selectedCategory && (
                <div className="max-w-7xl mx-auto px-4 mt-10">
                    <div className="mb-8">
                        <h2 className={`text-2xl font-bold mb-4 p-4 rounded-lg text-white ${
                            selectedCategory === 'overdue' ? 'bg-red-500' :
                            selectedCategory === 'processDue' ? 'bg-yellow-500' :
                            'bg-green-500'
                        }`}>
                            {dashboardData.find(item => item.category === selectedCategory)?.title} ({selectedOrders.length})
                        </h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {selectedOrders.map((order) => (
                                <div key={order.id} className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className="font-bold text-lg text-gray-800">{order.design_name}</h3>
                                            <p className="text-sm text-gray-600">{order.so_id}</p>
                                        </div>
                                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                            order.status.toLowerCase() === 'process due' 
                                                ? 'bg-yellow-100 text-yellow-800' 
                                                : 'bg-green-100 text-green-800'
                                        }`}>
                                            {order.status}
                                        </span>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <p className="text-gray-600">Customer:</p>
                                            <p className="font-semibold">{order.customer_name}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600">Order No:</p>
                                            <p className="font-semibold">{order.order_no}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600">Group:</p>
                                            <p className="font-semibold">{order.group_name}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600">Quantity:</p>
                                            <p className="font-semibold">{order.qty}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600">Order Date:</p>
                                            <p className="font-semibold">{order.order_date}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600">Delivery Date:</p>
                                            <p className="font-semibold text-red-600">{order.delivery_date}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        {selectedOrders.length === 0 && (
                            <p className="text-gray-500 text-center py-8">No orders in this category</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CountsDashboard;