export const REACTION_EMOJIS = ["❤️", "🔥", "😂", "😭", "😱", "👍"] as const;
export type ReactionEmoji = (typeof REACTION_EMOJIS)[number];

export interface ChatMessage {
  id: string;
  name: string;
  role: string;
  roleIcon: string;
  text: string;
  createdAt: string;
  // reactions: Record<emoji, Set<nickname>>  — stored as Record<emoji, string[]>
  reactions?: Record<string, string[]>;
}
