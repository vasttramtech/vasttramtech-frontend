import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { BounceLoader } from "react-spinners";
import SmartTable from "../../smartTable/SmartTable";
import { toast } from "react-toastify";

const AccessControl = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { token, designation } = useSelector((state) => state.auth);
  const { userList, load, error } = useSelector((state) => state.fetchData);
  //   console.log(token)

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    if (designation !== "Admin") {
      navigate("/");
      return;
    }

    // Fetch user data
    // fetchUsers();
    if (error || !userList || !Array.isArray(userList)) {
      toast.error(error?.response?.data?.error?.message || "Failed to fetch");
      return;
    }
    const formattedData = userList.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      designation: user.designation,
      actions: renderActionButtons(user.id),
    }));

    setUsers(formattedData);
  }, [token, designation, navigate, userList, load, error]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/custom/users`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Format data for SmartTable
      const formattedData = response.data.map((user) => ({
        id: user.id, // Hidden column
        name: user.name,
        email: user.email,
        designation: user.designation,
        actions: renderActionButtons(user.id),
      }));

      setUsers(formattedData);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error(error?.response?.data?.error?.message || "Failed to fetch");
    } finally {
      setLoading(false);
    }
  };

  const renderActionButtons = (userId) => {
    return (
      <div className="flex justify-center space-x-4">
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/access-control/user/view/${userId}`);
          }}
          className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition"
        >
          View
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/access-control/user/edit/${userId}`);
          }}
          className="px-3 py-1 bg-blue-800 text-white text-sm rounded hover:bg-blue-900 transition"
        >
          Edit
        </button>
      </div>
    );
  };

  const handleRowClick = (item) => {
    navigate(`/access-control/user/view/${item.id}`);
  };

  // Table headers (first column is hidden)
  const headers = ["ID", "Name", "Email", "Designation", "Actions"];

  return (
    <div className="relative p-6 bg-white rounded-lg shadow-md">
      {loading || load ? (
        <div className="absolute inset-0 flex justify-center items-center mt-64 bg-opacity-50 bg-gray-200 z-10">
          <BounceLoader size={100} color={"#1e3a8a"} />
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-blue-900">
              User Management
            </h1>
            <button
              onClick={() => navigate("/access-control/add-user")}
              className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition flex items-center"
            >
              <span className="mr-2">+</span>
              Add User
            </button>
          </div>

          <SmartTable
            headers={headers}
            data={users}
            onRowClick={handleRowClick}
          />
        </>
      )}
    </div>
  );
};

export default AccessControl;
