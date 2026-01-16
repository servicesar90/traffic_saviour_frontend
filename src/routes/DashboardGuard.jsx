import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { isPlanValid } from "../utils/checkPlan";
import PlanRequiredModal from "../components/PlanRequireModal";
import { apiFunction } from "../api/ApiFunction";
import { signOutApi } from "../api/Apis";

const Plan_Allowed_Routes = [
"/Dashboard/pricing",
  "/Dashboard/billing"
]

export default function DashboardGuard({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPlanModal, setShowPlanModal] = useState(false);

 const handleLogout = async () => {
    const response = await apiFunction("get", signOutApi, null, null);
    if (response) {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("plan");
      localStorage.removeItem("todo_tasks");

      navigate("/signin");
    }
  };


  useEffect(() => {
     const isAllowedRoute = Plan_Allowed_Routes.includes(location.pathname);
    if (!isPlanValid() && !isAllowedRoute) {
      setShowPlanModal(true);
    } else {
      setShowPlanModal(false);
    }
  }, [location.pathname]);

  return (
    <>
      {children}

      <PlanRequiredModal
        open={showPlanModal}
        onLogout={handleLogout}
        onUpgrade={() => navigate("/Dashboard/pricing")}
      />
    </>
  );
}
