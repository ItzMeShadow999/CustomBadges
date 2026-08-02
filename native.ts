const DEFAULT_API_BASE = "https://custom-badges.shadow-164.workers.dev";
const REQUEST_TIMEOUT_MS = 10_000;

function taggedError(kind: string, detail: string): Error {
    return new Error(`${kind}:${detail}`);
}

async function fetchWithTimeout(url: string, options?: RequestInit): Promise<Response> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    try {
        return await fetch(url, { ...options, signal: controller.signal });
    } catch (e) {
        if ((e as Error)?.name === "AbortError") {
            throw taggedError("TIMEOUT", `Request to ${new URL(url).host} timed out`);
        }
        throw taggedError("NETWORK", (e as Error)?.message || "Network request failed");
    } finally {
        clearTimeout(timeout);
    }
}

async function parseJsonOrThrow(res: Response): Promise<any> {
    let data: any = null;
    try {
        data = await res.json();
    } catch {

    }

    if (res.status === 429) {
        const retryAfter = res.headers.get("Retry-After") ?? "";
        throw taggedError("SERVER_RATE_LIMIT", retryAfter || (data?.error ?? "Too many requests"));
    }
    if (!res.ok) {
        throw taggedError("SERVER_ERROR", `${res.status}:${data?.error || res.statusText || "Unknown error"}`);
    }
    return data;
}

const RATE_LIMIT_WINDOW_MS = 10_000;
const RATE_LIMIT_MAX_REQUESTS = 50;

const writeRequestTimestamps: number[] = [];

function checkClientRateLimit() {
    const now = Date.now();
    while (writeRequestTimestamps.length && now - writeRequestTimestamps[0] > RATE_LIMIT_WINDOW_MS) {
        writeRequestTimestamps.shift();
    }
    if (writeRequestTimestamps.length >= RATE_LIMIT_MAX_REQUESTS) {
        const retryAfterMs = RATE_LIMIT_WINDOW_MS - (now - writeRequestTimestamps[0]);
        throw taggedError("CLIENT_RATE_LIMIT", String(Math.max(retryAfterMs, 0)));
    }
    writeRequestTimestamps.push(now);
}

export async function fetchBadge(_event: any, userId: string, apiBase?: string) {
    const base = apiBase || DEFAULT_API_BASE;
    const res = await fetchWithTimeout(`${base}?userId=${encodeURIComponent(userId)}`);

    if (res.status === 404) return null;
    return parseJsonOrThrow(res);
}

export async function setBadge(_event: any, userId: string, badgeId: string, imageUrl: string, description: string, style?: Record<string, unknown>, apiBase?: string) {
    checkClientRateLimit();
    const base = apiBase || DEFAULT_API_BASE;
    const res = await fetchWithTimeout(base, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "setBadge", userId, badgeId, imageUrl, description, style })
    });
    return parseJsonOrThrow(res);
}

export async function setActiveBadge(_event: any, userId: string, badgeId: string, apiBase?: string) {
    checkClientRateLimit();
    const base = apiBase || DEFAULT_API_BASE;
    const res = await fetchWithTimeout(base, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "setActiveBadge", userId, badgeId })
    });
    return parseJsonOrThrow(res);
}

export async function deleteBadge(_event: any, userId: string, badgeId: string, apiBase?: string) {
    checkClientRateLimit();
    const base = apiBase || DEFAULT_API_BASE;
    const res = await fetchWithTimeout(base, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "deleteBadge", userId, badgeId })
    });
    return parseJsonOrThrow(res);
}
