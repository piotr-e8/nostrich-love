import React from 'react';
import type { FilterState } from '../../types/follow-pack';

interface SortDropdownProps {
  value: FilterState['sortBy'];
  onChange: (value: FilterState['sortBy']) => void;
}

const options: { value: FilterState['sortBy']; label: string }[] = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'active', label: 'Most Active' },
  { value: 'name', label: 'Name (A-Z)' },
  { value: 'recent', label: 'Recently Added' },
];

export const SortDropdown: React.FC<SortDropdownProps> = ({
  value,
  onChange,
}) => {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600 dark:text-gray-400">Sort by:</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as FilterState['sortBy'])}
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
