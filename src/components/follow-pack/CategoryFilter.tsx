import React from 'react';
import type { Category, CategoryId } from '../../types/follow-pack';

interface CategoryFilterProps {
  categories: Category[];
  selected: CategoryId[];
  onToggle: (categoryId: CategoryId) => void;
  /**
   * Accounts per category id. Without it a chip is just a word — the reader
   * cannot tell whether "Musicians" holds 8 accounts or 800, and an empty-looking
   * filter is the thing this page exists to avoid.
   */
  counts?: Record<string, number>;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selected,
  onToggle,
  counts,
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map(category => {
        const isSelected = selected.includes(category.id);
        const count = counts?.[category.id];
        return (
          <button
            key={category.id}
            type="button"
            onClick={() => onToggle(category.id)}
            aria-pressed={isSelected}
            className={`
              inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium
              transition-all duration-200 border
              ${isSelected
                ? 'border-transparent text-white shadow-sm'
                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
              }
            `}
            style={{
              // Every category colour is a Tailwind 700-level shade, so white
              // text on it clears WCAG AA (4.9:1 at worst).
              backgroundColor: isSelected ? category.color : undefined,
            }}
            title={category.description}
          >
            {!isSelected && (
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: category.color }}
                aria-hidden="true"
              />
            )}
            <span>{category.name}</span>
            {/* Full-opacity white on the selected chip: at /80 the digits
                composite to 3.78-4.30:1 on 8 of the 16 shades, under AA for
                normal-size text. */}
            {count !== undefined && (
              <span className={isSelected ? 'text-white' : 'text-gray-500 dark:text-gray-400'}>
                {count}
              </span>
            )}
            {isSelected && (
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>
        );
      })}
    </div>
  );
};
