import { createDeepSeek } from "@ai-sdk/deepseek";
import {
    extractReasoningMiddleware,
    wrapLanguageModel,
    LanguageModel,
} from "ai";

interface DeepSeekReasonerConfig {
    apiKey: string;
    model: string;
}

/**
 * Create a DeepSeek Reasoner `LanguageModel` instance wrapped with the
 * `extractReasoningMiddleware` so that `<think>` sections are removed from the
 * final text while still being available via the `.reasoning` property of the
 * generation result.
 */
export function createDeepSeekReasonerProvider(): LanguageModel {
    const apiKey = process.env.DEEPSEEK_API_KEY;

    if (!apiKey) {
        console.warn("DEEPSEEK_API_KEY is not set in environment variables");
        throw new Error("DeepSeek API key is required but not configured");
    }

    const config: DeepSeekReasonerConfig = {
        apiKey,
        model: "deepseek-reasoner",
    };

    const deepseek = createDeepSeek({
        apiKey: config.apiKey,
    });

    const baseModel = deepseek(config.model);

    // Apply middleware to strip <think> … </think> sections from the final
    // answer while exposing them as a `reasoning` property.
    return wrapLanguageModel({
        model: baseModel,
        middleware: extractReasoningMiddleware({ tagName: "think" }),
        providerId: "deepseek-reasoner",
        modelId: config.model,
    });
}

/**
 * Metadata describing the DeepSeek Reasoner model configuration used at runtime.
 */
export function getDeepSeekReasonerModelInfo() {
    return {
        provider: "deepseek-reasoner",
        model: "deepseek-reasoner",
        baseURL: "https://api.deepseek.com/v1",
        supportsStreaming: true,
        supportsTools: true,
        supportsStructuredOutput: false,
        maxTokens: 32768,
    };
}

// Alias – keeps naming consistent with other provider exports.
export const deepSeekReasonerProvider = createDeepSeekReasonerProvider;
