import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RoleProvider } from "@/contexts/RoleContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Home from "./pages/Home";
import DashboardDoctor from "./pages/DashboardDoctor";
import DashboardPatient from "./pages/DashboardPatient";
import DashboardAdmin from "./pages/DashboardAdmin";
import Articles from "./pages/Articles";
import NotFound from "./pages/NotFound";
import PlaceholderPage from "./pages/PlaceholderPage";

const queryClient = new QueryClient();

import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import DoctorAppointments from "./pages/doctor/DoctorAppointments";
import DoctorPatients from "./pages/doctor/DoctorPatients";
import DoctorReports from "./pages/doctor/DoctorReports";
import DoctorProfile from "./pages/doctor/DoctorProfile";
import PatientSearch from "./pages/patient/PatientSearch";
import PatientAppointments from "./pages/patient/PatientAppointments";
import PatientChatbot from "./pages/patient/PatientChatbot";
import PatientProfile from "./pages/patient/PatientProfile";
import AdminUsers from "./pages/admin/AdminUsers";

// Placeholder for Admin pages not yet fully implemented due to task scope/disk space caution

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <RoleProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Doctor Routes */}
            <Route path="/dashboard/doctor" element={
              <ProtectedRoute allowedRoles={['doctor']}>
                <DashboardDoctor />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/doctor/appointments" element={
              <ProtectedRoute allowedRoles={['doctor']}>
                <DoctorAppointments />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/doctor/patients" element={
              <ProtectedRoute allowedRoles={['doctor']}>
                <DoctorPatients />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/doctor/reports" element={
              <ProtectedRoute allowedRoles={['doctor']}>
                <DoctorReports />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/doctor/profile" element={
              <ProtectedRoute allowedRoles={['doctor']}>
                <DoctorProfile />
              </ProtectedRoute>
            } />

            {/* Patient Routes */}
            <Route path="/dashboard/patient" element={
              <ProtectedRoute allowedRoles={['patient']}>
                <DashboardPatient />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/patient/search" element={
              <ProtectedRoute allowedRoles={['patient']}>
                <PatientSearch />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/patient/appointments" element={
              <ProtectedRoute allowedRoles={['patient']}>
                <PatientAppointments />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/patient/chatbot" element={
              <ProtectedRoute allowedRoles={['patient']}>
                <PatientChatbot />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/patient/profile" element={
              <ProtectedRoute allowedRoles={['patient']}>
                <PatientProfile />
              </ProtectedRoute>
            } />

            {/* Admin Routes */}
            <Route path="/dashboard/admin" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <DashboardAdmin />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/admin/users" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminUsers />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/admin/doctors" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <PlaceholderPage title="Demandes Médecins" />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/admin/stats" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <PlaceholderPage title="Statistiques" />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/admin/settings" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <PlaceholderPage title="Paramètres" />
              </ProtectedRoute>
            } />

            <Route path="/articles" element={<Articles />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </RoleProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
