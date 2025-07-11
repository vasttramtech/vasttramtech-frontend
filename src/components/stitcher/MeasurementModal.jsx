import React from 'react'

const MeasurementModal = ({ setMeasurementModal }) => {

    return (
        <div className='absolute top-0 left-0 w-full h-full bg-white flex  border border-gray-500 rounded-lg p-5'>

            <div className='flex w-full justify-between items-start'>
                <h1 className='text-xl font-bold'>Measurement Modal</h1>
                <button className=' px-2 rounded-full bg-red-500 text-lg text-white' type='button' onClick={() => setMeasurementModal(false)}>X</button>
            </div>

        </div>
    )
}

export default MeasurementModal
