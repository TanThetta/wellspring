import React from 'react';
import { PageId, UserProfile, FallingEffect } from '../types';
import { Sun, Moon } from 'lucide-react';

interface NavbarProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  user: UserProfile | null;
  onSignOut: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenAuth: (mode: 'signin' | 'signup') => void;
  fallingEffect: FallingEffect;
  onCycleFallingEffect: () => void;
}

// 5-Petal Flower Icon directly matching the user's uploaded reference image
const FlowerIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="2.8" />
    {[0, 72, 144, 216, 288].map((deg) => (
      <ellipse
        key={deg}
        cx="12"
        cy="6.2"
        rx="2.6"
        ry="3.6"
        transform={`rotate(${deg} 12 12)`}
      />
    ))}
  </svg>
);

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  user,
  onSignOut,
  darkMode,
  onToggleDarkMode,
  onOpenAuth,
  fallingEffect,
  onCycleFallingEffect,
}) => {
  const getFlowerTooltip = () => {
    if (fallingEffect === 'none') {
      return 'Click to start falling rain 🌧️';
    }
    if (fallingEffect === 'rain') {
      return 'Click to stop rain & start falling leaves 🍃';
    }
    return 'Click to return to normal (nothing falling) ✨';
  };

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-white/70 dark:bg-[#07192d]/85 border-b border-black/15 dark:border-white/15 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-4">
        {/* Brand Name - Solid Black in Light Mode, Solid White in Dark Mode */}
        <button
          id="nav-logo"
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 text-2xl sm:text-3xl font-bold font-serif text-black dark:text-white hover:opacity-80 transition-opacity tracking-tight cursor-pointer"
        >
          <span>Wellspring</span>
        </button>

        {/* Navigation Items - Solid Black in Light Mode, Solid White in Dark Mode */}
        <nav className="flex flex-wrap items-center gap-2.5 sm:gap-4 md:gap-5 text-sm font-medium">
          <button
            id="nav-home-btn"
            onClick={() => onNavigate('home')}
            className={`transition-all cursor-pointer ${
              currentPage === 'home'
                ? 'font-bold text-black dark:text-white underline underline-offset-4 decoration-2 decoration-sky-500'
                : 'text-black dark:text-white hover:opacity-75'
            }`}
          >
            Home
          </button>

          {!user ? (
            <>
              <button
                id="nav-signin-btn"
                onClick={() => onOpenAuth('signin')}
                className="text-black dark:text-white hover:opacity-75 transition-opacity cursor-pointer"
              >
                Sign In
              </button>
              <button
                id="nav-signup-btn"
                onClick={() => onOpenAuth('signup')}
                className="text-black dark:text-white hover:opacity-75 transition-opacity cursor-pointer"
              >
                Sign Up
              </button>
            </>
          ) : (
            <span className="text-xs px-2.5 py-1 rounded-full bg-black/10 dark:bg-white/20 text-black dark:text-white font-bold">
              {user.name}
            </span>
          )}

          <button
            id="nav-dashboard-btn"
            onClick={() => onNavigate('dashboard')}
            className={`transition-all cursor-pointer ${
              currentPage === 'dashboard'
                ? 'font-bold text-black dark:text-white underline underline-offset-4 decoration-2 decoration-sky-500'
                : 'text-black dark:text-white hover:opacity-75'
            }`}
          >
            Dashboard
          </button>

          <button
            id="nav-chat-btn"
            onClick={() => onNavigate('chat')}
            className={`transition-all cursor-pointer ${
              currentPage === 'chat'
                ? 'font-bold text-black dark:text-white underline underline-offset-4 decoration-2 decoration-sky-500'
                : 'text-black dark:text-white hover:opacity-75'
            }`}
          >
            AI Companion
          </button>

          <button
            id="nav-journal-btn"
            onClick={() => onNavigate('journal')}
            className={`transition-all cursor-pointer ${
              currentPage === 'journal'
                ? 'font-bold text-black dark:text-white underline underline-offset-4 decoration-2 decoration-sky-500'
                : 'text-black dark:text-white hover:opacity-75'
            }`}
          >
            Mood Journal
          </button>

          <button
            id="nav-voice-meditation-btn"
            onClick={() => onNavigate('voice-meditation')}
            className={`flex items-center gap-1 transition-all cursor-pointer ${
              currentPage === 'voice-meditation'
                ? 'font-bold text-black dark:text-white underline underline-offset-4 decoration-2 decoration-sky-500'
                : 'text-black dark:text-white hover:opacity-75'
            }`}
          >
            <span>Voice Zen</span>
          </button>

          <button
            id="nav-meditation-btn"
            onClick={() => onNavigate('meditation')}
            className={`transition-all cursor-pointer ${
              currentPage === 'meditation'
                ? 'font-bold text-black dark:text-white underline underline-offset-4 decoration-2 decoration-sky-500'
                : 'text-black dark:text-white hover:opacity-75'
            }`}
          >
            Zen Mode
          </button>

          {/* Theme Toggle Button (Sun / Moon) */}
          <button
            id="nav-theme-toggle"
            type="button"
            onClick={onToggleDarkMode}
            title={darkMode ? 'Switch to daylight theme' : 'Switch to twilight theme'}
            className="p-1.5 rounded-full text-black dark:text-white hover:bg-black/10 dark:hover:bg-white/15 transition-colors cursor-pointer"
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-amber-300" />
            ) : (
              <Moon className="w-5 h-5 text-black" />
            )}
          </button>

          {/* Flower Falling Effect Toggle Button (matching reference image) */}
          <button
            id="nav-flower-toggle"
            type="button"
            onClick={onCycleFallingEffect}
            title={getFlowerTooltip()}
            className={`p-1.5 rounded-full transition-all cursor-pointer relative ${
              fallingEffect !== 'none'
                ? 'text-pink-500 dark:text-pink-300 bg-black/10 dark:bg-white/15 scale-110 shadow-sm'
                : 'text-black dark:text-white hover:bg-black/10 dark:hover:bg-white/15'
            }`}
          >
            <FlowerIcon className="w-5 h-5 transition-transform active:scale-90" />
            {fallingEffect === 'rain' && (
              <span className="absolute -top-1 -right-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
              </span>
            )}
            {fallingEffect === 'leaves' && (
              <span className="absolute -top-1 -right-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            )}
          </button>

          {/* Logout button */}
          <button
            id="nav-logout-btn"
            type="button"
            onClick={user ? onSignOut : () => onOpenAuth('signin')}
            className="text-rose-600 dark:text-rose-400 font-semibold hover:underline transition-all text-xs sm:text-sm ml-1 cursor-pointer"
          >
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
};
