import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { BounceLoader } from "react-spinners";
import { FaArrowLeft, FaUserEdit } from "react-icons/fa";
import { fetchUserList } from "../../state/fetchDataSlice";

const UpdateUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, designation } = useSelector((state) => state.auth);

  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    designation: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    // Check if user is logged in
    if (!token) {
      toast.error("Please login to continue");
      navigate("/login");
      return;
    }

    // Check if user is admin
    if (designation !== "Admin") {
      toast.error("Only Admin users can access this page");
      navigate("/");
      return;
    }

    fetchUserData();
  }, [token, designation, id, navigate]);

  const fetchUserData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/custom/user-by-id/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        setUserData(response.data);
        setFormData({
          name: response.data.name || "",
          email: response.data.email || "",
          designation: response.data.designation || "",
          password: "", // Empty password field as we don't want to show/update password by default
        });
      }
    } catch (err) {
      toast.error(
        err.response?.data?.error?.message ||
          "An error occurred while fetching user data"
      );
      navigate("/access-control");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Form validation
    if (!formData.name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }

    if (!formData.email.trim()) {
      toast.error("Email cannot be empty");
      return;
    }

    if (!formData.designation) {
      toast.error("Please select a designation");
      return;
    }

    // If password is provided, check length
    if (formData.password && formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    setIsSubmitting(true);

    // Only include password in the payload if it's not empty
    const updatePayload = {
      name: formData.name,
      email: formData.email,
      designation: formData.designation,
      ...(formData.password ? { password: formData.password } : {}),
    };

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/custom/users/update/${id}`,
        { data: updatePayload },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        await dispatch(fetchUserList(token)).unwrap();
        toast.success("User updated successfully");
      }
    } catch (err) {
      console.log("Error updating user:", err);
      toast.error(
        err.response?.data?.error?.message ||
          "An error occurred while updating the user"
      );
    } finally {
      setIsSubmitting(false);
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
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="flex items-center mb-8">
        <button
          onClick={() => navigate("/access-control")}
          className="flex items-center text-blue-700 hover:text-blue-900 font-medium"
        >
          <FaArrowLeft className="mr-2" /> Back
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-blue-100">
        <div className="bg-blue-700 text-white p-6 flex items-center">
          <FaUserEdit className="text-2xl mr-3" />
          <h1 className="text-2xl font-bold">Edit User</h1>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-1 md:col-span-2">
                <label
                  className="block text-gray-700 text-sm font-medium mb-2"
                  htmlFor="name"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter full name"
                  required
                />
              </div>

              <div className="col-span-1 md:col-span-2">
                <label
                  className="block text-gray-700 text-sm font-medium mb-2"
                  htmlFor="email"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter email address"
                  required
                />
              </div>

              <div>
                <label
                  className="block text-gray-700 text-sm font-medium mb-2"
                  htmlFor="designation"
                >
                  Designation
                </label>
                <select
                  id="designation"
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Designation</option>
                  <option value="Admin">Admin</option>
                  <option value="Supervisor">Supervisor</option>
                  <option value="Executive">Executive</option>
                </select>
              </div>

              <div>
                <label
                  className="block text-gray-700 text-sm font-medium mb-2"
                  htmlFor="password"
                >
                  Password{" "}
                  <span className="text-gray-500 text-xs">
                    (Leave empty to keep current password)
                  </span>
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter new password (min 6 characters)"
                />
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                type="button"
                onClick={() => navigate(`/access-control/user/${id}`)}
                className="mr-4 px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 font-medium transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-800 font-medium transition-colors duration-200 flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <BounceLoader
                      size={20}
                      color={"#ffffff"}
                      className="mr-2"
                    />
                    <span>Updating...</span>
                  </>
                ) : (
                  "Update User"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateUser;
