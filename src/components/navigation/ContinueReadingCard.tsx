import React, { useState, useEffect } from 'react';
import { BookOpen, ArrowRight, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { getLastViewedGuide, hasRecentProgress } from '../../lib/progress';

interface ContinueReadingCardProps {
  className?: string;
}

export function ContinueReadingCard({ className }: ContinueReadingCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [lastViewed, setLastViewed] = useState<ReturnType<typeof getLastViewedGuide>>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    if (hasRecentProgress()) {
      const lastGuide = getLastViewedGuide();
      setLastViewed(lastGuide);
      
      const dismissed = sessionStorage.getItem('nostrich-continue-reading-dismissed');
      if (!dismissed && lastGuide) {
        setIsVisible(true);
      }
    }
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    setIsVisible(false);
    sessionStorage.setItem('nostrich-continue-reading-dismissed', 'true');
  };

  const handleResume = () => {
    if (lastViewed?.slug) {
      window.location.href = `/guides/${lastViewed.slug}`;
    }
  };

  if (!mounted || !isVisible || isDismissed || !lastViewed) {
    return null;
  }

  // Calculate time since last viewed
  const timeSince = Date.now() - lastViewed.timestamp;
  const daysSince = Math.floor(timeSince / (1000 * 60 * 60 * 24));
  const hoursSince = Math.floor(timeSince / (1000 * 60 * 60));
  
  let timeText: string;
  if (daysSince > 0) {
    timeText = daysSince === 1 ? 'Yesterday' : `${daysSince} days ago`;
  } else if (hoursSince > 0) {
    timeText = hoursSince === 1 ? '1 hour ago' : `${hoursSince} hours ago`;
  } else {
    timeText = 'Recently';
  }

  return (
    <div 
      className={cn(
        'bg-gradient-to-r from-primary/5 to-secondary/5 dark:from-primary/10 dark:to-secondary/10 border border-primary/20 rounded-xl p-4 mb-8',
        className
      )}
    >
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
          <BookOpen className="w-5 h-5 text-primary" />
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Continue where you left off
          </p>
          <p className="font-medium text-gray-900 dark:text-white truncate">
            {lastViewed.title}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 dark:text-gray-500 hidden sm:inline">
            {timeText}
          </span>
          
          <button
            onClick={handleResume}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary hover:bg-primary/90 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Resume
            <ArrowRight className="w-4 h-4" />
          </button>
          
          <button
            onClick={handleDismiss}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
