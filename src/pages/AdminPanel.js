// src/pages/AdminPanel.js
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection, getDocs, doc, updateDoc, getDoc, setDoc,
  query, orderBy, where
} from "firebase/firestore";
import { db } from "../firebase/config";
import { useAuth } from "../context/AuthContext";
import { formatTime, formatDate, formatDuration, calcHours, calcInvoice } from "../utils/attendanceUtils";
import { format, startOfMonth, endOfMonth } from "date-fns";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function AdminPanel() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [records, setRecords] = useState([]);
  const [globalRate, setGlobalRate] = useState("");
  const [internRate, setInternRate] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [filterMonth, setFilterMonth] = useState(format(new Date(), "yyyy-MM"));

  // Fetch all intern users
  const fetchUsers = useCallback(async () => {
    const q = query(collection(db, "users"), where("role", "==", "intern"));
    const snap = await getDocs(q);
    const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    setUsers(list);
    if (list.length > 0 && !selectedUser) setSelectedUser(list[0]);
  }, [selectedUser]);

  // Fetch global rate
  const fetchGlobalRate = useCallback(async () => {
    const ref = doc(db, "settings", "global");
    const snap = await getDoc(ref);
    if (snap.exists()) setGlobalRate(snap.data().hourlyRate || "");
  }, []);

  // Fetch records for selected user in selected month
  const fetchRecords = useCallback(async () => {
    if (!selectedUser) return;
    setLoading(true);
    const start = format(startOfMonth(new Date(filterMonth + "-01")), "yyyy-MM-dd");
    const end = format(endOfMonth(new Date(filterMonth + "-01")), "yyyy-MM-dd");
    const q = query(
      collection(db, "attendance"),
      where("userId", "==", selectedUser.id),
      where("date", ">=", start),
      where("date", "<=", end),
      orderBy("date", "desc")
    );
    const snap = await getDocs(q);
    setRecords(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    setInternRate(selectedUser.hourlyRate || "");
    setLoading(false);
  }, [selectedUser, filterMonth]);

  useEffect(() => { fetchUsers(); fetchGlobalRate(); }, [fetchUsers, fetchGlobalRate]);
  useEffect(() => { fetchRecords(); }, [fetchRecords]);

  const effectiveRate = parseFloat(internRate || globalRate || 0);
  const { totalHours, totalAmount } = calcInvoice(records, effectiveRate);

  async function saveGlobalRate() {
    try {
      await setDoc(doc(db, "settings", "global"), { hourlyRate: parseFloat(globalRate) }, { merge: true });
      setMsg({ type: "success", text: "Global rate saved." });
    } catch { setMsg({ type: "error", text: "Failed to save rate." }); }
  }

  async function saveInternRate() {
    try {
      await updateDoc(doc(db, "users", selectedUser.id), { hourlyRate: parseFloat(internRate) || null });
      setMsg({ type: "success", text: `Rate saved for ${selectedUser.name}.` });
    } catch { setMsg({ type: "error", text: "Failed to save intern rate." }); }
  }

  function startEdit(record) {
    setEditingId(record.id);
    setEditData({
      clockIn: record.clockIn ? record.clockIn.slice(0, 16) : "",
      clockOut: record.clockOut ? record.clockOut.slice(0, 16) : "",
      locationType: record.locationType || "office",
    });
  }

  async function saveEdit(id) {
    try {
      const clockIn = editData.clockIn ? new Date(editData.clockIn).toISOString() : null;
      const clockOut = editData.clockOut ? new Date(editData.clockOut).toISOString() : null;
      const mins = clockIn && clockOut
        ? Math.round((new Date(clockOut) - new Date(clockIn)) / 60000)
        : null;
      await updateDoc(doc(db, "attendance", id), {
        clockIn, clockOut,
        totalMinutes: mins,
        locationType: editData.locationType,
      });
      setEditingId(null);
      setMsg({ type: "success", text: "Record updated." });
      fetchRecords();
    } catch { setMsg({ type: "error", text: "Failed to update." }); }
  }

  function exportCSV() {
    const rows = [["Date", "Clock In", "Clock Out", "Duration (hrs)", "Location"]];
    records.forEach(r => {
      rows.push([
        r.date,
        r.clockIn ? formatTime(r.clockIn) : "",
        r.clockOut ? formatTime(r.clockOut) : "",
        r.totalMinutes ? (r.totalMinutes / 60).toFixed(2) : "",
        r.locationType || "",
      ]);
    });
    rows.push(["", "", "TOTAL", totalHours, ""]);
    rows.push(["", "", `AMOUNT (@ $${effectiveRate}/hr)`, `$${totalAmount}`, ""]);

    const csv = rows.map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `invoice-${selectedUser?.name}-${filterMonth}.csv`;
    a.click();
  }

  function exportPDF() {
    const pdf = new jsPDF();
    pdf.setFontSize(18);
    pdf.text("Attendance Invoice", 14, 20);
    pdf.setFontSize(11);
    pdf.text(`Intern: ${selectedUser?.name}`, 14, 30);
    pdf.text(`Email: ${selectedUser?.email}`, 14, 37);
    pdf.text(`Period: ${filterMonth}`, 14, 44);
    pdf.text(`Hourly Rate: $${effectiveRate}`, 14, 51);

    autoTable(pdf, {
      startY: 60,
      head: [["Date", "Clock In", "Clock Out", "Hours", "Location"]],
      body: records.map(r => [
        r.date,
        r.clockIn ? formatTime(r.clockIn) : "—",
        r.clockOut ? formatTime(r.clockOut) : "—",
        r.totalMinutes ? (r.totalMinutes / 60).toFixed(2) : "—",
        r.locationType === "wfh" ? "WFH" : "Office",
      ]),
      foot: [
        ["", "", "Total Hours", totalHours, ""],
        ["", "", `Total Amount`, `$${totalAmount}`, ""],
      ],
      styles: { fontSize: 9 },
      headStyles: { fillColor: [110, 231, 183], textColor: 0 },
      footStyles: { fillColor: [30, 30, 50], textColor: [110, 231, 183] },
    });

    pdf.save(`invoice-${selectedUser?.name}-${filterMonth}.pdf`);
  }

  async function handleLogout() { await logout(); navigate("/login"); }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <nav className="nav">
        <span className="nav-logo">Attend<span className="accent">.</span> <span style={{ fontSize: "0.7rem", color: "var(--accent2)", fontWeight: 600, letterSpacing: "0.1em" }}>ADMIN</span></span>
        <div className="flex items-center gap-2">
          <span className="muted" style={{ fontSize: "0.85rem" }}>{currentUser?.email}</span>
          <button className="btn btn-secondary" style={{ padding: "0.4rem 1rem", fontSize: "0.8rem" }} onClick={handleLogout}>Sign Out</button>
        </div>
      </nav>

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "2rem 1rem" }}>
        <div className="flex justify-between items-center mb-3">
          <h2>Admin Panel</h2>
          <a href="https://interfacelab-pro.github.io/attendance/#/qr" target="_blank" className="btn btn-secondary" style={{ fontSize: "0.85rem" }}>📱 QR Code</a>
        </div>

        {msg && <div className={`msg ${msg.type === "error" ? "msg-error" : "msg-success"} fade-in`}>{msg.text}</div>}

        {/* Rate Settings */}
        <div className="card mb-3 fade-in">
          <h3 className="mb-2">💰 Rate Settings</h3>
          <div className="flex gap-2" style={{ flexWrap: "wrap" }}>
            <div className="flex-col" style={{ flex: 1, minWidth: 200 }}>
              <div className="field">
                <label>Global Hourly Rate (USD)</label>
                <input type="number" value={globalRate} onChange={e => setGlobalRate(e.target.value)} placeholder="e.g. 15.00" />
              </div>
              <button className="btn btn-secondary" onClick={saveGlobalRate}>Save Global Rate</button>
            </div>
            {selectedUser && (
              <div className="flex-col" style={{ flex: 1, minWidth: 200 }}>
                <div className="field">
                  <label>Override Rate for {selectedUser.name}</label>
                  <input type="number" value={internRate} onChange={e => setInternRate(e.target.value)} placeholder={`Default: $${globalRate || "0"}`} />
                </div>
                <button className="btn btn-secondary" onClick={saveInternRate}>Save Intern Rate</button>
              </div>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="card mb-3 fade-in">
          <div className="flex gap-2" style={{ flexWrap: "wrap", alignItems: "flex-end" }}>
            {users.length > 1 && (
              <div className="field" style={{ flex: 1, minWidth: 180, marginBottom: 0 }}>
                <label>Intern</label>
                <select value={selectedUser?.id || ""} onChange={e => setSelectedUser(users.find(u => u.id === e.target.value))}>
                  {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                </select>
              </div>
            )}
            <div className="field" style={{ flex: 1, minWidth: 160, marginBottom: 0 }}>
              <label>Month</label>
              <input type="month" value={filterMonth} onChange={e => setFilterMonth(e.target.value)} />
            </div>
          </div>
        </div>

        {/* Invoice Summary */}
        <div className="stat-grid mb-3">
          <div className="stat-card fade-in">
            <div className="stat-value accent">{totalHours}h</div>
            <div className="stat-label">Total Hours</div>
          </div>
          <div className="stat-card fade-in">
            <div className="stat-value accent2">${effectiveRate}</div>
            <div className="stat-label">Hourly Rate</div>
          </div>
          <div className="stat-card fade-in">
            <div className="stat-value" style={{ color: "#facc15" }}>${totalAmount}</div>
            <div className="stat-label">Total Amount</div>
          </div>
          <div className="stat-card fade-in">
            <div className="stat-value">{records.length}</div>
            <div className="stat-label">Days Recorded</div>
          </div>
        </div>

        {/* Export buttons */}
        <div className="flex gap-2 mb-3">
          <button className="btn btn-secondary" onClick={exportCSV}>⬇ Export CSV</button>
          <button className="btn btn-secondary" onClick={exportPDF}>📄 Export PDF</button>
        </div>

        {/* Records Table */}
        <div className="card fade-in">
          <h3 className="mb-2">Attendance Records — {filterMonth}</h3>
          {loading ? <p className="muted">Loading…</p> : records.length === 0 ? (
            <p className="muted">No records for this period.</p>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Clock In</th>
                    <th>Clock Out</th>
                    <th>Duration</th>
                    <th>Location</th>
                    <th>Edit</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map(r => (
                    <tr key={r.id}>
                      {editingId === r.id ? (
                        <>
                          <td>{r.date}</td>
                          <td><input type="datetime-local" value={editData.clockIn} onChange={e => setEditData(d => ({ ...d, clockIn: e.target.value }))} style={{ padding: "4px 8px", fontSize: "0.8rem" }} /></td>
                          <td><input type="datetime-local" value={editData.clockOut} onChange={e => setEditData(d => ({ ...d, clockOut: e.target.value }))} style={{ padding: "4px 8px", fontSize: "0.8rem" }} /></td>
                          <td>—</td>
                          <td>
                            <select value={editData.locationType} onChange={e => setEditData(d => ({ ...d, locationType: e.target.value }))} style={{ padding: "4px 8px", fontSize: "0.8rem" }}>
                              <option value="office">Office</option>
                              <option value="wfh">WFH</option>
                            </select>
                          </td>
                          <td>
                            <div className="flex gap-1">
                              <button className="btn btn-primary" style={{ padding: "4px 10px", fontSize: "0.75rem" }} onClick={() => saveEdit(r.id)}>Save</button>
                              <button className="btn btn-secondary" style={{ padding: "4px 10px", fontSize: "0.75rem" }} onClick={() => setEditingId(null)}>✕</button>
                            </div>
                          </td>
                        </>
                      ) : (
                        <>
                          <td>{r.date}</td>
                          <td className="accent">{formatTime(r.clockIn)}</td>
                          <td className="accent2">{r.clockOut ? formatTime(r.clockOut) : <span className="warn">Active</span>}</td>
                          <td>{r.totalMinutes ? formatDuration(r.totalMinutes) : "—"}</td>
                          <td><span className={`badge ${r.locationType === "wfh" ? "badge-wfh" : "badge-office"}`}>{r.locationType === "wfh" ? "🏠 WFH" : "🏢 Office"}</span></td>
                          <td><button className="btn btn-secondary" style={{ padding: "4px 10px", fontSize: "0.75rem" }} onClick={() => startEdit(r)}>Edit</button></td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
