import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  color?: 'teal' | 'blue' | 'coral' | 'purple';
  delay?: number;
}

const colorClasses = {
  teal: 'from-primary/20 to-primary/5 border-primary/30',
  blue: 'from-secondary/20 to-secondary/5 border-secondary/30',
  coral: 'from-accent/20 to-accent/5 border-accent/30',
  purple: 'from-medical-purple/20 to-medical-purple/5 border-medical-purple/30',
};

const iconColorClasses = {
  teal: 'bg-primary/20 text-primary',
  blue: 'bg-secondary/20 text-secondary',
  coral: 'bg-accent/20 text-accent',
  purple: 'bg-medical-purple/20 text-medical-purple',
};

export default function StatsCard({
  title,
  value,
  change,
  changeType = 'neutral',
  icon: Icon,
  color = 'teal',
  delay = 0,
}: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={`glass-panel rounded-2xl p-6 bg-gradient-to-br ${colorClasses[color]} border overflow-hidden relative group`}
    >
      {/* Glow effect on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-radial from-primary/10 via-transparent to-transparent" />
      </div>

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-xl ${iconColorClasses[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
          {change && (
            <span
              className={`text-sm font-medium px-2 py-1 rounded-lg ${
                changeType === 'positive'
                  ? 'bg-green-500/20 text-green-400'
                  : changeType === 'negative'
                  ? 'bg-red-500/20 text-red-400'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {change}
            </span>
          )}
        </div>

        <p className="text-muted-foreground text-sm font-medium mb-1">{title}</p>
        <p className="text-3xl font-bold text-foreground">{value}</p>
      </div>
    </motion.div>
  );
}
