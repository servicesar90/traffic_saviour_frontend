import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronDown, ChevronUp, NotepadText } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faList, faBan, faChartPie, faChartSimple } from "@fortawesome/free-solid-svg-icons";
import { CreditCard, Layers } from "lucide-react";
import { apiFunction } from "../../api/ApiFunction";
import { signOutApi } from "../../api/Apis";


// import { useSelector } from "react-redux";

const SidebarContent = ({ isCollapsed, mobileVisible, onCloseMobile }) => {
  const location = useLocation();
  const [databaseOpen, setDatabaseOpen] = useState(false);
  const showFull = !isCollapsed;

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  // const { employer } = useSelector((state) => state.getDataReducer);
  const navigate = useNavigate();

  const navItems = [
    {
      label: "Home",
      icon: <FontAwesomeIcon icon={faChartPie} size="sm" />,
      route: "/Dashboard/allStats",
    },
    {
      label: "Tasks",
      icon: <FontAwesomeIcon icon={faList} size="sm" />,
      route: "/Dashboard/allCampaign",
    },
    {
      label: "Transactions",
      icon: <FontAwesomeIcon icon={faChartSimple} size="sm" />,
      route: "/Dashboard/analytics",
    },
    {
      label: "Payments",
      icon: <CreditCard size={18} />,
      route: "/Dashboard/pricing",
      collapsible: true,
    },
    {
      label: "Cards",
      icon: <Layers size={18} />,
      route: "/Dashboard/billing",
    },
    {
      label: "Capital",
      icon: <FontAwesomeIcon icon={faBan} size="sm" />,
      route: "/Dashboard/IpListings",
    },
    {
      label: "Accounts",
      icon: <NotepadText size={16} />,
      collapsible: true,
    },
  ];

  const workflowItems = [
    { label: "Bill Pay", icon: <NotepadText size={16} />, route: "/Dashboard/billing" },
    { label: "Invoicing", icon: <NotepadText size={16} />, route: "/Dashboard/pricing" },
    { label: "Reimbursements", icon: <NotepadText size={16} />, route: "/Dashboard/analytics" },
    { label: "Accounting", icon: <NotepadText size={16} />, route: "/Dashboard/reports" },
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
      className={`h-full flex flex-col py-4 px-3 bg-white border-r border-slate-200 ${isCollapsed ? "w-16 sidebar-collapsed" : "w-64 sidebar-expanded"
        } transition-all duration-500 ease-in-out`}
    >
      {/* Logo & Avatar */}
      <div
        className={`px-1 mb-4 flex items-center ${showFull ? "gap-3" : "justify-center"
          }`}
      >
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 px-2 py-2 w-full">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-slate-900 text-white">
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
              <p className="text-xs text-slate-400">Agency</p>
              <p className="text-sm font-semibold text-slate-900 truncate">
                {user?.name || "Orbix Studio Team"}
              </p>
            </div>
          )}
          {showFull && (
            <div className="w-6 h-6 rounded-md border border-slate-200 flex items-center justify-center text-slate-400">
              <span className="text-xs">⋯</span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1 text-slate-600">
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
                className={`flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer transition-colors ${isItemActive
                  ? "bg-blue-100 text-blue-700 shadow-[0_6px_16px_rgba(148,163,184,0.25)]"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`${isItemActive ? "text-blue-700" : "text-slate-500"}`}>
                    {item.icon}
                  </span>
                  {showFull && (
                    <span className="text-sm font-medium sidebar-text">{item.label}</span>
                  )}
                </div>
                {item.collapsible && showFull && (
                  <span className="text-slate-400 sidebar-text">
                    {databaseOpen ? (
                      <ChevronUp size={16} className="text-slate-500" />
                    ) : (
                      <ChevronDown size={16} className="text-slate-500" />
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
          <div className="h-px w-full bg-slate-200" />
        </div>
        <p className={`px-2 text-[11px] font-semibold text-slate-400 uppercase tracking-[0.12em] ${showFull ? "block" : "hidden"}`}>
          Workflows
        </p>
        <div className="mt-2 flex flex-col gap-1">
          {workflowItems.map((item, idx) => {
            const isActive = location.pathname === item.route;
            return (
              <div
                key={idx}
                onClick={() => item.route && handleNavigate(item.route)}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer transition-colors ${isActive
                  ? "bg-blue-100 text-blue-700"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
              >
                <span className={`${isActive ? "text-blue-700" : "text-slate-500"}`}>
                  {item.icon}
                </span>
                {showFull && <span className="text-sm font-medium sidebar-text">{item.label}</span>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Promo card */}
      <div className="mt-auto px-2 pb-4">
        {showFull ? (
          <div className="rounded-2xl border border-slate-200 p-3 bg-white shadow-[0_10px_24px_rgba(148,163,184,0.2)]">
            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
              <div className="h-10 w-10 rounded-xl bg-yellow-100 flex items-center justify-center text-yellow-600 text-xs font-semibold">
                GL
              </div>
              <div className="flex-1">
                <p className="text-xs text-slate-500">GlobalLink</p>
                <p className="text-sm font-semibold text-slate-900">Accept credit cards</p>
              </div>
            </div>
            <p className="mt-3 text-xs text-slate-600">and bank payment</p>
            <button className="mt-3 w-full rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800">
              Set up now
            </button>
          </div>
        ) : (
          <div className="h-12 w-12 mx-auto rounded-xl border border-slate-200 bg-white" />
        )}
      </div>
    </div>
  );
};

const Sidebar = ({ collapsed, mobileVisible, onCloseMobile }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className="hidden md:block "
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div
          className={`h-[calc(100vh-72px)] ${collapsed && !hovered ? "w-16" : "w-64"
            } transition-all duration-[600ms] ease-[cubic-bezier(.22,.61,.36,1)] `}
        >
          <div className="h-full flex flex-col justify-end">
            <SidebarContent
              isCollapsed={collapsed && !hovered}
              mobileVisible={mobileVisible}
              onCloseMobile={onCloseMobile}
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
