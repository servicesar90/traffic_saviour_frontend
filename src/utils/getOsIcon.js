export const getOSIcon = (osName) => {
  if (!osName) return "https://img.icons8.com/color/48/000000/help--v1.png"; // fallback icon

  const os = osName.toLowerCase();

  // Mapping OS names to Icons8 PNG
  const osIcons = {
    windows: "windows-10",
    "windows 7": "windows-7",
    "windows 8": "windows-8",
    "windows xp": "windows-xp",
    mac: "mac-os",
    "mac os x": "mac-os",
    linux: "linux",
    ubuntu: "ubuntu",
    fedora: "fedora",
    debian: "debian",
    centos: "centos",
    android: "android",
    ios: "ios",
    "iphone os": "ios",
    ipad: "ipad",
    "blackberry os": "blackberry",
    chromeos: "chrome-os",
    "tizen": "tizen",
    "kaios": "kaios",
    "amazon fire os": "amazon-fire",
    "windows phone": "windows-phone",
    "solaris": "solaris",
    "freebsd": "freebsd",
    "raspberry pi os": "raspberry-pi",
  };

  // Loop through mapping and return first match
  for (let key in osIcons) {
    if (os.includes(key)) {
      return `https://img.icons8.com/color/48/000000/${osIcons[key]}.png`;
    }
  }

  // fallback unknown OS
  return "https://img.icons8.com/color/48/000000/help--v1.png";
};
