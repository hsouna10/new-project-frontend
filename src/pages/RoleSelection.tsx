import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useRole, UserRole } from '@/contexts/RoleContext';
import { User, Stethoscope, Shield, Eye } from 'lucide-react';

const roles = [
  {
    id: 'visitor' as UserRole,
    title: 'Visiteur',
    description: 'Consulter les articles et rechercher des médecins',
    icon: Eye,
    color: 'from-medical-purple/20 to-medical-purple/5',
    borderColor: 'border-medical-purple/30',
    iconColor: 'text-medical-purple',
    path: '/articles'
  },
  {
    id: 'patient' as UserRole,
    title: 'Patient',
    description: 'Rechercher des médecins et réserver des rendez-vous',
    icon: User,
    color: 'from-medical-teal/20 to-medical-teal/5',
    borderColor: 'border-medical-teal/30',
    iconColor: 'text-medical-teal',
    path: '/dashboard/patient'
  },
  {
    id: 'doctor' as UserRole,
    title: 'Médecin',
    description: 'Gérer les rendez-vous et les rapports médicaux',
    icon: Stethoscope,
    color: 'from-medical-blue/20 to-medical-blue/5',
    borderColor: 'border-medical-blue/30',
    iconColor: 'text-medical-blue',
    path: '/dashboard/doctor'
  },
  {
    id: 'admin' as UserRole,
    title: 'Administrateur',
    description: 'Gérer les utilisateurs et consulter les statistiques',
    icon: Shield,
    color: 'from-medical-coral/20 to-medical-coral/5',
    borderColor: 'border-medical-coral/30',
    iconColor: 'text-medical-coral',
    path: '/dashboard/admin'
  }
];

const RoleSelection = () => {
  const navigate = useNavigate();
  const { setRole, setUser } = useRole();

  const handleRoleSelect = (role: UserRole, path: string) => {
    setRole(role);

    // Set mock user data based on role
    if (role !== 'visitor') {
      setUser({
        name: role === 'patient' ? 'Ahmed Ben Ali' : role === 'doctor' ? 'Dr. Fatma Khelifi' : 'Admin Système',
        email: `${role}@medical.tn`,
        phone: '+216 XX XXX XXX',
        address: 'Tunis, Tunisie',
        ...(role === 'doctor' && {
          specialty: 'Cardiologie',
          degrees: ['Doctorat en Médecine', 'Spécialisation Cardiologie'],
          region: 'Tunis'
        })
      });
    } else {
      setUser(null);
    }

    navigate(path);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-medical-teal/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-medical-blue/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl w-full">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-medical-teal to-medical-blue bg-clip-text text-transparent">
              MediConnect
            </span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Sélectionnez votre profil pour accéder à votre espace
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {roles.map((role, index) => (
            <motion.button
              key={role.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleRoleSelect(role.id, role.path)}
              className={`group relative p-6 rounded-2xl border ${role.borderColor} bg-gradient-to-br ${role.color} backdrop-blur-sm hover:scale-[1.02] transition-all duration-300 text-left`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl bg-background/50 ${role.iconColor}`}>
                  <role.icon className="w-8 h-8" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {role.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {role.description}
                  </p>
                </div>
              </div>

              {/* Hover arrow */}
              <motion.div
                className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                initial={{ x: -10 }}
                whileHover={{ x: 0 }}
              >
                <span className="text-2xl">→</span>
              </motion.div>
            </motion.button>
          ))}
        </div>

        <div className="mt-12 text-center space-y-2">
          <p className="text-muted-foreground">
            Vous avez déjà un compte ?{" "}
            <Link to="/login" className="text-medical-teal hover:underline font-semibold">
              Se connecter
            </Link>
          </p>
          <p className="text-muted-foreground">
            Nouveau sur MediConnect ?{" "}
            <Link to="/signup" className="text-medical-teal hover:underline font-semibold">
              Créer un compte
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;
