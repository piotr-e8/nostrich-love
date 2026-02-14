/**
 * BadgeEarnedModal Component
 * 
 * Modal that appears when a user earns a badge
 * Features celebration effects, badge display, and action buttons
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Share2, Award, Sparkles, Zap, Check } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { BadgeEarnedModalProps } from './types';

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
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          initial={{
            x: `${particle.x}%`,
            y: `${particle.y}%`,
            rotate: particle.rotation,
            scale: particle.scale,
            opacity: 1,
          }}
          animate={{
            y: '120%',
            rotate: particle.rotation + 360,
            opacity: 0,
          }}
          transition={{
            duration: 2 + Math.random() * 1,
            ease: 'easeOut',
          }}
          className="absolute w-3 h-3 rounded-sm"
          style={{
            backgroundColor: particle.color,
          }}
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

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

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

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              onClick={onClose}
              aria-hidden="true"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 25,
              }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
              role="dialog"
              aria-modal="true"
              aria-labelledby="badge-earned-title"
              aria-describedby="badge-earned-description"
            >
              <div
                className={cn(
                  'relative w-full max-w-md bg-white dark:bg-gray-800',
                  'rounded-3xl shadow-2xl overflow-hidden pointer-events-auto',
                  'border border-gray-200 dark:border-gray-700'
                )}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header Gradient */}
                <div className="relative h-32 bg-gradient-to-br from-friendly-purple via-purple-600 to-friendly-gold overflow-hidden">
                  {/* Animated Background Elements */}
                  <motion.div
                    className="absolute inset-0"
                    animate={{
                      background: [
                        'radial-gradient(circle at 20% 50%, rgba(255,215,0,0.3) 0%, transparent 50%)',
                        'radial-gradient(circle at 80% 50%, rgba(255,215,0,0.3) 0%, transparent 50%)',
                        'radial-gradient(circle at 20% 50%, rgba(255,215,0,0.3) 0%, transparent 50%)',
                      ],
                    }}
                    transition={{ duration: 4, repeat: Infinity }}
                  />
                  
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
                    onClick={onClose}
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
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                      type: 'spring',
                      stiffness: 200,
                      damping: 15,
                      delay: 0.2,
                    }}
                    className={cn(
                      'w-32 h-32 rounded-3xl flex items-center justify-center',
                      'bg-white dark:bg-gray-700 shadow-2xl',
                      'border-4 border-friendly-gold'
                    )}
                  >
                    <motion.div
                      animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatType: 'reverse',
                      }}
                      className="text-6xl"
                    >
                      {badge.emoji}
                    </motion.div>
                  </motion.div>
                </div>

                {/* Content */}
                <div className="px-8 pb-8 pt-4 text-center">
                  {/* Congratulations Text */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-friendly-gold/10 rounded-full mb-4">
                      <Award className="w-4 h-4 text-friendly-gold" />
                      <span className="text-sm font-semibold text-friendly-gold uppercase tracking-wide">
                        Badge Earned!
                      </span>
                    </div>
                  </motion.div>

                  <motion.h2
                    id="badge-earned-title"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-2xl font-bold text-gray-900 dark:text-white mb-2"
                  >
                    {badge.name}
                  </motion.h2>

                  <motion.p
                    id="badge-earned-description"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-gray-600 dark:text-gray-400 mb-6"
                  >
                    {badge.description}
                  </motion.p>

                  {/* Badge Details */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="flex justify-center gap-4 mb-8"
                  >
                    <div className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-xl">
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">
                        Category
                      </p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white capitalize">
                        {badge.category}
                      </p>
                    </div>
                    <div className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-xl">
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">
                        Rarity
                      </p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white capitalize">
                        {badge.rarity}
                      </p>
                    </div>
                  </motion.div>

                  {/* Action Buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="space-y-3"
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
                        onClick={onClose}
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
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default BadgeEarnedModal;
