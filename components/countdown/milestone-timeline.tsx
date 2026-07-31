"use client";

import React from "react";
import { motion } from "motion/react";

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

export function MilestoneTimeline() {
  return (
    <section className="relative w-full max-w-4xl mx-auto py-24 px-4 sm:px-8">
      {/* Eyebrow */}
      <div className="text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="eyebrow text-accent mb-3"
        >
          THE JOURNEY
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ delay: 0.1 }}
          className="text-3xl sm:text-4xl font-bold tracking-tight text-text-primary"
        >
          Internship Milestones
        </motion.h2>
      </div>

      <div className="relative">
        {/* Central Line */}
        <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-[2px] bg-line transform sm:-translate-x-1/2" />

        {/* Milestone Nodes */}
        <div className="flex flex-col gap-12 sm:gap-20">
          {MILESTONES.map((milestone, index) => {
            const isEven = index % 2 === 0;
            const completedClass = milestone.isCompleted ? "border-accent shadow-[0_0_15px_var(--accent)]" : "border-line bg-surface";
            const textCompletedClass = milestone.isCompleted ? "text-text-primary" : "text-text-secondary";

            return (
              <motion.div
                key={milestone.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className={`relative flex flex-col sm:flex-row items-start sm:items-center ${
                  isEven ? "sm:flex-row-reverse" : ""
                }`}
              >
                {/* Center Node (Dot) */}
                <div className="absolute left-4 sm:left-1/2 w-4 h-4 rounded-full bg-background transform -translate-x-[7px] sm:-translate-x-1/2 mt-1 sm:mt-0 z-10 flex items-center justify-center">
                  <div className={`w-2.5 h-2.5 rounded-full ${milestone.isCompleted ? "bg-accent" : "bg-text-tertiary"}`} />
                </div>

                {/* Content Box */}
                <div className={`w-full sm:w-1/2 pl-12 sm:pl-0 sm:px-12 ${isEven ? "sm:text-right" : "sm:text-left"}`}>
                  <div className={`p-6 rounded-2xl border ${completedClass} bg-surface/50 backdrop-blur-sm transition-colors duration-500 hover:border-accent hover:bg-surface-elevated`}>
                    <div className="text-xs font-mono text-text-tertiary mb-2 uppercase tracking-wider">
                      {milestone.date}
                    </div>
                    <h3 className={`text-xl font-semibold mb-2 ${textCompletedClass}`}>
                      {milestone.title}
                    </h3>
                    <p className="text-sm text-text-secondary leading-relaxed">
                      {milestone.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
