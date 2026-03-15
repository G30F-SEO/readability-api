import { useState, useEffect, useRef, useCallback } from "react";

// ═══════════════════════════════════════════
// THEME
// ═══════════════════════════════════════════
const C = {
  bg: "#07070D", surface: "#0F0F1A", card: "#161625", cardBorder: "#1F1F35",
  accent: "#FF2D55", accentGlow: "rgba(255,45,85,0.25)", accentSoft: "rgba(255,45,85,0.08)",
  green: "#00E676", greenGlow: "rgba(0,230,118,0.15)",
  blue: "#448AFF", blueGlow: "rgba(68,138,255,0.15)",
  orange: "#FF9100", orangeGlow: "rgba(255,145,0,0.15)",
  yellow: "#FFD600", cyan: "#18FFFF", purple: "#B388FF",
  text: "#EEEEF2", textSec: "#8888A0", textDim: "#505068", white: "#fff",
};
const MODE_META = {
  amrap: { label: "AMRAP", color: C.accent, icon: "\u221E" },
  fortime: { label: "FOR TIME", color: C.green, icon: "\u26A1" },
  emom: { label: "EMOM", color: C.blue, icon: "\u23F1" },
  tabata: { label: "TABATA", color: C.orange, icon: "\u27D0" },
  chrono: { label: "CHRONO", color: C.cyan, icon: "\u2191" },
  minuteur: { label: "MINUTEUR", color: C.yellow, icon: "\u2193" },
};

// ═══════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════
const USER = { name: "Geoffrey", since: "Mars 2024", weight: 89, height: 178, box: "CrossFit Pau", goal: "84 kg", avatar: "G" };

const PR_DATA = {
  "Back Squat": [
    { date: "2024-06", value: 120 }, { date: "2024-09", value: 130 }, { date: "2024-12", value: 138 }, { date: "2025-03", value: 140 }, { date: "2025-06", value: 142 }, { date: "2025-10", value: 145 }, { date: "2026-01", value: 145 },
  ],
  "Front Squat": [
    { date: "2024-06", value: 95 }, { date: "2024-09", value: 105 }, { date: "2025-01", value: 112 }, { date: "2025-06", value: 118 }, { date: "2025-10", value: 122 }, { date: "2026-01", value: 125 },
  ],
  "Deadlift": [
    { date: "2024-06", value: 160 }, { date: "2024-09", value: 170 }, { date: "2025-01", value: 180 }, { date: "2025-06", value: 185 }, { date: "2025-10", value: 188 }, { date: "2026-01", value: 190 },
  ],
  "Clean & Jerk": [
    { date: "2024-06", value: 85 }, { date: "2024-09", value: 90 }, { date: "2025-01", value: 98 }, { date: "2025-06", value: 105 }, { date: "2025-10", value: 108 }, { date: "2026-01", value: 110 },
  ],
  "Snatch": [
    { date: "2024-06", value: 60 }, { date: "2024-09", value: 68 }, { date: "2025-01", value: 75 }, { date: "2025-06", value: 80 }, { date: "2025-10", value: 83 }, { date: "2026-01", value: 85 },
  ],
  "Strict Press": [
    { date: "2024-06", value: 45 }, { date: "2024-09", value: 48 }, { date: "2025-01", value: 52 }, { date: "2025-06", value: 55 }, { date: "2025-10", value: 58 }, { date: "2026-01", value: 60 },
  ],
  "Push Press": [
    { date: "2024-09", value: 60 }, { date: "2025-01", value: 65 }, { date: "2025-06", value: 70 }, { date: "2025-10", value: 73 }, { date: "2026-01", value: 75 },
  ],
  "Thruster": [
    { date: "2024-09", value: 55 }, { date: "2025-01", value: 60 }, { date: "2025-06", value: 65 }, { date: "2025-10", value: 68 }, { date: "2026-01", value: 70 },
  ],
};

const USER_PRS = {};
Object.entries(PR_DATA).forEach(([k, v]) => { USER_PRS[k.toLowerCase()] = v[v.length - 1].value; });

const BENCHMARKS = {
  "Fran": [
    { date: "2024-10", value: 285 }, { date: "2025-03", value: 260 }, { date: "2025-09", value: 238 }, { date: "2026-03", value: 222 },
  ],
  "Grace": [
    { date: "2024-10", value: 240 }, { date: "2025-03", value: 210 }, { date: "2025-09", value: 190 }, { date: "2026-03", value: 178 },
  ],
  "Cindy": [
    { date: "2024-10", value: 14 }, { date: "2025-03", value: 16 }, { date: "2025-09", value: 17 }, { date: "2026-03", value: 18 },
  ],
};

const CALENDAR_WODS = {
  "2026-03-10": { name: "Cindy", mode: "amrap", desc: "AMRAP 20: 5 Pull-ups, 10 Push-ups, 15 Squats", score: "18 rds + 5" },
  "2026-03-11": { name: "Heavy Day", mode: "fortime", desc: "5x3 Back Squat @85%, 5x2 Clean @80%", score: "Compl\u00E9t\u00E9" },
  "2026-03-12": { name: "Fight Gone Bad", mode: "amrap", desc: "3 rds: Wall Ball, SDHP, Box Jump, Push Press, Row", score: "271 reps" },
  "2026-03-13": { name: "EMOM 16", mode: "emom", desc: "Odd: 3 Power Clean, Even: 8 T2B", score: "Compl\u00E9t\u00E9" },
  "2026-03-14": { name: "Fran", mode: "fortime", desc: "21-15-9 Thrusters & Pull-ups", score: "3:42" },
  "2026-03-15": { name: "Open Gym", mode: "chrono", desc: "Skill work + Accessory", score: null },
  "2026-03-07": { name: "Grace", mode: "fortime", desc: "30 Clean & Jerk (60kg)", score: "2:58" },
  "2026-03-05": { name: "Tabata Squats", mode: "tabata", desc: "Tabata Air Squats", score: "188 reps" },
  "2026-03-03": { name: "DT", mode: "fortime", desc: "5 rds: 12 DL, 9 Hang Clean, 6 Push Jerk (70kg)", score: "8:24" },
  "2026-03-17": { name: "Murph", mode: "fortime", desc: "1mi Run, 100 Pull-ups, 200 Push-ups, 300 Squats, 1mi Run", score: null },
  "2026-03-18": { name: "EMOM 20", mode: "emom", desc: "5 Burpee Box Jump-over + 10 KB Swing", score: null },
  "2026-03-19": { name: "Diane", mode: "fortime", desc: "21-15-9 Deadlift (100kg) & HSPU", score: null },
};

const WEIGHT_LOG = [
  { date: "Jan", value: 93 }, { date: "F\u00E9v", value: 91.5 }, { date: "Mar", value: 90.2 },
  { date: "Avr", value: 89.8 }, { date: "Mai", value: 89.5 }, { date: "Jun", value: 89.1 },
  { date: "Jul", value: 88.4 }, { date: "Ao\u00FB", value: 88.8 }, { date: "Sep", value: 88.2 },
  { date: "Oct", value: 89.0 }, { date: "Nov", value: 89.3 }, { date: "D\u00E9c", value: 89.0 },
];

const PRESETS = [
  { name: "Fran", text: "For Time\n21 Thrusters (43kg)\n21 Pull-ups\n15 Thrusters (43kg)\n15 Pull-ups\n9 Thrusters (43kg)\n9 Pull-ups" },
  { name: "Cindy", text: "AMRAP 20\n5 Pull-ups\n10 Push-ups\n15 Air Squats" },
  { name: "Grace", text: "For Time\n30 Clean & Jerk (60kg)" },
  { name: "EMOM 12", text: "EMOM 12\n3 Power Clean (70kg)\n6 Push-ups\n9 Air Squats" },
];

// ═══════════════════════════════════════════
// PARSER
// ═══════════════════════════════════════════
function parseWodText(text) {
  const lower = text.toLowerCase();
  let mode = "fortime", timeCap = null, rounds = null, emomInterval = 1, movements = [];
  if (/amrap/i.test(lower)) { mode = "amrap"; const m = lower.match(/amrap\s*(\d+)/i) || lower.match(/(\d+)\s*min/i); timeCap = m ? parseInt(m[1]) * 60 : 720; }
  else if (/emom/i.test(lower)) { mode = "emom"; const m = lower.match(/emom\s*(\d+)/i) || lower.match(/(\d+)\s*min/i); timeCap = m ? parseInt(m[1]) * 60 : 600; const intv = lower.match(/e(\d+)mom/i); if (intv) emomInterval = parseInt(intv[1]); }
  else if (/tabata/i.test(lower)) { mode = "tabata"; timeCap = 240; }
  else if (/for\s*time/i.test(lower)) { mode = "fortime"; const cap = lower.match(/(?:time\s*cap|tc)\s*[:=]?\s*(\d+)/i); if (cap) timeCap = parseInt(cap[1]) * 60; }
  const rm = lower.match(/(\d+)\s*(?:rounds?|rds?)\b/i); if (rm) rounds = parseInt(rm[1]);
  text.split(/\n/).map(l => l.trim()).filter(l => l.length > 0).forEach(line => {
    if (/^(amrap|emom|for\s*time|tabata|\d+\s*rounds?|\d+\s*rds?|time\s*cap|tc\s*:)/i.test(line.trim())) return;
    const m = line.match(/^[-\u2013\u2022]?\s*(\d+)\s+(.+)/i);
    if (m) {
      const wm = m[2].match(/((\d+)\s*(?:kg|lbs?)?\s*(?:\/\s*\d+\s*(?:kg|lbs?))?)/i);
      movements.push({ reps: parseInt(m[1]), name: m[2].replace(/\(.*?\)/g, "").trim(), weight: wm ? wm[1] + " kg" : null, raw: line.trim() });
    } else if (line.trim().length > 2 && !/^#|^\*/i.test(line)) {
      movements.push({ reps: null, name: line.replace(/^[-\u2013\u2022]\s*/, "").trim(), weight: null, raw: line.trim() });
    }
  });
  movements = movements.map(mv => {
    const ln = mv.name.toLowerCase();
    for (const [prName, prVal] of Object.entries(USER_PRS)) {
      if (ln.includes(prName)) return { ...mv, prValue: prVal, suggested: `Rx: ${Math.round(prVal * 0.6)}kg \u00B7 Scaled: ${Math.round(prVal * 0.45)}kg`, prName };
    }
    return mv;
  });
  return { mode, timeCap, rounds, emomInterval, movements };
}

function fmt(s) { const a = Math.abs(Math.floor(s)); return `${Math.floor(a / 60).toString().padStart(2, "0")}:${(a % 60).toString().padStart(2, "0")}`; }

// ═══════════════════════════════════════════
// MINI CHART (SVG)
// ═══════════════════════════════════════════
function MiniChart({ data, color, height = 80, width = "100%", showLabels = false, unit = "", invert = false }) {
  if (!data || data.length < 2) return null;
  const values = data.map(d => d.value);
  const mn = Math.min(...values), mx = Math.max(...values);
  const range = mx - mn || 1;
  const svgW = 300, svgH = height;
  const pad = 20;
  const pts = data.map((d, i) => {
    const x = pad + (i / (data.length - 1)) * (svgW - pad * 2);
    let y = pad + ((d.value - mn) / range) * (svgH - pad * 2);
    if (!invert) y = svgH - y;
    return { x, y, ...d };
  });
  const line = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const area = `${line} L${pts[pts.length - 1].x},${svgH} L${pts[0].x},${svgH} Z`;
  return (
    <svg viewBox={`0 0 ${svgW} ${svgH}`} style={{ width, height, display: "block" }}>
      <defs>
        <linearGradient id={`g-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#g-${color.replace("#", "")})`} />
      <path d={line} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {pts.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r={i === pts.length - 1 ? 5 : 3} fill={i === pts.length - 1 ? color : C.bg} stroke={color} strokeWidth="2" />
          {showLabels && <text x={p.x} y={svgH - 2} textAnchor="middle" fill={C.textDim} fontSize="9" fontFamily="Oswald">{p.date}</text>}
          {i === pts.length - 1 && (
            <text x={p.x + 8} y={p.y - 8} fill={color} fontSize="11" fontWeight="700" fontFamily="Oswald">{p.value}{unit}</text>
          )}
        </g>
      ))}
    </svg>
  );
}

function RadarChart({ data, size = 200 }) {
  const center = size / 2;
  const radius = size / 2 - 30;
  const categories = Object.keys(data);
  const n = categories.length;
  const angleStep = (2 * Math.PI) / n;

  const getPoint = (i, val) => {
    const angle = angleStep * i - Math.PI / 2;
    return { x: center + radius * val * Math.cos(angle), y: center + radius * val * Math.sin(angle) };
  };

  const polygonPts = categories.map((_, i) => getPoint(i, data[categories[i]])).map(p => `${p.x},${p.y}`).join(" ");

  return (
    <svg viewBox={`0 0 ${size} ${size}`} style={{ width: "100%", maxWidth: size, display: "block", margin: "0 auto" }}>
      {[0.25, 0.5, 0.75, 1].map(level => (
        <polygon key={level} points={categories.map((_, i) => getPoint(i, level)).map(p => `${p.x},${p.y}`).join(" ")}
          fill="none" stroke={C.cardBorder} strokeWidth="1" />
      ))}
      {categories.map((_, i) => {
        const p = getPoint(i, 1);
        return <line key={i} x1={center} y1={center} x2={p.x} y2={p.y} stroke={C.cardBorder} strokeWidth="1" />;
      })}
      <polygon points={polygonPts} fill={C.accent + "25"} stroke={C.accent} strokeWidth="2" />
      {categories.map((cat, i) => {
        const p = getPoint(i, 1.18);
        return <text key={cat} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle" fill={C.textSec} fontSize="9" fontFamily="Oswald" fontWeight="600">{cat}</text>;
      })}
    </svg>
  );
}

// ═══════════════════════════════════════════
// APP
// ═══════════════════════════════════════════
export default function App() {
  const [tab, setTab] = useState("timer");
  const [view, setView] = useState("home"); // home|setup|running
  const [mode, setMode] = useState("fortime");
  const [wodText, setWodText] = useState("");
  const [parsedWod, setParsedWod] = useState(null);
  const [timeInput, setTimeInput] = useState(12);
  const [emomInterval, setEmomInterval] = useState(1);
  const [prepTime, setPrepTime] = useState(10);
  const [recoveryTime, setRecoveryTime] = useState(0);

  // Timer
  const [phase, setPhase] = useState("idle"); // idle|prep|work|recovery|done
  const [seconds, setSeconds] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [currentMov, setCurrentMov] = useState(0);
  const [currentRound, setCurrentRound] = useState(1);
  const [isRest, setIsRest] = useState(false);
  const [tabataRound, setTabataRound] = useState(0);

  // PRs tab
  const [selectedPR, setSelectedPR] = useState("Back Squat");
  const [selectedBench, setSelectedBench] = useState("Fran");

  // Calendar
  const [calMonth, setCalMonth] = useState(2); // March = 2 (0-indexed)
  const [calYear] = useState(2026);
  const [selectedDate, setSelectedDate] = useState("2026-03-15");

  const intervalRef = useRef(null);
  const audioRef = useRef(null);

  const beep = useCallback((freq = 880, dur = 150) => {
    try {
      if (!audioRef.current) audioRef.current = new (window.AudioContext || window.webkitAudioContext)();
      const ctx = audioRef.current; const osc = ctx.createOscillator(); const g = ctx.createGain();
      osc.connect(g); g.connect(ctx.destination); osc.frequency.value = freq; g.gain.value = 0.3;
      osc.start(); osc.stop(ctx.currentTime + dur / 1000);
    } catch (e) {}
  }, []);

  const stop = useCallback(() => { setIsRunning(false); if (intervalRef.current) clearInterval(intervalRef.current); }, []);

  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current); }, []);

  const tick = useCallback(() => {
    setSeconds(prev => {
      // PREP phase countdown
      if (phase === "prep") {
        if (prev <= 1) {
          beep(880, 300);
          setPhase("work");
          const workTime = (mode === "chrono" || mode === "fortime") ? 0 : timeInput * 60;
          setTotalTime(workTime || timeInput * 60);
          return workTime || 0;
        }
        if (prev <= 4) beep(660, 80);
        return prev - 1;
      }
      // RECOVERY phase
      if (phase === "recovery") {
        if (prev <= 1) { stop(); setPhase("done"); beep(440, 600); return 0; }
        if (prev <= 4) beep(660, 80);
        return prev - 1;
      }
      // WORK phase
      if (mode === "chrono") return prev + 1;
      if (mode === "fortime") return prev + 1;
      if (mode === "minuteur" || mode === "amrap") {
        if (prev <= 1) {
          if (recoveryTime > 0) { setPhase("recovery"); beep(440, 300); return recoveryTime; }
          stop(); setPhase("done"); beep(440, 600); return 0;
        }
        if (prev <= 4 && prev > 1) beep(880, 100);
        return prev - 1;
      }
      if (mode === "emom") {
        if (prev <= 1) {
          if (recoveryTime > 0) { setPhase("recovery"); beep(440, 300); return recoveryTime; }
          stop(); setPhase("done"); beep(440, 600); return 0;
        }
        const interval = emomInterval * 60;
        const elapsed = totalTime - prev;
        if (elapsed > 0 && elapsed % interval === 0) beep(660, 200);
        if (prev <= 4) beep(880, 100);
        return prev - 1;
      }
      if (mode === "tabata") {
        if (prev <= 1) {
          if (isRest) {
            setIsRest(false);
            setTabataRound(r => {
              if (r >= 7) {
                if (recoveryTime > 0) { setPhase("recovery"); beep(440, 300); setSeconds(recoveryTime); return r; }
                stop(); setPhase("done"); beep(440, 600); return r;
              }
              return r + 1;
            });
            beep(880, 200); return 20;
          } else { setIsRest(true); beep(440, 150); return 10; }
        }
        if (prev <= 4) beep(880, 80);
        return prev - 1;
      }
      return prev;
    });
  }, [phase, mode, timeInput, emomInterval, recoveryTime, totalTime, isRest, stop, beep]);

  const startTimer = useCallback(() => {
    setIsRunning(true);
    intervalRef.current = setInterval(tick, 1000);
  }, [tick]);

  const handleStart = () => {
    setView("running");
    setCurrentMov(0); setCurrentRound(1); setIsRest(false); setTabataRound(0);
    if (prepTime > 0) {
      setPhase("prep"); setSeconds(prepTime); setTotalTime(prepTime);
      beep(660, 150);
      setTimeout(() => startTimer(), 300);
    } else {
      setPhase("work");
      const wt = (mode === "chrono" || mode === "fortime") ? 0 : timeInput * 60;
      setTotalTime(wt || timeInput * 60); setSeconds(wt || 0);
      beep(660, 150);
      setTimeout(() => startTimer(), 300);
    }
  };

  const handleStopForTime = () => {
    if (recoveryTime > 0) { stop(); setPhase("recovery"); setSeconds(recoveryTime); setTotalTime(recoveryTime); setTimeout(() => startTimer(), 100); }
    else { stop(); setPhase("done"); beep(440, 500); }
  };

  const togglePause = () => { if (isRunning) stop(); else { intervalRef.current = setInterval(tick, 1000); setIsRunning(true); } };

  const reset = () => { stop(); setPhase("idle"); setView("home"); };

  const nextMov = () => {
    if (!parsedWod) return;
    if (currentMov < parsedWod.movements.length - 1) { setCurrentMov(p => p + 1); beep(660, 100); }
    else { setCurrentMov(0); setCurrentRound(p => p + 1); beep(880, 200); }
  };

  const handleParse = () => {
    if (!wodText.trim()) return;
    const p = parseWodText(wodText);
    setParsedWod(p); setMode(p.mode);
    if (p.timeCap) setTimeInput(Math.round(p.timeCap / 60));
  };

  const meta = MODE_META[mode] || MODE_META.fortime;

  // ═══════════════════════════════════════
  // STYLES
  // ═══════════════════════════════════════
  const shell = { maxWidth: 420, margin: "0 auto", minHeight: "100vh", background: C.bg, fontFamily: "'DM Sans', -apple-system, sans-serif", color: C.text };
  const page = { ...shell, padding: "12px 16px 100px" };
  const label = { fontSize: 10, fontWeight: 700, color: C.textDim, letterSpacing: 2, fontFamily: "'Oswald', sans-serif", marginBottom: 8 };
  const cardStyle = { background: C.card, borderRadius: 14, border: `1px solid ${C.cardBorder}`, padding: 16, marginBottom: 12 };

  // ═══════════════════════════════════════
  // TIMER RUNNING VIEW
  // ═══════════════════════════════════════
  if (tab === "timer" && view === "running") {
    const ringColor = phase === "prep" ? C.yellow : phase === "recovery" ? C.purple : meta.color;
    const ringTotal = phase === "prep" ? prepTime : phase === "recovery" ? recoveryTime : (totalTime || Math.max(seconds, 1));
    const isCountdown = mode !== "chrono" && mode !== "fortime";
    const progress = phase === "prep" || phase === "recovery" || isCountdown
      ? (ringTotal > 0 ? seconds / ringTotal : 0)
      : (ringTotal > 0 ? seconds / ringTotal : 0);
    const circ = 2 * Math.PI * 115;
    const offset = circ * (1 - Math.min(progress, 1));
    const warn = phase === "work" && isCountdown && seconds <= 10 && seconds > 0;

    return (
      <div style={{ ...shell, padding: 16, display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700;800;900&family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        {/* Phase badge */}
        <div style={{ textAlign: "center", marginTop: 8, marginBottom: 4 }}>
          <span style={{ display: "inline-block", padding: "4px 16px", borderRadius: 8, background: ringColor + "18", color: ringColor, fontSize: 12, fontWeight: 800, letterSpacing: 2, fontFamily: "'Oswald'" }}>
            {phase === "prep" ? "PR\u00C9PARATION" : phase === "recovery" ? "R\u00C9CUP\u00C9RATION" : phase === "done" ? "TERMIN\u00C9" : meta.label}
            {phase === "work" && parsedWod?.rounds ? ` \u00B7 ROUND ${currentRound}` : ""}
          </span>
        </div>
        {mode === "tabata" && phase === "work" && (
          <div style={{ textAlign: "center", marginBottom: 2 }}>
            <span style={{ fontSize: 16, fontWeight: 900, fontFamily: "'Oswald'", color: isRest ? C.green : C.accent, letterSpacing: 3 }}>{isRest ? "REPOS" : "EFFORT"}</span>
            <span style={{ fontSize: 11, color: C.textDim, marginLeft: 8 }}>Round {tabataRound + 1}/8</span>
          </div>
        )}
        {mode === "emom" && phase === "work" && totalTime > 0 && (
          <div style={{ textAlign: "center", marginBottom: 2 }}>
            <span style={{ fontSize: 12, color: C.textDim }}>Min {Math.floor((totalTime - seconds) / (emomInterval * 60)) + 1}/{Math.round(totalTime / (emomInterval * 60))}</span>
          </div>
        )}
        {/* Ring */}
        <div style={{ position: "relative", width: 260, height: 260, margin: "8px auto 16px" }}>
          <svg width="260" height="260" style={{ transform: "rotate(-90deg)" }}>
            <circle cx="130" cy="130" r="115" fill="none" stroke={C.cardBorder} strokeWidth="5" />
            <circle cx="130" cy="130" r="115" fill="none" stroke={warn ? C.accent : ringColor} strokeWidth="5"
              strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
              style={{ transition: "stroke-dashoffset 0.4s ease, stroke 0.3s" }} />
          </svg>
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", textAlign: "center",
            animation: warn && isRunning ? "pulse .5s ease-in-out infinite" : "none" }}>
            <div style={{ fontSize: 54, fontWeight: 900, fontFamily: "'Oswald'", color: warn ? C.accent : C.text, letterSpacing: 2, lineHeight: 1,
              textShadow: isRunning ? `0 0 24px ${(warn ? C.accent : ringColor) + "50"}` : "none" }}>{fmt(seconds)}</div>
            {phase === "prep" && <div style={{ fontSize: 11, color: C.yellow, fontWeight: 700, marginTop: 4, fontFamily: "'Oswald'", letterSpacing: 2 }}>PR\u00CAT ?</div>}
            {phase === "done" && <div style={{ fontSize: 13, color: C.green, fontWeight: 800, marginTop: 4, fontFamily: "'Oswald'", letterSpacing: 2 }}>TERMIN\u00C9 !</div>}
          </div>
        </div>
        {/* Movements */}
        {parsedWod && parsedWod.movements.length > 0 && phase === "work" && (
          <div style={{ ...cardStyle, padding: 12 }}>
            <div style={label}>MOUVEMENT {currentMov + 1}/{parsedWod.movements.length}</div>
            {parsedWod.movements.map((mv, i) => {
              const cur = i === currentMov, done = i < currentMov;
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 8px", borderRadius: 8,
                  background: cur ? C.accentSoft : "transparent", border: cur ? `1px solid ${C.accent}30` : "1px solid transparent",
                  opacity: done ? 0.35 : 1, marginBottom: 2, transition: "all .2s" }}>
                  <div style={{ width: 22, height: 22, borderRadius: 6, background: done ? C.green : cur ? C.accent : C.surface,
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: C.white, flexShrink: 0 }}>
                    {done ? "\u2713" : mv.reps || "\u2014"}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: cur ? 800 : 600, color: cur ? C.text : C.textSec, textDecoration: done ? "line-through" : "none" }}>{mv.name}</div>
                    {mv.suggested && cur && <div style={{ fontSize: 10, color: C.orange, marginTop: 1 }}>\uD83D\uDCA1 {mv.suggested}</div>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {/* Controls */}
        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: "auto", paddingBottom: 24 }}>
          <button onClick={reset} style={{ width: 52, height: 52, borderRadius: 14, background: C.card, border: `1px solid ${C.cardBorder}`, color: C.textSec, fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>\u2715</button>
          {phase !== "done" && (
            <button onClick={togglePause} style={{ width: 72, height: 72, borderRadius: 18,
              background: isRunning ? C.card : `linear-gradient(135deg, ${ringColor}, ${ringColor}CC)`,
              border: isRunning ? `2px solid ${ringColor}` : "none", color: isRunning ? ringColor : C.white,
              fontSize: 24, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: isRunning ? "none" : `0 4px 20px ${ringColor}40` }}>
              {isRunning ? "\u275A\u275A" : "\u25B6"}</button>
          )}
          {phase === "done" && (
            <button onClick={reset} style={{ height: 52, borderRadius: 14, background: C.green + "20", border: `1px solid ${C.green}40`,
              color: C.green, fontSize: 13, fontWeight: 800, cursor: "pointer", padding: "0 24px", fontFamily: "'Oswald'", letterSpacing: 1 }}>NOUVEAU WOD</button>
          )}
          {parsedWod && parsedWod.movements.length > 0 && phase === "work" && (
            <button onClick={nextMov} style={{ width: 52, height: 52, borderRadius: 14, background: C.card, border: `1px solid ${C.cardBorder}`, color: C.green, fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>\u2192</button>
          )}
          {mode === "fortime" && phase === "work" && (
            <button onClick={handleStopForTime} style={{ width: 52, height: 52, borderRadius: 14, background: C.green + "18", border: `1px solid ${C.green}40`,
              color: C.green, fontSize: 12, fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Oswald'", letterSpacing: 1 }}>STOP</button>
          )}
          {mode === "chrono" && phase === "work" && (
            <button onClick={() => { stop(); setPhase("done"); beep(440, 500); }} style={{ width: 52, height: 52, borderRadius: 14, background: C.accent + "18", border: `1px solid ${C.accent}40`,
              color: C.accent, fontSize: 12, fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Oswald'" }}>FIN</button>
          )}
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════
  // TAB: TIMER (home + setup)
  // ═══════════════════════════════════════
  const TimerTab = () => {
    if (view === "setup") return (
      <div>
        <button onClick={() => setView("home")} style={{ background: "none", border: "none", color: C.accent, fontSize: 12, fontWeight: 700, cursor: "pointer", marginBottom: 10 }}>\u2190 Retour</button>
        <div style={{ fontSize: 20, fontWeight: 900, fontFamily: "'Oswald'", letterSpacing: 2, marginBottom: 14 }}>CONFIGURATION</div>
        {/* WOD parse */}
        <div style={cardStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
            <span style={{ fontSize: 14 }}>\uD83E\uDDE0</span>
            <span style={{ ...label, marginBottom: 0 }}>COLLE TON WOD</span>
          </div>
          <textarea value={wodText} onChange={e => setWodText(e.target.value)}
            placeholder={"Ex:\nAMRAP 12\n10 Thrusters (43kg)\n15 Box Jumps\n20 Double Unders"}
            style={{ width: "100%", minHeight: 80, background: C.surface, border: `1px solid ${C.cardBorder}`, borderRadius: 10, padding: 10, color: C.text, fontSize: 12, fontFamily: "'DM Sans', monospace", resize: "vertical", outline: "none", boxSizing: "border-box" }} />
          <button onClick={handleParse} style={{ width: "100%", marginTop: 6, background: C.surface, border: `1px solid ${C.accent}40`, borderRadius: 10, padding: 8, color: C.accent, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>\uD83D\uDD0D Analyser</button>
        </div>
        {parsedWod && (
          <div style={{ background: C.accentSoft, borderRadius: 10, padding: 10, marginBottom: 12, border: `1px solid ${C.accent}20` }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: C.accent, letterSpacing: 1 }}>\u2713 </span>
            <span style={{ fontSize: 12, color: C.text }}>{MODE_META[parsedWod.mode]?.label}{parsedWod.timeCap ? ` \u00B7 ${Math.round(parsedWod.timeCap / 60)} min` : ""}{parsedWod.movements.length > 0 ? ` \u00B7 ${parsedWod.movements.length} mvts` : ""}</span>
          </div>
        )}
        {/* Mode */}
        <div style={label}>MODE</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, marginBottom: 16 }}>
          {Object.entries(MODE_META).map(([k, m]) => (
            <button key={k} onClick={() => setMode(k)} style={{
              background: mode === k ? m.color : C.card, border: mode === k ? "none" : `1px solid ${C.cardBorder}`,
              borderRadius: 10, padding: "10px 4px", cursor: "pointer",
              boxShadow: mode === k ? `0 3px 16px ${m.color}35` : "none", transition: "all .2s" }}>
              <div style={{ fontSize: 16, lineHeight: 1 }}>{m.icon}</div>
              <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: 1.5, color: mode === k ? C.white : C.textSec, marginTop: 2, fontFamily: "'Oswald'" }}>{m.label}</div>
            </button>
          ))}
        </div>
        {/* Time */}
        {!["chrono", "fortime"].includes(mode) && (
          <div style={{ marginBottom: 14 }}>
            <div style={label}>{mode === "tabata" ? "ROUNDS" : "DUR\u00C9E (min)"}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "center" }}>
              <button onClick={() => setTimeInput(Math.max(1, timeInput - 1))} style={{ width: 40, height: 40, borderRadius: 10, background: C.card, border: `1px solid ${C.cardBorder}`, color: C.text, fontSize: 18, cursor: "pointer" }}>\u2212</button>
              <div style={{ fontSize: 36, fontWeight: 900, fontFamily: "'Oswald'", color: meta.color, minWidth: 60, textAlign: "center" }}>{mode === "tabata" ? timeInput * 8 : timeInput}</div>
              <button onClick={() => setTimeInput(timeInput + 1)} style={{ width: 40, height: 40, borderRadius: 10, background: C.card, border: `1px solid ${C.cardBorder}`, color: C.text, fontSize: 18, cursor: "pointer" }}>+</button>
            </div>
          </div>
        )}
        {mode === "emom" && (
          <div style={{ display: "flex", gap: 6, justifyContent: "center", marginBottom: 14 }}>
            {[1, 2, 3].map(v => (
              <button key={v} onClick={() => setEmomInterval(v)} style={{ padding: "6px 16px", borderRadius: 8, background: emomInterval === v ? C.blue : C.card, border: emomInterval === v ? "none" : `1px solid ${C.cardBorder}`, color: C.text, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>E{v}MOM</button>
            ))}
          </div>
        )}
        {/* Prep & Recovery */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
          <div style={cardStyle}>
            <div style={{ ...label, color: C.yellow }}>\u23F3 PR\u00C9PARATION</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center" }}>
              <button onClick={() => setPrepTime(Math.max(0, prepTime - 5))} style={{ width: 32, height: 32, borderRadius: 8, background: C.surface, border: "none", color: C.text, fontSize: 16, cursor: "pointer" }}>\u2212</button>
              <span style={{ fontSize: 24, fontWeight: 900, fontFamily: "'Oswald'", color: C.yellow }}>{prepTime}s</span>
              <button onClick={() => setPrepTime(prepTime + 5)} style={{ width: 32, height: 32, borderRadius: 8, background: C.surface, border: "none", color: C.text, fontSize: 16, cursor: "pointer" }}>+</button>
            </div>
          </div>
          <div style={cardStyle}>
            <div style={{ ...label, color: C.purple }}>\uD83E\uDDD8 R\u00C9CUP\u00C9RATION</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center" }}>
              <button onClick={() => setRecoveryTime(Math.max(0, recoveryTime - 15))} style={{ width: 32, height: 32, borderRadius: 8, background: C.surface, border: "none", color: C.text, fontSize: 16, cursor: "pointer" }}>\u2212</button>
              <span style={{ fontSize: 24, fontWeight: 900, fontFamily: "'Oswald'", color: C.purple }}>{recoveryTime}s</span>
              <button onClick={() => setRecoveryTime(recoveryTime + 15)} style={{ width: 32, height: 32, borderRadius: 8, background: C.surface, border: "none", color: C.text, fontSize: 16, cursor: "pointer" }}>+</button>
            </div>
          </div>
        </div>
        {/* Movements */}
        {parsedWod && parsedWod.movements.length > 0 && (
          <div style={{ marginBottom: 14 }}>
            <div style={label}>MOUVEMENTS & SCALING</div>
            {parsedWod.movements.map((mv, i) => (
              <div key={i} style={{ background: C.card, borderRadius: 8, padding: "8px 10px", marginBottom: 3, border: `1px solid ${C.cardBorder}`, display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 24, height: 24, borderRadius: 6, background: C.surface, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: meta.color, flexShrink: 0 }}>{mv.reps || "\u2014"}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: C.text }}>{mv.name}</div>
                  {mv.suggested && <div style={{ fontSize: 10, color: C.orange, marginTop: 1 }}>\uD83D\uDCA1 {mv.suggested}</div>}
                </div>
                {mv.weight && <span style={{ fontSize: 10, fontWeight: 700, color: C.textDim, background: C.surface, padding: "2px 6px", borderRadius: 4 }}>{mv.weight}</span>}
              </div>
            ))}
          </div>
        )}
        <button onClick={handleStart} style={{ width: "100%", padding: 16, borderRadius: 14, border: "none", background: `linear-gradient(135deg, ${meta.color}, ${meta.color}CC)`, color: C.white, fontSize: 16, fontWeight: 900, cursor: "pointer", fontFamily: "'Oswald'", letterSpacing: 3, boxShadow: `0 4px 24px ${meta.color}35`, marginBottom: 20 }}>\u25B6 D\u00C9PART</button>
      </div>
    );

    // Timer home
    return (
      <div>
        <div style={{ textAlign: "center", padding: "16px 0 12px" }}>
          <div style={{ fontSize: 32, fontWeight: 900, fontFamily: "'Oswald'", letterSpacing: 4 }}>WOD<span style={{ color: C.accent }}>TIMER</span></div>
          <div style={{ fontSize: 10, color: C.textDim, letterSpacing: 3, fontFamily: "'Oswald'" }}>TIMER CROSSFIT INTELLIGENT</div>
        </div>
        <button onClick={() => { setWodText(""); setParsedWod(null); setView("setup"); }} style={{ width: "100%", background: `linear-gradient(135deg, ${C.accent}, #CC1640)`, border: "none", borderRadius: 14, padding: "16px 18px", cursor: "pointer", boxShadow: `0 4px 24px ${C.accentGlow}`, marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
          <span style={{ fontSize: 22 }}>\u26A1</span>
          <div style={{ textAlign: "left" }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: C.white, fontFamily: "'Oswald'", letterSpacing: 1 }}>NOUVEAU TIMER</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,.6)" }}>Colle ton WOD ou choisis un mode</div>
          </div>
        </button>
        <div style={label}>WODS RAPIDES</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 16 }}>
          {PRESETS.map(p => (
            <button key={p.name} onClick={() => { setWodText(p.text); const pr = parseWodText(p.text); setParsedWod(pr); setMode(pr.mode); if (pr.timeCap) setTimeInput(Math.round(pr.timeCap / 60)); setView("setup"); }}
              style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 10, padding: "12px 10px", cursor: "pointer", textAlign: "left" }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: C.text, fontFamily: "'Oswald'" }}>{p.name}</div>
              <div style={{ fontSize: 10, color: C.textDim, marginTop: 2 }}>{p.text.split("\n")[0]}</div>
            </button>
          ))}
        </div>
      </div>
    );
  };

  // ═══════════════════════════════════════
  // TAB: CALENDAR
  // ═══════════════════════════════════════
  const CalendarTab = () => {
    const months = ["Janvier", "F\u00E9vrier", "Mars", "Avril", "Mai", "Juin", "Juillet", "Ao\u00FBt", "Septembre", "Octobre", "Novembre", "D\u00E9cembre"];
    const firstDay = new Date(calYear, calMonth, 1).getDay();
    const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
    const calOffset = firstDay === 0 ? 6 : firstDay - 1;
    const cells = [];
    for (let i = 0; i < calOffset; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);

    const selWod = selectedDate ? CALENDAR_WODS[selectedDate] : null;

    return (
      <div>
        <div style={{ fontSize: 20, fontWeight: 900, fontFamily: "'Oswald'", letterSpacing: 2, marginBottom: 14 }}>CALENDRIER</div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <button onClick={() => setCalMonth(Math.max(0, calMonth - 1))} style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 8, width: 32, height: 32, color: C.text, cursor: "pointer", fontSize: 14 }}>\u2190</button>
          <span style={{ fontSize: 16, fontWeight: 800, fontFamily: "'Oswald'", letterSpacing: 1, color: C.text }}>{months[calMonth]} {calYear}</span>
          <button onClick={() => setCalMonth(Math.min(11, calMonth + 1))} style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 8, width: 32, height: 32, color: C.text, cursor: "pointer", fontSize: 14 }}>\u2192</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 3, marginBottom: 12 }}>
          {["L", "M", "M", "J", "V", "S", "D"].map((d, i) => (
            <div key={i} style={{ textAlign: "center", fontSize: 10, fontWeight: 700, color: C.textDim, padding: 4, fontFamily: "'Oswald'" }}>{d}</div>
          ))}
          {cells.map((day, i) => {
            if (!day) return <div key={i} />;
            const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const wod = CALENDAR_WODS[dateStr];
            const isSel = dateStr === selectedDate;
            const isToday = dateStr === "2026-03-15";
            return (
              <button key={i} onClick={() => setSelectedDate(dateStr)} style={{
                aspectRatio: "1", borderRadius: 10, border: isSel ? `2px solid ${C.accent}` : isToday ? `1px solid ${C.accent}50` : `1px solid ${C.cardBorder}`,
                background: isSel ? C.accentSoft : wod ? C.card : C.surface, cursor: "pointer",
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 2, position: "relative",
              }}>
                <span style={{ fontSize: 13, fontWeight: isToday ? 900 : 600, color: isToday ? C.accent : C.text, fontFamily: "'Oswald'" }}>{day}</span>
                {wod && <div style={{ width: 5, height: 5, borderRadius: "50%", background: MODE_META[wod.mode]?.color || C.accent, marginTop: 2 }} />}
              </button>
            );
          })}
        </div>
        {selWod ? (
          <div style={cardStyle}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: (MODE_META[selWod.mode]?.color || C.accent) + "18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: MODE_META[selWod.mode]?.color }}>{MODE_META[selWod.mode]?.icon}</div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 800, color: C.text, fontFamily: "'Oswald'", letterSpacing: 1 }}>{selWod.name}</div>
                <div style={{ fontSize: 10, color: C.textDim }}>{selectedDate} \u00B7 {MODE_META[selWod.mode]?.label}</div>
              </div>
            </div>
            <div style={{ fontSize: 12, color: C.textSec, marginBottom: 8, lineHeight: 1.5 }}>{selWod.desc}</div>
            {selWod.score ? (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 10, color: C.textDim }}>Score</span>
                <span style={{ fontSize: 16, fontWeight: 900, color: MODE_META[selWod.mode]?.color, fontFamily: "'Oswald'" }}>{selWod.score}</span>
              </div>
            ) : (
              <button onClick={() => { setWodText(selWod.desc); handleParse(); setView("setup"); setTab("timer"); }}
                style={{ width: "100%", padding: 10, borderRadius: 10, border: "none", background: C.accent, color: C.white, fontSize: 12, fontWeight: 800, cursor: "pointer", fontFamily: "'Oswald'", letterSpacing: 1 }}>\u25B6 LANCER CE WOD</button>
            )}
          </div>
        ) : (
          <div style={{ ...cardStyle, textAlign: "center", color: C.textDim, fontSize: 12, padding: 24 }}>Aucun WOD ce jour</div>
        )}
      </div>
    );
  };

  // ═══════════════════════════════════════
  // TAB: PRs
  // ═══════════════════════════════════════
  const PRsTab = () => (
    <div>
      <div style={{ fontSize: 20, fontWeight: 900, fontFamily: "'Oswald'", letterSpacing: 2, marginBottom: 14 }}>RECORDS PERSONNELS</div>
      {/* PR selector */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
        {Object.keys(PR_DATA).map(name => (
          <button key={name} onClick={() => setSelectedPR(name)} style={{
            padding: "5px 10px", borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: "pointer",
            background: selectedPR === name ? C.accent : C.card, border: selectedPR === name ? "none" : `1px solid ${C.cardBorder}`,
            color: selectedPR === name ? C.white : C.textSec, transition: "all .2s",
          }}>{name}</button>
        ))}
      </div>
      {/* Chart */}
      <div style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <span style={{ fontSize: 14, fontWeight: 800, fontFamily: "'Oswald'", color: C.text, letterSpacing: 1 }}>{selectedPR}</span>
          <span style={{ fontSize: 20, fontWeight: 900, fontFamily: "'Oswald'", color: C.accent }}>{USER_PRS[selectedPR.toLowerCase()]} kg</span>
        </div>
        <MiniChart data={PR_DATA[selectedPR]} color={C.accent} height={100} showLabels unit="kg" />
        {/* Percentages */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 4, marginTop: 10 }}>
          {[95, 90, 85, 80, 75, 70, 65, 60].map(pct => (
            <div key={pct} style={{ background: C.surface, borderRadius: 6, padding: "4px 0", textAlign: "center" }}>
              <div style={{ fontSize: 9, color: C.textDim }}>{pct}%</div>
              <div style={{ fontSize: 12, fontWeight: 800, color: C.text, fontFamily: "'Oswald'" }}>{Math.round(USER_PRS[selectedPR.toLowerCase()] * pct / 100)}</div>
            </div>
          ))}
        </div>
      </div>
      {/* Benchmarks */}
      <div style={{ ...label, marginTop: 8 }}>BENCHMARKS</div>
      <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
        {Object.keys(BENCHMARKS).map(b => (
          <button key={b} onClick={() => setSelectedBench(b)} style={{
            padding: "5px 12px", borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: "pointer",
            background: selectedBench === b ? C.green : C.card, border: selectedBench === b ? "none" : `1px solid ${C.cardBorder}`,
            color: selectedBench === b ? C.white : C.textSec,
          }}>{b}</button>
        ))}
      </div>
      <div style={cardStyle}>
        <div style={{ fontSize: 13, fontWeight: 800, fontFamily: "'Oswald'", color: C.text, marginBottom: 4 }}>{selectedBench}</div>
        <MiniChart data={BENCHMARKS[selectedBench]} color={C.green} height={80} showLabels
          unit={selectedBench === "Cindy" ? " rds" : "s"} invert={selectedBench !== "Cindy"} />
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
          <span style={{ fontSize: 10, color: C.textDim }}>Premier score</span>
          <span style={{ fontSize: 10, color: C.textDim }}>Dernier score</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: 13, fontWeight: 800, color: C.textSec, fontFamily: "'Oswald'" }}>
            {selectedBench === "Cindy" ? BENCHMARKS[selectedBench][0].value + " rds" : fmt(BENCHMARKS[selectedBench][0].value)}
          </span>
          <span style={{ fontSize: 13, fontWeight: 800, color: C.green, fontFamily: "'Oswald'" }}>
            {selectedBench === "Cindy" ? BENCHMARKS[selectedBench].slice(-1)[0].value + " rds" : fmt(BENCHMARKS[selectedBench].slice(-1)[0].value)}
          </span>
        </div>
      </div>
    </div>
  );

  // ═══════════════════════════════════════
  // TAB: ANALYSIS
  // ═══════════════════════════════════════
  const AnalysisTab = () => {
    const radarData = { "Squat": 0.88, "Pull": 0.72, "Push": 0.65, "Oly": 0.78, "Cardio": 0.70, "Gym": 0.60 };
    const ratios = [
      { label: "Front/Back Squat", value: (125 / 145 * 100).toFixed(0), target: "85%", color: (125 / 145) >= 0.83 ? C.green : C.orange },
      { label: "Clean/Deadlift", value: (105 / 190 * 100).toFixed(0), target: "55-60%", color: (105 / 190) >= 0.55 ? C.green : C.orange },
      { label: "Snatch/Clean", value: (85 / 105 * 100).toFixed(0), target: "80%", color: (85 / 105) >= 0.78 ? C.green : C.orange },
      { label: "Press/Push Press", value: (60 / 75 * 100).toFixed(0), target: "80%", color: (60 / 75) >= 0.78 ? C.green : C.orange },
    ];

    return (
      <div>
        <div style={{ fontSize: 20, fontWeight: 900, fontFamily: "'Oswald'", letterSpacing: 2, marginBottom: 14 }}>ANALYSE</div>
        {/* Radar */}
        <div style={cardStyle}>
          <div style={label}>PROFIL ATHL\u00C8TE</div>
          <RadarChart data={radarData} size={200} />
        </div>
        {/* Ratios */}
        <div style={cardStyle}>
          <div style={label}>RATIOS DE FORCE</div>
          {ratios.map((r, i) => (
            <div key={i} style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                <span style={{ fontSize: 12, color: C.text, fontWeight: 600 }}>{r.label}</span>
                <span style={{ fontSize: 12, fontWeight: 800, color: r.color, fontFamily: "'Oswald'" }}>{r.value}% <span style={{ fontSize: 10, color: C.textDim, fontWeight: 400 }}>cible {r.target}</span></span>
              </div>
              <div style={{ height: 6, background: C.surface, borderRadius: 3, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${Math.min(parseInt(r.value), 100)}%`, background: r.color, borderRadius: 3, transition: "width .5s" }} />
              </div>
            </div>
          ))}
        </div>
        {/* Weight */}
        <div style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
            <span style={label}>POIDS DE CORPS</span>
            <span style={{ fontSize: 16, fontWeight: 900, fontFamily: "'Oswald'", color: C.cyan }}>{USER.weight} kg</span>
          </div>
          <MiniChart data={WEIGHT_LOG} color={C.cyan} height={70} showLabels unit="kg" invert />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
            <span style={{ fontSize: 10, color: C.textDim }}>Objectif: {USER.goal}</span>
            <span style={{ fontSize: 10, color: C.green }}>-4kg depuis Jan</span>
          </div>
        </div>
        {/* Relative strength */}
        <div style={cardStyle}>
          <div style={label}>FORCE RELATIVE (kg soulev\u00E9s / poids de corps)</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {[
              { name: "Back Squat", val: 145 }, { name: "Deadlift", val: 190 },
              { name: "Clean & Jerk", val: 110 }, { name: "Snatch", val: 85 },
            ].map(m => (
              <div key={m.name} style={{ background: C.surface, borderRadius: 8, padding: "8px 10px", textAlign: "center" }}>
                <div style={{ fontSize: 10, color: C.textDim, marginBottom: 2 }}>{m.name}</div>
                <div style={{ fontSize: 20, fontWeight: 900, fontFamily: "'Oswald'", color: C.accent }}>{(m.val / USER.weight).toFixed(2)}x</div>
                <div style={{ fontSize: 10, color: C.textSec }}>{m.val} kg</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // ═══════════════════════════════════════
  // TAB: PROFILE
  // ═══════════════════════════════════════
  const ProfileTab = () => (
    <div>
      <div style={{ fontSize: 20, fontWeight: 900, fontFamily: "'Oswald'", letterSpacing: 2, marginBottom: 14 }}>PROFIL</div>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
        <div style={{ width: 56, height: 56, borderRadius: 14, background: `linear-gradient(135deg, ${C.accent}, #CC1640)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 900, color: C.white, boxShadow: `0 4px 16px ${C.accentGlow}` }}>{USER.avatar}</div>
        <div>
          <div style={{ fontSize: 18, fontWeight: 800, fontFamily: "'Oswald'", color: C.text }}>{USER.name}</div>
          <div style={{ fontSize: 11, color: C.textDim }}>{USER.box} \u00B7 Depuis {USER.since}</div>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 16 }}>
        {[
          { label: "Poids", value: `${USER.weight}kg`, color: C.cyan },
          { label: "Taille", value: `${USER.height}cm`, color: C.blue },
          { label: "Objectif", value: USER.goal, color: C.green },
        ].map((s, i) => (
          <div key={i} style={{ background: C.card, borderRadius: 12, padding: "12px 8px", textAlign: "center", border: `1px solid ${C.cardBorder}` }}>
            <div style={{ fontSize: 18, fontWeight: 900, fontFamily: "'Oswald'", color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 9, color: C.textDim, marginTop: 2, letterSpacing: 1, fontFamily: "'Oswald'" }}>{s.label}</div>
          </div>
        ))}
      </div>
      <div style={cardStyle}>
        <div style={label}>R\u00C9SUM\u00C9 MENSUEL</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[
            { label: "S\u00E9ances", value: "14", icon: "\uD83C\uDFCB\uFE0F" },
            { label: "Moyenne/sem", value: "3.5", icon: "\uD83D\uDCCA" },
            { label: "PRs battus", value: "3", icon: "\uD83C\uDFC6" },
            { label: "S\u00E9rie", value: "3 sem", icon: "\uD83D\uDD25" },
          ].map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0" }}>
              <span style={{ fontSize: 18 }}>{s.icon}</span>
              <div>
                <div style={{ fontSize: 16, fontWeight: 800, fontFamily: "'Oswald'", color: C.text }}>{s.value}</div>
                <div style={{ fontSize: 10, color: C.textDim }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={cardStyle}>
        <div style={label}>TOP PRs</div>
        {Object.entries(USER_PRS).slice(0, 6).map(([name, val], i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: i < 5 ? `1px solid ${C.cardBorder}` : "none" }}>
            <span style={{ fontSize: 12, color: C.textSec, textTransform: "capitalize" }}>{name}</span>
            <span style={{ fontSize: 14, fontWeight: 800, fontFamily: "'Oswald'", color: C.accent }}>{val} kg</span>
          </div>
        ))}
      </div>
    </div>
  );

  // ═══════════════════════════════════════
  // MAIN RENDER
  // ═══════════════════════════════════════
  const tabs = [
    { id: "timer", icon: "\u23F1", label: "Timer" },
    { id: "calendar", icon: "\uD83D\uDCC5", label: "WODs" },
    { id: "prs", icon: "\uD83C\uDFC6", label: "PRs" },
    { id: "analysis", icon: "\uD83D\uDCCA", label: "Analyse" },
    { id: "profile", icon: "\uD83D\uDC64", label: "Profil" },
  ];

  return (
    <div style={page}>
      <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700;800;900&family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}} *{-webkit-tap-highlight-color:transparent;} button:active{transform:scale(.97)!important;}`}</style>

      {tab === "timer" && <TimerTab />}
      {tab === "calendar" && <CalendarTab />}
      {tab === "prs" && <PRsTab />}
      {tab === "analysis" && <AnalysisTab />}
      {tab === "profile" && <ProfileTab />}

      {/* Nav */}
      <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: 420, background: "rgba(7,7,13,.92)", backdropFilter: "blur(16px)", borderTop: `1px solid ${C.cardBorder}`, display: "flex", padding: "6px 0 22px", zIndex: 50 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => { setTab(t.id); if (t.id === "timer") setView("home"); }} style={{
            flex: 1, background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 1, padding: "4px 0",
          }}>
            <span style={{ fontSize: 18, filter: tab === t.id ? `drop-shadow(0 0 6px ${C.accent})` : "none", transition: "all .2s" }}>{t.icon}</span>
            <span style={{ fontSize: 9, fontWeight: 700, color: tab === t.id ? C.accent : C.textDim, fontFamily: "'Oswald'", letterSpacing: 0.5, transition: "all .2s" }}>{t.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
