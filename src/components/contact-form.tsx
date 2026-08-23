"use client";

import { useId, useState } from "react";
import { contactPage } from "@/lib/content";
import { ArrowRight } from "./primitives";

type Errors = Partial<Record<"name" | "email" | "company" | "message", string>>;

const fieldBase =
  "w-full rounded-lg border bg-card px-4 py-3 text-ink placeholder:text-ink-faint transition-colors duration-200 focus:border-teal focus:outline-none";

export function ContactForm() {
  const uid = useId();
  const [errors, setErrors] = useState<Errors>({});
  const [needs, setNeeds] = useState<string[]>([]);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [serverError, setServerError] = useState("");

  const fid = (name: string) => `${uid}-${name}`;

  function toggleNeed(need: string) {
    setNeeds((current) =>
      current.includes(need)
        ? current.filter((n) => n !== need)
        : [...current, need],
    );
  }

  function validate(data: FormData): Errors {
    const next: Errors = {};
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const company = String(data.get("company") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();

    if (!name) next.name = "Please enter your name.";
    if (!email) next.email = "Please enter your work email.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email))
      next.email = "That email address doesn't look right.";
    if (!company) next.company = "Please enter your company name.";
    if (message.length < 20)
      next.message =
        "A sentence or two about the work helps us give a useful reply.";

    return next;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    const nextErrors = validate(data);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      // Move focus to the first field with a problem.
      const firstKey = Object.keys(nextErrors)[0];
      form.querySelector<HTMLElement>(`[name="${firstKey}"]`)?.focus();
      return;
    }

    setStatus("sending");
    setServerError("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          company: data.get("company"),
          website: data.get("website"),
          teamSize: data.get("teamSize"),
          tools: data.get("tools"),
          message: data.get("message"),
          needs,
        }),
      });

      if (!response.ok) throw new Error(await response.text());
      setStatus("sent");
      form.reset();
      setNeeds([]);
    } catch {
      setStatus("error");
      setServerError(
        "We couldn't send that. Please try again, or email us directly.",
      );
    }
  }

  if (status === "sent") {
    return (
      <div
        role="status"
        className="edge-light relative overflow-hidden rounded-2xl border border-teal/25 bg-[linear-gradient(150deg,#eef7fa_0%,#dceef5_100%)] p-10 text-center shadow-[0_18px_44px_-24px_rgba(0,52,89,0.35)]"
      >
        <h2 className="gradient-text text-3xl font-semibold">Thank you — we have it.</h2>
        <p className="mt-4 text-ink-muted">
          We&rsquo;ll read your message properly and come back with how we
          would structure the role or team. Expect a reply from a person, not an
          autoresponder.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-7 cursor-pointer text-[0.9375rem] font-medium text-accent-text underline underline-offset-4"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-7">
      <div className="grid gap-6 sm:grid-cols-2">
        <Field
          id={fid("name")}
          name="name"
          label="Full name"
          required
          error={errors.name}
          autoComplete="name"
        />
        <Field
          id={fid("email")}
          name="email"
          type="email"
          label="Work email"
          required
          error={errors.email}
          autoComplete="email"
        />
        <Field
          id={fid("company")}
          name="company"
          label="Company"
          required
          error={errors.company}
          autoComplete="organization"
        />
        <Field
          id={fid("website")}
          name="website"
          label="Website"
          hint="Optional"
          autoComplete="url"
          placeholder="example.com"
        />
      </div>

      <fieldset>
        <legend className="text-[0.9375rem] font-medium text-ink">
          What do you need support with?
          <span className="ml-2 font-normal text-ink-faint">
            Select any that apply
          </span>
        </legend>
        <div className="mt-4 flex flex-wrap gap-2.5">
          {contactPage.needs.map((need) => {
            const selected = needs.includes(need);
            return (
              <label
                key={need}
                className={`cursor-pointer rounded-full border px-4 py-2.5 text-[0.9375rem] transition-colors duration-200 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-teal ${
                  selected
                    ? "border-teal bg-teal text-white shadow-[0_2px_8px_-2px_rgba(0,126,167,0.5)]"
                    : "border-rule-strong bg-card text-ink-muted hover:border-ink"
                }`}
              >
                <input
                  type="checkbox"
                  name="needs"
                  value={need}
                  checked={selected}
                  onChange={() => toggleNeed(need)}
                  className="sr-only"
                />
                {need}
              </label>
            );
          })}
        </div>
      </fieldset>

      <div>
        <label
          htmlFor={fid("teamSize")}
          className="block text-[0.9375rem] font-medium text-ink"
        >
          How many people are you looking to start with?
        </label>
        <select
          id={fid("teamSize")}
          name="teamSize"
          defaultValue={contactPage.teamSizes[0]}
          className={`${fieldBase} mt-2.5 border-rule-strong`}
        >
          {contactPage.teamSizes.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>

      <Field
        id={fid("tools")}
        name="tools"
        label="Tools and systems you use"
        hint="Optional"
        placeholder="CRM, property management software, help desk…"
      />

      <Field
        id={fid("message")}
        name="message"
        label="Tell us about the work"
        required
        multiline
        error={errors.message}
        placeholder="What's taking up your team's time right now, and what would you want a Vastisol team member handling first?"
      />

      {status === "error" && (
        <p role="alert" className="text-[0.9375rem] text-destructive">
          {serverError}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-5 pt-1">
        <button
          type="submit"
          disabled={status === "sending"}
          className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-full bg-accent px-7 py-3 text-[0.9375rem] font-medium text-white transition-colors duration-200 hover:bg-accent-hover disabled:cursor-wait disabled:opacity-70"
        >
          {status === "sending" ? "Sending…" : "Send message"}
          {status !== "sending" && <ArrowRight />}
        </button>
        <p className="text-sm text-ink-faint">
          We&rsquo;ll only use your details to reply to this enquiry.
        </p>
      </div>
    </form>
  );
}

function Field({
  id,
  name,
  label,
  type = "text",
  required = false,
  multiline = false,
  hint,
  error,
  ...rest
}: {
  id: string;
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  multiline?: boolean;
  hint?: string;
  error?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  const errorId = `${id}-error`;

  const shared = {
    id,
    name,
    "aria-invalid": error ? (true as const) : undefined,
    "aria-describedby": error ? errorId : undefined,
    className: `${fieldBase} mt-2.5 ${error ? "border-destructive" : "border-rule-strong"}`,
  };

  return (
    <div className={multiline ? "sm:col-span-2" : undefined}>
      <label htmlFor={id} className="block text-[0.9375rem] font-medium text-ink">
        {label}
        {hint && <span className="ml-2 font-normal text-ink-faint">{hint}</span>}
        {required && (
          <span aria-hidden="true" className="ml-1 text-teal">
            *
          </span>
        )}
      </label>

      {multiline ? (
        <textarea {...shared} rows={6} placeholder={rest.placeholder} />
      ) : (
        <input {...shared} type={type} {...rest} />
      )}

      {error && (
        <p id={errorId} className="mt-2 text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
