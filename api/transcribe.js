// GET  /api/transcribe → { enabled }  (is server-side speech recognition configured?)
// POST /api/transcribe   raw audio body → { text }
// Uses Whisper large-v3 on Groq's free tier via the *translations* endpoint, so speech in any accent,
// or in another language (Nepali, Hindi, Spanish…), comes back as English text for JARVIS.

// Names Whisper should spell correctly
const VOCAB = "Bibek Bhattarai, JARVIS, JoRide, EquipGuard, PyQuest, TBN Store, VideoForge, LearnCivilWithMe, AI Office, " +
  "FinTrack, DataCamp, Arkansas State University, Jonesboro, Kathmandu, Nepal, CV, internship, Dean's List.";

const MAX_BYTES = 2_000_000;           // ~12 s of compressed speech is far below this
const hits = new Map();                // best-effort per-instance rate limit: 20 requests / 10 min / IP

async function rawBody(req) {
  if (Buffer.isBuffer(req.body)) return req.body;
  const chunks = [];
  let size = 0;
  for await (const c of req) {
    size += c.length;
    if (size > MAX_BYTES) return null;
    chunks.push(c);
  }
  return Buffer.concat(chunks);
}

export default async function handler(req, res) {
  const key = process.env.GROQ_API_KEY;
  res.setHeader("Cache-Control", "no-store");
  if (req.method === "GET") return res.status(200).json({ enabled: !!key });
  if (req.method !== "POST") return res.status(405).json({ error: "method" });
  if (!key) return res.status(503).json({ error: "Speech service isn't configured." });

  const origin = req.headers.origin || "";
  if (origin && !origin.includes(req.headers["x-forwarded-host"] || req.headers.host)) return res.status(403).json({ error: "origin" });

  const ip = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim() || "anon";
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < 10 * 60 * 1000);
  if (recent.length >= 20) return res.status(429).json({ error: "Too many requests, please type instead." });
  hits.set(ip, [...recent, now]);

  const audio = await rawBody(req);
  if (!audio || audio.length < 1000) return res.status(400).json({ error: "No audio received." });
  if (audio.length > MAX_BYTES) return res.status(413).json({ error: "Recording too long." });

  const type = String(req.headers["x-audio-type"] || "audio/webm").split(";")[0];
  const ext = type.includes("mp4") ? "mp4" : type.includes("ogg") ? "ogg" : type.includes("wav") ? "wav" : "webm";
  const form = new FormData();
  form.append("file", new Blob([audio], { type }), `speech.${ext}`);
  form.append("model", "whisper-large-v3");
  form.append("prompt", VOCAB);
  form.append("response_format", "json");
  form.append("temperature", "0");

  try {
    const r = await fetch("https://api.groq.com/openai/v1/audio/translations", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}` },
      body: form,
    });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) {
      console.error("transcribe:", r.status, JSON.stringify(j).slice(0, 200));
      return res.status(502).json({ error: "Speech service error." });
    }
    // Whisper sometimes echoes the vocabulary prompt on silence; treat that as nothing heard
    const text = String(j.text || "").trim();
    return res.status(200).json({ text: text.startsWith("Bibek Bhattarai, JARVIS, JoRide") ? "" : text });
  } catch (e) {
    console.error("transcribe:", e.message);
    return res.status(502).json({ error: "Speech service unreachable." });
  }
}
