import React, { useState, useEffect } from 'react';
import { PageId, UserProfile, FallingEffect } from './types';
import { Navbar } from './components/Navbar';
import { SakuraBackground } from './components/SakuraBackground';
import { HomeView } from './components/HomeView';
import { AuthView } from './components/AuthView';
import { DailyDashboard } from './components/DailyDashboard';
import { ChatCompanion } from './components/ChatCompanion';
import { MoodJournal } from './components/MoodJournal';
import { VoiceMeditation } from './components/VoiceMeditation';
import { ZenMeditation } from './components/ZenMeditation';
import { MentalAssessment, AssessmentResult } from './components/MentalAssessment';
import { auth, signOut as fbSignOut, onAuthStateChanged, db, doc, getDoc } from './lib/firebase';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageId>('home');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signup');
  const [fallingEffect, setFallingEffect] = useState<FallingEffect>('none');

  // Assessment results
  const [assessmentResult, setAssessmentResult] = useState<{
    score: number;
    status: string;
    summary: string;
  } | null>(null);

  // Sync with Firebase Auth state on mount (cross-device session persistence)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser && fbUser.email) {
        let profileName = fbUser.displayName || '';
        let profileAge = '';

        try {
          const snap = await getDoc(doc(db, 'users', fbUser.uid));
          if (snap.exists()) {
            const data = snap.data();
            profileName = data.name || profileName;
            profileAge = data.age || '';
          }
        } catch (e) {
          console.warn('Could not read user profile from firestore:', e);
        }

        const restoredUser: UserProfile = {
          id: fbUser.uid,
          name: profileName || fbUser.email.split('@')[0],
          email: fbUser.email,
          age: profileAge || undefined,
        };

        setUser(restoredUser);
        localStorage.setItem('wellspring_logged_in', 'true');
        localStorage.setItem('wellspring_uid', fbUser.uid);
        localStorage.setItem('wellspring_username', restoredUser.name);
        localStorage.setItem('wellspring_email', fbUser.email);
        if (profileAge) localStorage.setItem('wellspring_age', profileAge);
      } else {
        // Fallback: check localStorage if offline
        try {
          const isLogged = localStorage.getItem('wellspring_logged_in') === 'true';
          const uid = localStorage.getItem('wellspring_uid');
          const name = localStorage.getItem('wellspring_username');
          const email = localStorage.getItem('wellspring_email');
          const age = localStorage.getItem('wellspring_age');

          if (isLogged && email) {
            setUser({
              id: uid || undefined,
              name: name || email.split('@')[0],
              email,
              age: age || undefined,
            });
          }
        } catch (e) {
          console.error(e);
        }
      }
    });

    try {
      const savedTheme = localStorage.getItem('wellspring_theme');
      if (savedTheme === 'dark') {
        setDarkMode(true);
        document.documentElement.classList.add('dark');
      } else {
        setDarkMode(false);
        document.documentElement.classList.remove('dark');
      }
    } catch (e) {
      console.error(e);
    }

    return () => unsubscribe();
  }, []);

  // Sync dark class on documentElement whenever darkMode changes
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      try {
        localStorage.setItem('wellspring_theme', 'dark');
      } catch (e) {
        console.error(e);
      }
    } else {
      document.documentElement.classList.remove('dark');
      try {
        localStorage.setItem('wellspring_theme', 'light');
      } catch (e) {
        console.error(e);
      }
    }
  }, [darkMode]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3200);
  };

  const handleToggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  // Flower Click Cycle: none -> rain -> leaves -> none
  const handleCycleFallingEffect = () => {
    setFallingEffect((prev) => {
      if (prev === 'none') {
        showToast('🌧️ Rain has started to fall...');
        return 'rain';
      }
      if (prev === 'rain') {
        showToast('🍃 Rain stopped. Leaves and petals are falling...');
        return 'leaves';
      }
      showToast('✨ Clear skies — peaceful calm.');
      return 'none';
    });
  };

  const handleNavigate = (page: PageId) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAuth = (mode: 'signin' | 'signup') => {
    setAuthMode(mode);
    setCurrentPage('auth');
  };

  const handleAuthSuccess = (loggedUser: UserProfile, isNewUser: boolean) => {
    setUser(loggedUser);
    localStorage.setItem('wellspring_logged_in', 'true');
    localStorage.setItem('wellspring_username', loggedUser.name);
    localStorage.setItem('wellspring_email', loggedUser.email);
    if (loggedUser.age) {
      localStorage.setItem('wellspring_age', loggedUser.age);
    }
    showToast(`Welcome back to your sanctuary, ${loggedUser.name}! 🌸`);

    if (isNewUser) {
      setCurrentPage('assessment');
    } else {
      setCurrentPage('dashboard');
    }
  };

  const handleSignOut = async () => {
    try {
      await fbSignOut(auth);
    } catch (e) {
      console.warn('Sign out note:', e);
    }
    setUser(null);
    localStorage.removeItem('wellspring_logged_in');
    localStorage.removeItem('wellspring_uid');
    localStorage.removeItem('wellspring_username');
    localStorage.removeItem('wellspring_email');
    localStorage.removeItem('wellspring_age');
    showToast('Signed out successfully 👋');
    setCurrentPage('home');
  };

  const handleAssessmentComplete = (score: number, status: string, summary: string) => {
    setAssessmentResult({ score, status, summary });
    setCurrentPage('assessment-result');
  };

  return (
    <div className={`min-h-screen relative flex flex-col ${darkMode ? 'dark' : ''} text-black dark:text-white transition-colors duration-500`}>
      {/* Background Cloudscape, Glowing Floating Moon, Starlight & Nature Rain/Leaves Weather System */}
      <SakuraBackground darkMode={darkMode} fallingEffect={fallingEffect} />

      {/* Navigation Header */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        user={user}
        onSignOut={handleSignOut}
        darkMode={darkMode}
        onToggleDarkMode={handleToggleDarkMode}
        onOpenAuth={handleOpenAuth}
        fallingEffect={fallingEffect}
        onCycleFallingEffect={handleCycleFallingEffect}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div
          id="toast"
          className="fixed bottom-5 right-5 z-50 px-5 py-3 rounded-2xl bg-black text-white dark:bg-white dark:text-black font-semibold text-sm shadow-xl animate-in fade-in slide-in-from-bottom-2 duration-300 pointer-events-none border border-white/20 dark:border-black/20"
        >
          {toastMessage}
        </div>
      )}

      {/* Main Content Pages */}
      <main className="flex-1 z-10 text-black dark:text-white">
        {currentPage === 'home' && (
          <HomeView
            onNavigate={handleNavigate}
            onOpenAuth={handleOpenAuth}
          />
        )}

        {currentPage === 'auth' && (
          <AuthView
            initialMode={authMode}
            onSuccess={handleAuthSuccess}
            onSkip={() => {
              const guestUser: UserProfile = {
                id: 'guest-' + Date.now(),
                name: 'Guest Explorer',
                email: 'guest@wellspring.app',
                profession: 'Explorer',
              };
              setUser(guestUser);
              localStorage.setItem('wellspring_logged_in', 'true');
              localStorage.setItem('wellspring_username', 'Guest Explorer');
              localStorage.setItem('wellspring_email', 'guest@wellspring.app');
              handleNavigate('dashboard');
              showToast('Welcome to WellSpring! 🌸 Exploring in Guest Mode.');
            }}
            onShowToast={showToast}
          />
        )}

        {currentPage === 'dashboard' && (
          <DailyDashboard
            user={user}
            onNavigate={handleNavigate}
            onShowToast={showToast}
          />
        )}

        {currentPage === 'chat' && (
          <ChatCompanion user={user} onShowToast={showToast} />
        )}

        {currentPage === 'journal' && (
          <MoodJournal user={user} onShowToast={showToast} />
        )}

        {currentPage === 'voice-meditation' && (
          <VoiceMeditation user={user} onShowToast={showToast} />
        )}

        {currentPage === 'meditation' && (
          <ZenMeditation onShowToast={showToast} />
        )}

        {currentPage === 'assessment' && (
          <MentalAssessment
            onAssessmentComplete={handleAssessmentComplete}
            onNavigate={handleNavigate}
            onShowToast={showToast}
          />
        )}

        {currentPage === 'assessment-result' && assessmentResult && (
          <AssessmentResult
            score={assessmentResult.score}
            status={assessmentResult.status}
            summary={assessmentResult.summary}
            onContinue={() => handleNavigate('dashboard')}
          />
        )}
      </main>

      {/* Footer - Solid Black in light mode, Solid White in dark mode */}
      <footer className="z-10 py-6 text-center text-xs text-black dark:text-white border-t border-black/10 dark:border-white/10">
        <p>❀ Wellspring — Nurturing peace, mindfulness &amp; emotional resilience.</p>
      </footer>
    </div>
  );
}
