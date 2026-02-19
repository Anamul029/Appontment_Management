import { dummyAppointments } from "./appointments.js";

const STORAGE_KEY = "das_appointments_v1";

function safeParse(json) {
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function getAppointments() {
  const saved = safeParse(localStorage.getItem(STORAGE_KEY));
  if (Array.isArray(saved)) return saved;
  return dummyAppointments;
}

export function saveAppointments(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function addAppointment({ patientName, patientEmail, doctorId, doctorName, date }) {
  const items = getAppointments();
  const next = [
    {
      id: `ap_${Date.now()}`,
      patientName,
      patientEmail,
      doctorId,
      doctorName,
      date,
      status: "Pending"
    },
    ...items
  ];
  saveAppointments(next);
  return next;
}

export function updateAppointmentStatus(appointmentId, status) {
  const items = getAppointments();
  const next = items.map((ap) => (ap.id === appointmentId ? { ...ap, status } : ap));
  saveAppointments(next);
  return next;
}

