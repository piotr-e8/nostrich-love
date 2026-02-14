import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface UploadScreenProps {
  onClose: () => void;
  onUpload: (mediaUrl: string, caption: string) => void;
}

export function UploadScreen({ onClose, onUpload }: UploadScreenProps) {
  const [caption, setCaption] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const samplePhotos = [
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=300&h=300&fit=crop',
  ];

  const handleUpload = () => {
    if (selectedPhoto) {
      onUpload(selectedPhoto, caption);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="olas-upload fixed inset-0 z-50 bg-black flex flex-col"
      data-tour="olas-upload"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-black">
        <button onClick={onClose} className="text-white p-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <span className="text-white font-semibold">New Post</span>
        <button
          onClick={handleUpload}
          disabled={!selectedPhoto}
          className={`px-4 py-1.5 rounded-lg font-semibold text-sm transition-colors ${
            selectedPhoto
              ? 'bg-[#FF6B6B] text-white'
              : 'bg-gray-700 text-gray-500'
          }`}
        >
          Share
        </button>
      </div>

      {/* Preview Area */}
      <div className="flex-1 flex items-center justify-center bg-gray-900">
        {selectedPhoto ? (
          <img src={selectedPhoto} alt="Selected" className="max-h-full max-w-full object-contain" />
        ) : (
          <div className="text-center text-gray-500">
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-lg">Select a photo to share</p>
          </div>
        )}
      </div>

      {/* Caption Input */}
      {selectedPhoto && (
        <div className="bg-white px-4 py-3">
          <input
            type="text"
            placeholder="Write a caption..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="w-full py-2 text-base focus:outline-none"
            autoFocus
          />
        </div>
      )}

      {/* Photo Gallery */}
      <div className="bg-white border-t border-gray-200">
        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100">
          <span className="text-sm font-semibold text-gray-700">Gallery</span>
          <button className="text-[#FF6B6B] text-sm font-medium">Camera</button>
        </div>
        <div className="grid grid-cols-3 gap-0.5 max-h-48 overflow-y-auto">
          {samplePhotos.map((photo, index) => (
            <button
              key={index}
              onClick={() => setSelectedPhoto(photo)}
              className={`relative aspect-square ${
                selectedPhoto === photo ? 'ring-2 ring-[#FF6B6B]' : ''
              }`}
            >
              <img src={photo} alt={`Gallery ${index}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
