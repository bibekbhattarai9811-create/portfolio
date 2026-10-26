const fs = require("fs");
const {
  Document, Packer, Paragraph, TextRun, ExternalHyperlink, AlignmentType, TabStopType,
  BorderStyle, LevelFormat,
} = require("docx");

const ACCENT = "1F4E79";
const MUTED = "595959";
const FONT = "Calibri";
const MARGIN = 864; // 0.6"
const RIGHT = 12240 - MARGIN * 2;

const t = (text, o = {}) => new TextRun({ text, font: FONT, size: 20, ...o });
const link = (text, url) =>
  new ExternalHyperlink({ link: url, children: [t(text, { color: ACCENT, underline: {} })] });

const heading = (text) =>
  new Paragraph({
    spacing: { before: 200, after: 80 },
    keepNext: true,
    border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: ACCENT, space: 2 } },
    children: [t(text.toUpperCase(), { bold: true, size: 22, color: ACCENT, characterSpacing: 30 })],
  });

// "Title — place" on the left, date flush right
const entry = (title, sub, date, before = 100) =>
  new Paragraph({
    spacing: { before, after: 0 },
    tabStops: [{ type: TabStopType.RIGHT, position: RIGHT }],
    keepNext: true,
    children: [
      t(title, { bold: true, size: 21 }),
      ...(sub ? [t("  |  " + sub, { color: MUTED })] : []),
      ...(date ? [t("\t" + date, { color: MUTED, italics: true })] : []),
    ],
  });

const line = (children, o = {}) =>
  new Paragraph({ spacing: { after: 20 }, keepNext: true, children, ...o });

const bullet = (children) =>
  new Paragraph({
    numbering: { reference: "dots", level: 0 },
    spacing: { after: 20 },
    children: typeof children === "string" ? [t(children)] : children,
  });

const labeled = (label, value) =>
  new Paragraph({ spacing: { after: 30 }, children: [t(label + ": ", { bold: true }), t(value)] });

const cert = (name, issuer, date) =>
  new Paragraph({
    numbering: { reference: "dots", level: 0 },
    spacing: { after: 20 },
    tabStops: [{ type: TabStopType.RIGHT, position: RIGHT }],
    children: [t(name, { bold: true }), t(" — " + issuer), t("\t" + date, { color: MUTED, italics: true })],
  });

const children = [
  // Header
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 20 },
    children: [t("BIBEK BHATTARAI", { bold: true, size: 40, color: ACCENT, characterSpacing: 40 })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 60 },
    children: [t("Data Science & Civil Engineering Student", { size: 22, color: MUTED })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 20 },
    children: [
      t("Jonesboro, AR  •  (870) 340-9911  •  "),
      link("Bibek.bhattara2@smail.astate.edu", "mailto:Bibek.bhattara2@smail.astate.edu"),
    ],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 60 },
    children: [
      link("bibek-bhattarai.vercel.app", "https://bibek-bhattarai.vercel.app"),
      t("  •  "),
      link("linkedin.com/in/bibek-bhattarai-0845b5332", "https://www.linkedin.com/in/bibek-bhattarai-0845b5332/"),
      t("  •  "),
      link("github.com/bibekbhattarai9811-create", "https://github.com/bibekbhattarai9811-create"),
    ],
  }),

  heading("Profile"),
  new Paragraph({
    spacing: { after: 40 },
    children: [t(
      "Detail-oriented Data Science & Data Analytics student at Arkansas State University and two-time Dean's List " +
      "honoree, also studying civil engineering. I build end-to-end projects, from machine-learning models in Python " +
      "to full-stack web apps deployed live, and hold IBM data science certificates plus 10 DataCamp courses in Python, SQL and Power BI. I bring hands-on experience in " +
      "data organization, customer service and teamwork, and I'm seeking data analyst or engineering internships."
    )],
  }),

  heading("Education"),
  entry("Arkansas State University", "Jonesboro, AR", "Expected 2027", 40),
  line([t("Bachelor of Science in Data Science and Data Analytics; also studying Civil Engineering", { italics: true })]),
  bullet([t("Dean's List: ", { bold: true }), t("Fall 2025 and Spring 2026")]),
  entry("Trinity International College", "Kathmandu, Nepal", "2022"),
  line([t("High School (+2 in Science)  •  GPA 3.32 / 4.0", { italics: true })]),
  entry("Nepal Mega School", "Kathmandu, Nepal", "2020"),
  line([t("Secondary Education Examination (SEE)  •  GPA 3.70 / 4.0", { italics: true })]),

  heading("Certifications"),
  cert("What is Data Science?", "IBM (Coursera)", "Jun 2026"),
  cert("Tools for Data Science", "IBM (Coursera)", "Jun 2026"),
  cert("Data Science Methodology", "IBM (Coursera)", "Jun 2026"),
  cert("Tools for Data Science V2", "Coursera (Credly badge)", "Jun 2026"),
  cert("Data Science Orientation", "Coursera (Credly badge)", "Jun 2026"),
  cert("Claude 101", "Anthropic", "Jun 2026"),
  new Paragraph({
    numbering: { reference: "dots", level: 0 },
    spacing: { before: 40, after: 20 },
    children: [
      t("DataCamp (10 courses): ", { bold: true }),
      t("Introduction to Python, Intermediate Python, Introduction to NumPy, Reshaping Data with pandas, " +
        "Exploratory Data Analysis in Python, Introduction to Data Visualization with Matplotlib, Introduction to SQL, " +
        "Intermediate SQL, Data Visualization in Power BI, Data Warehousing Concepts"),
    ],
  }),

  heading("Projects"),
  entry("LearnCivilWithMe", "Next.js, PostgreSQL (Neon), Vercel", null, 40),
  line([link("learncivilwithme.vercel.app", "https://learncivilwithme.vercel.app")]),
  bullet("Built and deployed a free self-study platform that guides learners to a US civil engineering license: 9 phases and 94 tasks with curated free resources."),
  bullet("Wrote 145 FE-style practice questions and engineering calculators (beams, sections, Manning's equation, concrete), with optional login and cloud-synced progress."),
  entry("EquipGuard: Predictive Maintenance", "Python, scikit-learn, FastAPI, Next.js"),
  bullet("Simulated run-to-failure sensor data for a fleet of 100 pumps and trained gradient boosting models to predict remaining useful life (MAE ≈ 16.6 cycles) and near-term failure risk (ROC-AUC ≈ 0.93)."),
  bullet("Used unit-level train/test splits to prevent data leakage, and served live predictions through a FastAPI backend and an interactive dashboard."),
  entry("Traffic Accident Severity Prediction", "Python, pandas, scikit-learn, seaborn"),
  bullet("Modeled accident severity from weather, time-of-day and road features in the US Accidents dataset; compared a logistic regression baseline with a random forest using weighted F1 and repeated stratified splits."),
  entry("TBN Store: E-commerce Site", "Next.js, Prisma, PostgreSQL, Auth.js"),
  line([link("tbnstore.vercel.app", "https://tbnstore.vercel.app")]),
  bullet("Built a bilingual (English/Nepali) storefront for a kids' clothing brand with search, wishlists, reviews, coupons, stock alerts, a booking flow and an admin dashboard."),
  entry("Service Marketplace", "FastAPI, PostgreSQL, React, Capacitor"),
  bullet("Built a platform connecting customers with skilled workers: customer, worker and admin roles, real-time WebSocket chat, Stripe payments, maps and dispute moderation."),
  entry("VideoForge: Automated Video Pipeline", "Python, MoviePy, Claude, Next.js"),
  bullet("Automated a YouTube workflow from idea to AI-written script, voice-over with word-synced captions and an auto-edited MP4, replacing hours of manual editing."),
  entry("PyQuest: Learn Python in the Browser", "Pyodide, Next.js"),
  bullet("Created 83 bite-sized Python lessons that run real Python in the browser with automatic answer checking."),
  entry("AI Office: Multi-Agent Business Assistant", "Next.js, TypeScript, Claude, Gemini, Groq, NVIDIA"),
  bullet("Built a team of six AI agents (CEO, researcher, analyst, marketer, builder, ops) that runs a scheduled daily cycle with live web research, model fallback across four providers and a human approval queue for every outbound action."),
  entry("JoRide: Community Ride App", "Next.js, TypeScript, SQLite, PWA"),
  bullet("Designed a phone-first, installable app for free rides in Jonesboro with passenger and driver modes, race-free ride acceptance, chat, a live ride tracker and safe-arrival check-ins."),
  entry("Also built", null),
  bullet("JARVIS (voice assistant for phone and PC with wake word and live web search), FinTrack (finance and tasks dashboard), Expense Tracker (Next.js, Express, Prisma, Clerk) and this portfolio site with a real-time truss model (JavaScript, Canvas)."),
  entry("Why It Broke", "YouTube channel, creator"),
  bullet("Research, script and produce videos explaining engineering failures, starting with the Tacoma Narrows Bridge collapse."),

  heading("Work Experience"),
  entry("Sodexo Food Services", "Jonesboro, AR", "May 2024 – Nov 2025", 40),
  line([t("Food Service Worker", { italics: true })]),
  bullet("Delivered efficient food service as part of a team-oriented operation."),
  bullet("Maintained cleanliness, organization and food-quality standards."),
  bullet("Assisted customers and supported food preparation."),
  entry("Chartered Accountants' Office (CA Firm)", "Kathmandu, Nepal", "Mar 2023 – Nov 2023"),
  line([t("Data Organizer & Front Desk Assistant", { italics: true })]),
  bullet("Managed and organized client data and financial records, keeping documents accurate."),
  bullet("Handled client inquiries and scheduling."),
  bullet("Supported day-to-day administrative operations."),

  heading("Skills"),
  labeled("Data & Programming", "Python (pandas, NumPy, Matplotlib, scikit-learn), SQL, JavaScript / TypeScript, HTML / CSS"),
  labeled("Tools", "Power BI, Microsoft Excel, Word and PowerPoint, Git, FastAPI, Next.js / React, Vercel"),
  labeled("Data Concepts", "Exploratory data analysis, data visualization, data warehousing, machine learning basics"),
  labeled("AI", "Claude, AI-assisted automation and content workflows"),
  labeled("Engineering", "Statics fundamentals, FE exam preparation"),
  labeled("Professional", "Data entry and organization, communication, teamwork, time management, problem solving"),

  heading("Languages & Interests"),
  labeled("Languages", "English (Fluent), Nepali (Native), Hindi (Conversational)"),
  labeled("Interests", "Data analytics, technology trends, teamwork, problem solving and continuous learning"),
];

const doc = new Document({
  creator: "Bibek Bhattarai",
  title: "Bibek Bhattarai — CV",
  styles: { default: { document: { run: { font: FONT, size: 20 } } } },
  numbering: {
    config: [{
      reference: "dots",
      levels: [{
        level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 360, hanging: 220 } } },
      }],
    }],
  },
  sections: [{
    properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 720, bottom: 720, left: MARGIN, right: MARGIN } } },
    children,
  }],
});

Packer.toBuffer(doc).then((buf) => {
  fs.writeFileSync(process.argv[2], buf);
  console.log("written", buf.length);
});
