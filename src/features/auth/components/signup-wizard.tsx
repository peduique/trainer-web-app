'use client';
import { useState } from 'react';
import { useSignup } from '@/features/auth/hooks/use-signup';
import { SignupStepWelcome } from './signup-step-welcome';
import { SignupStepAbout } from './signup-step-about';
import { SignupStepPhoto } from './signup-step-photo';
import { SignupStepCredentials } from './signup-step-credentials';

export interface SignupWizardData {
  name: string;
  gender: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  avatar?: File;
  email: string;
  password: string;
}

const STEPS = ['welcome', 'about', 'photo', 'credentials'] as const;
type Step = (typeof STEPS)[number];

export function SignupWizard() {
  const [step, setStep] = useState<Step>('welcome');
  const [data, setData] = useState<Partial<SignupWizardData>>({});
  const { mutate, isPending, error } = useSignup();

  const stepIndex = STEPS.indexOf(step);
  const progress = ((stepIndex + 1) / STEPS.length) * 100;

  const next = (update?: Partial<SignupWizardData>) => {
    if (update) setData((prev) => ({ ...prev, ...update }));
    const nextStep = STEPS[stepIndex + 1];
    if (nextStep) setStep(nextStep);
  };

  const back = () => {
    const prevStep = STEPS[stepIndex - 1];
    if (prevStep) setStep(prevStep);
  };

  const submit = (credentials: { email: string; password: string }) => {
    const final = { ...data, ...credentials } as SignupWizardData;
    mutate({
      name: final.name,
      gender: final.gender,
      email: final.email,
      password: final.password,
      metric_system: 'metric',
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Progress bar */}
      <div className="h-1.5 w-full rounded-full bg-gray-200">
        <div
          className="h-1.5 rounded-full bg-blue-600 transition-all"
          style={{ width: `${progress}%` }}
          role="progressbar"
          aria-valuenow={stepIndex + 1}
          aria-valuemin={1}
          aria-valuemax={STEPS.length}
        />
      </div>

      {step === 'welcome' && <SignupStepWelcome onNext={() => next()} />}
      {step === 'about' && (
        <SignupStepAbout
          defaultValues={{ name: data.name ?? '', gender: data.gender ?? 'prefer_not_to_say' }}
          onNext={(v) => next(v)}
          onBack={back}
        />
      )}
      {step === 'photo' && (
        <SignupStepPhoto
          onNext={(file) => next({ avatar: file ?? undefined })}
          onBack={back}
        />
      )}
      {step === 'credentials' && (
        <SignupStepCredentials
          onSubmit={submit}
          onBack={back}
          isPending={isPending}
          error={error?.message}
        />
      )}
    </div>
  );
}
