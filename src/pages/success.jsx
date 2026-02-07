import { Box, Typography, Button, Paper } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useNavigate } from "react-router-dom";

export default function PaymentSuccess() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#f4f6f8",
        px: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          maxWidth: 420,
          width: "100%",
          p: 4,
          borderRadius: 3,
          textAlign: "center",
        }}
      >
        <CheckCircleIcon
          sx={{ fontSize: 80, color: "success.main", mb: 2 }}
        />

        <Typography variant="h5" fontWeight={700} gutterBottom>
          Payment Successful 🎉
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 3 }}
        >
          Thank you for your purchase. Your payment has been processed
          successfully and your subscription is now active.
        </Typography>

        <Box
          sx={{
            bgcolor: "#f9fafb",
            borderRadius: 2,
            p: 2,
            mb: 3,
          }}
        >
          <Typography variant="body2">
            <b>Transaction ID:</b> TXN_87456321
          </Typography>
          <Typography variant="body2">
            <b>Status:</b> Completed
          </Typography>
        </Box>

        <Button
          fullWidth
          variant="contained"
          size="large"
          sx={{ mb: 1.5 }}
          onClick={() => navigate("/Dashboard/allStats")}
        >
          Go to Dashboard
        </Button>

        <Button
          fullWidth
          variant="outlined"
          onClick={() => navigate("/Dashboard/pricing")}
        >
          View Billing Details
        </Button>
      </Paper>
    </Box>
  );
}
