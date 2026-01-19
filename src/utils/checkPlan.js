export const isPlanValid = () => {
  const plan = JSON.parse(localStorage.getItem("plan"));

  if (!plan) return false;
  if (!plan.isActive) return false;

  const today = new Date();
  const endDate = new Date(plan.endDate);

  return today <= endDate;
};


