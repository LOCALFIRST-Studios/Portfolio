export const pricingTiers = [
  {
    id: "starter",
    name: "Starter",
    price: "₹6,999",
    blurb: "For businesses needing a simple online presence.",
    recommended: false,
    features: [
      "3–4 pages",
      "Responsive design",
      "Contact / WhatsApp",
      "Google Maps",
      "Basic SEO setup",
      "Deployment",
      "1 revision",
    ],
  },
  {
    id: "professional",
    name: "Professional",
    price: "₹11,999",
    blurb: "For businesses wanting a complete professional website.",
    recommended: true,
    features: [
      "6–8 pages or sections",
      "Premium custom UI",
      "Gallery",
      "Services / programs",
      "Testimonials (when you have them)",
      "Contact / enquiry form",
      "WhatsApp",
      "Click-to-call",
      "Google Maps",
      "Basic SEO setup",
      "Performance optimization",
      "Analytics / Search Console setup",
      "Complete source code",
      "2 revisions",
      "15-day bug support",
    ],
  },
  {
    id: "custom",
    name: "Custom",
    price: "Starting ₹15,999",
    blurb: "For custom functionality.",
    recommended: false,
    features: [
      "Booking systems",
      "Payment integrations",
      "Advanced forms",
      "Custom dashboards",
      "Other custom functionality",
    ],
  },
];

export const addOns = [
  { name: "Extra page", note: "Quoted per page depending on content and layout." },
  { name: "Additional revision", note: "Available after the included revision round." },
  { name: "Content writing", note: "If you need copy written rather than supplied." },
  { name: "Custom functionality", note: "Scoped after we understand the feature." },
  { name: "Maintenance", note: "Optional small monthly updates after launch." },
];

export const includedEverywhere = [
  "Mobile-friendly layout",
  "Clear contact path (call, WhatsApp, or form)",
  "Complete source code on delivery of Professional and Custom plans",
  "Basic SEO setup where specified — titles, descriptions, and sensible headings. Search rankings are not guaranteed.",
];

export const pricingNotes = [
  "Domain and hosting are separate.",
  "Basic SEO setup is included where specified. Search rankings are not guaranteed.",
];
