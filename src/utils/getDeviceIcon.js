import { DEVICE_LIST2 } from "../data/dataList";

export const getDeviceIcon = (deviceName) => {
  const device = DEVICE_LIST2.find(
    (d) => d.device.toLowerCase() === deviceName?.toLowerCase()
  );

  return device ? device.icon : null;
};
