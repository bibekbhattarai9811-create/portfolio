"""Generate the case-study pages in work/<slug>/index.html.

Edit the CASES list below, then run:  python tools/build_cases.py
The pages are plain static HTML that share /assets/site.css and /assets/site.js.
"""
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SITE = "https://bibek-bhattarai.vercel.app"


def shot(img, alt, label, caption=None, cls=""):
    cap = f'<figcaption class="mono">{caption}</figcaption>' if caption else ""
    return f"""<figure class="rv {cls}">
          <div class="shot"><div class="bar"><i></i><i></i><i></i><span>{label}</span></div>
            <img src="/img/{img}.webp" srcset="/img/{img}-720.webp 720w, /img/{img}.webp 1200w" sizes="(max-width: 960px) 100vw, 1200px"
              width="1200" height="750" alt="{alt}" loading="lazy" decoding="async" /></div>
          {cap}
        </figure>"""


def steps(items):
    return '<ol class="steps">' + "".join(f"<li><div><h3>{h}</h3><p>{p}</p></div></li>" for h, p in items) + "</ol>"


def decisions(items):
    return '<div class="decisions">' + "".join(f"<div><h3>{h}</h3><p>{p}</p></div>" for h, p in items) + "</div>"


def stats(items):
    return '<div class="stats">' + "".join(f"<div><strong>{v}</strong><span>{k}</span></div>" for v, k in items) + "</div>"


def paras(*ps):
    return "".join(f"<p>{p}</p>" for p in ps)


CASES = [
    {
        "slug": "learncivilwithme",
        "title": "LearnCivilWithMe",
        "kicker": "Case study 01 · Education · 2026",
        "lede": "A free, self-paced path from day one to a US civil engineering license, built because I needed it myself.",
        "role": "Product, design and full-stack development",
        "timeline": "September 2026, ongoing",
        "stack": "Next.js 16, React 19, TypeScript, PostgreSQL (Neon), Resend, Vercel",
        "links": [("Live site", "https://learncivilwithme.vercel.app"), ("Source", "https://github.com/bibekbhattarai9811-create/learncivilwithme")],
        "cover": ("learncivilwithme", "LearnCivilWithMe dashboard with progress toward the PE license", "learncivilwithme.vercel.app"),
        "sections": [
            ("Overview", "The problem", paras(
                "In the US, becoming a licensed civil engineer means passing the FE exam, gaining experience and then passing the PE. I'm working toward that path, and the hard part isn't motivation. It's structure: what to study, in what order, and how to know you're actually ready.",
                "Good free material exists, but it's scattered across MIT OpenCourseWare, NPTEL, Khan Academy and government sites, and most structured FE prep is paid. I wanted one place that turns all of that into a plan you can follow and check off.")),
            ("Approach", "What I built", steps([
                ("A roadmap stored as data", "9 phases, 36 modules and 94 tasks, each with key concepts and hand-picked resources tagged free, student or paid. Every link was checked live, and task IDs stay stable so saved progress never breaks when content changes."),
                ("Practice that mirrors the exam", "145 FE-style questions across 12 topics with worked solutions, per-topic accuracy, a review-missed mode and an FE-pace timer. Each phase ends in a test (pass mark 70%), and a 40-question final exam (75%) awards a printable certificate."),
                ("Calculators for checking hand work", "Beam analysis with shear, moment and deflection diagrams, section properties, Manning's equation, a concrete estimator, engineering economics and a unit converter, all verified against hand calculations."),
                ("Habits, not just content", "A study log with a weekly goal, a 16-week heatmap and hours by subject, so progress is visible week to week."),
            ])),
            ("Decisions", "Key decisions", decisions([
                ("Guest-first, accounts optional", "Everything works without signing up, with progress kept in the browser. An optional free account syncs to Postgres and merges guest progress on first login, so nobody loses work."),
                ("Security done properly", "Passwords are bcrypt-hashed, sessions are random tokens in httpOnly cookies with only their SHA-256 stored, failed logins are throttled and password-reset links are single-use and expire in an hour."),
                ("Honest about cost", "A dedicated page explains what's genuinely free and what isn't, for example the FE exam fee itself, so learners can plan a zero-cost route."),
                ("Ships on every push", "The site deploys automatically from GitHub to Vercel, so content fixes go live in minutes."),
            ])),
            ("Results", "Where it stands", stats([("94", "tasks in 9 phases"), ("145", "FE-style questions"), ("6", "engineering calculators"), ("10", "phase tests and final exam")]) + paras(
                "The site is live and free. It's built around my own preparation, which keeps the content honest: if a resource or question doesn't help, it gets replaced.")),
            ("Next", "What I'd do next", paras(
                "Add more worked examples per topic, extend the question bank toward PE-level depth, and add anonymous analytics on which topics learners miss most so the hardest areas get the most attention.")),
        ],
        "gallery": [
            ("case/lcwm-tools", "Beam analysis calculator with shear diagram", "learncivilwithme · calculators", "Beam analysis: reactions, shear, moment and deflection for a simply supported beam."),
            ("case/lcwm-practice", "FE practice topic picker with question counts per topic", "learncivilwithme · FE practice", "FE practice: 145 questions across 12 topics, sized like the real exam."),
        ],
    },
    {
        "slug": "equipguard",
        "title": "EquipGuard",
        "kicker": "Case study 02 · Machine learning · 2026",
        "lede": "Predicting when industrial pumps will fail, from raw sensor telemetry to a model a maintenance planner can actually use.",
        "role": "Data science, modeling and full-stack development",
        "timeline": "September 2026",
        "stack": "Python, pandas, scikit-learn, FastAPI, Next.js, Recharts",
        "links": [("Live demo", "https://equipguard-beige.vercel.app"), ("Source", "https://github.com/bibekbhattarai9811-create/equipguard")],
        "cover": ("equipguard", "EquipGuard fleet overview ranking 100 pumps by failure risk", "equipguard · fleet overview"),
        "sections": [
            ("Overview", "The problem", paras(
                "Unplanned equipment failure is expensive: lost production, emergency repairs and safety risk. Predictive maintenance asks two questions of sensor data: <strong>how much useful life does this machine have left</strong>, and <strong>how likely is it to fail soon?</strong>",
                "I wanted a project that showed the full loop rather than a notebook: data with a real physical story, evaluation that can't cheat, a served model, and an interface a non-technical person can read.")),
            ("Data", "Simulating a fleet", paras(
                "Public datasets such as NASA's C-MAPSS are awkward to fetch reliably or licensed for competition use only, so I generated run-to-failure telemetry for 100 pumps, encoding the same physics those datasets rely on.",
                "Each pump's hidden wear drifts upward as a Wiener process (a random walk with drift), so failure timing varies unit to unit like real equipment. Five sensors respond to that wear with different sensitivities and noise: vibration, temperature and pressure react directly, lubricant quality degrades alongside it, and RPM stays near its setpoint. A per-unit load factor between 0.8 and 1.2 keeps the fleet from being identical.")),
            ("Approach", "Modeling", steps([
                ("Feature engineering", "Raw readings plus 5-cycle rolling means and standard deviations, the operating cycle and each unit's load factor."),
                ("Remaining useful life", "A gradient-boosted regressor predicts cycles remaining, capped at 125, the standard piecewise-linear labeling, because early-life wear isn't visible in sensors."),
                ("Failure risk", "A gradient-boosted classifier predicts the probability of failure within the next 30 cycles."),
                ("Serving", "A FastAPI backend loads both models at startup and serves fleet status, per-unit history, live what-if predictions and evaluation metrics to a Next.js dashboard."),
            ])),
            ("Decisions", "Key decisions", decisions([
                ("Split by pump, not by row", "Rolling features mean neighbouring rows share information. Splitting randomly by row would let a test pump's future leak into training, so whole pumps go to either train or test (GroupShuffleSplit)."),
                ("A realistic snapshot of the fleet", "Every simulated pump runs to failure, so its last row is always the failure point. Showing that as current status would make the whole fleet look critical, so each pump gets a fixed \"observed as of\" cycle somewhere in its life."),
                ("Make the model legible", "A what-if simulator lets anyone drag sensor sliders and watch predicted life and risk update live, which explains the model better than a metrics table."),
                ("Show what the model knew", "Unit charts draw a \"today\" marker separating what the model had seen from the hindsight-only part of the run."),
            ])),
            ("Results", "Held-out performance", stats([("16.6", "cycles MAE, remaining life"), ("21.5", "cycles RMSE"), ("0.93", "ROC-AUC, 30-cycle failure"), ("25", "pumps never seen in training")]) + paras(
                "All metrics are on pumps the models never saw during training, about 9,700 rows in total across the fleet.")),
            ("Next", "What I'd do next", paras(
                "Validate the pipeline on real C-MAPSS data, calibrate the failure probabilities so 30% really means 30%, and compare against survival models that treat time-to-failure directly.")),
        ],
        "gallery": [
            ("case/equipguard-unit", "Predicted versus actual remaining useful life for one pump", "equipguard · unit detail", "Unit detail: predicted vs. actual remaining life, with the moment of observation marked.", "wide"),
            ("case/equipguard-model", "Model metrics and feature importances", "equipguard · model", "Model page: held-out metrics and the features each model relies on."),
            ("case/equipguard-sim", "What-if simulator with sensor sliders", "equipguard · what-if simulator", "What-if simulator: drag the sensors, get a live prediction."),
        ],
    },
    {
        "slug": "tbn-store",
        "title": "TBN Store",
        "kicker": "Case study 03 · E-commerce · 2026",
        "lede": "An online storefront for a kids' clothing brand, designed around how the business actually takes orders.",
        "role": "Design and full-stack development",
        "timeline": "August 2026",
        "stack": "Next.js 16, Prisma, PostgreSQL, Auth.js, Resend, Vercel",
        "links": [("Live site", "https://tbnstore.vercel.app"), ("Source", "https://github.com/bibekbhattarai9811-create/tbn-store")],
        "cover": ("tbnstore", "TBN Store homepage", "tbnstore.vercel.app"),
        "sections": [
            ("Overview", "The brief", paras(
                "TBN Store sells sweaters, tracksuits and matching outfit sets for kids. It serves customers who may prefer Nepali, and it confirms every order by phone, for sizing and delivery, before anything is paid.",
                "So the site needed to feel like a real shop, with search, categories, reviews and wishlists, without forcing a card checkout that didn't match how the business works.")),
            ("Approach", "What I built", steps([
                ("Book now, confirm by phone", "Instead of a payment checkout, customers book the items they like, and the store calls to confirm size and delivery. The flow matches how orders are actually fulfilled."),
                ("A complete catalog", "Categories, trending items, search and sorting, product pages with image galleries and a size guide, plus reviews and wishlists."),
                ("Bilingual by design", "English and Nepali (नेपाली) with a one-tap toggle. Translations live in the database, so the owner can edit them without touching code."),
                ("Tools that drive repeat sales", "Coupons, referral codes and back-in-stock notifications, with transactional emails sent through Resend."),
                ("An admin dashboard", "Manage products, images, categories, stock, bookings, coupons and site settings in one place."),
            ])),
            ("Decisions", "Key decisions", decisions([
                ("Relational data model", "Thirteen Prisma models (users, products, images, bookings, coupons, reviews, wishlists, referrals, translations and more) keep the business rules in the database, not scattered through pages."),
                ("Built to be found", "Generated sitemap, robots rules and per-page Open Graph images, so products look right when shared on social media."),
                ("Prices in rupees, mobile first", "Prices are in rupees and the layout is designed phone-first."),
                ("Safe deploys", "Database migrations run as part of every production build, so the schema and the code never drift apart."),
            ])),
            ("Next", "What I'd do next", paras(
                "Add online payment as an option alongside booking, and a simple sales dashboard so the owner can see which products and sizes sell best.")),
        ],
        "gallery": [
            ("case/tbn-products", "Product grid with sweaters and prices in rupees", "tbnstore.vercel.app/products", "The full catalog with search, sorting and rupee pricing.", "wide"),
        ],
    },
    {
        "slug": "pyquest",
        "title": "PyQuest",
        "kicker": "Case study 04 · Education · 2026",
        "lede": "Learn Python by writing it, with a real Python interpreter running in the browser and nothing to install.",
        "role": "Curriculum, design and full-stack development",
        "timeline": "August 2026",
        "stack": "Next.js 16, React 19, TypeScript, CodeMirror 6, Pyodide, Web Workers, Prisma, PostgreSQL",
        "links": [("Live site", "https://pyquest-4h36.vercel.app"), ("Source", "https://github.com/bibekbhattarai9811-create/pyquest")],
        "cover": ("pyquest", "PyQuest landing page", "pyquest"),
        "sections": [
            ("Overview", "The problem", paras(
                "Beginners usually hit two walls: installing Python before writing a single line, and lessons that pack several new ideas into one step.",
                "PyQuest removes both. Every lesson opens next to a code editor that runs real Python in the browser, and every lesson teaches exactly one idea.")),
            ("Approach", "How it works", steps([
                ("One idea per lesson", "The first version had 21 lessons. Testing showed they moved too fast, so I rebuilt the course as 83 micro-lessons in 12 modules. Each has a short explanation, two worked examples, starter code that needs one small change, and a checked answer."),
                ("A second track for data", "An 18-lesson Data Scientist track covers NumPy, pandas and Matplotlib."),
                ("Verified content", "A script runs every lesson's solution through real Python, so no lesson ships with a broken answer."),
                ("Accounts and progress", "Email sign-up, saved progress and an admin dashboard to approve learners and see how far each one has got."),
            ])),
            ("Decisions", "Key decisions", decisions([
                ("Python in a Web Worker", "The Pyodide runtime runs off the main thread, so the page never freezes, and a 12-second timeout restarts the worker if a learner writes an infinite loop."),
                ("Solutions stay on the server", "Learners can request a lesson's full solution and an admin grants it. The answer is never sent to a browser that isn't allowed to see it."),
                ("A tutor that won't give it away", "An optional AI tutor sees the lesson, the learner's code and their last error, gives hints only, and has a daily cap per learner."),
                ("Privacy-safe password reset", "Reset requests always get the same reply, so the form can't be used to find out who has an account."),
            ])),
            ("Results", "Where it stands", stats([("101", "lessons across 2 tracks"), ("0", "installs needed"), ("12 s", "loop guard per run")]) + paras(
                "The runtime downloads once (about 6 MB) and is cached after that, so later lessons start instantly.")),
        ],
        "gallery": [
            ("case/pyquest-tracks", "PyQuest tracks page showing Python Basics and Data Scientist tracks", "pyquest · tracks", "Tracks: Python Basics, then career tracks such as Data Scientist.", "wide"),
        ],
    },
    {
        "slug": "videoforge",
        "title": "VideoForge",
        "kicker": "Case study 05 · Automation · 2026",
        "lede": "Idea in, finished video out: the production pipeline behind my engineering-failure channel, Why It Broke.",
        "role": "Product design and development",
        "timeline": "October 2026",
        "stack": "Next.js, TypeScript, Python, MoviePy, Microsoft neural voices, Claude",
        "links": [],
        "cover": ("videoforge", "VideoForge new video screen", "videoforge · local app"),
        "sections": [
            ("Overview", "The problem", paras(
                "Making one Why It Broke episode took hours: writing the script in a chat window, recording voice files, generating clips, collecting archival footage, then placing everything by hand in a video editor.",
                "Most of that time went into mechanical work: lining shots up with the narration, adding zooms and captions, trimming and exporting. That's exactly what software is good at.")),
            ("Approach", "The pipeline", steps([
                ("Plan", "Type an idea. Claude writes the script, shot list, image and video prompts, the cue word each shot should land on, and the title, description, tags and thumbnail idea."),
                ("Voice", "Each narration segment is generated with a neural voice, along with word-level timings, or I upload my own recording."),
                ("Quick draft", "A watchable draft renders immediately, with labelled placeholder cards for shots that aren't made yet, so the pacing can be judged early."),
                ("Fill in visuals", "Drop in generated clips and archival footage. A per-shot \"skip first seconds\" setting trims footage to the right moment."),
                ("Auto-edit and export", "Every shot is placed on its cue word, with slow zooms, slow motion, captions, music at 12% and a 1080p export, plus a publish kit with titles and tags ready to copy."),
            ])),
            ("Decisions", "Key decisions", decisions([
                ("A custom timeline, about 7× faster", "MoviePy's built-in compositing was too slow for long videos, so the editor renders through a single custom clip that decides frame by frame which shot is visible."),
                ("Keep humans where they add value", "AI video generation stays a copy-paste step in the Gemini app. It isn't available through a free API, and choosing the right clip is still a creative call."),
                ("Runs locally, works anywhere", "Rendering happens on my PC. An optional password-protected tunnel lets me start and check renders from my phone."),
                ("Editable at every step", "Any narration line can be edited, and its voice is regenerated automatically on the next render."),
            ])),
            ("Results", "Outcome", paras(
                "What used to take hours of manual editing is now mostly waiting for a render. I've used it to plan and render episodes on the Silver Bridge and Hyatt Regency walkway collapses.")),
        ],
        "gallery": [
            ("case/videoforge-project", "VideoForge project page for the Silver Bridge episode with video preview", "videoforge · project", "A project page: draft preview, voice settings and the shot list.", "wide"),
        ],
    },
]


def page(c, nxt):
    links = " · ".join(f'<a href="{u}" target="_blank" rel="noopener">{t} ↗</a>' for t, u in c["links"]) or "Private, runs locally"
    sections = "".join(
        f"""
      <section class="cs">
        <header class="rv"><span class="mono">{label}</span><h2>{title}</h2></header>
        <div class="cs-body rv">{body}</div>
      </section>""" for label, title, body in c["sections"])
    gallery = "".join(shot(g[0], g[1], g[2], g[3], g[4] if len(g) > 4 else "") for g in c["gallery"])
    img, alt, label = c["cover"]
    return f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>{c["title"]} — Bibek Bhattarai</title>
<meta name="description" content="{c["lede"]}" />
<meta name="color-scheme" content="light" />
<script>document.documentElement.classList.add("js")</script>
<meta property="og:title" content="{c["title"]} — case study by Bibek Bhattarai" />
<meta property="og:description" content="{c["lede"]}" />
<meta property="og:image" content="{SITE}/img/learncivilwithme.jpg" />
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='7' fill='%23111'/%3E%3Cpath d='M6 22h20M8 22l4-10 4 10 4-10 4 10M10 17h12' stroke='%23f4f2ec' stroke-width='1.8' fill='none' stroke-linejoin='round'/%3E%3C/svg%3E" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500&family=Inter:wght@400;500&family=Instrument+Serif:ital@1&family=JetBrains+Mono:wght@400&display=swap" />
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500&family=Inter:wght@400;500&family=Instrument+Serif:ital@1&family=JetBrains+Mono:wght@400&display=swap" media="print" onload="this.media='all'" />
<link rel="stylesheet" href="/assets/site.css" />
</head>
<body>

<header class="nav">
  <div class="wrap">
    <a href="/" class="brand"><i></i>Bibek Bhattarai</a>
    <nav>
      <a href="/#work">Work</a>
      <a href="/#about">About</a>
      <a href="/#experience">Experience</a>
      <a href="/#contact">Contact</a>
      <a class="btn" href="/Bibek-Bhattarai-CV.pdf" download>CV
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M8 2v9m0 0 3.5-3.5M8 11 4.5 7.5M3 14h10"/></svg></a>
    </nav>
  </div>
</header>

<main>
  <article class="wrap">
    <div class="case-hero">
      <a class="back mono" href="/#work">← All work</a>
      <span class="mono kicker">{c["kicker"]}</span>
      <h1>{c["title"]}</h1>
      <p class="lede">{c["lede"]}</p>
      <div class="meta">
        <div><span class="mono">Role</span><p>{c["role"]}</p></div>
        <div><span class="mono">Timeline</span><p>{c["timeline"]}</p></div>
        <div><span class="mono">Stack</span><p>{c["stack"]}</p></div>
        <div><span class="mono">Links</span><p>{links}</p></div>
      </div>
      <div class="case-cover">
        <div class="shot"><div class="bar"><i></i><i></i><i></i><span>{label}</span></div>
          <img src="/img/{img}.webp" srcset="/img/{img}-720.webp 720w, /img/{img}.webp 1200w" sizes="(max-width: 1240px) 100vw, 1200px"
            width="1200" height="750" alt="{alt}" fetchpriority="high" decoding="async" /></div>
      </div>
    </div>
{sections}

    <div class="gallery">
        {gallery}
    </div>

    <a class="next" href="/work/{nxt["slug"]}/">
      <span class="mono">Next project</span>
      <strong>{nxt["title"]} <span>→</span></strong>
    </a>
  </article>
</main>

<footer>
  <div class="wrap mono">
    <span>© <span id="yr">2026</span> Bibek Bhattarai</span>
    <span id="clock">Jonesboro, AR</span>
    <a href="/">Home ↑</a>
  </div>
</footer>
<script src="/assets/site.js" defer></script>
</body>
</html>
"""


for i, c in enumerate(CASES):
    out = ROOT / "work" / c["slug"] / "index.html"
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(page(c, CASES[(i + 1) % len(CASES)]), encoding="utf-8")
    print("wrote", out.relative_to(ROOT))
