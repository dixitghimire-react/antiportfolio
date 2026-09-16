import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Lock, Unlock, Delete, ArrowLeft, ShieldAlert, Timer, CheckCircle2, Sparkles, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
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

  // Prevent background scroll when vault is locked
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  // Lockout countdown timer
  useEffect(() => {
    const checkLockout = () => {
      const savedLockout = parseInt(localStorage.getItem('writing_lockout_until') || '0', 10);
      const now = Date.now();
      
      if (savedLockout > now) {
        const secs = Math.ceil((savedLockout - now) / 1000);
        setRemainingSeconds(secs);
        setErrorMessage(`System Locked. Cooldown: ${formatTime(secs)}`);
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
      setTimeout(() => {
        onUnlock();
      }, 1300);
    } else {
      const newAttempts = attempts + 1;
      setIsShaking(true);

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
          setPin('');
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

  const content = (
    <div 
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-start sm:justify-center bg-[#030712] p-3 sm:p-6 overflow-y-auto overflow-x-hidden min-h-[100dvh]"
      style={{ touchAction: 'manipulation' }}
    >
      {/* Ambient background glow & cyber grid */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-1/4 left-1/4 w-[360px] sm:w-[450px] h-[360px] sm:h-[450px] rounded-full blur-[130px] mix-blend-screen transition-all duration-1000 ${isSuccess ? 'bg-emerald-500/30 scale-125' : 'bg-cyan-600/15 animate-pulse'}`} />
        <div className={`absolute bottom-1/4 right-1/4 w-[380px] sm:w-[500px] h-[380px] sm:h-[500px] rounded-full blur-[140px] mix-blend-screen transition-all duration-1000 ${isSuccess ? 'bg-cyan-500/30 scale-125' : 'bg-purple-600/20 animate-pulse'}`} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] bg-blue-600/10 rounded-full blur-[140px] mix-blend-screen" />
        
        {/* Subtle cyber grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,#000_20%,transparent_100%)]" />
      </div>

      {/* Main Glassmorphic PIN Card with Framer Motion Spring Shake and Entrance */}
      <motion.div 
        initial={{ scale: 0.92, opacity: 0, y: 15 }}
        animate={{ 
          scale: 1, 
          opacity: 1, 
          y: 0,
          x: isShaking ? [-10, 10, -7, 7, -4, 4, 0] : 0 
        }}
        transition={{ 
          x: { duration: 0.4, ease: "easeInOut" },
          scale: { duration: 0.45, ease: [0.16, 1, 0.3, 1] }
        }}
        className={`my-auto relative z-10 w-full max-w-[340px] sm:max-w-[364px] p-5 sm:p-6 rounded-[2rem] backdrop-blur-2xl bg-[#080d1a]/90 border transition-all duration-500 shadow-[0_0_60px_rgba(0,0,0,0.85),0_0_30px_rgba(6,182,212,0.12)] flex flex-col items-center overflow-hidden ${
          isLockedOut
            ? 'border-red-500/60 shadow-[0_0_40px_rgba(239,68,68,0.35)] bg-red-950/20'
            : isSuccess 
              ? 'border-emerald-400/80 shadow-[0_0_50px_rgba(52,211,153,0.45)] animate-unlock-dissolve' 
              : 'border-cyan-500/25 hover:border-cyan-400/40'
        }`}
      >
        {/* Top cyan neon edge light */}
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_rgba(6,182,212,0.8)] pointer-events-none" />

        {/* Laser scanline overlay animation when unlocked */}
        {isSuccess && (
          <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_20px_rgba(6,182,212,1)] animate-laser-scan pointer-events-none z-30" />
        )}

        {/* Header Bar Row (Back Button & Security Status Pill) */}
        <div className="w-full flex items-center justify-between mb-2">
          {!isSuccess ? (
            <motion.button
              type="button"
              whileHover={{ scale: 1.05, x: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/')}
              className="px-2.5 py-1 rounded-full text-gray-400 hover:text-cyan-300 hover:bg-cyan-500/10 border border-white/5 hover:border-cyan-500/30 transition-all flex items-center gap-1.5 text-xs font-mono group"
              title="Return to Home"
            >
              <ArrowLeft size={13} className="group-hover:-translate-x-0.5 transition-transform" />
              <span>Home</span>
            </motion.button>
          ) : (
            <div />
          )}

          {/* Status Badge */}
          {isLockedOut ? (
            <div className="px-2.5 py-1 rounded-full bg-red-500/15 border border-red-500/40 text-red-400 text-[10px] font-mono tracking-wider flex items-center gap-1 animate-pulse">
              <ShieldAlert size={11} />
              <span>LOCKED</span>
            </div>
          ) : isSuccess ? (
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 text-[10px] font-mono tracking-wider flex items-center gap-1"
            >
              <Sparkles size={11} />
              <span>GRANTED</span>
            </motion.div>
          ) : attempts > 0 ? (
            <div className="px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-[10px] font-mono tracking-wider">
              {MAX_ATTEMPTS - attempts} {MAX_ATTEMPTS - attempts === 1 ? 'TRY' : 'TRIES'} LEFT
            </div>
          ) : (
            <div className="px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-400/90 text-[10px] font-mono tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span>SECURE VAULT</span>
            </div>
          )}
        </div>

        {/* Lock Icon with Glowing Aura & Shockwaves */}
        <div className="relative mb-3 mt-1">
          {isSuccess && (
            <>
              <div className="absolute -inset-2 rounded-2xl border-2 border-emerald-400 animate-shockwave-1 pointer-events-none" />
              <div className="absolute -inset-2 rounded-2xl border-2 border-cyan-400 animate-shockwave-2 pointer-events-none" />
            </>
          )}

          <motion.div 
            animate={{ scale: isSuccess ? 1.12 : 1, rotate: isSuccess ? -8 : 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={`w-13 h-13 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center border transition-all duration-500 ${
              isLockedOut
                ? 'bg-red-600/20 border-red-500 text-red-400 shadow-[0_0_30px_rgba(239,68,68,0.6)] animate-pulse'
                : isSuccess 
                  ? 'bg-emerald-500/30 border-emerald-400 text-emerald-300 shadow-[0_0_35px_rgba(52,211,153,0.7)]' 
                  : isShaking
                    ? 'bg-red-500/20 border-red-400 text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.5)]'
                    : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.25)]'
            }`}
          >
            {isLockedOut ? (
              <Timer size={26} className="animate-spin" style={{ animationDuration: '6s' }} />
            ) : isSuccess ? (
              <Unlock size={26} className="text-emerald-300" />
            ) : isShaking ? (
              <ShieldAlert size={26} />
            ) : (
              <Lock size={26} />
            )}
          </motion.div>
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
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 font-extrabold">
              RESTRICTED VAULT
            </span>
          )}
        </h2>

        {/* Subtitle / Countdown / Status */}
        {isLockedOut ? (
          <div className="mt-1.5 mb-3 flex flex-col items-center">
            <span className="text-2xl sm:text-3xl font-mono font-bold text-red-400 tracking-widest animate-pulse">
              {formatTime(remainingSeconds)}
            </span>
            <span className="text-[10px] text-gray-400 tracking-wider uppercase mt-0.5">
              Cooldown in progress
            </span>
          </div>
        ) : isSuccess ? (
          <div className="mt-1.5 mb-3 flex items-center justify-center gap-1.5 text-xs text-emerald-400 font-mono tracking-widest animate-pulse">
            <CheckCircle2 size={14} className="text-emerald-400" />
            <span>DECRYPTING ARCHIVES...</span>
          </div>
        ) : (
          <p className="text-[11px] sm:text-xs text-gray-400 tracking-wider text-center mt-1 mb-3 font-light">
            Enter 4-digit security PIN to unlock
          </p>
        )}

        {/* PIN Indicators (4 Circles) */}
        {!isLockedOut && (
          <div className="flex items-center justify-center gap-3.5 mb-2.5">
            {[...Array(PIN_LENGTH)].map((_, index) => {
              const isFilled = index < pin.length;
              return (
                <motion.div
                  key={index}
                  animate={{ 
                    scale: isFilled ? 1.15 : 1,
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border-2 transition-all duration-200 flex items-center justify-center ${
                    isSuccess
                      ? 'bg-emerald-400 border-emerald-300 shadow-[0_0_16px_rgba(52,211,153,1)] scale-110'
                      : isShaking
                        ? 'bg-red-500 border-red-400 shadow-[0_0_10px_rgba(239,68,68,0.8)]'
                        : isFilled
                          ? 'bg-cyan-400 border-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.8)]'
                          : 'bg-white/[0.02] border-gray-700'
                  }`}
                >
                  {isSuccess && (
                    <div className="w-1.5 h-1.5 rounded-full bg-dark-900 animate-ping" />
                  )}
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Error / Status message container */}
        <div className="min-h-[18px] mb-2 flex items-center justify-center text-center px-2">
          {errorMessage && (
            <span className={`text-[11px] sm:text-xs font-mono tracking-wide ${isLockedOut ? 'text-red-400 font-semibold' : 'text-red-400 animate-pulse'}`}>
              {errorMessage}
            </span>
          )}
        </div>

        {/* Keypad Grid */}
        <div className={`grid grid-cols-3 gap-2 sm:gap-2.5 w-full max-w-[250px] sm:max-w-[270px] transition-all duration-500 ${
          isSuccess 
            ? 'opacity-20 blur-sm scale-95 pointer-events-none' 
            : isLockedOut 
              ? 'opacity-20 pointer-events-none' 
              : 'opacity-100'
        }`}>
          {digits.map((digit) => (
            <motion.button
              key={digit}
              type="button"
              whileHover={!isLockedOut && !isSuccess ? { scale: 1.05, backgroundColor: "rgba(6, 182, 212, 0.15)" } : {}}
              whileTap={!isLockedOut && !isSuccess ? { scale: 0.92 } : {}}
              onClick={() => handleDigit(digit)}
              disabled={isLockedOut || isSuccess}
              className="h-11 sm:h-12 rounded-xl sm:rounded-2xl bg-white/[0.04] border border-white/10 text-white font-mono text-lg sm:text-xl font-semibold transition-all duration-150 flex items-center justify-center shadow-sm hover:border-cyan-500/50 hover:shadow-[0_0_15px_rgba(6,182,212,0.25)] focus:outline-none disabled:cursor-not-allowed"
            >
              {digit}
            </motion.button>
          ))}

          {/* Clear Button */}
          <motion.button
            type="button"
            whileHover={!isLockedOut && !isSuccess ? { scale: 1.05 } : {}}
            whileTap={!isLockedOut && !isSuccess ? { scale: 0.92 } : {}}
            onClick={handleClear}
            disabled={isLockedOut || isSuccess}
            className="h-11 sm:h-12 rounded-xl sm:rounded-2xl bg-white/[0.02] border border-white/5 hover:border-gray-500 hover:bg-white/5 text-gray-400 hover:text-white font-mono text-[11px] sm:text-xs tracking-wider uppercase transition-all duration-150 flex items-center justify-center focus:outline-none disabled:cursor-not-allowed"
            title="Clear PIN"
          >
            Clear
          </motion.button>

          {/* 0 Button */}
          <motion.button
            type="button"
            whileHover={!isLockedOut && !isSuccess ? { scale: 1.05, backgroundColor: "rgba(6, 182, 212, 0.15)" } : {}}
            whileTap={!isLockedOut && !isSuccess ? { scale: 0.92 } : {}}
            onClick={() => handleDigit('0')}
            disabled={isLockedOut || isSuccess}
            className="h-11 sm:h-12 rounded-xl sm:rounded-2xl bg-white/[0.04] border border-white/10 text-white font-mono text-lg sm:text-xl font-semibold transition-all duration-150 flex items-center justify-center shadow-sm hover:border-cyan-500/50 hover:shadow-[0_0_15px_rgba(6,182,212,0.25)] focus:outline-none disabled:cursor-not-allowed"
          >
            0
          </motion.button>

          {/* Backspace Button */}
          <motion.button
            type="button"
            whileHover={!isLockedOut && !isSuccess ? { scale: 1.05, backgroundColor: "rgba(239, 68, 68, 0.15)", borderColor: "rgba(239, 68, 68, 0.4)" } : {}}
            whileTap={!isLockedOut && !isSuccess ? { scale: 0.92 } : {}}
            onClick={handleBackspace}
            disabled={isLockedOut || isSuccess}
            className="h-11 sm:h-12 rounded-xl sm:rounded-2xl bg-white/[0.02] border border-white/5 text-gray-400 hover:text-red-400 hover:border-red-500/40 hover:bg-red-500/10 transition-all duration-150 flex items-center justify-center focus:outline-none disabled:cursor-not-allowed"
            title="Backspace"
          >
            <Delete size={18} />
          </motion.button>
        </div>

        {/* Keyboard Helper */}
        <div className="mt-3.5 pt-2.5 border-t border-white/5 flex items-center justify-center gap-1.5 text-[10px] text-gray-500 font-mono tracking-wider select-none">
          <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-gray-400">0-9</span>
          <span>keypad</span>
          <span className="text-gray-600">•</span>
          <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-gray-400">Esc</span>
          <span>clear</span>
        </div>
      </motion.div>
    </div>
  );

  if (typeof document !== 'undefined') {
    return createPortal(content, document.body);
  }

  return content;
};

export default PinLock;
