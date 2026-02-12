import React from 'react';
import type { MockUser } from '../../../data/mock';

interface PeopleScreenProps {
  users: MockUser[];
  onViewProfile: (user: MockUser) => void;
}

export const PeopleScreen: React.FC<PeopleScreenProps> = ({
  users,
  onViewProfile,
}) => {
  return (
    <div className="gossip-people">
      <div className="gossip-header">
        <h2 className="gossip-header-title">People</h2>
        <div className="gossip-header-actions">
          <button className="gossip-header-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <circle cx="11" cy="11" r="8" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 21l-4.35-4.35" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Search
          </button>
        </div>
      </div>

      <div className="gossip-content">
        <div className="gossip-people-grid">
          {users.map((user) => (
            <div
              key={user.pubkey}
              className="gossip-person-card"
              onClick={() => onViewProfile(user)}
            >
              <div className="gossip-person-header">
                <img
                  src={user.avatar}
                  alt={user.username}
                  className="gossip-person-avatar"
                />
                <div className="gossip-person-info">
                  <div className="gossip-person-name">{user.displayName}</div>
                  <div className="gossip-person-handle">@{user.username}</div>
                </div>
              </div>
              <div className="gossip-person-bio">{user.bio || 'No bio yet.'}</div>
              <div className="gossip-person-stats">
                <span>{user.following?.length || 0} following</span>
                <span>{user.followers || 0} followers</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PeopleScreen;
