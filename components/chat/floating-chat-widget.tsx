"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, X, Send, User, Sparkles, RefreshCw } from "lucide-react";
import { ChatMessage, REACTION_EMOJIS } from "@/app/api/chat/route";

const ROLES = [
  { id: "six_seven", label: "Skuba 6-7 (Doot Doot)", icon: "🦈" },
  { id: "works_on_my_machine", label: "ในเครื่องผมรันผ่านนะ", icon: "💻" },
  { id: "one_line_fix", label: "แก้จุดเดียว...พังทั้งระบบ", icon: "💣" },
  { id: "stackoverflow", label: "Stack Overflow Copy Paste", icon: "📋" },
  { id: "maybe_not_yet", label: "อาจจะยังน้า...", icon: "🙅" },
  { id: "she_served", label: "ชีเสิร์ฟมากกก", icon: "✨" },
];

const QUICK_EMOJIS = ["☕️", "🔥", "💀", "🚀", "💻", "🎉"];

export function FloatingChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [openPickerId, setOpenPickerId] = useState<string | null>(null); // message id whose picker is open

  // User Profile
  const [nickname, setNickname] = useState("");
  const [selectedRole, setSelectedRole] = useState(ROLES[0]);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load user profile from localStorage
  useEffect(() => {
    const savedProfile = localStorage.getItem("internship_chat_user");
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile);
        setNickname(parsed.nickname || "");
        const roleMatch = ROLES.find((r) => r.id === parsed.roleId) || ROLES[0];
        setSelectedRole(roleMatch);
      } catch {
        // Fallback
      }
    } else {
      setIsEditingProfile(true);
    }
  }, []);

  // Fetch messages from API
  const fetchMessages = async () => {
    try {
      const res = await fetch("/api/chat");
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (err) {
      console.error("Failed to load chat messages:", err);
    }
  };

  // Poll messages while drawer is open
  useEffect(() => {
    fetchMessages();
    let interval: NodeJS.Timeout;
    if (isOpen) {
      interval = setInterval(fetchMessages, 3000);
    }
    return () => clearInterval(interval);
  }, [isOpen]);

  // Auto scroll to bottom when messages update
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  // Save profile
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim()) return;
    localStorage.setItem(
      "internship_chat_user",
      JSON.stringify({ nickname: nickname.trim(), roleId: selectedRole.id })
    );
    setIsEditingProfile(false);
  };

  // Send message
  const handleSendMessage = async (textToSend?: string) => {
    const finalContent = textToSend || inputText;
    if (!finalContent.trim() || loading) return;

    const userNick = nickname.trim() || "Anon-Intern";
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: userNick,
          role: selectedRole.label,
          roleIcon: selectedRole.icon,
          text: finalContent.trim(),
        }),
      });

      if (res.ok) {
        const updated = await res.json();
        setMessages(updated);
        if (!textToSend) setInputText("");
      }
    } catch (err) {
      console.error("Failed to send message:", err);
    } finally {
      setLoading(false);
    }
  };

  // Toggle reaction on a message
  const handleReact = async (messageId: string, emoji: string) => {
    const userNick = nickname.trim() || "Anon-Intern";
    // Optimistic update
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id !== messageId) return msg;
        const reactions = { ...(msg.reactions || {}) };
        const current = reactions[emoji] ?? [];
        const alreadyReacted = current.includes(userNick);
        reactions[emoji] = alreadyReacted
          ? current.filter((n) => n !== userNick)
          : [...current, userNick];
        return { ...msg, reactions };
      })
    );
    // Persist to server
    try {
      const res = await fetch("/api/chat", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messageId, emoji, nickname: userNick }),
      });
      if (res.ok) {
        const updated = await res.json();
        setMessages(updated);
      }
    } catch (err) {
      console.error("Failed to react:", err);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        className="fixed bottom-[88px] right-4 sm:bottom-6 sm:right-6 z-40 flex items-center gap-2.5 px-4 py-3 rounded-full bg-surface-elevated/90 backdrop-blur-xl border border-accent/40 shadow-[0_0_25px_rgba(0,255,193,0.25)] text-text-primary group"
        style={{ bottom: "calc(88px + env(safe-area-inset-bottom, 0px))" }}
      >
        <div className="relative">
          <MessageSquare className="w-5 h-5 text-accent transition-transform group-hover:rotate-12" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-accent rounded-full animate-ping" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-accent rounded-full" />
        </div>
        <span className="text-xs font-mono tracking-wider font-semibold text-text-primary uppercase hidden sm:inline">
          Daily Chat
        </span>
      </motion.button>

      {/* Floating Chat Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          className="fixed right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[380px] h-[70svh] sm:h-[520px] max-h-[80vh] flex flex-col rounded-3xl border border-accent/30 bg-black/85 backdrop-blur-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden"
            style={{
              bottom: "calc(100px + env(safe-area-inset-bottom, 0px))",
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-surface/50">
              <div className="flex items-center gap-2.5">
                <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <h3 className="text-sm font-mono font-bold tracking-wider text-text-primary uppercase flex items-center gap-1.5">
                  Daily Chat Lounge
                </h3>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsEditingProfile(!isEditingProfile)}
                  className="p-1.5 rounded-lg text-text-tertiary hover:text-accent hover:bg-white/5 transition-colors"
                  title="ตั้งค่าชื่อผู้ใช้"
                >
                  <User className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-white/5 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Profile Setup Screen */}
            {isEditingProfile ? (
              <form
                onSubmit={handleSaveProfile}
                className="flex-1 p-6 flex flex-col justify-center gap-4 bg-surface/30"
              >
                <div className="text-center mb-2">
                  <Sparkles className="w-6 h-6 text-accent mx-auto mb-2" />
                  <h4 className="text-base font-bold text-text-primary">ตั้งโปรไฟล์เข้าคุย</h4>
                  <p className="text-xs text-text-tertiary">เลือกบทบาทและตั้งชื่อเล่นชิวๆ ได้เลย</p>
                </div>

                <div>
                  <label className="text-xs font-mono text-text-secondary uppercase tracking-wider block mb-2">
                    เลือกบทบาท
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {ROLES.map((role) => (
                      <button
                        type="button"
                        key={role.id}
                        onClick={() => setSelectedRole(role)}
                        className={`p-2.5 rounded-xl border text-xs flex items-center gap-2 transition-all ${
                          selectedRole.id === role.id
                            ? "border-accent bg-accent/15 text-accent shadow-[0_0_15px_rgba(0,255,193,0.2)]"
                            : "border-white/10 bg-white/5 text-text-secondary hover:border-white/20"
                        }`}
                      >
                        <span>{role.icon}</span>
                        <span className="font-medium">{role.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-mono text-text-secondary uppercase tracking-wider block mb-2">
                    ชื่อเล่นของคุณ
                  </label>
                  <input
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="เช่น Intern-Max"
                    maxLength={20}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/15 text-text-primary text-xs focus:outline-none focus:border-accent"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 mt-2 rounded-xl bg-accent text-black font-semibold text-xs hover:bg-accent/90 transition-colors"
                >
                  เริ่มเข้าพูดคุย 🚀
                </button>
              </form>
            ) : (
              <>
                {/* Messages List */}
                <div className="flex-1 p-4 overflow-y-auto space-y-3 scrollbar-thin scrollbar-thumb-white/10">
                  {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-text-tertiary text-xs font-mono">
                      <RefreshCw className="w-4 h-4 animate-spin mb-2 text-accent" />
                      กำลังโหลดข้อความ...
                    </div>
                  ) : (
                    messages.map((msg) => {
                      const isMe = nickname && msg.name === nickname;
                      return (
                        <div
                          key={msg.id}
                          className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                        >
                          <div className="flex items-center gap-1.5 mb-1 text-[10px] text-text-tertiary font-mono">
                            <span>{msg.roleIcon}</span>
                            <span className="font-semibold text-text-secondary">{msg.name}</span>
                            <span className="px-1.5 py-0.5 rounded bg-white/5 text-[9px]">
                              {msg.role}
                            </span>
                            <span>• {msg.createdAt}</span>
                          </div>
                          <div
                            className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed ${
                              isMe
                                ? "bg-accent/20 border border-accent/40 text-text-primary rounded-tr-xs"
                                : "bg-surface-elevated/80 border border-white/10 text-text-secondary rounded-tl-xs"
                            }`}
                          >
                            {msg.text}
                          </div>

                          {/* Reaction Bar */}
                          <div className={`flex flex-wrap gap-1 mt-1 ${isMe ? "justify-end" : "justify-start"}`}>
                            {/* Existing reactions */}
                            {Object.entries(msg.reactions || {}).map(([emoji, reactors]) => {
                              if (!reactors || reactors.length === 0) return null;
                              const iMeReacted = nickname && reactors.includes(nickname);
                              return (
                                <button
                                  key={emoji}
                                  onClick={() => handleReact(msg.id, emoji)}
                                  className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[11px] border transition-all active:scale-90 ${
                                    iMeReacted
                                      ? "bg-accent/20 border-accent/50 text-accent"
                                      : "bg-white/5 border-white/10 text-text-tertiary hover:bg-white/10"
                                  }`}
                                >
                                  <span>{emoji}</span>
                                  <span className="font-mono font-semibold">{reactors.length}</span>
                                </button>
                              );
                            })}

                            {/* + picker toggle */}
                            <div className="relative">
                              <button
                                onClick={() => setOpenPickerId(openPickerId === msg.id ? null : msg.id)}
                                className="flex items-center justify-center w-6 h-6 rounded-full bg-white/5 border border-white/10 text-text-tertiary hover:bg-white/10 text-[11px] transition-colors"
                              >
                                +
                              </button>
                              {openPickerId === msg.id && (
                                <div className="absolute bottom-full mb-1 left-0 flex gap-0.5 p-1.5 rounded-xl bg-surface-elevated border border-white/15 shadow-2xl z-20">
                                  {REACTION_EMOJIS.map((emoji) => (
                                    <button
                                      key={emoji}
                                      onClick={() => {
                                        handleReact(msg.id, emoji);
                                        setOpenPickerId(null);
                                      }}
                                      className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/15 text-base active:scale-90 transition-all"
                                    >
                                      {emoji}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Emoji Bar */}
                <div className="px-4 py-2 border-t border-white/5 bg-black/40 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                  <span className="text-[10px] font-mono text-text-tertiary shrink-0">ส่งด่วน:</span>
                  {QUICK_EMOJIS.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => handleSendMessage(emoji)}
                      className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/15 text-sm transition-transform active:scale-90 shrink-0"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>

                {/* Input Form */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="p-3 border-t border-white/10 bg-surface/40 flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={`คุยในฐานะ ${selectedRole.icon} ${nickname || "เด็กใหม่"}...`}
                    maxLength={200}
                    className="flex-1 px-3.5 py-2 rounded-xl bg-black/60 border border-white/10 text-text-primary text-xs focus:outline-none focus:border-accent"
                  />
                  <button
                    type="submit"
                    disabled={!inputText.trim() || loading}
                    className="p-2 rounded-xl bg-accent text-black disabled:opacity-40 disabled:cursor-not-allowed hover:bg-accent/90 transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
