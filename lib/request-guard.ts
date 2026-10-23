import { RATE_LIMIT_CONFIG } from "@/config/constants";

// Per-IP token bucket sized by RATE_LIMIT_CONFIG, plus same-origin and input
// size checks. Buckets live in memory, so they are per server instance.
const MAX_BUCKETS_BEFORE_SWEEP = 10000;

export const MAX_MESSAGES = 50;
export const MAX_MESSAGES_BODY_CHARS = 20000;

const buckets = new Map<string, { count: number; resetAt: number }>();

function clientIp(request: Request): string {
    const forwarded = request.headers.get("x-forwarded-for");
    if (forwarded) {
        const first = forwarded.split(",")[0]?.trim();
        if (first) return first;
    }
    return request.headers.get("x-real-ip")?.trim() || "unknown";
}

function headerHost(value: string | null): string | null {
    if (!value) return null;
    try {
        return new URL(value).host;
    } catch {
        return "";
    }
}

/** 429 JSON response when the caller IP is over budget, else null. */
export function checkRateLimit(request: Request): Response | null {
    const now = Date.now();
    const ip = clientIp(request);
    if (buckets.size > MAX_BUCKETS_BEFORE_SWEEP) {
        buckets.forEach((bucket, key) => {
            if (now >= bucket.resetAt) buckets.delete(key);
        });
    }
    const bucket = buckets.get(ip);
    if (!bucket || now >= bucket.resetAt) {
        buckets.set(ip, {
            count: 1,
            resetAt: now + RATE_LIMIT_CONFIG.WINDOW_MS,
        });
        return null;
    }
    bucket.count += 1;
    if (bucket.count > RATE_LIMIT_CONFIG.MAX_REQUESTS) {
        const retryAfter = Math.max(1, Math.ceil((bucket.resetAt - now) / 1000));
        return Response.json(
            { error: "Too many requests, please try again later" },
            { status: 429, headers: { "Retry-After": String(retryAfter) } },
        );
    }
    return null;
}

/** 403 JSON response for cross-origin browser calls; headerless clients pass. */
export function checkSameOrigin(request: Request): Response | null {
    const host = new URL(request.url).host;
    const originHost = headerHost(request.headers.get("origin"));
    if (originHost !== null) {
        return originHost === host
            ? null
            : Response.json({ error: "Forbidden" }, { status: 403 });
    }
    const refererHost = headerHost(request.headers.get("referer"));
    if (refererHost !== null && refererHost !== host) {
        return Response.json({ error: "Forbidden" }, { status: 403 });
    }
    return null;
}

/** 400 JSON response when the messages array is oversized, else null. */
export function checkMessagesSize(messages: unknown[]): Response | null {
    if (messages.length > MAX_MESSAGES) {
        return Response.json(
            { error: `At most ${MAX_MESSAGES} messages are allowed` },
            { status: 400 },
        );
    }
    if (JSON.stringify(messages).length > MAX_MESSAGES_BODY_CHARS) {
        return Response.json(
            { error: "Messages exceed the size limit" },
            { status: 400 },
        );
    }
    return null;
}
