"use client";

import { Box, Typography, Divider, Container } from "@mui/material";

export default function PublicFooter() {
  return (
    <Box sx={{ mt: 6, bgcolor: "#fafafa", borderTop: "1px solid #eee" }}>
      <Container sx={{ py: 3 }}>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} Arihant Capital Blog. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}
