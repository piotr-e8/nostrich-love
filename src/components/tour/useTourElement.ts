/**
 * Custom hook for managing tour element positioning
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import type { TooltipRect, SpotlightRect } from './types';

interface UseTourElementResult {
  targetRect: DOMRect | null;
  spotlightRect: SpotlightRect | null;
  tooltipRect: TooltipRect | null;
  targetCenter: { x: number; y: number } | null;
  scrollToElement: () => void;
}

export function useTourElement(
  targetSelector: string,
  position: string,
  padding: number = 8
): UseTourElementResult {
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const observerRef = useRef<MutationObserver | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const retryCountRef = useRef<number>(0);

  const calculateRects = useCallback(() => {
    if (typeof window === 'undefined') return;
    
    // Guard against empty selectors
    if (!targetSelector || targetSelector.trim() === '') {
      setTargetRect(null);
      return;
    }
    
    const element = document.querySelector(targetSelector);
    if (!element) {
      setTargetRect(null);
      return;
    }

    const rect = element.getBoundingClientRect();
    setTargetRect(rect);
  }, [targetSelector]);

  const calculateRectsWithRetry = useCallback(() => {
    if (typeof window === 'undefined') return;
    
    // Guard against empty selectors
    if (!targetSelector || targetSelector.trim() === '') {
      setTargetRect(null);
      return;
    }

    // Clear any existing retry timeout
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }
    
    retryCountRef.current = 0;
    
    const attemptFind = () => {
      const element = document.querySelector(targetSelector);
      
      if (element) {
        // Element found - calculate rects and reset retry count
        const rect = element.getBoundingClientRect();
        setTargetRect(rect);
        retryCountRef.current = 0;
        return true;
      }
      
      // Element not found - retry with delay if we haven't exceeded max retries
      if (retryCountRef.current < 10) {
        retryCountRef.current++;
        const delay = Math.min(50 * retryCountRef.current, 500); // Progressive delay: 50ms, 100ms, 150ms... max 500ms
        retryTimeoutRef.current = setTimeout(attemptFind, delay);
      }
      
      return false;
    };
    
    attemptFind();
  }, [targetSelector]);

  const scrollToElement = useCallback(() => {
    if (typeof window === 'undefined') return;
    
    // Guard against empty selectors
    if (!targetSelector || targetSelector.trim() === '') return;
    
    const element = document.querySelector(targetSelector);
    if (!element) return;

    element.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'center',
    });
  }, [targetSelector]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Guard against empty selectors
    if (!targetSelector || targetSelector.trim() === '') return;

    // Initial calculation with retry - allows React time to render new elements
    calculateRectsWithRetry();

    // Set up observers for ongoing updates
    observerRef.current = new MutationObserver(() => {
      calculateRects();
    });

    resizeObserverRef.current = new ResizeObserver(() => {
      calculateRects();
    });

    // Set up observers after a short delay to let the element appear
    const observerSetupTimeout = setTimeout(() => {
      const element = document.querySelector(targetSelector);
      if (element && observerRef.current) {
        observerRef.current.observe(document.body, {
          childList: true,
          subtree: true,
          attributes: true,
          attributeFilter: ['class', 'style'],
        });
        if (resizeObserverRef.current) {
          resizeObserverRef.current.observe(element);
        }
      }
    }, 100);

    // Window events
    const handleScroll = () => calculateRects();
    const handleResize = () => calculateRects();

    window.addEventListener('scroll', handleScroll, true);
    window.addEventListener('resize', handleResize);

    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
      clearTimeout(observerSetupTimeout);
      observerRef.current?.disconnect();
      resizeObserverRef.current?.disconnect();
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', handleResize);
    };
  }, [targetSelector, calculateRects, calculateRectsWithRetry]);

  const spotlightRect: SpotlightRect | null = targetRect && typeof window !== 'undefined'
    ? {
        top: targetRect.top + window.scrollY,
        left: targetRect.left + window.scrollX,
        width: targetRect.width,
        height: targetRect.height,
        padding,
      }
    : null;

  const tooltipRect: TooltipRect | null = (() => {
    if (!targetRect) return null;

    const tooltipWidth = 320;
    const tooltipHeight = 150;
    const offset = 16;

    let top = 0;
    let left = 0;

    switch (position) {
      case 'top':
        top = targetRect.top - tooltipHeight - offset;
        left = targetRect.left + targetRect.width / 2 - tooltipWidth / 2;
        break;
      case 'bottom':
        top = targetRect.bottom + offset;
        left = targetRect.left + targetRect.width / 2 - tooltipWidth / 2;
        break;
      case 'left':
        top = targetRect.top + targetRect.height / 2 - tooltipHeight / 2;
        left = targetRect.left - tooltipWidth - offset;
        break;
      case 'right':
        top = targetRect.top + targetRect.height / 2 - tooltipHeight / 2;
        left = targetRect.right + offset;
        break;
      case 'center':
      default:
        top = targetRect.top + targetRect.height / 2 - tooltipHeight / 2;
        left = targetRect.left + targetRect.width / 2 - tooltipWidth / 2;
        break;
    }

    // Viewport boundaries (guard for SSR)
    // Keep tooltip in upper portion of screen, well away from bottom controls
    const margin = 16;
    if (typeof window === 'undefined') {
      return {
        top: Math.max(margin, top),
        left: Math.max(margin, left),
        width: tooltipWidth,
        height: tooltipHeight,
      };
    }
    const maxLeft = window.innerWidth - tooltipWidth - margin;
    // Limit tooltip to upper 60% of viewport height to avoid controls
    const maxTop = Math.floor(window.innerHeight * 0.6) - tooltipHeight;

    return {
      top: Math.max(margin, Math.min(top, maxTop)),
      left: Math.max(margin, Math.min(left, maxLeft)),
      width: tooltipWidth,
      height: tooltipHeight,
    };
  })();

  // Calculate target center position for arrow positioning
  const targetCenter = targetRect && tooltipRect
    ? {
        x: targetRect.left + targetRect.width / 2 - tooltipRect.left,
        y: targetRect.top + targetRect.height / 2 - tooltipRect.top,
      }
    : null;

  return {
    targetRect,
    spotlightRect,
    tooltipRect,
    targetCenter,
    scrollToElement,
  };
}
