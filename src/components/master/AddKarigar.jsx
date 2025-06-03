import SmartTable1 from "../../smartTable/SmartTable1";

const jobberTableHeaders = [
   "","", "Jobber ID", "Jobber Name", "Days Need", "Work Type", "Address"
];

const AddKarigar = ({setJobberModal,setSelectedJobbers,addedJobber,jobber,updateKarigars}) => {

    return (
        <div className="bg-gray-200 fixed w-[90vw] z-10 shadow-xl">
            <div className="text-xl absolute top-2 right-5 bg-red-600 px-2 hover:bg-red-500 hover:cursor-pointer font-bold" onClick={() => { setJobberModal(false); setSelectedJobbers((prev) => [...prev, ...addedJobber]); }}>X</div>
            <SmartTable1 headers={jobberTableHeaders} data={jobber}/>
            <div className="flex items-center justify-center my-2">
                <button onClick={() => updateKarigars()} className="bg-gray-400 px-4 py-1 rounded hover:bg-gray-600 hover:text-white transition ml-4">
                    Add
                </button>
            </div>
        </div>
    )
}

export default AddKarigar;