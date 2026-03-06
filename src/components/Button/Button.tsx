import React from 'react';
import './Button.css';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'lg';
  iconStyle?: 'none' | 'leading' | 'trailing' | 'icon-only';
  icon?: React.ReactNode;
  label?: string;
  state?: 'default' | 'hover' | 'focused' | 'de-activated';
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'sm',
  iconStyle = 'none',
  icon,
  label = 'Label',
  state = 'default',
  className = '',
  disabled,
  ...props
}) => {
  const isDeactivated = state === 'de-activated' || disabled;
  
  const classNames = [
    'qasah-button',
    `qasah-button--${variant}`,
    `qasah-button--${size}`,
    `qasah-button--icon-${iconStyle}`,
    state !== 'default' ? `qasah-button--state-${state}` : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <button 
      className={classNames} 
      disabled={isDeactivated}
      {...props}
    >
      {iconStyle === 'leading' && icon && <span className="qasah-button__icon">{icon}</span>}
      {iconStyle === 'icon-only' ? (
        <span className="qasah-button__icon">{icon}</span>
      ) : (
        <span className="qasah-button__label">{label}</span>
      )}
      {iconStyle === 'trailing' && icon && <span className="qasah-button__icon">{icon}</span>}
    </button>
  );
};
