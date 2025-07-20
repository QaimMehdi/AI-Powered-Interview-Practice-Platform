import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Login page UI only (no logic)
const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      {/* Login card */}
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-8 text-center">Login</h2>
        {/* Email input */}
        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4fd1c5]"
        />
        {/* Password input */}
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-6 p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4fd1c5]"
        />
        {/* Sign in button */}
        <button
          className="w-full bg-[#4fd1c5] text-white font-bold py-3 rounded mb-4 hover:bg-[#5ff5e0] transition"
        >
          Sign in
        </button>
        {/* Google login button */}
        <button
          className="w-full bg-white border border-[#4fd1c5] text-[#18404a] font-bold py-3 rounded flex items-center justify-center mb-6 hover:bg-[#f8feff] transition"
        >
          {/* Google icon */}
          <img src="/google.png" alt="Google" className="w-5 h-5 mr-2" style={{width: 20, height: 20}} />
          Sign in with Google
        </button>
        {/* Link to signup */}
        <div className="text-sm text-gray-600 mt-2">
          Don't have an account?{' '}
          <Link to="/signup" className="text-[#4fd1c5] hover:underline font-semibold">Sign up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login; 