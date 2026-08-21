import { NextResponse } from "next/server";
import { randomUUID } from "crypto";

// Accept the correctly-named env var, but tolerate the common misspelling
const recipient = process.env.INSPECTION_RECIPIENT || process.env.INSPECTION_RECEPIENT || "info@mojopetroinc.com";
const internalRecipients = [...new Set([recipient, "Moe@mojopetroinc.com"])];
const requests = new Map<string, number[]>();
const clean = (value: unknown, max = 200) => typeof value === "string" ? value.trim().slice(0, max) : "";
const escape = (value: string) => value.replace(/[&<>'"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char]!));

async function verifyTurnstile(token: string, ip: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return process.env.NODE_ENV !== "production";
  if (!token) return false;
  const form = new FormData(); form.set("secret", secret); form.set("response", token); form.set("remoteip", ip);
  try { const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body: form }); return Boolean((await response.json()).success); } catch { return false; }
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin"), host = request.headers.get("host");
  if (origin && host && new URL(origin).host !== host) return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "local", now = Date.now();
  const recent = (requests.get(ip) || []).filter(time => now - time < 3_600_000);
  if (recent.length >= 5) return NextResponse.json({ error: "Please wait before sending another request." }, { status: 429 });
  let body: Record<string, unknown>; try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }
  if (clean(body.website)) return NextResponse.json({ reference: "MP-" + randomUUID().slice(0, 8).toUpperCase() });
  for (const key of ["company", "contact", "email", "phone", "address", "city", "zip"]) if (!clean(body[key])) return NextResponse.json({ error: "Please complete all required fields." }, { status: 400 });
  const email = clean(body.email);
  if (!/^\S+@\S+\.\S+$/.test(email) || body.privacy !== true) return NextResponse.json({ error: "Please provide a valid email and consent." }, { status: 400 });
  if (!await verifyTurnstile(clean(body.captchaToken, 3000), ip)) return NextResponse.json({ error: "Please complete the security verification and try again." }, { status: 400 });
  recent.push(now); requests.set(ip, recent);
  const reference = "MP-" + randomUUID().slice(0, 8).toUpperCase();
  const fields = ["company", "contact", "email", "phone", "address", "city", "state", "zip", "service", "inspectionType", "preferredDate", "preferredTime", "message"] as const;
  const rows = fields.map(key => `<tr><td style="padding:7px 12px;font-weight:700">${escape(key.replace(/([A-Z])/g, " $1"))}</td><td style="padding:7px 12px">${escape(clean(body[key], 2000)) || "—"}</td></tr>`).join("");
  const html = `<h2>New Mojo inspection request: ${reference}</h2><table>${rows}</table><p>Submitted ${new Date().toISOString()} · IP ${escape(ip)}</p>`;
  if (process.env.RESEND_API_KEY) {
    // Preferred path: send via Resend (unchanged)
    const headers = { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" };
    const internal = await fetch("https://api.resend.com/emails", { method: "POST", headers, body: JSON.stringify({ from: process.env.EMAIL_FROM, to: internalRecipients, reply_to: email, subject: `Inspection request ${reference} — ${clean(body.company)}`, html }) });
    if (!internal.ok) return NextResponse.json({ error: "Unable to deliver request. Please call us." }, { status: 502 });
    await fetch("https://api.resend.com/emails", { method: "POST", headers, body: JSON.stringify({ from: process.env.EMAIL_FROM, to: [email], subject: `We received your inspection request (${reference})`, html: `<p>Thank you for contacting Mojo Petroleum. Your reference number is <strong>${reference}</strong>. Our team will review your request and follow up shortly.</p>` }) });
  } else {
    // No delivery mechanism configured — log destination for development
    console.info("Inspection notification destination:", recipient, reference);
  }
  return NextResponse.json({ reference }, { status: 201 });
}
