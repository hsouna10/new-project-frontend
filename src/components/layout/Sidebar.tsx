import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useRole } from '@/contexts/RoleContext';
import { cn } from '@/lib/utils';
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
    Search,
    Menu,
    X,
    Activity,
    Map as MapIcon,
    UserPlus,
    CalendarCheck,
    CreditCard,
    Dumbbell,
    Salad,
    Building2,
    Sparkles,
    Book
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import api from '@/services/api';

export default function Sidebar() {
    const { role, user, setRole, setUser } = useRole();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(true);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [branding, setBranding] = useState<any>(null);

    useEffect(() => {
        const fetchBranding = async () => {
            if (role === 'admin' && user) {
                try {
                    const res = await api.get(`/admin/branding?adminId=${user.id}`);
                    if (res.data.status === 'success') {
                        setBranding(res.data.data);
                    }
                } catch (error) {
                    console.error("Error fetching branding:", error);
                }
            }
        };
        fetchBranding();
    }, [role, user]);

    const handleLogout = () => {
        setRole('visitor');
        setUser(null);
    };

    const getNavItems = () => {
        switch (role) {
            case 'patient':
                return [
                    { path: '/dashboard/patient', icon: Home, label: 'Accueil' },
                    { path: '/dashboard/patient/search', icon: Search, label: 'Rechercher Médecin' },
                    { path: '/dashboard/patient/search?view=map', icon: MapIcon, label: 'Carte Médecins' },
                    { path: '/dashboard/patient/appointments', icon: Calendar, label: 'Mes Rendez-vous' },
                    { path: '/dashboard/patient/chatbot', icon: MessageSquare, label: 'Chatbot' },
                    { path: '/dashboard/patient/health-3d', icon: Activity, label: 'Santé 3D' },
                    { path: '/dashboard/patient/journal', icon: Book, label: 'Journal de Santé' },
                    { path: '/dashboard/patient/reports', icon: FileText, label: 'Mes Rapports' },
                    { path: '/dashboard/patient/profile', icon: User, label: 'Mon Profil' },
                ];
            case 'doctor':
                return [
                    { path: '/dashboard/doctor', icon: Home, label: 'Tableau de bord' },
                    { path: '/dashboard/doctor/appointments', icon: Calendar, label: 'Rendez-vous' },
                    { path: '/dashboard/doctor/patients', icon: Users, label: 'Mes Patients' },
                    { path: '/dashboard/doctor/reports', icon: FileText, label: 'Rapports' },
                    { path: '/dashboard/doctor/network', icon: Users, label: 'Confrères' },
                    { path: '/dashboard/doctor/profile', icon: User, label: 'Mon Profil' },
                ];
            case 'admin':
                return [
                    { path: '/dashboard/admin', icon: Home, label: 'Dashboard' },
                    { path: '/dashboard/admin/members', icon: Users, label: 'Membres' },
                    { path: '/dashboard/admin/classes', icon: Calendar, label: 'Cours' },
                    { path: '/dashboard/admin/workouts', icon: Dumbbell, label: 'Programmes' },
                    { path: '/dashboard/admin/nutrition', icon: Salad, label: 'Nutrition' },
                    { path: '/dashboard/admin/subscriptions', icon: CreditCard, label: 'Paiements' },
                    { path: '/dashboard/admin/gym-profile', icon: User, label: 'Profil' },
                    { path: '/dashboard/admin/branding', icon: Sparkles, label: 'Branding & Configuration' },
                    { path: '/dashboard/admin/settings', icon: Settings, label: 'Paramètres' },
                ];
            case 'superadmin':
                return [
                    { path: '/dashboard/admin', icon: Home, label: 'Dashboard Maître' },
                    { path: '/dashboard/admin/gyms', icon: Building2, label: 'Gestion du Réseau', highlight: true },
                    { path: '/dashboard/admin/doctors', icon: Stethoscope, label: 'Gestion Médecins' },
                    { path: '/dashboard/admin/users', icon: Users, label: 'Utilisateurs Globaux' },
                    { path: '/dashboard/admin/settings', icon: Settings, label: 'Paramètres Système' },
                ];
            default:
                return [
                    { path: '/articles', icon: FileText, label: 'Articles' },
                    { path: '/search', icon: Search, label: 'Rechercher Médecin' },
                ];
        }
    };

    const navItems = getNavItems();

    const primaryColor = branding?.primaryColor || '#1B5E20';
    const accentColor = branding?.accentColor || '#FFD600';

    return (
        <>
            {/* Mobile Toggle */}
            <div className="lg:hidden fixed top-4 left-4 z-50">
                <Button size="icon" variant="outline" onClick={() => setMobileOpen(!mobileOpen)}>
                    {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                </Button>
            </div>

            {/* Sidebar Container */}
            <motion.aside
                className={cn(
                    "fixed top-0 left-0 z-40 h-screen bg-background border-r transition-all duration-300",
                    isOpen ? "w-64" : "w-20",
                    "hidden lg:flex flex-col"
                )}
                animate={{ width: isOpen ? 256 : 80 }}
            >
                <div className="p-4 flex items-center justify-between">
                    <div className={cn("flex items-center gap-2 overflow-hidden", !isOpen && "justify-center w-full")}>
                        <div 
                            className="w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center shadow-lg transition-transform hover:scale-105"
                            style={{ background: `linear-gradient(135deg, ${primaryColor}, ${branding?.secondaryColor || '#66BB6A'})` }}
                        >
                            {branding?.logo ? (
                                <img src={branding.logo} alt="Logo" className="w-full h-full object-cover rounded-lg" />
                            ) : (
                                <Building2 className="w-6 h-6 text-white" />
                            )}
                        </div>
                        {isOpen && <span className="font-bold text-xl tracking-tight whitespace-nowrap uppercase italic ml-1">
                            {branding?.name || 'sahtyy'}
                        </span>}
                    </div>
                    {isOpen && (
                        <Button variant="ghost" size="icon" className="ml-auto" onClick={() => setIsOpen(false)}>
                            <X className="h-4 w-4" />
                        </Button>
                    )}
                    {!isOpen && (
                        <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)}>
                            <Menu className="h-4 w-4" />
                        </Button>
                    )}
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link key={item.path} to={item.path}>
                                <Button
                                    variant={isActive ? "secondary" : "ghost"}
                                    className={cn(
                                        "w-full justify-start mb-1 transition-all group relative",
                                        !isOpen && "justify-center px-2",
                                        isActive && "font-semibold shadow-sm",
                                        //@ts-ignore
                                        item.highlight && "bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20"
                                    )}
                                    style={isActive ? { 
                                        backgroundColor: `${primaryColor}15`, 
                                        color: primaryColor,
                                        borderLeft: `4px solid ${accentColor}` 
                                    } : {}}
                                >
                                    <item.icon className={cn("h-5 w-5 transition-transform group-hover:scale-110", isOpen && "mr-2")} />
                                    {isOpen && <span>{item.label}</span>}
                                    {isActive && (
                                        <motion.div 
                                            layoutId="activeTab"
                                            className="absolute right-0 top-0 bottom-0 w-1"
                                            style={{ backgroundColor: accentColor }}
                                        />
                                    )}
                                </Button>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t">
                    {user && isOpen && (
                        <div className="mb-4 flex items-center gap-3 bg-muted/50 p-3 rounded-lg border border-border/50">
                            <div 
                                className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md"
                                style={{ background: `linear-gradient(135deg, ${primaryColor}, ${branding?.secondaryColor || '#3B82F6'})` }}
                            >
                                {user.name?.charAt(0) || 'A'}
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-sm font-bold truncate">{user.name}</p>
                                <p className="text-[10px] text-muted-foreground truncate uppercase tracking-widest">{role}</p>
                            </div>
                        </div>
                    )}

                    <Link to="/">
                        <Button
                            variant="ghost"
                            className={cn(
                                "w-full justify-start text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors",
                                !isOpen && "justify-center px-2"
                            )}
                            onClick={handleLogout}
                        >
                            <LogOut className={cn("h-5 w-5", isOpen && "mr-2")} />
                            {isOpen && <span>Déconnexion</span>}
                        </Button>
                    </Link>
                </div>
            </motion.aside>

            {/* Mobile Drawer */}
            {mobileOpen && (
                <div className="fixed inset-0 z-40 lg:hidden text-foreground">
                    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
                    <motion.div
                        initial={{ x: "-100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "-100%" }}
                        className="fixed inset-y-0 left-0 z-50 w-3/4 max-w-xs bg-background border-r p-6 shadow-lg"
                    >
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-2">
                                <div 
                                    className="w-10 h-10 rounded-lg flex items-center justify-center shadow-lg"
                                    style={{ background: `linear-gradient(135deg, ${primaryColor}, ${branding?.secondaryColor || '#66BB6A'})` }}
                                >
                                    {branding?.logo ? (
                                        <img src={branding.logo} alt="Logo" className="w-full h-full object-cover rounded-lg" />
                                    ) : (
                                        <Building2 className="w-6 h-6 text-white" />
                                    )}
                                </div>
                                <span className="font-bold text-xl uppercase tracking-tighter italic">
                                    {branding?.name || 'sahtyy'}
                                </span>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => setMobileOpen(false)}>
                                <X className="h-5 w-5" />
                            </Button>
                        </div>

                        <nav className="space-y-1">
                            {navItems.map((item) => {
                                const isActive = location.pathname === item.path;
                                return (
                                    <Link key={item.path} to={item.path} onClick={() => setMobileOpen(false)}>
                                        <Button
                                            variant={isActive ? "secondary" : "ghost"}
                                            className={cn(
                                                "w-full justify-start transition-all",
                                                isActive && "font-bold shadow-sm"
                                            )}
                                            style={isActive ? { 
                                                backgroundColor: `${primaryColor}15`, 
                                                color: primaryColor,
                                                borderLeft: `4px solid ${accentColor}` 
                                            } : {}}
                                        >
                                            <item.icon className="h-5 w-5 mr-3" />
                                            {item.label}
                                        </Button>
                                    </Link>
                                );
                            })}
                        </nav>

                        <div className="absolute bottom-6 left-6 right-6">
                            <Link to="/" onClick={() => { handleLogout(); setMobileOpen(false); }}>
                                <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-700 hover:bg-red-50">
                                    <LogOut className="h-5 w-5 mr-3" />
                                    Déconnexion
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            )}
        </>
    );
}
