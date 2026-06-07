import {
  addMinutes,
  format,
  isBefore,
  parse,
} from "date-fns";
import type { Appointment, Doctor, Service } from "../types";
import { getDayOfWeek, TIME_SLOTS } from "../types";

export function isDoctorAvailableOnDate(doctor: Doctor, dateStr: string): boolean {
  const day = getDayOfWeek(dateStr);
  return doctor.schedule.some((s) => s.day === day);
}

export function getDoctorScheduleForDate(
  doctor: Doctor,
  dateStr: string
): { startTime: string; endTime: string } | null {
  const day = getDayOfWeek(dateStr);
  const schedule = doctor.schedule.find((s) => s.day === day);
  return schedule ?? null;
}

function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function isSlotInSchedule(
  slot: string,
  startTime: string,
  endTime: string
): boolean {
  const slotMin = timeToMinutes(slot);
  return slotMin >= timeToMinutes(startTime) && slotMin < timeToMinutes(endTime);
}

export function getBookedSlots(
  appointments: Appointment[],
  doctorId: string,
  date: string
): string[] {
  return appointments
    .filter(
      (a) =>
        a.doctorId === doctorId &&
        a.date === date &&
        a.status !== "cancelled"
    )
    .map((a) => a.time);
}

export function getAvailableSlots(
  doctor: Doctor,
  date: string,
  appointments: Appointment[],
  services: Service[],
  selectedServiceIds: string[]
): { slot: string; available: boolean; reason?: string }[] {
  const schedule = getDoctorScheduleForDate(doctor, date);
  if (!schedule) {
    return TIME_SLOTS.map((slot) => ({
      slot,
      available: false,
      reason: "Doctor not available this day",
    }));
  }

  const booked = getBookedSlots(appointments, doctor.id, date);
  const totalDuration = selectedServiceIds.reduce((sum, id) => {
    const svc = services.find((s) => s.id === id);
    return sum + (svc?.durationMinutes ?? 30);
  }, 0) || 30;

  const slotsNeeded = Math.ceil(totalDuration / 30);

  return TIME_SLOTS.map((slot) => {
    if (!isSlotInSchedule(slot, schedule.startTime, schedule.endTime)) {
      return { slot, available: false, reason: "Outside working hours" };
    }

    if (booked.includes(slot)) {
      return { slot, available: false, reason: "Already booked" };
    }

    for (let i = 1; i < slotsNeeded; i++) {
      const nextSlot = addMinutes(
        parse(slot, "HH:mm", new Date()),
        i * 30
      );
      const nextSlotStr = format(nextSlot, "HH:mm");
      if (
        !isSlotInSchedule(nextSlotStr, schedule.startTime, schedule.endTime) ||
        booked.includes(nextSlotStr)
      ) {
        return { slot, available: false, reason: "Insufficient consecutive slots" };
      }
    }

    return { slot, available: true };
  });
}

export function getDoctorAvailabilitySummary(
  doctor: Doctor,
  date: string,
  appointments: Appointment[]
): { total: number; booked: number; available: number } {
  const schedule = getDoctorScheduleForDate(doctor, date);
  if (!schedule) return { total: 0, booked: 0, available: 0 };

  const eligibleSlots = TIME_SLOTS.filter((slot) =>
    isSlotInSchedule(slot, schedule.startTime, schedule.endTime)
  );
  const booked = getBookedSlots(appointments, doctor.id, date);

  return {
    total: eligibleSlots.length,
    booked: booked.length,
    available: eligibleSlots.length - booked.length,
  };
}

export function formatTime12h(time: string): string {
  const parsed = parse(time, "HH:mm", new Date());
  return format(parsed, "h:mm a");
}

export function isPastSlot(date: string, time: string): boolean {
  const slotDate = parse(`${date} ${time}`, "yyyy-MM-dd HH:mm", new Date());
  return isBefore(slotDate, new Date());
}
