const parseStorageJson = (key, fallback = null) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw || raw === "undefined" || raw === "null") return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
};

export const isPlanValid = () => {
  const user = parseStorageJson("user", {});
  // if (user?.free_claimed === true) return true;

  const plan = parseStorageJson("plan", null);
  if (!plan) return false;

  const isActiveByFlag = plan?.isActive === true;
  const isActiveByStatus = String(plan?.status || "").toLowerCase() === "active";
  if (!isActiveByFlag && !isActiveByStatus) return false;

  if (!plan?.endDate) return true;

  const endDate = new Date(plan.endDate);
  if (Number.isNaN(endDate.getTime())) return false;

  return new Date() <= endDate;
};


