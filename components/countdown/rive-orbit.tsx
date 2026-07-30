"use client";

import React, { useEffect, useRef, useState } from "react";

interface RiveOrbitProps {
  progress: number;
  urgency: 0 | 1 | 2 | 3;
  completed: boolean;
  reducedMotion: boolean;
}

export function RiveOrbit({
  progress,
  urgency,
  completed,
  reducedMotion,
}: RiveOrbitProps) {
  const [RiveComponent, setRiveComponent] = useState<React.ComponentType<any> | null>(null);
  // Hold a reference to the rive instance so we can pause/play on OS pref change
  const riveRef = useRef<any>(null);

  useEffect(() => {
    // Check if the rive file exists before initializing to avoid 404 console errors
    fetch("/rive/countdown-orbit.riv", { method: "HEAD" })
      .then((res) => {
        if (!res.ok) throw new Error("Rive file missing");
        return import("@rive-app/react-canvas");
      })
      .then((mod) => {
        if (mod.useRive) {
          const RiveWrapper = ({ reducedMotion }: { reducedMotion: boolean }) => {
            const { RiveComponent: Canvas, rive } = mod.useRive({
              src: "/rive/countdown-orbit.riv",
              stateMachines: "State Machine 1",
              // Respect initial reduced-motion preference
              autoplay: !reducedMotion,
            });

            // Keep a ref so the outer effect can pause/play on OS change
            useEffect(() => {
              riveRef.current = rive;
            }, [rive]);

            // Pause or play when reduced-motion changes while page is open
            useEffect(() => {
              if (!rive) return;
              reducedMotion ? rive.pause() : rive.play();
            }, [rive, reducedMotion]);

            // Wire up State Machine Inputs for when the actual .riv file is implemented
            const progressInput = mod.useStateMachineInput(rive, "State Machine 1", "progress", progress);
            const urgencyInput = mod.useStateMachineInput(rive, "State Machine 1", "urgency", urgency);
            const completedInput = mod.useStateMachineInput(rive, "State Machine 1", "completed", completed);
            const reducedMotionInput = mod.useStateMachineInput(rive, "State Machine 1", "reducedMotion", reducedMotion);

            useEffect(() => { if (progressInput) progressInput.value = progress; }, [progressInput, progress]);
            useEffect(() => { if (urgencyInput) urgencyInput.value = urgency; }, [urgencyInput, urgency]);
            useEffect(() => { if (completedInput) completedInput.value = completed; }, [completedInput, completed]);
            useEffect(() => { if (reducedMotionInput) reducedMotionInput.value = reducedMotion; }, [reducedMotionInput, reducedMotion]);

            return <Canvas className="w-full h-full" aria-hidden="true" />;
          };

          setRiveComponent(() => (props: any) => <RiveWrapper {...props} reducedMotion={reducedMotion} />);
        }
      })
      .catch(() => {
        // Fallback SVG handled below
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When OS preference changes while page is open, pause/resume the rive instance
  useEffect(() => {
    if (!riveRef.current) return;
    reducedMotion ? riveRef.current.pause() : riveRef.current.play();
  }, [reducedMotion]);

  return (
    <div
      aria-hidden="true"
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[75vw] max-w-[650px] aspect-square pointer-events-none z-0 flex items-center justify-center opacity-40"
    >
      {RiveComponent ? (
        <RiveComponent />
      ) : (
        /* Cinematic Radial Ring SVG Fallback */
        <div className="relative w-full h-full flex items-center justify-center">
          <svg
            viewBox="0 0 200 200"
            className={`w-full h-full ${
              reducedMotion ? "" : "animate-[spin_40s_linear_infinite]"
            }`}
          >
            <circle
              cx="100"
              cy="100"
              r="85"
              fill="none"
              stroke="var(--line)"
              strokeWidth="1"
              strokeDasharray="4 8"
            />
            <circle
              cx="100"
              cy="100"
              r="75"
              fill="none"
              stroke="var(--accent)"
              strokeWidth="1.5"
              strokeOpacity="0.4"
              strokeDasharray={`${(progress / 100) * 471} 471`}
              className={reducedMotion ? "" : "transition-all duration-700 ease-out"}
            />
          </svg>
        </div>
      )}
    </div>
  );
}
