import { ChangeEvent, FormEvent, useState } from "react";

type ContactField = "name" | "email" | "reason" | "message";
type ContactErrors = Partial<Record<ContactField, string>>;

function validateContactField(field: ContactField, value: string) {
  if (field === "name" && !value.trim()) return "Please enter your name.";
  if (field === "email") {
    if (!value.trim()) return "Please enter your email address.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) return "Please enter a valid email address.";
  }
  if (field === "reason" && !value) return "Please select a reason.";
  if (field === "message" && !value.trim()) return "Please enter your message.";
  return "";
}

export default function ContactSection() {
  const [submissionAttempted, setSubmissionAttempted] = useState(false);
  const [validationAttempted, setValidationAttempted] = useState(false);
  const [errors, setErrors] = useState<ContactErrors>({});

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    const nextErrors: ContactErrors = {
      name: validateContactField("name", String(values.get("name") ?? "")),
      email: validateContactField("email", String(values.get("email") ?? "")),
      reason: validateContactField("reason", String(values.get("reason") ?? "")),
      message: validateContactField("message", String(values.get("message") ?? "")),
    };
    setValidationAttempted(true);
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) {
      setSubmissionAttempted(false);
      return;
    }
    setSubmissionAttempted(true);
  }

  function handleFieldChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    if (!validationAttempted) return;
    const field = event.target.name as ContactField;
    setErrors((current) => ({ ...current, [field]: validateContactField(field, event.target.value) }));
    setSubmissionAttempted(false);
  }

  const fieldClass = "motion-hover mt-2 min-h-12 w-full border-0 border-b border-navy/60 bg-transparent px-0 py-3 text-base text-navy outline-none hover:border-navy focus:border-navy focus:ring-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brass-dark";
  const errorMessage = (field: ContactField) => errors[field] && <p id={`contact-${field}-error`} role="alert" className="mt-1.5 text-xs leading-5 text-[#9b1c1c]">{errors[field]}</p>;
  const invalidStyle = (field: ContactField) => errors[field] ? { borderColor: "#9b1c1c" } : undefined;

  return (
    <section id="contact" className="contact-section relative bg-ivory py-24 text-navy md:py-36">
      <div className="site-container grid gap-12 md:grid-cols-[1fr_1fr] md:gap-20">
        <div>
          <p className="eyebrow text-brass-dark">Contact CATS</p>
          <h2 className="film-heading mt-5 md:text-[clamp(3rem,6vw,5.5rem)]">Get in touch.</h2>
          <p className="mt-6 max-w-md text-lg leading-8 text-on-ivory">Send us a question, a requirement or a demo request.</p>
        </div>

        <form className="grid gap-5" onSubmit={handleSubmit} noValidate>
          <div>
            <label htmlFor="contact-name" className="text-xs font-semibold uppercase tracking-[0.14em] text-on-ivory">Name</label>
            <input id="contact-name" name="name" type="text" autoComplete="name" required aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "contact-name-error" : undefined} onChange={handleFieldChange} style={invalidStyle("name")} className={fieldClass} />
            {errorMessage("name")}
          </div>
          <div>
            <label htmlFor="contact-email" className="text-xs font-semibold uppercase tracking-[0.14em] text-on-ivory">Email ID</label>
            <input id="contact-email" name="email" type="email" autoComplete="email" required aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "contact-email-error" : undefined} onChange={handleFieldChange} style={invalidStyle("email")} className={fieldClass} />
            {errorMessage("email")}
          </div>
          <div>
            <label htmlFor="contact-reason" className="text-xs font-semibold uppercase tracking-[0.14em] text-on-ivory">Reason for Message</label>
            <div className="relative">
              <select id="contact-reason" name="reason" required defaultValue="" aria-invalid={Boolean(errors.reason)} aria-describedby={errors.reason ? "contact-reason-error" : undefined} onChange={handleFieldChange} style={invalidStyle("reason")} className={`${fieldClass} appearance-none pr-12 [color-scheme:light]`}>
                <option value="" disabled>Select a reason</option>
                <option>General Inquiry</option>
                <option>Product Information</option>
                <option>Request a Demo</option>
                <option>Technical Support</option>
                <option>Other</option>
              </select>
              <span aria-hidden="true" className="pointer-events-none absolute right-4 top-1/2 h-2 w-2 -translate-y-1/2 rotate-45 border-b border-r border-navy" />
            </div>
            {errorMessage("reason")}
          </div>
          <div>
            <label htmlFor="contact-message" className="text-xs font-semibold uppercase tracking-[0.14em] text-on-ivory">Message</label>
            <textarea id="contact-message" name="message" required rows={4} aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? "contact-message-error" : undefined} onChange={handleFieldChange} style={invalidStyle("message")} className={`${fieldClass} resize-y`} />
            {errorMessage("message")}
          </div>
          <div className="flex flex-wrap items-center gap-5">
            <button type="submit" className="motion-hover inline-flex min-h-12 items-center gap-3 border border-navy bg-navy px-7 text-sm font-medium text-ivory hover:bg-transparent hover:text-navy focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brass-dark">
              Send Message <span aria-hidden="true">→</span>
            </button>
            {submissionAttempted && <p role="status" className="max-w-md text-xs leading-5 text-on-ivory">Your message has not been sent because form submission is not configured yet. Your entries remain in the form.</p>}
          </div>
        </form>
      </div>
    </section>
  );
}