import { COUNTRY_LIST } from "../data/dataList";

export const getCountryIcon = (countryValue, requestedWidth = 20) => {
  const supportedWidths = [20, 40, 80, 160, 320];
  const width = supportedWidths.includes(Number(requestedWidth))
    ? Number(requestedWidth)
    : 20;

  if (!countryValue) return `https://flagcdn.com/w${width}/un.png`;

  const val = countryValue.toString().toLowerCase().trim();

  if (["unknown", "null", "undefined"].includes(val)) {
    return `https://flagcdn.com/w${width}/un.png`;
  }

  const byCode = COUNTRY_LIST.find((c) => c.code === val);
  if (byCode) {
    return `https://flagcdn.com/w${width}/${byCode.code}.png`;
  }

  const byName = COUNTRY_LIST.find(
    (c) => c.country.toLowerCase() === val
  );
  if (byName) {
    return `https://flagcdn.com/w${width}/${byName.code}.png`;
  }

  return `https://flagcdn.com/w${width}/un.png`;
};
