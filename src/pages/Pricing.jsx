import React, { useEffect, useState } from "react";
import { apiFunction, createApiFunction } from "../api/ApiFunction";
import { cryptoPayment, getPlans } from "../api/Apis";
import PayPalIntegration from "./paypalIntegration";
import { useNavigate } from "react-router-dom";

/* ===================== PAYMENT DETAILS ===================== */

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
  const [billing, setBilling] = useState("Monthly");
  const [plans, setPlans] = useState([]);
  const [loadingPlans, setLoadingPlans] = useState(true);

  // MODAL STATE
  const [modalStep, setModalStep] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [network, setNetwork] = useState("");
  const [txHash, setTxHash] = useState("");
  const [loading, setLoading] = useState(false);
  const [payload, setPayload] = useState(null);
  const navigate = useNavigate();

  /* ===================== FETCH PLANS ===================== */

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await createApiFunction("get", getPlans, null, null);

        if (res?.data?.success && Array.isArray(res.data.Plans)) {
          setPlans(res.data.Plans);
        }
      } finally {
        setLoadingPlans(false);
      }
    };

    fetchPlans();
  }, []);

  /* ===================== HELPERS ===================== */

  const resetPaymentState = () => {
    setModalStep(0);
    setSelectedPlan(null);
    setPaymentMethod("");
    setNetwork("");
    setTxHash("");
    setLoading(false);
    setPayload(null);
    // navigate("/Dashboard/billing");
  };

  const resetPaymentState1 = () => {
    setModalStep(0);
    setSelectedPlan(null);
    setPaymentMethod("");
    setNetwork("");
    setTxHash("");
    setLoading(false);
    setPayload(null);
    navigate("/Dashboard/billing");
  };

  const calculateStartEndDates = (billing) => {
    const start = new Date();
    const end = new Date(start);

    if (billing === "Monthly") end.setMonth(end.getMonth() + 1);
    if (billing === "quarterly") end.setMonth(end.getMonth() + 3);
    if (billing === "Yearly") end.setFullYear(end.getFullYear() + 1);

    return {
      start_date: start.toISOString(),
      end_date: end.toISOString(),
    };
  };

  const parseFeatures = (features) => {
    try {
      return JSON.parse(features);
    } catch {
      return [];
    }
  };

  const filteredPlans = plans.filter((plan) => {
    if (billing === "Monthly") return plan.durationInMonths === 1;
    if (billing === "quarterly") return plan.durationInMonths === 3;
    if (billing === "Yearly") return plan.durationInMonths === 12;
    return false;
  });

  const totalAmount = selectedPlan ? selectedPlan.price : 0;

  const makeCryptoPayment = async (payload) => {
    return await apiFunction("post", cryptoPayment, null, payload);
  };

  /* ===================== LOADER ===================== */

  if (loadingPlans) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading plans...
      </div>
    );
  }

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
            {["Monthly", "quarterly", "Yearly"].map((type) => {
              const discount =
                type === "quarterly"
                  ? "10% OFF"
                  : type === "Yearly"
                    ? "20% OFF"
                    : null;

              return (
                <button
                  key={type}
                  onClick={() => setBilling(type)}
                  className={`relative px-6 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${
                    billing === type
                      ? "bg-blue-600 text-white"
                      : "text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  {type}

                  {/* DISCOUNT BADGE */}
                  {discount && (
                    <span className="absolute -top-2 -right-2 bg-green-500 text-black text-[10px] font-bold px-2 py-[2px] rounded-full">
                      {discount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* PLANS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filteredPlans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-[#1E293B] border rounded-2xl p-8 ${
                plan.name.includes("Pro")
                  ? "border-blue-500 ring-1 ring-blue-500"
                  : "border-gray-700"
              }`}
            >
              {plan.name.includes("Pro") && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs px-4 py-1 rounded-full">
                  Most Popular
                </span>
              )}

              <h3 className="text-xl font-semibold">{plan.name}</h3>

              <div className="mt-4">
                <span className="text-4xl font-bold">${plan.price}</span>
                <span className="text-gray-400 ml-2">/ {billing}</span>
              </div>

              <p className="mt-3 text-gray-400 text-sm">
                {plan.maxCampaigns} Campaigns •{" "}
                {plan.clicksPerCampaign === -1
                  ? "Unlimited Clicks"
                  : `${plan.clicksPerCampaign} Clicks/Campaign`}
              </p>

              <ul className="mt-6 space-y-2 text-sm">
                {parseFeatures(plan.features).map((f, idx) => (
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
                className={`mt-8 w-full py-3 rounded-xl cursor-pointer ${
                  plan.name.includes("Pro")
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
          <div
            className={`w-full max-w-md rounded-2xl p-6 border relative
    ${
      modalStep === 2 && paymentMethod === "card"
        ? "bg-white border-gray-300"
        : "bg-[#111827] border-gray-700"
    }
  `}
          >
            <button
              onClick={resetPaymentState}
              className={`absolute top-3 right-4 cursor-pointer
                ${
                  modalStep === 2 && paymentMethod === "card"
                  ? "text-gray-400 hover:text-gray-800":" text-gray-400 hover:text-white"
                } `}
            >
              ✕
            </button>

            {/* STEP 1 */}
            {modalStep === 1 && (
              <>
                <h2 className="text-xl font-bold">Confirm Purchase</h2>
                <p className="text-yellow-400 mt-2">
                  Activate <b>{selectedPlan.name}</b> for <b>${totalAmount}</b>?
                </p>

                <div className="mt-6 space-y-3">
                  {["USDT", "card"].map((m) => (
                    <label key={m} className="flex gap-3 cursor-pointer">
                      <input
                        type="radio"
                        checked={paymentMethod === m}
                        onChange={() => setPaymentMethod(m)}
                      />
                      {m.toUpperCase()}
                    </label>
                  ))}
                </div>

                <div className="flex justify-between mt-6">
                  <button
                    className="cursor-pointer"
                    onClick={resetPaymentState}
                  >
                    Close
                  </button>
                  <button
                    disabled={!paymentMethod}
                    onClick={() => {
                      setModalStep(2);
                      console.log(paymentMethod);
                      
                      if (paymentMethod === "card") {
                        const { start_date, end_date } =
                          calculateStartEndDates(billing);
                        setPayload({
                          plan_id: selectedPlan.id,
                          plan_name: selectedPlan.name,
                          billing_cycle: billing,

                          method:
                            paymentMethod === "USDT"
                              ? "cryptocurrency"
                              : "card",

                          amount: totalAmount,

                          currency:
                            paymentMethod === "USDT"
                              ? network === "ERC20"
                                ? "USDT (ERC20)"
                                : "USDT (TRC20)"
                              : "USD",

                          start_date,
                          end_date,

                          payment_id: null,
                        });
                      }
                    }}
                    className="bg-blue-600 px-4 py-2 rounded cursor-pointer"
                  >
                    Continue
                  </button>
                </div>
              </>
            )}

            {/* STEP 2 - USDT */}
            {modalStep === 2 && paymentMethod === "USDT" && (
              <>
                <h2 className="text-xl font-bold">Select Network</h2>
                {["ERC20", "TRC20"].map((n) => (
                  <label key={n} className="flex gap-3 mt-4 cursor-pointer">
                    <input
                      type="radio"
                      checked={network === n}
                      onChange={() => setNetwork(n)}
                    />
                    {n}
                  </label>
                ))}

                <div className="flex justify-between mt-6">
                  <button
                    className="cursor-pointer"
                    onClick={() => setModalStep(1)}
                  >
                    Back
                  </button>
                  <button
                    disabled={!network}
                    onClick={() => setModalStep(3)}
                    className="bg-blue-600 px-4 py-2 rounded cursor-pointer"
                  >
                    Continue
                  </button>
                </div>
              </>
            )}

            {/* STEP 2 - CARD */}
            {modalStep === 2 && paymentMethod === "card" && (
              <>
                <div className="bg-white">
                  <PayPalIntegration cart={payload} />
                  <button
                    className="mt-6 cursor-pointer py-1 px-3 rounded-md bg-[#009cde]"
                    onClick={() => setModalStep(1)}
                  >
                    Back
                  </button>
                </div>
              </>
            )}

            {/* STEP 3 */}
            {/* STEP 3 */}
            {modalStep === 3 && (
              <>
                <h2 className="text-xl font-bold">Confirm Purchase</h2>

                <p className="mt-2 text-sm text-gray-300">
                  You selected <b>USDT</b> on <b>{network}</b> network
                </p>

                <img
                  src={PAYMENT_DETAILS[network].qr}
                  alt={`${network} QR`}
                  className="mx-auto mt-4 w-36"
                />

                {/* Amount */}
                <div className="mt-4">
                  <label className="text-sm text-gray-400">Amount to Pay</label>
                  <input
                    disabled
                    value={`${totalAmount} USDT`}
                    className="w-full mt-1 p-2 bg-gray-800 rounded"
                  />
                </div>

                {/* Address */}
                <div className="mt-4">
                  <label className="text-sm text-gray-400">
                    Pay to this address
                  </label>
                  <input
                    disabled
                    value={PAYMENT_DETAILS[network].address}
                    className="w-full mt-1 p-2 bg-gray-800 rounded"
                  />
                </div>

                {/* TX HASH */}
                <div className="mt-4">
                  <label className="text-sm text-gray-400">
                    Transaction Hash
                  </label>
                  <input
                    placeholder="Enter transaction hash"
                    value={txHash}
                    onChange={(e) => setTxHash(e.target.value)}
                    className="w-full mt-1 p-2 bg-gray-800 rounded"
                  />
                </div>

                <div className="flex justify-between mt-6">
                  <button
                    className="cursor-pointer"
                    onClick={() => setModalStep(2)}
                    disabled={loading}
                  >
                    Back
                  </button>

                  <button
                    disabled={!txHash.trim() || loading}
                    className={`px-4 py-2 rounded cursor-pointer flex items-center gap-2 ${
                      !txHash.trim() || loading
                        ? "bg-gray-600 cursor-not-allowed"
                        : "bg-green-600 hover:bg-green-700"
                    }`}
                    onClick={async () => {
                      if (!txHash.trim() || loading) return;

                      setLoading(true);

                      const { start_date, end_date } =
                        calculateStartEndDates(billing);

                      const payloadData = {
                        plan_id: selectedPlan.id,
                        plan_name: selectedPlan.name,
                        billing_cycle: billing,
                        method: "cryptocurrency",
                        amount: totalAmount,
                        currency:
                          network === "ERC20" ? "USDT (ERC20)" : "USDT (TRC20)",
                        start_date,
                        end_date,
                        payment_id: txHash,
                      };

                      try {
                        const res = await makeCryptoPayment(payloadData);
                        if (res?.success || res?.status === 201) {
                          setModalStep(4);
                        }
                      } catch {
                        alert("Payment failed");
                      } finally {
                        setLoading(false);
                      }
                    }}
                  >
                    {loading ? (
                      <>
                        <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full  "></span>
                        Processing...
                      </>
                    ) : (
                      "Confirm Payment"
                    )}
                  </button>
                </div>
              </>
            )}

            {/* STEP 4 - THANK YOU */}
            {modalStep === 4 && (
              <div className="text-center">
                <div className="flex justify-center">
                  <div className="h-16 w-16 rounded-full bg-green-600 flex items-center justify-center text-3xl">
                    ✓
                  </div>
                </div>

                <h2 className="text-2xl font-bold mt-4 text-white">
                  Thank You for Your Payment!
                </h2>

                <p className="mt-3 text-gray-300 text-sm leading-relaxed">
                  We have successfully received your payment.
                  <br />
                  Your transaction is currently under review.
                </p>

                <div className="mt-4 bg-[#1E293B] p-4 rounded-lg text-sm text-gray-300">
                  ⏳ <b>Review Time:</b> Up to <b>24 hours</b> <br />
                  After verification, your account will get full access to:
                  <ul className="mt-2 text-left list-disc list-inside text-gray-400">
                    <li>Campaign creation</li>
                    <li>Dashboard analytics</li>
                    <li>All plan features</li>
                  </ul>
                </div>

                <p className="mt-4 text-xs text-gray-400">
                  You will be notified once your payment is approved.
                </p>

                <button
                  onClick={resetPaymentState1}
                  className="mt-6 bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg cursor-pointer"
                >
                  OK
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
