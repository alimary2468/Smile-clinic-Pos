import { format } from "date-fns";
import type { Invoice } from "../types";
import { formatCurrency } from "../types";
import type { ClinicSettings } from "../types";

interface InvoiceViewProps {
  invoice: Invoice;
  settings: ClinicSettings;
  doctorName?: string;
}

export function InvoiceView({ invoice, settings, doctorName }: InvoiceViewProps) {
  return (
    <div className="print-area mx-auto max-w-2xl rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="border-b border-slate-200 pb-6 text-center">
        <h2 className="text-2xl font-bold text-brand-700">{settings.name}</h2>
        <p className="mt-1 text-sm text-slate-600">{settings.address}</p>
        <p className="text-sm text-slate-600">
          {settings.phone} · {settings.email}
        </p>
      </div>

      <div className="mt-6 flex justify-between text-sm">
        <div>
          <p className="font-semibold text-slate-900">INVOICE</p>
          <p className="text-slate-600">{invoice.invoiceNumber}</p>
        </div>
        <div className="text-right">
          <p className="text-slate-600">
            Date: {format(new Date(invoice.createdAt), "dd MMM yyyy")}
          </p>
          <p className="text-slate-600">
            Status:{" "}
            <span className="font-medium capitalize">{invoice.status}</span>
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-lg bg-slate-50 p-4 text-sm">
        <p>
          <span className="font-medium">Patient:</span> {invoice.patientName}
        </p>
        <p>
          <span className="font-medium">Phone:</span> {invoice.patientPhone}
        </p>
        {doctorName && (
          <p>
            <span className="font-medium">Doctor:</span> {doctorName}
          </p>
        )}
        <p>
          <span className="font-medium">Payment:</span>{" "}
          <span className="capitalize">{invoice.paymentMethod}</span>
        </p>
      </div>

      <table className="mt-6 w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-left text-slate-600">
            <th className="pb-2 font-medium">Service</th>
            <th className="pb-2 text-center font-medium">Qty</th>
            <th className="pb-2 text-right font-medium">Rate</th>
            <th className="pb-2 text-right font-medium">Amount</th>
          </tr>
        </thead>
        <tbody>
          {invoice.lineItems.map((item, i) => (
            <tr key={i} className="border-b border-slate-100">
              <td className="py-2">{item.name}</td>
              <td className="py-2 text-center">{item.quantity}</td>
              <td className="py-2 text-right">{formatCurrency(item.rate)}</td>
              <td className="py-2 text-right">
                {formatCurrency(item.rate * item.quantity)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-6 space-y-1 text-sm text-right">
        <p>Subtotal: {formatCurrency(invoice.subtotal)}</p>
        {invoice.discount > 0 && (
          <p className="text-green-600">
            Discount: -{formatCurrency(invoice.discount)}
          </p>
        )}
        <p>
          Tax ({invoice.taxRate}%): {formatCurrency(invoice.taxAmount)}
        </p>
        <p className="text-lg font-bold text-slate-900">
          Total: {formatCurrency(invoice.total)}
        </p>
      </div>

      {invoice.notes && (
        <p className="mt-4 text-xs text-slate-500">Notes: {invoice.notes}</p>
      )}

      <p className="mt-8 text-center text-xs text-slate-400">
        Thank you for choosing {settings.name}
      </p>
    </div>
  );
}
