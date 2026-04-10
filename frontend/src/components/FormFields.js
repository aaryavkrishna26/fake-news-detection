import React from 'react';
import '../styles/FormFields.css';

/**
 * FormField Component
 * Reusable form field with label, input, and error message
 */
export const FormField = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  onBlur,
  error,
  placeholder,
  required = false,
  disabled = false,
  helperText,
  icon,
  ...rest
}) => {
  return (
    <div className="form-field">
      {label && (
        <label htmlFor={name} className="form-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      
      <div className="form-input-wrapper">
        {icon && <span className="form-input-icon">{icon}</span>}
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          className={`form-input ${error ? 'error' : ''} ${icon ? 'with-icon' : ''}`}
          {...rest}
        />
      </div>

      {error && <p className="form-error">{error}</p>}
      {helperText && <p className="form-helper">{helperText}</p>}
    </div>
  );
};

/**
 * TextAreaField Component
 * For multi-line text input
 */
export const TextAreaField = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  error,
  placeholder,
  required = false,
  disabled = false,
  rows = 4,
  helperText,
  ...rest
}) => {
  return (
    <div className="form-field">
      {label && (
        <label htmlFor={name} className="form-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}

      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        className={`form-textarea ${error ? 'error' : ''}`}
        {...rest}
      />

      {error && <p className="form-error">{error}</p>}
      {helperText && <p className="form-helper">{helperText}</p>}
    </div>
  );
};

/**
 * SelectField Component
 * Dropdown select field
 */
export const SelectField = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  error,
  required = false,
  disabled = false,
  options = [],
  placeholder,
  helperText,
  ...rest
}) => {
  return (
    <div className="form-field">
      {label && (
        <label htmlFor={name} className="form-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}

      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        className={`form-select ${error ? 'error' : ''}`}
        {...rest}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {error && <p className="form-error">{error}</p>}
      {helperText && <p className="form-helper">{helperText}</p>}
    </div>
  );
};

/**
 * RadioGroup Component
 */
export const RadioGroup = ({
  label,
  name,
  value,
  onChange,
  options = [],
  required = false,
  error,
  helperText,
  direction = 'vertical',
  ...rest
}) => {
  return (
    <div className="form-field">
      {label && (
        <label className="form-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}

      <div className={`radio-group radio-${direction}`}>
        {options.map((opt) => (
          <div key={opt.value} className="radio-option">
            <input
              type="radio"
              id={`${name}-${opt.value}`}
              name={name}
              value={opt.value}
              checked={value === opt.value}
              onChange={onChange}
              className="radio-input"
              {...rest}
            />
            <label htmlFor={`${name}-${opt.value}`} className="radio-label">
              {opt.label}
            </label>
          </div>
        ))}
      </div>

      {error && <p className="form-error">{error}</p>}
      {helperText && <p className="form-helper">{helperText}</p>}
    </div>
  );
};

/**
 * CheckboxField Component
 */
export const CheckboxField = ({
  name,
  label,
  checked,
  onChange,
  error,
  required = false,
  disabled = false,
  helperText,
  ...rest
}) => {
  return (
    <div className="form-field checkbox-field">
      <div className="checkbox-wrapper">
        <input
          type="checkbox"
          id={name}
          name={name}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="checkbox-input"
          {...rest}
        />
        <label htmlFor={name} className="checkbox-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      </div>

      {error && <p className="form-error">{error}</p>}
      {helperText && <p className="form-helper">{helperText}</p>}
    </div>
  );
};

/**
 * FormGroup Component
 * Container for grouping form fields
 */
export const FormGroup = ({ children, columns = 1, gap = 16 }) => {
  return (
    <div
      className="form-group-container"
      style={{
        '--columns': columns,
        '--gap': `${gap}px`,
      }}
    >
      {children}
    </div>
  );
};

/**
 * FormActions Component
 * Button container for form submission
 */
export const FormActions = ({ children, align = 'right' }) => {
  return <div className={`form-actions align-${align}`}>{children}</div>;
};

/**
 * ValidationMessage Component
 * For displaying validation errors and tips
 */
export const ValidationMessage = ({ type = 'error', message }) => {
  const iconMap = {
    error: '❌',
    warning: '⚠️',
    success: '✅',
    info: 'ℹ️',
  };

  return (
    <div className={`validation-message message-${type}`}>
      <span className="message-icon">{iconMap[type]}</span>
      <span className="message-text">{message}</span>
    </div>
  );
};
