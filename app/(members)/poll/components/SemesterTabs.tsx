import { cn } from '@/lib/utils';

interface SemesterTabsProps {
  semesters: string[];
  selected: string;
  onSelect: (semester: string) => void;
}

export default function SemesterTabs({
  semesters,
  selected,
  onSelect,
}: SemesterTabsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-0.5 [&::-webkit-scrollbar]:hidden">
      {semesters.map((semester) => (
        <button
          key={semester}
          onClick={() => onSelect(semester)}
          className={cn(
            'shrink-0 rounded-full px-4 py-1.5 text-[14px] font-medium transition-colors',
            semester === selected
              ? 'bg-chip-on text-text-chip-on'
              : 'bg-chip-off text-text-chip-off',
          )}
        >
          {semester}
        </button>
      ))}
    </div>
  );
}
