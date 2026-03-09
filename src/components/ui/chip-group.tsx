'use client';

import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';

export interface ChipOption {
  value: string;
  label: string;
}

interface ChipGroupProps {
  options: ChipOption[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  error?: string;
  name?: string;
  id?: string;
  className?: string;
}

export function ChipGroup({
  options,
  value,
  onChange,
  label,
  error,
  name,
  id,
  className,
}: ChipGroupProps) {
  const fieldId = id ?? name ?? label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {label && (
        <Label htmlFor={fieldId} className="text-foreground">
          {label}
        </Label>
      )}
      <div
        role="group"
        aria-label={label}
        aria-invalid={!!error}
        className="flex flex-wrap gap-2"
      >
        {options.map((opt) => {
          const selected = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              id={fieldId && opt.value === value ? fieldId : undefined}
              aria-pressed={selected}
              onClick={() => onChange(opt.value)}
              className={cn(
                'rounded-full border px-3 py-1.5 text-sm font-medium transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                selected
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-muted/50 text-foreground hover:bg-muted hover:border-border'
              )}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
      {error && (
        <p id={`${fieldId}-error`} role="alert" className="text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

interface ChipGroupMultiProps {
  options: ChipOption[];
  value: string[];
  onChange: (value: string[]) => void;
  label?: string;
  error?: string;
  name?: string;
  id?: string;
  className?: string;
  /** When provided, selecting this value replaces the selection; selecting others removes it */
  exclusiveValue?: string;
}

export function ChipGroupMulti({
  options,
  value,
  onChange,
  label,
  error,
  name,
  id,
  className,
  exclusiveValue,
}: ChipGroupMultiProps) {
  const fieldId = id ?? name ?? label?.toLowerCase().replace(/\s+/g, '-');
  const selectedSet = new Set(value ?? []);

  const handleClick = (optValue: string) => {
    if (exclusiveValue) {
      if (optValue === exclusiveValue) {
        onChange([exclusiveValue]);
        return;
      }
      const filtered = (value ?? []).filter((i) => i !== exclusiveValue);
      const next = filtered.includes(optValue)
        ? filtered.filter((i) => i !== optValue)
        : [...filtered, optValue];
      onChange(next.length ? next : [exclusiveValue]);
      return;
    }
    const next = selectedSet.has(optValue)
      ? (value ?? []).filter((i) => i !== optValue)
      : [...(value ?? []), optValue];
    onChange(next);
  };

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {label && (
        <Label htmlFor={fieldId} className="text-foreground">
          {label}
        </Label>
      )}
      <div
        role="group"
        aria-label={label}
        aria-invalid={!!error}
        className="flex flex-wrap gap-2"
      >
        {options.map((opt) => {
          const selected = selectedSet.has(opt.value);
          return (
            <button
              key={opt.value}
              type="button"
              aria-pressed={selected}
              onClick={() => handleClick(opt.value)}
              className={cn(
                'rounded-full border px-3 py-1.5 text-sm font-medium transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                selected
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-muted/50 text-foreground hover:bg-muted hover:border-border'
              )}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
      {error && (
        <p id={`${fieldId}-error`} role="alert" className="text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
