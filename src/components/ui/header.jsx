import {
  Menu,
  LogOut,
  User,
  HelpCircle,
  DollarSign,
  Search,
  Bell,
  Settings,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFunction } from "../../api/ApiFunction";
import { getUpdatedPlan, signOutApi } from "../../api/Apis";

const Header = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const avatarRef = useRef(null);
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [planName, setPlanName]= useState();
  const [planStatus,setPlanStatus]= useState();

  // Example plan data (replace later with API)
 

 const fetchUpdatedPlan = async () => {
  try {
    const response = await apiFunction("get", getUpdatedPlan, null, null);
    

    const plan = response?.data?.data;
   
    

    if (plan) {
      localStorage.setItem("plan", JSON.stringify(plan));
        setPlanName(plan?.Plan?.name);
  setPlanStatus(plan?.status);
    }
  } catch (err) {
    // console.log(err);
  }
};





  // ✅ Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (avatarRef.current && !avatarRef.current.contains(event.target)) {
        setShowProfileModal(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
   
  }, []);
  useEffect(()=>{
    
   
    fetchUpdatedPlan();
  
  },[]);

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


  

  return (
    <header className="w-full flex items-center justify-between bg-white/90 px-6 py-4 border-b border-slate-200 text-slate-900 backdrop-blur shadow-[0_6px_20px_rgba(15,23,42,0.06)]">
      {/* Left: Brand + Collapse */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="h-9 w-9 rounded-lg border border-slate-200 flex items-center justify-center text-[#2b1f57] hover:bg-slate-100 transition"
          aria-label="Toggle sidebar"
        >
          <Menu size={18} />
        </button>
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-[0_8px_20px_rgba(15,23,42,0.06)]">
          <img src="/logo2.svg" alt="TrafficSaviour" className="w-7 h-7" />
          <div className="leading-tight">
            <p className="text-sm font-semibold text-slate-900">TrafficSaviour</p>
            <p className="text-xs text-slate-500">Agency Dashboard</p>
          </div>
        </div>
      </div>

      {/* Right: Search + Actions + Avatar */}
      <div className="flex items-center gap-4">
        <div className="hidden lg:flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-500 w-[300px] shadow-[0_8px_20px_rgba(15,23,42,0.06)]">
          <Search size={16} className="text-slate-400" />
          <input
            className="bg-transparent outline-none w-full text-slate-700 placeholder:text-slate-400"
            placeholder="Search campaigns, reports..."
          />
        </div>

        <div className="hidden md:flex items-center gap-2">
          <button className="h-9 w-9 rounded-lg border border-slate-200 flex items-center justify-center text-[#2b1f57] hover:bg-slate-100 transition">
            <Bell size={16} />
          </button>
          <button className="h-9 w-9 rounded-lg border border-slate-200 flex items-center justify-center text-[#2b1f57] hover:bg-slate-100 transition">
            <Settings size={16} />
          </button>
        </div>

        <div className="hidden md:flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600 shadow-[0_6px_16px_rgba(15,23,42,0.05)]">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          <span className="font-medium">{planName || "Starter"}</span>
          <span className="text-slate-400">|</span>
          <span className={planStatus === "Active" ? "text-emerald-600" : "text-rose-500"}>
            {planStatus || "Active"}
          </span>
        </div>

        {/* Avatar + Dropdown */}
        <div className="relative" ref={avatarRef}>
          <div
            onClick={() => setShowProfileModal(!showProfileModal)}
            className="cursor-pointer"
          >
            {user?.image ? (
              <img
                src={user.image}
                alt="Profile"
                className="w-9 h-9 rounded-full object-cover"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center font-semibold text-sm">
                {user?.name ? user.name.charAt(0).toUpperCase() : "?"}
              </div>
            )}
          </div>

          {/* Dropdown Menu */}
          {showProfileModal && (
            <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white shadow-lg ring-1 ring-black/5 z-50 border border-slate-200">
              <div className="py-2">
                <button
                  onClick={() => navigate("/myProfile")}
                  className="flex items-center w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  <User className="w-4 h-4 mr-2" /> My Profile
                </button>

                <button
                  onClick={() => navigate("/Dashboard/pricing")}
                  className="flex items-center w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  <DollarSign className="w-4 h-4 mr-2" /> Pricing
                </button>

                <button
                  onClick={() => navigate("/help")}
                  className="flex items-center w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  <HelpCircle className="w-4 h-4 mr-2" /> Help
                </button>

                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 cursor-pointer"
                >
                  <LogOut className="w-4 h-4 mr-2" /> Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

