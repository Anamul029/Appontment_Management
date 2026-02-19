import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/auth/AuthContext.jsx";
import { dummyDoctors } from "../data/doctors.js";
import { addAppointment } from "../data/store.js";

export function BookAppointmentPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const doctorOptions = useMemo(() => dummyDoctors, []);
  const [doctorId, setDoctorId] = useState(doctorOptions[0]?.id ?? "");
  const [date, setDate] = useState("");
  const [message, setMessage] = useState("");

  function onSubmit(e) {
    e.preventDefault();
    setMessage("");

    const doctor = doctorOptions.find((d) => d.id === doctorId);
    if (!doctor) {
      setMessage("Please select a doctor.");
      return;
    }
    if (!date) {
      setMessage("Please select a date.");
      return;
    }

    addAppointment({
      patientName: user?.name,
      patientEmail: user?.email,
      doctorId: doctor.id,
      doctorName: doctor.name,
      date
    });

    navigate("/appointments", { replace: true });
  }

  return (
    <div className="container-app py-8">
      <div className="mx-auto max-w-lg">
        <div className="card card-pad">
          <h1 className="text-xl font-semibold text-slate-900">
            Book Appointment
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Select a doctor and choose a date.
          </p>

          {message ? (
            <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
              {message}
            </div>
          ) : null}

          <form className="mt-6 space-y-4" onSubmit={onSubmit}>
            <div>
              <label className="label">Select Doctor</label>
              <select
                className="input"
                value={doctorId}
                onChange={(e) => setDoctorId(e.target.value)}
              >
                {doctorOptions.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} — {d.specialization}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Select Date</label>
              <input
                className="input"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                type="date"
                required
              />
            </div>

            <button type="submit" className="btn-primary w-full">
              Submit
            </button>
          </form>

          <div className="mt-6 rounded-lg bg-slate-50 p-4 text-sm text-slate-700">
            <div className="font-semibold">Note</div>
            <div className="mt-1 text-slate-600">
              This is a frontend-only project. Booking will be stored in your
              browser (localStorage).
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

