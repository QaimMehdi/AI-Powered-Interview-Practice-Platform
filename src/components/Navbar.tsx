import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ onLogoClick, isInInterview, onRequestLeave }) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
      if (window.scrollY < 10) {
        setIsVisible(true);
        lastScrollY.current = window.scrollY;
        return;
      }
      if (window.scrollY > lastScrollY.current) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      lastScrollY.current = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', to: '/#' },
    { name: 'Features', to: '/#features' },
    { name: 'Topics', to: '/#topics' },
    { name: 'Contact', to: '/contact' },
    { name: 'GitHub', href: 'https://github.com/QaimMehdi/AI-Powered-Interview-Practice-Platform', external: true },
  ];

  const handleNav = (to) => {
    if (isInInterview && onRequestLeave) {
      onRequestLeave(to);
    } else {
      if (to === '/#' || to === '#') {
        if (window.location.pathname !== '/') {
          navigate('/');
          setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }, 50);
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        setMenuOpen(false);
      } else if (to.startsWith('/#')) {
        if (window.location.pathname !== '/') {
          navigate('/');
          setTimeout(() => {
            window.location.hash = to.replace('/', '');
          }, 50);
        } else {
          window.location.hash = to.replace('/', '');
        }
        setMenuOpen(false);
      } else {
        navigate(to);
        setMenuOpen(false);
      }
    }
  };

  return (
    <>
      <nav
        className={`
          fixed top-0 left-0 w-full z-50
          transition-all duration-500
          ${scrolled ? 'bg-[rgba(26,26,26,0.92)] shadow-2xl border-b border-[#4fd1c5] scale-[1.025] backdrop-blur-xl' : 'bg-[rgba(26,26,26,0.8)] backdrop-blur-md'}
          ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}
        `}
        style={{ fontFamily: 'Poppins, Montserrat, sans-serif', transition: 'all 0.5s cubic-bezier(.4,2,.3,1)', willChange: 'transform, opacity' }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer select-none group relative" onClick={onLogoClick} style={{height: '48px'}}>
            <img 
              src="/logo-white.png" 
              alt="Prepza Logo" 
              className="h-[98px] w-[98px] object-contain transition-transform duration-300 group-hover:scale-110"
              style={{ filter: 'drop-shadow(0 0 0 #4fd1c5)', marginTop: '-16px', marginBottom: '-16px' }}
            />
          </div>
          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8 ml-auto">
            {navLinks.map((link) => (
              link.external ? (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg font-semibold text-white/90 px-2 py-1 rounded transition-all duration-200 hover:text-[#4fd1c5] hover:underline underline-offset-8 focus:text-[#4fd1c5]"
                  style={{fontFamily: 'Poppins, Montserrat, sans-serif'}}>
                  {link.name}
                </a>
              ) : (
                <span
                  key={link.name}
                  className="text-lg font-semibold text-white/90 px-2 py-1 rounded transition-all duration-200 hover:text-[#4fd1c5] hover:underline underline-offset-8 focus:text-[#4fd1c5] cursor-pointer"
                  style={{fontFamily: 'Poppins, Montserrat, sans-serif'}}
                  onClick={() => handleNav(link.to)}
                >
                  {link.name}
                </span>
              )
            ))}
            <div className="flex gap-2">
              <span
                className="px-5 py-2 rounded-full font-bold text-lg border-2 border-[#4fd1c5] text-[#4fd1c5] bg-transparent hover:bg-[#1a1a1a] hover:text-[#7fe3e0] transition-all duration-200 focus:outline-none cursor-pointer"
                style={{boxShadow: '0 2px 8px #4fd1c533'}}
                onClick={() => handleNav('/login')}
              >
                Login
              </span>
              <span
                className="px-6 py-2 rounded-full font-bold text-lg shadow-lg transition-all duration-200 bg-[#4fd1c5] text-[#18404a] hover:bg-[#5ff5e0] focus:bg-[#5ff5e0] focus:outline-none cursor-pointer"
                style={{boxShadow: '0 2px 16px #4fd1c555'}}
                onClick={() => handleNav('/signup')}
              >
                Sign Up
              </span>
            </div>
          </div>
          {/* Hamburger for mobile */}
          <button
            className="md:hidden flex items-center justify-center p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#4fd1c5]"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="Open menu"
          >
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-white">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        {/* Mobile Dropdown Menu */}
        <style>{`
          @keyframes dropdownIn {
            0% { opacity: 0; transform: translateY(-24px) scaleY(0.98); }
            100% { opacity: 1; transform: translateY(0) scaleY(1); }
          }
          .nav-underline {
            position: relative;
            overflow: hidden;
          }
          .nav-underline::after {
            content: '';
            position: absolute;
            left: 50%;
            bottom: 0.5rem;
            width: 0;
            height: 3px;
            background: linear-gradient(90deg, #4fd1c5, #13b5b1);
            border-radius: 2px;
            transition: width 0.3s cubic-bezier(.4,2,.3,1), left 0.3s cubic-bezier(.4,2,.3,1);
          }
          .nav-underline:hover::after, .nav-underline:focus::after {
            width: 60%;
            left: 20%;
          }
          .btn-pulse:active {
            box-shadow: 0 0 0 8px #4fd1c533, 0 2px 24px #4fd1c5aa;
            transform: scale(0.97);
            transition: box-shadow 0.2s, transform 0.2s;
          }
        `}</style>
        {menuOpen && (
          <div
            className="md:hidden absolute left-0 top-full w-full z-40"
            style={{ pointerEvents: menuOpen ? 'auto' : 'none' }}
          >
            <div
              className="mx-auto mt-2 max-w-sm rounded-2xl border-4 border-transparent bg-black/80 backdrop-blur-2xl shadow-2xl flex flex-col items-center py-6 px-4 animate-dropdownIn"
              style={{
                animation: 'dropdownIn 0.35s cubic-bezier(.4,2,.3,1) both',
                borderImage: 'linear-gradient(90deg, #4fd1c5, #13b5b1) 1',
                boxShadow: '0 8px 40px #4fd1c555, 0 2px 24px #13b5b155',
                background: 'linear-gradient(120deg, rgba(24,64,74,0.92) 60%, rgba(31,31,31,0.92) 100%)',
              }}
            >
              {/* Brand logo at top */}
              <img src="/logo-white.png" alt="Prepza Logo" className="h-12 w-12 object-contain mb-4" />
              {/* Nav links with animated underline */}
              {navLinks.map((link) => (
                link.external ? (
                  <a
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="nav-underline text-xl font-extrabold tracking-tight text-white w-full text-center py-3 rounded transition-all duration-200 hover:text-[#4fd1c5] focus:text-[#4fd1c5] mb-1"
                    style={{letterSpacing: '0.01em'}}
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.name}
                  </a>
                ) : (
                  <span
                    key={link.name}
                    className="nav-underline text-xl font-extrabold tracking-tight text-white w-full text-center py-3 rounded transition-all duration-200 hover:text-[#4fd1c5] focus:text-[#4fd1c5] mb-1 cursor-pointer"
                    style={{letterSpacing: '0.01em'}}
                    onClick={() => handleNav(link.to)}
                  >
                    {link.name}
                  </span>
                )
              ))}
              {/* Divider */}
              <div className="w-full border-t border-[#333] my-4" />
              {/* Auth buttons with pulse effect */}
              <span
                className="btn-pulse w-full mb-1 px-6 py-3 rounded-full font-bold text-lg border-2 border-[#4fd1c5] text-[#4fd1c5] bg-black/60 hover:bg-[#1a1a1a] hover:text-[#7fe3e0] shadow-[0_2px_16px_#4fd1c555] transition-all duration-200 focus:outline-none text-center cursor-pointer"
                onClick={() => handleNav('/login')}
              >
                Login
              </span>
              <span
                className="btn-pulse w-full px-6 py-3 rounded-full font-bold text-lg shadow-[0_2px_24px_#4fd1c5aa] transition-all duration-200 bg-[#4fd1c5] text-[#18404a] hover:bg-[#5ff5e0] focus:bg-[#5ff5e0] focus:outline-none text-center cursor-pointer"
                onClick={() => handleNav('/signup')}
              >
                Sign Up
              </span>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar; 