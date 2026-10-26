// GET /api/cv-download?t=…  — serves the CV only for an approved, unexpired link.
import { readFile } from "node:fs/promises";
import path from "node:path";
import { unseal, decryptFile, page, sendHtml } from "./_lib/cv.js";

export default async function handler(req, res) {
  if (!unseal(req.query.t, "dl")) {
    return sendHtml(res, 403, page("Link expired", `<span class="mono" style="display:block;margin-top:40px">CV</span>
      <h1>This download link has expired</h1><p>Approved links work for 7 days. You can <a href="/cv/" style="border-bottom:1px solid">request the CV again</a>.</p>`));
  }
  const pdf = decryptFile(await readFile(path.join(process.cwd(), "private", "cv.pdf.enc")));
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", 'attachment; filename="Bibek-Bhattarai-CV.pdf"');
  res.setHeader("Cache-Control", "private, no-store");
  res.setHeader("X-Robots-Tag", "noindex");
  res.status(200).send(pdf);
}
