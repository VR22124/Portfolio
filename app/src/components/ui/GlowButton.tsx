import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface GlowButtonProps {
  children: ReactNode;
  variant?: 'filled' | 'outlined';
  onClick?: () => void;
  href?: string;
  className?: string;
  type?: 'button' | 'submit';
  disabled?: boolean;
}

export default function GlowButton({
  children,
  variant = 'filled',
  onClick,
  href,
  className = '',
  type = 'button',
  disabled = false,
}: GlowButtonProps) {
  const baseStyles = 'relative px-6 py-3 rounded-full font-medium text-sm transition-all duration-300 overflow-hidden';

  const variants = {
    filled: 'bg-gradient-to-r from-cyan to-violet text-void hover:shadow-glow hover:scale-[1.03]',
    outlined: 'border border-cyan/50 text-cyan hover:bg-cyan/10 hover:shadow-glow',
  };

  const Component = href ? motion.a : motion.button;

  return (
    <Component
      href={href}
      type={href ? undefined : type}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      style={disabled ? { opacity: 0.5, pointerEvents: 'none' } : {}}
    >
      {children}
    </Component>
  );
}
