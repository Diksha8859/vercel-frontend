import { useState, useEffect, useCallback } from "react";
import {
  api, DEPT_COLORS, DEPARTMENTS, Icon, Spinner, EmptyState, Modal, Input, ConfirmDialog, DeptBadge
} from "./Shared";

export default function EmployeesPage({ addToast }) {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [delTarget, setDelTarget] = useState(null);
  const [delLoading, setDelLoading] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [form, setForm] = useState({ employee_id: "", full_name: "", email: "", department: "" });
  const [errors, setErrors] = useState({});

  const load = useCallback(() => {
    setLoading(true);
    api.get("/employees").then(setEmployees).catch(e => addToast(e.message, "error")).finally(() => setLoading(false));
  }, [addToast]);

  useEffect(() => { load(); }, [load]);

  const filtered = employees.filter(e =>
    (!search || e.full_name.toLowerCase().includes(search.toLowerCase()) || e.employee_id.toLowerCase().includes(search.toLowerCase()) || e.email.toLowerCase().includes(search.toLowerCase())) &&
    (!deptFilter || e.department === deptFilter)
  );

  const validate = () => {
    const errs = {};
    if (!form.employee_id.trim()) errs.employee_id = "Required";
    if (!form.full_name.trim() || form.full_name.trim().length < 2) errs.full_name = "At least 2 characters";
    if (!form.email.trim() || !form.email.includes("@")) errs.email = "Valid email required";
    if (!form.department) errs.department = "Required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleAdd = async () => {
    if (!validate()) return;
    setAddLoading(true);
    try {
      await api.post("/employees", form);
      addToast(`Employee ${form.full_name} added successfully`);
      setShowAdd(false);
      setForm({ employee_id: "", full_name: "", email: "", department: "" });
      setErrors({});
      load();
    } catch (e) { addToast(e.message, "error"); } finally { setAddLoading(false); }
  };

  const handleDelete = async () => {
    setDelLoading(true);
    try {
      await api.del(`/employees/${delTarget.employee_id}`);
      addToast(`${delTarget.full_name} deleted`);
      setDelTarget(null);
      load();
    } catch (e) { addToast(e.message, "error"); } finally { setDelLoading(false); }
  };

  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
          <span style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "#475569" }}><Icon name="search" size={15} /></span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search employees..." style={{ width: "100%", padding: "9px 12px 9px 34px", background: "#0f172a", border: "1px solid #1e293b", borderRadius: 9, color: "#e2e8f0", fontSize: 13, outline: "none" }} />
        </div>
        <select value={deptFilter} onChange={e => setDeptFilter(e.target.value)} style={{ padding: "9px 12px", background: "#0f172a", border: "1px solid #1e293b", borderRadius: 9, color: "#e2e8f0", fontSize: 13, outline: "none", cursor: "pointer" }}>
          <option value="">All Departments</option>
          {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <button onClick={() => setShowAdd(true)} style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 18px", background: "linear-gradient(135deg, #4f80ff, #7c3aed)", border: "none", borderRadius: 9, color: "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer", flexShrink: 0 }}>
          <Icon name="plus" size={16} /> Add Employee
        </button>
      </div>
      <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 14, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 600 }}>
            <thead>
              <tr style={{ background: "#080f1c" }}>
                {["Employee ID", "Name", "Email", "Department", "Present Days", "Actions"].map(h => (
                  <th key={h} style={{ padding: "13px 18px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#475569", letterSpacing: "0.06em", textTransform: "uppercase", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} style={{ padding: 60, textAlign: "center" }}><Spinner size={24} /></td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6}><EmptyState icon="employees" title="No employees found" subtitle={search || deptFilter ? "Try changing filters" : "Add your first employee"} /></td></tr>
              ) : filtered.map(emp => (
                <tr key={emp.employee_id} className="row-hover" style={{ borderTop: "1px solid #1e293b" }}>
                  <td style={{ padding: "14px 18px", fontSize: 13, color: "#64748b", fontFamily: "'DM Mono', monospace", fontWeight: 500 }}>{emp.employee_id}</td>
                  <td style={{ padding: "14px 18px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 34, height: 34, borderRadius: 8, background: `${DEPT_COLORS[emp.department] || "#64748b"}22`, display: "flex", alignItems: "center", justifyContent: "center", color: DEPT_COLORS[emp.department] || "#94a3b8", fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
                        {emp.full_name.charAt(0).toUpperCase()}
                      </div>
                      <span style={{ fontSize: 14, fontWeight: 600, color: "#e2e8f0" }}>{emp.full_name}</span>
                    </div>
                  </td>
                  <td style={{ padding: "14px 18px", fontSize: 13, color: "#64748b" }}>{emp.email}</td>
                  <td style={{ padding: "14px 18px" }}><DeptBadge dept={emp.department} /></td>
                  <td style={{ padding: "14px 18px" }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#4ade80", fontFamily: "'DM Mono', monospace" }}>{emp.total_present ?? 0}</span>
                    <span style={{ fontSize: 11, color: "#475569", marginLeft: 4 }}>days</span>
                  </td>
                  <td style={{ padding: "14px 18px" }}>
                    <button onClick={() => setDelTarget(emp)} style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", border: "1px solid #7f1d1d", background: "#450a0a22", borderRadius: 7, color: "#f87171", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>
                      <Icon name="trash" size={13} /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length > 0 && <div style={{ padding: "12px 18px", borderTop: "1px solid #1e293b", fontSize: 12, color: "#475569" }}>
          Showing {filtered.length} of {employees.length} employees
        </div>}
      </div>
      <Modal open={showAdd} onClose={() => { setShowAdd(false); setErrors({}); setForm({ employee_id: "", full_name: "", email: "", department: "" }); }} title="Add New Employee">
        <div>
          <Input label="Employee ID" value={form.employee_id} onChange={e => setForm(f => ({ ...f, employee_id: e.target.value }))} placeholder="e.g. EMP-001" />
          {errors.employee_id && <div style={{ color: "#f87171", fontSize: 11, marginTop: -14, marginBottom: 14 }}>{errors.employee_id}</div>}
          <Input label="Full Name" value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))} placeholder="Jane Doe" />
          {errors.full_name && <div style={{ color: "#f87171", fontSize: 11, marginTop: -14, marginBottom: 14 }}>{errors.full_name}</div>}
          <Input label="Email Address" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="jane@company.com" />
          {errors.email && <div style={{ color: "#f87171", fontSize: 11, marginTop: -14, marginBottom: 14 }}>{errors.email}</div>}
          <Input label="Department" type="select" value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value }))} options={DEPARTMENTS} />
          {errors.department && <div style={{ color: "#f87171", fontSize: 11, marginTop: -14, marginBottom: 14 }}>{errors.department}</div>}
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
            <button onClick={() => { setShowAdd(false); setErrors({}); }} style={{ padding: "10px 20px", borderRadius: 9, border: "1px solid #334155", background: "transparent", color: "#94a3b8", cursor: "pointer", fontSize: 14 }}>Cancel</button>
            <button onClick={handleAdd} disabled={addLoading} style={{ display: "flex", alignItems: "center", gap: 7, padding: "10px 20px", borderRadius: 9, border: "none", background: "linear-gradient(135deg, #4f80ff, #7c3aed)", color: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 600 }}>
              {addLoading ? <Spinner size={14} /> : <Icon name="plus" size={16} />} Add Employee
            </button>
          </div>
        </div>
      </Modal>
      <ConfirmDialog
        open={!!delTarget} loading={delLoading}
        title="Delete Employee"
        message={`Are you sure you want to delete ${delTarget?.full_name}? This will also remove all their attendance records. This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDelTarget(null)}
      />
    </div>
  );
}
