'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreVertical, Layers, Dumbbell } from 'lucide-react';

interface DayActionsMenuProps {
  onAddBlock: () => void;
  onAddWorkout: () => void;
  addBlockDisabled?: boolean;
  addWorkoutDisabled?: boolean;
  addBlockPending?: boolean;
  addPending?: boolean;
  /** 'fab' = floating bottom-right, 'inline' = compact button in header */
  variant?: 'fab' | 'inline';
}

export function DayActionsMenu({
  onAddBlock,
  onAddWorkout,
  addBlockDisabled,
  addWorkoutDisabled,
  addBlockPending,
  addPending,
  variant = 'fab',
}: DayActionsMenuProps) {
  const isPending = addBlockPending || addPending;

  const trigger = (
    <DropdownMenuTrigger asChild>
      <Button
        size={variant === 'fab' ? 'icon' : 'icon-sm'}
        variant={variant === 'fab' ? 'default' : 'ghost'}
        disabled={isPending}
        className={
          variant === 'fab'
            ? 'h-12 w-12 rounded-full shadow-lg'
            : 'rounded-full border border-border hover:bg-muted'
        }
        aria-label="Opções do dia"
      >
        <MoreVertical className="h-5 w-5" />
      </Button>
    </DropdownMenuTrigger>
  );

  const menu = (
    <DropdownMenuContent
      align={variant === 'fab' ? 'start' : 'end'}
      side={variant === 'fab' ? 'top' : 'bottom'}
      sideOffset={8}
      className="min-w-[200px] p-2"
    >
      <DropdownMenuItem
        onClick={() => !addBlockDisabled && onAddBlock()}
        disabled={addBlockDisabled}
        className="cursor-pointer py-2.5 text-sm"
      >
        <Layers className="mr-3 h-4 w-4 shrink-0" />
        Add Block
      </DropdownMenuItem>
      <DropdownMenuItem
        onClick={() => !addWorkoutDisabled && onAddWorkout()}
        disabled={addWorkoutDisabled}
        className="cursor-pointer py-2.5 text-sm"
      >
        <Dumbbell className="mr-3 h-4 w-4 shrink-0" />
        Add Workout
      </DropdownMenuItem>
    </DropdownMenuContent>
  );

  if (variant === 'fab') {
    return (
      <div className="fixed bottom-6 right-6 z-40">
        <DropdownMenu>
          {trigger}
          {menu}
        </DropdownMenu>
      </div>
    );
  }

  return (
    <DropdownMenu>
      {trigger}
      {menu}
    </DropdownMenu>
  );
}
