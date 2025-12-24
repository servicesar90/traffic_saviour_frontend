import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiFunction } from "../../api/ApiFunction";
import { signOutApi } from "../../api/Apis";
import { showSuccessToast } from "../../components/toast/toast";

export default function CloakingLandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activePricing, setActivePricing] = useState("monthly");

  const [typedText, setTypedText] = useState("");
  const [threatCount, setThreatCount] = useState(2487653201);
  const [activeRequests, setActiveRequests] = useState(47832);
  const [matrixChars, setMatrixChars] = useState([]);
  const [hexagons, setHexagons] = useState([]);
  const [dataStreams, setDataStreams] = useState([]);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = async () => {
    // TODO: Implement your logout API or logic here
    // e.g., clear tokens from localStorage, Redux, etc.
    const response = await apiFunction("get", signOutApi, null, null);
    if (response) {
      console.log(response);
      showSuccessToast("Show Success Toast");
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      navigate("/");
    }
  };

  const fullText = "Quantum-Grade Protection";

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index <= fullText.length) {
        setTypedText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setThreatCount((prev) => prev + Math.floor(Math.random() * 100));
      setActiveRequests((prev) => prev + Math.floor(Math.random() * 20 - 10));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const chars =
      "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";
    const newChars = Array.from({ length: 30 }, (_, i) => ({
      char: chars[Math.floor(Math.random() * chars.length)],
      x: Math.random() * 100,
      y: Math.random() * 100,
      speed: 0.5 + Math.random() * 2,
    }));
    setMatrixChars(newChars);

    const newHexagons = Array.from({ length: 15 }, (_, i) => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 40 + Math.random() * 60,
      delay: Math.random() * 3,
    }));
    setHexagons(newHexagons);

    const streams = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      text: "0x" + Math.random().toString(16).substr(2, 8),
      x: Math.random() * 100,
    }));
    setDataStreams(streams);
  }, []);

  const styles = {
    colors: {
      bg: "#0b1116",
      bgDark: "#060a0d",
      bgCard: "#0f1419",
      primary: "#28f7a5",
      secondary: "#06b6d4",
      accent: "#3b82f6",
      text: "#e5e7eb",
      textMuted: "#9ca3af",
      border: "#1f2937",
    },

    durations: {
      fast: "0.2s",
      normal: "0.3s",
      slow: "0.5s",
    },

    container: {
      maxWidth: "1280px",
      margin: "0 auto",
      padding: "0 24px",
    },

    header: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      backgroundColor: "rgba(11, 17, 22, 0.9)",
      backdropFilter: "blur(12px)",
      borderBottom: "1px solid rgba(40, 247, 165, 0.2)",
      zIndex: 1000,
    },
    headerInner: {
      maxWidth: "1280px",
      margin: "0 auto",
      padding: "0 24px",
      height: "64px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },
    logo: {
      fontSize: "20px",
      fontWeight: 700,
      color: "#28f7a5",
      fontFamily: "monospace",
      textShadow: "0 0 10px rgba(40, 247, 165, 0.5)",
    },
    nav: {
      display: "flex",
      gap: "24px",
      alignItems: "center",
    },
    navLink: {
      color: "#e5e7eb",
      textDecoration: "none",
      fontSize: "14px",
      fontWeight: 500,
      transition: "color 0.2s",
      cursor: "pointer",
      fontFamily: "monospace",
    },

    hero: {
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      position: "relative",
      background:
        "linear-gradient(135deg, #0b1116 0%, #0f1419 50%, #0b1116 100%)",
      overflow: "hidden",
    },
    heroContent: {
      position: "relative",
      zIndex: 1,
      maxWidth: "1280px",
      margin: "0 auto",
      padding: "100px 24px 60px",
      textAlign: "left",
      width: "100%",
    },
    badge: {
      display: "inline-block",
      padding: "6px 16px",
      backgroundColor: "rgba(40, 247, 165, 0.1)",
      border: "1px solid rgba(40, 247, 165, 0.3)",
      borderRadius: "4px",
      color: "#28f7a5",
      fontSize: "11px",
      fontWeight: 600,
      textTransform: "uppercase",
      letterSpacing: "1.5px",
      marginBottom: "20px",
      fontFamily: "monospace",
    },
    h1: {
      fontSize: "48px",
      fontWeight: 700,
      color: "#ffffff",
      lineHeight: 1.2,
      marginBottom: "20px",
      letterSpacing: "-0.02em",
      fontFamily: "monospace",
      maxWidth: "700px",
    },
    h2: {
      fontSize: "32px",
      fontWeight: 700,
      color: "#ffffff",
      marginBottom: "16px",
      fontFamily: "monospace",
    },
    h3: {
      fontSize: "22px",
      fontWeight: 600,
      color: "#ffffff",
      marginBottom: "12px",
      fontFamily: "monospace",
    },
    subtitle: {
      fontSize: "16px",
      color: "#9ca3af",
      lineHeight: 1.6,
      maxWidth: "650px",
      margin: "0 0 32px",
      fontFamily: "monospace",
    },
    buttonGroup: {
      display: "flex",
      gap: "12px",
      marginBottom: "48px",
    },
    buttonPrimary: {
      padding: "8px 10px",
      backgroundColor: "#28f7a5",
      color: "#0b1116",
      border: "none",
      borderRadius: "4px",
      fontSize: "14px",
      fontWeight: 700,
      cursor: "pointer",
      transition: "all 0.2s",
      boxShadow: "0 0 20px rgba(40, 247, 165, 0.4)",
      fontFamily: "monospace",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
    },
    buttonSecondary: {
      padding: "12px 28px",
      backgroundColor: "transparent",
      color: "#28f7a5",
      border: "1px solid #28f7a5",
      borderRadius: "4px",
      fontSize: "14px",
      fontWeight: 700,
      cursor: "pointer",
      transition: "all 0.2s",
      fontFamily: "monospace",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
    },
    statsBar: {
      display: "flex",
      gap: "32px",
      flexWrap: "wrap",
    },
    stat: {
      textAlign: "left",
    },
    statValue: {
      fontSize: "28px",
      fontWeight: 700,
      color: "#28f7a5",
      marginBottom: "6px",
      fontFamily: "monospace",
      textShadow: "0 0 10px rgba(40, 247, 165, 0.5)",
    },
    statLabel: {
      fontSize: "11px",
      color: "#6b7280",
      textTransform: "uppercase",
      letterSpacing: "0.05em",
      fontFamily: "monospace",
    },

    banner: {
      backgroundColor: "rgba(40, 247, 165, 0.05)",
      borderTop: "1px solid rgba(40, 247, 165, 0.2)",
      borderBottom: "1px solid rgba(40, 247, 165, 0.2)",
      padding: "24px",
      position: "relative",
      overflow: "hidden",
    },
    bannerContent: {
      maxWidth: "1280px",
      margin: "0 auto",
      textAlign: "center",
      position: "relative",
      zIndex: 1,
    },
    bannerTitle: {
      fontSize: "11px",
      color: "#6b7280",
      textTransform: "uppercase",
      letterSpacing: "0.1em",
      marginBottom: "20px",
      fontFamily: "monospace",
    },
    logoGrid: {
      display: "flex",
      justifyContent: "center",
      gap: "40px",
      flexWrap: "wrap",
      alignItems: "center",
    },
    companyLogo: {
      fontSize: "16px",
      fontWeight: 600,
      color: "#4b5563",
      fontFamily: "monospace",
    },

    section: {
      padding: "80px 24px",
      backgroundColor: "#0b1116",
      position: "relative",
    },
    sectionAlt: {
      padding: "80px 24px",
      backgroundColor: "#0f1419",
      position: "relative",
    },
    sectionTitle: {
      textAlign: "center",
      marginBottom: "48px",
    },

    featuresGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
      gap: "24px",
      maxWidth: "1280px",
      margin: "0 auto",
    },
    featureCard: {
      padding: "32px",
      backgroundColor: "#0f1419",
      border: "1px solid rgba(40, 247, 165, 0.2)",
      borderRadius: "4px",
      transition: "all 0.3s",
      position: "relative",
      overflow: "hidden",
    },
    featureIcon: {
      width: "48px",
      height: "48px",
      backgroundColor: "rgba(40, 247, 165, 0.1)",
      borderRadius: "4px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: "20px",
      fontSize: "24px",
    },
    featureTitle: {
      fontSize: "18px",
      fontWeight: 600,
      color: "#ffffff",
      marginBottom: "10px",
      fontFamily: "monospace",
    },
    featureDescription: {
      fontSize: "14px",
      color: "#9ca3af",
      lineHeight: 1.6,
      fontFamily: "monospace",
    },

    pricingToggle: {
      display: "flex",
      gap: "8px",
      justifyContent: "center",
      marginBottom: "40px",
      padding: "4px",
      backgroundColor: "#0f1419",
      borderRadius: "4px",
      width: "fit-content",
      margin: "0 auto 40px",
      border: "1px solid rgba(40, 247, 165, 0.2)",
    },
    toggleButton: {
      padding: "10px 24px",
      backgroundColor: "transparent",
      color: "#9ca3af",
      border: "none",
      borderRadius: "4px",
      fontSize: "14px",
      fontWeight: 600,
      cursor: "pointer",
      transition: "all 0.2s",
      fontFamily: "monospace",
    },
    toggleButtonActive: {
      backgroundColor: "#28f7a5",
      color: "#0b1116",
    },
    pricingGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
      gap: "24px",
      maxWidth: "1280px",
      margin: "0 auto",
    },
    pricingCard: {
      padding: "36px",
      backgroundColor: "#0f1419",
      border: "1px solid rgba(40, 247, 165, 0.2)",
      borderRadius: "4px",
      position: "relative",
    },
    pricingCardFeatured: {
      backgroundColor: "rgba(40, 247, 165, 0.05)",
      border: "2px solid #28f7a5",
      boxShadow: "0 0 30px rgba(40, 247, 165, 0.3)",
    },
    popularBadge: {
      position: "absolute",
      top: "-10px",
      left: "50%",
      transform: "translateX(-50%)",
      padding: "4px 16px",
      backgroundColor: "#28f7a5",
      color: "#0b1116",
      fontSize: "10px",
      fontWeight: 700,
      textTransform: "uppercase",
      borderRadius: "2px",
      letterSpacing: "0.5px",
      fontFamily: "monospace",
    },
    planName: {
      fontSize: "20px",
      fontWeight: 700,
      color: "#ffffff",
      marginBottom: "12px",
      fontFamily: "monospace",
    },
    price: {
      fontSize: "36px",
      fontWeight: 700,
      color: "#28f7a5",
      marginBottom: "6px",
      fontFamily: "monospace",
    },
    priceUnit: {
      fontSize: "14px",
      color: "#9ca3af",
      marginBottom: "24px",
      fontFamily: "monospace",
    },
    featureList: {
      listStyle: "none",
      padding: 0,
      margin: "0 0 24px 0",
    },
    featureItem: {
      padding: "10px 0",
      color: "#d1d5db",
      fontSize: "13px",
      display: "flex",
      alignItems: "center",
      gap: "10px",
      fontFamily: "monospace",
    },
    checkmark: {
      color: "#28f7a5",
      fontSize: "16px",
    },

    testimonialsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
      gap: "24px",
      maxWidth: "1280px",
      margin: "0 auto",
    },
    testimonialCard: {
      padding: "32px",
      backgroundColor: "#0f1419",
      border: "1px solid rgba(40, 247, 165, 0.2)",
      borderRadius: "4px",
    },
    quote: {
      fontSize: "15px",
      fontStyle: "italic",
      color: "#d1d5db",
      lineHeight: 1.6,
      marginBottom: "20px",
      fontFamily: "monospace",
    },
    author: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
    },
    avatar: {
      width: "48px",
      height: "48px",
      borderRadius: "4px",
      backgroundColor: "rgba(40, 247, 165, 0.2)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "18px",
      fontWeight: 700,
      color: "#28f7a5",
      fontFamily: "monospace",
      border: "1px solid rgba(40, 247, 165, 0.3)",
    },
    authorInfo: {
      flex: 1,
    },
    authorName: {
      fontSize: "14px",
      fontWeight: 600,
      color: "#ffffff",
      marginBottom: "4px",
      fontFamily: "monospace",
    },
    authorTitle: {
      fontSize: "12px",
      color: "#9ca3af",
      fontFamily: "monospace",
    },
    stars: {
      color: "#28f7a5",
      fontSize: "14px",
      marginBottom: "12px",
    },

    ctaSection: {
      padding: "80px 24px",
      background: "linear-gradient(135deg, #0f1419 0%, #0b1116 100%)",
      textAlign: "center",
      position: "relative",
      borderTop: "1px solid rgba(40, 247, 165, 0.2)",
      borderBottom: "1px solid rgba(40, 247, 165, 0.2)",
    },
    ctaTitle: {
      fontSize: "36px",
      fontWeight: 700,
      color: "#ffffff",
      marginBottom: "16px",
      fontFamily: "monospace",
    },
    ctaSubtitle: {
      fontSize: "16px",
      color: "#9ca3af",
      marginBottom: "32px",
      maxWidth: "600px",
      margin: "0 auto 32px",
      fontFamily: "monospace",
    },
    ctaButton: {
      padding: "14px 40px",
      backgroundColor: "#28f7a5",
      color: "#0b1116",
      border: "none",
      borderRadius: "4px",
      fontSize: "14px",
      fontWeight: 700,
      cursor: "pointer",
      transition: "all 0.2s",
      boxShadow: "0 0 20px rgba(40, 247, 165, 0.4)",
      fontFamily: "monospace",
      textTransform: "uppercase",
    },
    trustIndicators: {
      display: "flex",
      gap: "24px",
      justifyContent: "center",
      marginTop: "24px",
      flexWrap: "wrap",
    },
    trustItem: {
      color: "#9ca3af",
      fontSize: "12px",
      fontFamily: "monospace",
    },

    footer: {
      backgroundColor: "#0b1116",
      borderTop: "1px solid rgba(40, 247, 165, 0.2)",
      padding: "48px 24px 24px",
    },
    footerGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: "36px",
      maxWidth: "1280px",
      margin: "0 auto 32px",
    },
    footerColumn: {
      display: "flex",
      flexDirection: "column",
      gap: "12px",
    },
    footerTitle: {
      fontSize: "14px",
      fontWeight: 700,
      color: "#ffffff",
      marginBottom: "6px",
      fontFamily: "monospace",
    },
    footerLink: {
      color: "#9ca3af",
      textDecoration: "none",
      fontSize: "12px",
      transition: "color 0.2s",
      cursor: "pointer",
      fontFamily: "monospace",
    },
    footerBottom: {
      maxWidth: "1280px",
      margin: "0 auto",
      paddingTop: "24px",
      borderTop: "1px solid rgba(40, 247, 165, 0.1)",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      color: "#6b7280",
      fontSize: "12px",
      flexWrap: "wrap",
      gap: "12px",
      fontFamily: "monospace",
    },
    footerLinks: {
      display: "flex",
      gap: "20px",
    },

    terminalSection: {
      backgroundColor: "#0f1419",
      border: "1px solid rgba(40, 247, 165, 0.3)",
      borderRadius: "4px",
      padding: "20px",
      fontFamily: "monospace",
      fontSize: "13px",
      overflow: "hidden",
    },
    terminalHeader: {
      display: "flex",
      gap: "6px",
      marginBottom: "16px",
    },
    terminalDot: {
      width: "10px",
      height: "10px",
      borderRadius: "50%",
      backgroundColor: "#28f7a5",
    },
    codeBlock: {
      color: "#28f7a5",
      lineHeight: 1.6,
    },
    threatMapContainer: {
      position: "relative",
      width: "100%",
      height: "400px",
      backgroundColor: "#0f1419",
      border: "1px solid rgba(40, 247, 165, 0.2)",
      borderRadius: "4px",
      overflow: "hidden",
    },
    metricsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: "16px",
      maxWidth: "1280px",
      margin: "0 auto",
    },
    metricCard: {
      padding: "24px",
      backgroundColor: "#0f1419",
      border: "1px solid rgba(40, 247, 165, 0.2)",
      borderRadius: "4px",
      textAlign: "center",
    },
    stepContainer: {
      display: "flex",
      gap: "32px",
      maxWidth: "1280px",
      margin: "0 auto",
      flexWrap: "wrap",
      justifyContent: "center",
    },
    stepCard: {
      flex: "1 1 250px",
      maxWidth: "300px",
      padding: "28px",
      backgroundColor: "#0f1419",
      border: "1px solid rgba(40, 247, 165, 0.2)",
      borderRadius: "4px",
      position: "relative",
    },
    stepNumber: {
      position: "absolute",
      top: "-12px",
      left: "50%",
      transform: "translateX(-50%)",
      width: "32px",
      height: "32px",
      backgroundColor: "#28f7a5",
      color: "#0b1116",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: 700,
      fontSize: "14px",
      fontFamily: "monospace",
    },
    heroInfoBox: {
      backgroundColor: "rgba(15, 20, 25, 0.8)",
      border: "1px solid rgba(40, 247, 165, 0.3)",
      borderRadius: "4px",
      padding: "20px",
      marginTop: "32px",
      maxWidth: "650px",
      backdropFilter: "blur(10px)",
    },
    infoRow: {
      display: "flex",
      justifyContent: "space-between",
      padding: "8px 0",
      borderBottom: "1px solid rgba(40, 247, 165, 0.1)",
      fontSize: "13px",
      fontFamily: "monospace",
    },
    infoLabel: {
      color: "#9ca3af",
    },
    infoValue: {
      color: "#28f7a5",
      fontWeight: 600,
    },
  };

  const features = [
    {
      icon: "🛡️",
      title: "Smart Traffic Cloaking",
      description:
        "Intelligently separates human traffic from automated scanners, bots, and review systems using real-time request analysis.",
    },
    {
      icon: "⚡",
      title: "Behavior-Based Filtering",
      description:
        "Detects non-human behavior patterns and blocks unwanted traffic without affecting genuine users or conversions.",
    },
    {
      icon: "🔐",
      title: "Secure Request Handling",
      description:
        "All requests are processed through encrypted channels with strict access rules and IP reputation checks.",
    },
    {
      icon: "🎯",
      title: "Policy-Safe Redirection",
      description:
        "Safely route approved users while automatically redirecting restricted traffic to compliant fallback pages.",
    },
    {
      icon: "📊",
      title: "Real-Time Traffic Insights",
      description:
        "Monitor traffic sources, device types, countries, and risk levels through a clean real-time analytics dashboard.",
    },
    {
      icon: "🌍",
      title: "Global Proxy Infrastructure",
      description:
        "Distributed edge routing ensures fast response times and stable performance across multiple regions.",
    },
  ];

  const pricingPlans = [
  {
    name: "Starter",
    price: activePricing === "monthly" ? "79" : "790",
    features: [
      "100K requests / month",
      "Basic traffic filtering",
      "Country & device rules",
      "Live analytics",
      "Email support",
      "API access",
    ],
  },
  {
    name: "Professional",
    price: activePricing === "monthly" ? "249" : "2490",
    popular: true,
    features: [
      "1M requests / month",
      "Advanced bot detection",
      "Custom routing rules",
      "Real-time monitoring",
      "Priority support",
      "Multiple domains",
      "Webhook alerts",
    ],
  },
  {
    name: "Enterprise",
    price: activePricing === "monthly" ? "899" : "8990",
    features: [
      "Unlimited requests",
      "Dedicated infrastructure",
      "Advanced compliance controls",
      "Custom integrations",
      "24/7 support",
      "SLA-backed uptime",
    ],
  },
];


 const testimonials = [
  {
    quote:
      "CloakShield helped us filter low-quality traffic without impacting our genuine users. Setup was simple and results were immediate.",
    author: "Alex Morgan",
    title: "Growth Manager, AdNova",
    rating: 5,
  },
  {
    quote:
      "The real-time traffic insights gave us complete visibility into where our traffic was coming from and how it behaved.",
    author: "Ritika Sharma",
    title: "Performance Lead, ScaleAds",
    rating: 5,
  },
  {
    quote:
      "Clean UI, powerful rules, and reliable filtering. Exactly what we needed for campaign protection.",
    author: "Daniel Wright",
    title: "CTO, FunnelStack",
    rating: 5,
  },
];


 const howItWorksSteps = [
  {
    title: "Request Analysis",
    description:
      "Each incoming request is analyzed for device signals, IP reputation, headers, and behavior patterns.",
  },
  {
    title: "Traffic Classification",
    description:
      "Our engine classifies traffic as human, bot, reviewer, or unknown in real time.",
  },
  {
    title: "Rule-Based Decision",
    description:
      "Based on your rules, traffic is either allowed, blocked, or redirected safely.",
  },
  {
    title: "Secure Delivery",
    description:
      "Approved users are routed to your destination with minimal latency impact.",
  },
];


  const techStack = [
  { name: "Edge Request Processing", status: "Active" },
  { name: "Behavioral Analysis Engine", status: "Active" },
  { name: "IP Reputation Database", status: "Active" },
  { name: "Rule-Based Routing System", status: "Active" },
  { name: "Real-Time Analytics", status: "Active" },
  { name: "Secure API Gateway", status: "Active" },
];


  return (
    <>
      <style>
        {`
        @keyframes matrix-fall {
          0% { transform: translateY(-100%); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(100vh); opacity: 0; }
        }
        
        @keyframes glitch {
          0%, 100% { transform: translate(0); }
          20% { transform: translate(-2px, 2px); }
          40% { transform: translate(-2px, -2px); }
          60% { transform: translate(2px, 2px); }
          80% { transform: translate(2px, -2px); }
        }
        
        @keyframes typing-cursor {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(40, 247, 165, 0.4); }
          50% { box-shadow: 0 0 30px rgba(40, 247, 165, 0.6); }
        }
        
        @keyframes scan-line {
          0% { top: 0%; }
          100% { top: 100%; }
        }
        
        @keyframes pulse-border {
          0%, 100% { border-color: rgba(40, 247, 165, 0.2); }
          50% { border-color: rgba(40, 247, 165, 0.6); }
        }

        @keyframes hexagon-pulse {
          0%, 100% { opacity: 0.1; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(1.1); }
        }

        @keyframes data-stream {
          0% { transform: translateX(-100%); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateX(200vw); opacity: 0; }
        }

        @keyframes circuit-pulse {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.6; }
        }

        @keyframes rotate-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .matrix-char {
          position: absolute;
          color: #28f7a5;
          font-family: monospace;
          font-size: 20px;
          opacity: 0.6;
          animation: matrix-fall linear infinite;
          text-shadow: 0 0 5px rgba(40, 247, 165, 0.8);
        }
        
        .glitch-effect:hover {
          animation: glitch 0.3s infinite;
        }
        
        .typing-cursor::after {
          content: '▋';
          animation: typing-cursor 1s infinite;
        }
        
        .float-animation {
          animation: float 3s ease-in-out infinite;
        }
        
        .pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
        
        .scan-line::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, #28f7a5, transparent);
          animation: scan-line 3s linear infinite;
        }
        
        .pulse-border-animation {
          animation: pulse-border 2s ease-in-out infinite;
        }
        
        .grid-overlay {
          background-image: 
            linear-gradient(rgba(40, 247, 165, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(40, 247, 165, 0.1) 1px, transparent 1px);
          background-size: 20px 20px;
        }

        .hexagon {
          position: absolute;
          border: 1px solid rgba(40, 247, 165, 0.3);
          animation: hexagon-pulse 4s ease-in-out infinite;
        }

        .data-stream {
          position: absolute;
          color: #28f7a5;
          font-family: monospace;
          font-size: 12px;
          opacity: 0.8;
          animation: data-stream linear infinite;
          white-space: nowrap;
        }

        .circuit-line {
          position: absolute;
          height: 1px;
          background: linear-gradient(90deg, transparent, #28f7a5, transparent);
          animation: circuit-pulse 3s ease-in-out infinite;
        }

        .rotating-border {
          position: absolute;
          inset: -2px;
          border-radius: 4px;
          background: conic-gradient(from 0deg, transparent, #28f7a5, transparent);
          animation: rotate-slow 4s linear infinite;
          opacity: 0.3;
        }
      `}
      </style>

      <div
        style={{
          backgroundColor: "#0b1116",
          color: "#ffffff",
          fontFamily: "monospace",
          position: "relative",
        }}
      >
        {/* Matrix background effect */}
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            overflow: "hidden",
            zIndex: 0,
            pointerEvents: "none",
            opacity: 0.3,
          }}
        >
          {matrixChars.map((char, i) => (
            <div
              key={i}
              className="matrix-char"
              style={{
                left: `${char.x}%`,
                animationDuration: `${char.speed * 3}s`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            >
              {char.char}
            </div>
          ))}
        </div>

        <div style={{ position: "relative", zIndex: 1 }}>
          {/* Header */}
          <header style={styles.header}>
            <div style={styles.headerInner}>
              <div style={styles.logo} className="glitch-effect">
                {"> CloakShield_"}
              </div>

              <nav style={styles.nav}>
                <a
                  style={styles.navLink}
                  href="#features"
                  data-testid="link-features"
                >
                  Features
                </a>
                <a
                  style={styles.navLink}
                  href="#how-it-works"
                  data-testid="link-how-it-works"
                >
                  How It Works
                </a>
                <a
                  style={styles.navLink}
                  href="#pricing"
                  data-testid="link-pricing"
                >
                  Pricing
                </a>
                <a
                  style={styles.navLink}
                  href="#testimonials"
                  data-testid="link-testimonials"
                >
                  Testimonials
                </a>

                {/* ------------------------------------
        BUTTON AREA REPLACED WITH YOUR LOGIC
    ------------------------------------- */}
                {user ? (
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button
                      onClick={() => navigate("/Dashboard/allStats")}
                      style={styles.buttonPrimary}
                      data-testid="button-start-protecting"
                      onMouseOver={(e) =>
                        (e.currentTarget.style.transform = "translateY(-2px)")
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.transform = "translateY(0)")
                      }
                    >
                      Go to Dashboard
                    </button>

                    <button
                      onClick={handleLogout}
                      style={styles.buttonPrimary}
                      data-testid="button-start-protecting"
                      onMouseOver={(e) =>
                        (e.currentTarget.style.transform = "translateY(-2px)")
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.transform = "translateY(0)")
                      }
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div style={{ display: "flex", gap: "10px" }}>
                    <Link to="/signin">
                      <button
                        style={styles.buttonPrimary}
                        data-testid="button-start-protecting"
                        onMouseOver={(e) =>
                          (e.currentTarget.style.transform = "translateY(-2px)")
                        }
                        onMouseOut={(e) =>
                          (e.currentTarget.style.transform = "translateY(0)")
                        }
                      >
                        Sign In
                      </button>
                    </Link>

                    <Link to="/signup">
                      <button
                        style={styles.buttonPrimary}
                        data-testid="button-start-protecting"
                        onClick={() => console.log("Start Protecting clicked")}
                        onMouseOver={(e) =>
                          (e.currentTarget.style.transform = "translateY(-2px)")
                        }
                        onMouseOut={(e) =>
                          (e.currentTarget.style.transform = "translateY(0)")
                        }
                      >
                        Sign Up
                      </button>
                    </Link>
                  </div>
                )}
              </nav>
            </div>
          </header>

          {/* Hero Section with Animated Background */}
          <section style={styles.hero} className="grid-overlay">
            {/* Hexagon animations */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                overflow: "hidden",
                opacity: 0.4,
              }}
            >
              {hexagons.map((hex, i) => (
                <div
                  key={i}
                  className="hexagon"
                  style={{
                    left: `${hex.x}%`,
                    top: `${hex.y}%`,
                    width: `${hex.size}px`,
                    height: `${hex.size}px`,
                    clipPath:
                      "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                    animationDelay: `${hex.delay}s`,
                  }}
                />
              ))}
            </div>

            {/* Data streams */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                overflow: "hidden",
              }}
            >
              {dataStreams.map((stream) => (
                <div
                  key={stream.id}
                  className="data-stream"
                  style={{
                    top: `${10 + stream.id * 12}%`,
                    animationDuration: `${8 + Math.random() * 4}s`,
                    animationDelay: `${stream.id * 0.5}s`,
                  }}
                >
                  {`${stream.text} >> ENCRYPTED_PACKET >> ${stream.text
                    .split("")
                    .reverse()
                    .join("")}`}
                </div>
              ))}
            </div>

            {/* Circuit lines */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                overflow: "hidden",
                opacity: 0.3,
              }}
            >
              <div
                className="circuit-line"
                style={{
                  top: "20%",
                  width: "60%",
                  left: "20%",
                  animationDelay: "0s",
                }}
              />
              <div
                className="circuit-line"
                style={{
                  top: "40%",
                  width: "80%",
                  left: "10%",
                  animationDelay: "1s",
                }}
              />
              <div
                className="circuit-line"
                style={{
                  top: "60%",
                  width: "50%",
                  left: "30%",
                  animationDelay: "2s",
                }}
              />
              <div
                className="circuit-line"
                style={{
                  top: "80%",
                  width: "70%",
                  left: "15%",
                  animationDelay: "1.5s",
                }}
              />
            </div>

            <div style={styles.heroContent}>
              <span
                style={styles.badge}
                data-testid="badge-quantum"
                className="typing-cursor"
              >
                {typedText}
              </span>
              <h1 style={styles.h1} className="glitch-effect">
                {"> SMART TRAFFIC"}
                <br />
                {"FILTERING & CLOAKING"}
                <br />
                {"PLATFORM"}
              </h1>
              <p style={styles.subtitle}>
  Protect your campaigns with intelligent traffic filtering.
  CloakShield helps you control who sees what — blocking bots,
  reviewers, and unwanted scanners while allowing real users
  to pass seamlessly.
</p>
              <div style={styles.buttonGroup}>
                <button
                  style={styles.buttonPrimary}
                  data-testid="button-start-protecting"
                  onClick={() => console.log("Start Protecting clicked")}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.transform = "translateY(-2px)")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.transform = "translateY(0)")
                  }
                >
                  Initialize Protection
                </button>
                {/* <button
                  style={styles.buttonSecondary}
                  data-testid="button-view-demo"
                  onClick={() => console.log("View Demo clicked")}
                  onMouseOver={e => {
                    e.currentTarget.style.backgroundColor =
                      "rgba(40, 247, 165, 0.1)"
                    e.currentTarget.style.boxShadow =
                      "0 0 20px rgba(40, 247, 165, 0.3)"
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.backgroundColor = "transparent"
                    e.currentTarget.style.boxShadow = "none"
                  }}
                >
                  View Live Demo
                </button> */}
              </div>

              {/* Enhanced Info Box */}
              <div style={styles.heroInfoBox} className="scan-line">
                <div style={styles.infoRow}>
                  <span style={styles.infoLabel}>Encryption Protocol:</span>
                  <span style={styles.infoValue}>TLS 1.3 Secure Channels</span>
                </div>
                <div style={styles.infoRow}>
                  <span style={styles.infoLabel}>Traffic Filtering:</span>
                  <span style={styles.infoValue}>Behavioral & IP Reputation</span>
                </div>
                <div style={styles.infoRow}>
                  <span style={styles.infoLabel}>Routing Logic</span>
                  <span style={styles.infoValue}>Smart Rule-Based Redirection</span>
                </div>
                <div style={styles.infoRow}>
                  <span style={styles.infoLabel}>Threat Detection:</span>
                  <span style={styles.infoValue}>
                   Automated Bot Identification
                  </span>
                </div>
                <div style={{ ...styles.infoRow, borderBottom: "none" }}>
                  <span style={styles.infoLabel}>Global Edge Nodes: </span>
                  <span style={styles.infoValue}>150+ Active Locations</span>
                </div>
              </div>

              <div style={styles.statsBar}>
                <div style={styles.stat} className="float-animation">
                  <div style={styles.statValue} data-testid="stat-uptime">
                    99.99%
                  </div>
                  <div style={styles.statLabel}>Campaign Uptime</div>
                </div>
                <div style={styles.stat} className="float-animation">
                  <div style={styles.statValue} data-testid="stat-threats">
                    {(threatCount / 1000000000).toFixed(2)}B+
                  </div>
                  <div style={styles.statLabel}>1.2B+ Requests Processed</div>
                </div>
                <div style={styles.stat} className="float-animation">
                  <div style={styles.statValue} data-testid="stat-response">
                    &lt;5ms
                  </div>
                  <div style={styles.statLabel}>Avg Latency</div>
                </div>
                <div style={styles.stat} className="float-animation">
                  <div style={styles.statValue} data-testid="stat-accuracy">
                    98.7%
                  </div>
                  <div style={styles.statLabel}>Bot Detection Accuracy</div>
                </div>
              </div>
            </div>
          </section>

          {/* Banner with Circuit Animation */}
          <section style={styles.banner}>
            {/* Animated circuit background */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                overflow: "hidden",
                opacity: 0.2,
              }}
            >
              <div
                className="circuit-line"
                style={{
                  top: "30%",
                  width: "100%",
                  left: "0%",
                  animationDelay: "0s",
                }}
              />
              <div
                className="circuit-line"
                style={{
                  top: "70%",
                  width: "100%",
                  left: "0%",
                  animationDelay: "1.5s",
                }}
              />
            </div>

            <div style={styles.bannerContent}>
              <div style={styles.bannerTitle}>
                {"> TRUSTED_BY_ENTERPRISE_LEADERS"}
              </div>
              <div style={styles.logoGrid}>
                <div style={styles.companyLogo}>TechCorp</div>
                <div style={styles.companyLogo}>DataVault</div>
                <div style={styles.companyLogo}>SecureNet</div>
                <div style={styles.companyLogo}>CloudShield</div>
                <div style={styles.companyLogo}>CyberGuard</div>
                <div style={styles.companyLogo}>QuantumSec</div>
              </div>
            </div>
          </section>

          {/* Live Threat Monitor */}
          <section style={styles.section}>
            <div style={styles.sectionTitle}>
              <span style={styles.badge}>{"> REAL_TIME_THREAT_MONITOR"}</span>
              <h2 style={styles.h2}>Live Security Analytics</h2>
            </div>
            <div style={styles.metricsGrid}>
              <div
                style={styles.metricCard}
                className="scan-line pulse-border-animation"
              >
                <div style={{ ...styles.statValue, fontSize: "32px" }}>
                  {activeRequests.toLocaleString()}
                </div>
                <div style={styles.statLabel}>Active Requests</div>
              </div>
              <div
                style={styles.metricCard}
                className="scan-line pulse-border-animation"
              >
                <div style={{ ...styles.statValue, fontSize: "32px" }}>
                  {threatCount.toLocaleString()}
                </div>
                <div style={styles.statLabel}>Threats Cloaked</div>
              </div>
              <div
                style={styles.metricCard}
                className="scan-line pulse-border-animation"
              >
                <div style={{ ...styles.statValue, fontSize: "32px" }}>
                  4.7ms
                </div>
                <div style={styles.statLabel}>Avg Latency</div>
              </div>
              <div
                style={styles.metricCard}
                className="scan-line pulse-border-animation"
              >
                <div style={{ ...styles.statValue, fontSize: "32px" }}>156</div>
                <div style={styles.statLabel}>Edge Nodes Active</div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section style={styles.sectionAlt} id="features">
            <div style={styles.sectionTitle}>
              <span style={styles.badge}>{"> SECURITY_FEATURES"}</span>
              <h2 style={styles.h2}>Enterprise Cloaking Arsenal</h2>
              <p style={{ ...styles.subtitle, margin: "0 auto" }}>
                Advanced obfuscation powered by quantum computing and neural
                networks
              </p>
            </div>
            <div style={styles.featuresGrid}>
              {features.map((feature, index) => (
                <div
                  key={index}
                  style={styles.featureCard}
                  className="pulse-border-animation"
                  data-testid={`feature-card-${index}`}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor =
                      "rgba(40, 247, 165, 0.5)";
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 20px rgba(40, 247, 165, 0.2)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor =
                      "rgba(40, 247, 165, 0.2)";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <div style={styles.featureIcon}>{feature.icon}</div>
                  <h3 style={styles.featureTitle}>{"> " + feature.title}</h3>
                  <p style={styles.featureDescription}>{feature.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* How It Works */}
          <section style={styles.section} id="how-it-works">
            <div style={styles.sectionTitle}>
              <span style={styles.badge}>{"> SYSTEM_WORKFLOW"}</span>
              <h2 style={styles.h2}>How CloakShield Works</h2>
              <p style={{ ...styles.subtitle, margin: "0 auto" }}>
                Four-layer protection system with quantum-grade obfuscation
              </p>
            </div>
            <div style={styles.stepContainer}>
              {howItWorksSteps.map((step, index) => (
                <div
                  key={index}
                  style={styles.stepCard}
                  className="float-animation"
                  data-testid={`step-${index}`}
                >
                  <div style={styles.stepNumber}>{index + 1}</div>
                  <h3
                    style={{
                      ...styles.featureTitle,
                      textAlign: "center",
                      marginTop: "12px",
                    }}
                  >
                    {step.title}
                  </h3>
                  <p
                    style={{
                      ...styles.featureDescription,
                      textAlign: "center",
                    }}
                  >
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Tech Stack */}
          <section style={styles.sectionAlt}>
            <div style={styles.sectionTitle}>
              <span style={styles.badge}>{"> QUANTUM_STACK"}</span>
              <h2 style={styles.h2}>Powered by Advanced Technology</h2>
            </div>
            <div style={{ maxWidth: "800px", margin: "0 auto" }}>
              <div style={styles.terminalSection} className="scan-line">
                <div style={styles.terminalHeader}>
                  <div style={styles.terminalDot}></div>
                  <div
                    style={{
                      ...styles.terminalDot,
                      backgroundColor: "#06b6d4",
                    }}
                  ></div>
                  <div
                    style={{
                      ...styles.terminalDot,
                      backgroundColor: "#6b7280",
                    }}
                  ></div>
                </div>
                <div style={styles.codeBlock}>
                  <div>{"$ system_status --verbose"}</div>
                  <div style={{ marginTop: "12px" }}>
                    {techStack.map((tech, i) => (
                      <div
                        key={i}
                        style={{
                          marginBottom: "8px",
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span>{"[" + (i + 1) + "] " + tech.name}</span>
                        <span style={{ color: "#28f7a5" }}>
                          {"● " + tech.status}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: "16px", color: "#06b6d4" }}>
                    {"> All systems operational. Quantum encryption active."}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Pricing Section */}
          <section style={styles.section} id="pricing">
            <div style={styles.sectionTitle}>
              <span style={styles.badge}>{"> PRICING_MODELS"}</span>
              <h2 style={styles.h2}>Choose Your Protection Level</h2>
              <p style={{ ...styles.subtitle, margin: "0 auto" }}>
                Flexible pricing for teams of all sizes
              </p>
            </div>

            <div style={styles.pricingToggle}>
              <button
                style={{
                  ...styles.toggleButton,
                  ...(activePricing === "monthly"
                    ? styles.toggleButtonActive
                    : {}),
                }}
                data-testid="toggle-monthly"
                onClick={() => setActivePricing("monthly")}
              >
                Monthly
              </button>
              <button
                style={{
                  ...styles.toggleButton,
                  ...(activePricing === "annual"
                    ? styles.toggleButtonActive
                    : {}),
                }}
                data-testid="toggle-annual"
                onClick={() => setActivePricing("annual")}
              >
                Annual (Save 17%)
              </button>
            </div>

            <div style={styles.pricingGrid}>
              {pricingPlans.map((plan, index) => (
                <div
                  key={index}
                  style={{
                    ...styles.pricingCard,
                    ...(plan.popular ? styles.pricingCardFeatured : {}),
                  }}
                  className={plan.popular ? "pulse-glow" : ""}
                  data-testid={`pricing-card-${index}`}
                >
                  {plan.popular && (
                    <div style={styles.popularBadge}>Most Popular</div>
                  )}
                  <h3 style={styles.planName}>
                    {"> " + plan.name.toUpperCase()}
                  </h3>
                  <div style={styles.price} data-testid={`price-${index}`}>
                    ${plan.price}
                  </div>
                  <div style={styles.priceUnit}>
                    per {activePricing === "monthly" ? "month" : "year"}
                  </div>
                  <ul style={styles.featureList}>
                    {plan.features.map((feature, fIndex) => (
                      <li key={fIndex} style={styles.featureItem}>
                        <span style={styles.checkmark}>✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button
                    style={{
                      ...styles.buttonPrimary,
                      width: "100%",
                      ...(plan.popular ? {} : { ...styles.buttonSecondary }),
                    }}
                    data-testid={`button-select-${index}`}
                    onClick={() => {
                      navigate("/pricing");
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                  >
                    Deploy System
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Testimonials Section */}
          <section style={styles.sectionAlt} id="testimonials">
            <div style={styles.sectionTitle}>
              <span style={styles.badge}>{"> CLIENT_TESTIMONIALS"}</span>
              <h2 style={styles.h2}>Trusted by Security Leaders</h2>
            </div>
            <div style={styles.testimonialsGrid}>
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  style={styles.testimonialCard}
                  className="pulse-border-animation"
                  data-testid={`testimonial-${index}`}
                >
                  <div style={styles.stars}>
                    {"★".repeat(testimonial.rating)}
                  </div>
                  <p style={styles.quote}>"{testimonial.quote}"</p>
                  <div style={styles.author}>
                    <div style={styles.avatar}>
                      {testimonial.author
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div style={styles.authorInfo}>
                      <div style={styles.authorName}>{testimonial.author}</div>
                      <div style={styles.authorTitle}>{testimonial.title}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* CTA Section */}
          <section style={styles.ctaSection} className="grid-overlay">
            <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
              <h2 style={styles.ctaTitle} className="glitch-effect">
                {"> READY_TO_SECURE_YOUR_TRAFFIC?"}
              </h2>
              <p style={styles.ctaSubtitle}>
                Join thousands of enterprises protecting their infrastructure
                with quantum-grade cloaking technology. 
              </p>
              
             
            </div>
          </section>

          {/* Footer */}
          <footer style={styles.footer}>
            <div style={styles.footerGrid}>
              <div style={styles.footerColumn}>
                <div style={styles.logo}>{"> CloakShield_"}</div>
                <p
                  style={{
                    color: "#9ca3af",
                    fontSize: "12px",
                    marginTop: "12px",
                    fontFamily: "monospace",
                  }}
                >
                  Enterprise-grade polymorphic cloaking powered by quantum
                  encryption and neural behavioral analysis.
                </p>
              </div>
              <div style={styles.footerColumn}>
                <div style={styles.footerTitle}>Product</div>
                <a style={styles.footerLink} href="#features">
                  Features
                </a>
                <a style={styles.footerLink} href="#pricing">
                  Pricing
                </a>
                <a style={styles.footerLink} href="#documentation">
                  Documentation
                </a>
                <a style={styles.footerLink} href="#api">
                  API Reference
                </a>
              </div>
              <div style={styles.footerColumn}>
                <div style={styles.footerTitle}>Company</div>
                <a style={styles.footerLink} href="#about">
                  About Us
                </a>
                <a style={styles.footerLink} href="#blog">
                  Blog
                </a>
                <a style={styles.footerLink} href="#careers">
                  Careers
                </a>
                <a style={styles.footerLink} href="#contact">
                  Contact
                </a>
              </div>
              <div style={styles.footerColumn}>
                <div style={styles.footerTitle}>Legal</div>
                <a style={styles.footerLink} href="#privacy">
                  Privacy Policy
                </a>
                <a style={styles.footerLink} href="#terms">
                  Terms of Service
                </a>
                <a style={styles.footerLink} href="#security">
                  Security
                </a>
                <a style={styles.footerLink} href="#compliance">
                  Compliance
                </a>
              </div>
            </div>
            <div style={styles.footerBottom}>
              <div>© 2024 CloakShield. All rights reserved.</div>
              <div style={styles.footerLinks}>
                <a style={styles.footerLink} href="#privacy">
                  Privacy
                </a>
                <a style={styles.footerLink} href="#terms">
                  Terms
                </a>
                <a style={styles.footerLink} href="#security">
                  Security
                </a>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}
