"use client";
import { useState } from "react";
import { AiLogo, SummaryLogo } from "../_components/icons/icon";

export const QuizGenerator = ({
  setExpandedData,
}: {
  setExpandedData: React.Dispatch<
    React.SetStateAction<{
      expandedTitle: string;
      expandedContent: string;
    } | null>
  >;
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [errors, setErrors] = useState<{ title?: string; content?: string }>(
    {},
  );
  const [apiError, setApiError] = useState<string | null>(null);

  const handleGenerate = async () => {
    const newErrors: { title?: string; content?: string } = {};
    if (!title.trim()) newErrors.title = "Please enter an article title.";
    if (!content.trim()) newErrors.content = "Please enter article content.";
    setErrors(newErrors);
    setApiError(null);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);

    try {
      const res = await fetch("/api/article", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, userId: "34567890" }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to generate summary");
      }

      if (!data.expandedTitle || !data.expandedContent) {
        throw new Error("Invalid response from server");
      }

      setExpandedData({
        expandedTitle: data.expandedTitle,
        expandedContent: data.expandedContent,
      });
    } catch (err: any) {
      console.error(err);
      setApiError(
        err.message || "Failed to generate summary. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-8 px-4 sm:px-6 flex justify-center">
      <div className="flex flex-col w-full max-w-[860px] min-h-[482px] bg-white rounded-lg p-4 sm:p-6 shadow-2xl border border-[#E4E4E7]">
        <div className="flex items-center gap-2 mb-2">
          <AiLogo />
          <p className="text-[20px] sm:text-[22px] font-bold text-black">
            Article Quiz Generator
          </p>
        </div>

        <p className="text-[14px] sm:text-[16px] font-normal text-gray-700 leading-6 mb-4 sm:mb-6">
          Paste your article below to generate a summary and quiz questions.
          Your articles will be saved in the sidebar for future reference.
        </p>

        {apiError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600 text-sm">{apiError}</p>
          </div>
        )}

        <div className="flex flex-col gap-1 mb-4">
          <div className="flex gap-1 items-center">
            <SummaryLogo />
            <p className="text-[12px] sm:text-[14px] font-semibold text-[#71717A]">
              Article Title
            </p>
          </div>
          <input
            type="text"
            placeholder="Enter a title for your article..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`text-black border rounded-md w-full h-10 sm:h-11 px-3 outline-black ${
              errors.title ? "border-red-500" : "border-[#D4D4D8]"
            }`}
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title}</p>
          )}
        </div>

        <div className="flex flex-col gap-1 mb-4 sm:mb-6">
          <div className="flex gap-1 items-center">
            <SummaryLogo />
            <p className="text-[12px] sm:text-[14px] font-semibold text-[#71717A]">
              Article Content
            </p>
          </div>
          <textarea
            placeholder="Paste your article content here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className={`text-black border rounded-md w-full min-h-[120px] sm:min-h-32 p-2 sm:p-3 resize-none outline-black ${
              errors.content ? "border-red-500" : "border-[#D4D4D8]"
            }`}
          />
          {errors.content && (
            <p className="text-red-500 text-sm mt-1">{errors.content}</p>
          )}
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleGenerate}
            disabled={loading}
            className={`w-full sm:w-44 h-10 sm:h-11 rounded-lg font-semibold text-white transition-transform duration-300 transform ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-black cursor-pointer hover:-translate-y-1 hover:scale-105 hover:shadow-xl active:scale-100 active:translate-y-0"
            }`}
          >
            {loading ? "Generating..." : "Generate Summary"}
          </button>
        </div>
      </div>
    </div>
  );
};
