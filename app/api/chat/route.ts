import { streamText, convertToCoreMessages } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { NextRequest } from "next/server";

import { SYSTEM_PROMPT } from "@/config/constants";

export const runtime = "edge";
export const maxDuration = 60;

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { messages, provider = "openai" } = body;

        if (!messages || !Array.isArray(messages)) {
            console.error("Invalid messages array provided");
            return new Response(
                JSON.stringify({ error: "Messages array is required" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        if (!process.env.OPENAI_API_KEY) {
            console.error("OPENAI_API_KEY is not set in environment variables");
            return new Response(
                JSON.stringify({ error: "OpenAI API key not configured" }),
                { status: 500, headers: { "Content-Type": "application/json" } }
            );
        }

        const openai = createOpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });

        const coreMessages = convertToCoreMessages(messages);

        const result = streamText({
            model: openai("gpt-4o-mini"),
            system: SYSTEM_PROMPT,
            messages: coreMessages,
            temperature: 0.7,
            maxTokens: 2048,
        });

        return result.toDataStreamResponse();
    } catch (error) {
        console.error("Chat API Error:", error);

        return new Response(
            JSON.stringify({
                error: "Internal server error",
                details: error instanceof Error ? error.message : String(error),
            }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}

export async function OPTIONS() {
    return new Response(null, {
        status: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
    });
}
