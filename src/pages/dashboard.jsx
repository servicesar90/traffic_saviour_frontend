import React, { useEffect, useState } from "react";
import Header from "../components/ui/header";
import Sidebar from "../components/ui/sidebar";
import { Outlet } from "react-router-dom";
import { Steps, Hints } from "intro.js-react";
import "intro.js/introjs.css";
import "intro.js/themes/introjs-modern.css";
import {  Briefcase, Home } from "lucide-react";
import { PhoneCall } from "lucide-react";
import {motion} from 'framer-motion'
import { Box } from "@mui/joy";

const Dashboard = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileVisible, setMobileVisible] = useState(false);
  const [stepEnable, setStepEnable] = useState(false);
  const [stepsDone, setStepsDone] = useState(true);

  const handleMenuClick = () => {
    if (window.innerWidth < 768) {
     

      setMobileVisible(!mobileVisible);
      setIsCollapsed(!isCollapsed);
    } else {
  

      setIsCollapsed(!isCollapsed);
    }
  };

  const steps = [
    {
      element: "#image",
      intro: `
    <div style="text-align: left;">
      <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0784C9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-house-icon lucide-house">
          <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/>
          <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        </svg>
        <h3 style="font-weight: bold; margin-left: 4px;">Welcome to the Dashboard</h3>
      </div>
      <p>
        Click this logo anytime to return to your Home Page.<br/>
        It's your main hub to view stats, jobs, and more.
      </p>
    </div>
  `,
      position: "right",
      tooltipClass: "myTooltipClass",
      highlightClass: "myHighlightClass",
    },
    {
      element: "#credit",
      intro: `
      <div style="text-align: left;">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0784C9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-coins-icon lucide-coins"><circle cx="8" cy="8" r="6"/><path d="M18.09 10.37A6 6 0 1 1 10.34 18"/><path d="M7 6h1v4"/><path d="m16.71 13.88.7.71-2.82 2.82"/></svg>
          <h3 style="font-weight: bold; margin-left: 4px; ">Job Posting Credits</h3>
        </div>
        <p>
          Here you can see your available job credits.<br/>
          <b>Credits</b> determine how many job listings you can post.<br/>
          Refill them by upgrading your plan.
        </p>
      </div>
    `,
      position: "bottom",
    },
    {
      element: "#profile",
      intro: `
      <div style="text-align: left;">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0784C9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user-pen-icon lucide-user-pen"><path d="M11.5 15H7a4 4 0 0 0-4 4v2"/><path d="M21.378 16.626a1 1 0 0 0-3.004-3.004l-4.01 4.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z"/><circle cx="10" cy="7" r="4"/></svg>
          <h3 style="font-weight: bold; margin-left: 4;">Your Profile</h3>
        </div>
        <p>
          Manage your account details, company info, and settings.<br/>
          Keep it updated for better visibility to job seekers.
        </p>
      </div>
    `,
      position: "left",
    },
    {
      element: "#Jobs",
      intro: `
      <div style="text-align: left;">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0784C9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-briefcase-business-icon lucide-briefcase-business"><path d="M12 12h.01"/><path d="M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><path d="M22 13a18.15 18.15 0 0 1-20 0"/><rect width="20" height="14" x="2" y="6" rx="2"/></svg>
          <h3 style="font-weight: bold; margin-left: 4;">Job Management</h3>
        </div>
        <p>
          This section helps you view and manage all your posted jobs.<br/>
          Track applications, edit job details, and control visibility.
        </p>
      </div>
    `,
      position: "right",
    },
    {
      element: "#Databases",
      intro: `
      <div style="text-align: left;">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0784C9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-database-icon lucide-database"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/></svg>
          <h3 style="font-weight: bold; margin-left: 4;">Talent Database</h3>
        </div>
        <p>
          Access a pool of potential candidates here.<br/>
          Search, filter, and explore talent that matches your job needs.
        </p>
      </div>
    `,
      position: "right",
    },
    {
      element: "#Reports",
      intro: `
      <div style="text-align: left;">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-clipboard-minus-icon lucide-clipboard-minus"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M9 14h6"/></svg>
          <h3 style="font-weight: bold; margin-left: 4;">Analytics & Reports</h3>
        </div>
        <p>
          View detailed insights on job performance, application trends,<br/>
          and overall engagement to improve your hiring strategy.
        </p>
      </div>
    `,
      position: "right",
    },
    {
      element: "#Credits",
      intro: `
      <div style="text-align: left;">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-wallet-icon lucide-wallet"><path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/></svg>
          <h3 style="font-weight: bold; margin-left: 4;">Job Post Credits</h3>
        </div>
        <p>
          Keep track of your remaining job credits here.<br/>
          Running low? Upgrade your plan to post more jobs instantly.
        </p>
      </div>
    `,
      position: "right",
    },
    {
      element: "#Bills",
      intro: `
      <div style="text-align: left;">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0784C9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-receipt-indian-rupee-icon lucide-receipt-indian-rupee"><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"/><path d="M8 7h8"/><path d="M12 17.5 8 15h1a4 4 0 0 0 0-8"/><path d="M8 11h8"/></svg>
          <h3 style="font-weight: bold; margin-left: 4;">Billing & Invoices</h3>
        </div>
        <p>
          View your past payments, download invoices,<br/>
          and manage your subscription plans with ease.
        </p>
      </div>
    `,
      position: "right",
    },
  ];

 useEffect(() => {

  
  const hasSeenIntro = localStorage.getItem("introExit") === "true";
 
   const stepsReady = () => {
    return steps.every((step) => {
      const el = document.querySelector(step.element);
      if (!el) return false;
      const rect = el.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    });
  };

  if (hasSeenIntro){
    setStepsDone(false);
    return
  }else{

    const startIntroWhenReady = () => {
      if (stepsReady()) {
        setStepsDone(true); 
        observer.disconnect();
      } else {
        setTimeout(startIntroWhenReady, 200);
      }
    };
  
    const observer = new MutationObserver(() => {
      if (stepsReady()) {
        setStepsDone(true);
        observer.disconnect();
      }
    });
  
    observer.observe(document.body, { childList: true, subtree: true });
  
    setTimeout(startIntroWhenReady, 300);
  
    return () => observer.disconnect();
  }
 

}, []);

  return (
    <>
      {stepEnable && (
        <Steps
          enabled={stepsDone}
          steps={steps}
          initialStep={0}
          onExit={() => {
            setStepsDone(false);
            localStorage.setItem("introExit", "true"); // Must be a string
          }}
          onComplete={() => {
            setStepsDone(false);
            localStorage.setItem("introExit", "true"); // Handle both exit & completion
          }}
        />
      )}
      <div className="flex flex-col w-[100vw] h-[100vh]">
        <div className="flex flex-col w-full">
          <Header onMenuClick={handleMenuClick} />
        </div>

        <div className="flex flex-row w-full fixed top-[50px] md:top-[56px]">
          <Sidebar
            collapsed={isCollapsed}
            mobileVisible={mobileVisible}
            onCloseMobile={handleMenuClick}
          />
          <div
            style={{
              height: "calc(100vh - 50px)",
              width: "100%",
              overflow: "auto",
            }}
          >
            <Outlet context={{ onIntroReady: () => setStepEnable(true) }} />
          </div>
        </div>
      </div>
       {/* <Box
        sx={{
          position: "fixed",
          right: "5vw",
          bottom: "10vh",
          zIndex: 1000,
        }}
         onClick={()=> window.location.href = `tel:${9211336926}`}
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          style={{
            background: "linear-gradient(90deg, #003B70, #0784C9)", 
            padding: "12px",
            borderRadius: "50%",
            display: "inline-block",
          }}
        >
          <PhoneCall color= "white" />
        </motion.div>
      </Box> */}

    </>
  );
};

export default Dashboard;
