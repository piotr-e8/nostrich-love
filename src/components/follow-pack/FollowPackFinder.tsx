import React, { useState, useMemo, useCallback, useEffect } from 'react';
import type { CategoryId, UserSelection, FilterState } from '../../types/follow-pack';
import { curatedAccounts, categories, getCategoryCounts } from '../../data/follow-pack';
import { AccountBrowser } from './AccountBrowser';
import { PackSidebar } from './PackSidebar';
import { ExportModal } from './ExportModal';
import { SearchBar } from './SearchBar';
import { CategoryFilter } from './CategoryFilter';
import { ActivityFilter } from './ActivityFilter';
import { SortDropdown } from './SortDropdown';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { recordActivity } from '../../utils/gamificationEngine';

interface FollowPackFinderProps {
  initialSelectedCategories?: CategoryId[];
  showExport?: boolean;
}

const STORAGE_KEY = 'nostrich-follow-pack-selections';
const ACCOUNTS_PER_PAGE = 12;

// Derived once from the static dataset — every category chip and activity option
// carries its real count, so nothing in the UI can advertise an empty bucket.
const CATEGORY_COUNTS = getCategoryCounts();
const ACTIVITY_COUNTS = curatedAccounts.reduce<Record<string, number>>((counts, account) => {
  counts[account.activity] = (counts[account.activity] || 0) + 1;
  return counts;
}, {});
const VALID_CATEGORY_IDS = new Set<string>(categories.map(c => c.id));

export const FollowPackFinder: React.FC<FollowPackFinderProps> = ({
  initialSelectedCategories = [],
  showExport = true,
}) => {
  // Load saved selections from localStorage
  const [savedSelections, setSavedSelections] = useLocalStorage<UserSelection[]>(STORAGE_KEY, []);
  
  // Convert saved selections to Set for easier manipulation
  const [selectedNpubs, setSelectedNpubs] = useState<Set<string>>(
    () => new Set(savedSelections.map(s => s.npub))
  );
  
  // Filter state
  const [filterState, setFilterState] = useState<FilterState>({
    categories: initialSelectedCategories,
    searchQuery: '',
    activityLevel: 'all',
    contentTypes: [],
    sortBy: 'curated',
  });
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  
  // Export modal state
  const [isExportOpen, setIsExportOpen] = useState(false);

  // Record account selection (triggers community-builder badge at 10+ accounts and streak)
  useEffect(() => {
    recordActivity('followAccounts', { count: selectedNpubs.size });
  }, [selectedNpubs]);

  // Filter and sort accounts
  const filteredAccounts = useMemo(() => {
    let filtered = [...curatedAccounts];
    
    // Category filter
    if (filterState.categories.length > 0) {
      filtered = filtered.filter(account => 
        account.categories.some(cat => filterState.categories.includes(cat))
      );
    }
    
    // Search query
    if (filterState.searchQuery) {
      const query = filterState.searchQuery.toLowerCase();
      filtered = filtered.filter(account =>
        account.name.toLowerCase().includes(query) ||
        account.username?.toLowerCase().includes(query) ||
        account.bio.toLowerCase().includes(query) ||
        account.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    // Activity filter
    if (filterState.activityLevel !== 'all') {
      filtered = filtered.filter(account => account.activity === filterState.activityLevel);
    }

    // Sort. 'curated' keeps the dataset's own order (starter set first), so
    // there is nothing to do for it.
    if (filterState.sortBy === 'name') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    return filtered;
  }, [filterState]);

  // Paginated accounts
  const paginatedAccounts = useMemo(() => {
    const startIndex = (currentPage - 1) * ACCOUNTS_PER_PAGE;
    return filteredAccounts.slice(startIndex, startIndex + ACCOUNTS_PER_PAGE);
  }, [filteredAccounts, currentPage]);

  // Calculate total pages
  const totalPages = Math.ceil(filteredAccounts.length / ACCOUNTS_PER_PAGE);

  // Parse URL query parameters on client side (for static sites)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const params = new URLSearchParams(window.location.search);
    const categoryParam = params.get('category');
    
    // Validate against the live taxonomy rather than a hand-maintained copy of
    // it — a duplicated id list is how ?category=bitcoin and ?category=privacy
    // ended up pointing at categories that never existed.
    if (categoryParam && VALID_CATEGORY_IDS.has(categoryParam)) {
      setFilterState(prev => ({
        ...prev,
        categories: [categoryParam as CategoryId],
      }));
    }
  }, []);

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [filterState.searchQuery, filterState.categories, filterState.activityLevel, filterState.sortBy]);

  // Get selected accounts
  const selectedAccounts = useMemo(() => {
    return curatedAccounts.filter(account => selectedNpubs.has(account.npub));
  }, [selectedNpubs]);

  // Toggle account selection
  const toggleAccount = useCallback((npub: string) => {
    setSelectedNpubs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(npub)) {
        newSet.delete(npub);
      } else {
        newSet.add(npub);
      }
      return newSet;
    });
  }, []);

  // Clear all selections
  const clearSelections = useCallback(() => {
    setSelectedNpubs(new Set());
  }, []);

  // Select all visible
  const selectAllVisible = useCallback(() => {
    setSelectedNpubs(prev => {
      const newSet = new Set(prev);
      paginatedAccounts.forEach(account => newSet.add(account.npub));
      return newSet;
    });
  }, [paginatedAccounts]);

  // Toggle category
  const toggleCategory = useCallback((categoryId: CategoryId) => {
    setFilterState(prev => ({
      ...prev,
      categories: prev.categories.includes(categoryId)
        ? prev.categories.filter(c => c !== categoryId)
        : [...prev.categories, categoryId],
    }));
  }, []);

  // Update search query
  const setSearchQuery = useCallback((query: string) => {
    setFilterState(prev => ({ ...prev, searchQuery: query }));
  }, []);

  // Update sort
  const setSortBy = useCallback((sortBy: FilterState['sortBy']) => {
    setFilterState(prev => ({ ...prev, sortBy }));
  }, []);

  // Update activity filter
  const setActivityLevel = useCallback((level: FilterState['activityLevel']) => {
    setFilterState(prev => ({ ...prev, activityLevel: level }));
  }, []);

  // Save selections to localStorage whenever they change
  React.useEffect(() => {
    const selections: UserSelection[] = Array.from(selectedNpubs).map(npub => ({
      npub,
      addedAt: new Date().toISOString(),
    }));
    setSavedSelections(selections);
  }, [selectedNpubs, setSavedSelections]);

  // Category breakdown for selected accounts
  const categoryBreakdown = useMemo(() => {
    const counts: Record<string, number> = {};
    selectedAccounts.forEach(account => {
      account.categories.forEach(cat => {
        counts[cat] = (counts[cat] || 0) + 1;
      });
    });
    return counts;
  }, [selectedAccounts]);

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="w-full min-h-[600px]">
      {/* Top section - Filters. The page owns the heading above this island. */}
      <div className="mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 space-y-4">
          <SearchBar
            value={filterState.searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by name, username, bio, or tags..."
          />

          <div className="flex flex-wrap items-center gap-4">
            <SortDropdown value={filterState.sortBy} onChange={setSortBy} />
            <ActivityFilter
              value={filterState.activityLevel}
              onChange={setActivityLevel}
              counts={ACTIVITY_COUNTS}
            />
          </div>

          <CategoryFilter
            categories={categories}
            selected={filterState.categories}
            onToggle={toggleCategory}
            counts={CATEGORY_COUNTS}
          />
          
          {filterState.categories.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 pt-2 border-t border-gray-100 dark:border-gray-700">
              <span>Filtered by:</span>
              {filterState.categories.map(catId => {
                const cat = categories.find(c => c.id === catId);
                return cat ? (
                  // Colour stays in the dot: as `color` on a tint of itself over
                  // a dark surface a 700-level shade is 1.4-2.7:1. See the same
                  // note in ExportModal's category breakdown.
                  <span
                    key={catId}
                    className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                  >
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: cat.color }}
                      aria-hidden="true"
                    />
                    {cat.name}
                    <button
                      type="button"
                      onClick={() => toggleCategory(catId)}
                      aria-label={`Remove ${cat.name} filter`}
                      className="hover:opacity-70"
                    >
                      ×
                    </button>
                  </span>
                ) : null;
              })}
              <button
                onClick={() => setFilterState(prev => ({ ...prev, categories: [] }))}
                className="text-primary-600 dark:text-primary-400 hover:underline ms-2 text-xs"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main content - Full width layout */}
      <div className="flex flex-col xl:flex-row gap-6">
        {/* Account browser - Takes full width */}
        <div className="flex-1 min-w-0">
          <AccountBrowser
            accounts={paginatedAccounts}
            selectedNpubs={selectedNpubs}
            onToggleAccount={toggleAccount}
            onSelectAll={selectAllVisible}
          />
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-between bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Showing {(currentPage - 1) * ACCOUNTS_PER_PAGE + 1} - {Math.min(currentPage * ACCOUNTS_PER_PAGE, filteredAccounts.length)} of {filteredAccounts.length} accounts
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Previous
                </button>
                
                <div className="flex items-center gap-1">
                  {getPageNumbers().map((page, index) => (
                    page === '...' ? (
                      <span key={`ellipsis-${index}`} className="px-2 text-gray-400">...</span>
                    ) : (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page as number)}
                        className={`
                          w-8 h-8 rounded-lg text-sm font-medium
                          ${currentPage === page
                            ? 'bg-primary-600 text-white'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                          }
                        `}
                      >
                        {page}
                      </button>
                    )
                  ))}
                </div>
                
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar - Sticky on desktop */}
        <div className="w-full xl:w-80 xl:flex-shrink-0">
          <div className="xl:sticky xl:top-4">
            <PackSidebar
              selectedAccounts={selectedAccounts}
              categoryBreakdown={categoryBreakdown}
              categories={categories}
              onRemoveAccount={toggleAccount}
              onClearAll={clearSelections}
              onExport={() => setIsExportOpen(true)}
            />
          </div>
        </div>
      </div>

      {/* Export modal */}
      {showExport && (
        <ExportModal
          isOpen={isExportOpen}
          onClose={() => setIsExportOpen(false)}
          selectedAccounts={selectedAccounts}
        />
      )}
    </div>
  );
};
