import { useLocation } from "react-router-dom";
import SmartTable from "../../smartTable/SmartTable";
import { useNavigate } from "react-router-dom";
import Message from "../../assets/Others/Message.png";
import { useEffect, useState } from "react";
import { AddButton } from "../utility/AddButton";
import EditableDelte from "../utility/EditableDelete";
import axios from "axios";
import ViewIcon from "../../assets/Others/ViewIcon.png";
import EditIcon from "../../assets/Others/EditIcon.png";
import { useDispatch, useSelector } from "react-redux";
import { BounceLoader, PuffLoader } from "react-spinners";
import { toast } from "react-toastify";
import EditCustomerMaster from "./EditModals/EditCustomerMaster";
import Pagination from "../utility/Pagination";
import { fetchCustomers } from "../../state/fetchDataSlice";

const statesOfIndia = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

const headers = ["document_id", "Customer Id", "Group Name", "Company Name", "Branch", "Edit", ""];

const concerned_person_headers = [
  "concerned_person_name",
  "mobile_number_1",
  "mobile_number_2",
  "mobile_number_3",
  "designation",
  "board_desk_no",
  "direct_desk_no",
  "concerned_person_email_id",
  "address",
  "concerned_person_alternate_email_id",
];
const rawData = [
  {
    Id: "SD001",
    Group: "Group 1",
    Name: "Raw Material Company",
    Branch: "Branch 1",
  },
];

const CustomerMaster = () => {
  const location = useLocation();
  const title = location.state?.title || "Customer Master";
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [groupName, setGroupName] = useState(["Wholesale", "Retailer", "VSB", "In House"]);
  const { token } = useSelector(state => state.auth);
  const [loading, setLoading] = useState(true);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const dispatch = useDispatch();


  //  adding pagination logic
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [paginationLoading, setPaginationLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");



  const [customerMasterData, setCustomerMasterData] = useState([]);
  const [addressCategory, setAddressCategory] = useState([
    "Billing Address",
    "Delivery Address",
  ]);

  const [AddedConcernedPerson, setAddedConcernedPerson] = useState([]);
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
    company_name: "",
    fax_number: "",
    credit_limit_days: "",
    credit_limit_amount: "",
    contact_number: "",
    website: "",
    address_category: "",
    email_id: "",
    billing_address: "",
    state: "",
    pan_number: "",
    gstin_number: "",
    concerned_person: [],
  });

  useEffect(() => {
    setFormData({
      ...formData,
      concerned_person: AddedConcernedPerson,
      // email_id: mails,
      // contact_number: contacts,
      // billing_address: addressed,
      // website: websites,
    });
  }, [AddedConcernedPerson]);

  const AddConcernedPerson = () => {
    // console.log(concernedPersonDetails)
    setAddedConcernedPerson([...AddedConcernedPerson, concernedPersonDetails]);
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

  const handleInputchangeConcernedPerson = (e) => {
    const { name, value } = e.target;
    setConcernedPersonDetails((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleInputChangeCompay = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleRowClick = (rowData) => {
    navigate(`/profile/${rowData.id}`);
  };

  const handlePin = (rowData) => {
    console.log("Pin Clicked:", rowData);
    // Perform pin action
  };

  const handleView = (rowData) => {
    navigate(`/customer-master/${rowData.id}`);
  };

  const handleEdit = (rowData) => {
    console.log("Edit Clicked:", rowData);
    setSelectedRow(rowData);
    setOpenEditModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.company_name === '' || formData.group_name === '' || formData.email_id === '') {
      alert("Company Name, Group Name and Email is required");
      return;
    }



    setSubmitting(true);

    const postData = {
      data: {
        group_name: formData.group_name,
        company_name: formData.company_name,
        fax_number: formData.fax_number,
        credit_limit: formData.credit_limit_amount,
        credit_limit_days: formData.credit_limit_days,
        contact_number: formData.contact_number,
        website: formData.website,
        address_category: formData.address_category,
        email_id: formData.email_id,
        billing_address: formData.billing_address,
        state: formData.state,
        pan_number: formData.pan_number,
        gstin_number: formData.gstin_number,
        concerned_person_details: formData.concerned_person,
      },
    };
    console.log("postData: ", postData)

    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/customer-masters`, postData, {
        headers: {
          Authorization: `Bearer ${token}`, // Send token in the Authorization header
        },
      });
      // Optionally handle success (e.g., notify user, reset form)
      toast.success("Customer Master data saved successfully!", { position: "top-right" });

      await dispatch(fetchCustomers(token)).unwrap();

      setFormData({
        group_name: "",
        company_name: "",
        fax_number: "",
        credit_limit_days: "",
        credit_limit_amount: "",
        contact_number: "",
        website: "",
        address_category: "",
        email_id: "",
        billing_address: "",
        state: "",
        pan_number: "",
        gstin_number: "",
        concerned_person: [],
      });
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
      setAddedConcernedPerson([]);

      fetchCustomerMasterData();
    } catch (error) {
      console.error("Error posting jobber data:", error);
      // Optionally handle errors
    } finally {
      setSubmitting(false); // Stop the spinner
    }
  };

  const fetchCustomerMasterData = async () => {
    try {
      setPaginationLoading(true);

      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/customer-masters?populate=*`, {
        params: {
          "pagination[page]": page,
          "pagination[pageSize]": pageSize,
          "sort[0]": "createdAt:desc",
          ...(searchTerm && {
            "filters[$or][0][customer_id][$containsi]": searchTerm,
            "filters[$or][1][group_name][$containsi]": searchTerm,
            "filters[$or][2][company_name][$containsi]": searchTerm,
            "filters[$or][3][billing_address][$containsi]": searchTerm,
          }),
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const customerData = Array.isArray(response.data.data) ? response.data.data : [];
      setTotalPages(response.data.meta.pagination.pageCount);
      // console.log("customerData: ", customerData)

      const mappedCustomers = customerData.map(customer => ({
        id: customer.documentId,
        customer_id: customer.customer_id,
        group_name: customer.group_name,
        company_name: customer.company_name,
        billing_address: customer.billing_address
      }));

      setCustomerMasterData(mappedCustomers);
    } catch (error) {
      console.error("Error fetching jobber data:", error);
      if (error.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
      setPaginationLoading(false);
    }
  };

  // useEffect(() => {
  //   if (token) {
  //     fetchCustomerMasterData();
  //   } else {
  //     navigate("/login");
  //   }
  // }, [token, navigate, page, pageSize]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (token) {
        fetchCustomerMasterData();
      } else {
        navigate("/login");
      }
    }, 1000);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, page, pageSize, token, navigate]);

  const clearHandler = (e) => {
    e.preventDefault();
    setFormData({
      group_name: "",
      company_name: "",
      fax_number: "",
      credit_limit_days: "",
      credit_limit_amount: "",
      contact_number: "",
      website: "",
      address_category: "",
      email_id: "",
      billing_address: "",
      state: "",
      pan_number: "",
      gstin_number: "",
      concerned_person: [],
    });
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
    setAddedConcernedPerson([]);
  }


  const enhancedData = customerMasterData.map((item) => ({
    ...item,
    Actions: (
      <div className="flex justify-center items-center space-x-2">
        <button onClick={() => handleView(item)}>
          <img src={ViewIcon} alt="View" className="mr-4 w-4" />
        </button>
        <button onClick={() => handleEdit(item)}>
          <img src={EditIcon} alt="Edit" className="mr-4 w-4" />
        </button>
      </div>
    ),
    Pin: (
      <button onClick={() => handlePin(item)}>
        <img src={Message} alt="Pin" className="" />
      </button>
    ),
  }));
  // const Addmail = (e) => {
  //   e.preventDefault();
  //   if (currenMail.trim() === "") return;
  //   setMails([...mails, currenMail]);
  //   setCurrentmail("");
  // };
  // const AddAddress = (e) => {
  //   e.preventDefault();
  //   if (currentAddresss.trim() === "") return;
  //   setAddresses([...addressed, currentAddresss]);
  //   setcurrentAddresss("");
  // };
  // const AddWebsite = (e) => {
  //   e.preventDefault();
  //   if (currentWebsite.trim() === "") return;
  //   setWebsites([...websites, currentWebsite]);
  //   setCurrentWebsite("");
  // };
  // const AddContact = (e) => {
  //   e.preventDefault();
  //   if (currentContact.trim() === "") return;
  //   setContacts([...contacts, currentContact]);
  //   setCurrentContact("");
  // };
  // console.log(formData);
  return (
    <div className="py-2 bg-white rounded-lg relative">
      {loading ? (
        <div className="absolute inset-0 flex justify-center items-center mt-64 bg-opacity-50 bg-gray-200 z-10">
          <BounceLoader size={100} color={"#1e3a8a"} loading={loading} />
        </div>
      ) : (
        <div>
          <h1 className="text-3xl font-bold text-blue-900 mb-4">{title}</h1>

          {openEditModal && (
            <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50 overflow-y-auto">
              <div className="bg-white p-6 rounded-lg shadow-lg max-h-[90vh] overflow-y-auto w-[100%] max-w-4xl">
                <EditCustomerMaster
                  selectedRow={selectedRow}
                  setOpenEditModal={setOpenEditModal}
                  fetchCustomerMasterData={fetchCustomerMasterData}
                  groupName={groupName}
                  addressCategory={addressCategory}
                  statesOfIndia={statesOfIndia}
                  // concernedPersonDetails={concernedPersonDetails}
                  // setConcernedPersonDetails={setConcernedPersonDetails}
                  // AddConcernedPerson={AddConcernedPerson}
                  concerned_person_headers={concerned_person_headers}
                  // AddedConcernedPerson={AddedConcernedPerson}
                  // setAddedConcernedPerson={setAddedConcernedPerson}
                  EditableDelte={EditableDelte}
                />
              </div>
            </div>
          )}

          <form className="grid grid-cols-2 gap-6 p-5 rounded-lg border border-gray-200 shadow-md mb-16" onSubmit={handleSubmit}>
            {/* Group Name */}
            <div className="flex flex-col">
              <label className="text-gray-700 font-semibold">Group Name</label>
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
                {groupName.map((item, index) => (
                  <option value={item} key={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            {/* Company Name */}
            <div className="flex flex-col">
              <label className="text-gray-700 font-semibold">Company Name</label>
              <input
                type="text"
                className="border border-gray-300 bg-gray-100 rounded-md p-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Company Name"
                name="company_name"
                value={formData.company_name}
                onChange={handleInputChangeCompay}
              />
            </div>

            {/* Fax Number */}
            <div className="flex flex-col">
              <label className="text-gray-700 font-semibold">Fax Number</label>
              <input
                type="text"
                className="border border-gray-300 bg-gray-100 rounded-md p-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Fax Number (Amount)"
                value={formData.fax_number}
                name="fax_number"
                onChange={handleInputChangeCompay}
              />
            </div>

            {/* Credit Limit (Days) */}
            <div className="flex flex-col">
              <label className="text-gray-700 font-semibold">
                Credit Limit (Days)
              </label>
              <input
                type="text"
                className="border border-gray-300 bg-gray-100 rounded-md p-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Credit Limit (Days)"
                value={formData.credit_limit_days}
                name="credit_limit_days"
                onChange={handleInputChangeCompay}
              />
            </div>

            {/* Credit Limit(Amount) */}
            <div className="flex flex-col">
              <label className="text-gray-700 font-semibold">
                Credit Limit (Amount)
              </label>
              <input
                type="text"
                className="border border-gray-300 bg-gray-100 rounded-md p-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Credit Limit (Days)"
                value={formData.credit_limit_amount}
                name="credit_limit_amount"
                onChange={handleInputChangeCompay}
              />
            </div>

            {/* Contact No */}
            <div className="flex flex-col">
              <label className="text-gray-700 font-semibold">Contact No</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  className="w-full border border-gray-300 bg-gray-100 rounded-md p-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Contact Number"
                  name="contact_number"
                  // value={currentContact}
                  value={formData.contact_number}
                  // onChange={(e) => setCurrentContact(e.target.value)}
                  onChange={handleInputChangeCompay}
                />
                {/* <div
              className="flex justify-center items-center"
              onClick={AddContact}
            >
              <AddButton content={"Add"} />
            </div> */}
              </div>
            </div>

            {/* Website */}
            <div className="flex flex-col">
              <label className="text-gray-700 font-semibold">Website</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  className="w-full border border-gray-300 bg-gray-100 rounded-md p-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Website"
                  name="website"
                  // value={currentWebsite}
                  value={formData.website}
                  // onChange={(e) => setCurrentWebsite(e.target.value)}
                  onChange={handleInputChangeCompay}
                />
                {/* <div
              className="flex justify-center items-center"
              onClick={AddWebsite}
            >
              <AddButton content={"Add"} />
            </div> */}
              </div>
            </div>

            {/* Address Category */}
            <div className="flex flex-col">
              <label className="text-gray-700 font-semibold">
                Address Category
              </label>
              <select
                className="border border-gray-300 bg-gray-100 rounded-md p-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => {
                  e.target.classList.add("text-black");
                  handleInputChangeCompay(e);
                }}
                name="address_category"
                value={formData.address_category}
              >
                <option value="" disabled selected>
                  Address CatAddress
                </option>
                {addressCategory.map((item, index) => (
                  <option value={item} key={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            {/* Email Id */}
            <div className="flex flex-col">
              <label className="text-gray-700 font-semibold">Email-Id</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  className="w-full border border-gray-300 bg-gray-100 rounded-md p-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Email Id"
                  name="email_id"
                  // value={currenMail}
                  value={formData.email_id}
                  // onChange={(e) => setCurrentmail(e.target.value)}
                  onChange={handleInputChangeCompay}
                />
                {/* <div className="flex justify-center items-center" onClick={Addmail}>
              <AddButton content={"Add"} />
            </div> */}
              </div>
            </div>
            {/* Billing Address */}
            <div className="flex flex-col">
              <label className="text-gray-700 font-semibold">Billing Address</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  className="w-full border border-gray-300 bg-gray-100 rounded-md p-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Billing Address"
                  name="billing_address"
                  // value={currentAddresss}
                  value={formData.billing_address}
                  // onChange={(e) => setcurrentAddresss(e.target.value)}
                  onChange={handleInputChangeCompay}
                />
                {/* <div
              className="flex justify-center items-center"
              onClick={AddAddress}
            >
              <AddButton content={"Add"} />
            </div> */}
              </div>
            </div>

            {/* State */}
            <div className="flex flex-col">
              <label className="text-gray-700 font-semibold">Jobber State</label>
              <select
                className="border border-gray-300 bg-gray-100 rounded-md p-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                // onChange={(e) => {
                //   e.target.classList.add("text-black");
                //   handleInputChangeCompay();
                // }}
                onChange={handleInputChangeCompay}
                value={formData.state}
                name="state"
              >
                <option value="" className="text-gray-400">
                  State
                </option>
                {statesOfIndia.map((state, index) => (
                  <option key={index} value={state}>{state}</option>
                ))}
              </select>
            </div>

            <div className="col-span-2">
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
                value={formData.pan_number}
                name="pan_number"
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
                value={formData.gstin_number}
                name="gstin_number"
                onChange={handleInputChangeCompay}
              />
            </div>

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

            {AddedConcernedPerson && AddedConcernedPerson.length > 0 && (
              <EditableDelte
                key={AddedConcernedPerson.length}
                headers={concerned_person_headers}
                data={AddedConcernedPerson}
                onDataChange={setAddedConcernedPerson}
              />
            )}

            {/* Buttons */}
            <div className="col-span-2 flex justify-end mt-4">
              <button
                onClick={clearHandler}
                type="button"
                className="bg-gray-200 px-4 py-1 rounded hover:bg-gray-600 hover:text-white transition"
              >
                Cancel
              </button>
              {/* <button
                type="submit"
                className="bg-gray-200 px-4 py-1 rounded hover:bg-gray-600 hover:text-white transition ml-4"
              >
                Save
              </button> */}
              <button
                type="submit"
                className={`bg-blue-900 ml-2 px-6 py-2 rounded text-white font-semibold transition-all ease-in-out duration-300 transform ${submitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
                  }`}
                disabled={submitting}
              >
                {submitting ? (
                  <div className="flex justify-center items-center space-x-2">
                    <PuffLoader size={20} color="#fff" />
                    <span>Saving...</span>
                  </div>
                ) : (
                  'Save'
                )}
              </button>
            </div>
          </form>

          <div className="mb-16">
            {paginationLoading ? (
              <div className="flex p-5 justify-center items-center space-x-2 mt-4 border border-gray-400 rounded-lg">
                <BounceLoader size={20} color="#1e3a8a" />
              </div>
            ) : (
              // <SmartTable headers={headers} data={enhancedData} />
              <SmartTable
                headers={headers}
                data={enhancedData}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
              />
            )}

            <Pagination
              setPage={setPage}
              totalPages={totalPages}
              page={page}
              setPageSize={setPageSize}
              pageSize={pageSize}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerMaster;
