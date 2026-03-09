'use client';
import { useMemo, useState } from 'react';
import type { HistoryDate } from '@/models/history/history.schema';

interface Props {
  dates: HistoryDate[];
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

export function HistoryCalendar({ dates, selectedDate, onSelectDate }: Props) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const workoutDates = useMemo(() => new Set(dates.map((d) => d.date)), [dates]);

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const blanks = Array.from({ length: firstDay });
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const toDateStr = (day: number) =>
    `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const prevMonth = () => { if (month === 0) { setMonth(11); setYear((y) => y - 1); } else setMonth((m) => m - 1); };
  const nextMonth = () => { if (month === 11) { setMonth(0); setYear((y) => y + 1); } else setMonth((m) => m + 1); };

  return (
    <div className="rounded-2xl border bg-white p-4">
      <div className="mb-4 flex items-center justify-between">
        <button onClick={prevMonth} className="rounded p-1 hover:bg-gray-100">&#8592;</button>
        <span className="font-semibold">{MONTHS[month]} {year}</span>
        <button onClick={nextMonth} className="rounded p-1 hover:bg-gray-100">&#8594;</button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {DAYS.map((d) => (
          <div key={d} className="py-1 text-xs font-medium text-gray-400">{d}</div>
        ))}
        {blanks.map((_, i) => <div key={`blank-${i}`} />)}
        {days.map((day) => {
          const dateStr = toDateStr(day);
          const hasWorkout = workoutDates.has(dateStr);
          const isSelected = selectedDate === dateStr;
          const isToday = dateStr === todayStr;

          return (
            <button
              key={day}
              onClick={() => hasWorkout && onSelectDate(dateStr)}
              disabled={!hasWorkout}
              className={`relative rounded-full py-1.5 text-sm transition-colors ${
                isSelected ? 'bg-blue-600 text-white' :
                hasWorkout ? 'cursor-pointer font-medium text-gray-900 hover:bg-blue-50' :
                isToday ? 'font-bold text-blue-400' :
                'cursor-default text-gray-300'
              }`}
            >
              {day}
              {hasWorkout && !isSelected && (
                <span className="absolute bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-blue-400" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
