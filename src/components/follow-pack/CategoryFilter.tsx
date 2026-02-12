import React from 'react';
import type { Category, CategoryId } from '../../types/follow-pack';

interface CategoryFilterProps {
  categories: Category[];
  selected: CategoryId[];
  onToggle: (categoryId: CategoryId) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selected,
  onToggle,
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map(category => {
        const isSelected = selected.includes(category.id);
        return (
          <button
            key={category.id}
            onClick={() => onToggle(category.id)}
            className={`
              inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium
              transition-all duration-200 border
              ${isSelected
                ? 'border-transparent text-white shadow-sm'
                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
              }
            `}
            style={{
              backgroundColor: isSelected ? category.color : undefined,
            }}
            title={category.description}
          >
            <span>{category.name}</span>
            {isSelected && (
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>
        );
      })}
    </div>
  );
};
