import { motion } from 'framer-motion';
import { Users, FileText, Calendar, PieChart as PieIcon } from 'lucide-react'; // Renaming PieChart icon to avoid conflict
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatsCard from '@/components/ui/StatsCard';
import { useRole } from '@/contexts/RoleContext';

// 1. Pourcentages des rendez-vous pour chaque statut (accepté ou refusé) - Pie Chart - Vert et Violet
const appointmentStatusData = [
  { name: 'Accepté', value: 75, color: '#10B981' }, // Vert
  { name: 'Refusé', value: 25, color: '#8B5CF6' }, // Violet
];

// 2. Nombre des patients visités par région - Bar Chart - Bleu
const patientsByRegionData = [
  { region: 'Tunis', patients: 120 },
  { region: 'Sfax', patients: 85 },
  { region: 'Sousse', patients: 60 },
  { region: 'Bizerte', patients: 40 },
  { region: 'Gabès', patients: 30 },
];

// 3. Pourcentage des tranches d'âge des patients visités - Pie Chart - Rouge, Gris, Violet, Bleu, Jaune
const patientAgeData = [
  { name: '0-18', value: 10, color: '#EF4444' }, // Rouge
  { name: '19-35', value: 40, color: '#6B7280' }, // Gris
  { name: '36-50', value: 30, color: '#8B5CF6' }, // Violet
  { name: '51-65', value: 15, color: '#3B82F6' }, // Bleu
  { name: '65+', value: 5, color: '#F59E0B' }, // Jaune
];

export default function DashboardDoctor() {
  const { user } = useRole();

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
        {/* Nombre total des patients visités - Card - Bleu */}
        <StatsCard
          title="Patients Visités"
          value="1,248"
          icon={Users}
          color="blue"
          delay={0}
          className="bg-blue-50 border-blue-100 dark:bg-blue-900/10 dark:border-blue-900/20"
          iconClassName="text-blue-500"
        />

        {/* Nombre total des rapports - Card - Vert */}
        <StatsCard
          title="Total Rapports"
          value="856"
          icon={FileText}
          color="green"
          delay={0.1}
          className="bg-green-50 border-green-100 dark:bg-green-900/10 dark:border-green-900/20"
          iconClassName="text-green-500"
        />

        {/* Nombre total des rendez-vous par jour - Card - Rouge */}
        <StatsCard
          title="Rendez-vous / Jour"
          value="12"
          icon={Calendar}
          color="red"
          delay={0.2}
          className="bg-red-50 border-red-100 dark:bg-red-900/10 dark:border-red-900/20"
          iconClassName="text-red-500"
        />
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">

        {/* Pourcentages des rendez-vous pour chaque statut (accepté ou refusé) - Pie Chart - Vert et Violet */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-panel rounded-2xl p-6"
        >
          <h3 className="text-lg font-semibold mb-4">Statut RDV</h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={appointmentStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                >
                  {appointmentStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend layout="horizontal" verticalAlign="bottom" align="center" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Nombre des patients visités par région - Bar Chart - Bleu */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-panel rounded-2xl p-6 col-span-1 lg:col-span-2"
        >
          <h3 className="text-lg font-semibold mb-4">Patients par Région</h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={patientsByRegionData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="region" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="patients" name="Patients Visités" fill="#3B82F6" radius={[4, 4, 0, 0]} /> {/* Bleu */}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Pourcentage des tranches d'âge des patients visités - Pie Chart - Rouge, Gris, Violet, Bleu, Jaune */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-panel rounded-2xl p-6"
        >
          <h3 className="text-lg font-semibold mb-4">Âge des Patients Visités</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={patientAgeData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name }) => name}
                >
                  {patientAgeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
