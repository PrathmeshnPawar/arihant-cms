import { Breadcrumbs, Link as MuiLink, Typography, Box } from "@mui/material";
import Link from "next/link";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

type Props = {
  category?: { name: string; slug: string };
  title: string;
};

export default function BlogBreadcrumbs({ category, title }: Props) {
  return (
    <Box sx={{ mb: 3 }}>
      <Breadcrumbs 
        separator={<NavigateNextIcon fontSize="small" />} 
        aria-label="breadcrumb"
        sx={{ fontSize: "0.875rem", color: "text.secondary" }}
      >
        {/* Home Link */}
        <MuiLink component={Link} underline="hover" color="inherit" href="/">
          Home
        </MuiLink>

        {/* Blog Index Link */}
        <MuiLink component={Link} underline="hover" color="inherit" href="/blog">
          Blog
        </MuiLink>

        {/* Category Link (if exists) */}
        {category && (
          <MuiLink
            component={Link}
            underline="hover"
            color="inherit"
            href={`/blog/category/${category.slug}`}
          >
            {category.name}
          </MuiLink>
        )}

        {/* Current Post Title (Non-clickable) */}
        <Typography color="text.primary" fontWeight={500} sx={{ 
          display: '-webkit-box',
          WebkitLineClamp: 1,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {title}
        </Typography>
      </Breadcrumbs>
    </Box>
  );
}