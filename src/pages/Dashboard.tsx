import { format } from "date-fns";
import { Calendar, IndianRupee, Stethoscope, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { useClinic } from "../context/ClinicContext";
import { formatCurrency } from "../types";

export function Dashboard() {
  const { appointments, doctors, services, invoices } = useClinic();
  const today = format(new Date(), "yyyy-MM-dd");
  const todayAppts = appointments.filter(
    (a) => a.date === today && a.status !== "cancelled"
  );
  const revenue = invoices
    .filter((i) => i.status === "paid")
    .reduce((sum, i) => sum + i.total, 0);

  const stats = [
    {
      label: "Today's Appointments",
      value: todayAppts.length,
      icon: Calendar,
      color: "bg-blue-500",
      link: "/appointments",
    },
    {
      label: "Active Doctors",
      value: doctors.length,
      icon: Users,
      color: "bg-emerald-500",
      link: "/availability",
    },
    {
      label: "Services Offered",
      value: services.length,
      icon: Stethoscope,
      color: "bg-violet-500",
      link: "/services",
    },
    {
      label: "Total Revenue",
      value: formatCurrency(revenue),
      icon: IndianRupee,
      color: "bg-amber-500",
      link: "/invoices",
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900">Dashboard</h2>
      <p className="mt-1 text-slate-600">
        Welcome back — here&apos;s your clinic overview for today.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            to={stat.link}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">{stat.label}</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">
                  {stat.value}
                </p>
              </div>
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.color} text-white`}
              >
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="font-semibold text-slate-900">Today&apos;s Schedule</h3>
          {todayAppts.length === 0 ? (
            <p className="mt-4 text-sm text-slate-500">No appointments today.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {todayAppts.map((a) => {
                const doc = doctors.find((d) => d.id === a.doctorId);
                return (
                  <li
                    key={a.id}
                    className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3 text-sm"
                  >
                    <div>
                      <p className="font-medium">{a.patientName}</p>
                      <p className="text-slate-500">{doc?.name}</p>
                    </div>
                    <span className="font-medium text-brand-600">{a.time}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="font-semibold text-slate-900">Quick Actions</h3>
          <div className="mt-4 grid gap-2">
            {[
              { to: "/appointments", label: "Book Appointment" },
              { to: "/pos", label: "Create Invoice" },
              { to: "/availability", label: "Check Doctor Availability" },
              { to: "/services", label: "View Service Rates" },
            ].map((action) => (
              <Link
                key={action.to}
                to={action.to}
                className="rounded-lg border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
              >
                {action.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
