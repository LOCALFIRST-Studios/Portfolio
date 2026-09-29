import { createContext, useContext, useEffect, useState } from "react";

// Theme variants
export const THEMES = {
  NIGHT: "night",
  DAY: "day",
};

// Default theme configuration
const THEME_CONFIG = {
  [THEMES.NIGHT]: {
    name: "Local First",
    description: "Dark futuristic design",
    class: "theme-night",
  },
  [THEMES.DAY]: {
    name: "Local First Studios", 
    description: "Light editorial design",
    class: "theme-day",
  },
};

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [currentTheme, setCurrentTheme] = useState(THEMES.NIGHT);

  // Initialize theme from URL params or localStorage
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlTheme = urlParams.get("theme");
    const savedTheme = localStorage.getItem("lf-theme");
    
    if (urlTheme && Object.values(THEMES).includes(urlTheme)) {
      setCurrentTheme(urlTheme);
      localStorage.setItem("lf-theme", urlTheme);
    } else if (savedTheme && Object.values(THEMES).includes(savedTheme)) {
      setCurrentTheme(savedTheme);
    }
  }, []);

  // Apply theme class to document
  useEffect(() => {
    const config = THEME_CONFIG[currentTheme];
    document.documentElement.className = config.class;
  }, [currentTheme]);

  const switchTheme = (theme) => {
    if (Object.values(THEMES).includes(theme)) {
      setCurrentTheme(theme);
      localStorage.setItem("lf-theme", theme);
      
      // Update URL without page reload
      const url = new URL(window.location);
      url.searchParams.set("theme", theme);
      window.history.replaceState({}, "", url);
    }
  };

  const toggleTheme = () => {
    const newTheme = currentTheme === THEMES.NIGHT ? THEMES.DAY : THEMES.NIGHT;
    switchTheme(newTheme);
  };

  // Keyboard shortcut for theme toggle (Cmd/Ctrl + Shift + T)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'T') {
        e.preventDefault();
        toggleTheme();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [toggleTheme]);

  const isDayMode = currentTheme === THEMES.DAY;
  const isNightMode = currentTheme === THEMES.NIGHT;

  const value = {
    currentTheme,
    themeConfig: THEME_CONFIG[currentTheme],
    switchTheme,
    toggleTheme,
    isDayMode,
    isNightMode,
    themes: THEME_CONFIG,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

// Hook for conditional rendering based on theme
export function useThemeVariant(nightComponent, dayComponent) {
  const { isDayMode } = useTheme();
  return isDayMode ? dayComponent : nightComponent;
}