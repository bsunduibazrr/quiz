"use client";

import { useState } from "react";
import {
  AiLogo,
  CorrectLogo,
  WrongLogo,
  RefreshLogo,
  SaveLogo,
} from "../_components/icons/icon";

type Question = {
  question: string;
  options: string[];
  answer: string;
};

type AnswerRecord = {
  question: string;
  selected: string;
  correct: string;
};

export const QuickTest = ({
  questions = [],
  setShowQuickTest,
  title,
  content,
  onSaved,
}: {
  questions: Question[];
  setShowQuickTest: (v: boolean) => void;
  title: string;
  content: string;
  onSaved: (item: any) => void;
}) => {
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [saving, setSaving] = useState(false);

  const total = questions.length;
  const current = questions[step];

  if (!questions.length) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-xl font-semibold text-black">Quiz questions alga</p>
      </div>
    );
  }

  const selectOption = (option: string) => {
    if (selected) return;

    setSelected(option);

    setAnswers((prev) => [
      ...prev,
      {
        question: current.question,
        selected: option,
        correct: current.answer,
      },
    ]);

    if (option === current.answer) {
      setScore((p) => p + 1);
    }

    setTimeout(() => {
      if (step < total - 1) {
        setStep((p) => p + 1);
        setSelected(null);
      } else {
        setShowResult(true);
      }
    }, 600);
  };

  if (showResult) {
    return (
      <div className="pt-8 px-4 flex justify-center">
        <div className="w-full max-w-[480px] bg-white p-5 rounded-lg shadow-lg border">
          <div className="flex flex-col gap-0">
            <h1 className="text-2xl font-bold mb-3 flex items-center gap-2 text-black">
              <AiLogo /> Quiz Completed
            </h1>
            <div className="pt-0">
              <p className="text-[#71717A]">Let's see what you did</p>
            </div>
          </div>
          <p className="mb-4 mt-2 font-semibold text-black">
            Score: {score} / {total}
          </p>

          <div className="space-y-3 mb-5">
            {answers.map((a, i) => {
              const isCorrect = a.selected === a.correct;
              return (
                <div
                  key={i}
                  className={`p-3 border rounded-md ${
                    isCorrect ? "border-green-500" : "border-red-500"
                  }`}
                >
                  <div className="flex gap-3">
                    {isCorrect ? <CorrectLogo /> : <WrongLogo />}
                    <div>
                      <p className="font-medium text-black">
                        {i + 1}. {a.question}
                      </p>
                      <p className="text-black text-sm">
                        Your answer:
                        <span
                          className={
                            isCorrect
                              ? "text-green-600 font-semibold"
                              : "text-red-600 font-semibold"
                          }
                        >
                          {a.selected}
                        </span>
                      </p>
                      {!isCorrect && (
                        <p className="text-sm text-green-600">
                          Correct: {a.correct}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex gap-3">
            <button
              className="flex-1 border rounded-lg py-2 cursor-pointer"
              onClick={() => {
                setStep(0);
                setScore(0);
                setAnswers([]);
                setSelected(null);
                setShowResult(false);
              }}
            >
              <span className="flex items-center gap-2 justify-center text-black transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 hover:shadow-xl active:scale-100 active:translate-y-0">
                <RefreshLogo /> Restart
              </span>
            </button>

            <button
              disabled={saving}
              className={`flex-1 rounded-lg py-2  cursor-pointer transition-all duration-300 transform
    ${
      saving
        ? "bg-gray-400 text-white cursor-not-allowed"
        : "bg-black text-white hover:-translate-y-1 hover:scale-105 hover:shadow-xl active:scale-100 active:translate-y-0"
    }`}
              onClick={async () => {
                if (saving) return;

                setSaving(true);

                try {
                  const res = await fetch("/api/quiz-result", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      title,
                      content,
                      score,
                      total,
                    }),
                  });

                  if (!res.ok) {
                    throw new Error("Save failed");
                  }

                  const saved = await res.json();

                  onSaved(saved);

                  setShowQuickTest(false);
                } catch (err) {
                  console.error(err);
                  alert("Save hiihd aldaa");
                } finally {
                  setSaving(false);
                }
              }}
            >
              <span className="flex items-center gap-2 justify-center">
                <SaveLogo />
                {saving ? "Saving..." : "Save & Leave"}
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-8 px-4 flex justify-center">
      <div className="w-full max-w-[520px] bg-white p-5 rounded-lg shadow-lg border">
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-bold text-black flex items-center gap-2">
            <AiLogo /> Quick Test
          </h2>
          <p className="text-sm text-gray-500">
            {step + 1} / {total}
          </p>
        </div>

        <p className="font-medium mb-4 text-black">{current.question}</p>

        <div className="grid sm:grid-cols-2 gap-3">
          {current.options.map((opt) => {
            const isCorrect = opt === current.answer;
            const isSelected = opt === selected;

            return (
              <button
                key={opt}
                onClick={() => selectOption(opt)}
                className={`min-h-11 rounded-md border text-black font-medium cursor-pointer transition ${
                  selected
                    ? isCorrect
                      ? "bg-green-300 border-green-600"
                      : isSelected
                      ? "bg-red-300 border-red-600"
                      : ""
                    : "hover:bg-amber-200"
                }`}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
