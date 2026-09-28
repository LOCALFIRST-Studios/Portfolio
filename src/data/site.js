export const SITE = {
  name: "Local First",
  tagline: "Modern websites for local businesses that want a stronger online presence.",
  positioning: "Premium websites without agency-level pricing.",
  url: import.meta.env.VITE_SITE_URL || "http://localhost:5173",
  whatsapp: import.meta.env.VITE_WHATSAPP_NUMBER || "",
  email: import.meta.env.VITE_STUDIO_EMAIL || "",
  formspreeId: import.meta.env.VITE_FORMSPREE_ID || "",
};

export const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Work", to: "/work" },
  { label: "Pricing", to: "/pricing" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];
