// Locale-aware view of the category taxonomy.
//
// Deliberately a SEPARATE module from ./categories.ts. Every client island that
// touches categories (AccountCard, ExportModal, PackSidebar) imports
// ./categories.ts; if the i18n runtime were wired in there, all of them would
// drag the translation bundle into the page. Only server-rendered surfaces
// import this file, so the lookup happens at build time and ships zero bytes of
// JSON to the browser.
//
// Every string falls back to the English value hardcoded in ./categories.ts, so
// a locale that has not translated `followPack.*` yet renders English rather
// than a raw dotted key.

import { getValue, type Locale } from '../../i18n';
import { categories, categoryGroups } from './categories';
import type { Category, CategoryGroup, CategoryGroupId } from '../../types/follow-pack';

const localized = (key: string, fallback: string, locale?: Locale): string => {
  const value = getValue(key, locale);
  return typeof value === 'string' && value.trim().length > 0 ? value : fallback;
};

export const localizeCategory = (category: Category, locale?: Locale): Category => ({
  ...category,
  name: localized(`followPack.categories.${category.id}.name`, category.name, locale),
  description: localized(
    `followPack.categories.${category.id}.description`,
    category.description,
    locale
  ),
});

export const getLocalizedCategories = (locale?: Locale): Category[] =>
  categories.map(category => localizeCategory(category, locale));

export const getLocalizedCategoryGroups = (locale?: Locale): CategoryGroup[] =>
  categoryGroups.map(group => ({
    ...group,
    name: localized(`followPack.groups.${group.id}.name`, group.name, locale),
    description: localized(`followPack.groups.${group.id}.description`, group.description, locale),
  }));

/**
 * Categories bucketed into their display bands, in `order`, with the account
 * count for each. Used by the server-rendered taxonomy on /follow-pack so the
 * counts appear in the static HTML instead of waiting on the React island.
 */
export interface LocalizedCategoryGroup extends CategoryGroup {
  categories: Array<Category & { count: number }>;
  count: number;
}

export const getCategoryGroupsWithCounts = (
  counts: Record<string, number>,
  locale?: Locale
): LocalizedCategoryGroup[] => {
  const localizedCategories = getLocalizedCategories(locale).sort((a, b) => a.order - b.order);

  return getLocalizedCategoryGroups(locale).map(group => {
    const members = localizedCategories
      .filter(category => category.group === (group.id as CategoryGroupId))
      .map(category => ({ ...category, count: counts[category.id] ?? 0 }));

    return {
      ...group,
      categories: members,
      count: members.reduce((total, category) => total + category.count, 0),
    };
  });
};
