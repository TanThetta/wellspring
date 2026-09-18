import React, { useMemo } from 'react';
import { FallingEffect } from '../types';

interface SakuraBackgroundProps {
  darkMode?: boolean;
  fallingEffect: FallingEffect;
}

// SVG Cumulus Cloud A (Billowy, puffy multi-dome cumulus cloud)
const CumulusCloudA: React.FC<{
  className?: string;
  darkMode?: boolean;
}> = ({ className = 'w-80 h-40', darkMode }) => (
  <svg
    viewBox="0 0 420 200"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Base soft ambient shadow */}
    <path
      d="M 60,160 
         A 42,42 0 0,1 55,105 
         A 55,55 0 0,1 120,55 
         A 70,70 0 0,1 225,35 
         A 62,62 0 0,1 315,68 
         A 52,52 0 0,1 370,115 
         A 42,42 0 0,1 355,160 
         C 320,165 100,165 60,160 Z"
      fill={darkMode ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.52)'}
    />
    {/* Inner highlighting puff */}
    <path
      d="M 90,155 
         A 35,35 0 0,1 105,100 
         A 52,52 0 0,1 190,52 
         A 48,48 0 0,1 270,75 
         A 38,38 0 0,1 325,120 
         A 32,32 0 0,1 315,155 Z"
      fill={darkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.35)'}
    />
  </svg>
);

// SVG Cumulus Cloud B (Wide, majestic stacked cumulus cloud)
const CumulusCloudB: React.FC<{
  className?: string;
  darkMode?: boolean;
}> = ({ className = 'w-96 h-48', darkMode }) => (
  <svg
    viewBox="0 0 460 210"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M 45,170 
         A 45,45 0 0,1 42,110 
         A 52,52 0 0,1 95,65 
         A 65,65 0 0,1 180,40 
         A 75,75 0 0,1 285,38 
         A 58,58 0 0,1 365,72 
         A 50,50 0 0,1 425,125 
         A 44,44 0 0,1 405,170 
         C 360,178 90,178 45,170 Z"
      fill={darkMode ? 'rgba(255, 255, 255, 0.11)' : 'rgba(255, 255, 255, 0.48)'}
    />
    <path
      d="M 85,165 
         A 38,38 0 0,1 125,105 
         A 55,55 0 0,1 220,55 
         A 60,60 0 0,1 315,70 
         A 45,45 0 0,1 370,125 
         C 340,170 120,170 85,165 Z"
      fill={darkMode ? 'rgba(255, 255, 255, 0.07)' : 'rgba(255, 255, 255, 0.32)'}
    />
  </svg>
);

export const SakuraBackground: React.FC<SakuraBackgroundProps> = ({
  darkMode,
  fallingEffect,
}) => {
  // Raindrops for rain effect
  const raindrops = useMemo(() => {
    return Array.from({ length: 45 }).map((_, i) => ({
      id: i,
      left: `${(i * 2.25) % 100}%`,
      height: `${18 + (i % 5) * 4}px`,
      duration: `${0.75 + (i % 6) * 0.12}s`,
      delay: `${(i % 10) * 0.15}s`,
      opacity: 0.5 + (i % 4) * 0.15,
    }));
  }, []);

  // Fluttering leaves and petals for leaves effect
  const leaves = useMemo(() => {
    const types = [
      {
        shape: 'rounded-tl-2xl rounded-br-2xl',
        gradient: 'from-pink-200 via-rose-300 to-pink-400', // Sakura petal
      },
      {
        shape: 'rounded-tr-2xl rounded-bl-2xl',
        gradient: 'from-emerald-300 via-teal-400 to-emerald-500', // Green leaf
      },
      {
        shape: 'rounded-tl-2xl rounded-br-2xl',
        gradient: 'from-amber-200 via-orange-300 to-amber-400', // Autumn leaf
      },
      {
        shape: 'rounded-full rounded-br-none',
        gradient: 'from-rose-200 via-pink-300 to-rose-400', // Rose petal
      },
    ];

    return Array.from({ length: 28 }).map((_, i) => {
      const type = types[i % types.length];
      const size = 12 + (i % 6) * 2.5;
      return {
        id: i,
        left: `${(i * 3.6) % 100}%`,
        width: `${size}px`,
        height: `${size * 1.3}px`,
        shape: type.shape,
        gradient: type.gradient,
        duration: `${7 + (i % 7) * 1.5}s`,
        delay: `${(i % 8) * 0.8}s`,
      };
    });
  }, []);

  // Twinkling stars scattered in the sky
  const stars = useMemo(() => {
    return [
      { top: '8%', left: '12%', size: 'w-1 h-1', delay: '0.2s', dur: '3.2s' },
      { top: '14%', left: '28%', size: 'w-1.5 h-1.5', delay: '1.1s', dur: '4.0s' },
      { top: '22%', left: '46%', size: 'w-2 h-2', delay: '0.7s', dur: '3.5s' },
      { top: '11%', left: '62%', size: 'w-1.5 h-1.5', delay: '2.1s', dur: '4.2s' },
      { top: '18%', left: '74%', size: 'w-2 h-2', delay: '0.5s', dur: '3.1s' },
      { top: '29%', left: '88%', size: 'w-1 h-1', delay: '1.8s', dur: '4.5s' },
      { top: '38%', left: '35%', size: 'w-1.5 h-1.5', delay: '0.9s', dur: '3.8s' },
      { top: '44%', left: '70%', size: 'w-2 h-2', delay: '1.4s', dur: '3.3s' },
      { top: '52%', left: '52%', size: 'w-1 h-1', delay: '0.3s', dur: '4.1s' },
      { top: '60%', left: '82%', size: 'w-1.5 h-1.5', delay: '2.3s', dur: '3.6s' },
      { top: '68%', left: '18%', size: 'w-1 h-1', delay: '1.2s', dur: '4.0s' },
      { top: '76%', left: '65%', size: 'w-2 h-2', delay: '0.8s', dur: '3.7s' },
      { top: '84%', left: '40%', size: 'w-1.5 h-1.5', delay: '1.9s', dur: '4.4s' },
    ];
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* 1. SKY BASE GRADIENT (Matching reference screenshots) */}
      <div
        className={`absolute inset-0 transition-colors duration-1000 ${
          darkMode
            ? 'bg-gradient-to-b from-[#06182c] via-[#0b2440] to-[#091b2e]'
            : 'bg-gradient-to-b from-[#9ac4e6] via-[#b6d7f0] to-[#cde4f7]'
        }`}
      />

      {/* 2. AMBIENT SOFT GLOWS */}
      <div
        className={`absolute top-0 right-10 w-[550px] h-[550px] rounded-full blur-3xl transition-opacity duration-1000 ${
          darkMode ? 'bg-sky-400/10' : 'bg-white/40'
        }`}
      />
      <div
        className={`absolute top-1/4 left-10 w-[600px] h-[600px] rounded-full blur-3xl transition-opacity duration-1000 ${
          darkMode ? 'bg-blue-600/10' : 'bg-sky-200/40'
        }`}
      />

      {/* 3. TWINKLING CELESTIAL STARS */}
      <div className="absolute inset-0 pointer-events-none">
        {stars.map((star, idx) => (
          <div
            key={idx}
            className={`absolute rounded-full animate-twinkle ${
              darkMode
                ? 'bg-white shadow-[0_0_8px_rgba(255,255,255,0.9)]'
                : 'bg-white shadow-[0_0_5px_rgba(255,255,255,0.7)]'
            } ${star.size}`}
            style={{
              top: star.top,
              left: star.left,
              animationDelay: star.delay,
              animationDuration: star.dur,
            }}
          />
        ))}
      </div>

      {/* 4. THE GLOWING CRESCENT MOON (Gently floating in the sky) */}
      <div className="absolute top-[8%] sm:top-[12%] right-[6%] sm:right-[15%] md:right-[18%] lg:right-[20%] pointer-events-none">
        <div className="animate-moon-float relative w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-96 lg:h-96">
          {/* Luminous aura behind the moon */}
          <div
            className={`absolute inset-0 rounded-full blur-2xl transition-opacity duration-1000 ${
              darkMode
                ? 'bg-white/20 shadow-[0_0_80px_rgba(255,255,255,0.35)]'
                : 'bg-white/35 shadow-[0_0_60px_rgba(255,255,255,0.5)]'
            }`}
          />

          {/* Precision SVG Crescent Moon matching the user's reference image */}
          <svg
            viewBox="0 0 200 200"
            className={`w-full h-full relative transition-all duration-700 ${
              darkMode
                ? 'drop-shadow-[0_0_40px_rgba(255,255,255,0.95)] drop-shadow-[0_0_80px_rgba(186,230,253,0.6)]'
                : 'drop-shadow-[0_0_35px_rgba(255,255,255,0.95)] drop-shadow-[0_0_60px_rgba(255,255,255,0.7)]'
            }`}
          >
            <defs>
              <mask id="moon-crescent-mask">
                {/* Visible base circle */}
                <circle cx="106" cy="100" r="76" fill="#ffffff" />
                {/* Cutout circle on the left creating the crescent opening */}
                <circle cx="68" cy="100" r="69" fill="#000000" />
              </mask>
            </defs>

            {/* Rendered Pure White Crescent Moon */}
            <circle
              cx="106"
              cy="100"
              r="76"
              fill="#ffffff"
              mask="url(#moon-crescent-mask)"
            />
          </svg>
        </div>
      </div>

      {/* 5. FLOATING CUMULUS CLOUDS (Realistic puffy clouds drifting naturally across the sky) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Right cumulus cloud cluster (crossing the moon) */}
        <div className="absolute top-[5%] sm:top-[8%] right-[-40px] sm:right-[4%] md:right-[8%] animate-cloud-a pointer-events-none">
          <CumulusCloudB className="w-80 sm:w-[460px] h-40 sm:h-56 filter drop-shadow-md" darkMode={darkMode} />
        </div>

        {/* Left cumulus cloud cluster (behind hero and title) */}
        <div className="absolute top-[12%] sm:top-[16%] -left-16 sm:-left-6 animate-cloud-b pointer-events-none">
          <CumulusCloudA className="w-96 sm:w-[520px] h-48 sm:h-64 filter drop-shadow-md" darkMode={darkMode} />
        </div>

        {/* Mid-screen floating cumulus cloud */}
        <div className="absolute top-[42%] sm:top-[38%] left-[8%] sm:left-[18%] animate-cloud-c pointer-events-none opacity-85">
          <CumulusCloudA className="w-72 sm:w-[380px] h-36 sm:h-48" darkMode={darkMode} />
        </div>

        {/* Lower screen cumulus clouds */}
        <div className="absolute top-[68%] sm:top-[70%] -right-12 animate-cloud-b pointer-events-none opacity-75">
          <CumulusCloudB className="w-88 sm:w-[480px] h-44 sm:h-58" darkMode={darkMode} />
        </div>

        {/* Slow horizontal passing cumulus clouds drifting across the sky */}
        <div className="absolute top-[26%] animate-cloud-traverse pointer-events-none opacity-70">
          <CumulusCloudA className="w-64 sm:w-80 h-32 sm:h-40" darkMode={darkMode} />
        </div>
        <div className="absolute top-[55%] animate-cloud-traverse-slow pointer-events-none opacity-60">
          <CumulusCloudB className="w-72 sm:w-96 h-36 sm:h-48" darkMode={darkMode} />
        </div>
      </div>

      {/* 6. FALLING RAIN EFFECT (Active only when fallingEffect === 'rain') */}
      {fallingEffect === 'rain' && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
          {raindrops.map((drop) => (
            <div
              key={drop.id}
              className={`absolute w-[1.5px] rounded-full animate-rain ${
                darkMode
                  ? 'bg-sky-200 shadow-[0_0_4px_rgba(255,255,255,0.9)]'
                  : 'bg-sky-600 shadow-[0_0_2px_rgba(2,132,199,0.7)]'
              }`}
              style={{
                left: drop.left,
                height: drop.height,
                animationDuration: drop.duration,
                animationDelay: drop.delay,
                opacity: drop.opacity,
                transform: 'rotate(-10deg)',
              }}
            />
          ))}
        </div>
      )}

      {/* 7. FALLING LEAVES & PETALS EFFECT (Active only when fallingEffect === 'leaves') */}
      {fallingEffect === 'leaves' && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
          {leaves.map((leaf) => (
            <div
              key={leaf.id}
              className={`absolute bg-gradient-to-br ${leaf.gradient} ${leaf.shape} opacity-80 animate-leaf drop-shadow-sm pointer-events-none`}
              style={{
                left: leaf.left,
                width: leaf.width,
                height: leaf.height,
                animationDuration: leaf.duration,
                animationDelay: leaf.delay,
              }}
            />
          ))}
        </div>
      )}

      {/* When fallingEffect === 'none', nothing falls! Pure serene moon and clouds */}
    </div>
  );
};
