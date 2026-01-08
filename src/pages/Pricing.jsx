import React, { useState } from "react";

/* ===================== DATA ===================== */

const plans = [
  {
    name: "Starter",
    basePrice: 19,
    campaigns: "1 Campaign",
    clicks: "1,000 Clicks",
    features: [
      "VPN / Proxy Protection",
      "Bot Protection",
      "Block Empty Referrer",
      "Block Blacklist IP's",
      "Country Targeting",
      "Device Targeting",
      "OS Targeting",
      "Download Report",
      "Realtime Click Report",
    ],
  },
  {
    name: "Pro",
    basePrice: 99,
    campaigns: "5 Campaigns",
    clicks: "5,000 Clicks",
    popular: true,
    features: [
      "VPN / Proxy Protection",
      "Bot Protection",
      "Block Empty Referrer",
      "Block Blacklist IP's",
      "Country Targeting",
      "Device Targeting",
      "OS Targeting",
      "Download Report",
      "Realtime Click Report",
      "Safe Page",
      "Money Page",
    ],
  },
  {
    name: "Enterprise",
    basePrice: 149,
    campaigns: "20 Campaigns",
    clicks: "Unlimited Clicks",
    features: [
      "VPN / Proxy Protection",
      "Bot Protection",
      "Block Empty Referrer",
      "Block Blacklist IP's",
      "Country Targeting",
      "Device Targeting",
      "OS Targeting",
      "Download Report",
      "Realtime Click Report",
      "Safe Page",
      "Money Page",
    ],
  },
];

const discounts = {
  monthly: 0,
  quarterly: 10,
  yearly: 20,
};

const PAYMENT_DETAILS = {
  ERC20: {
    address: "0x8A8e46327fdA6ca4505bCBE5d7839a591ee82A32",
    qr: "/ERC.jpeg",
  },
  TRC20: {
    address: "TN26mZ3G2RyFbbUT2T7CMn42tBBX8hLo9W",
    qr: "/TRC.jpeg",
  },
};


/* ===================== COMPONENT ===================== */

export default function Pricing() {
  const [billing, setBilling] = useState("monthly");

  // MODAL STATE
  const [modalStep, setModalStep] = useState(0); // 0=closed
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [network, setNetwork] = useState("");



  /* ===== PRICE LOGIC (UNCHANGED) ===== */
  const calculateMonthlyPrice = (price) => {
    const discount = discounts[billing];
    return Math.round(price - (price * discount) / 100);
  };
  const getBillingMultiplier = () => {
  if (billing === "quarterly") return 3;
  if (billing === "yearly") return 12;
  return 1; // monthly
};
  const monthlyPrice = selectedPlan
  ? calculateMonthlyPrice(selectedPlan.basePrice)
  : 0;

const totalAmount = monthlyPrice * getBillingMultiplier();



  







  /* ===================== UI ===================== */

  return (
    <div className="min-h-screen bg-[#0b0d14] text-gray-100 px-6 py-14">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white">
            Simple, Transparent Pricing
          </h1>
          <p className="text-gray-400 mt-3">
            Choose the plan that fits your business needs
          </p>
        </div>

        {/* BILLING TOGGLE */}
        <div className="flex justify-center mb-14">
          <div className="bg-[#1E293B] p-1 rounded-xl flex gap-1">
            {["monthly", "quarterly", "yearly"].map((type) => (
              <button
                key={type}
                onClick={() => setBilling(type)}
                className={`px-6 py-2 rounded-lg text-sm font-medium transition ${
                  billing === type
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-700"
                }`}
              >
                {type}
                {type !== "monthly" && (
                  <span className="ml-2 text-xs text-green-400">
                    {discounts[type]}% OFF
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={`relative bg-[#1E293B] border rounded-2xl p-8 ${
                plan.popular
                  ? "border-blue-500 ring-1 ring-blue-500"
                  : "border-gray-700"
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs px-4 py-1 rounded-full">
                  Most Popular
                </span>
              )}

              <h3 className="text-xl font-semibold">{plan.name}</h3>

              <div className="mt-4">
                <span className="text-4xl font-bold">
                  ${calculateMonthlyPrice(plan.basePrice)}
                </span>
               <span className="text-gray-400 ml-2">/ monthly</span>

              </div>

              <p className="mt-3 text-gray-400 text-sm">
                {plan.campaigns} • {plan.clicks}
              </p>

              <ul className="mt-6 space-y-2 text-sm">
                {plan.features.map((f, idx) => (
                  <li key={idx} className="flex gap-2">
                    <span className="text-green-400">✔</span>
                    {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => {
                  setSelectedPlan(plan);
                  setModalStep(1);
                }}
                className={`mt-8 w-full py-3 rounded-xl ${
                  plan.popular
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-gray-700 hover:bg-gray-600"
                }`}
              >
                Choose Plan
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ===================== MODAL ===================== */}
      {modalStep > 0 && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#111827] w-full max-w-md rounded-2xl p-6 border border-gray-700 relative">

            {/* CLOSE */}
            <button
              onClick={() => setModalStep(0)}
              className="absolute top-3 right-4 text-gray-400 hover:text-white"
            >
              ✕
            </button>

            {/* STEP 1 */}
            {modalStep === 1 && (
              <>
                <h2 className="text-xl font-bold">Confirm Purchase</h2>
                <p className="text-yellow-400 mt-2">
                  Are you sure you want to activate{" "}
                  <b>{selectedPlan.name}</b>?
                </p>

                <div className="mt-6 space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      checked={paymentMethod === "usdt"}
                      onChange={() => setPaymentMethod("usdt")}
                    />
                    <span>USDT</span>
                  </label>

                  <label className="flex items-center gap-3 opacity-50">
                    <input type="radio" disabled />
                    <span>Card (Coming Soon)</span>
                  </label>
                </div>

                <div className="flex justify-between mt-6">
                  <button onClick={() => setModalStep(0)}>Close</button>
                  <button
                    disabled={!paymentMethod}
                    onClick={() => setModalStep(2)}
                    className="bg-blue-600 px-4 py-2 rounded"
                  >
                    Continue
                  </button>
                </div>
              </>
            )}

            {/* STEP 2 */}
            {modalStep === 2 && (
              <>
                <h2 className="text-xl font-bold">Select Network</h2>

                <div className="mt-6 space-y-3">
                  {["ERC20", "TRC20"].map((n) => (
                    <label key={n} className="flex gap-3 cursor-pointer">
                      <input
                        type="radio"
                        checked={network === n}
                        onChange={() => setNetwork(n)}
                      />
                      {n}
                    </label>
                  ))}
                </div>

                <div className="flex justify-between mt-6">
                  <button onClick={() => setModalStep(1)}>Back</button>
                  <button
                    disabled={!network}
                    onClick={() => setModalStep(3)}
                    className="bg-blue-600 px-4 py-2 rounded"
                  >
                    Continue
                  </button>
                </div>
              </>
            )}

            {/* STEP 3 */}
            {/* STEP 3 */}
{

modalStep === 3 && 


(
    
  <>
    <h2 className="text-xl font-bold">Confirm Purchase</h2>

    <p className="mt-2 text-sm">
      You selected <b>USDT</b> on <b>{network}</b> network
    </p>

    <img
      src={PAYMENT_DETAILS[network].qr}
       alt={`${network} QR`}

      className="mx-auto mt-4 w-36"
    />

    <div className="mt-4">
      <label className="text-sm">Amount to Pay</label>
      <input
        disabled
        value={`${totalAmount} USDT`}
        className="w-full mt-1 p-2 bg-gray-800 rounded"
      />
    </div>

    <div className="mt-4">
      <label className="text-sm">Pay to this address</label>
     <input
  disabled
  value={PAYMENT_DETAILS[network].address}
  className="w-full mt-1 p-2 bg-gray-800 rounded"
/>

    </div>

    <div className="mt-4">
      <label className="text-sm">Transaction Hash</label>
      <input
        placeholder="Enter transaction hash"
        className="w-full mt-1 p-2 bg-gray-800 rounded"
      />
    </div>

    <div className="flex justify-between mt-6">
      <button onClick={() => setModalStep(2)}>Back</button>
      <button className="bg-green-600 px-4 py-2 rounded">
        Confirm Payment
      </button>
    </div>
  </>
)}

          </div>
        </div>
      )}
    </div>
  );
}
