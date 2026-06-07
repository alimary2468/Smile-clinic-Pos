import { Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { AppointmentsPage } from "./pages/AppointmentsPage";
import { AvailabilityPage } from "./pages/AvailabilityPage";
import { Dashboard } from "./pages/Dashboard";
import { InvoicesPage } from "./pages/InvoicesPage";
import { POSPage } from "./pages/POSPage";
import { ServicesPage } from "./pages/ServicesPage";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/appointments" element={<AppointmentsPage />} />
        <Route path="/availability" element={<AvailabilityPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/pos" element={<POSPage />} />
        <Route path="/invoices" element={<InvoicesPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}
