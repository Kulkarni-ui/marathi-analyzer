import { useState } from "react";

const MH_DISTRICTS = {
  "Pune": { x: 180, y: 220 }, "Nashik": { x: 160, y: 140 }, "Mumbai": { x: 110, y: 180 },
  "Nagpur": { x: 340, y: 150 }, "Aurangabad": { x: 220, y: 180 }, "Kolhapur": { x: 150, y: 290 },
  "Solapur": { x: 220, y: 260 }, "Satara": { x: 170, y: 255 }, "Sangli": { x: 175, y: 278 },
  "Ahmednagar": { x: 195, y: 205 }, "Amravati": { x: 295, y: 145 }, "Latur": { x: 245, y: 280 },
  "Nanded": { x: 270, y: 265 }, "Osmanabad": { x: 248, y: 268 }, "Wardha": { x: 320, y: 165 },
  "Yavatmal": { x: 310, y: 190 }, "Jalna": { x: 235, y: 190 }, "Beed": { x: 228, y: 235 },
  "Parbhani": { x: 255, y: 220 }, "Hingoli": { x: 265, y: 205 }, "Buldhana": { x: 270, y: 165 },
  "Akola": { x: 285, y: 155 }, "Washim": { x: 285, y: 175 }, "Chandrapur": { x: 355, y: 210 },
  "Gadchiroli": { x: 380, y: 230 }, "Gondia": { x: 385, y: 145 }, "Bhandara": { x: 365, y: 155 },
  "Raigad": { x: 130, y: 210 }, "Ratnagiri": { x: 130, y: 255 }, "Sindhudurg": { x: 130, y: 300 },
  "Thane": { x: 120, y: 170 }, "Dhule": { x: 155, y: 120 }, "Nandurbar": { x: 140, y: 100 },
  "Jalgaon": { x: 190, y: 115 },
};

const LANG_FLAGS = { Hindi: "🇮🇳", Tamil: "🇮🇳", English: "🇬🇧", Swahili: "🇰🇪" };

// ─── Groq API ─────────────────────────────────────────────────────────────────
async function callGroq(prompt) {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      temperature: 0.4,
      max_tokens: 1800,
      messages: [{ role: "user", content: prompt }]
    })
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  const raw = data.choices?.[0]?.message?.content || "";
  const clean = raw.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function RichnessScore(text) {
  const words = text.match(/\S+/g) || [];
  if (!words.length) return 0;
  const unique = new Set(words);
  const lexDiv = unique.size / words.length;
  const avgLen = words.reduce((s, w) => s + w.length, 0) / words.length;
  return Math.round(((0.6 * lexDiv) + (0.4 * (avgLen / 10))) * 1000) / 1000;
}

// ─── Score Ring ───────────────────────────────────────────────────────────────
function ScoreRing({ score }) {
  const pct = Math.min(score * 100, 100);
  const r = 44, circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  const color = score > 0.7 ? "#a78bfa" : score > 0.4 ? "#f59e0b" : "#f87171";
  return (
    <div style={{ position: "relative", width: 110, height: 110, flexShrink: 0 }}>
      <svg width="110" height="110" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="55" cy="55" r={r} fill="none" stroke="#1e1b2e" strokeWidth="8" />
        <circle cx="55" cy="55" r={r} fill="none" stroke={color} strokeWidth="8"
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          style={{ transition: "stroke-dasharray 1.2s cubic-bezier(.4,0,.2,1)" }} />
      </svg>
      <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: 22, fontWeight: 800, color, fontFamily: "'Playfair Display', serif" }}>{score}</span>
        <span style={{ fontSize: 9, color: "#6b7280", letterSpacing: 2, textTransform: "uppercase", fontFamily: "monospace" }}>richness</span>
      </div>
    </div>
  );
}

// ─── Expandable Section ───────────────────────────────────────────────────────
function Section({ icon, title, children, delay = 0, accentColor = "#7c3aed" }) {
  const [open, setOpen] = useState(true);
  return (
    <div style={{
      background: "linear-gradient(135deg, #13111f 0%, #1a1730 100%)",
      border: "1px solid #2d2a45", borderRadius: 16, overflow: "hidden",
      animation: "fadeSlide 0.5s ease both", animationDelay: `${delay}ms`,
      marginBottom: 12
    }}>
      <button onClick={() => setOpen(o => !o)}
        style={{
          width: "100%", background: "none", border: "none",
          padding: "18px 22px", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "space-between"
        }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 16 }}>{icon}</span>
          <span style={{ fontSize: 10, color: accentColor, letterSpacing: 3, textTransform: "uppercase", fontFamily: "monospace" }}>{title}</span>
        </div>
        <span style={{
          fontSize: 12, color: "#3d3a55",
          transform: open ? "rotate(180deg)" : "rotate(0deg)",
          transition: "transform 0.25s ease", lineHeight: 1, fontFamily: "monospace"
        }}>▼</span>
      </button>
      {open && <div style={{ padding: "0 22px 22px" }}>{children}</div>}
    </div>
  );
}

// ─── Analysis Card ────────────────────────────────────────────────────────────
function AnalysisCard({ label, value }) {
  return (
    <div style={{ padding: "12px 0", borderBottom: "1px solid #111e33" }}>
      <div style={{ fontSize: 10, color: "#7c6fa8", letterSpacing: 3, textTransform: "uppercase", fontFamily: "monospace", marginBottom: 5 }}>{label}</div>
      <div style={{ fontSize: 15, color: "#e2dff5", lineHeight: 1.6, fontFamily: "'Crimson Text', serif" }}>
        {value || <span style={{ color: "#3d3a55", fontStyle: "italic" }}>—</span>}
      </div>
    </div>
  );
}

// ─── Cross Language Echo ──────────────────────────────────────────────────────
function CrossEcho({ echoes }) {
  if (!echoes?.length) return null;
  return (
    <div style={{ display: "grid", gap: 12 }}>
      {echoes.map((e, i) => (
        <div key={i} style={{ background: "#0a1628", border: "1px solid #1e3a5f", borderRadius: 10, padding: "12px 16px", display: "flex", gap: 14, alignItems: "flex-start" }}>
          <div style={{ fontSize: 22, flexShrink: 0, marginTop: 2 }}>{LANG_FLAGS[e.language] || "🌐"}</div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <span style={{ fontSize: 10, color: "#3b82f6", letterSpacing: 2, textTransform: "uppercase", fontFamily: "monospace" }}>{e.language}</span>
              <span style={{ fontSize: 10, color: "#1e3a5f" }}>·</span>
              <span style={{ fontSize: 10, color: "#4b5563", fontFamily: "monospace" }}>{e.similarity_note}</span>
            </div>
            <div style={{ fontSize: 15, color: "#bfdbfe", fontFamily: "'Crimson Text', serif", marginBottom: 4 }}>{e.proverb}</div>
            <div style={{ fontSize: 13, color: "#6b7280", fontFamily: "'Crimson Text', serif", fontStyle: "italic" }}>{e.translation}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Geography Map ────────────────────────────────────────────────────────────
function GeographyMap({ regions }) {
  const [hovered, setHovered] = useState(null);
  if (!regions?.length) return null;
  const highlighted = new Set(regions.map(r => r.district));
  const primary = regions[0]?.district;
  return (
    <div>
      <div style={{ position: "relative", background: "#0a150b", borderRadius: 12, overflow: "hidden", border: "1px solid #1a3d1f", marginBottom: 14 }}>
        <svg viewBox="80 80 340 260" style={{ width: "100%", height: "auto", display: "block" }}>
          <polygon points="110,180 100,160 115,130 135,110 145,95 160,90 185,100 210,105 240,100 265,90 290,100 320,110 350,120 375,130 395,155 390,180 380,210 370,245 350,260 320,265 295,275 270,280 245,285 220,275 200,270 175,280 155,295 140,305 125,290 115,265 108,240 105,210"
            fill="#0f1f10" stroke="#1a3d1f" strokeWidth="1.5" />
          {Object.entries(MH_DISTRICTS).map(([name, pos]) => {
            const isHighlighted = highlighted.has(name);
            const isPrimary = name === primary;
            const isHovered = hovered === name;
            return (
              <g key={name} onMouseEnter={() => setHovered(name)} onMouseLeave={() => setHovered(null)}>
                {isPrimary && (
                  <circle cx={pos.x} cy={pos.y} r="14" fill="#16a34a18" stroke="#4ade80" strokeWidth="1" strokeDasharray="3,2">
                    <animate attributeName="r" values="12;18;12" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.6;0.2;0.6" dur="2s" repeatCount="indefinite" />
                  </circle>
                )}
                <circle cx={pos.x} cy={pos.y}
                  r={isPrimary ? 5 : isHighlighted ? 4 : 2.5}
                  fill={isPrimary ? "#4ade80" : isHighlighted ? "#86efac" : "#1a3d1f"}
                  stroke={isPrimary ? "#16a34a" : isHighlighted ? "#4ade80" : "#1f2d20"}
                  strokeWidth="1"
                  style={{ cursor: isHighlighted ? "pointer" : "default", transition: "all 0.2s" }}
                />
                {(isHighlighted || isHovered) && (
                  <text x={pos.x + 7} y={pos.y + 4} fontSize="7" fill={isPrimary ? "#4ade80" : "#86efac"} fontFamily="monospace">{name}</text>
                )}
              </g>
            );
          })}
        </svg>
        <div style={{ position: "absolute", bottom: 10, right: 12, display: "flex", flexDirection: "column", gap: 4 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#4ade80" }} />
            <span style={{ fontSize: 9, color: "#4ade80", fontFamily: "monospace" }}>Origin</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#86efac" }} />
            <span style={{ fontSize: 9, color: "#86efac", fontFamily: "monospace" }}>Spread</span>
          </div>
        </div>
      </div>
      <div style={{ display: "grid", gap: 10 }}>
        {regions.map((r, i) => (
          <div key={i} style={{ background: "#0a150b", border: `1px solid ${i === 0 ? "#16a34a" : "#1a3d1f"}`, borderRadius: 10, padding: "12px 16px", display: "flex", gap: 12 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: i === 0 ? "#4ade80" : "#365f3a", marginTop: 5, flexShrink: 0 }} />
            <div>
              <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4 }}>
                <span style={{ fontSize: 12, color: i === 0 ? "#4ade80" : "#86efac", fontFamily: "monospace", fontWeight: 700 }}>{r.district}</span>
                <span style={{ fontSize: 10, color: "#374151", fontFamily: "monospace" }}>{i === 0 ? "PRIMARY ORIGIN" : "REGIONAL VARIANT"}</span>
              </div>
              <div style={{ fontSize: 14, color: "#d1fae5", fontFamily: "'Crimson Text', serif", lineHeight: 1.5 }}>{r.cultural_context}</div>
              {r.variant && <div style={{ fontSize: 13, color: "#6b7280", fontFamily: "'Crimson Text', serif", fontStyle: "italic", marginTop: 4 }}>"{r.variant}"</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Tab View ─────────────────────────────────────────────────────────────────
function TabView({ result }) {
  const [active, setActive] = useState("literature");

  const tabs = [
    { id: "literature", icon: "📖", label: "Literature" },
    { id: "language",   icon: "🔁", label: "Language"  },
    { id: "geography",  icon: "🗺️", label: "Geography" },
  ];

  const colors = { literature: "#c4b5fd", language: "#60a5fa", geography: "#4ade80" };

  return (
    <div style={{ animation: "fadeSlide 0.4s ease both" }}>
      {/* Tab Bar */}
      <div style={{ display: "flex", gap: 4, marginBottom: 16, background: "#070c18", border: "1px solid #1e2d4a", borderRadius: 14, padding: 5 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActive(t.id)}
            style={{
              flex: 1, border: "none", borderRadius: 10,
              padding: "11px 8px", fontSize: 11, letterSpacing: 1,
              textTransform: "uppercase", cursor: "pointer",
              fontFamily: "monospace", transition: "all 0.2s",
              background: active === t.id ? "#1e2d4a" : "transparent",
              color: active === t.id ? colors[t.id] : "#6b6484",
              boxShadow: active === t.id ? "inset 0 0 0 1px #3d3a55" : "none",
            }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div style={{ background: "linear-gradient(135deg, #0f1628 0%, #0c1a2e 100%)", border: "1px solid #1e2d4a", borderRadius: 16, padding: "22px", animation: "fadeSlide 0.3s ease both" }}>
        {active === "literature" && (
          <>
            <AnalysisCard label="Meaning"               value={result.meaning} />
            <AnalysisCard label="Literal Meaning"       value={result.literal_meaning} />
            <AnalysisCard label="Literary Type"         value={result.literary_type} />
            <AnalysisCard label="Philosophical Insight" value={result.philosophical_insight} />
            <AnalysisCard label="Cultural Importance"   value={result.cultural_importance} />
            <AnalysisCard label="Moral Lesson"          value={result.moral_lesson} />
            <AnalysisCard label="Literary Richness"     value={result.richness_insight} />
          </>
        )}
        {active === "language"  && <CrossEcho    echoes={result.cross_language_echoes} />}
        {active === "geography" && <GeographyMap regions={result.geography} />}
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [score, setScore] = useState(null);

  async function analyze() {
    if (!text.trim()) return;
    setLoading(true);
    setResult(null);
    setError(null);
    setScore(RichnessScore(text));

    const prompt = `You are an expert scholar of Marathi language, literature, and culture.
Analyze the following Marathi text and respond ONLY with a valid JSON object.
No markdown, no backticks, no explanation — pure JSON only.

JSON structure:
{
  "meaning": "string",
  "literal_meaning": "string",
  "literary_type": "string",
  "philosophical_insight": "string",
  "cultural_importance": "string",
  "moral_lesson": "string",
  "richness_insight": "string",
  "cross_language_echoes": [
    { "language": "Hindi", "proverb": "...", "translation": "...", "similarity_note": "near-identical / thematic / conceptual" },
    { "language": "Tamil", "proverb": "...", "translation": "...", "similarity_note": "..." },
    { "language": "English", "proverb": "...", "translation": "...", "similarity_note": "..." },
    { "language": "Swahili", "proverb": "...", "translation": "...", "similarity_note": "..." }
  ],
  "geography": [
    { "district": "DistrictName", "cultural_context": "Why this region is the origin or stronghold of this proverb", "variant": "optional local variant or null" },
    { "district": "AnotherDistrict", "cultural_context": "...", "variant": "..." }
  ]
}

For geography, pick 2-4 real Maharashtra districts from: Pune, Nashik, Mumbai, Nagpur, Aurangabad, Kolhapur, Solapur, Satara, Ahmednagar, Amravati, Latur, Nanded, Wardha, Yavatmal, Jalna, Beed, Parbhani, Buldhana, Akola, Chandrapur, Gondia, Raigad, Ratnagiri, Thane, Dhule, Jalgaon.
First district = primary origin. Be historically and culturally accurate.

Marathi text to analyze: ${text}`;

    try {
      const parsed = await callGroq(prompt);
      setResult(parsed);
    } catch (e) {
      setError("Analysis failed — " + e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Crimson+Text:ital,wght@0,400;0,600;1,400&family=Space+Mono:wght@400;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body, #root { width: 100%; min-height: 100vh; background: #0a0f1e; }
        @keyframes fadeSlide { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        @keyframes glow { 0%, 100% { box-shadow: 0 0 60px #3b5bdb18; } 50% { box-shadow: 0 0 80px #3b5bdb28; } }
        textarea:focus { outline: none; border-color: #7c3aed !important; }
        textarea::placeholder { color: #3d3a55; }
        .analyze-btn:hover:not(:disabled) { background: #6d28d9 !important; }
        .analyze-btn:active:not(:disabled) { transform: scale(0.98); }
      `}</style>

      <div style={{ minHeight: "100vh", width: "100%", background: "#8edbec", backgroundImage: "radial-gradient(ellipse 80% 50% at 50% -10%, #33518d40, transparent)", padding: "48px 24px", fontFamily: "'Space Mono', monospace" }}>
        <div style={{ maxWidth: 740, margin: "0 auto" }}>

          {/* ── Header ── */}
          <div style={{ textAlign: "center", marginBottom: 48, animation: "fadeSlide 0.6s ease both" }}>
            <div style={{ fontSize: 15, color: "#260a57", letterSpacing: 5, textTransform: "uppercase", marginBottom: 16 }}>◆ Literary Intelligence ◆</div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px, 5vw, 46px)", fontWeight: 800, color: "#1f7dc1", lineHeight: 1.15, marginBottom: 12, letterSpacing: "-0.5px" }}>
              Marathi Literature<br /><span style={{ color: "#1f7dc1" }}>Analyzer</span>
            </h1>
            <p style={{ color: "#6b6484", fontSize: 15, letterSpacing: 1 }}>
              AI-powered deep reading · Cross-language echoes · Geographic origins
            </p>
          </div>

          {/* ── Input Card ── */}
          <div style={{ background: "linear-gradient(160deg, #0f1628, #0c1220)", border: "1px solid #1e2d4a", borderRadius: 20, padding: 28, marginBottom: 20, animation: "glow 3s ease infinite, fadeSlide 0.6s ease 0.1s both", boxShadow: "0 0 60px #3b5bdb18" }}>
            <label
  style={{
    fontSize: 18,
    color: "#ffffff",
    letterSpacing: 1
  }}
>
  Enter Proverb / Ovi / Sentence
</label>
            <textarea value={text} onChange={e => setText(e.target.value)} rows={4}
              placeholder="आपले मराठी साहित्य येथे लिहा..."
              style={{ width: "100%", background: "#192032", border: "1px solid #1e2d4a", borderRadius: 10, color: "#e2dff5", fontSize: 18, padding: "14px 16px", resize: "vertical", lineHeight: 1.7, fontFamily: "'Crimson Text', serif", transition: "border-color 0.2s" }} />

            <button className="analyze-btn" onClick={analyze} disabled={loading || !text.trim()}
              style={{ marginTop: 20, width: "100%", background: loading ? "#3b0764" : "#1085eb", color: "#fff", border: "none", borderRadius: 12, padding: "15px 24px", fontSize: 15, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", cursor: loading ? "not-allowed" : "pointer", transition: "all 0.2s", fontFamily: "monospace" }}>
              {loading ? <span style={{ animation: "pulse 1.2s infinite" }}>◆ Analyzing…</span> : "◆ Analyze Literature"}
            </button>
          </div>

          {/* ── Error ── */}
          {error && (
            <div style={{ background: "#140a1f", border: "1px solid #7f1d1d", borderRadius: 12, padding: "14px 18px", color: "#fca5a5", fontSize: 13, marginBottom: 20, fontFamily: "monospace" }}>{error}</div>
          )}

          {/* ── Results ── */}
          {score !== null && !loading && result && (
            <div style={{ animation: "fadeSlide 0.5s ease both" }}>

              {/* Richness Score */}
              <div style={{ background: "linear-gradient(135deg, #0f1628, #0c1a2e)", border: "1px solid #1e2d4a", borderRadius: 20, padding: "24px 28px", marginBottom: 16, display: "flex", alignItems: "center", gap: 28 }}>
                <ScoreRing score={score} />
                <div>
                  <div style={{ fontSize: 10, color: "#7c6fa8", letterSpacing: 3, textTransform: "uppercase", marginBottom: 6, fontFamily: "monospace" }}>Linguistic Richness</div>
                  <div style={{ fontFamily: "'Crimson Text', serif", color: "#c4b5fd", fontSize: 15, lineHeight: 1.6 }}>
                    {score > 0.7 ? "High lexical diversity — rich, nuanced expression." : score > 0.4 ? "Moderate richness — balanced and clear." : "Simple structure — direct, impactful phrasing."}
                  </div>
                  <div style={{ marginTop: 8, fontSize: 11, color: "#3d3a55", fontFamily: "monospace" }}>lexical diversity + avg word length index</div>
                </div>
              </div>

              {/* ── Tabs ── */}
              <TabView result={result} />

            </div>
          )}

          <div style={{ textAlign: "center", marginTop: 48, color: "#2d2a45", fontSize: 15  , letterSpacing: 2, fontFamily: "monospace" }}>
             ◆ MARATHI LITERARY INTELLIGENCE
          </div>

        </div>
      </div>
    </>
  );
}