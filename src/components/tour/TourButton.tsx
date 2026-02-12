/**
 * Tour Button Component
 * A button to manually start/restart tours from anywhere in the app
 */

import React from 'react';
import { HelpCircle, RotateCcw, Play } from 'lucide-react';
import { useTour } from './TourProvider';
import type { TourConfig } from './types';
import { hasCompletedTour, hasSkippedTour, shouldAutoStartTour } from './tourStorage';

interface TourButtonProps {
  tourConfig: TourConfig;
  variant?: 'primary' | 'secondary' | 'ghost' | 'icon';
  size?: 'sm' | 'md' | 'lg';
  showStatus?: boolean;
  className?: string;
}

export function TourButton({
  tourConfig,
  variant = 'secondary',
  size = 'md',
  showStatus = true,
  className = '',
}: TourButtonProps) {
  const { startTour, restartTour, state } = useTour();

  // Check tour status
  const isCompleted = hasCompletedTour(tourConfig.id);
  const isSkipped = hasSkippedTour(tourConfig.id);
  const isNew = shouldAutoStartTour(tourConfig.id);

  const handleClick = () => {
    if (state.isActive) {
      restartTour();
    } else if (isCompleted || isSkipped) {
      restartTour();
    } else {
      startTour(tourConfig);
    }
  };

  const getIcon = () => {
    if (isCompleted) return <RotateCcw size={size === 'sm' ? 14 : size === 'lg' ? 22 : 18} />;
    if (isSkipped) return <RotateCcw size={size === 'sm' ? 14 : size === 'lg' ? 22 : 18} />;
    return <Play size={size === 'sm' ? 14 : size === 'lg' ? 22 : 18} />;
  };

  const getLabel = () => {
    if (isCompleted) return 'Retake Tour';
    if (isSkipped) return 'Resume Tour';
    if (isNew) return 'Start Tour';
    return 'Restart Tour';
  };

  const sizeClasses = {
    sm: 'tour-btn-sm',
    md: 'tour-btn-md',
    lg: 'tour-btn-lg',
  };

  const variantClasses = {
    primary: 'tour-btn-primary',
    secondary: 'tour-btn-secondary',
    ghost: 'tour-btn-ghost',
    icon: 'tour-btn-icon',
  };

  return (
    <button
      className={`tour-btn ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      onClick={handleClick}
      title={getLabel()}
      aria-label={getLabel()}
    >
      {variant === 'icon' ? (
        <HelpCircle size={size === 'sm' ? 16 : size === 'lg' ? 24 : 20} />
      ) : (
        <>
          {getIcon()}
          <span>{getLabel()}</span>
          {showStatus && isNew && (
            <span className="tour-btn-badge tour-btn-badge--new">New</span>
          )}
        </>
      )}
    </button>
  );
}

export default TourButton;
