// import LoginImage from "../assets/Others/LoginImage.jpg";
// import LoginImage1 from "../assets/Others/LoginImage1.jpg";
// import LoginImage2 from "../assets/Others/LoginImage2.png";

// const Login = () => {
//     return (
//         <div className="flex justify-center items-center h-screen bg-blue-900">
//             {/* Inner White Box */}
//             <div className="w-[75%] h-[85%] bg-white flex shadow-2xl rounded-xl overflow-hidden">

//                 {/* Left Side - Form */}
//                 <div className="w-1/2 flex flex-col justify-center px-16">
//                     {/* Title */}
//                     <h2 className="text-5xl font-extrabold text-blue-500 mb-8">
//                         Vasttram
//                     </h2>

//                     {/* Form */}
//                     <form className="w-full">
//                         <div className="mb-5">
//                             <label className="block text-gray-700 font-semibold mb-1">
//                                 Email
//                             </label>
//                             <input
//                                 type="email"
//                                 className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
//                                 placeholder="Enter your email"
//                             />
//                         </div>

//                         <div className="mb-5">
//                             <label className="block text-gray-700 font-semibold mb-1">
//                                 Password
//                             </label>
//                             <input
//                                 type="password"
//                                 className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
//                                 placeholder="Enter your password"
//                             />
//                         </div>

//                         {/* Forgot Password */}
//                         <div className="mb-6 text-right">
//                             <a href="#" className="text-blue-500 text-sm font-medium hover:underline">
//                                 Forgot Password?
//                             </a>
//                         </div>

//                         {/* Sign In Button */}
//                         <button className="w-full bg-blue-600 text-white py-3 rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300">
//                             Sign In
//                         </button>
//                     </form>
//                 </div>

//                 {/* Right Side - Image */}
//                 <div className="w-1/2 flex justify-center items-center overflow-hidden">
//                     <img
//                         src={LoginImage1}
//                         alt="Login Illustration"
//                         className="w-full h-full object-conatin"
//                     />
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Login;

import { useEffect, useState } from "react";
import LoginImage from "../assets/Others/LoginImage.jpg";
import LoginImage1 from "../assets/Others/LoginImage1.jpg";
import LoginImage2 from "../assets/Others/LoginImage2.png";
import { BACKEND_API } from "../assets/Constant";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../state/authSlice";
import { fetchJobberMasters } from "../state/jobberMastersSlice";
import {
  fetchColor,
  fetchCustomers,
  fetchDesignGroups,
} from "../state/fetchDataSlice";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const { email, authenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (authenticated) {
      navigate("/", { replace: true });
    }
  }, [authenticated, navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const values = {
        identifier: formData.email,
        password: formData.password,
      };
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/auth/local`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(values),
        }
      );

      const data = await response.json();
      if (data?.error || !data?.jwt || !data?.user) {
        setError(data.error.message || "Failed to login");
        setTimeout(() => setError(null), 3000);
        return;
      } else {
        const jwt = data.jwt;
        localStorage.setItem("token", jwt);
        dispatch(login({ email: data.user.email, token: data.jwt }));
        dispatch(fetchJobberMasters(`${jwt}`));
      }
    } catch (error) {
      console.error(error);
      setError(error?.message ?? "Something went wrong!");
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-blue-900">
      {/* Inner White Box */}
      <div className="w-[55%] h-[79.51%] bg-white flex shadow-2xl rounded-xl overflow-hidden">
        {/* Left Side - Form */}
        <div className="w-1/2 flex flex-col justify-center px-16">
          <h2 className="text-5xl font-extrabold text-blue-500 mb-8">
            Vasttram
          </h2>
          {error && <p className="text-red-700 text-xl">{error}</p>}
          {/* Form */}
          <form className="w-full" onSubmit={handleSubmit}>
            <div className="mb-5">
              <label className="block text-gray-700 font-semibold mb-1">
                Email
              </label>
              <input
                type="email"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter your email"
                value={formData.email}
                name="email"
                onChange={handleChange}
              />
            </div>

            <div className="mb-5">
              <label className="block text-gray-700 font-semibold mb-1">
                Password
              </label>
              <input
                type="password"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter your password"
                value={formData.password}
                name="password"
                onChange={handleChange}
              />
            </div>

            {/* Forgot Password */}
            <div className="mb-6 text-right">
              <a
                href="#"
                className="text-blue-500 text-sm font-medium hover:underline"
              >
                Forgot Password?
              </a>
            </div>

            {/* Sign In Button */}
            <button
              className="w-full bg-blue-600 text-white py-3 rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Sign In"}
            </button>
          </form>
        </div>

        {/* Right Side - Image */}
        <div className="w-1/2 h-full flex justify-center items-center bg-black">
          <img
            src={LoginImage1}
            alt="Login Illustration"
            className="w-auto h-full object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
