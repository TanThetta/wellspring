import React, { useState, useEffect } from 'react';
import { PageId, UserProfile } from '../types';
import { UNIQUE_31_DAILY_EXERCISES, ExtendedDailyExercise } from '../data/dailyExercises';
import {
  CheckCircle2,
  MessageSquareHeart,
  Wind,
  BookOpen,
  Volume2,
  Calendar,
  Sparkles,
  Shuffle,
  Grid,
  Clock,
  Flame,
  ChevronRight,
  X,
} from 'lucide-react';

interface DailyDashboardProps {
  user: UserProfile | null;
  onNavigate: (page: PageId) => void;
  onShowToast: (msg: string) => void;
}

function getTodayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export const DailyDashboard: React.FC<DailyDashboardProps> = ({ user, onNavigate, onShowToast }) => {
  const [completed, setCompleted] = useState(false);
  const [streak, setStreak] = useState<number>(1);
  const todayKey = getTodayKey();
  const currentDayOfMonth = new Date().getDate(); // 1 to 31
  
  // Default to today's date in month (0-indexed)
  const defaultDayIndex = (currentDayOfMonth - 1) % UNIQUE_31_DAILY_EXERCISES.length;
  const [activeExerciseIndex, setActiveExerciseIndex] = useState<number>(defaultDayIndex);
  const [showCatalogModal, setShowCatalogModal] = useState<boolean>(false);

  const currentExercise = UNIQUE_31_DAILY_EXERCISES[activeExerciseIndex] || UNIQUE_31_DAILY_EXERCISES[0];

  useEffect(() => {
    const savedDate = localStorage.getItem('wellspring_task_date');
    const isComp = localStorage.getItem('wellspring_task_completed') === 'true';
    const savedStreak = parseInt(localStorage.getItem('wellspring_streak') || '1', 10);
    setStreak(savedStreak);

    if (isComp && savedDate === todayKey) {
      setCompleted(true);
    } else {
      setCompleted(false);
    }
  }, [todayKey]);

  const handleCompleteTask = () => {
    const newStreak = completed ? streak : streak + 1;
    localStorage.setItem('wellspring_task_date', todayKey);
    localStorage.setItem('wellspring_task_completed', 'true');
    localStorage.setItem('wellspring_streak', newStreak.toString());
    setCompleted(true);
    setStreak(newStreak);
    onShowToast(`Day ${currentExercise.dayNumber} task completed! 🌟 Streak: ${newStreak} days`);
  };

  const handleShuffleExercise = () => {
    let nextIdx = Math.floor(Math.random() * UNIQUE_31_DAILY_EXERCISES.length);
    if (nextIdx === activeExerciseIndex) {
      nextIdx = (nextIdx + 1) % UNIQUE_31_DAILY_EXERCISES.length;
    }
    setActiveExerciseIndex(nextIdx);
    onShowToast(`Loaded: ${UNIQUE_31_DAILY_EXERCISES[nextIdx].title} 🎲`);
  };

  const handleSelectExercise = (idx: number) => {
    setActiveExerciseIndex(idx);
    setShowCatalogModal(false);
    onShowToast(`Viewing Day ${UNIQUE_31_DAILY_EXERCISES[idx].dayNumber} Exercise 🌸`);
  };

  const handleResetToToday = () => {
    setActiveExerciseIndex(defaultDayIndex);
    onShowToast("Reset to Today's Calendar Exercise 📅");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6 text-black dark:text-white">
      {/* Welcome Banner */}
      <div className="backdrop-blur-md bg-white/70 dark:bg-[#0c2440]/80 rounded-3xl p-6 sm:p-8 border border-black/15 dark:border-white/15 shadow-xl shadow-sky-950/15">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs sm:text-sm font-semibold text-black dark:text-white uppercase tracking-wider flex items-center gap-2">
              <span>🌸 Welcome Back</span>
              {user?.profession && (
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300 border border-sky-300 dark:border-sky-800">
                  {user.profession}
                </span>
              )}
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-black dark:text-white mt-1">
              <span id="userName" className="text-black dark:text-white">
                {user?.name || 'Friend'}
              </span>
              , take a deep breath.
            </h1>
            <p className="text-xs sm:text-sm text-black dark:text-white mt-1">
              You are here, you are safe, and every small mindful step counts.
            </p>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-black/10 dark:bg-white/15 border border-black/15 dark:border-white/15 text-black dark:text-white text-xs font-semibold">
            <Calendar className="w-4 h-4 text-black dark:text-white" />
            <span>
              {new Date().toLocaleDateString(undefined, {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Today's Mental Exercise - 31 Unique Days */}
      <div className="backdrop-blur-md bg-white/70 dark:bg-[#0c2440]/80 rounded-3xl p-6 sm:p-8 border border-black/15 dark:border-white/15 shadow-xl shadow-sky-950/15 relative">
        {/* Header with Badges & Streak */}
        <div className="flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-black/10 dark:border-white/10">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xl">🌱</span>
              <h2 className="text-xl sm:text-2xl font-bold font-serif text-black dark:text-white">
                Today’s Mental Exercise
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-100 text-sky-900 dark:bg-sky-900/60 dark:text-sky-200 border border-sky-300 dark:border-sky-700">
                Day {currentExercise.dayNumber} of 31 • Unique Daily Task
              </span>
            </div>
            <p className="text-xs text-black/70 dark:text-white/70 mt-1">
              Every single day features a completely new, evidence-based mindfulness challenge.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {completed && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-300 dark:border-emerald-700">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Completed Today
              </span>
            )}

            <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 text-xs font-bold border border-amber-300 dark:border-amber-800">
              <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>{streak} Day Streak</span>
            </div>
          </div>
        </div>

        {/* Action Controls: Shuffle, Browse All 31 Days, Reset to Today */}
        <div className="flex items-center justify-between flex-wrap gap-2 my-4 pt-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-black/5 dark:bg-white/10 text-black dark:text-white border border-black/10 dark:border-white/10">
              🏷️ {currentExercise.category}
            </span>
            <span className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-black/5 dark:bg-white/10 text-black dark:text-white border border-black/10 dark:border-white/10 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{currentExercise.durationMinutes} mins</span>
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {activeExerciseIndex !== defaultDayIndex && (
              <button
                type="button"
                onClick={handleResetToToday}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-sky-100 hover:bg-sky-200 dark:bg-sky-900/60 dark:hover:bg-sky-800 text-sky-900 dark:text-sky-200 text-xs font-bold transition-colors cursor-pointer border border-sky-300 dark:border-sky-700"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Today's Task (Day {currentDayOfMonth})</span>
              </button>
            )}

            <button
              id="shuffleExerciseBtn"
              type="button"
              onClick={handleShuffleExercise}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/10 dark:bg-white/15 hover:bg-black/20 dark:hover:bg-white/25 text-black dark:text-white text-xs font-bold transition-colors cursor-pointer"
              title="Shuffle another unique exercise"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>🎲 Try Another Task</span>
            </button>

            <button
              id="browseExercisesBtn"
              type="button"
              onClick={() => setShowCatalogModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/10 dark:bg-white/15 hover:bg-black/20 dark:hover:bg-white/25 text-black dark:text-white text-xs font-bold transition-colors cursor-pointer"
            >
              <Grid className="w-3.5 h-3.5" />
              <span>All 31 Days</span>
            </button>
          </div>
        </div>

        {/* Active Exercise Content */}
        <div className="mt-2">
          <h3 id="exerciseTitle" className="text-xl font-bold text-black dark:text-white font-serif">
            {currentExercise.title}
          </h3>

          <p id="exerciseDescription" className="text-sm text-black/85 dark:text-white/90 mt-1 leading-relaxed">
            {currentExercise.desc}
          </p>

          {/* Steps */}
          <ul id="exerciseSteps" className="mt-4 space-y-2.5">
            {currentExercise.steps.map((step, idx) => (
              <li
                key={idx}
                className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/70 dark:bg-white/10 border border-black/10 dark:border-white/10 text-sm text-black dark:text-white shadow-xs"
              >
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-black/10 dark:bg-white/20 text-black dark:text-white text-xs font-bold shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{step}</span>
              </li>
            ))}
          </ul>

          {/* Reflection Callout */}
          <div className="mt-4 p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/50 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
            <div className="space-y-0.5">
              <span className="font-bold text-amber-900 dark:text-amber-200 uppercase tracking-wider text-[11px] block">
                💭 Daily Mindful Reflection
              </span>
              <p className="text-black dark:text-white italic">
                "{currentExercise.reflectionPrompt}"
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('journal')}
              className="px-3 py-1.5 rounded-xl bg-amber-200 dark:bg-amber-900 text-amber-950 dark:text-amber-100 font-bold text-xs hover:scale-105 transition-all cursor-pointer whitespace-nowrap"
            >
              Write in Diary ➔
            </button>
          </div>
        </div>

        {/* Action button */}
        <div className="mt-6 flex items-center justify-between flex-wrap gap-3 pt-3 border-t border-black/10 dark:border-white/10">
          <button
            id="completeExerciseBtn"
            type="button"
            onClick={handleCompleteTask}
            disabled={completed}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm transition-all shadow-md cursor-pointer ${
              completed
                ? 'bg-emerald-600 text-white cursor-default shadow-none'
                : 'bg-black text-white dark:bg-white dark:text-black hover:scale-105'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{completed ? '✓ Completed Today' : 'Mark as Complete ✓'}</span>
          </button>

          {completed && (
            <span id="exerciseStatus" className="text-xs text-black dark:text-white font-medium flex items-center gap-1.5">
              <span>🎉</span>
              <span>Great job investing in your peace! Come back tomorrow for Day {((currentExercise.dayNumber % 31) + 1)}'s unique exercise.</span>
            </span>
          )}
        </div>
      </div>

      {/* Modal: Browse All 31 Unique Days Journey */}
      {showCatalogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-2xl max-h-[85vh] bg-white dark:bg-[#0c2440] rounded-3xl p-6 shadow-2xl border border-black/20 dark:border-white/20 flex flex-col overflow-hidden text-black dark:text-white">
            <div className="flex items-center justify-between pb-4 border-b border-black/10 dark:border-white/15">
              <div>
                <h3 className="text-xl font-bold font-serif flex items-center gap-2">
                  <span>31 Days of Unique Mental Exercises</span>
                  <Sparkles className="w-5 h-5 text-amber-500" />
                </h3>
                <p className="text-xs text-black/70 dark:text-white/70 mt-0.5">
                  Select any day to explore its specific mindfulness practice
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowCatalogModal(false)}
                className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 text-black dark:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-2.5 pr-1">
              {UNIQUE_31_DAILY_EXERCISES.map((ex, idx) => {
                const isSelected = activeExerciseIndex === idx;
                const isTodayCalendarDay = idx === defaultDayIndex;

                return (
                  <div
                    key={ex.id}
                    onClick={() => handleSelectExercise(idx)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-sky-100 dark:bg-sky-950 border-sky-400 dark:border-sky-600 shadow-sm'
                        : 'bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 hover:bg-black/10 dark:hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                        isTodayCalendarDay
                          ? 'bg-amber-500 text-white shadow-xs'
                          : 'bg-black/10 dark:bg-white/15 text-black dark:text-white'
                      }`}>
                        #{ex.dayNumber}
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-bold text-sm truncate">{ex.title}</h4>
                          {isTodayCalendarDay && (
                            <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-100">
                              Today
                            </span>
                          )}
                          <span className="text-[10px] px-2 py-0.2 rounded-full bg-black/10 dark:bg-white/15 text-black dark:text-white">
                            {ex.category}
                          </span>
                        </div>
                        <p className="text-xs text-black/70 dark:text-white/70 truncate mt-0.5">
                          {ex.desc}
                        </p>
                      </div>
                    </div>

                    <ChevronRight className="w-4 h-4 text-black/50 dark:text-white/50 shrink-0" />
                  </div>
                );
              })}
            </div>

            <div className="pt-3 border-t border-black/10 dark:border-white/15 flex justify-end">
              <button
                type="button"
                onClick={() => setShowCatalogModal(false)}
                className="px-5 py-2 rounded-xl bg-black text-white dark:bg-white dark:text-black font-bold text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Wellness Quick Hub */}
      <div>
        <h2 className="text-xl font-bold font-serif text-black dark:text-white mb-3 px-1">
          Wellness Hub
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            onClick={() => onNavigate('chat')}
            className="p-5 rounded-3xl backdrop-blur-md bg-white/70 dark:bg-[#0c2440]/80 border border-black/15 dark:border-white/15 hover:border-black/30 dark:hover:border-sky-400/50 cursor-pointer transition-all hover:-translate-y-1 shadow-md"
          >
            <div className="p-2.5 w-fit rounded-2xl bg-pink-100 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300 mb-3">
              <MessageSquareHeart className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-black dark:text-white">
              💬 AI Companion
            </h3>
            <p className="text-xs text-black dark:text-white mt-1">
              Talk with Gemini about feelings, jokes, motivation, or venting.
            </p>
          </div>

          <div
            onClick={() => onNavigate('meditation')}
            className="p-5 rounded-3xl backdrop-blur-md bg-white/70 dark:bg-[#0c2440]/80 border border-black/15 dark:border-white/15 hover:border-black/30 dark:hover:border-rose-400/50 cursor-pointer transition-all hover:-translate-y-1 shadow-md"
          >
            <div className="p-2.5 w-fit rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 mb-3">
              <Wind className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-black dark:text-white">
              🧘 Zen Breathing
            </h3>
            <p className="text-xs text-black dark:text-white mt-1">
              Guided animated breath cycles &amp; 528 Hz harmonic sine waves.
            </p>
          </div>

          <div
            onClick={() => onNavigate('journal')}
            className="p-5 rounded-3xl backdrop-blur-md bg-white/70 dark:bg-[#0c2440]/80 border border-black/15 dark:border-white/15 hover:border-black/30 dark:hover:border-amber-400/50 cursor-pointer transition-all hover:-translate-y-1 shadow-md"
          >
            <div className="p-2.5 w-fit rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 mb-3">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-black dark:text-white">
              📖 Mood Journal
            </h3>
            <p className="text-xs text-black dark:text-white mt-1">
              Write your heart out; receive tailored Gemini self-care insights.
            </p>
          </div>

          <div
            onClick={() => onNavigate('voice-meditation')}
            className="p-5 rounded-3xl backdrop-blur-md bg-white/70 dark:bg-[#0c2440]/80 border border-black/15 dark:border-white/15 hover:border-black/30 dark:hover:border-indigo-400/50 cursor-pointer transition-all hover:-translate-y-1 shadow-md"
          >
            <div className="p-2.5 w-fit rounded-2xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 mb-3">
              <Volume2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-black dark:text-white">
              Voice Zen
            </h3>
            <p className="text-xs text-black dark:text-white mt-1">
              Listen to personalized guided audio sessions for sleep and calm.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
