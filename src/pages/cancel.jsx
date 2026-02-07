import { Box, Typography, Button, Paper } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import { useNavigate } from "react-router-dom";

export default function PaymentCancel() {
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
        <CancelIcon
          sx={{ fontSize: 80, color: "error.main", mb: 2 }}
        />

        <Typography variant="h5" fontWeight={700} gutterBottom>
          Payment Cancelled ❌
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 3 }}
        >
          Your payment process was cancelled. No charges were made to your
          account. You can try again or return to your dashboard.
        </Typography>

        <Box
          sx={{
            bgcolor: "#fff5f5",
            borderRadius: 2,
            p: 2,
            mb: 3,
          }}
        >
          <Typography variant="body2">
            <b>Status:</b> Cancelled by user
          </Typography>
        </Box>

        <Button
          fullWidth
          variant="contained"
          color="error"
          size="large"
          sx={{ mb: 1.5 }}
          onClick={() => navigate("/pricing")}
        >
          Try Payment Again
        </Button>

        <Button
          fullWidth
          variant="outlined"
          onClick={() => navigate("/dashboard")}
        >
          Go to Dashboard
        </Button>
      </Paper>
    </Box>
  );
}
