import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, UserCheck, FileCheck, FileX, TrendingUp } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatsCard from '@/components/ui/StatsCard';
import api from "@/services/api";

// 1. Pourcentages des rendez-vous pour chaque statut (accepté ou refusé) - Pie Chart - Vert et Violet
const appointmentStatusData = [
  { name: 'Accepté', value: 85, color: '#10B981' }, // Vert
  { name: 'Refusé', value: 15, color: '#8B5CF6' }, // Violet
];

// ... (other mock data for charts can remain for now as we don't have endpoints for them yet)
// 2. Nombre des utilisateurs par région - Bar Chart - Bleu et Jaune
const usersByRegionData = [
  { region: 'Tunis', patients: 1250, doctors: 120 },
  { region: 'Sfax', patients: 850, doctors: 75 },
  { region: 'Sousse', patients: 680, doctors: 58 },
  { region: 'Bizerte', patients: 420, doctors: 35 },
  { region: 'Gabès', patients: 380, doctors: 28 },
];

// 3. Pourcentage des tranches d'âge des patients - Pie Chart - Rouge, Gris, Violet, Bleu, Jaune
const ageDistributionData = [
  { name: '0-18', value: 15, color: '#EF4444' }, // Rouge
  { name: '19-35', value: 35, color: '#6B7280' }, // Gris
  { name: '36-50', value: 25, color: '#8B5CF6' }, // Violet
  { name: '51-65', value: 15, color: '#3B82F6' }, // Bleu
  { name: '65+', value: 10, color: '#F59E0B' }, // Jaune
];

// 4. Nombre des demandes acceptées et approuvés par région - Line Chart - Vert et Violet
const requestsByRegionData = [
  { region: 'Tunis', approved: 45, accepted: 40 },
  { region: 'Sfax', approved: 35, accepted: 30 },
  { region: 'Sousse', approved: 28, accepted: 25 },
  { region: 'Bizerte', approved: 20, accepted: 18 },
  { region: 'Gabès', approved: 15, accepted: 12 },
];

export default function DashboardAdmin() {
  const [stats, setStats] = useState({
    users: 0,
    doctors: 0,
    patients: 0,
    appointments: 0,
    pendingRequests: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/stats');
        if (res.data.status === 'success') {
          setStats(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          Tableau de Bord <span className="gradient-text">Administrateur</span>
        </h1>
        <p className="text-muted-foreground">Indicateurs Clés de Performance (KPI)</p>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Nombre total des patients - Card - Bleu */}
        <StatsCard
          title="Total Patients"
          value={loading ? "..." : stats.patients.toString()}
          icon={Users}
          color="blue"
          delay={0}
          className="bg-blue-50 border-blue-100 dark:bg-blue-900/10 dark:border-blue-900/20"
          iconClassName="text-blue-500"
        />

        {/* Nombre total des médecins - Card - Jaune */}
        <StatsCard
          title="Total Médecins"
          value={loading ? "..." : stats.doctors.toString()}
          icon={UserCheck}
          color="yellow"
          delay={0.1}
          className="bg-yellow-50 border-yellow-100 dark:bg-yellow-900/10 dark:border-yellow-900/20"
          iconClassName="text-yellow-500"
          valueClassName="text-yellow-700 dark:text-yellow-400"
        />

        {/* Nombre total des demandes approuvées - Card - Vert */}
        {/* Using Total Appointments here as 'Demandes Approuvées' proxy or Requests? 
            Original mock said 'Demandes Approuvées'. Stats gives 'appointments' and 'pendingRequests'.
            Let's use 'Users' count as 'Platform Users' or just stick to Appointments?
            Actually, let's map 'Demandes Approuvées' to 'Appointments' for now, or just generic Users.
            Let's display Total Users here instead of 'Demandes Approuvées' which is ambiguous.
        */}
        <StatsCard
          title="Utilisateurs Total"
          value={loading ? "..." : stats.users.toString()}
          icon={FileCheck}
          color="green"
          delay={0.2}
          className="bg-green-50 border-green-100 dark:bg-green-900/10 dark:border-green-900/20"
          iconClassName="text-green-500"
        />

        {/* Nombre total des demandes refusées - Card - Rouge */}
        {/* We have 'pendingRequests', let's show that instead of 'Demandes Refusées' which is more useful actionable metric */}
        <StatsCard
          title="Demandes en Attente"
          value={loading ? "..." : stats.pendingRequests.toString()}
          icon={FileX}
          color="red"
          delay={0.3}
          className="bg-red-50 border-red-100 dark:bg-red-900/10 dark:border-red-900/20"
          iconClassName="text-red-500"
        />
      </div>

      {/* Row 1: Charts */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">

        {/* Pourcentages des rendez-vous pour chaque statut (accepté ou refusé) - Pie Chart - Vert et Violet */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-panel rounded-2xl p-6"
        >
          <h3 className="text-lg font-semibold mb-4">Statut des Rendez-vous (Accepté/Refusé)</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={appointmentStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {appointmentStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Nombre des utilisateurs par région - Bar Chart - Bleu et Jaune */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-panel rounded-2xl p-6"
        >
          <h3 className="text-lg font-semibold mb-4">Utilisateurs par Région</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={usersByRegionData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="region" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="patients" name="Patients" fill="#3B82F6" radius={[4, 4, 0, 0]} /> {/* Bleu */}
                <Bar dataKey="doctors" name="Médecins" fill="#F59E0B" radius={[4, 4, 0, 0]} /> {/* Jaune */}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Row 2: Charts */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">

        {/* Pourcentage des tranches d'âge des patients - Pie Chart - Rouge, Gris, Violet, Bleu, Jaune */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-panel rounded-2xl p-6"
        >
          <h3 className="text-lg font-semibold mb-4">Tranches d'âge des Patients</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={ageDistributionData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, percent }) => `${name}`}
                >
                  {ageDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Nombre des demandes acceptées et approuvés par région - Line Chart - Vert et Violet */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="glass-panel rounded-2xl p-6"
        >
          <h3 className="text-lg font-semibold mb-4">Demandes par Région</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={requestsByRegionData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="region" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="accepted" name="Acceptées" stroke="#10B981" strokeWidth={2} /> {/* Vert */}
                <Line type="monotone" dataKey="approved" name="Approuvées" stroke="#8B5CF6" strokeWidth={2} /> {/* Violet */}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

      </div>
    </DashboardLayout>
  );
}
