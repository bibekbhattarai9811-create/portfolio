// J.A.R.V.I.S. for the portfolio: an orb you can talk to.
// Speech in: Web Speech API (where the browser supports it). Speech out: speechSynthesis.
// Brain: a small built-in knowledge base about Bibek, matched by keywords, so it is instant, free and private.

const $ = (id) => document.getElementById(id);
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ------------------------------------------------------------------ knowledge */

const PROJECTS = [
  { id: "learncivilwithme", name: "LearnCivilWithMe", kw: ["learncivilwithme", "learn civil", "civil with me", "civilpath"],
    say: "LearnCivilWithMe is a free self-study path to a US civil engineering license: 94 tasks in nine phases, 145 FE-style practice questions and six engineering calculators. It is live.",
    live: "https://learncivilwithme.vercel.app" },
  { id: "equipguard", name: "EquipGuard", kw: ["equipguard", "equip guard", "predictive maintenance", "pump", "pumps"],
    say: "EquipGuard is predictive maintenance for a fleet of 100 simulated pumps. Gradient-boosted models predict remaining life to within 16.6 cycles on average and flag failures with a ROC-AUC of 0.93, served through a FastAPI dashboard.",
    live: "https://equipguard-beige.vercel.app" },
  { id: "ai-office", name: "AI Office", kw: ["ai office", "office", "agents", "agent team", "multi agent"],
    say: "AI Office is a team of six AI agents: a CEO, researcher, analyst, marketer, builder and ops. They run a business cycle every morning across four AI providers, and nothing goes out without Bibek's approval." },
  { id: "tbn-store", name: "TBN Store", kw: ["tbn", "store", "shop", "ecommerce", "e commerce", "clothing", "kids clothes"],
    say: "TBN Store is a bilingual English and Nepali storefront for a kids' clothing brand, with search, wishlists, reviews, coupons and an admin dashboard. It is live.",
    live: "https://tbnstore.vercel.app" },
  { id: "joride", name: "JoRide", kw: ["joride", "jo ride", "ride", "rides", "rideshare", "carpool", "lift"],
    say: "JoRide offers free rides between neighbours in Jonesboro. A rider asks for a lift, any free driver taps I can take you, and they get chat and a live ride tracker. It is designed phone-first." },
  { id: "pyquest", name: "PyQuest", kw: ["pyquest", "py quest", "learn python", "python course", "python lessons"],
    say: "PyQuest teaches Python right in the browser: 101 short lessons with a real Python interpreter and instant answer checking, with nothing to install.",
    live: "https://pyquest-4h36.vercel.app" },
  { id: "videoforge", name: "VideoForge", kw: ["videoforge", "video forge", "video pipeline", "auto edit"],
    say: "VideoForge turns a video idea into a finished MP4: an AI-written script, neural voice-over with word-synced captions and an automatically edited timeline. It produces the Why It Broke videos." },
  { id: null, name: "Service Marketplace", kw: ["service marketplace", "marketplace", "skilled worker", "skilled workers"],
    say: "Service Marketplace connects customers with skilled workers, with real-time chat, Stripe payments, maps and admin moderation. It's built with FastAPI and React.",
    live: "https://github.com/bibekbhattarai9811-create/service-marketplace" },
  { id: null, name: "Traffic Accident Severity", kw: ["traffic", "accident", "accidents", "crash"],
    say: "The traffic accident project predicts crash severity from weather, time and road features in the US Accidents dataset, comparing logistic regression with a random forest across repeated splits.",
    live: "https://github.com/bibekbhattarai9811-create/traffic-accident-severity-project" },
  { id: null, name: "FinTrack", kw: ["fintrack", "fin track", "finance app", "budget app", "budget"],
    say: "FinTrack is a finance and tasks dashboard with budgets, cash-flow charts, savings goals and an assistant that answers buy now or wait.",
    live: "https://finflow-three-wheat.vercel.app" },
  { id: null, name: "Expense Tracker", kw: ["expense tracker", "expense", "expenses"],
    say: "Expense Tracker is a full-stack app with categories, charts and secure sign-in, built with Next.js, Express, Prisma and PostgreSQL." },
  { id: null, name: "This website", kw: ["this website", "this site", "this portfolio", "website built", "how was this"],
    say: "This site is hand-built HTML, CSS and canvas, with no framework. I'm part of it, and so is the live truss model further down, whose deflection follows beam theory.",
    live: "https://github.com/bibekbhattarai9811-create/portfolio" },
];

const jonesboroTime = () =>
  new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", timeZone: "America/Chicago" }).format(new Date());

// Each intent: keywords (phrases or words), an answer, and an optional action.
const INTENTS = [
  { kw: ["hello", "hi", "hey", "good morning", "good evening", "good afternoon", "yo", "greetings", "howdy"], w: 0.6,
    say: () => "Hello. I'm JARVIS, Bibek's portfolio assistant. Ask me about projects, skills, education, or how to get in touch." },
  { kw: ["who are you", "what are you", "your name", "are you real", "are you ai", "jarvis"], w: 1,
    say: () => "I'm JARVIS, a voice assistant Bibek built. The original runs on Bibek's PC and phone. This version lives on the website and knows what's in the portfolio." },
  { kw: ["who is bibek", "about bibek", "tell me about", "introduce", "who is he", "who is she", "who is this", "about him", "about her", "background", "summary"], w: 1,
    say: () => "Bibek Bhattarai is a Data Science and Civil Engineering student at Arkansas State University, originally from Kathmandu, Nepal. Bibek builds machine-learning models, full-stack web apps and engineering tools, and has made the Dean's List twice.",
    scroll: "#about" },
  { kw: ["study", "studying", "studies", "education", "degree", "university", "college", "school", "major", "gpa", "graduate", "graduation", "arkansas state", "a state", "student"], w: 1,
    say: () => "Bibek is earning a B.S. in Data Science and Data Analytics at Arkansas State University, expected in 2027, and studying civil engineering alongside it, toward the FE and PE licenses. Dean's List in Fall 2025 and Spring 2026.",
    scroll: "#experience" },
  { kw: ["dean", "deans list", "honor", "honors", "award", "awards", "grades"], w: 1.2,
    say: () => "Bibek made the Dean's List at Arkansas State University in both Fall 2025 and Spring 2026.", scroll: "#experience" },
  { kw: ["experience", "work history", "job", "jobs", "worked", "employment", "sodexo", "accountant", "accountants", "previous work"], w: 1,
    say: () => "Bibek worked on a Sodexo food service team in Jonesboro from May 2024 to November 2025. Before that, Bibek organized client data and financial records at a chartered accountants' office in Kathmandu.",
    scroll: "#experience" },
  { kw: ["skill", "skills", "stack", "tech", "technology", "technologies", "tools", "programming", "python", "sql", "power bi", "react", "know", "good at", "capabilities"], w: 0.9,
    say: () => "On the data side: Python, pandas, NumPy, scikit-learn, SQL and Power BI. For software: TypeScript, React, Next.js, FastAPI and PostgreSQL. And for engineering: statics and FE exam preparation.",
    scroll: ".cap" },
  { kw: ["speak", "languages do", "spoken", "nepali", "hindi", "english"], w: 1.1,
    say: () => "Bibek speaks English fluently, Nepali natively, and conversational Hindi." },
  { kw: ["project", "projects", "built", "build", "made", "created", "portfolio", "work", "show me"], w: 0.7,
    say: () => "There are fourteen projects so far. The highlights are LearnCivilWithMe, EquipGuard, AI Office, TBN Store, JoRide, PyQuest and VideoForge. Name one and I'll pull up the file.",
    scroll: "#work" },
  { kw: ["best project", "favorite", "favourite", "proudest", "most impressive", "best work", "top project"], w: 1.6,
    say: () => "If I had to pick one, EquipGuard: a full machine-learning loop from simulated sensor data to a served model, with leakage-safe evaluation and a ROC-AUC of 0.93. LearnCivilWithMe is a close second, and it's live.",
    ctx: "equipguard" },
  { kw: ["machine learning", "ml", "data science", "model", "models", "predict", "prediction", "analytics", "analysis", "data project"], w: 1,
    say: () => "On the machine-learning side, EquipGuard predicts pump failures with gradient-boosted models, at a ROC-AUC of 0.93. The traffic accident project compares logistic regression with a random forest on the US Accidents dataset.",
    ctx: "equipguard" },
  { kw: ["ai", "ai project", "ai projects", "artificial intelligence", "llm", "claude", "gemini", "gpt", "automation", "agents"], w: 1.4,
    say: () => "AI Office runs a team of six AI agents that plan, research and draft every day, with Bibek approving anything that goes out. And then there's me: JARVIS, a voice assistant for phone and PC.",
    ctx: "ai-office" },
  { kw: ["civil", "engineering", "engineer", "fe exam", "fe", "pe license", "pe", "structure", "structures", "bridge", "truss", "statics"], w: 0.9,
    say: () => "Civil engineering is the other half. Bibek built LearnCivilWithMe, a free roadmap to the US PE license with 145 FE-style questions and engineering calculators. The truss model in the About section is live too.",
    ctx: "learncivilwithme" },
  { kw: ["cv", "resume", "curriculum vitae"], w: 1.6,
    say: () => "Bibek shares the CV personally. Send a quick request, and once it's approved you'll get a private download link. Taking you to the request form.",
    go: "/cv/" },
  { kw: ["contact", "email", "reach", "get in touch", "message", "linkedin", "github", "connect", "phone", "call"], w: 1,
    say: () => "The best way is email: bibekbhattarai9811 at gmail dot com. LinkedIn and GitHub links are right here.",
    scroll: "#contact",
    links: [["Email", "mailto:bibekbhattarai9811@gmail.com"], ["LinkedIn", "https://www.linkedin.com/in/bibek-bhattarai-0845b5332/"], ["GitHub", "https://github.com/bibekbhattarai9811-create"]] },
  { kw: ["internship", "internships", "hire", "hiring", "available", "availability", "open to", "recruit", "recruiter", "opportunity", "opportunities", "position", "role"], w: 1.2,
    say: () => "Yes, Bibek is open to internships, especially data analyst, data science and engineering roles. The quickest route is email, or you can request the CV.",
    links: [["Email Bibek", "mailto:bibekbhattarai9811@gmail.com"], ["Request CV", "/cv/"]] },
  { kw: ["where", "live", "lives", "located", "location", "from", "based", "nepal", "kathmandu", "jonesboro", "arkansas", "country", "city"], w: 0.8,
    say: () => "Bibek is based in Jonesboro, Arkansas, and is originally from Kathmandu, Nepal." },
  { kw: ["certif", "certificate", "certificates", "certification", "certifications", "course", "courses", "datacamp", "ibm", "coursera", "credential", "credentials"], w: 1,
    say: () => "There are sixteen credentials: five IBM and Coursera data science certificates, Anthropic's Claude 101, and ten DataCamp courses covering Python, SQL and Power BI. Each one links to a verifiable record.",
    scroll: ".certs" },
  { kw: ["youtube", "channel", "video", "videos", "why it broke"], w: 1.1,
    say: () => "Why It Broke is Bibek's YouTube channel about engineering failures. The videos are produced with VideoForge, a pipeline Bibek built that turns an idea into a finished video.",
    ctx: "videoforge" },
  { kw: ["time", "clock", "what time"], w: 0.8, say: () => `It's ${jonesboroTime()} in Jonesboro.` },
  { kw: ["thank", "thanks", "thank you", "cool", "awesome", "nice", "great", "amazing", "impressive", "wow"], w: 0.6,
    say: () => "Thank you. Anything else you'd like to know?" },
  { kw: ["bye", "goodbye", "see you", "later", "good night"], w: 0.9, say: () => "Goodbye. Do get in touch." },
  { kw: ["joke", "funny", "make me laugh"], w: 1.2,
    say: () => "Why did the civil engineer invite the data scientist to the bridge opening? To report the confidence interval on the load. I'll stick to portfolio questions." },
  { kw: ["help", "what can you do", "what can i ask", "commands", "options"], w: 1.2,
    say: () => "Ask me about Bibek's projects, skills, education, experience or certifications. I can also open case studies, jump to sections, or take you to the CV request." },
];

const SECTIONS = [
  { kw: ["projects", "work", "portfolio"], to: "#work", name: "the projects" },
  { kw: ["about", "background"], to: "#about", name: "the background" },
  { kw: ["experience", "education", "certifications", "certificates"], to: "#experience", name: "education and experience" },
  { kw: ["skills", "capabilities"], to: ".cap", name: "the skills" },
  { kw: ["contact"], to: "#contact", name: "contact details" },
  { kw: ["top", "home", "start", "beginning"], to: "#top", name: "the top" },
];

const norm = (s) => " " + s.toLowerCase().replace(/[’']/g, "").replace(/[^a-z0-9.\s]/g, " ").replace(/\s+/g, " ").trim() + " ";
const has = (text, k) => text.includes(" " + k + " ") || (k.length > 4 && text.includes(k));

let lastProject = null;

function think(raw) {
  const t = norm(raw);

  // navigation commands: "go to / show / take me to / scroll to <section>"
  if (/ (go to|take me to|scroll to|jump to|navigate to|open the|show the) /.test(t) || /^ (go|scroll|jump) /.test(t)) {
    const sec = SECTIONS.find((s) => s.kw.some((k) => has(t, k)));
    if (sec) return { say: `Taking you to ${sec.name}.`, scroll: sec.to };
  }

  // follow-ups about the last project
  if (lastProject && /( open it | open that | show it | show me it | more | details | case study | tell me more | go there | yes )/.test(t)) {
    const p = PROJECTS.find((x) => x.name === lastProject);
    if (p?.id) return { say: `Opening the ${p.name} case study.`, go: `/work/${p.id}/` };
    if (p?.live) return { say: `Here's the link for ${p.name}.`, links: [[`Open ${p.name}`, p.live]] };
  }

  // a named project wins
  let bestP = null, bestPS = 0;
  for (const p of PROJECTS) {
    const s = p.kw.reduce((a, k) => a + (has(t, k) ? k.length : 0), 0);
    if (s > bestPS) { bestP = p; bestPS = s; }
  }
  if (bestP && bestPS >= 4 && !/ (cv|resume) /.test(t)) {
    lastProject = bestP.name;
    const links = [];
    if (bestP.id) links.push([`${bestP.name} case study`, `/work/${bestP.id}/`]);
    if (bestP.live) links.push([bestP.live.includes("github.com") ? "Source code" : "Live site", bestP.live]);
    return { say: bestP.say + (bestP.id ? " Shall I open the case study?" : ""), links };
  }

  // otherwise score intents
  let best = null, bestS = 0;
  for (const it of INTENTS) {
    const hits = it.kw.filter((k) => has(t, k));
    const s = hits.reduce((a, k) => a + (k.includes(" ") ? 2 : 1), 0) * it.w;
    if (s > bestS) { best = it; bestS = s; }
  }
  if (best && bestS >= 0.6) {
    const ctxP = best.ctx && PROJECTS.find((p) => p.id === best.ctx);
    if (ctxP) lastProject = ctxP.name;
    const links = best.links || (ctxP ? [[`${ctxP.name} case study`, `/work/${ctxP.id}/`]] : undefined);
    return { say: best.say(), scroll: best.scroll, go: best.go, links };
  }
  return {
    say: "That one isn't in my files. Try asking about Bibek's projects, skills, education, or how to get in touch.",
    chips: true,
  };
}

/* ------------------------------------------------------------------ voice out */

let voiceOn = true, voice = null;
const pickVoice = () => {
  const vs = speechSynthesis?.getVoices?.() || [];
  const prefs = [/Google UK English Male/i, /Microsoft (Ryan|George|Thomas).*(Online|Natural)?/i, /Daniel/i, /Arthur/i, /en-GB/i];
  for (const re of prefs) { const v = vs.find((x) => re.test(x.name) || re.test(x.lang)); if (v) return v; }
  return vs.find((x) => /^en/i.test(x.lang)) || null;
};
if ("speechSynthesis" in window) {
  voice = pickVoice();
  speechSynthesis.addEventListener?.("voiceschanged", () => (voice = pickVoice()));
}

let speaking = false, wordPulse = 0;
function speak(text, done) {
  if (!voiceOn || !("speechSynthesis" in window)) { done?.(); return; }
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text.replace(/bibekbhattarai9811 at gmail dot com/i, "bibek bhattarai 9811, at gmail dot com"));
  if (voice) u.voice = voice;
  u.lang = voice?.lang || "en-GB";
  u.rate = 1.02; u.pitch = 0.92;
  u.onstart = () => { speaking = true; setState("speaking"); };
  u.onboundary = () => (wordPulse = 1);
  u.onend = u.onerror = () => { speaking = false; setState("idle"); done?.(); };
  speechSynthesis.speak(u);
}

/* ------------------------------------------------------------------ voice in */

const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
let rec = null, listening = false;
function listen() {
  if (!SR) {
    reply({ say: "Voice input isn't supported in this browser, but you can type your question below." }, false);
    $("ask-input").focus();
    return;
  }
  if (listening) { rec.stop(); return; }
  speechSynthesis?.cancel();
  rec = new SR();
  rec.lang = "en-US"; rec.interimResults = true; rec.maxAlternatives = 1;
  let finalText = "";
  rec.onstart = () => { listening = true; setState("listening"); $("you").textContent = "Listening…"; };
  rec.onresult = (e) => {
    const r = Array.from(e.results).map((x) => x[0].transcript).join(" ");
    finalText = r;
    $("you").textContent = "› " + r;
  };
  rec.onerror = (e) => {
    listening = false; setState("idle");
    if (e.error === "not-allowed" || e.error === "service-not-allowed")
      reply({ say: "I can't hear you without microphone access. You can type instead." }, false);
  };
  rec.onend = () => {
    listening = false;
    if (finalText.trim()) ask(finalText); else { setState("idle"); if ($("you").textContent === "Listening…") $("you").textContent = ""; }
  };
  rec.start();
}

/* ------------------------------------------------------------------ dialog */

let typeTimer = null;
function reply(r, talk = true) {
  const sayEl = $("say"), acts = $("acts");
  clearInterval(typeTimer);
  acts.innerHTML = "";
  sayEl.textContent = "";
  const text = r.say;
  let i = 0;
  const step = reduce ? text.length : 2;
  typeTimer = setInterval(() => {
    i = Math.min(text.length, i + step);
    sayEl.textContent = text.slice(0, i);
    if (i >= text.length) {
      clearInterval(typeTimer);
      for (const [label, href] of r.links || []) {
        const a = document.createElement("a");
        a.className = "btn"; a.textContent = label; a.href = href;
        if (/^https?:/.test(href)) { a.target = "_blank"; a.rel = "noopener"; }
        acts.appendChild(a);
      }
    }
  }, 14);
  const after = () => {
    if (r.go) location.href = r.go;
  };
  if (r.scroll) setTimeout(() => document.querySelector(r.scroll)?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" }), 900);
  if (talk) speak(text, after);
  else after();
  if (r.chips) $("chips").scrollIntoView?.({ block: "nearest" });
}

function ask(q) {
  q = String(q || "").trim();
  if (!q) return;
  $("you").textContent = "› " + q;
  setState("thinking");
  setTimeout(() => {
    const r = think(q);
    if (!voiceOn || !("speechSynthesis" in window)) setState("idle");
    reply(r);
  }, 380);
}

/* ------------------------------------------------------------------ orb renderer */

let state = "idle";
const label = $("orb-label");
function setState(s) {
  state = s;
  label.textContent = { idle: "Tap to talk", listening: "Listening", thinking: "Processing", speaking: "Speaking" }[s];
}

function orb() {
  const cv = $("orb-canvas"), ctx = cv.getContext("2d");
  let w = 0, dpr = 1, t0 = performance.now(), onScreen = true, energy = 0;
  const size = () => {
    dpr = Math.min(devicePixelRatio || 1, 2);
    w = cv.clientWidth;
    cv.width = cv.height = Math.round(w * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  new ResizeObserver(size).observe(cv);
  size();
  new IntersectionObserver(([e]) => (onScreen = e.isIntersecting)).observe(cv);

  const C = "63,216,255", A = "255,182,72";
  const arc = (r, a0, a1, lw, col, alpha) => {
    ctx.beginPath(); ctx.arc(w / 2, w / 2, r, a0, a1);
    ctx.lineWidth = lw; ctx.strokeStyle = `rgba(${col},${alpha})`; ctx.stroke();
  };

  function frame(now) {
    requestAnimationFrame(frame);
    if (!onScreen || document.hidden) return;
    const t = (now - t0) / 1000, R = w / 2;
    const target = state === "speaking" ? 0.55 + 0.45 * wordPulse : state === "listening" ? 0.6 + 0.25 * Math.sin(t * 8) : state === "thinking" ? 0.5 : 0.12;
    energy += (target - energy) * 0.12;
    wordPulse *= 0.9;
    const spin = reduce ? 0 : t;
    const col = state === "listening" ? A : C;
    ctx.clearRect(0, 0, w, w);

    // outer tick ring
    ctx.save(); ctx.translate(R, R); ctx.rotate(spin * 0.05);
    for (let i = 0; i < 120; i++) {
      const a = (i / 120) * Math.PI * 2, long = i % 10 === 0;
      const r1 = R * 0.94, r2 = R * (long ? 0.88 : 0.91);
      ctx.beginPath(); ctx.moveTo(Math.cos(a) * r1, Math.sin(a) * r1); ctx.lineTo(Math.cos(a) * r2, Math.sin(a) * r2);
      ctx.strokeStyle = `rgba(${C},${long ? 0.55 : 0.18})`; ctx.lineWidth = long ? 1.4 : 1; ctx.stroke();
    }
    ctx.restore();

    // rotating segmented rings
    const segs = [
      [0.8, 3, 0.35, 2, 0.7], [0.72, -5, 0.22, 4, 0.45], [0.64, 2, 0.6, 1.5, 0.35], [0.56, -8, 0.15, 6, 0.6],
    ];
    segs.forEach(([rr, sp, len, n, al], k) => {
      for (let i = 0; i < n; i++) {
        const a0 = spin * sp * (0.12 + energy * 0.25) + (i / n) * Math.PI * 2 + k;
        arc(R * rr, a0, a0 + len * Math.PI * (1 + energy * 0.4), k === 0 ? 3 : 1.6, col, al * (0.6 + energy * 0.6));
      }
    });
    arc(R * 0.48, 0, Math.PI * 2, 1, C, 0.25);

    // thinking sweep
    if (state === "thinking") {
      const a0 = spin * 6;
      arc(R * 0.84, a0, a0 + 0.9, 4, A, 0.9);
    }

    // core glow + voice-reactive pulse
    const core = R * (0.26 + energy * 0.08 + (reduce ? 0 : Math.sin(t * 2) * 0.01));
    const g = ctx.createRadialGradient(R, R, 0, R, R, core * 2.1);
    g.addColorStop(0, `rgba(235,252,255,${0.95})`);
    g.addColorStop(0.18, `rgba(${col},0.95)`);
    g.addColorStop(0.5, `rgba(${col},${0.22 + energy * 0.25})`);
    g.addColorStop(1, `rgba(${col},0)`);
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(R, R, core * 2.1, 0, Math.PI * 2); ctx.fill();

    // waveform ring while speaking or listening
    if (energy > 0.2) {
      ctx.beginPath();
      for (let i = 0; i <= 96; i++) {
        const a = (i / 96) * Math.PI * 2;
        const rr = R * 0.42 + Math.sin(a * 6 + t * 9) * R * 0.03 * energy + Math.sin(a * 11 - t * 7) * R * 0.02 * energy;
        const x = R + Math.cos(a) * rr, y = R + Math.sin(a) * rr;
        i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
      }
      ctx.strokeStyle = `rgba(${col},${0.35 + energy * 0.4})`; ctx.lineWidth = 1.4; ctx.stroke();
    }
  }
  requestAnimationFrame(frame);
}

/* ------------------------------------------------------------------ wire up */

orb();
setState("idle");
$("orb").addEventListener("click", () => {
  if (speaking) { speechSynthesis.cancel(); return; }
  listen();
});
$("ask").addEventListener("submit", (e) => {
  e.preventDefault();
  const v = $("ask-input").value;
  $("ask-input").value = "";
  ask(v);
});
$("chips").addEventListener("click", (e) => {
  const b = e.target.closest("button");
  if (b) ask(b.textContent);
});
const vt = $("voice-toggle");
try { voiceOn = localStorage.getItem("jarvis-voice") !== "off"; } catch {}
const paintVoice = () => (vt.textContent = `Voice: ${voiceOn ? "on" : "off"}`);
paintVoice();
vt.addEventListener("click", () => {
  voiceOn = !voiceOn;
  if (!voiceOn) speechSynthesis?.cancel();
  try { localStorage.setItem("jarvis-voice", voiceOn ? "on" : "off"); } catch {}
  paintVoice();
});
