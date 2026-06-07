import { format } from "date-fns";
import { useState } from "react";
import { useClinic } from "../context/ClinicContext";
import { formatDay } from "../types";
import {
  formatTime12h,
  getAvailableSlots,
  getDoctorAvailabilitySummary,
  getDoctorScheduleForDate,
  isDoctorAvailableOnDate,
} from "../utils/availability";

export function AvailabilityPage() {
  const { doctors, appointments, services } = useClinic();
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [selectedDoctor, setSelectedDoctor] = useState(doctors[0]?.id ?? "");

  const doctor = doctors.find((d) => d.id === selectedDoctor);

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900">Doctor Availability</h2>
      <p className="mt-1 text-slate-600">
        View each doctor&apos;s schedule and open time slots.
      </p>

      <div className="mt-6 flex flex-wrap gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">
            Doctor
          </label>
          <select
            value={selectedDoctor}
            onChange={(e) => setSelectedDoctor(e.target.value)}
            className="mt-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
          >
            {doctors.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {doctors.map((doc) => {
          const summary = getDoctorAvailabilitySummary(
            doc,
            date,
            appointments
          );
          const available = isDoctorAvailableOnDate(doc, date);
          return (
            <div
              key={doc.id}
              className={`rounded-xl border bg-white p-5 shadow-sm ${
                doc.id === selectedDoctor
                  ? "border-brand-400 ring-2 ring-brand-100"
                  : "border-slate-200"
              }`}
            >
              <h3 className="font-semibold text-slate-900">{doc.name}</h3>
              <p className="text-sm text-slate-500">{doc.specialty}</p>
              {available ? (
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Total slots</span>
                    <span className="font-medium">{summary.total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Booked</span>
                    <span className="font-medium text-red-600">
                      {summary.booked}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Available</span>
                    <span className="font-medium text-green-600">
                      {summary.available}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="mt-4 text-sm text-amber-600">
                  Not working on this day
                </p>
              )}
              <div className="mt-3 text-xs text-slate-500">
                Weekly:{" "}
                {doc.schedule.map((s) => formatDay(s.day).slice(0, 3)).join(", ")}
              </div>
            </div>
          );
        })}
      </div>

      {doctor && (
        <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="font-semibold text-slate-900">
            {doctor.name} — Slot Details for {date}
          </h3>
          {(() => {
            const schedule = getDoctorScheduleForDate(doctor, date);
            if (!schedule) {
              return (
                <p className="mt-4 text-sm text-slate-500">
                  Doctor is not scheduled on this date.
                </p>
              );
            }
            const slots = getAvailableSlots(
              doctor,
              date,
              appointments,
              services,
              []
            );
            return (
              <>
                <p className="mt-2 text-sm text-slate-600">
                  Working hours: {formatTime12h(schedule.startTime)} –{" "}
                  {formatTime12h(schedule.endTime)}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {slots.map(({ slot, available, reason }) => (
                    <div
                      key={slot}
                      title={reason}
                      className={`rounded-lg px-3 py-2 text-sm font-medium ${
                        available
                          ? "bg-green-50 text-green-700 ring-1 ring-green-200"
                          : "bg-slate-50 text-slate-400 line-through"
                      }`}
                    >
                      {formatTime12h(slot)}
                    </div>
                  ))}
                </div>
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
}
