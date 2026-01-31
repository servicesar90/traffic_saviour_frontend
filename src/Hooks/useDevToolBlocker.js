import { useEffect, useRef } from "react";

export default function useDevToolsBlocker() {
  const blocked = useRef(false);

  useEffect(() => {
     const isBlockedPage = window.location.pathname === "/devtools-blocked";

    const block = () => {
      if (blocked.current || isBlockedPage) return;
      blocked.current = true;

      sessionStorage.setItem("devtools-blocked", "1");
      window.location.replace("/devtools-blocked");
    };

    // 1️⃣ Window Size Check
    const detectSize = () => {
      const threshold = 140;
      if (
        window.outerWidth - window.innerWidth > threshold ||
        window.outerHeight - window.innerHeight > threshold
      ) {
        block();
      }
    };

    // 2️⃣ Debugger Detection
    const detectDebugger = () => {
      const start = performance.now();
      debugger;
      const diff = performance.now() - start;

      if (diff > 35) {
        block();
      }
    };

    // 3️⃣ Console Fingerprinting
    const detectConsole = () => {
      const img = new Image();
      Object.defineProperty(img, "id", {
        get: () => block(),
      });
      console.log(img);
    };

    // 4️⃣ Keyboard Shortcuts block (F12, Ctrl+Shift+I, Ctrl+U etc)
    const disableKeys = (e) => {
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && ["I", "J", "C"].includes(e.key)) ||
        (e.ctrlKey && e.key === "U")
      ) {
        e.preventDefault();
        e.stopPropagation();
        block();
      }
    };

    // 5️⃣ Right-click disable
    const disableRightClick = (e) => {
      e.preventDefault();
      block();
    };

    window.addEventListener("contextmenu", disableRightClick);
    window.addEventListener("keydown", disableKeys);

    // 6️⃣ Run detection every 1 second (optimized)
    const interval = setInterval(() => {
      detectSize();
      detectDebugger();
      detectConsole();
    }, 1000);

    return () => {
      clearInterval(interval);
      window.removeEventListener("contextmenu", disableRightClick);
      window.removeEventListener("keydown", disableKeys);
    };
  }, []);
}
