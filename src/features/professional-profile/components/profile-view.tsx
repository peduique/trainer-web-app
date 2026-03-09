'use client';
import { useProfessionalProfile } from '@/features/professional-profile/hooks/use-professional-profile';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';

interface Props {
  uuid: string;
}

export function ProfessionalProfileView({ uuid }: Props) {
  const { professional, isLoading, error } = useProfessionalProfile(uuid);

  if (isLoading) return <div className="flex justify-center py-16"><Spinner size="lg" /></div>;
  if (error || !professional) return <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">Profile not found.</div>;

  return (
    <div className="w-full">
      <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
        <div className="flex items-start gap-6">
          <Avatar src={professional.avatar_url} name={professional.name} size="lg" />
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">{professional.name}</h1>
            {professional.credentials && (
              <p className="mt-1 text-sm text-gray-500">{professional.credentials}</p>
            )}
            {professional.specialties && professional.specialties.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {professional.specialties.map((s, i) => (
                  <Badge key={i} variant="info">{s}</Badge>
                ))}
              </div>
            )}
          </div>
        </div>
        {professional.bio && (
          <div className="mt-6 border-t pt-6">
            <h2 className="mb-2 font-semibold text-gray-900">About</h2>
            <p className="text-sm leading-relaxed text-gray-600">{professional.bio}</p>
          </div>
        )}
      </div>
    </div>
  );
}
