import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil } from 'lucide-react';
import '../amethyst.theme.css';

interface FloatingActionButtonProps {
  onClick: () => void;
  icon?: React.ReactNode;
  label?: string;
  size?: 'small' | 'default' | 'large';
  variant?: 'primary' | 'secondary' | 'surface';
}

export function FloatingActionButton({
  onClick,
  icon = <Pencil className="w-6 h-6" />,
  label,
  size = 'default',
  variant = 'primary',
}: FloatingActionButtonProps) {
  const sizeClasses = {
    small: 'w-10 h-10',
    default: 'w-14 h-14',
    large: 'w-24 h-24',
  };

  const variantStyles = {
    primary: {
      backgroundColor: 'var(--md-primary-container)',
      color: 'var(--md-on-primary-container)',
    },
    secondary: {
      backgroundColor: 'var(--md-secondary-container)',
      color: 'var(--md-on-secondary-container)',
    },
    surface: {
      backgroundColor: 'var(--md-surface)',
      color: 'var(--md-primary)',
    },
  };

  return (
    <motion.button
      onClick={onClick}
      className={`md-fab ${sizeClasses[size]} rounded-2xl flex items-center justify-center shadow-lg`}
      data-tour="amethyst-fab"
      style={variantStyles[variant]}
      whileHover={{ scale: 1.05, boxShadow: '0 8px 12px 6px rgba(0, 0, 0, 0.15), 0 4px 4px 0px rgba(0, 0, 0, 0.3)' }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      aria-label={label || 'Create new post'}
    >
      {icon}
    </motion.button>
  );
}

// Extended FAB variant
export function ExtendedFAB({
  onClick,
  icon = <Plus className="w-5 h-5" />,
  label,
}: {
  onClick: () => void;
  icon?: React.ReactNode;
  label: string;
}) {
  return (
    <motion.button
      onClick={onClick}
      className="md-fab h-14 px-4 rounded-xl flex items-center gap-2 shadow-lg"
      style={{
        backgroundColor: 'var(--md-primary-container)',
        color: 'var(--md-on-primary-container)',
        width: 'auto',
      }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      {icon}
      <span className="font-medium text-sm whitespace-nowrap">{label}</span>
    </motion.button>
  );
}
