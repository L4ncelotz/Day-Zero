import { COUNTDOWN_CONFIG } from "../config";
import { ScheduleData } from "../countdown/types";

export const BASELINE_FALLBACK_SCHEDULE: ScheduleData = {
  version: 1,
  lastUpdatedAt: `${COUNTDOWN_CONFIG.startDate}T00:00:00+07:00`,
  overrides: [],
  milestones: [
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
  ],
};
