import { Container, Box } from "@mui/material";
import PublicTopbar from "../components/blog/PublicNavbar";
import PublicFooter from "../components/blog/PublicFooter";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#fff" }}>
      <PublicTopbar />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {children}
      </Container>
      <PublicFooter />
    </Box>
  );
}
