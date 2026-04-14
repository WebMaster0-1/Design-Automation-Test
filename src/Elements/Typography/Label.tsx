import React from 'react';
import './Typography.css';

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  size?: 'sm' | 'md';
  weight?: 'regular' | 'medium' | 'semibold' | 'bold';
  color?: 'primary' | 'secondary' | 'default' | 'inherit' | 'grey';
}

export const Label: React.FC<LabelProps> = ({
  size = 'md',
  weight = 'medium',
  color = 'default',
  className = '',
  children,
  ...props
}) => {
  const classNames = [
    'fmdq-label',
    `fmdq-label--size-${size}`,
    `fmdq-label--weight-${weight}`,
    `fmdq-typography--color-${color}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <label className={classNames} {...props}>
      {children}
    </label>
  );
};
