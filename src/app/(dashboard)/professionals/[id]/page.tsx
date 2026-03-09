import { ProfessionalProfileView } from '@/features/professional-profile/components/profile-view';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProfessionalProfilePage({ params }: Props) {
  const { id } = await params;
  return <ProfessionalProfileView uuid={id} />;
}
