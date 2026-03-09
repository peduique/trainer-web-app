import { ExerciseDetail } from '@/features/exercises/components/exercise-detail';

interface Props {
  params: Promise<{ programId: string; dayId: string; exerciseId: string }>;
}

export default async function ExerciseDetailPage({ params }: Props) {
  const { programId, dayId, exerciseId } = await params;
  return (
    <ExerciseDetail
      programUuid={programId}
      dayId={Number(dayId)}
      exerciseId={Number(exerciseId)}
    />
  );
}
