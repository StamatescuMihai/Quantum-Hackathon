import React, { useState, useEffect } from "react";
import { quizQuestions } from "./quiz_data";

const Quiz = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [randomQuestions, setRandomQuestions] = useState([]);

  /* -------- initialise six random questions -------- */
  useEffect(() => {
    const shuffled = [...quizQuestions]
      .sort(() => Math.random() - 0.5)
      .slice(0, 6);

    setRandomQuestions(shuffled);
  }, []);

  /* ------------------------------------------------- */
  const handleAnswerChange = (e) =>
    setAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: e.target.value,
    }));

  const handleNext = () => {
    if (currentQuestionIndex < randomQuestions.length - 1) {
      setCurrentQuestionIndex((i) => i + 1);
    } else {
      const correct = randomQuestions.filter(
        (q, idx) => q.correctAnswer === answers[idx]
      );
      setScore(correct.length);
    }
  };

  const current = randomQuestions[currentQuestionIndex];

  /* -------- graceful loading while questions mount -------- */
  if (!current) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <span className="animate-pulse text-slate-300">Loading quiz…</span>
      </div>
    );
  }

  /* -------- theme variables -------- */
  const total = randomQuestions.length;
  const progressPercent = ((currentQuestionIndex + (score !== null ? 1 : 0)) /
    total) *
    100;

  return (
    <section className="flex justify-center py-10">
      <div className="w-full max-w-xl rounded-3xl border border-blue-400/20
                      bg-gradient-to-br from-slate-900/70 via-blue-900/50 to-slate-800/70
                      p-8 shadow-xl shadow-blue-500/10 backdrop-blur">
        {/* progress bar */}
        <div className="mb-6">
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-700">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="mt-1 text-right text-xs text-slate-400">
            Question {currentQuestionIndex + 1} / {total}
          </p>
        </div>

        {/* quiz body */}
        {score !== null ? (
          <div className="text-center">
            <h2 className="mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-2xl font-extrabold text-transparent">
              Quiz Complete!
            </h2>
            <p className="text-lg text-blue-200">
              Your score:&nbsp;
              <span className="font-bold text-white">{score}</span> / {total}
            </p>
            <button
              onClick={() => {
                setScore(null);
                setCurrentQuestionIndex(0);
                setAnswers({});
              }}
              className="mt-6 rounded-xl bg-gradient-to-r
                         from-blue-500 to-purple-600 px-6 py-2 font-semibold
                         text-white transition hover:brightness-110"
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            <h2 className="mb-6 text-xl font-semibold text-white">
              {current.question}
            </h2>

            <div className="space-y-3">
              {current.options.map((option) => {
                const id = `${currentQuestionIndex}-${option}`;
                const checked = answers[currentQuestionIndex] === option;

                return (
                  <label
                    key={id}
                    htmlFor={id}
                    className={`flex cursor-pointer items-center rounded-xl border
                                px-4 py-3 transition
                                ${
                                  checked
                                    ? "border-blue-500 bg-blue-500/20"
                                    : "border-slate-600/40 hover:bg-slate-700/40"
                                }`}
                  >
                    <input
                      id={id}
                      type="radio"
                      name={`question-${currentQuestionIndex}`}
                      value={option}
                      checked={checked}
                      onChange={handleAnswerChange}
                      className="mr-3 h-4 w-4 accent-blue-500"
                    />
                    <span className="text-slate-200">{option}</span>
                  </label>
                );
              })}
            </div>

            <button
              onClick={handleNext}
              className="mt-8 flex w-full items-center justify-center rounded-xl bg-gradient-to-r
                         from-blue-500 to-purple-600 py-3 font-semibold text-white
                         transition hover:brightness-110"
            >
              {currentQuestionIndex < total - 1 ? "Next Question" : "Submit Quiz"}
            </button>
          </>
        )}
      </div>
    </section>
  );
};

export default Quiz;
