"use client";
import { useState } from "react";
import { QuickTest } from "./quickTest";
import { QuizGenerator } from "./quizGenerator";
import { SummerizedSection } from "./summarizedArticle";

export const ArticleFlow = ({ selectedHistory }: any) => {
  const [expandedData, setExpandedData] = useState<any | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
  const [showQuickTest, setShowQuickTest] = useState(false);

  if (selectedHistory) {
    return (
      <SummerizedSection
        expandedTitle={selectedHistory.title}
        expandedContent={selectedHistory.content}
        setShowQuickTest={setShowQuickTest}
        setQuizQuestions={setQuizQuestions}
        fromHistory
      />
    );
  }

  if (!expandedData) {
    return (
      <div className="mt-40">
        <QuizGenerator setExpandedData={setExpandedData} />;
      </div>
    );
  }

  if (!showQuickTest) {
    return (
      <SummerizedSection
        expandedTitle={expandedData.expandedTitle}
        expandedContent={expandedData.expandedContent}
        setShowQuickTest={setShowQuickTest}
        setQuizQuestions={setQuizQuestions}
        fromHistory
      />
    );
  }

  return (
    <QuickTest
      // onSaved={newHistoryItem}
      questions={quizQuestions}
      setShowQuickTest={setShowQuickTest}
      title={selectedHistory?.expandedTitle || ""}
      content={selectedHistory?.expandedContent || ""}
    />
  );
};
