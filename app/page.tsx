import { getSchedule } from "@/lib/schedule/repository";
import { calculateCountdown } from "@/lib/countdown/calculate";
import { CountdownExperience } from "@/components/countdown/countdown-experience";

// force-dynamic prevents build-time prerender which would fail without Redis credentials.
// unstable_cache in repository.ts still caches per-request data fetches.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { data: scheduleData, usingFallback } = await getSchedule();
  const result = calculateCountdown(scheduleData, undefined, usingFallback);

  return (
    <main className="min-h-screen bg-background">
      <CountdownExperience initialResult={result} milestones={scheduleData.milestones ?? []} />
    </main>
  );
}
