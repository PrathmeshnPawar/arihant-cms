"use client";

import React, { useState } from "react"; // Added useState
import Link from "next/link";
import { AppBar, Toolbar, Typography, Box, Button, Container } from "@mui/material";
// Import your modal component - adjust the path as needed
import SubscribeModal from "./SubscribeModal";
export default function PublicTopbar() {
  // 1. Setup state to control the modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          top: 0,
          zIndex: 1200,
          bgcolor: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
        }}
      >
        <Container maxWidth="lg">
          <Toolbar
            disableGutters
            sx={{
              display: "flex",
              justifyContent: "space-between",
              minHeight: { xs: 70, md: 90 },
            }}
          >
            <Link href="/blog" style={{ textDecoration: "none" }}>
              <Typography
                variant="h5"
                fontWeight={900}
                color="#020617"
                sx={{
                  letterSpacing: -0.5,
                  display: "flex",
                  alignItems: "center",
                  fontSize: { xs: "1.25rem", md: "1.6rem" }
                }}
              >
                Arihant <Box component="span" sx={{ color: "primary.main", ml: 0.8 }}>Blog</Box>
              </Typography>
            </Link>

            <Box sx={{ display: "flex", gap: 3, alignItems: "center" }}>
              <Button
                component={Link}
                href="/blog"
                sx={{
                  color: "#475569",
                  fontWeight: 700,
                  fontSize: "1rem",
                  textTransform: "none",
                  "&:hover": { color: "#020617", bgcolor: "transparent" }
                }}
              >
                Articles
              </Button>
              
              <Button
                variant="contained"
                disableElevation
                // 2. Add the trigger to the Subscribe button
                onClick={handleOpenModal} 
                sx={{
                  fontWeight: 800,
                  borderRadius: 2.5,
                  textTransform: "none",
                  px: 4,
                  py: 1.2,
                  fontSize: "0.95rem",
                  bgcolor: "#020617",
                  "&:hover": { bgcolor: "#1e293b" }
                }}
              >
                Subscribe
              </Button>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* 3. Render the Modal component */}
      <SubscribeModal 
        open={isModalOpen} 
        onClose={handleCloseModal} 
      />
    </>
  );
}