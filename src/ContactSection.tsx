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

  const fieldClass = "mt-2 min-h-12 w-full rounded-[7px] border border-white/20 bg-transparent px-4 py-3 text-sm text-white outline-none transition-colors hover:border-white/40 focus:border-white/55 focus:ring-1 focus:ring-white/20 placeholder:text-white/30";
  const errorMessage = (field: ContactField) => errors[field] && <p id={`contact-${field}-error`} role="alert" className="mt-1.5 text-xs leading-5 text-red-400">{errors[field]}</p>;
  const invalidStyle = (field: ContactField) => errors[field] ? { borderColor: "#f87171" } : undefined;

  return (
    <section id="contact" className="relative scroll-mt-8 border-t border-white/10 bg-[var(--site-background)] px-6 py-20 text-white md:px-10 md:py-28">
      <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-0 h-14 w-px -translate-x-1/2 bg-gradient-to-b from-[var(--accent-red)]/40 to-transparent" />
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-[0.8fr_1.2fr] md:gap-20">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[var(--accent-red)]">Contact CATS</p>
          <h2 className="mt-5 text-4xl font-black tracking-tight md:text-6xl">Let&apos;s Connect.</h2>
          <p className="mt-5 max-w-md text-base leading-7 text-[var(--body-copy)]">Have a question or something in mind? We&apos;d love to hear from you.</p>
        </div>

        <form className="grid gap-5" onSubmit={handleSubmit} noValidate>
          <div>
            <label htmlFor="contact-name" className="text-xs font-semibold text-white/80">Name</label>
            <input id="contact-name" name="name" type="text" autoComplete="name" required aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "contact-name-error" : undefined} onChange={handleFieldChange} style={invalidStyle("name")} className={fieldClass} />
            {errorMessage("name")}
          </div>
          <div>
            <label htmlFor="contact-email" className="text-xs font-semibold text-white/80">Email ID</label>
            <input id="contact-email" name="email" type="email" autoComplete="email" required aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "contact-email-error" : undefined} onChange={handleFieldChange} style={invalidStyle("email")} className={fieldClass} />
            {errorMessage("email")}
          </div>
          <div>
            <label htmlFor="contact-reason" className="text-xs font-semibold text-white/80">Reason for Message</label>
            <div className="relative">
              <select id="contact-reason" name="reason" required defaultValue="" aria-invalid={Boolean(errors.reason)} aria-describedby={errors.reason ? "contact-reason-error" : undefined} onChange={handleFieldChange} style={invalidStyle("reason")} className={`${fieldClass} appearance-none pr-12 [color-scheme:dark]`}>
                <option value="" disabled>Select a reason</option>
                <option>General Inquiry</option>
                <option>Product Information</option>
                <option>Request a Demo</option>
                <option>Technical Support</option>
                <option>Other</option>
              </select>
              <span aria-hidden="true" className="pointer-events-none absolute right-4 top-1/2 h-2 w-2 -translate-y-1/2 rotate-45 border-b border-r border-white/60" />
            </div>
            {errorMessage("reason")}
          </div>
          <div>
            <label htmlFor="contact-message" className="text-xs font-semibold text-white/80">Message</label>
            <textarea id="contact-message" name="message" required rows={4} aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? "contact-message-error" : undefined} onChange={handleFieldChange} style={invalidStyle("message")} className={`${fieldClass} resize-y`} />
            {errorMessage("message")}
          </div>
          <div className="flex flex-wrap items-center gap-5">
            <button type="submit" className="inline-flex min-h-12 items-center gap-3 rounded-[7px] border border-white/70 bg-white px-6 text-[10px] font-bold uppercase tracking-[0.22em] text-black transition-colors hover:border-white hover:bg-white/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
              Send Message <span aria-hidden="true">→</span>
            </button>
            {submissionAttempted && <p role="status" className="max-w-md text-xs leading-5 text-white/55">Your message has not been sent because form submission is not configured yet. Your entries remain in the form.</p>}
          </div>
        </form>
      </div>
    </section>
  );
}