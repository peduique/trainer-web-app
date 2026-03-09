'use client';
import { useState } from 'react';
import { useExerciseDetail } from '@/features/exercises/hooks/use-exercise-detail';
import { useScoreActions } from '@/features/exercises/hooks/use-save-score';
import { YoutubePlayer } from './youtube-player';
import { SetsTracker } from './sets-tracker';
import { ExerciseNotes } from './exercise-notes';
import { ExerciseHistory } from './exercise-history';
import { RestTimer } from './rest-timer';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/layout/page-header';
import { Tabs } from '@/components/ui/tabs';

interface Props {
  programUuid: string;
  dayId: number;
  exerciseId: number;
}

export function ExerciseDetail({ programUuid, dayId, exerciseId }: Props) {
  const { exercise, isLoading, error, refetch } = useExerciseDetail(programUuid, dayId, exerciseId);
  const { save, complete, updateNotes } = useScoreActions({ programUuid, dayId });
  const [showTimer, setShowTimer] = useState(false);
  const [restSeconds] = useState(60);

  if (isLoading) return <div className="flex justify-center py-16"><Spinner size="lg" /></div>;
  if (error || !exercise) return <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">Failed to load exercise.</div>;

  const videoId = exercise.exercise.youtube_video_ids?.[0] ?? exercise.exercise.video_id ?? null;

  const handleSaveScore = (setNumber: number, value: number, kind: string) => {
    save.mutate({ workoutExerciseId: exercise.id, data: { kind, value, set_number: setNumber } });
  };

  const handleComplete = () => {
    complete.mutate(exercise.id, { onSuccess: () => refetch() });
  };

  return (
    <div className="mx-auto max-w-2xl flex flex-col gap-6">
      {showTimer && (
        <RestTimer seconds={restSeconds} onDismiss={() => setShowTimer(false)} />
      )}

      <PageHeader
        title={exercise.exercise.name}
        breadcrumbs={[
          { label: 'Programs', href: '/programs' },
          { label: 'Program', href: `/programs/${programUuid}` },
          { label: `Day ${dayId}`, href: `/programs/${programUuid}/days/${dayId}` },
          { label: exercise.exercise.name },
        ]}
        actions={
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => setShowTimer(true)}>
              Rest Timer
            </Button>
            <Button
              size="sm"
              variant={exercise.finished ? 'outline' : 'primary'}
              onClick={handleComplete}
              disabled={complete.isPending}
            >
              {exercise.finished ? 'Done' : 'Mark Complete'}
            </Button>
          </div>
        }
      />

      {exercise.finished && <Badge variant="success">Exercise Completed</Badge>}

      {videoId && <YoutubePlayer videoId={videoId} />}

      {exercise.notes && (
        <div className="rounded-xl bg-blue-50 p-4">
          <p className="text-xs font-semibold uppercase text-blue-600">Exercise Notes</p>
          <p className="mt-1 text-sm text-gray-700">{exercise.notes}</p>
        </div>
      )}

      <Tabs
        tabs={[
          {
            id: 'track',
            label: 'Track',
            content: (
              <SetsTracker exercise={exercise} onSave={handleSaveScore} />
            ),
          },
          {
            id: 'notes',
            label: 'My Notes',
            content: (
              <ExerciseNotes
                initialNotes={exercise.user_notes}
                label="Personal Notes"
                onSave={(notes) => updateNotes.mutate({ id: exercise.id, notes })}
              />
            ),
          },
          {
            id: 'history',
            label: 'History',
            content: <ExerciseHistory exerciseId={exercise.exercise_id} />,
          },
        ]}
      />
    </div>
  );
}
