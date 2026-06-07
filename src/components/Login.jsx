import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// TDC — The Date Crew: Matchmaker Login
const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'matchmaker@tdc.com' && password === 'tdc@2025') {
      localStorage.setItem('tdc_auth', JSON.stringify({ username, loginAt: Date.now() }));
      navigate('/dashboard');
    } else {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-ivory via-cream to-ivory p-4 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-burgundy/10 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-emerald/10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-burgundy text-white shadow-lg mb-4">
            <span className="font-playfair text-3xl font-bold">T</span>
          </div>
          <h1 className="font-playfair text-3xl font-bold text-burgundy tracking-wide">
            The Date Crew
          </h1>
          <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mt-1">
            Matchmaker Dashboard
          </p>
        </div>

        {/* Form card */}
        <form
          onSubmit={handleLogin}
          className="bg-white/90 backdrop-blur p-8 rounded-2xl shadow-2xl border border-burgundy/10"
        >
          <h2 className="font-playfair text-xl text-burgundy mb-1">Welcome back</h2>
          <p className="text-sm text-gray-500 mb-6">Sign in to continue your matchmaking work.</p>

          {error && (
            <div className="mb-4 text-sm bg-red-50 text-red-700 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Username
            </label>
            <input
              type="email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-burgundy focus:border-burgundy"
              placeholder="matchmaker@tdc.com"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPwd ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-burgundy focus:border-burgundy pr-12"
                placeholder="tdc@2025"
                required
              />
              <button
                type="button"
                onClick={() => setShowPwd((v) => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-500 hover:text-burgundy"
              >
                {showPwd ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-burgundy text-white py-2.5 rounded-lg font-medium hover:bg-burgundy-dark transition shadow-md"
          >
            Sign In
          </button>

          <p className="text-center text-xs text-gray-400 mt-6">
            By signing in, you agree to keep client data confidential.
          </p>
        </form>

        <p className="text-center text-xs text-gray-400 mt-6">
          Demo credentials: <span className="font-mono text-burgundy">matchmaker@tdc.com</span> / <span className="font-mono text-burgundy">tdc@2025</span>
        </p>
      </div>
    </div>
  );
};

export default Login;
