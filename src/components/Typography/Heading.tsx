import React from 'react';
import './Typography.css';

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
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
  const Tag = `h${level}` as React.ElementType;
  const classNames = [
    'qasah-heading',
    `qasah-heading--h${level}`,
    `qasah-typography--align-${align}`,
    `qasah-typography--color-${color}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <Tag className={classNames} {...props}>
      {children}
    </Tag>
  );
};
