/**
 * BadgeEarnedModalListener
 * 
 * Wrapper component that listens for badge-earned events and displays the modal
 */

import React, { useEffect, useState } from 'react';
import { BadgeEarnedModal } from './BadgeEarnedModal';
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

    window.addEventListener('badge-earned', handleBadgeEarned as EventListener);

    return () => {
      window.removeEventListener('badge-earned', handleBadgeEarned as EventListener);
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
