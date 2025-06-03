import FormInput from "../utility/FormInput";

const BillOfSaleSFG = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-blue-900 mb-4">
        Bill of Sales SFG
      </h1>
      <form className="grid grid-cols-2 gap-6 p-2 mb-16">
        <div className="col-span-2 flex border border-blue-500 justify-center mt-4 rounded p-2">
          <div className="  ">
            <button
              type="button"
              className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-700 transition"
            >
              Choose Bill Of Sales
            </button>
          </div>
        </div>

        {/* Date */}
        <FormInput label={"Date"} type={"date"} name={"date"} />

        {/* SO ID */}
        <FormInput
          label={"SO ID"}
          type={"text"}
          name={"so_id"}
          placeholder={"SO ID"}
        />

        {/* Design */}
        <FormInput
          label={"Design"}
          type={"text"}
          name={"design"}
          placeholder={"Design"}
        />

        {/* Remarks */}
        <div className="flex flex-col">
          <label className="text-gray-700 font-semibold">Remarks</label>
          <textarea
            className="border border-gray-300 bg-gray-100 rounded-md p-2 h-40 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            placeholder="Remarks"
            name="remarks"
          ></textarea>
        </div>

        {/* Color */}
        <FormInput
          label={"Color"}
          type={"text"}
          name={"color"}
          placeholder={"Color"}
        />

        {/* Processor */}
        <FormInput
          label={"Processor"}
          type={"text"}
          name={"processor"}
          placeholder={"Processor"}
        />

        {/*Seller Details */}
        <FormInput
          label={"Seller details"}
          type={"text"}
          name={"seller_details"}
          placeholder={"Seller details"}
        />

        {/* Purchaser Details */}
        <FormInput
          label={"Purchaser Details"}
          type={"text"}
          name={"purchaser_details"}
          placeholder={"Purchaser Details"}
        />

        {/* Job Note */}
        <div className="flex flex-col">
          <label className="text-gray-700 font-semibold">Job Note</label>
          <textarea
            className="border border-gray-300 bg-gray-100 rounded-md p-2 h-40 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            placeholder="Job Note"
            name="job_note"
          ></textarea>
        </div>

        <div className="col-span-2 flex border border-blue-500 justify-center mt-4 rounded p-2">
          <div className="  ">
            <button
              type="button"
              className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-700 transition"
            >
              Choose Semi Finished Goods
            </button>
          </div>
        </div>

        {/* Buttons */}
        <div className="col-span-2 flex justify-end mt-4 gap-4">
          <button
            type="button"
            className="bg-gray-200 px-4 py-1 rounded hover:bg-gray-600 hover:text-white transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-gray-200 px-4 py-1 rounded hover:bg-gray-600 hover:text-white transition"
          >
            Calculate
          </button>
          <button
            type="submit"
            className="bg-gray-200 px-4 py-1 rounded hover:bg-gray-600 hover:text-white transition"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default BillOfSaleSFG;
