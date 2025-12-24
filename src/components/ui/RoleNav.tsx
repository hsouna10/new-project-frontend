import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useRole } from '@/contexts/RoleContext';
import { 
  Home, 
  FileText, 
  Calendar, 
  Users, 
  Settings, 
  LogOut,
  Stethoscope,
  MessageSquare,
  BarChart3,
  User,
  Search
} from 'lucide-react';
import { Button } from './button';

const RoleNav = () => {
  const { role, user, setRole, setUser } = useRole();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    setRole('visitor');
    setUser(null);
    navigate('/');
  };

  const getNavItems = () => {
    switch (role) {
      case 'patient':
        return [
          { path: '/dashboard/patient', icon: Home, label: 'Accueil' },
          { path: '/dashboard/patient/search', icon: Search, label: 'Rechercher Médecin' },
          { path: '/dashboard/patient/appointments', icon: Calendar, label: 'Mes Rendez-vous' },
          { path: '/dashboard/patient/chatbot', icon: MessageSquare, label: 'Chatbot' },
          { path: '/dashboard/patient/profile', icon: User, label: 'Mon Profil' },
        ];
      case 'doctor':
        return [
          { path: '/dashboard/doctor', icon: Home, label: 'Tableau de bord' },
          { path: '/dashboard/doctor/appointments', icon: Calendar, label: 'Rendez-vous' },
          { path: '/dashboard/doctor/patients', icon: Users, label: 'Mes Patients' },
          { path: '/dashboard/doctor/reports', icon: FileText, label: 'Rapports' },
          { path: '/dashboard/doctor/profile', icon: User, label: 'Mon Profil' },
        ];
      case 'admin':
        return [
          { path: '/dashboard/admin', icon: Home, label: 'Tableau de bord' },
          { path: '/dashboard/admin/users', icon: Users, label: 'Utilisateurs' },
          { path: '/dashboard/admin/doctors', icon: Stethoscope, label: 'Demandes Médecins' },
          { path: '/dashboard/admin/stats', icon: BarChart3, label: 'Statistiques' },
          { path: '/dashboard/admin/settings', icon: Settings, label: 'Paramètres' },
        ];
      default:
        return [
          { path: '/articles', icon: FileText, label: 'Articles' },
          { path: '/search', icon: Search, label: 'Rechercher Médecin' },
        ];
    }
  };

  const navItems = getNavItems();

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 px-4 py-3"
    >
      <div className="max-w-7xl mx-auto">
        <div className="glass-card rounded-2xl px-6 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-medical-teal to-medical-blue flex items-center justify-center">
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg hidden sm:block">MediConnect</span>
          </Link>

          {/* Nav Items */}
          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={isActive ? 'default' : 'ghost'}
                    size="sm"
                    className={`gap-2 ${isActive ? 'bg-medical-teal text-white' : ''}`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span className="hidden md:inline">{item.label}</span>
                  </Button>
                </Link>
              );
            })}
          </div>

          {/* User info & Logout */}
          <div className="flex items-center gap-3">
            {user && (
              <div className="hidden sm:flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-medical-teal to-medical-blue flex items-center justify-center text-white text-sm font-medium">
                  {user.name.charAt(0)}
                </div>
                <span className="text-sm font-medium">{user.name}</span>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-muted-foreground hover:text-foreground"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline ml-2">Changer de rôle</span>
            </Button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default RoleNav;
