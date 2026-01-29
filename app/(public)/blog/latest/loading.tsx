// import { Box, CircularProgress, Typography } from "@mui/material";

// export default function Loading() {
//   return (
//     <Box
//       sx={{
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//         justifyContent: "center",
//         minHeight: "60vh",
//         gap: 2,
//       }}
//     >
//       <CircularProgress size={50} thickness={4} />
//       <Typography variant="body1" color="text.secondary" fontWeight={600}>
//         Fetching the latest stories...
//       </Typography>
//     </Box>
//   );
// }

import { Box, Container,  Skeleton, Stack } from "@mui/material";
import   Grid from "@mui/material/Grid";

export default function Loading() {
  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      {/* Title Skeleton */}
      <Skeleton 
        variant="text" 
        width={300} 
        height={60} 
        sx={{ mb: 4, borderRadius: 2 }} 
      />

      <Grid container spacing={4}>
        {/* We generate 6 "fake" cards to fill the screen */}
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <Grid  size={{xs:12, sm:6, md:4}} key={item}>
            <Box 
              sx={{ 
                borderRadius: 3, 
                border: '1px solid', 
                borderColor: 'divider',
                overflow: 'hidden' 
              }}
            >
              {/* Image Skeleton - Matches your 200px height */}
              <Skeleton variant="rectangular" height={200} animation="wave" />
              
              <Box sx={{ p: 2 }}>
                {/* Category Chip Skeleton */}
                <Skeleton 
                  variant="rounded" 
                  width="40%" 
                  height={24} 
                  sx={{ mb: 2, borderRadius: 5 }} 
                />
                
                {/* Title Line 1 & 2 */}
                <Stack spacing={1} sx={{ mb: 2 }}>
                  <Skeleton variant="text" width="100%" height={25} />
                  <Skeleton variant="text" width="70%" height={25} />
                </Stack>

                {/* Footer Metadata (Reading time + Date) */}
                <Skeleton variant="text" width="50%" height={20} />
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}