import React, { useState } from 'react';
import { UserProfile } from '../types';
import {
  auth,
  db,
  googleProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  doc,
  setDoc,
  getDoc,
} from '../lib/firebase';
import { Lock, Mail, User, Sparkles, AlertCircle, Loader2 } from 'lucide-react';

interface AuthViewProps {
  initialMode?: 'signin' | 'signup';
  onSuccess: (user: UserProfile, isNewUser: boolean) => void;
  onSkip?: () => void;
  onShowToast: (msg: string) => void;
}

const PROFESSIONS = [
  { id: 'Student', label: '🎓 Student' },
  { id: 'Influencer', label: '📱 Influencer / Content Creator' },
  { id: 'Teacher', label: '👩‍🏫 Teacher / Educator' },
  { id: 'Engineer', label: '💻 Engineer / IT' },
  { id: 'Doctor', label: '🩺 Doctor / Healthcare' },
  { id: 'Driver', label: '🚗 Driver / Transport' },
  { id: 'Senior Citizen', label: '🧓 Senior Citizen' },
  { id: 'Entrepreneur', label: '💼 Business / Entrepreneur' },
  { id: 'Homemaker', label: '🏡 Homemaker' },
  { id: 'Artist', label: '🎨 Artist / Creative' },
  { id: 'Other', label: '✨ Other (Specify)' },
];

export const AuthView: React.FC<AuthViewProps> = ({
  initialMode = 'signup',
  onSuccess,
  onSkip,
  onShowToast,
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [profession, setProfession] = useState('Student');
  const [customProfession, setCustomProfession] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // 1-Click Instant Google Sign-In (Cross-platform PC & Mobile)
  const handleGoogleSignIn = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;
      const cleanEmail = (fbUser.email || '').toLowerCase();
      const displayName = fbUser.displayName || name.trim() || cleanEmail.split('@')[0] || 'Friend';

      // Persist profile in Firestore
      try {
        await setDoc(
          doc(db, 'users', fbUser.uid),
          {
            id: fbUser.uid,
            name: displayName,
            email: cleanEmail,
            createdAt: Date.now(),
            lastLogin: Date.now(),
          },
          { merge: true }
        );
      } catch (dbErr) {
        console.warn('Firestore profile write note:', dbErr);
      }

      // Local storage backup
      try {
        const stored = JSON.parse(localStorage.getItem('wellspring_accounts') || '{}');
        stored[cleanEmail] = {
          id: fbUser.uid,
          name: displayName,
          email: cleanEmail,
        };
        localStorage.setItem('wellspring_accounts', JSON.stringify(stored));
      } catch (e) {
        // ignore
      }

      const user: UserProfile = {
        id: fbUser.uid,
        name: displayName,
        email: cleanEmail,
      };

      onSuccess(user, false);
      onShowToast(`Welcome, ${displayName}! 🌸 Signed in with Google across devices.`);
    } catch (gErr: any) {
      console.error('Google Sign-In error:', gErr);
      if (gErr.code !== 'auth/popup-closed-by-user') {
        setErrorMsg(gErr.message || 'Could not complete Google Sign-In. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !password) {
      setErrorMsg('Please provide all required credentials.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      if (mode === 'signup') {
        if (!name.trim()) {
          setErrorMsg('Please enter your name.');
          setLoading(false);
          return;
        }

        let userCredential: any = null;
        let fbUid = '';
        let isLocalFallback = false;

        // Try Firebase Authentication
        try {
          userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, password);
          fbUid = userCredential.user.uid;
        } catch (firebaseErr: any) {
          if (firebaseErr.code === 'auth/email-already-in-use') {
            setErrorMsg('An account with this email already exists. Please switch to Sign In.');
            setLoading(false);
            return;
          }

          // If Firebase Auth has Email/Password disabled in Firebase Console (auth/operation-not-allowed)
          if (firebaseErr.code === 'auth/operation-not-allowed') {
            console.warn('Firebase Email/Password is disabled in console. Activating local device account with cloud readiness.');
            isLocalFallback = true;
            fbUid = 'user_' + btoa(cleanEmail).replace(/[^a-zA-Z0-9]/g, '');
          } else {
            throw firebaseErr;
          }
        }

        // 2. Persist profile document in Firestore cloud database if authenticated
        const finalProfession =
          profession === 'Other' ? (customProfession.trim() || 'Other') : profession;

        if (userCredential) {
          try {
            await setDoc(doc(db, 'users', fbUid), {
              id: fbUid,
              name: name.trim(),
              age: age.trim() || null,
              profession: finalProfession,
              email: cleanEmail,
              createdAt: Date.now(),
            });
          } catch (dbErr) {
            console.warn('Could not write users doc in Firestore:', dbErr);
          }
        }

        // 3. Save account in local accounts directory
        try {
          const stored = JSON.parse(localStorage.getItem('wellspring_accounts') || '{}');
          stored[cleanEmail] = {
            id: fbUid,
            name: name.trim(),
            age: age.trim(),
            profession: finalProfession,
            password,
          };
          localStorage.setItem('wellspring_accounts', JSON.stringify(stored));
        } catch (e) {
          console.error(e);
        }

        const user: UserProfile = {
          id: fbUid,
          name: name.trim(),
          age: age.trim(),
          profession: finalProfession,
          email: cleanEmail,
        };

        onSuccess(user, true);
        if (isLocalFallback) {
          onShowToast(`Account created for ${user.name}! 🌸 Tip: Use "Continue with Google" for instant PC & mobile sync.`);
        } else {
          onShowToast(`Welcome to Wellspring, ${user.name}! 🌸 Cloud sync active across PC & mobile.`);
        }
      } else {
        // Sign In
        let fbUserUid = '';
        let profileName = '';
        let profileAge = '';
        let profileProfession = '';

        try {
          const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, password);
          fbUserUid = userCredential.user.uid;

          // Fetch profile details from Firestore
          try {
            const userDocSnap = await getDoc(doc(db, 'users', fbUserUid));
            if (userDocSnap.exists()) {
              const uData = userDocSnap.data();
              profileName = uData.name || '';
              profileAge = uData.age || '';
              profileProfession = uData.profession || '';
            }
          } catch (e) {
            console.warn('Could not load user doc from Firestore:', e);
          }
        } catch (firebaseErr: any) {
          console.warn('Firebase sign-in response:', firebaseErr.code || firebaseErr.message);

          // Fallback to local accounts directory
          const stored = JSON.parse(localStorage.getItem('wellspring_accounts') || '{}');
          const localAcc = stored[cleanEmail];

          if (localAcc && localAcc.password === password) {
            fbUserUid = localAcc.id || `local-${cleanEmail}`;
            profileName = localAcc.name || cleanEmail.split('@')[0];
            profileAge = localAcc.age || '';
            profileProfession = localAcc.profession || '';
          } else if (localAcc && localAcc.password !== password) {
            setErrorMsg('Incorrect password. Please verify your password and try again.');
            setLoading(false);
            return;
          } else {
            if (firebaseErr.code === 'auth/operation-not-allowed') {
              setErrorMsg('Email/Password provider is not enabled in Firebase Console. Please tap "Continue with Google" above to sign in instantly!');
            } else if (firebaseErr.code === 'auth/wrong-password' || firebaseErr.code === 'auth/invalid-credential') {
              setErrorMsg('Incorrect password. Please check your credentials and try again.');
            } else if (firebaseErr.code === 'auth/user-not-found') {
              setErrorMsg('No account found with this email. Please sign up first.');
            } else {
              setErrorMsg(firebaseErr.message || 'Invalid email or password. Please try again.');
            }
            setLoading(false);
            return;
          }
        }

        const finalName = profileName || cleanEmail.split('@')[0];
        const user: UserProfile = {
          id: fbUserUid,
          name: finalName,
          age: profileAge,
          profession: profileProfession || undefined,
          email: cleanEmail,
        };

        onSuccess(user, false);
        onShowToast(`Welcome back, ${user.name}! 🌸`);
      }
    } catch (err: any) {
      console.error('Authentication error:', err);
      setErrorMsg(err.message || 'Authentication error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-8 text-black dark:text-white">
      <div className="relative backdrop-blur-md bg-white/70 dark:bg-[#0c2440]/80 rounded-3xl p-6 sm:p-8 border border-black/15 dark:border-white/15 shadow-2xl shadow-sky-950/20 text-center">
        {onSkip && (
          <button
            id="skipAuthTopBtn"
            type="button"
            onClick={onSkip}
            className="absolute top-4 right-4 sm:top-5 sm:right-5 px-3 py-1 rounded-full text-xs font-semibold bg-black/5 dark:bg-white/10 hover:bg-black/15 dark:hover:bg-white/20 text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white transition-all cursor-pointer flex items-center gap-1 shadow-sm"
            title="Skip sign-up and explore as guest"
          >
            <span>Skip</span>
            <span className="text-[11px]">➔</span>
          </button>
        )}

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-black/10 dark:bg-white/15 text-black dark:text-white border border-black/15 dark:border-white/15 mb-3">
          <span>🌸</span>
          <span>❀｡˚○ WellSpring</span>
        </div>
        <h2 className="text-2xl font-bold font-serif text-black dark:text-white">
          {mode === 'signup' ? 'Create Your Account' : 'Welcome Back'}
        </h2>
        <p className="text-xs sm:text-sm text-black/80 dark:text-white/80 mt-1 mb-5">
          {mode === 'signup'
            ? 'Sign up to unlock your personalized wellness and AI companion journey.'
            : 'Sign in to continue your mental health progress.'}
        </p>

        {/* 1-Click Google Sign-In Button (Native Cloud Sync on PC & Mobile) */}
        <div className="mb-5">
          <button
            id="googleSignInBtn"
            type="button"
            disabled={loading}
            onClick={handleGoogleSignIn}
            className="w-full py-3 px-4 rounded-2xl bg-white dark:bg-black/40 border border-black/20 dark:border-white/25 hover:border-black dark:hover:border-white text-black dark:text-white font-semibold text-sm shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-3 cursor-pointer hover:scale-[1.01] disabled:opacity-60"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3h3.88c2.27-2.09 3.66-5.17 3.66-9.09z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.09C3.26 21.36 7.33 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.32c-.25-.72-.38-1.49-.38-2.32s.13-1.6.38-2.32V6.59H1.26C.46 8.2 0 9.99 0 12s.46 3.8 1.26 5.41l4.02-3.09z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.26 6.59l4.02 3.09c.95-2.83 3.6-4.93 6.72-4.93z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>
          <div className="mt-1.5 flex items-center justify-center gap-1.5 text-[11px] text-black/60 dark:text-white/60">
            <Sparkles className="w-3 h-3 text-sky-500" />
            <span>Instant 1-click sync on PC &amp; Mobile</span>
          </div>
        </div>

        {/* Divider */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-black/15 dark:border-white/15"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-3 bg-white/90 dark:bg-[#0c2440] text-black/60 dark:text-white/60 font-medium">
              or continue with email &amp; password
            </span>
          </div>
        </div>

        {/* Auth Tabs */}
        <div className="grid grid-cols-2 p-1 bg-black/10 dark:bg-white/10 border border-black/15 dark:border-white/15 rounded-2xl mb-6">
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setErrorMsg('');
            }}
            className={`py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              mode === 'signup'
                ? 'bg-black text-white dark:bg-white dark:text-black shadow-sm'
                : 'text-black dark:text-white opacity-70 hover:opacity-100'
            }`}
          >
            Sign Up
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setErrorMsg('');
            }}
            className={`py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              mode === 'signin'
                ? 'bg-black text-white dark:bg-white dark:text-black shadow-sm'
                : 'text-black dark:text-white opacity-70 hover:opacity-100'
            }`}
          >
            Sign In
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          {mode === 'signup' && (
            <>
              <div>
                <label className="block text-xs font-bold text-black dark:text-white mb-1">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Max"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/80 dark:bg-black/40 border border-black/20 dark:border-white/20 text-sm text-black dark:text-white placeholder:text-black/40 dark:placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-sky-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-black dark:text-white mb-1">
                  Age
                </label>
                <input
                  id="age"
                  type="number"
                  min="12"
                  max="120"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="Your age"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/80 dark:bg-black/40 border border-black/20 dark:border-white/20 text-sm text-black dark:text-white placeholder:text-black/40 dark:placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-sky-400"
                />
              </div>

              <div>
                <label htmlFor="profession" className="block text-xs font-bold text-black dark:text-white mb-1">
                  Profession / Role
                </label>
                <div className="relative">
                  <select
                    id="profession"
                    value={profession}
                    onChange={(e) => setProfession(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/80 dark:bg-black/40 border border-black/20 dark:border-white/20 text-sm text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-400 cursor-pointer appearance-none pr-10"
                  >
                    {PROFESSIONS.map((p) => (
                      <option key={p.id} value={p.id} className="text-black bg-white dark:bg-slate-900 dark:text-white">
                        {p.label}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-black/60 dark:text-white/60 text-xs">
                    ▼
                  </div>
                </div>

                {profession === 'Other' && (
                  <div className="mt-2">
                    <input
                      id="customProfession"
                      type="text"
                      value={customProfession}
                      onChange={(e) => setCustomProfession(e.target.value)}
                      placeholder="Enter your profession (e.g. Architect, Chef...)"
                      className="w-full px-4 py-2 rounded-xl bg-white/80 dark:bg-black/40 border border-black/20 dark:border-white/20 text-xs text-black dark:text-white placeholder:text-black/40 dark:placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-sky-400"
                    />
                  </div>
                )}
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-bold text-black dark:text-white mb-1">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-2.5 rounded-xl bg-white/80 dark:bg-black/40 border border-black/20 dark:border-white/20 text-sm text-black dark:text-white placeholder:text-black/40 dark:placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-black dark:text-white mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="w-full px-4 py-2.5 rounded-xl bg-white/80 dark:bg-black/40 border border-black/20 dark:border-white/20 text-sm text-black dark:text-white placeholder:text-black/40 dark:placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
          </div>

          {errorMsg && (
            <p className="text-xs font-semibold text-rose-500 text-center">{errorMsg}</p>
          )}

          <button
            id="authSubmitBtn"
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-full bg-black text-white dark:bg-white dark:text-black font-bold text-sm shadow-md transition-all mt-2 cursor-pointer hover:scale-[1.02] disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Synchronizing...</span>
              </>
            ) : mode === 'signup' ? (
              'Create Account & Continue 🌸'
            ) : (
              'Sign In & Continue 🔐'
            )}
          </button>
        </form>

        <div className="mt-4 pt-3 border-t border-black/10 dark:border-white/10 flex items-center justify-center gap-2 text-[11px] text-black/60 dark:text-white/60">
          <Sparkles className="w-3.5 h-3.5 text-sky-500" />
          <span>Cross-Device Cloud Sync: Works seamlessly on PC, Tablet &amp; Mobile</span>
        </div>

        <div className="mt-4 text-xs text-black/70 dark:text-white/70">
          {mode === 'signup' ? (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setErrorMsg('');
                }}
                className="text-rose-500 font-bold underline ml-1 cursor-pointer"
              >
                Sign in
              </button>
            </p>
          ) : (
            <p>
              New to Wellspring?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setErrorMsg('');
                }}
                className="text-rose-500 font-bold underline ml-1 cursor-pointer"
              >
                Create an account
              </button>
            </p>
          )}
        </div>

        {onSkip && (
          <div className="mt-4 pt-3 border-t border-black/10 dark:border-white/10 text-center">
            <button
              id="skipAuthBottomBtn"
              type="button"
              onClick={onSkip}
              className="text-xs text-black/70 dark:text-white/70 hover:text-rose-600 dark:hover:text-rose-400 font-semibold underline transition-colors cursor-pointer"
            >
              Skip sign up &amp; explore WellSpring as Guest ➔
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
