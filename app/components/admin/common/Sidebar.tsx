"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import ArticleIcon from "@mui/icons-material/Article";
import CategoryIcon from "@mui/icons-material/Category";
import TagIcon from "@mui/icons-material/LocalOffer";
import ImageIcon from "@mui/icons-material/Image";
import PeopleIcon from "@mui/icons-material/People";
import { Drafts } from "@mui/icons-material";

const nav = [
  { label: "Dashboard", href: "/admin/dashboard", icon: <DashboardIcon /> },
  { label: "Posts", href: "/admin/posts", icon: <ArticleIcon /> },
  { label: "Categories", href: "/admin/categories", icon: <CategoryIcon /> },
  { label: "Tags", href: "/admin/tags", icon: <TagIcon /> },
  { label: "Media", href: "/admin/media", icon: <ImageIcon /> },
 // { label: "Users", href: "/admin/users", icon: <PeopleIcon /> },
  { label: "Drafts", href: "/admin/posts/drafts", icon: <Drafts /> },
];

export default function Sidebar() {
  console.log("✅ NEW SIDEBAR LOADED");

  const pathname = usePathname();

  return (
    <Box
      sx={{
        width: 260,
        position: "fixed",
        top: 56, // height of topbar
        left: 0,
        bottom: 0,
        bgcolor: "#1e3c72", // blue
        color: "white",
        display: { xs: "none", md: "block" },
      }}
    >
     

      <Divider sx={{ borderColor: "rgba(255,255,255,0.15)", pt:2 }} />

      <List sx={{ px: 1, py: 1 }}>
        {nav.map((item) => {
          const active = pathname.startsWith(item.href);

          return (
            <Link key={item.href} href={item.href} style={{ textDecoration: "none", color: "inherit" }}>
              <ListItemButton
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                  color: "white",
                  bgcolor: active ? "rgba(255,255,255,0.18)" : "transparent",
                  "&:hover": { bgcolor: "rgba(255,255,255,0.15)" },
                }}
              >
                <ListItemIcon sx={{ color: "white", minWidth: 42 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </Link>
          );
        })}
      </List>
    </Box>
  );
}
