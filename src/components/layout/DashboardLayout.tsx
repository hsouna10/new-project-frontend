import { ReactNode } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { motion } from 'framer-motion';

interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

const DashboardLayout = ({ children, title, subtitle }: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="pt-16 px-4 pb-8 lg:pl-72 lg:pt-8"
      >
        <div className="max-w-7xl mx-auto relative">
          <div className="absolute top-0 right-0 z-10">
            <ThemeToggle />
          </div>

          {(title || subtitle) && (
            <div className="mb-8 ml-12 lg:ml-0">
              {title && (
                <h1 className="text-3xl font-bold tracking-tight mb-2">
                  {title}
                </h1>
              )}
              {subtitle && (
                <p className="text-muted-foreground">
                  {subtitle}
                </p>
              )}
            </div>
          )}

          {children}
        </div>
      </motion.main>
    </div>
  );
};

export default DashboardLayout;
