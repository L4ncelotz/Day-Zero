"use client";

import * as React from "react";
import * as RadixDialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

// Detect reduced-motion preference
function useReducedMotion(): boolean {
  const [reduced, setReduced] = React.useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return reduced;
}

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
}

export function Dialog({ open, onOpenChange, children, className }: DialogProps) {
  const reducedMotion = useReducedMotion();


  return (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <RadixDialog.Portal forceMount>
            <RadixDialog.Overlay asChild forceMount>
              <motion.div
                key="dialog-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reducedMotion ? 0.12 : 0.2 }}
                className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
              />
            </RadixDialog.Overlay>

            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pointer-events-none">
              <RadixDialog.Content asChild forceMount>
                <motion.div
                  key="dialog-content"
                  initial={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 10 }}
                  animate={reducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
                  exit={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 10 }}
                  transition={reducedMotion ? { duration: 0.12 } : { duration: 0.2 }}
                  className={cn(
                    "relative w-full max-w-lg rounded-2xl border border-line bg-surface p-6 shadow-2xl text-text-primary pointer-events-auto",
                    className
                  )}
                >
                  {children}
                  <RadixDialog.Close asChild>
                    <button
                      className="absolute right-4 top-4 rounded-full p-2.5 text-text-tertiary hover:bg-surface-elevated hover:text-text-primary transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                      aria-label="Close dialog"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </RadixDialog.Close>
                </motion.div>
              </RadixDialog.Content>
            </div>
          </RadixDialog.Portal>
        )}
      </AnimatePresence>
    </RadixDialog.Root>
  );
}

export function DialogHeader({ className, children }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mb-4 space-y-1.5", className)}>{children}</div>;
}

export function DialogTitle({ className, children }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <RadixDialog.Title asChild>
      <h2 className={cn("text-lg font-semibold tracking-tight text-text-primary", className)}>{children}</h2>
    </RadixDialog.Title>
  );
}

export function DialogDescription({ className, children }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <RadixDialog.Description asChild>
      <p className={cn("text-sm text-text-secondary", className)}>{children}</p>
    </RadixDialog.Description>
  );
}
