'use client';

interface RadioOption {
  value: string;
  label: string;
}

interface RadioGroupProps {
  name: string;
  label?: string;
  options: RadioOption[];
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  className?: string;
}

export function RadioGroup({ name, label, options, value, onChange, error, className = '' }: RadioGroupProps) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && <span className="text-sm font-medium text-gray-700">{label}</span>}
      <div className="flex flex-col gap-2">
        {options.map((opt) => (
          <label key={opt.value} className="flex cursor-pointer items-center gap-2">
            <input
              type="radio"
              name={name}
              value={opt.value}
              checked={value === opt.value}
              onChange={() => onChange?.(opt.value)}
              className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">{opt.label}</span>
          </label>
        ))}
      </div>
      {error && (
        <p role="alert" className="text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
