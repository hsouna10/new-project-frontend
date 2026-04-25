import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import { RoleProvider } from "@/contexts/RoleContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Home from "./pages/Home";
import DashboardDoctor from "./pages/DashboardDoctor";
import DashboardPatient from "./pages/DashboardPatient";
import SuperDashboard from "./pages/superadmin/SuperDashboard";
import GymDashboard from "./pages/gymadmin/GymDashboard";
import { useRole } from "./contexts/RoleContext";
import Articles from "./pages/Articles";
import NotFound from "./pages/NotFound";
import PlaceholderPage from "./pages/PlaceholderPage";
import MedicalTourism from "./pages/MedicalTourism";

const queryClient = new QueryClient();

import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import AdminSignup from "./pages/auth/AdminSignup";
import DoctorAppointments from "./pages/doctor/DoctorAppointments";
import DoctorPatients from "./pages/doctor/DoctorPatients";
import DoctorPatientDetails from "./pages/doctor/DoctorPatientDetails";
import DoctorReports from "./pages/doctor/DoctorReports";
import DoctorProfile from "./pages/doctor/DoctorProfile";
import DoctorNetwork from "./pages/doctor/DoctorNetwork";
import PatientSearch from "./pages/patient/PatientSearch";
import PatientAppointments from "./pages/patient/PatientAppointments";
import PatientChatbot from "./pages/patient/PatientChatbot";
import PatientProfile from "./pages/patient/PatientProfile";
import Health3D from "./pages/patient/Health3D";
import PatientReports from "./pages/patient/PatientReports";
import PatientJournal from "./pages/patient/PatientJournal";
import AdminUsers from "./pages/superadmin/AdminUsers";
import AdminDoctors from "./pages/superadmin/AdminDoctors";
import AdminStats from "./pages/superadmin/AdminStats";
import AdminSettings from "./pages/gymadmin/AdminSettings";
import AdminCreateUser from "./pages/superadmin/AdminCreateUser";
import AdminAppointments from "./pages/gymadmin/AdminAppointments";
import AdminGymBranding from "./pages/gymadmin/AdminGymBranding";
import AdminGymProfile from "./pages/gymadmin/AdminGymProfile";
import AdminGymManagement from "./pages/superadmin/AdminGymManagement";
import AdminMembers from "./pages/gymadmin/AdminMembers";
import AdminSubscriptions from "./pages/gymadmin/AdminSubscriptions";
import AdminClasses from "./pages/gymadmin/AdminClasses";
import AdminWorkouts from "./pages/gymadmin/AdminWorkouts";
import AdminNutrition from "./pages/gymadmin/AdminNutrition";

// Placeholder for Admin pages not yet fully implemented due to task scope/disk space caution

import { GoogleOAuthProvider } from "@react-oauth/google";

const DashboardRouter = () => {
  const { role } = useRole();
  return role === 'superadmin' ? <SuperDashboard /> : <GymDashboard />;
};

const App = () => (
  <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID_PLACEHOLDER">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider defaultTheme="system" storageKey="mediverse-theme">
          <RoleProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/medical-tourism" element={<MedicalTourism />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/forgot-password" element={<div className="flex items-center justify-center h-screen italic text-muted-foreground">Service de récupération bientôt disponible. <Link to="/login" className="ml-2 text-primary underline">Retour</Link></div>} />
                <Route path="/admin-signup" element={<AdminSignup />} />

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
                <Route path="/dashboard/doctor/patient/:id" element={
                  <ProtectedRoute allowedRoles={['doctor']}>
                    <DoctorPatientDetails />
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
                <Route path="/dashboard/doctor/network" element={
                  <ProtectedRoute allowedRoles={['doctor']}>
                    <DoctorNetwork />
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
                <Route path="/dashboard/patient/health-3d" element={
                  <ProtectedRoute allowedRoles={['patient']}>
                    <Health3D />
                  </ProtectedRoute>
                } />
                <Route path="/dashboard/patient/reports" element={
                  <ProtectedRoute allowedRoles={['patient']}>
                    <PatientReports />
                  </ProtectedRoute>
                } />
                <Route path="/dashboard/patient/journal" element={
                  <ProtectedRoute allowedRoles={['patient']}>
                    <PatientJournal />
                  </ProtectedRoute>
                } />

                {/* Admin Routes */}
                <Route path="/dashboard/admin" element={
                  <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
                    <DashboardRouter />
                  </ProtectedRoute>
                } />
                <Route path="/dashboard/admin/users" element={
                  <ProtectedRoute allowedRoles={['superadmin']}>
                    <AdminUsers />
                  </ProtectedRoute>
                } />
                <Route path="/dashboard/admin/members" element={
                  <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
                    <AdminMembers />
                  </ProtectedRoute>
                } />
                <Route path="/dashboard/admin/subscriptions" element={
                  <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
                    <AdminSubscriptions />
                  </ProtectedRoute>
                } />
                <Route path="/dashboard/admin/classes" element={
                  <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
                    <AdminClasses />
                  </ProtectedRoute>
                } />
                <Route path="/dashboard/admin/workouts" element={
                  <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
                    <AdminWorkouts />
                  </ProtectedRoute>
                } />
                <Route path="/dashboard/admin/nutrition" element={
                  <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
                    <AdminNutrition />
                  </ProtectedRoute>
                } />
                <Route path="/dashboard/admin/doctors" element={
                  <ProtectedRoute allowedRoles={['superadmin']}>
                    <AdminDoctors />
                  </ProtectedRoute>
                } />
                <Route path="/dashboard/admin/stats" element={
                  <ProtectedRoute allowedRoles={['superadmin']}>
                    <AdminStats />
                  </ProtectedRoute>
                } />
                <Route path="/dashboard/admin/settings" element={
                  <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
                    <AdminSettings />
                  </ProtectedRoute>
                } />
                <Route path="/dashboard/admin/create-user" element={
                  <ProtectedRoute allowedRoles={['superadmin']}>
                    <AdminCreateUser />
                  </ProtectedRoute>
                } />
                <Route path="/dashboard/admin/appointments" element={
                  <ProtectedRoute allowedRoles={['superadmin']}>
                    <AdminAppointments />
                  </ProtectedRoute>
                } />
                <Route path="/dashboard/admin/branding" element={
                  <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
                    <AdminGymBranding />
                  </ProtectedRoute>
                } />
                <Route path="/dashboard/admin/gym-profile" element={
                  <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
                    <AdminGymProfile />
                  </ProtectedRoute>
                } />
                <Route path="/dashboard/admin/gyms" element={
                  <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
                    <AdminGymManagement />
                  </ProtectedRoute>
                } />

                <Route path="/articles" element={<Articles />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </RoleProvider>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </GoogleOAuthProvider>
);

export default App;
