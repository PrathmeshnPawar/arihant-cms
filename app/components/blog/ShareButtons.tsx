"use client";

import { Box, Typography, Stack, IconButton, Tooltip, Snackbar, Alert } from "@mui/material";
import {
  Email,
  WhatsApp,
  Facebook,
  LinkedIn,
  ContentCopy
} from "@mui/icons-material";
import { useState } from "react";

interface ShareButtonsProps {
  url: string;
  title: string;
}

export default function ShareButtons({ url, title }: ShareButtonsProps) {
  const [open, setOpen] = useState(false);
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = [
    {
      name: "WhatsApp",
      icon: <WhatsApp />,
      color: "#25D366",
      href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    },
    {
      name: "Facebook",
      icon: <Facebook />,
      color: "#1877F2",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      name: "LinkedIn",
      icon: <LinkedIn />,
      color: "#0A66C2",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
    {
      name: "Email",
      icon: <Email />,
      color: "#EA4335",
      href: `mailto:?subject=${encodedTitle}&body=Check out this post: ${encodedUrl}`,
    },
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setOpen(true);
  };

  return (
    <Box sx={{ py: 4, mt: 4, borderTop: "1px solid", borderColor: "divider" }}>
      <Typography
        variant="caption"
        fontWeight={900}
        sx={{ textTransform: "uppercase", letterSpacing: 1.5, display: "block", mb: 2, color: "text.secondary" }}
      >
        Share this article
      </Typography>

      <Stack direction="row" spacing={1.5}>
        {shareLinks.map((link) => (
          <Tooltip key={link.name} title={`Share via ${link.name}`} arrow>
            <IconButton
              component="a"
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                bgcolor: "#f1f5f9",
                color: link.color,
                transition: "0.3s all ease-in-out",
                "&:hover": {
                  bgcolor: link.color,
                  color: "#fff",
                  transform: "translateY(-4px)",
                  boxShadow: `0 8px 20px -6px ${link.color}`,
                },
              }}
            >
              {link.icon}
            </IconButton>
          </Tooltip>
        ))}

        <Tooltip title="Copy Link" arrow>
          <IconButton
            onClick={handleCopy}
            sx={{
              bgcolor: "#f1f5f9",
              "&:hover": { bgcolor: "primary.main", color: "#fff", transform: "translateY(-4px)" }
            }}
          >
            <ContentCopy fontSize="small" />
          </IconButton>
        </Tooltip>
      </Stack>

      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%', fontWeight: 700 }}>
          Link copied to clipboard!
        </Alert>
      </Snackbar>
    </Box>
  );
}