import React from 'react';

interface PhotoGridProps {
  photos: string[];
}

export function PhotoGrid({ photos }: PhotoGridProps) {
  return (
    <div className="olas-photo-grid">
      {photos.map((photo, index) => (
        <div key={index} className="olas-photo-item">
          <img src={photo} alt={`Photo ${index + 1}`} loading="lazy" />
        </div>
      ))}
    </div>
  );
}
