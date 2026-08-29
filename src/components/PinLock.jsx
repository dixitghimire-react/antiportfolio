import React, { useState, useEffect, useCallback } from 'react';
import { Lock, Unlock, Delete, ArrowLeft, ShieldAlert, Timer, CheckCircle2, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { sendSecurityAlert } from '../utils/securityTelemetry';

const PIN_CODE = "8848";
const PIN_LENGTH = 4;
const MAX_ATTEMPTS = 4;
const LOCKOUT_DURATION_MS = 2 * 60 * 1000; // 2 minutes

const formatTime = (secs) => {
  const m = Math.floor(secs / 60).toString().padStart(2, '0');
  const s = (secs % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
};

const PinLock = ({ onUnlock }) => {
  const [pin, setPin] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  
  const [attempts, setAttempts] = useState(() => {
    return parseInt(localStorage.getItem('writing_failed_attempts') || '0', 10);
  });

  const [remainingSeconds, setRemainingSeconds] = useState(() => {
    const savedLockout = parseInt(localStorage.getItem('writing_lockout_until') || '0', 10);
    const now = Date.now();
    return savedLockout > now ? Math.ceil((savedLockout - now) / 1000) : 0;
  });

  const isLockedOut = remainingSeconds > 0;
  const navigate = useNavigate();

  // Lockout countdown timer
  useEffect(() => {
    const checkLockout = () => {
      const savedLockout = parseInt(localStorage.getItem('writing_lockout_until') || '0', 10);
      const now = Date.now();
      
      if (savedLockout > now) {
        const secs = Math.ceil((savedLockout - now) / 1000);
        setRemainingSeconds(secs);
        setErrorMessage(`System Locked. Try again in ${formatTime(secs)}`);
      } else {
        if (remainingSeconds > 0 || savedLockout > 0) {
          localStorage.removeItem('writing_lockout_until');
          localStorage.removeItem('writing_failed_attempts');
          setAttempts(0);
          setRemainingSeconds(0);
          setErrorMessage('');
        }
      }
    };

    checkLockout();
    const interval = setInterval(checkLockout, 1000);
    return () => clearInterval(interval);
  }, [remainingSeconds]);

  const verifyPin = useCallback((enteredPin) => {
    if (isLockedOut) return;

    if (enteredPin === PIN_CODE) {
      localStorage.removeItem('writing_failed_attempts');
      localStorage.removeItem('writing_lockout_until');
      setAttempts(0);
      setIsSuccess(true);
      setErrorMessage('');
      // Allow user to experience the full unlocking laser + shockwave animation
      setTimeout(() => {
        onUnlock();
      }, 1300);
    } else {
      const newAttempts = attempts + 1;
      setIsShaking(true);

      // Silently dispatch security telemetry to email in background
      sendSecurityAlert({
        enteredPin,
        attemptCount: newAttempts,
        isLockout: newAttempts >= MAX_ATTEMPTS,
      });

      if (newAttempts >= MAX_ATTEMPTS) {
        const lockoutTimestamp = Date.now() + LOCKOUT_DURATION_MS;
        localStorage.setItem('writing_lockout_until', lockoutTimestamp.toString());
        localStorage.setItem('writing_failed_attempts', newAttempts.toString());
        setAttempts(newAttempts);
        setRemainingSeconds(120);
        setErrorMessage(`Blocked for 2 minutes (${MAX_ATTEMPTS} failed attempts).`);
        setTimeout(() => {
          setIsShaking(false);
          setPin('');
        }, 500);
      } else {
        localStorage.setItem('writing_failed_attempts', newAttempts.toString());
        setAttempts(newAttempts);
        const remaining = MAX_ATTEMPTS - newAttempts;
        setErrorMessage(`Incorrect PIN. ${remaining} attempt${remaining === 1 ? '' : 's'} left.`);
        setTimeout(() => {
          setIsShaking(false);
          setPin(''); // Reset circles back to default empty state for retry
        }, 500);
      }
    }
  }, [isLockedOut, attempts, onUnlock]);

  const handleDigit = useCallback((digit) => {
    if (isSuccess || isShaking || isLockedOut) return;
    setErrorMessage('');
    
    setPin((prevPin) => {
      if (prevPin.length >= PIN_LENGTH) return prevPin;
      const newPin = prevPin + digit;
      if (newPin.length === PIN_LENGTH) {
        setTimeout(() => verifyPin(newPin), 50);
      }
      return newPin;
    });
  }, [isSuccess, isShaking, isLockedOut, verifyPin]);

  const handleBackspace = useCallback(() => {
    if (isSuccess || isShaking || isLockedOut) return;
    setErrorMessage('');
    setPin((prev) => prev.slice(0, -1));
  }, [isSuccess, isShaking, isLockedOut]);

  const handleClear = useCallback(() => {
    if (isSuccess || isShaking || isLockedOut) return;
    setErrorMessage('');
    setPin('');
  }, [isSuccess, isShaking, isLockedOut]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isLockedOut) return;
      if (e.key >= '0' && e.key <= '9') {
        handleDigit(e.key);
      } else if (e.key === 'Backspace') {
        handleBackspace();
      } else if (e.key === 'Escape') {
        handleClear();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLockedOut, handleDigit, handleBackspace, handleClear]);

  const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#030712] px-4 select-none overflow-hidden">
      {/* Ambient background glow & grid lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full blur-[120px] mix-blend-screen transition-all duration-1000 ${isSuccess ? 'bg-emerald-500/30 scale-125' : 'bg-cyan-600/15 animate-pulse'}`}></div>
        <div className={`absolute bottom-1/4 right-1/4 w-[450px] h-[450px] rounded-full blur-[130px] mix-blend-screen transition-all duration-1000 ${isSuccess ? 'bg-cyan-500/30 scale-125' : 'bg-purple-600/20 animate-pulse'}`}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-pink-600/10 rounded-full blur-[140px] mix-blend-screen animate-pulse" style={{ animationDuration: '5s' }}></div>
        
        {/* Subtle cyber grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_20%,transparent_100%)]"></div>
      </div>

      {/* Main Glassmorphic PIN Card */}
      <div 
        className={`relative z-10 w-full max-w-sm p-8 sm:p-10 rounded-[2.5rem] backdrop-blur-xl bg-white/[0.03] border transition-all duration-500 shadow-[0_0_60px_rgba(0,0,0,0.7)] flex flex-col items-center overflow-hidden ${
          isLockedOut
            ? 'border-red-500/60 shadow-[0_0_40px_rgba(239,68,68,0.3)] bg-red-950/10'
            : isSuccess 
              ? 'border-emerald-400/80 shadow-[0_0_50px_rgba(52,211,153,0.4)] animate-unlock-dissolve' 
              : 'border-white/10 hover:border-cyan-500/30'
        } ${isShaking ? 'animate-shake' : ''}`}
      >
        {/* Laser scanline overlay animation when unlocked */}
        {isSuccess && (
          <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_20px_rgba(6,182,212,1)] animate-laser-scan pointer-events-none z-30" />
        )}

        {/* Header Back Button */}
        {!isSuccess && (
          <button
            onClick={() => navigate('/')}
            className="absolute top-6 left-6 p-2 rounded-full text-gray-400 hover:text-cyan-400 hover:bg-white/5 transition-all flex items-center gap-1.5 text-xs font-mono"
            title="Return to Home"
          >
            <ArrowLeft size={16} />
            <span>Home</span>
          </button>
        )}

        {/* Lockout / Attempts Badge in top right */}
        {attempts > 0 && !isSuccess && !isLockedOut && (
          <div className="absolute top-6 right-6 px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-[10px] font-mono tracking-wider">
            {MAX_ATTEMPTS - attempts} left
          </div>
        )}

        {/* Success badge in top right */}
        {isSuccess && (
          <div className="absolute top-6 right-6 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 text-[11px] font-mono tracking-wider flex items-center gap-1 animate-pulse">
            <Sparkles size={12} />
            <span>VERIFIED</span>
          </div>
        )}

        {/* Lock Icon with Glowing Aura & Shockwaves */}
        <div className="relative mb-5 mt-4">
          {/* Shockwave Rings when Success */}
          {isSuccess && (
            <>
              <div className="absolute -inset-2 rounded-2xl border-2 border-emerald-400 animate-shockwave-1 pointer-events-none" />
              <div className="absolute -inset-2 rounded-2xl border-2 border-cyan-400 animate-shockwave-2 pointer-events-none" />
            </>
          )}

          <div 
            className={`w-16 h-16 rounded-2xl flex items-center justify-center border transition-all duration-500 ${
              isLockedOut
                ? 'bg-red-600/20 border-red-500 text-red-400 shadow-[0_0_30px_rgba(239,68,68,0.6)] animate-pulse'
                : isSuccess 
                  ? 'bg-emerald-500/30 border-emerald-400 text-emerald-300 shadow-[0_0_35px_rgba(52,211,153,0.7)] scale-110 rotate-[-8deg]' 
                  : isShaking
                    ? 'bg-red-500/20 border-red-400 text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.5)]'
                    : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.2)]'
            }`}
          >
            {isLockedOut ? (
              <Timer size={28} className="animate-spin" style={{ animationDuration: '6s' }} />
            ) : isSuccess ? (
              <Unlock size={30} className="animate-bounce text-emerald-300" />
            ) : isShaking ? (
              <ShieldAlert size={28} />
            ) : (
              <Lock size={28} />
            )}
          </div>
        </div>

        {/* Vault Title */}
        <h2 className="text-xl sm:text-2xl font-bold tracking-wider text-white text-center font-mono">
          {isLockedOut ? (
            <span className="text-red-400">VAULT LOCKED</span>
          ) : isSuccess ? (
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 neon-text-cyan font-extrabold tracking-widest">
              ACCESS GRANTED
            </span>
          ) : (
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400">
              RESTRICTED VAULT
            </span>
          )}
        </h2>

        {/* Subtitle / Countdown / Decrypting text */}
        {isLockedOut ? (
          <div className="mt-2 mb-6 flex flex-col items-center">
            <span className="text-3xl font-mono font-bold text-red-400 tracking-widest animate-pulse">
              {formatTime(remainingSeconds)}
            </span>
            <span className="text-[11px] text-gray-400 tracking-wider uppercase mt-1">
              Cooldown in progress
            </span>
          </div>
        ) : isSuccess ? (
          <div className="mt-2 mb-6 flex items-center justify-center gap-1.5 text-xs text-emerald-400 font-mono tracking-widest animate-pulse">
            <CheckCircle2 size={14} className="text-emerald-400" />
            <span>DECRYPTING ARCHIVES...</span>
          </div>
        ) : (
          <p className="text-xs text-gray-400 tracking-wider text-center mt-1.5 mb-6 font-light">
            Enter 4-digit security PIN to unlock
          </p>
        )}

        {/* PIN Indicators (4 Circles) */}
        {!isLockedOut && (
          <div className="flex items-center justify-center gap-4 mb-5">
            {[...Array(PIN_LENGTH)].map((_, index) => {
              const isFilled = index < pin.length;
              return (
                <div
                  key={index}
                  className={`w-4 h-4 rounded-full border-2 transition-all duration-300 flex items-center justify-center ${
                    isSuccess
                      ? 'bg-emerald-400 border-emerald-300 shadow-[0_0_16px_rgba(52,211,153,1)] scale-125'
                      : isShaking
                        ? 'bg-red-500 border-red-400 shadow-[0_0_10px_rgba(239,68,68,0.8)] scale-105'
                        : isFilled
                          ? 'bg-cyan-400 border-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.8)] scale-110'
                          : 'bg-transparent border-gray-600'
                  }`}
                >
                  {isSuccess && (
                    <div className="w-1.5 h-1.5 rounded-full bg-dark-900 animate-ping" />
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Error / Status message container */}
        <div className="min-h-[22px] mb-3 flex items-center justify-center text-center px-2">
          {errorMessage && (
            <span className={`text-xs font-mono tracking-wide ${isLockedOut ? 'text-red-400 font-semibold' : 'text-red-400 animate-pulse'}`}>
              {errorMessage}
            </span>
          )}
        </div>

        {/* Keypad Grid (Smoothly fades & disables when success or locked out) */}
        <div className={`grid grid-cols-3 gap-3 w-full max-w-[260px] transition-all duration-500 ${
          isSuccess 
            ? 'opacity-20 blur-sm scale-95 pointer-events-none' 
            : isLockedOut 
              ? 'opacity-20 pointer-events-none' 
              : 'opacity-100'
        }`}>
          {digits.map((digit) => (
            <button
              key={digit}
              onClick={() => handleDigit(digit)}
              disabled={isLockedOut || isSuccess}
              className="h-14 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-cyan-500/50 hover:bg-cyan-500/10 text-white font-mono text-xl font-medium transition-all duration-200 active:scale-95 flex items-center justify-center shadow-sm hover:shadow-[0_0_15px_rgba(6,182,212,0.2)] focus:outline-none disabled:cursor-not-allowed"
            >
              {digit}
            </button>
          ))}

          {/* Clear Button */}
          <button
            onClick={handleClear}
            disabled={isLockedOut || isSuccess}
            className="h-14 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-gray-500 hover:bg-white/5 text-gray-400 font-mono text-xs tracking-wider uppercase transition-all duration-200 active:scale-95 flex items-center justify-center focus:outline-none disabled:cursor-not-allowed"
            title="Clear"
          >
            Clear
          </button>

          {/* 0 Button */}
          <button
            onClick={() => handleDigit('0')}
            disabled={isLockedOut || isSuccess}
            className="h-14 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-cyan-500/50 hover:bg-cyan-500/10 text-white font-mono text-xl font-medium transition-all duration-200 active:scale-95 flex items-center justify-center shadow-sm hover:shadow-[0_0_15px_rgba(6,182,212,0.2)] focus:outline-none disabled:cursor-not-allowed"
          >
            0
          </button>

          {/* Backspace Button */}
          <button
            onClick={handleBackspace}
            disabled={isLockedOut || isSuccess}
            className="h-14 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-red-500/40 hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-all duration-200 active:scale-95 flex items-center justify-center focus:outline-none disabled:cursor-not-allowed"
            title="Backspace"
          >
            <Delete size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PinLock;
