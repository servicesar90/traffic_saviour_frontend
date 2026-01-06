import { COUNTRY_LIST } from "../data/dataList";

export const getCountryIcon = (countryValue) => {
  if (!countryValue) return "https://flagcdn.com/w20/un.png";

  const val = countryValue.toString().toLowerCase().trim();

  if (["unknown", "null", "undefined"].includes(val)) {
    return "https://flagcdn.com/w20/un.png";
  }

  const byCode = COUNTRY_LIST.find((c) => c.code === val);
  if (byCode) {
    return `https://flagcdn.com/w20/${byCode.code}.png`;
  }

  const byName = COUNTRY_LIST.find(
    (c) => c.country.toLowerCase() === val
  );
  if (byName) {
    return `https://flagcdn.com/w20/${byName.code}.png`;
  }

  return "https://flagcdn.com/w20/un.png";
};
