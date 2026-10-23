import { streamText, convertToCoreMessages } from "ai";
import { getAIProvider, AISupportedProvider } from "@/lib/ai-providers";
import { NextRequest } from "next/server";

import { SYSTEM_PROMPT } from "@/config/constants";

import {
    checkMessagesSize,
    checkRateLimit,
    checkSameOrigin,
} from "@/lib/request-guard";

const jsonResponse = (body: Record<string, unknown>, status: number) =>
    new Response(JSON.stringify(body), {
        status,
        headers: {
            "Content-Type": "application/json",
        },
    });

export const runtime = "edge";

export async function POST(request: NextRequest) {
    try {
        const originError = checkSameOrigin(request);
        if (originError) return originError;

        const rateLimited = checkRateLimit(request);
        if (rateLimited) return rateLimited;

        const body = await request.json();
        const { messages, provider = "openai" } = body;

        if (!messages || !Array.isArray(messages)) {
            console.error("Invalid messages array provided");
            return jsonResponse({ error: "Messages array is required" }, 400);
        }

        const sizeError = checkMessagesSize(messages);
        if (sizeError) return sizeError;

        if (provider === "openai" && !process.env.OPENAI_API_KEY) {
            console.error("OPENAI_API_KEY is not set in environment variables");
            return jsonResponse(
                { error: "OpenAI API key not configured" },
                500,
            );
        }

        if (provider === "deepseek" && !process.env.DEEPSEEK_API_KEY) {
            console.error(
                "DEEPSEEK_API_KEY is not set in environment variables",
            );
            return jsonResponse(
                { error: "DeepSeek API key not configured" },
                500,
            );
        }

        if (provider === "deepseek-reasoner" && !process.env.DEEPSEEK_API_KEY) {
            console.error(
                "DEEPSEEK_API_KEY is not set in environment variables",
            );
            return jsonResponse(
                { error: "DeepSeek Reasoner API key not configured" },
                500,
            );
        }

        const coreMessages = convertToCoreMessages(messages);

        // Configure AI provider dynamically
        const providerConfig = getAIProvider(provider as AISupportedProvider);

        if (!providerConfig) {
            console.error(
                `Unsupported or misconfigured AI provider: ${provider}`,
            );
            return jsonResponse(
                { error: `Invalid AI provider: ${provider}` },
                400,
            );
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
            headers: streamResponse.headers,
        });
    } catch (error) {
        console.error("Chat API Error:", error);

        return jsonResponse({ error: "Internal server error" }, 500);
    }
}

