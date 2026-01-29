import { Box, Container, Skeleton, Stack, Paper } from "@mui/material";

export default function Loading() {
  return (
    <Box>
      {/* Hero Section Skeleton */}
      <Skeleton 
        variant="rectangular" 
        height={420} 
        animation="wave"
        sx={{ borderRadius: 5, mb: 6 }} 
      />

      {/* Article Content Area */}
      <Container maxWidth="md">
        {/* Tags Row */}
        <Stack direction="row" spacing={1} mb={3}>
          <Skeleton variant="rounded" width={80} height={32} sx={{ borderRadius: 5 }} />
          <Skeleton variant="rounded" width={100} height={32} sx={{ borderRadius: 5 }} />
        </Stack>

        {/* Excerpt Block */}
        <Paper elevation={0} sx={{ p: 3, mb: 4, borderRadius: 3, bgcolor: '#f8fafc' }}>
          <Skeleton variant="text" width="100%" height={30} />
          <Skeleton variant="text" width="95%" height={30} />
          <Skeleton variant="text" width="40%" height={30} />
        </Paper>

        {/* Paragraphs */}
        {[1, 2, 3].map((p) => (
          <Box key={p} sx={{ mb: 4 }}>
            <Skeleton variant="text" width="100%" height={25} />
            <Skeleton variant="text" width="100%" height={25} />
            <Skeleton variant="text" width="98%" height={25} />
            <Skeleton variant="text" width="90%" height={25} />
          </Box>
        ))}

        {/* Image Placeholder inside content */}
        <Skeleton 
          variant="rectangular" 
          height={400} 
          sx={{ borderRadius: 3, my: 4 }} 
        />
      </Container>
    </Box>
  );
}