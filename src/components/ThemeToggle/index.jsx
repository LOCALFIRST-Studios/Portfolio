import { useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";

export default function ThemeToggle() {
  const { currentTheme, toggleTheme } = useTheme();
  
  // Only show in development
  if (import.meta.env.PROD) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[9999]">
      <button
        onClick={toggleTheme}
        className="flex h-12 w-12 items-center justify-center rounded-full border border-line bg-bg-elevated text-ink shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-105"
        title={`Current: ${currentTheme}`}
      >
        <span className="text-xs font-mono">{currentTheme === 'day' ? 'D' : 'N'}</span>
      </button>
    </div>
  );
}