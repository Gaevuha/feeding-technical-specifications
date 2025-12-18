// /components/Quiz.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { questionsByCategory } from "@/data/questions";
import { Category, QuestionType } from "@/types/quiz";
import Question from "./Question";
import Result from "./Result";

const STORAGE_KEY = "quiz_last_score";
const THEME_KEY = "quiz_theme";
const DEFAULT_TIME = 60; // секунд на питання

export default function Quiz() {
  const [category, setCategory] = useState<Category | null>(null);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(DEFAULT_TIME);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // завантаження теми з localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme === "dark") {
      setTheme("dark");
      document.documentElement.setAttribute("data-theme", "dark");
    }
  }, []);

  // оновлення теми при зміні
  useEffect(() => {
    localStorage.setItem(THEME_KEY, theme);
    document.documentElement.setAttribute(
      "data-theme",
      theme === "dark" ? "dark" : "light"
    );
  }, [theme]);

  // питання для обраної категорії
  const questions: QuestionType[] = useMemo(
    () => (category ? questionsByCategory[category] || [] : []),
    [category]
  );

  // таймер
  useEffect(() => {
    if (!category || finished) return;

    setTimeLeft(DEFAULT_TIME);
    const interval = setInterval(() => {
      setTimeLeft((s) => {
        if (s <= 1) {
          handleAnswer(false, true);
          return DEFAULT_TIME;
        }
        return s - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, current, finished]);

  const handleAnswer = (isCorrect: boolean, fromTimer = false) => {
    if (finished) return;

    if (isCorrect) setScore((p) => p + 1);

    if (current + 1 < questions.length) {
      setCurrent((p) => p + 1);
      setTimeLeft(DEFAULT_TIME);
    } else {
      setFinished(true);
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          category,
          score: isCorrect ? score + 1 : score,
          total: questions.length,
          date: Date.now(),
        })
      );
    }
  };

  const restart = () => {
    setCurrent(0);
    setScore(0);
    setFinished(false);
    setCategory(null);
    setTimeLeft(DEFAULT_TIME);
  };

  // якщо категорія не обрана
  if (!category) {
    return (
      <div className="card">
        <div className="topbar" style={{ marginBottom: 12 }}>
          <div>
            <strong>Оберіть категорію</strong>
            <div className="small muted">HTML+CSS / JS / React</div>
          </div>
          <div className="controls">
            <button
              className="theme-toggle"
              onClick={() =>
                setTheme((t) => (t === "light" ? "dark" : "light"))
              }
            >
              Тема: {theme === "light" ? "Світла" : "Темна"}
            </button>
          </div>
        </div>

        <div className="buttons">
          <button onClick={() => setCategory("html+css")}>HTML+CSS</button>
          <button onClick={() => setCategory("js")}>JavaScript</button>
          <button onClick={() => setCategory("react")}>React</button>
        </div>

        <small className="note">
          Результати зберігаються локально. На кожне питання — {DEFAULT_TIME}{" "}
          секунд.
        </small>
      </div>
    );
  }

  // якщо питань немає (безпечний fallback)
  if (!questions.length) {
    return (
      <div className="card">
        <div>Питання для цієї категорії не знайдено.</div>
        <button onClick={() => setCategory(null)}>
          Оберіть іншу категорію
        </button>
      </div>
    );
  }

  // якщо вікторина завершена
  if (finished) {
    return (
      <Result
        score={score}
        total={questions.length}
        restart={restart}
        category={category}
      />
    );
  }

  const progress = Math.round((current / questions.length) * 100);

  return (
    <div className="card">
      <div className="topbar">
        <div>
          <div className="small muted">
            Категорія: <strong>{category.toUpperCase()}</strong>
          </div>
          <div>
            Питання {current + 1} / {questions.length}
          </div>
        </div>
        <div className="controls">
          <div className="timer">⏱ {timeLeft}s</div>
          <button
            className="theme-toggle"
            onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
          >
            Тема: {theme === "light" ? "Світла" : "Темна"}
          </button>
        </div>
      </div>

      <div style={{ marginTop: 12 }}>
        <div className="progress" aria-hidden>
          <div className="progress-inner" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div style={{ marginTop: 12 }}>
        <Question
          data={questions[current]}
          onAnswer={(isCorrect) => handleAnswer(isCorrect)}
          current={current}
          total={questions.length}
        />
      </div>

      <div style={{ marginTop: 12 }} className="buttons">
        <button
          className="ghost"
          onClick={() => {
            setCategory(null);
            setCurrent(0);
            setScore(0);
          }}
        >
          Змінити категорію
        </button>
        <button
          className="ghost"
          onClick={() => {
            localStorage.clear();
            alert("LocalStorage очищено");
          }}
        >
          Очистити localStorage
        </button>
      </div>
    </div>
  );
}
