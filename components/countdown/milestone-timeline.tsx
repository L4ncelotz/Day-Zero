"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue, useMotionValueEvent } from "motion/react";
import { GlitchText } from "@/components/ui/glitch-text";

interface Milestone {
  id: string;
  date: string;
  title: string;
  description: string;
  isCompleted: boolean;
}

const MILESTONES: Milestone[] = [
  {
    id: "m1",
    date: "1 November 2025",
    title: "The First Day",
    description: "Started the journey, set up environments, and met the team.",
    isCompleted: true,
  },
  {
    id: "m2",
    date: "15 January 2026",
    title: "First Major Project",
    description: "Successfully delivered the first major feature to production.",
    isCompleted: true,
  },
  {
    id: "m3",
    date: "1 May 2026",
    title: "Mid-term Evaluation",
    description: "Received feedback and leveled up skills for the second half.",
    isCompleted: true,
  },
  {
    id: "m4",
    date: "1 September 2026",
    title: "Final Presentation Prep",
    description: "Gathering results and preparing the final showcase.",
    isCompleted: false,
  },
  {
    id: "m5",
    date: "30 October 2026",
    title: "Day Zero",
    description: "The final day of the internship. Mission accomplished.",
    isCompleted: false,
  },
];

interface MilestoneCardProps {
  milestone: Milestone;
  progress: MotionValue<number>;
  index: number;
  total: number;
}

const MilestoneCard = React.memo(function MilestoneCard({ milestone, progress, index, total }: MilestoneCardProps) {
  // Break WAAPI optimization link to avoid offset crash with out-of-bound ranges (< 0 or > 1)
  const safeProgress = useTransform(progress, (v) => v);

  // Center is between 0.1 and 0.82 based on index
  const rangeStart = 0.1;
  const rangeEnd = 0.82;
  const step = (rangeEnd - rangeStart) / (total - 1);
  const center = rangeStart + index * step;

  const start = center - 0.15;
  const fadeStart = center - 0.05;
  const fadeEnd = center + 0.05;
  const end = center + 0.15;

  const scale = useTransform(safeProgress, [start, center, end], [0.3, 1, 4.5]);
  const opacity = useTransform(safeProgress, [start, fadeStart, fadeEnd, end], [0, 1, 1, 0]);
  const y = useTransform(safeProgress, [start, center, end], [150, 0, -250]);
  const filter = useTransform(safeProgress, [start, center, end], ["blur(15px)", "blur(0px)", "blur(30px)"]);

  const borderColor = useTransform(
    safeProgress,
    [fadeStart, center, fadeEnd],
    milestone.isCompleted 
      ? ["rgba(0,255,193,0.1)", "rgba(0,255,193,0.7)", "rgba(0,255,193,0.1)"]
      : ["rgba(255,255,255,0.1)", "rgba(255,255,255,0.4)", "rgba(255,255,255,0.1)"]
  );

  const boxShadow = useTransform(
    safeProgress,
    [fadeStart, center, fadeEnd],
    milestone.isCompleted
      ? ["0 0 0px rgba(0,255,193,0)", "0 0 60px rgba(0,255,193,0.3)", "0 0 0px rgba(0,255,193,0)"]
      : ["0 0 0px rgba(255,255,255,0)", "0 0 30px rgba(255,255,255,0.1)", "0 0 0px rgba(255,255,255,0)"]
  );

  const textCompletedClass = milestone.isCompleted
    ? "text-accent drop-shadow-[0_0_10px_rgba(0,255,193,0.4)]"
    : "text-text-primary";

  return (
    <motion.div
      style={{
        scale,
        opacity,
        y,
        filter,
        zIndex: Math.round(center * 100), 
        translateZ: 0
      }}
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[500px] px-4 sm:px-0 pointer-events-none transform-gpu will-change-transform"
    >
      <motion.div
        style={{ borderColor, boxShadow }}
        className="relative p-8 rounded-2xl border bg-black/60 backdrop-blur-xl"
      >
        {/* Neon corner accents for completed */}
        {milestone.isCompleted && (
          <>
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-accent rounded-tl-xl" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-accent rounded-br-xl" />
          </>
        )}

        <div className="text-sm font-mono text-text-tertiary mb-3 uppercase tracking-[0.2em]">
          {milestone.date}
        </div>
        <h3 className={`text-2xl sm:text-3xl font-bold mb-3 ${textCompletedClass}`}>
          <GlitchText text={milestone.title}>
            {milestone.title}
          </GlitchText>
        </h3>
        <p className="text-base text-text-secondary leading-relaxed">
          {milestone.description}
        </p>
      </motion.div>
    </motion.div>
  );
});

export function MilestoneTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Global fades and effects based on overall section scroll
  const beamOpacity = useTransform(scrollYProgress, [0, 0.05, 0.95, 1], [0, 1, 1, 0]);
  const radarRotate = useTransform(scrollYProgress, [0, 1], [0, 360]);

  // Smoothly dim the global ambient background as we dive into the timeline
  const bgDimOpacity = useTransform(scrollYProgress, [0, 0.1], [0, 0.6]);

  return (
    <section ref={containerRef} className="relative w-full h-[450vh]">
      <div className="sticky top-0 w-full h-screen h-[100svh] overflow-hidden flex items-center justify-center">
        
        {/* Dynamic Darkening Overlay (Seamless transition from previous section) */}
        <motion.div 
          style={{ opacity: bgDimOpacity }}
          className="absolute inset-0 bg-black pointer-events-none z-[-1]"
        />

        {/* Deep Space Background Grid / HUD lines */}
        <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
          {/* Vertical Center Line */}
          <div className="w-[1px] h-full bg-gradient-to-b from-transparent via-accent/50 to-transparent" />
          {/* Horizontal Center Line */}
          <div className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
          {/* Radar Circles */}
          <div className="absolute w-[300px] h-[300px] border border-accent/20 rounded-full" />
          <div className="absolute w-[600px] h-[600px] border border-accent/10 rounded-full border-dashed" />
          
          {/* Rotating Radar Sweep */}
          <motion.div 
            style={{ rotate: radarRotate }}
            className="absolute w-[600px] h-[600px] rounded-full"
          >
            <div className="absolute top-0 right-1/2 w-1/2 h-1/2 bg-[conic-gradient(from_180deg_at_bottom_left,transparent_0deg,rgba(0,255,193,0.1)_90deg,transparent_90deg)]" />
          </motion.div>
        </div>

        {/* Central Energy Beam (Optical Fiber) */}
        <motion.div 
          style={{ opacity: beamOpacity }}
          className="absolute left-1/2 top-0 bottom-0 w-[2px] -translate-x-1/2 bg-[linear-gradient(to_bottom,transparent,rgba(0,255,193,0.9)_50%,transparent)] blur-[2px] pointer-events-none"
        />
        <motion.div 
          style={{ opacity: beamOpacity }}
          className="absolute left-1/2 top-0 bottom-0 w-[1px] -translate-x-1/2 bg-white pointer-events-none"
        />

        {/* Milestone Cards Stack */}
        <div className="absolute inset-0 perspective-[1000px] pointer-events-none">
          {MILESTONES.map((milestone, index) => (
            <MilestoneCard
              key={milestone.id}
              milestone={milestone}
              progress={scrollYProgress}
              index={index}
              total={MILESTONES.length}
            />
          ))}
        </div>

        {/* HUD Overlay Elements */}
        <motion.div 
          style={{ opacity: beamOpacity }}
          className="absolute top-10 left-8 text-[10px] font-mono text-accent tracking-widest hidden sm:block pointer-events-none"
        >
          [ SYS.TIMELINE_SYNC ]<br />
          Z-AXIS: ENGAGED
        </motion.div>
        <motion.div 
          style={{ opacity: beamOpacity }}
          className="absolute bottom-10 right-8 text-[10px] font-mono text-accent tracking-widest hidden sm:block text-right pointer-events-none"
        >
          TARGET: 30.10.2026<br />
          [ DECRYPTING... ]
        </motion.div>

        {/* Scroll Instruction */}
        <motion.div 
          style={{ opacity: useTransform(scrollYProgress, [0, 0.05], [1, 0]) }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[10px] text-text-tertiary font-mono tracking-widest uppercase flex flex-col items-center gap-2 pointer-events-none"
        >
          <span>Scroll to Dive</span>
          <div className="w-[1px] h-4 bg-text-tertiary/50" />
        </motion.div>

        {/* End of Timeline Climax */}
        <motion.div
          style={{ opacity: useTransform(scrollYProgress, [0.92, 0.98], [0, 1]) }}
          className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-[100]"
        >
          <div className="text-accent font-mono text-sm sm:text-base tracking-[0.5em] mb-4">
            END OF TRANSMISSION
          </div>
          <h2 className="text-4xl sm:text-6xl font-bold tracking-tighter text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]">
            SEE YOU ON DAY ZERO
          </h2>
        </motion.div>
      </div>
    </section>
  );
}
