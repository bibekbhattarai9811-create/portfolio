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
  { id: "jarvis", name: "JARVIS", kw: ["about jarvis", "what is jarvis", "jarvis do", "jarvis app", "jarvis project", "desktop jarvis", "full jarvis", "real jarvis", "holo", "hologram", "holograms", "inspect pro", "inspection", "smart glasses", "glasses", "field assist", "voice assistant"],
    say: "The full JARVIS is Bibek's Iron-Man-style assistant on Claude for PC, phone and smart glasses. It has voice control, HOLO hand-tracked holograms you can grab and smash, Inspect Pro rental inspections from photos, and a field-report demo. It has 25 automated tests and passed 20 out of 20 security attack tests.",
    live: "https://jarvis-demo-sandy.vercel.app" },
  { id: "equipguard", name: "EquipGuard", kw: ["equipguard", "equip guard", "predictive maintenance", "pump", "pumps"],
    say: "EquipGuard is predictive maintenance for a fleet of 100 simulated pumps. Gradient-boosted models predict remaining life to within 16.6 cycles on average and flag failures with a ROC-AUC of 0.93, served through a FastAPI dashboard.",
    live: "https://equipguard-beige.vercel.app" },
  { id: "ai-office", name: "AI Office", kw: ["ai office", "office", "agents", "agent team", "multi agent"],
    say: "AI Office is a team of six AI agents, a CEO, researcher, analyst, marketer, builder and ops, that works on Bibek's YouTube channels every morning. It also has an 11-role paper-trading desk with backtests. Nothing goes out without Bibek's approval, and no real money is traded." },
  { id: "tbn-store", name: "TBN Store", kw: ["tbn", "store", "shop", "ecommerce", "e commerce", "clothing", "kids clothes"],
    say: "TBN Store is a bilingual English and Nepali storefront for a kids' clothing brand, with search, wishlists, reviews, coupons and an admin dashboard. It is live.",
    live: "https://tbnstore.vercel.app" },
  { id: "joride", name: "JoRide", kw: ["joride", "jo ride", "ride", "rides", "rideshare", "carpool", "lift"],
    say: "JoRide offers free rides between neighbours in Jonesboro. A rider asks for a lift, any free driver taps I can take you, and they get chat and a live ride tracker. It is designed phone-first." },
  { id: "pyquest", name: "PyQuest", kw: ["pyquest", "py quest", "learn python", "python course", "python lessons"],
    say: "PyQuest teaches Python right in the browser: 101 short lessons with a real Python interpreter and instant answer checking, with nothing to install.",
    live: "https://pyquest-4h36.vercel.app" },
  { id: "videoforge", name: "VideoForge", kw: ["videoforge", "video forge", "video pipeline", "auto edit"],
    say: "VideoForge is an autopilot that makes a fact-checked YouTube Short every day, plus long videos narrated in Bibek's own cloned voice, with licensed photos, diagrams, original music and thumbnail options. It powers both of Bibek's channels." },
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
  { id: null, name: "Stock Price LSTM", kw: ["stock", "stocks", "lstm", "pytorch", "stock prediction", "apple stock", "neural network"],
    say: "The stock project is a PyTorch LSTM that forecasts Apple's closing price from past prices, built by following NeuralNine's tutorial and fixing its bugs. The test error is about 9.61 dollars." },
  { id: null, name: "Paper Trading Desk", kw: ["trading", "trading desk", "paper trading", "day trading", "backtest", "backtesting", "trader", "traders"],
    say: "The trading desk is eleven AI roles trading a 1,000 dollar paper account, never real money. Its Strategy Lab backtests rule sets, and the honest first finding was that every rule set lost money over 60 days, mostly because of fees." },
  { id: null, name: "BibekCoin", kw: ["bibekcoin", "bibek coin", "crypto", "token", "blockchain", "smart contract", "solidity", "ethereum"],
    say: "BibekCoin is a fixed-supply community token contract for the Base network, with no owner, no minting and no fees, and seven passing tests. It's a learning project and hasn't been deployed." },
  { id: null, name: "Case Closed Files", kw: ["case closed", "case closed files", "true crime", "crime channel", "crime"],
    say: "Case Closed Files is Bibek's true-crime YouTube channel. It covers only solved, convicted cases, without gore, with long episodes twice a week in Bibek's own voice." },
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
    say: () => "I'm the website version of JARVIS, Bibek's assistant. The full JARVIS runs on Bibek's PC, phone and smart glasses, and has a live demo. I know what's in the portfolio.", ctx: "jarvis" },
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
    say: () => "There are eighteen projects and channels so far. The highlights are LearnCivilWithMe, JARVIS, EquipGuard, AI Office, TBN Store, JoRide, PyQuest and VideoForge. Name one and I'll pull up the file.",
    scroll: "#work" },
  { kw: ["best project", "favorite", "favourite", "proudest", "most impressive", "best work", "top project"], w: 1.6,
    say: () => "If I had to pick one, EquipGuard: a full machine-learning loop from simulated sensor data to a served model, with leakage-safe evaluation and a ROC-AUC of 0.93. LearnCivilWithMe is a close second, and it's live.",
    ctx: "equipguard" },
  { kw: ["machine learning", "ml", "data science", "model", "models", "predict", "prediction", "analytics", "analysis", "data project"], w: 1,
    say: () => "On the machine-learning side, EquipGuard predicts pump failures with gradient-boosted models, at a ROC-AUC of 0.93. The traffic accident project compares logistic regression with a random forest on the US Accidents dataset.",
    ctx: "equipguard" },
  { kw: ["ai", "ai project", "ai projects", "artificial intelligence", "llm", "claude", "gemini", "gpt", "automation", "agents"], w: 1.4,
    say: () => "The big one is JARVIS, an assistant on Claude for PC, phone and smart glasses, with voice control and hand-tracked holograms. AI Office runs six AI agents that work on Bibek's channels every day, and VideoForge makes videos on autopilot.",
    ctx: "jarvis" },
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
    say: () => "Bibek runs two YouTube channels. Why It Broke posts daily Shorts and long videos on engineering failures, like the Tacoma Narrows Bridge and the Boeing 737 MAX. Case Closed Files covers solved true-crime cases. Both are made with VideoForge, Bibek's own video autopilot.",
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

// Speech engines often mishear names, especially with non-US accents. Map common mishearings back.
const ALIASES = [
  [/ (vivek|bebek|bibeck|bibbek|bibake|bebak|vibek|bibic|bibak|babek|bibhek|bivek|biwek|beebek|be back|bee back|be bec) /g, " bibek "],
  [/ (bhattarai|battarai|bhatarai|bhattari|bhatt rai|bhatterai|bhattray|but a rye|bad a rye) /g, " bhattarai "],
  [/ (joe ride|jo ride|go ride|joy ride|joel ride|show ride|joe right|jo right) /g, " joride "],
  [/ (pie quest|pi quest|py quest|by quest|pike west|pie chest|pi chest) /g, " pyquest "],
  [/ (equip guard|equipped guard|a quip guard|equip god|equipment guard|equip card|e quip guard|equip yard) /g, " equipguard "],
  [/ (t b n|tv n|t v n|tbm|tvn|tdn|t b and) /g, " tbn "],
  [/ (video forge|video for|video fours|video force|video forage) /g, " videoforge "],
  [/ (learn civil with me|learn civil|learning civil|lean civil) /g, " learncivilwithme "],
  [/ (jervis|travis|javis|jarvas|harvis|jarvees|jar vis) /g, " jarvis "],
  [/ (c v|see v|c b|cvs|see vee|seevee|sea v|cv s) /g, " cv "],
  [/ (resumé|rezoom|resumay|res you may) /g, " resume "],
  [/ (a i|a eye|ay eye) /g, " ai "],
  [/ (intern ship|in turn ship|internships) /g, " internship "],
  [/ (data camp|data come) /g, " datacamp "],
  [/ (arkansaw|arkansis|our kansas|ark ansas) /g, " arkansas "],
  [/ (jones borough|jones burrow|jones bureau|jonesborough|jones bro|jones barrow) /g, " jonesboro "],
  [/ (machine learn|machine learnings) /g, " machine learning "],
];

const norm = (s) => {
  let t = " " + s.toLowerCase().replace(/[’']/g, "").replace(/[^a-z0-9.\s]/g, " ").replace(/\s+/g, " ").trim() + " ";
  for (const [re, to] of ALIASES) t = t.replace(re, to);
  return t;
};

// Edit distance, so a word that is one or two letters off still counts ("skils", "certifcate", "projeckt").
function lev(a, b) {
  if (Math.abs(a.length - b.length) > 2) return 9;
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[a.length][b.length];
}
const has = (text, k) => {
  if (text.includes(" " + k + " ") || (k.length > 4 && text.includes(k))) return true;
  if (k.includes(" ") || k.length < 5) return false;
  const tol = k.length >= 8 ? 2 : 1;
  return text.trim().split(" ").some((w) => w.length >= 4 && lev(w, k) <= tol);
};

let lastProject = null;

// Returns an answer plus a confidence score; commit=false lets us compare several speech guesses safely.
function think(raw, commit = true) {
  const t = norm(raw);

  // navigation commands: "go to / show / take me to / scroll to <section>"
  if (/ (go to|take me to|scroll to|jump to|navigate to|open the|show the) /.test(t) || /^ (go|scroll|jump) /.test(t)) {
    const sec = SECTIONS.find((s) => s.kw.some((k) => has(t, k)));
    if (sec) return { say: `Taking you to ${sec.name}.`, scroll: sec.to, score: 9 };
  }

  // follow-ups about the last project
  if (lastProject && /( open it | open that | show it | show me it | more | details | case study | tell me more | go there | yes )/.test(t)) {
    const p = PROJECTS.find((x) => x.name === lastProject);
    if (p?.id) return { say: `Opening the ${p.name} case study.`, go: `/work/${p.id}/`, score: 9 };
    if (p?.live) return { say: `Here's the link for ${p.name}.`, links: [[`Open ${p.name}`, p.live]], score: 9 };
  }

  // a named project wins
  let bestP = null, bestPS = 0;
  for (const p of PROJECTS) {
    const s = p.kw.reduce((a, k) => a + (has(t, k) ? k.length : 0), 0);
    if (s > bestPS) { bestP = p; bestPS = s; }
  }
  if (bestP && bestPS >= 4 && !/ (cv|resume) /.test(t)) {
    if (commit) lastProject = bestP.name;
    const links = [];
    if (bestP.id) links.push([`${bestP.name} case study`, `/work/${bestP.id}/`]);
    if (bestP.live) links.push([bestP.live.includes("github.com") ? "Source code" : "Live site", bestP.live]);
    return { say: bestP.say + (bestP.id ? " Shall I open the case study?" : ""), links, score: 10 + bestPS };
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
    if (ctxP && commit) lastProject = ctxP.name;
    const links = best.links || (ctxP ? [[`${ctxP.name} case study`, `/work/${ctxP.id}/`]] : undefined);
    return { say: best.say(), scroll: best.scroll, go: best.go, links, score: bestS };
  }
  return { say: "", score: 0, fallback: true, heard: raw };
}

// When nothing matched, offer the closest things instead of a dead end.
function suggestions(raw) {
  const words = norm(raw).trim().split(" ").filter((w) => w.length >= 4);
  const near = PROJECTS.filter((p) => p.kw.some((k) => words.some((w) => !k.includes(" ") && k.length >= 5 && lev(w, k) <= 2)))
    .slice(0, 2).map((p) => `Tell me about ${p.name}`);
  return [...near, "Who is Bibek?", "Show me the projects", "How do I contact Bibek?"].slice(0, 4);
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

// Two engines:
//  1. Whisper (server, /api/transcribe): far better with accents, and understands other languages too.
//     Used when the site has a GROQ_API_KEY configured.
//  2. The browser's own speech recognition, tuned to the visitor's English accent, keeping 5 guesses.

const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
const ACCENTS = [
  ["auto", "Auto"], ["en-US", "US"], ["en-GB", "UK"], ["en-IN", "South Asia (Nepal, India)"], ["en-AU", "Australia"],
  ["en-CA", "Canada"], ["en-IE", "Ireland"], ["en-NZ", "New Zealand"], ["en-ZA", "South Africa"], ["en-NG", "Nigeria"],
  ["en-KE", "Kenya"], ["en-PH", "Philippines"], ["en-SG", "Singapore"],
];
let accent = "auto";
try { accent = localStorage.getItem("jarvis-accent") || "auto"; } catch {}

function autoLang() {
  const langs = navigator.languages?.length ? navigator.languages : [navigator.language || "en-US"];
  for (const l of langs) {
    if (/^en-(US|GB|IN|AU|CA|IE|NZ|ZA|NG|KE|PH|SG)$/i.test(l)) return l;
    if (/^(ne|hi|ur|bn|si|ta|te|mr|gu|pa|kn|ml)\b/i.test(l)) return "en-IN";
  }
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
  if (/Kathmandu|Kolkata|Calcutta|Dhaka|Karachi|Colombo|Thimphu/.test(tz)) return "en-IN";
  return /^en/i.test(langs[0]) ? langs[0] : "en-US";
}
const recLang = () => (accent === "auto" ? autoLang() : accent);

let whisper = false;
const canRecord = !!(navigator.mediaDevices?.getUserMedia && window.MediaRecorder);
fetch("/api/transcribe", { method: "GET" }).then((r) => r.ok && r.json()).then((j) => {
  whisper = !!j?.enabled && canRecord;
  paintEngine();
}).catch(() => {});

let rec = null, listening = false, stopRecording = null, micLevel = 0;

function listen() {
  if (listening) { rec?.stop(); stopRecording?.(); return; }
  speechSynthesis?.cancel();
  if (whisper) return listenWhisper();
  if (!SR) {
    reply({ say: canRecord ? "Voice input isn't available in this browser yet, but you can type your question below." : "Voice input isn't supported in this browser, but you can type your question below." }, false);
    $("ask-input").focus();
    return;
  }
  rec = new SR();
  rec.lang = recLang(); rec.interimResults = true; rec.maxAlternatives = 5; rec.continuous = false;
  let finals = [];   // list of alternative transcripts for the utterance
  let interim = "";
  rec.onstart = () => { listening = true; setState("listening"); $("you").textContent = "Listening…"; };
  rec.onresult = (e) => {
    interim = "";
    finals = [];
    for (let i = 0; i < e.results.length; i++) {
      const res = e.results[i];
      if (res.isFinal) finals.push(Array.from(res).map((a) => a.transcript.trim()));
      else interim += res[0].transcript;
    }
    const shown = finals.map((alts) => alts[0]).join(" ") + (interim ? " " + interim : "");
    $("you").textContent = "› " + shown.trim();
  };
  rec.onerror = (e) => {
    listening = false; setState("idle");
    if (e.error === "not-allowed" || e.error === "service-not-allowed")
      reply({ say: "I can't hear you without microphone access. You can type instead." }, false);
    else if (e.error === "no-speech")
      reply({ say: "I didn't catch anything. Tap the orb and try again, a little closer to the mic." }, false);
  };
  rec.onend = () => {
    listening = false;
    if (!finals.length && interim.trim()) finals = [[interim.trim()]];
    if (!finals.length) { setState("idle"); if ($("you").textContent === "Listening…") $("you").textContent = ""; return; }
    // Try every combination of alternatives (usually one segment with up to 5 guesses) and keep the one the brain understands best.
    let cands = [""];
    for (const alts of finals) cands = cands.flatMap((c) => alts.slice(0, 5).map((a) => (c + " " + a).trim())).slice(0, 25);
    let best = cands[0], bestScore = -1;
    for (const c of cands) { const sc = think(c, false).score; if (sc > bestScore) { best = c; bestScore = sc; } }
    ask(best, true);
  };
  rec.start();
}

async function listenWhisper() {
  let stream;
  try {
    stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true } });
  } catch {
    reply({ say: "I can't hear you without microphone access. You can type instead." }, false);
    return;
  }
  const type = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/ogg;codecs=opus"].find((t) => MediaRecorder.isTypeSupported?.(t)) || "";
  const mr = new MediaRecorder(stream, type ? { mimeType: type } : undefined);
  const chunks = [];
  mr.ondataavailable = (e) => e.data.size && chunks.push(e.data);

  // simple voice-activity detection: stop after ~1.3 s of silence once speech has started
  const ac = new (window.AudioContext || window.webkitAudioContext)();
  const an = ac.createAnalyser(); an.fftSize = 1024;
  ac.createMediaStreamSource(stream).connect(an);
  const buf = new Float32Array(an.fftSize);
  let spoke = false, quietSince = performance.now(), started = performance.now(), raf = 0, done = false;
  const finish = () => {
    if (done) return; done = true;
    cancelAnimationFrame(raf);
    if (mr.state !== "inactive") mr.stop();
  };
  stopRecording = finish;
  const watch = () => {
    an.getFloatTimeDomainData(buf);
    let rms = 0; for (const v of buf) rms += v * v; rms = Math.sqrt(rms / buf.length);
    micLevel = Math.min(1, rms * 12);
    const now = performance.now();
    if (rms > 0.025) { spoke = true; quietSince = now; }
    if ((spoke && now - quietSince > 1300) || (!spoke && now - started > 6000) || now - started > 12000) return finish();
    raf = requestAnimationFrame(watch);
  };

  mr.onstop = async () => {
    listening = false; stopRecording = null; micLevel = 0;
    stream.getTracks().forEach((t) => t.stop()); ac.close();
    if (!spoke) { setState("idle"); $("you").textContent = ""; reply({ say: "I didn't catch anything. Tap the orb and try again." }, false); return; }
    setState("thinking");
    $("you").textContent = "Transcribing…";
    try {
      const blob = new Blob(chunks, { type: mr.mimeType || type || "audio/webm" });
      const r = await fetch("/api/transcribe", { method: "POST", headers: { "Content-Type": "application/octet-stream", "X-Audio-Type": blob.type }, body: blob });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || "transcription failed");
      if (!j.text) { setState("idle"); reply({ say: "I didn't catch that. Tap the orb and try again, or type." }, false); return; }
      ask(j.text, true);
    } catch {
      whisper = false; paintEngine();   // fall back to the browser engine for the rest of the visit
      setState("idle");
      reply({ say: "My speech service is busy right now. Tap the orb again and I'll use the browser's recognition, or type." }, false);
    }
  };
  mr.start();
  listening = true; setState("listening"); $("you").textContent = "Listening… tap the orb when you're done";
  watch();
}

function paintEngine() {
  const el = $("engine");
  if (!el) return;
  el.textContent = whisper ? "Speech: Whisper, any accent or language" : SR ? `Speech: browser, ${ACCENTS.find(([v]) => v === accent)?.[1] || "Auto"} English` : "Speech: type to ask";
  $("accent-wrap").hidden = whisper || !SR;
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
      for (const q of r.suggest || []) {
        const b = document.createElement("button");
        b.type = "button"; b.className = "btn"; b.textContent = q;
        b.addEventListener("click", () => ask(q));
        acts.appendChild(b);
      }
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
}

function ask(q, fromVoice = false) {
  q = String(q || "").trim();
  if (!q) return;
  $("you").textContent = "› " + q;
  setState("thinking");
  setTimeout(() => {
    let r = think(q);
    if (r.fallback) {
      r = fromVoice
        ? { say: `I may have misheard. I caught "${q}". Did you mean one of these? You can also tap the orb and try again, or type.`, suggest: suggestions(q) }
        : { say: "That one isn't in my files. Try asking about Bibek's projects, skills, education, or how to get in touch.", suggest: suggestions(q) };
    }
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
    const target = state === "speaking" ? 0.55 + 0.45 * wordPulse
      : state === "listening" ? (micLevel > 0 ? 0.35 + 0.65 * micLevel : 0.6 + 0.25 * Math.sin(t * 8))
      : state === "thinking" ? 0.5 : 0.12;
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
const sel = $("accent");
if (sel) {
  for (const [v, label] of ACCENTS) {
    const o = document.createElement("option");
    o.value = v; o.textContent = v === "auto" ? `Auto (${autoLang()})` : label;
    sel.appendChild(o);
  }
  sel.value = ACCENTS.some(([v]) => v === accent) ? accent : "auto";
  sel.addEventListener("change", () => {
    accent = sel.value;
    try { localStorage.setItem("jarvis-accent", accent); } catch {}
    paintEngine();
  });
}
paintEngine();
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
