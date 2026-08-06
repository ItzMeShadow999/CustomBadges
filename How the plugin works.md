# CustomBadges — How It Works

A Vencord (Discord client mod) plugin that lets a user attach a self-hosted custom
badge (image + name + styling) to their Discord profile. The badge is stored on a
shared backend server and rendered by anyone else who has the plugin installed,
whenever they view that user's profile.

<details>
<summary><strong>🧩 New here? Click for the simple explanation</strong></summary>

## What is this?

It's an add-on for a Discord mod (Vencord) that lets you put a **custom little
icon (a "badge")** next to your name on your Discord profile like a
homemade verified checkmark, a Minecraft logo, a cat picture, whatever you
want. Anyone else who also has this plugin installed will see your badge when
they look at your profile.

### The basic idea

1. You upload a picture, give it a name, and pick some style options (shape,
   color, hover effects, etc).
2. That info gets saved to a little server on the internet (not Discord's own
   servers a separate free server the plugin author set up).
3. Whenever someone with the plugin looks at your profile, their copy of the
   plugin asks that server "hey, does this person have a badge?" and if so,
   it draws it onto their screen.
4. It only works between people who have the plugin regular Discord users
   won't see anything different.

### The main pieces

**The settings screen**
There are actually *two* different settings screens that do the same thing:
- One is the normal Vencord settings page you're used to.
- The other is a fancy custom page that pops up when you click a button in
  your DM list it looks like part of Discord but it's actually the plugin
  taking over that spot on the screen.

Both screens change the same underlying settings, so it doesn't matter which
one you use.

**Picking a badge**
You can:
- Type in an image URL and a name yourself.
- Pick one of 6 ready-made "presets" (like a Minecraft-themed badge or a cat
  badge) and just click "Apply."
- Paste in a "badge code" someone shared with you (a chunk of text that
  contains someone else's whole badge setup) and import it.
- Import a whole "pack" of badges at once from a link.

You can save up to 12 different badges and switch between them ("badge
slots"), sort of like having multiple profile pictures ready to go.

**Showing the badge to other people**
When someone views your profile, the plugin watches the page for the right
spot to appear and drops your badge icon in. Hovering over it shows a small
tooltip with your badge's name. Clicking it can open a bigger popup card
showing your picture, name, and (optionally) who made it and when.

There are two different ways the plugin can inject the badge:
- **Full mode**: does everything the tooltip, the popup that follows you as
  you scroll, animations, etc.
- **Simple mode**: uses Discord's own built-in badge system. It's more
  "native" feeling but can't do the fancy popup so if you switch to this
  mode, popups get turned off automatically.

**Talking to the server**
The plugin doesn't talk to the badge server directly from the page you're
looking at it goes through a more trusted background part of the app first.
This background part:
- Gives up after 10 seconds if the server isn't responding.
- Won't let you spam the server with too many requests too fast.
- Turns technical errors into friendly messages like "Slow down a little -
  try again in 5s."

**Undo button**
Every time you publish a new badge, the plugin quietly remembers your last
one. If you don't like your new badge, "Revert to Previous Badge" brings the
old one back.

**Color matching**
If you turn on "Sample Image" for the popup background, the plugin looks at
your badge picture and calculates its average color, then uses that as the
background of your popup card so it matches. If it can't read the image (some
image hosts block this), it just uses a plain dark gray background instead
and lets you know.

**Privacy option**
There's a toggle to only show badges (yours and other people's) to people you
share a Discord server with, instead of showing them to literally everyone
with the plugin.

### In one sentence

It's a "profile sticker" system: you set an image + name + style once, it's
stored on a small shared server, and everyone else running the same plugin
sees it pop up on your Discord profile.

</details>

---

## 1. High-Level Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                        index.tsx (main)                      │
│  - Plugin settings definition                                │
│  - Badge state management (CRUD, presets, import/export)     │
│  - Two injection modes: "original" (DOM) / "vencord" (API)   │
│  - React settings-modal tab                                  │
└───────────────┬───────────────────────────────┬──────────────┘
                │                                │
                │ calls                          │ IPC (privileged)
                ▼                                ▼
┌───────────────────────────┐      ┌────────────────────────────┐
│   dashboard/* (in-app UI) │      │       native.ts            │
│  Custom full-page settings│      │  Talks to the backend      │
│  panel injected into the  │      │  Worker (fetch/set/delete  │
│  Discord DM sidebar area  │      │  badge), rate-limited,     │
└───────────────────────────┘      │  timeout-protected         │
                                   └──────────────┬─────────────┘
                                                  ▼
                                     Cloudflare Worker backend
                                (custom-badges.shadow-164.workers.dev)
```

There are effectively **two parallel settings UIs** that both read/write the same
`settings.store`:
1. The standard Vencord settings-modal tab (`CustomBadgesTab`, React, in `index.tsx`).
2. A bespoke "Dashboard" page (`dashboard/*`), built with vanilla DOM/HTML strings,
   injected as its own item in Discord's DM sidebar.

They're kept in sync because both simply mutate the same settings object and call
the same exported functions (`shareMyBadge`, `applySelectedPreset`, etc).

---

## 2. Data Model

### Badge Style (`BadgeStyle`)
Per-badge visual settings: icon shape (circle/rounded/square), icon size, hover
effect (none/scale/glow) + glow color, popup background mode (base/sample/edit-gradient)
+ gradient colors, name color, popup animation (fade/scale/slide), whether to
append a `[Vencord]` suffix.

### Badge Prefs (`BadgePrefs`)
Behavioral toggles: show tooltip, show popup, show owner tag, owner tag format
string (supports `{username}` / `{pluginusedate}` placeholders), hide own badge.

### Badge Entry (`BadgeEntry`)
A saved "slot": `{ id, imageUrl, description, style }`. Users can have up to
`MAX_BADGES = 12` slots, stored locally as JSON in `settings.store.myBadgesJson`
and mirrored on the server.

### Storage locations
- **Vencord settings store** (`settings.store.*`) the source of truth for the
  *currently active* badge's fields, plus the local badge-slot list.
- **`localStorage`** a small revert history (last 2 published snapshots),
  keyed `customBadges_history`.
- **Backend server** canonical storage per userId: active badge, full badge
  list, first-used date, expiry date.
- **In-memory `Map` caches** `cache` (other users' fetched badges) and
  `sampledColorCache` (image → averaged RGB color), both clearable via
  "Refresh Badge Cache."

---

## 3. Backend Communication (`native.ts`)

Runs in Vencord's **privileged Node-side context** (not the browser renderer),
which lets it make network requests without being subject to Discord's page CSP.

- `fetchBadge(userId, apiBase)` —> `GET {base}?userId=...`. 404 → `null`.
- `setBadge(userId, badgeId, imageUrl, description, style, apiBase)` —> `POST`
  with `action: "setBadge"`.
- `setActiveBadge(userId, badgeId, apiBase)` —> `POST action: "setActiveBadge"`.
- `deleteBadge(userId, badgeId, apiBase)` —> `POST action: "deleteBadge"`.

Protections:
- **10s timeout** via `AbortController`, converted into a tagged `TIMEOUT:` error.
- **Client-side rate limit**: max 50 write requests per rolling 10s window
  (`checkClientRateLimit`), throws `CLIENT_RATE_LIMIT:<ms>` before the request
  is even sent.
- **Server error parsing**: HTTP 429 → `SERVER_RATE_LIMIT:<retryAfter>`; other
  non-OK statuses → `SERVER_ERROR:<status>:<message>`.
- All errors are tagged `KIND:detail` strings, decoded on the front end by
  `describeBadgeApiError()` into a friendly toast message.

---

## 4. Rendering the Badge — Two Modes

### Mode A: `original` (default, full-featured)
Uses a `MutationObserver` (`startDomObserver`) watching the entire `document.body`
for DOM mutations. Whenever Discord re-renders a profile popout:
1. Looks for badge-row containers (`.container__8061a[role="group"]`).
2. Confirms the container belongs to the currently-tracked user
   (`lastViewedUserId`) by matching a nearby username element, or by checking
   the enclosing popout/dialog's text content.
3. If it matches and no badge is injected yet, builds and appends a custom
   `<a><img></a>` badge element (`createBadgeEl`).

This mode supports:
- A custom **tooltip** (`showTooltip`/`hideTooltip`) a fixed-position `<div>`
  positioned above the badge on hover.
- A custom **popup card** (`showPopup`/`hidePopup`) fixed-position, follows
  the badge element on scroll via `requestAnimationFrame` (`startFollowingPopup`),
  dismisses on outside click or when the badge scrolls out of view, supports
  fade/scale/slide entrance animations.
- Hover effects (CSS class toggling for scale/glow, with glow color as a CSS
  custom property `--cb-glow-color`).

### Mode B: `vencord` (BadgeAPI, limited)
Uses Vencord's built-in `addProfileBadge`/`removeProfileBadge` API with a React
component (`CustomBadgeComponent`) as the badge renderer. Simpler and more
"native," but Vencord's badge-popup system can't reposition itself relative to
scroll, can't dismiss on outside click, etc. So switching to this mode force-
disables `showPopup` and warns the user via toast.

Switching modes calls `switchBadgeMode()`, which cleanly tears down the previous
mode's listeners/observers (`stopBadgeMode`) before starting the new one
(`startBadgeMode`).

### Triggering a fetch
A monkey-patch (`patches` array) hooks `UserProfileStore.getUserProfile` so that
every time Discord requests a profile, `trackProfileView(userId)` fires,
recording `lastViewedUserId` and calling `fetchBadge(userId)` if not cached.

---

## 5. Badge Sharing / Import / Packs

- **Share**: `encodeBadgeCode()` serializes `{ imageUrl, name, style, prefs }`
  to JSON, then base64 (`btoa(unescape(encodeURIComponent(...)))`) so it can be
  copied to clipboard as a compact text "code."
- **Import single badge**: paste a code → `decodeBadgeCode()` reverses the
  encoding → `validateBadgePayload()` checks shape → `applyBadgeState()`
  writes it into `settings.store` (with `suppressPublishOnChange` guarding
  against redundant server writes mid-batch) → publishes it.
- **Packs**: a JSON file `{ version: 1, badges: [code, code, ...] }` hosted at
  a `raw.githubusercontent.com` URL. `importPackFromUrl()` fetches it, decodes
  each code, and pushes valid ones as new badge slots (up to the 12-slot cap).
  `makePack()` does the reverse bundles all local slots into pack JSON and
  copies it to clipboard for the user to publish to a repo.
- URL validation (`packUrlLooksValid`) restricts pack imports to the
  `raw.githubusercontent.com` hostname only.

---

## 6. Presets

`BUILTIN_PRESETS` is a hardcoded array of six ready-made badge configurations.
Selecting one and hitting "Apply Preset" runs the same `applyBadgeState()` path
as importing a code it overwrites the active badge's image/name/style/prefs
and republishes.

---

## 7. Dashboard UI (`dashboard/*`)

A second, fully custom-styled full-page UI that takes over Discord's main
content area (instead of using the standard settings modal). This exists
alongside the React settings tab and shares the same underlying settings/data.

- **`types.ts`** —> global `state.isDashboardActive` flag + a small
  `CustomSidebarButton` interface.
- **`bridge.ts`** —> a tiny pub-sub singleton. `index.tsx` calls
  `setDashboardBridge({...})` once at plugin start, exposing settings and all
  the action functions (`shareMyBadge`, `revertBadge`, etc). The vanilla-DOM
  dashboard code calls `getDashboardBridge()` to reach back into the React/plugin
  world without prop drilling.
- **`button.ts` / `buttonRegistry.ts`** —> injects a custom nav item into
  Discord's DM sidebar list that toggles the dashboard. Since plugin code runs
  outside Discord's render cycle, insertion is retried via `requestAnimationFrame`
  polling (`onRouteChanged`) rather than relying on a single DOM mutation event.
  Selection state (highlighting) is synced whenever route or dashboard state
  changes.
- **`html.ts`** —> a large template-string generator producing the dashboard's
  HTML/CSS. Deliberately mimics Discord's internal CSS class names
  (`channel__972a0`, `interactive_f88cfd`, etc.) so injected elements look native.
  Contains two tabs: "Custom Badges" (image/name/preset/pack management) and
  "Style Studio" (shape/size/hover/popup styling).
- **`dashboardView.ts`** —> swaps the main content area: hides (not removes)
  existing siblings when the dashboard opens, so normal Discord UI can be
  restored instantly by un-hiding them when the dashboard closes.
- **`wireSettings.ts`** —> hand-rolled vanilla-JS event wiring for the dashboard's
  custom dropdowns, color pickers, choice-button groups, and tab switching
  (with an animated gradient underline that tracks the active tab). On every
  change it writes directly into `settings.store`, matching the same fields the
  React tab uses, then calls `updatePreview()` to refresh the live badge preview
  using `bridge.getPreviewData()`.

---

## 8. Miscellaneous Mechanics

- **Color sampling** (`sampleImageColor`): draws the badge image onto a 32×32
  canvas, averages RGB across all non-transparent pixels, caches the result per
  URL. Used for the "Sample Image" popup background mode. Falls back to a flat
  color if the canvas read fails (e.g. CORS-blocked image host), with a visible
  "couldn't sample colors" warning shown in previews.
- **Revert history**: every time a badge is published, the *previous* published
  snapshot is pushed onto a 2-entry `localStorage` stack (debounced to avoid
  spamming history on rapid edits). "Revert to Previous Badge" pops the most
  recent entry and republishes it.
- **Expiry warning**: if the server reports an `expiresAt` timestamp within 14
  days, a one-time-per-session toast warns the user to keep their badge alive.
- **Mutual-guild restriction**: an optional, fully client-side filter
  (`restrictToMutualGuilds`) that only renders others' badges if you share a
  server with them (checked via `GuildMemberStore`).
- **Plugin lifecycle**: `start()` wires the badge mode, dashboard bridge, route
  listener, and settings-modal tab; `stop()` tears all of it down cleanly
  (unpatches, removes DOM elements/observers, unregisters the sidebar button).
