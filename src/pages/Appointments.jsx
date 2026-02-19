import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../components/auth/AuthContext.jsx";
import { StatusBadge } from "../components/ui/StatusBadge.jsx";
import { getAppointments } from "../data/store.js";

export function AppointmentsPage() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    setAppointments(getAppointments());
  }, []);

  const visibleAppointments = useMemo(() => {
    if (user?.role === "admin") return appointments;
    if (user?.role === "doctor")
      return appointments.filter((a) => a.doctorName === user?.name);
    return appointments.filter((a) => a.patientEmail === user?.email);
  }, [appointments, user?.role, user?.name, user?.email]);

  const title =
    user?.role === "admin"
      ? "All Appointments"
      : user?.role === "doctor"
        ? "My Appointments"
        : "My Appointments";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
        <p className="mt-1 text-sm text-slate-600">
          Appointment list based on your role.
        </p>
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th className="th">Patient</th>
                <th className="th">Doctor</th>
                <th className="th">Date</th>
                <th className="th">Status</th>
              </tr>
            </thead>
            <tbody>
              {visibleAppointments.map((ap) => (
                <tr key={ap.id}>
                  <td className="td">{ap.patientName}</td>
                  <td className="td">{ap.doctorName}</td>
                  <td className="td">{ap.date}</td>
                  <td className="td">
                    <StatusBadge status={ap.status} />
                  </td>
                </tr>
              ))}
              {visibleAppointments.length === 0 ? (
                <tr>
                  <td className="td" colSpan={4}>
                    No appointments found.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

