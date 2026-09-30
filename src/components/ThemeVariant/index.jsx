import { useTheme } from "../../contexts/ThemeContext";

/**
 * Component that renders different variants based on current theme
 */
export function ThemeVariant({ night, day, fallback = null }) {
  const { currentTheme } = useTheme();

  switch (currentTheme) {
    case 'night':
      return night || fallback;
    case 'day':
      return day || fallback;
    default:
      return fallback;
  }
}

/**
 * Hook for conditional theme-based CSS classes
 */
export function useThemeClasses(nightClasses, dayClasses) {
  const { isDayMode } = useTheme();
  return isDayMode ? dayClasses : nightClasses;
}
