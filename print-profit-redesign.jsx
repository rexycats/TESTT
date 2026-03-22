import { useState, useEffect, useRef, useCallback } from "react";

// ─── ICONS (inline SVGs for zero dependencies) ───
const Icons = {
  home: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
  shop: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
      <line x1="3" y1="6" x2="21" y2="6"/>
      <path d="M16 10a4 4 0 01-8 0"/>
    </svg>
  ),
  chart: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
      <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
    </svg>
  ),
  trophy: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
      <path d="M6 9H4a2 2 0 01-2-2V5a2 2 0 012-2h2"/><path d="M18 9h2a2 2 0 002-2V5a2 2 0 00-2-2h-2"/>
      <path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20 7 22"/>
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20 17 22"/>
      <path d="M18 2H6v7a6 6 0 0012 0V2z"/>
    </svg>
  ),
  menu: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
      <circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/>
    </svg>
  ),
  chevDown: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  ),
  x: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
  printer: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="48" height="48">
      <rect x="4" y="10" width="16" height="8" rx="2"/><path d="M6 6h12v4H6z"/><path d="M6 18h12v3H6z"/>
      <circle cx="16" cy="14" r="1" fill="currentColor"/>
    </svg>
  ),
  play: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
      <path d="M8 5v14l11-7z"/>
    </svg>
  ),
  pause: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
      <rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/>
    </svg>
  ),
  lock: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
      <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
    </svg>
  ),
};

// ─── DATA ───
const ORDERS = [
  { id: 1, name: "Phone Stand", customer: "TechHobbyist99", filament: "PLA", time: 45, reward: 12.50, urgent: false, difficulty: "easy" },
  { id: 2, name: "Drone Frame", customer: "SkyPilot_NL", filament: "PETG", time: 120, reward: 38.00, urgent: true, difficulty: "medium" },
  { id: 3, name: "Gear Set", customer: "MakerJan", filament: "PA6", time: 90, reward: 24.00, urgent: false, difficulty: "hard" },
  { id: 4, name: "Cable Clip (x20)", customer: "OfficeMax", filament: "PLA", time: 30, reward: 8.00, urgent: false, difficulty: "easy" },
  { id: 5, name: "Vase (Spiral)", customer: "ArtDeco_BE", filament: "PLA", time: 60, reward: 18.50, urgent: false, difficulty: "medium" },
];

const UPGRADES = [
  { id: "speed1", name: "Faster Stepper Motors", desc: "Print 15% sneller", cost: 50, cat: "speed", icon: "⚡", owned: true },
  { id: "speed2", name: "Direct Drive Extruder", desc: "Print 25% sneller + TPU unlock", cost: 200, cat: "speed", icon: "🔧", owned: false },
  { id: "qual1", name: "Auto Bed Leveling", desc: "+10% kwaliteit", cost: 80, cat: "quality", icon: "📐", owned: true },
  { id: "qual2", name: "Hardened Steel Nozzle", desc: "+15% kwaliteit, unlock CF", cost: 300, cat: "quality", icon: "💎", owned: false },
  { id: "cap1", name: "Second Printer", desc: "Print 2 jobs tegelijk", cost: 500, cat: "capacity", icon: "🖨️", owned: false },
  { id: "cap2", name: "Heated Chamber", desc: "+20% kwaliteit bij PA6/CF", cost: 750, cat: "capacity", icon: "🔥", owned: false, locked: true },
  { id: "biz1", name: "Webshop", desc: "Passief inkomen +€2/min", cost: 1200, cat: "business", icon: "🌐", owned: false, locked: true },
  { id: "biz2", name: "Accountant", desc: "-40% BTW", cost: 800, cat: "business", icon: "🧾", owned: false },
];

const STAFF = [
  { id: "s1", name: "Packing Assistant", desc: "Auto-verpakt voltooide prints", cost: 15, icon: "📦", hired: true },
  { id: "s2", name: "Quality Inspector", desc: "+5% kwaliteit automatisch", cost: 25, icon: "🔍", hired: false },
  { id: "s3", name: "Sales Manager", desc: "+10% orderbeloning", cost: 40, icon: "💼", hired: false },
];

const CHALLENGES = [
  { id: "c1", name: "Speed Demon", desc: "Voltooi 5 jobs in 10 min", progress: 3, target: 5, reward: "€50", icon: "⚡" },
  { id: "c2", name: "Quality King", desc: "3 perfect prints op rij", progress: 1, target: 3, reward: "€30 + ⭐5", icon: "👑" },
  { id: "c3", name: "Material Master", desc: "Gebruik 3 verschillende filamenten", progress: 2, target: 3, reward: "🎲 2 tokens", icon: "🧵" },
];

const DAILY_GOALS = [
  { id: "d1", desc: "Verdien €100 vandaag", progress: 67, target: 100, reward: "€25", done: false },
  { id: "d2", desc: "Voltooi 3 orders", progress: 2, target: 3, reward: "⭐10", done: false },
  { id: "d3", desc: "Geen mislukte prints", progress: 1, target: 1, reward: "🎲 1 token", done: true },
];

const FILAMENTS = [
  { id: "pla", name: "PLA", emoji: "💧", stock: 100, max: 200, color: "#42A5F5" },
  { id: "petg", name: "PETG", emoji: "💜", stock: 80, max: 150, color: "#AB47BC" },
  { id: "pa6", name: "PA6-GF", emoji: "🔩", stock: 50, max: 100, color: "#FFB300" },
  { id: "tpu", name: "TPU", emoji: "🧲", stock: 0, max: 80, color: "#EF5350", locked: true },
  { id: "resin", name: "Resin", emoji: "🔮", stock: 0, max: 60, color: "#26C6DA", locked: true },
];

const MORE_ITEMS = [
  { id: "suppliers", label: "Leveranciers", icon: "🏭", desc: "Koop filament, bouw relaties" },
  { id: "staff", label: "Personeel", icon: "👥", desc: "Huur medewerkers" },
  { id: "chains", label: "Productieketens", icon: "🔗", desc: "Multi-filament bonussen" },
  { id: "clients", label: "Klanten & CRM", icon: "⭐", desc: "VIP relaties beheren" },
  { id: "stock", label: "Voorraad", icon: "📦", desc: "Inventaris & recycling" },
  { id: "finance", label: "Financiën", icon: "💳", desc: "Leningen, schuld, BTW" },
  { id: "franchise", label: "Franchise", icon: "🏗️", desc: "Passief inkomen vestigingen" },
  { id: "research", label: "Onderzoek", icon: "⚗️", desc: "Permanente upgrades" },
  { id: "equipment", label: "Equipment", icon: "🔧", desc: "Onderhoud & events" },
  { id: "records", label: "Records & HOF", icon: "🥇", desc: "Persoonlijke bests" },
  { id: "legacy", label: "Legacy Perks", icon: "✨", desc: "Prestige bonussen" },
  { id: "story", label: "Verhaal", icon: "💬", desc: "Klantberichten & events" },
  { id: "settings", label: "Instellingen", icon: "⚙️", desc: "Save, export, reset" },
];


// ─── SHEET COMPONENT ───
function Sheet({ open, onClose, title, children, height = "85vh" }) {
  const ref = useRef(null);
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      pointerEvents: open ? "all" : "none",
      transition: "background 0.3s",
      background: open ? "rgba(62,39,35,0.5)" : "transparent",
    }} onClick={onClose}>
      <div ref={ref} onClick={e => e.stopPropagation()} style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        maxHeight: height,
        background: "#FAF6ED",
        borderRadius: "24px 24px 0 0",
        boxShadow: "0 -8px 40px rgba(93,64,55,0.25)",
        transform: open ? "translateY(0)" : "translateY(100%)",
        transition: "transform 0.35s cubic-bezier(0.32, 0.72, 0, 1)",
        display: "flex", flexDirection: "column",
        overflow: "hidden",
      }}>
        <div style={{
          padding: "12px 20px 8px", display: "flex", alignItems: "center",
          justifyContent: "space-between", flexShrink: 0,
          borderBottom: "1px solid rgba(93,64,55,0.08)",
        }}>
          <div style={{ width: 40, height: 4, background: "rgba(93,64,55,0.15)", borderRadius: 2, position: "absolute", left: "50%", top: 8, transform: "translateX(-50%)" }} />
          <h2 style={{ fontFamily: "'Quicksand', sans-serif", fontWeight: 800, fontSize: 18, color: "#3E2723", letterSpacing: 0.5 }}>{title}</h2>
          <button onClick={onClose} style={{ background: "rgba(93,64,55,0.06)", border: "none", borderRadius: 12, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#795548" }}>{Icons.x}</button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "12px 16px 100px", WebkitOverflowScrolling: "touch" }}>
          {children}
        </div>
      </div>
    </div>
  );
}

// ─── PROGRESS RING ───
function ProgressRing({ pct, size = 120, stroke = 8, color = "#4CAF50" }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(93,64,55,0.06)" strokeWidth={stroke} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 0.8s cubic-bezier(0.4,0,0.2,1)", filter: `drop-shadow(0 0 6px ${color}44)` }} />
    </svg>
  );
}

// ─── FILAMENT BAR (horizontal stock) ───
function FilamentBar({ fil }) {
  const pct = fil.locked ? 0 : (fil.stock / fil.max) * 100;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", opacity: fil.locked ? 0.35 : 1 }}>
      <span style={{ fontSize: 18, width: 28, textAlign: "center" }}>{fil.emoji}</span>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, fontWeight: 700, color: "#3E2723", marginBottom: 3 }}>
          <span>{fil.name}</span>
          <span style={{ color: fil.locked ? "#795548" : fil.color }}>{fil.locked ? "🔒" : `${fil.stock}/${fil.max}`}</span>
        </div>
        <div style={{ height: 6, background: "rgba(93,64,55,0.06)", borderRadius: 3, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${pct}%`, background: `linear-gradient(90deg, ${fil.color}, ${fil.color}cc)`, borderRadius: 3, transition: "width 0.5s" }} />
        </div>
      </div>
    </div>
  );
}


// ─── MAIN APP ───
export default function PrintProfitRedesign() {
  const [tab, setTab] = useState("home");
  const [sheet, setSheet] = useState(null); // "orders" | "order-detail" | "filament" | "more-item"
  const [money, setMoney] = useState(342.50);
  const [rep, setRep] = useState(47);
  const [level, setLevel] = useState(4);
  const [xp, setXp] = useState(62);
  const [printing, setPrinting] = useState(false);
  const [printPct, setPrintPct] = useState(0);
  const [activeOrder, setActiveOrder] = useState(null);
  const [moreSheet, setMoreSheet] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Simulate printing
  useEffect(() => {
    if (!printing) return;
    const iv = setInterval(() => {
      setPrintPct(p => {
        if (p >= 100) {
          setPrinting(false);
          setMoney(m => m + (activeOrder?.reward || 0));
          setRep(r => r + 2);
          setXp(x => Math.min(100, x + 8));
          setActiveOrder(null);
          return 0;
        }
        return p + 2;
      });
    }, 100);
    return () => clearInterval(iv);
  }, [printing, activeOrder]);

  const startPrint = (order) => {
    setActiveOrder(order);
    setPrinting(true);
    setPrintPct(0);
    setSheet(null);
    setSelectedOrder(null);
    setTab("home");
  };

  const filColors = { PLA: "#42A5F5", PETG: "#AB47BC", "PA6": "#FFB300", "PA6-GF": "#FFB300" };

  // ─── RENDER ───
  return (
    <div style={{
      maxWidth: 430, margin: "0 auto", height: "100vh",
      display: "flex", flexDirection: "column",
      background: "#F5EFE0",
      fontFamily: "'Quicksand', 'Nunito', sans-serif",
      color: "#3E2723",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* ═══ TOP CURRENCY BAR ═══ */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "10px 16px",
        background: "linear-gradient(180deg, #3E2723 0%, #4E342E 100%)",
        flexShrink: 0,
        gap: 8,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 12 }}>💵</span>
          <span style={{
            fontFamily: "'Quicksand', sans-serif", fontWeight: 900, fontSize: 20,
            color: "#FFD54F",
            textShadow: "0 0 12px rgba(255,213,79,0.4)",
            letterSpacing: -0.5,
          }}>€{money.toFixed(2)}</span>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.5)", letterSpacing: 1, textTransform: "uppercase" }}>Rep</div>
            <div style={{ fontWeight: 800, fontSize: 14, color: "#FFB300" }}>⭐ {rep}</div>
          </div>
          <div style={{
            background: "rgba(76,175,80,0.2)", border: "1px solid rgba(76,175,80,0.4)",
            borderRadius: 12, padding: "4px 12px", textAlign: "center",
          }}>
            <div style={{ fontSize: 8, color: "rgba(255,255,255,0.5)", letterSpacing: 1, textTransform: "uppercase" }}>Level</div>
            <div style={{ fontWeight: 900, fontSize: 15, color: "#66BB6A" }}>{level}</div>
          </div>
          <button onClick={() => setSheet("filament")} style={{
            background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 10, padding: "6px 10px", cursor: "pointer",
            fontSize: 14, display: "flex", alignItems: "center", gap: 4,
          }}>
            <span>📦</span>
            <span style={{ fontSize: 10, color: "rgba(255,255,255,0.6)", fontWeight: 700 }}>Stock</span>
          </button>
          <button style={{
            background: "rgba(255,255,255,0.06)", border: "none",
            borderRadius: 10, width: 34, height: 34, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 14, color: "rgba(255,255,255,0.7)",
          }}>⏸</button>
        </div>
      </div>

      {/* ═══ XP BAR ═══ */}
      <div style={{ height: 3, background: "rgba(93,64,55,0.08)", flexShrink: 0 }}>
        <div style={{
          height: "100%", width: `${xp}%`,
          background: "linear-gradient(90deg, #4CAF50, #66BB6A)",
          transition: "width 0.5s",
        }} />
      </div>

      {/* ═══ MAIN CONTENT AREA ═══ */}
      <div style={{ flex: 1, overflowY: "auto", WebkitOverflowScrolling: "touch" }}>
        
        {/* ─── HOME TAB ─── */}
        {tab === "home" && (
          <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 14 }}>
            
            {/* DAILY GOALS mini-strip */}
            <div style={{
              display: "flex", gap: 8, overflowX: "auto",
              paddingBottom: 4,
              scrollbarWidth: "none",
            }}>
              {DAILY_GOALS.map(g => (
                <div key={g.id} style={{
                  flexShrink: 0, padding: "8px 14px",
                  background: g.done ? "rgba(76,175,80,0.08)" : "#fff",
                  border: `1px solid ${g.done ? "rgba(76,175,80,0.3)" : "rgba(93,64,55,0.08)"}`,
                  borderRadius: 14, minWidth: 160,
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: g.done ? "#2E7D32" : "#795548" }}>{g.done ? "✅" : "🎯"} {g.desc}</span>
                  </div>
                  <div style={{ height: 4, background: "rgba(93,64,55,0.06)", borderRadius: 2, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${(g.progress/g.target)*100}%`, background: g.done ? "#4CAF50" : "#FFB300", borderRadius: 2 }} />
                  </div>
                  <div style={{ fontSize: 9, color: "#795548", marginTop: 3, textAlign: "right" }}>{g.reward}</div>
                </div>
              ))}
            </div>

            {/* ═══ PRINT STATION — the "farm" ═══ */}
            <div style={{
              background: "#fff",
              borderRadius: 20,
              border: `2px solid ${printing ? "rgba(76,175,80,0.4)" : "rgba(93,64,55,0.06)"}`,
              boxShadow: printing
                ? "0 4px 24px rgba(76,175,80,0.12), inset 0 0 60px rgba(76,175,80,0.02)"
                : "0 2px 12px rgba(93,64,55,0.06)",
              overflow: "hidden",
              transition: "all 0.4s",
            }}>
              {/* Printer visual area */}
              <div style={{
                position: "relative",
                height: 200,
                background: printing
                  ? "linear-gradient(180deg, rgba(76,175,80,0.04), rgba(76,175,80,0.01))"
                  : "linear-gradient(180deg, rgba(93,64,55,0.02), transparent)",
                display: "flex", alignItems: "center", justifyContent: "center",
                overflow: "hidden",
              }}>
                {/* Animated grid */}
                <div style={{
                  position: "absolute", inset: 0, opacity: 0.03,
                  backgroundImage: "linear-gradient(rgba(93,64,55,1) 1px, transparent 1px), linear-gradient(90deg, rgba(93,64,55,1) 1px, transparent 1px)",
                  backgroundSize: "24px 24px",
                }} />

                {printing ? (
                  <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                    <ProgressRing pct={printPct} size={110} stroke={7} />
                    <div style={{
                      position: "absolute", top: "50%", left: "50%",
                      transform: "translate(-50%, -60%)",
                      textAlign: "center",
                    }}>
                      <div style={{ fontWeight: 900, fontSize: 28, color: "#2E7D32", lineHeight: 1 }}>{Math.round(printPct)}%</div>
                      <div style={{ fontSize: 9, color: "#795548", letterSpacing: 1 }}>PRINTING</div>
                    </div>
                  </div>
                ) : (
                  <div style={{ textAlign: "center", color: "#795548" }}>
                    <div style={{ opacity: 0.3 }}>{Icons.printer}</div>
                    <div style={{ fontWeight: 800, fontSize: 15, marginTop: 8, color: "#3E2723" }}>Printer Ready</div>
                    <div style={{ fontSize: 11, opacity: 0.6, marginTop: 2 }}>Kies een order om te starten</div>
                  </div>
                )}

                {/* Telemetry strip */}
                {printing && (
                  <div style={{
                    position: "absolute", bottom: 0, left: 0, right: 0,
                    display: "flex", justifyContent: "space-around",
                    padding: "8px 12px",
                    background: "rgba(255,255,255,0.85)",
                    backdropFilter: "blur(8px)",
                    borderTop: "1px solid rgba(93,64,55,0.06)",
                  }}>
                    {[
                      { label: "Nozzle", value: "215°C", color: "#F44336" },
                      { label: "Bed", value: "60°C", color: "#42A5F5" },
                      { label: "Speed", value: "80mm/s", color: "#4CAF50" },
                      { label: "Layer", value: `${Math.round(printPct*1.5)}/150`, color: "#FFB300" },
                    ].map(t => (
                      <div key={t.label} style={{ textAlign: "center" }}>
                        <div style={{ fontSize: 8, color: "#795548", letterSpacing: 0.5, textTransform: "uppercase" }}>{t.label}</div>
                        <div style={{ fontWeight: 800, fontSize: 13, color: t.color }}>{t.value}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Active order info or start button */}
              <div style={{ padding: "14px 16px" }}>
                {activeOrder ? (
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 16 }}>{activeOrder.name}</div>
                      <div style={{ fontSize: 11, color: "#795548" }}>{activeOrder.customer} · <span style={{ color: filColors[activeOrder.filament] }}>{activeOrder.filament}</span></div>
                    </div>
                    <div style={{ fontWeight: 900, fontSize: 22, color: "#2E7D32" }}>€{activeOrder.reward.toFixed(2)}</div>
                  </div>
                ) : (
                  <button onClick={() => setSheet("orders")} style={{
                    width: "100%", padding: "14px 0",
                    background: "linear-gradient(135deg, #4CAF50, #66BB6A)",
                    color: "#fff", border: "none", borderRadius: 14,
                    fontFamily: "'Quicksand', sans-serif",
                    fontWeight: 800, fontSize: 16, letterSpacing: 0.5,
                    cursor: "pointer",
                    boxShadow: "0 4px 16px rgba(76,175,80,0.3)",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  }}>
                    📬 Kies een Order
                  </button>
                )}
              </div>
            </div>

            {/* ═══ PRINTERS STATUS ═══ */}
            <div style={{
              background: "#fff", borderRadius: 16, padding: 14,
              border: "1px solid rgba(93,64,55,0.06)",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <span style={{ fontWeight: 800, fontSize: 13, letterSpacing: 0.5 }}>🖨️ Printers</span>
                <span style={{ fontSize: 10, color: "#795548" }}>1/1 actief</span>
              </div>
              {[
                { name: "Ender 3 Pro", status: printing ? "printing" : "idle", health: 87, job: activeOrder?.name },
              ].map((p, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "10px 12px", background: "rgba(93,64,55,0.02)",
                  borderRadius: 12, border: `1px solid ${p.status === "printing" ? "rgba(76,175,80,0.2)" : "rgba(93,64,55,0.04)"}`,
                }}>
                  <div style={{
                    width: 10, height: 10, borderRadius: "50%",
                    background: p.status === "printing" ? "#4CAF50" : "#9E9E9E",
                    boxShadow: p.status === "printing" ? "0 0 8px rgba(76,175,80,0.5)" : "none",
                  }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 13 }}>{p.name}</div>
                    <div style={{ fontSize: 10, color: "#795548" }}>
                      {p.status === "printing" ? `Printing: ${p.job}` : "Idle — wacht op order"}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 9, color: "#795548" }}>Health</div>
                    <div style={{ fontWeight: 800, fontSize: 13, color: p.health > 50 ? "#4CAF50" : "#F44336" }}>{p.health}%</div>
                  </div>
                </div>
              ))}
            </div>

            {/* ═══ QUICK ACTIONS ROW ═══ */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[
                { label: "Leveranciers", icon: "🏭", color: "#FF9800", action: () => { setMoreSheet("suppliers"); setSheet("more-item"); } },
                { label: "Personeel", icon: "👥", color: "#42A5F5", action: () => { setMoreSheet("staff"); setSheet("more-item"); } },
                { label: "Onderzoek", icon: "⚗️", color: "#AB47BC", action: () => { setMoreSheet("research"); setSheet("more-item"); } },
                { label: "Dashboard", icon: "📈", color: "#4CAF50", action: () => { setMoreSheet("dashboard"); setSheet("more-item"); } },
              ].map((a, i) => (
                <button key={i} onClick={a.action} style={{
                  background: "#fff", border: "1px solid rgba(93,64,55,0.06)",
                  borderRadius: 14, padding: "14px 12px",
                  display: "flex", alignItems: "center", gap: 10,
                  cursor: "pointer", textAlign: "left",
                  fontFamily: "'Quicksand', sans-serif",
                  transition: "transform 0.15s",
                }}>
                  <span style={{
                    width: 38, height: 38, borderRadius: 12,
                    background: `${a.color}15`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 20,
                  }}>{a.icon}</span>
                  <span style={{ fontWeight: 700, fontSize: 13, color: "#3E2723" }}>{a.label}</span>
                </button>
              ))}
            </div>

            <div style={{ height: 80 }} />
          </div>
        )}

        {/* ─── SHOP TAB ─── */}
        {tab === "shop" && (
          <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
            {/* Biz Level */}
            <div style={{
              background: "linear-gradient(135deg, #4E342E, #3E2723)",
              borderRadius: 16, padding: "16px 18px", color: "#fff",
            }}>
              <div style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "rgba(255,255,255,0.5)" }}>Bedrijfslevel</div>
              <div style={{ fontWeight: 900, fontSize: 20, color: "#FFD54F", marginTop: 2 }}>GARAGE TINKERER</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginTop: 2 }}>Level {level} · {xp}/100 XP</div>
              <div style={{ height: 5, background: "rgba(255,255,255,0.1)", borderRadius: 3, marginTop: 8, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${xp}%`, background: "linear-gradient(90deg, #FFD54F, #FFB300)", borderRadius: 3 }} />
              </div>
            </div>

            {/* Upgrade categories */}
            {["speed", "quality", "capacity", "business"].map(cat => (
              <div key={cat}>
                <div style={{
                  padding: "8px 14px", marginBottom: 6,
                  borderRadius: 12, fontWeight: 800, fontSize: 12,
                  letterSpacing: 0.8, textTransform: "uppercase", color: "#fff",
                  background: cat === "speed" ? "linear-gradient(90deg, #42A5F5, #1E88E5)"
                    : cat === "quality" ? "linear-gradient(90deg, #AB47BC, #8E24AA)"
                    : cat === "capacity" ? "linear-gradient(90deg, #FF9800, #F57C00)"
                    : "linear-gradient(90deg, #4CAF50, #2E7D32)",
                }}>
                  {cat === "speed" ? "⚡ Snelheid" : cat === "quality" ? "✨ Kwaliteit" : cat === "capacity" ? "🖨️ Capaciteit" : "💼 Business"}
                </div>
                {UPGRADES.filter(u => u.cat === cat).map(u => (
                  <div key={u.id} style={{
                    background: "#fff",
                    border: `1px solid ${u.owned ? "rgba(76,175,80,0.2)" : u.locked ? "rgba(93,64,55,0.04)" : "rgba(93,64,55,0.08)"}`,
                    borderRadius: 16, padding: "12px 14px",
                    marginBottom: 6,
                    opacity: u.locked ? 0.4 : u.owned ? 0.6 : 1,
                    borderLeft: !u.owned && !u.locked && u.cost <= money ? "4px solid #4CAF50" : undefined,
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 20 }}>{u.icon}</span>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: 14 }}>{u.name}</div>
                          <div style={{ fontSize: 11, color: "#795548" }}>{u.desc}</div>
                        </div>
                      </div>
                      {u.owned ? (
                        <span style={{ fontSize: 11, color: "#4CAF50", fontWeight: 700 }}>✓ Owned</span>
                      ) : u.locked ? (
                        <span style={{ color: "#795548" }}>{Icons.lock}</span>
                      ) : (
                        <button style={{
                          background: u.cost <= money ? "linear-gradient(135deg, #4CAF50, #66BB6A)" : "rgba(93,64,55,0.08)",
                          color: u.cost <= money ? "#fff" : "#795548",
                          border: "none", borderRadius: 12, padding: "8px 16px",
                          fontFamily: "'Quicksand', sans-serif", fontWeight: 800, fontSize: 13,
                          cursor: u.cost <= money ? "pointer" : "default",
                        }}>
                          €{u.cost}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ))}
            <div style={{ height: 80 }} />
          </div>
        )}

        {/* ─── BUSINESS TAB ─── */}
        {tab === "business" && (
          <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
            {/* Stats cards */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[
                { label: "Vandaag verdiend", value: "€127.50", color: "#4CAF50", icon: "💰" },
                { label: "Jobs voltooid", value: "8", color: "#42A5F5", icon: "📦" },
                { label: "Success rate", value: "87%", color: "#FFB300", icon: "🎯" },
                { label: "Passief/uur", value: "€0", color: "#AB47BC", icon: "🤖" },
              ].map((s, i) => (
                <div key={i} style={{
                  background: "#fff", borderRadius: 16, padding: "14px 12px",
                  border: "1px solid rgba(93,64,55,0.06)",
                }}>
                  <div style={{ fontSize: 18, marginBottom: 4 }}>{s.icon}</div>
                  <div style={{ fontWeight: 900, fontSize: 20, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: 10, color: "#795548", marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Staff section */}
            <div>
              <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                👥 Personeel
                <span style={{ fontSize: 10, color: "#795548", fontWeight: 500 }}>Loon per minuut</span>
              </div>
              {STAFF.map(s => (
                <div key={s.id} style={{
                  background: "#fff", borderRadius: 14, padding: "12px 14px",
                  border: `1px solid ${s.hired ? "rgba(76,175,80,0.2)" : "rgba(93,64,55,0.06)"}`,
                  marginBottom: 6,
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 22 }}>{s.icon}</span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 13 }}>{s.name}</div>
                      <div style={{ fontSize: 10, color: "#795548" }}>{s.desc}</div>
                    </div>
                  </div>
                  {s.hired ? (
                    <span style={{ fontSize: 10, color: "#4CAF50", fontWeight: 700 }}>Actief</span>
                  ) : (
                    <button style={{
                      background: "linear-gradient(135deg, #FF9800, #F57C00)",
                      color: "#fff", border: "none", borderRadius: 10, padding: "6px 14px",
                      fontFamily: "'Quicksand', sans-serif", fontWeight: 800, fontSize: 12, cursor: "pointer",
                    }}>
                      €{s.cost}/min
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Filament stock compact */}
            <div style={{
              background: "#fff", borderRadius: 16, padding: 14,
              border: "1px solid rgba(93,64,55,0.06)",
            }}>
              <div style={{ fontWeight: 800, fontSize: 13, marginBottom: 6 }}>📦 Filament Stock</div>
              {FILAMENTS.map(f => <FilamentBar key={f.id} fil={f} />)}
            </div>
            <div style={{ height: 80 }} />
          </div>
        )}

        {/* ─── CHALLENGES TAB ─── */}
        {tab === "challenges" && (
          <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
            {/* Active challenges */}
            <div style={{ fontWeight: 800, fontSize: 14, display: "flex", alignItems: "center", gap: 6 }}>
              🏆 Actieve Challenges
            </div>
            {CHALLENGES.map(c => (
              <div key={c.id} style={{
                background: "#fff", borderRadius: 16, padding: "14px 16px",
                border: "1px solid rgba(93,64,55,0.06)",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <span style={{
                      width: 42, height: 42, borderRadius: 12,
                      background: "rgba(255,193,7,0.1)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 22,
                    }}>{c.icon}</span>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 14 }}>{c.name}</div>
                      <div style={{ fontSize: 11, color: "#795548" }}>{c.desc}</div>
                    </div>
                  </div>
                  <div style={{
                    background: "rgba(76,175,80,0.08)", borderRadius: 8, padding: "4px 10px",
                    fontWeight: 800, fontSize: 12, color: "#2E7D32",
                  }}>{c.reward}</div>
                </div>
                <div style={{ marginTop: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#795548", marginBottom: 4 }}>
                    <span>Voortgang</span>
                    <span style={{ fontWeight: 700 }}>{c.progress}/{c.target}</span>
                  </div>
                  <div style={{ height: 6, background: "rgba(93,64,55,0.06)", borderRadius: 3, overflow: "hidden" }}>
                    <div style={{
                      height: "100%", width: `${(c.progress/c.target)*100}%`,
                      background: "linear-gradient(90deg, #FFB300, #FFC107)",
                      borderRadius: 3,
                    }} />
                  </div>
                </div>
              </div>
            ))}

            {/* Daily goals full */}
            <div style={{ fontWeight: 800, fontSize: 14, marginTop: 8, display: "flex", alignItems: "center", gap: 6 }}>
              🎯 Dagelijkse Doelen
            </div>
            {DAILY_GOALS.map(g => (
              <div key={g.id} style={{
                background: g.done ? "rgba(76,175,80,0.04)" : "#fff",
                borderRadius: 14, padding: "12px 14px",
                border: `1px solid ${g.done ? "rgba(76,175,80,0.2)" : "rgba(93,64,55,0.06)"}`,
                display: "flex", alignItems: "center", gap: 12,
              }}>
                <span style={{
                  width: 32, height: 32, borderRadius: 10,
                  background: g.done ? "rgba(76,175,80,0.15)" : "rgba(255,179,0,0.1)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 16,
                }}>{g.done ? "✅" : "🎯"}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 12, color: g.done ? "#2E7D32" : "#3E2723" }}>{g.desc}</div>
                  <div style={{ height: 4, background: "rgba(93,64,55,0.06)", borderRadius: 2, marginTop: 4, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${(g.progress/g.target)*100}%`, background: g.done ? "#4CAF50" : "#FFB300", borderRadius: 2 }} />
                  </div>
                </div>
                <span style={{ fontWeight: 800, fontSize: 11, color: "#795548" }}>{g.reward}</span>
              </div>
            ))}

            {/* Badges / Achievements compact */}
            <div style={{ fontWeight: 800, fontSize: 14, marginTop: 8 }}>🏅 Badges</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {["🥇 First Print", "⚡ Speed Demon", "🔗 Chain Master", "🌟 5-Star Rep"].map((b, i) => (
                <div key={i} style={{
                  background: i < 2 ? "rgba(255,193,7,0.08)" : "rgba(93,64,55,0.03)",
                  border: `1px solid ${i < 2 ? "rgba(255,193,7,0.2)" : "rgba(93,64,55,0.06)"}`,
                  borderRadius: 12, padding: "8px 14px",
                  fontSize: 11, fontWeight: 700,
                  color: i < 2 ? "#FF8F00" : "#9E9E9E",
                  opacity: i < 2 ? 1 : 0.5,
                }}>{b}</div>
              ))}
            </div>
            <div style={{ height: 80 }} />
          </div>
        )}

        {/* ─── MORE TAB ─── */}
        {tab === "more" && (
          <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 4 }}>Alles</div>
            {MORE_ITEMS.map(item => (
              <button key={item.id} onClick={() => { setMoreSheet(item.id); setSheet("more-item"); }}
                style={{
                  display: "flex", alignItems: "center", gap: 14,
                  background: "#fff", border: "1px solid rgba(93,64,55,0.06)",
                  borderRadius: 14, padding: "14px 16px",
                  cursor: "pointer", textAlign: "left", width: "100%",
                  fontFamily: "'Quicksand', sans-serif",
                  transition: "background 0.15s",
                }}>
                <span style={{
                  width: 42, height: 42, borderRadius: 12,
                  background: "rgba(93,64,55,0.04)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 22, flexShrink: 0,
                }}>{item.icon}</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: "#3E2723" }}>{item.label}</div>
                  <div style={{ fontSize: 11, color: "#795548" }}>{item.desc}</div>
                </div>
                <span style={{ marginLeft: "auto", color: "#BDBDBD", fontSize: 18 }}>›</span>
              </button>
            ))}
            <div style={{ height: 80 }} />
          </div>
        )}
      </div>

      {/* ═══ BOTTOM NAV BAR ═══ */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        display: "flex", justifyContent: "space-around", alignItems: "center",
        padding: "6px 0 env(safe-area-inset-bottom, 8px)",
        background: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(16px)",
        borderTop: "1px solid rgba(93,64,55,0.08)",
        zIndex: 100,
      }}>
        {[
          { id: "home", label: "Home", icon: Icons.home },
          { id: "shop", label: "Shop", icon: Icons.shop },
          { id: "business", label: "Business", icon: Icons.chart },
          { id: "challenges", label: "Missions", icon: Icons.trophy },
          { id: "more", label: "Meer", icon: Icons.menu },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
            background: "none", border: "none", cursor: "pointer",
            padding: "4px 14px",
            color: tab === t.id ? "#4CAF50" : "#9E9E9E",
            transition: "color 0.2s",
            position: "relative",
          }}>
            {tab === t.id && (
              <div style={{
                position: "absolute", top: -7, width: 24, height: 3,
                background: "#4CAF50", borderRadius: 2,
              }} />
            )}
            {t.icon}
            <span style={{
              fontSize: 10, fontWeight: tab === t.id ? 800 : 600,
              letterSpacing: 0.3,
            }}>{t.label}</span>
          </button>
        ))}
      </div>

      {/* ═══ SHEETS / MODALS ═══ */}

      {/* Orders sheet */}
      <Sheet open={sheet === "orders"} onClose={() => setSheet(null)} title="📬 Orders">
        <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
          {["📋 Alle", "💰 Winst", "⚡ Snel", "✅ Veilig"].map((f, i) => (
            <button key={i} style={{
              background: i === 0 ? "rgba(76,175,80,0.1)" : "rgba(93,64,55,0.04)",
              border: `1px solid ${i === 0 ? "rgba(76,175,80,0.3)" : "rgba(93,64,55,0.06)"}`,
              borderRadius: 10, padding: "6px 12px",
              fontFamily: "'Quicksand', sans-serif", fontWeight: 700, fontSize: 11,
              color: i === 0 ? "#2E7D32" : "#795548", cursor: "pointer",
            }}>{f}</button>
          ))}
        </div>
        {ORDERS.map(o => (
          <button key={o.id} onClick={() => startPrint(o)} style={{
            display: "block", width: "100%", textAlign: "left",
            background: "#fff", border: "1px solid rgba(93,64,55,0.06)",
            borderRadius: 16, padding: "14px 16px", marginBottom: 8,
            cursor: "pointer", fontFamily: "'Quicksand', sans-serif",
            borderLeft: `4px solid ${filColors[o.filament] || "#9E9E9E"}`,
            position: "relative", overflow: "hidden",
          }}>
            {o.urgent && (
              <div style={{
                position: "absolute", top: 8, right: 12,
                background: "rgba(244,67,54,0.1)", color: "#F44336",
                fontSize: 9, fontWeight: 800, padding: "2px 8px",
                borderRadius: 6, letterSpacing: 0.5,
              }}>⚡ URGENT</div>
            )}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: 15 }}>{o.name}</div>
                <div style={{ fontSize: 11, color: "#795548", marginTop: 2 }}>{o.customer}</div>
              </div>
              <div style={{ fontWeight: 900, fontSize: 22, color: "#2E7D32" }}>€{o.reward.toFixed(2)}</div>
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              <span style={{
                fontSize: 10, padding: "2px 8px", borderRadius: 6, fontWeight: 700,
                background: `${filColors[o.filament]}15`, color: filColors[o.filament],
              }}>{o.filament}</span>
              <span style={{ fontSize: 10, color: "#795548" }}>⏱ {o.time}s</span>
              <span style={{
                fontSize: 10, padding: "2px 8px", borderRadius: 6, fontWeight: 700,
                background: o.difficulty === "easy" ? "rgba(76,175,80,0.1)" : o.difficulty === "medium" ? "rgba(255,179,0,0.1)" : "rgba(244,67,54,0.1)",
                color: o.difficulty === "easy" ? "#2E7D32" : o.difficulty === "medium" ? "#FF8F00" : "#C62828",
              }}>{o.difficulty}</span>
            </div>
            <div style={{
              marginTop: 10, textAlign: "center",
              background: "linear-gradient(135deg, #4CAF50, #66BB6A)",
              color: "#fff", borderRadius: 10, padding: "8px 0",
              fontWeight: 800, fontSize: 13,
            }}>
              ▶ Print Starten
            </div>
          </button>
        ))}
      </Sheet>

      {/* Filament stock sheet */}
      <Sheet open={sheet === "filament"} onClose={() => setSheet(null)} title="📦 Filament Voorraad" height="50vh">
        {FILAMENTS.map(f => (
          <div key={f.id} style={{
            display: "flex", alignItems: "center", gap: 12,
            padding: "12px 0", borderBottom: "1px solid rgba(93,64,55,0.06)",
            opacity: f.locked ? 0.35 : 1,
          }}>
            <span style={{ fontSize: 28, width: 40, textAlign: "center" }}>{f.emoji}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 14 }}>{f.name}</div>
              <div style={{ height: 8, background: "rgba(93,64,55,0.06)", borderRadius: 4, marginTop: 4, overflow: "hidden" }}>
                <div style={{ height: "100%", width: f.locked ? "0%" : `${(f.stock/f.max)*100}%`, background: f.color, borderRadius: 4 }} />
              </div>
              <div style={{ fontSize: 10, color: "#795548", marginTop: 3 }}>
                {f.locked ? "🔒 Unlock vereist" : `${f.stock} / ${f.max} eenheden`}
              </div>
            </div>
            {!f.locked && (
              <button style={{
                background: "rgba(255,152,0,0.1)", border: "1px solid rgba(255,152,0,0.3)",
                borderRadius: 10, padding: "8px 14px", fontWeight: 800, fontSize: 12,
                color: "#F57C00", cursor: "pointer", fontFamily: "'Quicksand', sans-serif",
              }}>Koop</button>
            )}
          </div>
        ))}
      </Sheet>

      {/* More item sheet (placeholder for any sub-page) */}
      <Sheet open={sheet === "more-item"} onClose={() => setSheet(null)} title={MORE_ITEMS.find(m => m.id === moreSheet)?.icon + " " + (MORE_ITEMS.find(m => m.id === moreSheet)?.label || "")}>
        <div style={{ textAlign: "center", padding: "40px 20px", color: "#795548" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>{MORE_ITEMS.find(m => m.id === moreSheet)?.icon}</div>
          <div style={{ fontWeight: 800, fontSize: 18, color: "#3E2723", marginBottom: 8 }}>
            {MORE_ITEMS.find(m => m.id === moreSheet)?.label}
          </div>
          <div style={{ fontSize: 13, lineHeight: 1.6, maxWidth: 280, margin: "0 auto" }}>
            {MORE_ITEMS.find(m => m.id === moreSheet)?.desc}
            <br /><br />
            Dit paneel bevat de volledige inhoud van het huidige <strong>{moreSheet}</strong> tab — maar nu bereikbaar in 2 taps vanuit de Home.
          </div>
        </div>
      </Sheet>
    </div>
  );
}
