"""Generate the case-study pages in work/<slug>/index.html.

Edit the CASES list below, then run:  python tools/build_cases.py
The pages are plain static HTML that share /assets/site.css and /assets/site.js.
"""
import re
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
        "slug": "jarvis",
        "title": "JARVIS",
        "kicker": "Case study 00 · AI assistant · 2026",
        "lede": "An Iron-Man-style assistant on Claude that runs on my PC, my phone and smart glasses, built to be useful and safe rather than just a demo.",
        "role": "Product design and full-stack development",
        "timeline": "October to November 2026, ongoing",
        "stack": "Next.js, TypeScript, Claude, MediaPipe, Web Speech API, PowerShell, Vitest, GitHub Actions",
        "links": [("Live demo", "https://jarvis-demo-sandy.vercel.app"), ("Source", "https://github.com/bibekbhattarai9811-create/jarvis")],
        "cover": ("jarvis", "JARVIS voice assistant with its glowing orb interface", "jarvis-demo-sandy.vercel.app"),
        "sections": [
            ("Overview", "The idea", paras(
                "I wanted a real JARVIS: something I can talk to from across the room, that answers with live information, controls my PC from my phone, and is fun to use.",
                "It grew into one self-hosted Next.js app with four parts: a voice assistant, a hand-tracked hologram playground, a camera-based inspection tool, and a hands-free field-report demo, all reachable from a PC, a phone or a smart-glasses display.")),
            ("Approach", "What it does", steps([
                ("Talk to it", "Say \"Jarvis\" and speak. Common commands (media, timers, opening apps and sites) run instantly, in about 0.3 seconds; everything else goes to Claude with live web search. It answers out loud in a British voice."),
                ("Control the PC from the phone", "Opening apps, media keys and locking the screen run on the PC itself, so the phone becomes a remote. Apps come from an allowlist and shells are blocked."),
                ("HOLO", "The camera tracks both hands with MediaPipe. Pinch to grab a hologram, throw it, stretch it with two hands, or smash two together into a blast. It can also cut a real object out of the camera view and turn it into a hologram."),
                ("Inspect Pro", "Photograph each room of a rental and Claude's vision model writes the report: a condition score, issues marked on the photo, safety alerts and a move-in vs move-out comparison, exported as a branded PDF with signatures."),
                ("Smart glasses", "A heads-up display designed for Meta Ray-Ban Display glasses shows the latest inspection or field step; I tested it in a built-in simulator."),
                ("Field Assist demo", "Dictate notes and get a first-person report draft that lists missing facts instead of inventing them, plus a scene diagram, two-way translation and checklists."),
            ])),
            ("Decisions", "Key decisions", decisions([
                ("Security from the start", "An owner PIN and separate guest codes, lockouts after failed attempts, signed cookies, an app allowlist, and images analysed with tools disabled to block prompt injection. It passed 20 out of 20 attack tests."),
                ("Some things I chose not to build", "Field Assist deliberately has no face recognition or licence-plate lookups of the public, for accuracy, legal and civil-rights reasons."),
                ("Face recognition only for greetings", "It can recognise my face to say hello, but never uses it to unlock anything, because a photo can fool it."),
                ("Tested and shareable", "25 automated tests and GitHub Actions run type checks, tests and a build on every push, and a public read-only demo runs on sample data."),
            ])),
            ("Results", "Where it stands", stats([("25", "automated tests"), ("20/20", "attack tests passed"), ("0.3 s", "instant commands"), ("3", "devices: PC, phone, glasses")]) + paras(
                "It runs in the background on my PC, and the live demo lets anyone try the voice assistant and HOLO in their browser.")),
        ],
        "gallery": [
            ("case/jarvis-holo", "HOLO hand-tracked hologram playground", "jarvis · holo", "HOLO: grab, throw, stretch and smash holograms with your hands.", "wide"),
            ("case/jarvis-inspect", "Inspect Pro report for a bedroom with marked issues", "jarvis · inspect pro", "Inspect Pro: a room photo becomes a scored report with marked issues."),
            ("case/jarvis-glasses", "Smart-glasses heads-up display showing a completed checklist", "jarvis · glasses hud", "Glasses HUD: the current step, readable at a glance."),
            ("case/jarvis-diagram", "Scene diagram editor with vehicles, impact point and witness", "jarvis · field assist", "Field Assist: a drag-and-drop scene diagram for the report.", "wide"),
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
        "slug": "ai-office",
        "title": "AI Office",
        "kicker": "Case study 00 · AI agents · 2026",
        "lede": "A small office of AI agents that works on my YouTube channels every day, plus a paper-trading desk, while every outbound action still needs my approval.",
        "role": "Product design and development",
        "timeline": "October 2026, ongoing",
        "stack": "Next.js, TypeScript, Three.js, Claude, Gemini, Groq, NVIDIA, ntfy",
        "links": [],
        "cover": ("aioffice", "Cartoon 3D office where six AI agents work at their desks", "ai office · 3d view"),
        "sections": [
            ("Overview", "The idea", paras(
                "I wanted help growing a side income without doing every step myself: researching topics, drafting titles and posts, and keeping track of what happened yesterday.",
                "AI Office treats that as a team. Six agents with distinct roles work through a daily cycle, now focused on growing my two YouTube channels, and a hard rule keeps me in charge: <strong>agents prepare, I send.</strong>")),
            ("Approach", "How a day works", steps([
                ("The CEO plans", "Ada, the CEO agent, reads the mission, the last three reports and my approve/reject decisions, then assigns three to six tasks."),
                ("The team works in order", "Rex researches with live web search and cites sources, Nia analyses, Mia writes titles, posts and SEO, Bo writes specs and Otto handles operations. Each agent sees what earlier teammates produced."),
                ("Nothing leaves without me", "Posts, emails, DMs, sign-ups and any spending land in an Approvals tab. New videos from VideoForge arrive there for review too."),
                ("A report that feeds tomorrow", "The CEO writes a daily report ending in a NEXT GOAL, and a morning brief is pushed to my phone."),
            ])),
            ("Trading desk", "A paper-trading desk", paras(
                "I added an 11-role trading team (chart scanner, news monitor, entry timer, exit planner, risk manager, budget manager, order executor and more) that trades a <strong>$1,000 paper account</strong>, never real money.",
                "Setups are scored on VWAP, moving averages, RSI, volume and nearness to the session high, with 1% risk per trade, a daily loss stop, at most two open positions and no trades near earnings. A trading journal writes a daily entry and a weekly scorecard.",
                "A Strategy Lab backtests rule sets across 12 symbols. The honest first result: over 60 days, every rule set lost money. Stocks came out roughly flat, and on crypto the fees alone (about 0.8% per round trip) were as large as the whole stop distance. That evidence now drives which markets the desk is allowed to trade.")),
            ("Decisions", "Key decisions", decisions([
                ("Every agent has a fallback chain", "Each agent tries its preferred model first and falls through Claude, Gemini, Groq and NVIDIA. Free models get retired often, so every runner walks a list of models."),
                ("Runs itself every morning", "A scheduled task runs the cycle at 8 AM, catches up when the PC wakes, runs at most once per day, and gives every step a deadline so one hung web search can't block the day."),
                ("Paper only, research framing", "The desk can't place real trades, and its output is labelled as research, not financial advice."),
                ("Make the work visible", "A cartoon 3D office shows the agents at their desks and the traders on a trading floor with live screens, and it can push trades and alerts to my phone."),
            ])),
            ("Results", "Where it stands", stats([("6", "office agents"), ("11", "trading-desk roles"), ("4", "AI providers with fallback"), ("1", "cycle per day, scheduled")]) + paras(
                "The office runs every morning on my PC, researching topics and titles for my channels, and the desk keeps paper-trading and backtesting.")),
        ],
        "gallery": [
            ("case/aioffice-dashboard", "AI Office dashboard with agent status cards and the approvals tab", "ai office · dashboard", "The dashboard: what each agent is doing, the goal for the cycle and the approvals waiting for me.", "wide"),
            ("case/aioffice-desk", "Paper trading desk with equity, win rate and the trading roles", "ai office · trading desk", "The paper-trading desk: equity curve, win rate and what each role is doing.", "wide"),
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
        "slug": "joride",
        "title": "JoRide",
        "kicker": "Case study 00 · Mobile web app · 2026",
        "lede": "Free rides between neighbours in Jonesboro: ask for a lift, and whoever is free gives it.",
        "role": "Product design and full-stack development",
        "timeline": "October 2026, prototype",
        "stack": "Next.js, TypeScript, SQLite, installable web app (PWA)",
        "links": [],
        "cover": ("joride", "JoRide passenger and driver screens on three phones", "joride · passenger and driver"),
        "sections": [
            ("Overview", "The problem", paras(
                "Getting around Jonesboro without a car is hard. Public transport is limited, and a quick trip to Walmart or Kroger can take a lot of planning.",
                "Plenty of people with cars have free time. JoRide connects the two with the simplest possible loop: <strong>request a ride, and whoever is free takes it.</strong> No prices, no fares, just neighbours helping out.")),
            ("Approach", "How it works", steps([
                ("Request", "A rider picks a destination (with quick picks like Walmart and Kroger), a pickup point and either Now or a scheduled time."),
                ("Accept", "Any driver who is online sees the request and taps \"I can take you\". Only one driver can win, because accepting is a single conditional database update."),
                ("Ride", "Rider and driver get chat, quick replies and each other's phone number, plus a tracker that moves from requested to driver found, picked up and arrived."),
                ("Finish safely", "The rider confirms \"I arrived safely\" and rates the driver. If a driver can't make it, the request goes straight back to open, and either side can report a problem."),
            ])),
            ("Decisions", "Key decisions", decisions([
                ("Two modes, one account", "Sign-in asks whether you're riding or driving. Passenger mode is a light green app, and driver mode is a dark, amber interface with an online switch and a live request feed."),
                ("Phone-first everywhere", "Key actions are pinned to the bottom of the screen within thumb reach, and the app can be installed to the home screen like a native app."),
                ("Kept deliberately free", "Earlier ideas such as splitting gas costs, a student-only gate and drivers posting seat offers were dropped to keep the loop as simple as asking a friend."),
                ("Simple, local data", "SQLite stores users, sessions, rides, messages, ratings and reports, which is fast to build on before moving to a hosted database."),
            ])),
            ("Next", "What's next", paras(
                "Put it online with a hosted database, add phone or email verification for safety, and notify riders the moment a driver accepts.")),
        ],
        "gallery": [
            ("case/joride-flow", "JoRide sign-in, ride request form and driver ride screen", "joride · sign-in, request, driver view", "Sign-in with a Passenger or Driver switch, the request form, and the driver's view of an accepted ride.", "wide"),
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
        "kicker": "Case study 00 · Automation · 2026",
        "lede": "From idea to finished video on autopilot: the production system behind my two YouTube channels.",
        "role": "Product design and development",
        "timeline": "October 2026, ongoing",
        "stack": "Next.js, TypeScript, Python, MoviePy, Claude, Chatterbox voice cloning, faster-whisper, numpy",
        "links": [],
        "cover": ("videoforge-shorts", "Three Why It Broke Shorts made by VideoForge", "videoforge · finished shorts"),
        "sections": [
            ("Overview", "The problem", paras(
                "Making one Why It Broke episode used to take hours: writing the script in a chat window, recording voice files, finding images, then placing everything by hand in a video editor.",
                "Most of that time was mechanical work that software is good at. So VideoForge first became an editor, then an autopilot that now makes a Short every day.")),
            ("Approach", "The autopilot", steps([
                ("Research and script", "Claude researches the topic with web search and writes a fact-checked script with its sources. A second pass polishes it against the facts and rejects big rewrites."),
                ("Visuals", "It pulls relevant, properly licensed photos from Wikimedia Commons and draws its own animated diagrams for stats, timelines and comparisons."),
                ("My voice", "Long videos are narrated in my own voice. I record once, and a local voice clone (Chatterbox, running on my laptop's CPU) reads new scripts; my own recordings are aligned word by word with Whisper."),
                ("Music and edit", "It composes an original background track in code, so there's no copyright risk, then edits everything to the narration with captions and a 1080p export."),
                ("Package", "Every video gets a title, a description with sources and photo credits, tags, three thumbnail options to A/B test, and three auto-picked clips cut into extra Shorts."),
            ])),
            ("Decisions", "Key decisions", decisions([
                ("My voice, not a stock AI voice", "Long videos use my own voice, to stay clear of YouTube's policy on fully automated content and to sound like a real channel."),
                ("A custom timeline, about 7x faster", "MoviePy's built-in compositing was too slow for long videos, so the editor renders through a single custom clip that decides frame by frame which shot is visible."),
                ("Ad-friendly by design", "The true-crime channel only covers solved, convicted cases, with no gore and careful wording, so episodes stay advertiser-friendly."),
                ("I stay the editor", "Finished videos land in my AI Office inbox and an upload folder for review; nothing is published without me."),
            ])),
            ("Results", "Two channels", stats([("1/day", "Shorts, made automatically"), ("2", "channels"), ("9-12 min", "long videos in my voice"), ("3", "thumbnail options per video")]) + paras(
                "<strong>Why It Broke</strong> covers engineering failures, from the Tacoma Narrows Bridge and the I-35W collapse to the Teton Dam and the Boeing 737 MAX. <strong>Case Closed Files</strong> tells solved true-crime cases twice a week, each with a teaser Short.")),
        ],
        "gallery": [
            ("case/videoforge-project", "VideoForge project page for the Silver Bridge episode with video preview", "videoforge · project", "A project page: draft preview, voice settings and the shot list.", "wide"),
            ("videoforge", "VideoForge new video screen with idea, format, length and voice options", "videoforge · new video", "Starting a video: idea, channel, format, length and voice."),
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
<meta name="color-scheme" content="dark" />
<script>document.documentElement.classList.add("js")</script>
<meta property="og:title" content="{c["title"]} — case study by Bibek Bhattarai" />
<meta property="og:description" content="{c["lede"]}" />
<meta property="og:image" content="{SITE}/img/learncivilwithme.jpg" />
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='7' fill='%2303070d'/%3E%3Cpath d='M6 22h20M8 22l4-10 4 10 4-10 4 10M10 17h12' stroke='%233fd8ff' stroke-width='1.8' fill='none' stroke-linejoin='round'/%3E%3C/svg%3E" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700&family=Inter:wght@400;500&family=JetBrains+Mono:wght@400&display=swap" />
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700&family=Inter:wght@400;500&family=JetBrains+Mono:wght@400&display=swap" media="print" onload="this.media='all'" />
<link rel="stylesheet" href="/assets/site.css" />
</head>
<body>

<header class="nav">
  <div class="wrap">
    <a href="/" class="brand"><i></i>Bibek.sys</a>
    <nav>
      <a href="/#work">Work</a>
      <a href="/#about">About</a>
      <a href="/#experience">Experience</a>
      <a href="/#contact">Contact</a>
      <a class="btn" href="/cv/">Request CV</a>
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
    c["kicker"] = re.sub(r"Case study \d\d", f"Case study {i + 1:02d}", c["kicker"])
    out = ROOT / "work" / c["slug"] / "index.html"
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(page(c, CASES[(i + 1) % len(CASES)]), encoding="utf-8")
    print("wrote", out.relative_to(ROOT))
