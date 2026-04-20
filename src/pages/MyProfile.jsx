import React, { useEffect, useState } from "react";
import {
  FaUser,
  FaSignOutAlt,
  FaHome,
  FaClipboardList,
  FaHeadset,
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhoneAlt,
} from "react-icons/fa";

import { AccountDetailsForm } from "../components/ui/MyProfile/AccountDetailsForm";
import { OrdersView } from "../components/ui/MyProfile/OrdersView";
import { SubscriptionView } from "../components/ui/MyProfile/SubscriptionView";
import { SupportTicketsView } from "../components/ui/MyProfile/SupportTicketsView";

import { useNavigate } from "react-router-dom";
import { apiFunction } from "../api/ApiFunction";
import { signOutApi } from "../api/Apis";
import profileCharacter from "../assets/vecteezy_friendly-3d-animated-character-with-glasses-smiling_57357673.png";

const MyProfile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("account");
  const [user, setUser] = useState(null);
  const [plan, setPlan] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    const planStored = localStorage.getItem("plan");

    if (stored) {
      setUser(JSON.parse(stored));
    }

    if (planStored) {
      setPlan(JSON.parse(planStored));
    }
  }, []);

  const views = {
    orders: <OrdersView />,
    subscription: <SubscriptionView />,
    account: <AccountDetailsForm />,
    ticket: <SupportTicketsView />,
  };

  const breadcrumbNames = {
    account: "Profile Details",
    orders: "Order History",
    subscription: "Plan Overview",
    ticket: "Support Requests",
  };

  const tabs = [
    { id: "orders", label: "Order History", icon: <FaClipboardList /> },
    { id: "subscription", label: "Plan Overview", icon: <FaHome /> },
    { id: "account", label: "Profile Details", icon: <FaUser /> },
    { id: "ticket", label: "Support Requests", icon: <FaHeadset /> },
  ];

  const clearSession = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("plan");
    localStorage.removeItem("todo_tasks");
  };

  const handleLogout = async () => {
    try {
      await apiFunction("get", signOutApi, null, null);
    } catch (error) {
      // Continue local logout even if API fails.
    } finally {
      clearSession();
      navigate("/");
    }
  };

  const joinedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString()
    : "Recently joined";

  return (
    <div className="w-full min-h-screen bg-[#F5F7FA] text-slate-900 px-4 md:px-6 py-6 md:py-8 font-sans">
      <div className="max-w-[1200px] mx-auto space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div>
            <p className="text-[12px] text-[#64748b]">
              Dashboard &gt;{" "}
              <span className="text-[#3c79ff] font-semibold">{breadcrumbNames[activeTab]}</span>
            </p>
            <h1 className="text-[28px] leading-8 font-extrabold tracking-tight text-[#141824] mt-2">My Account</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-md bg-white border border-[#d5d9e4] text-[#475569] text-[13px] font-semibold inline-flex items-center gap-2 hover:bg-[#f8fafc] transition cursor-pointer"
            >
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <section className="lg:col-span-8 bg-white border border-[#d5d9e4] rounded-md p-5">
            <div className="flex flex-col sm:flex-row sm:items-center gap-5">
              <AvatarCharacter image={user?.image} />
              <div className="text-left">
                <h2 className="text-[22px] font-extrabold text-[#141824]">
                  {user?.name || "Your Name"}
                </h2>
                <p className="text-[13px] text-[#64748b] mt-1">Member Since {joinedDate}</p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <MetricCard
                label="Current Plan"
                value={plan?.Plan?.name || "Starter"}
                valueClassName="text-[#141824]"
              />
              <MetricCard
                label="Plan Status"
                value={plan?.status || "Active"}
                valueClassName={plan?.status === "Active" ? "text-emerald-600" : "text-amber-600"}
              />
              <MetricCard
                label="Billing Total"
                value={plan?.Plan?.price ? `$${plan.Plan.price}` : "N/A"}
                valueClassName="text-[#141824]"
              />
            </div>
          </section>

          <section className="lg:col-span-4 bg-white border border-[#d5d9e4] rounded-md p-5">
            <h3 className="text-[22px] font-extrabold text-[#141824]">Primary Contact</h3>
            <div className="mt-3 pt-1 space-y-4 text-[15px]">
              <InfoRow icon={<FaMapMarkerAlt />} label="Location" value={user?.address || "Not added"} />
              <InfoRow icon={<FaEnvelope />} label="Email ID" value={user?.email || "Not added"} />
              <InfoRow icon={<FaPhoneAlt />} label="Phone Number" value={user?.phone || "Not added"} />
            </div>
          </section>
        </div>

        <section className="bg-white border border-[#d5d9e4] rounded-md p-3 md:p-4">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-md text-[13px] font-semibold transition cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-[#3c79ff] text-white"
                    : "bg-white border border-[#d5d9e4] text-[#475569] hover:bg-[#f8fafc]"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
            <button
              onClick={() => navigate("/Dashboard/allStats")}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-[13px] font-semibold bg-white border border-[#d5d9e4] text-[#475569] hover:bg-[#f8fafc] transition"
            >
              <FaHome />
              Dashboard
            </button>
          </div>
        </section>

        <div className="rounded-2xl">{views[activeTab]}</div>
      </div>
    </div>
  );
};

const MetricCard = ({ label, value, valueClassName }) => (
  <div className="rounded-sm p-3 bg-[#f8fbff] border border-[#d5d9e4]">
    <p className="text-[11px] font-extrabold uppercase tracking-wide text-[#52607a]">{label}</p>
    <p className={`text-[15px] font-semibold mt-1 ${valueClassName}`}>{value}</p>
  </div>
);

const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-start gap-3 text-left">
    <div className="mt-1 text-[#7f8aa3]">{icon}</div>
    <div className="text-left">
      <p className="text-[11px] font-extrabold uppercase tracking-wide text-[#52607a]">{label}</p>
      <p className="text-[13px] font-semibold text-[#1e293b]">{value}</p>
    </div>
  </div>
);

const AvatarCharacter = ({ image }) => {
  if (image) {
    return (
      <div className="w-24 h-24 rounded-full p-[2px] bg-gradient-to-br from-[#3c79ff] via-[#9ec0ff] to-[#356ee6] shadow-[0_10px_24px_rgba(60,121,255,0.25)]">
        <img
          src={image}
          alt="Profile avatar"
          className="w-full h-full rounded-full object-cover bg-transparent"
        />
      </div>
    );
  }

  return (
    <div className="w-24 h-24 rounded-full p-[2px] bg-gradient-to-br from-[#3c79ff] via-[#9ec0ff] to-[#356ee6] shadow-[0_10px_24px_rgba(60,121,255,0.25)]">
      <div className="w-full h-full rounded-full bg-transparent overflow-hidden">
        <img
          src={profileCharacter}
          alt="3D cartoon profile avatar"
          className="w-full h-full rounded-full object-contain bg-transparent"
        />
      </div>
    </div>
  );
};

export default MyProfile;
