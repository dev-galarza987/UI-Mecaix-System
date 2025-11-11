import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export const AnimatedCounter = ({ 
  value, 
  duration = 1, 
  prefix = '', 
  suffix = '',
  className = ''
}: AnimatedCounterProps) => {
  return (
    <motion.span
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration, delay: 0.2 }}
      >
        {prefix}
      </motion.span>
      <motion.span
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ 
          opacity: 1, 
          scale: 1,
          transition: { 
            type: "spring" as const,
            stiffness: 100,
            delay: 0.3 
          }
        }}
      >
        {value}
      </motion.span>
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration, delay: 0.5 }}
      >
        {suffix}
      </motion.span>
    </motion.span>
  );
};

interface StatusIndicatorProps {
  status: 'online' | 'offline' | 'warning';
  children: React.ReactNode;
}

export const StatusIndicator = ({ status, children }: StatusIndicatorProps) => {
  const statusColors = {
    online: 'bg-green-500',
    offline: 'bg-red-500',
    warning: 'bg-yellow-500'
  };

  return (
    <div className="flex items-center gap-2">
      <motion.div
        className={`w-2 h-2 rounded-full ${statusColors[status]}`}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.7, 1, 0.7]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      {children}
    </div>
  );
};

interface GlowingCardProps {
  children: React.ReactNode;
  glowColor?: string;
  className?: string;
}

export const GlowingCard = ({ 
  children, 
  glowColor = 'rgba(59, 130, 246, 0.5)',
  className = ''
}: GlowingCardProps) => {
  return (
    <motion.div
      className={`relative ${className}`}
      whileHover={{
        scale: 1.02,
        transition: { type: "spring" as const, stiffness: 300 }
      }}
    >
      <motion.div
        className="absolute -inset-1 rounded-lg opacity-0"
        style={{
          background: `linear-gradient(45deg, ${glowColor}, transparent, ${glowColor})`,
          filter: 'blur(8px)',
        }}
        whileHover={{
          opacity: 0.8,
          transition: { duration: 0.3 }
        }}
      />
      <Card className={`relative z-10 ${className}`}>
        {children}
      </Card>
    </motion.div>
  );
};