import { format } from "date-fns";
import { Printer } from "lucide-react";
import { useState } from "react";
import { useClinic } from "../context/ClinicContext";
import { InvoiceView } from "../components/InvoiceView";
import { formatCurrency } from "../types";

export function InvoicesPage() {
  const { invoices, doctors, settings } = useClinic();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = invoices.find((i) => i.id === selectedId);
  const doctor = selected
    ? doctors.find((d) => d.id === selected.doctorId)
    : undefined;

  const sorted = [...invoices].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900">Invoices</h2>
      <p className="mt-1 text-slate-600">View, print, and manage billing records.</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-4">
            <h3 className="font-semibold text-slate-900">All Invoices</h3>
          </div>
          <div className="max-h-[500px] overflow-y-auto">
            {sorted.length === 0 ? (
              <p className="p-6 text-sm text-slate-500">
                No invoices yet. Create one from POS / Billing.
              </p>
            ) : (
              <ul>
                {sorted.map((inv) => (
                  <li key={inv.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedId(inv.id)}
                      className={`flex w-full items-center justify-between border-b border-slate-100 px-6 py-4 text-left text-sm transition-colors hover:bg-slate-50 ${
                        selectedId === inv.id ? "bg-brand-50" : ""
                      }`}
                    >
                      <div>
                        <p className="font-medium text-slate-900">
                          {inv.invoiceNumber}
                        </p>
                        <p className="text-slate-500">{inv.patientName}</p>
                        <p className="text-xs text-slate-400">
                          {format(new Date(inv.createdAt), "dd MMM yyyy")}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-brand-700">
                          {formatCurrency(inv.total)}
                        </p>
                        <span className="text-xs capitalize text-slate-500">
                          {inv.status}
                        </span>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div>
          {selected ? (
            <>
              <div className="no-print mb-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
                >
                  <Printer className="h-4 w-4" />
                  Print Invoice
                </button>
              </div>
              <InvoiceView
                invoice={selected}
                settings={settings}
                doctorName={doctor?.name}
              />
            </>
          ) : (
            <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-500">
              Select an invoice to view and print
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
