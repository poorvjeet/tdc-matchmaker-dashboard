import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { generateIntroEmail, isGeminiConfigured } from '../utils/geminiApi';

// MatchModal — preview the match + AI-generated intro email + send action.
// Props:
//   open:      boolean
//   onClose:   fn()
//   customer:  the matchmaker's client
//   match:     the proposed match profile
//   onSent:    fn() → called after a successful mock send (parent updates status to Matched)
const MatchModal = ({ open, onClose, customer, match, onSent }) => {
  const [intro, setIntro] = useState('');
  const [loadingIntro, setLoadingIntro] = useState(false);
  const [sending, setSending] = useState(false);
  const configured = isGeminiConfigured();

  useEffect(() => {
    if (open) {
      setIntro('');
      // Auto-generate intro on open
      handleGenerate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, match?.id]);

  if (!open || !match) return null;

  const fullName = `${match.firstName} ${match.lastName}`;
  const initials = `${match.firstName?.[0] || ''}${match.lastName?.[0] || ''}`.toUpperCase();

  const handleGenerate = async () => {
    setLoadingIntro(true);
    const text = await generateIntroEmail(customer, match);
    setIntro(text);
    setLoadingIntro(false);
  };

  const handleSend = () => {
    setSending(true);
    // Mock the network call
    setTimeout(() => {
      setSending(false);
      toast.success('Introduction sent to both parties ✓', {
        duration: 4000,
        style: {
          background: '#FFFAF0',
          color: '#800020',
          border: '1px solid #800020',
          fontWeight: 600
        },
        iconTheme: { primary: '#800020', secondary: '#FFFAF0' }
      });
      if (onSent) onSent(match);
      onClose();
    }, 800);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-ivory rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-burgundy/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-burgundy text-white p-6 rounded-t-2xl flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest opacity-80">TDC Matchmaker</p>
            <h2 className="font-playfair text-2xl font-bold">Send Match Introduction</h2>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white text-2xl leading-none w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Match profile summary */}
        <div className="p-6 border-b border-burgundy/10">
          <p className="text-xs uppercase tracking-widest text-burgundy font-semibold mb-3">You're introducing</p>
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-burgundy to-burgundy-dark text-white flex items-center justify-center font-playfair text-2xl font-bold flex-shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-playfair text-xl font-semibold text-gray-800">
                {customer.firstName} <span className="text-gray-400">×</span> {fullName}
              </h3>
              <p className="text-sm text-gray-600">
                {match.age} yrs · {match.height}cm · {match.city} · {match.income}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {match.designation || match.profession}{match.company ? ` at ${match.company}` : ''}
              </p>
              <p className="text-xs text-gray-500">
                {match.religion} · {match.caste} · {match.diet} · {match.familyType}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Score</p>
              <p className="font-playfair text-3xl font-bold text-burgundy leading-tight">{match.score}</p>
              <p className="text-[10px] text-gray-400">{match.category}</p>
            </div>
          </div>
        </div>

        {/* AI Intro email */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs uppercase tracking-widest text-burgundy font-semibold">
              {configured ? '✨ AI-Generated Intro Email' : 'Intro Email (template)'}
            </p>
            {configured && (
              <button
                onClick={handleGenerate}
                disabled={loadingIntro}
                className="text-xs text-burgundy hover:text-burgundy-dark font-medium underline disabled:opacity-50"
              >
                {loadingIntro ? 'Regenerating…' : '↻ Regenerate'}
              </button>
            )}
          </div>
          <textarea
            value={loadingIntro ? '✨ Generating personalized intro…' : intro}
            onChange={(e) => setIntro(e.target.value)}
            rows={10}
            className="w-full border border-gray-300 rounded-lg p-4 text-sm focus:outline-none focus:ring-2 focus:ring-burgundy bg-white resize-none leading-relaxed"
            placeholder="Intro email will be generated here…"
          />
          <p className="text-xs text-gray-400 mt-1">{intro.split(/\s+/).filter(Boolean).length} words</p>
        </div>

        {/* Actions */}
        <div className="p-6 pt-0 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={sending || !intro}
            className="px-6 py-2.5 rounded-lg text-sm font-semibold bg-burgundy text-white hover:bg-burgundy-dark transition shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {sending ? 'Sending…' : '📧 Send Introduction'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MatchModal;
