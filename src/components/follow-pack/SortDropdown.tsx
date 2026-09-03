import React, { useId } from 'react';
import type { FilterState } from '../../types/follow-pack';

interface SortDropdownProps {
  value: FilterState['sortBy'];
  onChange: (value: FilterState['sortBy']) => void;
}

// Only the sorts the data can actually perform — see FilterState.sortBy for why
// "Most Popular", "Most Active" and "Recently Added" were removed.
const options: { value: FilterState['sortBy']; label: string }[] = [
  { value: 'curated', label: 'Curated order' },
  { value: 'name', label: 'Name (A-Z)' },
];

export const SortDropdown: React.FC<SortDropdownProps> = ({
  value,
  onChange,
}) => {
  const captionId = useId();

  return (
    <div className="flex items-center gap-2">
      <span id={captionId} className="text-body-sm text-gray-600 dark:text-gray-400">Sort by:</span>
      <select
        aria-labelledby={captionId}
        value={value}
        onChange={(e) => onChange(e.target.value as FilterState['sortBy'])}
        className="
          cursor-pointer rounded-md px-3 py-1.5
          border border-gray-300 dark:border-gray-700
          bg-white dark:bg-gray-900
          text-body-sm text-gray-900 dark:text-white
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
