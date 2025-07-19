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
    <div className="flex justify-between items-center px-6 py-3 bg-white shadow-sm rounded-b-lg">
      {/* Left - Brand */}
      <h2 className="text-3xl font-bold text-blue-500 font-serif tracking-wide">
        Vasttram
      </h2>

      {/* Right - User Section */}
      <div className="flex items-center gap-5">
        <div className="flex flex-col items-end text-right leading-tight">
          <span className="text-sm font-medium text-gray-800">Hi, {name}</span>
          <span className="text-xs text-gray-500">{designation}</span>
        </div>

        {/* Profile Icon */}
        <img
          src={User}
          alt="Profile"
          className="w-9 h-9 rounded-full border border-gray-300 shadow-sm object-cover cursor-pointer transition hover:scale-105"
        />

        {/* Logout Icon */}
        <img
          src={Logout}
          alt="Logout"
          title="Logout"
          onClick={handleLogout}
          className="w-5 h-5 opacity-80 hover:opacity-100 transition cursor-pointer"
        />
      </div>
    </div>

  );
};

export default Navbar;
