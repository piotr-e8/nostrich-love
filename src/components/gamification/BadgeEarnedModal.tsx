/**
 * BadgeEarnedModal Component
 * 
 * Modal that appears when a user earns a badge
 * Features celebration effects, badge display, and action buttons
 */

import React, { useEffect, useState, useRef } from 'react';
import { X, Share2, Award, Zap, Check } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import type { BadgeEarnedModalProps } from './types';

const EXIT_DURATION_MS = 300;

// The 50-particle confetti burst is gone with the rest of the celebration
// styling; the `showConfetti` prop is kept so callers do not have to change,
// and it now renders nothing. The moment is carried by the modal itself.
const ConfettiEffect: React.FC<{ isActive: boolean }> = () => null;

export function BadgeEarnedModal({
  isOpen,
  badge,
  onClose,
  onClaim,
  showConfetti = true,
}: BadgeEarnedModalProps) {
  const [isCopied, setIsCopied] = useState(false);

  // Timed-exit idiom: content mounts in its hidden state,
  // `entered` flips on the next frame and CSS transitions it in; closing
  // plays the exit transition before telling the parent to unmount us.
  const [entered, setEntered] = useState(false);
  const [exiting, setExiting] = useState(false);
  const exitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setEntered(false);
      return;
    }
    // A new badge can be earned while the previous one's exit is still
    // playing (isOpen stays true for the whole 300 ms window, so the listener
    // only swaps the `badge` prop). Cancel the exit in flight or its timer
    // would call onClose() and silently drop the new badge. `badge` is in the
    // deps for exactly this case; AnimatePresence used to re-enter here.
    if (exitTimer.current) {
      clearTimeout(exitTimer.current);
      exitTimer.current = null;
    }
    setExiting(false);
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setEntered(true));
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [isOpen, badge]);

  useEffect(
    () => () => {
      if (exitTimer.current) clearTimeout(exitTimer.current);
    },
    []
  );

  const handleClose = () => {
    if (exiting) return;
    setExiting(true);
    exitTimer.current = setTimeout(() => {
      setExiting(false);
      onClose();
    }, EXIT_DURATION_MS);
  };

  const isShown = entered && !exiting;

  // Trap focus inside the dialog; Escape closes, focus returns to the opener.
  const modalRef = useFocusTrap<HTMLDivElement>(isOpen, handleClose);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleShare = async () => {
    if (!badge) return;

    const text = `I just earned the "${badge.name}" badge on Nostrich.love! 🎉\n\n${badge.description}\n\nStart your Nostr journey: https://nostrich.love`;

    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (!badge) return null;

  return (
    <>
      {/* Confetti Effect */}
      {showConfetti && <ConfettiEffect isActive={isOpen} />}

      {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className={cn(
                'fixed inset-0 bg-black/60 z-50',
                'transition-opacity duration-300 motion-reduce:transition-none',
                isShown ? 'opacity-100' : 'opacity-0'
              )}
              onClick={handleClose}
              aria-hidden="true"
            />

            {/* Modal */}
            <div
              className={cn(
                'fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none',
                'transition-all duration-300 ease-out-quint motion-reduce:transition-none',
                isShown
                  ? 'opacity-100 scale-100 translate-y-0'
                  : 'opacity-0 scale-95 translate-y-8'
              )}
              role="dialog"
              aria-modal="true"
              aria-labelledby="badge-earned-title"
              aria-describedby="badge-earned-description"
            >
              <div
                ref={modalRef}
                className={cn(
                  'relative w-full max-w-md bg-white dark:bg-gray-900',
                  'rounded-lg shadow-raised overflow-hidden pointer-events-auto',
                  'border border-gray-200 dark:border-gray-800'
                )}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <button
                  onClick={handleClose}
                  className={cn(
                    'absolute top-4 end-4 p-2 rounded-md z-10',
                    'text-gray-500 dark:text-gray-400',
                    'transition-colors hover:bg-gray-100 dark:hover:bg-gray-800'
                  )}
                  aria-label="Close modal"
                >
                  <X className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
                </button>

                {/* Content */}
                <div className="px-8 pb-8 pt-10 text-center">
                  {/* Badge Icon */}
                  <div
                    className="animate-scale-in motion-reduce:animate-none text-6xl mb-4"
                    style={{ animationDelay: '200ms' }}
                  >
                    {badge.emoji}
                  </div>

                  {/* Congratulations Text */}
                  <div
                    className="animate-slide-up motion-reduce:animate-none"
                    style={{ animationDelay: '300ms' }}
                  >
                    <div className="inline-flex items-center gap-1.5 mb-3">
                      <Award
                        className="h-4 w-4 shrink-0 text-primary-text dark:text-primary-400"
                        strokeWidth={1.5}
                        aria-hidden="true"
                      />
                      <span className="text-micro uppercase text-primary-text dark:text-primary-400">
                        Badge Earned!
                      </span>
                    </div>
                  </div>

                  <h2
                    id="badge-earned-title"
                    className="animate-slide-up motion-reduce:animate-none text-h2 font-display text-gray-900 dark:text-white mb-2"
                    style={{ animationDelay: '400ms' }}
                  >
                    {badge.name}
                  </h2>

                  <p
                    id="badge-earned-description"
                    className="animate-slide-up motion-reduce:animate-none text-body text-gray-600 dark:text-gray-400 mb-6"
                    style={{ animationDelay: '500ms' }}
                  >
                    {badge.description}
                  </p>

                  {/* Badge Details */}
                  <div
                    className="animate-slide-up motion-reduce:animate-none flex justify-center gap-4 mb-8"
                    style={{ animationDelay: '600ms' }}
                  >
                    {badge.category && (
                      <div className="px-4 py-2 rounded-md border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
                        <p className="text-micro uppercase text-gray-500 dark:text-gray-400">
                          Category
                        </p>
                        <p className="text-body-sm font-semibold text-gray-900 dark:text-white capitalize">
                          {badge.category}
                        </p>
                      </div>
                    )}
                    <div className="px-4 py-2 rounded-md border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
                      <p className="text-micro uppercase text-gray-500 dark:text-gray-400">
                        Rarity
                      </p>
                      <p className="text-body-sm font-semibold text-gray-900 dark:text-white capitalize">
                        {badge.rarity}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div
                    className="animate-slide-up motion-reduce:animate-none space-y-3"
                    style={{ animationDelay: '700ms' }}
                  >
                    {onClaim && (
                      <button
                        onClick={onClaim}
                        className={cn(
                          'w-full py-3.5 px-6 rounded-md font-semibold text-white',
                          'bg-primary-600 hover:bg-primary-700 transition-colors',
                          'flex items-center justify-center gap-2'
                        )}
                      >
                        <Zap className="h-5 w-5 shrink-0" strokeWidth={1.5} aria-hidden="true" />
                        Claim on Nostr
                      </button>
                    )}

                    <div className="flex gap-3">
                      <button
                        onClick={handleShare}
                        className={cn(
                          'flex-1 py-3 px-4 rounded-md font-medium',
                          'border border-gray-200 bg-white text-gray-700',
                          'dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300',
                          'transition-colors hover:border-gray-300 hover:bg-gray-50',
                          'dark:hover:border-gray-700 dark:hover:bg-gray-800',
                          'flex items-center justify-center gap-2'
                        )}
                      >
                        {isCopied ? (
                          <>
                            <Check
                              className="h-4 w-4 shrink-0 text-success-700 dark:text-success-400"
                              strokeWidth={1.5}
                              aria-hidden="true"
                            />
                            <span className="text-success-700 dark:text-success-400">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Share2 className="h-4 w-4 shrink-0" strokeWidth={1.5} aria-hidden="true" />
                            Share
                          </>
                        )}
                      </button>

                      <button
                        onClick={handleClose}
                        className={cn(
                          'flex-1 py-3 px-4 rounded-md font-medium',
                          'border border-gray-200 dark:border-gray-800',
                          'text-gray-600 dark:text-gray-400',
                          'transition-colors hover:border-gray-300 hover:bg-gray-50',
                          'dark:hover:border-gray-700 dark:hover:bg-gray-800'
                        )}
                      >
                        Maybe Later
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
      )}
    </>
  );
}

export default BadgeEarnedModal;
