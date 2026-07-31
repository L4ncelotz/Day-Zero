import { NextResponse } from "next/server";
import { redis } from "@/lib/redis/client";

export interface ChatMessage {
  id: string;
  name: string;
  role: string;
  roleIcon: string;
  text: string;
  createdAt: string;
}

const REDIS_KEY = "internship_chat_messages";

// In-memory fallback if Redis credentials are not active
let inMemoryMessages: ChatMessage[] = [
  {
    id: "seed-1",
    name: "DayZero Bot",
    role: "System",
    roleIcon: "🤖",
    text: "ยินดีต้อนรับสู่ห้องแชทประจำวัน! ทักทายหรือแชร์ความรู้สึกวันนี้ได้เลย 🚀",
    createdAt: new Date().toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" }),
  },
];

export async function GET() {
  try {
    if (redis) {
      const data = await redis.get(REDIS_KEY);
      if (data) {
        const messages = typeof data === "string" ? JSON.parse(data) : data;
        return NextResponse.json(messages);
      }
    }
    return NextResponse.json(inMemoryMessages);
  } catch (error) {
    console.error("Chat GET error:", error);
    return NextResponse.json(inMemoryMessages);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, role, roleIcon, text } = body;

    if (!name || !text || typeof text !== "string" || !text.trim()) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: name.trim().slice(0, 24),
      role: role || "Visitor",
      roleIcon: roleIcon || "☕️",
      text: text.trim().slice(0, 300),
      createdAt: new Date().toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" }),
    };

    if (redis) {
      let current: ChatMessage[] = [];
      const existing = await redis.get(REDIS_KEY);
      if (existing) {
        current = typeof existing === "string" ? JSON.parse(existing) : (existing as ChatMessage[]);
      }
      current = [...current, newMessage].slice(-60);
      await redis.set(REDIS_KEY, JSON.stringify(current));
      return NextResponse.json(current);
    } else {
      inMemoryMessages = [...inMemoryMessages, newMessage].slice(-60);
      return NextResponse.json(inMemoryMessages);
    }
  } catch (error) {
    console.error("Chat POST error:", error);
    return NextResponse.json({ error: "Failed to save message" }, { status: 500 });
  }
}
