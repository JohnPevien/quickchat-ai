// Application display configuration
export const PAGE_TITLE = process.env.NEXT_PUBLIC_PAGE_TITLE ?? "QuickChat AI";
export const PAGE_DESCRIPTION =
    process.env.NEXT_PUBLIC_PAGE_DESCRIPTION ?? "AI Chat Application";

// System prompt configuration
export const SYSTEM_PROMPT =
    (process.env.NEXT_PUBLIC_DEFAULT_SYSTEM_PROMPT as string) ||
    "You are a helpful assistant that assists users by providing information, answering questions, generating text content, and offering support across a wide range of topics. Your goal is to be informative, helpful, and engaging, adapting to the user's needs and preferences.";

// AI Provider configuration
export const DEFAULT_AI_PROVIDER =
    (process.env.NEXT_PUBLIC_DEFAULT_AI_PROVIDER as string) || "openai";

// Rate limiting configuration
export const RATE_LIMIT_CONFIG = {
    MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "50", 10),
    WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000", 10), // 15 minutes
};

// Model configuration defaults
export const MODEL_DEFAULTS = {
    TEMPERATURE: 0.7,
    MAX_TOKENS: 2048,
    TOP_P: 1.0,
    FREQUENCY_PENALTY: 0.0,
    PRESENCE_PENALTY: 0.0,
} as const;

// Environment validation
export function validateEnvironment() {
    const requiredVars = [];
    const warnings = [];

    // Check for at least one AI provider
    if (!process.env.OPENAI_API_KEY && !process.env.DEEPSEEK_API_KEY) {
        requiredVars.push(
            "At least one AI provider API key (OPENAI_API_KEY or DEEPSEEK_API_KEY)",
        );
    }

    // Validate default provider setting
    if (
        process.env.NEXT_PUBLIC_DEFAULT_AI_PROVIDER &&
        !["openai", "deepseek"].includes(
            process.env.NEXT_PUBLIC_DEFAULT_AI_PROVIDER,
        )
    ) {
        warnings.push(
            `Invalid DEFAULT_AI_PROVIDER: ${process.env.NEXT_PUBLIC_DEFAULT_AI_PROVIDER}. Should be 'openai' or 'deepseek'.`,
        );
    }

    return {
        isValid: requiredVars.length === 0,
        requiredVars,
        warnings,
    };
}
