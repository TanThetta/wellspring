import React, { useState } from 'react';
import { PageId } from '../types';
import { HeartHandshake, CheckCircle2, ArrowRight } from 'lucide-react';

interface MentalAssessmentProps {
  onAssessmentComplete: (score: number, status: string, summary: string) => void;
  onNavigate: (page: PageId) => void;
  onShowToast: (msg: string) => void;
}

const assessmentQuestions = [
  'How often have you felt calm and relaxed?',
  'How often have you enjoyed the activities you normally like?',
  'How often have you felt able to handle your daily responsibilities?',
  'How often have you had enough energy for your day?',
  'How often have you felt hopeful about the future?',
  'How often have you felt connected to friends, family, or people around you?',
  'How often have you been able to concentrate on what you were doing?',
  'How often have you slept well enough to feel rested?',
  'How often have you taken time to care for yourself or relax?',
  'How often have you felt confident about dealing with challenges?',
];

const assessmentOptions = [
  { value: 0, text: 'Never' },
  { value: 1, text: 'Rarely' },
  { value: 2, text: 'Sometimes' },
  { value: 3, text: 'Often' },
  { value: 4, text: 'Almost always' },
];

export const MentalAssessment: React.FC<MentalAssessmentProps> = ({
  onAssessmentComplete,
  onShowToast,
}) => {
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [errorMessage, setErrorMessage] = useState('');

  const handleSelectOption = (qIdx: number, val: number) => {
    setAnswers((prev) => ({ ...prev, [qIdx]: val }));
    setErrorMessage('');
  };

  const answeredCount = Object.keys(answers).length;
  const progressPercent = Math.round((answeredCount / assessmentQuestions.length) * 100);

  const handleSubmit = () => {
    if (answeredCount < assessmentQuestions.length) {
      const remaining = assessmentQuestions.length - answeredCount;
      setErrorMessage(`Please answer all questions (${remaining} remaining).`);
      return;
    }

    let total = 0;
    for (let i = 0; i < assessmentQuestions.length; i++) {
      total += answers[i] ?? 0;
    }

    const score = Math.round((total / 40) * 100);
    let status = '';
    let summary = '';

    if (score >= 80) {
      status = '🌟 Strong Wellness';
      summary =
        'Your responses reflect solid wellness habits and resilience. Keep sustaining the routines that bring you balance and joy.';
    } else if (score >= 60) {
      status = '🌿 Good Wellness';
      summary =
        'You have many healthy foundations. Continuing mindful pauses, connection, and small daily self-care rituals will keep your energy high.';
    } else if (score >= 40) {
      status = '💗 Needs Some Care';
      summary =
        'Certain areas may feel taxing or depleted right now. Give yourself patience, lean on simple restful activities, and chat with your Wellspring companion.';
    } else {
      status = '🌸 Extra Support Recommended';
      summary =
        'Your answers indicate notable fatigue or emotional weight. Be extra gentle with yourself. Talking to a trusted friend or caring professional can be deeply helpful.';
    }

    localStorage.setItem('wellspring_wellness_score', String(score));
    onAssessmentComplete(score, status, summary);
    onShowToast('Wellness assessment completed ✨');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 text-black dark:text-white">
      <div className="backdrop-blur-md bg-white/70 dark:bg-[#0c2440]/80 rounded-3xl p-6 sm:p-8 border border-black/15 dark:border-white/15 shadow-xl shadow-sky-950/15">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-2xl bg-black/10 dark:bg-white/15 text-black dark:text-white">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold font-serif text-black dark:text-white">
              Mental Health &amp; Wellness Check
            </h2>
            <p className="text-xs sm:text-sm text-black/80 dark:text-white/80">
              Answer 10 short reflection questions based on how you have felt recently. This is an encouraging wellness check, not a clinical diagnosis.
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="my-6">
          <div className="flex items-center justify-between text-xs font-bold text-black dark:text-white mb-1.5">
            <span>Progress</span>
            <span id="assessmentProgressText">
              {answeredCount} / {assessmentQuestions.length} answered ({progressPercent}%)
            </span>
          </div>
          <div className="h-3 w-full bg-black/10 dark:bg-white/10 rounded-full overflow-hidden border border-black/15 dark:border-white/15">
            <div
              id="assessmentProgressBar"
              className="h-full bg-gradient-to-r from-sky-400 to-indigo-500 transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Question List */}
        <form id="assessmentForm" onSubmit={(e) => e.preventDefault()} className="space-y-4">
          {assessmentQuestions.map((question, qIdx) => {
            const isAnswered = answers[qIdx] !== undefined;
            return (
              <div
                key={qIdx}
                className={`p-4 rounded-2xl border transition-all ${
                  isAnswered
                    ? 'border-black/20 dark:border-white/25 bg-black/5 dark:bg-white/10 shadow-sm'
                    : 'border-black/10 dark:border-white/10 bg-white/40 dark:bg-white/5'
                }`}
              >
                <h3 className="text-sm sm:text-base font-bold text-black dark:text-white mb-3 flex items-start gap-2 font-serif">
                  <span className="text-black dark:text-white font-sans">{qIdx + 1}.</span>
                  <span>{question}</span>
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {assessmentOptions.map((opt) => {
                    const isSelected = answers[qIdx] === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => handleSelectOption(qIdx, opt.value)}
                        className={`p-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all border text-center cursor-pointer ${
                          isSelected
                            ? 'bg-black text-white dark:bg-white dark:text-black font-bold border-black dark:border-white shadow-md'
                            : 'bg-white/80 dark:bg-white/10 text-black dark:text-white border-black/15 dark:border-white/15 hover:bg-black/10 dark:hover:bg-white/20'
                        }`}
                      >
                        {opt.text}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </form>

        {errorMessage && (
          <p id="assessmentMessage" className="text-xs font-bold text-rose-600 dark:text-rose-400 mt-4 text-center">
            {errorMessage}
          </p>
        )}

        <div className="mt-8 text-center">
          <button
            id="assessmentSubmitBtn"
            type="button"
            onClick={handleSubmit}
            className="px-8 py-3.5 rounded-full bg-black text-white dark:bg-white dark:text-black font-bold text-base shadow-lg transition-all cursor-pointer hover:scale-105"
          >
            Calculate My Wellness Score ✨
          </button>
        </div>
      </div>
    </div>
  );
};

export const AssessmentResult: React.FC<{
  score: number;
  status: string;
  summary: string;
  onContinue: () => void;
}> = ({ score, status, summary, onContinue }) => {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8 text-black dark:text-white">
      <div className="backdrop-blur-md bg-white/70 dark:bg-[#0c2440]/80 rounded-3xl p-8 sm:p-10 border border-black/15 dark:border-white/15 shadow-xl shadow-sky-950/15 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold font-serif text-black dark:text-white mb-2">
          Your Wellness Result 🌸
        </h2>
        <p className="text-xs sm:text-sm text-black/80 dark:text-white/80 mb-6">
          Here is your personal balance score calculated from your responses:
        </p>

        {/* Glowing Score Ring */}
        <div className="w-36 h-36 mx-auto my-4 rounded-full flex items-center justify-center bg-gradient-to-tr from-sky-400 via-indigo-500 to-sky-200 text-white shadow-2xl shadow-sky-900/40">
          <span id="wellnessScore" className="text-3xl font-extrabold font-serif">
            {score}%
          </span>
        </div>

        <h3 id="wellnessStatus" className="text-xl font-bold font-serif text-black dark:text-white mt-4 mb-2">
          {status}
        </h3>

        <p id="wellnessSummary" className="text-sm sm:text-base text-black/90 dark:text-white/90 max-w-md mx-auto leading-relaxed">
          {summary}
        </p>

        {/* Gentle note */}
        <div className="mt-6 p-4 rounded-2xl bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/15 text-xs text-black/80 dark:text-white/80 text-left">
          <strong>Remember:</strong> This score is an encouraging wellness reflection and does not diagnose medical or mental health conditions. If you are struggling or in distress, please reach out to trusted friends, family, or healthcare providers.
        </div>

        <button
          onClick={onContinue}
          className="mt-8 inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-black text-white dark:bg-white dark:text-black font-bold text-base shadow-lg transition-all cursor-pointer hover:scale-105"
        >
          <span>Unlock My Dashboard 🌱</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
