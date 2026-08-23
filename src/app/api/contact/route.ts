import { NextResponse } from "next/server";
import { site } from "@/lib/content";

/**
 * Contact form handler.
 *
 * Delivery is via Resend's REST API (no SDK dependency). To go live, set these
 * environment variables — in `.env.local` for development and in your host's
 * dashboard for production:
 *
 *   RESEND_API_KEY   API key from https://resend.com
 *   CONTACT_TO       Inbox that should receive enquiries
 *   CONTACT_FROM     A verified sender on your domain, e.g. website@vastisol.com
 *
 * Until RESEND_API_KEY is set, submissions are logged to the server console and
 * the form reports success so the flow can be tested locally. Nothing is emailed.
 */

type Payload = {
  name?: string;
  email?: string;
  company?: string;
  website?: string;
  teamSize?: string;
  tools?: string;
  message?: string;
  needs?: string[];
};

const clean = (value: unknown, max = 2000) =>
  typeof value === "string" ? value.trim().slice(0, max) : "";

export async function POST(request: Request) {
  let body: Payload;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const name = clean(body.name, 120);
  const email = clean(body.email, 200);
  const company = clean(body.company, 160);
  const website = clean(body.website, 200);
  const teamSize = clean(body.teamSize, 60);
  const tools = clean(body.tools, 400);
  const message = clean(body.message, 5000);
  const needs = Array.isArray(body.needs)
    ? body.needs.map((n) => clean(n, 60)).filter(Boolean).slice(0, 12)
    : [];

  // Server-side validation mirrors the client so the endpoint can't be bypassed.
  if (!name || !company || message.length < 20) {
    return NextResponse.json(
      { error: "Please complete the required fields." },
      { status: 400 },
    );
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return NextResponse.json(
      { error: "Please provide a valid email address." },
      { status: 400 },
    );
  }

  const lines = [
    `Name:      ${name}`,
    `Email:     ${email}`,
    `Company:   ${company}`,
    website && `Website:   ${website}`,
    needs.length && `Needs:     ${needs.join(", ")}`,
    teamSize && `Team size: ${teamSize}`,
    tools && `Tools:     ${tools}`,
    "",
    message,
  ]
    .filter(Boolean)
    .join("\n");

  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.warn(
      "[contact] RESEND_API_KEY is not set — logging submission instead of emailing.\n" +
        lines,
    );
    return NextResponse.json({ ok: true, delivered: false });
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM ?? `Vastisol Website <${site.email}>`,
        to: [process.env.CONTACT_TO ?? site.email],
        reply_to: email,
        subject: `New enquiry — ${company}`,
        text: lines,
      }),
    });

    if (!response.ok) {
      console.error("[contact] Resend rejected the request:", await response.text());
      return NextResponse.json(
        { error: "Delivery failed." },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true, delivered: true });
  } catch (error) {
    console.error("[contact] Delivery error:", error);
    return NextResponse.json({ error: "Delivery failed." }, { status: 502 });
  }
}
