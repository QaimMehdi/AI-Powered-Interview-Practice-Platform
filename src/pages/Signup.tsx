import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Footer } from './Index';

const Signup = () => {
  const navigate = useNavigate();
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
        {/* Signup card */}
        <div className="bg-white p-4 sm:p-8 rounded shadow-md w-full max-w-xs sm:max-w-md flex flex-col items-center">
          <h2 className="text-2xl font-bold mb-6 sm:mb-8 text-center">Sign Up</h2>
          {/* Email input */}
          <input
            type="email"
            placeholder="Email"
            className="w-full mb-3 sm:mb-4 p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4fd1c5] text-base"
          />
          {/* Password input */}
          <input
            type="password"
            placeholder="Password"
            className="w-full mb-4 sm:mb-6 p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4fd1c5] text-base"
          />
          {/* Sign up button */}
          <button
            className="w-full bg-[#4fd1c5] text-white font-bold py-3 rounded mb-2 sm:mb-3 hover:bg-[#5ff5e0] transition text-base"
          >
            Sign up
          </button>
          {/* Google signup button */}
          <button
            className="w-full bg-white border border-[#4fd1c5] text-[#18404a] font-bold py-3 rounded flex items-center justify-center mb-5 sm:mb-6 hover:bg-[#f8feff] transition text-base"
          >
            {/* Google icon */}
            <img src="/google.png" alt="Google" className="w-5 h-5 mr-2" style={{width: 20, height: 20}} />
            Sign up with Google
          </button>
          {/* Link to login */}
          <div className="text-sm text-gray-600 mt-2 text-center">
            Already have an account?{' '}
            <Link to="/login" className="text-[#4fd1c5] hover:underline font-semibold">Login</Link>
          </div>
        </div>
      </div>
      <Footer isInInterview={false} onRequestLeave={() => {}} />
    </div>
  );
};

export default Signup; 