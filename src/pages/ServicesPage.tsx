import { useClinic } from "../context/ClinicContext";
import { formatCurrency } from "../types";

export function ServicesPage() {
  const { services } = useClinic();
  const categories = [...new Set(services.map((s) => s.category))];

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900">Services & Rates</h2>
      <p className="mt-1 text-slate-600">
        Dental procedures and pricing catalog.
      </p>

      <div className="mt-8 space-y-8">
        {categories.map((cat) => (
          <div key={cat}>
            <h3 className="text-lg font-semibold text-slate-800">{cat}</h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {services
                .filter((s) => s.category === cat)
                .map((s) => (
                  <div
                    key={s.id}
                    className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    <div className="flex items-start justify-between">
                      <h4 className="font-medium text-slate-900">{s.name}</h4>
                      <span className="rounded-full bg-brand-50 px-3 py-1 text-sm font-semibold text-brand-700">
                        {formatCurrency(s.rate)}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-slate-500">{s.description}</p>
                    <p className="mt-3 text-xs text-slate-400">
                      Duration: {s.durationMinutes} min
                    </p>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
