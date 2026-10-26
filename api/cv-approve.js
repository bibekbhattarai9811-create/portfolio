// GET  /api/cv-approve?r=…  — the owner reviews a request (opening the link changes nothing)
// POST /api/cv-approve       — the owner approves; a 7-day download link is created
import { seal, unseal, esc, origin, page, sendHtml, sendEmail, DAY, OWNER_EMAIL } from "./_lib/cv.js";

export default async function handler(req, res) {
  const r = req.method === "POST" ? new URLSearchParams(typeof req.body === "string" ? req.body : "").get("r") || req.body?.r : req.query.r;
  const reqData = unseal(r, "req");
  if (!reqData) return sendHtml(res, 400, page("Link expired", `<h1>This request link isn't valid</h1><p>It may have expired (requests are valid for 30 days) or been copied incompletely.</p>`));

  const who = `<dl>
    <div><dt>Name</dt><dd>${esc(reqData.name)}</dd></div>
    <div><dt>Email</dt><dd>${esc(reqData.email)}</dd></div>
    <div><dt>Organization</dt><dd>${esc(reqData.org || "—")}</dd></div>
    <div><dt>Reason</dt><dd>${esc(reqData.reason || "—")}</dd></div>
    <div><dt>Requested</dt><dd>${esc(new Date(reqData.at).toUTCString())}</dd></div></dl>`;

  if (req.method !== "POST") {
    return sendHtml(res, 200, page("CV request", `<span class="mono" style="display:block;margin-top:40px">CV request</span>
      <h1>Approve this request?</h1>${who}
      <form method="post" action="/api/cv-approve"><input type="hidden" name="r" value="${esc(r)}">
        <div class="actions"><button class="btn solid" type="submit">Approve &amp; create download link</button>
        <a class="btn" href="mailto:${esc(reqData.email)}?subject=${encodeURIComponent("Your CV request")}">Reply instead</a></div></form>
      <p style="margin-top:24px;font-size:14px;color:var(--muted)">To decline, just close this page. Nothing is sent until you approve.</p>`));
  }

  const link = `${origin(req)}/api/cv-download?t=${seal({ typ: "dl", exp: Date.now() + 7 * DAY })}`;
  const subject = "Bibek Bhattarai — CV";
  const body = `Hi ${reqData.name.split(" ")[0]},\n\nThanks for your interest. Here is my CV (the link works for 7 days):\n${link}\n\nBest,\nBibek Bhattarai\nhttps://bibek-bhattarai.vercel.app`;

  // With a verified sending domain (RESEND_FROM) the link goes straight to the requester.
  let sent = false;
  if (process.env.RESEND_FROM) {
    try {
      await sendEmail({ to: reqData.email, subject, text: body, html: esc(body).replace(/\n/g, "<br>").replace(esc(link), `<a href="${link}">${esc(link)}</a>`), replyTo: OWNER_EMAIL });
      sent = true;
    } catch (e) { console.error("cv-approve:", e.message); }
  }
  const gmail = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(reqData.email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  return sendHtml(res, 200, page("Approved", `<span class="mono" style="display:block;margin-top:40px">Approved</span>
    <h1>${sent ? `Sent to ${esc(reqData.name)}` : "Approved. Now send the link"}</h1>
    <p>${sent ? `${esc(reqData.email)} has been emailed a download link that works for 7 days.` : `This download link works for 7 days. Send it to ${esc(reqData.email)} with the button below; the email is already written.`}</p>
    ${sent ? "" : `<div class="actions"><a class="btn solid" href="${gmail}" target="_blank" rel="noopener">Send with Gmail</a>
      <a class="btn" href="mailto:${esc(reqData.email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}">Other email app</a></div>`}
    <code>${esc(link)}</code>`));
}
