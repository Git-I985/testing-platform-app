export enum QuestionType {
  "text" = "text",
  "single" = "single",
  "multi" = "multi",
}

export type QuestionMeta = {
  title: string;
  description?: string | null;
  points: number;
  id: string;
};

export type TextQuestion = {
  type: QuestionType.text;
  answer: string;
} & QuestionMeta;

export type SingleOptionQuestion = {
  type: QuestionType.single;
  options: string[];
  answer: string;
} & QuestionMeta;

export type MultiOptionQuestion = {
  type: QuestionType.multi;
  options: { title: string; correct: boolean }[];
  answer: string[];
} & QuestionMeta;

export type Question =
  | TextQuestion
  | SingleOptionQuestion
  | MultiOptionQuestion;

export type Test = {
  title: string;
  description: string;
  users: string[];
  questions: Question[];
};

export function isTextQuestion(question: Question): question is TextQuestion {
  return question.type === QuestionType.text;
}

export function isSingleOptionQuestion(
  question: Question,
): question is SingleOptionQuestion {
  return question.type === QuestionType.single;
}