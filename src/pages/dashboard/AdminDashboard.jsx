import { useMemo } from "react";
import { SummaryCard } from "../../components/ui/SummaryCard.jsx";
import { StatusBadge } from "../../components/ui/StatusBadge.jsx";
import { dummyDoctors } from "../../data/doctors.js";
import { dummyUsers } from "../../data/users.js";
import { getAppointments } from "../../data/store.js";

export function AdminDashboardPage() {
  const appointments = useMemo(() => getAppointments(), []);
  const totalDoctors = dummyDoctors.length;
  const totalPatients = dummyUsers.filter((u) => u.role === "patient").length;
  const totalAppointments = appointments.length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-slate-600">
          Overview of doctors, patients, and appointments.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <SummaryCard title="Total Doctors" value={totalDoctors} />
        <SummaryCard title="Total Patients" value={totalPatients} />
        <SummaryCard title="Total Appointments" value={totalAppointments} />
      </div>

      <div className="card">
        <div className="flex items-center justify-between border-b border-slate-200 p-6">
          <div>
            <div className="text-lg font-semibold text-slate-900">
              Appointment Table
            </div>
            <div className="text-sm text-slate-600">Recent appointments</div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th className="th">Patient Name</th>
                <th className="th">Doctor Name</th>
                <th className="th">Date</th>
                <th className="th">Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((ap) => (
                <tr key={ap.id}>
                  <td className="td">{ap.patientName}</td>
                  <td className="td">{ap.doctorName}</td>
                  <td className="td">{ap.date}</td>
                  <td className="td">
                    <StatusBadge status={ap.status} />
                  </td>
                </tr>
              ))}
              {appointments.length === 0 ? (
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

