"use client";

import { useState } from "react";
import { AiLogo, BookLogo, SummaryLogo } from "../_components/icons/icon";

type Question = {
  question: string;
  options: string[];
  answer: string;
};

export const SummerizedSection = ({
  expandedTitle,
  expandedContent,
  fromHistory = false,
  onBack,
  setShowQuickTest,
  setQuizQuestions,
  setSelectedHistory,
}: {
  expandedTitle: string;
  expandedContent: string;
  fromHistory?: boolean;
  onBack?: () => void;
  setShowQuickTest: (v: boolean) => void;
  setQuizQuestions: (q: Question[]) => void;
  setSelectedHistory?: (v: {
    expandedTitle: string;
    expandedContent: string;
  }) => void;
}) => {
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  console.log(expandedContent, expandedTitle, "content & title");

  const handleTakeQuiz = async () => {
    if (!expandedContent) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/generate-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: expandedContent,
          articleId: "cmjgg0peb0003apia41nfrznk",
        }),
      });

      if (!res.ok) throw new Error("Quiz generate failed");

      const data = await res.json();

      if (!Array.isArray(data.questions)) {
        throw new Error("questions hooson");
      }

      if (setSelectedHistory) {
        setSelectedHistory({
          expandedTitle,
          expandedContent,
        });
      }

      setQuizQuestions(data.questions);
      setShowQuickTest(true);
    } catch (err) {
      console.error(err);
      setError("Quiz uusgehed alda");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-full px-4 sm:px-0">
      <div className="w-full max-w-[628px] flex justify-start">
        <div className="pt-12 max-sm:pt-8">
          {fromHistory && (
            <button
              onClick={onBack}
              className="mb-4 flex items-center gap-2 text-sm text-black cursor-pointer border border-[#e4e4e7] w-10 h-10 justify-center rounded-lg shadow-lg"
            >
              ◀︎
            </button>
          )}
        </div>
      </div>

      <div className="pt-6 sm:pt-8 flex justify-center w-full">
        <div className="flex flex-col w-full max-w-[628px] bg-white rounded-lg p-4 sm:p-6 shadow-lg border">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <AiLogo />
                <p className="text-xl sm:text-[24px] font-semibold text-black">
                  Article Quiz Generator
                </p>
              </div>
              <p className="text-sm text-gray-600 flex items-center gap-2 mt-3">
                <BookLogo /> Summarized content
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-5">
            <div>
              <p className="text-lg sm:text-[24px] font-semibold text-black">
                {expandedTitle}
              </p>
              <p className="text-sm mt-2 text-black">{expandedContent}</p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <SummaryLogo />
                <p className="text-sm font-semibold text-gray-500">
                  Article Content
                </p>
              </div>

              <p className="text-sm text-black">{expandedContent}</p>

              <div className="flex justify-end mt-2">
                <span
                  onClick={() => setOpenModal(true)}
                  className="text-sm hover:underline cursor-pointer text-black"
                >
                  See more
                </span>
              </div>

              {error && <p className="text-sm text-red-600 mt-2">{error}</p>}

              <button
                onClick={handleTakeQuiz}
                disabled={loading}
                className={`mt-4 w-full sm:w-36 h-10 rounded-lg text-white  ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-black hover:bg-gray-900 cursor-pointer"
                }`}
              >
                {loading ? "Generating quiz..." : "Take quiz"}
              </button>
            </div>
          </div>

          {openModal && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-lg flex justify-center items-center z-50 px-4">
              <div className="bg-white w-full max-w-[628px] p-4 sm:p-6 rounded-lg">
                <div className="flex justify-between mb-4">
                  <p className="text-lg sm:text-xl font-semibold text-black">
                    {expandedTitle || "No title"}
                  </p>
                  <button
                    onClick={() => setOpenModal(false)}
                    className="text-black cursor-pointer border border-black w-8 h-8 transition-all hover:text-red-500 hover:border-red-500 rounded-full"
                  >
                    ✕
                  </button>
                </div>
                <p className="whitespace-pre-line text-sm text-black">
                  {expandedContent}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
