import React, { HTMLAttributes } from 'react';
import './Card.css';

export const Card: React.FC<HTMLAttributes<HTMLDivElement>> = ({ className = '', children, ...props }) => (
  <div className={`qasah-card ${className}`} {...props}>
    {children}
  </div>
);

export const CardHeader: React.FC<HTMLAttributes<HTMLDivElement>> = ({ className = '', children, ...props }) => (
  <div className={`qasah-card-header ${className}`} {...props}>
    {children}
  </div>
);

export const CardTitle: React.FC<HTMLAttributes<HTMLHeadingElement>> = ({ className = '', children, ...props }) => (
  <h3 className={`qasah-card-title ${className}`} {...props}>
    {children}
  </h3>
);

export const CardBody: React.FC<HTMLAttributes<HTMLDivElement>> = ({ className = '', children, ...props }) => (
  <div className={`qasah-card-body ${className}`} {...props}>
    {children}
  </div>
);

export const CardFooter: React.FC<HTMLAttributes<HTMLDivElement>> = ({ className = '', children, ...props }) => (
  <div className={`qasah-card-footer ${className}`} {...props}>
    {children}
  </div>
);
