// POST /api/cv-request — a visitor asks for the CV; the owner gets an email with an Approve link.
import { seal, sendEmail, esc, origin, OWNER_EMAIL, DAY } from "./_lib/cv.js";

const EMAIL_RE = /^[^\s@]{1,64}@[^\s@]{1,190}\.[a-z]{2,24}$/i;

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "method" });
  const b = typeof req.body === "object" && req.body ? req.body : {};
  const name = String(b.name || "").trim().slice(0, 80);
  const email = String(b.email || "").trim().slice(0, 200);
  const org = String(b.org || "").trim().slice(0, 120);
  const reason = String(b.reason || "").trim().slice(0, 800);

  // bots: hidden field filled in, or the form was submitted faster than a person could type
  if (b.website || (Number(b.started) && Date.now() - Number(b.started) < 2500)) return res.status(200).json({ ok: true });
  if (name.length < 2 || !EMAIL_RE.test(email)) return res.status(400).json({ error: "Please enter your name and a valid email." });

  const token = seal({ typ: "req", name, email, org, reason, at: Date.now(), exp: Date.now() + 30 * DAY });
  const approve = `${origin(req)}/api/cv-approve?r=${token}`;
  const rows = [["Name", name], ["Email", email], ["Organization", org || "—"], ["Reason", reason || "—"]];
  try {
    await sendEmail({
      to: OWNER_EMAIL,
      replyTo: email,
      subject: `CV request: ${name}${org ? ` (${org})` : ""}`,
      text: `${rows.map(([k, v]) => `${k}: ${v}`).join("\n")}\n\nReview and approve: ${approve}\n\nTo decline, just ignore this email.`,
      html: `<div style="font-family:Inter,Arial,sans-serif;font-size:15px;color:#121212;max-width:560px">
        <p style="font-size:18px;margin:0 0 16px"><b>${esc(name)}</b> requested your CV.</p>
        <table style="border-collapse:collapse;width:100%">${rows.map(([k, v]) => `<tr><td style="padding:8px 12px 8px 0;color:#75736c;vertical-align:top;width:120px">${k}</td><td style="padding:8px 0">${esc(v)}</td></tr>`).join("")}</table>
        <p style="margin:24px 0"><a href="${approve}" style="background:#121212;color:#f4f2ec;padding:12px 20px;border-radius:999px;text-decoration:none">Review &amp; approve</a></p>
        <p style="color:#75736c;font-size:13px">To decline, just ignore this email. The link expires in 30 days.</p></div>`,
    });
  } catch (e) {
    console.error("cv-request:", e.message);
    return res.status(503).json({ error: "Requests can't be sent right now. Please email me directly." });
  }
  return res.status(200).json({ ok: true });
}
