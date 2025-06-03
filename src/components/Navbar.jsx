import { useNavigate } from "react-router-dom";
import Logout from "../assets/Others/Logout.png";
import Navimage from "../assets/Others/NavImage.png";
import User from "../assets/Others/user.png"
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../state/authSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, email, designation, id, name } = useSelector((state) => state.auth);

  const handleLogout = () => {
    // Remove JWT token from localStorage
    localStorage.removeItem("token");

    // Dispatch logout action to clear Redux store
    dispatch(logout());

    // Redirect user to login page
    navigate("/login");
  };

  return (
    <div className="flex justify-between items-center px-0 py-0 space-x-6 rounded-b-lg">
      {/* Left Side - Vasttram Title */}
      <h2 className="text-5xl font-extrabold text-blue-500 mb-0 font-serif tracking-wide">Vasttram</h2>

      {/* Right Side - Account Options */}
      <div className="flex items-center space-x-6 pr-4">
        <div className="flex flex-col items-start space-y-1 cursor-pointer transition hover:text-blue-600">
          <p className="text-base font-medium text-gray-800">Hi, {name}</p>
          <p className="text-xs text-gray-500 self-center">{designation}</p>
        </div>

        <img
          src={User}
          className="w-8 h-8 object-cover rounded-full border-2 border-gray-300 shadow-sm cursor-pointer"
          alt="Profile"
        />
        {/* Logout Button */}
        <img
          src={Logout}
          className="w-5 opacity-90 hover:opacity-100 transition cursor-pointer"
          alt="Logout"
          onClick={handleLogout}
        />
      </div>
    </div>
  );
};

export default Navbar;
