import React, { useEffect, useState } from "react";
import BrandLoader from "../components/ui/BrandLoader";

export default function UrlShortenerTool() {
  const [bootLoading, setBootLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setBootLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  if (bootLoading) {
    return <BrandLoader label="Preparing URL Shortener..." />;
  }

  return (
    <div className="min-h-full rounded-md border border-[#d5d9e4] bg-white p-6 text-left">
      <h1 className="text-[24px] font-extrabold text-[#141824]">URL Shortener</h1>
      <p className="mt-2 text-[14px] text-[#64748b]">
        Route is ready. UI and functionality will be added next.
      </p>
    </div>
  );
}
