import { Delete } from "@mui/icons-material";
import { ButtonGroup, Paper, Stack } from "@mui/material";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import React from "react";

export function QuestionMetaActions({
  testNumber,
  points,
  onDecreaseButtonClick,
  onIncreaseButtonClick,
  onRemoveButtonClick,
  title,
  description,
  onDescriptionChange,
  onTitleChange,
}: {
  testNumber: number;
  points: number;
  onDecreaseButtonClick: () => void;
  onIncreaseButtonClick: () => void;
  onRemoveButtonClick: () => void;
  title: string;
  onTitleChange: (text: string) => void;
  description?: string | null;
  onDescriptionChange: (text: string) => void;
}) {
  return (
    <>
      <Stack direction={"row"} mb={2} alignItems={"center"}>
        <Typography variant={"h6"} color={"primary"}>
          Вопрос {testNumber}
        </Typography>
        <Stack
          direction={"row"}
          alignItems={"center"}
          ml={"auto"}
          spacing={2}
          component={(props) => (
            <Paper {...props} variant={"outlined"} sx={{ padding: 1 }} />
          )}
        >
          <Stack direction={"row"} spacing={2} alignItems={"center"}>
            <Typography>Кол-во баллов</Typography>
            <ButtonGroup variant="outlined" size={"small"}>
              <Button onClick={onDecreaseButtonClick}>-</Button>
              <Button disableRipple>{points}</Button>
              <Button onClick={onIncreaseButtonClick}>+</Button>
            </ButtonGroup>
          </Stack>
          <IconButton color={"error"} onClick={onRemoveButtonClick}>
            <Delete />
          </IconButton>
        </Stack>
      </Stack>
      <Stack spacing={2} mb={2}>
        <TextField
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          size={"small"}
          label={"Название"}
          required
        />
        <TextField
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          label={"Описание"}
          multiline
          rows={3}
        />
      </Stack>
    </>
  );
}