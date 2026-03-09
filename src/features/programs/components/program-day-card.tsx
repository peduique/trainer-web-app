import Link from 'next/link';
import { Card } from '@/components/ui/card';
import type { ProgramDay } from '@/models/programs/programs.schema';

interface Props {
  day: ProgramDay;
  programUuid: string;
}

export function ProgramDayCard({ day, programUuid }: Props) {
  return (
    <Link href={`/programs/${programUuid}/days/${day.id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-gray-900">Day {day.day_number}</p>
            {day.title && <p className="mt-0.5 text-sm text-gray-500">{day.title}</p>}
          </div>
          <span className="text-xs text-gray-400">Week {day.week}</span>
        </div>
      </Card>
    </Link>
  );
}
