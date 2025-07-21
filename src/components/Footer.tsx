import React from 'react';
import { useNavigate } from 'react-router-dom';

const Footer = ({ isInInterview = false, onRequestLeave }) => {
  const navigate = useNavigate();
  const navLinks = [
    { name: 'Home', to: '/' },
    { name: 'Features', to: '/#features' },
    { name: 'Topics', to: '/#topics' },
    { name: 'GitHub', href: 'https://github.com/QaimMehdi/AI-Powered-Interview-Practice-Platform', external: true },
    { name: 'Contact', to: '/#contact' },
  ];

  const handleNav = (to) => {
    if (isInInterview && onRequestLeave) {
      onRequestLeave(to);
    } else {
      navigate(to);
    }
  };

  return (
    <footer className="w-full bg-[#1a1a1a] border-t-2 border-t-[#4fd1c5] py-10 px-4 text-gray-400 font-sans mt-16">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Logo/Brand */}
        <div className="flex items-center gap-3 mb-6 md:mb-0" style={{height: '96px', width: '96px', overflow: 'visible'}}>
          <img
            src="/logo-white.png"
            alt="Prepza Logo"
            className="object-contain transition-transform duration-300 hover:scale-125"
            style={{
              height: '96px',
              width: '96px',
              position: 'relative',
              zIndex: 2
            }}
          />
          <span className="text-2xl font-extrabold text-white tracking-tight" style={{ fontFamily: 'Montserrat, sans-serif' }}></span>
        </div>
        {/* Navigation Links */}
        <nav className="flex flex-col md:flex-row gap-4 md:gap-8 items-center text-base font-medium">
          {navLinks.map((link) => (
            link.external ? (
              <a key={link.name} href={link.href} target="_blank" rel="noopener noreferrer" className="hover:text-[#4fd1c5] transition-colors">{link.name}</a>
            ) : (
              <span
                key={link.name}
                className="hover:text-[#4fd1c5] transition-colors cursor-pointer"
                onClick={() => handleNav(link.to)}
              >
                {link.name}
              </span>
            )
          ))}
        </nav>
        {/* Social Icons */}
        <div className="flex gap-4 mt-6 md:mt-0">
          <a href="https://github.com/QaimMehdi/AI-Powered-Interview-Practice-Platform" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="hover:text-[#4fd1c5] transition-colors">
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.483 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.529 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.339-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.272.098-2.65 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.748-1.025 2.748-1.025.546 1.378.202 2.397.1 2.65.64.699 1.028 1.592 1.028 2.683 0 3.842-2.338 4.687-4.566 4.936.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.749 0 .268.18.579.688.481C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" /></svg>
          </a>
          <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="hover:text-[#4fd1c5] transition-colors">
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 19c11 0 13-9 13-13v-.59A9.72 9.72 0 0022 3.13a9.3 9.3 0 01-2.65.73A4.62 4.62 0 0021.4 2.1a9.29 9.29 0 01-2.93 1.12A4.61 4.61 0 0012 6.07c0 .36.04.71.11 1.05A13.09 13.09 0 013 3.16s-4 9 5 13a13.07 13.07 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0024 4.59a9.3 9.3 0 01-2.65.73A4.62 4.62 0 0021.4 2.1z" /></svg>
          </a>
          <a href="https://linkedin.com/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-[#4fd1c5] transition-colors">
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 8a6 6 0 016 6v5a2 2 0 01-2 2H4a2 2 0 01-2-2v-5a6 6 0 016-6h8zm-6 8v-4m4 4v-4m-8 4v-4" /></svg>
          </a>
        </div>
      </div>
      <div className="mt-8 text-center text-sm text-gray-500" style={{fontFamily: 'Open Sans, Montserrat, sans-serif'}}>
        © 2025 Prepza. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer; 