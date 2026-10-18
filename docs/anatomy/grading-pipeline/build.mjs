import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as k from "../../../.agents/skills/anatomy/kit/iso-kit.mjs";
import { kitScript } from "../../../.agents/skills/anatomy/scripts/inline-kit.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
mkdirSync(HERE, { recursive: true });

const theme = process.argv.includes("--light") ? "light" : "dark";

const WIDTH = 740;
const HEIGHT = 460;

// Base Surface Plate
const PLATE = { x: -140, y: -75, w: 280, d: 150, r: 8 };
const PLATE_H = 14;
const FOOT_H = 6;

// Left Tower: Attempt Ratchet Counter
const TOWER_L = [-112, 12];
const TOWER_L_H = 88;

// Right Pillar: Dial Gauge & Sensor Arm
const POST = [98, 12];
const POST_TOP = 118;
const CLAMP_Z = 92;

const DIAL = [48, 8];
const DIAL_R = 26;
const DIAL_Z = 78;
const DIAL_H = 10;
const DIAL_TOP = DIAL_Z + DIAL_H;

// Rails & Travel
const RAIL_Y_FRONT = -22;
const RAIL_Y_BACK = 22;
const RAIL_X_MIN = -92;
const RAIL_X_MAX = 88;
const RAIL_Z = 5;
const RAIL_R = 3.2;

// Marks scale runs from score 0 (x = -80) to score 20 (x = 80)
const SCALE_MIN_X = -80;
const SCALE_MAX_X = 80;
const SCORE_MIN = 0;
const SCORE_MAX = 20;

// Carriage
const CARRIAGE = { x: -18, y: -26, w: 36, d: 52, r: 4 };
const CARRIAGE_Z = 4;
const CARRIAGE_TOP = 16;

const P = k.fitProjection(
  [
    ...k.boxCorners(PLATE, -PLATE_H - FOOT_H, 0),
    [POST[0] + 8, POST[1], POST_TOP + 4],
    [TOWER_L[0] - 8, TOWER_L[1], TOWER_L_H + 4],
    [DIAL[0] + DIAL_R + 6, DIAL[1], DIAL_TOP + 6],
  ],
  WIDTH,
  HEIGHT,
  { pad: 26, azimuth: 44, elevation: 32 }
);

const at = (point) => k.iso(point, P);
const S = (paths, style) => k.solidSvg(paths, style);
const L = (d, style) => k.lineSvg(d, style);
const D = (points, style) => k.dotsSvg(points, style);
const byDepth = (points) => [...points].sort((a, b) => k.depthOf([a[0], a[1], 0], P) - k.depthOf([b[0], b[1], 0], P));

// 1. BASE PLATE & DAMPING FEET
function plate() {
  const out = [`<path class="iso-halo" d="${k.haloOf(PLATE, -PLATE_H - FOOT_H, PLATE_H, P)}"/>`];

  // Feet
  for (const [x, y] of byDepth(k.corners(PLATE, 20))) {
    out.push(S(k.cylinder(x, y, 7.5, -PLATE_H - FOOT_H, 1.8, P, 28), { tone: "lo" }));
    out.push(S(k.cylinder(x, y, 5.8, -PLATE_H - FOOT_H + 1.8, FOOT_H - 1.8, P, 28), { tone: "mid" }));
    out.push(L(k.knurl(x, y, 5.8, -PLATE_H - FOOT_H + 1.8, -PLATE_H, 20, P, 0.4), { tone: "lo" }));
  }

  // Main slab
  out.push(S(k.slabOf(PLATE, -PLATE_H, PLATE_H, P, 8, 1.2), { tone: "lo", crease: "faint" }));

  // Inset perimeter groove
  out.push(L(k.planOutline(k.insetPlan(PLATE, 4), 0, P, 8), { tone: "faint" }));

  // Corner socket-head screws
  for (const [x, y] of k.corners(PLATE, 8)) {
    out.push(D([at([x, y, 0])], { size: 0.55, tone: "lo" }));
    out.push(L(k.ring(x, y, 1.8, 0, P, 16), { tone: "faint" }));
  }

  // Front score rule strip (0 to 20 marks)
  const rulePlan = { x: SCALE_MIN_X - 4, y: -PLATE.d / 2 + 5, w: (SCALE_MAX_X - SCALE_MIN_X) + 8, d: 8, r: 1.5 };
  out.push(S(k.slabOf(rulePlan, 0, 1.2, P, 3, 0.4), { tone: "mid" }));
  const ticks = k.topTicks(SCALE_MIN_X, SCALE_MAX_X, 8, 5, rulePlan.y + rulePlan.d - 0.2, 1.2, [1.4, 3.2], P, "x");
  out.push(L(ticks.minor, { tone: "lo" }));
  out.push(L(ticks.major, { tone: "hi" }));

  // Scale labels on face
  out.push(k.faceTextSvg(k.topMatrix([SCALE_MIN_X, rulePlan.y + 2.5], 1.2, P, "x"), "0", { size: 2.2, tone: "mid" }));
  out.push(k.faceTextSvg(k.topMatrix([SCALE_MIN_X + 40, rulePlan.y + 2.5], 1.2, P, "x"), "5", { size: 2.2, tone: "mid" }));
  out.push(k.faceTextSvg(k.topMatrix([0, rulePlan.y + 2.5], 1.2, P, "x"), "10 (PASS)", { size: 2.2, tone: "hi" }));
  out.push(k.faceTextSvg(k.topMatrix([SCALE_MIN_X + 120, rulePlan.y + 2.5], 1.2, P, "x"), "15", { size: 2.2, tone: "mid" }));
  out.push(k.faceTextSvg(k.topMatrix([SCALE_MAX_X, rulePlan.y + 2.5], 1.2, P, "x"), "20", { size: 2.2, tone: "hi" }));

  // Specification label plate on front face
  const specPlate = { x: -28, y: -PLATE.d / 2 - 0.2, w: 56, d: 0.4, r: 0.5 };
  out.push(S(k.slabOf(specPlate, -10, 8, P, 2, 0.2), { tone: "mid" }));
  out.push(k.faceTextSvg(k.sideMatrix([0, -PLATE.d / 2 - 0.3], -4, P, "y"), "SCHOOL.EXAM_RESULTS PIPELINE", { size: 2.1, tone: "hi", anchor: "middle" }));
  out.push(k.faceTextSvg(k.sideMatrix([0, -PLATE.d / 2 - 0.3], -7, P, "y"), "SCALE: 0-20 PTS · PASS THRESHOLD >= 50%", { size: 1.6, tone: "lo", anchor: "middle" }));

  return out.join("");
}

// 2. LINEAR RAILS & PILLOW BLOCKS
function rails() {
  const out = [];

  // Pillow blocks (holding the rails)
  const blockW = 16, blockD = 58, blockH = 12;
  const leftBlock = { x: RAIL_X_MIN - 12, y: -blockD / 2, w: blockW, d: blockD, r: 2.5 };
  const rightBlock = { x: RAIL_X_MAX - 4, y: -blockD / 2, w: blockW, d: blockD, r: 2.5 };

  out.push(S(k.slabOf(leftBlock, 0, blockH, P, 4, 0.8), { tone: "mid" }));
  out.push(S(k.slabOf(rightBlock, 0, blockH, P, 4, 0.8), { tone: "mid" }));

  // Retaining clamp cap screws
  out.push(D([
    at([leftBlock.x + 4, RAIL_Y_FRONT, blockH]),
    at([leftBlock.x + 4, RAIL_Y_BACK, blockH]),
    at([rightBlock.x + 12, RAIL_Y_FRONT, blockH]),
    at([rightBlock.x + 12, RAIL_Y_BACK, blockH]),
  ], { size: 0.45, tone: "hi" }));

  // Dual precision ground rails (Front & Back)
  for (const y of [RAIL_Y_FRONT, RAIL_Y_BACK]) {
    // Rail cylinder extending along X
    // Model as a series of depth-ordered elements or cylinder slices
    out.push(S(k.cylinder(RAIL_X_MIN, y, RAIL_R, 0, RAIL_Z + 2, P, 16), { tone: "mid" }));
    out.push(S(k.cylinder(RAIL_X_MAX, y, RAIL_R, 0, RAIL_Z + 2, P, 16), { tone: "mid" }));
    // Rail longitudinal lines
    const p1 = at([RAIL_X_MIN, y, RAIL_Z + RAIL_R]);
    const p2 = at([RAIL_X_MAX, y, RAIL_Z + RAIL_R]);
    out.push(L(`M${p1[0]} ${p1[1]}L${p2[0]} ${p2[1]}`, { tone: "hi" }));
    const pb1 = at([RAIL_X_MIN, y, RAIL_Z - RAIL_R]);
    const pb2 = at([RAIL_X_MAX, y, RAIL_Z - RAIL_R]);
    out.push(L(`M${pb1[0]} ${pb1[1]}L${pb2[0]} ${pb2[1]}`, { tone: "lo" }));
  }

  return out.join("");
}

// 3. LEFT TOWER: ATTEMPT RATCHET COUNTER (ODOMETER)
function leftTower() {
  const out = [];
  const [cx, cy] = TOWER_L;

  // Base mounting foot
  out.push(S(k.cylinder(cx, cy, 14, 0, 5, P, 28, 0.6), { tone: "mid" }));
  out.push(D([
    at([cx - 8, cy - 8, 5]),
    at([cx + 8, cy - 8, 5]),
    at([cx - 8, cy + 8, 5]),
  ], { size: 0.4, tone: "lo" }));

  // Tower column
  out.push(S(k.cylinder(cx, cy, 7, 5, TOWER_L_H - 5, P, 24, 0.4), { tone: "mid" }));

  // Odometer Drum Housing at Z = 45
  const drumHousing = { x: cx - 14, y: cy - 12, w: 28, d: 24, r: 3 };
  out.push(S(k.slabOf(drumHousing, 40, 22, P, 4, 0.8), { tone: "hi" }));
  out.push(L(k.planOutline(k.insetPlan(drumHousing, 2), 62, P, 4), { tone: "faint" }));

  // Drum window bezel
  const win = { x: cx - 11, y: cy - 12.2, w: 22, d: 0.5, r: 1 };
  out.push(S(k.slabOf(win, 44, 14, P, 2, 0.2), { tone: "lo" }));

  // Advance ratchet lever arm with knurled trip knob
  const armZ = 68;
  out.push(S(k.slabOf({ x: cx - 4, y: cy + 10, w: 8, d: 16, r: 2 }, armZ, 3, P, 3), { tone: "mid" }));
  out.push(S(k.cylinder(cx, cy + 24, 4.2, armZ - 2, 8, P, 20), { tone: "hi", lit: true }));
  out.push(L(k.knurl(cx, cy + 24, 4.2, armZ - 2, armZ + 6, 20, P, 0.3), { tone: "lo" }));

  // Return coil spring on column
  out.push(L(k.coil(cx, cy, 8.2, 20, 36, 4, P), { tone: "lo" }));

  // Top cap
  out.push(S(k.cylinder(cx, cy, 8.5, TOWER_L_H, 4, P, 24), { tone: "mid" }));
  out.push(k.faceTextSvg(k.sideMatrix([cx, cy - 12.5], 51, P, "y"), "ATTEMPT", { size: 2.4, tone: "hi", anchor: "middle" }));

  return out.join("");
}

// 4. RIGHT PILLAR & ARTICULATED SENSOR ARM
function rightPillar() {
  const out = [];
  const [cx, cy] = POST;

  // Base mount
  out.push(S(k.cylinder(cx, cy, 14, 0, 5, P, 28, 0.6), { tone: "mid" }));
  out.push(S(k.cylinder(cx, cy, 6.2, 5, POST_TOP - 5, P, 24), { tone: "mid" }));

  // Knurled height adjustment collar
  out.push(S(k.cylinder(cx, cy, 8.2, 45, 8, P, 28), { tone: "mid" }));
  out.push(L(k.knurl(cx, cy, 8.2, 45, 53, 28, P, 0.3), { tone: "lo" }));

  // Clamp block holding dial gauge arm
  const clamp = { x: cx - 9, y: cy - 9, w: 18, d: 18, r: 3 };
  out.push(S(k.slabOf(clamp, CLAMP_Z - 6, 14, P, 4, 0.8), { tone: "mid" }));

  // Horizontal cantilever arm extending to dial gauge
  const arm = { x: DIAL[0] - 2, y: cy - 4, w: cx - DIAL[0] + 6, d: 8, r: 2 };
  out.push(S(k.slabOf(arm, CLAMP_Z, 6, P, 3, 0.6), { tone: "mid" }));

  // Tightening thumbscrew
  out.push(S(k.cylinder(cx + 9, cy, 3.4, CLAMP_Z - 2, 7, P, 18), { tone: "mid" }));
  out.push(L(k.knurl(cx + 9, cy, 3.4, CLAMP_Z - 2, CLAMP_Z + 5, 18, P), { tone: "lo" }));

  // Top finial
  out.push(S(k.cylinder(cx, cy, 7.5, POST_TOP, 3, P, 24), { tone: "mid" }));

  return out.join("");
}

// 5. DIAL GAUGE (PERCENTAGE & GRADE LETTER SCALE)
function dialGauge() {
  const out = [];
  const [x, y] = DIAL;

  // Stem connecting arm to dial back
  out.push(S(k.cylinder(x, y, 4.5, 50, DIAL_Z - 50, P, 20), { tone: "mid" }));

  // Dial circular bezel housing
  out.push(S(k.cylinder(x, y, DIAL_R, DIAL_Z, DIAL_H, P, 64, 1.2), { tone: "hi", crease: "lo" }));
  out.push(L(k.knurl(x, y, DIAL_R, DIAL_TOP - 3.5, DIAL_TOP, 90, P, 0.35), { tone: "lo" }));
  out.push(L(k.sideArc(x, y, DIAL_R, DIAL_TOP - 3.5, P, 40), { tone: "faint" }));

  // Dial Face (Sunken inner ring)
  out.push(L(k.ring(x, y, DIAL_R - 2.5, DIAL_TOP, P, 64), { tone: "lo" }));
  out.push(L(k.ring(x, y, DIAL_R - 5.5, DIAL_TOP, P, 64), { tone: "faint" }));

  // 100-division percentage scale
  const ticks = k.radialTicks(x, y, DIAL_R - 3.2, 50, 5, DIAL_TOP, [1.4, 3.4], P);
  out.push(L(ticks.minor, { tone: "lo" }));
  out.push(L(ticks.major, { tone: "hi" }));

  // Central pivot jewel pin
  out.push(S(k.cylinder(x, y, 2.2, DIAL_TOP, 1.2, P, 20), { tone: "hi", lit: true }));
  out.push(D([at([x, y, DIAL_TOP + 1.2])], { size: 0.6, tone: "lit" }));

  // Sector labels painted onto dial top
  // Sector D: 0-50% | Sector C: 50-70% | Sector B: 70-90% | Sector A: 90-100%
  out.push(k.faceTextSvg(k.topMatrix([x - 12, y - 8], DIAL_TOP, P, "x"), "D", { size: 2.8, tone: "lo", anchor: "middle" }));
  out.push(k.faceTextSvg(k.topMatrix([x - 12, y + 8], DIAL_TOP, P, "x"), "C", { size: 2.8, tone: "mid", anchor: "middle" }));
  out.push(k.faceTextSvg(k.topMatrix([x + 10, y + 8], DIAL_TOP, P, "x"), "B", { size: 2.8, tone: "hi", anchor: "middle" }));
  out.push(k.faceTextSvg(k.topMatrix([x + 12, y - 6], DIAL_TOP, P, "x"), "A", { size: 3.2, tone: "lit", anchor: "middle" }));

  out.push(k.faceTextSvg(k.topMatrix([x, y + 14], DIAL_TOP, P, "x"), "GRADE / %", { size: 2.0, tone: "mid", anchor: "middle" }));

  // Pass/Fail Dual-Lens Optical Beacon atop dial housing
  const beaconBase = [x + DIAL_R - 2, y - 10];
  out.push(S(k.slabOf({ x: beaconBase[0] - 3, y: beaconBase[1] - 5, w: 6, d: 10, r: 1.5 }, DIAL_TOP, 4, P, 2), { tone: "mid" }));
  // Red lens (Fail)
  out.push(S(k.cylinder(beaconBase[0], beaconBase[1] - 2.5, 2.2, DIAL_TOP + 4, 3, P, 16), { tone: "lo", className: "beacon-fail" }));
  // Green lens (Pass)
  out.push(S(k.cylinder(beaconBase[0], beaconBase[1] + 2.5, 2.2, DIAL_TOP + 4, 3, P, 16), { tone: "hi", className: "beacon-pass" }));

  return out.join("");
}

// 6. MOVING SCORE CARRIAGE
function carriage() {
  const out = [];

  // Halo under carriage
  out.push(`<path class="iso-halo" d="${k.haloOf(k.insetPlan(CARRIAGE, 2), CARRIAGE_Z, 0.2, P)}" style="filter:blur(3px)"/>`);

  // Main brass carriage body
  out.push(S(k.slabOf(CARRIAGE, CARRIAGE_Z, CARRIAGE_TOP - CARRIAGE_Z, P, 6, 0.8), { tone: "mid", crease: "faint" }));

  // Bushing channels over rails
  out.push(L(k.lineOnTop([CARRIAGE.x, RAIL_Y_FRONT], [CARRIAGE.x + CARRIAGE.w, RAIL_Y_FRONT], CARRIAGE_TOP, P), { tone: "faint" }));
  out.push(L(k.lineOnTop([CARRIAGE.x, RAIL_Y_BACK], [CARRIAGE.x + CARRIAGE.w, RAIL_Y_BACK], CARRIAGE_TOP, P), { tone: "faint" }));

  // Central Knurled Locking Thumb Knob
  out.push(S(k.cylinder(0, 0, 7.5, CARRIAGE_TOP, 8, P, 32, 0.5), { tone: "hi" }));
  out.push(L(k.knurl(0, 0, 7.5, CARRIAGE_TOP, CARRIAGE_TOP + 8, 36, P, 0.35), { tone: "lo" }));
  out.push(S(k.cylinder(0, 0, 3.2, CARRIAGE_TOP + 8, 2.5, P, 20), { tone: "hi", lit: true }));

  // Index pointer needle pointing down to front scale
  const ptrBase = [0, CARRIAGE.y - 1];
  const ptrTip = [0, CARRIAGE.y - 14];
  const pB = at([ptrBase[0], ptrBase[1], CARRIAGE_TOP]);
  const pT = at([ptrTip[0], ptrTip[1], 2]);
  out.push(L(`M${pB[0]} ${pB[1]}L${pT[0]} ${pT[1]}`, { tone: "lit", className: "carriage-pointer" }));
  out.push(D([pT], { size: 0.6, tone: "lit" }));

  // Stepped calibration gauge blocks (representing 4 threshold stages: D, C, B, A)
  const steps = [
    { label: "D", w: 7, d: 10, h: 4, x: -14 },
    { label: "C", w: 7, d: 10, h: 8, x: -6 },
    { label: "B", w: 7, d: 10, h: 12, x: 2 },
    { label: "A", w: 7, d: 10, h: 16, x: 10 }
  ];

  for (const s of steps) {
    const sp = { x: s.x, y: 8, w: s.w, d: s.d, r: 1 };
    out.push(S(k.slabOf(sp, CARRIAGE_TOP, s.h, P, 2, 0.3), { tone: s.label === "A" ? "hi" : "mid", lit: s.label === "A" }));
    out.push(k.faceTextSvg(k.topMatrix([s.x + s.w / 2, 13], CARRIAGE_TOP + s.h, P, "x"), s.label, { size: 1.8, tone: "lo", anchor: "middle" }));
  }

  return out.join("");
}

// 7. SENSOR PROBE & PLUNGER (Riding along carriage)
function sensorProbe() {
  const out = [];
  const [x, y] = DIAL;

  // Vertical sensing plunger descending from dial bottom to carriage
  out.push(S(k.cylinder(x, y, 2.8, 30, 24, P, 18), { tone: "hi", lit: true }));
  out.push(S(k.cylinder(x, y, 1.6, 12, 18, P, 16), { tone: "hi", lit: true }));
  out.push(D([at([x, y, 12])], { size: 0.55, tone: "lit" }));

  return out.join("");
}

// Calculate needle line coordinates given a percentage (0.0 to 1.0)
const needleAt = (fraction) => {
  // Map 0.0-1.0 to angle around dial (0 to 300 degrees)
  const startAngle = Math.PI * 0.75; // 135 deg
  const span = Math.PI * 1.5; // 270 deg sweep
  const angle = startAngle + fraction * span;
  const [x, y] = DIAL;
  const tail = [x - Math.cos(angle) * 4, y - Math.sin(angle) * 4];
  const tip = [x + Math.cos(angle) * (DIAL_R - 5), y + Math.sin(angle) * (DIAL_R - 5)];
  return k.lineOnTop(tail, tip, DIAL_TOP + 0.3, P);
};

// Initial state: Score 15 (75%, Grade B, Passed)
const INITIAL_SCORE = 15;
const startX = SCALE_MIN_X + (INITIAL_SCORE / SCORE_MAX) * (SCALE_MAX_X - SCALE_MIN_X);
const initialFraction = INITIAL_SCORE / SCORE_MAX;

const svg = k.figureSvg({
  width: WIDTH,
  height: HEIGHT,
  label:
    "An isometric inspection and calibration test bench modeling the school grading pipeline. A precision carriage slides along score marks 0 to 20, driving a stepped threshold sensor, a percentage and letter-grade dial indicator (A, B, C, D), a pass/fail optical beacon, and an attempt ratchet counter.",
  body: [
    plate(),
    rails(),
    leftTower(),
    rightPillar(),
    `<g data-part="carriage" transform="${k.translateAlong(P, [startX, 0, 0])}">${carriage()}</g>`,
    `<g data-part="probe">${sensorProbe()}</g>`,
    dialGauge(),
    `<path data-part="needle" class="iso-line" data-tone="lit" data-free="start" d="${needleAt(initialFraction)}" style="stroke-width:1.2"/>`,
  ],
});

// CLIENT-SIDE INTERACTIVITY SCRIPT
const live = `
const P = ${JSON.stringify(P)};
const DIAL = ${JSON.stringify(DIAL)};
const DIAL_R = ${DIAL_R}, DIAL_TOP = ${DIAL_TOP};
const SCALE_MIN_X = ${SCALE_MIN_X}, SCALE_MAX_X = ${SCALE_MAX_X};
const SCORE_MIN = ${SCORE_MIN}, SCORE_MAX = ${SCORE_MAX};
const TOWER_L = ${JSON.stringify(TOWER_L)};

const stage = document.querySelector(".iso-stage");
const svg = stage.querySelector("svg");
const carriage = svg.querySelector('[data-part="carriage"]');
const needle = svg.querySelector('[data-part="needle"]');
const readout = document.querySelector("[data-readout]");
const beaconPass = svg.querySelector(".beacon-pass");
const beaconFail = svg.querySelector(".beacon-fail");

const needleAt = ${needleAt.toString().replace("k.lineOnTop", "lineOnTop")};

let currentScore = ${INITIAL_SCORE};
let targetScore = currentScore;
let currentAttempt = 1;
let visible = true;
let lastTime = 0;
let frameId = 0;
let touring = true;
let tourClock = 0;

function computePipeline(score) {
  const marks = Math.max(0, Math.min(20, Math.round(score * 10) / 10));
  const total = 20;
  const pct = (marks / total) * 100;
  let grade = 'D';
  if (pct >= 90) grade = 'A';
  else if (pct >= 70) grade = 'B';
  else if (pct >= 50) grade = 'C';

  const isPassed = marks >= (total * 0.5);
  return { marks, total, pct, grade, isPassed };
}

function updateVisuals(score) {
  const frac = score / SCORE_MAX;
  const posX = SCALE_MIN_X + frac * (SCALE_MAX_X - SCALE_MIN_X);

  carriage.setAttribute("transform", translateAlong(P, [posX, 0, 0]));
  needle.setAttribute("d", needleAt(frac));

  const info = computePipeline(score);

  if (beaconPass && beaconFail) {
    if (info.isPassed) {
      beaconPass.style.fill = "#10b981";
      beaconPass.style.filter = "drop-shadow(0 0 4px #10b981)";
      beaconFail.style.fill = "var(--iso-tone-lo)";
      beaconFail.style.filter = "none";
    } else {
      beaconPass.style.fill = "var(--iso-tone-lo)";
      beaconPass.style.filter = "none";
      beaconFail.style.fill = "#ef4444";
      beaconFail.style.filter = "drop-shadow(0 0 4px #ef4444)";
    }
  }

  const statusText = info.isPassed ? "PASSED" : "FAILED";
  const readoutText = "MARKS: " + info.marks.toFixed(1) + "/20 (" + info.pct.toFixed(0) + "%) · GRADE " + info.grade + " · " + statusText + " · ATT #" + currentAttempt;
  if (readout && readout.textContent !== readoutText) {
    readout.textContent = readoutText;
  }
}

function tick(now) {
  const dt = lastTime ? Math.min((now - lastTime) / 1000, 0.05) : 0.016;
  lastTime = now;

  if (touring) {
    tourClock += dt;
    // Gentle demo sweep between 8 and 19
    targetScore = 14 + Math.sin(tourClock * 0.8) * 5.5;
  }

  const diff = targetScore - currentScore;
  if (Math.abs(diff) > 0.02) {
    currentScore += diff * (1 - Math.exp(-dt * 8));
  } else {
    currentScore = targetScore;
  }

  updateVisuals(currentScore);

  if (visible) {
    frameId = requestAnimationFrame(tick);
  }
}

function setScore(score) {
  touring = false;
  targetScore = Math.max(0, Math.min(20, score));
}

function advanceAttempt() {
  currentAttempt = (currentAttempt % 5) + 1;
  updateVisuals(currentScore);
}

stage.addEventListener("pointermove", (e) => {
  const rect = svg.getBoundingClientRect();
  const share = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
  setScore(share * SCORE_MAX);
});

window.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight" || e.key === "ArrowUp") {
    e.preventDefault();
    setScore(currentScore + 0.5);
  } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
    e.preventDefault();
    setScore(currentScore - 0.5);
  } else if (e.key === " " || e.key === "Enter") {
    e.preventDefault();
    advanceAttempt();
  }
});

updateVisuals(currentScore);
frameId = requestAnimationFrame(tick);
`;

const body = k.plateHtml({
  fig: "Fig 1",
  title: "School Grading Pipeline Bench",
  hint: "Hover/Arrows: Score (0-20) · Space: Attempt",
  readout: `MARKS: ${INITIAL_SCORE.toFixed(1)}/20 (75%) · GRADE B · PASSED · ATT #1`,
  keys: [
    { mark: "lit", label: "Slider carriage & needle: maps score to percentage and letter thresholds" },
    { mark: "raised", label: "Dual beacon (emerald/amber): triggers pass/fail state at 50% (>= 10 pts)" },
  ],
  caption:
    "An isometric physical test bench visualizing the school grading pipeline in school.exam_results (grades.js). Marks (0-20) slide the carriage; the dial indicator sweeps the ratio to determine grade letters (A >= 90%, B >= 70%, C >= 50%, D < 50%), toggles the pass beacon, and trips the attempt ratchet.",
  body: `<div class="iso-stage" tabindex="0" role="slider" aria-label="Grading Pipeline Test Bench" aria-valuemin="0" aria-valuemax="20" aria-valuenow="15">${svg}</div>`,
});

const htmlContent = k.pageHtml({
  title: "School Grading Pipeline — Anatomy",
  theme,
  body,
  script: kitScript() + live,
  width: 760,
});

const outPath = join(HERE, theme === "light" ? "grading-pipeline-light.html" : "grading-pipeline.html");
writeFileSync(outPath, htmlContent);
console.log("wrote", outPath);
