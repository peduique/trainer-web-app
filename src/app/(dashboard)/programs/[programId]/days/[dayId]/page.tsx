import { DayDetail } from '@/features/program-days/components/day-detail';

interface Props {
  params: Promise<{ programId: string; dayId: string }>;
}

export default async function DayDetailPage({ params }: Props) {
  const { programId, dayId } = await params;
  return <DayDetail programUuid={programId} dayId={Number(dayId)} />;
}
