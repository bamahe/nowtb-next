// =============================================================================
// ClientChatWidget — Lazy-loaded wrapper for the ChatWidget component.
// Uses next/dynamic with ssr:false so the chat bubble + panel only loads
// on the client (no server-side rendering). This keeps the initial page
// payload small and avoids hydration issues with sessionStorage.
// =============================================================================

"use client";

import dynamic from "next/dynamic";

// Dynamically import the ChatWidget — no SSR, no loading spinner needed
// (the chat bubble appears after JS loads, which is fine for a chat feature)
const ChatWidget = dynamic(() => import("@/components/ui/ChatWidget"), {
  ssr: false,
});

export default function ClientChatWidget() {
  return <ChatWidget />;
}
