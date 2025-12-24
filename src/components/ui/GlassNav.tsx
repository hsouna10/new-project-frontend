import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Stethoscope, User, Calendar, Bot, LayoutDashboard, FileText } from 'lucide-react';

const navItems = [
  { path: '/', label: 'Accueil', icon: Stethoscope },
  { path: '/dashboard/doctor', label: 'Médecin', icon: User },
  { path: '/dashboard/patient', label: 'Patient', icon: Calendar },
  { path: '/dashboard/admin', label: 'Admin', icon: LayoutDashboard },
  { path: '/articles', label: 'Articles', icon: FileText },
];

export default function GlassNav() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      {/* Desktop Navigation */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="fixed top-6 left-1/2 -translate-x-1/2 z-50 hidden md:block"
      >
        <div className="glass-panel rounded-2xl px-2 py-2 flex items-center gap-1">
          <Link to="/" className="flex items-center gap-2 px-4 py-2 mr-2">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <Stethoscope className="w-5 h-5 text-primary" />
            </div>
            <span className="font-bold text-lg gradient-text">MediCare 3D</span>
          </Link>

          {navItems.slice(1).map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-primary/10 rounded-xl"
                    transition={{ type: "spring", duration: 0.5 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </motion.nav>

      {/* Mobile Navigation */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-6 right-6 z-50 md:hidden glass-panel p-3 rounded-xl"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed inset-y-0 right-0 w-72 z-40 md:hidden glass-panel border-l border-white/10"
          >
            <div className="flex flex-col p-6 pt-20 gap-2">
              {navItems.map((item, index) => {
                const isActive = location.pathname === item.path;
                return (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                        isActive
                          ? 'bg-primary/20 text-primary'
                          : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
