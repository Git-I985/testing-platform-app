"use client";
import {
  isSingleOptionQuestion,
  isTextQuestion,
  Question,
  QuestionType,
} from "@/app/(routes)/tests/create/types";
import { Paper, Radio, Stack } from "@mui/material";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export function TestCompleteForm({ test }: { test: any }) {
  const [answers, setAnswers] = useState<Record<string, string[] | string>>({});
  const router = useRouter();

  function submit() {
    const requestOptions = {
      method: "POST",
      body: JSON.stringify(answers),
    };
    fetch(`/api/tests/${test.id}/submit`, requestOptions)
      .then((response) => response.json())
      .then(() => router.push("/tests"))
      .catch((error) => console.error(error));
  }

  function submitNotCompleted() {
    test.content.questions.forEach(({ id, type }: Question) => {
      if (!answers.hasOwnProperty(id)) {
        if (type === QuestionType.multi) {
          answers[id] = [];
        } else {
          answers[id] = "";
        }
      }
    });
    submit();
  }

  return (
    <Stack spacing={2}>
      {test.content.questions.map((question: Question, i: number) => {
        return (
          <Paper key={i} sx={{ p: 3 }} variant={"outlined"}>
            <Typography variant={"caption"}>Вопрос {i + 1}</Typography>
            <Typography variant={"h6"} mt={3}>
              {question.title}
            </Typography>
            <Typography variant={"body2"} mt={2} mb={4}>
              {question.description}
            </Typography>
            {isTextQuestion(question) ? (
              <TextField
                fullWidth
                multiline
                label={"Ответ"}
                size={"small"}
                onChange={(e) => {
                  setAnswers({
                    ...answers,
                    [question.id]: e.target.value,
                  });
                }}
              />
            ) : isSingleOptionQuestion(question) ? (
              <Stack spacing={2} key={"single-option-answer"}>
                {question.options.map((option: any, index: number) => (
                  <Stack direction={"row"} alignItems={"center"} key={index}>
                    <Typography>{option}</Typography>
                    <Radio
                      checked={answers[question.id] === option}
                      onChange={() => {
                        setAnswers({
                          ...answers,
                          [question.id]: option,
                        });
                      }}
                      color={"success"}
                      name={question.id}
                    />
                  </Stack>
                ))}
              </Stack>
            ) : null}
          </Paper>
        );
      })}
      <Stack direction={"row"} justifyContent={"space-between"} mt={2}>
        <Button
          onClick={submit}
          variant={"contained"}
          disabled={test.content.questions.some(
            (q: Question) => !answers[q.id],
          )}
        >
          Завершить прохождение
        </Button>
        <Button
          onClick={submitNotCompleted}
          variant={"outlined"}
          color={"error"}
        >
          Завершить досрочно
        </Button>
      </Stack>
    </Stack>
  );
}