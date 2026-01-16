export const isPlanValid = () => {
  const plan = JSON.parse(localStorage.getItem("plan"));

  if (!plan) return false;
  if (plan.status !== "Paid") return false;

  const today = new Date();
  const endDate = new Date(plan.end_date);

  return today <= endDate;
};


