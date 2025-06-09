import React from 'react'
import { Link } from 'react-router-dom'
const data = [
    {
        id: 1,
        title: "New SO",
        count: 305,
        link: "#",
    },
    {
        id: 2,
        title: "New Converted SO",
        count: 188,
        link: "#",
    },
    {
        id: 3,
        title: "Action Due",
        count: 117,
        link: "#",
    },
    {
        id: 4,
        title: "Daily Follow Up List",
        count: 10,
        link: "#",
    },
    {
        id: 5,
        title: "Dispatch in Next 7 Days",
        count: 240,
        link: "#",
    },
    {
        id: 6,
        title: "Delivery Over Due",
        count: 322,
        link: "#",
    }
]


const CountsDashboard = () => {
    return (
        <div className='mt-10'>
            <div className=' flex flex-wrap justify-center items-center gap-4'>
                {data.map((item) =>
                (
                    <div 
                    className={`text-center shadow-xl shadow-gray-400  w-52 h-52 rounded-2xl duration-200 ease-out transition-all ${(item.count > 0 && item.count < 200) && "bg-green-500 hover:bg-green-600"} ${(item.count > 200 && item.count < 250) && "bg-yellow-500 hover:bg-yellow-600"} ${(item.count >= 250) && "bg-red-500 hover:bg-red-600"}`}
                    >
                        <div className=' h-44 flex justify-center items-center flex-col'>
                            <h1 className=' text-3xl font-bold'>{item.count}</h1>
                            <h4 className='text-lg font-semibold'>{item.title}</h4>
                        </div>

                        <div className='flex justify-center items-center w-full h-10'>
                            <Link to={item.link} className=' no-underline border border-gray-400 rounded-xl px-4 py-2 bg-gray-200 hover:bg-white'>
                                More Info
                            </Link>
                        </div>
                    </div>
                ))
                }
            </div>
        </div>
    )
}

export default CountsDashboard
