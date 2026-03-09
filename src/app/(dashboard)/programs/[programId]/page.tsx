import { ProgramDetail } from '@/features/programs/components/program-detail';

interface Props {
  params: Promise<{ programId: string }>;
}

export default async function ProgramDetailPage({ params }: Props) {
  const { programId } = await params;
  return <ProgramDetail uuid={programId} />;
}
