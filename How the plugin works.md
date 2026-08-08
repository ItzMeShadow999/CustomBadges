# CustomBadges - How It Works

A Vencord (Discord client mod) plugin that lets a user attach a self-hosted custom
badge (image + name + styling) to their Discord profile. The badge is stored on a
shared backend server and rendered by anyone else who has the plugin installed,
whenever they view that user's profile. Publishing a badge requires the user to
verify their Discord account once and hold a valid session token.

<details>
<summary><strong>🧩 New here? Click for the simple explanation</strong></summary>

## What is this?

It's an add-on for a Discord mod (Vencord) that lets you put a **custom little
icon (a "badge")** next to your name on your Discord profile: like a
homemade verified checkmark, a Minecraft logo, a cat picture, whatever you
want. Anyone else who also has this plugin installed will see your badge when
they look at your profile.

### The basic idea

1. You verify that the Discord account is actually yours (a one-time step
   through Discord's own login page) and get a short-lived session token back.
2. You upload a picture, give it a name, and pick some style options (shape,
   color, hover effects, etc).
3. That info gets saved to a little server on the internet (not Discord's own
   servers, a separate free server the plugin author set up), using your
   session token as proof the change is really coming from you.
4. Whenever someone with the plugin looks at your profile, their copy of the
   plugin asks that server "hey, does this person have a badge?" and if so,
   it draws it onto their screen.
5. It only works between people who have the plugin: regular Discord users
   won't see anything different.

### Why the verification step

Early versions of the plugin trusted whatever Discord user ID the client sent
along with a badge change, which means a modified client could claim to be
someone else and overwrite their badge. Verifying links your session token to
your real Discord identity server-side, so the server only accepts changes
that come with a token proving they're actually from you. You only need to do
this once; the token stays saved locally until you revoke it or replace it.

### The main pieces

**The settings screen**
There are actually *two* different settings screens that do the same thing:
- One is the normal Vencord settings page you're used to.
- The other is a fancy custom page that pops up when you click a button in
  your DM list: it looks like part of Discord but it's actually the plugin
  taking over that spot on the screen.

Both screens change the same underlying settings, so it doesn't matter which
one you use, including the verification step and session token field.

**Verifying your account**
Clicking "Verify Discord Account" opens your browser to the badge server's own
login page, which asks Discord to confirm who you are (just your basic
identity, not your email or your server list) and then shows you a token to
copy back into the plugin. Paste it into the "Session Token" field and you're
done. The field hides the token as dots once you click away, and you can
revoke it at any time with "Revoke Your Token" if you ever want to cut off
that session (for example, after copying the plugin to a new device).

**Picking a badge**
You can:
- Type in an image URL and a name yourself.
- Pick one of 6 ready-made "presets" (like a Minecraft-themed badge or a cat
  badge) and just click "Apply."
- Paste in a "badge code" someone shared with you (a chunk of text that
  contains someone else's whole badge setup) and import it.
- Import a whole "pack" of badges at once from a link.

You can save up to 12 different badges and switch between them ("badge
slots"), sort of like having multiple profile pictures ready to go. Any of
these actions that publish to the server need your session token to go
through.

**Showing the badge to other people**
When someone views your profile, the plugin watches the page for the right
spot to appear and drops your badge icon in. Hovering over it shows a small
tooltip with your badge's name. Clicking it can open a bigger popup card
showing your picture, name, and (optionally) who made it and when.

There are two different ways the plugin can inject the badge:
- **Full mode**: does everything, the tooltip, the popup that follows you as
  you scroll, animations, etc.
- **Simple mode**: uses Discord's own built-in badge system. It's more
  "native" feeling but can't do the fancy popup, so if you switch to this
  mode, popups get turned off automatically.

**Talking to the server**
The plugin doesn't talk to the badge server directly from the page you're
looking at, it goes through a more trusted background part of the app first.
This background part:
- Gives up after 10 seconds if the server isn't responding.
- Won't let you spam the server with too many requests too fast.
- Refuses to send a badge change at all if you haven't verified yet.
- Turns technical errors into friendly messages like "Slow down a little,
  try again in 5s" or "Verify your Discord account first."

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

**Sharing a badge pack the right way**
If you want to bundle several badges into a "pack" for others to import,
there's a Guidelines panel (opened from the dashboard or settings tab) that
walks through the expected JSON format, size limits, content rules, and how
to submit it to the packs repo.

### In one sentence

It's a "profile sticker" system: you verify it's really you once, then set an
image + name + style, it's stored on a small shared server, and everyone else
running the same plugin sees it pop up on your Discord profile.

</details>

---

## 1. High-Level Architecture

```
+------------------------------------------------------------------+
|                        index.tsx (main)                          |
|  - Plugin settings definition                                    |
|  - Badge state management (CRUD, presets, import/export)         |
|  - Account verification / session token settings                 |
|  - Two injection modes: "original" (DOM) / "vencord" (API)       |
|  - React settings-modal tab (incl. Pack Guidelines modal)        |
+---------------+----------------------------------+---------------+
                |                                   |
                | calls                             | IPC (privileged)
                v                                   v
+---------------------------+       +------------------------------+
|   dashboard/* (in-app UI) |       |          native.ts           |
|  Custom full-page settings|       |  Talks to the backend        |
|  panel injected into the  |       |  Worker (fetch/set/delete    |
|  Discord DM sidebar area, |       |  badge, revoke token),       |
|  mounted over the content |       |  rate-limited, timeout-      |
|  area via position:fixed  |       |  protected, requires a       |
+---------------------------+       |  session token on writes     |
                                    +---------------+---------------+
                                                    v
                                       Cloudflare Worker backend
                                (custom-badges.shadow-164.workers.dev)
                                     - badge storage
                                     - Discord OAuth (/auth/start)
                                     - session token issue/verify/revoke
```

There are effectively **two parallel settings UIs** that both read/write the same
`settings.store`:
1. The standard Vencord settings-modal tab (`CustomBadgesTab`, React, in `index.tsx`).
2. A bespoke "Dashboard" page (`dashboard/*`), built with vanilla DOM/HTML strings,
   injected as its own item in Discord's DM sidebar.

They're kept in sync because both simply mutate the same settings object and call
the same exported functions (`shareMyBadge`, `applySelectedPreset`, `verifyDiscordAccount`,
`revokeSessionToken`, `switchToBadge`, `deleteBadgeSlot`, etc).

---

## 2. Data Model

### Badge Style (`BadgeStyle`)
Per-badge visual settings: icon shape (circle/rounded/square), icon size, hover
effect (none/scale/glow) + glow color, popup background mode (base/sample/edit-gradient)
+ gradient colors, name color, popup animation (fade/scale/slide), whether to
append a `[Vencord]` suffix.

### Badge Prefs (`BadgePrefs`)
Behavioral toggles: show tooltip, show popup, show owner tag, owner tag format
string (supports `{username}` / `{pluginusedate}` placeholders), hide own badge,
restrict to mutual servers. All of these are now editable from either settings
surface, the dashboard has its own toggle switches for each one instead of only
exposing them in the Vencord settings tab.

### Badge Entry (`BadgeEntry`)
A saved "slot": `{ id, imageUrl, description, style }`. Users can have up to
`MAX_BADGES = 12` slots, stored locally as JSON in `settings.store.myBadgesJson`
and mirrored on the server.

### Session Token
A short-lived credential returned after Discord OAuth verification, stored in
`settings.store.sessionToken`. Sent as a `Bearer` header on every write request
(`setBadge`, `setActiveBadge`, `deleteBadge`). Not required for reads
(`fetchBadge`). Can be cleared locally and revoked server-side via
`revokeSessionToken()` / `revokeOwnToken()`.

### Storage locations
- **Vencord settings store** (`settings.store.*`): the source of truth for the
  *currently active* badge's fields, the local badge-slot list, and the
  session token.
- **`localStorage`**: a small revert history (last 2 published snapshots),
  keyed `customBadges_history`.
- **Backend server**: canonical storage per userId, active badge, full badge
  list, first-used date, expiry date, and the verified session mapping.
- **In-memory `Map` caches**: `cache` (other users' fetched badges) and
  `sampledColorCache` (image to averaged RGB color), both clearable via
  "Refresh Badge Cache."

---

## 3. Backend Communication (`native.ts`)

Runs in Vencord's **privileged Node-side context** (not the browser renderer),
which lets it make network requests without being subject to Discord's page CSP.

- `fetchBadge(userId, apiBase)` -> `GET {base}?userId=...`. 404 -> `null`. No
  session token needed.
- `setBadge(userId, badgeId, imageUrl, description, style, sessionToken, apiBase)`
  -> `POST` with `action: "setBadge"`, `Authorization: Bearer <sessionToken>`.
  `userId` is still included in the body for logging/back-compat only, the
  Worker resolves the authenticated identity from the token itself, so it
  can't be spoofed by a modified client.
- `setActiveBadge(userId, badgeId, sessionToken, apiBase)` -> `POST action:
  "setActiveBadge"`, same auth header.
- `deleteBadge(userId, badgeId, sessionToken, apiBase)` -> `POST action:
  "deleteBadge"`, same auth header.
- `revokeOwnToken(sessionToken, apiBase)` -> `POST {base}/self/revoke`,
  invalidates the caller's own session token server-side.

All four write helpers call `requireSessionToken()` first and throw a tagged
`NOT_VERIFIED:` error immediately if no token is present, before any network
request is made.

Protections:
- **10s timeout** via `AbortController`, converted into a tagged `TIMEOUT:` error.
- **Client-side rate limit**: max 50 write requests per rolling 10s window
  (`checkClientRateLimit`), throws `CLIENT_RATE_LIMIT:<ms>` before the request
  is even sent.
- **Session requirement**: `requireSessionToken()` throws `NOT_VERIFIED:` if
  `settings.store.sessionToken` is empty.
- **Server error parsing**: HTTP 429 -> `SERVER_RATE_LIMIT:<retryAfter>`; other
  non-OK statuses -> `SERVER_ERROR:<status>:<message>`.
- All errors are tagged `KIND:detail` strings, decoded on the front end by
  `describeBadgeApiError()` into a friendly toast message (including a new
  `NOT_VERIFIED` case: "Verify your Discord account first...").

---

## 4. Account Verification

- **`verifyDiscordAccount()`** opens `{apiBase}/auth/start` in the system
  browser (`window.open(..., "_blank", "noopener,noreferrer")`). The Worker
  handles the Discord OAuth flow (identify scope only) and shows the user a
  session token to copy back.
- **Session token input** (`SessionTokenInput` in the React settings tab,
  the equivalent vanilla wiring in `wireSettings.ts` for the dashboard):
  the real `<input>` stays mounted and functional (real caret, real typing),
  but its text is painted transparent. An overlay of per-character spans
  renders on top: while focused, each character shows as a letter; on blur,
  every character morphs into a masking dot with a small per-letter stagger,
  and morphs back the moment the field is refocused. A scroll-sync keeps the
  overlay aligned with the real input once the token overflows the field
  width.
- **`RevokeTokenButton`** (React) / the dashboard's "Revoke Your Token"
  button call `revokeSessionToken()`, which hits `revokeOwnToken()` and then
  clears `settings.store.sessionToken` locally on success.
- Any badge write attempted without a token surfaces the `NOT_VERIFIED`
  message instead of silently failing.

---

## 5. Rendering the Badge - Two Modes

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
- A custom **tooltip** (`showTooltip`/`hideTooltip`): a fixed-position `<div>`
  positioned above the badge on hover.
- A custom **popup card** (`showPopup`/`hidePopup`): fixed-position, follows
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
disables `showPopup` and warns the user via toast; in both settings UIs the
popup and owner-tag controls are also visually locked/disabled while this mode
is active (`updatePopupLockState()` in the dashboard).

Switching modes calls `switchBadgeMode()`, which cleanly tears down the previous
mode's listeners/observers (`stopBadgeMode`) before starting the new one
(`startBadgeMode`).

### Triggering a fetch
A monkey-patch (`patches` array) hooks `UserProfileStore.getUserProfile` so that
every time Discord requests a profile, `trackProfileView(userId)` fires,
recording `lastViewedUserId` and calling `fetchBadge(userId)` if not cached.

---

## 6. Badge Sharing / Import / Packs

- **Share**: `encodeBadgeCode()` serializes `{ imageUrl, name, style, prefs }`
  to JSON, then base64 (`btoa(unescape(encodeURIComponent(...)))`) so it can be
  copied to clipboard as a compact text "code."
- **Import single badge**: paste a code, `decodeBadgeCode()` reverses the
  encoding, `validateBadgePayload()` checks shape, `applyBadgeState()`
  writes it into `settings.store` (with `suppressPublishOnChange` guarding
  against redundant server writes mid-batch), then publishes it (requires a
  valid session token).
- **Packs**: a JSON file `{ version: 1, badges: [code, code, ...] }` hosted at
  a `raw.githubusercontent.com` URL. `importPackFromUrl()` fetches it, decodes
  each code, and pushes valid ones as new badge slots (up to the 12-slot cap).
  `makePack()` (now wrapped by the `MakePackButton` component) does the
  reverse: bundles all local slots into pack JSON and copies it to clipboard
  for the user to publish to a repo. Related pack actions are grouped under
  `BadgePacksButtonsRow`.
- URL validation (`packUrlLooksValid`) restricts pack imports to the
  `raw.githubusercontent.com` hostname only.
- **Publishing guidelines**: `PackGuidelinesModal` (React, settings tab) and
  the dashboard's `#ub-guidelines-panel` both show the same format spec,
  pack-size note, content rules, and submission steps before someone shares a
  pack. Pack JSON previews are rendered through `renderJsonHighlighted()`, a
  small syntax highlighter for keys/strings/numbers/literals/punctuation.
  Both panels close with the same CRT-style power-off collapse + flash
  animation rather than a plain fade.

---

## 7. Presets

`BUILTIN_PRESETS` is a hardcoded array of six ready-made badge configurations.
Selecting one and hitting "Apply Preset" runs the same `applyBadgeState()` path
as importing a code, it overwrites the active badge's image/name/style/prefs
and republishes (again gated on having a valid session token).

---

## 8. Dashboard UI (`dashboard/*`)

A second, fully custom-styled full-page UI that takes over Discord's main
content area (instead of using the standard settings modal). This exists
alongside the React settings tab and shares the same underlying settings/data,
and is now functionally at parity with the React tab (verification, all
preference toggles, guidelines panel included).

- **`types.ts`**: global `state.isDashboardActive` flag + a small
  `CustomSidebarButton` interface.
- **`bridge.ts`**: a tiny pub-sub singleton. `index.tsx` calls
  `setDashboardBridge({...})` once at plugin start, exposing settings and all
  the action functions (`shareMyBadge`, `revertBadge`, `verifyAccount`,
  `revokeSessionToken`, `switchToBadge`, `deleteBadgeSlot`, etc). The
  vanilla-DOM dashboard code calls `getDashboardBridge()` to reach back into
  the React/plugin world without prop drilling.
- **`button.ts` / `buttonRegistry.ts`**: injects a custom nav item into
  Discord's DM sidebar list that toggles the dashboard. Since plugin code runs
  outside Discord's render cycle, insertion is retried via `requestAnimationFrame`
  polling (`onRouteChanged`) rather than relying on a single DOM mutation event.
  Selection state (highlighting) is synced whenever route or dashboard state
  changes.
- **`html.ts`**: a large template-string generator producing the dashboard's
  HTML/CSS. Deliberately mimics Discord's internal CSS class names
  (`channel__972a0`, `interactive_f88cfd`, etc.) so injected elements look
  native. Contains two tabs: "Custom Badges" (image/name/preset/pack
  management, account verification, session token field) and "Style Studio"
  (shape/size/hover/popup styling). Also includes the Badge Pack Sharing
  Guidelines panel.
- **`dashboardView.ts`**: mounts the dashboard wrapper on `<body>`, outside
  Discord's own React tree, and pins it visually over the real content area
  via `position: fixed` plus `getBoundingClientRect()`, instead of hiding
  Discord's own children inside the content area. Discord's message list and
  everything underneath keeps mounted and rendering normally the whole time,
  which is what avoids a blank-pane bug on close. Repositions on `resize` and
  a light poll, since Discord's own layout can shift without firing a resize
  event. Fades and scales in on open, and now animates back out on close
  (about 200ms) instead of being removed instantly.
- **`wireSettings.ts`**: hand-rolled vanilla-JS event wiring for the dashboard's
  custom dropdowns, color pickers, choice-button groups, toggle switches, tab
  switching (with an animated gradient underline that tracks the active tab),
  the session token masking overlay, and the guidelines panel's open/close
  transitions. On every change it writes directly into `settings.store`,
  matching the same fields the React tab uses, then calls `updatePreview()`
  to refresh the live badge preview using `bridge.getPreviewData()`.

---

## 9. Miscellaneous Mechanics

- **Color sampling** (`sampleImageColor`): draws the badge image onto a 32x32
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
