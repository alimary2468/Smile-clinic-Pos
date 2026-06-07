import { useState } from "react";
import { useClinic } from "../context/ClinicContext";
import { InvoiceView } from "../components/InvoiceView";
import type { InvoiceLineItem } from "../types";
import { formatCurrency } from "../types";

export function POSPage() {
  const { doctors, services, settings, addInvoice } = useClinic();
  const [patientName, setPatientName] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [doctorId, setDoctorId] = useState(doctors[0]?.id ?? "");
  const [cart, setCart] = useState<InvoiceLineItem[]>([]);
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] =
    useState<"cash" | "card" | "insurance" | "upi">("cash");
  const [notes, setNotes] = useState("");
  const [lastInvoice, setLastInvoice] = useState<ReturnType<typeof addInvoice> | null>(null);

  const addToCart = (serviceId: string) => {
    const svc = services.find((s) => s.id === serviceId);
    if (!svc) return;
    setCart((prev) => {
      const existing = prev.find((i) => i.serviceId === serviceId);
      if (existing) {
        return prev.map((i) =>
          i.serviceId === serviceId
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [
        ...prev,
        {
          serviceId,
          name: svc.name,
          quantity: 1,
          rate: svc.rate,
        },
      ];
    });
  };

  const updateQty = (serviceId: string, qty: number) => {
    if (qty < 1) {
      setCart((prev) => prev.filter((i) => i.serviceId !== serviceId));
      return;
    }
    setCart((prev) =>
      prev.map((i) => (i.serviceId === serviceId ? { ...i, quantity: qty } : i))
    );
  };

  const subtotal = cart.reduce((s, i) => s + i.rate * i.quantity, 0);
  const afterDiscount = Math.max(0, subtotal - discount);
  const taxAmount = (afterDiscount * settings.taxRate) / 100;
  const total = afterDiscount + taxAmount;

  const handleCheckout = () => {
    if (!patientName || !patientPhone || cart.length === 0) return;
    const invoice = addInvoice({
      appointmentId: null,
      patientName,
      patientPhone,
      doctorId,
      lineItems: cart,
      subtotal,
      taxRate: settings.taxRate,
      taxAmount,
      discount,
      total,
      paymentMethod,
      status: "paid",
      notes,
    });
    setLastInvoice(invoice);
    setCart([]);
    setDiscount(0);
    setNotes("");
  };

  const doctor = doctors.find((d) => d.id === doctorId);

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900">POS / Billing</h2>
      <p className="mt-1 text-slate-600">Create invoices and process payments.</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Patient Details</h3>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Patient name *"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
              />
              <input
                type="tel"
                placeholder="Phone *"
                value={patientPhone}
                onChange={(e) => setPatientPhone(e.target.value)}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
              />
              <select
                value={doctorId}
                onChange={(e) => setDoctorId(e.target.value)}
                className="col-span-2 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
              >
                {doctors.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Add Services</h3>
            <div className="mt-4 max-h-64 space-y-2 overflow-y-auto">
              {services.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => addToCart(s.id)}
                  className="flex w-full items-center justify-between rounded-lg border border-slate-100 px-4 py-3 text-left text-sm transition-colors hover:border-brand-300 hover:bg-brand-50"
                >
                  <span>{s.name}</span>
                  <span className="font-medium text-brand-600">
                    {formatCurrency(s.rate)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="font-semibold text-slate-900">Cart</h3>
          {cart.length === 0 ? (
            <p className="mt-4 text-sm text-slate-500">No items added yet.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {cart.map((item) => (
                <li
                  key={item.serviceId}
                  className="flex items-center justify-between text-sm"
                >
                  <span>{item.name}</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => updateQty(item.serviceId, item.quantity - 1)}
                      className="rounded border px-2 py-0.5 hover:bg-slate-50"
                    >
                      −
                    </button>
                    <span className="w-6 text-center">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQty(item.serviceId, item.quantity + 1)}
                      className="rounded border px-2 py-0.5 hover:bg-slate-50"
                    >
                      +
                    </button>
                    <span className="w-20 text-right font-medium">
                      {formatCurrency(item.rate * item.quantity)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-6 space-y-2 border-t border-slate-200 pt-4 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span>Discount</span>
              <input
                type="number"
                min={0}
                value={discount}
                onChange={(e) => setDiscount(Number(e.target.value))}
                className="w-24 rounded border border-slate-300 px-2 py-1 text-right text-sm"
              />
            </div>
            <div className="flex justify-between">
              <span>Tax ({settings.taxRate}%)</span>
              <span>{formatCurrency(taxAmount)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-brand-700">{formatCurrency(total)}</span>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-slate-700">
              Payment Method
            </label>
            <select
              value={paymentMethod}
              onChange={(e) =>
                setPaymentMethod(
                  e.target.value as "cash" | "card" | "insurance" | "upi"
                )
              }
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            >
              <option value="cash">Cash</option>
              <option value="card">Card</option>
              <option value="upi">UPI</option>
              <option value="insurance">Insurance</option>
            </select>
          </div>

          <textarea
            placeholder="Notes (optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            className="mt-4 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />

          <button
            type="button"
            onClick={handleCheckout}
            disabled={cart.length === 0 || !patientName || !patientPhone}
            className="mt-4 w-full rounded-lg bg-brand-600 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Generate Invoice
          </button>
        </div>
      </div>

      {lastInvoice && (
        <div className="mt-8">
          <div className="no-print mb-4 flex gap-3">
            <button
              type="button"
              onClick={() => window.print()}
              className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
            >
              Print Invoice
            </button>
            <button
              type="button"
              onClick={() => setLastInvoice(null)}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Close
            </button>
          </div>
          <InvoiceView
            invoice={lastInvoice}
            settings={settings}
            doctorName={doctor?.name}
          />
        </div>
      )}
    </div>
  );
}
