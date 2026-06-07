import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { getApiKey, setApiKey, isGeminiConfigured } from '../utils/geminiApi';

// SettingsModal — runtime API key entry (fallback when env var is missing).
// Props: open, onClose
const SettingsModal = ({ open, onClose }) => {
  const [key, setKey] = useState('');
  const [configured, setConfigured] = useState(false);

  useEffect(() => {
    if (open) {
      setKey(getApiKey() || '');
      setConfigured(isGeminiConfigured());
    }
  }, [open]);

  if (!open) return null;

  const handleSave = () => {
    setApiKey(key);
    setConfigured(isGeminiConfigured());
    toast.success(key ? 'Gemini API key saved ✓' : 'Gemini API key cleared');
    onClose();
  };

  const handleClear = () => {
    setKey('');
    setApiKey(null);
    setConfigured(false);
    toast.success('Gemini API key cleared');
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-ivory rounded-2xl shadow-2xl max-w-md w-full border border-burgundy/10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-burgundy text-white p-5 rounded-t-2xl flex items-center justify-between">
          <h2 className="font-playfair text-xl font-bold">⚙ Settings</h2>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white text-xl leading-none w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/10"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Gemini API Key
              </label>
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  configured
                    ? 'bg-emerald/10 text-emerald'
                    : 'bg-saffron/10 text-saffron'
                }`}
              >
                {configured ? '✓ Configured' : '⚠ Missing'}
              </span>
            </div>
            <input
              type="password"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="AIzaSy... or AQ...."
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-burgundy focus:border-burgundy font-mono"
            />
            <p className="text-xs text-gray-500 mt-2 leading-relaxed">
              Get a free key at{' '}
              <a
                href="https://aistudio.google.com/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-burgundy underline hover:text-burgundy-dark"
              >
                aistudio.google.com/apikey
              </a>
              . The key is stored only in this browser's localStorage.
            </p>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-burgundy/10">
            <button
              onClick={handleClear}
              className="text-xs text-gray-500 hover:text-red-600 transition"
            >
              Clear key
            </button>
            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-5 py-2 rounded-lg text-sm font-semibold bg-burgundy text-white hover:bg-burgundy-dark shadow-sm"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
