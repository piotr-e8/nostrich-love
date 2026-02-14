import React from 'react';
import { motion } from 'framer-motion';

export function MiniAppsScreen() {
  const apps = [
    {
      id: '1',
      name: 'Nostr Market',
      icon: '🛒',
      description: 'Buy and sell with Bitcoin',
      color: 'bg-purple-500',
    },
    {
      id: '2',
      name: 'Chess',
      icon: '♟️',
      description: 'Play chess with friends',
      color: 'bg-amber-600',
    },
    {
      id: '3',
      name: 'Nostrgram',
      icon: '📷',
      description: 'Image sharing on Nostr',
      color: 'bg-pink-500',
    },
    {
      id: '4',
      name: 'Wikistr',
      icon: '📚',
      description: 'Decentralized knowledge',
      color: 'bg-blue-500',
    },
    {
      id: '5',
      name: 'Zap Poll',
      icon: '📊',
      description: 'Create paid polls',
      color: 'bg-green-500',
    },
    {
      id: '6',
      name: 'BTC Map',
      icon: '🗺️',
      description: 'Find Bitcoin merchants',
      color: 'bg-orange-500',
    },
  ];

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-950" data-tour="keychat-apps">
      {/* Header */}
      <div className="bg-[#2D7FF9] text-white px-4 pt-12 pb-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Mini Apps</h1>
          <button className="p-2 rounded-full hover:bg-white/20 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
        <p className="text-white/80 text-sm mt-1">Apps built on Nostr</p>
      </div>

      {/* Apps Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-2 gap-4">
          {apps.map((app, index) => (
            <motion.button
              key={app.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white dark:bg-gray-900 rounded-2xl p-4 flex flex-col items-center text-center hover:shadow-lg transition-shadow"
            >
              <div className={`w-16 h-16 ${app.color} rounded-2xl flex items-center justify-center text-3xl mb-3 shadow-lg`}>
                {app.icon}
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">{app.name}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{app.description}</p>
            </motion.button>
          ))}
        </div>

        {/* Featured Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 text-white"
        >
          <h3 className="font-bold text-lg mb-2">Build Your Own App</h3>
          <p className="text-white/80 text-sm mb-4">
            Create a mini app for Keychat and reach thousands of Bitcoiners
          </p>
          <button className="bg-white text-purple-600 px-4 py-2 rounded-full text-sm font-semibold">
            Get Started
          </button>
        </motion.div>
      </div>
    </div>
  );
}
