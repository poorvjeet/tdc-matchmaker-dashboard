import React, { useState } from 'react';
import { getMatchExplanation, isGeminiConfigured } from '../utils/geminiApi';

// MatchCard — single suggested match.
// Props:
//   customer:    the matchmaker's client (object)
//   match:       a scored match (object from getTopMatches) with .score, .category, .buckets
//   onSend:      fn() → opens Send Match modal
//   onSave:      fn() → saves match to localStorage
//   isSaved:     boolean — is this match already saved?
const MatchCard = ({ customer, match, onSend, onSave, isSaved }) => {
  const [explanation, setExplanation] = useState('');
  const [loadingExplain, setLoadingExplain] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(false);

  const fullName = `${match.firstName} ${match.lastName}`;
  const initials = `${match.firstName?.[0] || ''}${match.lastName?.[0] || ''}`.toUpperCase();
  const configured = isGeminiConfigured();

  const categoryColor = {
    'High Potential': 'bg-emerald/10 text-emerald border border-emerald/30',
    'Good Match': 'bg-saffron/10 text-saffron border border-saffron/30',
    'Possible Fit': 'bg-blue-50 text-blue-700 border border-blue-200',
    'Low Compatibility': 'bg-gray-100 text-gray-500 border border-gray-200'
  }[match.category] || 'bg-gray-100 text-gray-500 border border-gray-200';

  const handleExplain = async () => {
    if (explanation) {
      setExplanation('');
      return;
    }
    setLoadingExplain(true);
    const text = await getMatchExplanation(customer, match, match.score, match.category);
    setExplanation(text);
    setLoadingExplain(false);
  };

  // Bucket progress bars
  const buckets = match.buckets || {};
  const bucketEntries = Object.entries(buckets);

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-xl transition relative">
      {/* Category badge — top right */}
      <div className="absolute top-4 right-4 flex flex-col items-end gap-1">
        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${categoryColor}`}>
          {match.category}
        </span>
        {isSaved && (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-burgundy/10 text-burgundy border border-burgundy/20">
            ★ Saved
          </span>
        )}
      </div>

      {/* Header: Avatar + Name + Score */}
      <div className="flex items-start space-x-4 pr-32">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-burgundy to-burgundy-dark text-white flex items-center justify-center font-playfair text-xl font-bold flex-shrink-0 shadow-inner">
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-playfair text-lg font-semibold text-gray-800 truncate">
            {fullName}
            <span className="text-gray-400 text-sm font-normal ml-2">{match.id}</span>
          </h3>
          <p className="text-xs text-gray-500 truncate">
            {match.designation || match.profession}{match.company ? ` · ${match.company}` : ''}
          </p>
          <p className="text-xs text-gray-400 truncate">
            {match.age} yrs · {match.height}cm · {match.city} · {match.income}
          </p>
        </div>
      </div>

      {/* Score gauge */}
      <div className="mt-4 flex items-center space-x-3">
        <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
          <div
            className={`h-2 rounded-full transition-all ${
              match.score >= 80
                ? 'bg-emerald'
                : match.score >= 60
                ? 'bg-saffron'
                : match.score >= 40
                ? 'bg-blue-500'
                : 'bg-gray-400'
            }`}
            style={{ width: `${match.score}%` }}
          />
        </div>
        <span className="font-playfair text-lg font-bold text-burgundy">{match.score}</span>
        <span className="text-xs text-gray-400">/ 100</span>
      </div>

      {/* Spec grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 text-xs text-gray-600">
        <div>
          <span className="text-gray-400 block">Religion · Caste</span>
          <span className="font-semibold text-gray-800">{match.religion} · {match.caste}</span>
        </div>
        <div>
          <span className="text-gray-400 block">Diet</span>
          <span className="font-semibold text-gray-800">{match.diet}</span>
        </div>
        <div>
          <span className="text-gray-400 block">Family Type</span>
          <span className="font-semibold text-gray-800">{match.familyType}</span>
        </div>
        <div>
          <span className="text-gray-400 block">Lifestyle</span>
          <span className="font-semibold text-gray-800">
            {match.drinking === 'No' ? '🌿' : '🥂'} Drink · {match.smoking === 'No' ? '✓' : '⚠'} Smoke
          </span>
        </div>
      </div>

      {/* Compatibility breakdown toggle */}
      <button
        onClick={() => setShowBreakdown((v) => !v)}
        className="mt-3 text-xs text-burgundy hover:text-burgundy-dark font-medium underline"
      >
        {showBreakdown ? 'Hide' : 'Show'} compatibility breakdown
      </button>
      {showBreakdown && (
        <div className="mt-3 bg-ivory rounded-lg p-3 border border-burgundy/10 space-y-2">
          {bucketEntries.map(([key, b]) => (
            <div key={key}>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-gray-700">{b.label}</span>
                <span className="font-bold text-burgundy">{b.points} / {b.max}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-burgundy h-1.5 rounded-full"
                  style={{ width: `${(b.points / b.max) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* AI explanation */}
      {configured && (
        <div className="mt-3">
          <button
            onClick={handleExplain}
            disabled={loadingExplain}
            className="text-xs text-burgundy hover:text-burgundy-dark font-medium underline"
          >
            {loadingExplain ? '✨ Generating…' : explanation ? '✕ Hide AI insight' : '✨ Why this match?'}
          </button>
          {explanation && (
            <p className="mt-2 text-xs text-gray-700 italic bg-emerald/5 border border-emerald/20 rounded-lg p-3 leading-relaxed">
              {explanation}
            </p>
          )}
        </div>
      )}

      {/* Action buttons */}
      <div className="flex flex-wrap items-center justify-end gap-2 mt-4 pt-4 border-t border-gray-100">
        <button
          onClick={onSave}
          disabled={isSaved}
          className={`px-4 py-2 rounded-lg text-sm font-medium border transition ${
            isSaved
              ? 'bg-emerald/10 text-emerald border-emerald/30 cursor-default'
              : 'bg-white text-burgundy border-burgundy/30 hover:bg-burgundy/5'
          }`}
        >
          {isSaved ? '★ Saved' : '☆ Save Match'}
        </button>
        <button
          onClick={onSend}
          className="px-4 py-2 rounded-lg text-sm font-semibold bg-burgundy text-white hover:bg-burgundy-dark transition shadow-sm"
        >
          💌 Send Match
        </button>
      </div>
    </div>
  );
};

export default MatchCard;
