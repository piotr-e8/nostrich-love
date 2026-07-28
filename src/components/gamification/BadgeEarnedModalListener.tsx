/**
 * BadgeEarnedModalListener
 * 
 * Wrapper component that listens for badge-earned events and displays the modal
 */

import React, { useEffect, useState } from 'react';
import { BadgeEarnedModal } from './BadgeEarnedModal';
import { BADGE_EARNED_EVENT } from '../../utils/gamification';
import type { Badge } from './types';

export function BadgeEarnedModalListener() {
  const [isOpen, setIsOpen] = useState(false);
  const [badge, setBadge] = useState<Badge | null>(null);

  useEffect(() => {
    const handleBadgeEarned = (event: CustomEvent<Badge>) => {
      console.log('[Modal] Received badge:', event.detail);
      setBadge(event.detail);
      setIsOpen(true);
    };

    window.addEventListener(BADGE_EARNED_EVENT, handleBadgeEarned as EventListener);

    return () => {
      window.removeEventListener(BADGE_EARNED_EVENT, handleBadgeEarned as EventListener);
    };
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    setBadge(null);
  };

  return (
    <BadgeEarnedModal
      isOpen={isOpen}
      badge={badge}
      onClose={handleClose}
    />
  );
}

export default BadgeEarnedModalListener;
