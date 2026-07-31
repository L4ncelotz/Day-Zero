"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "motion/react";
import { X, Share2, ShieldAlert, Download, Sparkles } from "lucide-react";
import { GlitchText } from "@/components/ui/glitch-text";
import { toast } from "sonner";
import { toJpeg } from "html-to-image";

interface InternSurvivorCardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InternSurvivorCardModal({ isOpen, onClose }: InternSurvivorCardModalProps) {
  const [nickname, setNickname] = useState("Anonymous");
  const [roleLabel, setRoleLabel] = useState("Visitor");
  const [daysLeft, setDaysLeft] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse move for holographic effect
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const rotateX = useTransform(mouseY, [0, 1], [10, -10]);
  const rotateY = useTransform(mouseX, [0, 1], [-10, 10]);
  const glareX = useTransform(mouseX, [0, 1], [-100, 200]);
  const glareY = useTransform(mouseY, [0, 1], [-100, 200]);

  useEffect(() => {
    if (isOpen) {
      const saved = localStorage.getItem("internship_chat_user");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.nickname) setNickname(parsed.nickname);
          
          const ROLES = [
            { id: "six_seven", label: "Skuba 6-7 (Doot Doot)" },
            { id: "works_on_my_machine", label: "ในเครื่องผมรันผ่านนะ" },
            { id: "one_line_fix", label: "แก้จุดเดียว...พังทั้งระบบ" },
            { id: "stackoverflow", label: "Stack Overflow Copy Paste" },
            { id: "maybe_not_yet", label: "อาจจะยังน้า..." },
            { id: "she_served", label: "ชีเสิร์ฟมากกก" },
          ];
          
          const roleMatch = ROLES.find(r => r.id === parsed.roleId);
          if (roleMatch) setRoleLabel(roleMatch.label);
          else if (parsed.roleId) setRoleLabel(parsed.roleId);
        } catch (e) {}
      }

      const target = new Date("2026-10-30T00:00:00+07:00");
      const diff = target.getTime() - new Date().getTime();
      setDaysLeft(Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24))));
    }
  }, [isOpen]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  const handleDownload = async () => {
    if (!cardRef.current) return;
    try {
      // Temporarily reset rotation for a clean capture
      mouseX.set(0.5);
      mouseY.set(0.5);
      // Wait for framer motion to settle
      await new Promise(resolve => setTimeout(resolve, 50)); 
      
      const dataUrl = await toJpeg(cardRef.current, { quality: 1, backgroundColor: '#020305' });
      const link = document.createElement('a');
      link.download = `survivor-card-${nickname}.jpg`;
      link.href = dataUrl;
      link.click();
      toast.success("โหลดรูปการ์ดเสร็จแล้ว! เอาไปแชร์ต่อได้เลย");
    } catch (err) {
      console.error(err);
      toast.error("โหลดยากนิดนึง ลองแคปหน้าจอแทนก่อนนะครับ!");
    }
  };

  const handleShareToStory = async () => {
    if (!cardRef.current) return;
    try {
      // Temporarily reset rotation for a clean capture
      mouseX.set(0.5);
      mouseY.set(0.5);
      await new Promise(resolve => setTimeout(resolve, 50)); 
      
      const dataUrl = await toJpeg(cardRef.current, { quality: 1, backgroundColor: '#020305' });
      
      // Convert Data URL to File object
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const file = new File([blob], `survivor-card-${nickname}.jpg`, { type: "image/jpeg" });

      // Check if native share is supported with files
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: 'Intern Survivor Card',
          text: `I am ${nickname}, ${roleLabel}! Only ${daysLeft} days left until Day Zero! 🚀`,
          files: [file]
        });
        toast.success("แชร์การ์ดสำเร็จ!");
      } else {
        // Fallback to standard download if share is not supported
        const link = document.createElement('a');
        link.download = file.name;
        link.href = dataUrl;
        link.click();
        toast.success("มือถือไม่รองรับการแชร์โดยตรง โหลดรูปลงเครื่องแทนแล้วครับ!");
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error(err);
        toast.error("มีปัญหาในการแชร์ ลองแคปหน้าจอแทนนะครับ!");
      }
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          className="relative flex flex-col items-center w-full sm:max-w-sm max-h-[95svh] overflow-y-auto rounded-t-3xl sm:rounded-2xl bg-[#08090e] px-4 pt-4 pb-6 sm:p-0 sm:bg-transparent"
          style={{ paddingBottom: "max(env(safe-area-inset-bottom, 0px), 24px)" }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute -top-12 right-0 p-2 text-white/50 hover:text-white transition-colors bg-white/5 rounded-full z-10"
          >
            <X className="w-5 h-5" />
          </button>

          {/* 3D Holographic Card Container */}
          <div 
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="w-full aspect-[3/4] relative perspective-1000 group cursor-pointer"
          >
            <motion.div 
              ref={cardRef}
              style={{ rotateX, rotateY }}
              className="w-full h-full rounded-2xl bg-gradient-to-br from-[#12141d] to-[#0a0c12] border border-white/20 shadow-2xl overflow-hidden flex flex-col relative transform-gpu preserve-3d"
            >
              {/* Holographic Foil Base */}
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />
              
              {/* Dynamic Glare Effect */}
              <motion.div 
                style={{ 
                  x: glareX, 
                  y: glareY, 
                  background: 'radial-gradient(circle at center, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 50%)'
                }}
                className="absolute w-[200%] h-[200%] -left-1/2 -top-1/2 opacity-30 mix-blend-overlay pointer-events-none"
              />

              {/* Rainbow Holo overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 via-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 mix-blend-color-dodge pointer-events-none" />

              {/* Card Header */}
              <div className="p-6 pb-2 flex justify-between items-start relative z-10">
                <div>
                  <div className="text-[10px] font-mono text-accent/80 tracking-[0.3em] mb-1 flex items-center gap-2">
                    <Sparkles className="w-3 h-3" />
                    LEGENDARY TIER
                  </div>
                  <div className="text-3xl font-black font-display text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">
                    DAY ZERO
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center border border-accent/30 shadow-[0_0_15px_rgba(0,255,193,0.3)]">
                  <ShieldAlert className="w-5 h-5 text-accent" />
                </div>
              </div>

              {/* Card Art / Centerpiece */}
              <div className="flex-1 px-6 py-4 flex flex-col justify-center relative z-10">
                <div className="w-full flex-1 rounded-xl bg-black/40 border border-white/5 relative overflow-hidden flex flex-col items-center justify-center backdrop-blur-sm group-hover:border-accent/30 transition-colors duration-500">
                  {/* Hexagon Grid BG */}
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyOCIgaGVpZ2h0PSI0OSIgdmlld0JveD0iMCAwIDI4IDQ5Ij4KICA8ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgPGcgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiPgogICAgICA8cGF0aCBkPSJNMzguNSAxMEwzNC40IDE3SDI2LjFMMjIgMTBsNC4xLTdoOC4zem0tMjguNSAwTDYuMSAxN0gtMi4xTC02IDEwbDQuMS03aDguM3pNMTQgMjRMMTAgMzFIMTdsLTQuMS03TDcgMTRoOC4zbDE3IDE3LS00LjEgN0gtLS0tIi8+CiAgICA8L2c+CiAgPC9nPgo8L3N2Zz4=')] opacity-30" />
                  
                  <div className="text-[10px] text-text-tertiary font-mono uppercase mb-2 tracking-widest text-center">Codename</div>
                  <div className="text-4xl font-black text-white mb-2 truncate px-4 text-center max-w-full drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                    {nickname}
                  </div>

                  <div className="px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-sm font-medium text-white/90 backdrop-blur-md">
                    {roleLabel}
                  </div>
                </div>
              </div>

              {/* Card Footer (Stats) */}
              <div className="p-6 pt-0 relative z-10">
                <div className="w-full p-4 rounded-xl bg-gradient-to-r from-accent/20 to-transparent border-l-2 border-accent relative overflow-hidden group-hover:shadow-[0_0_30px_rgba(0,255,193,0.2)] transition-shadow duration-500">
                  <div className="text-[10px] text-accent font-mono uppercase mb-1 tracking-widest">Time Remaining</div>
                  <div className="text-3xl font-black text-white font-mono tracking-tighter">
                    {daysLeft} <span className="text-sm text-white/60 font-sans font-medium uppercase">Days</span>
                  </div>
                </div>
                
                <div className="w-full flex justify-between items-end mt-4 opacity-50">
                  <div className="text-[8px] font-mono text-white/60 tracking-widest uppercase">
                    EDITION: {new Date().getFullYear()}
                  </div>
                  <div className="flex gap-[2px]">
                    {Array.from({ length: 15 }).map((_, i) => (
                      <div key={i} className="h-4 bg-white" style={{ width: `${Math.random() * 3 + 1}px`, opacity: Math.random() > 0.4 ? 1 : 0 }} />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* External Action Buttons */}
          <div className="flex gap-3 mt-6 w-full">
            <button
              onClick={handleShareToStory}
              className="flex-1 py-3 rounded-xl bg-surface-elevated border border-white/10 text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-white/10 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              Share to Story
            </button>
            <button
              onClick={handleDownload}
              className="flex-[1.5] py-3 rounded-xl bg-accent text-black font-black text-sm flex items-center justify-center gap-2 hover:bg-accent/90 hover:shadow-[0_0_20px_rgba(0,255,193,0.4)] transition-all"
            >
              <Download className="w-4 h-4" />
              Save Image
            </button>
          </div>
          
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
