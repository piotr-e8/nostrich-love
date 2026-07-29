/**
 * BadgeEarnedModal Component
 * 
 * Modal that appears when a user earns a badge
 * Features celebration effects, badge display, and action buttons
 */

import React, { useEffect, useState, useRef } from 'react';
import { X, Share2, Award, Sparkles, Zap, Check } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import type { BadgeEarnedModalProps } from './types';

const EXIT_DURATION_MS = 300;

// Confetti particle component
interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  rotation: number;
  scale: number;
}

const ConfettiEffect: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (isActive) {
      const colors = ['#8B5CF6', '#FFD700', '#22C55E', '#F59E0B', '#EC4899', '#3B82F6'];
      const newParticles: Particle[] = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: -10 - Math.random() * 20,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        scale: 0.5 + Math.random() * 0.5,
      }));
      setParticles(newParticles);

      const timer = setTimeout(() => setParticles([]), 3000);
      return () => clearTimeout(timer);
    }
  }, [isActive]);

  if (particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[60] overflow-hidden">
      <style>{`
        @keyframes badge-confetti-fall {
          from {
            transform: translateY(0) rotate(var(--confetti-rot)) scale(var(--confetti-scale));
            opacity: 1;
          }
          to {
            transform: translateY(140vh) rotate(calc(var(--confetti-rot) + 360deg)) scale(var(--confetti-scale));
            opacity: 0;
          }
        }
        .badge-confetti-particle {
          animation: badge-confetti-fall var(--confetti-duration) ease-out both;
        }
        @media (prefers-reduced-motion: reduce) {
          .badge-confetti-particle { animation: none; opacity: 0; }
        }
      `}</style>
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="badge-confetti-particle absolute w-3 h-3 rounded-sm"
          style={
            {
              backgroundColor: particle.color,
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              '--confetti-rot': `${particle.rotation}deg`,
              '--confetti-scale': particle.scale,
              '--confetti-duration': `${2 + Math.random()}s`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
};

export function BadgeEarnedModal({
  isOpen,
  badge,
  onClose,
  onClaim,
  showConfetti = true,
}: BadgeEarnedModalProps) {
  const [isCopied, setIsCopied] = useState(false);

  // Timed-exit idiom (StreakBanner): content mounts in its hidden state,
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
                'fixed inset-0 bg-black/60 backdrop-blur-sm z-50',
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
                  'relative w-full max-w-md bg-white dark:bg-gray-800',
                  'rounded-3xl shadow-2xl overflow-hidden pointer-events-auto',
                  'border border-gray-200 dark:border-gray-700'
                )}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header Gradient */}
                <div className="relative h-32 bg-gradient-to-br from-friendly-purple via-purple-600 to-friendly-gold overflow-hidden">
                  {/* Animated Background: oversized gold glow shuttling side to
                      side (CSS can't tween a radial-gradient's center, so we
                      move the element instead). */}
                  <div
                    className="badge-modal-shimmer absolute -left-[30%] top-0 h-full w-[160%]"
                    style={{
                      background:
                        'radial-gradient(circle at 50% 50%, rgba(255,215,0,0.3) 0%, transparent 35%)',
                    }}
                    aria-hidden="true"
                  />
                  <style>{`
                    @keyframes badge-modal-shimmer-kf {
                      0%, 100% { transform: translateX(-18%); }
                      50% { transform: translateX(18%); }
                    }
                    .badge-modal-shimmer {
                      animation: badge-modal-shimmer-kf 4s ease-in-out infinite;
                    }
                    @media (prefers-reduced-motion: reduce) {
                      .badge-modal-shimmer { animation: none; }
                    }
                  `}</style>
                  
                  {/* Sparkles */}
                  <div className="absolute top-4 left-4">
                    <Sparkles className="w-6 h-6 text-white/50" />
                  </div>
                  <div className="absolute top-6 right-8">
                    <Sparkles className="w-4 h-4 text-white/30" />
                  </div>
                  <div className="absolute bottom-4 right-4">
                    <Zap className="w-5 h-5 text-friendly-gold" />
                  </div>

                  {/* Close Button */}
                  <button
                    onClick={handleClose}
                    className={cn(
                      'absolute top-4 right-4 p-2 rounded-xl',
                      'bg-white/10 hover:bg-white/20 backdrop-blur-sm',
                      'transition-all focus:outline-none focus:ring-2 focus:ring-white/50'
                    )}
                    aria-label="Close modal"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>

                {/* Badge Icon */}
                <div className="relative -mt-16 flex justify-center">
                  <div
                    className={cn(
                      'animate-spin-in motion-reduce:animate-none',
                      'w-32 h-32 rounded-3xl flex items-center justify-center',
                      'bg-white dark:bg-gray-700 shadow-2xl',
                      'border-4 border-friendly-gold'
                    )}
                    style={{ animationDelay: '200ms' }}
                  >
                    <div className="animate-streak-wiggle motion-reduce:animate-none text-6xl">
                      {badge.emoji}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="px-8 pb-8 pt-4 text-center">
                  {/* Congratulations Text */}
                  <div
                    className="animate-slide-up motion-reduce:animate-none"
                    style={{ animationDelay: '300ms' }}
                  >
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-friendly-gold/10 rounded-full mb-4">
                      <Award className="w-4 h-4 text-friendly-gold" />
                      <span className="text-sm font-semibold text-friendly-gold uppercase tracking-wide">
                        Badge Earned!
                      </span>
                    </div>
                  </div>

                  <h2
                    id="badge-earned-title"
                    className="animate-slide-up motion-reduce:animate-none text-2xl font-bold text-gray-900 dark:text-white mb-2"
                    style={{ animationDelay: '400ms' }}
                  >
                    {badge.name}
                  </h2>

                  <p
                    id="badge-earned-description"
                    className="animate-slide-up motion-reduce:animate-none text-gray-600 dark:text-gray-400 mb-6"
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
                      <div className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-xl">
                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">
                          Category
                        </p>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white capitalize">
                          {badge.category}
                        </p>
                      </div>
                    )}
                    <div className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-xl">
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">
                        Rarity
                      </p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white capitalize">
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
                          'w-full py-3.5 px-6 rounded-xl font-semibold text-white',
                          'bg-gradient-to-r from-friendly-purple to-purple-600',
                          'hover:from-purple-600 hover:to-purple-700',
                          'transition-all transform hover:scale-[1.02] active:scale-[0.98]',
                          'focus:outline-none focus:ring-2 focus:ring-friendly-purple focus:ring-offset-2',
                          'dark:focus:ring-offset-gray-800',
                          'flex items-center justify-center gap-2'
                        )}
                      >
                        <Zap className="w-5 h-5" />
                        Claim on Nostr
                      </button>
                    )}

                    <div className="flex gap-3">
                      <button
                        onClick={handleShare}
                        className={cn(
                          'flex-1 py-3 px-4 rounded-xl font-medium',
                          'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
                          'hover:bg-gray-200 dark:hover:bg-gray-600',
                          'transition-all flex items-center justify-center gap-2',
                          'focus:outline-none focus:ring-2 focus:ring-gray-400'
                        )}
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-4 h-4 text-green-500" />
                            <span className="text-green-600">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Share2 className="w-4 h-4" />
                            Share
                          </>
                        )}
                      </button>

                      <button
                        onClick={handleClose}
                        className={cn(
                          'flex-1 py-3 px-4 rounded-xl font-medium',
                          'border border-gray-300 dark:border-gray-600',
                          'text-gray-600 dark:text-gray-400',
                          'hover:bg-gray-50 dark:hover:bg-gray-700/50',
                          'transition-all',
                          'focus:outline-none focus:ring-2 focus:ring-gray-400'
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
