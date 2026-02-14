import React from 'react';
import { StoryRow } from '../components/StoryRow';
import { MediaCard } from '../components/MediaCard';
import type { MockUser } from '../../../data/mock';

interface HomeScreenProps {
  currentUser: MockUser | null;
}

const mockStories = [
  { id: '1', username: 'Your story', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=you', hasStory: false },
  { id: '2', username: 'alice_photo', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=alice', hasStory: true },
  { id: '3', username: 'bob_snaps', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=bob', hasStory: true },
  { id: '4', username: 'carol_lens', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=carol', hasStory: true },
  { id: '5', username: 'dave_focus', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=dave', hasStory: false },
  { id: '6', username: 'eve_filter', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=eve', hasStory: true },
];

const mockMedia = [
  {
    id: '1',
    type: 'image' as const,
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=750&fit=crop',
    author: {
      name: 'alice_photo',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=alice',
    },
    likes: 234,
    caption: 'Mountain views 🏔️ #nature #photography',
    timestamp: '2h',
  },
  {
    id: '2',
    type: 'video' as const,
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=750&fit=crop',
    author: {
      name: 'bob_snaps',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=bob',
    },
    likes: 189,
    caption: 'Golden hour magic ✨',
    timestamp: '4h',
  },
  {
    id: '3',
    type: 'image' as const,
    url: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=600&h=750&fit=crop',
    author: {
      name: 'carol_lens',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=carol',
    },
    likes: 567,
    caption: 'Ocean vibes 🌊 #nostrphotography',
    timestamp: '6h',
  },
  {
    id: '4',
    type: 'image' as const,
    url: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=600&h=750&fit=crop',
    author: {
      name: 'dave_focus',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=dave',
    },
    likes: 92,
    caption: 'Morning light hitting just right 📸',
    timestamp: '8h',
  },
];

export function HomeScreen({ currentUser }: HomeScreenProps) {
  return (
    <div className="olas-feed bg-white" data-tour="olas-feed">
      {/* Stories Row */}
      <StoryRow stories={mockStories} />

      {/* Media Feed */}
      <div className="divide-y divide-gray-100">
        {mockMedia.map((media) => (
          <MediaCard
            key={media.id}
            type={media.type}
            url={media.url}
            author={media.author}
            likes={media.likes}
            caption={media.caption}
            timestamp={media.timestamp}
          />
        ))}
      </div>

      {/* End of Feed Indicator */}
      <div className="py-8 text-center text-gray-400 text-sm">
        <div className="w-8 h-8 mx-auto mb-2 rounded-full bg-gradient-to-br from-[#FF6B6B] to-[#FF8E53] opacity-50" />
        You're all caught up!
      </div>
    </div>
  );
}
