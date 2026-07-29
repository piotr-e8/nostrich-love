/**
 * useFocusTrap
 *
 * Shared focus management for modal dialogs:
 * - On open: remembers the element that opened the dialog and moves focus
 *   to the first focusable element inside the container (or the container).
 * - While open: Tab / Shift+Tab cycle within the container; Escape calls
 *   `onClose`.
 * - On close or unmount: focus returns to the opener.
 *
 * Usage:
 *   const modalRef = useFocusTrap<HTMLDivElement>(isOpen, onClose);
 *   ...
 *   {isOpen && <div ref={modalRef} role="dialog" aria-modal="true">...</div>}
 */

import { useEffect, useRef } from 'react';

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

export function useFocusTrap<T extends HTMLElement = HTMLDivElement>(
  isOpen: boolean,
  onClose?: () => void,
) {
  const containerRef = useRef<T | null>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!isOpen) return;

    const opener =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    const getFocusable = (): HTMLElement[] => {
      const container = containerRef.current;
      if (!container) return [];
      return Array.from(
        container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      ).filter((el) => el.getClientRects().length > 0);
    };

    // Move focus into the dialog.
    const focusables = getFocusable();
    if (focusables.length > 0) {
      focusables[0].focus();
    } else if (containerRef.current) {
      containerRef.current.tabIndex = -1;
      containerRef.current.focus();
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      const container = containerRef.current;
      if (!container) return;

      if (event.key === 'Escape') {
        // The dialog owns Escape while open; keep it from reaching
        // lower-level listeners (e.g. the header menus).
        event.stopPropagation();
        onCloseRef.current?.();
        return;
      }

      if (event.key !== 'Tab') return;

      const elements = getFocusable();
      if (elements.length === 0) {
        event.preventDefault();
        container.focus();
        return;
      }

      const first = elements[0];
      const last = elements[elements.length - 1];
      const active =
        document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null;
      const activeInside = active !== null && container.contains(active);

      if (event.shiftKey) {
        if (!activeInside || active === first) {
          event.preventDefault();
          last.focus();
        }
      } else if (!activeInside || active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown, true);

    return () => {
      document.removeEventListener('keydown', handleKeyDown, true);
      // Return focus to whatever opened the dialog.
      if (opener && document.contains(opener)) {
        opener.focus();
      }
    };
  }, [isOpen]);

  return containerRef;
}

export default useFocusTrap;
