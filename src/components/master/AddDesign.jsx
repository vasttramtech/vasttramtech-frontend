import SmartTable from "../../smartTable/SmartTable";

const jobberTableHeaders = [
    "", "SfgName", "Unit", "Description"];     

const AddDesign = ({setItemSFGModel ,setSelectedDesign ,addedDesign ,updateDesigns ,updatedDesigns}) => {

    return (
        <div className="bg-gray-200 fixed w-[90vw] z-10 shadow-xl">
            <div className="text-xl absolute top-2 right-5 bg-red-600 px-2 hover:bg-red-500 hover:cursor-pointer font-bold" onClick={() => { setItemSFGModel(false);
                setSelectedDesign(addedDesign) ;
            }}>X</div>
            <SmartTable headers={jobberTableHeaders} data={updatedDesigns}/>
            <div className="flex items-center justify-center my-2">
                <button onClick={() => updateDesigns()} className="bg-gray-400 px-4 py-1 rounded hover:bg-gray-600 hover:text-white transition ml-4">
                    Add
                </button>
            </div>
        </div>
    )
}

export default AddDesign;