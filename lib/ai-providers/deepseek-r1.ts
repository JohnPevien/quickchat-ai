import { createDeepSeek } from "@ai-sdk/deepseek";
import { extractReasoningMiddleware, wrapLanguageModel, LanguageModel } from "ai";

interface DeepSeekR1Config {
    apiKey: string;
    model: string;
}

// Defaults -------------------------------------------------------------
// The R1 series uses a dedicated model name and the same DeepSeek base URL.
const DEFAULT_DEEPSEEK_R1_MODEL = "deepseek-r1";
const DEFAULT_DEEPSEEK_BASE_URL = "https://api.deepseek.com/v1";

/**
 * Create a DeepSeek R1 `LanguageModel` instance wrapped with the
 * `extractReasoningMiddleware` so that `<think>` sections are removed from the
 * final text while still being available via the `.reasoning` property of the
 * generation result.
 */
export function createDeepSeekR1Provider(): LanguageModel {
    const apiKey = process.env.DEEPSEEK_API_KEY;

    if (!apiKey) {
        console.warn("DEEPSEEK_API_KEY is not set in environment variables");
        throw new Error("DeepSeek API key is required but not configured");
    }

    const config: DeepSeekR1Config = {
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
 * Metadata describing the DeepSeek R1 model configuration used at runtime.
 */
export function getDeepSeekR1ModelInfo() {
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
export const deepSeekR1Provider = createDeepSeekR1Provider;
