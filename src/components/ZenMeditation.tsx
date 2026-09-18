import React, { useState, useEffect, useRef } from 'react';
import { Play, Square, Wind, Volume2 } from 'lucide-react';

interface ZenMeditationProps {
  onShowToast: (msg: string) => void;
}

interface FrequencyGuideItem {
  id: string;
  rangeLabel: string;
  category: 'Calm' | 'Relax' | 'Heal' | 'Focus' | 'Transcend';
  targetHz: number;
  badge: string;
  promise: string;
  scientificDetail: string;
}

const frequencySuggestions: FrequencyGuideItem[] = [
  {
    id: 'deep-calm',
    rangeLabel: '174 Hz – 285 Hz',
    category: 'Calm',
    targetHz: 174,
    badge: 'Deep Calm & Body Safety',
    promise: 'In this range you will feel physical grounding, easing muscle tension and settling a racing heart.',
    scientificDetail: 'Provides a stabilizing acoustic foundation that signals safety to your nervous system.',
  },
  {
    id: 'release-sorrow',
    rangeLabel: '396 Hz',
    category: 'Heal',
    targetHz: 396,
    badge: 'Release Fear & Sorrow',
    promise: 'In this range you will gently release grief, lingering sadness, and subconscious tension.',
    scientificDetail: 'Fosters psychological release from deep emotional weights and guilt.',
  },
  {
    id: 'stress-undo',
    rangeLabel: '417 Hz',
    category: 'Relax',
    targetHz: 417,
    badge: 'De-stress & Reset',
    promise: 'In this range you will dissolve negative cycles and feel refreshed from mental fatigue.',
    scientificDetail: 'Harmonically prompts emotional renewal and mental unwinding.',
  },
  {
    id: 'harmonic-calm',
    rangeLabel: '432 Hz',
    category: 'Calm',
    targetHz: 432,
    badge: 'Verdi Serenity Scale',
    promise: 'In this range you will feel completely calm, harmonizing your breathing with organic rhythms.',
    scientificDetail: 'Mathematically attuned to natural biological patterns, gently slowing heart rate variability.',
  },
  {
    id: 'miracle-relax',
    rangeLabel: '528 Hz',
    category: 'Relax',
    targetHz: 528,
    badge: 'Miracle Tone (Love)',
    promise: 'In this range you will enter deep mental relaxation, feeling comforted, loved, and whole.',
    scientificDetail: 'Widely researched Solfeggio frequency shown to decrease cortisol levels and promote calm.',
  },
  {
    id: 'clarity-focus',
    rangeLabel: '639 Hz – 741 Hz',
    category: 'Focus',
    targetHz: 741,
    badge: 'Intuition & Mental Clarity',
    promise: 'In this range you will clear away mental brain fog, feeling sharp, open-hearted, and serene.',
    scientificDetail: 'Cleanses sensory clutter and encourages mindful problem-solving.',
  },
  {
    id: 'transcend-peace',
    rangeLabel: '852 Hz – 963 Hz',
    category: 'Transcend',
    targetHz: 963,
    badge: 'Pure Stillness & Bliss',
    promise: 'In this range you will experience quiet meditative stillness, drifting into restorative peace.',
    scientificDetail: 'High acoustic resonance that assists mindfulness practitioners in silencing intrusive thoughts.',
  },
];

export const ZenMeditation: React.FC<ZenMeditationProps> = ({ onShowToast }) => {
  // Breathing state
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'Ready' | 'Inhale...' | 'Hold...' | 'Exhale...' | 'Rest...'>('Ready');

  // Audio tone state
  const [frequency, setFrequency] = useState<number>(528);
  const [isPlayingTone, setIsPlayingTone] = useState(false);
  const [toneStatus, setToneStatus] = useState<string>('');
  const [selectedPresetId, setSelectedPresetId] = useState<string>('miracle-relax');

  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  // Breathing interval
  useEffect(() => {
    let interval: any = null;
    if (isBreathing) {
      const phases: ('Inhale...' | 'Hold...' | 'Exhale...' | 'Rest...')[] = [
        'Inhale...',
        'Hold...',
        'Exhale...',
        'Rest...',
      ];
      let idx = 0;
      setBreathPhase(phases[0]);

      interval = setInterval(() => {
        idx = (idx + 1) % phases.length;
        setBreathPhase(phases[idx]);
      }, 3000);
    } else {
      setBreathPhase('Ready');
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isBreathing]);

  // Audio Tone Cleanup on unmount
  useEffect(() => {
    return () => {
      stopSineWave();
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        try {
          audioCtxRef.current.close();
        } catch (e) {}
      }
    };
  }, []);

  const toggleBreathing = () => {
    setIsBreathing((prev) => !prev);
    if (!isBreathing) {
      onShowToast('Zen breathing started 🧘');
    }
  };

  const applyFrequency = (hz: number, presetId?: string) => {
    setFrequency(hz);
    if (presetId) setSelectedPresetId(presetId);

    if (isPlayingTone && oscRef.current && audioCtxRef.current) {
      oscRef.current.frequency.setTargetAtTime(hz, audioCtxRef.current.currentTime, 0.05);
      setToneStatus(`Playing ${hz} Hz harmonic tone.`);
    }
  };

  const startSineWave = async () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) {
        setToneStatus('Web Audio API is not supported in this browser.');
        return;
      }

      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }

      if (audioCtxRef.current.state === 'suspended') {
        await audioCtxRef.current.resume();
      }

      if (oscRef.current) {
        try {
          oscRef.current.stop();
          oscRef.current.disconnect();
        } catch (e) {}
      }

      const osc = audioCtxRef.current.createOscillator();
      const gain = audioCtxRef.current.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, audioCtxRef.current.currentTime);

      gain.gain.setValueAtTime(0.001, audioCtxRef.current.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.04, audioCtxRef.current.currentTime + 1.2);

      osc.connect(gain);
      gain.connect(audioCtxRef.current.destination);

      osc.start();
      oscRef.current = osc;
      gainRef.current = gain;
      setIsPlayingTone(true);
      setToneStatus(`Playing ${frequency} Hz harmonic sine wave.`);
      onShowToast(`Playing ${frequency} Hz tone 🎵`);
    } catch (e: any) {
      console.error(e);
      setToneStatus('Could not play audio tone. User interaction required.');
    }
  };

  const stopSineWave = () => {
    if (oscRef.current && audioCtxRef.current && gainRef.current) {
      try {
        gainRef.current.gain.setValueAtTime(gainRef.current.gain.value, audioCtxRef.current.currentTime);
        gainRef.current.gain.exponentialRampToValueAtTime(0.0001, audioCtxRef.current.currentTime + 0.5);
        setTimeout(() => {
          if (oscRef.current) {
            oscRef.current.stop();
            oscRef.current.disconnect();
            oscRef.current = null;
          }
        }, 550);
      } catch (e) {}
    }
    setIsPlayingTone(false);
    setToneStatus('');
  };

  const handleFrequencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    applyFrequency(val);
  };

  const activePreset = frequencySuggestions.find((s) => s.id === selectedPresetId);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 text-black dark:text-white">
      <div className="backdrop-blur-md bg-white/70 dark:bg-[#0c2440]/80 rounded-3xl p-6 sm:p-10 border border-black/15 dark:border-white/15 shadow-xl shadow-sky-950/15 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold font-serif text-black dark:text-white mb-2 flex items-center justify-center gap-2">
          <Wind className="w-6 h-6 text-black dark:text-white" />
          <span>Guided Zen &amp; Harmonic Frequencies</span>
        </h2>
        <p className="text-sm text-black dark:text-white max-w-md mx-auto mb-8">
          Synchronize your breath with the visual circle, or choose a frequency range below specifically calibrated to calm, relax, and heal your nervous system.
        </p>

        {/* Breathing Circle */}
        <div className="flex justify-center items-center my-6">
          <div
            id="animeCircle"
            className={`w-48 h-48 sm:w-56 sm:h-56 rounded-full flex items-center justify-center bg-gradient-to-tr from-sky-400 via-blue-500 to-indigo-400 text-white font-bold text-xl sm:text-2xl shadow-2xl shadow-sky-500/40 transition-transform duration-1000 select-none ${
              isBreathing ? 'animate-breathe' : ''
            }`}
          >
            <span id="breathingText">{breathPhase}</span>
          </div>
        </div>

        {/* Start/Stop Breathing Button */}
        <button
          id="startMeditation"
          type="button"
          onClick={toggleBreathing}
          className="px-8 py-3.5 rounded-full font-bold text-base transition-all shadow-lg cursor-pointer bg-black text-white dark:bg-white dark:text-black hover:scale-105"
        >
          {isBreathing ? 'Stop Breath Cycle' : 'Start Zen Breath'}
        </button>

        {/* Frequency Suggestions Section */}
        <div className="mt-12 text-left space-y-6">
          <div className="text-center max-w-lg mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/10 dark:bg-white/15 text-black dark:text-white font-bold text-xs mb-2">
              <Volume2 className="w-3.5 h-3.5" />
              <span>Targeted Frequency Ranges</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-serif text-black dark:text-white">
              Suggestions for Healing &amp; Calm
            </h3>
            <p className="text-xs sm:text-sm text-black dark:text-white mt-1">
              Select a therapeutic range to set the exact frequency. Experience how each frequency range guides your mind to calm, relax, or focus.
            </p>
          </div>

          {/* Preset Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {frequencySuggestions.map((item) => {
              const isSelected = frequency === item.targetHz || selectedPresetId === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => applyFrequency(item.targetHz, item.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white shadow-lg scale-[1.01]'
                      : 'bg-white/60 dark:bg-white/10 text-black dark:text-white border-black/15 dark:border-white/15 hover:border-black/30 dark:hover:border-white/30 hover:bg-white/80 dark:hover:bg-white/15'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="font-bold text-base font-serif">
                      {item.targetHz} Hz
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        isSelected
                          ? 'bg-white/20 text-white dark:bg-black/20 dark:text-black'
                          : 'bg-black/10 text-black dark:bg-white/15 dark:text-white'
                      }`}
                    >
                      {item.badge}
                    </span>
                  </div>
                  <p className="text-xs font-semibold leading-relaxed mb-1">
                    {item.promise}
                  </p>
                  <p className={`text-[11px] leading-normal ${isSelected ? 'opacity-90' : 'opacity-70'}`}>
                    {item.scientificDetail}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Active Frequency Control Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white/70 dark:bg-sky-950/60 border border-black/15 dark:border-white/15 text-center max-w-lg mx-auto shadow-md">
            <div className="text-xs font-bold uppercase tracking-wider text-black dark:text-white opacity-80">
              Active Frequency Oscillator
            </div>

            <div className="text-4xl font-extrabold text-black dark:text-white font-serif my-2">
              <span id="frequencyDisplay">{frequency}</span> Hz
            </div>

            {activePreset && (
              <div className="p-3 rounded-2xl bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/10 text-xs text-black dark:text-white mb-4">
                <span className="font-bold">{activePreset.badge}: </span>
                <span>{activePreset.promise}</span>
              </div>
            )}

            {/* Custom Slider */}
            <div className="px-2 py-2">
              <input
                id="frequencyRange"
                type="range"
                min={100}
                max={1000}
                step={1}
                value={frequency}
                onChange={handleFrequencyChange}
                className="w-full accent-black dark:accent-white cursor-pointer"
              />
              <div className="flex justify-between text-xs font-semibold text-black dark:text-white mt-1">
                <span>100 Hz (Grounded)</span>
                <span>528 Hz (Relax &amp; Love)</span>
                <span>1000 Hz (Transcendent)</span>
              </div>
            </div>

            {/* Audio Tone Control Buttons */}
            <div className="flex justify-center gap-3 mt-4">
              {!isPlayingTone ? (
                <button
                  id="playToneBtn"
                  type="button"
                  onClick={startSineWave}
                  className="flex items-center gap-2 px-7 py-3 rounded-full bg-black text-white dark:bg-white dark:text-black font-bold text-sm shadow-md hover:scale-105 transition-all cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Play {frequency} Hz Tone</span>
                </button>
              ) : (
                <button
                  id="stopToneBtn"
                  type="button"
                  onClick={stopSineWave}
                  className="flex items-center gap-2 px-7 py-3 rounded-full bg-rose-600 text-white font-bold text-sm shadow-md hover:bg-rose-700 transition-all cursor-pointer"
                >
                  <Square className="w-4 h-4 fill-current" />
                  <span>Stop Tone</span>
                </button>
              )}
            </div>

            {toneStatus && (
              <p className="text-xs text-black dark:text-white mt-3 font-medium">
                {toneStatus}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
