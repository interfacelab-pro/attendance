// src/pages/QRPage.js
import React, { useRef } from "react";
import { QRCodeSVG } from "qrcode.react";

export default function QRPage() {
  const printRef = useRef();
  const appUrl = "https://interfacelab-pro.github.io/attendance/#/dashboard";

  // Ensure QR code value is clean
  const qrValue = appUrl;

  function handlePrint() {
    window.print();
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
      <style>{`
        @media print {
          body { background: white !important; }
          .no-print { display: none !important; }
          .print-card {
            background: white !important;
            color: black !important;
            border: 2px solid #000 !important;
            box-shadow: none !important;
          }
          .print-card h1, .print-card p { color: black !important; }
        }
      `}</style>

      <div
        ref={printRef}
        className="print-card"
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 16,
          padding: "2.5rem",
          maxWidth: 400,
          width: "100%",
          textAlign: "center",
        }}
      >
        {/* Logo */}
        <div style={{ marginBottom: "1rem" }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 800 }}>
            Attend<span style={{ color: "var(--accent)" }}>.</span>
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: 4, letterSpacing: "0.06em" }}>
            ATTENDANCE SYSTEM
          </p>
        </div>

        {/* QR Code */}
        <div style={{
          background: "white",
          borderRadius: 12,
          padding: "1.5rem",
          display: "inline-block",
          margin: "1rem 0",
        }}>
          <QRCodeSVG
            value={qrValue}
            size={200}
            bgColor="#ffffff"
            fgColor="#0a0a0f"
            level="H"
            includeMargin={false}
          />
        </div>

        {/* Instructions */}
        <div style={{ marginTop: "1rem" }}>
          <p style={{ fontWeight: 700, fontSize: "1rem", marginBottom: "0.5rem" }}>
            Scan to Mark Attendance
          </p>
          <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", lineHeight: 1.6 }}>
            Scan this QR code with your phone to<br />
            clock in or clock out for the day.
          </p>
        </div>

        {/* URL */}
        <div style={{
          marginTop: "1.5rem",
          background: "var(--surface2)",
          borderRadius: 8,
          padding: "0.6rem 1rem",
          fontFamily: "var(--font-mono)",
          fontSize: "0.7rem",
          color: "var(--accent2)",
          wordBreak: "break-all",
        }}>
          {appUrl}
        </div>

        {/* Footer note */}
        <p style={{ color: "var(--text-muted)", fontSize: "0.72rem", marginTop: "1rem" }}>
          ⚠ Please mark attendance every working day (Mon–Sat)
        </p>
      </div>

      {/* Print button */}
      <div className="no-print flex gap-2 mt-3">
        <button className="btn btn-primary" onClick={handlePrint}>🖨 Print QR Code</button>
        <a href="https://interfacelab-pro.github.io/attendance/#/dashboard" className="btn btn-secondary">← Back to Dashboard</a>
      </div>

      <p className="no-print muted text-center mt-2" style={{ fontSize: "0.8rem", maxWidth: 340 }}>
        Print this page and place it at the office entrance as a daily reminder.
      </p>
    </div>
  );
}
