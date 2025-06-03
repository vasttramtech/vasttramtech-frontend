import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { BounceLoader } from "react-spinners";
import { FaArrowLeft, FaUserCircle } from "react-icons/fa";
import { fetchUserList } from "../../state/fetchDataSlice";

const UserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, designation, email } = useSelector((state) => state.auth);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBlocking, setIsBlocking] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
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
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "An error occurred while fetching user data"
      );
      navigate("/users");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBlockUser = async () => {
    setIsBlocking(true);
    try {
      const isCurrentlyBlocked = userData.blocked;
      const action = isCurrentlyBlocked ? "unblock" : "block";

      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/custom/users/block/${id}/${action}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      await dispatch(fetchUserList(token)).unwrap();
      toast.success(
        `User ${isCurrentlyBlocked ? "unblocked" : "blocked"} successfully`
      );

      // Refresh user data
      fetchUserData();
    } catch (err) {
      toast.error(
        err.response?.data?.error?.message ||
          `An error occurred while ${
            userData.blocked ? "unblocking" : "blocking"
          } the user`
      );
    } finally {
      setIsBlocking(false);
    }
  };

  const handleDeleteUser = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete this user? This action cannot be undone."
      )
    ) {
      setIsDeleting(true);
      try {
        await axios.delete(
          `${process.env.REACT_APP_BACKEND_URL}/api/custom/users/delete/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        await dispatch(fetchUserList(token)).unwrap();

        toast.success("User deleted successfully");
        navigate("/access-control");
      } catch (err) {
        toast.error(
          err.response?.data?.error?.message ||
            "An error occurred while deleting the user"
        );
      } finally {
        setIsDeleting(false);
      }
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
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center mb-8">
        <button
          onClick={() => navigate("/access-control")}
          className="flex items-center text-blue-700 hover:text-blue-900 font-medium"
        >
          <FaArrowLeft className="mr-2" /> Back to Users
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-blue-100">
        <div className="bg-blue-700 text-white p-6">
          <h1 className="text-2xl font-bold">User Details</h1>
        </div>

        <div className="p-6">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/3 flex justify-center mb-6 md:mb-0">
              <div className="text-center">
                <FaUserCircle className="text-blue-700 text-8xl mx-auto" />
                <div className="mt-4 px-4 py-2 bg-blue-100 rounded-full text-blue-800 font-semibold inline-block">
                  {userData?.designation}
                </div>
              </div>
            </div>

            <div className="md:w-2/3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-gray-500 text-sm font-medium">Name</h3>
                  <p className="text-gray-800 font-medium text-lg">
                    {userData?.name}
                  </p>
                </div>
                <div>
                  <h3 className="text-gray-500 text-sm font-medium">Email</h3>
                  <p className="text-gray-800 font-medium text-lg">
                    {userData?.email}
                  </p>
                </div>
                <div>
                  <h3 className="text-gray-500 text-sm font-medium">Status</h3>
                  <p className="font-medium text-lg">
                    {userData?.blocked ? (
                      <span className="text-red-600">Blocked</span>
                    ) : (
                      <span className="text-green-600">Active</span>
                    )}
                  </p>
                </div>
                <div>
                  <h3 className="text-gray-500 text-sm font-medium">Created</h3>
                  <p className="text-gray-800 font-medium">
                    {new Date(userData?.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div>
                  <h3 className="text-gray-500 text-sm font-medium">
                    Last Updated
                  </h3>
                  <p className="text-gray-800 font-medium">
                    {new Date(userData?.updatedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {userData && userData?.email != email && (
            <div className="mt-10 border-t pt-6 flex flex-col sm:flex-row gap-4 justify-end">
              <button
                onClick={handleBlockUser}
                disabled={isBlocking}
                className={`${
                  userData?.blocked
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-yellow-500 hover:bg-yellow-600"
                } text-white font-medium py-2 px-6 rounded-md transition-colors duration-200 flex items-center justify-center min-w-32`}
              >
                {isBlocking ? (
                  <BounceLoader size={24} color={"#ffffff"} />
                ) : userData?.blocked ? (
                  "Unblock User"
                ) : (
                  "Block User"
                )}
              </button>
              <button
                onClick={handleDeleteUser}
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-6 rounded-md transition-colors duration-200 flex items-center justify-center min-w-32"
              >
                {isDeleting ? (
                  <BounceLoader size={24} color={"#ffffff"} />
                ) : (
                  "Delete User"
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
