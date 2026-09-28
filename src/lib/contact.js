import { SITE } from "../data/site";

export function whatsappUrl(message = "Hi, I would like to start a website project.") {
  if (!SITE.whatsapp) return null;
  const digits = SITE.whatsapp.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function mailtoUrl(subject, body) {
  if (!SITE.email) return null;
  return `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
