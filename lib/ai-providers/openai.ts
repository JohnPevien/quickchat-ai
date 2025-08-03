import { createOpenAI } from "@ai-sdk/openai";
import { LanguageModel } from "ai";

interface OpenAIConfig {
    apiKey: string;
    model: string;
    baseURL?: string;
    organization?: string;
}

const DEFAULT_OPENAI_MODEL = "gpt-4o-mini";
const DEFAULT_BASE_URL = "https://api.openai.com/v1";

export function createOpenAIProvider(): LanguageModel {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
        console.warn("OPENAI_API_KEY is not set in environment variables");
        throw new Error("OpenAI API key is required but not configured");
    }

    const config: OpenAIConfig = {
        apiKey,
        model: process.env.OPENAI_MODEL || DEFAULT_OPENAI_MODEL,
        baseURL: process.env.OPENAI_BASE_URL || DEFAULT_BASE_URL,
    };

    if (process.env.OPENAI_ORGANIZATION) {
        config.organization = process.env.OPENAI_ORGANIZATION;
    }

    const openai = createOpenAI({
        apiKey: config.apiKey,
        baseURL: config.baseURL,
        organization: config.organization,
        compatibility: "strict",
    });

    return openai(config.model);
}

export function getOpenAIModelInfo() {
    return {
        provider: "openai",
        model: process.env.OPENAI_MODEL || DEFAULT_OPENAI_MODEL,
        baseURL: process.env.OPENAI_BASE_URL || DEFAULT_BASE_URL,
        supportsStreaming: true,
        supportsTools: true,
        supportsStructuredOutput: true,
        maxTokens: 128000,
    };
}

export const openAIProvider = createOpenAIProvider;
