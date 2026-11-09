'use client';

import React from 'react';
import clsx from 'clsx';

export interface BaseFieldProps {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  onCream?: boolean;
  className?: string;
}

const inputSurfaceClasses = (onCream?: boolean, hasError?: boolean) =>
  clsx(
    'w-full min-h-11 px-3.5 py-2.5 text-base rounded-xs border transition-colors',
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-gold',
    onCream
      ? 'bg-white text-charcoal border-charcoal/30 placeholder:text-charcoal/50'
      : 'bg-bg text-text border-gold/30 placeholder:text-muted/60',
    hasError && 'border-crimson'
  );

export function FieldWrapper({
  id,
  label,
  error,
  hint,
  required,
  onCream,
  className,
  children,
}: BaseFieldProps & { children: React.ReactNode }) {
  return (
    <div className={clsx('flex flex-col gap-1.5', className)}>
      <label
        htmlFor={id}
        className={clsx(
          'text-sm font-medium tracking-wide',
          onCream ? 'text-charcoal' : 'text-muted'
        )}
      >
        {label}
        {required && <span className="ml-1 text-gold">*</span>}
      </label>
      {children}
      {hint && !error && (
        <p className={clsx('text-xs', onCream ? 'text-charcoal/70' : 'text-muted/80')}>{hint}</p>
      )}
      {error && (
        <p role="alert" className="text-xs text-crimson font-medium">
          {error}
        </p>
      )}
    </div>
  );
}

export type InputFieldProps = BaseFieldProps &
  Omit<React.InputHTMLAttributes<HTMLInputElement>, 'id'>;

export function TextInput({
  id,
  label,
  error,
  hint,
  required,
  onCream,
  className,
  ...props
}: InputFieldProps) {
  return (
    <FieldWrapper
      id={id}
      label={label}
      error={error}
      hint={hint}
      required={required}
      onCream={onCream}
      className={className}
    >
      <input
        id={id}
        type="text"
        required={required}
        aria-invalid={Boolean(error)}
        className={inputSurfaceClasses(onCream, Boolean(error))}
        {...props}
      />
    </FieldWrapper>
  );
}

export function PhoneInput({
  id,
  label,
  error,
  hint,
  required,
  onCream,
  className,
  ...props
}: InputFieldProps) {
  return (
    <FieldWrapper
      id={id}
      label={label}
      error={error}
      hint={hint}
      required={required}
      onCream={onCream}
      className={className}
    >
      <input
        id={id}
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        required={required}
        aria-invalid={Boolean(error)}
        className={inputSurfaceClasses(onCream, Boolean(error))}
        {...props}
      />
    </FieldWrapper>
  );
}

export function EmailInput({
  id,
  label,
  error,
  hint,
  required,
  onCream,
  className,
  ...props
}: InputFieldProps) {
  return (
    <FieldWrapper
      id={id}
      label={label}
      error={error}
      hint={hint}
      required={required}
      onCream={onCream}
      className={className}
    >
      <input
        id={id}
        type="email"
        inputMode="email"
        autoComplete="email"
        required={required}
        aria-invalid={Boolean(error)}
        className={inputSurfaceClasses(onCream, Boolean(error))}
        {...props}
      />
    </FieldWrapper>
  );
}

export function DateInput({
  id,
  label,
  error,
  hint,
  required,
  onCream,
  className,
  ...props
}: InputFieldProps) {
  return (
    <FieldWrapper
      id={id}
      label={label}
      error={error}
      hint={hint}
      required={required}
      onCream={onCream}
      className={className}
    >
      <input
        id={id}
        type="date"
        required={required}
        aria-invalid={Boolean(error)}
        className={inputSurfaceClasses(onCream, Boolean(error))}
        {...props}
      />
    </FieldWrapper>
  );
}

export function TimeInput({
  id,
  label,
  error,
  hint,
  required,
  onCream,
  className,
  ...props
}: InputFieldProps) {
  return (
    <FieldWrapper
      id={id}
      label={label}
      error={error}
      hint={hint}
      required={required}
      onCream={onCream}
      className={className}
    >
      <input
        id={id}
        type="time"
        required={required}
        aria-invalid={Boolean(error)}
        className={inputSurfaceClasses(onCream, Boolean(error))}
        {...props}
      />
    </FieldWrapper>
  );
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectInputProps
  extends BaseFieldProps,
    Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'id'> {
  options: SelectOption[];
}

export function SelectInput({
  id,
  label,
  error,
  hint,
  required,
  onCream,
  options,
  className,
  ...props
}: SelectInputProps) {
  return (
    <FieldWrapper
      id={id}
      label={label}
      error={error}
      hint={hint}
      required={required}
      onCream={onCream}
      className={className}
    >
      <select
        id={id}
        required={required}
        aria-invalid={Boolean(error)}
        className={inputSurfaceClasses(onCream, Boolean(error))}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-bg text-text">
            {opt.label}
          </option>
        ))}
      </select>
    </FieldWrapper>
  );
}

export type TextareaFieldProps = BaseFieldProps &
  Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'id'>;

export function TextareaInput({
  id,
  label,
  error,
  hint,
  required,
  onCream,
  className,
  rows = 4,
  ...props
}: TextareaFieldProps) {
  return (
    <FieldWrapper
      id={id}
      label={label}
      error={error}
      hint={hint}
      required={required}
      onCream={onCream}
      className={className}
    >
      <textarea
        id={id}
        rows={rows}
        required={required}
        aria-invalid={Boolean(error)}
        className={inputSurfaceClasses(onCream, Boolean(error))}
        {...props}
      />
    </FieldWrapper>
  );
}

export interface QuantityStepperProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (nextValue: number) => void;
  label?: string;
  onCream?: boolean;
}

export function QuantityStepper({
  value,
  min = 1,
  max = 20,
  onChange,
  label,
  onCream = false,
}: QuantityStepperProps) {
  return (
    <div className="inline-flex items-center gap-2">
      {label && (
        <span className={clsx('text-sm mr-2', onCream ? 'text-charcoal' : 'text-muted')}>
          {label}
        </span>
      )}
      <div
        className={clsx(
          'inline-flex items-center border rounded-xs',
          onCream ? 'border-charcoal/35 bg-white text-charcoal' : 'border-gold/40 bg-bg text-text'
        )}
      >
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          aria-label="Decrease quantity"
          className="min-h-11 min-w-11 inline-flex items-center justify-center text-lg font-medium disabled:opacity-35 hover:text-gold transition-colors"
        >
          −
        </button>
        <span
          aria-live="polite"
          className="min-w-10 text-center font-medium text-base select-none px-2"
        >
          {value}
        </span>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          aria-label="Increase quantity"
          className="min-h-11 min-w-11 inline-flex items-center justify-center text-lg font-medium disabled:opacity-35 hover:text-gold transition-colors"
        >
          +
        </button>
      </div>
    </div>
  );
}

