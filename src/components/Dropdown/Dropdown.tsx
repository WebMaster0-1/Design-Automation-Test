import React, { useState, useRef, useEffect } from 'react';
import './Dropdown.css';

export interface DropdownItem {
  id: string | number;
  label: React.ReactNode;
  icon?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  destructive?: boolean;
}

export interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  align?: 'left' | 'right';
  className?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  items,
  align = 'left',
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = () => setIsOpen((prev) => !prev);
  const handleItemClick = (item: DropdownItem) => {
    if (item.disabled) return;
    item.onClick?.();
    setIsOpen(false);
  };

  return (
    <div className={`qasah-dropdown ${className}`} ref={dropdownRef}>
      <div className="qasah-dropdown__trigger" onClick={handleToggle}>
        {trigger}
      </div>
      {isOpen && (
        <div className={`qasah-dropdown__menu qasah-dropdown__menu--align-${align}`}>
          <ul className="qasah-dropdown__list">
            {items.map((item) => (
              <li
                key={item.id}
                className={`qasah-dropdown__item ${item.disabled ? 'is-disabled' : ''} ${item.destructive ? 'is-destructive' : ''}`}
                onClick={() => handleItemClick(item)}
              >
                {item.icon && <span className="qasah-dropdown__item-icon">{item.icon}</span>}
                <span className="qasah-dropdown__item-label">{item.label}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
