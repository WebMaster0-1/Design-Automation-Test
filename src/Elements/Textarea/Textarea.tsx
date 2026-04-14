import React, { forwardRef } from 'react';
import './Textarea.css';

export type TextareaVariant = 'default' | 'error';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** The visual variant of the textarea */
  variant?: TextareaVariant;
  /** Error message to display below the textarea when variant is 'error' */
  errorMessage?: string;
  /** Additional helper text to display below the textarea */
  helperText?: string;
  /** Full width modifier */
  fullWidth?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      variant = 'default',
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
    // Container handles full-width and general text alignment
    const containerClasses = [
      'qasah-textarea-container',
      fullWidth ? 'qasah-textarea-container--full-width' : '',
      disabled ? 'qasah-textarea-container--disabled' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    // Wrapper handles the border, hover, and focus states
    const wrapperClasses = [
      'qasah-textarea-wrapper',
      `qasah-textarea-wrapper--${variant}`,
      disabled ? 'qasah-textarea-wrapper--disabled' : '',
    ]
      .filter(Boolean)
      .join(' ');

    const textareaId = id || React.useId();
    const helperId = `${textareaId}-helper`;
    const errorId = `${textareaId}-error`;

    return (
      <div className={containerClasses}>
        <div className={wrapperClasses}>
          <textarea
            ref={ref}
            id={textareaId}
            className="qasah-textarea"
            disabled={disabled}
            aria-invalid={variant === 'error'}
            aria-describedby={[
              helperText ? helperId : '',
              variant === 'error' && errorMessage ? errorId : ''
            ].filter(Boolean).join(' ') || undefined}
            {...props}
          />
        </div>

        {/* Helper or Error Text */}
        {variant === 'error' && errorMessage ? (
          <div id={errorId} className="qasah-textarea__message qasah-textarea__message--error" role="alert">
            {errorMessage}
          </div>
        ) : helperText ? (
          <div id={helperId} className="qasah-textarea__message qasah-textarea__message--helper">
            {helperText}
          </div>
        ) : null}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
