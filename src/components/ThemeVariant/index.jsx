import { useTheme } from "../../contexts/ThemeContext";

/**
 * Component that renders different variants based on current theme
 * @param {Object} props
 * @param {React.ReactNode} props.night - Component/content for night theme
 * @param {React.ReactNode} props.day - Component/content for day theme
 * @param {React.ReactNode} props.fallback - Fallback content if no theme match
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
 * Higher-order component that creates theme-aware component variants
 * @param {Object} components
 * @param {React.Component} components.night - Component for night theme
 * @param {React.Component} components.day - Component for day theme
 */
export function withThemeVariants(components) {
  return function ThemedComponent(props) {
    const { isDayMode } = useTheme();
    const Component = isDayMode ? components.day : components.night;
    return <Component {...props} />;
  };
}

/**
 * Hook for conditional theme-based values
 * @param {any} nightValue - Value for night theme
 * @param {any} dayValue - Value for day theme
 * @returns {any} - The appropriate value based on current theme
 */
export function useThemeValue(nightValue, dayValue) {
  const { isDayMode } = useTheme();
  return isDayMode ? dayValue : nightValue;
}

/**
 * Hook for conditional theme-based CSS classes
 * @param {string} nightClasses - CSS classes for night theme
 * @param {string} dayClasses - CSS classes for day theme
 * @returns {string} - The appropriate classes based on current theme
 */
export function useThemeClasses(nightClasses, dayClasses) {
  const { isDayMode } = useTheme();
  return isDayMode ? dayClasses : nightClasses;
}

/**
 * Component for theme-conditional CSS classes
 * Automatically applies different classes based on active theme
 */
export function ThemeClasses({ 
  children, 
  night = "", 
  day = "", 
  base = "",
  ...props 
}) {
  const themeClasses = useThemeClasses(night, day);
  const allClasses = `${base} ${themeClasses}`.trim();
  
  return (
    <div className={allClasses} {...props}>
      {children}
    </div>
  );
}