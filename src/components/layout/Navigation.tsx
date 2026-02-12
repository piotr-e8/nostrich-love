import React, { useState } from "react";
import {
  ChevronDown,
  Menu,
  X,
  Home,
  BookOpen,
  Users,
  MessageSquare,
  Settings,
} from "lucide-react";
import { cn } from "../../lib/utils";

export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon?: React.ReactNode;
  children?: NavItem[];
}

interface SidebarProps {
  items: NavItem[];
  activeItem?: string;
  className?: string;
  onItemClick?: (item: NavItem) => void;
  showProgress?: boolean;
  progress?: number;
}

export function Sidebar({
  items,
  activeItem,
  className,
  onItemClick,
  showProgress = false,
  progress = 0,
}: SidebarProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  const toggleSection = (itemId: string) => {
    setExpandedSections((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId],
    );
  };

  const renderNavItem = (item: NavItem, depth = 0) => {
    const isActive = activeItem === item.id;
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedSections.includes(item.id);

    return (
      <div key={item.id} className={depth > 0 ? "ml-4" : ""}>
        <button
          onClick={() => {
            if (hasChildren) {
              toggleSection(item.id);
            } else {
              onItemClick?.(item);
            }
          }}
          className={cn(
            "flex w-full items-center justify-between rounded-lg py-2 px-3 text-sm transition-all duration-150",
            "border-l-2",
            isActive
              ? "border-primary-500 bg-primary-50 font-medium text-primary-600 dark:bg-primary-950 dark:text-primary-400"
              : "border-transparent text-gray-600 hover:bg-gray-50 hover:text-primary-600 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-primary-400",
          )}
        >
          <span className="flex items-center gap-2">
            {item.icon && <span className="h-4 w-4">{item.icon}</span>}
            {item.label}
          </span>
          {hasChildren && (
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform duration-200",
                isExpanded && "rotate-180",
              )}
            />
          )}
        </button>

        {hasChildren && isExpanded && (
          <div className="mt-1 space-y-1">
            {item.children!.map((child) => renderNavItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <nav className={cn("w-64 flex-shrink-0", className)}>
      <div className="sticky top-20 space-y-6">
        {showProgress && (
          <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-medium text-gray-900 dark:text-white">
                Progress
              </span>
              <span className="text-primary-600 dark:text-primary-400">
                {progress}%
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
              <div
                className="h-full rounded-full bg-primary-500 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        <div className="space-y-1">
          {items.map((item) => renderNavItem(item))}
        </div>
      </div>
    </nav>
  );
}

// Breadcrumbs component
export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("flex items-center space-x-2 text-sm", className)}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <React.Fragment key={index}>
            {index > 0 && (
              <span className="text-gray-400 dark:text-gray-600">/</span>
            )}
            {isLast || !item.href ? (
              <span
                className={cn(
                  "font-medium",
                  isLast
                    ? "text-gray-900 dark:text-white"
                    : "text-gray-500 dark:text-gray-400",
                )}
                aria-current={isLast ? "page" : undefined}
              >
                {item.label}
              </span>
            ) : (
              <a
                href={item.href}
                className="text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400"
              >
                {item.label}
              </a>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}

// Table of Contents component
export interface TOCItem {
  id: string;
  label: string;
  level: number;
}

interface TableOfContentsProps {
  items: TOCItem[];
  activeId?: string;
  className?: string;
  onItemClick?: (id: string) => void;
}

export function TableOfContents({
  items,
  activeId,
  className,
  onItemClick,
}: TableOfContentsProps) {
  return (
    <div className={cn("w-64", className)}>
      <div className="sticky top-20">
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          On this page
        </h4>
        <ul className="space-y-1 border-l border-gray-200 dark:border-gray-700">
          {items.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onItemClick?.(item.id)}
                className={cn(
                  "block py-1 pl-4 text-sm transition-colors duration-150",
                  item.level === 2
                    ? "pl-4"
                    : item.level === 3
                      ? "pl-8"
                      : "pl-4",
                  activeId === item.id
                    ? "border-l-2 border-primary-500 font-medium text-primary-600 dark:text-primary-400"
                    : "text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400",
                )}
                style={{
                  marginLeft: activeId === item.id ? "-2px" : "-1px",
                }}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// Mobile Navigation
interface MobileNavProps {
  items: NavItem[];
  isOpen: boolean;
  onClose: () => void;
  onItemClick?: (item: NavItem) => void;
}

export function MobileNav({
  items,
  isOpen,
  onClose,
  onItemClick,
}: MobileNavProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 overflow-y-auto bg-white p-4 shadow-xl dark:bg-gray-900 lg:hidden">
        <div className="mb-4 flex items-center justify-between">
          <span className="font-semibold text-gray-900 dark:text-white">
            Menu
          </span>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <Sidebar
          items={items}
          onItemClick={(item) => {
            onItemClick?.(item);
            onClose();
          }}
        />
      </div>
    </>
  );
}

// Top Navigation Bar
interface TopNavProps {
  logo?: React.ReactNode;
  navItems?: NavItem[];
  rightContent?: React.ReactNode;
  className?: string;
  onMenuClick?: () => void;
}

export function TopNav({
  logo,
  navItems,
  rightContent,
  className,
  onMenuClick,
}: TopNavProps) {
  return (
    <header
      className={cn(
        "fixed left-0 right-0 top-0 z-40 border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-gray-700 dark:bg-gray-900/80",
        className,
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 lg:hidden dark:text-gray-400 dark:hover:bg-gray-800"
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </button>
          {logo}
        </div>

        {navItems && (
          <nav className="hidden lg:flex lg:items-center lg:gap-6">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={item.href}
                className="text-sm font-medium text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400"
              >
                {item.label}
              </a>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-2">{rightContent}</div>
      </div>
    </header>
  );
}
