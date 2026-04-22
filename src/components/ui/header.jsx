import {
  Menu,
  LogOut,
  Settings,
  Headphones,
  CreditCard,
  Search,
  Bell,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFunction } from "../../api/ApiFunction";
import { getUpdatedPlan, signOutApi } from "../../api/Apis";
import profileCharacter from "../../assets/vecteezy_friendly-3d-animated-character-with-glasses-smiling_57357673.png";

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
          className="h-9 w-9 rounded-lg flex items-center justify-center text-[#2b1f57] hover:bg-slate-100 cursor-pointer transition"
          aria-label="Toggle sidebar"
        >
          <Menu size={18} />
        </button>
        <div className="flex items-center gap-2 rounded-xl  bg-white px-3 py-2 ">
          <img src="/logo-1.png" alt="TrafficSaviour" className="w-12 h-12" />
          <div className="leading-tight">
            <p className="text-xl font-semibold text-slate-900">TrafficSaviour</p>
            
          </div>
        </div>
      </div>

      {/* Right: Search + Actions + Avatar */}
      <div className="flex items-center gap-4 flex-shrink-0">
        

       

        <div className="hidden md:flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600 shadow-[0_6px_16px_rgba(15,23,42,0.05)] flex-shrink-0">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          <span className="font-medium">{planName || "Starter"}</span>
          <span className="text-slate-400">|</span>
          <span className={planStatus === "Active" ? "text-emerald-600" : "text-rose-500"}>
            {planStatus || "Active"}
          </span>
        </div>

        {/* Avatar + Dropdown */}
        <div className="relative flex-shrink-0 ml-auto" ref={avatarRef}>
          <div
            onClick={() => setShowProfileModal(!showProfileModal)}
            className="cursor-pointer relative group"
          >
            <div className="h-10 w-10 flex items-center justify-center rounded-full border-8 border-slate-400 hover:border-slate-500 transition">
              {user?.image ? (
                <img
                  src={user.image}
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <img
                  src={profileCharacter}
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover"
                />
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 bg-white border-2 border-slate-400 rounded-full p-0.5 flex items-center justify-center">
              <svg className="w-3 h-3 text-slate-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

          {/* Dropdown Menu */}
          {showProfileModal && (
            <div className="absolute right-0 mt-3 w-56 rounded-lg bg-white shadow-[0_10px_30px_rgba(15,23,42,0.15)] z-50 border border-slate-200 overflow-hidden font-['Nunito_Sans']">
              <div className="py-2">
                <button
                  onClick={() => navigate("/myProfile")}
                  className="flex items-center w-full px-4 py-2.5 text-sm text-slate-700 hover:bg-blue-50 cursor-pointer transition font-medium"
                >
                  <Settings className="w-4 h-4 mr-3 text-slate-500" /> Account Settings
                </button>

                <button
                  onClick={() => navigate("/Dashboard/pricing")}
                  className="flex items-center w-full px-4 py-2.5 text-sm text-slate-700 hover:bg-blue-50 cursor-pointer transition font-medium"
                >
                  <CreditCard className="w-4 h-4 mr-3 text-slate-500" /> Billing & Plans
                </button>

                <button
                  onClick={() => navigate("/help")}
                  className="flex items-center w-full px-4 py-2.5 text-sm text-slate-700 hover:bg-blue-50 cursor-pointer transition font-medium"
                >
                  <Headphones className="w-4 h-4 mr-3 text-slate-500" /> Support Center
                </button>

                <div className="border-t border-slate-100 my-1" />

                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 cursor-pointer transition font-medium"
                >
                  <LogOut className="w-4 h-4 mr-3" /> Sign Out
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

