import React, { forwardRef } from 'react';
import './Checkbox.css';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** The label text to display next to the checkbox */
  label?: React.ReactNode;
  /** Additional helper text displayed below the label */
  helperText?: React.ReactNode;
  /** Error message displayed instead of helper text when in error state */
  errorMessage?: React.ReactNode;
  /** Whether the checkbox is in an error state */
  error?: boolean;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      helperText,
      errorMessage,
      error = false,
      className = '',
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || React.useId();
    const helperId = `${inputId}-helper`;
    const errorId = `${inputId}-error`;

    const containerClasses = [
      'qasah-checkbox-container',
      disabled ? 'qasah-checkbox-container--disabled' : '',
      error ? 'qasah-checkbox-container--error' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className={containerClasses}>
        <div className="qasah-checkbox-wrapper">
          <input
            type="checkbox"
            id={inputId}
            ref={ref}
            className="qasah-checkbox-input"
            disabled={disabled}
            aria-invalid={error}
            aria-describedby={[
              helperText && !error ? helperId : '',
              error && errorMessage ? errorId : ''
            ].filter(Boolean).join(' ') || undefined}
            {...props}
          />
          <div className="qasah-checkbox-custom">
            <svg viewBox="0 0 12 10" fill="none" className="qasah-checkbox-icon" aria-hidden="true">
              <path
                d="M1 5L4.5 8.5L11 1"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {(label || helperText || errorMessage) && (
          <div className="qasah-checkbox-text">
            {label && (
              <label htmlFor={inputId} className="qasah-checkbox-label">
                {label}
              </label>
            )}
            
            {error && errorMessage ? (
              <div id={errorId} className="qasah-checkbox-message qasah-checkbox-message--error" role="alert">
                {errorMessage}
              </div>
            ) : helperText ? (
              <div id={helperId} className="qasah-checkbox-message qasah-checkbox-message--helper">
                {helperText}
              </div>
            ) : null}
          </div>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
