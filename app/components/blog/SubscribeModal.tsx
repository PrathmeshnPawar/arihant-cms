"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  IconButton,
  Box,
  CircularProgress,
  Fade,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

interface SubscribeModalProps {
  open: boolean;
  onClose: () => void;
}

export default function SubscribeModal({ open, onClose }: SubscribeModalProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error" | null; message: string }>({
    type: null,
    message: "",
  });

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: null, message: "" });

    try {
      const res = await fetch("/api/public/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const json = await res.json();

      if (res.ok) {
        setStatus({ type: "success", message: json.message || "Thank you for subscribing!" });
        setEmail("");
        // Auto-close after 3 seconds on success
        setTimeout(onClose, 3000);
      } else {
        setStatus({ type: "error", message: json.error || "Something went wrong." });
      }
    } catch (err) {
      setStatus({ type: "error", message: "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      fullWidth 
      maxWidth="xs"
      PaperProps={{
        sx: { borderRadius: 4, p: 1 }
      }}
    >
      <IconButton
        onClick={onClose}
        sx={{ position: "absolute", right: 16, top: 16, color: "grey.500" }}
      >
        <CloseIcon />
      </IconButton>

      <DialogContent sx={{ textAlign: "center", py: 4 }}>
        {status.type === "success" ? (
          <Fade in={true}>
            <Box sx={{ py: 2 }}>
              <CheckCircleOutlineIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
              <Typography variant="h5" fontWeight={900} gutterBottom>
                You're on the list!
              </Typography>
              <Typography color="text.secondary">
                {status.message}
              </Typography>
            </Box>
          </Fade>
        ) : (
          <>
            <Typography variant="h5" fontWeight={950} sx={{ mb: 1, letterSpacing: -0.5 }}>
              Stay Updated
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
              Get the latest stock market insights and blog updates delivered straight to your inbox.
            </Typography>

            <form onSubmit={handleSubscribe}>
              <TextField
                autoFocus
                fullWidth
                placeholder="Enter your email address"
                variant="outlined"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                sx={{
                  mb: 2,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                    bgcolor: "#f8fafc"
                  }
                }}
              />
              
              {status.type === "error" && (
                <Typography variant="caption" color="error" sx={{ mb: 2, display: "block" }}>
                  {status.message}
                </Typography>
              )}

              <Button
                fullWidth
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                  py: 1.5,
                  borderRadius: 3,
                  fontWeight: 800,
                  textTransform: "none",
                  bgcolor: "#020617",
                  "&:hover": { bgcolor: "#1e293b" }
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : "Subscribe Now"}
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}