export const isPlanValid = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  if (user?.free_claimed === true) return true;

  const plan = JSON.parse(localStorage.getItem("plan"));

  if (!plan) return false;
  if (!plan.isActive) return false;

  const today = new Date();
  const endDate = new Date(plan.endDate);

  return today <= endDate;
};


