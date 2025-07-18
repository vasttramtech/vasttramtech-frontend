// import { Outlet } from "react-router-dom";
// import Sidebar from "./Sidebar";
// import Navbar from "./Navbar";

// const Layout = () => {
//   return (
//     <div className="flex h-screen overflow-hidden w-full">
//       {/* Sidebar */}

//       <Sidebar />

//       {/* Main Content */}
//       <div className="flex-1 w-3/4 ml-64 overflow-y-auto p-4">
//         <Navbar />
//         <div className="mt-2">
//           <Outlet />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Layout;


// Layout.jsx
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const Layout = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 ml-0 md:ml-64 flex flex-col overflow-hidden">
        {/* Navbar */}
        <header className="sticky top-0 z-40 bg-white shadow-sm">
          <Navbar />
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 bg-gray-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
