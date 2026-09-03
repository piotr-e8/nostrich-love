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
  // getPrivacySettings() returns the module defaults outside the browser, so
  // the server-rendered switches start from the same values the code actually
  // ships (tracking ON). The real stored values arrive in the effect below;
  // until then `mounted` is false and the switches are not rendered at all, so
  // nobody sees a toggle claiming "off" while tracking is running.
  const [settings, setSettings] = useState<PrivacySettings>(getPrivacySettings);
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
  
  const runImport = (json: string) => {
    if (importProgressData(json)) {
      setMessage('Progress data imported successfully');
      setImportText('');
      setShowImport(false);
    } else {
      setMessage('Nothing was imported. Pick the nostrich-progress.json file you exported, or paste its full contents.');
    }
    setTimeout(() => setMessage(''), 6000);
  };

  const handleImport = () => runImport(importText);

  // The export hands the reader a file, so the import has to accept one (#51).
  // Pasting into the textarea stays as the fallback.
  const handleImportFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => runImport(typeof reader.result === 'string' ? reader.result : '');
    reader.onerror = () => {
      setMessage('That file could not be read. Try opening it and pasting the contents instead.');
      setTimeout(() => setMessage(''), 6000);
    };
    reader.readAsText(file);
  };

  const handleDelete = () => {
    deleteAllProgress();
    setSettings(getPrivacySettings());
    setShowDeleteConfirm(false);
    setMessage('All progress data deleted');
    setTimeout(() => setMessage(''), 3000);
  };
  
  // Before hydration we cannot know what this browser has stored, and a switch
  // drawn from a guess is a false statement about the reader's own data. Show
  // the frame without the switches until the stored values are in hand.
  if (!mounted) {
    return (
      <div
        className="max-w-2xl rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900"
        aria-busy="true"
      >
        <h3 className="mb-4 text-h3">Privacy &amp; Progress Settings</h3>
        <p className="text-body-sm text-gray-500 dark:text-gray-400">
          Reading your settings from this browser.
        </p>
        <div className="mt-6 space-y-4" aria-hidden="true">
          <div className="h-10 rounded-md bg-gray-100 dark:bg-gray-800" />
          <div className="h-10 rounded-md bg-gray-100 dark:bg-gray-800" />
          <div className="h-10 rounded-md bg-gray-100 dark:bg-gray-800" />
        </div>
        <noscript>
          <p className="mt-4 text-body-sm text-gray-500 dark:text-gray-400">
            These controls need JavaScript. With JavaScript off, nothing is stored
            about your progress in the first place.
          </p>
        </noscript>
      </div>
    );
  }

  return (
    <div className="max-w-2xl rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
      <h3 className="mb-4 text-h3">Privacy &amp; Progress Settings</h3>

      {message && (
        <div className="mb-4 rounded-md border border-gray-200 p-3 text-body-sm text-gray-700 dark:border-gray-800 dark:text-gray-300">
          {message}
        </div>
      )}
      
      {/* Progress Tracking Toggle */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h4 className="font-medium">Progress Tracking</h4>
            <p className="text-body-sm text-gray-500 dark:text-gray-400">
              On by default. Records the guides you finish, your streak and your
              badges, all inside this browser. Switch it off and nothing new is
              written.
            </p>
          </div>
          <button
            onClick={handleToggleTracking}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.trackingEnabled ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-700'
            }`}
            role="switch"
            aria-checked={settings.trackingEnabled}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform motion-reduce:transition-none ${
                settings.trackingEnabled ? 'translate-x-6 rtl:-translate-x-6' : 'translate-x-1 rtl:-translate-x-1'
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
            <p className="text-body-sm text-gray-500 dark:text-gray-400">
              Show the reading progress bar at the top of a guide
            </p>
          </div>
          <button
            onClick={handleToggleIndicators}
            disabled={!settings.trackingEnabled}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.showProgressIndicators && settings.trackingEnabled
                ? 'bg-primary-600'
                : 'bg-gray-300 dark:bg-gray-700'
            } ${!settings.trackingEnabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            role="switch"
            aria-checked={settings.showProgressIndicators}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform motion-reduce:transition-none ${
                settings.showProgressIndicators && settings.trackingEnabled
                  ? 'translate-x-6 rtl:-translate-x-6'
                  : 'translate-x-1 rtl:-translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Data Retention: the select that used to sit here offered "Session only
          (no storage)" and 30/90 day expiry, and none of it reached the store
          that actually holds progress. saveGamificationData() in
          utils/gamification.ts is the writer for completions, badges, streak
          and quiz results, and it consults only the tracking toggle, so a
          reader who picked "no storage" still had every finished guide written
          to localStorage. Removed rather than relabelled (#19); it can come
          back the day that writer enforces retention. */}

      {/* Data Export/Import */}
      <div className="mb-6">
        <h4 className="font-medium mb-2">Data Portability</h4>
        <div className="flex gap-3 mb-3">
          <button
            onClick={handleExport}
            className="rounded-md border border-gray-200 px-4 py-2 text-body-sm font-medium transition-colors hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800"
          >
            Export Progress Data
          </button>
          <button
            onClick={() => setShowImport(!showImport)}
            className="rounded-md border border-gray-200 px-4 py-2 text-body-sm font-medium transition-colors hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800"
          >
            Import Progress Data
          </button>
        </div>
        
        {showImport && (
          <div className="mt-3">
            <label className="mb-2 block text-body-sm text-gray-600 dark:text-gray-300">
              Choose the file you exported
              <input
                type="file"
                accept="application/json,.json"
                onChange={handleImportFile}
                className="mt-1 block w-full text-body-sm file:me-3 file:rounded-md file:border-0 file:bg-gray-100 file:px-3 file:py-2 file:text-sm file:font-medium dark:file:bg-gray-800"
              />
            </label>
            <p className="mb-2 text-body-sm text-gray-500 dark:text-gray-400">
              Or paste its contents:
            </p>
            <textarea
              aria-label="Paste exported progress data"
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder="Paste your exported progress data here..."
              className="h-32 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-body-sm dark:border-gray-700 dark:bg-gray-800"
            />
            <button
              onClick={handleImport}
              disabled={!importText.trim()}
              className="mt-2 rounded-md bg-primary-600 px-4 py-2 text-body-sm font-medium text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Import
            </button>
          </div>
        )}
      </div>
      
      {/* Delete Data */}
      <div>
        <h4 className="mb-2 font-medium text-danger-700 dark:text-danger-400">Delete All Data</h4>
        <p className="mb-3 text-body-sm text-gray-500 dark:text-gray-400">
          Permanently remove all progress data from this device
        </p>
        
        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="rounded-md border border-danger-300 px-4 py-2 text-body-sm font-medium text-danger-700 transition-colors hover:bg-danger-50 dark:border-danger-800 dark:text-danger-400 dark:hover:bg-danger-950"
          >
            Delete All Progress Data
          </button>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={handleDelete}
              className="rounded-md bg-danger-600 px-4 py-2 text-body-sm font-medium text-white transition-colors hover:bg-danger-700"
            >
              Yes, Delete Everything
            </button>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="rounded-md border border-gray-200 px-4 py-2 text-body-sm font-medium transition-colors hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
      
      {/* Privacy Note */}
      <div className="mt-6 border-t border-gray-200 pt-4 dark:border-gray-800">
        <p className="text-caption text-gray-500 dark:text-gray-400">
          Your progress data is written to this browser's local storage and is
          never sent to a server. Clearing your browser data clears it too, which
          is why the export exists.
        </p>
      </div>
    </div>
  );
}