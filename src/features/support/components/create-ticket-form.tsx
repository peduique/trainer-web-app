'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateTicket } from '@/features/support/hooks/use-tickets';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { FileUpload } from '@/components/ui/file-upload';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.enum(['bug', 'feature_request', 'question']),
});

type FormData = z.infer<typeof formSchema>;

export function CreateTicketForm() {
  const router = useRouter();
  const { mutate, isPending, error } = useCreateTicket();
  const [screenshot, setScreenshot] = useState<File | undefined>(undefined);
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { category: 'bug' },
  });

  const onSubmit = (data: FormData) => {
    mutate({ ...data, screenshot }, { onSuccess: () => router.push('/support') });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Input label="Title" placeholder="Brief summary of the issue" error={errors.title?.message} {...register('title')} />
      <Textarea label="Description" placeholder="Describe in detail..." error={errors.description?.message} {...register('description')} />
      <Select
        label="Category"
        options={[
          { value: 'bug', label: 'Bug Report' },
          { value: 'feature_request', label: 'Feature Request' },
          { value: 'question', label: 'Question' },
        ]}
        error={errors.category?.message}
        {...register('category')}
      />
      <FileUpload
        label="Screenshot (optional)"
        onFile={setScreenshot}
        accept="image/*"
      />
      {error && <p role="alert" className="text-sm text-red-600">{error.message}</p>}
      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? 'Submitting...' : 'Submit Ticket'}
      </Button>
    </form>
  );
}
