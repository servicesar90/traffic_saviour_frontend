import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function RightComponent() {
  const [tab, setTab] = useState(1);

  return (
    <div className="relative hidden md:flex flex-1 items-center justify-center overflow-hidden">

      {/* 🌌 BACKGROUND GRADIENT */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_#7c3aed33,_transparent_70%)]" />

      {/* ✨ GRID */}
      <div className="absolute w-[420px] h-[420px] grid grid-cols-8 grid-rows-8 opacity-20">
        {[...Array(64)].map((_, i) => (
          <div key={i} className="border border-purple-500/10" />
        ))}
      </div>

      {/* 💫 HALO PULSE */}
      <motion.div
        animate={{ scale: [1, 1.08, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute w-[360px] h-[360px] rounded-full bg-purple-500/30 blur-[80px]"
      />

      {/* 🧠 CENTER ICON CARD */}
      <div className="relative z-10 flex flex-col items-center">

        {/* Floating Card */}
        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="w-16 h-16 rounded-xl bg-[#0b1228] border border-purple-500/40 flex items-center justify-center shadow-[0_0_30px_#7c3aed]"
        >
          ⚡
        </motion.div>

        {/* Tabs */}
        <div className="mt-10 flex flex-col gap-3 w-[260px]">
          <TabButton active={tab === 1} onClick={() => setTab(1)}>
            Real-time fraud filtration
          </TabButton>
          <TabButton active={tab === 2} onClick={() => setTab(2)}>
            Adaptive cloaking logic
          </TabButton>
          <TabButton active={tab === 3} onClick={() => setTab(3)}>
            Advertiser & user verification
          </TabButton>
        </div>

        {/* Dynamic Icon */}
        <div className="relative mt-8 h-14">
          <AnimatePresence mode="wait">
            {tab === 1 && <Icon key="1">⚡</Icon>}
            {tab === 2 && <Icon key="2">🧩</Icon>}
            {tab === 3 && <Icon key="3">✔️</Icon>}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/* ---------- COMPONENTS ---------- */

function TabButton({ children, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-3 rounded-lg text-sm text-left transition
        ${active
          ? "bg-purple-500/30 text-white shadow-[0_0_15px_#7c3aed]"
          : "bg-white/5 text-purple-200 hover:bg-white/10"}
      `}
    >
      {children}
    </button>
  );
}

function Icon({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.6 }}
      transition={{ duration: 0.25 }}
      className="text-3xl text-purple-300"
    >
      {children}
    </motion.div>
  );
}
