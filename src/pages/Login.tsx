import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Footer } from './Index';
import { useAuth } from '../components/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok && data.token) {
        login(data.token);
        setError(null);
        navigate('/');
      } else {
        setError(typeof data === 'string' ? data : (data.message || 'Invalid email or password.'));
      }
    } catch (err) {
      setError('Login failed: ' + (err instanceof Error ? err.message : err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Back Button */}
      <button
        className="absolute top-6 left-4 flex items-center gap-2 text-[#18404a] bg-white/80 hover:bg-[#e0f7fa] rounded-full px-4 py-2 shadow-md font-semibold text-base transition z-20"
        style={{fontFamily: 'Poppins, Montserrat, sans-serif'}}
        onClick={() => navigate('/')}
      >
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#18404a"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
        Back
      </button>
      <div className="flex-1 flex items-center justify-center p-2 sm:p-0">
        {/* Login card */}
        <div className="bg-white p-4 sm:p-8 rounded shadow-md w-full max-w-xs sm:max-w-md flex flex-col items-center">
          <h2 className="text-2xl font-bold mb-6 sm:mb-8 text-center">Login</h2>
          {error && (
            <div className="w-full mb-4 p-3 rounded bg-red-50 border border-red-300 text-red-700 text-sm font-medium text-center animate-fade-in">
              {error}
            </div>
          )}
          <form onSubmit={handleLogin} className="w-full flex flex-col items-center">
            {/* Email input */}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full mb-3 sm:mb-4 p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4fd1c5] text-base"
              required
            />
            {/* Password input */}
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full mb-4 sm:mb-6 p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4fd1c5] text-base"
              required
            />
            {/* Sign in button */}
            <button
              type="submit"
              className="w-full bg-[#4fd1c5] text-white font-bold py-3 rounded mb-2 sm:mb-3 hover:bg-[#5ff5e0] transition text-base"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
            {/* Google login button */}
            <button
              className="w-full bg-white border border-[#4fd1c5] text-[#18404a] font-bold py-3 rounded flex items-center justify-center mb-5 sm:mb-6 hover:bg-[#f8feff] transition text-base"
              onClick={() => {
                window.location.href = "http://localhost:8080/oauth2/authorization/google";
              }}
            >
              {/* Google icon */}
              <img src="/google.png" alt="Google" className="w-5 h-5 mr-2" style={{width: 20, height: 20}} />
              Sign in with Google
            </button>
            {/* Link to signup */}
            <div className="text-sm text-gray-600 mt-2 text-center">
              Don't have an account?{' '}
              <Link to="/signup" className="text-[#4fd1c5] hover:underline font-semibold">Sign up</Link>
            </div>
          </form>
        </div>
      </div>
      <Footer isInInterview={false} onRequestLeave={() => {}} />
    </div>
  );
};

export default Login; 