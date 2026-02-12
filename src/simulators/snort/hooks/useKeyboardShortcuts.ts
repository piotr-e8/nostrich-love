/**
 * Snort Keyboard Shortcuts Hook
 * Handles keyboard navigation and actions
 */

import { useEffect, useCallback, useRef } from 'react';

interface KeyboardShortcutsOptions {
  onNewPost?: () => void;
  onSearch?: () => void;
  onGoHome?: () => void;
  onRefresh?: () => void;
  onGoToProfile?: () => void;
  onGoToNotifications?: () => void;
  onGoToMessages?: () => void;
  onGoToSettings?: () => void;
  onLike?: () => void;
  onRepost?: () => void;
  onReply?: () => void;
}

export function useKeyboardShortcuts(options: KeyboardShortcutsOptions) {
  const optionsRef = useRef(options);
  
  // Keep options ref up to date
  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const { current: opts } = optionsRef;
    
    // Ignore if user is typing in an input, textarea, or contenteditable
    const target = event.target as HTMLElement;
    if (
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.isContentEditable ||
      target.closest('[contenteditable="true"]')
    ) {
      // Still allow Escape and Ctrl+Enter
      if (event.key !== 'Escape' && !(event.ctrlKey && event.key === 'Enter')) {
        return;
      }
    }

    // Ignore if modifier keys are pressed (except Ctrl/Cmd combinations we handle)
    if (event.altKey || event.shiftKey) {
      // Allow Shift+? for help
      if (!(event.shiftKey && event.key === '?')) {
        return;
      }
    }

    const key = event.key.toLowerCase();

    // New Post - N
    if (key === 'n' && !event.ctrlKey && !event.metaKey) {
      event.preventDefault();
      opts.onNewPost?.();
      console.log('[Snort] Keyboard shortcut: New Post (N)');
      return;
    }

    // Search - /
    if (key === '/' && !event.ctrlKey && !event.metaKey) {
      event.preventDefault();
      opts.onSearch?.();
      console.log('[Snort] Keyboard shortcut: Search (/)');
      return;
    }

    // Refresh - R
    if (key === 'r' && !event.ctrlKey && !event.metaKey) {
      event.preventDefault();
      opts.onRefresh?.();
      console.log('[Snort] Keyboard shortcut: Refresh (R)');
      return;
    }

    // Go Home - G then H
    if (key === 'g') {
      const handleGH = (e: KeyboardEvent) => {
        if (e.key.toLowerCase() === 'h') {
          e.preventDefault();
          opts.onGoHome?.();
          console.log('[Snort] Keyboard shortcut: Go Home (G+H)');
          document.removeEventListener('keydown', handleGH);
        }
      };
      document.addEventListener('keydown', handleGH, { once: true });
      setTimeout(() => {
        document.removeEventListener('keydown', handleGH);
      }, 1000);
      return;
    }

    // Go to Profile - G then P
    if (key === 'g' && opts.onGoToProfile) {
      const handleGP = (e: KeyboardEvent) => {
        if (e.key.toLowerCase() === 'p') {
          e.preventDefault();
          opts.onGoToProfile?.();
          console.log('[Snort] Keyboard shortcut: Go to Profile (G+P)');
          document.removeEventListener('keydown', handleGP);
        }
      };
      document.addEventListener('keydown', handleGP, { once: true });
      setTimeout(() => {
        document.removeEventListener('keydown', handleGP);
      }, 1000);
      return;
    }

    // Go to Notifications - G then N
    if (key === 'g' && opts.onGoToNotifications) {
      const handleGN = (e: KeyboardEvent) => {
        if (e.key.toLowerCase() === 'n') {
          e.preventDefault();
          opts.onGoToNotifications?.();
          console.log('[Snort] Keyboard shortcut: Go to Notifications (G+N)');
          document.removeEventListener('keydown', handleGN);
        }
      };
      document.addEventListener('keydown', handleGN, { once: true });
      setTimeout(() => {
        document.removeEventListener('keydown', handleGN);
      }, 1000);
      return;
    }

    // Go to Messages - G then M
    if (key === 'g' && opts.onGoToMessages) {
      const handleGM = (e: KeyboardEvent) => {
        if (e.key.toLowerCase() === 'm') {
          e.preventDefault();
          opts.onGoToMessages?.();
          console.log('[Snort] Keyboard shortcut: Go to Messages (G+M)');
          document.removeEventListener('keydown', handleGM);
        }
      };
      document.addEventListener('keydown', handleGM, { once: true });
      setTimeout(() => {
        document.removeEventListener('keydown', handleGM);
      }, 1000);
      return;
    }

    // Like - L
    if (key === 'l' && !event.ctrlKey && !event.metaKey && opts.onLike) {
      event.preventDefault();
      opts.onLike?.();
      console.log('[Snort] Keyboard shortcut: Like (L)');
      return;
    }

    // Repost - T (for "boost" or "retweet")
    if (key === 't' && !event.ctrlKey && !event.metaKey && opts.onRepost) {
      event.preventDefault();
      opts.onRepost?.();
      console.log('[Snort] Keyboard shortcut: Repost (T)');
      return;
    }

    // Reply - Shift+R
    if (key === 'r' && event.shiftKey && opts.onReply) {
      event.preventDefault();
      opts.onReply?.();
      console.log('[Snort] Keyboard shortcut: Reply (Shift+R)');
      return;
    }

    // Help - Shift+?
    if (key === '?' && event.shiftKey) {
      event.preventDefault();
      console.log('[Snort] Keyboard shortcut: Show Help (?)');
      // Could open a help modal here
      return;
    }
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  // Return helper to check if shortcuts are available
  return {
    isAvailable: true,
  };
}

// Additional hook for modal-specific shortcuts
export function useModalShortcuts(options: {
  onClose?: () => void;
  onSubmit?: () => void;
}) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Close on Escape
      if (event.key === 'Escape') {
        event.preventDefault();
        options.onClose?.();
      }

      // Submit on Ctrl+Enter
      if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        event.preventDefault();
        options.onSubmit?.();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [options.onClose, options.onSubmit]);
}

export default useKeyboardShortcuts;
