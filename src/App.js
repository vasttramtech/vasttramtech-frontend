import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import "./App.css";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Layout from "./components/Layout";
import JobberMaster from "./components/master/JobberMaster";
import DesignMaster from "./components/master/DesignMaster";
import SemiFinishedGoodsMaster from "./components/master/SemiFinishedGoodsMaster";
import CustomerMaster from "./components/master/CustomerMaster";
import RawMaterialMaster from "./components/master/RawMaterialMaster";
import { BACKEND_API } from "./assets/Constant";
import { useDispatch, useSelector } from "react-redux";
import { login } from "./state/authSlice";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "./components/Sidebar";
import {
  ClipLoader,
  BounceLoader,
  HashLoader,
  RingLoader,
  CircleLoader,
  MoonLoader,
  PuffLoader,
} from "react-spinners";
import DesignEntry from "./components/designer/DesignEntry";
import DesignerEntryReports from "./components/designer/DesignerEntryReports";
import CompleteDesignReports from "./components/designer/CompleteDesignReports";
import SupplierMaster from "./components/purchase/SupplierMaster";
import SupplierPurchaseOrder from "./components/purchase/SupplierPurchaseOrder";
import PurchaseOrderList from "./components/purchase/PurchaseOrderList";
import StockIn from "./components/purchase/StockIn";
import { fetchJobberMasters } from "./state/jobberMastersSlice";
import { persistor } from "./state/store";
import Jobber from "./components/master/ViewModel/Jobber";
import Stitcher from "./components/master/ViewModel/Stitcher";
import DesignView from "./components/master/ViewModel/DesignView";
import SemiFinishedGoodsView from "./components/master/ViewModel/SemiFinishGoodsView";
import RawMaterialView from "./components/master/ViewModel/RawMaterialView";
import ColorMaster from "./components/master/ColorMaster";
import ColorView from "./components/master/ViewModel/ColorView";
import CustomerView from "./components/master/ViewModel/CustomerView";
import SalesOrderEntry from "./components/sales-order/SalesOrderEntry";
import Task from "./components/task/Task";
import AddTask from "./components/task/AddTask";
import SalesOrderReport from "./components/sales-order/SalesOrderReport";
import SalesOrderStatusReport from "./components/sales-order/SalesOrderStatusReport";
import SupplierView from "./components/purchase/ViewModel/SupplierView";
import DesignEntryView from "./components/designer/DesignEntryView";
import BillOfPurchase from "./components/sale-purchase-transfer/BillOfPurchase";

import BillOfSales from "./components/sale-purchase-transfer/BillOfSales";
import BillOfSalesReport from "./components/sale-purchase-transfer/BillOfSalesReport";
import StockTransferPage from "./components/sale-purchase-transfer/StockTransferPage";
import StitchStatusPage from "./components/sale-purchase-transfer/StitchStatusPage";
import DyeFollowUp from "./components/sale-purchase-transfer/DyeFollowUp";
import BillOfSaleSFG from "./components/sale-purchase-transfer/BillOfSaleSFG";
import SalesReturn from "./components/sale-purchase-transfer/SalesReturn";
import SalesRelease from "./components/sale-purchase-transfer/SalesRelease";
import DispatchEntryPage from "./components/sale-purchase-transfer/DispatchEntryPage";
import PurchaseOrderListView from "./components/purchase/ViewModel/PurchaseOrderListView";

import RawMaterialStock from "./components/Stock/RawMaterialStock";

import {
  fetchColor,
  fetchCustomers,
  fetchDesignGroups,
  fetchDesignMasterGroups,
  fetchDesignMasters,
  fetchRawMaterialGroups,
  fetchSfgmGroups,
  fetchUnits,
  fetchUserList,
} from "./state/fetchDataSlice";
import InternalSalesOrder from "./components/internal-sales-order/InternalSalesOrder";
import IndividualReport from "./components/sales-order/IndividualReport";
import BillOfSaleView from "./components/sale-purchase-transfer/ViewModel/BillOfSaleView";
import BillOfPurchaseReport from "./components/sale-purchase-transfer/BillOfPurchaseReport";
import EditSalesOrderModel from "./components/sales-order/EditModals/EditSalesOrderModel";
import BillOfPurchaseView from "./components/sale-purchase-transfer/ViewModel/BillOfPurchaseView";

import StitcherMaster from "./components/master/StitcherMaster";
import StitchingEntry from "./components/stitcher/StitchingEntry";
import AccessControl from "./components/Access-control/AccessControl";
import AddUser from "./components/Access-control/AddUser";
import UserDetails from "./components/Access-control/UserDetails";
import UpdateUser from "./components/Access-control/UpdateUser";

import SfgStock from "./components/Stock/SfgStock";
import StitchingEntryReports from "./components/stitcher/StitchingEntryReports";
import StitchingEntryView from "./components/stitcher/StitchingEntryView";
import StitchingReceive from "./components/stitcher/StitchingReceive";
import StitchingReceiveEntryReports from "./components/stitcher/StitchingReceiveEntryReports";
import StitchingReceiveEntryView from "./components/stitcher/StitchingReceiveEntryView";
import ReadyToStitch from "./components/sale-purchase-transfer/ReadyToStitch";
import AdditionalSFGRawMaterial from "./components/sales-order/AdditionalSFGRawMaterial";

import StockInReport from "./components/purchase/StockInReport";
import StockInView from "./components/purchase/StockInView";

import { FcPrivacy } from "react-icons/fc";
import SemiFinishedGoodStock from "./components/Stock/SemiFinishedStock";
import SemiFinishedStockReport from "./components/Stock/SemiFinishedStockReport";
import StitchReport from "./components/reports/StitchReport";
import SaleBillReport from "./components/reports/SaleBillReport";
import StitchClearDateWiseReport from "./components/reports/StitchClearDateWiseReport";
import SoReturnReports from "./components/reports/SoReturnReports";
import PurchaseBillDetailsReport from "./components/reports/PurchaseBillDetailsReport";
import DyerWiseSalePurchaseReport from "./components/reports/DyerWiseSalePurchaseReport";
import AllStockEntry from "./components/Stock/AllStockEntry";
import KanbanBoard from "./components/design-entry-task/Kanban";
import BoardsList from "./components/design-entry-task/BoardList";
// import DispatchEntry from "./components/dispatch/DispatchEntry";
import DispatchReport from "./components/dispatch/DispatchReport";
import DispatchEntry from "./components/dispatch/DispatchEntry";
import DispatchEntryReport from "./components/dispatch/DispatchEntryReport";
import SalesReturnForm from "./components/sales-order/SalesReturnForm";
import SalesReturnReports from "./components/sales-order/SalesReturnReports";
import SalesReturnView from "./components/sales-order/SalesReturnView";


function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const jobberMasters = useSelector((state) => state.jobberMasters.data);
  // const [token, setTokeen] = useState(null);
  const token = useSelector((state) => state.auth.token);
  const verifyToken = async (token) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/users/me`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        navigate("/login");
        setIsLoading(false);
        return;
      }

      const userData = await response.json();
      // console.log(userData)
      dispatch(
        login({
          name: userData.name,
          email: userData.email,
          token: token,
          designation: userData?.designation,
          id: userData?.id,
        })
      );

      if (jobberMasters.length === 0) {
        dispatch(fetchJobberMasters(`${token}`));
      }
      if (window.location.pathname === "/login") {
        navigate("/");
      }
    } catch (error) {
      console.error("Error verifying token:", error);
      navigate("/login");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      verifyToken(token); // Verify the token if it exists
    } else {
      setIsLoading(false);
      navigate("/login"); // Redirect to login if no token is found
    }
  }, [navigate, dispatch]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      persistor.purge();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [dispatch]);

  useEffect(() => {
    const fetchDatas = async () => {
      if (!token) return;
      try {
        console.log("Fetching data started...");

        await Promise.all([
          dispatch(fetchDesignGroups(token)).unwrap(),
          dispatch(fetchColor(token)).unwrap(),
          dispatch(fetchCustomers(token)).unwrap(),
          dispatch(fetchDesignMasterGroups(token)).unwrap(),
          dispatch(fetchUnits(token)).unwrap(),
          dispatch(fetchSfgmGroups(token)).unwrap(),
          dispatch(fetchRawMaterialGroups(token)).unwrap(),
          dispatch(fetchUserList(token)).unwrap(),
        ]);

        console.log("All data fetched successfully!");
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchDatas();
  }, [dispatch, token]);

  if (isLoading) {
    return (
      <div className=" flex flex-col justify-center items-center h-screen">
        <div className="  w-[150px] flex items-center justify-center  border-b-blue-900">
          <BounceLoader color="#1e3a8a" />
        </div>
        <h2 className="text-2xl font-semibold animate-pulse text-blue-900">Vasttram</h2>
      </div>
    ); // Show a loading screen or spinner while verifying token
  }

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />

      <Routes>
        <Route path="/login" element={<Login />}></Route>

        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />

          {/* Access Control */}

          <Route path="/access-control" element={<AccessControl />} />
          <Route path="/access-control/add-user" element={<AddUser />} />
          <Route
            path="/access-control/user/view/:id"
            element={<UserDetails />}
          />
          <Route
            path="/access-control/user/edit/:id"
            element={<UpdateUser />}
          />

          <Route path="/dispatch-entry" element={<DispatchEntry />} />
          <Route path="/dispatch-reports" element={<DispatchReport />} />
          <Route path="/dispatch-entry-report/:id" element={<DispatchEntryReport />} />

          {/* Purchase Routes */}

          <Route path="/jobber-master" element={<JobberMaster />} />
          <Route path="/jobber-master/:id" element={<Jobber />} />
          <Route path="/stitcher-master" element={<StitcherMaster />} />
          <Route path="/stitcher-master/:id" element={<Stitcher />} />
          <Route path="/design-master" element={<DesignMaster />} />
          <Route path="/design-master/:id" element={<DesignView />} />
          <Route
            path="/semi-finished-goods-master"
            element={<SemiFinishedGoodsMaster />}
          />
          <Route
            path="/semi-finished-goods-master/:id"
            element={<SemiFinishedGoodsView />}
          />
          <Route path="/customer-master" element={<CustomerMaster />} />
          <Route path="/customer-master/:id" element={<CustomerView />} />
          <Route path="/raw-material-master" element={<RawMaterialMaster />} />
          <Route
            path="/raw-material-master/:id"
            element={<RawMaterialView />}
          />

          <Route path="/color-master" element={<ColorMaster />} />
          <Route path="/color-master/:id" element={<ColorView />} />

          {/* Designer Routes */}

          <Route path="/design-entry" element={<DesignEntry />} />
          <Route
            path="/design-entry-report"
            element={<DesignerEntryReports />}
          />
          <Route
            path="/design-entry-report/:id"
            element={<DesignEntryView />}
          />
          <Route
            path="/complete-designs-reports"
            element={<CompleteDesignReports />}
          />

          {/*Purchase routes */}
          <Route path="/supplier-master" element={<SupplierMaster />} />
          <Route path="/supplier-master/:id" element={<SupplierView />} />
          <Route
            path="/supplier-purchase-order"
            element={<SupplierPurchaseOrder />}
          />
          <Route path="/purchase-order-list" element={<PurchaseOrderList />} />
          <Route
            path="/purchase-order-list/:id"
            element={<PurchaseOrderListView />}
          />
          <Route path="/stock-in" element={<StockIn />} />
          <Route path="/stock-in-report" element={<StockInReport />} />
          <Route path="/stock-in-view/:id" element={<StockInView />} />

          {/* Sales routes */}
          <Route path="/sales-order-entry" element={<SalesOrderEntry />} />
          <Route path="/sales-order-report" element={<SalesOrderReport />} />
          <Route
            path="/sales-order-status-report"
            element={<SalesOrderStatusReport />}
          />
          <Route
            path="/sales-order-report/report/:type/:id"
            element={<IndividualReport />}
          />
          <Route
            path="/dashboard-sales-order-report/report/:type/:id"
            element={<IndividualReport />}
          />
          <Route path="/sales-return-entry" element={<SalesReturnForm />} />
          <Route path="/sales-return-reports" element={<SalesReturnReports />} />
          <Route path="/sales-return-view/:id" element={<SalesReturnView />} />

          <Route
            path="sales-order-report/edit/:type/:id"
            element={<EditSalesOrderModel />}
          />

          <Route
            path="/sales-order-report/add/raw-material-sfg/:type/:id"
            element={<AdditionalSFGRawMaterial />}
          />
          {/* Internal sales order */}
          <Route
            path="/internal-sales-order"
            element={<InternalSalesOrder />}
          />

          {/* Sales-purchase-transfer */}
          <Route path="/bill-of-sales" element={<BillOfSales />} />
          <Route path="/bills-of-sale-report" element={<BillOfSalesReport />} />
          <Route path="/bill-of-sale/:id" element={<BillOfSaleView />} />
          <Route path="/bill-of-purchase" element={<BillOfPurchase />} />
          <Route
            path="/bill-of-purchase/:id"
            element={<BillOfPurchaseView />}
          />
          <Route path="/ready-to-stitch" element={<ReadyToStitch />} />
          <Route
            path="/bill-of-purchase-report"
            element={<BillOfPurchaseReport />}
          />

          {/* Stocks routes */}
          <Route path="/raw-material-stock" element={<RawMaterialStock />} />
          <Route path="/sfg-stock" element={<SemiFinishedGoodStock />} />
          <Route
            path="/sfg-stock-report"
            element={<SemiFinishedStockReport />}
          />
          <Route path="/all-stock-entry" element={<AllStockEntry />} />

          {/* Task routes */}
          <Route path="/tasks" element={<Task />} />
          <Route path="/add-task" element={<AddTask />} />
          <Route path="/kanban/board/:id" element={<KanbanBoard />} />
          <Route path="/kanban" element={<BoardsList />} />

          {/*  Reports */}
          <Route path="/dispatched-reports" element={<DispatchReport />} />
          <Route path="/stitch-report" element={<StitchReport />} />
          <Route path="/sale-bill-report" element={<SaleBillReport />} />
          <Route
            path="/purchase-bill-report"
            element={<PurchaseBillDetailsReport />}
          />
          <Route
            path="/stitch-clear-report"
            element={<StitchClearDateWiseReport />}
          />
          <Route path="/so-return-report" element={<SalesReturnReports />} />
          <Route
            path="/dyer-wise-sale-purchase-report"
            element={<DyerWiseSalePurchaseReport />}
          />

          {/* Stitching */}
          <Route path="/stitching-entry" element={<StitchingEntry />} />
          <Route
            path="/stitching-entry-reports"
            element={<StitchingEntryReports />}
          />
          <Route path="/stitching-entry/:id" element={<StitchingEntryView />} />
          <Route path="/stitching-receive" element={<StitchingReceive />} />
          <Route
            path="/stitching-receive-reports"
            element={<StitchingReceiveEntryReports />}
          />
          <Route
            path="/stitching-receive-entry/:id"
            element={<StitchingReceiveEntryView />}
          />

          <Route path="/stock-out" element={<FcPrivacy />} />

          {/* others */}
          <Route path="/stock-transfer" element={<StockTransferPage />} />
          <Route path="/stitch-status" element={<StitchStatusPage />} />
          <Route path="/dispatch-entry" element={<DispatchEntryPage />} />

          <Route path="/dye-follow-up" element={<DyeFollowUp />} />
          <Route path="/bill-of-sale-sfg" element={<BillOfSaleSFG />} />
          <Route path="/sales-return" element={<SalesReturn />} />
          <Route path="/sales-release" element={<SalesRelease />} />
        </Route>
      </Routes>
      {/* </BrowserRouter> */}
    </>
  );
}

export default App;
