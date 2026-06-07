import { createContext, useContext, type ReactNode } from "react";
import { useClinicStore, type ClinicStore } from "../hooks/useClinicStore";

const ClinicContext = createContext<ClinicStore | null>(null);

export function ClinicProvider({ children }: { children: ReactNode }) {
  const store = useClinicStore();
  return (
    <ClinicContext.Provider value={store}>{children}</ClinicContext.Provider>
  );
}

export function useClinic(): ClinicStore {
  const ctx = useContext(ClinicContext);
  if (!ctx) throw new Error("useClinic must be used within ClinicProvider");
  return ctx;
}
