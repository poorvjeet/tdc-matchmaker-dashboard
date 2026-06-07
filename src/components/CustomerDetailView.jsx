import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { scoreMatch, getTopMatches, filterProfiles } from '../utils/matchingLogic';
import { isGeminiConfigured } from '../utils/geminiApi';
import customerData from '../data/customers.json';
import matchPoolData from '../data/matchPool.json';
import NotesPanel from './NotesPanel';
import MatchCard from './MatchCard';
import MatchModal from './MatchModal';
import SettingsModal from './SettingsModal';

const STATUS_COLORS = {
  New: 'bg-cream text-burgundy border border-burgundy/20',
  'In Progress': 'bg-saffron text-white',
  Matched: 'bg-emerald text-white',
  'On Hold': 'bg-gray-400 text-white'
};

// Reusable field row in the biodata grid
const Field = ({ label, value }) => (
  <div>
    <span className="block text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-0.5">
      {label}
    </span>
    <span className="font-medium text-gray-800 text-sm">{value || '—'}</span>
  </div>
);

const Section = ({ title, children }) => (
  <div>
    <h3 className="text-xs font-semibold text-burgundy uppercase tracking-widest mb-2 border-b border-burgundy/10 pb-1">
      {title}
    </h3>
    <div className="grid grid-cols-2 gap-3">{children}</div>
  </div>
);

const CustomerDetailView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [status, setStatus] = useState('New');
  const [savedMatchIds, setSavedMatchIds] = useState([]);
  const [sentMatch, setSentMatch] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeMatch, setActiveMatch] = useState(null);

  // Match pool filters
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('');
  const [religion, setReligion] = useState('');
  const [caste, setCaste] = useState('');
  const [diet, setDiet] = useState('');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [aiReady, setAiReady] = useState(isGeminiConfigured());

  useEffect(() => {
    const auth = localStorage.getItem('tdc_auth');
    if (!auth) {
      navigate('/login');
      return;
    }
    // Load or initialize customer from localStorage
    const stored = localStorage.getItem('tdc_customers');
    let customers = [];
    if (stored) {
      customers = JSON.parse(stored);
    } else {
      customers = customerData.customers.map((c) => ({
        ...c,
        name: c.name || `${c.firstName} ${c.lastName}`.trim(),
        status: c.status || 'New'
      }));
      localStorage.setItem('tdc_customers', JSON.stringify(customers));
    }
    const found = customers.find((c) => c.id === id);
    if (found) {
      setCustomer(found);
      setStatus(found.status || 'New');
    }

    // Load saved matches
    const savedKey = `tdc_saved_matches_${id}`;
    const saved = localStorage.getItem(savedKey);
    if (saved) {
      try {
        setSavedMatchIds(JSON.parse(saved));
      } catch (e) {
        setSavedMatchIds([]);
      }
    }
  }, [id, navigate]);

  // Top matches (memoized)
  const topMatches = useMemo(() => {
    if (!customer) return [];
    return getTopMatches(customer, matchPoolData.profiles || [], 10);
  }, [customer]);

  // Apply filters to top matches
  const filteredMatches = useMemo(() => {
    return filterProfiles(topMatches, { search, city, religion, caste, diet });
  }, [topMatches, search, city, religion, caste, diet]);

  const pool = matchPoolData.profiles || [];
  const uniqueCities = useMemo(() => [...new Set(pool.map((p) => p.city).filter(Boolean))].sort(), [pool]);
  const uniqueReligions = useMemo(() => [...new Set(pool.map((p) => p.religion).filter(Boolean))].sort(), [pool]);
  const uniqueCastes = useMemo(() => [...new Set(pool.map((p) => p.caste).filter(Boolean))].sort(), [pool]);
  const uniqueDiets = useMemo(() => [...new Set(pool.map((p) => p.diet).filter(Boolean))].sort(), [pool]);

  if (!customer) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-ivory">
        <p className="text-xl text-burgundy font-playfair mb-4">Customer not found</p>
        <button
          onClick={() => navigate('/dashboard')}
          className="bg-burgundy text-white px-4 py-2 rounded hover:bg-burgundy-dark transition"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  const fullName = customer.name || `${customer.firstName} ${customer.lastName}`;
  const initials = `${customer.firstName?.[0] || ''}${customer.lastName?.[0] || ''}`.toUpperCase();

  const updateCustomerStatus = (newStatus) => {
    setStatus(newStatus);
    const stored = JSON.parse(localStorage.getItem('tdc_customers') || '[]');
    const updated = stored.map((c) => (c.id === id ? { ...c, status: newStatus } : c));
    localStorage.setItem('tdc_customers', JSON.stringify(updated));
    setCustomer({ ...customer, status: newStatus });
  };

  const handleStatusChange = (newStatus) => {
    updateCustomerStatus(newStatus);
    toast.success(`Status updated to ${newStatus}`);
  };

  const handleSaveMatch = (match) => {
    if (savedMatchIds.includes(match.id)) return;
    const next = [...savedMatchIds, match.id];
    setSavedMatchIds(next);
    localStorage.setItem(`tdc_saved_matches_${id}`, JSON.stringify(next));
    toast.success(`${match.firstName} saved to shortlist ✓`);
  };

  const handleOpenSendModal = (match) => {
    setActiveMatch(match);
    setModalOpen(true);
  };

  const handleMatchSent = (match) => {
    setSentMatch(match);
    updateCustomerStatus('Matched');
    // Persist last sent match on customer record
    const stored = JSON.parse(localStorage.getItem('tdc_customers') || '[]');
    const updated = stored.map((c) =>
      c.id === id ? { ...c, matchedWith: { id: match.id, name: `${match.firstName} ${match.lastName}` } } : c
    );
    localStorage.setItem('tdc_customers', JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-ivory text-gray-800 pb-12">
      {/* Header */}
      <header className="bg-white border-b border-burgundy/10 shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-burgundy hover:text-burgundy-dark font-medium transition"
            >
              ← Dashboard
            </button>
            <span className="text-gray-300">|</span>
            <span className="font-playfair text-xl text-burgundy font-semibold">TDC Matchmaker Panel</span>
          </div>
          <button
            onClick={() => {
              localStorage.removeItem('tdc_auth');
              navigate('/login');
            }}
            className="text-sm bg-burgundy/5 text-burgundy hover:bg-burgundy hover:text-white px-3 py-1.5 rounded transition"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 mt-8">
        {!aiReady && (
          <div className="mb-4 bg-saffron/10 border border-saffron/30 text-burgundy rounded-lg px-4 py-3 flex items-center justify-between text-sm">
            <span>
              <strong>AI features are off.</strong> Add your free Gemini API key to enable match explanations and personalized intro emails.
            </span>
            <button
              onClick={() => setSettingsOpen(true)}
              className="bg-burgundy text-white px-3 py-1.5 rounded text-xs font-semibold hover:bg-burgundy-dark"
            >
              Add API Key
            </button>
          </div>
        )}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* ============= LEFT COLUMN: Biodata + Notes ============= */}
          <div className="xl:col-span-1 space-y-6">
            {/* Profile card */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-burgundy/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-burgundy/5 rounded-bl-full pointer-events-none" />
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 bg-burgundy text-white rounded-full flex items-center justify-center font-bold text-2xl font-playfair shadow-inner">
                  {initials}
                </div>
                <div>
                  <h1 className="font-playfair text-2xl font-semibold text-burgundy leading-tight">
                    {fullName}
                  </h1>
                  <p className="text-gray-500 text-sm">Customer ID: {customer.id}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 items-center mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${STATUS_COLORS[status] || STATUS_COLORS.New}`}>
                  {status}
                </span>
                {sentMatch && (
                  <span className="bg-emerald/10 text-emerald text-xs px-2.5 py-1 rounded-full font-medium">
                    ❤️ Sent to {sentMatch.firstName} {sentMatch.lastName}
                  </span>
                )}
                {savedMatchIds.length > 0 && (
                  <span className="bg-burgundy/10 text-burgundy text-xs px-2.5 py-1 rounded-full font-medium">
                    ★ {savedMatchIds.length} saved
                  </span>
                )}
              </div>

              <div className="border-t border-gray-100 pt-4">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Update Match Status
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['New', 'In Progress', 'On Hold', 'Matched'].map((st) => (
                    <button
                      key={st}
                      onClick={() => handleStatusChange(st)}
                      className={`px-3 py-2 rounded text-sm font-medium border text-center transition ${
                        status === st
                          ? 'bg-burgundy text-white border-burgundy'
                          : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Full biodata */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-burgundy/5 space-y-5">
              <h2 className="font-playfair text-xl font-semibold text-burgundy border-b border-burgundy/10 pb-2">
                Detailed Profile
              </h2>

              {/* About me */}
              <div>
                <h3 className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1">About</h3>
                <p className="text-sm text-gray-700 italic leading-relaxed">
                  "{customer.aboutMe || 'No details provided.'}"
                </p>
              </div>

              <Section title="Personal">
                <Field label="First Name" value={customer.firstName} />
                <Field label="Last Name" value={customer.lastName} />
                <Field label="Gender" value={customer.gender} />
                <Field label="Date of Birth" value={customer.dob} />
                <Field label="Age" value={`${customer.age} years`} />
                <Field label="Height" value={`${customer.height} cm`} />
                <Field label="Marital Status" value={customer.maritalStatus} />
                <Field label="Mother Tongue" value={customer.motherTongue} />
              </Section>

              <Section title="Contact & Location">
                <Field label="Email" value={customer.email} />
                <Field label="Phone" value={customer.phone} />
                <Field label="Country" value={customer.country} />
                <Field label="City" value={customer.city} />
              </Section>

              <Section title="Education & Career">
                <Field label="College" value={customer.college} />
                <Field label="Degree" value={customer.degree} />
                <Field label="Company" value={customer.company} />
                <Field label="Designation" value={customer.designation} />
                <Field label="Annual Income" value={customer.income || customer.annualIncome} />
                <Field label="Family Income" value={customer.annualFamilyIncome} />
              </Section>

              <Section title="Family">
                <Field label="Family Type" value={customer.familyType} />
                <Field label="Siblings" value={customer.siblings} />
                <Field label="Religion" value={customer.religion} />
                <Field label="Caste" value={customer.caste} />
                <Field label="Manglik" value={customer.manglik} />
                <Field label="Languages" value={Array.isArray(customer.languages) ? customer.languages.join(', ') : customer.languages} />
              </Section>

              <Section title="Lifestyle & Values">
                <Field label="Diet" value={customer.diet} />
                <Field label="Drinking" value={customer.drinking} />
                <Field label="Smoking" value={customer.smoking} />
                <Field label="Want Kids" value={customer.wantKids} />
                <Field label="Open to Relocate" value={customer.openToRelocate} />
                <Field label="Open to Pets" value={customer.openToPets} />
                <Field label="Horoscope Match" value={customer.horoscopeMatchRequired} />
                <Field label="Physical Appearance" value={customer.appearanceNotes} />
              </Section>
            </div>

            {/* Notes */}
            <NotesPanel
              customerId={customer.id}
              initialNotes={customer.matchmakerNotes || ''}
              onSave={(notes) => {
                const stored = JSON.parse(localStorage.getItem('tdc_customers') || '[]');
                const updated = stored.map((c) => (c.id === id ? { ...c, matchmakerNotes: notes } : c));
                localStorage.setItem('tdc_customers', JSON.stringify(updated));
                setCustomer({ ...customer, matchmakerNotes: notes });
                toast.success('Notes saved');
              }}
            />
          </div>

          {/* ============= RIGHT COLUMN: Match pool ============= */}
          <div className="xl:col-span-2 space-y-6">
            {/* Header + filters */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-burgundy/5">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
                <div>
                  <h2 className="font-playfair text-2xl font-semibold text-burgundy">
                    Suggested Matches
                  </h2>
                  <p className="text-gray-500 text-sm">
                    Scored compatibility with opposite-gender profiles
                  </p>
                </div>
                <div className="flex gap-2 text-xs">
                  <span className="bg-emerald/10 text-emerald px-2 py-1 rounded-full font-semibold">
                    {topMatches.filter((m) => m.category === 'High Potential').length} High Potential
                  </span>
                  <span className="bg-saffron/10 text-saffron px-2 py-1 rounded-full font-semibold">
                    {topMatches.filter((m) => m.category === 'Good Match').length} Good
                  </span>
                  <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full font-semibold">
                    {topMatches.filter((m) => m.category === 'Possible Fit').length} Possible
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3 border-t border-gray-100 pt-4">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search name, ID, profession…"
                  className="border border-gray-300 rounded px-2.5 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-burgundy"
                />
                <select value={city} onChange={(e) => setCity(e.target.value)} className="border border-gray-300 rounded px-2.5 py-1.5 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-burgundy">
                  <option value="">All Cities</option>
                  {uniqueCities.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <select value={religion} onChange={(e) => setReligion(e.target.value)} className="border border-gray-300 rounded px-2.5 py-1.5 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-burgundy">
                  <option value="">All Religions</option>
                  {uniqueReligions.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
                <select value={caste} onChange={(e) => setCaste(e.target.value)} className="border border-gray-300 rounded px-2.5 py-1.5 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-burgundy">
                  <option value="">All Castes</option>
                  {uniqueCastes.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <select value={diet} onChange={(e) => setDiet(e.target.value)} className="border border-gray-300 rounded px-2.5 py-1.5 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-burgundy">
                  <option value="">All Diets</option>
                  {uniqueDiets.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>

            {/* Matches */}
            <div className="space-y-4">
              {filteredMatches.length > 0 ? (
                filteredMatches.map((m) => (
                  <MatchCard
                    key={m.id}
                    customer={customer}
                    match={m}
                    onSave={() => handleSaveMatch(m)}
                    onSend={() => handleOpenSendModal(m)}
                    isSaved={savedMatchIds.includes(m.id)}
                  />
                ))
              ) : (
                <div className="bg-white rounded-xl shadow-md p-8 text-center text-gray-500 border border-gray-200">
                  No compatible matches found with current filters.
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Send Match modal */}
      <MatchModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        customer={customer}
        match={activeMatch}
        onSent={handleMatchSent}
      />

      {/* Settings (API key) modal */}
      <SettingsModal
        open={settingsOpen}
        onClose={() => {
          setSettingsOpen(false);
          setAiReady(isGeminiConfigured());
        }}
      />
    </div>
  );
};

export default CustomerDetailView;
