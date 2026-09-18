import React from 'react';
import { PageId } from '../types';
import {
  Wind,
  MessageSquareHeart,
  Compass,
  Volume2,
  HeartHandshake,
  ArrowRight,
  BookOpen,
  Heart,
  ShieldCheck,
  Feather,
} from 'lucide-react';

interface HomeViewProps {
  onNavigate: (page: PageId) => void;
  onOpenAuth: (mode: 'signin' | 'signup') => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigate,
  onOpenAuth,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-12 sm:space-y-16 text-black dark:text-white transition-colors duration-300">
      {/* 1. HERO SECTION */}
      <section className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center min-h-[480px]">
        {/* Left Content Column */}
        <div className="lg:col-span-7 flex flex-col justify-center z-10 space-y-5">
          {/* Main Title - Black in light, White in dark */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-serif text-black dark:text-white tracking-tight drop-shadow-sm">
            Wellspring
          </h1>

          {/* Subtitle - Black in light, White in dark */}
          <p className="text-lg sm:text-xl font-serif text-black dark:text-white leading-relaxed max-w-xl">
            A calm space to pause, reflect, breathe, and build gentle wellness habits.
          </p>

          {/* Frosted Glass Box - ONLY TWO LINES, NO CREATOR NAMES AT THE START */}
          <div
            id="hero-story-box"
            className="backdrop-blur-md bg-white/75 dark:bg-[#0a233e]/75 border border-black/15 dark:border-white/15 rounded-2xl p-4 sm:p-5 shadow-lg max-w-xl text-black dark:text-white transition-all"
          >
            <p className="text-base sm:text-lg font-medium text-black dark:text-white leading-relaxed">
              A serene space designed to help you pause, reflect, and breathe deeply.
            </p>
            <p className="text-sm sm:text-base text-black dark:text-white leading-relaxed mt-1.5">
              Build lasting wellness habits and gently reconnect with yourself each day.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3.5 pt-1">
            <button
              id="hero-signup-btn"
              type="button"
              onClick={() => onOpenAuth('signup')}
              className="px-5 py-2.5 text-base font-bold text-black dark:text-white hover:opacity-75 transition-opacity cursor-pointer"
            >
              Sign Up
            </button>

            <button
              id="hero-signin-btn"
              type="button"
              onClick={() => onOpenAuth('signin')}
              className="px-8 py-2.5 rounded-full bg-white/75 dark:bg-white/20 text-black dark:text-white font-bold text-base shadow-md border border-black/15 dark:border-white/20 hover:scale-105 transition-all cursor-pointer"
            >
              Sign In
            </button>
          </div>
        </div>

        {/* Right Area - Open to showcase the animated floating moon and drifting clouds */}
        <div
          className="lg:col-span-5 flex items-center justify-center relative py-12 lg:py-0 min-h-[280px] sm:min-h-[340px] cursor-pointer group select-none"
          onClick={() => onNavigate('meditation')}
          title="Click to begin Zen Breathing with the Moon 🌙"
        >
          {/* Gentle interactive hover indicator */}
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-4 py-2 rounded-full bg-black/60 dark:bg-white/80 text-white dark:text-black text-xs font-semibold backdrop-blur-md shadow-lg pointer-events-none">
            Click moon to enter Zen Mode 🌙
          </div>
        </div>
      </section>

      {/* 2. "WHY WELLSPRING?" SECTION - COMPACT & SMALL AS REQUESTED */}
      <section className="relative pt-1">
        <div className="mb-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-black/10 dark:bg-white/15 text-black dark:text-white border border-black/15 dark:border-white/15 mb-1 shadow-xs">
            <span>❀｡˚○</span>
            <span>Why WellSpring?</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold font-serif text-black dark:text-white tracking-tight">
            Why WellSpring?
          </h2>
          <p className="text-xs sm:text-sm text-black dark:text-white mt-0.5 max-w-xl leading-snug">
            A quiet pause in a demanding world to soften your shoulders and come home to yourself.
          </p>
        </div>

        {/* 3 Compact Micro-Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {/* Micro 1 */}
          <div className="backdrop-blur-md bg-white/70 dark:bg-[#0c2440]/75 rounded-2xl p-3.5 border border-black/15 dark:border-white/15 shadow-md flex flex-col justify-between">
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-sky-100 dark:bg-sky-900/60 text-sky-800 dark:text-sky-200 flex items-center justify-center shrink-0 shadow-xs">
                <Feather className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-black dark:text-white font-serif">
                  A Haven Away from Noise
                </h3>
                <p className="text-xs text-black dark:text-white leading-relaxed mt-1">
                  An unhurried, peaceful oasis free from notifications, comparison, and deadlines.
                </p>
              </div>
            </div>
            <div className="mt-2.5 pt-2 border-t border-black/10 dark:border-white/10 text-[11px] font-bold text-black dark:text-white">
              Breathe at your own pace
            </div>
          </div>

          {/* Micro 2 */}
          <div className="backdrop-blur-md bg-white/70 dark:bg-[#0c2440]/75 rounded-2xl p-3.5 border border-black/15 dark:border-white/15 shadow-md flex flex-col justify-between">
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 flex items-center justify-center shrink-0 shadow-xs">
                <Heart className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-black dark:text-white font-serif">
                  Zero Judgment for Emotions
                </h3>
                <p className="text-xs text-black dark:text-white leading-relaxed mt-1">
                  Joy 😊, anxiety 😰, sadness 😔, or tears 😭 — every feeling is welcomed with kindness.
                </p>
              </div>
            </div>
            <div className="mt-2.5 pt-2 border-t border-black/10 dark:border-white/10 text-[11px] font-bold text-black dark:text-white">
              All feelings are valid
            </div>
          </div>

          {/* Micro 3 */}
          <div className="backdrop-blur-md bg-white/70 dark:bg-[#0c2440]/75 rounded-2xl p-3.5 border border-black/15 dark:border-white/15 shadow-md flex flex-col justify-between">
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 flex items-center justify-center shrink-0 shadow-xs">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-black dark:text-white font-serif">
                  Holistic Science &amp; Solfeggio
                </h3>
                <p className="text-xs text-black dark:text-white leading-relaxed mt-1">
                  Diaphragmatic breathing, 528 Hz &amp; 432 Hz frequencies, and empathetic AI guidance.
                </p>
              </div>
            </div>
            <div className="mt-2.5 pt-2 border-t border-black/10 dark:border-white/10 text-[11px] font-bold text-black dark:text-white">
              Mind, sound &amp; reflection
            </div>
          </div>
        </div>
      </section>

      {/* 3. "WHAT WE PROVIDE / WHAT THE FEATURE WE HAVE" SECTION */}
      <section className="relative pt-2">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-black/10 dark:bg-white/15 text-black dark:text-white border border-black/15 dark:border-white/15 mb-2 shadow-xs">
              <span>❀｡˚○</span>
              <span>Comprehensive Sanctuary</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-black dark:text-white tracking-tight">
              What We Provide — Features
            </h2>
            <p className="text-xs sm:text-sm text-black dark:text-white mt-1 max-w-2xl leading-relaxed">
              Explore our six mindful wellness tools, thoughtfully designed to restore calm, support emotional expression,
              and bring clarity to your everyday life.
            </p>
          </div>
          <div className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-bold bg-white/70 dark:bg-sky-950/70 text-black dark:text-white border border-black/15 dark:border-white/15 shadow-sm">
            <span>6 Complete Wellness Tools</span>
          </div>
        </div>

        {/* Feature Cards Grid (6 Modules) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Card 1: Daily Mindfulness Diary */}
          <div
            id="feature-mood-journal"
            onClick={() => onNavigate('journal')}
            className="group backdrop-blur-md bg-white/70 dark:bg-[#0c2644]/75 rounded-2xl p-5 border border-black/15 dark:border-white/15 hover:border-black/30 dark:hover:border-sky-400/50 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-xs">
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-amber-200 dark:bg-amber-900/60 text-black dark:text-amber-200">
                  Multimedia Diary
                </span>
                <span className="text-xs">😊 😰 😔 😭</span>
              </div>
              <h3 className="font-bold text-base text-black dark:text-white mb-1 font-serif">
                Daily Mindfulness Diary
              </h3>
              <p className="text-xs text-black dark:text-white leading-relaxed font-normal">
                Express what happened today with 4 mood emojis, snap memories via device camera, dictate with voice-to-text,
                and record audio memos with instant Gemini self-care reflections.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-black dark:text-white group-hover:underline">
              <span>Write in diary today</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 2: Voice Zen Meditation */}
          <div
            id="feature-voice-zen"
            onClick={() => onNavigate('voice-meditation')}
            className="group backdrop-blur-md bg-white/70 dark:bg-[#0c2644]/75 rounded-2xl p-5 border border-black/15 dark:border-white/15 hover:border-black/30 dark:hover:border-sky-400/50 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-sky-100 dark:bg-sky-900/60 text-sky-800 dark:text-sky-200 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-xs">
                <Volume2 className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-sky-200 dark:bg-sky-900/60 text-black dark:text-sky-200">
                  Audio Immersion
                </span>
              </div>
              <h3 className="font-bold text-base text-black dark:text-white mb-1 font-serif">
                Voice Zen Meditation
              </h3>
              <p className="text-xs text-black dark:text-white leading-relaxed font-normal">
                Spoken personalized guided wind-downs, restorative affirmations, and soothing sleep journeys
                crafted dynamically for deep nervous system relief.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-black dark:text-white group-hover:underline">
              <span>Listen to voice meditation</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 3: AI Companion */}
          <div
            id="feature-ai-companion"
            onClick={() => onNavigate('chat')}
            className="group backdrop-blur-md bg-white/70 dark:bg-[#0c2644]/75 rounded-2xl p-5 border border-black/15 dark:border-white/15 hover:border-black/30 dark:hover:border-sky-400/50 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-pink-100 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-xs">
                <MessageSquareHeart className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-pink-200 dark:bg-pink-900/60 text-black dark:text-pink-200">
                  Gemini 3.8 Flash
                </span>
              </div>
              <h3 className="font-bold text-base text-black dark:text-white mb-1 font-serif">
                AI Empathy Companion ❀｡˚○
              </h3>
              <p className="text-xs text-black dark:text-white leading-relaxed font-normal">
                Genuine, natural emotional support powered by Gemini AI with humor, gentle listening,
                voice readouts, and conversational comfort in English, Tamil, and Tanglish.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-black dark:text-white group-hover:underline">
              <span>Talk with Companion</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 4: Zen Breathing */}
          <div
            id="feature-zen-mode"
            onClick={() => onNavigate('meditation')}
            className="group backdrop-blur-md bg-white/70 dark:bg-[#0c2644]/75 rounded-2xl p-5 border border-black/15 dark:border-white/15 hover:border-black/30 dark:hover:border-sky-400/50 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-xs">
                <Wind className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-200 dark:bg-emerald-900/60 text-black dark:text-emerald-200">
                  Solfeggio Sound
                </span>
              </div>
              <h3 className="font-bold text-base text-black dark:text-white mb-1 font-serif">
                Zen Breathing &amp; Tones
              </h3>
              <p className="text-xs text-black dark:text-white leading-relaxed font-normal">
                Harmonic Solfeggio sound therapy (528 Hz &amp; 432 Hz) with visual expansion breathing cycles
                to reset heart rate variability and induce rapid peaceful stillness.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-black dark:text-white group-hover:underline">
              <span>Enter Zen mode</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 5: Daily Progress & Habits */}
          <div
            id="feature-daily-progress"
            onClick={() => onNavigate('dashboard')}
            className="group backdrop-blur-md bg-white/70 dark:bg-[#0c2644]/75 rounded-2xl p-5 border border-black/15 dark:border-white/15 hover:border-black/30 dark:hover:border-sky-400/50 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-xs">
                <Compass className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-indigo-200 dark:bg-indigo-900/60 text-black dark:text-indigo-200">
                  Daily Tracker
                </span>
              </div>
              <h3 className="font-bold text-base text-black dark:text-white mb-1 font-serif">
                Daily Wellness Habits
              </h3>
              <p className="text-xs text-black dark:text-white leading-relaxed font-normal">
                Track hydration cups, mindful meditation minutes, streak days, weekly emotional trends,
                and self-compassion goals seamlessly on your private dashboard.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-black dark:text-white group-hover:underline">
              <span>Open dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 6: Holistic Assessment */}
          <div
            id="feature-wellness-check"
            onClick={() => onNavigate('assessment')}
            className="group backdrop-blur-md bg-white/70 dark:bg-[#0c2644]/75 rounded-2xl p-5 border border-black/15 dark:border-white/15 hover:border-black/30 dark:hover:border-sky-400/50 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-xs">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-rose-200 dark:bg-rose-900/60 text-black dark:text-rose-200">
                  Self-Check
                </span>
              </div>
              <h3 className="font-bold text-base text-black dark:text-white mb-1 font-serif">
                Wellness Balance Assessment
              </h3>
              <p className="text-xs text-black dark:text-white leading-relaxed font-normal">
                Take a confidential, rapid 10-question self-check to evaluate sleep quality, emotional energy,
                mindfulness routines, and receive custom gentle recommendations.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-black dark:text-white group-hover:underline">
              <span>Start assessment</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </section>

      {/* 4. "MEET THE CREATORS" SECTION */}
      <section className="relative pt-4 pb-4">
        <div className="backdrop-blur-md bg-white/75 dark:bg-[#0a233e]/85 rounded-3xl p-6 sm:p-8 border border-black/15 dark:border-white/15 shadow-xl shadow-sky-950/15 text-black dark:text-white">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-6">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-black/10 dark:bg-white/15 text-black dark:text-white border border-black/15 dark:border-white/20 mb-2 shadow-xs">
              <span>❀｡˚○</span>
              <span>Vision &amp; Heart</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-black dark:text-white tracking-tight">
              Meet the Creators of WellSpring
            </h2>
            <p className="text-xs sm:text-sm text-black dark:text-white mt-1.5 leading-relaxed">
              WellSpring was lovingly brought to life by three close friends who believe that mental wellness,
              calm reflection, and emotional healing should be accessible, comforting, and nurturing for everyone.
            </p>
          </div>

          {/* 3 Creator Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
            {/* Creator 1: Harini P */}
            <div className="backdrop-blur-sm bg-white/80 dark:bg-sky-950/60 rounded-2xl p-5 border border-black/15 dark:border-white/15 text-center flex flex-col items-center justify-between hover:scale-102 transition-all shadow-sm">
              <div>
                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-sky-400 to-indigo-300 text-white flex items-center justify-center text-xl font-serif font-bold mb-2.5 shadow-md">
                  H
                </div>
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-black/10 dark:bg-white/15 text-black dark:text-white mb-1.5 border border-black/10 dark:border-white/10">
                  <span>🌸 Creator</span>
                </div>
                <h3 className="text-base sm:text-lg font-bold font-serif text-black dark:text-white">
                  Harini P
                </h3>
                <p className="text-xs font-bold text-black dark:text-white mb-2">
                  Empathetic AI &amp; Wellness Technology • Wellness Architecture
                </p>
                <p className="text-xs text-black dark:text-white leading-relaxed italic">
                  "Blending compassionate AI intelligence and wellness architecture to craft a truly safe emotional harbor."
                </p>
              </div>
              <div className="mt-3.5 text-[10px] uppercase tracking-widest text-black dark:text-white font-bold">
                ❀｡˚○ WellSpring Co-Founder
              </div>
            </div>

            {/* Creator 2: Tanya Kukreti */}
            <div className="backdrop-blur-sm bg-white/80 dark:bg-sky-950/60 rounded-2xl p-5 border border-black/15 dark:border-white/15 text-center flex flex-col items-center justify-between hover:scale-102 transition-all shadow-sm">
              <div>
                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-pink-400 to-rose-300 text-white flex items-center justify-center text-xl font-serif font-bold mb-2.5 shadow-md">
                  T
                </div>
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-black/10 dark:bg-white/15 text-black dark:text-white mb-1.5 border border-black/10 dark:border-white/10">
                  <span>🌸 Creator</span>
                </div>
                <h3 className="text-base sm:text-lg font-bold font-serif text-black dark:text-white">
                  Tanya Kukreti
                </h3>
                <p className="text-xs font-bold text-black dark:text-white mb-2">
                  Mindful Experience &amp; Creative UI/UX Design
                </p>
                <p className="text-xs text-black dark:text-white leading-relaxed italic">
                  "Designing serene spaces and gentle sensory interactions that remind us to soften our shoulders and breathe."
                </p>
              </div>
              <div className="mt-3.5 text-[10px] uppercase tracking-widest text-black dark:text-white font-bold">
                ❀｡˚○ WellSpring Co-Founder
              </div>
            </div>

            {/* Creator 3: Yugashanmathi S */}
            <div className="backdrop-blur-sm bg-white/80 dark:bg-sky-950/60 rounded-2xl p-5 border border-black/15 dark:border-white/15 text-center flex flex-col items-center justify-between hover:scale-102 transition-all shadow-sm">
              <div>
                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-400 to-teal-300 text-white flex items-center justify-center text-xl font-serif font-bold mb-2.5 shadow-md">
                  Y
                </div>
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-black/10 dark:bg-white/15 text-black dark:text-white mb-1.5 border border-black/10 dark:border-white/10">
                  <span>🌸 Creator</span>
                </div>
                <h3 className="text-base sm:text-lg font-bold font-serif text-black dark:text-white">
                  Yugashanmathi S
                </h3>
                <p className="text-xs font-bold text-black dark:text-white mb-2">
                  Database &amp; System Architecture
                </p>
                <p className="text-xs text-black dark:text-white leading-relaxed italic">
                  "Engineering resilient database architecture and reliable systems to safeguard your personal wellness journey."
                </p>
              </div>
              <div className="mt-3.5 text-[10px] uppercase tracking-widest text-black dark:text-white font-bold">
                ❀｡˚○ WellSpring Co-Founder
              </div>
            </div>
          </div>

          {/* Creators Footer Statement */}
          <div className="pt-4 border-t border-black/15 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-black dark:text-white text-center sm:text-left">
            <div className="flex items-center gap-2">
              <span className="text-sm">❀｡˚○</span>
              <span>
                Envisioned with love and mindfulness by <strong className="font-bold text-black dark:text-white">Harini P</strong>, <strong className="font-bold text-black dark:text-white">Tanya Kukreti</strong>, and <strong className="font-bold text-black dark:text-white">Yugashanmathi S</strong>.
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onNavigate('journal')}
                className="px-4 py-1.5 rounded-full bg-black text-white dark:bg-white dark:text-black font-bold text-xs hover:scale-105 transition-all cursor-pointer"
              >
                Write in Diary 📖
              </button>
              <button
                type="button"
                onClick={() => onNavigate('meditation')}
                className="px-4 py-1.5 rounded-full bg-black/10 dark:bg-white/15 text-black dark:text-white font-bold text-xs hover:bg-black/20 dark:hover:bg-white/25 transition-all cursor-pointer"
              >
                Zen Breathing 🌙
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
