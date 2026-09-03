import React, { useId } from 'react';
import type { FilterState } from '../../types/follow-pack';

interface ActivityFilterProps {
  value: FilterState['activityLevel'];
  onChange: (value: FilterState['activityLevel']) => void;
  /**
   * Accounts per activity level. Levels with no accounts are not offered:
   * "Occasional" matched nothing in the dataset and silently emptied the
   * browser for anyone who picked it.
   */
  counts?: Record<string, number>;
}

const ALL_OPTIONS: { value: FilterState['activityLevel']; label: string }[] = [
  { value: 'all', label: 'All Activity' },
  { value: 'high', label: 'Very Active' },
  { value: 'medium', label: 'Active' },
  { value: 'low', label: 'Occasional' },
];

export const ActivityFilter: React.FC<ActivityFilterProps> = ({
  value,
  onChange,
  counts,
}) => {
  const captionId = useId();
  const options = counts
    ? ALL_OPTIONS.filter(option => option.value === 'all' || (counts[option.value] ?? 0) > 0)
    : ALL_OPTIONS;

  return (
    <div className="flex items-center gap-2">
      <span id={captionId} className="text-body-sm text-gray-600 dark:text-gray-400">Activity:</span>
      <select
        aria-labelledby={captionId}
        value={value}
        onChange={(e) => onChange(e.target.value as FilterState['activityLevel'])}
        className="
          cursor-pointer rounded-md px-3 py-1.5
          border border-gray-300 dark:border-gray-700
          bg-white dark:bg-gray-900
          text-body-sm text-gray-900 dark:text-white
        "
      >
        {options.map(option => {
          const count = option.value === 'all' ? undefined : counts?.[option.value];
          return (
            <option key={option.value} value={option.value}>
              {count === undefined ? option.label : `${option.label} (${count})`}
            </option>
          );
        })}
      </select>
    </div>
  );
};
