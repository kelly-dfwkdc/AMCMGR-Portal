import { useState, useEffect, useMemo } from "react";
import { createClient } from "@supabase/supabase-js";

// ── Supabase ──────────────────────────────────────────────────────────────────
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// ── Design tokens ─────────────────────────────────────────────────────────────
const C = {
  bg:          "#0A0F1E",
  surface:     "#111827",
  card:        "#1A2235",
  cardHover:   "#1E2A40",
  border:      "rgba(255,255,255,0.08)",
  borderHover: "rgba(255,255,255,0.16)",
  gold:        "#C9974A",
  goldLight:   "rgba(201,151,74,0.12)",
  teal:        "#2DD4BF",
  tealLight:   "rgba(45,212,191,0.1)",
  indigo:      "#818CF8",
  indigoLight: "rgba(129,140,248,0.1)",
  red:         "#F87171",
  redLight:    "rgba(248,113,113,0.1)",
  green:       "#4ADE80",
  greenLight:  "rgba(74,222,128,0.1)",
  amber:       "#FBBF24",
  amberLight:  "rgba(251,191,36,0.1)",
  text:        "#F1F5F9",
  muted:       "#94A3B8",
  faint:       "#475569",
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const fmt = (d) => {
  if (!d) return "—";
  return new Date(d + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};
const daysUntil = (d) => {
  if (!d) return null;
  return Math.ceil((new Date(d + "T12:00:00") - new Date()) / 86400000);
};
const initials = (name) => name ? name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() : "?";

// ── Shared UI components ──────────────────────────────────────────────────────
const Card = ({ children, style, onClick }) => (
  <div onClick={onClick} style={{
    background: C.card, border: `1px solid ${C.border}`, borderRadius: 14,
    padding: "20px 22px", transition: "all .2s",
    cursor: onClick ? "pointer" : "default",
    ...style,
  }}
    onMouseEnter={onClick ? e => { e.currentTarget.style.borderColor = C.borderHover; e.currentTarget.style.background = C.cardHover; } : undefined}
    onMouseLeave={onClick ? e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = C.card; } : undefined}
  >
    {children}
  </div>
);

const Badge = ({ label, color = C.teal, bg }) => (
  <span style={{
    background: bg || `${color}18`, color, borderRadius: 20,
    padding: "3px 10px", fontSize: 11, fontWeight: 700, letterSpacing: .3,
    fontFamily: "Outfit, sans-serif", whiteSpace: "nowrap",
  }}>{label}</span>
);

const Btn = ({ children, onClick, variant = "primary", disabled, style }) => {
  const styles = {
    primary: { background: C.gold, color: "#0A0F1E" },
    ghost:   { background: "transparent", color: C.muted, border: `1px solid ${C.border}` },
    teal:    { background: C.tealLight, color: C.teal, border: `1px solid rgba(45,212,191,0.2)` },
    danger:  { background: C.redLight,  color: C.red,  border: `1px solid rgba(248,113,113,0.2)` },
  };
  return (
    <button onClick={onClick} disabled={disabled} style={{
      ...styles[variant],
      padding: "9px 20px", borderRadius: 8, border: "none",
      fontFamily: "Outfit, sans-serif", fontSize: 13, fontWeight: 700,
      cursor: disabled ? "default" : "pointer", opacity: disabled ? 0.5 : 1,
      transition: "all .15s", ...style,
    }}>{children}</button>
  );
};

const Label = ({ children }) => (
  <div style={{ fontFamily: "Outfit, sans-serif", fontSize: 10, fontWeight: 700, color: C.faint, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>
    {children}
  </div>
);

const Divider = () => <div style={{ borderTop: `1px solid ${C.border}`, margin: "16px 0" }} />;

// ── STATUS helpers ────────────────────────────────────────────────────────────
const TASK_STATUS = {
  "Open":        { color: C.muted,   label: "Open" },
  "Planned":     { color: C.indigo,  label: "Planned" },
  "In Progress": { color: C.amber,   label: "In Progress" },
  "Completed":   { color: C.green,   label: "Completed" },
};

// ══════════════════════════════════════════════════════════════════════════════
// LOGIN PAGE
// ══════════════════════════════════════════════════════════════════════════════
function LoginPage({ onMagicSent }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState("");

  const handleSend = async () => {
    if (!email.trim()) return;
    setLoading(true); setError("");
    const { error: err } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: window.location.origin },
    });
    setLoading(false);
    if (err) { setError(err.message); return; }
    onMagicSent(email.trim());
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: C.bg, padding: 24,
      backgroundImage: "radial-gradient(ellipse at 20% 50%, rgba(201,151,74,0.06) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(45,212,191,0.04) 0%, transparent 50%)",
    }}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 14, background: C.gold,
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            fontFamily: "Outfit, sans-serif", fontWeight: 900, fontSize: 16, color: "#0A0F1E",
            letterSpacing: 1, marginBottom: 16,
          }}>AMC</div>
          <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 28, color: C.text, marginBottom: 6 }}>
            Board Portal
          </div>
          <div style={{ fontFamily: "Outfit, sans-serif", fontSize: 14, color: C.muted }}>
            Secure access for chapter board members
          </div>
        </div>

        {/* Card */}
        <Card style={{ padding: "32px 36px" }}>
          <div style={{ fontFamily: "Outfit, sans-serif", fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 6 }}>
            Sign in with your email
          </div>
          <div style={{ fontFamily: "Outfit, sans-serif", fontSize: 13, color: C.muted, marginBottom: 24, lineHeight: 1.6 }}>
            We'll send a secure one-click link — no password needed.
          </div>

          <Label>Email address</Label>
          <input
            type="email" value={email} onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSend()}
            placeholder="you@yourcompany.com"
            style={{
              width: "100%", padding: "11px 14px", borderRadius: 8,
              border: `1px solid ${C.border}`, background: C.surface,
              fontFamily: "Outfit, sans-serif", fontSize: 14, color: C.text,
              outline: "none", boxSizing: "border-box", marginBottom: 16,
              transition: "border .15s",
            }}
            onFocus={e => e.target.style.borderColor = C.gold}
            onBlur={e => e.target.style.borderColor = C.border}
          />

          {error && (
            <div style={{ background: C.redLight, border: `1px solid rgba(248,113,113,0.3)`, borderRadius: 8, padding: "10px 14px", fontFamily: "Outfit, sans-serif", fontSize: 13, color: C.red, marginBottom: 14 }}>
              {error}
            </div>
          )}

          <Btn onClick={handleSend} disabled={loading || !email.trim()} style={{ width: "100%", padding: "12px", fontSize: 14 }}>
            {loading ? "Sending…" : "Send Magic Link →"}
          </Btn>
        </Card>

        <div style={{ textAlign: "center", marginTop: 24, fontFamily: "Outfit, sans-serif", fontSize: 12, color: C.faint }}>
          Need access? Contact your KDC administrator.
        </div>
      </div>
    </div>
  );
}

// ── Magic link sent confirmation ───────────────────────────────────────────────
function MagicSentPage({ email }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: C.bg, padding: 24 }}>
      <Card style={{ maxWidth: 400, width: "100%", padding: "36px", textAlign: "center" }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>📬</div>
        <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, color: C.text, marginBottom: 10 }}>Check your inbox</div>
        <div style={{ fontFamily: "Outfit, sans-serif", fontSize: 14, color: C.muted, lineHeight: 1.7 }}>
          We sent a sign-in link to<br />
          <strong style={{ color: C.text }}>{email}</strong>
        </div>
        <Divider />
        <div style={{ fontFamily: "Outfit, sans-serif", fontSize: 12, color: C.faint }}>
          The link expires in 1 hour. Check your spam folder if you don't see it.
        </div>
      </Card>
    </div>
  );
}

// ── Not authorized ─────────────────────────────────────────────────────────────
function NotAuthorizedPage({ email, onSignOut }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: C.bg, padding: 24 }}>
      <Card style={{ maxWidth: 420, width: "100%", padding: "36px", textAlign: "center" }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>🔒</div>
        <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, color: C.text, marginBottom: 10 }}>Access Not Found</div>
        <div style={{ fontFamily: "Outfit, sans-serif", fontSize: 14, color: C.muted, lineHeight: 1.7, marginBottom: 20 }}>
          <strong style={{ color: C.text }}>{email}</strong> isn't associated with any chapter board. Contact your KDC administrator to request access.
        </div>
        <Btn variant="ghost" onClick={onSignOut}>Sign Out</Btn>
      </Card>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// DASHBOARD PAGE
// ══════════════════════════════════════════════════════════════════════════════
function DashboardPage({ boardUser, tasks, events, messages }) {
  const openTasks    = tasks.filter(t => t.status !== "Completed");
  const nextEvent    = events.filter(e => e.event_date >= new Date().toISOString().slice(0,10)).sort((a,b) => a.event_date.localeCompare(b.event_date))[0];
  const recentMsg    = messages.slice(0, 3);
  const urgentTasks  = openTasks.filter(t => t.priority === "High");

  const stats = [
    { icon: "📋", label: "Open Tasks",    value: openTasks.length,   color: openTasks.length > 0 ? C.amber : C.green },
    { icon: "⚠️",  label: "High Priority", value: urgentTasks.length, color: urgentTasks.length > 0 ? C.red : C.green },
    { icon: "📅", label: "Upcoming Events", value: events.filter(e => e.event_date >= new Date().toISOString().slice(0,10)).length, color: C.teal },
    { icon: "💬", label: "Messages",       value: messages.length,    color: C.indigo },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Welcome */}
      <div style={{
        background: `linear-gradient(135deg, ${C.card} 0%, rgba(201,151,74,0.08) 100%)`,
        border: `1px solid rgba(201,151,74,0.2)`, borderRadius: 16, padding: "28px 32px",
      }}>
        <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 26, color: C.text, marginBottom: 6 }}>
          Welcome back, {boardUser.full_name?.split(" ")[0] || "Board Member"} 👋
        </div>
        <div style={{ fontFamily: "Outfit, sans-serif", fontSize: 14, color: C.muted }}>
          {boardUser.chapter_name} Chapter Board Portal
        </div>
        {nextEvent && (
          <div style={{ marginTop: 16, display: "inline-flex", alignItems: "center", gap: 8, background: C.goldLight, borderRadius: 8, padding: "8px 14px" }}>
            <span style={{ fontSize: 14 }}>📅</span>
            <span style={{ fontFamily: "Outfit, sans-serif", fontSize: 13, color: C.gold, fontWeight: 600 }}>
              Next: {nextEvent.name} — {fmt(nextEvent.event_date)}
            </span>
          </div>
        )}
      </div>

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
        {stats.map(s => (
          <Card key={s.label} style={{ textAlign: "center", padding: "20px 16px" }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>{s.icon}</div>
            <div style={{ fontFamily: "Outfit, sans-serif", fontSize: 32, fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontFamily: "Outfit, sans-serif", fontSize: 11, color: C.muted, marginTop: 6, letterSpacing: .5, textTransform: "uppercase" }}>{s.label}</div>
          </Card>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* Open tasks preview */}
        <Card>
          <div style={{ fontFamily: "Outfit, sans-serif", fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 14, display: "flex", justifyContent: "space-between" }}>
            <span>Open Tasks</span>
            <Badge label={openTasks.length} color={C.amber} />
          </div>
          {openTasks.length === 0 && <div style={{ fontFamily: "Outfit, sans-serif", fontSize: 13, color: C.faint, textAlign: "center", padding: "16px 0" }}>✓ All caught up!</div>}
          {openTasks.slice(0, 4).map(t => {
            const days = daysUntil(t.due);
            const overdue = days !== null && days < 0;
            return (
              <div key={t.id} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 0", borderTop: `1px solid ${C.border}` }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: t.priority === "High" ? C.red : C.amber, marginTop: 5, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "Outfit, sans-serif", fontSize: 13, fontWeight: 600, color: C.text, lineHeight: 1.4 }}>{t.title}</div>
                  {t.due && <div style={{ fontFamily: "Outfit, sans-serif", fontSize: 11, color: overdue ? C.red : C.muted, marginTop: 2 }}>Due {fmt(t.due)}{overdue ? " ⚠" : ""}</div>}
                </div>
                <Badge label={t.status} color={TASK_STATUS[t.status]?.color || C.muted} />
              </div>
            );
          })}
        </Card>

        {/* Recent messages */}
        <Card>
          <div style={{ fontFamily: "Outfit, sans-serif", fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 14 }}>Recent Messages</div>
          {recentMsg.length === 0 && <div style={{ fontFamily: "Outfit, sans-serif", fontSize: 13, color: C.faint, textAlign: "center", padding: "16px 0" }}>No messages yet.</div>}
          {recentMsg.map(m => (
            <div key={m.id} style={{ display: "flex", gap: 10, padding: "10px 0", borderTop: `1px solid ${C.border}` }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: m.author_email?.includes("kellydando") ? C.gold : C.indigo, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Outfit, sans-serif", fontWeight: 800, fontSize: 11, color: "#0A0F1E", flexShrink: 0 }}>
                {initials(m.author_name)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                  <span style={{ fontFamily: "Outfit, sans-serif", fontSize: 12, fontWeight: 700, color: m.author_email?.includes("kellydando") ? C.gold : C.text }}>{m.author_name}</span>
                  <span style={{ fontFamily: "Outfit, sans-serif", fontSize: 11, color: C.faint }}>{fmt(m.created_at?.slice(0,10))}</span>
                </div>
                <div style={{ fontFamily: "Outfit, sans-serif", fontSize: 12, color: C.muted, lineHeight: 1.5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.body}</div>
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// TASKS PAGE
// ══════════════════════════════════════════════════════════════════════════════
function TasksPage({ tasks }) {
  const [filter, setFilter] = useState("Open");
  const filters = ["All", "Open", "In Progress", "Completed"];
  const shown = filter === "All" ? tasks : tasks.filter(t => t.status === filter || (filter === "Open" && (t.status === "Open" || t.status === "Planned")));

  return (
    <div>
      <div style={{ marginBottom: 20, display: "flex", gap: 8, flexWrap: "wrap" }}>
        {filters.map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: "6px 16px", borderRadius: 20, border: `1px solid ${filter === f ? C.gold : C.border}`,
            background: filter === f ? C.goldLight : "transparent",
            color: filter === f ? C.gold : C.muted,
            fontFamily: "Outfit, sans-serif", fontSize: 12, fontWeight: 600, cursor: "pointer",
          }}>{f}</button>
        ))}
      </div>

      {shown.length === 0 && (
        <Card style={{ textAlign: "center", padding: 40 }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>✓</div>
          <div style={{ fontFamily: "Outfit, sans-serif", fontSize: 14, color: C.muted }}>No tasks in this view</div>
        </Card>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {shown.map(t => {
          const days = daysUntil(t.due);
          const overdue = days !== null && days < 0;
          const s = TASK_STATUS[t.status] || { color: C.muted };
          return (
            <Card key={t.id} style={{ display: "flex", gap: 16, alignItems: "flex-start", padding: "16px 20px" }}>
              {/* Priority dot */}
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: t.priority === "High" ? C.red : t.priority === "Low" ? C.faint : C.amber, marginTop: 6, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "Outfit, sans-serif", fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 4 }}>{t.title}</div>
                <div style={{ display: "flex", gap: 14, flexWrap: "wrap", fontFamily: "Outfit, sans-serif", fontSize: 12, color: C.muted }}>
                  {t.assigned_to && <span>👤 {t.assigned_to}</span>}
                  {t.due && <span style={{ color: overdue ? C.red : days <= 3 ? C.amber : C.muted, fontWeight: overdue ? 700 : 400 }}>📅 Due {fmt(t.due)}{overdue ? " ⚠" : ""}</span>}
                  {t.priority && <span>🔺 {t.priority}</span>}
                </div>
                {t.notes && <div style={{ marginTop: 8, fontFamily: "Outfit, sans-serif", fontSize: 12, color: C.faint, background: "rgba(255,255,255,0.03)", borderRadius: 6, padding: "7px 10px", lineHeight: 1.6 }}>{t.notes}</div>}
              </div>
              <Badge label={t.status} color={s.color} />
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// CALENDAR PAGE
// ══════════════════════════════════════════════════════════════════════════════
function CalendarPage({ events }) {
  const today = new Date().toISOString().slice(0, 10);
  const upcoming = events.filter(e => e.event_date >= today).sort((a, b) => a.event_date.localeCompare(b.event_date));
  const past     = events.filter(e => e.event_date < today).sort((a, b) => b.event_date.localeCompare(a.event_date));

  const EventCard = ({ e }) => {
    const days  = daysUntil(e.event_date);
    const isToday = days === 0;
    const soon  = days !== null && days <= 7 && days > 0;
    return (
      <Card style={{ display: "flex", gap: 16, alignItems: "flex-start", padding: "16px 20px", borderLeft: `3px solid ${isToday ? C.gold : soon ? C.amber : C.teal}` }}>
        <div style={{ textAlign: "center", minWidth: 48 }}>
          <div style={{ fontFamily: "Outfit, sans-serif", fontSize: 22, fontWeight: 800, color: isToday ? C.gold : C.text }}>
            {new Date(e.event_date + "T12:00:00").getDate()}
          </div>
          <div style={{ fontFamily: "Outfit, sans-serif", fontSize: 10, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: .5 }}>
            {new Date(e.event_date + "T12:00:00").toLocaleDateString("en-US", { month: "short" })}
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "Outfit, sans-serif", fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 4 }}>{e.name}</div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", fontFamily: "Outfit, sans-serif", fontSize: 12, color: C.muted }}>
            {e.event_time && <span>🕐 {e.event_time}</span>}
            {e.location   && <span>📍 {e.location}</span>}
            {e.type       && <Badge label={e.type} color={C.indigo} />}
          </div>
          {e.notes && <div style={{ marginTop: 8, fontFamily: "Outfit, sans-serif", fontSize: 12, color: C.faint, lineHeight: 1.6 }}>{e.notes}</div>}
        </div>
        {isToday && <Badge label="Today!" color={C.gold} />}
        {soon    && <Badge label={`${days}d`} color={C.amber} />}
      </Card>
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      <div>
        <div style={{ fontFamily: "Outfit, sans-serif", fontSize: 13, fontWeight: 700, color: C.gold, letterSpacing: 1, textTransform: "uppercase", marginBottom: 14 }}>Upcoming Events</div>
        {upcoming.length === 0 && <Card style={{ textAlign: "center", padding: 32 }}><div style={{ fontFamily: "Outfit, sans-serif", fontSize: 14, color: C.muted }}>No upcoming events scheduled.</div></Card>}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {upcoming.map(e => <EventCard key={e.id} e={e} />)}
        </div>
      </div>
      {past.length > 0 && (
        <div>
          <div style={{ fontFamily: "Outfit, sans-serif", fontSize: 13, fontWeight: 700, color: C.faint, letterSpacing: 1, textTransform: "uppercase", marginBottom: 14 }}>Past Events</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, opacity: 0.6 }}>
            {past.slice(0, 5).map(e => <EventCard key={e.id} e={e} />)}
          </div>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// DOCUMENTS PAGE
// ══════════════════════════════════════════════════════════════════════════════
function DocumentsPage({ clientId }) {
  const [docs, setDocs]         = useState([]);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState("All");
  const [expanded, setExpanded] = useState({});
  const [viewMode, setViewMode] = useState("folder"); // "folder" | "grid"

  useEffect(() => {
    async function load() {
      // Load metadata from client_documents table
      const { data: meta } = await supabase
        .from("client_documents")
        .select("*")
        .eq("client_id", clientId)
        .order("created_at", { ascending: false });

      if (!meta || meta.length === 0) { setLoading(false); return; }

      // Generate signed URLs for each file
      const withUrls = await Promise.all((meta||[]).map(async (m) => {
        const { data: urlData } = await supabase.storage
          .from("client-documents")
          .createSignedUrl(m.file_path, 3600); // 1 hour
        return { ...m, url: urlData?.signedUrl || "" };
      }));

      setDocs(withUrls);
      setLoading(false);
    }
    load();
  }, [clientId]);

  const categories = ["All", ...new Set(docs.map(d => d.category).filter(Boolean))];
  const shown = filter === "All" ? docs : docs.filter(d => d.category === filter);

  // Group by category for folder view
  const grouped = {};
  shown.forEach(d => {
    const cat = d.category || "Other";
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(d);
  });

  const fileIcon = (type) => {
    if (!type) return "📄";
    if (type.includes("pdf")) return "📕";
    if (type.includes("word") || type.includes("doc")) return "📝";
    if (type.includes("sheet") || type.includes("excel") || type.includes("csv")) return "📊";
    if (type.includes("image") || type.includes("png") || type.includes("jpg")) return "🖼️";
    if (type.includes("presentation") || type.includes("powerpoint")) return "📋";
    return "📄";
  };

  const fmtSize = (bytes) => {
    if (!bytes) return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes/1024).toFixed(1)} KB`;
    return `${(bytes/1048576).toFixed(1)} MB`;
  };

  const catFolderIcon = { Minutes: "📁", Financials: "📁", Bylaws: "📁", Reports: "📁", Other: "📁" };

  if (loading) return <div style={{ textAlign: "center", padding: 60, fontFamily: "Outfit, sans-serif", color: C.muted }}>Loading documents…</div>;

  return (
    <div>
      {/* Toolbar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {categories.map(c => (
            <button key={c} onClick={() => setFilter(c)} style={{ padding: "6px 16px", borderRadius: 20, border: `1px solid ${filter === c ? C.gold : C.border}`, background: filter === c ? C.goldLight : "transparent", color: filter === c ? C.gold : C.muted, fontFamily: "Outfit, sans-serif", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>{c}</button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 4, background: "rgba(255,255,255,0.05)", borderRadius: 8, padding: 3 }}>
          {[["folder","📁 Folders"],["grid","⊞ Grid"]].map(([v,l]) => (
            <button key={v} onClick={() => setViewMode(v)} style={{ padding: "5px 12px", borderRadius: 6, border: "none", background: viewMode === v ? C.card : "transparent", color: viewMode === v ? C.text : C.muted, fontFamily: "Outfit, sans-serif", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>{l}</button>
          ))}
        </div>
      </div>

      {docs.length === 0 && (
        <Card style={{ textAlign: "center", padding: 48 }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>📂</div>
          <div style={{ fontFamily: "Outfit, sans-serif", fontSize: 14, color: C.muted }}>No documents uploaded yet.</div>
        </Card>
      )}

      {/* ── FOLDER VIEW ── */}
      {viewMode === "folder" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {Object.entries(grouped).map(([cat, files]) => {
            const isOpen = expanded[cat] !== false; // default open
            return (
              <div key={cat} style={{ border: `1px solid ${C.border}`, borderRadius: 10, overflow: "hidden" }}>
                {/* Folder header */}
                <div onClick={() => setExpanded(e => ({ ...e, [cat]: !isOpen }))}
                  style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", background: C.card, cursor: "pointer", userSelect: "none" }}>
                  <span style={{ fontSize: 18 }}>{isOpen ? "📂" : "📁"}</span>
                  <span style={{ fontFamily: "Outfit, sans-serif", fontSize: 14, fontWeight: 700, color: C.text, flex: 1 }}>{cat}</span>
                  <span style={{ fontFamily: "Outfit, sans-serif", fontSize: 11, color: C.muted }}>{files.length} file{files.length !== 1 ? "s" : ""}</span>
                  <span style={{ color: C.muted, fontSize: 12 }}>{isOpen ? "▾" : "▸"}</span>
                </div>
                {/* Files inside folder */}
                {isOpen && (
                  <div style={{ background: C.surface }}>
                    {files.map((d, i) => (
                      <a key={d.id} href={d.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                        <div style={{
                          display: "flex", alignItems: "center", gap: 12, padding: "10px 16px 10px 36px",
                          borderTop: `1px solid ${C.border}`, transition: "background .15s",
                        }}
                          onMouseEnter={e => e.currentTarget.style.background = C.card}
                          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                        >
                          <span style={{ fontSize: 18, flexShrink: 0 }}>{fileIcon(d.file_type)}</span>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontFamily: "Outfit, sans-serif", fontSize: 13, fontWeight: 600, color: C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.name}</div>
                            <div style={{ fontFamily: "Outfit, sans-serif", fontSize: 11, color: C.faint, marginTop: 2 }}>
                              {fmt(d.created_at?.slice(0, 10))}{d.file_size ? ` · ${fmtSize(d.file_size)}` : ""}{d.uploaded_by ? ` · ${d.uploaded_by}` : ""}
                            </div>
                          </div>
                          <span style={{ fontFamily: "Outfit, sans-serif", fontSize: 12, color: C.teal, fontWeight: 600, flexShrink: 0 }}>Open ↗</span>
                        </div>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── GRID VIEW ── */}
      {viewMode === "grid" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 14 }}>
          {shown.map(d => (
            <a key={d.id} href={d.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
              <Card style={{ cursor: "pointer" }}>
                <div style={{ fontSize: 32, marginBottom: 10 }}>{fileIcon(d.file_type)}</div>
                <div style={{ fontFamily: "Outfit, sans-serif", fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 6, lineHeight: 1.4 }}>{d.name}</div>
                {d.category && <Badge label={d.category} color={C.indigo} />}
                <div style={{ fontFamily: "Outfit, sans-serif", fontSize: 11, color: C.faint, marginTop: 10 }}>
                  {fmt(d.created_at?.slice(0, 10))}{d.file_size ? ` · ${fmtSize(d.file_size)}` : ""}
                </div>
                <div style={{ marginTop: 10, fontFamily: "Outfit, sans-serif", fontSize: 12, color: C.teal, fontWeight: 600 }}>Open ↗</div>
              </Card>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// MESSAGES PAGE
// ══════════════════════════════════════════════════════════════════════════════
function MessagesPage({ boardUser, clientId, messages, onNewMessage }) {
  const [body, setBody]     = useState("");
  const [sending, setSending] = useState(false);

  const send = async () => {
    if (!body.trim()) return;
    setSending(true);
    const { data, error } = await supabase.from("board_messages").insert({
      client_id:    clientId,
      author_name:  boardUser.full_name || boardUser.email,
      author_email: boardUser.email,
      body:         body.trim(),
    }).select().single();
    if (!error && data) { onNewMessage(data); setBody(""); }
    setSending(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Compose */}
      <Card>
        <Label>New Message</Label>
        <textarea value={body} onChange={e => setBody(e.target.value)} placeholder="Type a message to your chapter board and KDC team…" rows={3}
          style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: `1px solid ${C.border}`, background: C.surface, fontFamily: "Outfit, sans-serif", fontSize: 13, color: C.text, outline: "none", resize: "vertical", boxSizing: "border-box", marginBottom: 12 }}
          onFocus={e => e.target.style.borderColor = C.gold}
          onBlur={e => e.target.style.borderColor = C.border}
        />
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Btn onClick={send} disabled={sending || !body.trim()}>{sending ? "Sending…" : "Send Message →"}</Btn>
        </div>
      </Card>

      {/* Thread */}
      {messages.length === 0 && (
        <Card style={{ textAlign: "center", padding: 40 }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>💬</div>
          <div style={{ fontFamily: "Outfit, sans-serif", fontSize: 14, color: C.muted }}>No messages yet. Start the conversation!</div>
        </Card>
      )}

      {messages.map(m => {
        const isKDC  = m.author_email?.includes("kellydando") || m.author_email?.includes("kdc");
        const isMe   = m.author_email === boardUser.email;
        return (
          <Card key={m.id} style={{ borderLeft: `3px solid ${isKDC ? C.gold : isMe ? C.teal : C.indigo}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: isKDC ? C.gold : isMe ? C.teal : C.indigo, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Outfit, sans-serif", fontWeight: 800, fontSize: 12, color: "#0A0F1E", flexShrink: 0 }}>
                {initials(m.author_name)}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontFamily: "Outfit, sans-serif", fontSize: 13, fontWeight: 700, color: isKDC ? C.gold : C.text }}>
                    {m.author_name}{isKDC ? " · KDC" : isMe ? " · You" : ""}
                  </span>
                  <span style={{ fontFamily: "Outfit, sans-serif", fontSize: 11, color: C.faint }}>{fmt(m.created_at?.slice(0, 10))}</span>
                </div>
              </div>
            </div>
            <div style={{ fontFamily: "Outfit, sans-serif", fontSize: 14, color: C.text, lineHeight: 1.7, paddingLeft: 46 }}>{m.body}</div>
            {m.pinned && <div style={{ marginTop: 8, paddingLeft: 46 }}><Badge label="📌 Pinned" color={C.gold} /></div>}
          </Card>
        );
      })}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN APP
// ══════════════════════════════════════════════════════════════════════════════
const NAV = [
  { id: "dashboard", icon: "🏠", label: "Dashboard" },
  { id: "tasks",     icon: "📋", label: "Tasks" },
  { id: "calendar",  icon: "📅", label: "Calendar" },
  { id: "documents", icon: "📂", label: "Documents" },
  { id: "messages",  icon: "💬", label: "Messages" },
];

export default function App() {
  const [session,    setSession]    = useState(null);
  const [boardUser,  setBoardUser]  = useState(null);
  const [authState,  setAuthState]  = useState("loading"); // loading | unauthenticated | magic_sent | authorized | not_authorized
  const [magicEmail, setMagicEmail] = useState("");
  const [page,       setPage]       = useState("dashboard");

  // Data
  const [tasks,    setTasks]    = useState([]);
  const [events,   setEvents]   = useState([]);
  const [messages, setMessages] = useState([]);

  // ── Auth listener ────────────────────────────────────────────────────────────
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) lookupBoardUser(session.user.email);
      else setAuthState("unauthenticated");
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) lookupBoardUser(session.user.email);
      else { setAuthState("unauthenticated"); setBoardUser(null); }
    });
    return () => subscription.unsubscribe();
  }, []);

  const lookupBoardUser = async (email) => {
    const { data } = await supabase.from("board_users").select("*").eq("email", email).eq("active", true).single();
    if (data) {
      setBoardUser(data);
      setAuthState("authorized");
      loadData(data.client_id);
    } else {
      setAuthState("not_authorized");
    }
  };

  const loadData = async (clientId) => {
    const [tasksRes, eventsRes, msgsRes] = await Promise.all([
      supabase.from("tasks").select("*").eq("client_id", clientId).neq("status", "Completed").order("due", { ascending: true, nullsFirst: false }),
      supabase.from("events").select("*").eq("client_id", clientId).order("date", { ascending: true }),
      supabase.from("board_messages").select("*").eq("client_id", clientId).order("created_at", { ascending: false }),
    ]);
    setTasks(tasksRes.data   || []);
    setEvents((eventsRes.data || []).map(e => ({
      ...e,
      event_date: e.event_date || e.date || "",
      event_time: e.event_time || e.time || "",
    })));
    setMessages(msgsRes.data || []);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setAuthState("unauthenticated");
    setBoardUser(null);
  };

  // ── Render based on auth state ───────────────────────────────────────────────
  if (authState === "loading") return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: C.bg }}>
      <div style={{ fontFamily: "Outfit, sans-serif", fontSize: 14, color: C.muted }}>Loading…</div>
    </div>
  );
  if (authState === "unauthenticated") return <LoginPage onMagicSent={email => { setMagicEmail(email); setAuthState("magic_sent"); }} />;
  if (authState === "magic_sent")      return <MagicSentPage email={magicEmail} />;
  if (authState === "not_authorized")  return <NotAuthorizedPage email={session?.user?.email} onSignOut={signOut} />;

  // ── Authorized layout ────────────────────────────────────────────────────────
  const openTaskCount = tasks.filter(t => t.status !== "Completed").length;
  const msgCount      = messages.length;

  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", flexDirection: "column" }}>
      {/* Top nav */}
      <div style={{
        background: C.surface, borderBottom: `1px solid ${C.border}`,
        padding: "0 28px", height: 60, display: "flex", alignItems: "center",
        justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: C.gold, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Outfit, sans-serif", fontWeight: 900, fontSize: 10, color: "#0A0F1E", letterSpacing: 1 }}>AMC</div>
          <div>
            <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 16, color: C.text, lineHeight: 1 }}>Board Portal</div>
            <div style={{ fontFamily: "Outfit, sans-serif", fontSize: 10, color: C.muted, marginTop: 1 }}>{boardUser.chapter_name}</div>
          </div>
        </div>

        {/* Nav tabs */}
        <div style={{ display: "flex", gap: 4 }}>
          {NAV.map(n => {
            const badge = n.id === "tasks" ? openTaskCount : n.id === "messages" ? msgCount : 0;
            return (
              <button key={n.id} onClick={() => setPage(n.id)} style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "6px 14px", borderRadius: 8, border: "none",
                background: page === n.id ? "rgba(201,151,74,0.15)" : "transparent",
                color: page === n.id ? C.gold : C.muted,
                fontFamily: "Outfit, sans-serif", fontSize: 12, fontWeight: page === n.id ? 700 : 500,
                cursor: "pointer", transition: "all .15s", position: "relative",
              }}>
                <span>{n.icon}</span> {n.label}
                {badge > 0 && <span style={{ background: C.red, color: "#fff", borderRadius: 10, fontSize: 9, fontWeight: 800, padding: "1px 5px", lineHeight: 1.4 }}>{badge}</span>}
              </button>
            );
          })}
        </div>

        {/* User menu */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: C.indigo, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Outfit, sans-serif", fontWeight: 800, fontSize: 12, color: "#0A0F1E" }}>
            {initials(boardUser.full_name || boardUser.email)}
          </div>
          <button onClick={signOut} style={{ fontFamily: "Outfit, sans-serif", fontSize: 12, color: C.faint, background: "none", border: "none", cursor: "pointer" }}>Sign out</button>
        </div>
      </div>

      {/* Page content */}
      <div style={{ flex: 1, maxWidth: 1100, width: "100%", margin: "0 auto", padding: "32px 28px" }}>
        {/* Page header */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 28, color: C.text, marginBottom: 4 }}>
            {NAV.find(n => n.id === page)?.icon} {NAV.find(n => n.id === page)?.label}
          </div>
          <div style={{ fontFamily: "Outfit, sans-serif", fontSize: 13, color: C.muted }}>
            {boardUser.chapter_name} Chapter · {boardUser.full_name || boardUser.email}
          </div>
        </div>

        {page === "dashboard" && <DashboardPage boardUser={boardUser} tasks={tasks} events={events} messages={messages} />}
        {page === "tasks"     && <TasksPage tasks={tasks} />}
        {page === "calendar"  && <CalendarPage events={events} />}
        {page === "documents" && <DocumentsPage clientId={boardUser.client_id} />}
        {page === "messages"  && <MessagesPage boardUser={boardUser} clientId={boardUser.client_id} messages={messages} onNewMessage={m => setMessages(ms => [m, ...ms])} />}
      </div>

      {/* Footer */}
      <div style={{ borderTop: `1px solid ${C.border}`, padding: "16px 28px", textAlign: "center", fontFamily: "Outfit, sans-serif", fontSize: 11, color: C.faint }}>
        Powered by AMCmgr · Kelly Dando Consulting
      </div>
    </div>
  );
}
