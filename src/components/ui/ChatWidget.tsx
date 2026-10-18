// =============================================================================
// ChatWidget — Floating AI chatbot for nowtb.com
// "NOW Team Assistant" — answers Tampa Bay real estate questions, helps
// navigate the site, and connects visitors with Barrett Henry.
//
// Features:
// - Floating bubble in bottom-right
// - Expandable chat panel with message history
// - Streams AI responses with a typing indicator
// - Persists conversation in sessionStorage
// - LEAD CAPTURE: after a real exchange, offers to have Barrett follow up and
//   posts name/phone/email to /api/contact so it reaches Follow Up Boss
// =============================================================================

"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { MessageCircle, X, Send, Bot, User, Phone } from "lucide-react";
import TurnstileWidget from "@/components/ui/TurnstileWidget";
import { trackPhoneTap, trackChatLeadCaptured } from "@/lib/analytics";

// -- Types --

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

/**
 * Where the lead-capture card is in its life. Kept as one value rather than
 * four booleans so it is impossible to be in two states at once.
 *  hidden  — nothing shown yet (visitor hasn't earned the ask)
 *  offered — "Want Barrett to follow up?" with Yes / No thanks
 *  form    — the 3-field form is open
 *  sent    — it reached /api/contact successfully
 */
type CaptureStage = "hidden" | "offered" | "form" | "sent";

// -- Constants --

const INITIAL_GREETING =
  "Hi! I'm the NOW Team Assistant. I can help you with Tampa Bay real estate questions, finding homes, understanding the market, or connecting you with Barrett Henry. What can I help you with?";

const STORAGE_KEY = "nowtb-chat-history";

// Remembers that we already asked this session, so a visitor who said "no
// thanks" (or already submitted) is never nagged again while they browse.
const CAPTURE_STATE_KEY = "nowtb-chat-capture";

const PHONE_DISPLAY = "(813) 733-7907";
const PHONE_HREF = "tel:+18137337907";

// ─── WHEN WE ASK FOR CONTACT DETAILS ──────────────────────────────────────────
// Never on the first reply. Gating the opening answer behind a form is how you
// kill a conversation before it starts — and this widget's whole problem was
// that it captured NOTHING, not that it asked too late.
//
// Two ways a visitor earns the ask:
//  1. They have sent this many messages — they are clearly engaged.
//  2. Their message contains high-intent language (they want to see a house,
//     sell one, get pre-approved). One of those is worth more than ten
//     "what's the weather in Tampa" questions.
const MIN_USER_MESSAGES_BEFORE_ASK = 2;

// High-intent phrases. Deliberately about the TRANSACTION — we ask what they
// want to do, never anything personal. (Barrett's rule: no creepy CTAs. Never
// ask about children, ages, income, marital status or anything like it.)
const HIGH_INTENT_PATTERN =
  /\b(buy|buying|sell|selling|list(ing)?\b|showing|tour|schedule|appointment|pre-?approv|mortgage|offer|make an offer|my home'?s? (value|worth)|home value|valuation|what'?s my house worth|move|moving|relocat|agent|realtor|call me|text me|email me)\b/i;

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

  // -- Lead capture state --
  const [captureStage, setCaptureStage] = useState<CaptureStage>("hidden");
  const [leadName, setLeadName] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);
  // Empty string = no error. Shown above the form, with the phone number, if
  // the POST fails — we never fake a success.
  const [leadError, setLeadError] = useState("");
  // Cloudflare Turnstile token. TurnstileWidget hands us either a real token or
  // one of its documented sentinel values when the challenge could not run.
  const [turnstileToken, setTurnstileToken] = useState("");
  const handleTurnstileVerify = useCallback((token: string) => {
    setTurnstileToken(token);
  }, []);

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

  // Auto-scroll to the bottom when new messages arrive.
  // captureStage is a dependency so the lead-capture card scrolls into view the
  // moment it appears — otherwise it can render below the fold of the panel and
  // the visitor never sees the ask.
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading, captureStage]);

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

  // ───────────────────────────────────────────────────────────────────────────
  // LEAD CAPTURE — decide when to offer it
  //
  // THE PROBLEM THIS SOLVES: this widget is on all ~3,400 pages and captured
  // nothing. Someone would ask three questions about Riverview schools, get a
  // genuinely good answer, and be handed a /contact/ URL. Barrett never learned
  // they existed. Every one of those was a lead that engaged and then
  // evaporated.
  //
  // Fires once per session, only after the assistant has finished answering
  // (so the card never interrupts a reply mid-stream).
  // ───────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    // Already offered, open, or submitted — nothing to do.
    if (captureStage !== "hidden") return;
    // Already handled earlier this session (they submitted or said no thanks).
    try {
      if (sessionStorage.getItem(CAPTURE_STATE_KEY)) return;
    } catch {
      // sessionStorage unavailable (private mode) — carry on, worst case we
      // offer again on the next page. Better than crashing the widget.
    }
    // Don't interrupt a reply that is still streaming in.
    if (isLoading) return;

    const userMessages = messages.filter((m) => m.role === "user");
    if (userMessages.length === 0) return;

    // The assistant must have actually answered — the last message is a
    // non-empty assistant turn.
    const last = messages[messages.length - 1];
    if (!last || last.role !== "assistant" || !last.content.trim()) return;

    const lastUserMessage = userMessages[userMessages.length - 1].content;
    const showsIntent = HIGH_INTENT_PATTERN.test(lastUserMessage);

    if (userMessages.length >= MIN_USER_MESSAGES_BEFORE_ASK || showsIntent) {
      setCaptureStage("offered");
    }
  }, [messages, isLoading, captureStage]);

  /** Remember that we asked, so we don't ask again this session. */
  const rememberCaptureHandled = useCallback((how: "sent" | "dismissed") => {
    try {
      sessionStorage.setItem(CAPTURE_STATE_KEY, how);
    } catch {
      // Non-fatal — see note above.
    }
  }, []);

  /**
   * Builds the note Barrett reads in Follow Up Boss: the tail of the actual
   * conversation plus the page they were on. Without this he gets a name and a
   * phone number with no idea what they wanted.
   *
   * Trimmed to the last few turns and hard-capped in length so one very long
   * chat can't produce a payload FUB will refuse.
   */
  const buildTranscriptNote = useCallback(() => {
    const recent = messages.slice(-8);
    const lines = recent.map(
      (m) => `${m.role === "user" ? "Visitor" : "Assistant"}: ${m.content.trim()}`
    );
    const pagePath =
      typeof window !== "undefined" ? window.location.pathname : "unknown";

    const note = [
      "Lead captured by the website AI chat assistant.",
      `Page they were on: ${pagePath}`,
      "",
      "--- Recent conversation ---",
      ...lines,
    ].join("\n");

    // 4,000 characters is comfortably inside what the API and FUB accept.
    return note.length > 4000 ? `${note.slice(0, 4000)}\n[trimmed]` : note;
  }, [messages]);

  /**
   * POST the captured lead to /api/contact.
   *
   * CONFORMS TO THE EXISTING CONTRACT — this sends exactly the shape
   * ContactForm.tsx sends, because /api/contact destructures
   * { type, turnstileToken, honeypot, extraTags, ...formData }:
   *   - type: "contact"  → the only sensible existing type. There is NO "chat"
   *     type in the route's webhookMap, and an unknown type returns 400
   *     "Invalid form type", which would silently lose every chat lead.
   *   - source: "/chat/" → stored as FUB's sourceId, so chat leads are
   *     separable from page forms at a glance.
   *   - extraTags       → merged into the FUB tags by the route's
   *     mergeExtraTags(), giving Barrett a "Chat Lead" tag to build a smart
   *     list from.
   *   - turnstileToken  → a real Cloudflare token when the widget below can
   *     run, or one of the widget's own sentinel values when it cannot. The
   *     route already accepts those sentinels; we do NOT invent a new one and
   *     we do NOT bypass the endpoint.
   *
   * If it breaks, check:
   *  - A 403 means Turnstile rejected it. The sentinel escape hatch lives in
   *    src/app/api/contact/route.ts — look for `widgetFallback`.
   *  - A 400 "Invalid form type" means someone changed `type` below to a value
   *    that isn't a key of that route's webhookMap.
   *  - A 200 with no lead in FUB means the FUB_API_KEY is bad; the route logs
   *    "[LEAD AT RISK]" and emails a failure alert in that case.
   *  - A 429 means the per-IP rate limit (5 per 10 minutes) was hit.
   */
  const submitLead = useCallback(async () => {
    if (isSubmittingLead) return;

    const name = leadName.trim();
    const phone = leadPhone.trim();
    const email = leadEmail.trim();

    // Client-side sanity check so an obviously incomplete form doesn't burn one
    // of the visitor's five allowed submissions per 10 minutes.
    if (!name || !phone || !email) {
      setLeadError("Please add your name, phone and email so Barrett can reach you.");
      return;
    }

    setIsSubmittingLead(true);
    setLeadError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          message: buildTranscriptNote(),
          source: "/chat/",
          type: "contact",
          extraTags: ["Chat Lead", "AI Chat Assistant"],
          turnstileToken,
        }),
      });

      if (!res.ok) throw new Error(`Server responded with ${res.status}`);

      // Success — tell them in the conversation, not with a popup.
      setCaptureStage("sent");
      rememberCaptureHandled("sent");
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Got it, ${name.split(" ")[0]} — Barrett has your details and will reach out personally, usually within 2 hours. If you'd rather not wait, call him directly at ${PHONE_DISPLAY}. Anything else I can help with in the meantime?`,
        },
      ]);

      // Conversion event. No personal data is sent to Google — just the fact
      // that a chat lead was captured and which page it happened on.
      trackChatLeadCaptured(
        typeof window !== "undefined" ? window.location.pathname : "unknown"
      );
    } catch (err) {
      // BE HONEST ON FAILURE. Showing "thanks, we'll be in touch!" when the
      // lead never arrived is worse than showing nothing — they stop trying.
      console.error("Chat lead capture failed:", err);
      setLeadError(
        `That didn't go through. Please call or text Barrett at ${PHONE_DISPLAY} — or try sending again.`
      );
    } finally {
      setIsSubmittingLead(false);
    }
  }, [
    isSubmittingLead,
    leadName,
    leadPhone,
    leadEmail,
    turnstileToken,
    buildTranscriptNote,
    rememberCaptureHandled,
  ]);

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
          // z-[80] = the "dialog/overlay" tier of the stacking scale in
          // src/app/layout.tsx. The panel was z-50, which put it UNDER the
          // cookie banner (z-90 at the time) — a first-time visitor could open
          // the chat and have the banner sitting across the bottom of it. A
          // dialog the visitor deliberately opened outranks a banner.
          className="fixed z-[80] flex flex-col
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

            {/* ── Lead capture card ───────────────────────────────────────
                Appears inside the conversation after a real exchange. Three
                fields only — name, phone, email. Nothing else is ever asked;
                no "how many kids", no budget interrogation, no personal
                details. ──────────────────────────────────────────────────── */}
            {captureStage === "offered" && !isLoading && (
              <div className="bg-white border border-accent/60 rounded-lg p-3 shadow-sm">
                <p className="font-body text-sm text-dark leading-snug mb-3">
                  Want Barrett to follow up personally? He&apos;s a licensed
                  REALTOR&reg; with 23+ years of real estate experience and can
                  answer this properly in a 5-minute call.
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setCaptureStage("form");
                      setLeadError("");
                    }}
                    className="flex items-center gap-1.5 bg-primary text-white
                               font-body text-xs font-semibold
                               px-3 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    <Phone size={13} strokeWidth={2.5} aria-hidden="true" />
                    Yes — have Barrett reach out
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      // "No thanks" is respected for the rest of the session.
                      setCaptureStage("hidden");
                      rememberCaptureHandled("dismissed");
                    }}
                    className="font-body text-xs text-muted hover:text-dark
                               px-3 py-2 rounded-lg transition-colors"
                  >
                    No thanks
                  </button>
                </div>
              </div>
            )}

            {captureStage === "form" && (
              <div className="bg-white border border-accent/60 rounded-lg p-3 shadow-sm">
                <p className="font-body text-xs font-semibold text-dark mb-2">
                  Where should Barrett reach you?
                </p>

                {/* Honest failure state — shows the phone number rather than a
                    fake "thanks!". The API returning anything but 200 lands
                    here. */}
                {leadError && (
                  <div className="rounded-md bg-red-50 border border-red-200 p-2 mb-2">
                    <p className="font-body text-xs text-red-800 leading-snug">
                      {leadError}
                    </p>
                  </div>
                )}

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    submitLead();
                  }}
                  className="space-y-2"
                >
                  <input
                    type="text"
                    required
                    autoComplete="name"
                    placeholder="Your name"
                    value={leadName}
                    onChange={(e) => setLeadName(e.target.value)}
                    aria-label="Your name"
                    className="w-full px-3 py-2 text-sm font-body border border-border rounded-lg
                               focus:border-accent focus:ring-2 focus:ring-accent/30 focus:outline-none
                               bg-white text-dark placeholder:text-muted"
                  />
                  <input
                    type="tel"
                    required
                    autoComplete="tel"
                    placeholder="Phone"
                    value={leadPhone}
                    onChange={(e) => setLeadPhone(e.target.value)}
                    aria-label="Your phone number"
                    className="w-full px-3 py-2 text-sm font-body border border-border rounded-lg
                               focus:border-accent focus:ring-2 focus:ring-accent/30 focus:outline-none
                               bg-white text-dark placeholder:text-muted"
                  />
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="Email"
                    value={leadEmail}
                    onChange={(e) => setLeadEmail(e.target.value)}
                    aria-label="Your email address"
                    className="w-full px-3 py-2 text-sm font-body border border-border rounded-lg
                               focus:border-accent focus:ring-2 focus:ring-accent/30 focus:outline-none
                               bg-white text-dark placeholder:text-muted"
                  />

                  {/* Same spam protection every other form on the site uses.
                      Renders nothing when no site key is configured and
                      auto-emits the sentinel token the API already accepts, so
                      the button can never be permanently stuck. */}
                  <TurnstileWidget onVerify={handleTurnstileVerify} />

                  <button
                    type="submit"
                    disabled={isSubmittingLead || !turnstileToken}
                    className={`w-full bg-primary text-white font-body text-xs font-semibold
                                px-3 py-2.5 rounded-lg transition-colors
                                ${
                                  isSubmittingLead || !turnstileToken
                                    ? "opacity-60 cursor-not-allowed"
                                    : "hover:bg-primary/90"
                                }`}
                  >
                    {isSubmittingLead ? "Sending..." : "Send to Barrett"}
                  </button>

                  <p className="font-body text-[10px] text-muted leading-snug">
                    By sending this you agree to be contacted by Barrett Henry,
                    The NOW Team, REMAX Collective by call, text or email. Opt
                    out any time. Prefer to call?{" "}
                    <a
                      href={PHONE_HREF}
                      onClick={() => trackPhoneTap("chat-capture-form")}
                      className="text-link underline"
                    >
                      {PHONE_DISPLAY}
                    </a>
                  </p>
                </form>
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
              <a
                href={PHONE_HREF}
                onClick={() => trackPhoneTap("chat-panel-footer")}
                className="text-link hover:underline"
              >
                {PHONE_DISPLAY}
              </a>
            </p>
          </div>
        </div>
      )}

      {/* ── Proactive Chat Tooltip ── */}
      {showTooltip && !isOpen && (
        <div
          // z-[45] = the "chat bubble" tier (below MobileBottomBar's z-50 so
          // the Call button always wins). marginBottom lifts it clear of the
          // cookie banner while that banner is on screen — the variable is
          // published by CookieConsent.tsx and is 0px otherwise.
          style={{ marginBottom: "var(--cookie-banner-lift, 0px)" }}
          className="fixed z-[45] right-4 bottom-28 sm:bottom-32 md:bottom-20"
        >
          <div className="relative bg-white text-dark rounded-xl shadow-2xl px-4 py-3 w-[240px] border border-border">
            <p className="font-body text-sm leading-snug pr-4">
              Looking for homes in Tampa Bay? I can help!
            </p>
            {/* Dismiss button */}
            <button
              onClick={() => setShowTooltip(false)}
              className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 flex items-center justify-center text-xs transition-colors"
              aria-label="Dismiss"
            >
              &times;
            </button>
            {/* Arrow pointing down toward the chat bubble */}
            <div className="absolute -bottom-2 right-6 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-white" />
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
        // Two offsets stacked into one bottom margin:
        //  - --cookie-banner-lift keeps the bubble above the cookie banner on a
        //    first visit (it used to be buried under it on every mobile visit).
        //  - env(safe-area-inset-bottom) keeps it above the MobileBottomBar on
        //    notched iPhones, where that bar grows by the home-indicator inset.
        // Both resolve to 0 when they don't apply, so desktop is unaffected.
        style={{
          marginBottom:
            "calc(var(--cookie-banner-lift, 0px) + env(safe-area-inset-bottom, 0px))",
        }}
        className={`
          fixed z-[45] right-4
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
