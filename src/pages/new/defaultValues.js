import { adPlatforms } from "./constants";

export const defaultValues = {
  campaignName: null,
  comment: null,
  epc: null,
  cpc: null,
  trafficSource: adPlatforms[0],
  money_page: [{ description: "", url: "", weight: 100 }],
  safe_page: null,
  conditions: [],
  filters: [],
  afterX: null,
  automate: {
    frequencyCap: { value: "" },
    zeroRedirect: { curl: false, iframe: false },
    gclid: false,
    ipCap: false,
  },
  page_guard: { key: "", url: "", second: "" },
  http_code: "301",
};
