import { Controller, type Control, type FieldPath } from 'react-hook-form';
import { Checkbox } from '@/components/ui/checkbox';
import type { CreateProgramAiInput } from '@/models/programs/programs.schema';

interface CheckboxFieldProps<T extends FieldPath<CreateProgramAiInput>> {
  name: T;
  control: Control<CreateProgramAiInput>;
  label: string;
  className?: string;
}

export function CheckboxField<T extends FieldPath<CreateProgramAiInput>>({
  name,
  control,
  label,
  className = 'text-sm text-foreground',
}: CheckboxFieldProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Checkbox
          label={label}
          checked={field.value as boolean}
          onChange={(checked) => field.onChange(checked)}
          className={className}
        />
      )}
    />
  );
}
