import {
  CardElement,
  PaymentElement,
  useStripe,
  useElements,
  Elements
} from "@stripe/react-stripe-js";

const Subscribe = () => {
  const stripe = useStripe();
  const elements = useElements();

//    // ====================== STRIPE PAYMENT =====================
//      const [clientSecret, setClientSecret] = useState("");
  
//     useEffect(() => {
//       fetch("http://localhost:2000/api/v2/payment/stripe/create-subscription", {
//         method: "POST",
//         headers: { "Content-Type": "application/json",
//           "Authorization": `Bearer ${localStorage.getItem("token")}`
//         },
//         body: JSON.stringify({ email: "codewithfaiz@gmail.com", priceId: "price_1SwikXQxKOqwXPnDhwMHL6pK" }), // ₹500
//       })
//         .then(res => res.json())
//         .then(data => setClientSecret(data.clientSecret));
//     }, []);

  const handleSubscribe = async () => {
    // console.log("ydgvysg");
    
    // // 1. Create payment method
    // const { paymentMethod } = await stripe.createPaymentMethod({
    //   type: "card",
    //   card: elements.getElement(PaymentElement),
    // });

    // // 2. Create subscription
    // const res = await fetch("http://localhost:2000/create-subscription", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({
    //     email: "user@test.com",
    //     paymentMethodId: paymentMethod.id,
    //     priceId: "price_1Nxxxxx", // your plan
    //   }),
    // });

    // const data = await res.json();

    //  e.preventDefault();

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: "http://localhost:5137/success",
      },
    });

    if (error) {
      alert(error.message);
    }

    // 3. Confirm payment (first invoice)
    await stripe.confirmCardPayment(data.clientSecret);
    alert("Subscription Active 🎉");
  };

  return (
    <>
     {/* <Elements stripe={stripePromise} options={{ clientSecret }}> */}
        <h1>Subscribe to a Plan</h1>
      <PaymentElement />
      <button onClick={handleSubscribe}>Subscribe</button>
     {/* </Elements> */}
    </>
  );
};

export default Subscribe;
