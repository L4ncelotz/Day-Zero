"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Quote, RefreshCw } from "lucide-react";
import { GlitchText } from "@/components/ui/glitch-text";

const QUOTES = [
  { text: "ทำงานครอบจักรวาล เงินเดือนผ่อนจักรยานยังไม่พอ", author: "มนุษย์เงินเดือนท่านหนึ่ง" },
  { text: "โค้ดไม่พังหรอก...แค่ยังไม่พร้อมรันบน Production", author: "Dev ผู้มองโลกในแง่ดี" },
  { text: "เห็นมาทำงาน ไม่ใช่ขยันนะ...วันลาหมด", author: "พนักงานดีเด่น" },
  { text: "Requirement แก้นิดเดียว...แต่นิดเดียวของเขานี่แทบจะรื้อระบบใหม่", author: "ผู้ประสบภัยจาก SA" },
  { text: "ฤกษ์ที่ดีที่สุด คือเลิกงานนะคะ ปะ กลับบ้าน!", author: "ชาวออฟฟิศรอเวลา 17.00" },
  { text: "เด็กฝึกงานไม่ได้ขี้เกียจ แค่อยู่โหมดเรียนรู้งานแบบงงๆ", author: "เด็กฝึกงาน (ที่เพิ่งเข้ามาใหม่)" },
  { text: "ความดีเราอาจจะไม่คงทน แต่เรื่องความจน เรามั่นคงและคงที่", author: "สลิปเงินเดือน" },
  { text: "จากเด็กมหาลัย สู่การเป็นเด็กชงกาแฟมือทองประจำออฟฟิศ", author: "อดีต Intern" },
  { text: "การลบโค้ดที่ผิดพลาด ง่ายกว่าการลบความทรงจำที่เจ็บปวด", author: "โปรแกรมเมอร์สายอกหัก" },
  { text: "ในโลกของโค้ด ทุกปัญหามีวิธีแก้ (แต่ต้องถาม Stack Overflow ก่อน)", author: "Senior Dev" },
];

export function DailyQuoteModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setQuoteIndex(Math.floor(Math.random() * QUOTES.length));
    }
  }, [isOpen]);

  const handleRandomize = () => {
    setIsAnimating(true);
    setTimeout(() => {
      let nextIndex = quoteIndex;
      while (nextIndex === quoteIndex) {
        nextIndex = Math.floor(Math.random() * QUOTES.length);
      }
      setQuoteIndex(nextIndex);
      setIsAnimating(false);
    }, 400); // Wait for glitch out
  };

  if (!isOpen) return null;

  const currentQuote = QUOTES[quoteIndex];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-md bg-surface-elevated rounded-3xl border border-warning/30 shadow-[0_0_40px_rgba(240,191,104,0.15)] flex flex-col p-8"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white/50 hover:text-white transition-colors bg-white/5 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 rounded-full bg-warning/20 flex items-center justify-center text-warning shadow-[0_0_15px_rgba(240,191,104,0.4)]">
              <Quote className="w-6 h-6" />
            </div>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center text-center min-h-[150px]">
            <AnimatePresence mode="wait">
              {!isAnimating ? (
                <motion.div
                  key={quoteIndex}
                  initial={{ opacity: 0, filter: "blur(10px)", y: 10 }}
                  animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                  exit={{ opacity: 0, filter: "blur(10px)", y: -10 }}
                  className="flex flex-col items-center"
                >
                  <p className="text-xl sm:text-2xl font-bold text-white mb-6 leading-relaxed">
                    "{currentQuote.text}"
                  </p>
                  <p className="text-sm font-mono text-warning/80">
                    — {currentQuote.author}
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="glitching"
                  className="text-2xl font-bold text-white/20 blur-[2px]"
                >
                  <GlitchText text="DECRYPTING...">[ DECRYPTING... ]</GlitchText>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={handleRandomize}
            disabled={isAnimating}
            className="mt-8 w-full py-4 rounded-xl border border-warning/50 text-warning font-bold font-mono tracking-widest uppercase flex items-center justify-center gap-3 hover:bg-warning/10 hover:shadow-[0_0_20px_rgba(240,191,104,0.2)] transition-all active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 ${isAnimating ? "animate-spin" : ""}`} />
            สุ่มคำคมใหม่
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
