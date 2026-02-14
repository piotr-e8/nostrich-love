import React, { useState, useEffect } from 'react';
import { ChevronDown, Check, Sparkles, Bitcoin, Lock, Palette, Code, Video } from 'lucide-react';

export type InterestFilterValue = string | null;

export interface InterestFilterOption {
  value: InterestFilterValue;
  label: string;
  icon: React.ReactNode;
}

export interface InterestFilterProps {
  activeFilter: InterestFilterValue;
  onFilterChange: (filter: InterestFilterValue) => void;
  options?: InterestFilterOption[];
  className?: string;
}

const defaultOptions: InterestFilterOption[] = [
  { value: null, label: 'All Guides', icon: <Sparkles className="w-4 h-4" /> },
  { value: 'bitcoin', label: 'Bitcoin', icon: <Bitcoin className="w-4 h-4" /> },
  { value: 'privacy', label: 'Privacy', icon: <Lock className="w-4 h-4" /> },
  { value: 'security', label: 'Security', icon: <Lock className="w-4 h-4" /> },
  { value: 'relays', label: 'Relays', icon: <Code className="w-4 h-4" /> },
  { value: 'tools', label: 'Tools', icon: <Palette className="w-4 h-4" /> },
  { value: 'community', label: 'Community', icon: <Video className="w-4 h-4" /> },
];

/**
 * InterestFilter Component
 * Desktop: Horizontal tabs
 * Mobile: Dropdown select
 */
export const InterestFilter: React.FC<InterestFilterProps> = ({
  activeFilter,
  onFilterChange,
  options = defaultOptions,
  className = '',
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.interest-filter-dropdown')) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isDropdownOpen]);

  const activeOption = options.find(opt => opt.value === activeFilter) || options[0];

  const handleSelect = (value: InterestFilterValue) => {
    onFilterChange(value);
    setIsDropdownOpen(false);
  };

  // Mobile Dropdown View
  if (isMobile) {
    return (
      <div className={`relative interest-filter-dropdown ${className}`}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="w-full flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-left focus:outline-none focus:ring-2 focus:ring-friendly-purple-400"
          aria-expanded={isDropdownOpen}
          aria-haspopup="listbox"
        >
          <div className="flex items-center gap-2">
            {activeOption.icon}
            <span className="font-medium text-gray-900 dark:text-white">
              {activeOption.label}
            </span>
          </div>
          <ChevronDown 
            className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} 
          />
        </button>

        {isDropdownOpen && (
          <div 
            className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 overflow-hidden"
            role="listbox"
          >
            {options.map((option) => (
              <button
                key={option.value ?? 'all'}
                onClick={() => handleSelect(option.value)}
                className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors ${
                  activeFilter === option.value
                    ? 'bg-friendly-purple-50 dark:bg-friendly-purple-900/30 text-friendly-purple-700 dark:text-friendly-purple-300'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
                role="option"
                aria-selected={activeFilter === option.value}
              >
                <div className="flex items-center gap-2">
                  {option.icon}
                  <span>{option.label}</span>
                </div>
                {activeFilter === option.value && (
                  <Check className="w-4 h-4" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Desktop Tabs View
  return (
    <div 
      className={`flex flex-wrap items-center justify-center gap-2 ${className}`}
      role="tablist"
      aria-label="Filter guides by interest"
    >
      {options.map((option) => {
        const isActive = activeFilter === option.value;
        return (
          <button
            key={option.value ?? 'all'}
            onClick={() => handleSelect(option.value)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-friendly-purple-400 ${
              isActive
                ? 'bg-friendly-purple-600 text-white shadow-sm'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
            role="tab"
            aria-selected={isActive}
          >
            {option.icon}
            <span>{option.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default InterestFilter;
