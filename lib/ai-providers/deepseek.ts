import { createOpenAI } from "@ai-sdk/openai";
import { LanguageModel } from "ai";

interface DeepSeekConfig {
    apiKey: string;
    model: string;
    baseURL: string;
}

const DEFAULT_DEEPSEEK_MODEL = "deepseek-chat";
const DEFAULT_DEEPSEEK_BASE_URL = "https://api.deepseek.com/v1";

export function createDeepSeekProvider(): LanguageModel {
    const apiKey = process.env.DEEPSEEK_API_KEY;

    if (!apiKey) {
        console.warn("DEEPSEEK_API_KEY is not set in environment variables");
        throw new Error("DeepSeek API key is required but not configured");
    }

    const config: DeepSeekConfig = {
        apiKey,
        model: process.env.DEEPSEEK_MODEL || DEFAULT_DEEPSEEK_MODEL,
        baseURL: process.env.DEEPSEEK_API_BASE_URL || DEFAULT_DEEPSEEK_BASE_URL,
    };

    const deepseek = createOpenAI({
        apiKey: config.apiKey,
        baseURL: config.baseURL,
        compatibility: "compatible",
    });

    return deepseek(config.model, {
        structuredOutputs: false,
        parallelToolCalls: false,
    });
}

export function getDeepSeekModelInfo() {
    return {
        provider: "deepseek",
        model: process.env.DEEPSEEK_MODEL || DEFAULT_DEEPSEEK_MODEL,
        baseURL: process.env.DEEPSEEK_API_BASE_URL || DEFAULT_DEEPSEEK_BASE_URL,
        supportsStreaming: true,
        supportsTools: true,
        supportsStructuredOutput: false,
        maxTokens: 32768,
    };
}

export const deepSeekProvider = createDeepSeekProvider;
