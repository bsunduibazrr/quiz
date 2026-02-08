"use client";

import { useRef, useState } from "react";
import { SideBar, RefreshLogo, TrashLogo } from "../_components/icons/icon";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@clerk/nextjs";

export const SideBarSection = ({
  history,
  historyLoading,
  onSelectHistory,
  onDeleteHistory,
  onRefresh,
  activeId,
}: {
  history: any[];
  historyLoading: boolean;
  onSelectHistory: (h: any) => void;
  onDeleteHistory: (id: string) => void;
  onRefresh: () => void;
  activeId: string | null;
}) => {
  const [open, setOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement | null>(null);
  const { isSignedIn } = useUser();

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setDeletingId(id);
    await onDeleteHistory(id);
    setDeletingId(null);
  };

  const formatDateKey = (date: Date) => date.toLocaleDateString("en-CA");

  const getDateLabel = (dateKey: string) => {
    const today = formatDateKey(new Date());
    const yesterday = formatDateKey(new Date(Date.now() - 86400000));
    if (dateKey === today) return "Today";
    if (dateKey === yesterday) return "Yesterday";
    return dateKey;
  };

  const groupedHistory = Array.isArray(history)
    ? history.reduce((acc: any, item) => {
        const key = formatDateKey(new Date(item.createdAt));
        if (!acc[key]) acc[key] = [];
        acc[key].push(item);
        return acc;
      }, {})
    : {};

  return (
    <div className="relative">
      <div className="h-screen bg-white border-r w-[72px] flex justify-center">
        <div
          className="pt-4 cursor-pointer active:scale-95 transition"
          onClick={() => setOpen((p) => !p)}
        >
          <SideBar />
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={ref}
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 72, opacity: 1 }}
            exit={{ x: -50, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute top-0 h-screen w-[300px] max-sm:w-[220px] bg-white border-r shadow-lg z-50 p-4"
          >
            <div className="flex justify-between items-center mb-4">
              <p className="text-lg font-bold text-black">History</p>
              <div className="flex items-center gap-2">
                <button
                  onClick={onRefresh}
                  disabled={historyLoading}
                  className={`w-6 h-6 border rounded-full text-black cursor-pointer flex justify-center items-center ${
                    historyLoading ? "animate-spin" : ""
                  }`}
                  title="Refresh"
                >
                  <RefreshLogo />
                </button>
                <button
                  onClick={() => setOpen(false)}
                  className="w-6 h-6 border rounded-full text-black cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="max-h-[85%] overflow-y-auto">
              {!isSignedIn ? (
                <div className="flex flex-col items-center justify-center mt-10">
                  <p className="text-sm text-gray-500 mb-4 text-center">
                    Please log in to see your history
                  </p>
                </div>
              ) : historyLoading ? (
                <div className="flex flex-col gap-2">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="w-full h-5 bg-gray-200 rounded animate-pulse"
                    ></div>
                  ))}
                </div>
              ) : history.length === 0 ? (
                <p className="text-sm text-black mt-10 text-center">
                  No history yet
                </p>
              ) : (
                Object.entries(groupedHistory).map(([dateKey, items]: any) => (
                  <div key={dateKey} className="mb-5">
                    <p className="text-xs font-semibold text-gray-500 mb-2">
                      {getDateLabel(dateKey)}
                    </p>
                    <div className="flex flex-col gap-1">
                      {items.map((h: any) => {
                        const isActive = activeId === h.title;
                        const isDeleting = deletingId === h.id;
                        return (
                          <div
                            key={h.id}
                            className="group relative flex items-center"
                          >
                            <button
                              onClick={() =>
                                onSelectHistory({
                                  id: h.id,
                                  expandedTitle: h.title,
                                  expandedContent: h.content,
                                })
                              }
                              disabled={isDeleting}
                              className={`flex-1 text-left font-semibold p-2 rounded transition cursor-pointer truncate ${
                                isActive
                                  ? "bg-black text-white"
                                  : "hover:bg-gray-100 text-black"
                              } ${isDeleting ? "opacity-50" : ""}`}
                            >
                              {h.title}
                            </button>
                            <button
                              onClick={(e) => handleDelete(e, h.id)}
                              disabled={isDeleting}
                              className="cursor-pointer p-1 ml-1 rounded "
                              title="Delete"
                            >
                              <TrashLogo />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
