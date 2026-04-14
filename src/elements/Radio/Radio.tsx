import React, { forwardRef } from 'react';
import './Radio.css';

export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** The value of the radio button. Submitted with its owning form. */
  value: string;
  /** The label text to display next to the radio button */
  label?: React.ReactNode;
  /** Additional helper text displayed below the label */
  helperText?: React.ReactNode;
  /** Error message displayed instead of helper text when in error state */
  errorMessage?: React.ReactNode;
  /** Whether the radio button is in an error state */
  error?: boolean;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  (
    {
      value,
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
    const generatedId = React.useId();
    const inputId = id ?? generatedId;
    const helperId = `${inputId}-helper`;
    const errorId = `${inputId}-error`;

    const containerClasses = [
      'qasah-radio-container',
      disabled ? 'qasah-radio-container--disabled' : '',
      error ? 'qasah-radio-container--error' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className={containerClasses}>
        <div className="qasah-radio-wrapper">
          <input
            type="radio"
            id={inputId}
            ref={ref}
            value={value}
            className="qasah-radio-input"
            disabled={disabled}
            aria-invalid={error}
            aria-describedby={[
              helperText && !error ? helperId : '',
              error && errorMessage ? errorId : ''
            ].filter(Boolean).join(' ') || undefined}
            {...props}
          />
          <div className="qasah-radio-custom">
            <div className="qasah-radio-icon" aria-hidden="true" />
          </div>
        </div>

        {(label || helperText || errorMessage) && (
          <div className="qasah-radio-text">
            {label && (
              <label htmlFor={inputId} className="qasah-radio-label">
                {label}
              </label>
            )}
            
            {error && errorMessage ? (
              <div id={errorId} className="qasah-radio-message qasah-radio-message--error" role="alert">
                {errorMessage}
              </div>
            ) : helperText ? (
              <div id={helperId} className="qasah-radio-message qasah-radio-message--helper">
                {helperText}
              </div>
            ) : null}
          </div>
        )}
      </div>
    );
  }
);

Radio.displayName = 'Radio';
