import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const Layout = () => {
  return (
    <div className="flex h-screen overflow-hidden w-full">
      {/* Sidebar */}

      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 w-3/4 ml-64 overflow-y-auto p-4">
        <Navbar />
        <div className="mt-2">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
