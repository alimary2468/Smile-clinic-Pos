import {
  Calendar,
  Clock,
  FileText,
  LayoutDashboard,
  Receipt,
  ShoppingCart,
  Stethoscope,
} from "lucide-react";
import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { useClinic } from "../context/ClinicContext";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/appointments", label: "Appointments", icon: Calendar },
  { to: "/availability", label: "Availability", icon: Clock },
  { to: "/services", label: "Services & Rates", icon: Stethoscope },
  { to: "/pos", label: "POS / Billing", icon: ShoppingCart },
  { to: "/invoices", label: "Invoices", icon: Receipt },
];

export function Layout({ children }: { children: ReactNode }) {
  const { settings } = useClinic();

  return (
    <div className="flex min-h-screen">
      <aside className="no-print w-64 shrink-0 border-r border-slate-200 bg-white">
        <div className="border-b border-slate-200 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500 text-lg font-bold text-white">
              SC
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">SmileCare</p>
              <p className="text-xs text-slate-500">Dental Clinic POS</p>
            </div>
          </div>
        </div>
        <nav className="space-y-1 p-3">
          {nav.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-brand-50 text-brand-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`
              }
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="absolute bottom-0 w-64 border-t border-slate-200 p-4 text-xs text-slate-500">
          <p className="font-medium text-slate-700">{settings.name}</p>
          <p className="mt-1">{settings.phone}</p>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <header className="no-print border-b border-slate-200 bg-white px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold text-slate-900">
              {settings.name}
            </h1>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <FileText className="h-4 w-4" />
              Clinic Management System
            </div>
          </div>
        </header>
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
