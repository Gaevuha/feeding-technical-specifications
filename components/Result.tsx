import { Category } from "@/types/quiz";

interface ResultProps {
  score: number;
  total: number;
  restart: () => void;
  category: Category;
}

export default function Result({
  score,
  total,
  restart,
  category,
}: ResultProps) {
  return (
    <div>
      <h2>Тест завершено ✅</h2>
      <p>
        Категорія: <strong>{category.toUpperCase()}</strong>
      </p>
      <p>
        Результат: {score} / {total}
      </p>
      <button onClick={restart}>Почати знову</button>
    </div>
  );
}
