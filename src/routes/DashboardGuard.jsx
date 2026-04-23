import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { isPlanValid } from "../utils/checkPlan";
import PlanRequiredModal from "../components/PlanRequireModal";
import { apiFunction } from "../api/ApiFunction";
import { signOutApi } from "../api/Apis";

const PLAN_ALLOWED_ROUTES = new Set([
  "/Dashboard/pricing",
  "/Dashboard/billing",
]);

export default function DashboardGuard({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPlanModal, setShowPlanModal] = useState(false);

  const clearSession = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("plan");
    localStorage.removeItem("todo_tasks");
  };

  const handleLogout = async () => {
    try {
      const response = await apiFunction("get", signOutApi, null, null);
      if (response) {
        clearSession();
      }
    } catch (error) {
      clearSession();
    } finally {
      setShowPlanModal(false);
      navigate("/signin");
    }
  };

  const handleUpgrade = () => {
    setShowPlanModal(false);
    navigate("/Dashboard/pricing");
  };

  useEffect(() => {
    const isAllowedRoute = PLAN_ALLOWED_ROUTES.has(location.pathname);
    const shouldBlock = !isPlanValid() && !isAllowedRoute;
    setShowPlanModal(shouldBlock);
  }, [location.pathname]);

  return (
    <>
      {children}

      <PlanRequiredModal
        open={showPlanModal}
        onLogout={handleLogout}
        onUpgrade={handleUpgrade}
      />
    </>
  );
}
