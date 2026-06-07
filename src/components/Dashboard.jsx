import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomerCard from './CustomerCard';
import SettingsModal from './SettingsModal';
import { filterCustomers } from '../utils/matchingLogic';
import { isGeminiConfigured } from '../utils/geminiApi';
import customerData from '../data/customers.json';

const Dashboard = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCity, setFilterCity] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterGender, setFilterGender] = useState('');
  const [filterCaste, setFilterCaste] = useState('');
  const [filterReligion, setFilterReligion] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [aiReady, setAiReady] = useState(false);

  useEffect(() => {
    // Check auth
    const auth = localStorage.getItem('tdc_auth');
    if (!auth) {
      navigate('/login');
      return;
    }
    try {
      const parsed = JSON.parse(auth);
      setUserEmail(parsed.username || 'matchmaker@tdc.com');
    } catch (e) {
      setUserEmail('matchmaker@tdc.com');
    }

    // Load customers from localStorage or initialize from customers.json
    const savedCustomers = localStorage.getItem('tdc_customers');
    if (savedCustomers) {
      setCustomers(JSON.parse(savedCustomers));
    } else {
      const defaultCustomers = customerData.customers.map(c => ({
        ...c,
        name: c.name || `${c.firstName} ${c.lastName}`.trim(),
        status: c.status || 'New'
      }));
      setCustomers(defaultCustomers);
      localStorage.setItem('tdc_customers', JSON.stringify(defaultCustomers));
    }
  }, [navigate]);

  useEffect(() => {
    setAiReady(isGeminiConfigured());
  }, [settingsOpen]);

  // Extract unique filter options
  const cities = [...new Set(customers.map(c => c.city).filter(Boolean))].sort();
  const castes = [...new Set(customers.map(c => c.caste).filter(Boolean))].sort();
  const religions = [...new Set(customers.map(c => c.religion).filter(Boolean))].sort();

  // Filter customers using matching logic
  const filteredCustomers = filterCustomers(
    customers,
    searchTerm,
    filterCity,
    filterStatus,
    filterGender,
    filterCaste,
    filterReligion
  );

  const handleLogout = () => {
    localStorage.removeItem('tdc_auth');
    navigate('/login');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'New': return 'bg-cream text-burgundy border border-burgundy/10';
      case 'In Progress': return 'bg-saffron text-white';
      case 'Matched': return 'bg-emerald text-white';
      case 'On Hold': return 'bg-gray-400 text-white';
      default: return 'bg-cream text-burgundy';
    }
  };

  return (
    <div className="min-h-screen bg-ivory text-gray-800 pb-12">
      {/* Top Header */}
      <header className="bg-white border-b border-burgundy/10 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="w-8 h-8 rounded-full bg-burgundy flex items-center justify-center text-white font-bold font-playfair text-lg">T</span>
            <span className="font-playfair text-xl font-semibold text-burgundy tracking-wide">
              The Decent Company Matchmaker
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setSettingsOpen(true)}
              title={aiReady ? 'Gemini AI is configured' : 'Click to add your Gemini API key'}
              className={`text-xs px-3 py-1.5 rounded transition font-medium flex items-center gap-1 ${
                aiReady
                  ? 'bg-emerald/10 text-emerald hover:bg-emerald/20'
                  : 'bg-saffron/10 text-saffron hover:bg-saffron/20 animate-pulse'
              }`}
            >
              <span>⚙</span>
              <span>{aiReady ? 'AI Ready' : 'Setup AI'}</span>
            </button>
            <div className="hidden md:flex flex-col text-right">
              <span className="text-xs text-gray-400 font-semibold uppercase">Operator</span>
              <span className="text-sm text-gray-600 font-medium">{userEmail}</span>
            </div>
            <button
              onClick={handleLogout}
              className="text-xs bg-burgundy/5 text-burgundy hover:bg-burgundy hover:text-white px-3 py-1.5 rounded transition font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 mt-8">
        {/* Welcome Section */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-playfair text-burgundy font-bold">Customer Directory</h1>
            <p className="text-gray-500 text-sm mt-1">Manage, view details, and initiate matchmaking for your clients.</p>
          </div>
          <div className="bg-white px-4 py-2.5 rounded-lg border border-burgundy/5 shadow-sm flex items-center space-x-3 self-start">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Matched Rate</span>
            <span className="font-bold text-emerald text-lg">
              {Math.round((customers.filter(c => c.status === 'Matched').length / (customers.length || 1)) * 100)}%
            </span>
            <span className="text-xs text-gray-300">|</span>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total</span>
            <span className="font-bold text-burgundy text-lg">{customers.length}</span>
          </div>
        </div>

        {/* Filters Panel */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-burgundy/5 mb-8">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Search and Filters</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            
            {/* Search */}
            <div className="lg:col-span-1">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Search Name / ID</label>
              <input
                type="text"
                placeholder="Ex: Aarav, C001..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-burgundy focus:border-burgundy"
              />
            </div>

            {/* City */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">City</label>
              <select
                value={filterCity}
                onChange={(e) => setFilterCity(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-burgundy"
              >
                <option value="">All Cities</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-burgundy"
              >
                <option value="">All Statuses</option>
                <option value="New">New</option>
                <option value="In Progress">In Progress</option>
                <option value="Matched">Matched</option>
                <option value="On Hold">On Hold</option>
              </select>
            </div>

            {/* Gender */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Gender</label>
              <select
                value={filterGender}
                onChange={(e) => setFilterGender(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-burgundy"
              >
                <option value="">All Genders</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            {/* Religion */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Religion</label>
              <select
                value={filterReligion}
                onChange={(e) => setFilterReligion(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-burgundy"
              >
                <option value="">All Religions</option>
                {religions.map(rel => (
                  <option key={rel} value={rel}>{rel}</option>
                ))}
              </select>
            </div>

            {/* Caste */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Caste</label>
              <select
                value={filterCaste}
                onChange={(e) => setFilterCaste(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-burgundy"
              >
                <option value="">All Castes</option>
                {castes.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

          </div>
        </div>

        {/* Customer Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCustomers.length > 0 ? (
            filteredCustomers.map(customer => (
              <CustomerCard
                key={customer.id}
                customer={customer}
                getStatusColor={getStatusColor}
              />
            ))
          ) : (
            <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-white p-12 text-center rounded-xl shadow border border-gray-200">
              <p className="text-gray-500 font-medium text-lg">No customers match your filter options.</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterCity('');
                  setFilterStatus('');
                  setFilterGender('');
                  setFilterCaste('');
                  setFilterReligion('');
                }}
                className="text-burgundy hover:text-burgundy-dark font-semibold mt-2 underline text-sm transition"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </main>

      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </div>
  );
};

export default Dashboard;