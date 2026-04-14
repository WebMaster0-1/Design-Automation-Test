import React from 'react';
import './Button.css';

export type ButtonVariant = 'primary' | 'secondary' | 'destructive' | 'grey' | 'text' | 'success' | 'warning' | 'info';
export type ButtonSize = 'sm' | 'lg';
export type ButtonIconStyle = 'none' | 'leading icon' | 'trailing icon' | 'icon-only';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  iconStyle?: ButtonIconStyle;
  icon?: React.ReactNode;
  outline?: boolean;
  label?: string;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'sm',
  iconStyle = 'none',
  icon,
  outline = false,
  label,
  className = '',
  children,
  disabled,
  ...props
}) => {
  const classNames = [
    'qasah-button',
    `qasah-button--${variant}`,
    `qasah-button--${size}`,
    `qasah-button--icon-${iconStyle.replace(' ', '-')}`,
    outline ? 'qasah-button--outline' : '',
    className
  ].filter(Boolean).join(' ');

  const renderIcon = () => (
    <span className="qasah-button__icon">
      {icon || <DefaultIcon />}
    </span>
  );

  return (
    <button className={classNames} disabled={disabled} {...props}>
      {iconStyle === 'leading icon' && renderIcon()}
      {iconStyle === 'icon-only' ? renderIcon() : (label || children)}
      {iconStyle === 'trailing icon' && renderIcon()}
    </button>
  );
};

const DefaultIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
