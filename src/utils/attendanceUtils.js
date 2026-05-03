// src/utils/attendanceUtils.js
import { format, differenceInMinutes, parseISO } from "date-fns";

export function formatDuration(minutes) {
  if (!minutes || minutes <= 0) return "0h 0m";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m}m`;
}

export function calcHours(clockIn, clockOut) {
  if (!clockIn || !clockOut) return 0;
  const mins = differenceInMinutes(
    typeof clockOut === "string" ? parseISO(clockOut) : clockOut,
    typeof clockIn === "string" ? parseISO(clockIn) : clockIn
  );
  return Math.max(0, mins / 60);
}

export function formatTime(isoString) {
  if (!isoString) return "--:--";
  return format(
    typeof isoString === "string" ? parseISO(isoString) : isoString,
    "hh:mm a"
  );
}

export function formatDate(isoString) {
  if (!isoString) return "";
  return format(
    typeof isoString === "string" ? parseISO(isoString) : isoString,
    "EEE, MMM d yyyy"
  );
}

export function calcInvoice(records, hourlyRate) {
  const totalHours = records.reduce((sum, r) => {
    return sum + calcHours(r.clockIn, r.clockOut);
  }, 0);
  return {
    totalHours: Math.round(totalHours * 100) / 100,
    totalAmount: Math.round(totalHours * hourlyRate * 100) / 100,
  };
}

export function isWorkingDay(date) {
  const day = date.getDay(); // 0=Sun, 6=Sat
  return day !== 0; // Mon–Sat are working days
}
