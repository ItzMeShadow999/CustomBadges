const DEFAULT_API_BASE = "https://custom-badges.shadow-164.workers.dev";
export async function fetchBadge(_event: any, userId: string, apiBase?: string) {
    const base = apiBase || DEFAULT_API_BASE;
    const res = await fetch(`${base}?userId=${encodeURIComponent(userId)}`);
    if (!res.ok)
        return null;
    return res.json();
}
export async function setBadge(_event: any, userId: string, badgeId: string, imageUrl: string, description: string, style?: Record<string, unknown>, apiBase?: string) {
    const base = apiBase || DEFAULT_API_BASE;
    const res = await fetch(base, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "setBadge", userId, badgeId, imageUrl, description, style })
    });
    const data = await res.json();
    if (!res.ok)
        throw new Error(data.error || res.statusText);
    return data;
}
export async function setActiveBadge(_event: any, userId: string, badgeId: string, apiBase?: string) {
    const base = apiBase || DEFAULT_API_BASE;
    const res = await fetch(base, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "setActiveBadge", userId, badgeId })
    });
    const data = await res.json();
    if (!res.ok)
        throw new Error(data.error || res.statusText);
    return data;
}
export async function deleteBadge(_event: any, userId: string, badgeId: string, apiBase?: string) {
    const base = apiBase || DEFAULT_API_BASE;
    const res = await fetch(base, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "deleteBadge", userId, badgeId })
    });
    const data = await res.json();
    if (!res.ok)
        throw new Error(data.error || res.statusText);
    return data;
}
