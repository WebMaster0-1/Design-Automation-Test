import React from 'react';
import './Typography.css';

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: 'display-lg' | 'display-sm' | 1 | 2 | 3 | 4 | 5 | 6;
  align?: 'left' | 'center' | 'right' | 'justify';
  color?: 'primary' | 'secondary' | 'default' | 'inherit';
}

export const Heading: React.FC<HeadingProps> = ({
  level = 1,
  align = 'left',
  color = 'default',
  className = '',
  children,
  ...props
}) => {
  const Tag = (typeof level === 'number' ? `h${level}` : 'h1') as React.ElementType;
  const classNames = [
    'fmdq-heading',
    `fmdq-heading--${typeof level === 'number' ? `h${level}` : level}`,
    `fmdq-typography--align-${align}`,
    `fmdq-typography--color-${color}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <Tag className={classNames} {...props}>
      {children}
    </Tag>
  );
};
