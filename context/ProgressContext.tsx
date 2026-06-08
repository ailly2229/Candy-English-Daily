"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "candy-english-progress";

export type LessonProgress = {
  completed: boolean;
  score: number;
  timeSpent: number;
  completedAt: string;
};

export type ProgressMap = Record<string, LessonProgress>;

type ProgressContextValue = {
  progress: ProgressMap;
  saveProgress: (lessonId: string, score: number, timeSpent: number) => void;
  getStats: () => {
    streak: number;
    completedCount: number;
    averageScore: number;
  };
};

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState<ProgressMap>({});

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setProgress(JSON.parse(stored) as ProgressMap);
      }
    } catch {
      setProgress({});
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  const value = useMemo<ProgressContextValue>(
    () => ({
      progress,
      saveProgress: (lessonId, score, timeSpent) => {
        setProgress((current) => ({
          ...current,
          [lessonId]: {
            completed: true,
            score,
            timeSpent,
            completedAt: new Date().toISOString()
          }
        }));
      },
      getStats: () => {
        const completed = Object.values(progress).filter((item) => item.completed);
        const averageScore =
          completed.length === 0
            ? 0
            : Math.round(completed.reduce((sum, item) => sum + item.score, 0) / completed.length);

        const days = new Set(
          completed.map((item) => new Date(item.completedAt).toISOString().slice(0, 10))
        );
        let streak = 0;
        const cursor = new Date();

        while (days.has(cursor.toISOString().slice(0, 10))) {
          streak += 1;
          cursor.setDate(cursor.getDate() - 1);
        }

        return {
          streak,
          completedCount: completed.length,
          averageScore
        };
      }
    }),
    [progress]
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error("useProgress must be used inside ProgressProvider");
  }

  return context;
}
