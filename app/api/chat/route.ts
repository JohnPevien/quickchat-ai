import { streamText, convertToCoreMessages } from "ai";
import { getAIProvider, AISupportedProvider } from "@/lib/ai-providers";
import { NextRequest } from "next/server";

import { SYSTEM_PROMPT } from "@/config/constants";

const CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

const jsonResponse = (body: Record<string, unknown>, status: number) =>
    new Response(JSON.stringify(body), {
        status,
        headers: {
            "Content-Type": "application/json",
            ...CORS_HEADERS,
        },
    });

export const runtime = "edge";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { messages, provider = "openai" } = body;

        if (!messages || !Array.isArray(messages)) {
            console.error("Invalid messages array provided");
            return jsonResponse({ error: "Messages array is required" }, 400);
        }

        if (provider === "openai" && !process.env.OPENAI_API_KEY) {
            console.error("OPENAI_API_KEY is not set in environment variables");
            return jsonResponse({ error: "OpenAI API key not configured" }, 500);
        }

        if (provider === "deepseek" && !process.env.DEEPSEEK_API_KEY) {
            console.error("DEEPSEEK_API_KEY is not set in environment variables");
            return jsonResponse({ error: "DeepSeek API key not configured" }, 500);
        }

        if (provider === "deepseek-r1" && !process.env.DEEPSEEK_API_KEY) {
            console.error("DEEPSEEK_API_KEY is not set in environment variables");
            return jsonResponse({ error: "DeepSeek R1 API key not configured" }, 500);
        }

        const coreMessages = convertToCoreMessages(messages);

        // Configure AI provider dynamically
        const providerConfig = getAIProvider(provider as AISupportedProvider);

        if (!providerConfig) {
            console.error(`Unsupported or misconfigured AI provider: ${provider}`);
            return jsonResponse({ error: `Invalid AI provider: ${provider}` }, 400);
        }

        const result = streamText({
            model: providerConfig.model,
            system: SYSTEM_PROMPT,
            messages: coreMessages,
            temperature: 0.7,
            maxTokens: 2048,
        });

        const streamResponse = result.toDataStreamResponse();
        return new Response(streamResponse.body, {
            status: streamResponse.status,
            headers: {
                ...streamResponse.headers,
                ...CORS_HEADERS,
            },
        });
    } catch (error) {
        console.error("Chat API Error:", error);

        return jsonResponse(
            {
                error: "Internal server error",
                details: error instanceof Error ? error.message : String(error),
            },
            500
        );
    }
}

export async function OPTIONS() {
    return new Response(null, {
        status: 200,
        headers: CORS_HEADERS,
    });
}
