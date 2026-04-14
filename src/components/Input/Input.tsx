import React, { forwardRef } from 'react';
import './Input.css';

export type InputVariant = 'default' | 'error';
export type InputSize = 'sm' | 'lg';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** The visual variant of the input */
  variant?: InputVariant;
  /** The size of the input, matching Button sizes */
  size?: InputSize;
  /** Optional icon to display on the left side */
  leadingIcon?: React.ReactNode;
  /** Optional icon to display on the right side */
  trailingIcon?: React.ReactNode;
  /** Error message to display below the input when variant is 'error' */
  errorMessage?: string;
  /** Additional helper text to display below the input */
  helperText?: string;
  /** Full width modifier */
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      variant = 'default',
      size = 'sm',
      leadingIcon,
      trailingIcon,
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
    // Determine dynamic classes based on props
    const containerClasses = [
      'qasah-input-container',
      fullWidth ? 'qasah-input-container--full-width' : '',
      disabled ? 'qasah-input-container--disabled' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const inputWrapperClasses = [
      'qasah-input-wrapper',
      `qasah-input-wrapper--${size}`,
      `qasah-input-wrapper--${variant}`,
      leadingIcon ? 'qasah-input-wrapper--has-leading-icon' : '',
      trailingIcon ? 'qasah-input-wrapper--has-trailing-icon' : '',
      disabled ? 'qasah-input-wrapper--disabled' : '',
    ]
      .filter(Boolean)
      .join(' ');

    const inputId = id || React.useId();
    const helperId = `${inputId}-helper`;
    const errorId = `${inputId}-error`;

    return (
      <div className={containerClasses}>
        <div className={inputWrapperClasses}>
          {leadingIcon && (
            <span className="qasah-input__icon qasah-input__icon--leading">
              {leadingIcon}
            </span>
          )}
          
          <input
            ref={ref}
            id={inputId}
            className="qasah-input"
            disabled={disabled}
            aria-invalid={variant === 'error'}
            aria-describedby={[
              helperText ? helperId : '',
              variant === 'error' && errorMessage ? errorId : ''
            ].filter(Boolean).join(' ') || undefined}
            {...props}
          />
          
          {trailingIcon && (
            <span className="qasah-input__icon qasah-input__icon--trailing">
              {trailingIcon}
            </span>
          )}
        </div>

        {/* Helper or Error Text */}
        {variant === 'error' && errorMessage ? (
          <div id={errorId} className="qasah-input__message qasah-input__message--error" role="alert">
            {errorMessage}
          </div>
        ) : helperText ? (
          <div id={helperId} className="qasah-input__message qasah-input__message--helper">
            {helperText}
          </div>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
