/**
 * Custom hook for managing tour element positioning
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import type { TooltipRect, SpotlightRect } from './types';

interface UseTourElementResult {
  targetRect: DOMRect | null;
  spotlightRect: SpotlightRect | null;
  tooltipRect: TooltipRect | null;
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

    // Initial calculation
    calculateRects();

    // Set up observers
    observerRef.current = new MutationObserver(() => {
      calculateRects();
    });

    resizeObserverRef.current = new ResizeObserver(() => {
      calculateRects();
    });

    const element = document.querySelector(targetSelector);
    if (element) {
      observerRef.current.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class', 'style'],
      });
      resizeObserverRef.current.observe(element);
    }

    // Window events
    const handleScroll = () => calculateRects();
    const handleResize = () => calculateRects();

    window.addEventListener('scroll', handleScroll, true);
    window.addEventListener('resize', handleResize);

    return () => {
      observerRef.current?.disconnect();
      resizeObserverRef.current?.disconnect();
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', handleResize);
    };
  }, [targetSelector, calculateRects]);

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
    const maxTop = window.innerHeight - tooltipHeight - margin;

    return {
      top: Math.max(margin, Math.min(top, maxTop)),
      left: Math.max(margin, Math.min(left, maxLeft)),
      width: tooltipWidth,
      height: tooltipHeight,
    };
  })();

  return {
    targetRect,
    spotlightRect,
    tooltipRect,
    scrollToElement,
  };
}
