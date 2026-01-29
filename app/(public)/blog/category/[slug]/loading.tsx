import { Box, Container, Skeleton, Stack } from "@mui/material";
import Grid from "@mui/material/Grid";

export default function CategoryLoading() {
  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      {/* Category Title Skeleton (e.g., Personal Finance) */}
      <Box sx={{ mb: 6 }}>
        <Skeleton variant="text" width={320} height={60} sx={{ mb: 1 }} />
        <Skeleton variant="text" width={200} height={20} />
      </Box>

      {/* Grid of Posts */}
      <Grid container spacing={4}>
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item}>
            <Box sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
              <Skeleton variant="rectangular" height={180} animation="wave" />
              <Box sx={{ p: 2.5 }}>
                <Skeleton variant="text" width="100%" height={25} />
                <Skeleton variant="text" width="70%" height={25} sx={{ mb: 1.5 }} />
                <Skeleton variant="text" width="45%" height={20} />
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* Back button skeleton */}
      <Skeleton variant="text" width={120} height={30} sx={{ mt: 4 }} />
    </Container>
  );
}