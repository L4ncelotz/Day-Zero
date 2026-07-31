"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Play, Trophy, Crosshair } from "lucide-react";

interface Bug {
  id: string;
  type: string;
  x: number;
  y: number;
  speed: number;
  isDead: boolean;
}

const BUG_TYPES = ["🐛", "🐞", "👾", "🐜"];
const GAME_DURATION = 20; // seconds

export function BugBasherGameModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [bugs, setBugs] = useState<Bug[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      const saved = localStorage.getItem("internship_bug_score");
      if (saved) setHighScore(parseInt(saved, 10));
      resetGame();
    }
  }, [isOpen]);

  // Timer loop
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    } else if (timeLeft === 0 && isPlaying) {
      setIsPlaying(false);
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem("internship_bug_score", score.toString());
      }
    }
    return () => clearInterval(timer);
  }, [isPlaying, timeLeft, score, highScore]);

  // Bug spawner loop
  useEffect(() => {
    let spawner: NodeJS.Timeout;
    if (isPlaying && timeLeft > 0) {
      spawner = setInterval(() => {
        if (!containerRef.current) return;
        const width = containerRef.current.clientWidth - 40;
        const height = containerRef.current.clientHeight - 40;
        
        const newBug: Bug = {
          id: `bug-${Date.now()}-${Math.random()}`,
          type: BUG_TYPES[Math.floor(Math.random() * BUG_TYPES.length)],
          x: Math.random() * width,
          y: Math.random() * height,
          speed: Math.random() * 2 + 1, // Will use for CSS animation duration if needed
          isDead: false,
        };
        
        setBugs((prev) => [...prev, newBug].slice(-15)); // max 15 bugs on screen
      }, 700 - Math.min(600, (GAME_DURATION - timeLeft) * 20)); // Spawns faster as time goes down
    }
    return () => clearInterval(spawner);
  }, [isPlaying, timeLeft]);

  // Bug movement loop (jittering)
  useEffect(() => {
    let mover: NodeJS.Timeout;
    if (isPlaying) {
      mover = setInterval(() => {
        setBugs((prev) => 
          prev.map(bug => {
            if (bug.isDead) return bug;
            const dx = (Math.random() - 0.5) * 40;
            const dy = (Math.random() - 0.5) * 40;
            return {
              ...bug,
              x: Math.max(0, Math.min(containerRef.current?.clientWidth! - 40, bug.x + dx)),
              y: Math.max(0, Math.min(containerRef.current?.clientHeight! - 40, bug.y + dy))
            };
          })
        );
      }, 400);
    }
    return () => clearInterval(mover);
  }, [isPlaying]);

  const resetGame = () => {
    setIsPlaying(false);
    setTimeLeft(GAME_DURATION);
    setScore(0);
    setBugs([]);
  };

  const startGame = () => {
    resetGame();
    setIsPlaying(true);
  };

  const handleBash = (bugId: string) => {
    if (!isPlaying) return;
    setScore(s => s + 10);
    setBugs(prev => prev.map(b => b.id === bugId ? { ...b, isDead: true, type: "💥" } : b));
    
    // Remove dead bug after explosion
    setTimeout(() => {
      setBugs(prev => prev.filter(b => b.id !== bugId));
    }, 400);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-2xl h-[70vh] bg-surface rounded-3xl border border-danger/40 shadow-[0_0_50px_rgba(255,136,136,0.15)] flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black/40">
            <div className="flex items-center gap-2">
              <Crosshair className="w-5 h-5 text-danger" />
              <span className="font-mono font-bold text-white tracking-widest uppercase">Bug Basher</span>
            </div>
            <button onClick={onClose} className="p-2 text-text-tertiary hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Stats Bar */}
          <div className="flex px-6 py-3 bg-surface-elevated justify-between items-center text-sm font-mono border-b border-white/5">
            <div className="flex gap-6">
              <div>
                <span className="text-text-tertiary">TIME:</span> <span className={`font-bold ${timeLeft <= 5 ? 'text-danger animate-pulse' : 'text-accent'}`}>00:{timeLeft.toString().padStart(2, '0')}</span>
              </div>
              <div>
                <span className="text-text-tertiary">SCORE:</span> <span className="font-bold text-white">{score}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-warning">
              <Trophy className="w-4 h-4" />
              <span className="font-bold">{highScore}</span>
            </div>
          </div>

          {/* Game Area */}
          <div ref={containerRef} className="relative flex-1 bg-[#0a0a0a] overflow-hidden cursor-[crosshair]">
            {/* Grid background */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+CjxyZWN0IHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgZmlsbD0idHJhbnNwYXJlbnQiLz4KPHBhdGggZD0iTTAgNDBoNDBNNDAgMHY0MCIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiLz4KPC9zdmc+')] pointer-events-none" />

            {!isPlaying && timeLeft === GAME_DURATION && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-10">
                <button onClick={startGame} className="flex flex-col items-center gap-4 group">
                  <div className="w-20 h-20 rounded-full bg-danger/20 border-2 border-danger flex items-center justify-center text-danger group-hover:scale-110 group-hover:bg-danger group-hover:text-black transition-all">
                    <Play className="w-10 h-10 ml-2" />
                  </div>
                  <span className="font-mono font-bold text-white tracking-widest text-lg group-hover:text-danger transition-colors">START ZAPPING</span>
                </button>
              </div>
            )}

            {!isPlaying && timeLeft === 0 && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md z-10">
                <h2 className="text-4xl font-black text-danger mb-2 font-mono uppercase tracking-widest">Time Up</h2>
                <p className="text-text-secondary font-mono mb-8">Final Score: <span className="text-white text-2xl ml-2">{score}</span></p>
                <button onClick={startGame} className="px-8 py-3 bg-white text-black font-bold font-mono rounded-xl hover:scale-105 transition-transform uppercase tracking-wider">
                  Play Again
                </button>
              </div>
            )}

            {/* Bugs */}
            {bugs.map((bug) => (
              <motion.button
                key={bug.id}
                onMouseDown={() => handleBash(bug.id)}
                animate={{ x: bug.x, y: bug.y, scale: bug.isDead ? 1.5 : 1, opacity: bug.isDead ? 0 : 1 }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                className={`absolute w-10 h-10 text-3xl flex items-center justify-center select-none ${bug.isDead ? 'pointer-events-none z-0' : 'z-10 hover:scale-110 active:scale-90'}`}
                style={{ filter: bug.isDead ? 'brightness(2)' : 'drop-shadow(0 0 10px rgba(255,0,0,0.3))' }}
              >
                {bug.type}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
