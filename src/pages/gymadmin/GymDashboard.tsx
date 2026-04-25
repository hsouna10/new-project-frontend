import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, UserCheck, FileX, CreditCard, Sparkles, Settings, Loader2, Building2, Calendar } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatsCard from '@/components/ui/StatsCard';
import api from "@/services/api";
import { useRole } from "@/contexts/RoleContext";

export default function GymDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [branding, setBranding] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useRole();

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [statsRes, brandingRes] = await Promise.all([
          api.get('/admin/stats'),
          api.get(`/admin/branding?adminId=${user?.id}`)
        ]);
        
        if (statsRes.data.status === 'success') setStats(statsRes.data.data);
        if (brandingRes.data.status === 'success') setBranding(brandingRes.data.data);
      } catch (error) {
        console.error("Error fetching gym dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchAll();
  }, [user]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  const kpis = [
    { title: "Membres Actifs", value: stats?.activeMembers?.toString() || "0", icon: Users, color: "green", delay: 0 },
    { title: "Total Membres", value: stats?.totalMembers?.toString() || "0", icon: UserCheck, color: "blue", delay: 0.1 },
    { title: "Revenus (30j)", value: `${stats?.revenue || 0} DT`, icon: CreditCard, color: "yellow", delay: 0.2 },
    { title: "Alertes", value: stats?.alerts?.toString() || "0", icon: FileX, color: "red", delay: 0.3 },
  ];

  const primaryColor = branding?.primaryColor || '#1B5E20';
  const accentColor = branding?.accentColor || '#FFD600';

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-3xl font-bold mb-2">
            Tableau de bord : <span className="gradient-text uppercase" 
              style={{ backgroundImage: `linear-gradient(to right, ${primaryColor}, ${accentColor})` }}>
              {branding?.name || "Espace Admin Salle"}
            </span>
          </h1>
          <p className="text-muted-foreground flex items-center gap-2">
             <Building2 className="w-4 h-4" />
             {branding?.address || "Gestion de votre établissement"}
          </p>
        </motion.div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-white px-4 py-2 rounded-full border shadow-sm">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          Gérant de Salle : Accès Local
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
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-panel rounded-2xl p-6 border shadow-lg bg-green-50/30">
           <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-green-600" />
              Statistiques Membres
           </h3>
           <p className="text-sm text-green-700 mb-6 font-medium">Votre salle gère actuellement <strong>{stats?.activeMembers || 0} membres actifs</strong>.</p>
           <div className="p-4 rounded-xl bg-white border shadow-sm">
              <p className="text-xs text-muted-foreground mb-1 uppercase font-bold tracking-wider">Taux de rétention</p>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                 <div 
                    className="h-full bg-green-500" 
                    style={{ width: stats?.totalMembers ? `${(stats.activeMembers / stats.totalMembers) * 100}%` : '0%' }}
                 />
              </div>
           </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-panel rounded-2xl p-6 border shadow-lg bg-blue-50/30">
           <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5 text-blue-600" />
              Raccourcis de Gestion
           </h3>
           <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-white border shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                 <Users className="w-5 h-5 text-blue-500 mb-2" />
                 <p className="font-bold text-sm">Membres</p>
              </div>
              <div className="p-4 rounded-xl bg-white border shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                 <Calendar className="w-5 h-5 text-purple-500 mb-2" />
                 <p className="font-bold text-sm">Planning</p>
              </div>
           </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
