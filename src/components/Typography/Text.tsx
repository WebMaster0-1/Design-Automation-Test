import React from 'react';
import './Typography.css';

export interface TextProps extends React.HTMLAttributes<HTMLParagraphElement | HTMLSpanElement | HTMLDivElement> {
  as?: 'p' | 'span' | 'div';
  size?: 'sm' | 'md' | 'lg';
  weight?: 'regular' | 'medium' | 'semibold' | 'bold';
  align?: 'left' | 'center' | 'right' | 'justify';
  color?: 'primary' | 'secondary' | 'default' | 'inherit' | 'grey';
}

export const Text: React.FC<TextProps> = ({
  as: Tag = 'p',
  size = 'md',
  weight = 'regular',
  align = 'left',
  color = 'default',
  className = '',
  children,
  ...props
}) => {
  const classNames = [
    'qasah-text',
    `qasah-text--size-${size}`,
    `qasah-text--weight-${weight}`,
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
