"use client";
import { QuestionMetaActions } from "@/app/(routes)/tests/create/QuestionMetaActions";
import { TextQuestionBody } from "@/app/(routes)/tests/create/TextQuestionBody";
import {
  isSingleOptionQuestion,
  isTextQuestion,
  QuestionType,
  SingleOptionQuestion,
  Test,
  TextQuestion,
} from "@/app/(routes)/tests/create/types";
import { useOrganisation } from "@/app/WithOrganisation";
import { Add, RemoveCircleOutline, Save } from "@mui/icons-material";
import {
  Autocomplete,
  Chip,
  Menu,
  MenuItem,
  Paper,
  Radio,
  Stack,
} from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

function SingleOptionQuestionBody({
  addOption,
  removeOption,
  question,
  setAnswer,
  setOptionText,
}: any) {
  return (
    <>
      <Typography variant={"body2"} mb={2}>
        Опции
      </Typography>
      <Stack spacing={2}>
        {question.options.map((option: any, index: number) => {
          return (
            <Stack direction={"row"} alignItems={"center"} key={index}>
              <TextField
                variant={"standard"}
                size={"small"}
                onChange={(e) => setOptionText(e.target.value, index)}
              />
              <Radio
                checked={
                  option.length &&
                  question.answer.length &&
                  option === question.answer
                }
                onChange={() => setAnswer(option)}
                color={"success"}
                name={question.id}
              />
              <IconButton
                color={"error"}
                size={"small"}
                onClick={() => removeOption(index)}
              >
                <RemoveCircleOutline />
              </IconButton>
            </Stack>
          );
        })}
      </Stack>
      <Button sx={{ mt: 2 }} onClick={addOption}>
        Добавить опцию
      </Button>
    </>
  );
}

export default function CreateTestPage() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [testState, setTestState] = useState<Test>({
    title: "",
    description: "",
    users: [],
    questions: [],
  });
  const { organisation } = useOrganisation();
  const router = useRouter();

  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  function onTitleChange(text: string, index: number) {
    setTestState({
      ...testState,
      questions: testState.questions.map((q, i) => {
        if (index !== i) {
          return q;
        } else {
          return {
            ...q,
            title: text,
          };
        }
      }),
    });
  }

  function onDescriptionChange(text: string, index: number) {
    setTestState({
      ...testState,
      questions: testState.questions.map((q, i) => {
        if (index !== i) {
          return q;
        } else {
          return {
            ...q,
            description: text,
          };
        }
      }),
    });
  }

  function onChangePoints(increase: boolean, index: number) {
    setTestState({
      ...testState,
      questions: testState.questions.map((q, i) => {
        if (index !== i) {
          return q;
        } else {
          return {
            ...q,
            points: increase
              ? q.points + 1
              : q.points - 1 <= 1
                ? 1
                : q.points - 1,
          };
        }
      }),
    });
  }

  function addOption(questionIndex: number) {
    setTestState({
      ...testState,
      questions: testState.questions.map((q, i) =>
        i !== questionIndex
          ? q
          : ({
              ...q,
              options: [...(q as SingleOptionQuestion).options, ""],
            } as SingleOptionQuestion),
      ),
    });
  }

  function removeOption(questionIndex: number, optionIndex: number) {
    setTestState({
      ...testState,
      questions: testState.questions.map((q, i) =>
        i !== questionIndex
          ? q
          : ({
              ...q,
              options: (q as SingleOptionQuestion).options.filter(
                (_, optionIterationIndex) =>
                  optionIterationIndex !== optionIndex,
              ),
            } as SingleOptionQuestion),
      ),
    });
  }

  function setOptionText(
    questionIndex: number,
    optionIndex: number,
    text: string,
  ) {
    setTestState({
      ...testState,
      questions: testState.questions.map((q, i) =>
        i !== questionIndex
          ? q
          : ({
              ...q,
              options: (q as SingleOptionQuestion).options.map(
                (option, index) => (index === optionIndex ? text : option),
              ),
            } as SingleOptionQuestion),
      ),
    });
  }

  function removeQuestion(index: number) {
    setTestState({
      ...testState,
      questions: testState.questions.filter((q, i) => i !== index),
    });
  }

  function addTextQuestion() {
    setTestState({
      ...testState,
      questions: [
        ...testState.questions,
        {
          title: "",
          description: "",
          type: QuestionType.text,
          answer: "",
          points: 1,
          id: Date.now().toString(36),
        },
      ],
    });
  }

  function addSingleOptionQuestion() {
    setTestState({
      ...testState,
      questions: [
        ...testState.questions,
        {
          title: "",
          description: "",
          type: QuestionType.single,
          options: [],
          answer: "",
          points: 1,
          id: Date.now().toString(36),
        },
      ],
    });
  }

  function addMultiOptionQuestion() {}

  function save() {
    const requestOptions = {
      method: "POST",
      body: JSON.stringify(testState),
    };
    fetch("/api/tests", requestOptions)
      .then((response) => response.json())
      .then(() => router.push("/tests"))
      .catch((error) => console.error(error));
  }

  function setQuestionAnswer(questionIndex: number, answer: any) {
    setTestState({
      ...testState,
      questions: testState.questions.map((q, i) =>
        i !== questionIndex ? q : ({ ...q, answer: answer } as TextQuestion),
      ),
    });
  }

  return (
    <>
      <Stack
        direction={"row"}
        alignItems={"center"}
        justifyContent={"space-between"}
        mb={7}
        mt={5}
      >
        <Typography variant={"h3"} color={"secondary.light"}>
          Создание теста
        </Typography>
        <Button variant={"contained"} endIcon={<Save />} onClick={save}>
          Сохранить
        </Button>
      </Stack>
      <pre>
        <code>{JSON.stringify(testState, null, 2)}</code>
      </pre>
      <Stack spacing={2}>
        <Typography variant={"h5"}>Общая информация</Typography>
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
        <Autocomplete
          multiple
          options={organisation?.users || []}
          getOptionLabel={(option) => option.name || option.email}
          size={"small"}
          onChange={(_, state) => {
            setTestState({
              ...testState,
              users: state.map((u) => u.email),
            });
          }}
          renderInput={(params) => (
            <TextField {...params} variant="outlined" label="Студенты" />
          )}
        />
        <Typography variant={"h5"}>
          Вопросы <Chip label={testState.questions.length} />
        </Typography>
        {testState.questions.map((q, index) => {
          return (
            <Paper key={index} sx={{ p: 2 }} variant={"outlined"}>
              <QuestionMetaActions
                testNumber={index + 1}
                onDecreaseButtonClick={() => onChangePoints(false, index)}
                onIncreaseButtonClick={() => onChangePoints(true, index)}
                onRemoveButtonClick={() => removeQuestion(index)}
                points={q.points}
                title={q.title}
                description={q.description}
                onTitleChange={(text) => onTitleChange(text, index)}
                onDescriptionChange={(text) => onDescriptionChange(text, index)}
              />
              {isTextQuestion(q) ? (
                <TextQuestionBody
                  correctAnswer={q.answer}
                  onCorrectAnswerChange={(text) =>
                    setQuestionAnswer(index, text)
                  }
                />
              ) : isSingleOptionQuestion(q) ? (
                <SingleOptionQuestionBody
                  question={q}
                  setAnswer={(answer: string) => {
                    if (!answer) {
                      return;
                    }
                    setQuestionAnswer(index, answer);
                  }}
                  setOptionText={(text: string, optionIndex: number) =>
                    setOptionText(index, optionIndex, text)
                  }
                  removeOption={(optionIndex: number) =>
                    removeOption(index, optionIndex)
                  }
                  addOption={() => addOption(index)}
                />
              ) : null}
            </Paper>
          );
        })}
        <Box display={"flex"} justifyContent={"center"}>
          <Button
            endIcon={<Add />}
            onClick={handleClick}
            size={"large"}
            variant={"contained"}
          >
            Добавить
          </Button>
        </Box>
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