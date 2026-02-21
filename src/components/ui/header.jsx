import {
  Menu,
  LogOut,
  User,
  HelpCircle,
  DollarSign
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
    const response = await apiFunction("get", signOutApi, null, null);
    if (response) {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("plan");
      localStorage.removeItem("todo_tasks");

      navigate("/");
    }else{
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("plan");
      localStorage.removeItem("todo_tasks");

      navigate("/");
    }
  };


  

  return (
    <header className="w-full flex items-center justify-between bg-[#1e2939] px-6 py-3 shadow-sm  border-gray-200 text-white ">
      {/* Left: Logo + Menu */}
      <div className="flex items-center gap-4 text-white">
  <img
     src="/logo2.svg"
  alt="Click Stopper"
  role="button"
  tabIndex={0}
  onClick={onMenuClick}
 
  className="w-10 h-10 cursor-pointer"
  />
  <span className="text-[#a855f7] font-semibold text-xl ml-[-10px]">
    Click Stopper
  </span>
</div>


      {/* Right: Plan Info + Avatar */}
      <div className="flex items-center gap-6">
        {/* Plan Info (side by side with labels) */}
       {/* <button onClick={()=>}></button> */}
        <div className="flex items-center gap-4 text-sm font-medium text-gray-700">
          <span>
            <span className="text-white mr-1 font-normal">Plan Name:</span>
            <span className="text-green-600">{planName || "N/A"}
          </span></span>
          <span>
            <span className="text-white mr-1 font-normal">Status:</span>
            <span
              className={`font-semibold ${
                planStatus === "Active"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {planStatus || "N/A"}
            </span>
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
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-purple-700 text-white flex items-center justify-center font-bold text-sm">
                {user?.name ? user.name.charAt(0).toUpperCase() : "?"}
              </div>
            )}
          </div>

          {/* Dropdown Menu */}
          {showProfileModal && (
            <div className="absolute right-0 mt-2 w-44 rounded-md bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 z-50">
              <div className="py-1">
                {/* My Profile */}
             
                <button
                  onClick={() => navigate("/myProfile")}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 cursor-pointer"
                >
                  <User className="w-4 h-4 mr-2" />My Profile
                </button>

                {/* billing */}

                <button
                  onClick={() => navigate("/Dashboard/pricing")}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 cursor-pointer"
                >
                  <DollarSign className="w-4 h-4 mr-2" />Pricing
                </button>

                {/* Help */}
                <button
                  onClick={() => navigate("/help")}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 cursor-pointer"
                >
                  <HelpCircle className="w-4 h-4 mr-2" /> Help
                </button>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 cursor-pointer"
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
