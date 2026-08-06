# CustomBadges (React Branch) — How It Works

A Vencord plugin that lets users attach a custom badge (image + name + styling) to their
Discord profile. The badge is stored on a shared backend server and rendered by anyone else
who has the plugin installed, whenever they view that user's profile.

This document describes the **React branch**, which replaces all DOM injection, custom popups,
MutationObservers, and the vanilla-JS dashboard from the original branch with clean, native
Vencord APIs and React components.

<details>
<summary><strong>🧩 New here? Click for the simple explanation</strong></summary>

## What is this?

It's an add-on for a Discord mod (Vencord) that lets you put a **custom little icon (a "badge")**
next to your name on your Discord profile like a homemade checkmark, a Minecraft logo, a cat
picture, whatever you want. Anyone else who also has this plugin installed will see your badge
when they look at your profile.

### The basic idea

1. You open the plugin's settings in Vencord, paste in an image URL, give it a name, and pick
   some style options (shape, size, hover effect).
2. That info gets saved to a small server on the internet (not Discord's own servers a separate
   free server the plugin author set up).
3. Whenever someone with the plugin looks at your profile, their copy of the plugin asks that
   server "hey, does this person have a badge?" and if so, draws it in Discord's normal badge row.
4. It only works between people who have the plugin regular Discord users won't see anything
   different.

### How the badge shows up

The plugin uses Vencord's built-in badge system (`BadgeAPI`) to slot your badge image directly
into the same row as Discord's official badges (like Nitro or Early Supporter). It looks native
because it *is* native no hacked-in HTML elements, no floating popups, no page patching.
Hovering over the badge shows a tooltip with your badge's name, powered by Vencord's own tooltip
system.

### Picking a badge

You can:
- Type in an image URL and a name yourself.
- Pick one of 6 ready-made presets (Minecraft-themed, cat, etc.) and click "Apply."
- Paste in a "badge code" someone shared with you and import it.
- Import a whole "pack" of badges at once from a link.

You can save up to 12 different badges and switch between them ("badge slots").

### Talking to the server

The plugin doesn't talk to the badge server directly from the page it goes through a
privileged background part of the app first (`native.ts`). This background part handles the
actual HTTP requests to fetch, save, or delete badges.

### In one sentence

It's a "profile sticker" system: you set an image + name + style once, it's stored on a small
shared server, and everyone else running the plugin sees it in your Discord badge row.

</details>

---

## 1. High-Level Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                        index.tsx (main)                      │
│  - Plugin definition & settings schema                       │
│  - Badge state management (CRUD, presets, import/export)     │
│  - React settings tab (single UI)                            │
│  - Vencord BadgeAPI registration (React component)           │
└───────────────────────────────┬──────────────────────────────┘
                                │ IPC (privileged)
                                ▼
                   ┌────────────────────────┐
                   │       native.ts        │
                   │  Fetch / set / delete  │
                   │  badge via HTTP        │
                   └────────────┬───────────┘
                                ▼
                   Cloudflare Worker backend
          (custom-badges.shadow-164.workers.dev)
```

Unlike the original branch, there is **one settings UI** (the standard Vencord settings modal
tab) and **one rendering path** (Vencord's `BadgeAPI`). No parallel dashboard, no DOM injection.

---

## 2. Data Model

### Badge Style (`BadgeStyle`)
Per-badge visual settings: icon shape (circle / rounded / square), icon size, hover effect
(none / scale / glow) + glow color.

### Badge Entry (`BadgeEntry`)
A saved slot: `{ id, imageUrl, description, style }`. Users can have up to `MAX_BADGES = 12`
slots, stored locally as JSON in `settings.store.myBadgesJson` and mirrored on the server.

### Storage locations

- **Vencord settings store** (`settings.store.*`) source of truth for the active badge's
  fields and the local slot list.
- **`localStorage`** a small revert history (last 2 published snapshots), keyed
  `customBadges_history`.
- **Backend server** canonical per-userId storage: active badge, full badge list,
  first-used date, expiry date.
- **In-memory `Map` cache** `cache` stores other users' fetched badge data, clearable via
  "Refresh Badge Cache."

---

## 3. Backend Communication (`native.ts`)

Runs in Vencord's **privileged Node-side context** (not the browser renderer), letting it make
network requests without Discord's page CSP restrictions.

All four functions follow the same pattern: build the request, `await fetch(...)`, parse the
JSON response, throw on non-OK status.

| Function | Method | Purpose |
|---|---|---|
| `fetchBadge(userId, apiBase?)` | `GET ?userId=...` | Retrieve active badge; `404` returns `null` |
| `setBadge(userId, badgeId, imageUrl, description, style?, apiBase?)` | `POST` | Create or update a badge slot |
| `setActiveBadge(userId, badgeId, apiBase?)` | `POST` | Switch which slot is publicly visible |
| `deleteBadge(userId, badgeId, apiBase?)` | `POST` | Remove a slot from the server |

The `_event` first parameter in each function is the standard Vencord IPC event object
(passed automatically; not used in the function body).

**Note:** The React branch's `native.ts` is intentionally simpler than the original no
`AbortController` timeout, no client-side rate-limit counter, and no tagged error strings
(`TIMEOUT:` / `CLIENT_RATE_LIMIT:` / `SERVER_RATE_LIMIT:`). Errors from `fetch` propagate
as plain `Error` objects and are handled by the caller in `index.tsx`.

---

## 4. Rendering the Badge — Vencord BadgeAPI

The React branch uses **one rendering path only**: Vencord's built-in `addProfileBadge` /
`removeProfileBadge` API.

### How it works

1. On plugin `start()`, the plugin calls `addProfileBadge(badgeDef)` with a badge definition
   object that includes a React component (`CustomBadgeComponent`) as the renderer.
2. Vencord's own profile-rendering code calls `CustomBadgeComponent` for any user whose badge
   has been fetched and cached.
3. The component renders a plain `<img>` element styled according to the user's `BadgeStyle`
   (shape, size, hover effect via CSS), wrapped in Vencord's native tooltip so hovering shows
   the badge description.
4. On plugin `stop()`, `removeProfileBadge()` cleanly unregisters the badge definition.

### Triggering a fetch

A monkey-patch (`patches` array) hooks `UserProfileStore.getUserProfile` so that every time
Discord requests a profile, `trackProfileView(userId)` fires recording the viewed user and
calling `fetchBadge(userId)` via IPC if not already cached.

### What this replaces

In the original branch, badge rendering used a `MutationObserver` watching `document.body`,
manually finding `.container__8061a[role="group"]` badge rows, and injecting `<a><img></a>`
elements by hand. A secondary observer managed repositioning a custom floating popup card on
scroll via `requestAnimationFrame`.

All of that is gone. The BadgeAPI handles DOM placement; Vencord handles the tooltip.

---

## 5. Settings UI

There is a single settings interface: the **Vencord settings modal tab** (`CustomBadgesTab`),
a React component defined in `index.tsx`.

It provides controls for:
- Image URL and badge description/name
- Badge slot list (select active, delete, add new)
- Preset picker (6 built-in presets)
- Badge pack import (URL) and export (copy to clipboard)
- Style options: shape, size, hover effect, glow color
- Behavioral toggles: show tooltip, mutual-guild restriction
- Publish, Revert, and Refresh Cache actions

Because there is no dashboard in this branch, the DM sidebar button and all `dashboard/*`
files (`bridge.ts`, `button.ts`, `buttonRegistry.ts`, `dashboardView.ts`, `html.ts`,
`wireSettings.ts`, `types.ts`) are **not present**.

---

## 6. Badge Sharing / Import / Packs

- **Share:** `encodeBadgeCode()` serializes `{ imageUrl, name, style }` to JSON then base64
  (`btoa(unescape(encodeURIComponent(...)))`), producing a compact text "code" for clipboard.
- **Import single badge:** paste a code → `decodeBadgeCode()` reverses the encoding →
  `validateBadgePayload()` checks shape → `applyBadgeState()` writes into `settings.store`
  → publishes to server.
- **Packs:** a JSON file `{ version: 1, badges: [code, code, ...] }` hosted at a
  `raw.githubusercontent.com` URL. `importPackFromUrl()` fetches it, decodes each entry, and
  pushes valid ones as new badge slots (up to the 12-slot cap). `makePack()` bundles all local
  slots into pack JSON and copies it to clipboard.
- URL validation (`packUrlLooksValid`) restricts imports to `raw.githubusercontent.com` only.

---

## 7. Presets

`BUILTIN_PRESETS` is a hardcoded array of six ready-made badge configurations. Selecting one
and hitting "Apply Preset" runs the same `applyBadgeState()` path as importing a code overwrites the active badge's image, name, and style, then republishes.

---

## 8. Miscellaneous Mechanics

- **Revert history:** every time a badge is published, the previous snapshot is pushed onto a
  2-entry `localStorage` stack. "Revert to Previous Badge" pops the most recent entry and
  republishes it.
- **Expiry warning:** if the server reports an `expiresAt` timestamp within 14 days, a
  one-time-per-session toast warns the user.
- **Mutual-guild restriction:** an optional, fully client-side filter that only renders others'
  badges if you share a server with them (checked via `GuildMemberStore`).
- **Plugin lifecycle:** `start()` registers the BadgeAPI badge, patches `getUserProfile`, and
  wires the settings tab. `stop()` unregisters the badge, removes the patch, and clears the
  badge cache.

---

## 9. What Was Removed vs. the Original Branch

| Original branch | This branch |
|---|---|
| `MutationObserver` on `document.body` | Removed — BadgeAPI handles placement |
| Custom tooltip `<div>` (fixed-position) | Removed — Vencord native tooltip |
| Floating popup card with scroll-follow | Removed entirely |
| `dashboard/` subfolder (7 files) | Removed entirely |
| DM sidebar button + nav injection | Removed entirely |
| `AbortController` 10s timeout in `native.ts` | Removed (simpler error handling) |
| Client-side rate limiter in `native.ts` | Removed |
| Tagged error strings (`TIMEOUT:`, `CLIENT_RATE_LIMIT:`, etc.) | Removed |
| `BadgeMode` toggle (original / vencord) | Removed — always BadgeAPI |
| `sampleImageColor` canvas averaging | Removed (no popup background to color-match) |
