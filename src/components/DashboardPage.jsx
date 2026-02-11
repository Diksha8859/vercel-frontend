import { useState, useEffect } from "react";
import { api, DEPT_COLORS, Icon, Spinner, EmptyState, StatCard, DeptBadge } from "./Shared";

export default function DashboardPage({ addToast, goTo }) {
  const [summary, setSummary] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([api.get("/dashboard/summary"), api.get("/employees")])
      .then(([s, e]) => { setSummary(s); setEmployees(e); })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 300 }}><Spinner size={32} /></div>;
  if (error) return <div style={{ color: "#f87171", padding: 20, background: "#450a0a", borderRadius: 12, border: "1px solid #7f1d1d" }}>Error loading dashboard: {error}</div>;

  const today = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" });

  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 28 }}>
        <StatCard label="Total Employees" value={summary.total_employees} sub="All departments" accent="#4f80ff" icon="employees" />
        <StatCard label="Present Today" value={summary.present_today} sub={today} accent="#4ade80" icon="check" />
        <StatCard label="Absent Today" value={summary.absent_today} sub={today} accent="#f87171" icon="x" />
        <StatCard label="Not Marked" value={summary.not_marked_today} sub="Pending for today" accent="#fbbf24" icon="alert" />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 14, padding: 22 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8", marginBottom: 18, letterSpacing: "0.04em", textTransform: "uppercase" }}>Department Breakdown</div>
          {Object.entries(summary.department_distribution).length === 0 ? (
            <EmptyState icon="building" title="No departments yet" subtitle="Add employees to see distribution" />
          ) : Object.entries(summary.department_distribution).map(([dept, count]) => (
            <div key={dept} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <div style={{ width: 10, height: 10, borderRadius: 3, background: DEPT_COLORS[dept] || "#64748b", flexShrink: 0 }} />
              <span style={{ fontSize: 13, color: "#e2e8f0", flex: 1 }}>{dept}</span>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ height: 6, borderRadius: 3, background: `${DEPT_COLORS[dept] || "#64748b"}33`, width: 100 }}>
                  <div style={{ height: "100%", width: `${(count / summary.total_employees) * 100}%`, background: DEPT_COLORS[dept] || "#64748b", borderRadius: 3, transition: "width 0.5s ease" }} />
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#94a3b8", fontFamily: "'DM Mono', monospace", width: 20, textAlign: "right" }}>{count}</span>
              </div>
            </div>
          ))}
        </div>
        <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 14, padding: 22 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.04em", textTransform: "uppercase" }}>Recent Employees</div>
            <button onClick={() => goTo("employees")} style={{ fontSize: 12, color: "#4f80ff", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>View all →</button>
          </div>
          {employees.length === 0 ? (
            <EmptyState icon="users" title="No employees yet" subtitle="Add your first employee" />
          ) : employees.slice(-5).reverse().map(emp => (
            <div key={emp.employee_id} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
              <div style={{ width: 36, height: 36, borderRadius: 9, background: `${DEPT_COLORS[emp.department] || "#64748b"}22`, display: "flex", alignItems: "center", justifyContent: "center", color: DEPT_COLORS[emp.department] || "#64748b", fontSize: 14, fontWeight: 700, flexShrink: 0 }}>
                {emp.full_name.charAt(0).toUpperCase()}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{emp.full_name}</div>
                <div style={{ fontSize: 11, color: "#64748b" }}>{emp.employee_id}</div>
              </div>
              <DeptBadge dept={emp.department} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
