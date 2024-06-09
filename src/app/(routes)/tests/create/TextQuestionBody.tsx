"use client";
import TextField from "@mui/material/TextField";

interface TextQuestionBodyProps {
  onCorrectAnswerChange: (text: string) => void;
  correctAnswer: string;
}

export function TextQuestionBody({
  correctAnswer,
  onCorrectAnswerChange,
}: TextQuestionBodyProps) {
  return (
    <TextField
      value={correctAnswer}
      size={"small"}
      label={"Правильный ответ"}
      fullWidth
      required
      color={"success"}
      onChange={(e) => onCorrectAnswerChange(e.target.value)}
    />
  );
}