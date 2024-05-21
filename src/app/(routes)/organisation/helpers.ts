import { GridEventListener, GridRowEditStopReasons } from "@mui/x-data-grid";

export const handleRowEditStop: GridEventListener<"rowEditStop"> = (
  params,
  event,
) => {
  if (params.reason === GridRowEditStopReasons.rowFocusOut) {
    event.defaultMuiPrevented = true;
  }
};