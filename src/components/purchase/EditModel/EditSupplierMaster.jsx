import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { PuffLoader, BounceLoader } from "react-spinners";
import { useParams, useNavigate } from "react-router-dom";
import FormLabel from "../FormLabel";
import { toast } from "react-toastify";


const EditSupplierMaster = ({ setOpenEditModal, selectedRow, fetchSupplierMasterData, statesOfIndia, concerned_person_headers, EditableDelte }) => {

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { token } = useSelector((state) => state.auth);
    const [submitting, setSubmitting] = useState(false);
    const [AddedConcernedPerson1, setAddedConcernedPerson1] = useState([]);
    const [concernedPersonDetails, setConcernedPersonDetails] = useState({
        concerned_person_name: "",
        mobile_number_1: "",
        mobile_number_2: "",
        mobile_number_3: "",
        designation: "",
        board_desk_no: "",
        direct_desk_no: "",
        email_id: "",
        address: "",
        alternate_email_id: "",
    });
    const [formData, setFormData] = useState({
        group_name: "",
        company_type: "",
        company_name: "",
        state: "",
        credit_limit: "",
        credit_limit_days: "",
        contact_number: "",
        website: "",
        address_category: "",
        address: "",
        email_id: "",
        pan_number: "",
        gstin_number: "",
        concerned_person: [],
    });
    console.log("selectedRow: ", selectedRow)

    const handleInputChangeCompay = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleInputchangeConcernedPerson = (e) => {
        const { name, value } = e.target;
        setConcernedPersonDetails((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    useEffect(() => {
        setFormData({
            ...formData,
            concerned_person: AddedConcernedPerson1,
        });
    }, [AddedConcernedPerson1]);

    const AddConcernedPerson = () => {
        // console.log(concernedPersonDetails)
        setAddedConcernedPerson1([...AddedConcernedPerson1, concernedPersonDetails]);
        setConcernedPersonDetails({
            concerned_person_name: "",
            mobile_number_1: "",
            mobile_number_2: "",
            mobile_number_3: "",
            designation: "",
            board_desk_no: "",
            direct_desk_no: "",
            email_id: "",
            address: "",
            alternate_email_id: "",
        });
    };

    const cancelHandler = (e) => {
        e.preventDefault();
        setOpenEditModal(false);
    }

    const fetchColorWithId = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/supplier-masters/${selectedRow?.id}?populate=*`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = response.data.data;
            const updatedFormData = {
                supplier_id: data?.supplier_id,
                group_name: data?.group_name,
                company_type:data?.company_type,
                company_name: data?.company_name,
                state: data?.state,
                credit_limit: data?.credit_limit,
                credit_limit_days: data?.credit_limit_days,
                contact_number: data?.contact_number,
                website: data?.website,
                address_category: data?.address_category,
                address: data?.address,
                email_id: data?.email_id,
                pan_number: data?.pan_number,
                gstin_number: data?.gstin_number,
            };
            setFormData(updatedFormData);

            setAddedConcernedPerson1(data?.concerned_person_details?.map((person) => ({
                concerned_person_name: person?.concerned_person_name,
                mobile_number_1: person?.mobile_number_1,
                mobile_number_2: person?.mobile_number_2,
                mobile_number_3: person?.mobile_number_3,
                designation: person?.designation,
                board_desk_no: person?.board_desk_no,
                direct_desk_no: person?.direct_desk_no,
                email_id: person?.email_id,
                address: person?.address,
                alternate_email_id: person?.alternate_email_id,
            })));
        } catch (error) {
            console.error("Error fetching jobber data:", error);
            if (error.response?.status === 401) {
                navigate("/login");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchColorWithId();
        } else {
            navigate("/login");
        }
    }, [token, selectedRow]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        const postData = {
            data: {
                group_name: formData.group_name,
                company_type: formData.company_type,
                company_name: formData.company_name,
                state: formData.state,
                credit_limit: formData.credit_limit_amount,
                credit_limit_days: formData.credit_limit_days,
                contact_number: formData.contact_number,
                website: formData.website,
                address_category: formData.address_category,
                address: formData.address,
                email_id: formData.email_id,
                pan_number: formData.pan_number,
                gstin_number: formData.gstin_number,
                concerned_person_details: formData.concerned_person,
            },
        };

        try {
            await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/supplier-masters/${selectedRow?.id}`, postData, {
                headers: {
                    Authorization: `Bearer ${token}`, // Send token in the Authorization header
                },
            });
            // Optionally handle success (e.g., notify user, reset form)
            toast.success("Supplier Master data saved successfully!", { position: "top-right" });

            setFormData({
                group_name: "",
                company_type: "",
                company_name: "",
                state: "",
                credit_limit: "",
                credit_limit_days: "",
                contact_number: "",
                website: "",
                address_category: "",
                address: "",
                email_id: "",
                pan_number: "",
                gstin_number: "",
                concerned_person: [],
            });
            setAddedConcernedPerson1([]);
            setOpenEditModal(false)
            fetchSupplierMasterData();

        } catch (error) {
            console.error("Error editing supplier data:", error);
            toast.error("Error editing supplier data");
        } finally {
            setSubmitting(false); // Stop the spinner
        }
    };

    console.log("formData: ", formData)

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg w-full">
        {
            loading && (
                <div className="absolute inset-0 flex justify-center items-center bg-opacity-50 bg-gray-200 z-10">
                    <BounceLoader size={100} color={"#1e3a8a"} loading={loading} />
                </div>
            )
        }
            <div className="flex justify-between">
                <h1>Edit Color Master</h1>
                <button onClick={() => setOpenEditModal(false)} className="text-gray-500 hover:text-red-700">
                    ✖
                </button>
            </div>

            <form className="grid grid-cols-2 gap-6 p-2 mb-16" onSubmit={handleUpdate}>
                {/* Group name */}
                <div className="flex flex-col">
                    <FormLabel title={"Group Name"} />
                    <select
                        className="border border-gray-300 bg-gray-100 rounded-md p-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e) => {
                            e.target.classList.add("text-black");
                            handleInputChangeCompay(e);
                        }}
                        name="group_name"
                        value={formData.group_name}
                    >
                        <option value="" disabled selected>
                            Group Name
                        </option>
                        <option value="Purchase">Purchase</option>
                        <option value="In House">In House</option>
                    </select>
                </div>

                {/* Company Type */}
                <div className="flex flex-col">
                    <FormLabel title={"Company Type"} />
                    <select
                        className="border border-gray-300 bg-gray-100 rounded-md p-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e) => {
                            e.target.classList.add("text-black");
                            handleInputChangeCompay(e);
                        }}
                        name="company_type"
                        value={formData.company_type}
                    >
                        <option value="" disabled selected>
                            Company Type
                        </option>
                        <option value="Fabric">Fabric</option>
                        <option value="Glass Beads">Glass Beads</option>
                        <option value="Thread">Thread</option>
                        <option value="Zippers">Zippers</option>
                    </select>
                </div>

                {/* Company Name */}
                <div className="flex flex-col">
                    <FormLabel title={"Company Name"} />
                    <input
                        type="text"
                        className="border border-gray-300 bg-gray-100 rounded-md p-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Company Name"
                        name="company_name"
                        value={formData.company_name}
                        onChange={handleInputChangeCompay}
                    />
                </div>

                {/* State */}
                <div className="flex flex-col">
                    <FormLabel title={"State"} />
                    <select
                        className="border border-gray-300 bg-gray-100 rounded-md p-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={handleInputChangeCompay}
                        value={formData.state}
                        name="state"
                    >
                        <option value="" className="text-gray-400">
                            State
                        </option>
                        {statesOfIndia.map((state, index) => (
                            <option key={index} value={state}>
                                {state}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Credit Limit Amount*/}
                <div className="flex flex-col">
                    <FormLabel title={"Credit Limit(Amount)"} />
                    <input
                        type="text"
                        className="border border-gray-300 bg-gray-100 rounded-md p-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Credit Limit (Amount)"
                        name="credit_limit"
                        value={formData.credit_limit}
                        onChange={handleInputChangeCompay}
                    />
                </div>

                {/* Credit Limit Days*/}
                <div className="flex flex-col">
                    <FormLabel title={"Credit Limit (Days)"} />
                    <input
                        type="text"
                        className="border border-gray-300 bg-gray-100 rounded-md p-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Credit Limit (Days)"
                        name="credit_limit_days"
                        value={formData.credit_limit_days}
                        onChange={handleInputChangeCompay}
                    />
                </div>

                {/* Contact No */}
                <div className="flex flex-col">
                    <label className="text-gray-700 font-semibold">Contact No</label>
                    <input
                        type="text"
                        className="border border-gray-300 bg-gray-100 rounded-md p-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Contact No"
                        name="contact_number"
                        value={formData.contact_number}
                        onChange={handleInputChangeCompay}
                    />
                </div>

                {/* Website */}
                <div className="flex flex-col">
                    <label className="text-gray-700 font-semibold">Website</label>
                    <input
                        type="text"
                        className="border border-gray-300 bg-gray-100 rounded-md p-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Website"
                        name="website"
                        value={formData.website}
                        onChange={handleInputChangeCompay}
                    />
                </div>

                {/* Address Category */}
                <div className="flex flex-col">
                    <label className="text-gray-700 font-semibold">Address Category</label>
                    <input
                        type="text"
                        className="border border-gray-300 bg-gray-100 rounded-md p-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Address Category"
                        name="address_category"
                        value={formData.address_category}
                        onChange={handleInputChangeCompay}
                    />
                </div>

                {/* Address */}
                <div className="flex flex-col">
                    <FormLabel title={"Address"} />
                    <input
                        type="text"
                        className="border border-gray-300 bg-gray-100 rounded-md p-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChangeCompay}
                    />
                </div>

                {/* Email Id */}
                <div className="flex flex-col">
                    <label className="text-gray-700 font-semibold">Email-Id</label>
                    <input
                        type="text"
                        className="border border-gray-300 bg-gray-100 rounded-md p-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Email-Id"
                        name="email_id"
                        value={formData.email_id}
                        onChange={handleInputChangeCompay}
                    />
                </div>

                {/* Concerned Person Name */}
                <div className="col-span-2">
                    <h1 className="text-xl font-bold text-blue-700">
                        Concerned Person Details
                    </h1>
                </div>

                {/* Concerned Person Name */}
                <div className="flex flex-col">
                    <label className="text-gray-700 font-semibold">
                        Concerned Person Name
                    </label>
                    <input
                        type="text"
                        className="border border-gray-300 bg-gray-100 rounded-md p-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Concerned Person Name"
                        value={concernedPersonDetails.concerned_person_name}
                        name="concerned_person_name"
                        onChange={handleInputchangeConcernedPerson}
                    />
                </div>

                {/* Designation */}
                <div className="flex flex-col">
                    <label className="text-gray-700 font-semibold">Designation</label>
                    <select
                        className="border border-gray-300 bg-gray-100 rounded-md p-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e) => {
                            e.target.classList.add("text-black");
                            handleInputchangeConcernedPerson(e);
                        }}
                        value={concernedPersonDetails.designation}
                        name="designation"
                    >
                        <option value="" disabled selected>
                            Designation
                        </option>
                        <option value="Owner">Owner</option>
                        <option value="Retailer">Retailer</option>
                    </select>
                </div>

                {/* Mobile 1 */}
                <div className="flex flex-col">
                    <label className="text-gray-700 font-semibold">Mobile 1</label>
                    <input
                        type="text"
                        className="border border-gray-300 bg-gray-100 rounded-md p-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Mobile 1"
                        value={concernedPersonDetails.mobile_number_1}
                        name="mobile_number_1"
                        onChange={handleInputchangeConcernedPerson}
                    />
                </div>

                {/* Mobile 2 */}
                <div className="flex flex-col">
                    <label className="text-gray-700 font-semibold">Mobile 2</label>
                    <input
                        type="text"
                        className="border border-gray-300 bg-gray-100 rounded-md p-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Mobile 2"
                        value={concernedPersonDetails.mobile_number_2}
                        name="mobile_number_2"
                        onChange={handleInputchangeConcernedPerson}
                    />
                </div>

                {/* Mobile 3 */}
                <div className="flex flex-col">
                    <label className="text-gray-700 font-semibold">Mobile 3</label>
                    <input
                        type="text"
                        className="border border-gray-300 bg-gray-100 rounded-md p-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Mobile 3"
                        value={concernedPersonDetails.mobile_number_3}
                        name="mobile_number_3"
                        onChange={handleInputchangeConcernedPerson}
                    />
                </div>

                {/* Board Desk No */}
                <div className="flex flex-col">
                    <label className="text-gray-700 font-semibold">Board Desk No</label>
                    <input
                        type="text"
                        className="border border-gray-300 bg-gray-100 rounded-md p-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Board Desk No"
                        value={concernedPersonDetails.board_desk_no}
                        name="board_desk_no"
                        onChange={handleInputchangeConcernedPerson}
                    />
                </div>

                {/* Direct Desk No */}
                <div className="flex flex-col">
                    <label className="text-gray-700 font-semibold">Direct Desk No</label>
                    <input
                        type="text"
                        className="border border-gray-300 bg-gray-100 rounded-md p-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Direct Desk No"
                        value={concernedPersonDetails.direct_desk_no}
                        name="direct_desk_no"
                        onChange={handleInputchangeConcernedPerson}
                    />
                </div>

                {/* Email Id */}
                <div className="flex flex-col">
                    <label className="text-gray-700 font-semibold">Email Id</label>
                    <input
                        type="text"
                        className="border border-gray-300 bg-gray-100 rounded-md p-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Email Id"
                        value={concernedPersonDetails.email_id}
                        name="email_id"
                        onChange={handleInputchangeConcernedPerson}
                    />
                </div>

                {/* Address */}
                <div className="flex flex-col">
                    <label className="text-gray-700 font-semibold">Address</label>
                    <textarea
                        className="border border-gray-300 bg-gray-100 rounded-md p-2 h-40 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                        placeholder="Address"
                        value={concernedPersonDetails.address}
                        name="address"
                        onChange={handleInputchangeConcernedPerson}
                    ></textarea>
                </div>

                {/* Alternate Id */}
                <div className="flex flex-col">
                    <label className="text-gray-700 font-semibold">
                        Alternate email Id
                    </label>
                    <input
                        type="text"
                        className="border border-gray-300 bg-gray-100 rounded-md p-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Address Id"
                        value={concernedPersonDetails.alternate_email_id}
                        name="alternate_email_id"
                        onChange={handleInputchangeConcernedPerson}
                    />
                </div>

                {/* Add Concerned Person Button inside container */}
                <div className="col-span-2 flex border border-blue-500 justify-center mt-4 rounded p-2">
                    <div className="  ">
                        <button
                            type="button"
                            className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-700 transition"
                            onClick={AddConcernedPerson}
                        >
                            Add Concerned Person
                        </button>
                    </div>
                </div>

                {AddedConcernedPerson1 && AddedConcernedPerson1.length > 0 && (
                    <EditableDelte
                        key={AddedConcernedPerson1.length}
                        headers={concerned_person_headers}
                        data={AddedConcernedPerson1}
                        onDataChange={setAddedConcernedPerson1}
                    />
                )}

                <div className="col-span-2 mt-4">
                    <h1 className="text-xl font-bold text-blue-700">
                        Company Legal Compliances
                    </h1>
                </div>

                {/* Pan No */}
                <div className="flex flex-col">
                    <label className="text-gray-700 font-semibold">Pan No</label>
                    <input
                        type="text"
                        className="border border-gray-300 bg-gray-100 rounded-md p-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Pan No"
                        name="pan_number"
                        value={formData.pan_number}
                        onChange={handleInputChangeCompay}
                    />
                </div>

                {/* GSTIN */}
                <div className="flex flex-col">
                    <label className="text-gray-700 font-semibold">GSTIN</label>
                    <input
                        type="text"
                        className="border border-gray-300 bg-gray-100 rounded-md p-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="GSTIN"
                        name="gstin_number"
                        value={formData.gstin_number}
                        onChange={handleInputChangeCompay}
                    />
                </div>

                {/* Buttons */}
                <div className="col-span-2 flex justify-end mt-4">
                    <button
                        onClick={cancelHandler}
                        type="button"
                        className="bg-gray-200 px-4 py-1 rounded hover:bg-gray-600 hover:text-white transition"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className={`bg-gray-500 ml-2 px-6 py-2 rounded text-white font-semibold transition-all ease-in-out duration-300 transform ${submitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-700'
                            }`}
                        disabled={submitting}
                    >
                        {submitting ? (
                            <div className="flex justify-center items-center space-x-2">
                                <PuffLoader size={20} color="#fff" />
                                <span>Updating...</span>
                            </div>
                        ) : (
                            'Update'
                        )}
                    </button>
                </div>
            </form>

        </div>
    )
};

export default EditSupplierMaster;

