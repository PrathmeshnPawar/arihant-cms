import { Container, Box } from "@mui/material";
import PublicTopbar from "../components/blog/PublicNavbar";
import PublicFooter from "../components/blog/PublicFooter";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f8fafc", // subtle gray (Tailwind slate-50)
      }}
    >
      <PublicTopbar />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box
          sx={{
            bgcolor: "#fff",
            borderRadius: 3,
            boxShadow: "0 8px 30px rgba(0,0,0,0.04)",
            px: { xs: 2, md: 4 },
            py: { xs: 3, md: 4 },
          }}
        >
          {children}
        </Box>
      </Container>

      <PublicFooter />
    </Box>
  );
}
