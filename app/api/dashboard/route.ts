import { NextResponse } from "next/server";
import { redis } from "@/lib/redis/client";
import seedData from "@/lib/dashboard-seed.json";

const REDIS_KEY = "kpi_dashboard_data";

export async function GET() {
  try {
    if (redis) {
      const data = await redis.get(REDIS_KEY);
      if (data) {
        return NextResponse.json(typeof data === "string" ? JSON.parse(data) : data);
      }
    }
    return NextResponse.json(seedData);
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json(seedData);
  }
}

export async function POST(req: Request) {
  try {
    const newData = await req.json();
    if (redis) {
      await redis.set(REDIS_KEY, JSON.stringify(newData));
    }
    return NextResponse.json({ success: true, data: newData });
  } catch (error) {
    console.error("Error saving dashboard data:", error);
    return NextResponse.json({ success: false, error: "Failed to save data" }, { status: 500 });
  }
}
