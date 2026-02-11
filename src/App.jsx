import { useState, useCallback } from "react";
import Layout from "./components/Layout";
import DashboardPage from "./components/DashboardPage";
import EmployeesPage from "./components/EmployeesPage";
import AttendancePage from "./components/AttendancePage";
import { Toast } from "./components/Shared";

export default function App() {
  const [activePage, setActivePage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [toasts, setToasts] = useState([]);
  const addToast = useCallback((message, type = "success") => {
    const id = Date.now();
    setToasts(t => [...t, { id, message, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 4000);
  }, []);
  const removeToast = useCallback(id => setToasts(t => t.filter(x => x.id !== id)), []);

  const pageContent = activePage === "dashboard" && <DashboardPage addToast={addToast} goTo={setActivePage} />
    || activePage === "employees" && <EmployeesPage addToast={addToast} />
    || activePage === "attendance" && <AttendancePage addToast={addToast} />;

  return (
    <div style={{ display: "flex", height: "100vh", background: "#020617", color: "#e2e8f0", fontFamily: "'Sora', 'DM Sans', system-ui, sans-serif", overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #334155; border-radius: 3px; }
        input, select, button { font-family: inherit; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes slideIn { from { transform: translateX(20px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes modalIn { from { transform: scale(0.95) translateY(-10px); opacity: 0; } to { transform: scale(1) translateY(0); opacity: 1; } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        input:focus, select:focus { border-color: #4f80ff !important; box-shadow: 0 0 0 3px #4f80ff22; }
        button:hover:not(:disabled) { opacity: 0.88; }
        button:disabled { opacity: 0.5; cursor: not-allowed; }
        .row-hover:hover { background: #0f172a !important; }
        .nav-item:hover { background: #1e293b !important; }
      `}</style>
      <Layout activePage={activePage} setActivePage={setActivePage} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
        {pageContent}
      </Layout>
      <Toast toasts={toasts} remove={removeToast} />
    </div>
  );
}
