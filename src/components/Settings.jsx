import { useState } from 'react';
import { STORAGE_KEYS } from '../utils/storage';

const Settings = ({ onDataReset }) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleReset = () => {
    localStorage.removeItem(STORAGE_KEYS.STREAK_DATA);
    onDataReset();
    setShowConfirm(false);
  };

  if (showConfirm) {
    return (
      <div className="zen-card p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4 text-center">
          Reset All Data?
        </h3>
        <p className="text-slate-600 text-sm mb-6 text-center">
          This will permanently delete your streak, sessions, and all meditation history. This action cannot be undone.
        </p>
        <div className="space-y-3">
          <button
            onClick={handleReset}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200"
          >
            Yes, Reset Everything
          </button>
          <button
            onClick={() => setShowConfirm(false)}
            className="w-full zen-button-secondary"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="zen-card p-6">
      <h3 className="text-lg font-semibold text-slate-800 mb-4 text-center">
        Settings
      </h3>
      <div className="space-y-3">
        <button
          onClick={() => setShowConfirm(true)}
          className="w-full zen-button-secondary text-red-600 hover:bg-red-50 border-red-200"
        >
          Reset All Data
        </button>
      </div>
    </div>
  );
};

export default Settings;