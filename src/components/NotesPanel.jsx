import React, { useState, useEffect } from 'react';

// NotesPanel — saves matchmaker notes per customer in localStorage.
// Parent passes customerId; on save, fires onSave() to bubble up.
const NotesPanel = ({ customerId, initialNotes = '', onSave }) => {
  const [notes, setNotes] = useState(initialNotes);
  const [lastSavedAt, setLastSavedAt] = useState(null);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    setNotes(initialNotes);
    setIsDirty(false);
  }, [initialNotes, customerId]);

  const handleChange = (e) => {
    setNotes(e.target.value);
    setIsDirty(true);
  };

  const handleSave = () => {
    if (!customerId) return;
    const key = `tdc_notes_${customerId}`;
    localStorage.setItem(key, notes);
    setLastSavedAt(new Date());
    setIsDirty(false);
    if (onSave) onSave(notes);
  };

  const formattedTime = lastSavedAt
    ? lastSavedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : null;

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-burgundy/5">
      <div className="flex items-center justify-between border-b border-burgundy/10 pb-2 mb-4">
        <h2 className="font-playfair text-xl font-semibold text-burgundy">Matchmaker Notes</h2>
        {formattedTime && (
          <span className="text-xs text-gray-400">Saved at {formattedTime}</span>
        )}
      </div>
      <textarea
        value={notes}
        onChange={handleChange}
        placeholder="Write matchmaking logs, call summaries, family preferences, follow-up reminders..."
        className="w-full h-36 border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-burgundy mb-3 resize-none"
      />
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400">
          {notes.length} characters
        </span>
        <button
          onClick={handleSave}
          disabled={!isDirty}
          className={`px-5 py-2 rounded-lg font-medium text-sm shadow-sm transition ${
            isDirty
              ? 'bg-burgundy text-white hover:bg-burgundy-dark'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {isDirty ? 'Save Notes' : 'Saved'}
        </button>
      </div>
    </div>
  );
};

export default NotesPanel;
