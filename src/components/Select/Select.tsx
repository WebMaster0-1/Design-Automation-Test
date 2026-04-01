import React, { forwardRef } from 'react';
import './Select.css';

export type SelectVariant = 'default' | 'error';
export type SelectSize = 'sm' | 'lg';

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  /** The visual variant of the select */
  variant?: SelectVariant;
  /** The size of the select, matching Button sizes */
  size?: SelectSize;
  /** Array of options to display */
  options: SelectOption[];
  /** Optional placeholder text (renders as a disabled first option) */
  placeholder?: string;
  /** Error message to display below the select when variant is 'error' */
  errorMessage?: string;
  /** Additional helper text to display below the select */
  helperText?: string;
  /** Full width modifier */
  fullWidth?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      variant = 'default',
      size = 'sm',
      options,
      placeholder,
      errorMessage,
      helperText,
      fullWidth = false,
      className = '',
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    const containerClasses = [
      'qasah-select-container',
      fullWidth ? 'qasah-select-container--full-width' : '',
      disabled ? 'qasah-select-container--disabled' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const wrapperClasses = [
      'qasah-select-wrapper',
      `qasah-select-wrapper--${size}`,
      `qasah-select-wrapper--${variant}`,
      disabled ? 'qasah-select-wrapper--disabled' : '',
    ]
      .filter(Boolean)
      .join(' ');

    const selectId = id || React.useId();
    const helperId = `${selectId}-helper`;
    const errorId = `${selectId}-error`;

    return (
      <div className={containerClasses}>
        <div className={wrapperClasses}>
          <select
            ref={ref}
            id={selectId}
            className={`qasah-select ${!props.value && !props.defaultValue ? 'qasah-select--placeholder' : ''}`}
            disabled={disabled}
            aria-invalid={variant === 'error'}
            aria-describedby={[
              helperText ? helperId : '',
              variant === 'error' && errorMessage ? errorId : ''
            ].filter(Boolean).join(' ') || undefined}
            {...props}
          >
            {placeholder && (
              <option value="" disabled hidden selected={!props.value && !props.defaultValue}>
                {placeholder}
              </option>
            )}
            {options.map((option, index) => (
              <option
                key={`${option.value}-${index}`}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>
          
          <div className="qasah-select-chevron" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
        </div>

        {/* Helper or Error Text */}
        {variant === 'error' && errorMessage ? (
          <div id={errorId} className="qasah-select__message qasah-select__message--error" role="alert">
            {errorMessage}
          </div>
        ) : helperText ? (
          <div id={helperId} className="qasah-select__message qasah-select__message--helper">
            {helperText}
          </div>
        ) : null}
      </div>
    );
  }
);

Select.displayName = 'Select';
