import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronDown, ChevronUp, NotepadText, ChevronLeft } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faList, faBan, faChartPie, faChartSimple } from "@fortawesome/free-solid-svg-icons";
import { CreditCard, Layers } from "lucide-react";
import { apiFunction } from "../../api/ApiFunction";
import { signOutApi } from "../../api/Apis";


// import { useSelector } from "react-redux";

const SidebarContent = ({ isCollapsed, mobileVisible, onCloseMobile, onToggleCollapse }) => {
  const location = useLocation();
  const [databaseOpen, setDatabaseOpen] = useState(false);
  const showFull = !isCollapsed;

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  // const { employer } = useSelector((state) => state.getDataReducer);
  const navigate = useNavigate();

  const navItems = [
    {
      label: "Home",
      icon: <FontAwesomeIcon icon={faChartPie} size="lg" />,
      route: "/Dashboard/allStats",
    },
    {
      label: "Tasks",
      icon: <FontAwesomeIcon icon={faList} size="lg" />,
      route: "/Dashboard/allCampaign",
    },
    {
      label: "Transactions",
      icon: <FontAwesomeIcon icon={faChartSimple} size="lg" />,
      route: "/Dashboard/analytics",
    },
    {
      label: "Payments",
      icon: <CreditCard size={20} />,
      route: "/Dashboard/pricing",
      collapsible: true,
    },
    {
      label: "Cards",
      icon: <Layers size={20} />,
      route: "/Dashboard/billing",
    },
    {
      label: "Capital",
      icon: <FontAwesomeIcon icon={faBan} size="lg" />,
      route: "/Dashboard/IpListings",
    },
    {
      label: "Accounts",
      icon: <NotepadText size={18} />,
      collapsible: true,
    },
  ];

  const workflowItems = [
    { label: "Bill Pay", icon: <NotepadText size={18} />, route: "/Dashboard/billing" },
    { label: "Invoicing", icon: <NotepadText size={18} />, route: "/Dashboard/pricing" },
    { label: "Reimbursements", icon: <NotepadText size={18} />, route: "/Dashboard/analytics" },
    { label: "Accounting", icon: <NotepadText size={18} />, route: "/Dashboard/reports" },
  ];

  const handleNavigate = (route) => {
    navigate(route);
    if (mobileVisible) onCloseMobile(); // auto-close sidebar on mobile 
  };

  const handleLogout = async () => {
    try {
      const response = await apiFunction("get", signOutApi, null, null);
      
      if (response) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("plan");
        localStorage.removeItem("todo_tasks");
  
        navigate("/");
      }
    } catch (error) {
       localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("plan");
        localStorage.removeItem("todo_tasks");
  
        navigate("/");
      
    }
    
  };

  const isDatabaseActive = false;

  return (
    <div
      className={`flex flex-col py-3 px-3 bg-white border-r border-slate-200 ${isCollapsed ? "w-16 sidebar-collapsed" : "w-64 sidebar-expanded"
        } transition-all duration-500 ease-in-out text-slate-900 overflow-hidden box-border min-h-0`}
      style={{ borderTop: 0, height: "calc(100vh - 72px - 1px)" }}
    >
      {/* Logo & Avatar */}
      <div
        className={`px-1 mb-4 flex items-center ${showFull ? "gap-3" : "justify-center"
          }`}
      >
        <div className="flex items-center gap-3 rounded-2xl bg-white px-2 py-2 w-full">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-slate-100 text-slate-700">
            {user?.company?.logoUrl ? (
              <img
                src={user?.company?.logoUrl}
                alt="Logo"
                className="w-8 h-8 rounded-lg object-cover"
              />
            ) : (
              <span className="text-xs font-semibold">
                {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
              </span>
            )}
          </div>
          {showFull && (
            <div className="flex-1 leading-tight sidebar-text">
              <p className="text-xs text-slate-500">Agency</p>
              <p className="text-sm font-semibold text-slate-900 truncate">
                {user?.name || "Orbix Studio Team"}
              </p>
            </div>
          )}
          {showFull && (
            <div className="w-6 h-6 rounded-md bg-white flex items-center justify-center text-slate-500">
              <span className="text-xs">...</span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1 text-slate-200 overflow-hidden">
        {navItems.map((item, index) => {
          const isActive = location.pathname === item.route;
          const isItemActive = isActive || (item.collapsible && isDatabaseActive);

          return (
            <div key={index}>
              <div
                id={item.label}
                onClick={() => {
                  if (item.collapsible) {
                    setDatabaseOpen(!databaseOpen);
                  } else if (item.route) {
                    handleNavigate(item.route);
                  }
                }}
                className={`sidebar-item flex items-center ${showFull ? "justify-between" : "justify-center"} rounded-xl cursor-pointer transition-colors ${!showFull ? "sidebar-item-collapsed" : ""} ${isItemActive
                  ? "sidebar-item-active"
                  : "text-slate-600"
                  }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`sidebar-item-icon ${isItemActive ? "sidebar-item-active" : ""}`}>
                    {item.icon}
                  </span>
                  {showFull && (
                    <span className="text-sm font-medium sidebar-text">{item.label}</span>
                  )}
                </div>
                {item.collapsible && showFull && (
                  <span className="text-slate-300/70 sidebar-text">
                    {databaseOpen ? (
                      <ChevronUp size={16} className={`sidebar-item-icon ${isItemActive ? "sidebar-item-active" : ""}`} />
                    ) : (
                      <ChevronDown size={16} className={`sidebar-item-icon ${isItemActive ? "sidebar-item-active" : ""}`} />
                    )}
                  </span>
                )}
              </div>

            </div>
          );
        })}
      </nav>
      <div className="mt-4">
        <div className={`px-2 ${showFull ? "block" : "hidden"}`}>
          <div className="h-px w-full bg-white/10" />
        </div>
        <p className={`px-2 text-[11px] font-semibold text-slate-300/70 uppercase tracking-[0.12em] ${showFull ? "block" : "hidden"}`}>
          Workflows
        </p>
        <div className="mt-2 flex flex-col gap-1">
          {workflowItems.map((item, idx) => {
            const isActive = location.pathname === item.route;
            return (
              <div
                key={idx}
                onClick={() => item.route && handleNavigate(item.route)}
                className={`sidebar-item flex items-center gap-3 rounded-xl cursor-pointer transition-colors ${!showFull ? "sidebar-item-collapsed justify-center" : ""} ${isActive
                  ? "sidebar-item-active"
                  : "text-slate-600"
                  }`}
              >
                <span className={`sidebar-item-icon ${isActive ? "sidebar-item-active" : ""}`}>
                  {item.icon}
                </span>
                {showFull && <span className="text-sm font-medium sidebar-text">{item.label}</span>}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-auto pb-2">
        <div className="-mx-3">
          <div className="h-px w-full bg-[#CBD0DD]" />
        </div>
        <div className="mt-3">
          <div
            className={`sidebar-item flex items-center gap-3 rounded-xl cursor-pointer transition-colors text-slate-600 ${!showFull ? "sidebar-item-collapsed justify-center" : ""}`}
            onClick={onToggleCollapse}
          >
            <span className="sidebar-item-icon">
              <ChevronLeft size={18} />
            </span>
            {showFull && <span className="text-sm font-medium sidebar-text">Collapsed View</span>}
          </div>
        </div>
      </div>

    </div>
  );
};

const Sidebar = ({ collapsed, mobileVisible, onCloseMobile, onToggleCollapse }) => {

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className="hidden md:block overflow-hidden"
      >
        <div
          className={`h-[calc(100vh-72px)] ${collapsed ? "w-16" : "w-64"
            } transition-[width] duration-500 ease-[cubic-bezier(.22,.61,.36,1)] overflow-hidden will-change-[width]`}
        >
          <div className="h-full flex flex-col justify-end">
            <SidebarContent
              isCollapsed={collapsed}
              mobileVisible={mobileVisible}
              onCloseMobile={onCloseMobile}
              onToggleCollapse={onToggleCollapse}
            />
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      {mobileVisible && (
        <div className="absolute inset-0 z-50 flex md:hidden">
          <div className="w-60 bg-white shadow-lg h-[100vh] py-1.75 overflow-hidden">
            {/* <div className="flex justify-end pr-4">
              <X
                className="cursor-pointer text-gray-600"
                onClick={onCloseMobile}
              />
            </div> */}
            <div className="h-full flex flex-col justify-end">
              <SidebarContent isCollapsed={false} />
            </div>
          </div>
          {/* <div className="flex-1 bg-black bg-opacity-50" onClick={onCloseMobile} /> */}
        </div>
      )}
    </>
  );
};

export default Sidebar;

