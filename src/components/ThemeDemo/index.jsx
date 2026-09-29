import { ThemeVariant, useThemeClasses } from "../ThemeVariant";
import { useTheme } from "../../contexts/ThemeContext";

export default function ThemeDemo() {
  const { currentTheme, themeConfig } = useTheme();
  
  // Example of conditional values - ONLY for demo purposes
  const greeting = "Welcome to Local First Studios";
  
  // Example of conditional classes
  const cardClasses = useThemeClasses(
    "bg-bg-elevated border border-line rounded-lg p-6", // Night
    "card-day bg-bg-elevated border border-line"        // Day
  );

  if (import.meta.env.PROD) return null; // Only show in development

  return (
    <div className="fixed top-4 left-4 z-[9998] max-w-sm">
      <div className={cardClasses}>
        <h3 className="font-display text-lg font-medium text-ink mb-3">
          Theme System Demo
        </h3>
        
        <div className="space-y-3 text-sm">
          <div>
            <strong>Active Theme:</strong> {themeConfig.name}
          </div>
          
          <div>
            <strong>Theme Class:</strong> {themeConfig.class}
          </div>
          
          <div>
            <strong>Conditional Text:</strong> {greeting}
          </div>
          
          {/* Example of ThemeVariant component */}
          <ThemeVariant
            night={<div className="text-accent">Night theme styling</div>}
            day={<div className="font-accent text-accent">Day theme styling</div>}
          />
        </div>
      </div>
    </div>
  );
}