import { Box } from "@mui/material";
import Topbar from "./Topbar";
import Sidebar from "./Sidebar";

const TOPBAR_HEIGHT = 72;
const SIDEBAR_WIDTH = 260;

export default function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f6f7fb" }}>
      <Topbar />

      <Sidebar />

      {/* ✅ main content wrapper */}
      <Box
        sx={{
          pt: `${TOPBAR_HEIGHT}px`,            // ✅ pushes content below topbar
          pl: { xs: 0, md: `${SIDEBAR_WIDTH}px` }, // ✅ pushes content right of sidebar
        }}
      >
        <Box sx={{ p: 3 }}>{children}</Box>
      </Box>
    </Box>
  );
}
