import { ReactNode } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import { motion } from 'framer-motion';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="pt-16 px-4 pb-8 lg:pl-72 lg:pt-8"
      >
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </motion.main>
    </div>
  );
};

export default DashboardLayout;
