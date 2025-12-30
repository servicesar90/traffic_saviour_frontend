import React, { useEffect, useState } from "react";
import {
  FaUser,
  FaSignOutAlt,
  FaHome,
  FaClipboardList,
  FaHeadset,
} from "react-icons/fa";

import { AccountDetailsForm } from "../components/ui/MyProfile/AccountDetailsForm";
import { OrdersView } from "../components/ui/MyProfile/OrdersView";
import { SubscriptionView } from "../components/ui/MyProfile/SubscriptionView";
import { SupportTicketsView } from "../components/ui/MyProfile/SupportTicketsView";

import { useNavigate } from "react-router-dom";
import { apiFunction } from "../api/ApiFunction";
import { signOutApi } from "../api/Apis";

const MyProfile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("account");
  const [user,setUser] = useState(null);

   // Load user AFTER component mounts
    useEffect(() => {
      const stored = localStorage.getItem("user");
      if (stored) {
        setUser(JSON.parse(stored)); // ⬅️ FIX
      }
    }, []);

  const views = {
    orders: <OrdersView />,
    subscription: <SubscriptionView />,
    account: <AccountDetailsForm />,
    ticket: <SupportTicketsView />,
  };

  const breadcrumbNames = {
  account: "Account Details",
  orders: "My Orders",
  subscription: "My Subscription",
  ticket: "Support Tickets",
};

  const handleLogout = async () => {
    try {
      const res = await apiFunction("get", signOutApi, null, null);
      if (res) {
        localStorage.clear();
        navigate("/");
      }
    } catch (error) {
 console.log(error);
 
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-900 text-white px-6 py-10">

      {/* PAGE TITLE */}
      <h1 className="text-3xl font-semibold mb-2">My Profile</h1>
      <p className="text-slate-400 mb-8">Account &gt; <span className="text-orange-500 font-sm">{breadcrumbNames[activeTab]}</span></p>

      {/* GRID LAYOUT */}
      <div className="grid grid-cols-12 gap-8">

        {/* LEFT SIDEBAR */}
        <div className="col-span-3 bg-slate-800 border border-slate-700 rounded-xl p-6 space-y-6 max-h-fit ">
          <div className="text-xl font-bold">{user?.name?.split(" ")[0]?.toUpperCase()}</div>

          <button
            onClick={handleLogout}
            className="text-slate-400 hover:text-red-400 flex items-center gap-2 cursor-pointer"
          >
            <FaSignOutAlt /> Logout
          </button>

          <div className="border-t border-slate-700 pt-4 space-y-4 text-[15px] ">

            {/* DASHBOARD (ROUTES TO DIFFERENT PAGE) */}
            <SidebarItem
              title="Dashboard"
              icon={<FaHome />}
              onClick={() => navigate("/Dashboard/allStats")}
            />

            {/* PAGE SWITCHING ON SAME SCREEN */}
            <SidebarItem
              title="Orders"
              icon={<FaClipboardList />}
               active={activeTab === "orders"}
              onClick={() => setActiveTab("orders")}
            />

            <SidebarItem
              title="My Subscription"
              icon={<FaClipboardList />}
               active={activeTab === "subscription"}
              onClick={() => setActiveTab("subscription")}
            />

            <SidebarItem
              title="Account Details"
              icon={<FaUser />}
              active={activeTab === "account"}
              onClick={() => setActiveTab("account")}
            />

            <SidebarItem
              title="Support Tickets"
              icon={<FaHeadset />}
               active={activeTab === "ticket"}
              onClick={() => setActiveTab("ticket")}
            />
          </div>
        </div>

        {/* RIGHT CONTENT */}
        <div className="col-span-9   rounded-xl">
          {views[activeTab]}
        </div>
      </div>
    </div>
  );
};

const SidebarItem = ({ title, icon, onClick, active }) => (
  <div
    onClick={onClick}
    className={`flex items-center gap-2 cursor-pointer hover:text-white transition ${
      active ? "text-orange-500 font-semibold" : "text-slate-400"
    }`}
  >
    {icon} {title}
  </div>
);

export default MyProfile;
