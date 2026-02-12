import React, { useEffect, useRef, useState } from 'react';
import { cn } from '../../lib/utils';

// Fade In on Scroll component
interface FadeInProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  duration?: number;
  threshold?: number;
}

export function FadeIn({
  children,
  className,
  delay = 0,
  direction = 'up',
  duration = 500,
  threshold = 0.1,
}: FadeInProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin: '0px 0px -50px 0px' }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  const getInitialTransform = () => {
    switch (direction) {
      case 'up': return 'translateY(20px)';
      case 'down': return 'translateY(-20px)';
      case 'left': return 'translateX(20px)';
      case 'right': return 'translateX(-20px)';
      default: return 'translateY(20px)';
    }
  };

  return (
    <div
      ref={ref}
      className={cn(className)}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translate(0)' : getInitialTransform(),
        transition: `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// Staggered reveal container
interface StaggerContainerProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
  baseDelay?: number;
}

export function StaggerContainer({
  children,
  className,
  staggerDelay = 100,
  baseDelay = 0,
}: StaggerContainerProps) {
  const childArray = React.Children.toArray(children);

  return (
    <div className={className}>
      {childArray.map((child, index) => (
        <FadeIn
          key={index}
          delay={baseDelay + index * staggerDelay}
          className="stagger-item"
        >
          {child}
        </FadeIn>
      ))}
    </div>
  );
}

// Confetti celebration component
interface ConfettiPiece {
  id: string;
  x: number;
  color: string;
  rotation: number;
  scale: number;
}

interface ConfettiProps {
  isActive: boolean;
  duration?: number;
  particleCount?: number;
  colors?: string[];
  onComplete?: () => void;
}

export function Confetti({
  isActive,
  duration = 2000,
  particleCount = 50,
  colors = ['#8B5CF6', '#22C55E', '#6366F1', '#F59E0B', '#FFFFFF'],
  onComplete,
}: ConfettiProps) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    if (isActive) {
      const newPieces: ConfettiPiece[] = Array.from({ length: particleCount }, (_, i) => ({
        id: `confetti-${i}`,
        x: Math.random() * 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        scale: 0.5 + Math.random() * 0.5,
      }));
      setPieces(newPieces);

      const timer = setTimeout(() => {
        setPieces([]);
        onComplete?.();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isActive, duration, particleCount, colors, onComplete]);

  if (pieces.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="absolute top-full"
          style={{
            left: `${piece.x}%`,
            width: '8px',
            height: '8px',
            backgroundColor: piece.color,
            transform: `rotate(${piece.rotation}deg) scale(${piece.scale})`,
            animation: `confetti-fall ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`,
          }}
        />
      ))}
    </div>
  );
}

// Loading skeleton components
interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circle' | 'rect';
  width?: string | number;
  height?: string | number;
}

export function Skeleton({
  className,
  variant = 'text',
  width,
  height,
}: SkeletonProps) {
  const baseStyles = 'animate-pulse rounded bg-gray-200 dark:bg-gray-800';

  const styles = {
    text: 'h-4 w-3/4',
    circle: 'rounded-full',
    rect: '',
  };

  return (
    <div
      className={cn(baseStyles, styles[variant], className)}
      style={{
        width: width ?? (variant === 'circle' ? height : undefined),
        height,
      }}
    />
  );
}

interface SkeletonCardProps {
  lines?: number;
  className?: string;
}

export function SkeletonCard({ lines = 3, className }: SkeletonCardProps) {
  return (
    <div className={cn('rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900', className)}>
      <Skeleton variant="text" className="mb-4 h-6 w-1/2" />
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton
            key={i}
            variant="text"
            className={cn('h-4', i === lines - 1 && 'w-2/3')}
          />
        ))}
      </div>
    </div>
  );
}

// Loading spinner
interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Spinner({ size = 'md', className }: SpinnerProps) {
  const sizes = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4',
  };

  return (
    <div
      className={cn(
        'animate-spin rounded-full border-primary-500 border-t-transparent',
        sizes[size],
        className
      )}
    />
  );
}

// Typing indicator (for chat/AI features)
interface TypingIndicatorProps {
  className?: string;
}

export function TypingIndicator({ className }: TypingIndicatorProps) {
  return (
    <div className={cn('flex items-center gap-1', className)}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
          style={{
            animationDelay: `${i * 200}ms`,
            animationDuration: '1.4s',
          }}
        />
      ))}
    </div>
  );
}

// Page loading overlay
interface PageLoaderProps {
  isLoading: boolean;
  message?: string;
}

export function PageLoader({ isLoading, message = 'Loading...' }: PageLoaderProps) {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm dark:bg-gray-900/90">
      <Spinner size="lg" />
      <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">{message}</p>
    </div>
  );
}
