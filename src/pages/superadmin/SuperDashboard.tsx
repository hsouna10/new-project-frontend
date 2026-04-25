import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, UserCheck, Calendar, Building2, Loader2 } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatsCard from '@/components/ui/StatsCard';
import api from "@/services/api";

const COLORS = ['#10B981', '#8B5CF6', '#3B82F6', '#F59E0B', '#EF4444', '#6B7280'];

export default function SuperDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/superadmin/stats');
        if (res.data.status === 'success') {
          setStats(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching superadmin stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  const appointmentData = stats?.charts?.appointmentBreakdown?.map((item: any) => ({
    name: item._id === 'accepted' ? 'Confirmé' : item._id === 'pending' ? 'En attente' : 'Annulé',
    value: item.count
  })) || [];

  const cityData = (() => {
    const cities: Record<string, any> = {};
    stats?.charts?.patientCityStats?.forEach((c: any) => {
      const name = c._id || 'Inconnue';
      cities[name] = { city: name, patients: c.count, doctors: 0 };
    });
    stats?.charts?.doctorCityStats?.forEach((c: any) => {
      const name = c._id || 'Inconnue';
      if (!cities[name]) cities[name] = { city: name, patients: 0, doctors: c.count };
      else cities[name].doctors = c.count;
    });
    return Object.values(cities);
  })();

  const kpis = [
    { title: "Total Patients", value: stats?.patients?.toString() || "0", icon: Users, color: "blue", delay: 0 },
    { title: "Total Médecins", value: stats?.doctors?.toString() || "0", icon: UserCheck, color: "yellow", delay: 0.1 },
    { title: "Total Salles", value: stats?.gyms?.toString() || "0", icon: Building2, color: "orange", delay: 0.2 },
    { title: "Rendez-vous", value: stats?.appointments?.toString() || "0", icon: Calendar, color: "green", delay: 0.3 },
  ];

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-3xl font-bold mb-2">
            Tableau de bord : <span className="gradient-text uppercase">Espace Maître</span>
          </h1>
          <p className="text-muted-foreground flex items-center gap-2">
             <Building2 className="w-4 h-4" />
             Gestion globale de la plateforme Mediverse
          </p>
        </motion.div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-white px-4 py-2 rounded-full border shadow-sm">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          Super-Admin : Accès Maître
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {kpis.map((kpi: any, idx: number) => (
          <StatsCard
            key={idx}
            title={kpi.title}
            value={kpi.value}
            icon={kpi.icon}
            color={kpi.color as any}
            delay={kpi.delay}
            className="border-none shadow-md bg-white"
          />
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-panel rounded-2xl p-6 border shadow-lg bg-white">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-medical-teal" />
            Répartition des Rendez-vous
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              {appointmentData.length > 0 ? (
                <PieChart>
                  <Pie data={appointmentData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {appointmentData.map((_entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip /><Legend />
                </PieChart>
              ) : <div className="flex items-center justify-center h-full text-muted-foreground italic">Aucune donnée trouvée</div>}
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-panel rounded-2xl p-6 border shadow-lg bg-white">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-500" />
            Répartition par Région
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              {cityData.length > 0 ? (
                <BarChart data={cityData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                  <XAxis dataKey="city" /><YAxis /><Tooltip /><Legend />
                  <Bar dataKey="patients" name="Patients" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="doctors" name="Médecins" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                </BarChart>
              ) : <div className="flex items-center justify-center h-full text-muted-foreground italic">Aucune donnée trouvée</div>}
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
