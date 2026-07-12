// =============================================================================
// ChatWidget — Floating AI chatbot for nowtb.com
// "NOW Team Assistant" — answers Tampa Bay real estate questions, helps
// navigate the site, and connects visitors with Barrett Henry.
//
// Features:
// - Floating bubble in bottom-right (above MobileBottomBar + BackToTop)
// - Expandable chat panel with message history
// - Streams AI responses with a typing indicator
// - Persists conversation in sessionStorage
// =============================================================================

"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";

// -- Types --

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

// -- Constants --

const INITIAL_GREETING =
  "Hi! I'm the NOW Team Assistant. I can help you with Tampa Bay real estate questions, finding homes, understanding the market, or connecting you with Barrett Henry. What can I help you with?";

const STORAGE_KEY = "nowtb-chat-history";

// -- Helper: load chat history from sessionStorage --
function loadHistory(): ChatMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {
    // If parsing fails, start fresh
  }
  return [];
}

// -- Helper: save chat history to sessionStorage --
function saveHistory(messages: ChatMessage[]) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  } catch {
    // sessionStorage might be full or unavailable — fail silently
  }
}

// -- Helper: render markdown-style links and bold text in messages --
function renderMessageContent(content: string) {
  // Split on markdown links [text](url) and **bold**
  const parts = content.split(/(\[.*?\]\(.*?\)|\*\*.*?\*\*)/g);

  return parts.map((part, i) => {
    // Markdown link: [text](url)
    const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
    if (linkMatch) {
      return (
        <a
          key={i}
          href={linkMatch[2]}
          className="underline hover:opacity-80 transition-opacity"
          target={linkMatch[2].startsWith("http") ? "_blank" : undefined}
          rel={linkMatch[2].startsWith("http") ? "noopener noreferrer" : undefined}
        >
          {linkMatch[1]}
        </a>
      );
    }

    // Bold text: **text**
    const boldMatch = part.match(/^\*\*(.*?)\*\*$/);
    if (boldMatch) {
      return <strong key={i}>{boldMatch[1]}</strong>;
    }

    return <span key={i}>{part}</span>;
  });
}

// =============================================================================
// Main Component
// =============================================================================

export default function ChatWidget() {
  // -- State --
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  // Whether to show the proactive tooltip bubble near the chat icon
  const [showTooltip, setShowTooltip] = useState(false);

  // -- Refs --
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load chat history from sessionStorage on mount
  useEffect(() => {
    const saved = loadHistory();
    if (saved.length > 0) {
      setMessages(saved);
    }
    setHasLoaded(true);
  }, []);

  // Save messages to sessionStorage whenever they change (after initial load)
  useEffect(() => {
    if (hasLoaded && messages.length > 0) {
      saveHistory(messages);
    }
  }, [messages, hasLoaded]);

  // Auto-scroll to the bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Proactive chat tooltip — show after 30s if not already shown this session
  useEffect(() => {
    // Skip if already shown this session or chat is already open
    if (typeof window === "undefined") return;
    const alreadyShown = sessionStorage.getItem("nowtb-chat-tooltip-shown");
    if (alreadyShown) return;

    const timer = setTimeout(() => {
      // Only show if chat panel is still closed
      if (!isOpen) {
        setShowTooltip(true);
        sessionStorage.setItem("nowtb-chat-tooltip-shown", "1");
      }
    }, 30000);

    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount

  // Dismiss tooltip when chat opens
  useEffect(() => {
    if (isOpen) setShowTooltip(false);
  }, [isOpen]);

  // Focus the input when the panel opens
  useEffect(() => {
    if (isOpen) {
      // Small delay so the panel animation finishes first
      const timer = setTimeout(() => inputRef.current?.focus(), 150);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // -- Send a message to the chat API --
  const sendMessage = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    // Add the user's message immediately
    const userMsg: ChatMessage = { role: "user", content: trimmed };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          history: messages, // Send previous messages (NOT including this one — it's in "message")
        }),
      });

      const contentType = res.headers.get("content-type") || "";

      // -- Non-streaming response (canned fallback) --
      if (contentType.includes("application/json")) {
        const data = await res.json();
        const assistantMsg: ChatMessage = {
          role: "assistant",
          content: data.content || data.error || "Sorry, something went wrong. Please try again.",
        };
        setMessages((prev) => [...prev, assistantMsg]);
        return;
      }

      // -- Streaming response (SSE from Anthropic) --
      const reader = res.body?.getReader();
      if (!reader) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "Sorry, I couldn't connect. Please try again." },
        ]);
        return;
      }

      const decoder = new TextDecoder();
      let assistantContent = "";
      let buffer = "";

      // Add an empty assistant message that we'll update as chunks arrive
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6);
          if (data === "[DONE]") continue;

          try {
            const parsed = JSON.parse(data);
            if (parsed.text) {
              assistantContent += parsed.text;
              // Update the last message (the assistant's) with accumulated text
              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = {
                  role: "assistant",
                  content: assistantContent,
                };
                return updated;
              });
            }
          } catch {
            // Skip malformed chunks
          }
        }
      }

      // If we got no content at all, show a fallback
      if (!assistantContent) {
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "assistant",
            content: "I'm having trouble right now. Please call Barrett at (813) 733-7907 for immediate help!",
          };
          return updated;
        });
      }
    } catch (err) {
      console.error("Chat send error:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, something went wrong. You can reach Barrett directly at (813) 733-7907.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages]);

  // Handle Enter key to send
  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  // -- Determine which messages to display (include greeting as first) --
  const displayMessages: ChatMessage[] = [
    { role: "assistant", content: INITIAL_GREETING },
    ...messages,
  ];

  return (
    <>
      {/* ── Chat Panel ── */}
      {isOpen && (
        <div
          className="fixed z-50 flex flex-col
                     bottom-0 right-0 w-full h-[85vh]
                     sm:bottom-24 sm:right-4 sm:w-[380px] sm:h-[520px]
                     md:bottom-8 md:right-4
                     bg-white shadow-2xl border border-border"
          role="dialog"
          aria-label="Chat with NOW Team Assistant"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-primary text-white">
            <div className="flex items-center gap-2">
              <Bot size={20} />
              <div>
                <p className="font-body text-sm font-semibold">NOW Team Assistant</p>
                <p className="font-body text-[10px] text-accent opacity-80">Tampa Bay Real Estate</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/10 rounded transition-colors"
              aria-label="Close chat"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages area */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-[#f5f5f5]">
            {displayMessages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`flex gap-2 max-w-[85%] ${
                    msg.role === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  {/* Avatar icon */}
                  <div
                    className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-1 ${
                      msg.role === "user"
                        ? "bg-primary text-white"
                        : "bg-accent/30 text-primary"
                    }`}
                  >
                    {msg.role === "user" ? <User size={12} /> : <Bot size={12} />}
                  </div>

                  {/* Message bubble */}
                  <div
                    className={`px-3 py-2 text-sm font-body leading-relaxed whitespace-pre-wrap ${
                      msg.role === "user"
                        ? "bg-primary text-white rounded-t-lg rounded-bl-lg"
                        : "bg-white text-dark border border-border rounded-t-lg rounded-br-lg"
                    }`}
                  >
                    {renderMessageContent(msg.content)}
                  </div>
                </div>
              </div>
            ))}

            {/* Typing indicator — shown while waiting for AI response */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex gap-2">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-1 bg-accent/30 text-primary">
                    <Bot size={12} />
                  </div>
                  <div className="bg-white border border-border rounded-t-lg rounded-br-lg px-4 py-3">
                    <div className="flex gap-1.5">
                      <span className="w-2 h-2 bg-muted rounded-full animate-bounce [animation-delay:0ms]" />
                      <span className="w-2 h-2 bg-muted rounded-full animate-bounce [animation-delay:150ms]" />
                      <span className="w-2 h-2 bg-muted rounded-full animate-bounce [animation-delay:300ms]" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Invisible anchor to scroll into view */}
            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div className="border-t border-border bg-white px-3 py-3">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about Tampa Bay real estate..."
                className="flex-1 px-3 py-2 text-sm font-body border border-border rounded-lg
                           focus:border-accent focus:ring-2 focus:ring-accent/30 focus:outline-none
                           bg-white text-dark placeholder:text-muted"
                disabled={isLoading}
                aria-label="Type your message"
              />
              <button
                onClick={sendMessage}
                disabled={isLoading || !input.trim()}
                className="flex-shrink-0 p-2 bg-primary text-white rounded-lg
                           hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed
                           transition-colors"
                aria-label="Send message"
              >
                <Send size={16} />
              </button>
            </div>
            <p className="text-[10px] text-muted text-center mt-1.5 font-body">
              AI assistant — for personalized advice, call{" "}
              <a href="tel:+18137337907" className="text-accent hover:underline">
                (813) 733-7907
              </a>
            </p>
          </div>
        </div>
      )}

      {/* ── Proactive Chat Tooltip ── */}
      {showTooltip && !isOpen && (
        <div className="fixed z-50 right-20 bottom-[4.5rem] sm:bottom-20 md:bottom-8">
          <div className="relative bg-white text-dark rounded-lg shadow-xl px-4 py-3 max-w-[220px] border border-border">
            <p className="font-body text-sm leading-snug">
              Looking for homes in Tampa Bay? I can help!
            </p>
            {/* Dismiss button */}
            <button
              onClick={() => setShowTooltip(false)}
              className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-muted/20 text-muted hover:bg-muted/40 flex items-center justify-center text-xs transition-colors"
              aria-label="Dismiss"
            >
              &times;
            </button>
            {/* Arrow pointing right toward the chat bubble */}
            <div className="absolute top-1/2 -right-2 -translate-y-1/2 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[8px] border-l-white" />
          </div>
        </div>
      )}

      {/* ── Floating Chat Bubble ── */}
      <button
        onClick={() => {
          setIsOpen((prev) => !prev);
          setShowTooltip(false); // Dismiss tooltip when clicking chat bubble
        }}
        aria-label={isOpen ? "Close chat" : "Ask a question"}
        className={`
          fixed z-50 right-4
          bottom-[4.5rem] sm:bottom-20 md:bottom-8
          h-14 rounded-full px-5
          bg-primary text-white shadow-lg
          flex items-center justify-center gap-2
          hover:bg-primary/90 hover:shadow-xl
          transition-all duration-300
          ${isOpen ? "scale-0 opacity-0 pointer-events-none" : "scale-100 opacity-100"}
        `}
      >
        <MessageCircle size={20} />
        <span className="font-body text-sm font-medium hidden sm:inline">Ask a Question</span>
      </button>
    </>
  );
}
