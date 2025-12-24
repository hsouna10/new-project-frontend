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
    X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function Sidebar() {
    const { role, user, setRole, setUser } = useRole();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(true);
    const [mobileOpen, setMobileOpen] = useState(false);

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
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-medical-teal to-medical-blue flex-shrink-0 flex items-center justify-center">
                            <Stethoscope className="w-5 h-5 text-white" />
                        </div>
                        {isOpen && <span className="font-bold text-lg whitespace-nowrap">MediConnect</span>}
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

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link key={item.path} to={item.path}>
                                <Button
                                    variant={isActive ? "secondary" : "ghost"}
                                    className={cn(
                                        "w-full justify-start mb-1",
                                        !isOpen && "justify-center px-2",
                                        isActive && "bg-medical-teal/10 text-medical-teal hover:bg-medical-teal/20"
                                    )}
                                >
                                    <item.icon className={cn("h-5 w-5", isOpen && "mr-2")} />
                                    {isOpen && <span>{item.label}</span>}
                                </Button>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t">
                    {user && isOpen && (
                        <div className="mb-4 flex items-center gap-3 bg-muted/50 p-3 rounded-lg">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-medical-teal to-medical-blue flex items-center justify-center text-white text-sm font-medium">
                                {user.name.charAt(0)}
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-sm font-medium truncate">{user.name}</p>
                                <p className="text-xs text-muted-foreground truncate capitalize">{role}</p>
                            </div>
                        </div>
                    )}

                    <Link to="/">
                        <Button
                            variant="ghost"
                            className={cn(
                                "w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50",
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
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-medical-teal to-medical-blue flex items-center justify-center">
                                    <Stethoscope className="w-5 h-5 text-white" />
                                </div>
                                <span className="font-bold text-lg">MediConnect</span>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => setMobileOpen(false)}>
                                <X className="h-5 w-5" />
                            </Button>
                        </div>

                        <nav className="space-y-2">
                            {navItems.map((item) => {
                                const isActive = location.pathname === item.path;
                                return (
                                    <Link key={item.path} to={item.path} onClick={() => setMobileOpen(false)}>
                                        <Button
                                            variant={isActive ? "secondary" : "ghost"}
                                            className={cn(
                                                "w-full justify-start",
                                                isActive && "bg-medical-teal/10 text-medical-teal"
                                            )}
                                        >
                                            <item.icon className="h-5 w-5 mr-2" />
                                            {item.label}
                                        </Button>
                                    </Link>
                                );
                            })}
                        </nav>

                        <div className="absolute bottom-6 left-6 right-6">
                            <Link to="/" onClick={() => { handleLogout(); setMobileOpen(false); }}>
                                <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50">
                                    <LogOut className="h-5 w-5 mr-2" />
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
