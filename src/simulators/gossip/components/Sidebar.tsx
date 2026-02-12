import React, { useRef, useEffect, useState } from 'react';
import type { GossipView } from '../GossipSimulator';

interface SidebarProps {
  activeView: GossipView;
  onNavigate: (view: GossipView) => void;
  onCompose: () => void;
  width: number;
  onResize: (width: number) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  onNavigate,
  onCompose,
  width,
  onResize,
}) => {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [isResizing, setIsResizing] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const newWidth = Math.max(200, Math.min(400, e.clientX));
      onResize(newWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, onResize]);

  const navItems = [
    { id: 'feed' as GossipView, label: 'Feed', icon: HomeIcon, shortcut: '⌘1' },
    { id: 'people' as GossipView, label: 'People', icon: PeopleIcon, shortcut: '⌘2' },
    { id: 'relays' as GossipView, label: 'Relays', icon: RelayIcon, shortcut: '⌘3' },
    { id: 'settings' as GossipView, label: 'Settings', icon: SettingsIcon, shortcut: '⌘,' },
  ];

  return (
    <aside
      ref={sidebarRef}
      className="gossip-sidebar"
      style={{ width: `${width}px` }}
    >
      <div className="gossip-sidebar-header">
        <div className="gossip-logo">
          <div className="gossip-logo-icon">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
            </svg>
          </div>
          <span>Gossip</span>
        </div>
      </div>

      <button className="gossip-compose-btn" onClick={onCompose}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 4v16m8-8H4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Compose
      </button>

      <nav className="gossip-nav">
        <div className="gossip-nav-section">
          <div className="gossip-nav-section-title">Navigation</div>
          {navItems.map((item) => (
            <div
              key={item.id}
              className={`gossip-nav-item ${activeView === item.id ? 'active' : ''}`}
              onClick={() => onNavigate(item.id)}
            >
              <item.icon />
              <span>{item.label}</span>
              <span className="gossip-nav-keyboard">{item.shortcut}</span>
            </div>
          ))}
        </div>
      </nav>

      <div className="gossip-sidebar-footer">
        <div className="gossip-user-mini">
          <img src="/simulators/avatars/avatar-1.svg" alt="Current user" />
          <div className="gossip-user-mini-info">
            <div className="gossip-user-mini-name">Nostr User</div>
            <div className="gossip-user-mini-handle">@nostruser</div>
          </div>
        </div>
      </div>

      <div
        className="gossip-sidebar-resize-handle"
        onMouseDown={() => setIsResizing(true)}
      />
    </aside>
  );
};

const HomeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" strokeLinecap="round" strokeLinejoin="round"/>
    <polyline points="9 22 9 12 15 12 15 22" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const PeopleIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="9" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const RelayIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const SettingsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 1v6m0 6v6m4.22-10.22l4.24-4.24M6.34 17.66l-4.24 4.24M23 12h-6m-6 0H1m20.24 4.24l-4.24-4.24M6.34 6.34L2.1 2.1" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default Sidebar;
