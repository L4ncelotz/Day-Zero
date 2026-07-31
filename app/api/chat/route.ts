import { NextResponse } from "next/server";
import { redis } from "@/lib/redis/client";
import { ChatMessage, REACTION_EMOJIS, ReactionEmoji } from "@/lib/chat/types";


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
    reactions: {},
  },
];

async function getMessages(): Promise<ChatMessage[]> {
  if (redis) {
    const data = await redis.get(REDIS_KEY);
    if (data) {
      return typeof data === "string" ? JSON.parse(data) : (data as ChatMessage[]);
    }
    return [];
  }
  return inMemoryMessages;
}

async function saveMessages(messages: ChatMessage[]): Promise<void> {
  if (redis) {
    await redis.set(REDIS_KEY, JSON.stringify(messages));
  } else {
    inMemoryMessages = messages;
  }
}

export async function GET() {
  try {
    const messages = await getMessages();
    return NextResponse.json(messages);
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
      reactions: {},
    };

    const current = await getMessages();
    const updated = [...current, newMessage].slice(-60);
    await saveMessages(updated);
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Chat POST error:", error);
    return NextResponse.json({ error: "Failed to save message" }, { status: 500 });
  }
}

// PATCH /api/chat — toggle reaction on a message
// Body: { messageId, emoji, nickname }
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { messageId, emoji, nickname } = body;

    if (!messageId || !emoji || !nickname) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    if (!REACTION_EMOJIS.includes(emoji as ReactionEmoji)) {
      return NextResponse.json({ error: "Invalid emoji" }, { status: 400 });
    }

    const messages = await getMessages();
    const updated = messages.map((msg) => {
      if (msg.id !== messageId) return msg;

      const reactions = { ...(msg.reactions || {}) };
      const current = reactions[emoji] ?? [];
      const alreadyReacted = current.includes(nickname);

      // Toggle: if already reacted → remove, else → add
      reactions[emoji] = alreadyReacted
        ? current.filter((n) => n !== nickname)
        : [...current, nickname];

      return { ...msg, reactions };
    });

    await saveMessages(updated);
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Chat PATCH error:", error);
    return NextResponse.json({ error: "Failed to update reaction" }, { status: 500 });
  }
}
