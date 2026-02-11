import { Icon } from "./Shared";

export default function Layout({ activePage, setActivePage, sidebarOpen, setSidebarOpen, children }) {
  return (
    <>
      <aside style={{
        width: sidebarOpen ? 240 : 70, background: "#080f1c",
        borderRight: "1px solid #0f172a", display: "flex", flexDirection: "column",
        padding: "0 12px 20px", transition: "width 0.25s ease", flexShrink: 0, overflow: "hidden"
      }}>
        <div style={{ padding: "20px 8px 28px", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: "linear-gradient(135deg, #4f80ff, #7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 16, fontWeight: 800, color: "#fff" }}>H</div>
          {sidebarOpen && (
            <div>
              <div style={{ fontSize: 15, fontWeight: 800, color: "#f8fafc", letterSpacing: "-0.02em" }}>HRMS</div>
              <div style={{ fontSize: 10, color: "#475569", fontWeight: 500 }}>LITE · ADMIN</div>
            </div>
          )}
        </div>
        {[
          { id: "dashboard", label: "Dashboard", icon: "dashboard" },
          { id: "employees", label: "Employees", icon: "employees" },
          { id: "attendance", label: "Attendance", icon: "attendance" },
        ].map(item => (
          <button key={item.id} className="nav-item" onClick={() => setActivePage(item.id)} style={{
            display: "flex", alignItems: "center", gap: 12,
            padding: "11px 10px", borderRadius: 10, border: "none",
            background: activePage === item.id ? "#1e293b" : "transparent",
            color: activePage === item.id ? "#f8fafc" : "#64748b",
            cursor: "pointer", marginBottom: 3, width: "100%", textAlign: "left",
            transition: "all 0.15s ease",
            borderLeft: activePage === item.id ? "3px solid #4f80ff" : "3px solid transparent",
          }}>
            <span style={{ flexShrink: 0 }}><Icon name={item.icon} size={18} /></span>
            {sidebarOpen && <span style={{ fontSize: 14, fontWeight: 500 }}>{item.label}</span>}
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <button className="nav-item" onClick={() => setSidebarOpen(o => !o)} style={{
          display: "flex", alignItems: "center", justifyContent: sidebarOpen ? "flex-end" : "center",
          padding: "10px", border: "none", background: "transparent", color: "#475569", cursor: "pointer", borderRadius: 10
        }}>
          <span style={{ transform: sidebarOpen ? "none" : "rotate(180deg)", transition: "transform 0.2s" }}><Icon name="chevron" size={16} /></span>
        </button>
      </aside>
      <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <header style={{ padding: "16px 28px", borderBottom: "1px solid #0f172a", display: "flex", alignItems: "center", justifyContent: "space-between", background: "#020617", flexShrink: 0 }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#f8fafc" }}>
              {{ dashboard: "Dashboard", employees: "Employee Management", attendance: "Attendance Tracking" }[activePage]}
            </div>
            <div style={{ fontSize: 12, color: "#475569", marginTop: 1 }}>
              {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: "linear-gradient(135deg, #4f80ff, #7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff" }}>A</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#94a3b8" }}>Admin</div>
          </div>
        </header>
        <div style={{ flex: 1, overflow: "auto", padding: "28px" }}>
          {children}
        </div>
      </main>
    </>
  );
}
