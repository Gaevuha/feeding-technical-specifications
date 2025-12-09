"use client";

import React, { useState } from "react";
import { QuestionType } from "@/types/quiz";

interface QuestionProps {
  data: QuestionType;
  onAnswer: (isCorrect: boolean) => void;
  current: number;
  total: number;
}

export default function Question({ data, onAnswer }: QuestionProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  const handleClick = (idx: number) => {
    if (revealed) return;
    setSelected(idx);
    setRevealed(true);
    const isCorrect = data.answers[idx].correct;
    setTimeout(() => {
      onAnswer(isCorrect);
      setSelected(null);
      setRevealed(false);
    }, 700);
  };

  return (
    <div>
      <h3 className="question-title">{data.question}</h3>

      <div className="answers">
        {data.answers.map((a, i) => {
          const className =
            revealed && selected === i
              ? a.correct
                ? "answer-btn correct"
                : "answer-btn wrong"
              : "answer-btn";
          return (
            <button
              key={i}
              className={className}
              onClick={() => handleClick(i)}
            >
              {a.text}
            </button>
          );
        })}
      </div>
    </div>
  );
}
