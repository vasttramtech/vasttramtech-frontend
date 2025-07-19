import { useState, useEffect } from "react";
import { BounceLoader, PuffLoader } from "react-spinners";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import FormInput from "../utility/FormInput";
import { fetchUserList } from "../../state/fetchDataSlice";

const AddUser = () => {
  const navigate = useNavigate();
  const { token, designation } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    designation: "Executive",
  });

  // Check authorization
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    if (designation !== "Admin") {
      navigate("/");
      return;
    }
  }, [token, designation, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.email ||
      !formData.password ||
      !formData.name ||
      !formData.designation
    ) {
      toast.error("All fields are required");
      return;
    }
    setSubmitting(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/custom/users`,
        { data: formData },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        await dispatch(fetchUserList(token)).unwrap();
        toast.success("User created successfully!");
        setFormData({
          email: "",
          password: "",
          name: "",
          designation: "Executive",
        });
      }
    } catch (err) {
      console.log(err);
      toast.error(
        err.response?.data?.error?.message ||
        "An error occurred while creating the user"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="absolute inset-0 flex justify-center items-center mt-64 bg-opacity-50 bg-gray-200 z-10">
        <BounceLoader size={100} color={"#1e3a8a"} />
      </div>
    );
  }

  return (
    <div className="p-2 bg-white rounded-lg relative">
      <h1 className="text-2xl font-bold text-blue-900 mb-4">Create New User</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-6 p-2 mb-16">
          <FormInput
            type={"text"}
            label={"Full Name"}
            name={"name"}
            placeholder={"Full Name"}
            value={formData.name}
            onChange={handleChange}
            editable={true}
          />

          <FormInput
            type={"email"}
            label={"Email Address"}
            name={"email"}
            placeholder={"Email Address"}
            value={formData.email}
            onChange={handleChange}
            editable={true}
          />

          <FormInput
            type={"password"}
            label={"Password"}
            name={"password"}
            placeholder={"Password"}
            value={formData.password}
            onChange={handleChange}
            editable={true}
          />

          <div className="col-span-2 sm:col-span-1">
            <label
              className="block text-gray-700 font-semibold mb-2"
              htmlFor="designation"
            >
              Designation*
            </label>
            <select
              id="designation"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500"
              required
            >
              <option value="Executive">Executive</option>
              <option value="Supervisor">Supervisor</option>
              <option value="Admin">Admin</option>
              <option value="Merchandiser">Merchandiser</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="bg-gray-200 px-4 py-1 rounded hover:bg-gray-600 hover:text-white transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`bg-blue-900 ml-2 px-6 py-2 rounded text-white font-semibold transition-all ease-in-out duration-300 transform ${submitting ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
              }`}
            disabled={submitting}
          >
            {submitting ? (
              <span className="flex justify-center items-center space-x-2">
                <PuffLoader size={20} color="#fff" />
                <span>Saving...</span>
              </span>
            ) : (
              "Save"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddUser;
