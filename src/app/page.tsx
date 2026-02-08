"use client";

import { useEffect, useState, useCallback } from "react";
import { QuizGenerator } from "./features/quizGenerator";
import { SideBarSection } from "./features/sideBar";
import { SummerizedSection } from "./features/summarizedArticle";
import { Navbar } from "./features/navbar";
import { QuickTest } from "./features/quickTest";

export default function Page() {
  const [selectedHistory, setSelectedHistory] = useState<{
    expandedTitle: string;
    expandedContent: string;
  } | null>(null);

  const [showQuickTest, setShowQuickTest] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  const fetchHistory = useCallback(async () => {
    setHistoryLoading(true);
    try {
      const res = await fetch("/api/history");
      const data = await res.json();
      setHistory(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("History fetch error:", err);
      setHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleDeleteHistory = async (id: string) => {
    try {
      const res = await fetch(`/api/history?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setHistory((prev) => prev.filter((item) => item.id !== id));
        if (selectedHistory) {
          setSelectedHistory(null);
        }
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="flex">
        <SideBarSection
          history={history}
          historyLoading={historyLoading}
          onSelectHistory={(item) => {
            setSelectedHistory({
              expandedTitle: item.expandedTitle ?? item.title ?? "",
              expandedContent: item.expandedContent ?? item.content ?? "",
            });
          }}
          onDeleteHistory={handleDeleteHistory}
          onRefresh={fetchHistory}
          activeId={selectedHistory?.expandedTitle || "no title"}
        />

        <div className="flex-1 pt-12 max-sm:pt-0">
          {!selectedHistory && !showQuickTest && (
            <QuizGenerator setExpandedData={setSelectedHistory} />
          )}

          {selectedHistory && !showQuickTest && (
            <SummerizedSection
              expandedTitle={selectedHistory.expandedTitle}
              expandedContent={selectedHistory.expandedContent}
              fromHistory={true}
              onBack={() => setSelectedHistory(null)}
              setShowQuickTest={setShowQuickTest}
              setQuizQuestions={setQuizQuestions}
            />
          )}

          {showQuickTest && selectedHistory && (
            <QuickTest
              setShowQuickTest={setShowQuickTest}
              questions={quizQuestions}
              title={selectedHistory.expandedTitle}
              content={selectedHistory.expandedContent}
              onSaved={(savedItem) => {
                setSelectedHistory(null);
                setHistory((prev) => [savedItem, ...prev]);
                setShowQuickTest(false);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
