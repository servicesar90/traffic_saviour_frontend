import { BROWSER_LIST } from "../data/dataList";

export const getBrowserIcon = (browserName) => {
  if (!browserName) return "https://img.icons8.com/color/48/000000/browser.png";

  const browser = BROWSER_LIST.find(
    (b) => b.browser.toLowerCase() === browserName.toLowerCase()
  );

  if (!browser) return "https://img.icons8.com/color/48/000000/browser.png";

  const icons8Fixes = {
    "samsungbrowser": "samsung-internet",
    "xiaomibrowser": "xiaomi",
    "nokiabrowser": "nokia",
    "ucbrowser": "uc-browser",
    "flock": "flock",
    "edge": "microsoft-edge",
    "opera": "opera",
    "interntexplorer": "internet-explorer",
    "chrome": "chrome",
    "firefox": "firefox",
    "safari": "safari",
    "ibrowser": "ibrowser",
    "ubuntubrowser": "ubuntu",
  };

  const iconName = icons8Fixes[browser.browser.toLowerCase().replace(/\s/g, "")] || "browser";

  return `https://img.icons8.com/color/48/000000/${iconName}--v1.png`;
};
