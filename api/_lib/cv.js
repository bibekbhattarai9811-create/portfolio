// Shared helpers for the approval-gated CV download.
// Tokens are AES-256-GCM sealed JSON, so links carry no readable personal data and can't be forged.
import crypto from "node:crypto";

export const OWNER_EMAIL = process.env.CV_OWNER_EMAIL || "bibekbhattarai9811@gmail.com";
export const DAY = 24 * 60 * 60 * 1000;

const key = (name) => {
  const k = Buffer.from(process.env[name] || "", "base64");
  if (k.length !== 32) throw new Error(`${name} is not set (expects 32 random bytes, base64)`);
  return k;
};

export function seal(obj) {
  const iv = crypto.randomBytes(12);
  const c = crypto.createCipheriv("aes-256-gcm", key("CV_TOKEN_KEY"), iv);
  const body = Buffer.concat([c.update(JSON.stringify(obj), "utf8"), c.final()]);
  return Buffer.concat([iv, c.getAuthTag(), body]).toString("base64url");
}

export function unseal(token, typ) {
  try {
    const raw = Buffer.from(String(token || ""), "base64url");
    if (raw.length < 29) return null;
    const d = crypto.createDecipheriv("aes-256-gcm", key("CV_TOKEN_KEY"), raw.subarray(0, 12));
    d.setAuthTag(raw.subarray(12, 28));
    const obj = JSON.parse(Buffer.concat([d.update(raw.subarray(28)), d.final()]).toString("utf8"));
    if (obj.typ !== typ || (obj.exp && Date.now() > obj.exp)) return null;
    return obj;
  } catch {
    return null;
  }
}

// The CV is committed only in encrypted form: iv(12) | tag(16) | ciphertext
export function decryptFile(buf) {
  const d = crypto.createDecipheriv("aes-256-gcm", key("CV_FILE_KEY"), buf.subarray(0, 12));
  d.setAuthTag(buf.subarray(12, 28));
  return Buffer.concat([d.update(buf.subarray(28)), d.final()]);
}

export const esc = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

export const origin = (req) => `https://${req.headers["x-forwarded-host"] || req.headers.host}`;

export async function sendEmail({ to, subject, html, text, replyTo }) {
  if (!process.env.RESEND_API_KEY) throw new Error("RESEND_API_KEY is not set");
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.RESEND_FROM || "Portfolio CV <onboarding@resend.dev>",
      to: [to], subject, html, text, ...(replyTo ? { reply_to: replyTo } : {}),
    }),
  });
  if (!r.ok) throw new Error(`Resend ${r.status}: ${(await r.text()).slice(0, 200)}`);
}

// Minimal page in the site's style for the approve/download screens
export function page(title, inner) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex"><title>${esc(title)} — Bibek Bhattarai</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@500&family=Inter:wght@400;500&family=JetBrains+Mono&display=swap">
<link rel="stylesheet" href="/assets/site.css">
<style>.panel{max-width:640px;margin:0 auto;padding:clamp(56px,10vw,120px) var(--gutter)}.panel h1{font-family:var(--display);font-weight:500;font-size:clamp(34px,5vw,52px);letter-spacing:-.03em;line-height:1.05;margin:14px 0 18px}
.panel p{color:var(--ink-2);font-size:16.5px}.panel p+p{margin-top:12px}.panel dl{margin:28px 0;border-top:1px solid var(--ink)}.panel dl div{display:grid;grid-template-columns:130px 1fr;gap:16px;padding:12px 0;border-bottom:1px solid var(--line)}
.panel dt{font-family:var(--mono);font-size:12px;text-transform:uppercase;color:var(--muted);padding-top:3px}.panel dd{font-size:15.5px;overflow-wrap:anywhere}.panel .actions{display:flex;gap:12px;flex-wrap:wrap;margin-top:28px}
.panel button.btn{font:inherit;font-size:14px;font-weight:500;cursor:pointer}.panel code{display:block;margin-top:20px;padding:14px;border:1px solid var(--line);background:#fff;font-family:var(--mono);font-size:12px;overflow-wrap:anywhere}</style>
</head><body><main class="panel"><a class="mono" href="/">← bibek-bhattarai.vercel.app</a>${inner}</main></body></html>`;
}

export function sendHtml(res, status, html) {
  res.status(status).setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Robots-Tag", "noindex");
  res.send(html);
}
