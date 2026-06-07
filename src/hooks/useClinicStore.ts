import { useCallback, useEffect, useState } from "react";
import { defaultState } from "../data/defaults";
import type {
  Appointment,
  AppState,
  Doctor,
  Invoice,
  Service,
} from "../types";
import { generateId } from "../types";

const STORAGE_KEY = "dental-clinic-pos";

function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return { ...defaultState, ...JSON.parse(raw) };
    }
  } catch {
    /* use defaults */
  }
  return defaultState;
}

function saveState(state: AppState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function useClinicStore() {
  const [state, setState] = useState<AppState>(loadState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const addAppointment = useCallback(
    (appointment: Omit<Appointment, "id" | "createdAt" | "status">) => {
      const newAppointment: Appointment = {
        ...appointment,
        id: generateId(),
        status: "scheduled",
        createdAt: new Date().toISOString(),
      };
      setState((prev) => ({
        ...prev,
        appointments: [...prev.appointments, newAppointment],
      }));
      return newAppointment;
    },
    []
  );

  const updateAppointment = useCallback(
    (id: string, updates: Partial<Appointment>) => {
      setState((prev) => ({
        ...prev,
        appointments: prev.appointments.map((a) =>
          a.id === id ? { ...a, ...updates } : a
        ),
      }));
    },
    []
  );

  const cancelAppointment = useCallback((id: string) => {
    updateAppointment(id, { status: "cancelled" });
  }, [updateAppointment]);

  const addInvoice = useCallback(
    (invoice: Omit<Invoice, "id" | "invoiceNumber" | "createdAt">) => {
      const count = state.invoices.length + 1;
      const newInvoice: Invoice = {
        ...invoice,
        id: generateId(),
        invoiceNumber: `INV-${String(count).padStart(5, "0")}`,
        createdAt: new Date().toISOString(),
      };
      setState((prev) => ({
        ...prev,
        invoices: [...prev.invoices, newInvoice],
      }));
      return newInvoice;
    },
    [state.invoices.length]
  );

  const addService = useCallback((service: Omit<Service, "id">) => {
    const newService: Service = { ...service, id: generateId() };
    setState((prev) => ({
      ...prev,
      services: [...prev.services, newService],
    }));
  }, []);

  const updateService = useCallback((id: string, updates: Partial<Service>) => {
    setState((prev) => ({
      ...prev,
      services: prev.services.map((s) =>
        s.id === id ? { ...s, ...updates } : s
      ),
    }));
  }, []);

  const addDoctor = useCallback((doctor: Omit<Doctor, "id">) => {
    const newDoctor: Doctor = { ...doctor, id: generateId() };
    setState((prev) => ({
      ...prev,
      doctors: [...prev.doctors, newDoctor],
    }));
  }, []);

  return {
    ...state,
    addAppointment,
    updateAppointment,
    cancelAppointment,
    addInvoice,
    addService,
    updateService,
    addDoctor,
  };
}

export type ClinicStore = ReturnType<typeof useClinicStore>;
