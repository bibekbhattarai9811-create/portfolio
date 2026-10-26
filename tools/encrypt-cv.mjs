// Encrypt the CV for the approval-gated download.
//   node tools/encrypt-cv.mjs [path/to/cv.pdf]
// Reads CV_FILE_KEY from .env.local and writes private/cv.pdf.enc (iv | tag | ciphertext).
// The plain PDF is git-ignored; only the encrypted file is committed and deployed.
import crypto from "node:crypto";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

const env = Object.fromEntries(
  readFileSync(new URL("../.env.local", import.meta.url), "utf8").split(/\r?\n/).filter((l) => l.includes("=")).map((l) => [l.slice(0, l.indexOf("=")), l.slice(l.indexOf("=") + 1).replace(/^"|"$/g, "")]),
);
const key = Buffer.from(env.CV_FILE_KEY || "", "base64");
if (key.length !== 32) throw new Error("CV_FILE_KEY missing from .env.local");

const src = process.argv[2] || new URL("../Bibek-Bhattarai-CV.pdf", import.meta.url);
const pdf = readFileSync(src);
const iv = crypto.randomBytes(12);
const c = crypto.createCipheriv("aes-256-gcm", key, iv);
const body = Buffer.concat([c.update(pdf), c.final()]);
mkdirSync(new URL("../private/", import.meta.url), { recursive: true });
writeFileSync(new URL("../private/cv.pdf.enc", import.meta.url), Buffer.concat([iv, c.getAuthTag(), body]));
console.log(`encrypted ${pdf.length} bytes → private/cv.pdf.enc`);
