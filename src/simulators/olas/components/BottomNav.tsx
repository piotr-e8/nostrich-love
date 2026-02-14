import React from 'react';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navItems = [
  { id: 'home', icon: 'home', label: 'Home' },
  { id: 'discover', icon: 'discover', label: 'Discover' },
  { id: 'upload', icon: 'upload', label: 'Upload', isFab: true },
  { id: 'notifications', icon: 'notifications', label: 'Notifications' },
  { id: 'profile', icon: 'profile', label: 'Profile' },
];

const icons = {
  home: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  discover: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  upload: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  ),
  notifications: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  ),
  profile: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
};

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav className="olas-bottom-nav fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 pb-safe z-50">
      <div className="flex items-center justify-around h-14 max-w-md mx-auto">
        {navItems.map((item) => {
          if (item.isFab) {
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className="olas-upload-fab -mt-6 flex items-center justify-center"
                data-tour="olas-upload"
              >
                {icons[item.icon as keyof typeof icons]}
              </button>
            );
          }

          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`olas-nav-item flex flex-col items-center justify-center w-14 h-full ${
                isActive ? 'active' : ''
              }`}
            >
              <div className={`transition-transform duration-150 ${isActive ? 'scale-110' : ''}`}>
                {icons[item.icon as keyof typeof icons]}
              </div>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
