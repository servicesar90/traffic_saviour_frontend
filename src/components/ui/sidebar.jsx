import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  LayoutDashboard,
  Megaphone,
  ScrollText,
  BarChart3,
  LineChart,
  ShieldBan,
  BadgeDollarSign,
  ReceiptText,
} from "lucide-react";
import { apiFunction } from "../../api/ApiFunction";
import { signOutApi } from "../../api/Apis";


// import { useSelector } from "react-redux";

const SidebarContent = ({
  isCollapsed,
  mobileVisible,
  onCloseMobile,
  onToggleCollapse,
  isMobile = false,
}) => {
  const location = useLocation();
  const [manageIpOpen, setManageIpOpen] = useState(false);
  const showFull = !isCollapsed;

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  // const { employer } = useSelector((state) => state.getDataReducer);
  const navigate = useNavigate();

  const navItems = [
    {
      label: "Dashboard",
      icon: <LayoutDashboard size={18} />,
      route: "/Dashboard/allStats",
    },
    {
      label: "Campaigns",
      icon: <Megaphone size={18} />,
      route: "/Dashboard/allCampaign",
    },
    {
      label: "Traffic Logs",
      icon: <ScrollText size={18} />,
      route: "/Dashboard/reports",
    },
    {
      label: "Stats Overview",
      icon: <BarChart3 size={18} />,
      route: "/Dashboard/stats",
    },
    {
      label: "Analytics Hub",
      icon: <LineChart size={18} />,
      route: "/Dashboard/analytics",
    },
    {
      label: "Manage IP",
      icon: <ShieldBan size={18} />,
      collapsible: true,
      subItems: [
        { label: "Blacklist IP", route: "/Dashboard/ip-blacklist" },
        { label: "Whitelist IP", route: "/Dashboard/ip-whitelist" },
      ],
    },
    {
      label: "Pricing",
      icon: <BadgeDollarSign size={18} />,
      route: "/Dashboard/pricing",
    },
    {
      label: "Transactions",
      icon: <ReceiptText size={18} />,
      route: "/Dashboard/billing",
    },
  ];

  const handleNavigate = (route) => {
    navigate(route);
    if (mobileVisible) onCloseMobile(); // auto-close sidebar on mobile 
  };

  const handleCollapseAction = () => {
    if (isMobile) {
      onCloseMobile?.();
      return;
    }
    onToggleCollapse?.();
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

  useEffect(() => {
    if (
      location.pathname === "/Dashboard/ip-blacklist" ||
      location.pathname === "/Dashboard/ip-whitelist"
    ) {
      setManageIpOpen(true);
    }
  }, [location.pathname]);

  return (
    <div
      className={`flex flex-col ${isMobile ? "pt-5 pb-3" : "py-3"} px-3 bg-white border-r border-slate-200 ${isCollapsed ? "w-16 sidebar-collapsed overflow-visible" : "w-64 sidebar-expanded overflow-hidden"
        } transition-all duration-500 ease-in-out text-slate-900 box-border min-h-0`}
      style={{ borderTop: 0, height: isMobile ? "100%" : "calc(100vh - 72px - 1px)" }}
    >
      {/* Logo & Avatar */}
      <div
        className={`px-1 mb-4 flex items-center ${showFull ? "gap-3" : "justify-center"
          }`}
      >
        <div
          className={`flex items-center rounded-xl bg-white ${showFull ? "gap-2.5 px-2 py-2 w-full" : "justify-center p-0 w-auto"
            }`}
        >
          <div className="flex shrink-0 items-center justify-center w-10 h-10 min-w-10 min-h-10 rounded-full bg-slate-100 text-slate-700 ring-2 ring-[#e7eefc]">
            {user?.company?.logoUrl ? (
              <img
                src={user?.company?.logoUrl}
                alt="Logo"
                className="w-9 h-9 min-w-9 min-h-9 shrink-0 rounded-full object-cover"
              />
            ) : (
              <span className="text-md font-bold">
                {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
              </span>
            )}
          </div>
          {showFull && (
            <div className="flex-1 leading-tight sidebar-text text-left">
              <p className="text-[15px] font-extrabold text-slate-900 truncate leading-none">
                {user?.name || "Orbix Studio Team"}
              </p>
            </div>
          )}
          {/* {showFull && (
            <div className="w-6 h-6 rounded-md bg-white flex items-center justify-center text-slate-500">
              <span className="text-xs">...</span>
            </div>
          )} */}
        </div>
      </div>

      {/* Navigation */}
      <nav className={`flex flex-col gap-1 text-slate-200 ${showFull ? "overflow-hidden" : "overflow-visible"}`}>
        {navItems.map((item, index) => {
          const hasSubItems = Array.isArray(item.subItems) && item.subItems.length > 0;
          const isSubItemActive = hasSubItems
            ? item.subItems.some((sub) => location.pathname === sub.route)
            : false;
          const isActive = location.pathname === item.route || isSubItemActive;
          const isItemActive = isActive;

          return (
            <div key={index}>
              <div
                id={item.label}
                onClick={() => {
                  if (item.label === "Manage IP") {
                    setManageIpOpen(!manageIpOpen);
                  } else if (item.route) {
                    handleNavigate(item.route);
                  }
                }}
                className={`sidebar-item flex items-center ${showFull ? "justify-between" : "justify-center"} rounded-xl cursor-pointer transition-colors ${!showFull ? "sidebar-item-collapsed" : ""} ${isItemActive
                  ? "sidebar-item-active"
                  : "text-slate-600"
                  } relative group`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={`sidebar-item-icon ${isItemActive ? "sidebar-item-active" : ""}`}>
                    {item.icon}
                  </span>
                  {showFull && (
                    <span className="text-sm font-semibold sidebar-text tracking-[0.01em]">{item.label}</span>
                  )}
                </div>
                {!showFull && (
                  <span className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-4 hidden rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 shadow-md group-hover:block z-50 whitespace-nowrap">
                    {item.label}
                  </span>
                )}
                {(item.collapsible || hasSubItems) && showFull && (
                  <span className="text-slate-300/70 sidebar-text">
                    {item.label === "Manage IP" ? (
                      manageIpOpen ? (
                        <ChevronUp size={16} className={`sidebar-item-icon ${isItemActive ? "sidebar-item-active" : ""}`} />
                      ) : (
                        <ChevronDown size={16} className={`sidebar-item-icon ${isItemActive ? "sidebar-item-active" : ""}`} />
                      )
                    ) : (
                      <ChevronDown size={16} className={`sidebar-item-icon ${isItemActive ? "sidebar-item-active" : ""}`} />
                    )}
                  </span>
                )}
              </div>

              {hasSubItems && showFull && manageIpOpen && (
                <div className="ml-4 mt-1 flex flex-col gap-1">
                  {item.subItems.map((sub) => {
                    const subActive = location.pathname === sub.route;
                    return (
                      <div
                        key={sub.route}
                        onClick={() => handleNavigate(sub.route)}
                        className={`px-2 py-1 text-[13px] rounded-lg cursor-pointer transition-colors ${
                          subActive ? "text-[#3874ff]" : "text-slate-600 hover:text-slate-700"
                        }`}
                      >
                        {sub.label}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
      <div className={`mt-auto ${isMobile ? "pb-3" : "pb-2"}`}>
        <div className="-mx-3">
          <div className="h-px w-full bg-[#CBD0DD]" />
        </div>
        <div className="mt-3">
          <div
            className={`sidebar-item flex items-center gap-3 rounded-xl cursor-pointer transition-colors text-slate-600 ${!showFull ? "sidebar-item-collapsed justify-center" : ""} relative group`}
            onClick={handleCollapseAction}
          >
            <span className="sidebar-item-icon">
              <ChevronLeft size={18} />
            </span>
            {showFull && <span className="text-sm font-semibold sidebar-text tracking-[0.01em]">Collapsed View</span>}
            {!showFull && (
              <span className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-4 hidden rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 shadow-md group-hover:block z-50 whitespace-nowrap">
                Collapsed View
              </span>
            )}
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
        className={`hidden md:block ${collapsed ? "overflow-visible" : "overflow-hidden"}`}
      >
        <div
          className={`h-[calc(100vh-72px)] ${collapsed ? "w-16" : "w-64"
            } transition-[width] duration-500 ease-[cubic-bezier(.22,.61,.36,1)] ${collapsed ? "overflow-visible" : "overflow-hidden"} will-change-[width]`}
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
      <div
        className={`fixed left-0 right-0 top-[72px] bottom-0 z-50 md:hidden transition-opacity duration-300 ${
          mobileVisible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="absolute inset-0 bg-black/35" onClick={onCloseMobile} />
        <div
          className={`absolute left-0 top-0 bottom-0 z-[60] w-60 bg-white shadow-lg overflow-hidden transition-transform duration-300 ease-out ${
            mobileVisible ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <SidebarContent
            isCollapsed={false}
            mobileVisible={mobileVisible}
            onCloseMobile={onCloseMobile}
            onToggleCollapse={onToggleCollapse}
            isMobile={true}
          />
        </div>
      </div>
    </>
  );
};

export default Sidebar;

