import Quiz from "@/components/Quiz";

export default function Home() {
  return (
    <main>
      <section></section>
      <div className="container">
        <h1>Frontend - Технічна співбесіда</h1>
        <p className="lead">
          Підготуйся до технічної співбесіди — обирай категорію та починай тест
        </p>
        <Quiz />
      </div>
    </main>
  );
}
