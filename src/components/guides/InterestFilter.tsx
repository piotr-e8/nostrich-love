import React, { useState, useEffect } from 'react';
import {
  ChevronDown,
  Check,
  LayoutGrid,
  Bitcoin,
  Lock,
  ShieldCheck,
  Server,
  Wrench,
  Users,
} from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';

export type InterestFilterValue = string | null;

/**
 * Fired by the empty state inside GuideSection when the reader asks to go back
 * to all guides. Handled here because this component is the one holding
 * onFilterChange; see the comment on the listener below.
 */
export const CLEAR_GUIDE_FILTER_EVENT = 'nostrich:clear-guide-filter';

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

// Every icon here is decorative: the chip's own label is what a screen reader
// should read, so all of them carry aria-hidden.
//
// Privacy and Security used to share the same padlock, which made two chips
// look like one option rendered twice. Relays had a </> that told a writer
// nothing, Tools had a paint palette, Community had a video camera. Sizes and
// stroke weight follow the icon defaults in VISUAL_SYSTEM.md §5.
const chipIcon = 'h-4 w-4 shrink-0';

const getFilterOptions = (t: (key: string) => string): InterestFilterOption[] => [
  { value: null, label: t('interestFilter.allGuides'), icon: <LayoutGrid className={chipIcon} strokeWidth={1.5} aria-hidden="true" /> },
  { value: 'bitcoin', label: t('interestFilter.bitcoin'), icon: <Bitcoin className={chipIcon} strokeWidth={1.5} aria-hidden="true" /> },
  { value: 'privacy', label: t('interestFilter.privacy'), icon: <Lock className={chipIcon} strokeWidth={1.5} aria-hidden="true" /> },
  { value: 'security', label: t('interestFilter.security'), icon: <ShieldCheck className={chipIcon} strokeWidth={1.5} aria-hidden="true" /> },
  { value: 'relays', label: t('interestFilter.relays'), icon: <Server className={chipIcon} strokeWidth={1.5} aria-hidden="true" /> },
  { value: 'tools', label: t('interestFilter.tools'), icon: <Wrench className={chipIcon} strokeWidth={1.5} aria-hidden="true" /> },
  { value: 'community', label: t('interestFilter.community'), icon: <Users className={chipIcon} strokeWidth={1.5} aria-hidden="true" /> },
];

/**
 * InterestFilter Component
 * Desktop: Horizontal tabs
 * Mobile: Dropdown select
 */
export const InterestFilter: React.FC<InterestFilterProps> = ({
  activeFilter,
  onFilterChange,
  options: optionsProp,
  className = '',
}) => {
  const { t } = useTranslation();
  const options = optionsProp || getFilterOptions(t);
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

  // A "no guides under this topic" state renders inside GuideSection, which has
  // no handle on the filter state. It asks for a reset by dispatching an event;
  // routing it back through onFilterChange keeps one code path for clearing the
  // filter, so the saved-filter write and the search-box reset still happen.
  useEffect(() => {
    const handleClearRequest = () => {
      onFilterChange(null);
      setIsDropdownOpen(false);
    };

    window.addEventListener(CLEAR_GUIDE_FILTER_EVENT, handleClearRequest);
    return () => window.removeEventListener(CLEAR_GUIDE_FILTER_EVENT, handleClearRequest);
  }, [onFilterChange]);

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
          className="w-full flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-md text-start transition-colors hover:border-gray-300 dark:hover:border-gray-700"
          aria-expanded={isDropdownOpen}
          aria-haspopup="listbox"
        >
          <div className="flex items-center gap-2">
            {activeOption.icon}
            <span className="text-body-sm font-medium text-gray-900 dark:text-white">
              {activeOption.label}
            </span>
          </div>
          {/* The rotation is the open/closed indicator, not decoration, so it
              stays — instant rather than animated under reduced motion. */}
          <ChevronDown
            className={`h-5 w-5 shrink-0 text-gray-400 transition-transform duration-200 motion-reduce:transition-none dark:text-gray-500 ${isDropdownOpen ? 'rotate-180' : ''}`}
            strokeWidth={1.5}
            aria-hidden="true"
          />
        </button>

        {isDropdownOpen && (
          <div
            className="absolute top-full start-0 end-0 mt-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-md shadow-raised z-50 overflow-hidden"
            role="listbox"
          >
            {options.map((option) => (
              <button
                key={option.value ?? 'all'}
                onClick={() => handleSelect(option.value)}
                className={`w-full flex items-center justify-between px-4 py-3 text-start text-body-sm transition-colors ${
                  activeFilter === option.value
                    ? 'bg-primary-50 text-primary-text dark:bg-gray-800 dark:text-primary-400'
                    : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800'
                }`}
                role="option"
                aria-selected={activeFilter === option.value}
              >
                <div className="flex items-center gap-2">
                  {option.icon}
                  <span>{option.label}</span>
                </div>
                {activeFilter === option.value && (
                  <Check className="h-4 w-4 shrink-0" strokeWidth={1.5} aria-hidden="true" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Desktop chip row. Not role="tablist": these are toggle buttons, there are no
  // tab panels, and a tablist promises arrow-key navigation this never had.
  // A group of aria-pressed buttons is what they actually are.
  return (
    <div
      className={`flex flex-wrap items-center justify-center gap-2 ${className}`}
      role="group"
      aria-label={t('guidesPage.filter.filterByInterest')}
    >
      {options.map((option) => {
        const isActive = activeFilter === option.value;
        return (
          <button
            key={option.value ?? 'all'}
            onClick={() => handleSelect(option.value)}
            className={`inline-flex items-center gap-2 rounded-md px-4 py-2 text-body-sm font-medium transition-colors ${
              isActive
                ? 'border border-primary-600 bg-primary-600 text-white hover:border-primary-700 hover:bg-primary-700'
                : 'border border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-gray-700 dark:hover:bg-gray-800'
            }`}
            aria-pressed={isActive}
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
