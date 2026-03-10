import { Controller, type Control, type FieldPath } from 'react-hook-form';
import { ChipGroup, ChipGroupMulti } from '@/components/ui/chip-group';
import type { CreateProgramAiInput } from '@/models/programs/programs.schema';

interface ChipGroupFieldProps<T extends FieldPath<CreateProgramAiInput>> {
  name: T;
  control: Control<CreateProgramAiInput>;
  label: string;
  options: Array<{ value: string; label: string }>;
  error?: string;
  isMulti?: boolean;
  exclusiveValue?: string;
}

export function ChipGroupField<T extends FieldPath<CreateProgramAiInput>>({
  name,
  control,
  label,
  options,
  error,
  isMulti = false,
  exclusiveValue,
}: ChipGroupFieldProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) =>
        isMulti ? (
          <ChipGroupMulti
            label={label}
            options={options}
            value={field.value as string[]}
            onChange={field.onChange}
            exclusiveValue={exclusiveValue}
            error={error}
          />
        ) : (
          <ChipGroup
            label={label}
            options={options}
            value={field.value as string}
            onChange={field.onChange}
            error={error}
          />
        )
      }
    />
  );
}
