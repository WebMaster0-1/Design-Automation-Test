import React from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import './TopBar.css';

export interface TopBarProps extends HTMLAttributes<HTMLDivElement> {
  leftContent?: ReactNode;
  centerContent?: ReactNode;
  rightContent?: ReactNode;
}

export const TopBar: React.FC<TopBarProps> = ({ 
  leftContent, 
  centerContent, 
  rightContent, 
  className = '', 
  ...props 
}) => {
  return (
    <div className={`qasah-topbar ${className}`} {...props}>
      <div className="qasah-topbar__left">{leftContent}</div>
      <div className="qasah-topbar__center">{centerContent}</div>
      <div className="qasah-topbar__right">{rightContent}</div>
    </div>
  );
};
