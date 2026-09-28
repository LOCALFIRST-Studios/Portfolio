import { useState } from "react";
import Container from "../../components/Container";
import Seo from "../../components/Seo";
import MagneticButton from "../../components/MagneticButton";
import { mailtoUrl, whatsappUrl } from "../../lib/contact";
import { SITE } from "../../data/site";

const businessTypes = ["Gym", "PG", "Salon", "Café / restaurant", "Other local business"];
const budgets = ["Starter ₹6,999", "Professional ₹11,999", "Custom from ₹15,999", "Not sure yet"];

export default function Contact() {
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  async function onSubmit(event) {
    event.preventDefault();
    setError("");
    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries());

    if (!payload.name || !payload.business || !payload.phone || !payload.need) {
      setStatus("error");
      setError("Please fill in name, business name, phone / WhatsApp, and what you need.");
      return;
    }

    const message = [
      "New website enquiry",
      `Name: ${payload.name}`,
      `Business: ${payload.business}`,
      `Type: ${payload.type || "Not specified"}`,
      `Phone: ${payload.phone}`,
      `Need: ${payload.need}`,
      `Budget: ${payload.budget || "Not specified"}`,
      payload.message ? `Message: ${payload.message}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    if (SITE.formspreeId) {
      setStatus("submitting");
      try {
        const response = await fetch(`https://formspree.io/f/${SITE.formspreeId}`, {
          method: "POST",
          headers: { Accept: "application/json" },
          body: form,
        });
        if (!response.ok) throw new Error("Form failed");
        setStatus("success");
        event.currentTarget.reset();
        return;
      } catch {
        setStatus("error");
        setError("The form could not be sent. Use WhatsApp instead if you can.");
        return;
      }
    }

    const wa = whatsappUrl(message);
    const mail = mailtoUrl("Website enquiry", message);
    if (wa) {
      window.open(wa, "_blank", "noopener,noreferrer");
      setStatus("success");
      event.currentTarget.reset();
      return;
    }
    if (mail) {
      window.location.href = mail;
      setStatus("success");
      return;
    }

    try {
      await navigator.clipboard.writeText(message);
      setStatus("copied");
    } catch {
      setStatus("error");
      setError("Could not copy the enquiry. Add a WhatsApp number or email in site configuration.");
    }
  }

  const waDirect = whatsappUrl("Hi, I would like to start a website project.");

  return (
    <>
      <Seo
        title="Start a Project"
        description="Start a website project through a short enquiry or WhatsApp."
        path="/contact"
      />
      <section className="py-24">
        <Container className="grid gap-14 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <p className="text-sm uppercase tracking-[0.22em] text-accent">Contact</p>
            <h1 className="mt-4 text-4xl md:text-6xl">Start a project</h1>
            <p className="mt-4 max-w-md text-muted">
              Share the basics. We only ask for what is needed to reply. No unnecessary personal
              information.
            </p>
            {waDirect ? (
              <MagneticButton href={waDirect} variant="ghost" className="mt-8" target="_blank" rel="noreferrer">
                WhatsApp directly
              </MagneticButton>
            ) : (
              <p className="mt-8 text-sm text-muted">
                Direct WhatsApp will appear here once a number is added to the site configuration.
              </p>
            )}
          </div>

          <form onSubmit={onSubmit} className="grid gap-4 rounded-2xl border border-line p-6 md:p-8">
            <label className="grid gap-2 text-sm">
              Name
              <input name="name" required className="rounded-lg border border-line bg-bg-elevated px-3 py-2" />
            </label>
            <label className="grid gap-2 text-sm">
              Business name
              <input name="business" required className="rounded-lg border border-line bg-bg-elevated px-3 py-2" />
            </label>
            <label className="grid gap-2 text-sm">
              Business type
              <select name="type" className="rounded-lg border border-line bg-bg-elevated px-3 py-2">
                {businessTypes.map((type) => (
                  <option key={type}>{type}</option>
                ))}
              </select>
            </label>
            <label className="grid gap-2 text-sm">
              Phone / WhatsApp
              <input name="phone" required className="rounded-lg border border-line bg-bg-elevated px-3 py-2" />
            </label>
            <label className="grid gap-2 text-sm">
              What do you need?
              <input name="need" required className="rounded-lg border border-line bg-bg-elevated px-3 py-2" />
            </label>
            <label className="grid gap-2 text-sm">
              Budget
              <select name="budget" className="rounded-lg border border-line bg-bg-elevated px-3 py-2">
                {budgets.map((budget) => (
                  <option key={budget}>{budget}</option>
                ))}
              </select>
            </label>
            <label className="grid gap-2 text-sm">
              Message
              <textarea name="message" rows="4" className="rounded-lg border border-line bg-bg-elevated px-3 py-2" />
            </label>
            <MagneticButton type="submit" className="mt-2" disabled={status === "submitting"}>
              {status === "submitting" ? "Sending…" : "Submit enquiry"}
            </MagneticButton>
            {status === "success" && <p role="status">Enquiry ready. Check WhatsApp or your email client.</p>}
            {status === "copied" && (
              <p role="status">
                No WhatsApp number or email is configured yet, so the enquiry was copied to your clipboard.
              </p>
            )}
            {status === "error" && (
              <p role="alert" className="text-red-300">
                {error}
              </p>
            )}
          </form>
        </Container>
      </section>
    </>
  );
}
