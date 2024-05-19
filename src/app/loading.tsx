import { CircularProgress } from "@mui/material";
import Box from "@mui/material/Box";

export default function LoadingPage() {
  return (
    <Box
      sx={{
        height: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <CircularProgress color="secondary" />
    </Box>
  );
}