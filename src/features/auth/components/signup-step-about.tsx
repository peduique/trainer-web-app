'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { signupAboutSchema } from '@/models/auth/auth.schema';
import { Input } from '@/components/ui/input';
import { RadioGroup } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';

type AboutData = z.infer<typeof signupAboutSchema>;

const GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
  { value: 'prefer_not_to_say', label: 'Prefer not to say' },
];

interface Props {
  defaultValues: AboutData;
  onNext: (data: AboutData) => void;
  onBack: () => void;
}

export function SignupStepAbout({ defaultValues, onNext, onBack }: Props) {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<AboutData>({
    resolver: zodResolver(signupAboutSchema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onNext)} className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold">Tell us about yourself</h2>
      <Input label="Full Name" error={errors.name?.message} {...register('name')} />
      <RadioGroup
        name="gender"
        label="Gender"
        options={GENDER_OPTIONS}
        value={watch('gender')}
        onChange={(v) => setValue('gender', v as AboutData['gender'])}
        error={errors.gender?.message}
      />
      <div className="flex gap-3">
        <Button type="button" variant="outline" onClick={onBack} className="flex-1">Back</Button>
        <Button type="submit" className="flex-1">Next</Button>
      </div>
    </form>
  );
}
