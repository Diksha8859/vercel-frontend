import { useState, useEffect, useCallback } from "react";
import {
  api, DEPT_COLORS, Icon, Spinner, EmptyState, Modal, Input, DeptBadge, StatusBadge
} from "./Shared";

export default function AttendancePage({ addToast }) {
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [attLoading, setAttLoading] = useState(false);
  const [showMark, setShowMark] = useState(false);
  const [markLoading, setMarkLoading] = useState(false);
  const [filterEmp, setFilterEmp] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [form, setForm] = useState({ employee_id: "", date: new Date().toISOString().split("T")[0], status: "Present" });

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [emps, att] = await Promise.all([api.get("/employees"), api.get("/attendance")]);
      setEmployees(emps);
      setAttendance(att);
    } catch (e) { addToast(e.message, "error"); } finally { setLoading(false); }
  }, [addToast]);

  const loadAttendance = useCallback(async () => {
    setAttLoading(true);
    let path = "/attendance?";
    if (filterEmp) path += `employee_id=${filterEmp}&`;
    if (filterDate) path += `date=${filterDate}`;
    try { setAttendance(await api.get(path)); } catch (e) { addToast(e.message, "error"); } finally { setAttLoading(false); }
  }, [filterEmp, filterDate, addToast]);

  useEffect(() => { loadAll(); }, [loadAll]);
  useEffect(() => { loadAttendance(); }, [loadAttendance]);

  const handleMark = async () => {
    if (!form.employee_id) { addToast("Please select an employee", "error"); return; }
    setMarkLoading(true);
    try {
      await api.post("/attendance", form);
      addToast("Attendance marked successfully");
      setShowMark(false);
      setForm(f => ({ ...f, employee_id: "", status: "Present" }));
      loadAttendance();
    } catch (e) { addToast(e.message, "error"); } finally { setMarkLoading(false); }
  };

  const getEmpName = id => employees.find(e => e.employee_id === id)?.full_name || id;
  const getEmpDept = id => employees.find(e => e.employee_id === id)?.department || "";
  const presentCount = attendance.filter(a => a.status === "Present").length;
  const absentCount = attendance.filter(a => a.status === "Absent").length;

  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      {attendance.length > 0 && (
        <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
          <div style={{ flex: 1, background: "#0f172a", border: "1px solid #1e293b", borderRadius: 10, padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>TOTAL RECORDS</span>
            <span style={{ fontSize: 20, fontWeight: 700, fontFamily: "'DM Mono', monospace", color: "#f8fafc" }}>{attendance.length}</span>
          </div>
          <div style={{ flex: 1, background: "#0f172a", border: "1px solid #1e293b", borderRadius: 10, padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>PRESENT</span>
            <span style={{ fontSize: 20, fontWeight: 700, fontFamily: "'DM Mono', monospace", color: "#4ade80" }}>{presentCount}</span>
          </div>
          <div style={{ flex: 1, background: "#0f172a", border: "1px solid #1e293b", borderRadius: 10, padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>ABSENT</span>
            <span style={{ fontSize: 20, fontWeight: 700, fontFamily: "'DM Mono', monospace", color: "#f87171" }}>{absentCount}</span>
          </div>
        </div>
      )}
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        <select value={filterEmp} onChange={e => setFilterEmp(e.target.value)} style={{ flex: 1, minWidth: 180, padding: "9px 12px", background: "#0f172a", border: "1px solid #1e293b", borderRadius: 9, color: filterEmp ? "#e2e8f0" : "#64748b", fontSize: 13, outline: "none", cursor: "pointer" }}>
          <option value="">All Employees</option>
          {employees.map(e => <option key={e.employee_id} value={e.employee_id}>{e.full_name} ({e.employee_id})</option>)}
        </select>
        <input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)} style={{ padding: "9px 12px", background: "#0f172a", border: "1px solid #1e293b", borderRadius: 9, color: filterDate ? "#e2e8f0" : "#64748b", fontSize: 13, outline: "none", colorScheme: "dark" }} />
        {(filterEmp || filterDate) && (
          <button onClick={() => { setFilterEmp(""); setFilterDate(""); }} style={{ padding: "9px 14px", background: "#1e293b", border: "1px solid #334155", borderRadius: 9, color: "#94a3b8", cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", gap: 5 }}>
            <Icon name="x" size={14} /> Clear
          </button>
        )}
        <button onClick={() => setShowMark(true)} style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 18px", background: "linear-gradient(135deg, #4f80ff, #7c3aed)", border: "none", borderRadius: 9, color: "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer", marginLeft: "auto" }}>
          <Icon name="plus" size={16} /> Mark Attendance
        </button>
      </div>
      <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 14, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 500 }}>
            <thead>
              <tr style={{ background: "#080f1c" }}>
                {["Employee", "Department", "Date", "Status", "Marked At"].map(h => (
                  <th key={h} style={{ padding: "13px 18px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#475569", letterSpacing: "0.06em", textTransform: "uppercase", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading || attLoading ? (
                <tr><td colSpan={5} style={{ padding: 60, textAlign: "center" }}><Spinner size={24} /></td></tr>
              ) : attendance.length === 0 ? (
                <tr><td colSpan={5}><EmptyState icon="attendance" title="No attendance records" subtitle={filterEmp || filterDate ? "Try changing filters" : "Mark attendance for employees"} /></td></tr>
              ) : attendance.map(rec => (
                <tr key={`${rec.employee_id}_${rec.date}`} className="row-hover" style={{ borderTop: "1px solid #1e293b" }}>
                  <td style={{ padding: "14px 18px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 34, height: 34, borderRadius: 8, background: `${DEPT_COLORS[getEmpDept(rec.employee_id)] || "#64748b"}22`, display: "flex", alignItems: "center", justifyContent: "center", color: DEPT_COLORS[getEmpDept(rec.employee_id)] || "#94a3b8", fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
                        {getEmpName(rec.employee_id).charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: "#e2e8f0" }}>{getEmpName(rec.employee_id)}</div>
                        <div style={{ fontSize: 11, color: "#64748b", fontFamily: "'DM Mono', monospace" }}>{rec.employee_id}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "14px 18px" }}><DeptBadge dept={getEmpDept(rec.employee_id)} /></td>
                  <td style={{ padding: "14px 18px", fontSize: 13, color: "#94a3b8", fontFamily: "'DM Mono', monospace", fontWeight: 500 }}>
                    {new Date(rec.date + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                  <td style={{ padding: "14px 18px" }}><StatusBadge status={rec.status} /></td>
                  <td style={{ padding: "14px 18px", fontSize: 12, color: "#475569" }}>
                    {new Date(rec.marked_at).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {attendance.length > 0 && (
          <div style={{ padding: "12px 18px", borderTop: "1px solid #1e293b", fontSize: 12, color: "#475569" }}>
            {attendance.length} record{attendance.length !== 1 ? "s" : ""} found
          </div>
        )}
      </div>
      <Modal open={showMark} onClose={() => setShowMark(false)} title="Mark Attendance">
        {employees.length === 0 ? (
          <div style={{ color: "#94a3b8", textAlign: "center", padding: 20 }}>No employees found. Add employees first.</div>
        ) : (
          <>
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#94a3b8", marginBottom: 6, letterSpacing: "0.04em" }}>Employee</label>
              <select value={form.employee_id} onChange={e => setForm(f => ({ ...f, employee_id: e.target.value }))} style={{ width: "100%", padding: "10px 12px", background: "#1e293b", border: "1px solid #334155", borderRadius: 9, color: "#e2e8f0", fontSize: 14, outline: "none", cursor: "pointer" }}>
                <option value="">Select Employee</option>
                {employees.map(e => <option key={e.employee_id} value={e.employee_id}>{e.full_name} — {e.department}</option>)}
              </select>
            </div>
            <Input label="Date" type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} style={{ colorScheme: "dark" }} />
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#94a3b8", marginBottom: 8, letterSpacing: "0.04em" }}>Status</label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {["Present", "Absent"].map(s => (
                  <button key={s} onClick={() => setForm(f => ({ ...f, status: s }))} style={{
                    padding: "12px", borderRadius: 10, cursor: "pointer", fontWeight: 600, fontSize: 14,
                    border: form.status === s ? `2px solid ${s === "Present" ? "#4ade80" : "#f87171"}` : "2px solid #1e293b",
                    background: form.status === s ? `${s === "Present" ? "#4ade80" : "#f87171"}15` : "#1e293b",
                    color: form.status === s ? (s === "Present" ? "#4ade80" : "#f87171") : "#64748b",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    transition: "all 0.15s ease"
                  }}>
                    {s === "Present" ? <Icon name="check" size={16} /> : <Icon name="x" size={16} />} {s}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button onClick={() => setShowMark(false)} style={{ padding: "10px 20px", borderRadius: 9, border: "1px solid #334155", background: "transparent", color: "#94a3b8", cursor: "pointer", fontSize: 14 }}>Cancel</button>
              <button onClick={handleMark} disabled={markLoading} style={{ display: "flex", alignItems: "center", gap: 7, padding: "10px 20px", borderRadius: 9, border: "none", background: "linear-gradient(135deg, #4f80ff, #7c3aed)", color: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 600 }}>
                {markLoading ? <Spinner size={14} /> : <Icon name="attendance" size={16} />} Save Attendance
              </button>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}
