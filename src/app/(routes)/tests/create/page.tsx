"use client";
import { Menu, MenuItem, Stack } from "@mui/material";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import React, { useState } from "react";

enum QuestionType {
  "text" = "text",
  "single" = "single",
  "multi" = "multi",
}

type QuestionMeta = {
  title: string;
  description?: string | null;
  points: number;
};

type TextQuestion = {
  type: QuestionType.text;
  answer: string;
} & QuestionMeta;

type SingleOptionQuestion = {
  type: QuestionType.single;
  options: { title: string; correct: boolean }[];
} & QuestionMeta;

type MultiOptionQuestion = {
  type: QuestionType.multi;
  options: { title: string; correct: boolean }[];
} & QuestionMeta;

export type Test = {
  name: string;
  questions: (TextQuestion | SingleOptionQuestion | MultiOptionQuestion)[];
};

export default function CreateTestPage() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [testState, setTestState] = useState({
    title: "",
    description: "",
    questions: [],
  });

  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  function addTextQuestion() {
    // setTestState({...testState, questions: })
  }
  function addSingleOptionQuestion() {}
  function addMultiOptionQuestion() {}

  return (
    <>
      <Typography mb={7} mt={5} variant={"h3"} color={"secondary.light"}>
        Создание теста
      </Typography>
      <Stack spacing={2}>
        <TextField
          label={"Название теста"}
          size={"small"}
          value={testState.title}
          onChange={(e) =>
            setTestState({ ...testState, title: e.target.value })
          }
        />
        <TextField
          multiline={true}
          label={"Описание теста"}
          rows={5}
          size={"small"}
          value={testState.description}
          onChange={(e) =>
            setTestState({ ...testState, description: e.target.value })
          }
        />
        <Button
          id="basic-button"
          aria-controls={open ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
        >
          Добавить вопрос
        </Button>
        <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
          <MenuItem
            onClick={() => {
              addTextQuestion();
              handleClose();
            }}
          >
            Текстовый ответ
          </MenuItem>
          <MenuItem
            onClick={() => {
              addSingleOptionQuestion();
              handleClose();
            }}
          >
            Одна опция
          </MenuItem>
          <MenuItem
            onClick={() => {
              addMultiOptionQuestion();
              handleClose();
            }}
          >
            Множественный выбор
          </MenuItem>
        </Menu>
      </Stack>
    </>
  );
}