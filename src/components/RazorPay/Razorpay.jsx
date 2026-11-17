import React from "react";
// import axios from "axios";
import { apiFunction } from "../../api/ApiFunction";
import {
  createRazorPaySub,
  varifyRazorPaySub,
  cryptoPayment,
} from "../../api/Apis";
import { useNavigate } from "react-router-dom";

const PayButton = ({ payload }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  console.log("pay", payload, user);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (document.getElementById("razorpay-script")) {
        return resolve(true);
      }

      const script = document.createElement("script");
      script.id = "razorpay-script";
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    const isLoaded = await loadRazorpayScript();

    if (!isLoaded) {
      alert("Razorpay SDK failed to load");
      return;
    }

    try {
      // 1. Create subscription from backend
      // const { data } = await apiFunction("post",createRazorPaySub,null,{price_id:payload?.price_id})
      const { data } = await apiFunction("post", createRazorPaySub, null, {
        price_id: payload?.razorpay_price_id,
      });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, // env use karo
        subscription_id: data.subscription_id,

        name: "TrafficSaviour",
        description: "Monthly Subscription Plan",

        prefill: {
          name: user?.name || "",
          email: user?.email || "",
          contact: user?.phone || "",
        },
        handler: async function (response) {
          try {
            const verifyRes = await apiFunction(
              "post",
              varifyRazorPaySub,
              null,
              response,
            );

            if (verifyRes.data.success) {
              alert("✅ Payment Successful");
              const payloadData = {
                ...payload,
                status: "Paid",
                payment_id: data?.subscription_id,
              };
              console.log("paybbload", payloadData);

              await apiFunction("post", cryptoPayment, null, payloadData);
              navigate("/Dashboard/billing");
            } else {
              alert("❌ Payment Verification Failed");
            }
          } catch (err) {
            console.error(err);
            alert("Verification Error");
          }
        },

        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      alert("Payment initialization failed");
    }
  };

  return (
    <button
      onClick={handlePayment}
      style={{
        width: "stretch",
        padding: "10px 20px",
        backgroundColor: "#3399cc",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
      }}
    >
      Pay With Card
    </button>
  );
};

export default PayButton;
