import { format } from "date-fns";
import { useState } from "react";
import { useClinic } from "../context/ClinicContext";
import { formatCurrency } from "../types";
import {
  formatTime12h,
  getAvailableSlots,
  isPastSlot,
} from "../utils/availability";

export function AppointmentsPage() {
  const {
    doctors,
    services,
    appointments,
    addAppointment,
    cancelAppointment,
    updateAppointment,
  } = useClinic();

  const [patientName, setPatientName] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [patientEmail, setPatientEmail] = useState("");
  const [doctorId, setDoctorId] = useState(doctors[0]?.id ?? "");
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [time, setTime] = useState("");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState("");

  const doctor = doctors.find((d) => d.id === doctorId);
  const slots = doctor
    ? getAvailableSlots(
        doctor,
        date,
        appointments,
        services,
        selectedServices
      )
    : [];

  const toggleService = (id: string) => {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
    setTime("");
  };

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName || !patientPhone || !doctorId || !time || selectedServices.length === 0) {
      setMessage("Please fill all required fields and select at least one service.");
      return;
    }
    if (isPastSlot(date, time)) {
      setMessage("Cannot book a past time slot.");
      return;
    }
    addAppointment({
      patientName,
      patientPhone,
      patientEmail,
      doctorId,
      serviceIds: selectedServices,
      date,
      time,
      notes,
    });
    setPatientName("");
    setPatientPhone("");
    setPatientEmail("");
    setTime("");
    setSelectedServices([]);
    setNotes("");
    setMessage("Appointment booked successfully!");
    setTimeout(() => setMessage(""), 3000);
  };

  const upcoming = [...appointments]
    .filter((a) => a.status !== "cancelled")
    .sort((a, b) => `${b.date}${b.time}`.localeCompare(`${a.date}${a.time}`));

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900">Appointments</h2>
      <p className="mt-1 text-slate-600">Book and manage patient appointments.</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <form
          onSubmit={handleBook}
          className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <h3 className="font-semibold text-slate-900">Book New Appointment</h3>

          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Patient Name *
              </label>
              <input
                type="text"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Phone *
                </label>
                <input
                  type="tel"
                  value={patientPhone}
                  onChange={(e) => setPatientPhone(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Email
                </label>
                <input
                  type="email"
                  value={patientEmail}
                  onChange={(e) => setPatientEmail(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Doctor *
                </label>
                <select
                  value={doctorId}
                  onChange={(e) => {
                    setDoctorId(e.target.value);
                    setTime("");
                  }}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
                >
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} — {d.specialty}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Date *
                </label>
                <input
                  type="date"
                  value={date}
                  min={format(new Date(), "yyyy-MM-dd")}
                  onChange={(e) => {
                    setDate(e.target.value);
                    setTime("");
                  }}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">
                Services *
              </label>
              <div className="mt-2 max-h-40 space-y-1 overflow-y-auto rounded-lg border border-slate-200 p-2">
                {services.map((s) => (
                  <label
                    key={s.id}
                    className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-slate-50"
                  >
                    <input
                      type="checkbox"
                      checked={selectedServices.includes(s.id)}
                      onChange={() => toggleService(s.id)}
                    />
                    <span className="flex-1">{s.name}</span>
                    <span className="text-slate-500">{formatCurrency(s.rate)}</span>
                  </label>
                ))}
              </div>
            </div>

            {selectedServices.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Available Time Slots *
                </label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {slots.map(({ slot, available, reason }) => (
                    <button
                      key={slot}
                      type="button"
                      disabled={!available}
                      title={reason}
                      onClick={() => setTime(slot)}
                      className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                        time === slot
                          ? "bg-brand-600 text-white"
                          : available
                            ? "border border-slate-200 bg-white text-slate-700 hover:border-brand-400"
                            : "cursor-not-allowed border border-slate-100 bg-slate-50 text-slate-300"
                      }`}
                    >
                      {formatTime12h(slot)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700">
                Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
              />
            </div>
          </div>

          {message && (
            <p
              className={`mt-4 text-sm ${message.includes("success") ? "text-green-600" : "text-red-600"}`}
            >
              {message}
            </p>
          )}

          <button
            type="submit"
            className="mt-4 w-full rounded-lg bg-brand-600 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
          >
            Book Appointment
          </button>
        </form>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="font-semibold text-slate-900">All Appointments</h3>
          <div className="mt-4 max-h-[600px] space-y-3 overflow-y-auto">
            {upcoming.length === 0 ? (
              <p className="text-sm text-slate-500">No appointments yet.</p>
            ) : (
              upcoming.map((a) => {
                const doc = doctors.find((d) => d.id === a.doctorId);
                const svcNames = a.serviceIds
                  .map((id) => services.find((s) => s.id === id)?.name)
                  .filter(Boolean)
                  .join(", ");
                return (
                  <div
                    key={a.id}
                    className="rounded-lg border border-slate-100 bg-slate-50 p-4 text-sm"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-slate-900">
                          {a.patientName}
                        </p>
                        <p className="text-slate-500">{a.patientPhone}</p>
                        <p className="mt-1 text-slate-600">{doc?.name}</p>
                        <p className="text-slate-500">{svcNames}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{a.date}</p>
                        <p className="text-brand-600">
                          {formatTime12h(a.time)}
                        </p>
                        <span
                          className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs capitalize ${
                            a.status === "scheduled"
                              ? "bg-blue-100 text-blue-700"
                              : a.status === "completed"
                                ? "bg-green-100 text-green-700"
                                : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {a.status}
                        </span>
                      </div>
                    </div>
                    <div className="mt-3 flex gap-2">
                      {a.status === "scheduled" && (
                        <>
                          <button
                            type="button"
                            onClick={() =>
                              updateAppointment(a.id, { status: "checked-in" })
                            }
                            className="rounded bg-brand-100 px-2 py-1 text-xs font-medium text-brand-700 hover:bg-brand-200"
                          >
                            Check In
                          </button>
                          <button
                            type="button"
                            onClick={() => cancelAppointment(a.id)}
                            className="rounded bg-red-100 px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-200"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
