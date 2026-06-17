import React from "react";

export default function BrandLoader({ label = "Loading your dashboard..." }) {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#f5f7fb] px-4">
      <div className="relative flex flex-col items-center">
        <div className="relative flex h-32 w-32 items-center justify-center">
          <span className="absolute h-24 w-24 rounded-2xl bg-[#e9f0ff] blur-md animate-pulse" />
          <img
            src="/logo-1.png"
            alt="TrafficSaviour"
            className="relative h-20 w-20 rounded-xl object-contain drop-shadow-[0_8px_18px_rgba(60,121,255,0.35)] animate-[floatY_2.2s_ease-in-out_infinite]"
          />
        </div>
        <h2 className="mt-3 text-[22px] font-extrabold tracking-[0.01em] text-[#0f172a]">
          TrafficSaviour
        </h2>
        <p className="mt-4 text-sm font-semibold tracking-[0.02em] text-[#334155]">
          {label}
        </p>
      </div>
      <style>{`
        @keyframes floatY {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  );
}
