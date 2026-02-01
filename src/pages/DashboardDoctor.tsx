import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, FileText, Calendar, PieChart as PieIcon } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatsCard from '@/components/ui/StatsCard';
import { useRole } from '@/contexts/RoleContext';
import { doctorService } from '@/services/api';
import { useToast } from '@/components/ui/use-toast';

export default function DashboardDoctor() {
  const { user } = useRole();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>({
    kpi: {
      totalPatients: 0,
      totalReports: 0,
      appointmentsToday: 0
    },
    charts: {
      appointmentStatusData: [],
      patientsByRegionData: [],
      patientAgeData: []
    }
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await doctorService.getStats();
        if (response.data?.data) {
          setStats(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les statistiques.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          Bonjour, <span className="gradient-text">{user?.name || 'Docteur'}</span>
        </h1>
        <p className="text-muted-foreground">Vos Indicateurs Clés de Performance (KPI)</p>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatsCard
          title="Patients Visités"
          value={stats.kpi.totalPatients.toString()}
          icon={Users}
          color="blue"
          delay={0}
          className="bg-blue-50 border-blue-100 dark:bg-blue-900/10 dark:border-blue-900/20"
          iconClassName="text-blue-500"
        />

        <StatsCard
          title="Total Rapports"
          value={stats.kpi.totalReports.toString()}
          icon={FileText}
          color="green"
          delay={0.1}
          className="bg-green-50 border-green-100 dark:bg-green-900/10 dark:border-green-900/20"
          iconClassName="text-green-500"
        />

        <StatsCard
          title="Rendez-vous (Aujourd'hui)"
          value={stats.kpi.appointmentsToday.toString()}
          icon={Calendar}
          color="red"
          delay={0.2}
          className="bg-red-50 border-red-100 dark:bg-red-900/10 dark:border-red-900/20"
          iconClassName="text-red-500"
        />
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">

        {/* Appointment Status Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-panel rounded-2xl p-6"
        >
          <h3 className="text-lg font-semibold mb-4">Statut RDV</h3>
          <div className="h-[250px]">
            {stats.charts.appointmentStatusData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.charts.appointmentStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                  >
                    {stats.charts.appointmentStatusData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Pas de données
              </div>
            )}
          </div>
        </motion.div>

        {/* Patients by Region Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-panel rounded-2xl p-6 col-span-1 lg:col-span-2"
        >
          <h3 className="text-lg font-semibold mb-4">Patients par Région</h3>
          <div className="h-[250px]">
            {stats.charts.patientsByRegionData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.charts.patientsByRegionData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="region" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="patients" name="Patients Visités" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Pas de données
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Patient Age Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-panel rounded-2xl p-6"
        >
          <h3 className="text-lg font-semibold mb-4">Âge des Patients Visités</h3>
          <div className="h-[300px]">
            {stats.charts.patientAgeData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.charts.patientAgeData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label={({ name }) => name}
                  >
                    {stats.charts.patientAgeData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Pas de données d'âge disponibles
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
