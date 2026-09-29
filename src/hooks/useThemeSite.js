import { useTheme } from "../contexts/ThemeContext";
import { SITE } from "../data/site";

/**
 * Hook to get theme-aware site data
 * Returns appropriate site data based on current theme
 */
export function useThemeSite() {
  const { isDayMode } = useTheme();

  return {
    name: isDayMode ? SITE.nameStudios : SITE.name,
    tagline: isDayMode ? SITE.taglineStudios : SITE.tagline,
    positioning: isDayMode ? SITE.positioningStudios : SITE.positioning,
    url: SITE.url,
    whatsapp: SITE.whatsapp,
    email: SITE.email,
    formspreeId: SITE.formspreeId,
  };
}