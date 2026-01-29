import { Box, Container, Skeleton, Stack, Divider } from "@mui/material";
import Grid from "@mui/material/Grid";

export default function Loading() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* 1. Breadcrumb Skeleton (Home > Blog) */}
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Skeleton variant="text" width={40} height={20} />
          <Box sx={{ opacity: 0.5 }}>{">"}</Box>
          <Skeleton variant="text" width={40} height={20} />
        </Stack>
      </Box>

      {/* 2. Top Section: Trending (Left) & Product News (Right) */}
      <Grid container spacing={4}>
        {/* Trending Post Skeleton */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Skeleton variant="text" width={150} height={40} sx={{ mb: 3 }} />
          <Box sx={{ borderRadius: 4, overflow: "hidden" }}>
            <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 4 }} />
            <Box sx={{ py: 2 }}>
              <Skeleton variant="text" width="20%" height={20} />
              <Skeleton variant="text" width="80%" height={50} sx={{ mt: 1 }} />
              <Skeleton variant="text" width="40%" height={20} sx={{ mt: 1 }} />
            </Box>
          </Box>
        </Grid>

        {/* Product News Sidebar Skeleton */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Skeleton variant="text" width={150} height={40} sx={{ mb: 3 }} />
          <Stack spacing={3}>
            {[1, 2, 3, 4].map((i) => (
              <Box key={i} sx={{ pb: 2, borderBottom: "1px solid", borderColor: "divider" }}>
                <Skeleton variant="text" width="30%" />
                <Skeleton variant="text" width="100%" height={25} />
                <Skeleton variant="text" width="80%" height={25} />
                <Skeleton variant="rounded" width={60} height={20} sx={{ mt: 1 }} />
              </Box>
            ))}
          </Stack>
        </Grid>
      </Grid>

      {/* 3. Latest Stories Header & Grid */}
      <Stack direction="row" justifyContent="space-between" sx={{ mt: 5, mb: 3 }}>
        <Skeleton variant="text" width={200} height={40} />
        <Skeleton variant="text" width={80} height={30} />
      </Stack>

      <Grid container spacing={3}>
        {[1, 2, 3].map((i) => (
          <Grid size={{ xs: 12, sm: 4 }} key={i}>
            <Box>
              <Skeleton variant="rectangular" height={180} sx={{ borderRadius: 3, mb: 2 }} />
              <Skeleton variant="text" width="30%" />
              <Skeleton variant="text" width="90%" height={25} />
              <Skeleton variant="text" width="50%" height={20} />
            </Box>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}