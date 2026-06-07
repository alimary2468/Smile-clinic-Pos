import type { AppState, Doctor, Service } from "../types";

export const defaultDoctors: Doctor[] = [
  {
    id: "doc-1",
    name: "Dr. Priya Sharma",
    specialty: "General Dentistry",
    schedule: [
      { day: "monday", startTime: "09:00", endTime: "17:00" },
      { day: "tuesday", startTime: "09:00", endTime: "17:00" },
      { day: "wednesday", startTime: "09:00", endTime: "13:00" },
      { day: "friday", startTime: "09:00", endTime: "17:00" },
    ],
  },
  {
    id: "doc-2",
    name: "Dr. Rahul Mehta",
    specialty: "Orthodontics",
    schedule: [
      { day: "tuesday", startTime: "10:00", endTime: "18:00" },
      { day: "thursday", startTime: "10:00", endTime: "18:00" },
      { day: "saturday", startTime: "09:00", endTime: "14:00" },
    ],
  },
  {
    id: "doc-3",
    name: "Dr. Ananya Patel",
    specialty: "Pediatric Dentistry",
    schedule: [
      { day: "monday", startTime: "10:00", endTime: "16:00" },
      { day: "wednesday", startTime: "14:00", endTime: "18:00" },
      { day: "thursday", startTime: "09:00", endTime: "15:00" },
      { day: "saturday", startTime: "10:00", endTime: "16:00" },
    ],
  },
];

export const defaultServices: Service[] = [
  {
    id: "svc-1",
    name: "General Consultation",
    category: "Consultation",
    rate: 500,
    durationMinutes: 30,
    description: "Initial dental examination and consultation",
  },
  {
    id: "svc-2",
    name: "Teeth Cleaning (Scaling)",
    category: "Preventive",
    rate: 1500,
    durationMinutes: 45,
    description: "Professional dental cleaning and plaque removal",
  },
  {
    id: "svc-3",
    name: "Tooth Filling (Composite)",
    category: "Restorative",
    rate: 2500,
    durationMinutes: 60,
    description: "Composite resin filling for cavities",
  },
  {
    id: "svc-4",
    name: "Root Canal Treatment",
    category: "Endodontics",
    rate: 8000,
    durationMinutes: 90,
    description: "Single sitting root canal therapy",
  },
  {
    id: "svc-5",
    name: "Tooth Extraction",
    category: "Surgery",
    rate: 3000,
    durationMinutes: 45,
    description: "Simple tooth extraction procedure",
  },
  {
    id: "svc-6",
    name: "Dental X-Ray (OPG)",
    category: "Diagnostics",
    rate: 800,
    durationMinutes: 15,
    description: "Full mouth panoramic radiograph",
  },
  {
    id: "svc-7",
    name: "Teeth Whitening",
    category: "Cosmetic",
    rate: 12000,
    durationMinutes: 60,
    description: "Professional in-office teeth whitening",
  },
  {
    id: "svc-8",
    name: "Dental Crown (Ceramic)",
    category: "Restorative",
    rate: 15000,
    durationMinutes: 60,
    description: "High-quality ceramic crown placement",
  },
  {
    id: "svc-9",
    name: "Braces Consultation",
    category: "Orthodontics",
    rate: 1000,
    durationMinutes: 45,
    description: "Orthodontic assessment and treatment planning",
  },
  {
    id: "svc-10",
    name: "Child Dental Checkup",
    category: "Pediatric",
    rate: 600,
    durationMinutes: 30,
    description: "Comprehensive dental checkup for children",
  },
];

export const defaultState: AppState = {
  doctors: defaultDoctors,
  services: defaultServices,
  appointments: [],
  invoices: [],
  settings: {
    name: "SmileCare Dental Clinic",
    address: "42 Health Avenue, Medical District, Mumbai 400001",
    phone: "+91 98765 43210",
    email: "care@smilecare.dental",
    taxRate: 5,
  },
};
