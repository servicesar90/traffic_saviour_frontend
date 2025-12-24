import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Building,
  Database,
  Notebook,
  UserSearch,
  Save,
  Unlock,
  X,
  ChevronDown,
  ChevronUp,
  Power,
  HandCoins,
  NotepadText,
  LayoutDashboard,
} from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faList, faBan, faChartPie, faChartSimple, faDollarSign } from "@fortawesome/free-solid-svg-icons";


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
      label: "Dashboard",
      icon: <FontAwesomeIcon icon={faChartPie} size='lg' />,
      route: "/Dashboard/allStats",
    },
    {
      label: "Campaign",
      icon:  <FontAwesomeIcon icon={faList} size="lg" />,
      route: "/Dashboard/allCampaign",
    },

    {
      label: "Blacklisted IP",
      icon: <FontAwesomeIcon icon={faBan} size='lg' />,
      route: "/Dashboard/IpListings",
    },
    {
      label: "Analytics",
      icon: <FontAwesomeIcon icon={faChartSimple} size='lg' />,
      route: "/Dashboard/analytics",
    },
    {
      label: "Report",
      icon: <NotepadText size={24} />,
    },
    // {
    //   label: "Pricing",
    //   icon: <FontAwesomeIcon icon={faDollarSign} size='lg' />,
    //   route: "/Dashboard/pricing",
    // },
  ];

  const databaseSubItems = [
    {
      label: "Click Logs",
      route: "/Dashboard/reports",
    },
    {
      label: "Stats Overview",
      route: "/Dashboard/clicklogs",
    },
    {
      label: "Tracking",
      route: "/employerHome/UnlockedCandidates",
    },
    {
      label: "Group By Stats",
      route: "/employerHome/UnlockedCandidates",
    },
    {
      label: "Cost Management",
      route: "/employerHome/UnlockedCandidates",
    },
    {
      label: "Campaign Timeline",
      route: "/employerHome/UnlockedCandidates",
    },
    {
      label: "Delete Campaigns",
      route: "/employerHome/UnlockedCandidates",
    },
  ];

  const handleNavigate = (route) => {
    navigate(route);
    if (mobileVisible) onCloseMobile(); // auto-close sidebar on mobile
  };

  const logout = () => {
    localStorage.removeItem("TokenId");
    localStorage.removeItem("User");
    navigate("/");
  };

  const isDatabaseActive = databaseSubItems.some(
    (sub) => location.pathname === sub.route
  );

  return (
    <div
      className={`h-full flex flex-col py-4 px-2 bg-[#1e2939] border-gray-300 ${
        isCollapsed ? "w-16" : "w-60"
      } transition-all duration-500 ease-in-out`}
    >
      {/* Logo & Avatar */}
      <div
        className={`px-2 mb-4 flex items-center text-white ${
          showFull ? "gap-3" : "justify-center"
        }`}
      >
        {user?.company?.logoUrl ? (
          <img
            src={employer?.company.logoUrl}
            alt="Logo"
            className="w-8 h-8 rounded-[8px] object-cover"
          />
        ) : (
          <div className="w-8 h-8 text-white rounded-[8px] bg-green-500 text-white flex items-center justify-center text-sm font-semibold">
            {user?.name.charAt(0).toUpperCase()}
          </div>
        )}
        {showFull && <p className="text-xl text-white text-gray-600 ">{user?.name}</p>}
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1 text-white ">
        {navItems.map((item, index) => {
          const isActive = location.pathname === item.route;
          const isDatabase = item.label === "Report";
          const isItemActive = isActive || (isDatabase && isDatabaseActive);

          return (
            <div key={index}>
              <div
                id={item.label}
                onClick={() => {
                  if (isDatabase) {
                    setDatabaseOpen(!databaseOpen);
                  } else if (item.route) {
                    handleNavigate(item.route);
                  }
                }}
                className={`flex items-center justify-between px-3 py-2 rounded-md cursor-pointer transition-colors   ${
                  isItemActive
                    ? "bg-[#ECF3FF] text-[#465FFF] "
                    : "text-white                                                                                                                                                                                                                hover:bg-gray-100 hover:text-[#465FFF]"
                }`}
              >
                <div className="flex items-center gap-3 hover:text-[465FFF ]">
                  <span
                    className={`${
                      isItemActive ? "text-[#465FFF]" : " "
                    }`}
                  >
                    {item.icon}
                  </span>
                  {showFull && (
                    <span className="text-md font-medium">{item.label}</span>
                  )}
                </div>
                {isDatabase && showFull && (
                  <span className="text-gray-600 hover:text-[#465FFF]">
                    {databaseOpen ? (
                      <ChevronUp size={16} className="text-[#465FFF]" />
                    ) : (
                      <ChevronDown size={16} className="text-white" />
                    )}
                  </span>
                )}
              </div>

              {/* Submenu */}
              {isDatabase && (
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    databaseOpen && showFull ? "max-h-96 mt-1" : "max-h-0"
                  }`}
                >
                  <div className="ml-6 flex flex-col gap-1">
                    {databaseSubItems.map((sub, subIndex) => {
                      const isSubActive = location.pathname === sub.route;
                      return (
                        <div
                          key={subIndex}
                          onClick={() => handleNavigate(sub.route)}
                          className={`flex items-center gap-2 px-2 py-1 rounded-md text-sm cursor-pointer transition-colors ${
                            isSubActive
                              ? "bg-[#ECF3FF] text-[#465FFF]"
                              : "text-white hover:bg-gray-100 hover:text-[#465FFF]"
                          }`}
                        >
                          {sub.icon}
                          <span>{sub.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </nav>
      {/* logout button */}
      {/* <div className="border-t-[2px] w-full h-[10vh] mt-auto flex justify-center items-center ">
      
      </div> */}
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
          className={`h-[100vh] mt-[-8vh]   shadow-md ${
            collapsed && !hovered ? "w-16" : "w-60"
          } transition-all duration-[600ms] ease-[cubic-bezier(.22,.61,.36,1)] `}
        >
          <div className="h-full flex mt-[8vh] flex-col justify-end">
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
          <div className="w-60 bg-[#1e2939] shadow-lg h-[100vh] py-1.75 overflow-hidden">
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
