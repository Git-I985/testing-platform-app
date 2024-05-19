import Typography from "@mui/material/Typography";
import * as React from "react";

export function Copyright(props: any) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      © Автоматизированная система тестирования {new Date().getFullYear()}.
    </Typography>
  );
}