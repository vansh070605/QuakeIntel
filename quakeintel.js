const pptxgen = require("pptxgenjs");

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.author = "Vansh Agrawal";
pres.title = "QuakeIntel: Project SeismoSense v4.3.5";

// ─── COLOR PALETTE ───────────────────────────────────────────
// Dark intelligence dashboard theme
const C = {
  bg:       "0A0F1E",   // near-black navy (dominant)
  panel:    "111827",   // dark slate panel
  card:     "1A2535",   // card surface
  cyan:     "00E5FF",   // neon cyan accent
  cyanDim:  "0891B2",   // muted cyan
  cyanSoft: "164E63",   // very dark teal
  white:    "F1F5F9",   // off-white text
  muted:    "94A3B8",   // muted text
  gold:     "F59E0B",   // warm gold accent
  red:      "EF4444",   // alert red
  green:    "10B981",   // success green
  purple:   "8B5CF6",   // purple accent
  gridLine: "1E3A5F",   // subtle grid
};

// ─── HELPER FUNCTIONS ─────────────────────────────────────────

function bg(slide) {
  slide.background = { color: C.bg };
}

// Horizontal scanline grid for sci-fi feel
function addGrid(slide) {
  for (let i = 0; i < 12; i++) {
    slide.addShape(pres.shapes.LINE, {
      x: 0, y: 0.47 * i, w: 10, h: 0,
      line: { color: C.gridLine, width: 0.3 },
    });
  }
}

// Corner bracket decorations
function addCornerBrackets(slide, color = C.cyan) {
  const sz = 0.3, t = 0.03;
  // top-left
  slide.addShape(pres.shapes.LINE, { x: 0.15, y: 0.15, w: sz, h: 0, line: { color, width: 2 } });
  slide.addShape(pres.shapes.LINE, { x: 0.15, y: 0.15, w: 0, h: sz, line: { color, width: 2 } });
  // top-right
  slide.addShape(pres.shapes.LINE, { x: 9.55, y: 0.15, w: sz, h: 0, line: { color, width: 2 } });
  slide.addShape(pres.shapes.LINE, { x: 9.85, y: 0.15, w: 0, h: sz, line: { color, width: 2 } });
  // bottom-left
  slide.addShape(pres.shapes.LINE, { x: 0.15, y: 5.31, w: sz, h: 0, line: { color, width: 2 } });
  slide.addShape(pres.shapes.LINE, { x: 0.15, y: 5.01, w: 0, h: sz, line: { color, width: 2 } });
  // bottom-right
  slide.addShape(pres.shapes.LINE, { x: 9.55, y: 5.31, w: sz, h: 0, line: { color, width: 2 } });
  slide.addShape(pres.shapes.LINE, { x: 9.85, y: 5.01, w: 0, h: sz, line: { color, width: 2 } });
}

function addTopBar(slide, label = "CLASSIFIED — SEISMOSENSE INTELLIGENCE PLATFORM") {
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.25,
    fill: { color: C.cyanSoft },
    line: { color: C.cyanSoft, width: 0 },
  });
  slide.addText(label, {
    x: 0, y: 0, w: 10, h: 0.25,
    fontSize: 7, color: C.cyan, fontFace: "Consolas",
    align: "center", valign: "middle", charSpacing: 3,
  });
}

function addBottomBar(slide, slideNum, total = 14) {
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 5.375, w: 10, h: 0.25,
    fill: { color: C.panel },
    line: { color: C.gridLine, width: 0 },
  });
  slide.addText(`© 2025  QUAKEINTEL  |  Vansh Agrawal  RA2311026010120  |  SRM Institute of Science & Technology`, {
    x: 0.3, y: 5.38, w: 8.5, h: 0.22,
    fontSize: 6.5, color: C.muted, fontFace: "Consolas", valign: "middle",
  });
  slide.addText(`${slideNum} / ${total}`, {
    x: 8.7, y: 5.38, w: 1.1, h: 0.22,
    fontSize: 7, color: C.cyan, fontFace: "Consolas", align: "right", valign: "middle",
  });
}

function addSlideTitle(slide, title, sub = "") {
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.4, y: 0.3, w: 0.06, h: 0.55,
    fill: { color: C.cyan }, line: { color: C.cyan, width: 0 },
  });
  slide.addText(title, {
    x: 0.6, y: 0.28, w: 9.1, h: 0.38,
    fontSize: 22, bold: true, color: C.white, fontFace: "Trebuchet MS",
    margin: 0,
  });
  if (sub) {
    slide.addText(sub, {
      x: 0.6, y: 0.66, w: 9.1, h: 0.22,
      fontSize: 10, color: C.cyan, fontFace: "Consolas", charSpacing: 2, margin: 0,
    });
  }
}

function addCard(slide, x, y, w, h, accentColor = C.cyanSoft) {
  slide.addShape(pres.shapes.RECTANGLE, {
    x, y, w, h,
    fill: { color: C.card },
    line: { color: accentColor, width: 1 },
  });
}

function addGlowDot(slide, x, y, color = C.cyan) {
  slide.addShape(pres.shapes.OVAL, {
    x: x - 0.07, y: y - 0.07, w: 0.14, h: 0.14,
    fill: { color },
    line: { color, width: 0 },
  });
}

// ─────────────────────────────────────────────────────────────
// SLIDE 1 — TITLE SLIDE
// ─────────────────────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addGrid(s);

  // Big center panel
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 5.625,
    fill: { color: C.bg, transparency: 0 },
    line: { color: C.bg, width: 0 },
  });

  // Top accent strip
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.06,
    fill: { color: C.cyan }, line: { color: C.cyan, width: 0 },
  });

  // Center glow oval
  s.addShape(pres.shapes.OVAL, {
    x: 2.5, y: 1.0, w: 5, h: 3.2,
    fill: { color: "002233", transparency: 30 },
    line: { color: C.cyanDim, width: 1 },
  });

  // === QUAKEINTEL title ===
  s.addText("QUAKEINTEL", {
    x: 0.5, y: 1.05, w: 9, h: 0.9,
    fontSize: 64, bold: true, color: C.cyan, fontFace: "Arial Black",
    align: "center", charSpacing: 12,
  });

  // Horizontal divider
  s.addShape(pres.shapes.LINE, {
    x: 1.5, y: 2.05, w: 7, h: 0,
    line: { color: C.cyan, width: 1 },
  });

  s.addText("PROJECT SEISMOSENSE v4.3.5", {
    x: 0.5, y: 2.1, w: 9, h: 0.45,
    fontSize: 18, bold: false, color: C.white, fontFace: "Trebuchet MS",
    align: "center", charSpacing: 6,
  });
  s.addText("Universal Seismic Synthesis & Global Hazard Intelligence", {
    x: 0.5, y: 2.58, w: 9, h: 0.32,
    fontSize: 13, color: C.muted, fontFace: "Trebuchet MS",
    align: "center", italic: true,
  });

  s.addShape(pres.shapes.LINE, {
    x: 2.5, y: 3.08, w: 5, h: 0,
    line: { color: C.gridLine, width: 1 },
  });

  // Author block
  s.addText("VANSH AGRAWAL", {
    x: 0.5, y: 3.18, w: 9, h: 0.36,
    fontSize: 20, bold: true, color: C.gold, fontFace: "Trebuchet MS",
    align: "center", charSpacing: 4,
  });
  s.addText("Reg. No.  RA2311026010120", {
    x: 0.5, y: 3.55, w: 9, h: 0.26,
    fontSize: 11, color: C.muted, fontFace: "Consolas",
    align: "center",
  });
  s.addText("SRM Institute of Science & Technology", {
    x: 0.5, y: 3.82, w: 9, h: 0.22,
    fontSize: 10, color: C.muted, fontFace: "Consolas",
    align: "center",
  });

  // Bottom badge row
  const badges = ["Python 3.12", "React 19", "XGBoost", "Three.js", "Vite", "USGS Data"];
  const bw = 1.3, bx0 = (10 - badges.length * (bw + 0.1)) / 2;
  badges.forEach((b, i) => {
    s.addShape(pres.shapes.RECTANGLE, {
      x: bx0 + i * (bw + 0.1), y: 4.25, w: bw, h: 0.3,
      fill: { color: C.cyanSoft }, line: { color: C.cyan, width: 1 },
    });
    s.addText(b, {
      x: bx0 + i * (bw + 0.1), y: 4.25, w: bw, h: 0.3,
      fontSize: 8, color: C.cyan, fontFace: "Consolas",
      align: "center", valign: "middle",
    });
  });

  addCornerBrackets(s);
  addBottomBar(s, 1);
}

// ─────────────────────────────────────────────────────────────
// SLIDE 2 — TABLE OF CONTENTS
// ─────────────────────────────────────────────────────────────
{
  const s = pres.addSlide();
  bg(s); addGrid(s); addTopBar(s);
  addSlideTitle(s, "Mission Briefing", "AGENDA — SEISMOSENSE INTELLIGENCE PACKAGE");

  const items = [
    ["01", "Executive Abstract", "Platform Overview & Vision"],
    ["02", "Theoretical Framework", "Multi-Hazard Synthesis Matrix"],
    ["03", "XGBoost Intelligence Core", "ML Architecture & Training"],
    ["04", "Spatial Intelligence", "DBSCAN Clustering & Hotspot Analysis"],
    ["05", "Simulation Lab", "Three.js 3D Volumetric Rendering"],
    ["06", "Intelligence Desk", "Dual-Pane GIS Analytics"],
    ["07", "Performance Metrics", "Accuracy, F1-Score & Latency"],
    ["08", "Data Pipeline", "End-to-End Architecture"],
    ["09", "Safety Logic", "Hypocenter Gate & Depth Decay"],
    ["10", "Engineering Stack", "Full Technology Overview"],
    ["11", "Key Achievements", "Impact & Innovation Summary"],
    ["12", "Conclusion", "Vision: Digital Seismic Surveillance"],
  ];

  const col1 = items.slice(0, 6);
  const col2 = items.slice(6);

  col1.forEach(([num, title, sub], i) => {
    const y = 1.1 + i * 0.72;
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.4, y, w: 4.5, h: 0.58,
      fill: { color: C.card }, line: { color: C.gridLine, width: 1 },
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.4, y, w: 0.55, h: 0.58,
      fill: { color: C.cyanSoft }, line: { color: C.cyanSoft, width: 0 },
    });
    s.addText(num, {
      x: 0.4, y, w: 0.55, h: 0.58,
      fontSize: 14, bold: true, color: C.cyan, fontFace: "Consolas",
      align: "center", valign: "middle",
    });
    s.addText(title, {
      x: 1.05, y: y + 0.04, w: 3.75, h: 0.28,
      fontSize: 11, bold: true, color: C.white, fontFace: "Trebuchet MS", margin: 0,
    });
    s.addText(sub, {
      x: 1.05, y: y + 0.3, w: 3.75, h: 0.22,
      fontSize: 8.5, color: C.muted, fontFace: "Consolas", margin: 0,
    });
  });

  col2.forEach(([num, title, sub], i) => {
    const y = 1.1 + i * 0.72;
    s.addShape(pres.shapes.RECTANGLE, {
      x: 5.1, y, w: 4.5, h: 0.58,
      fill: { color: C.card }, line: { color: C.gridLine, width: 1 },
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: 5.1, y, w: 0.55, h: 0.58,
      fill: { color: C.cyanSoft }, line: { color: C.cyanSoft, width: 0 },
    });
    s.addText(num, {
      x: 5.1, y, w: 0.55, h: 0.58,
      fontSize: 14, bold: true, color: C.cyan, fontFace: "Consolas",
      align: "center", valign: "middle",
    });
    s.addText(title, {
      x: 5.75, y: y + 0.04, w: 3.75, h: 0.28,
      fontSize: 11, bold: true, color: C.white, fontFace: "Trebuchet MS", margin: 0,
    });
    s.addText(sub, {
      x: 5.75, y: y + 0.3, w: 3.75, h: 0.22,
      fontSize: 8.5, color: C.muted, fontFace: "Consolas", margin: 0,
    });
  });

  addCornerBrackets(s);
  addBottomBar(s, 2);
}

// ─────────────────────────────────────────────────────────────
// SLIDE 3 — EXECUTIVE ABSTRACT
// ─────────────────────────────────────────────────────────────
{
  const s = pres.addSlide();
  bg(s); addGrid(s); addTopBar(s);
  addSlideTitle(s, "Executive Abstract", "PLATFORM INTELLIGENCE OVERVIEW");

  // Big pull-quote
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.4, y: 1.05, w: 9.2, h: 1.1,
    fill: { color: C.cyanSoft }, line: { color: C.cyan, width: 1 },
  });
  s.addText([
    { text: "QuakeIntel", options: { bold: true, color: C.cyan } },
    { text: " is a high-fidelity intelligence platform engineered for ", options: { color: C.white } },
    { text: "synchronous planetary monitoring", options: { bold: true, color: C.gold } },
    { text: " and ", options: { color: C.white } },
    { text: "probabilistic hazard forecasting", options: { bold: true, color: C.gold } },
    { text: ", bridging raw lithospheric telemetry and actionable geospatial intelligence.", options: { color: C.white } },
  ], {
    x: 0.6, y: 1.1, w: 8.8, h: 0.95,
    fontSize: 14, fontFace: "Trebuchet MS", valign: "middle",
  });

  // Three pillars
  const pillars = [
    { title: "REAL-TIME SENSING", body: "Synchronous monitoring of planetary seismic activity across 72,508 USGS records spanning 2015–2024.", color: C.cyan },
    { title: "PROBABILISTIC FORECASTING", body: "XGBoost Ensemble Core synthesizes historical patterns into forward-looking risk grids with 98.17% accuracy.", color: C.gold },
    { title: "ACTIONABLE INTELLIGENCE", body: "Multi-hazard assessment covering Tectonic Shift, Tsunami Surge, and Infrastructure Vulnerability.", color: C.green },
  ];

  pillars.forEach((p, i) => {
    const x = 0.4 + i * 3.1;
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: 2.35, w: 2.9, h: 2.65,
      fill: { color: C.card }, line: { color: p.color, width: 1.5 },
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: 2.35, w: 2.9, h: 0.08,
      fill: { color: p.color }, line: { color: p.color, width: 0 },
    });
    s.addText(p.title, {
      x: x + 0.15, y: 2.5, w: 2.6, h: 0.38,
      fontSize: 10, bold: true, color: p.color, fontFace: "Consolas", charSpacing: 1,
    });
    s.addText(p.body, {
      x: x + 0.15, y: 2.95, w: 2.6, h: 1.9,
      fontSize: 10.5, color: C.white, fontFace: "Trebuchet MS",
    });
  });

  addCornerBrackets(s);
  addBottomBar(s, 3);
}

// ─────────────────────────────────────────────────────────────
// SLIDE 4 — THEORETICAL FRAMEWORK
// ─────────────────────────────────────────────────────────────
{
  const s = pres.addSlide();
  bg(s); addGrid(s); addTopBar(s);
  addSlideTitle(s, "Theoretical Framework", "MULTI-HAZARD SYNTHESIS MATRIX & PHYSICAL SAFETY CEILINGS");

  // Three hazard tiers
  const hazards = [
    { label: "TECTONIC SHIFT", icon: "⚡", desc: "Standard magnitude-probabilistic risk assessment. Evaluates fault slip potential, historical cluster density, and temporal quiescence windows.", color: C.red },
    { label: "TSUNAMI SURGE", icon: "🌊", desc: "Coastal threat assessment weighting seismic magnitude against shallow-water hypocenters (Depth < 50km). Scores ocean-bed rupture intensity.", color: C.cyan },
    { label: "INFRA VULNERABILITY", icon: "🏗", desc: "Infrastructure-focused scoring using regional historical intensity and urban density proxies to estimate structural loss potential.", color: C.gold },
  ];

  hazards.forEach((h, i) => {
    const x = 0.4 + i * 3.1;
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: 1.05, w: 2.9, h: 2.5,
      fill: { color: C.card }, line: { color: h.color, width: 1.5 },
    });
    s.addShape(pres.shapes.OVAL, {
      x: x + 1.1, y: 1.15, w: 0.7, h: 0.7,
      fill: { color: h.color, transparency: 20 }, line: { color: h.color, width: 0 },
    });
    s.addText(h.icon, {
      x: x + 1.05, y: 1.12, w: 0.8, h: 0.75,
      fontSize: 22, align: "center", valign: "middle",
    });
    s.addText(h.label, {
      x: x + 0.1, y: 2.0, w: 2.7, h: 0.32,
      fontSize: 10, bold: true, color: h.color, fontFace: "Consolas",
      align: "center", charSpacing: 1,
    });
    s.addText(h.desc, {
      x: x + 0.12, y: 2.36, w: 2.66, h: 1.15,
      fontSize: 9.5, color: C.white, fontFace: "Trebuchet MS",
    });
  });

  // Physical safety section
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.4, y: 3.7, w: 9.2, h: 1.45,
    fill: { color: C.card }, line: { color: C.purple, width: 1.5 },
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.4, y: 3.7, w: 9.2, h: 0.07,
    fill: { color: C.purple }, line: { color: C.purple, width: 0 },
  });
  s.addText("PHYSICAL SAFETY CEILINGS — Scientific Integrity Constraints", {
    x: 0.6, y: 3.82, w: 9.0, h: 0.28,
    fontSize: 11, bold: true, color: C.purple, fontFace: "Consolas",
  });
  s.addText([
    { text: "Exponential Depth Decay:  ", options: { bold: true, color: C.cyan } },
    { text: "E = e^(−depth ÷ 120)  ", options: { color: C.gold, bold: true } },
    { text: "  Hazard potential dissipates exponentially with increasing focal depth, ensuring deep-earth activity registers accurately as low surface threat.", options: { color: C.white } },
  ], {
    x: 0.6, y: 4.14, w: 8.8, h: 0.4,
    fontSize: 10.5, fontFace: "Trebuchet MS",
  });
  s.addText([
    { text: "Hypocenter Gate:  ", options: { bold: true, color: C.red } },
    { text: "Events originating at depths ≥ 300km are auto-classified  ", options: { color: C.white } },
    { text: "NOMINAL", options: { bold: true, color: C.green } },
    { text: " — regardless of raw magnitude.", options: { color: C.white } },
  ], {
    x: 0.6, y: 4.58, w: 8.8, h: 0.36,
    fontSize: 10.5, fontFace: "Trebuchet MS",
  });

  addCornerBrackets(s);
  addBottomBar(s, 4);
}

// ─────────────────────────────────────────────────────────────
// SLIDE 5 — XGBOOST INTELLIGENCE CORE
// ─────────────────────────────────────────────────────────────
{
  const s = pres.addSlide();
  bg(s); addGrid(s); addTopBar(s);
  addSlideTitle(s, "XGBoost Intelligence Core", "ML ARCHITECTURE — ENSEMBLE LEARNING ENGINE");

  // Left: architecture description
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.4, y: 1.05, w: 4.4, h: 4.1,
    fill: { color: C.card }, line: { color: C.cyanDim, width: 1 },
  });

  const specs = [
    ["Model Family", "XGBoost Classifier (Ensemble)"],
    ["Training Records", "72,508 USGS Seismic Events"],
    ["Date Range", "2015 – 2024"],
    ["Data Source", "USGS Earthquake Archive"],
    ["Target Variable", "Hazard Classification (3-tier)"],
    ["Validation Method", "Stratified K-Fold Cross-Val"],
    ["Key Features", "Magnitude, Depth, Lat/Lon"],
    ["Derived Features", "Temporal Quiescence, TSL Index"],
    ["Cluster Features", "DBSCAN Spatial Density"],
    ["Depth Encoding", "Exponential Decay Transform"],
  ];

  specs.forEach(([k, v], i) => {
    const y = 1.22 + i * 0.37;
    s.addShape(pres.shapes.LINE, {
      x: 0.5, y: y + 0.33, w: 4.2, h: 0,
      line: { color: C.gridLine, width: 0.5 },
    });
    s.addText(k, {
      x: 0.55, y: y, w: 1.7, h: 0.33,
      fontSize: 8.5, color: C.muted, fontFace: "Consolas", valign: "middle", margin: 0,
    });
    s.addText(v, {
      x: 2.3, y: y, w: 2.4, h: 0.33,
      fontSize: 8.5, color: C.white, fontFace: "Trebuchet MS", bold: true, valign: "middle", margin: 0,
    });
  });

  // Right: Feature engineering callouts
  s.addShape(pres.shapes.RECTANGLE, {
    x: 5.1, y: 1.05, w: 4.5, h: 1.85,
    fill: { color: C.card }, line: { color: C.gold, width: 1.5 },
  });
  s.addText("FEATURE ENGINEERING", {
    x: 5.25, y: 1.12, w: 4.2, h: 0.28,
    fontSize: 10, bold: true, color: C.gold, fontFace: "Consolas", charSpacing: 1,
  });

  const feats = [
    ["Temporal Quiescence", "Measures silence periods between seismic events in a spatial cell. Long silence = elevated stress accumulation."],
    ["Time-Since-Last (TSL)", "Encodes recency of last recorded event per region — a proxy for fault re-activation probability."],
  ];
  feats.forEach(([name, desc], i) => {
    s.addText(name, {
      x: 5.25, y: 1.45 + i * 0.72, w: 4.2, h: 0.24,
      fontSize: 10, bold: true, color: C.cyan, fontFace: "Trebuchet MS", margin: 0,
    });
    s.addText(desc, {
      x: 5.25, y: 1.7 + i * 0.72, w: 4.2, h: 0.36,
      fontSize: 9, color: C.white, fontFace: "Trebuchet MS", margin: 0,
    });
  });

  // Why XGBoost?
  s.addShape(pres.shapes.RECTANGLE, {
    x: 5.1, y: 3.08, w: 4.5, h: 2.05,
    fill: { color: C.card }, line: { color: C.green, width: 1.5 },
  });
  s.addText("WHY XGBOOST?", {
    x: 5.25, y: 3.16, w: 4.2, h: 0.28,
    fontSize: 10, bold: true, color: C.green, fontFace: "Consolas", charSpacing: 1,
  });
  const whys = [
    "Handles non-linear interactions between magnitude, depth, and location natively",
    "Robust to class imbalance — critical in rare high-magnitude event detection",
    "Native support for feature importance ranking — interpretability for scientists",
    "Superior AUC performance (0.98+) vs. SVM, Random Forest on seismic data",
  ];
  whys.forEach((w, i) => {
    s.addText([
      { text: "▶  ", options: { color: C.green, bold: true } },
      { text: w, options: { color: C.white } },
    ], {
      x: 5.25, y: 3.5 + i * 0.38, w: 4.2, h: 0.36,
      fontSize: 9.5, fontFace: "Trebuchet MS",
    });
  });

  addCornerBrackets(s);
  addBottomBar(s, 5);
}

// ─────────────────────────────────────────────────────────────
// SLIDE 6 — SPATIAL INTELLIGENCE / DBSCAN
// ─────────────────────────────────────────────────────────────
{
  const s = pres.addSlide();
  bg(s); addGrid(s); addTopBar(s);
  addSlideTitle(s, "Spatial Intelligence", "DBSCAN CLUSTERING — SEISMIC HOTSPOT ANALYSIS");

  // Simulated seismic cluster visualization (dots on a dark map-like area)
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.4, y: 1.08, w: 5.5, h: 3.9,
    fill: { color: "060D18" }, line: { color: C.cyanDim, width: 1 },
  });
  s.addText("[ GLOBAL SEISMIC DENSITY MAP — DBSCAN OUTPUT ]", {
    x: 0.5, y: 1.14, w: 5.3, h: 0.22,
    fontSize: 7, color: C.muted, fontFace: "Consolas", align: "center",
  });

  // Simulate plate boundary line (Pacific Ring of Fire)
  const ringPoints = [
    [0.6,2.0],[0.8,1.7],[1.0,1.5],[1.4,1.4],[2.0,1.5],[2.5,1.8],[2.8,2.1],
    [3.0,2.5],[2.9,3.0],[2.7,3.5],[2.5,3.8],[2.2,4.2],[1.9,4.5],[1.6,4.7],[1.3,4.8]
  ];

  // Draw seismic activity dots
  const clusters = [
    // High risk cluster - ring of fire
    { pts: [[1.2,2.1],[1.4,2.0],[1.5,2.3],[1.3,2.4],[1.6,1.9],[1.1,1.8],[1.7,2.2]], color: C.red, sz: 0.09 },
    { pts: [[2.3,2.0],[2.5,1.9],[2.4,2.2],[2.6,2.1],[2.2,2.1]], color: C.red, sz: 0.08 },
    { pts: [[2.8,2.7],[3.0,2.8],[2.9,3.0],[3.1,2.9],[2.7,2.9]], color: C.red, sz: 0.08 },
    // Medium risk
    { pts: [[0.8,3.2],[1.0,3.1],[0.9,3.4],[1.1,3.3]], color: C.gold, sz: 0.07 },
    { pts: [[3.5,1.7],[3.7,1.8],[3.6,2.0],[3.8,1.9]], color: C.gold, sz: 0.07 },
    { pts: [[4.5,3.5],[4.7,3.4],[4.6,3.6],[4.8,3.5]], color: C.gold, sz: 0.07 },
    // Low risk scattered
    { pts: [[1.8,3.5],[4.0,2.5],[3.2,4.2],[4.2,1.5],[0.7,2.5],[2.0,4.6],[4.8,2.2]], color: C.green, sz: 0.055 },
    { pts: [[5.0,1.3],[5.2,3.8],[3.8,3.2],[1.5,4.0],[4.2,4.0]], color: C.cyanDim, sz: 0.045 },
  ];

  clusters.forEach(({ pts, color, sz }) => {
    pts.forEach(([dx, dy]) => {
      s.addShape(pres.shapes.OVAL, {
        x: 0.4 + dx - sz/2, y: 1.08 + dy - sz/2, w: sz, h: sz,
        fill: { color }, line: { color, width: 0 },
      });
    });
  });

  // Legend
  [
    [C.red,  "HIGH RISK  — Core Cluster"],
    [C.gold, "MEDIUM RISK — Sub-cluster"],
    [C.green,"LOW RISK    — Outlier Events"],
  ].forEach(([color, label], i) => {
    s.addShape(pres.shapes.OVAL, {
      x: 0.6, y: 4.35 + i * 0.18, w: 0.1, h: 0.1,
      fill: { color }, line: { color, width: 0 },
    });
    s.addText(label, {
      x: 0.78, y: 4.31 + i * 0.18, w: 3.5, h: 0.18,
      fontSize: 7.5, color: C.muted, fontFace: "Consolas", valign: "middle", margin: 0,
    });
  });

  // Right side: DBSCAN explanation
  s.addShape(pres.shapes.RECTANGLE, {
    x: 6.1, y: 1.08, w: 3.5, h: 3.9,
    fill: { color: C.card }, line: { color: C.cyan, width: 1 },
  });
  s.addText("DBSCAN ENGINE", {
    x: 6.25, y: 1.18, w: 3.2, h: 0.28,
    fontSize: 11, bold: true, color: C.cyan, fontFace: "Consolas", charSpacing: 1,
  });
  s.addText("Density-Based Spatial Clustering of Applications with Noise", {
    x: 6.25, y: 1.5, w: 3.2, h: 0.35,
    fontSize: 9, color: C.muted, fontFace: "Trebuchet MS", italic: true,
  });

  const points = [
    ["Algorithm", "DBSCAN (sklearn)"],
    ["Input Space", "Lat × Lon Grid"],
    ["Cluster Output", "Hotspot Density Index"],
    ["Noise Events", "Classified as Outliers"],
    ["Use in Model", "Feature: cluster_density"],
    ["Plate Coverage", "All Major Tectonic Plates"],
    ["Update Freq.", "Per Analysis Run"],
  ];
  points.forEach(([k, v], i) => {
    s.addText(k + ":", {
      x: 6.25, y: 1.94 + i * 0.38, w: 1.5, h: 0.32,
      fontSize: 8.5, color: C.muted, fontFace: "Consolas", valign: "middle", margin: 0,
    });
    s.addText(v, {
      x: 7.75, y: 1.94 + i * 0.38, w: 1.7, h: 0.32,
      fontSize: 8.5, color: C.white, fontFace: "Trebuchet MS", bold: true, valign: "middle", margin: 0,
    });
    s.addShape(pres.shapes.LINE, {
      x: 6.25, y: 2.26 + i * 0.38, w: 3.2, h: 0,
      line: { color: C.gridLine, width: 0.5 },
    });
  });

  addCornerBrackets(s);
  addBottomBar(s, 6);
}

// ─────────────────────────────────────────────────────────────
// SLIDE 7 — SIMULATION LAB (Three.js)
// ─────────────────────────────────────────────────────────────
{
  const s = pres.addSlide();
  bg(s); addGrid(s); addTopBar(s);
  addSlideTitle(s, "Simulation Lab", "THREE.JS VOLUMETRIC 3D SEISMIC RECONSTRUCTION");

  // Large panel with simulated globe visualization
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.4, y: 1.05, w: 5.1, h: 4.05,
    fill: { color: "040A14" }, line: { color: C.cyanDim, width: 1 },
  });
  s.addText("[ THREE.JS VOLUMETRIC RENDER — LIVE SIMULATION ]", {
    x: 0.55, y: 1.12, w: 4.8, h: 0.2,
    fontSize: 7, color: C.muted, fontFace: "Consolas", align: "center",
  });

  // Draw simplified globe
  s.addShape(pres.shapes.OVAL, {
    x: 1.0, y: 1.55, w: 3.5, h: 3.5,
    fill: { color: "0D3B6E" }, line: { color: C.cyanDim, width: 1 },
  });
  // Globe meridians
  for (let i = 0; i < 4; i++) {
    s.addShape(pres.shapes.OVAL, {
      x: 1.0 + i * 0.7, y: 1.55, w: 3.5 - i * 1.4, h: 3.5,
      fill: { color: "0D3B6E", transparency: 100 },
      line: { color: C.gridLine, width: 0.5 },
    });
  }
  // Latitude lines
  for (let i = 1; i < 5; i++) {
    const r = i * 0.55;
    s.addShape(pres.shapes.OVAL, {
      x: 1.0, y: 1.55 + r, w: 3.5, h: 3.5 - r * 2,
      fill: { color: "0D3B6E", transparency: 100 },
      line: { color: C.gridLine, width: 0.3 },
    });
  }

  // Seismic nodes on globe (dots at various depths shown by color)
  const nodes = [
    { x: 1.9, y: 2.1, c: C.red, s: 0.14 },
    { x: 2.5, y: 1.9, c: C.red, s: 0.12 },
    { x: 3.2, y: 2.3, c: C.gold, s: 0.1 },
    { x: 1.6, y: 3.1, c: C.gold, s: 0.09 },
    { x: 3.8, y: 3.5, c: C.cyan, s: 0.08 },
    { x: 2.1, y: 4.0, c: C.green, s: 0.07 },
    { x: 3.5, y: 2.8, c: C.red, s: 0.11 },
    { x: 2.8, y: 4.5, c: C.cyan, s: 0.06 },
    { x: 1.4, y: 4.2, c: C.gold, s: 0.08 },
    { x: 4.0, y: 2.0, c: C.green, s: 0.065 },
    { x: 2.3, y: 3.5, c: C.purple, s: 0.07 },
    { x: 3.0, y: 3.0, c: C.red, s: 0.13 },
  ];
  nodes.forEach(({ x, y, c, s: sz }) => {
    s.addShape(pres.shapes.OVAL, {
      x: x - sz/2, y: y - sz/2, w: sz, h: sz,
      fill: { color: c }, line: { color: c, width: 0 },
    });
  });

  // Depth legend
  s.addText("Node Color = Depth Tier", {
    x: 0.55, y: 4.82, w: 2.5, h: 0.18,
    fontSize: 7.5, color: C.muted, fontFace: "Consolas",
  });
  [[C.red, "< 70km (Shallow)"], [C.gold, "70–300km"], [C.green, "> 300km (Deep)"]].forEach(([c, l], i) => {
    s.addShape(pres.shapes.OVAL, { x: 0.55 + i * 1.6, y: 5.01, w: 0.1, h: 0.1, fill: { color: c }, line: { color: c, width: 0 } });
    s.addText(l, { x: 0.73 + i * 1.6, y: 4.97, w: 1.4, h: 0.18, fontSize: 7, color: C.muted, fontFace: "Consolas", margin: 0 });
  });

  // Right: features list
  s.addShape(pres.shapes.RECTANGLE, {
    x: 5.7, y: 1.05, w: 3.9, h: 4.05,
    fill: { color: C.card }, line: { color: C.purple, width: 1 },
  });
  s.addText("3D ENGINE CAPABILITIES", {
    x: 5.85, y: 1.15, w: 3.6, h: 0.28,
    fontSize: 10.5, bold: true, color: C.purple, fontFace: "Consolas", charSpacing: 1,
  });

  const caps = [
    { title: "Realistic Globe", desc: "High-res satellite imagery with topology bump mapping and emissive night-light maps for photorealistic planetary surface." },
    { title: "Volumetric Mapping", desc: "Seismic hypocenter nodes mapped in true 3D space using actual Z-axis mantle coordinates — depth becomes visual depth." },
    { title: "Synchronous Rotation", desc: "Data points geo-pinned to exact coordinates, rotating in 1:1 sync with the planetary surface in real time." },
    { title: "WebGL Rendering", desc: "Hardware-accelerated Three.js canvas delivers sub-frame rendering of thousands of concurrent seismic nodes." },
    { title: "Depth Color Grading", desc: "Color-coded depth tiers allow instant visual triage of shallow vs. deep events on the rotating globe." },
  ];

  caps.forEach((cap, i) => {
    s.addShape(pres.shapes.RECTANGLE, {
      x: 5.82, y: 1.55 + i * 0.7, w: 0.06, h: 0.5,
      fill: { color: C.purple }, line: { color: C.purple, width: 0 },
    });
    s.addText(cap.title, {
      x: 6.0, y: 1.55 + i * 0.7, w: 3.45, h: 0.24,
      fontSize: 10, bold: true, color: C.white, fontFace: "Trebuchet MS", margin: 0,
    });
    s.addText(cap.desc, {
      x: 6.0, y: 1.79 + i * 0.7, w: 3.45, h: 0.28,
      fontSize: 8.5, color: C.muted, fontFace: "Trebuchet MS", margin: 0,
    });
  });

  addCornerBrackets(s);
  addBottomBar(s, 7);
}

// ─────────────────────────────────────────────────────────────
// SLIDE 8 — INTELLIGENCE DESK
// ─────────────────────────────────────────────────────────────
{
  const s = pres.addSlide();
  bg(s); addGrid(s); addTopBar(s);
  addSlideTitle(s, "Intelligence Desk", "DUAL-PANE GIS ANALYTICS & RISK TIER SCORING");

  // Left panel: location targeting
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.4, y: 1.05, w: 4.4, h: 4.05,
    fill: { color: "060C18" }, line: { color: C.cyanDim, width: 1 },
  });
  s.addText("PANE A — GIS LOCATION TARGETER", {
    x: 0.55, y: 1.12, w: 4.1, h: 0.22,
    fontSize: 7, color: C.cyan, fontFace: "Consolas", align: "center", charSpacing: 1,
  });

  // Simulated map grid
  for (let r = 0; r < 7; r++) {
    s.addShape(pres.shapes.LINE, {
      x: 0.4, y: 1.42 + r * 0.5, w: 4.4, h: 0,
      line: { color: "122040", width: 0.5 },
    });
  }
  for (let c = 0; c < 9; c++) {
    s.addShape(pres.shapes.LINE, {
      x: 0.4 + c * 0.5, y: 1.42, w: 0, h: 3.5,
      line: { color: "122040", width: 0.5 },
    });
  }

  // Target crosshair
  const tx = 2.5, ty = 2.9;
  s.addShape(pres.shapes.LINE, { x: tx - 0.3, y: ty, w: 0.6, h: 0, line: { color: C.cyan, width: 1.5 } });
  s.addShape(pres.shapes.LINE, { x: tx, y: ty - 0.3, w: 0, h: 0.6, line: { color: C.cyan, width: 1.5 } });
  s.addShape(pres.shapes.OVAL, {
    x: tx - 0.15, y: ty - 0.15, w: 0.3, h: 0.3,
    fill: { color: C.bg, transparency: 0 }, line: { color: C.cyan, width: 1.5 },
  });

  // Coordinate readout
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.6, y: 4.6, w: 4.0, h: 0.38,
    fill: { color: "001122" }, line: { color: C.cyan, width: 1 },
  });
  s.addText("LAT: 35.6762° N   |   LON: 139.6503° E   |   TOKYO, JP", {
    x: 0.7, y: 4.65, w: 3.8, h: 0.28,
    fontSize: 8, color: C.cyan, fontFace: "Consolas", align: "center", valign: "middle",
  });

  // Right panel: risk scores
  s.addShape(pres.shapes.RECTANGLE, {
    x: 5.05, y: 1.05, w: 4.55, h: 4.05,
    fill: { color: C.card }, line: { color: C.gold, width: 1 },
  });
  s.addText("PANE B — CONFIDENTIAL HAZARD REPORT", {
    x: 5.2, y: 1.12, w: 4.25, h: 0.22,
    fontSize: 7, color: C.gold, fontFace: "Consolas", align: "center", charSpacing: 1,
  });

  const tiers = [
    { label: "TECTONIC SHIFT", score: "HIGH RISK", pct: 87, color: C.red },
    { label: "TSUNAMI SURGE", score: "ELEVATED", pct: 72, color: C.gold },
    { label: "INFRA VULNERABILITY", score: "CRITICAL", pct: 91, color: C.purple },
  ];

  tiers.forEach((t, i) => {
    const y = 1.5 + i * 1.18;
    s.addShape(pres.shapes.RECTANGLE, {
      x: 5.2, y, w: 4.25, h: 0.96,
      fill: { color: C.panel }, line: { color: t.color, width: 1 },
    });
    s.addText(t.label, {
      x: 5.35, y: y + 0.08, w: 2.5, h: 0.24,
      fontSize: 9.5, bold: true, color: t.color, fontFace: "Consolas", margin: 0,
    });
    s.addText(t.score, {
      x: 7.85, y: y + 0.08, w: 1.45, h: 0.24,
      fontSize: 9, bold: true, color: t.color, fontFace: "Consolas", align: "right", margin: 0,
    });
    // Score bar background
    s.addShape(pres.shapes.RECTANGLE, {
      x: 5.35, y: y + 0.42, w: 3.95, h: 0.2,
      fill: { color: C.bg }, line: { color: C.gridLine, width: 0.5 },
    });
    // Score bar fill
    s.addShape(pres.shapes.RECTANGLE, {
      x: 5.35, y: y + 0.42, w: 3.95 * (t.pct / 100), h: 0.2,
      fill: { color: t.color }, line: { color: t.color, width: 0 },
    });
    s.addText(`${t.pct}%`, {
      x: 5.35, y: y + 0.66, w: 3.95, h: 0.22,
      fontSize: 8, color: t.color, fontFace: "Consolas", align: "right", margin: 0,
    });
  });

  // Leaflet badge
  s.addShape(pres.shapes.RECTANGLE, {
    x: 5.2, y: 4.72, w: 4.25, h: 0.28,
    fill: { color: "001A0A" }, line: { color: C.green, width: 1 },
  });
  s.addText("⚙  Powered by Leaflet.js — Interactive GIS Workstation", {
    x: 5.3, y: 4.74, w: 4.05, h: 0.22,
    fontSize: 8, color: C.green, fontFace: "Consolas", align: "center", valign: "middle",
  });

  addCornerBrackets(s);
  addBottomBar(s, 8);
}

// ─────────────────────────────────────────────────────────────
// SLIDE 9 — PERFORMANCE METRICS
// ─────────────────────────────────────────────────────────────
{
  const s = pres.addSlide();
  bg(s); addGrid(s); addTopBar(s);
  addSlideTitle(s, "Performance Metrics", "SYSTEM INTELLIGENCE BENCHMARKS — v4.3.5");

  // Big stat callouts
  const stats = [
    { val: "98.17%", label: "ULTIMATE ACCURACY", sub: "XGBoost Test Set", color: C.cyan },
    { val: "0.9726", label: "F1-SCORE", sub: "Stabilized & Optimized", color: C.green },
    { val: "<120ms", label: "SENSING LATENCY", sub: "End-to-End Response", color: C.gold },
    { val: "72,508", label: "TRAINING RECORDS", sub: "USGS Archive (2015–24)", color: C.purple },
  ];

  stats.forEach((stat, i) => {
    const x = 0.4 + i * 2.32;
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: 1.05, w: 2.1, h: 1.85,
      fill: { color: C.card }, line: { color: stat.color, width: 1.5 },
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: 1.05, w: 2.1, h: 0.08,
      fill: { color: stat.color }, line: { color: stat.color, width: 0 },
    });
    s.addText(stat.val, {
      x: x + 0.05, y: 1.2, w: 2.0, h: 0.75,
      fontSize: 28, bold: true, color: stat.color, fontFace: "Arial Black",
      align: "center", valign: "middle", shrinkText: true,
    });
    s.addText(stat.label, {
      x: x + 0.1, y: 1.97, w: 1.9, h: 0.28,
      fontSize: 8.5, bold: true, color: C.white, fontFace: "Consolas",
      align: "center", charSpacing: 1, margin: 0,
    });
    s.addText(stat.sub, {
      x: x + 0.1, y: 2.26, w: 1.9, h: 0.22,
      fontSize: 8, color: C.muted, fontFace: "Consolas",
      align: "center", margin: 0,
    });
  });

  // Metrics table
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.4, y: 3.08, w: 9.2, h: 1.98,
    fill: { color: C.card }, line: { color: C.gridLine, width: 1 },
  });

  const tblHeaders = [["Metric", "Value", "Benchmark", "Status"]];
  const tblRows = [
    ["Ultimate Accuracy", "98.17%", "> 95% (Target)", "✓ EXCEEDED"],
    ["F1-Score", "0.9726", "> 0.95 (Target)", "✓ EXCEEDED"],
    ["AUC-ROC Score", "0.9819", "> 0.90 (Target)", "✓ EXCEEDED"],
    ["Sensing Latency", "< 120ms", "< 200ms (SLA)", "✓ WITHIN SLA"],
    ["Training Dataset", "72,508 records", "USGS 2015–2024", "✓ VERIFIED"],
  ];

  const allRows = [
    tblHeaders[0].map(t => ({ text: t, options: { bold: true, color: C.bg, fill: { color: C.cyanDim } } })),
    ...tblRows.map(row => row.map((cell, ci) => ({
      text: cell,
      options: {
        color: ci === 3 ? C.green : C.white,
        bold: ci === 3,
        fill: { color: C.card },
      },
    }))),
  ];

  s.addTable(allRows, {
    x: 0.5, y: 3.15, w: 9.0, h: 1.85,
    border: { pt: 0.5, color: C.gridLine },
    fontSize: 10, fontFace: "Trebuchet MS",
    colW: [2.5, 1.5, 2.5, 2.5],
  });

  addCornerBrackets(s);
  addBottomBar(s, 9);
}

// ─────────────────────────────────────────────────────────────
// SLIDE 10 — DATA PIPELINE
// ─────────────────────────────────────────────────────────────
{
  const s = pres.addSlide();
  bg(s); addGrid(s); addTopBar(s);
  addSlideTitle(s, "Data Pipeline Architecture", "END-TO-END INTELLIGENCE FLOW — RAW DATA TO HAZARD SYNTHESIS");

  const stages = [
    { label: "RAW SEISMIC\nREGISTRY", sub: "72,508 USGS Events\n2015–2024", color: C.cyanDim, icon: "📡" },
    { label: "DBSCAN\nCLUSTERING", sub: "Spatial hotspot\ndensity extraction", color: C.purple, icon: "🗺" },
    { label: "TEMPORAL\nANALYSIS", sub: "Quiescence windows\nTSL indexing", color: C.gold, icon: "⏱" },
    { label: "XGBOOST\nCORE", sub: "Ensemble learning\nclassification", color: C.cyan, icon: "🧠" },
    { label: "MULTI-HAZARD\nSYNTHESIS", sub: "3-tier risk report\ngeneration", color: C.green, icon: "📊" },
  ];

  const bw = 1.55, bh = 1.6;
  stages.forEach((st, i) => {
    const x = 0.45 + i * (bw + 0.52);
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: 1.3, w: bw, h: bh,
      fill: { color: C.card }, line: { color: st.color, width: 1.5 },
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: 1.3, w: bw, h: 0.08,
      fill: { color: st.color }, line: { color: st.color, width: 0 },
    });
    s.addText(st.icon, {
      x: x + 0.1, y: 1.42, w: bw - 0.2, h: 0.55,
      fontSize: 26, align: "center", valign: "middle",
    });
    s.addText(st.label, {
      x: x + 0.05, y: 2.0, w: bw - 0.1, h: 0.52,
      fontSize: 9, bold: true, color: st.color, fontFace: "Consolas",
      align: "center", charSpacing: 1,
    });
    s.addText(st.sub, {
      x: x + 0.05, y: 2.55, w: bw - 0.1, h: 0.32,
      fontSize: 8, color: C.muted, fontFace: "Trebuchet MS", align: "center",
    });
    // Arrow between stages
    if (i < stages.length - 1) {
      s.addShape(pres.shapes.LINE, {
        x: x + bw + 0.04, y: 1.3 + bh / 2, w: 0.44, h: 0,
        line: { color: C.cyan, width: 2 },
      });
      // Arrowhead
      s.addText("▶", {
        x: x + bw + 0.34, y: 1.3 + bh / 2 - 0.13, w: 0.2, h: 0.26,
        fontSize: 11, color: C.cyan, align: "center",
      });
    }
  });

  // Output branches
  s.addShape(pres.shapes.LINE, {
    x: 9.0, y: 2.1, w: 0, h: 2.35,
    line: { color: C.gridLine, width: 1.5 },
  });

  const outputs = [
    { label: "TECTONIC SHIFT REPORT", color: C.red },
    { label: "TSUNAMI SURGE REPORT", color: C.cyan },
    { label: "INFRA VULNERABILITY REPORT", color: C.gold },
  ];

  outputs.forEach((o, i) => {
    s.addShape(pres.shapes.LINE, {
      x: 9.0, y: 2.1 + i * 1.17, w: 0.3, h: 0,
      line: { color: o.color, width: 1.5 },
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: 9.3, y: 1.95 + i * 1.17, w: 0.6, h: 0.3,
      fill: { color: o.color, transparency: 30 }, line: { color: o.color, width: 1 },
    });
    s.addText(o.label, {
      x: 9.3, y: 1.97 + i * 1.17, w: 0.65, h: 0.26,
      fontSize: 5.5, color: o.color, fontFace: "Consolas", align: "center", valign: "middle",
    });
  });

  // Detail section below
  const details = [
    { title: "Feature Engineering Pipeline", body: "Raw magnitude, depth, lat/lon fed through temporal quiescence analysis. TSL indexing added as time-series feature. DBSCAN cluster density computed as spatial feature vector." },
    { title: "Model Inference Flow", body: "Trained XGBoost model scores each coordinate request in < 120ms. Probability scores mapped to categorical risk tiers via configurable threshold gates." },
    { title: "Flask API Gateway", body: "Python Flask server on Port 5000 orchestrates all ML inference calls, exposes RESTful endpoints consumed by the React 19 frontend dashboard." },
  ];

  details.forEach((d, i) => {
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.4 + i * 3.13, y: 3.2, w: 2.95, h: 1.85,
      fill: { color: C.card }, line: { color: C.gridLine, width: 1 },
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.4 + i * 3.13, y: 3.2, w: 0.06, h: 1.85,
      fill: { color: C.cyan }, line: { color: C.cyan, width: 0 },
    });
    s.addText(d.title, {
      x: 0.6 + i * 3.13, y: 3.28, w: 2.65, h: 0.28,
      fontSize: 10, bold: true, color: C.white, fontFace: "Trebuchet MS", margin: 0,
    });
    s.addText(d.body, {
      x: 0.6 + i * 3.13, y: 3.6, w: 2.65, h: 1.35,
      fontSize: 9, color: C.muted, fontFace: "Trebuchet MS",
    });
  });

  addCornerBrackets(s);
  addBottomBar(s, 10);
}

// ─────────────────────────────────────────────────────────────
// SLIDE 11 — SAFETY LOGIC
// ─────────────────────────────────────────────────────────────
{
  const s = pres.addSlide();
  bg(s); addGrid(s); addTopBar(s);
  addSlideTitle(s, "Safety Logic & Scientific Integrity", "HYPOCENTER GATE + EXPONENTIAL DEPTH DECAY");

  // Left: Hypocenter Gate flowchart
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.4, y: 1.05, w: 4.3, h: 4.05,
    fill: { color: C.card }, line: { color: C.red, width: 1.5 },
  });
  s.addText("HYPOCENTER GATE LOGIC", {
    x: 0.55, y: 1.15, w: 4.0, h: 0.28,
    fontSize: 11, bold: true, color: C.red, fontFace: "Consolas", charSpacing: 1,
  });

  // Flow boxes
  const flowItems = [
    { text: "SEISMIC EVENT RECEIVED", color: C.cyanDim, y: 1.55, w: 3.6 },
    { text: "MAGNITUDE EXTRACTION", color: C.cyanDim, y: 2.1, w: 3.6 },
    { text: "DEPTH ≥ 300km ?", color: C.gold, y: 2.65, w: 3.6 },
    { text: "→ YES: AUTO-CLASSIFY NOMINAL", color: C.green, y: 3.2, w: 3.6 },
    { text: "→ NO: EXPONENTIAL DECAY CALC", color: C.red, y: 3.7, w: 3.6 },
    { text: "MULTI-HAZARD SCORING", color: C.cyan, y: 4.22, w: 3.6 },
  ];

  flowItems.forEach((fl, i) => {
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.55, y: fl.y, w: fl.w, h: 0.35,
      fill: { color: C.panel }, line: { color: fl.color, width: 1 },
    });
    s.addText(fl.text, {
      x: 0.65, y: fl.y + 0.05, w: fl.w - 0.2, h: 0.25,
      fontSize: 9.5, color: fl.color, fontFace: "Consolas",
      align: "center", valign: "middle", margin: 0,
    });
    if (i < flowItems.length - 1 && i !== 2) {
      s.addShape(pres.shapes.LINE, {
        x: 2.35, y: fl.y + 0.35, w: 0, h: 0.15,
        line: { color: C.muted, width: 1 },
      });
    }
  });

  // Right: Depth decay explanation
  s.addShape(pres.shapes.RECTANGLE, {
    x: 4.9, y: 1.05, w: 4.7, h: 4.05,
    fill: { color: C.card }, line: { color: C.purple, width: 1.5 },
  });
  s.addText("EXPONENTIAL DEPTH DECAY", {
    x: 5.05, y: 1.15, w: 4.4, h: 0.28,
    fontSize: 11, bold: true, color: C.purple, fontFace: "Consolas", charSpacing: 1,
  });

  // Formula
  s.addShape(pres.shapes.RECTANGLE, {
    x: 5.05, y: 1.55, w: 4.4, h: 0.7,
    fill: { color: "1A0A30" }, line: { color: C.purple, width: 1 },
  });
  s.addText("E  =  e^( −depth ÷ 120 )", {
    x: 5.15, y: 1.6, w: 4.2, h: 0.58,
    fontSize: 20, bold: true, color: C.gold, fontFace: "Consolas",
    align: "center", valign: "middle",
  });

  // Depth-to-hazard table
  const depthRows = [
    ["10 km",  "0.920", "EXTREME"],
    ["50 km",  "0.659", "HIGH"],
    ["100 km", "0.435", "MODERATE"],
    ["200 km", "0.189", "LOW"],
    ["300 km", "0.082", "MINIMAL → NOMINAL"],
    ["500 km", "0.015", "NOMINAL (GATE)"],
  ];

  s.addText("Depth → Hazard Potential Lookup", {
    x: 5.05, y: 2.38, w: 4.4, h: 0.24,
    fontSize: 9, bold: true, color: C.muted, fontFace: "Consolas",
  });

  const hdrRow = [
    { text: "Depth", options: { bold: true, color: C.bg, fill: { color: C.cyanDim } } },
    { text: "E Value", options: { bold: true, color: C.bg, fill: { color: C.cyanDim } } },
    { text: "Classification", options: { bold: true, color: C.bg, fill: { color: C.cyanDim } } },
  ];
  const dataRows = depthRows.map(([d, e, cl]) => [
    { text: d, options: { color: C.white, fill: { color: C.card } } },
    { text: e, options: { color: C.gold, bold: true, fill: { color: C.card } } },
    { text: cl, options: { color: cl.includes("NOMINAL") ? C.green : cl === "EXTREME" ? C.red : cl === "HIGH" ? C.gold : C.white, fill: { color: C.card }, bold: cl.includes("NOMINAL") } },
  ]);

  s.addTable([hdrRow, ...dataRows], {
    x: 5.05, y: 2.65, w: 4.4, h: 2.3,
    border: { pt: 0.5, color: C.gridLine },
    fontSize: 9.5, fontFace: "Trebuchet MS",
    colW: [1.2, 1.2, 2.0],
  });

  addCornerBrackets(s);
  addBottomBar(s, 11);
}

// ─────────────────────────────────────────────────────────────
// SLIDE 12 — TECH STACK
// ─────────────────────────────────────────────────────────────
{
  const s = pres.addSlide();
  bg(s); addGrid(s); addTopBar(s);
  addSlideTitle(s, "Engineering Stack", "FULL TECHNOLOGY ARCHITECTURE OVERVIEW");

  const techs = [
    {
      cat: "BACKEND INTELLIGENCE",
      color: C.gold,
      items: [
        { name: "Python 3.12+", desc: "Core runtime powering all ML inference, data processing, and API gateway logic." },
        { name: "Flask", desc: "Lightweight REST API gateway on Port 5000 serving model predictions to the frontend." },
        { name: "XGBoost", desc: "Gradient boosted ensemble model — primary intelligence classifier." },
        { name: "Scikit-learn", desc: "DBSCAN clustering, feature engineering pipeline, and model evaluation utilities." },
        { name: "Pandas / NumPy", desc: "72,508-record USGS data ingestion, cleaning, and feature matrix construction." },
      ],
    },
    {
      cat: "FRONTEND WORKSTATION",
      color: C.cyan,
      items: [
        { name: "React 19", desc: "Component-driven intelligence dashboard with state-managed multi-workstation routing." },
        { name: "Three.js (WebGL)", desc: "Hardware-accelerated 3D volumetric globe rendering engine for seismic visualization." },
        { name: "Leaflet.js", desc: "Interactive GIS mapping for the Intelligence Desk location targeting workstation." },
        { name: "Vite", desc: "Sub-100ms HMR development server and production bundler for the React frontend." },
        { name: "CSS Design System", desc: "Custom dark-theme intelligence dashboard aesthetic with neon cyan accents." },
      ],
    },
    {
      cat: "DATA & RESEARCH",
      color: C.green,
      items: [
        { name: "USGS Archive", desc: "72,508 real seismic events (2015–2024) — magnitude, depth, coordinates, time." },
        { name: "Jupyter Research", desc: "Engineering notebooks documenting XGBoost training experiments and validation runs." },
        { name: "DBSCAN Clusters", desc: "Pre-computed spatial cluster density maps for all global tectonic plate regions." },
        { name: "CSV Registries", desc: "Processed data files stored in /data/ — fully reproducible pipeline." },
      ],
    },
  ];

  techs.forEach((tech, col) => {
    const x = 0.4 + col * 3.1;
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: 1.05, w: 2.9, h: 4.05,
      fill: { color: C.card }, line: { color: tech.color, width: 1.5 },
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: 1.05, w: 2.9, h: 0.35,
      fill: { color: tech.color }, line: { color: tech.color, width: 0 },
    });
    s.addText(tech.cat, {
      x: x + 0.1, y: 1.08, w: 2.7, h: 0.3,
      fontSize: 9, bold: true, color: C.bg, fontFace: "Consolas",
      align: "center", valign: "middle", charSpacing: 1,
    });

    tech.items.forEach((item, i) => {
      const iy = 1.52 + i * 0.72;
      s.addShape(pres.shapes.RECTANGLE, {
        x: x + 0.12, y: iy, w: 0.05, h: 0.55,
        fill: { color: tech.color }, line: { color: tech.color, width: 0 },
      });
      s.addText(item.name, {
        x: x + 0.25, y: iy, w: 2.55, h: 0.25,
        fontSize: 10, bold: true, color: C.white, fontFace: "Trebuchet MS", margin: 0,
      });
      s.addText(item.desc, {
        x: x + 0.25, y: iy + 0.26, w: 2.55, h: 0.28,
        fontSize: 8.5, color: C.muted, fontFace: "Trebuchet MS", margin: 0,
      });
    });
  });

  addCornerBrackets(s);
  addBottomBar(s, 12);
}

// ─────────────────────────────────────────────────────────────
// SLIDE 13 — KEY ACHIEVEMENTS
// ─────────────────────────────────────────────────────────────
{
  const s = pres.addSlide();
  bg(s); addGrid(s); addTopBar(s);
  addSlideTitle(s, "Key Achievements & Innovation", "WHAT MAKES QUAKEINTEL DIFFERENT");

  const achievements = [
    {
      num: "01",
      title: "Multi-Hazard Intelligence",
      body: "First-of-kind unified platform combining Tectonic Shift, Tsunami Surge, and Infrastructure Vulnerability into a single inference pipeline — not three separate tools.",
      color: C.cyan,
    },
    {
      num: "02",
      title: "98.17% Accuracy on Real Data",
      body: "Trained on actual USGS seismic archives — not synthetic data. Validated on held-out test sets with stratified K-Fold cross-validation ensuring no data leakage.",
      color: C.green,
    },
    {
      num: "03",
      title: "True 3D Volumetric Visualization",
      body: "Unlike 2D map overlays, QuakeIntel renders hypocenter nodes in genuine Z-axis space, mapping mantle depth to visual depth in a live-rotating WebGL globe.",
      color: C.purple,
    },
    {
      num: "04",
      title: "Temporal Quiescence Indexing",
      body: "Novel TSL (Time-Since-Last) feature engineering captures stress accumulation patterns in seismic cells — a key differentiator vs. magnitude-only models.",
      color: C.gold,
    },
    {
      num: "05",
      title: "Physical Safety Ceilings",
      body: "Exponential depth decay and the Hypocenter Gate (300km+) ensure the model never over-amplifies deep-earth events — scientific integrity baked into the architecture.",
      color: C.red,
    },
    {
      num: "06",
      title: "Sub-120ms Inference Latency",
      body: "Full end-to-end response — coordinate input to hazard report — delivered in under 120ms via optimized Flask API and pre-computed cluster features.",
      color: C.cyanDim,
    },
  ];

  achievements.forEach((a, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 0.4 + col * 4.85;
    const y = 1.1 + row * 1.42;

    s.addShape(pres.shapes.RECTANGLE, {
      x, y, w: 4.65, h: 1.28,
      fill: { color: C.card }, line: { color: a.color, width: 1 },
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x, y, w: 0.55, h: 1.28,
      fill: { color: a.color, transparency: 20 }, line: { color: a.color, width: 0 },
    });
    s.addText(a.num, {
      x, y, w: 0.55, h: 1.28,
      fontSize: 18, bold: true, color: a.color, fontFace: "Arial Black",
      align: "center", valign: "middle",
    });
    s.addText(a.title, {
      x: x + 0.65, y: y + 0.1, w: 3.9, h: 0.28,
      fontSize: 11, bold: true, color: a.color, fontFace: "Trebuchet MS", margin: 0,
    });
    s.addText(a.body, {
      x: x + 0.65, y: y + 0.4, w: 3.9, h: 0.82,
      fontSize: 9.5, color: C.white, fontFace: "Trebuchet MS",
    });
  });

  addCornerBrackets(s);
  addBottomBar(s, 13);
}

// ─────────────────────────────────────────────────────────────
// SLIDE 14 — CONCLUSION
// ─────────────────────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addGrid(s);

  // Top accent
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.06,
    fill: { color: C.cyan }, line: { color: C.cyan, width: 0 },
  });

  // Center glow
  s.addShape(pres.shapes.OVAL, {
    x: 1.5, y: 0.8, w: 7, h: 4.0,
    fill: { color: "001830", transparency: 20 },
    line: { color: C.cyanDim, width: 1 },
  });

  s.addText("CONCLUSION", {
    x: 0.5, y: 0.85, w: 9, h: 0.38,
    fontSize: 13, color: C.cyan, fontFace: "Consolas",
    align: "center", charSpacing: 8, bold: false,
  });

  s.addShape(pres.shapes.LINE, {
    x: 2.0, y: 1.32, w: 6, h: 0,
    line: { color: C.gridLine, width: 1 },
  });

  s.addText([
    { text: '"', options: { color: C.cyan, fontSize: 40 } },
    { text: "Building structural resilience\nthrough digital surveillance.", options: { color: C.white, fontSize: 28, bold: true } },
    { text: '"', options: { color: C.cyan, fontSize: 40 } },
  ], {
    x: 0.8, y: 1.38, w: 8.4, h: 1.35,
    fontFace: "Trebuchet MS",
    align: "center", valign: "middle",
  });

  s.addShape(pres.shapes.LINE, {
    x: 2.5, y: 2.85, w: 5, h: 0,
    line: { color: C.gridLine, width: 1 },
  });

  // Summary bullets
  const summary = [
    "✦  72,508 USGS seismic records synthesized into a 3-tier hazard intelligence engine",
    "✦  XGBoost ensemble achieving 98.17% accuracy with 0.9726 F1-Score",
    "✦  Real-time 3D volumetric globe powered by Three.js WebGL rendering",
    "✦  Sub-120ms inference from coordinate input to confidential hazard report",
  ];
  summary.forEach((line, i) => {
    s.addText(line, {
      x: 1.5, y: 3.0 + i * 0.32, w: 7, h: 0.3,
      fontSize: 11, color: C.white, fontFace: "Trebuchet MS", align: "center",
    });
  });

  // Author footer
  s.addShape(pres.shapes.RECTANGLE, {
    x: 2.5, y: 4.42, w: 5, h: 0.75,
    fill: { color: C.cyanSoft }, line: { color: C.cyan, width: 1 },
  });
  s.addText("Vansh Agrawal  |  RA2311026010120", {
    x: 2.5, y: 4.48, w: 5, h: 0.3,
    fontSize: 13, bold: true, color: C.gold, fontFace: "Trebuchet MS",
    align: "center",
  });
  s.addText("SRM Institute of Science & Technology  |  github.com/vansh070605/QuakeIntel", {
    x: 2.5, y: 4.8, w: 5, h: 0.22,
    fontSize: 8.5, color: C.muted, fontFace: "Consolas",
    align: "center",
  });

  addCornerBrackets(s);
  addBottomBar(s, 14);
}

// ─────────────────────────────────────────────────────────────
// WRITE FILE
// ─────────────────────────────────────────────────────────────
pres.writeFile({ fileName: "QuakeIntel_SeismoSense_v4.3.5.pptx" }).then(() => {
  console.log("✅ Presentation written successfully.");
}).catch(err => {
  console.error("❌ Error:", err);
});
