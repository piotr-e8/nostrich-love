import React from 'react';

interface Story {
  id: string;
  username: string;
  avatar: string;
  hasStory: boolean;
}

interface StoryRowProps {
  stories: Story[];
}

export function StoryRow({ stories }: StoryRowProps) {
  return (
    <div
      className="olas-stories flex gap-4 px-4 py-4 overflow-x-auto border-b border-gray-100"
      data-tour="olas-stories"
    >
      {stories.map((story) => (
        <button
          key={story.id}
          className="flex-shrink-0 flex flex-col items-center gap-1"
        >
          <div
            className={`olas-story-ring ${!story.hasStory ? 'olas-story-ring viewed' : ''}`}
          >
            <img
              src={story.avatar}
              alt={story.username}
              className="olas-story-avatar w-16 h-16"
            />
          </div>
          <span className="text-xs text-gray-700 truncate max-w-[64px]">
            {story.username}
          </span>
        </button>
      ))}
    </div>
  );
}
