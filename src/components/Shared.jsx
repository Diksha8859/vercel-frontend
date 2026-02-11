// API, constants, and reusable UI primitives used by Layout and page components.

const API = "https://vercel-backend-pi-amber.vercel.app";

export const api = {
  get: (path) => fetch(`${API}${path}`).then(r => r.ok ? r.json() : r.json().then(e => { throw new Error(e.detail || "Request failed") })),
  post: (path, body) => fetch(`${API}${path}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }).then(r => r.ok ? r.json() : r.json().then(e => { throw new Error(e.detail || "Request failed") })),
  del: (path) => fetch(`${API}${path}`, { method: "DELETE" }).then(r => r.ok ? r.json() : r.json().then(e => { throw new Error(e.detail || "Request failed") })),
};

export const DEPT_COLORS = {
  Engineering: "#3b82f6", Marketing: "#f59e0b", Sales: "#10b981",
  HR: "#8b5cf6", Finance: "#ef4444", Operations: "#f97316",
  Design: "#ec4899", Product: "#06b6d4",
};

export const DEPARTMENTS = ["Engineering", "Marketing", "Sales", "HR", "Finance", "Operations", "Design", "Product"];

export const Icon = ({ name, size = 18 }) => {
  const icons = {
    dashboard: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
    employees: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    attendance: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><polyline points="9 16 11 18 15 14"/></svg>,
    plus: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    trash: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>,
    x: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    check: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>,
    search: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
    users: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>,
    chevron: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>,
    alert: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
    building: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="18"/><line x1="8" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="16" y2="21"/><line x1="2" y1="9" x2="22" y2="9"/><line x1="2" y1="15" x2="22" y2="15"/></svg>,
    menu: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  };
  return icons[name] || null;
};

export const Toast = ({ toasts, remove }) => (
  <div style={{ position: "fixed", top: 20, right: 20, zIndex: 9999, display: "flex", flexDirection: "column", gap: 8 }}>
    {toasts.map(t => (
      <div key={t.id} style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "12px 16px", borderRadius: 10,
        background: t.type === "success" ? "#0f172a" : "#450a0a",
        border: `1px solid ${t.type === "success" ? "#334155" : "#7f1d1d"}`,
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
        color: "#f8fafc", fontSize: 14, minWidth: 280, maxWidth: 360,
        animation: "slideIn 0.3s ease",
      }}>
        <span style={{ color: t.type === "success" ? "#4ade80" : "#f87171", flexShrink: 0 }}>
          {t.type === "success" ? <Icon name="check" size={16} /> : <Icon name="alert" size={16} />}
        </span>
        <span style={{ flex: 1, lineHeight: 1.4 }}>{t.message}</span>
        <button onClick={() => remove(t.id)} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", padding: 2, display: "flex" }}>
          <Icon name="x" size={14} />
        </button>
      </div>
    ))}
  </div>
);

export const Spinner = ({ size = 20 }) => (
  <div style={{
    width: size, height: size, border: `2px solid #334155`,
    borderTopColor: "#e2e8f0", borderRadius: "50%",
    animation: "spin 0.7s linear infinite", display: "inline-block"
  }} />
);

export const EmptyState = ({ icon, title, subtitle }) => (
  <div style={{ textAlign: "center", padding: "60px 20px", color: "#64748b" }}>
    <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.4 }}>
      <Icon name={icon} size={48} />
    </div>
    <div style={{ fontSize: 16, fontWeight: 600, color: "#94a3b8", marginBottom: 6 }}>{title}</div>
    <div style={{ fontSize: 13 }}>{subtitle}</div>
  </div>
);

export const StatCard = ({ label, value, sub, accent, icon }) => (
  <div style={{
    background: "#0f172a", border: "1px solid #1e293b", borderRadius: 14,
    padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "flex-start"
  }}>
    <div>
      <div style={{ fontSize: 12, color: "#64748b", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 10 }}>{label}</div>
      <div style={{ fontSize: 36, fontWeight: 700, color: accent || "#f8fafc", fontFamily: "'DM Mono', monospace", lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: "#475569", marginTop: 8 }}>{sub}</div>}
    </div>
    <div style={{ width: 44, height: 44, borderRadius: 10, background: `${accent}18`, display: "flex", alignItems: "center", justifyContent: "center", color: accent || "#64748b" }}>
      <Icon name={icon} size={20} />
    </div>
  </div>
);

export const Modal = ({ open, onClose, title, children }) => {
  if (!open) return null;
  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)",
      zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "#0f172a", border: "1px solid #1e293b", borderRadius: 18,
        width: "100%", maxWidth: 480, padding: 28, boxShadow: "0 25px 60px rgba(0,0,0,0.6)",
        animation: "modalIn 0.25s ease"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#f8fafc" }}>{title}</h3>
          <button onClick={onClose} style={{ background: "#1e293b", border: "none", color: "#94a3b8", cursor: "pointer", width: 32, height: 32, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="x" size={16} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export const Input = ({ label, ...props }) => (
  <div style={{ marginBottom: 18 }}>
    <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#94a3b8", marginBottom: 6, letterSpacing: "0.04em" }}>{label}</label>
    {props.type === "select" ? (
      <select {...props} type={undefined} style={{
        width: "100%", padding: "10px 12px", background: "#1e293b", border: "1px solid #334155",
        borderRadius: 9, color: "#e2e8f0", fontSize: 14, outline: "none", cursor: "pointer"
      }}>
        <option value="">Select {label}</option>
        {props.options?.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    ) : (
      <input {...props} style={{
        width: "100%", padding: "10px 12px", background: "#1e293b", border: "1px solid #334155",
        borderRadius: 9, color: "#e2e8f0", fontSize: 14, outline: "none",
        boxSizing: "border-box"
      }} />
    )}
  </div>
);

export const ConfirmDialog = ({ open, title, message, onConfirm, onCancel, loading }) => (
  <Modal open={open} onClose={onCancel} title={title}>
    <p style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.6, marginTop: 0 }}>{message}</p>
    <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 24 }}>
      <button onClick={onCancel} style={{ padding: "9px 18px", borderRadius: 9, border: "1px solid #334155", background: "transparent", color: "#94a3b8", cursor: "pointer", fontSize: 14 }}>
        Cancel
      </button>
      <button onClick={onConfirm} disabled={loading} style={{ padding: "9px 18px", borderRadius: 9, border: "none", background: "#ef4444", color: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
        {loading ? <Spinner size={14} /> : <Icon name="trash" size={14} />} Delete
      </button>
    </div>
  </Modal>
);

export const DeptBadge = ({ dept }) => (
  <span style={{
    display: "inline-flex", alignItems: "center", gap: 5,
    padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600,
    background: `${DEPT_COLORS[dept] || "#64748b"}18`,
    color: DEPT_COLORS[dept] || "#94a3b8",
    border: `1px solid ${DEPT_COLORS[dept] || "#64748b"}30`
  }}>{dept}</span>
);

export const StatusBadge = ({ status }) => (
  <span style={{
    display: "inline-flex", alignItems: "center", gap: 5,
    padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700,
    background: status === "Present" ? "#16a34a18" : "#dc262618",
    color: status === "Present" ? "#4ade80" : "#f87171",
    border: `1px solid ${status === "Present" ? "#16a34a40" : "#dc262640"}`
  }}>
    <span style={{ width: 6, height: 6, borderRadius: "50%", background: status === "Present" ? "#4ade80" : "#f87171", display: "inline-block" }} />
    {status}
  </span>
);
