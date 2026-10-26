import React, { useState, useRef, useEffect, useId } from 'react';
import './Dropdown.css';

export type DropdownType = 'default' | 'icon leading' | 'avatar leading' | 'status';
export type DropdownState = 'default' | 'hover' | 'active' | 'filled' | 'disabled';

export interface DropdownItem {
  id?: string | number;
  value?: string | number;
  label: React.ReactNode;
  sublabel?: React.ReactNode;
  icon?: React.ReactNode;
  avatarUrl?: string;
  statusColor?: string;
  onClick?: () => void;
  disabled?: boolean;
  destructive?: boolean;
}

export type DropdownOption = DropdownItem;

export interface DropdownProps {
  /** Variant type matching Figma: 'default', 'icon leading', 'avatar leading', 'status' */
  type?: DropdownType;
  /** Visual state matching Figma: 'default', 'hover', 'active', 'filled', 'disabled' */
  state?: DropdownState;
  /** Whether the dropdown menu is open (maps to Figma 'extended' boolean) */
  extended?: boolean;
  /** Field label rendered above selector */
  label?: string;
  /** Show/hide label — maps to Figma 'has label' */
  hasLabel?: boolean;
  /** Helper text rendered below selector */
  helperText?: string;
  /** Show/hide helper text — maps to Figma 'has helper texts' */
  hasHelperText?: boolean;
  /** Placeholder text shown when no value is selected */
  placeholder?: string;
  /** Controlled selected value */
  value?: string | number;
  /** Default selected value (uncontrolled) */
  defaultValue?: string | number;
  /** Callback fired when an option is selected */
  onChange?: (value: string | number, item?: DropdownItem) => void;
  /** List of dropdown options */
  options?: DropdownItem[];
  /** Alias for options (backward compatibility) */
  items?: DropdownItem[];
  /** Custom trigger element (for backward compatibility action menus) */
  trigger?: React.ReactNode;
  /** Leading icon override for 'icon leading' type */
  leadingIcon?: React.ReactNode;
  /** Avatar image URL for 'avatar leading' type */
  avatarUrl?: string;
  /** Status color override for 'status' type (default: #04802E) */
  statusColor?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Alignment of popup menu ('left' | 'right') */
  align?: 'left' | 'right';
  /** Controlled open state */
  isOpen?: boolean;
  /** Default open state */
  defaultIsOpen?: boolean;
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Additional CSS class */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
  /** Input name for forms */
  name?: string;
  /** Unique id for label pairing */
  id?: string;
}

// ─── Default Figma-matching SVGs ─────────────────────────────────────────────

const ChevronDownIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="fmdqui-dropdown__chevron"
  >
    <path
      d="M5 7.5L10 12.5L15 7.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const HeartIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="fmdqui-dropdown__leading-icon"
  >
    <path
      d="M10 16.5C10 16.5 2.5 12.5 2.5 7.5C2.5 4.5 4.5 2.5 7.5 2.5C9.24 2.5 10 3.5 10 3.5C10 3.5 10.76 2.5 12.5 2.5C15.5 2.5 17.5 4.5 17.5 7.5C17.5 12.5 10 16.5 10 16.5Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const DefaultAvatar = ({ url, initials = 'U' }: { url?: string; initials?: string }) => {
  if (url) {
    return (
      <span className="fmdqui-dropdown__avatar">
        <img src={url} alt="Avatar" className="fmdqui-dropdown__avatar-img" />
      </span>
    );
  }
  return (
    <span className="fmdqui-dropdown__avatar fmdqui-dropdown__avatar--placeholder">
      {initials}
    </span>
  );
};

const StatusIndicator = ({ color = '#04802E' }: { color?: string }) => (
  <span className="fmdqui-dropdown__status-dot" style={{ backgroundColor: color }} />
);

// ─── Component Implementation ────────────────────────────────────────────────

export const Dropdown: React.FC<DropdownProps> = ({
  type = 'default',
  state: stateProp,
  extended,
  label = 'Label',
  hasLabel = true,
  helperText = 'Helper text',
  hasHelperText = false,
  placeholder = 'Placeholder',
  value: controlledValue,
  defaultValue,
  onChange,
  options,
  items,
  trigger,
  leadingIcon,
  avatarUrl = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&h=80&q=80',
  statusColor = '#04802E',
  disabled = false,
  align = 'left',
  isOpen: controlledIsOpen,
  defaultIsOpen = false,
  onOpenChange,
  className = '',
  style,
  name,
  id,
}) => {
  const generatedId = useId();
  const fieldId = id || generatedId;
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Normalize options/items
  const resolvedOptions: DropdownItem[] = options || items || [];

  // Internal selection state
  const isControlledValue = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState<string | number | undefined>(defaultValue);
  const selectedValue = isControlledValue ? controlledValue : internalValue;

  // Internal open state
  const isControlledOpen = controlledIsOpen !== undefined || extended !== undefined;
  const effectiveControlledOpen = controlledIsOpen !== undefined ? controlledIsOpen : extended;
  const [internalIsOpen, setInternalIsOpen] = useState(defaultIsOpen);
  const isOpen = isControlledOpen ? Boolean(effectiveControlledOpen) : internalIsOpen;

  // Resolve active option object if any
  const selectedOption = resolvedOptions.find(
    (opt) => (opt.value ?? opt.id) === selectedValue
  );

  // Derive visual state
  const isDisabled = disabled || stateProp === 'disabled';
  const isFilled = stateProp === 'filled' || (Boolean(selectedValue) && stateProp !== 'default');
  const isHover = stateProp === 'hover';
  const isActive = stateProp === 'active' || isOpen;

  const derivedState: DropdownState = isDisabled
    ? 'disabled'
    : isActive
    ? 'active'
    : isHover
    ? 'hover'
    : isFilled
    ? 'filled'
    : 'default';

  // Click outside listener
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        if (!isControlledOpen) {
          setInternalIsOpen(false);
        }
        onOpenChange?.(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, isControlledOpen, onOpenChange]);

  const handleToggle = () => {
    if (isDisabled) return;
    const nextOpen = !isOpen;
    if (!isControlledOpen) {
      setInternalIsOpen(nextOpen);
    }
    onOpenChange?.(nextOpen);
  };

  const handleSelectOption = (item: DropdownItem) => {
    if (item.disabled || isDisabled) return;
    const optValue = item.value ?? item.id;
    if (!isControlledValue && optValue !== undefined) {
      setInternalValue(optValue);
    }
    if (optValue !== undefined) {
      onChange?.(optValue, item);
    }
    item.onClick?.();

    if (!isControlledOpen) {
      setInternalIsOpen(false);
    }
    onOpenChange?.(false);
  };

  // ── Render Leading Content based on Figma type variant ──
  const renderLeadingVisual = (itemOption?: DropdownItem) => {
    if (type === 'icon leading') {
      return (
        <span className="fmdqui-dropdown__leading-wrapper">
          {itemOption?.icon || leadingIcon || <HeartIcon />}
        </span>
      );
    }
    if (type === 'avatar leading') {
      const url = itemOption?.avatarUrl || avatarUrl;
      return <DefaultAvatar url={url} />;
    }
    if (type === 'status') {
      const color = itemOption?.statusColor || statusColor;
      return <StatusIndicator color={color} />;
    }
    if (leadingIcon) {
      return <span className="fmdqui-dropdown__leading-wrapper">{leadingIcon}</span>;
    }
    return null;
  };

  // Backward compatibility: If custom trigger is provided without selector frame
  if (trigger) {
    return (
      <div className={`fmdqui-dropdown ${className}`} ref={dropdownRef} style={style}>
        <div
          className={`fmdqui-dropdown__trigger ${isDisabled ? 'is-disabled' : ''}`}
          onClick={handleToggle}
          role="button"
          tabIndex={isDisabled ? -1 : 0}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          {trigger}
        </div>
        {isOpen && (
          <div className={`fmdqui-dropdown__menu fmdqui-dropdown__menu--align-${align}`}>
            <ul className="fmdqui-dropdown__list" role="listbox">
              {resolvedOptions.map((item, index) => {
                const itemKey = item.id ?? item.value ?? index;
                const isItemDisabled = item.disabled;
                return (
                  <li
                    key={itemKey}
                    role="option"
                    aria-selected={item.value === selectedValue}
                    className={`fmdqui-dropdown__item ${isItemDisabled ? 'is-disabled' : ''} ${item.destructive ? 'is-destructive' : ''}`}
                    onClick={() => handleSelectOption(item)}
                  >
                    {item.icon && <span className="fmdqui-dropdown__item-icon">{item.icon}</span>}
                    <div className="fmdqui-dropdown__item-texts">
                      <span className="fmdqui-dropdown__item-label">{item.label}</span>
                      {item.sublabel && (
                        <span className="fmdqui-dropdown__item-sublabel">{item.sublabel}</span>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    );
  }

  // ── Full Figma Dropdown / Selectors Component ──
  const displayText = selectedOption?.label ?? (derivedState === 'filled' ? 'Input' : placeholder);
  const isDisplayingPlaceholder = !selectedOption && derivedState !== 'filled';

  return (
    <div
      className={`fmdqui-dropdown-field fmdqui-dropdown-field--${type.replace(' ', '-')} fmdqui-dropdown-field--state-${derivedState} ${className}`}
      ref={dropdownRef}
      style={style}
    >
      {/* Label */}
      {hasLabel && (
        <label htmlFor={fieldId} className="fmdqui-dropdown__label">
          {label}
        </label>
      )}

      {/* Selector Trigger Frame (Height: 56px, Radius: 12px) */}
      <div
        id={fieldId}
        className={`fmdqui-dropdown__selector ${isOpen ? 'is-open' : ''} ${isDisabled ? 'is-disabled' : ''}`}
        onClick={handleToggle}
        role="combobox"
        tabIndex={isDisabled ? -1 : 0}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-disabled={isDisabled}
      >
        <div className="fmdqui-dropdown__selector-left">
          {renderLeadingVisual(selectedOption)}
          <span
            className={`fmdqui-dropdown__selector-text ${
              isDisplayingPlaceholder ? 'is-placeholder' : 'is-filled'
            }`}
          >
            {displayText}
          </span>
        </div>

        <div className="fmdqui-dropdown__selector-right">
          <ChevronDownIcon />
        </div>
      </div>

      {/* Hidden input for HTML form submission */}
      {name && (
        <input
          type="hidden"
          name={name}
          value={selectedValue !== undefined ? String(selectedValue) : ''}
          disabled={isDisabled}
        />
      )}

      {/* Helper Text */}
      {hasHelperText && (
        <span className="fmdqui-dropdown__helper-text">{helperText}</span>
      )}

      {/* Menu List (.Selector menu / menu list) */}
      {isOpen && (
        <div className={`fmdqui-dropdown__menu fmdqui-dropdown__menu--align-${align}`}>
          <ul className="fmdqui-dropdown__list" role="listbox">
            {resolvedOptions.map((item, index) => {
              const itemKey = item.id ?? item.value ?? index;
              const isSelected = (item.value ?? item.id) === selectedValue;
              const isItemDisabled = item.disabled;

              return (
                <li
                  key={itemKey}
                  role="option"
                  aria-selected={isSelected}
                  className={`fmdqui-dropdown__item ${isItemDisabled ? 'is-disabled' : ''} ${
                    isSelected ? 'is-selected' : ''
                  } ${item.destructive ? 'is-destructive' : ''}`}
                  onClick={() => handleSelectOption(item)}
                >
                  {/* Leading visual matching current type */}
                  {type !== 'default' && (
                    <span className="fmdqui-dropdown__item-leading">
                      {renderLeadingVisual(item)}
                    </span>
                  )}

                  {/* Texts row: Primary label + Secondary @sublabel */}
                  <div className="fmdqui-dropdown__item-texts">
                    <span className="fmdqui-dropdown__item-label">{item.label}</span>
                    {item.sublabel && (
                      <span className="fmdqui-dropdown__item-sublabel">{item.sublabel}</span>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export const DropdownSelector = Dropdown;
