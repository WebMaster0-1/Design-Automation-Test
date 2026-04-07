import React from 'react';
import type { HTMLAttributes } from 'react';
import './Badge.css';

export type BadgeVariant = 'primary' | 'success' | 'warning' | 'destructive' | 'info' | 'grey';
export type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  rounded?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({ 
  variant = 'grey', 
  size = 'md',
  rounded = false,
  className = '', 
  children, 
  ...props 
}) => {
  const classes = [
    'qasah-badge',
    `qasah-badge--${variant}`,
    `qasah-badge--${size}`,
    rounded ? 'qasah-badge--rounded' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <span className={classes} {...props}>
      {children}
    </span>
  );
};
