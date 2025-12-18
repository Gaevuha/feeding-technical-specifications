export type Category = "html+css" | "js" | "react" | "node";

export interface AnswerType {
  text: string;
  correct: boolean;
}

export interface QuestionType {
  id: string;
  question: string;
  answers: AnswerType[];
}
