// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// // Import your icons as before
// import Home from "../assets/sidebar-images/Home.png";
// import File from "../assets/sidebar-images/File.png";
// import Profile from "../assets/sidebar-images/Profile.png";
// import Money from "../assets/sidebar-images/Money.png";
// import Bargraph from "../assets/sidebar-images/Bargraph.png";
// import File2 from "../assets/sidebar-images/File2.png";
// import stitching from "../assets/sidebar-images/stitching.webp";
// import Stitch from "../assets/sidebar-images/Stitch.png";
// import Notification from "../assets/sidebar-images/Notification.png";
// import stitchingIcon from "../assets/sidebar-images/stitchingIcon.png";
// import Other from "../assets/sidebar-images/application (1).png";
// import Stocks from "../assets/sidebar-images/Stocks.png";
// // Import hamburger and close icons from react-icons
// import { IoMenu, IoClose } from "react-icons/io5";
// import { useSelector } from "react-redux";
// import Reports from "../assets/sidebar-images/Reports.png";
// import dispatch from "../assets/sidebar-images/dispatch.png"
// import { useLocation } from "react-router-dom";

// import { IoChevronDown, IoChevronUp } from "react-icons/io5";

// const Sidebar = () => {
//   const navigate = useNavigate();
//   const [hoveredIndex, setHoveredIndex] = useState(null);
//   const [isOpen, setIsOpen] = useState(false); // For mobile toggle
//   const { designation } = useSelector((state) => state.auth);
//   const location = useLocation();
//   const currentPath = location.pathname;
//   const [activeIndex, setActiveIndex] = useState(null);

//   // Sidebar Icons & Corresponding Options
//   const sidebarItems = [
//     {
//       icon: Home,
//       options: [
//         { label: "Home", isModule: true },
//         {
//           label: "Dashboard",
//           path: "/",
//         },
//         designation === "Admin" && {
//           label: "Access Control",
//           path: "/access-control",
//         },
//       ],
//     },
//     {
//       icon: File,
//       options: [
//         { label: "Master", isModule: true },
//         { label: "Jobber Master", path: "/jobber-master" },
//         { label: "Stitcher Master", path: "/stitcher-master" },
//         { label: "Design Master", path: "/design-master" },
//         {
//           label: "Semi Finished Goods Master",
//           path: "/semi-finished-goods-master",
//         },
//         { label: "Customer Master", path: "/customer-master" },
//         { label: "Raw Material Master", path: "/raw-material-master" },
//         { label: "Color Master", path: "/color-master" },
//       ],
//     },
//     {
//       icon: Profile,
//       options: [
//         { label: "Purchase Master", isModule: true },
//         { label: "Supplier Master", path: "/supplier-master" },
//         { label: "Purchase Order", path: "/supplier-purchase-order" },
//         { label: "Purchase Order List", path: "/purchase-order-list" },
//         { label: "Stock In", path: "/stock-in" },
//         { label: "Stock In Report", path: "/stock-in-report" },
//       ],
//     },
//     {
//       icon: Money,
//       options: [
//         { label: "Design Entry", isModule: true },
//         // { label: "Designer Entry Page", path: "/design-entry" },
//         // { label: "Designer Entry Reports", path: "/design-entry-report" },
//         // {
//         //   label: "Complete Designs Reports",
//         //   path: "/complete-designs-reports",
//         // },
//         { label: "Complete Design Reports", path: "/kanban" },
//       ],
//     },
//     {
//       icon: Stocks,
//       options: [
//         { label: "Stocks", isModule: true },
//         { label: "Raw Material Stock", path: "/raw-material-stock" },
//         { label: "Semi Finished Stock", path: "/sfg-stock-report" },
//         { label: "Semi Finished Stock Entry", path: "/sfg-stock" },
//         { label: "All SFG Stock Entry", path: "/all-stock-entry" },
//       ],
//     },
//     {
//       icon: Notification,
//       options: [
//         { label: "Alerts", isModule: true },
//         { label: "Task Management", path: "/tasks" },
//         // { label: "Messages", path: "/messages" },
//         { label: "Reminders", path: "/reminders" },
//       ],
//     },
//     {
//       icon: Bargraph,
//       options: [
//         { label: "Sales-order", isModule: true },
//         { label: "Sales Order Entry", path: "/sales-order-entry" },
//         // { label: "Internal Sales order entry", path: "/internal-sales-order" },
//         { label: "Sales Order Report", path: "/sales-order-report" },
//         // {
//         //   label: "Sales Order Status Report",
//         //   path: "/sales-order-status-report",
//         // },
//       ],
//     },
//     {
//       icon: File2,
//       options: [
//         { label: "Sale-purchase-Transfer", isModule: true },
//         {
//           label: "Bill of Sales",
//           path: "/bill-of-sales",
//         },
//         {
//           label: "Bills of Sale Report",
//           path: "/bills-of-sale-report",
//         },
//         {
//           label: "Bill Of Purchase",
//           path: "/bill-of-purchase",
//         },
//         {
//           label: "Bill Of Purchase Report",
//           path: "/bill-of-purchase-report",
//         },
//         // {
//         //   label: "Ready To Stitch",
//         //   path: "/ready-to-stitch",
//         // },
//       ],
//     },
//     {
//       icon: stitchingIcon,
//       options: [
//         { label: "Stitching", isModule: true },
//         { label: "Stitching Entry", path: "/stitching-entry" },
//         { label: "Stitching Entry Reports", path: "/stitching-entry-reports" },
//         { label: "Stitching Receive Entry", path: "/stitching-receive" },
//         {
//           label: "Stitching Receive Entry Reports",
//           path: "/stitching-receive-reports",
//         },
//         // { label: "Dispatch Entry Reports", path: "/dispatch-entry-reports" },
//       ],
//     },
//     {
//       icon: dispatch,
//       options: [
//         { label: "Dispatch", isModule: true },
//         { label: "Dispatch Entry", path: "/dispatch-entry" },
//         { label: "Dispatch Reports", path: "/dispatch-reports" },
//         // { label: "Dispatch Entry Reports", path: "/dispatch-entry-reports" },
//       ],
//     },
//     {
//       icon: Reports,
//       options: [
//         { label: "Reports", isModule: true },
//         { label: "Stitch Report", path: "/stitch-report" },
//         { label: "Stitch Clear Report", path: "/stitch-clear-report" },
//         { label: "Dispatch Report", path: "/dispatch-reports" },
//         { label: "Sale Bill Report", path: "/sale-bill-report" },
//         { label: "Purchase Bill Report", path: "/purchase-bill-report" },
//         { label: "SO Return Report", path: "/so-return-report" },
//         {
//           label: "Dyer Wise Sale Purchase Reports",
//           path: "/dyer-wise-sale-purchase-report",
//         },
//       ],
//     },
//     // {
//     //   icon: Other,
//     //   options: [
//     //     { label: "Others", isModule: true },
//     //     {
//     //       label: "Stock Transfer",
//     //       path: "/stock-transfer",
//     //     },
//     //     {
//     //       label: "Stitch Status",
//     //       path: "/stitch-status",
//     //     },
//     //     {
//     //       label: "Dispatch Entry",
//     //       path: "/dispatch-entry",
//     //     },
//     //     {
//     //       label: "Dye follow up",
//     //       path: "/dye-follow-up",
//     //     },
//     //     {
//     //       label: "Bill Of Sale SFG",
//     //       path: "/bill-of-sale-sfg",
//     //     },
//     //     {
//     //       label: "Sales Release",
//     //       path: "/sales-release",
//     //     },
//     //     {
//     //       label: "Sales Return",
//     //       path: "/sales-return",
//     //     },
//     //   ],
//     // },
//   ];
//   // const navigate = useNavigate();

//   useEffect(() => {
//     const currentSectionIndex = transformedSections.findIndex((section, index) => {
//       if (section.type === "accordion") {
//         return section.children.some((child) => child.path === currentPath);
//       }
//       return false;
//     });

//     if (currentSectionIndex !== -1 && currentSectionIndex !== activeIndex) {
//       setActiveIndex(currentSectionIndex);
//     }
//   }, [currentPath]);

//   const toggleAccordion = (index) => {
//     setActiveIndex((prev) => (prev === index ? null : index));
//   };

//   // Step 1: Transform the data
//   const transformedSections = sidebarItems.flatMap((section) => {
//     const { icon, options } = section;

//     const cleanedOptions = options.filter(Boolean); // Remove falsy entries like false && {}

//     const groups = [];
//     let currentGroup = null;

//     for (let opt of cleanedOptions) {
//       if (opt.isModule) {
//         if (currentGroup) groups.push(currentGroup);
//         currentGroup = { type: "accordion", icon, label: opt.label, children: [] };
//       } else if (currentGroup) {
//         currentGroup.children.push(opt);
//       } else {
//         // Flat option (no module)
//         groups.push({
//           type: "flat",
//           icon,
//           label: opt.label,
//           path: opt.path,
//         });
//       }
//     }

//     if (currentGroup) groups.push(currentGroup);

//     return groups;
//   });

//   // return (
//   //   <>
//   //     {/* Mobile Hamburger Button */}
//   //     <div className="md:hidden w-1/4 fixed top-4 left-4 z-50">
//   //       <button onClick={() => setIsOpen(true)} className="text-white">
//   //         <IoMenu size={30} />
//   //       </button>
//   //     </div>

//   //     <div
//   //       className={`fixed top-0 left-0 h-full w-64 bg-blue-900 text-white flex flex-col rounded-r-3xl shadow-lg z-50 transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"
//   //         } md:translate-x-0`}
//   //     >
//   //       {/* Close button for mobile */}
//   //       <div className="md:hidden absolute top-4 right-4">
//   //         <button onClick={() => setIsOpen(false)} className="text-white">
//   //           <IoClose size={30} />
//   //         </button>
//   //       </div>

//   //       {/* Navigation Items */}
//   //       <nav className="flex flex-col mt-4 space-y-2 px-4">
//   //         {transformedSections.map((item, index) => {
//   //           if (item.type === "flat") {
//   //             return (
//   //               <div
//   //                 key={index}
//   //                 className="flex items-center space-x-3 p-2 rounded-lg cursor-pointer hover:bg-blue-800"
//   //                 onClick={() => {
//   //                   navigate(item.path, { state: { title: item.label } });
//   //                   setIsOpen(false);
//   //                 }}
//   //               >
//   //                 <img src={item.icon} className="w-5" />
//   //                 <span className="text-sm font-semibold">{item.label}</span>
//   //               </div>
//   //             );
//   //           }

//   //           // Accordion item
//   //           return (
//   //             <div key={index}>
//   //               <div
//   //                 className="flex items-center justify-between p-2 rounded-lg cursor-pointer hover:bg-blue-800 mt-1"
//   //                 onClick={() => toggleAccordion(index)}
//   //               >
//   //                 <div className="flex items-center space-x-3">
//   //                   <img src={item.icon} className="w-5" />
//   //                   <span className="text-sm font-semibold">{item.label}</span>
//   //                 </div>
//   //                 {activeIndex === index ? (
//   //                   <IoChevronUp className="text-xl" />
//   //                 ) : (
//   //                   <IoChevronDown className="text-xl" />
//   //                 )}
//   //               </div>

//   //               {activeIndex === index && (
//   //                 <div className="ml-9 mt-1 space-y-1">
//   //                   {item.children.map((option, i) => (
//   //                     <div
//   //                       key={i}
//   //                       className="text-sm px-2 py-1 rounded hover:bg-blue-800 cursor-pointer"
//   //                       onClick={() => {
//   //                         navigate(option.path, {
//   //                           state: { title: option.label },
//   //                         });
//   //                         setIsOpen(false);
//   //                         setActiveIndex(null);
//   //                       }}
//   //                     >
//   //                       {option.label}
//   //                     </div>
//   //                   ))}
//   //                 </div>
//   //               )}
//   //             </div>
//   //           );
//   //         })}
//   //       </nav>
//   //     </div>
//   //   </>
//   // );

//   return (
//     <>
//       {/* Mobile Hamburger Button */}
//       <div className="md:hidden w-1/4 fixed top-4 left-4 z-50">
//         <button onClick={() => setIsOpen(true)} className="text-white">
//           <IoMenu size={30} />
//         </button>
//       </div>

//       <div
//         className={`fixed top-0 left-0 h-screen w-64 bg-blue-900 text-white flex flex-col rounded-r-3xl shadow-lg z-50 transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"
//           } md:translate-x-0`}
//       >
//         {/* Close button for mobile */}
//         <div className="md:hidden absolute top-4 right-4">
//           <button onClick={() => setIsOpen(false)} className="text-white">
//             <IoClose size={30} />
//           </button>
//         </div>

//         {/* Scrollable Navigation */}
//         <nav className="flex flex-col mt-4 space-y-2 px-4 overflow-y-auto h-full pb-10">
//           {transformedSections.map((item, index) => {
//             if (item.type === "flat") {
//               const isActive = currentPath === item.path;
//               return (
//                 <div
//                   key={index}
//                   className={`flex items-center space-x-3 p-2 rounded-lg cursor-pointer hover:bg-blue-800 ${isActive ? "bg-red-600 font-bold" : ""
//                     }`}
//                   onClick={() => {
//                     navigate(item.path, { state: { title: item.label } });
//                     setIsOpen(false);
//                   }}
//                 >
//                   <img src={item.icon} className="w-5" />
//                   <span className="text-sm">{item.label}</span>
//                 </div>
//               );
//             }

//             // Accordion
//             const isAccordionOpen = activeIndex === index;
//             return (
//               <div key={index}>
//                 <div
//                   className="flex items-center justify-between p-2 rounded-lg cursor-pointer hover:bg-blue-800 mt-1"
//                   // onClick={() => toggleAccordion(index)}
//                   onClick={() => setActiveIndex(index)}
//                 >
//                   <div className="flex items-center space-x-3">
//                     <img src={item.icon} className="w-5" />
//                     <span className="text-sm font-semibold">{item.label}</span>
//                   </div>
//                   {isAccordionOpen ? (
//                     <IoChevronUp className="text-xl" />
//                   ) : (
//                     <IoChevronDown className="text-xl" />
//                   )}
//                 </div>

//                 {isAccordionOpen && (
//                   <div className="ml-9 mt-1 space-y-1">
//                     {item.children.map((option, i) => {
//                       const isActive = currentPath === option.path;
//                       return (
//                         <div
//                           key={i}
//                           className={`text-sm px-2 py-1 rounded cursor-pointer hover:bg-blue-800 ${isActive ? "bg-red-600 font-bold" : ""
//                             }`}
//                           onClick={() => {
//                             navigate(option.path, {
//                               state: { title: option.label },
//                             });
//                             setIsOpen(false);
//                             setActiveIndex(null);
//                           }}
//                         >
//                           {option.label}
//                         </div>
//                       );
//                     })}
//                   </div>
//                 )}
//               </div>
//             );
//           })}
//         </nav>
//       </div>
//     </>
//   );

// };

// export default Sidebar;



import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { IoMenu, IoClose, IoChevronDown, IoChevronUp } from "react-icons/io5";

// Sidebar icons
import Home from "../assets/sidebar-images/Home.png";
import File from "../assets/sidebar-images/File.png";
import Profile from "../assets/sidebar-images/Profile.png";
import Money from "../assets/sidebar-images/Money.png";
import Bargraph from "../assets/sidebar-images/Bargraph.png";
import File2 from "../assets/sidebar-images/File2.png";
import stitchingIcon from "../assets/sidebar-images/stitchingIcon.png";
import Notification from "../assets/sidebar-images/Notification.png";
import Stocks from "../assets/sidebar-images/Stocks.png";
import Reports from "../assets/sidebar-images/Reports.png";
import dispatch from "../assets/sidebar-images/dispatch.png";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const { designation } = useSelector((state) => state.auth);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);

  const sidebarItems = [
    {
      icon: Home,
      options: [
        { label: "Home", isModule: true },
        { label: "Dashboard", path: "/" },
        designation === "Admin" && { label: "Access Control", path: "/access-control" },
      ],
    },
    {
      icon: File,
      options: [
        { label: "Master", isModule: true },
        { label: "Jobber Master", path: "/jobber-master" },
        { label: "Stitcher Master", path: "/stitcher-master" },
        { label: "Design Master", path: "/design-master" },
        { label: "Semi Finished Goods Master", path: "/semi-finished-goods-master" },
        { label: "Customer Master", path: "/customer-master" },
        { label: "Raw Material Master", path: "/raw-material-master" },
        { label: "Color Master", path: "/color-master" },
      ],
    },
    {
      icon: Profile,
      options: [
        { label: "Purchase Master", isModule: true },
        { label: "Supplier Master", path: "/supplier-master" },
        { label: "Purchase Order", path: "/supplier-purchase-order" },
        { label: "Purchase Order List", path: "/purchase-order-list" },
        { label: "Stock In", path: "/stock-in" },
        { label: "Stock In Report", path: "/stock-in-report" },
      ],
    },
    {
      icon: Money,
      options: [
        { label: "Design Entry", isModule: true },
        { label: "Complete Design Reports", path: "/kanban" },
      ],
    },
    {
      icon: Stocks,
      options: [
        { label: "Stocks", isModule: true },
        { label: "Raw Material Stock", path: "/raw-material-stock" },
        { label: "Semi Finished Stock", path: "/sfg-stock-report" },
        { label: "Semi Finished Stock Entry", path: "/sfg-stock" },
        { label: "All SFG Stock Entry", path: "/all-stock-entry" },
      ],
    },
    {
      icon: Notification,
      options: [
        { label: "Alerts", isModule: true },
        { label: "Task Management", path: "/tasks" },
        // { label: "Reminders", path: "/reminders" },
      ],
    },
    {
      icon: Bargraph,
      options: [
        { label: "Sales-order", isModule: true },
        { label: "Sales Order Entry", path: "/sales-order-entry" },
        { label: "Sales Order Report", path: "/sales-order-report" },
        { label: "Sales Return Entry", path: "/sales-return-entry" },
        { label: "Sales Return Reports", path: "/sales-return-reports" },
      ],
    },
    {
      icon: File2,
      options: [
        { label: "Sale-purchase-Transfer", isModule: true },
        { label: "Bill of Sales", path: "/bill-of-sales" },
        { label: "Bills of Sale Report", path: "/bills-of-sale-report" },
        { label: "Bill Of Purchase", path: "/bill-of-purchase" },
        { label: "Bill Of Purchase Report", path: "/bill-of-purchase-report" },
      ],
    },
    {
      icon: stitchingIcon,
      options: [
        { label: "Stitching", isModule: true },
        { label: "Stitching Entry", path: "/stitching-entry" },
        { label: "Stitching Entry Reports", path: "/stitching-entry-reports" },
        { label: "Stitching Receive Entry", path: "/stitching-receive" },
        { label: "Stitching Receive Entry Reports", path: "/stitching-receive-reports" },
      ],
    },
    {
      icon: dispatch,
      options: [
        { label: "Dispatch", isModule: true },
        { label: "Dispatch Entry", path: "/dispatch-entry" },
        { label: "Dispatch Reports", path: "/dispatch-reports" },
      ],
    },
    {
      icon: Reports,
      options: [
        { label: "Reports", isModule: true },
        { label: "Stitch Report", path: "/stitch-report" },
        { label: "Stitch Clear Report", path: "/stitch-clear-report" },
        { label: "Dispatch Report", path: "/dispatched-reports" },
        { label: "Sale Bill Report", path: "/sale-bill-report" },
        { label: "Purchase Bill Report", path: "/purchase-bill-report" },
        { label: "SO Return Report", path: "/so-return-report" },
        { label: "Dyer Wise Sale Purchase Reports", path: "/dyer-wise-sale-purchase-report" },
      ],
    },
  ];

  const transformedSections = sidebarItems.flatMap((section) => {
    const { icon, options } = section;
    const cleanedOptions = options.filter(Boolean);
    const groups = [];
    let currentGroup = null;

    for (let opt of cleanedOptions) {
      if (opt.isModule) {
        if (currentGroup) groups.push(currentGroup);
        currentGroup = { type: "accordion", icon, label: opt.label, children: [] };
      } else if (currentGroup) {
        currentGroup.children.push(opt);
      } else {
        groups.push({ type: "flat", icon, label: opt.label, path: opt.path });
      }
    }

    if (currentGroup) groups.push(currentGroup);
    return groups;
  });

  useEffect(() => {
    const currentSectionIndex = transformedSections.findIndex((section) => {
      if (section.type === "accordion") {
        return section.children.some((child) => child.path === currentPath);
      }
      return false;
    });

    if (currentSectionIndex !== -1 && currentSectionIndex !== activeIndex) {
      setActiveIndex(currentSectionIndex);
    }
  }, [currentPath]);

  return (
    <>
      <style>{`
    .scrollbar-hide::-webkit-scrollbar {
      display: none;
    }
    .scrollbar-hide {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
  `}</style>

      {/* Mobile Toggle Button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button onClick={() => setIsOpen(true)} className="text-blue-900 bg-white p-2 rounded-md shadow-md">
          <IoMenu size={26} />
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-blue-900 text-white flex flex-col shadow-xl z-40 transition-transform duration-300 ease-in-out rounded-r-3xl 
      ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {/* Close button for mobile */}
        <div className="md:hidden absolute top-4 right-4">
          <button onClick={() => setIsOpen(false)} className="text-white">
            <IoClose size={26} />
          </button>
        </div>

        {/* Sidebar Content */}
        <nav className="flex flex-col mt-16 space-y-3 px-4 overflow-y-auto scrollbar-hide pb-10">
          {transformedSections.map((item, index) => {
            if (item.type === "flat") {
              const isActive = currentPath === item.path;
              return (
                <div
                  key={index}
                  className={`flex items-center space-x-3 p-2 rounded-lg cursor-pointer transition hover:bg-blue-800 
              ${isActive ? "bg-indigo-500 font-semibold" : ""}`}
                  onClick={() => {
                    navigate(item.path, { state: { title: item.label } });
                    setIsOpen(false);
                  }}
                >
                  <img src={item.icon} className="w-5" />
                  <span className="text-sm">{item.label}</span>
                </div>
              );
            }

            const isAccordionOpen = activeIndex === index;
            return (
              <div key={index}>
                {/* Accordion Header */}
                <div
                  className="flex items-center justify-between p-2 rounded-lg cursor-pointer hover:bg-blue-800"
                  onClick={() => setActiveIndex((prev) => (prev === index ? null : index))}
                >
                  <div className="flex items-center space-x-3">
                    <img src={item.icon} className="w-5" />
                    <span className="text-sm font-semibold">{item.label}</span>
                  </div>
                  {isAccordionOpen ? <IoChevronUp className="text-lg" /> : <IoChevronDown className="text-lg" />}
                </div>

                {/* Accordion Children */}
                {/* {isAccordionOpen && (
                  <div className="ml-9 mt-1 space-y-1">
                    {item.children.map((option, i) => {
                      const isActive = currentPath === option.path;
                      return (
                        <div
                          key={i}
                          className={`text-sm px-3 py-1 rounded cursor-pointer transition hover:bg-blue-800 
                      ${isActive ? "bg-blue-700 font-semibold" : ""}`}
                          onClick={() => {
                            navigate(option.path, { state: { title: option.label } });
                            setIsOpen(false);
                          }}
                        >
                          {option.label}
                        </div>
                      );
                    })}
                  </div>
                )} */}
                {/* Accordion Children */}
                <div
                  className={`
    ml-9 mt-1 space-y-1
    overflow-hidden transition-all duration-300
    ${isAccordionOpen ? "max-h-64 opacity-100 visible" : "max-h-0 opacity-0 invisible"}
  `}
                >
                  {item.children.map((option, i) => {
                    const isActive = currentPath === option.path;
                    return (
                      <div
                        key={i}
                        className={`text-sm px-3 py-1 rounded cursor-pointer transition hover:bg-blue-800 
        ${isActive ? "bg-blue-700 font-semibold" : ""}`}
                        onClick={() => {
                          navigate(option.path, { state: { title: option.label } });
                          setIsOpen(false);
                        }}
                      >
                        {option.label}
                      </div>
                    );
                  })}
                </div>

              </div>
            );
          })}
        </nav>
      </aside>
    </>

  );
};

export default Sidebar;

