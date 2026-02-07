import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "../utils/stripe";

import Checkout from "../components/Stripe/Checkout";
import { useEffect, useState } from "react";

function Stripe() {
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    fetch("http://localhost:2000/api/v2/payment/stripe/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({ amount: 50000 }), // ₹500
    })
      .then(res => res.json())
      .then(data => setClientSecret(data.clientSecret));
  }, []);

  return (
    clientSecret && (
      <Elements stripe={stripePromise} options={{ clientSecret }}>
        <Checkout />
      </Elements>
    )
  );
}

export default Stripe;
