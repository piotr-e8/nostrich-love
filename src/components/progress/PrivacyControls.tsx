import React, { useState, useEffect } from 'react';
import type { PrivacySettings } from '../../lib/progressService';
import {
  getPrivacySettings,
  updatePrivacySettings,
  deleteAllProgress,
  exportProgressData,
  importProgressData,
} from '../../lib/progressService';

export function PrivacyControls() {
  const [settings, setSettings] = useState<PrivacySettings>({
    trackingEnabled: false,
    dataRetention: 'forever',
    showProgressIndicators: false,
    toursEnabled: false,
  });
  const [mounted, setMounted] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [importText, setImportText] = useState('');
  const [showImport, setShowImport] = useState(false);
  const [message, setMessage] = useState('');
  
  useEffect(() => {
    setMounted(true);
    setSettings(getPrivacySettings());
  }, []);
  
  const handleToggleTracking = () => {
    const updated = { ...settings, trackingEnabled: !settings.trackingEnabled };
    updatePrivacySettings(updated);
    setSettings(updated);
    setMessage(updated.trackingEnabled ? 'Tracking enabled' : 'Tracking disabled');
    setTimeout(() => setMessage(''), 3000);
  };
  
  const handleToggleIndicators = () => {
    const updated = { ...settings, showProgressIndicators: !settings.showProgressIndicators };
    updatePrivacySettings(updated);
    setSettings(updated);
    setMessage(updated.showProgressIndicators ? 'Progress indicators enabled' : 'Progress indicators disabled');
    setTimeout(() => setMessage(''), 3000);
  };
  
  const handleToggleTours = () => {
    const updated = { ...settings, toursEnabled: !settings.toursEnabled };
    updatePrivacySettings(updated);
    setSettings(updated);
    setMessage(updated.toursEnabled ? 'Client tours enabled' : 'Client tours disabled');
    setTimeout(() => setMessage(''), 3000);
  };
  
  const handleRetentionChange = (retention: PrivacySettings['dataRetention']) => {
    const updated = { ...settings, dataRetention: retention };
    updatePrivacySettings(updated);
    setSettings(updated);
  };
  
  const handleExport = () => {
    const data = exportProgressData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'nostrich-progress.json';
    a.click();
    URL.revokeObjectURL(url);
    setMessage('Progress data exported');
    setTimeout(() => setMessage(''), 3000);
  };
  
  const handleImport = () => {
    if (importProgressData(importText)) {
      setMessage('Progress data imported successfully');
      setImportText('');
      setShowImport(false);
    } else {
      setMessage('Failed to import data. Please check the format.');
    }
    setTimeout(() => setMessage(''), 3000);
  };
  
  const handleDelete = () => {
    deleteAllProgress();
    setSettings(getPrivacySettings());
    setShowDeleteConfirm(false);
    setMessage('All progress data deleted');
    setTimeout(() => setMessage(''), 3000);
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 max-w-2xl">
      <h3 className="text-lg font-semibold mb-4">Privacy & Progress Settings</h3>
      
      {message && (
        <div className="mb-4 p-3 bg-primary/10 text-primary rounded-md text-sm">
          {message}
        </div>
      )}
      
      {/* Progress Tracking Toggle */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h4 className="font-medium">Progress Tracking</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Track your learning progress locally on this device
            </p>
          </div>
          <button
            onClick={handleToggleTracking}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.trackingEnabled ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
            }`}
            role="switch"
            aria-checked={settings.trackingEnabled}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.trackingEnabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>
      
      {/* Progress Indicators Toggle */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h4 className="font-medium">Show Progress Indicators</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Display "Guide X of Y" and reading progress bar
            </p>
          </div>
          <button
            onClick={handleToggleIndicators}
            disabled={!settings.trackingEnabled}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.showProgressIndicators && settings.trackingEnabled
                ? 'bg-primary'
                : 'bg-gray-300 dark:bg-gray-600'
            } ${!settings.trackingEnabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            role="switch"
            aria-checked={settings.showProgressIndicators}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.showProgressIndicators && settings.trackingEnabled
                  ? 'translate-x-6'
                  : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Client Tours Toggle */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h4 className="font-medium">Client Simulator Tours</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enable interactive guided tours for Nostr client simulators
            </p>
          </div>
          <button
            onClick={handleToggleTours}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.toursEnabled ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
            }`}
            role="switch"
            aria-checked={settings.toursEnabled}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.toursEnabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>
      
      {/* Data Retention */}
      <div className="mb-6">
        <h4 className="font-medium mb-2">Data Retention</h4>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
          How long to keep your progress data
        </p>
        <select
          value={settings.dataRetention}
          onChange={(e) => handleRetentionChange(e.target.value as PrivacySettings['dataRetention'])}
          disabled={!settings.trackingEnabled}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 disabled:opacity-50"
        >
          <option value="forever">Keep forever</option>
          <option value="90d">Delete after 90 days</option>
          <option value="30d">Delete after 30 days</option>
          <option value="session">Session only (no storage)</option>
        </select>
      </div>
      
      {/* Data Export/Import */}
      <div className="mb-6">
        <h4 className="font-medium mb-2">Data Portability</h4>
        <div className="flex gap-3 mb-3">
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md text-sm font-medium transition-colors"
          >
            Export Progress Data
          </button>
          <button
            onClick={() => setShowImport(!showImport)}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md text-sm font-medium transition-colors"
          >
            Import Progress Data
          </button>
        </div>
        
        {showImport && (
          <div className="mt-3">
            <textarea
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder="Paste your exported progress data here..."
              className="w-full h-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-sm"
            />
            <button
              onClick={handleImport}
              disabled={!importText.trim()}
              className="mt-2 px-4 py-2 bg-primary text-white rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
            >
              Import
            </button>
          </div>
        )}
      </div>
      
      {/* Delete Data */}
      <div>
        <h4 className="font-medium mb-2 text-red-600 dark:text-red-400">Delete All Data</h4>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
          Permanently remove all progress data from this device
        </p>
        
        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="px-4 py-2 border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 rounded-md text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            Delete All Progress Data
          </button>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
            >
              Yes, Delete Everything
            </button>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-md text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
      
      {/* Privacy Note */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Your privacy matters. All progress data is stored locally in your browser. 
          No data is sent to any server. You have complete control over your information.
        </p>
      </div>
    </div>
  );
}