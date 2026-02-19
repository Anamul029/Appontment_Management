import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../components/auth/AuthContext.jsx";
import { StatusBadge } from "../../components/ui/StatusBadge.jsx";
import { getAppointments, updateAppointmentStatus } from "../../data/store.js";

const statusFlow = ["Pending", "Approved", "Completed"];

function nextStatus(current) {
  const idx = statusFlow.indexOf(current);
  if (idx === -1) return "Pending";
  return statusFlow[Math.min(idx + 1, statusFlow.length - 1)];
}

export function DoctorDashboardPage() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    setAppointments(getAppointments());
  }, []);

  const myAppointments = useMemo(
    () => appointments.filter((a) => a.doctorName === user?.name),
    [appointments, user?.name],
  );

  function advance(ap) {
    const updated = updateAppointmentStatus(ap.id, nextStatus(ap.status));
    setAppointments(updated);
  }

  return (
    <div className="space-y-6">
      <div className="card card-pad">
        <h1 className="text-2xl font-semibold text-slate-900">
          Welcome, {user?.name}
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Manage your appointments and update statuses.
        </p>
      </div>

      <div className="card">
        <div className="flex items-center justify-between border-b border-slate-200 p-6">
          <div>
            <div className="text-lg font-semibold text-slate-900">
              Appointment List
            </div>
            <div className="text-sm text-slate-600">
              Your assigned appointments
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th className="th">Patient Name</th>
                <th className="th">Date</th>
                <th className="th">Status</th>
                <th className="th">Action</th>
              </tr>
            </thead>
            <tbody>
              {myAppointments.map((ap) => (
                <tr key={ap.id}>
                  <td className="td">{ap.patientName}</td>
                  <td className="td">{ap.date}</td>
                  <td className="td">
                    <StatusBadge status={ap.status} />
                  </td>
                  <td className="td">
                    <button
                      type="button"
                      className="btn-outline"
                      onClick={() => advance(ap)}
                      disabled={ap.status === "Completed"}
                    >
                      {ap.status === "Completed"
                        ? "Completed"
                        : `Mark ${nextStatus(ap.status)}`}
                    </button>
                  </td>
                </tr>
              ))}
              {myAppointments.length === 0 ? (
                <tr>
                  <td className="td" colSpan={4}>
                    No appointments for you yet.
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

