import React from 'react';
import type { FilterState } from '../../types/follow-pack';

interface ActivityFilterProps {
  value: FilterState['activityLevel'];
  onChange: (value: FilterState['activityLevel']) => void;
}

const options: { value: FilterState['activityLevel']; label: string }[] = [
  { value: 'all', label: 'All Activity' },
  { value: 'high', label: 'Very Active' },
  { value: 'medium', label: 'Active' },
  { value: 'low', label: 'Occasional' },
];

export const ActivityFilter: React.FC<ActivityFilterProps> = ({
  value,
  onChange,
}) => {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600 dark:text-gray-400">Activity:</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as FilterState['activityLevel'])}
        className="
          text-sm border border-gray-300 dark:border-gray-600
          rounded-lg px-3 py-1.5
          bg-white dark:bg-gray-800
          text-gray-900 dark:text-white
          focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
          cursor-pointer
        "
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};
