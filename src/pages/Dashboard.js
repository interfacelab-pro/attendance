// src/pages/Dashboard.js
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection, addDoc, query, where, getDocs,
  doc, updateDoc, orderBy, limit, getDoc
} from "firebase/firestore";
import { db } from "../firebase/config";
import { useAuth } from "../context/AuthContext";
import { formatTime, formatDate, formatDuration, calcHours } from "../utils/attendanceUtils";
import { format, differenceInMinutes, parseISO } from "date-fns";

export default function Dashboard() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const [todayRecord, setTodayRecord] = useState(null);
  const [recentRecords, setRecentRecords] = useState([]);
  const [locationType, setLocationType] = useState("office");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const [liveTime, setLiveTime] = useState(new Date());
  const [totalThisWeek, setTotalThisWeek] = useState(0);

  const todayStr = format(new Date(), "yyyy-MM-dd");

  const fetchData = useCallback(async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      // Today's record
      const todayQ = query(
        collection(db, "attendance"),
        where("userId", "==", currentUser.uid),
        where("date", "==", todayStr)
      );
      const todaySnap = await getDocs(todayQ);
      if (!todaySnap.empty) {
        const d = todaySnap.docs[0];
        setTodayRecord({ id: d.id, ...d.data() });
      } else {
        setTodayRecord(null);
      }

      // Recent 7 records
      const recentQ = query(
        collection(db, "attendance"),
        where("userId", "==", currentUser.uid),
        orderBy("date", "desc"),
        limit(7)
      );
      const recentSnap = await getDocs(recentQ);
      const records = recentSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      setRecentRecords(records);

      // This week total
      const weekTotal = records
        .filter(r => r.clockOut)
        .reduce((sum, r) => sum + calcHours(r.clockIn, r.clockOut), 0);
      setTotalThisWeek(Math.round(weekTotal * 100) / 100);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }, [currentUser, todayStr]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Live clock
  useEffect(() => {
    const t = setInterval(() => setLiveTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Live elapsed time while clocked in
  const elapsed = todayRecord?.clockIn && !todayRecord?.clockOut
    ? differenceInMinutes(new Date(), parseISO(todayRecord.clockIn))
    : null;

  async function handleClockIn() {
    setActionLoading(true);
    setMsg(null);
    try {
      const ref = await addDoc(collection(db, "attendance"), {
        userId: currentUser.uid,
        userName: currentUser.displayName,
        userEmail: currentUser.email,
        date: todayStr,
        clockIn: new Date().toISOString(),
        clockOut: null,
        locationType,
        totalMinutes: null,
        createdAt: new Date().toISOString(),
      });
      setTodayRecord({ id: ref.id, clockIn: new Date().toISOString(), clockOut: null, locationType });
      setMsg({ type: "success", text: "Clocked in successfully!" });
    } catch (err) {
      setMsg({ type: "error", text: "Failed to clock in. Try again." });
    }
    setActionLoading(false);
    fetchData();
  }

  async function handleClockOut() {
    if (!todayRecord) return;
    setActionLoading(true);
    setMsg(null);
    try {
      const now = new Date().toISOString();
      const mins = differenceInMinutes(new Date(), parseISO(todayRecord.clockIn));
      await updateDoc(doc(db, "attendance", todayRecord.id), {
        clockOut: now,
        totalMinutes: mins,
      });
      setMsg({ type: "success", text: `Clocked out. You worked ${formatDuration(mins)} today.` });
    } catch (err) {
      setMsg({ type: "error", text: "Failed to clock out. Try again." });
    }
    setActionLoading(false);
    fetchData();
  }

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  const isClockedIn = todayRecord?.clockIn && !todayRecord?.clockOut;
  const isClockedOut = todayRecord?.clockIn && todayRecord?.clockOut;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      {/* Nav */}
      <nav className="nav">
        <span className="nav-logo">Attend<span>.</span></span>
        <div className="flex items-center gap-2">
          <span className="muted" style={{ fontSize: "0.85rem" }}>
            {currentUser?.displayName}
          </span>
          <button className="btn btn-secondary" style={{ padding: "0.4rem 1rem", fontSize: "0.8rem" }} onClick={handleLogout}>
            Sign Out
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: 700, margin: "0 auto", padding: "2rem 1rem" }}>
        {/* Header */}
        <div className="flex justify-between items-center mb-3">
          <div>
            <h2>Good {getGreeting()}, {currentUser?.displayName?.split(" ")[0]} 👋</h2>
            <p className="muted mono mt-1">{formatDate(new Date().toISOString())}</p>
          </div>
          <div className="mono" style={{ fontSize: "0.85rem", color: "var(--text-muted)", textAlign: "right" }}>
            <div style={{ fontSize: "1.2rem", color: "var(--text)" }}>{format(liveTime, "hh:mm")}<span className="accent">{format(liveTime, " a")}</span></div>
            <div>{format(liveTime, "ss")}s</div>
          </div>
        </div>

        {/* Message */}
        {msg && (
          <div className={`msg ${msg.type === "error" ? "msg-error" : "msg-success"} fade-in`}>
            {msg.text}
          </div>
        )}

        {/* Clock Card */}
        <div className="card mb-3 fade-in">
          <div className="text-center mb-3">
            <div className={`clock-ring ${isClockedIn ? "active" : ""}`}>
              <div className="time-big">
                {isClockedIn ? formatDuration(elapsed) : isClockedOut ? formatDuration(todayRecord.totalMinutes) : "00h 00m"}
              </div>
              <div className="time-label">
                {isClockedIn ? "ELAPSED" : isClockedOut ? "TODAY" : "NOT STARTED"}
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="text-center mb-3">
            {isClockedIn && (
              <div className="flex justify-center gap-2">
                <span className="badge badge-active pulse">● CLOCKED IN</span>
                <span className={`badge ${locationType === "wfh" ? "badge-wfh" : "badge-office"}`}>
                  {locationType === "wfh" ? "🏠 WFH" : "🏢 Office"}
                </span>
              </div>
            )}
            {isClockedOut && (
              <div className="flex justify-center gap-2">
                <span className="badge badge-complete">✓ COMPLETE</span>
                <span className={`badge ${todayRecord.locationType === "wfh" ? "badge-wfh" : "badge-office"}`}>
                  {todayRecord.locationType === "wfh" ? "🏠 WFH" : "🏢 Office"}
                </span>
              </div>
            )}
            {!todayRecord && <span className="badge badge-missing">— Not marked yet</span>}
          </div>

          {/* Time info */}
          {todayRecord && (
            <div className="flex justify-center gap-3 mb-3" style={{ fontSize: "0.85rem" }}>
              <div className="text-center">
                <div className="muted" style={{ fontSize: "0.7rem", letterSpacing: "0.08em" }}>IN</div>
                <div className="mono accent">{formatTime(todayRecord.clockIn)}</div>
              </div>
              {todayRecord.clockOut && (
                <div className="text-center">
                  <div className="muted" style={{ fontSize: "0.7rem", letterSpacing: "0.08em" }}>OUT</div>
                  <div className="mono accent2">{formatTime(todayRecord.clockOut)}</div>
                </div>
              )}
            </div>
          )}

          {/* Location type select */}
          {!isClockedIn && !isClockedOut && (
            <div className="field mb-3">
              <label>Work Location</label>
              <select value={locationType} onChange={e => setLocationType(e.target.value)}>
                <option value="office">🏢 In Office</option>
                <option value="wfh">🏠 Work from Home</option>
              </select>
            </div>
          )}

          {/* Action button */}
          {!isClockedIn && !isClockedOut && (
            <button className="btn btn-primary btn-full" onClick={handleClockIn} disabled={actionLoading}>
              {actionLoading ? "…" : "⏱ Clock In"}
            </button>
          )}
          {isClockedIn && (
            <button className="btn btn-danger btn-full" onClick={handleClockOut} disabled={actionLoading}>
              {actionLoading ? "…" : "⏹ Clock Out"}
            </button>
          )}
          {isClockedOut && (
            <p className="text-center muted" style={{ fontSize: "0.85rem" }}>Attendance marked for today ✓</p>
          )}
        </div>

        {/* Stats */}
        <div className="stat-grid mb-3">
          <div className="stat-card fade-in">
            <div className="stat-value accent">{totalThisWeek}h</div>
            <div className="stat-label">Recent (last 7 days)</div>
          </div>
          <div className="stat-card fade-in">
            <div className="stat-value accent2">{recentRecords.filter(r => r.clockOut).length}</div>
            <div className="stat-label">Days completed</div>
          </div>
          <div className="stat-card fade-in">
            <div className="stat-value">{recentRecords.filter(r => r.locationType === "wfh").length}</div>
            <div className="stat-label">WFH days</div>
          </div>
        </div>

        {/* Recent records */}
        <div className="card fade-in">
          <h3 className="mb-2">Recent Attendance</h3>
          {loading ? (
            <p className="muted">Loading…</p>
          ) : recentRecords.length === 0 ? (
            <p className="muted">No records yet. Clock in to get started.</p>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>In</th>
                    <th>Out</th>
                    <th>Duration</th>
                    <th>Location</th>
                  </tr>
                </thead>
                <tbody>
                  {recentRecords.map(r => (
                    <tr key={r.id}>
                      <td>{r.date}</td>
                      <td className="accent">{formatTime(r.clockIn)}</td>
                      <td className="accent2">{r.clockOut ? formatTime(r.clockOut) : <span className="warn pulse">Active</span>}</td>
                      <td>{r.totalMinutes ? formatDuration(r.totalMinutes) : "—"}</td>
                      <td>
                        <span className={`badge ${r.locationType === "wfh" ? "badge-wfh" : "badge-office"}`}>
                          {r.locationType === "wfh" ? "🏠 WFH" : "🏢 Office"}
                        </span>
                      </td>
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

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  return "evening";
}
