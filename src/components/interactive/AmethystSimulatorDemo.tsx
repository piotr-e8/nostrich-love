/**
 * Amethyst Simulator Demo Page
 * 
 * This page showcases the Amethyst Material Design 3 simulator
 * in a full-screen mobile-like container.
 */

import React from 'react';
import { AmethystSimulator } from '../../simulators/amethyst';

export function AmethystSimulatorDemo() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900 p-4 md:p-8">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
          Amethyst Simulator
        </h1>
        <p className="text-purple-200">
          Material Design 3 Nostr Client Experience
        </p>
      </div>

      {/* Simulator Container */}
      <div className="max-w-md mx-auto">
        <AmethystSimulator />
      </div>

      {/* Features List */}
      <div className="max-w-2xl mx-auto mt-12 grid grid-cols-2 md:grid-cols-3 gap-4 text-white/80 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full" />
          <span>7 Screens</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full" />
          <span>Material Design 3</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full" />
          <span>Dark/Light Themes</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full" />
          <span>Mock Data Integration</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full" />
          <span>Interactive Components</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full" />
          <span>Smooth Animations</span>
        </div>
      </div>
    </div>
  );
}

export default AmethystSimulatorDemo;
