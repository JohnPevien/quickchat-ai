import { LanguageModel } from "ai";
import { createOpenAIProvider, getOpenAIModelInfo } from "./openai";
import { createDeepSeekProvider, getDeepSeekModelInfo } from "./deepseek";
import {
    createDeepSeekR1Provider,
    getDeepSeekR1ModelInfo,
} from "./deepseek-r1";

export type AISupportedProvider =
    | "openai"
    | "deepseek"
    | "deepseek-r1"
    | "default";

export interface AIProviderConfig {
    model: LanguageModel;
    info: {
        provider: string;
        model: string;
        baseURL: string;
        supportsStreaming: boolean;
        supportsTools: boolean;
        supportsStructuredOutput: boolean;
        maxTokens: number;
    };
}

export function getAIProvider(
    providerName: AISupportedProvider = "default"
): AIProviderConfig | null {
    try {
        if (providerName === "default") {
            const defaultProvider =
                (process.env.NEXT_PUBLIC_DEFAULT_AI_PROVIDER as AISupportedProvider) ||
                "openai";

            return getAIProvider(defaultProvider);
        }

        switch (providerName) {
            case "openai":
                return {
                    model: createOpenAIProvider(),
                    info: getOpenAIModelInfo(),
                };

            case "deepseek":
                return {
                    model: createDeepSeekProvider(),
                    info: getDeepSeekModelInfo(),
                };

            case "deepseek-r1":
                return {
                    model: createDeepSeekR1Provider(),
                    info: getDeepSeekR1ModelInfo(),
                };

            default:
                console.error(`Unsupported AI provider: ${providerName}`);
                return null;
        }
    } catch (error) {
        console.error(`Error configuring provider ${providerName}:`, error);
        return null;
    }
}

export function getProviderDefaultModel(
    providerName: AISupportedProvider = "default"
): string {
    if (providerName === "default") {
        const defaultProvider =
            (process.env.NEXT_PUBLIC_DEFAULT_AI_PROVIDER as AISupportedProvider) ||
            "openai";

        return getProviderDefaultModel(defaultProvider);
    }

    switch (providerName) {
        case "openai":
            return process.env.OPENAI_MODEL || "gpt-4o-mini";

        case "deepseek":
            return process.env.DEEPSEEK_MODEL || "deepseek-chat";

        case "deepseek-r1":
            return process.env.DEEPSEEK_R1_MODEL || "deepseek-r1";

        default:
            return "gpt-4o-mini";
    }
}

export function listAvailableProviders(): AISupportedProvider[] {
    const providers: AISupportedProvider[] = [];

    if (process.env.OPENAI_API_KEY) {
        providers.push("openai");
    }

    if (process.env.DEEPSEEK_API_KEY) {
        providers.push("deepseek");
        providers.push("deepseek-r1");
    }

    if (providers.length > 0) {
        providers.unshift("default");
    }

    return providers;
}

export function validateProviderConfig(
    providerName: AISupportedProvider
): boolean {
    try {
        const config = getAIProvider(providerName);
        return config !== null;
    } catch (error) {
        console.error(`Provider validation failed for ${providerName}:`, error);
        return false;
    }
}

export { createOpenAIProvider as openAIProvider } from "./openai";
export { createDeepSeekProvider as deepSeekProvider } from "./deepseek";
export { createDeepSeekR1Provider as deepSeekR1Provider } from "./deepseek-r1";
