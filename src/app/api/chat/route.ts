// =============================================================================
// Chat API Route — Streams AI responses for the NOW Team Assistant chatbot.
// Uses the Anthropic Claude API when ANTHROPIC_API_KEY is set.
// Falls back to a canned helpful response if no API key is configured.
// =============================================================================

import { NextRequest } from "next/server";

// The system prompt that shapes the assistant's personality and knowledge
const SYSTEM_PROMPT = `You are the NOW Team Assistant, an AI chatbot on nowtb.com — the real estate website of Barrett Henry, REALTOR® and Broker Associate at REMAX Collective.

YOUR IDENTITY:
- You are a helpful, friendly, professional real estate assistant
- You represent Barrett Henry and The NOW Team
- You are NOT Barrett — you are his AI assistant helping visitors

BARRETT HENRY — KEY FACTS:
- Licensed REALTOR® since 2003 — 23+ years of real estate experience
- Florida Broker Associate, License #BK3313308
- REMAX Collective (brokerage)
- The NOW Team is his real estate team
- Phone: (813) 733-7907
- Designations: e-PRO, MRP (Military Relocation Professional), SRS (Seller Representative Specialist)
- REMAX Hall of Fame 2024, REMAX 10-Year Anniversary Award

SERVICE AREA — 8 COUNTIES:
Hillsborough, Pinellas, Pasco, Polk, Manatee, Sarasota, Hernando, Citrus
Key cities: Tampa, St. Petersburg, Clearwater, Brandon, Riverview, Valrico, Wesley Chapel, Land O' Lakes, Lakeland, Bradenton, Sarasota, Spring Hill

WHAT YOU CAN HELP WITH:
1. Tampa Bay neighborhoods — comparisons, lifestyle, schools, commute, pros/cons
2. Home buying process — step by step, from pre-approval to closing
3. Home selling process — pricing strategy, staging tips, timeline
4. Mortgage basics — conventional, FHA, VA, USDA, down payment assistance (DPA) programs
5. Market insights — general Tampa Bay trends, seasonal patterns
6. Site navigation — direct visitors to the right pages
7. Investment property basics — rental market, cap rates, landlord considerations
8. Relocation info — moving to Tampa Bay, what to expect

SITE PAGES TO RECOMMEND:
- Search homes: /properties/search/
- Mortgage calculator: /mortgage-calculator/
- Buying guides: /guides/
- Contact Barrett: /contact/
- City/area pages: /tampa/, /st-petersburg/, /clearwater/, /brandon/, /riverview/, /valrico/, /wesley-chapel/, /lakeland/, etc.
- Home valuation: /home-value/

NEIGHBORHOOD KNOWLEDGE (use when comparing areas):
- Valrico/FishHawk: Family-friendly, top-rated schools, newer construction, suburban feel
- Riverview: Affordable, growing fast, mix of new builds and established neighborhoods
- Brandon: Central location, shopping/dining hub, easy access to I-75 and I-4
- Wesley Chapel: Booming growth, premium amenities, The Shops at Wiregrass, newer communities
- South Tampa: Walkable urban, historic homes, Bayshore Blvd, higher price points
- St. Petersburg: Arts/culture scene, waterfront living, downtown revitalization
- Clearwater: Beach access, tourism economy, mix of condos and single-family
- Lakeland: More affordable, growing tech sector, halfway between Tampa and Orlando

RESPONSE GUIDELINES:
- Be genuinely helpful — answer the question thoroughly before suggesting Barrett
- Keep responses conversational but informative (2-4 paragraphs typical)
- Use specific data points and local knowledge when possible
- When appropriate, recommend calling Barrett at (813) 733-7907 for personalized advice
- Link to relevant site pages using markdown links like [Search Homes](/properties/search/)
- If asked about specific listings or pricing, direct them to [search](/properties/search/) or suggest calling Barrett
- Never make up specific prices, statistics, or listing details
- Never mention mobile/manufactured homes
- Always say "owners suite" (never "master suite")
- If asked something outside real estate, politely redirect
- Do NOT be a "call Barrett" redirect — actually answer the question first`;

// Canned response when no API key is configured
const CANNED_RESPONSES: Record<string, string> = {
  default: `Great question! While my AI features are being set up, here's how I can point you in the right direction:

🏠 **Search Homes** — Browse Tampa Bay listings at [/properties/search/](/properties/search/)
📊 **Mortgage Calculator** — Estimate your monthly payment at [/mortgage-calculator/](/mortgage-calculator/)
📖 **Buying & Selling Guides** — Learn the process at [/guides/](/guides/)
📱 **Talk to Barrett** — Call (813) 733-7907 for personalized help

Barrett Henry is a Broker Associate at REMAX Collective with 23+ years of real estate experience, serving 8 counties across Tampa Bay. He'd love to help you with your real estate goals!`,
};

// Type for a single chat message
interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

// POST handler — receives { message, history } and streams a response
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, history = [] } = body as {
      message: string;
      history: ChatMessage[];
    };

    // Validate input
    if (!message || typeof message !== "string") {
      return new Response(JSON.stringify({ error: "Message is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Check for API key — if missing, return a canned response (no error)
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ content: CANNED_RESPONSES.default }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Build the messages array for the Anthropic API
    // Include recent history (last 20 messages max to stay within context limits)
    const recentHistory = history.slice(-20);
    const messages = [
      ...recentHistory.map((msg: ChatMessage) => ({
        role: msg.role,
        content: msg.content,
      })),
      { role: "user" as const, content: message },
    ];

    // Call the Anthropic Messages API with streaming enabled
    const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages,
        stream: true,
      }),
    });

    // If the Anthropic API errors, fall back to canned response
    if (!anthropicRes.ok) {
      console.error(
        "Anthropic API error:",
        anthropicRes.status,
        await anthropicRes.text()
      );
      return new Response(
        JSON.stringify({ content: CANNED_RESPONSES.default }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Stream the response back to the client using SSE format
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const reader = anthropicRes.body?.getReader();
        if (!reader) {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ content: CANNED_RESPONSES.default })}\n\n`)
          );
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
          return;
        }

        const decoder = new TextDecoder();
        let buffer = "";

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            // Append new chunk to buffer and process complete lines
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            // Keep the last (possibly incomplete) line in the buffer
            buffer = lines.pop() || "";

            for (const line of lines) {
              // Skip empty lines and event type lines
              if (!line.startsWith("data: ")) continue;

              const data = line.slice(6); // Remove "data: " prefix
              if (data === "[DONE]") continue;

              try {
                const parsed = JSON.parse(data);

                // Extract text from content_block_delta events
                if (
                  parsed.type === "content_block_delta" &&
                  parsed.delta?.type === "text_delta"
                ) {
                  const text = parsed.delta.text;
                  controller.enqueue(
                    encoder.encode(`data: ${JSON.stringify({ text })}\n\n`)
                  );
                }
              } catch {
                // Skip malformed JSON lines (event metadata, etc.)
              }
            }
          }
        } catch (err) {
          console.error("Stream processing error:", err);
        } finally {
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
          reader.releaseLock();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    console.error("Chat API error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
