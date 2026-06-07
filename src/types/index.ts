export type DayOfWeek =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday";

export interface DoctorSchedule {
  day: DayOfWeek;
  startTime: string;
  endTime: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  schedule: DoctorSchedule[];
}

export interface Service {
  id: string;
  name: string;
  category: string;
  rate: number;
  durationMinutes: number;
  description: string;
}

export type AppointmentStatus =
  | "scheduled"
  | "checked-in"
  | "completed"
  | "cancelled";

export interface Appointment {
  id: string;
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  doctorId: string;
  serviceIds: string[];
  date: string;
  time: string;
  status: AppointmentStatus;
  notes: string;
  createdAt: string;
}

export interface InvoiceLineItem {
  serviceId: string;
  name: string;
  quantity: number;
  rate: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  appointmentId: string | null;
  patientName: string;
  patientPhone: string;
  doctorId: string;
  lineItems: InvoiceLineItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discount: number;
  total: number;
  paymentMethod: "cash" | "card" | "insurance" | "upi";
  status: "paid" | "pending" | "partial";
  notes: string;
  createdAt: string;
}

export interface ClinicSettings {
  name: string;
  address: string;
  phone: string;
  email: string;
  taxRate: number;
}

export interface AppState {
  doctors: Doctor[];
  services: Service[];
  appointments: Appointment[];
  invoices: Invoice[];
  settings: ClinicSettings;
}

export const TIME_SLOTS = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
];

export const DAYS: DayOfWeek[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

export function formatDay(day: DayOfWeek): string {
  return day.charAt(0).toUpperCase() + day.slice(1);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function generateId(): string {
  return crypto.randomUUID();
}

export function getDayOfWeek(dateStr: string): DayOfWeek {
  const date = new Date(dateStr + "T12:00:00");
  const map: DayOfWeek[] = [
    "sunday" as DayOfWeek,
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  const day = map[date.getDay()];
  if (day === ("sunday" as DayOfWeek)) return "saturday";
  return day;
}
