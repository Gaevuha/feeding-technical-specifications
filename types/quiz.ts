export type Category = "html" | "js" | "react";

export interface AnswerType {
  text: string;
  correct: boolean;
}

export interface QuestionType {
  id: string;
  question: string;
  answers: AnswerType[];
}
