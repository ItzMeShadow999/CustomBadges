import { addProfileBadge, BadgeUserArgs, ProfileBadge, removeProfileBadge } from "@api/Badges";
import { definePluginSettings } from "@api/Settings";
import SettingsPlugin from "@plugins/_core/settings";
import definePlugin, { OptionType } from "@utils/types";
import { Button, Forms, GuildMemberStore, GuildStore, FluxDispatcher, Select, Switch, TextInput, Toasts, Tooltip, useEffect, useReducer, UserStore, useState } from "@webpack/common";
import type { CSSProperties, MouseEvent as ReactMouseEvent, ReactNode } from "react";

import { onRouteChanged } from "./dashboard/button";
import { buttonRegistry } from "./dashboard/buttonRegistry";
import { renderDashboardView, restoreDefaultView } from "./dashboard/dashboardView";
import { setDashboardActive, state as dashboardState } from "./dashboard/types";
import { setDashboardBridge } from "./dashboard/bridge";

const BADGE_CLASS = "custom-badge-injected";
const STYLE_ID = "custom-badges-style";

const MAX_BADGES = 12;

const PACKS_REPO_URL = "https://github.com/ItzMeShadow999/Badges";

const BADGE_EXPIRY_WARNING_DAYS = 14;
let expiryWarningShownThisSession = false;

function normalizeBadgeName(name: string): string {
    return name.trim().toLowerCase().replace(/\s+/g, " ");
}

const BLOCKED_BADGE_NAMES = new Set(
    [
        "discord",
        "discord mod",
        "staff",
        "discord developer",
        "discord active developer",
        "discord staff",
        "discord moderator",
        "discord employee",
        "discord team",
        "discord partner",
        "discord support",
        "certified moderator",
        "verified bot developer",
    ].map(normalizeBadgeName)
);

function isBlockedBadgeName(name: string | null | undefined): boolean {
    if (!name) return false;
    return BLOCKED_BADGE_NAMES.has(normalizeBadgeName(name));
}

const BLOCKED_BADGE_NAME_MESSAGE = "That badge name isn't allowed - it impersonates an official Discord role/badge";

function describeBadgeApiError(e: unknown): string {
    const message = e instanceof Error ? e.message : String(e);
    const sep = message.indexOf(":");
    const kind = sep === -1 ? message : message.slice(0, sep);
    const detail = sep === -1 ? "" : message.slice(sep + 1);

    switch (kind) {
        case "NOT_VERIFIED":
            return "Verify your Discord account first (see the \"Verify Discord Account\" button in settings)";
        case "CLIENT_RATE_LIMIT": {
            const seconds = Math.max(1, Math.ceil(Number(detail) / 1000) || 1);
            return `Slow down a little - try again in ${seconds}s`;
        }
        case "SERVER_RATE_LIMIT":
            return detail && /^\d+$/.test(detail)
                ? `Rate limited by the badge server - try again in ${detail}s`
                : "Rate limited by the badge server - try again shortly";
        case "TIMEOUT":
            return "Request timed out - the badge server didn't respond in time";
        case "NETWORK":
            return "Couldn't reach the badge server - check your connection";
        case "SERVER_ERROR":
            return "The badge server had a problem - try again in a bit";
        default:
            return "Something went wrong talking to the badge server";
    }
}

const recentToastMessages = new Map<string, number>();
const TOAST_DEDUPE_MS = 4000;

function showBadgeErrorToast(message: string) {
    const now = Date.now();
    const last = recentToastMessages.get(message) ?? 0;
    if (now - last < TOAST_DEDUPE_MS) return;
    recentToastMessages.set(message, now);
    Toasts.show({ id: Toasts.genId(), type: Toasts.Type.FAILURE, message });
}

export const BUILTIN_PRESETS = [
    {
        label: "Hypesquad Legacy",
        imageUrl: "https://files.catbox.moe/lreui6.png",
        name: "Hypesquad legacy ",
        style: {
            iconShape: "circle",
            iconSize: 22,
            hoverEffect: "glow",
            glowColor: "#5865F2",
            popupAnimation: "fade",
            popupBackgroundMode: "edit",
            popupGradientMain: "#1d1d1d",
            popupGradientSecondary: "#5865F2",
            nameColor: "#5865F2",
            appendVencordTag: false
        },
        prefs: {
            showTooltip: true,
            showPopup: true,
            showOwnerTag: true,
            ownerTagFormat: "By {username}",
            hideOwnBadge: false
        }
    },
    {
        label: "Minecraft Account",
        imageUrl: "https://i.pinimg.com/736x/82/b2/1f/82b21fe6d9166c673eed585a5fc38ef5.jpg",
        name: "Mincraft Account",
        style: {
            iconShape: "circle",
            iconSize: 22,
            hoverEffect: "glow",
            glowColor: "#f54e6d",
            popupAnimation: "fade",
            popupBackgroundMode: "edit",
            popupGradientMain: "#9B7653",
            popupGradientSecondary: "#7CFC00",
            nameColor: "#ffffff",
            appendVencordTag: false
        },
        prefs: {
            showTooltip: true,
            showPopup: true,
            showOwnerTag: true,
            ownerTagFormat: "[ADD_YOUR_MINECRAFT_USERNAME_HERE]",
            hideOwnBadge: false
        }
    },
    {
        label: "Konata Haii",
        imageUrl: "https://files.catbox.moe/lri82r.gif",
        name: "konata haii",
        style: {
            iconShape: "circle",
            iconSize: 22,
            hoverEffect: "glow",
            glowColor: "#4955e3",
            popupAnimation: "fade",
            popupBackgroundMode: "edit",
            popupGradientMain: "#0f0f0f",
            popupGradientSecondary: "#0f0f0f",
            nameColor: "#ffffff",
            appendVencordTag: false
        },
        prefs: {
            showTooltip: true,
            showPopup: false,
            showOwnerTag: true,
            ownerTagFormat: "By {username}",
            hideOwnBadge: false
        }
    },
    {
        label: "Cat",
        imageUrl: "https://i.ibb.co/4gWjN4fN/5c3d6e5876ff2a6ea5372317c5a4fbd7-removebg-preview.png",
        name: "Cat",
        style: {
            iconShape: "circle",
            iconSize: 22,
            hoverEffect: "glow",
            glowColor: "#ffd6de",
            popupAnimation: "fade",
            popupBackgroundMode: "edit",
            popupGradientMain: "#f54e6d",
            popupGradientSecondary: "#ff8a9f",
            nameColor: "#ffffff",
            appendVencordTag: false
        },
        prefs: {
            showTooltip: true,
            showPopup: true,
            showOwnerTag: true,
            ownerTagFormat: "By {username}",
            hideOwnBadge: false
        }
    },
    {
        label: "Verified Discord User",
        imageUrl: "https://files.catbox.moe/aodhtf.png",
        name: "Verified Discord User",
        style: {
            iconShape: "circle",
            iconSize: 30,
            hoverEffect: "scale",
            glowColor: "#0095ff",
            popupAnimation: "fade",
            popupBackgroundMode: "edit",
            popupGradientMain: "#1d1d1d",
            popupGradientSecondary: "#0095ff",
            nameColor: "#ffffff",
            appendVencordTag: false
        },
        prefs: {
            showTooltip: true,
            showPopup: true,
            showOwnerTag: true,
            ownerTagFormat: "Plugin user since {pluginusedate}",
            hideOwnBadge: false
        }
    },
    {
        label: "I like Vencord",
        imageUrl: "https://files.catbox.moe/g2sqaj.png",
        name: "I like Vencord",
        style: {
            iconShape: "square",
            iconSize: 22,
            hoverEffect: "glow",
            glowColor: "#FCC1CC",
            popupAnimation: "fade",
            popupBackgroundMode: "edit",
            popupGradientMain: "#FCC1CC",
            popupGradientSecondary: "#FCC1CC",
            nameColor: "#ffffff",
            appendVencordTag: true
        },
        prefs: {
            showTooltip: true,
            showPopup: false,
            showOwnerTag: true,
            ownerTagFormat: "",
            hideOwnBadge: false
        }
    }
];

let suppressPublishOnChange = false;

const popupSettingsDisabled = () => settings.store.badgeMode === "vencord";

export const settings = definePluginSettings({
    badgeMode: {
        type: OptionType.SELECT,
        description: "How the badge is injected into the profile. Original uses direct DOM injection with a MutationObserver and a fixed-position popup that can position itself above the badge, dismiss on outside click, and follow scroll. Vencord Classic [Limited] uses Vencord's native BadgeAPI instead - simpler, but its popup card can't do any of that, so click-to-view popup is disabled entirely while it's selected.",
        options: [
            { label: "Original (DOM injection - full popup support)", value: "original", default: true },
            { label: "Vencord Classic [Limited] (BadgeAPI - popup disabled)", value: "vencord" }
        ],
        onChange: (v: string) => onBadgeModeChange(v)
    },
    apiBaseUrl: {
        type: OptionType.STRING,
        description: "Worker URL used to fetch/set badges. Left at the default, this points at the main hosted server, which is recommended since it's what lets you see everyone else's badges and lets them see yours. Only change this if you're self-hosting your own separate instance - if you do, you won't see other people's badges and they won't see yours unless everyone points at the same URL.",
        default: "https://custom-badges.shadow-164.workers.dev"
    },
    verifyAccount: {
        type: OptionType.COMPONENT,
        description: "Opens your browser to confirm you own this Discord account via Discord OAuth (identify scope only - no email, no guilds). Required once before badge changes (set/switch/delete) will be accepted by the server.",
        component: () => (
            <Button onClick={verifyDiscordAccount}>
                Verify Discord Account
            </Button>
        )
    },
    sessionToken: {
        type: OptionType.COMPONENT,
        description: "Paste the session token shown after verifying your account here. Stored locally and sent as proof of identity on badge writes - never share it with anyone else.",
        component: () => (
            <SessionTokenInput />
        )
    },
    revokeToken: {
        type: OptionType.COMPONENT,
        description: "Revoke your current session token immediately. You'll need to verify again before publishing further badge changes.",
        component: () => (
            <RevokeTokenButton />
        )
    },
    myBadgeImageUrl: {
        type: OptionType.STRING,
        description: "Your badge image URL. Must be hosted on one of: i.imgur.com, i.ibb.co, i.pinimg.com, files.catbox.moe, cdn.discordapp.com, media.discordapp.net. Other hosts get silently blocked by Discord and your badge won't load.",
        default: "",
        onChange: () => { if (!suppressPublishOnChange) updateMyBadgeFromSettings(); }
    },
    myBadgeName: {
        type: OptionType.STRING,
        description: "Your badge name, shown on hover and in the click popup",
        default: "",
        onChange: () => { if (!suppressPublishOnChange) updateMyBadgeFromSettings(); }
    },
    badgePreview: {
        type: OptionType.COMPONENT,
        description: "Live preview of your badge icon and popup card using your current settings",
        component: () => (
            <BadgePreview />
        )
    },
    shareBadge: {
        type: OptionType.COMPONENT,
        description: "Copy a shareable code for your current badge image, name, and style so someone else can import it",
        component: () => (
            <Button onClick={shareMyBadge}>Share Badge</Button>
        )
    },
    importBadgeCode: {
        type: OptionType.STRING,
        description: "Paste a badge code you received from someone else here, then hit Import Badge below",
        default: ""
    },
    importBadge: {
        type: OptionType.COMPONENT,
        description: "Load the badge code pasted above and publish it as your own badge",
        component: () => (
            <Button onClick={importBadgeFromCode}>Import Badge</Button>
        )
    },
    revertBadgeBtn: {
        type: OptionType.COMPONENT,
        description: "Revert to your previously published badge if a change didn't turn out how you wanted. Keeps your last 2 published badges.",
        component: () => (
            <Button onClick={revertBadge}>Revert To Previous Badge</Button>
        )
    },
    selectedPreset: {
        type: OptionType.SELECT,
        description: "Choose a built-in badge preset, then hit Apply Preset below",
        options: BUILTIN_PRESETS.map((preset, i) => ({ label: preset.label, value: String(i), default: i === 0 }))
    },
    applyPreset: {
        type: OptionType.COMPONENT,
        description: "Apply the selected preset above as your badge and publish it",
        component: () => (
            <Button onClick={applySelectedPreset}>Apply Preset</Button>
        )
    },
    showTooltip: {
        type: OptionType.BOOLEAN,
        description: "Show a small tooltip when hovering a custom badge",
        default: true
    },
    showPopup: {
        type: OptionType.BOOLEAN,
        description: "Show a popup card when clicking a custom badge. Locked off in Vencord Classic [Limited] mode - see the Badge Injection Mode notice above.",
        default: true,
        disabled: popupSettingsDisabled
    },
    showOwnerTag: {
        type: OptionType.BOOLEAN,
        description: "Show who created the badge underneath its name in the popup",
        default: true,
        disabled: popupSettingsDisabled
    },
    ownerTagFormat: {
        type: OptionType.STRING,
        description: "Text shown under the badge name when Show Owner Tag is on. Use {username} as a placeholder for the creator's username, and {pluginusedate} for the date they first started using this plugin.",
        default: "By {username}",
        disabled: popupSettingsDisabled
    },
    appendVencordTag: {
        type: OptionType.BOOLEAN,
        description: "Add a [Vencord] suffix after your badge name. Seen by everyone who views your badge.",
        default: false,
        onChange: () => { if (!suppressPublishOnChange) updateMyBadgeFromSettings(); }
    },
    popupBackgroundMode: {
        type: OptionType.SELECT,
        description: "Your popup card's background style. Seen by everyone who views your badge.",
        options: [
            { label: "Base (flat #1d1d1d)", value: "base", default: true },
            { label: "Sample (colors pulled from the badge image)", value: "sample" },
            { label: "Edit Gradient (pick your own colors)", value: "edit" }
        ],
        disabled: popupSettingsDisabled,
        onChange: () => { if (!suppressPublishOnChange) updateMyBadgeFromSettings(); }
    },
    popupGradientMain: {
        type: OptionType.STRING,
        description: "Edit Gradient mode: main/base color (hex). Seen by everyone who views your badge.",
        default: "#1d1d1d",
        disabled: () => popupSettingsDisabled() || settings.store.popupBackgroundMode !== "edit",
        onChange: () => { if (!suppressPublishOnChange) updateMyBadgeFromSettings(); }
    },
    popupGradientSecondary: {
        type: OptionType.STRING,
        description: "Edit Gradient mode: second/glow color (hex). Seen by everyone who views your badge.",
        default: "#2a2a38",
        disabled: () => popupSettingsDisabled() || settings.store.popupBackgroundMode !== "edit",
        onChange: () => { if (!suppressPublishOnChange) updateMyBadgeFromSettings(); }
    },
    popupAnimationStyle: {
        type: OptionType.SELECT,
        description: "Animation used when your popup card opens. Seen by everyone who views your badge.",
        options: [
            { label: "Fade", value: "fade", default: true },
            { label: "Scale", value: "scale" },
            { label: "Slide", value: "slide" }
        ],
        disabled: popupSettingsDisabled,
        onChange: () => { if (!suppressPublishOnChange) updateMyBadgeFromSettings(); }
    },
    badgeNameColor: {
        type: OptionType.STRING,
        description: "Text color for your badge name in the popup (hex). Seen by everyone who views your badge.",
        default: "#ffffff",
        disabled: popupSettingsDisabled,
        onChange: () => { if (!suppressPublishOnChange) updateMyBadgeFromSettings(); }
    },
    badgeIconSize: {
        type: OptionType.NUMBER,
        description: "Size in pixels of your badge icon in the badge row. Seen by everyone who views your badge.",
        default: 22,
        onChange: () => { if (!suppressPublishOnChange) updateMyBadgeFromSettings(); }
    },
    badgeIconShape: {
        type: OptionType.SELECT,
        description: "Shape of your badge icon in the badge row. Seen by everyone who views your badge.",
        options: [
            { label: "Circle", value: "circle", default: true },
            { label: "Rounded square", value: "rounded" },
            { label: "Square", value: "square" }
        ],
        onChange: () => { if (!suppressPublishOnChange) updateMyBadgeFromSettings(); }
    },
    badgeHoverEffect: {
        type: OptionType.SELECT,
        description: "Effect when someone hovers your badge icon in the badge row. Seen by everyone who views your badge.",
        options: [
            { label: "None", value: "none", default: true },
            { label: "Scale up", value: "scale" },
            { label: "Glow", value: "glow" }
        ],
        onChange: () => { if (!suppressPublishOnChange) updateMyBadgeFromSettings(); }
    },
    badgeGlowColor: {
        type: OptionType.STRING,
        description: "Glow color used when Badge Hover Effect is set to Glow (hex). Seen by everyone who views your badge.",
        default: "#ffffff",
        disabled: () => settings.store.badgeHoverEffect !== "glow",
        onChange: () => { if (!suppressPublishOnChange) updateMyBadgeFromSettings(); }
    },
    hideOwnBadge: {
        type: OptionType.BOOLEAN,
        description: "Don't show my own badge to myself when viewing my own profile",
        default: false
    },
    firstUsedDate: {
        type: OptionType.STRING,
        description: "Internal - the date you first started using this plugin. Used to fill in the {pluginusedate} placeholder in Owner Tag Format. Don't edit this manually.",
        default: "",
        hidden: true
    },
    myBadgesJson: {
        type: OptionType.STRING,
        description: "Internal - local mirror of your badge list (rotation). Don't edit this manually.",
        default: "[]",
        hidden: true
    },
    myActiveBadgeId: {
        type: OptionType.STRING,
        description: "Internal - id of your currently active/displayed badge. Don't edit this manually.",
        default: "",
        hidden: true
    },
    myBadgesList: {
        type: OptionType.COMPONENT,
        description: "Your saved badges. Click one to make it active and publish it, or add a new slot to build another look.",
        component: () => (
            <MyBadgesList />
        )
    },
    newBadgeSlot: {
        type: OptionType.COMPONENT,
        description: "Add a new badge slot, using your current image/name/style as a starting point",
        component: () => (
            <Button onClick={() => { createNewBadgeSlot(); }}>+ New Badge Slot</Button>
        )
    },
    importPackUrl: {
        type: OptionType.STRING,
        description: "Raw GitHub URL to a badge pack JSON file (e.g. https://raw.githubusercontent.com/you/repo/main/packs/friend-group.json). Use the raw.githubusercontent.com link, not a github.com/blob/... page.",
        default: ""
    },
    importPack: {
        type: OptionType.COMPONENT,
        description: "Fetch the pack above and add every badge in it as a new badge slot",
        component: () => (
            <Button onClick={() => { importPackFromUrl(); }}>Import Pack from URL</Button>
        )
    },
    makePack: {
        type: OptionType.COMPONENT,
        description: "Copy all your current badges as a pack JSON file, ready to push to a repo so others can import them",
        component: () => (
            <MakePackButton />
        )
    },
    browsePacks: {
        type: OptionType.COMPONENT,
        description: "Browse packs other people have shared",
        component: () => (
            <Button onClick={() => { browsePacks(); }}>Add More Packs</Button>
        )
    },
    restrictToMutualGuilds: {
        type: OptionType.BOOLEAN,
        description: "Only show custom badges (yours and others') on profiles of people who share at least one server with you. Fully client-side, no extra network calls.",
        default: false
    },
    refreshCache: {
        type: OptionType.COMPONENT,
        description: "Clear locally cached badge data so changes made on the server show up immediately",
        component: () => (
            <Button onClick={refreshBadgeCache}>
                <img
                    src="https://uxwing.com/wp-content/themes/uxwing/download/web-app-development/circle-arrow-icon.png"
                    alt=""
                    style={{ width: 16, height: 16, marginRight: 6, verticalAlign: "middle" }}
                />
                Refresh Badge Cache
            </Button>
        )
    }
});

interface BadgeStyle {
    iconShape: string;
    iconSize: number;
    hoverEffect: string;
    glowColor: string;
    popupAnimation: string;
    popupBackgroundMode: string;
    popupGradientMain: string;
    popupGradientSecondary: string;
    nameColor: string;
    appendVencordTag: boolean;

    firstUsedDate?: string;
}

const DEFAULT_BADGE_STYLE: BadgeStyle = {
    iconShape: "circle",
    iconSize: 22,
    hoverEffect: "none",
    glowColor: "#ffffff",
    popupAnimation: "fade",
    popupBackgroundMode: "base",
    popupGradientMain: "#1d1d1d",
    popupGradientSecondary: "#2a2a38",
    nameColor: "#ffffff",
    appendVencordTag: false,
    firstUsedDate: ""
};

function resolveBadgeStyle(remote?: Partial<BadgeStyle> | null, ownerFirstUsedDate?: string | null): BadgeStyle {
    const base = { ...DEFAULT_BADGE_STYLE, ...(remote || {}) };

    if (!base.firstUsedDate && ownerFirstUsedDate) {
        base.firstUsedDate = ownerFirstUsedDate;
    }
    return base;
}

function getMyBadgeStyle(): BadgeStyle {
    return {
        iconShape: settings.store.badgeIconShape,
        iconSize: settings.store.badgeIconSize,
        hoverEffect: settings.store.badgeHoverEffect,
        glowColor: settings.store.badgeGlowColor,
        popupAnimation: settings.store.popupAnimationStyle,
        popupBackgroundMode: settings.store.popupBackgroundMode,
        popupGradientMain: settings.store.popupGradientMain,
        popupGradientSecondary: settings.store.popupGradientSecondary,
        nameColor: settings.store.badgeNameColor,
        appendVencordTag: settings.store.appendVencordTag,
        firstUsedDate: settings.store.firstUsedDate
    };
}

interface BadgePrefs {
    showTooltip: boolean;
    showPopup: boolean;
    showOwnerTag: boolean;
    ownerTagFormat: string;
    hideOwnBadge: boolean;
}

const DEFAULT_BADGE_PREFS: BadgePrefs = {
    showTooltip: true,
    showPopup: true,
    showOwnerTag: true,
    ownerTagFormat: "By {username}",
    hideOwnBadge: false
};

function resolveBadgePrefs(remote?: Partial<BadgePrefs> | null): BadgePrefs {
    return { ...DEFAULT_BADGE_PREFS, ...(remote || {}) };
}

function getMyBadgePrefs(): BadgePrefs {
    return {
        showTooltip: settings.store.showTooltip,
        showPopup: settings.store.showPopup,
        showOwnerTag: settings.store.showOwnerTag,
        ownerTagFormat: settings.store.ownerTagFormat,
        hideOwnBadge: settings.store.hideOwnBadge
    };
}

interface BadgeEntry {
    id: string;
    imageUrl: string;
    description: string;
    style?: Partial<BadgeStyle>;
}

function genBadgeId(): string {
    return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

function getMyBadges(): BadgeEntry[] {
    try {
        const parsed = JSON.parse(settings.store.myBadgesJson || "[]");
        return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
        return [];
    }
}

function setMyBadgesLocal(list: BadgeEntry[]) {
    settings.store.myBadgesJson = JSON.stringify(list.slice(0, MAX_BADGES));
}

function getActiveBadgeId(): string | null {
    return settings.store.myActiveBadgeId || null;
}

function findBadgeEntry(id: string | null): BadgeEntry | undefined {
    if (!id) return undefined;
    return getMyBadges().find(b => b.id === id);
}

function encodeBadgeCode(): string | null {
    const { myBadgeImageUrl, myBadgeName } = settings.store;
    if (!myBadgeImageUrl || !myBadgeName) return null;

    const payload = {
        imageUrl: myBadgeImageUrl,
        name: myBadgeName,
        style: getMyBadgeStyle(),
        prefs: getMyBadgePrefs()
    };

    return btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
}

function decodeBadgeCode(code: string) {
    return JSON.parse(decodeURIComponent(escape(atob(code.trim()))));
}

export function shareMyBadge() {
    const code = encodeBadgeCode();
    if (!code) {
        Toasts.show({ id: Toasts.genId(), type: Toasts.Type.FAILURE, message: "Set your badge image and name first" });
        return;
    }

    navigator.clipboard.writeText(code)
        .then(() => Toasts.show({ id: Toasts.genId(), type: Toasts.Type.SUCCESS, message: "Badge code copied to clipboard" }))
        .catch(() => Toasts.show({ id: Toasts.genId(), type: Toasts.Type.FAILURE, message: "Couldn't copy to clipboard" }));
}

function validateBadgePayload(parsed: any): string | null {
    if (!parsed || typeof parsed !== "object") return "That code isn't a valid badge, it didn't decode to an object";
    if (typeof parsed.imageUrl !== "string" || !parsed.imageUrl.trim()) return "That code is missing a valid image URL";
    if (typeof parsed.name !== "string" || !parsed.name.trim()) return "That code is missing a valid badge name";
    if (isBlockedBadgeName(parsed.name)) return BLOCKED_BADGE_NAME_MESSAGE;
    if (parsed.style !== undefined && parsed.style !== null && (typeof parsed.style !== "object" || Array.isArray(parsed.style))) {
        return "That code has an invalid style block";
    }
    if (parsed.prefs !== undefined && parsed.prefs !== null && (typeof parsed.prefs !== "object" || Array.isArray(parsed.prefs))) {
        return "That code has an invalid preferences block";
    }
    return null;
}

function applyBadgeState(state: { imageUrl: string; name: string; style?: Partial<BadgeStyle> | null; prefs?: Partial<BadgePrefs> | null }) {
    const style = resolveBadgeStyle(state.style);
    const prefs = resolveBadgePrefs(state.prefs);

    suppressPublishOnChange = true;
    try {
        settings.store.myBadgeImageUrl = state.imageUrl;
        settings.store.myBadgeName = state.name;
        settings.store.badgeIconShape = style.iconShape;
        settings.store.badgeIconSize = style.iconSize;
        settings.store.badgeHoverEffect = style.hoverEffect;
        settings.store.badgeGlowColor = style.glowColor;
        settings.store.popupAnimationStyle = style.popupAnimation;
        settings.store.popupBackgroundMode = style.popupBackgroundMode;
        settings.store.popupGradientMain = style.popupGradientMain;
        settings.store.popupGradientSecondary = style.popupGradientSecondary;
        settings.store.badgeNameColor = style.nameColor;
        settings.store.appendVencordTag = style.appendVencordTag;
        settings.store.showTooltip = prefs.showTooltip;
        settings.store.showPopup = prefs.showPopup;
        settings.store.showOwnerTag = prefs.showOwnerTag;
        settings.store.ownerTagFormat = prefs.ownerTagFormat;
        settings.store.hideOwnBadge = prefs.hideOwnBadge;
    } finally {
        suppressPublishOnChange = false;
    }

    updateMyBadgeFromSettings();
}

export function importBadgeFromCode() {
    const code = settings.store.importBadgeCode;
    if (!code) {
        Toasts.show({ id: Toasts.genId(), type: Toasts.Type.FAILURE, message: "Paste a badge code first" });
        return;
    }

    let parsed: any;
    try {
        parsed = decodeBadgeCode(code);
    } catch (e) {
        Toasts.show({ id: Toasts.genId(), type: Toasts.Type.FAILURE, message: "That badge code isn't valid base64/JSON" });
        return;
    }

    const validationError = validateBadgePayload(parsed);
    if (validationError) {
        Toasts.show({ id: Toasts.genId(), type: Toasts.Type.FAILURE, message: validationError });
        return;
    }

    applyBadgeState({ imageUrl: parsed.imageUrl, name: parsed.name, style: parsed.style, prefs: parsed.prefs });
    settings.store.importBadgeCode = "";
    Toasts.show({ id: Toasts.genId(), type: Toasts.Type.SUCCESS, message: "Badge imported and published" });
}

export function applySelectedPreset() {
    const preset = BUILTIN_PRESETS[Number(settings.store.selectedPreset)];
    if (!preset) {
        Toasts.show({ id: Toasts.genId(), type: Toasts.Type.FAILURE, message: "Pick a preset first" });
        return;
    }

    applyBadgeState({ imageUrl: preset.imageUrl, name: preset.name, style: preset.style, prefs: preset.prefs });
    Toasts.show({ id: Toasts.genId(), type: Toasts.Type.SUCCESS, message: `Applied "${preset.label}" preset and published` });
}

const BADGE_HISTORY_KEY = "customBadges_history";
const BADGE_HISTORY_LIMIT = 2;
const BADGE_HISTORY_DEBOUNCE_MS = 3000;

interface BadgeSnapshot {
    imageUrl: string;
    name: string;
    style: BadgeStyle;
    prefs: BadgePrefs;
}

let lastPublishedSnapshot: BadgeSnapshot | null = null;
let lastHistoryPushAt = 0;

function loadBadgeHistory(): BadgeSnapshot[] {
    try {
        const raw = localStorage.getItem(BADGE_HISTORY_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
        return [];
    }
}

function saveBadgeHistory(history: BadgeSnapshot[]) {
    try {
        localStorage.setItem(BADGE_HISTORY_KEY, JSON.stringify(history.slice(0, BADGE_HISTORY_LIMIT)));
    } catch (e) {
        console.error("[CustomBadges] Failed to save badge history:", e);
    }
}

function pushBadgeHistory(snapshot: BadgeSnapshot) {
    const now = Date.now();
    if (now - lastHistoryPushAt < BADGE_HISTORY_DEBOUNCE_MS) return;
    lastHistoryPushAt = now;

    const history = loadBadgeHistory();
    history.unshift(snapshot);
    saveBadgeHistory(history);
}

export function revertBadge() {
    const history = loadBadgeHistory();
    if (!history.length) {
        Toasts.show({ id: Toasts.genId(), type: Toasts.Type.FAILURE, message: "No previous badge saved to revert to yet" });
        return;
    }

    const previous = history.shift() as BadgeSnapshot;
    saveBadgeHistory(history);
    applyBadgeState(previous);
    Toasts.show({ id: Toasts.genId(), type: Toasts.Type.SUCCESS, message: "Reverted to your previous badge" });
}

function formatPluginUseDate(iso?: string | null): string {
    if (!iso) return "unknown date";
    const d = new Date(iso);
    if (isNaN(d.getTime())) return "unknown date";
    return d.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
}

function formatOwnerTag(ownerUsername: string, firstUsedDate?: string | null) {
    let tag = settings.store.ownerTagFormat.replace("{username}", ownerUsername);
    if (tag.includes("{pluginusedate}")) {
        tag = tag.replace("{pluginusedate}", formatPluginUseDate(firstUsedDate));
    }
    return tag;
}

function formatBadgeName(rawName: string, appendVencordTag: boolean) {
    return appendVencordTag ? `${rawName} [Vencord]` : rawName;
}

const sampledColorCache = new Map<string, string | null>();

function sampleImageColor(url: string): Promise<string | null> {
    if (sampledColorCache.has(url)) return Promise.resolve(sampledColorCache.get(url) as string | null);

    return new Promise(resolve => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
            try {
                const size = 32;
                const canvas = document.createElement("canvas");
                canvas.width = size;
                canvas.height = size;
                const ctx = canvas.getContext("2d");
                if (!ctx) return finish(null);

                ctx.drawImage(img, 0, 0, size, size);
                const data = ctx.getImageData(0, 0, size, size).data;

                let r = 0, g = 0, b = 0, count = 0;
                for (let i = 0; i < data.length; i += 4) {
                    if (data[i + 3] < 32) continue;
                    r += data[i];
                    g += data[i + 1];
                    b += data[i + 2];
                    count++;
                }

                if (!count) return finish(null);
                finish(`rgb(${Math.round(r / count)}, ${Math.round(g / count)}, ${Math.round(b / count)})`);
            } catch (e) {
                finish(null);
            }
        };
        img.onerror = () => finish(null);
        img.src = url;

        function finish(color: string | null) {
            sampledColorCache.set(url, color);
            resolve(color);
        }
    });
}

async function getPopupBackground(imageUrl: string, style: BadgeStyle): Promise<{ background: string; sampleFailed: boolean }> {
    if (style.popupBackgroundMode === "edit") {
        return {
            background: `radial-gradient(120% 100% at 50% 0%, ${style.popupGradientSecondary} 0%, ${style.popupGradientMain} 65%)`,
            sampleFailed: false
        };
    }

    if (style.popupBackgroundMode === "sample") {
        const sampled = await sampleImageColor(imageUrl);
        if (sampled) {
            return {
                background: `radial-gradient(120% 100% at 50% 0%, ${sampled} 0%, #1d1d1d 65%)`,
                sampleFailed: false
            };
        }
        return { background: "#1d1d1d", sampleFailed: true };
    }

    return { background: "#1d1d1d", sampleFailed: false };
}

export async function getDashboardPreviewData() {
    const { myBadgeImageUrl, myBadgeName } = settings.store;
    if (!myBadgeImageUrl || !myBadgeName) return null;

    const style = getMyBadgeStyle();
    const displayName = formatBadgeName(myBadgeName, style.appendVencordTag);
    const ownerUsername = UserStore.getCurrentUser()?.username || "you";
    const ownerTag = settings.store.showOwnerTag ? formatOwnerTag(ownerUsername, style.firstUsedDate) : null;
    const { background, sampleFailed } = await getPopupBackground(myBadgeImageUrl, style);

    return {
        imageUrl: myBadgeImageUrl,
        displayName,
        ownerTag,
        nameColor: style.nameColor,
        iconShape: style.iconShape,
        iconSize: style.iconSize,
        background,
        sampleFailed
    };
}

export function verifyDiscordAccount() {
    window.open(
        `${settings.store.apiBaseUrl || "https://custom-badges.shadow-164.workers.dev"}/auth/start`,
        "_blank", "noopener,noreferrer"
    );
}

export async function revokeSessionToken() {
    try {
        await VencordNative.pluginHelpers.CustomBadges.revokeOwnToken(settings.store.sessionToken, settings.store.apiBaseUrl);
        settings.store.sessionToken = "";
        Toasts.show({ id: Toasts.genId(), type: Toasts.Type.SUCCESS, message: "Token revoked - re-verify to publish badge changes again" });
    } catch (e) {
        showBadgeErrorToast(describeBadgeApiError(e));
    }
}

function SessionTokenInput() {
    const [value, setValue] = useState(settings.store.sessionToken || "");
    const [focused, setFocused] = useState(false);
    const [masked, setMasked] = useState(!!settings.store.sessionToken);

    function commit(v: string) {
        setValue(v);
        settings.store.sessionToken = v;
    }

    function handleFocus() {
        setFocused(true);
        setMasked(false);
    }

    function handleBlur() {
        setFocused(false);
        if (!value) return;
        // mount one frame with the letters still showing, then flip to
        // masked so the letter->dot transition actually animates instead
        // of snapping straight to dots.
        requestAnimationFrame(() => setMasked(true));
    }

    const charStyle = (revealedTransform: string, maskedTransform: string, isRevealedGlyph: boolean, delayMs: number): CSSProperties => ({
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "opacity 240ms ease, transform 240ms cubic-bezier(0.34, 1.56, 0.64, 1)",
        transitionDelay: `${delayMs}ms`,
        opacity: (isRevealedGlyph ? !masked : masked) ? 1 : 0,
        transform: masked ? maskedTransform : revealedTransform
    });

    return (
        <div className="vc-token-input-wrap" style={{ position: "relative" }}>
            <style>{`.vc-token-input-wrap input::selection { color: transparent; background: rgba(88, 101, 242, 0.4); }`}</style>
            <TextInput
                type="text"
                value={value}
                placeholder="Paste your session token here"
                onChange={commit}
                onFocus={handleFocus}
                onBlur={handleBlur}
                style={{
                    color: value ? "transparent" : undefined,
                    caretColor: "var(--text-normal, #dcddde)"
                }}
            />
            {value && (
                <div style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    padding: "0 12px",
                    pointerEvents: "none",
                    overflow: "hidden",
                    whiteSpace: "pre",
                    
                    
                    
                    fontFamily: "var(--font-code, Consolas, 'Courier New', monospace)",
                    fontSize: "14px",
                    lineHeight: 1,
                    letterSpacing: 0
                }}>
                    {value.split("").map((ch, i) => {
                        const delay = masked ? i * 16 : (value.length - 1 - i) * 16;
                        return (
                            <span key={i} style={{ position: "relative", display: "inline-block", width: "0.6em", height: "1em", flex: "0 0 auto" }}>
                                <span style={charStyle("translateY(0) scale(1) rotate(0deg)", "translateY(-8px) scale(0.3) rotate(-20deg)", true, delay)}>{ch}</span>
                                <span style={charStyle("translateY(8px) scale(0.3) rotate(20deg)", "translateY(0) scale(1) rotate(0deg)", false, delay)}>•</span>
                            </span>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

function RevokeTokenButton() {
    const [busy, setBusy] = useState(false);
    async function doRevoke() {
        setBusy(true);
        try {
            await revokeSessionToken();
        } finally {
            setBusy(false);
        }
    }
    return (
        <Button
            size={Button.Sizes.SMALL}
            color={Button.Colors.RED}
            disabled={busy || !settings.store.sessionToken}
            onClick={doRevoke}
        >
            {busy ? "Revoking..." : "Revoke Your Token"}
        </Button>
    );
}

function BadgePreview() {
    const [, forceRerender] = useReducer((x: number) => x + 1, 0);
    const [background, setBackground] = useState("#1d1d1d");
    const [sampleFailed, setSampleFailed] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => forceRerender(), 300);
        return () => clearInterval(interval);
    }, []);

    const { myBadgeImageUrl, myBadgeName } = settings.store;
    const style = getMyBadgeStyle();

    useEffect(() => {
        let cancelled = false;
        if (myBadgeImageUrl) {
            getPopupBackground(myBadgeImageUrl, style).then(result => {
                if (cancelled) return;
                setBackground(result.background);
                setSampleFailed(result.sampleFailed);
            });
        }
        return () => {
            cancelled = true;
        };
    }, [myBadgeImageUrl, style.popupBackgroundMode, style.popupGradientMain, style.popupGradientSecondary]);

    if (!myBadgeImageUrl || !myBadgeName) {
        return (
            <div style={{ fontSize: 12, opacity: 0.6, padding: "6px 0" }}>
                Set your badge image and name above to see a live preview
            </div>
        );
    }

    const radius = style.iconShape === "circle" ? "50%" : style.iconShape === "rounded" ? "6px" : "0";
    const displayName = formatBadgeName(myBadgeName, style.appendVencordTag);
    const ownerUsername = UserStore.getCurrentUser()?.username || "you";

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 14, padding: "6px 0" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <img
                    src={myBadgeImageUrl}
                    alt={displayName}
                    style={{ width: style.iconSize, height: style.iconSize, objectFit: "contain", borderRadius: radius }}
                />
                <span style={{ fontSize: 12, color: "#b5bac1" }}>Badge row icon</span>
            </div>
            <div
                style={{
                    background,
                    borderRadius: 8,
                    padding: "18px 24px",
                    textAlign: "center",
                    minWidth: 160,
                    width: "fit-content"
                }}
            >
                <img
                    src={myBadgeImageUrl}
                    alt={displayName}
                    style={{
                        width: 56,
                        height: 56,
                        borderRadius: "50%",
                        objectFit: "cover",
                        marginBottom: 10,
                        display: "block",
                        marginLeft: "auto",
                        marginRight: "auto"
                    }}
                />
                <div style={{ fontWeight: 800, fontSize: 15, letterSpacing: 0.3, color: style.nameColor }}>
                    {displayName}
                </div>
                {settings.store.showOwnerTag && (
                    <div style={{ fontSize: 11, color: "#949ba4", marginTop: 4 }}>
                        {formatOwnerTag(ownerUsername, style.firstUsedDate)}
                    </div>
                )}
            </div>
            {sampleFailed && (
                <div style={{ fontSize: 11, color: "#f0b132" }}>
                    Couldn't sample colors from this image, showing the flat fallback background instead. This can happen if the host blocks cross-origin image reads. What others see may look different from this preview.
                </div>
            )}
        </div>
    );
}

function CustomBadgesTabIcon() {
    return (
        <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Zm8.94 2.6-1.64-.28a7.4 7.4 0 0 0-.4-.97l.97-1.35a1 1 0 0 0-.1-1.28l-1.09-1.09a1 1 0 0 0-1.28-.1l-1.35.97a7.4 7.4 0 0 0-.97-.4l-.28-1.64A1 1 0 0 0 13.8 4h-1.6a1 1 0 0 0-.99.84l-.28 1.64c-.34.11-.66.24-.97.4l-1.35-.97a1 1 0 0 0-1.28.1L6.24 7.1a1 1 0 0 0-.1 1.28l.97 1.35c-.16.31-.29.63-.4.97l-1.64.28a1 1 0 0 0-.84.99v1.6c0 .49.35.9.84.99l1.64.28c.11.34.24.66.4.97l-.97 1.35a1 1 0 0 0 .1 1.28l1.09 1.09a1 1 0 0 0 1.28.1l1.35-.97c.31.16.63.29.97.4l.28 1.64c.09.49.5.84.99.84h1.6c.49 0 .9-.35.99-.84l.28-1.64c.34-.11.66-.24.97-.4l1.35.97a1 1 0 0 0 1.28-.1l1.09-1.09a1 1 0 0 0 .1-1.28l-.97-1.35c.16-.31.29-.63.4-.97l1.64-.28c.49-.09.84-.5.84-.99v-1.6a1 1 0 0 0-.84-.99Z" />
        </svg>
    );
}

function humanizeKey(key: string) {
    return key
        .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
        .replace(/^./, s => s.toUpperCase())
        .trim();
}

function renderSettingControl(key: string, forceUpdate: () => void) {
    const def = (settings.def as any)[key];
    if (!def) return null;

    const isDisabled = !!def.disabled?.();

    switch (def.type) {
        case OptionType.STRING: {
            return (
                <TextInput
                    value={(settings.store as any)[key] ?? ""}
                    placeholder={typeof def.default === "string" ? def.default : ""}
                    disabled={isDisabled}
                    onChange={(v: string) => {
                        if (isDisabled) return;
                        (settings.store as any)[key] = v;
                        forceUpdate();
                    }}
                />
            );
        }
        case OptionType.NUMBER: {
            return (
                <TextInput
                    value={String((settings.store as any)[key] ?? "")}
                    placeholder={String(def.default ?? "")}
                    disabled={isDisabled}
                    onChange={(v: string) => {
                        if (isDisabled) return;
                        const n = Number(v);
                        (settings.store as any)[key] = Number.isNaN(n) ? def.default : n;
                        forceUpdate();
                    }}
                />
            );
        }
        case OptionType.SELECT: {
            const current = (settings.store as any)[key];
            return (
                <Select
                    options={def.options}
                    isSelected={(v: string) => v === current}
                    serialize={(v: string) => v}
                    disabled={isDisabled}
                    select={(v: string) => {
                        if (isDisabled) return;
                        (settings.store as any)[key] = v;
                        forceUpdate();
                    }}
                />
            );
        }
        case OptionType.COMPONENT: {
            const Comp = def.component;
            return <Comp />;
        }
        default:
            return null;
    }
}

function SettingField({ settingKey, titleOverride, forceUpdate }: { settingKey: string; titleOverride?: string; forceUpdate: () => void; }) {
    const def = (settings.def as any)[settingKey];
    if (!def) return null;

    const isDisabled = !!def.disabled?.();

    if (def.type === OptionType.COMPONENT) {
        return <div style={{ marginBottom: 16 }}>{renderSettingControl(settingKey, forceUpdate)}</div>;
    }

    return (
        <div style={{ marginBottom: 16, opacity: isDisabled ? 0.5 : 1 }}>
            <Forms.FormTitle tag="h5" style={{ marginBottom: 4 }}>{titleOverride ?? humanizeKey(settingKey)}</Forms.FormTitle>
            {def.description && (
                <Forms.FormText type="description" style={{ marginBottom: 8 }}>{def.description}</Forms.FormText>
            )}
            {renderSettingControl(settingKey, forceUpdate)}
        </div>
    );
}

function SwitchField({ settingKey, titleOverride, forceUpdate }: { settingKey: string; titleOverride?: string; forceUpdate: () => void; }) {
    const def = (settings.def as any)[settingKey];
    if (!def) return null;

    const isDisabled = !!def.disabled?.();

    return (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, gap: 16, opacity: isDisabled ? 0.5 : 1 }}>
            <div>
                <Forms.FormTitle tag="h5" style={{ marginBottom: 4 }}>{titleOverride ?? humanizeKey(settingKey)}</Forms.FormTitle>
                {def.description && <Forms.FormText type="description">{def.description}</Forms.FormText>}
            </div>
            <Switch
                value={!!(settings.store as any)[settingKey]}
                disabled={isDisabled}
                onChange={(v: boolean) => {
                    if (isDisabled) return;
                    (settings.store as any)[settingKey] = v;
                    forceUpdate();
                }}
            />
        </div>
    );
}

function CustomBadgesTab() {
    const hasBadge = !!(settings.store.myBadgeImageUrl && settings.store.myBadgeName);
    const [, bump] = useReducer(x => x + 1, 0);
    const forceUpdate = () => bump();

    const vencordModeActive = settings.store.badgeMode === "vencord";

    return (
        <Forms.FormSection>
            <Forms.FormTitle tag="h2">Custom Badges</Forms.FormTitle>
            <Forms.FormText style={{ marginBottom: 16 }}>
                Adds a custom badge with hover tooltip and click-to-view popup card, visible to anyone else running this plugin.
            </Forms.FormText>

            {}
            <Forms.FormTitle tag="h3">Badge Injection Mode</Forms.FormTitle>
            <SettingField settingKey="badgeMode" titleOverride="Badge Mode" forceUpdate={forceUpdate} />

            {vencordModeActive && (
                <div style={{
                    background: "rgba(240, 177, 50, 0.12)",
                    border: "1px solid #f0b132",
                    borderRadius: 6,
                    padding: "10px 14px",
                    marginBottom: 16
                }}>
                    <Forms.FormText style={{ color: "#f0b132", fontWeight: 700, marginBottom: 4 }}>
                        ◆ Vencord Classic [Limited] is active
                    </Forms.FormText>
                    <Forms.FormText type="description" style={{ color: "#f0b132" }}>
                        This mode renders the badge through Vencord's native BadgeAPI instead of direct DOM
                        injection. Its popup card can't position itself above the badge, can't dismiss when you
                        click outside it, and can't follow the page while you scroll. Because of that, every
                        click-to-view popup setting below is locked off while this mode is active - only the
                        hover tooltip will show. Switch back to Original for full popup behavior.
                    </Forms.FormText>
                </div>
            )}

            <Forms.FormDivider style={{ margin: "20px 0" }} />

            {}
            <Forms.FormTitle tag="h3">Account Verification</Forms.FormTitle>
            <Forms.FormText type="description" style={{ marginBottom: 12 }}>
                Prove you own this Discord account so the server accepts badge changes as coming from you.
                No passwords or long-lived Discord tokens are ever stored - just a short-lived, revocable proof.
            </Forms.FormText>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16, alignItems: "center" }}>
                <Button onClick={verifyDiscordAccount}>
                    Verify Discord Account
                </Button>
                <RevokeTokenButton />
            </div>
            <Forms.FormTitle tag="h5" style={{ marginBottom: 4 }}>Session Token</Forms.FormTitle>
            <Forms.FormText type="description" style={{ marginBottom: 6 }}>
                Paste the token shown after verifying your account here.
            </Forms.FormText>
            <div style={{ marginBottom: 16 }}>
                <SessionTokenInput />
            </div>

            <Forms.FormDivider style={{ margin: "20px 0" }} />

            {}
            <Forms.FormTitle tag="h3">Edit Active Badge</Forms.FormTitle>
            <SettingField settingKey="apiBaseUrl" titleOverride="Api Base Url" forceUpdate={forceUpdate} />
            <SettingField settingKey="myBadgeImageUrl" titleOverride="My Badge Image Url" forceUpdate={forceUpdate} />
            <SettingField settingKey="myBadgeName" titleOverride="My Badge Name" forceUpdate={forceUpdate} />

            <Forms.FormDivider style={{ margin: "20px 0" }} />

            {}
            <Forms.FormTitle tag="h3">Live Preview</Forms.FormTitle>
            <BadgePreview />

            <Forms.FormDivider style={{ margin: "20px 0" }} />

            {}
            <Forms.FormTitle tag="h3">Quick Actions</Forms.FormTitle>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
                <Button onClick={shareMyBadge} disabled={!hasBadge}>Share Badge</Button>
                <Button onClick={revertBadge} color={Button.Colors.PRIMARY}>Revert To Previous Badge</Button>
                <Button onClick={refreshBadgeCache} color={Button.Colors.PRIMARY}>Refresh Badge Cache</Button>
            </div>

            <SettingField settingKey="importBadgeCode" titleOverride="Import Badge Code" forceUpdate={forceUpdate} />
            <Button onClick={() => { importBadgeFromCode(); forceUpdate(); }} style={{ marginBottom: 16 }}>Import Badge</Button>

            <SettingField settingKey="selectedPreset" titleOverride="Selected Preset" forceUpdate={forceUpdate} />
            <Button onClick={() => { applySelectedPreset(); forceUpdate(); }} style={{ marginBottom: 16 }}>Apply Preset</Button>

            <Forms.FormDivider style={{ margin: "20px 0" }} />

            {}
            <Forms.FormTitle tag="h3">My Badges</Forms.FormTitle>
            <Forms.FormText type="description" style={{ marginBottom: 12 }}>
                Your saved badge slots. Click "Use" on any badge to make it active and publish it. Add a new slot to build another look - you can have up to {MAX_BADGES}.
            </Forms.FormText>
            <MyBadgesList />
            <Button
                onClick={() => { createNewBadgeSlot(); forceUpdate(); }}
                style={{ marginTop: 10, marginBottom: 4 }}
            >
                + New Badge Slot
            </Button>

            <Forms.FormDivider style={{ margin: "20px 0" }} />

            {}
            <Forms.FormTitle tag="h3">Badge Packs</Forms.FormTitle>
            <Forms.FormText type="description" style={{ marginBottom: 12 }}>
                Import a pack of badges from a raw GitHub URL, or export your current badges as a pack to share with others.
            </Forms.FormText>
            <SettingField settingKey="importPackUrl" titleOverride="Import Pack from URL" forceUpdate={forceUpdate} />
            <BadgePacksButtonsRow forceUpdate={forceUpdate} />

            <Forms.FormDivider style={{ margin: "20px 0" }} />

            {}
            <Forms.FormTitle tag="h3">Behavior</Forms.FormTitle>
            <SwitchField settingKey="showTooltip" titleOverride="Show Tooltip" forceUpdate={forceUpdate} />
            <SwitchField settingKey="showPopup" titleOverride="Show Popup" forceUpdate={forceUpdate} />
            <SwitchField settingKey="showOwnerTag" titleOverride="Show Owner Tag" forceUpdate={forceUpdate} />
            <SettingField settingKey="ownerTagFormat" titleOverride="Owner Tag Format" forceUpdate={forceUpdate} />
            <SwitchField settingKey="appendVencordTag" titleOverride="Append Vencord Tag" forceUpdate={forceUpdate} />
            <SwitchField settingKey="hideOwnBadge" titleOverride="Hide Own Badge" forceUpdate={forceUpdate} />
            <SwitchField settingKey="restrictToMutualGuilds" titleOverride="Restrict to Mutual Servers" forceUpdate={forceUpdate} />

            <Forms.FormDivider style={{ margin: "20px 0" }} />

            {}
            <Forms.FormTitle tag="h3">
                Popup &amp; Badge Style{vencordModeActive ? " (popup fields locked)" : ""}
            </Forms.FormTitle>
            <SettingField settingKey="popupBackgroundMode" titleOverride="Popup Background Mode" forceUpdate={forceUpdate} />
            <SettingField settingKey="popupGradientMain" titleOverride="Popup Gradient Main" forceUpdate={forceUpdate} />
            <SettingField settingKey="popupGradientSecondary" titleOverride="Popup Gradient Secondary" forceUpdate={forceUpdate} />
            <SettingField settingKey="popupAnimationStyle" titleOverride="Popup Animation Style" forceUpdate={forceUpdate} />
            <SettingField settingKey="badgeNameColor" titleOverride="Badge Name Color" forceUpdate={forceUpdate} />
            <SettingField settingKey="badgeIconSize" titleOverride="Badge Icon Size" forceUpdate={forceUpdate} />
            <SettingField settingKey="badgeIconShape" titleOverride="Badge Icon Shape" forceUpdate={forceUpdate} />
            <SettingField settingKey="badgeHoverEffect" titleOverride="Badge Hover Effect" forceUpdate={forceUpdate} />
            <SettingField settingKey="badgeGlowColor" titleOverride="Badge Glow Color" forceUpdate={forceUpdate} />

            <Forms.FormDivider style={{ margin: "20px 0" }} />

            <SettingField settingKey="refreshCache" forceUpdate={forceUpdate} />
        </Forms.FormSection>
    );
}

export function updateMyBadgeFromSettings() {
    const { myBadgeImageUrl, myBadgeName } = settings.store;
    if (!myBadgeImageUrl || !myBadgeName) return;

    if (isBlockedBadgeName(myBadgeName)) {
        showBadgeErrorToast(BLOCKED_BADGE_NAME_MESSAGE);
        return;
    }

    if (lastPublishedSnapshot) pushBadgeHistory(lastPublishedSnapshot);
    lastPublishedSnapshot = { imageUrl: myBadgeImageUrl, name: myBadgeName, style: getMyBadgeStyle(), prefs: getMyBadgePrefs() };

    let id = getActiveBadgeId();
    if (!id) {
        id = genBadgeId();
        settings.store.myActiveBadgeId = id;
    }

    const list = getMyBadges();
    const entry: BadgeEntry = { id, imageUrl: myBadgeImageUrl, description: myBadgeName, style: getMyBadgeStyle() };
    const idx = list.findIndex(b => b.id === id);
    if (idx === -1) list.push(entry); else list[idx] = entry;
    setMyBadgesLocal(list);

    setMyBadge(id, myBadgeImageUrl, myBadgeName);
}

const cache = new Map<string, { imageUrl: string; description: string; style?: Partial<BadgeStyle> } | null>();

export function refreshBadgeCache() {
    cache.clear();
    sampledColorCache.clear();
    console.log("[CustomBadges] Cache cleared");
}

function maybeWarnAboutExpiry(expiresAt?: string | null) {
    if (!expiresAt || expiryWarningShownThisSession) return;
    const expiry = new Date(expiresAt);
    if (isNaN(expiry.getTime())) return;

    const daysLeft = (expiry.getTime() - Date.now()) / (1000 * 60 * 60 * 24);
    if (daysLeft > 0 && daysLeft <= BADGE_EXPIRY_WARNING_DAYS) {
        expiryWarningShownThisSession = true;
        Toasts.show({
            id: Toasts.genId(),
            type: Toasts.Type.MESSAGE,
            message: `Your custom badge expires in ${Math.max(1, Math.round(daysLeft))} day(s). Edit or switch a badge to keep it alive.`
        });
    }
}

async function fetchBadge(userId: string) {
    if (cache.has(userId)) return cache.get(userId);

    const isMe = userId === UserStore.getCurrentUser()?.id;

    try {

        const data = await VencordNative.pluginHelpers.CustomBadges.fetchBadge(userId, settings.store.apiBaseUrl);

        if (data?.firstRequestAt && isMe) {
            const serverDate = new Date(data.firstRequestAt);
            if (!isNaN(serverDate.getTime())) {
                const localDate = settings.store.firstUsedDate ? new Date(settings.store.firstUsedDate) : null;
                if (!localDate || isNaN(localDate.getTime()) || serverDate < localDate) {
                    settings.store.firstUsedDate = data.firstRequestAt;

                    updateMyBadgeFromSettings();
                }
            }
        }

        if (isMe) {

            if (Array.isArray(data?.badges)) {
                setMyBadgesLocal(data.badges);
                if (data.activeId) settings.store.myActiveBadgeId = data.activeId;
            }
            maybeWarnAboutExpiry(data?.expiresAt);
        }

        const { firstRequestAt: _ignored, badges: _ignored2, activeId: _ignored3, expiresAt: _ignored4, ...badge } = data ?? {};
        const cached = data?.imageUrl ? badge : null;
        cache.set(userId, cached);
        return cached;
    } catch (e) {
        console.error("[CustomBadges] fetch failed:", e);

        if (isMe) showBadgeErrorToast(describeBadgeApiError(e));
        return null;
    }
}

async function syncMyBadgesFromServer() {
    const me = UserStore.getCurrentUser();
    if (!me) return;
    cache.delete(me.id);
    await fetchBadge(me.id);

    const active = findBadgeEntry(getActiveBadgeId());
    if (active && !settings.store.myBadgeImageUrl) {
        suppressPublishOnChange = true;
        try {
            settings.store.myBadgeImageUrl = active.imageUrl;
            settings.store.myBadgeName = active.description;
        } finally {
            suppressPublishOnChange = false;
        }
    }
}

export async function setMyBadge(badgeId: string, imageUrl: string, description: string) {
    const me = UserStore.getCurrentUser();
    if (!me) return console.error("[CustomBadges] Not logged in?");

    try {
        const res = await VencordNative.pluginHelpers.CustomBadges.setBadge(me.id, badgeId, imageUrl, description, getMyBadgeStyle(), settings.store.sessionToken, settings.store.apiBaseUrl);
        cache.delete(me.id);
        console.log("[CustomBadges] Badge set:", res);
    } catch (e) {
        console.error("[CustomBadges] Failed to set badge:", e);
        showBadgeErrorToast(describeBadgeApiError(e));
    }
}

function loadBadgeFieldsIntoSettings(entry: BadgeEntry) {
    suppressPublishOnChange = true;
    try {
        settings.store.myBadgeImageUrl = entry.imageUrl;
        settings.store.myBadgeName = entry.description;
        const style = resolveBadgeStyle(entry.style);
        settings.store.badgeIconShape = style.iconShape;
        settings.store.badgeIconSize = style.iconSize;
        settings.store.badgeHoverEffect = style.hoverEffect;
        settings.store.badgeGlowColor = style.glowColor;
        settings.store.popupAnimationStyle = style.popupAnimation;
        settings.store.popupBackgroundMode = style.popupBackgroundMode;
        settings.store.popupGradientMain = style.popupGradientMain;
        settings.store.popupGradientSecondary = style.popupGradientSecondary;
        settings.store.badgeNameColor = style.nameColor;
        settings.store.appendVencordTag = style.appendVencordTag;
    } finally {
        suppressPublishOnChange = false;
    }
}

export async function switchToBadge(id: string) {
    const entry = findBadgeEntry(id);
    if (!entry) return;

    settings.store.myActiveBadgeId = id;
    loadBadgeFieldsIntoSettings(entry);

    const me = UserStore.getCurrentUser();
    if (!me) return;
    try {
        await VencordNative.pluginHelpers.CustomBadges.setActiveBadge(me.id, id, settings.store.sessionToken, settings.store.apiBaseUrl);
        cache.delete(me.id);
        Toasts.show({ id: Toasts.genId(), type: Toasts.Type.SUCCESS, message: "Switched active badge" });
    } catch (e) {
        console.error("[CustomBadges] Failed to switch active badge:", e);
        showBadgeErrorToast(describeBadgeApiError(e));
    }
}

export function createNewBadgeSlot() {
    const list = getMyBadges();
    if (list.length >= MAX_BADGES) {
        Toasts.show({ id: Toasts.genId(), type: Toasts.Type.FAILURE, message: `You can only have up to ${MAX_BADGES} badges` });
        return;
    }

    if (isBlockedBadgeName(settings.store.myBadgeName)) {
        showBadgeErrorToast(BLOCKED_BADGE_NAME_MESSAGE);
        return;
    }

    const id = genBadgeId();

    const entry: BadgeEntry = {
        id,
        imageUrl: settings.store.myBadgeImageUrl || "",
        description: settings.store.myBadgeName || "New Badge",
        style: getMyBadgeStyle()
    };
    list.push(entry);
    setMyBadgesLocal(list);
    settings.store.myActiveBadgeId = id;
    loadBadgeFieldsIntoSettings(entry);

    if (entry.imageUrl) updateMyBadgeFromSettings();
    Toasts.show({ id: Toasts.genId(), type: Toasts.Type.SUCCESS, message: "New badge slot added - edit the fields above to customize it" });
}

export async function deleteBadgeSlot(id: string) {
    const list = getMyBadges();
    const remaining = list.filter(b => b.id !== id);
    setMyBadgesLocal(remaining);

    const me = UserStore.getCurrentUser();
    if (me) {
        try {
            await VencordNative.pluginHelpers.CustomBadges.deleteBadge(me.id, id, settings.store.sessionToken, settings.store.apiBaseUrl);
            cache.delete(me.id);
        } catch (e) {
            console.error("[CustomBadges] Failed to delete badge:", e);
            showBadgeErrorToast(describeBadgeApiError(e));
        }
    }

    if (getActiveBadgeId() === id) {
        const next = remaining[0];
        if (next) {
            switchToBadge(next.id);
        } else {
            settings.store.myActiveBadgeId = "";
            suppressPublishOnChange = true;
            try {
                settings.store.myBadgeImageUrl = "";
                settings.store.myBadgeName = "";
            } finally {
                suppressPublishOnChange = false;
            }
        }
    }
}

function MyBadgesList() {
    const [, bump] = useReducer(x => x + 1, 0);
    const badges = getMyBadges();
    const activeId = getActiveBadgeId();

    if (!badges.length) {
        return <Forms.FormText type="description">No badges yet - set an image/name above or add a new slot.</Forms.FormText>;
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {badges.map(b => (
                <div
                    key={b.id}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "6px 10px",
                        borderRadius: 6,
                        border: b.id === activeId ? "1px solid #5865F2" : "1px solid transparent",
                        background: b.id === activeId ? "rgba(88,101,242,0.12)" : "rgba(255,255,255,0.04)"
                    }}
                >
                    <img
                        src={b.imageUrl}
                        alt={b.description}
                        referrerPolicy="no-referrer"
                        style={{ width: 24, height: 24, objectFit: "contain", borderRadius: 4, flexShrink: 0 }}
                    />
                    <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {b.description}{b.id === activeId ? " (active)" : ""}
                    </span>
                    {b.id !== activeId && (
                        <Button size={Button.Sizes.SMALL} onClick={() => { switchToBadge(b.id).then(() => bump()); }}>Use</Button>
                    )}
                    <Button
                        size={Button.Sizes.SMALL}
                        color={Button.Colors.RED}
                        onClick={() => { deleteBadgeSlot(b.id).then(() => bump()); }}
                    >
                        Delete
                    </Button>
                </div>
            ))}
        </div>
    );
}

const JSON_TOKEN_COLORS = {
    key: "#9cdcfe",
    string: "#ce9178",
    number: "#b5cea8",
    literal: "#569cd6",
    punct: "#808080"
};
function renderJsonHighlighted(json: string): ReactNode[] {
    const tokenRegex = /("(?:\\.|[^"\\])*"(\s*:)?)|(\btrue\b|\bfalse\b|\bnull\b)|(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)|([{}[\],:])/g;
    const nodes: ReactNode[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;
    let key = 0;
    while ((match = tokenRegex.exec(json)) !== null) {
        if (match.index > lastIndex) {
            nodes.push(json.slice(lastIndex, match.index));
        }
        const token = match[0];
        let color = JSON_TOKEN_COLORS.punct;
        if (match[1] !== undefined) {
            color = match[2] ? JSON_TOKEN_COLORS.key : JSON_TOKEN_COLORS.string;
        }
        else if (match[3] !== undefined) {
            color = JSON_TOKEN_COLORS.literal;
        }
        else if (match[4] !== undefined) {
            color = JSON_TOKEN_COLORS.number;
        }
        nodes.push(<span key={key++} style={{ color }}>{token}</span>);
        lastIndex = tokenRegex.lastIndex;
    }
    if (lastIndex < json.length)
        nodes.push(json.slice(lastIndex));
    return nodes;
}
let packGuidelinesShownThisSession = false;
type PanelPhase = "entering" | "open" | "closing";
function PackGuidelinesModal({ onClose }: {
    onClose: () => void;
}) {
    const [phase, setPhase] = useState<PanelPhase>("entering");
    useEffect(() => {
        const raf = requestAnimationFrame(() => setPhase("open"));
        return () => cancelAnimationFrame(raf);
    }, []);
    const CLOSE_ANIM_MS = 340;
    function handleClose() {
        if (phase === "closing")
            return;
        setPhase("closing");
        setTimeout(onClose, CLOSE_ANIM_MS);
    }
    const panelCss = `
        .vc-badgepack-panel {
            position: fixed;
            top: 50%;
            left: 24px;
            transform: translate(-120%, -50%);
            width: 440px;
            max-width: 88vw;
            max-height: 82vh;
            z-index: 9999;
            background: var(--background-floating, #18191c);
            border-radius: 12px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.55);
            display: flex;
            flex-direction: column;
            padding: 26px 30px 30px;
            color: var(--text-normal, #dcddde);
            font-size: 14px;
            line-height: 1.6;
            overflow-y: auto;
            opacity: 0;
            transform-origin: center center;
            pointer-events: auto;
        }
        .vc-badgepack-panel.vc-panel-open {
            transform: translate(0, -50%);
            opacity: 1;
            transition: transform 380ms cubic-bezier(0.16, 1, 0.3, 1), opacity 320ms ease-out;
        }
        .vc-badgepack-panel.vc-panel-closing {
            animation: vc-crt-off 340ms cubic-bezier(0.86, 0, 0.07, 1) forwards;
        }
        .vc-badgepack-panel.vc-panel-closing::after {
            content: "";
            position: absolute;
            inset: 0;
            background: #fff;
            opacity: 0;
            pointer-events: none;
            animation: vc-crt-flash 340ms ease-in forwards;
        }
        @keyframes vc-crt-off {
            0% { transform: translate(0, -50%) scaleY(1) scaleX(1); filter: brightness(1); }
            45% { transform: translate(0, -50%) scaleY(0.015) scaleX(1); filter: brightness(2.2); }
            70% { transform: translate(0, -50%) scaleY(0.015) scaleX(0.02); filter: brightness(2.6); }
            100% { transform: translate(0, -50%) scaleY(0.015) scaleX(0.0001); filter: brightness(3); opacity: 0; }
        }
        @keyframes vc-crt-flash {
            0% { opacity: 0; }
            35% { opacity: 0.55; }
            55% { opacity: 0.15; }
            100% { opacity: 0; }
        }
        .vc-badgepack-guidelines-scroll {
            scrollbar-width: thin;
            scrollbar-color: #4a4a50 #1a1a1d;
        }
        .vc-badgepack-guidelines-scroll::-webkit-scrollbar {
            width: 10px;
        }
        .vc-badgepack-guidelines-scroll::-webkit-scrollbar-track {
            background: #1a1a1d;
            border-radius: 8px;
        }
        .vc-badgepack-guidelines-scroll::-webkit-scrollbar-thumb {
            background: #4a4a50;
            border-radius: 8px;
            border: 2px solid #1a1a1d;
        }
        .vc-badgepack-guidelines-scroll::-webkit-scrollbar-thumb:hover {
            background: #5c5c63;
        }
        /* Hard overrides so nothing (inherited flex/height rules, Discord's own
           element styles, etc.) can squash this down to the single collapsed
           line with a scrollbar seen previously. */
        .vc-badgepack-codeblock {
            display: block !important;
            position: static !important;
            height: auto !important;
            min-height: 0 !important;
            max-height: none !important;
            overflow: visible !important;
            overflow-x: auto !important;
            overflow-y: visible !important;
            white-space: pre !important;
            flex: none !important;
            resize: none !important;
        }
    `;
    const panelClassName = [
        "vc-badgepack-panel",
        "vc-badgepack-guidelines-scroll",
        (phase === "open" || phase === "closing") ? "vc-panel-open" : "",
        phase === "closing" ? "vc-panel-closing" : ""
    ].filter(Boolean).join(" ");
    const h2Style: CSSProperties = { fontSize: 18, fontWeight: 700, marginBottom: 16, color: "var(--header-primary, #fff)" };
    const h3Style: CSSProperties = { fontSize: 15, fontWeight: 700, margin: "18px 0 6px", color: "var(--header-primary, #fff)" };
    const codeBlockStyle: CSSProperties = {
        background: "var(--background-secondary, #2f3136)",
        borderRadius: 6, padding: "14px 16px",
        fontFamily: "monospace", fontSize: 15,
        lineHeight: 1.65,
        whiteSpace: "pre", overflowX: "auto",
        margin: "8px 0"
    };
    const inlineCodeStyle: CSSProperties = {
        background: "var(--background-secondary, #2f3136)",
        borderRadius: 4, padding: "1px 5px",
        fontFamily: "monospace", fontSize: 13
    };
    const noteStyle: CSSProperties = {
        background: "var(--background-secondary-alt, #292b2f)",
        borderRadius: 6, padding: "8px 12px",
        margin: "8px 0", borderLeft: "3px solid var(--text-muted, #72767d)"
    };
    const warnStyle: CSSProperties = { ...noteStyle, borderLeftColor: "#f0a500" };
    const closeStyle: CSSProperties = {
        position: "absolute", top: 14, right: 18,
        background: "none", border: "none",
        color: "var(--text-muted, #72767d)", fontSize: 20,
        cursor: "pointer", lineHeight: 1,
        zIndex: 1
    };
    return (<>
            <style>{panelCss}</style>
            <div className={panelClassName}>
                <button style={closeStyle} onClick={handleClose}>✕</button>
                <div style={h2Style}>📦 Badge Pack Sharing Guidelines</div>
                <div>Before sharing a pack, make sure it meets these standards so everyone has a smooth experience importing it.</div>

                <div style={h3Style}>Format</div>
                <div>Your pack must be a valid JSON file hosted on <code style={inlineCodeStyle}>raw.githubusercontent.com</code> - no other hosts are accepted by the importer. The structure should look like this:</div>
                <div className="vc-badgepack-codeblock" style={codeBlockStyle}>{renderJsonHighlighted(`{
  "version": 1,
  "badges": [
    "base64encodedcode",
    "base64encodedcode"
  ]
}`)}</div>
                <div>Each entry in the <code style={inlineCodeStyle}>badges</code> array is a badge code generated by the <strong>Make Pack</strong> button in your dashboard.</div>

                <div style={h3Style}>Pack Size</div>
                <div style={noteStyle}>ⓘ The importer only loads the <strong>first 6 badges</strong> from any pack. The <strong>Make Pack</strong> button exports up to <strong>12 badges</strong> (your current plugin save limit). Technically packs can be as large as you want, but we recommend a minimum of <strong>6</strong> and a maximum of <strong>10–15</strong> for the best experience.</div>

                <div style={h3Style}>Content Rules</div>
                <div style={warnStyle}>⚠️ Packs that break these rules will be removed without warning.</div>
                <ul style={{ margin: "6px 0 0 16px", padding: 0 }}>
                    <li>Badges must use <strong>publicly accessible image URLs</strong> that won't die in a week (no Discord CDN links, no temp hosts)</li>
                    <li>No NSFW, offensive, or hateful imagery</li>
                    <li>No impersonation of other users, plugins, or brands</li>
                </ul>

                <div style={h3Style}>How to Submit</div>
                <ol style={{ margin: "6px 0 0 16px", padding: 0 }}>
                    <li>Generate your pack JSON using the <strong>Make Pack (Copy JSON)</strong> button</li>
                    <li>Push it to the packs repo as <code style={inlineCodeStyle}>packs/your-pack-name.json</code> in <a href="https://github.com/ItzMeShadow999/Badges" target="_blank" rel="noopener noreferrer" style={{ color: "var(--text-link, #00aff4)" }}>https://github.com/ItzMeShadow999/Badges</a></li>
                    <li>Open a PR with a short description of the theme</li>
                </ol>

                <div style={h3Style}>Tips for a Good Pack</div>
                <ul style={{ margin: "6px 0 0 16px", padding: 0 }}>
                    <li>Use a clear, descriptive filename (<code style={inlineCodeStyle}>anime-icons.json</code>, not <code style={inlineCodeStyle}>pack1.json</code>)</li>
                    <li>All badges in a pack should share a <strong>theme or aesthetic</strong> - random assortments are harder to browse</li>
                    <li>Test your pack with <strong>Import Pack from URL</strong> before submitting to make sure every badge imports cleanly</li>
                </ul>

                <div style={{ marginTop: 20, display: "flex", justifyContent: "flex-end" }}>
                    <Button onClick={handleClose}>Close</Button>
                </div>
            </div>
        </>);
}
function MakePackButton() {
    const [showGuidelines, setShowGuidelines] = useState(false);
    function handleClick() {
        makePack();
        if (!packGuidelinesShownThisSession) {
            packGuidelinesShownThisSession = true;
            setShowGuidelines(true);
        }
    }
    return (<>
            <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                <Button onClick={handleClick} color={Button.Colors.PRIMARY}>Make Pack (Copy JSON)</Button>
                <Button onClick={() => setShowGuidelines(true)} look={Button.Looks.LINK} size={Button.Sizes.SMALL}>
                    View Publish Guide
                </Button>
            </div>
            {showGuidelines && <PackGuidelinesModal onClose={() => setShowGuidelines(false)}/>}
        </>);
}
function BadgePacksButtonsRow({ forceUpdate }: {
    forceUpdate: () => void;
}) {
    const [showGuidelines, setShowGuidelines] = useState(false);
    function handleMakePackClick() {
        makePack();
        if (!packGuidelinesShownThisSession) {
            packGuidelinesShownThisSession = true;
            setShowGuidelines(true);
        }
    }
    return (<>
            <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", marginBottom: 16 }}>
                <Button onClick={() => { importPackFromUrl().then(() => forceUpdate()); }}>Import Pack</Button>
                <Button onClick={handleMakePackClick} color={Button.Colors.PRIMARY}>Make Pack (Copy JSON)</Button>
                <Button onClick={browsePacks} color={Button.Colors.PRIMARY}>Add More Packs</Button>
                <Button onClick={() => setShowGuidelines(true)} look={Button.Looks.LINK} size={Button.Sizes.SMALL}>
                    View Publish Guide
                </Button>
            </div>
            {showGuidelines && <PackGuidelinesModal onClose={() => setShowGuidelines(false)}/>}
        </>);
}

function packUrlLooksValid(url: string): boolean {
    try {
        const u = new URL(url);
        return u.hostname === "raw.githubusercontent.com";
    } catch {
        return false;
    }
}

export async function importPackFromUrl() {
    const url = settings.store.importPackUrl?.trim();
    if (!url) {
        Toasts.show({ id: Toasts.genId(), type: Toasts.Type.FAILURE, message: "Paste a pack URL first" });
        return;
    }
    if (!packUrlLooksValid(url)) {
        Toasts.show({
            id: Toasts.genId(), type: Toasts.Type.FAILURE,
            message: "Use a raw.githubusercontent.com link, not a github.com/blob/... page"
        });
        return;
    }

    let codes: string[];
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(res.statusText);
        const data = await res.json();
        codes = Array.isArray(data) ? data : Array.isArray(data?.badges) ? data.badges : [];
        if (!codes.length) throw new Error("empty pack");
    } catch (e) {
        Toasts.show({ id: Toasts.genId(), type: Toasts.Type.FAILURE, message: "Couldn't load that pack - check the URL" });
        return;
    }

    const list = getMyBadges();
    let imported = 0;
    for (const code of codes) {
        if (list.length + imported >= MAX_BADGES) break;
        try {
            const parsed = decodeBadgeCode(code);
            const err = validateBadgePayload(parsed);
            if (err) continue;
            list.push({ id: genBadgeId(), imageUrl: parsed.imageUrl, description: parsed.name, style: parsed.style });
            imported++;
        } catch {

        }
    }

    if (!imported) {
        Toasts.show({ id: Toasts.genId(), type: Toasts.Type.FAILURE, message: "No valid badges found in that pack" });
        return;
    }

    setMyBadgesLocal(list);

    for (const entry of list.slice(-imported)) {
        await setMyBadge(entry.id, entry.imageUrl, entry.description);
    }
    Toasts.show({ id: Toasts.genId(), type: Toasts.Type.SUCCESS, message: `Imported ${imported} badge(s) from pack` });
}

export function makePack() {
    const badges = getMyBadges();
    if (!badges.length) {
        Toasts.show({ id: Toasts.genId(), type: Toasts.Type.FAILURE, message: "You don't have any badges to pack yet" });
        return;
    }

    const codes = badges.map(b => btoa(unescape(encodeURIComponent(JSON.stringify({ imageUrl: b.imageUrl, name: b.description, style: b.style })))));
    const pack = { version: 1, badges: codes };

    navigator.clipboard.writeText(JSON.stringify(pack, null, 2))
        .then(() => {
            Toasts.show({
                id: Toasts.genId(), type: Toasts.Type.SUCCESS,
                message: `Pack JSON copied to clipboard. Push it to ${PACKS_REPO_URL} as packs/your-pack-name.json.`
            });
        })
        .catch(() => Toasts.show({ id: Toasts.genId(), type: Toasts.Type.FAILURE, message: "Couldn't copy to clipboard" }));
}

export function browsePacks() {
    window.open(PACKS_REPO_URL, "_blank", "noopener,noreferrer");
}

function hasMutualGuild(otherUserId: string): boolean {
    const me = UserStore.getCurrentUser();
    if (!me || otherUserId === me.id) return true;

    const guilds = GuildStore.getGuilds();
    for (const guildId of Object.keys(guilds)) {
        if (GuildMemberStore.isMember(guildId, me.id) && GuildMemberStore.isMember(guildId, otherUserId)) {
            return true;
        }
    }
    return false;
}

function shouldShowBadgeFor(userId: string): boolean {
    if (!settings.store.restrictToMutualGuilds) return true;
    return hasMutualGuild(userId);
}

interface BadgePopupCardProps {
    imageUrl: string;
    rawName: string;
    ownerUsername: string;
    style: BadgeStyle;
}

function BadgePopupCard({ imageUrl, rawName, ownerUsername, style }: BadgePopupCardProps) {
    const [background, setBackground] = useState(
        style.popupBackgroundMode === "edit"
            ? `radial-gradient(120% 100% at 50% 0%, ${style.popupGradientSecondary} 0%, ${style.popupGradientMain} 65%)`
            : "#1d1d1d"
    );

    useEffect(() => {
        let cancelled = false;
        getPopupBackground(imageUrl, style).then(result => {
            if (!cancelled) setBackground(result.background);
        });
        return () => { cancelled = true; };
    }, [imageUrl, style.popupBackgroundMode, style.popupGradientMain, style.popupGradientSecondary]);

    const displayName = formatBadgeName(rawName, style.appendVencordTag);
    const radius = style.iconShape === "circle" ? "50%" : style.iconShape === "rounded" ? "6px" : "0";

    return (
        <div style={{
            background,
            borderRadius: 8,
            padding: "20px 28px",
            textAlign: "center",
            minWidth: 180,
            fontFamily: "var(--font-primary, 'gg sans', sans-serif)"
        }}>
            <img
                src={imageUrl}
                alt={displayName}
                referrerPolicy="no-referrer"
                style={{
                    width: 64,
                    height: 64,
                    borderRadius: radius,
                    objectFit: "cover",
                    marginBottom: 14,
                    display: "block",
                    marginLeft: "auto",
                    marginRight: "auto"
                }}
            />
            <div style={{ fontWeight: 800, fontSize: 16, letterSpacing: 0.3, color: style.nameColor, lineHeight: 1.2 }}>
                {displayName}
            </div>
            {settings.store.showOwnerTag && (
                <div style={{ fontSize: 12, color: "#949ba4", marginTop: 4 }}>
                    {formatOwnerTag(ownerUsername, style.firstUsedDate)}
                </div>
            )}
        </div>
    );
}

function CustomBadgeComponent({ userId }: BadgeUserArgs) {
    const [badgeData, setBadgeData] = useState<{ imageUrl: string; description: string; style?: Partial<BadgeStyle> } | null | undefined>(undefined);
    const [showingPopup, setShowingPopup] = useState(false);

    useEffect(() => {
        fetchBadge(userId).then(data => setBadgeData(data ?? null));
    }, [userId]);

    if (!badgeData) return null;
    if (settings.store.hideOwnBadge && userId === UserStore.getCurrentUser()?.id) return null;
    if (!shouldShowBadgeFor(userId)) return null;

    const ownerUsername = UserStore.getUser(userId)?.username || "unknown";
    const ownerFirstUsedDate = userId === UserStore.getCurrentUser()?.id ? settings.store.firstUsedDate : null;
    const style = resolveBadgeStyle(badgeData.style, ownerFirstUsedDate);
    const rawName = badgeData.description.trim();
    const displayName = formatBadgeName(rawName, style.appendVencordTag);
    const radius = style.iconShape === "circle" ? "50%" : style.iconShape === "rounded" ? "6px" : "0";

    const transitionStyle: CSSProperties = style.hoverEffect === "scale"
        ? { transition: "transform 0.12s ease" }
        : style.hoverEffect === "glow"
            ? { transition: "filter 0.18s cubic-bezier(0.16, 1, 0.3, 1)" }
            : {};

    const imgStyle: CSSProperties = {
        width: style.iconSize,
        height: style.iconSize,
        objectFit: "contain",
        borderRadius: radius,
        cursor: settings.store.showPopup ? "pointer" : "default",
        ...transitionStyle
    };

    const handleClick = settings.store.showPopup ? (e: ReactMouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setShowingPopup(p => !p);
    } : undefined;

    const handleMouseEnter = style.hoverEffect === "scale"
        ? (e: ReactMouseEvent<HTMLImageElement>) => { e.currentTarget.style.transform = "scale(1.15)"; }
        : style.hoverEffect === "glow"
            ? (e: ReactMouseEvent<HTMLImageElement>) => { e.currentTarget.style.filter = `drop-shadow(0 0 6px ${style.glowColor})`; }
            : undefined;

    const handleMouseLeave = style.hoverEffect !== "none"
        ? (e: ReactMouseEvent<HTMLImageElement>) => { e.currentTarget.style.transform = ""; e.currentTarget.style.filter = ""; }
        : undefined;

    const imgEl = (
        <img
            src={badgeData.imageUrl}
            alt={displayName}
            referrerPolicy="no-referrer"
            style={imgStyle}
            onClick={handleClick}
        />
    );

    const imgElWithHover = (
        <img
            src={badgeData.imageUrl}
            alt={displayName}
            referrerPolicy="no-referrer"
            style={imgStyle}
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        />
    );

    return (
        <>
            {settings.store.showTooltip
                ? (
                    <Tooltip text={displayName}>
                        {({ onMouseEnter, onMouseLeave, ...tooltipProps }) => (
                            <span
                                {...tooltipProps}
                                onMouseEnter={e => {
                                    onMouseEnter(e);
                                    if (style.hoverEffect === "scale") {
                                        const img = e.currentTarget.querySelector("img");
                                        if (img) img.style.transform = "scale(1.15)";
                                    } else if (style.hoverEffect === "glow") {
                                        const img = e.currentTarget.querySelector("img");
                                        if (img) img.style.filter = `drop-shadow(0 0 6px ${style.glowColor})`;
                                    }
                                }}
                                onMouseLeave={e => {
                                    onMouseLeave(e);
                                    if (style.hoverEffect !== "none") {
                                        const img = e.currentTarget.querySelector("img");
                                        if (img) { img.style.transform = ""; img.style.filter = ""; }
                                    }
                                }}
                                style={{ display: "inline-flex" }}
                            >
                                {imgEl}
                            </span>
                        )}
                    </Tooltip>
                )
                : imgElWithHover
            }
            {showingPopup && settings.store.showPopup && (
                <BadgePopupCard
                    imageUrl={badgeData.imageUrl}
                    rawName={rawName}
                    ownerUsername={ownerUsername}
                    style={style}
                />
            )}
        </>
    );
}

const customProfileBadge: ProfileBadge = {
    id: "custom-badge",
    key: "custom-badge",
    description: "Custom Badge",

    shouldShow: () => true,
    component: CustomBadgeComponent,
};

function ensureStyles() {
    if (document.getElementById(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
.custom-badge-tooltip {
    position: fixed;
    z-index: 10000;
    background: #1d1d1d;
    color: #fff;
    font-size: 12px;
    font-weight: 500;
    padding: 6px 10px;
    border-radius: 5px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.4);
    pointer-events: none;
    opacity: 0;
    transform: translateY(4px);
    transition: opacity 0.1s ease, transform 0.1s ease;
    white-space: nowrap;
    font-family: var(--font-primary, "gg sans", sans-serif);
}
.custom-badge-tooltip.visible {
    opacity: 1;
    transform: translateY(0);
}
.custom-badge-tooltip::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border-width: 5px;
    border-style: solid;
    border-color: #1d1d1d transparent transparent transparent;
}

.custom-badge-injected.cb-hover-scale {
    transition: transform 0.12s ease;
}
.custom-badge-injected.cb-hover-scale:hover {
    transform: scale(1.15);
}
.custom-badge-injected.cb-hover-glow {
    transition: filter 0.18s cubic-bezier(0.16, 1, 0.3, 1);
}
.custom-badge-injected.cb-hover-glow:hover {
    filter: drop-shadow(0 0 6px var(--cb-glow-color, rgba(255,255,255,0.8)));
}

.custom-badge-popup {
    position: fixed;
    z-index: 10001;
    background: #1d1d1d;
    border-radius: 8px;
    padding: 20px 28px;
    text-align: center;
    box-shadow: 0 8px 24px rgba(0,0,0,0.5);
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.24s cubic-bezier(0.16, 1, 0.3, 1), transform 0.24s cubic-bezier(0.16, 1, 0.3, 1);
    font-family: var(--font-primary, "gg sans", sans-serif);
    min-width: 180px;
}
.custom-badge-popup.visible {
    opacity: 1;
    pointer-events: auto;
}
.custom-badge-popup.cb-anim-fade {
    transform: translateY(8px) scale(0.96);
}
.custom-badge-popup.cb-anim-fade.visible {
    transform: translateY(0) scale(1);
}
.custom-badge-popup.cb-anim-scale {
    transform: scale(0.8);
    transform-origin: 50% 100%;
}
.custom-badge-popup.cb-anim-scale.visible {
    transform: scale(1);
}
.custom-badge-popup.cb-anim-slide {
    transform: translateY(16px);
}
.custom-badge-popup.cb-anim-slide.visible {
    transform: translateY(0);
}
.custom-badge-popup::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border-width: 7px;
    border-style: solid;
    border-color: #1d1d1d transparent transparent transparent;
}
.custom-badge-popup img {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    object-fit: cover;
    margin-bottom: 14px;
    display: block;
    margin-left: auto;
    margin-right: auto;
}
.custom-badge-popup .cb-name {
    font-weight: 800;
    font-size: 16px;
    letter-spacing: 0.3px;
    color: #fff;
    line-height: 1.2;
}
.custom-badge-popup .cb-by {
    font-size: 12px;
    color: #949ba4;
    margin-top: 4px;
}
`;
    document.head.appendChild(style);
}

let tooltipEl: HTMLDivElement | null = null;

function getTooltipEl() {
    if (tooltipEl) return tooltipEl;
    tooltipEl = document.createElement("div");
    tooltipEl.className = "custom-badge-tooltip";
    document.body.appendChild(tooltipEl);
    return tooltipEl;
}

function showTooltip(target: HTMLElement, text: string) {
    const el = getTooltipEl();
    el.textContent = text;
    el.classList.add("visible");

    const rect = target.getBoundingClientRect();
    const top = rect.top - el.offsetHeight - 10;
    const left = rect.left + rect.width / 2 - el.offsetWidth / 2;

    el.style.top = `${Math.max(top, 4)}px`;
    el.style.left = `${Math.max(left, 4)}px`;
}

function hideTooltip() {
    tooltipEl?.classList.remove("visible");
}

let popupEl: HTMLDivElement | null = null;
let popupOpenFor: HTMLElement | null = null;
let followRaf: number | null = null;

function getPopupEl() {
    if (popupEl) return popupEl;
    popupEl = document.createElement("div");
    popupEl.className = "custom-badge-popup";
    document.body.appendChild(popupEl);
    return popupEl;
}

async function showPopup(target: HTMLElement, imageUrl: string, rawName: string, ownerUsername: string, style: BadgeStyle) {
    const el = getPopupEl();
    el.className = `custom-badge-popup cb-anim-${style.popupAnimation}`;
    el.innerHTML = "";
    el.style.background = "#1d1d1d";

    const displayName = formatBadgeName(rawName, style.appendVencordTag);

    const img = document.createElement("img");
    img.src = imageUrl;
    img.alt = displayName;
    img.referrerPolicy = "no-referrer";
    el.appendChild(img);

    const nameEl = document.createElement("div");
    nameEl.className = "cb-name";
    nameEl.style.color = style.nameColor;
    nameEl.textContent = displayName;
    el.appendChild(nameEl);

    if (settings.store.showOwnerTag) {
        const byEl = document.createElement("div");
        byEl.className = "cb-by";
        byEl.textContent = formatOwnerTag(ownerUsername, style.firstUsedDate);
        el.appendChild(byEl);
    }

    el.classList.add("visible");
    popupOpenFor = target;

    positionPopup(target, el);
    startFollowingPopup(target);

    const result = await getPopupBackground(imageUrl, style);
    if (popupOpenFor === target) el.style.background = result.background;
}

function positionPopup(target: HTMLElement, el: HTMLDivElement) {
    const rect = target.getBoundingClientRect();
    const top = rect.top - el.offsetHeight - 12;
    const left = rect.left + rect.width / 2 - el.offsetWidth / 2;

    el.style.top = `${Math.max(top, 4)}px`;
    el.style.left = `${Math.max(left, 4)}px`;
}

function startFollowingPopup(target: HTMLElement) {
    stopFollowingPopup();

    const step = () => {
        if (!popupOpenFor || popupOpenFor !== target) return;

        if (!document.body.contains(target)) {
            hidePopup();
            return;
        }

        const rect = target.getBoundingClientRect();
        const visible =
            rect.width > 0 &&
            rect.height > 0 &&
            rect.bottom > 0 &&
            rect.right > 0 &&
            rect.top < (window.innerHeight || document.documentElement.clientHeight) &&
            rect.left < (window.innerWidth || document.documentElement.clientWidth);

        if (!visible) {
            hidePopup();
            return;
        }

        const el = getPopupEl();
        positionPopup(target, el);
        followRaf = requestAnimationFrame(step);
    };

    followRaf = requestAnimationFrame(step);
}

function stopFollowingPopup() {
    if (followRaf !== null) {
        cancelAnimationFrame(followRaf);
        followRaf = null;
    }
}

function hidePopup() {
    stopFollowingPopup();
    popupEl?.classList.remove("visible");
    popupOpenFor = null;
}

document.addEventListener("click", e => {
    if (!popupOpenFor) return;
    const target = e.target as Node;
    if (popupEl?.contains(target) || popupOpenFor.contains(target)) return;
    hidePopup();
}, true);

document.addEventListener("scroll", () => {
    if (popupOpenFor) hidePopup();
}, true);

function createBadgeEl(imageUrl: string, rawName: string, ownerUsername: string, style: BadgeStyle) {
    ensureStyles();

    const radius = style.iconShape === "circle" ? "50%" : style.iconShape === "rounded" ? "6px" : "0";

    const anchor = document.createElement("a");
    anchor.className = `anchor_edefb8 anchorUnderlineOnHover_edefb8 ${BADGE_CLASS} cb-hover-${style.hoverEffect}`;
    anchor.setAttribute("aria-label", formatBadgeName(rawName, style.appendVencordTag));
    anchor.setAttribute("role", "button");
    anchor.style.cssText = "display: inline-flex; align-items: center; justify-content: center; cursor: pointer;";
    if (style.hoverEffect === "glow") {
        anchor.style.setProperty("--cb-glow-color", style.glowColor);
    }

    const img = document.createElement("img");
    img.src = imageUrl;
    img.alt = formatBadgeName(rawName, style.appendVencordTag);
    img.referrerPolicy = "no-referrer";
    img.className = "badge__8061a";
    img.style.cssText = `width: ${style.iconSize}px; height: ${style.iconSize}px; object-fit: contain; border-radius: ${radius};`;

    anchor.appendChild(img);

    if (settings.store.showTooltip) {
        anchor.addEventListener("mouseenter", () => showTooltip(anchor, formatBadgeName(rawName, style.appendVencordTag)));
        anchor.addEventListener("mouseleave", hideTooltip);
    }

    if (settings.store.showPopup) {
        anchor.addEventListener("click", e => {
            e.preventDefault();
            e.stopPropagation();
            hideTooltip();
            if (popupOpenFor === anchor) {
                hidePopup();
            } else {
                showPopup(anchor, imageUrl, rawName, ownerUsername, style);
            }
        });
    }

    return anchor;
}

let lastViewedUserId: string | null = null;
let domObserver: MutationObserver | null = null;

function tryInjectDomBadge(badgeContainer: Element, userId: string, badge: { imageUrl: string; description: string; style?: Partial<BadgeStyle> }) {
    if (badgeContainer.querySelector(`.${BADGE_CLASS}`)) return;
    if (settings.store.hideOwnBadge && userId === UserStore.getCurrentUser()?.id) return;
    if (!shouldShowBadgeFor(userId)) return;

    const ownerUsername = UserStore.getUser(userId)?.username || "unknown";
    const rawName = badge.description.trim();

    const ownerFirstUsedDate = userId === UserStore.getCurrentUser()?.id
        ? settings.store.firstUsedDate
        : null;
    const style = resolveBadgeStyle(badge.style, ownerFirstUsedDate);

    badgeContainer.appendChild(createBadgeEl(badge.imageUrl, rawName, ownerUsername, style));
    console.log("%c[CustomBadges] Injected badge for", "color: #1ABC9C; font-weight: bold;", userId);
}

function findNearbyUsername(container: Element): string | null {
    let el: Element | null = container;
    for (let i = 0; i < 8 && el; i++) {
        const nameEl = el.querySelector(
            '[class*="userTagUsername"], [class*="username"], [class*="nickname"]'
        );
        const text = nameEl?.textContent?.trim();
        if (text) return text;
        el = el.parentElement;
    }
    return null;
}

function startDomObserver() {
    domObserver = new MutationObserver(() => {
        if (!lastViewedUserId) return;
        const badge = cache.get(lastViewedUserId);
        if (!badge) return;

        const user = UserStore.getUser(lastViewedUserId);
        const matchText = user?.username || user?.globalName;

        const containers = document.querySelectorAll('.container__8061a[role="group"]');

        containers.forEach(container => {
            if (container.querySelector(`.${BADGE_CLASS}`)) return;

            const nearbyName = findNearbyUsername(container);
            if (nearbyName) {
                if (matchText && nearbyName !== matchText) return;
            } else {
                const popout = container.closest(
                    'div[class*="userPopout"], [role="dialog"], [class*="biteSize"], [class*="fullSize"]'
                );
                if (popout) {
                    const textContent = popout.textContent || "";
                    if (matchText && !textContent.includes(matchText)) return;
                } else if (matchText) {
                    return;
                }
            }

            tryInjectDomBadge(container, lastViewedUserId as string, badge);
        });
    });

    domObserver.observe(document.body, { childList: true, subtree: true });
}

function stopDomObserver() {
    domObserver?.disconnect();
    domObserver = null;
    stopFollowingPopup();
    popupOpenFor = null;
    tooltipEl?.remove();
    tooltipEl = null;
    popupEl?.remove();
    popupEl = null;
    document.getElementById(STYLE_ID)?.remove();
}

let activeBadgeMode: string | null = null;

function startBadgeMode(mode: string) {
    if (mode === "vencord") {
        addProfileBadge(customProfileBadge);
    } else {
        startDomObserver();
    }
}

function stopBadgeMode(mode: string) {
    if (mode === "vencord") {
        removeProfileBadge(customProfileBadge);
    } else {
        stopDomObserver();
    }
}

function switchBadgeMode(newMode: string) {
    if (activeBadgeMode === newMode) return;
    if (activeBadgeMode) stopBadgeMode(activeBadgeMode);
    startBadgeMode(newMode);
    activeBadgeMode = newMode;
}

export function onBadgeModeChange(newMode: string) {
    if (newMode === "vencord") {

        if (settings.store.showPopup) settings.store.showPopup = false;

        Toasts.show({
            id: Toasts.genId(),
            type: Toasts.Type.FAILURE,
            message: "Vencord Classic [Limited]: popup can't position above the badge, dismiss on outside click, or follow scroll. Click-to-view popup is now disabled - only the hover tooltip works in this mode."
        });
    }

    switchBadgeMode(newMode);
}

export default definePlugin({
    name: "CustomBadges",
    description: "Adds a custom badge with hover tooltip and click-to-view popup card, visible to anyone else running this plugin.",
    authors: [{ name: "you", id: 0n }],
    settings,

    setMyBadge,
    refreshBadgeCache,

    start() {
        let justSetFirstUsedDate = false;
        if (!settings.store.firstUsedDate) {
            settings.store.firstUsedDate = new Date().toISOString();
            justSetFirstUsedDate = true;
        }

        activeBadgeMode = settings.store.badgeMode || "original";
        startBadgeMode(activeBadgeMode);

        setDashboardBridge({
            settings,
            presetLabels: BUILTIN_PRESETS.map(p => p.label),
            getPreviewData: getDashboardPreviewData,
            shareMyBadge,
            revertBadge,
            refreshBadgeCache,
            importBadgeFromCode,
            applySelectedPreset,
            createNewBadgeSlot,
            importPackFromUrl,
            makePack,
            browsePacks,
            onBadgeModeChange,
            verifyAccount: verifyDiscordAccount,
            revokeSessionToken,
            switchToBadge,
            deleteBadgeSlot
        });

        const handleDashboardRoute = () => {
            if (dashboardState.isDashboardActive) {
                if (!window.location.pathname.startsWith("/channels/@me")) {
                    setDashboardActive(false);
                    restoreDefaultView();
                } else {
                    renderDashboardView();
                }
            }
            onRouteChanged();
        };

        FluxDispatcher.subscribe("ROUTE_CHANGED", handleDashboardRoute);
        onRouteChanged();

        SettingsPlugin.customEntries.push({
            key: "vencord_custom_badges",
            title: "Custom Badges",
            Component: CustomBadgesTab,
            Icon: CustomBadgesTabIcon
        });
        SettingsPlugin.settingsSectionMap.push(["VencordCustomBadges", "vencord_custom_badges"]);

        if (justSetFirstUsedDate) updateMyBadgeFromSettings();

        syncMyBadgesFromServer();
    },

    stop() {
        if (activeBadgeMode) stopBadgeMode(activeBadgeMode);
        activeBadgeMode = null;

        const entryIdx = SettingsPlugin.customEntries.findIndex(e => e.key === "vencord_custom_badges");
        if (entryIdx !== -1) SettingsPlugin.customEntries.splice(entryIdx, 1);

        const mapIdx = SettingsPlugin.settingsSectionMap.findIndex(e => e[1] === "vencord_custom_badges");
        if (mapIdx !== -1) SettingsPlugin.settingsSectionMap.splice(mapIdx, 1);

        FluxDispatcher.unsubscribe("ROUTE_CHANGED", onRouteChanged);
        buttonRegistry.unregister("user-dashboard");
        restoreDefaultView();
    },

    patches: [
        {
            find: '"UserProfileStore"',
            replacement: {
                match: /(getUserProfile\((\i)\)\{)/,
                replace: "$1$self.trackProfileView($2);"
            }
        }
    ],

    trackProfileView(userId: string) {

        lastViewedUserId = userId;
        if (!cache.has(userId)) fetchBadge(userId);
    },
});
