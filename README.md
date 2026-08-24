<div align="center">

<img src="https://vencord.dev/assets/logo.png" alt="Vencord logo" width="200" />

# Custom Badges — Vencord

[![Vencord Plugin](https://img.shields.io/badge/Vencord-Plugin-FFB6D9?style=for-the-badge&logo=discord&logoColor=6B2C5F&labelColor=FFD6EC)](https://github.com/Vendicated/Vencord)
[![License: GPL v3](https://img.shields.io/badge/License-GPL%20v3-A9C9FF?style=for-the-badge&labelColor=D6E4FF&logoColor=2B3A67)](https://www.gnu.org/licenses/gpl-3.0.html)
[![Cloudflare Workers](https://img.shields.io/badge/Backend-Cloudflare%20Workers-FFCBA4?style=for-the-badge&logo=cloudflare&logoColor=8A4B00&labelColor=FFE3C7)](https://workers.cloudflare.com/)
[![Discord Server](https://img.shields.io/badge/Discord-Join%20Server-C9A7FF?style=for-the-badge&logo=discord&logoColor=4B2E83&labelColor=E5D4FF)](https://discord.gg/PUYaka9Hy8)

![TypeScript](https://img.shields.io/badge/TypeScript-A7C7FF?style=flat&logo=typescript&logoColor=1B3A6B&labelColor=D6E8FF)
![Third-Party](https://img.shields.io/badge/Third--Party-Not%20affiliated%20with%20Discord-E8E8E8?style=flat&labelColor=F5F5F5&color=D8D8D8)
![Status](https://img.shields.io/badge/Status-Active-B8E6B8?style=flat&labelColor=E0F5E0&logoColor=1F5C1F)

</div>

A Vencord plugin that gives you a custom profile badge image, description,
and styling with hover tooltips, a click popup, badge rotation ("My
Badges"), presets, and packs. Bundled with **UserBoard**, a sidebar button
that opens a full in-app dashboard for managing everything without leaving
Discord.

<img src="https://raw.githubusercontent.com/ItzMeShadow999/My-assets/main/features-header.svg" alt="Features" width="100%" />

- Custom profile badge: image, description, and color/shape/animation styling
- Multiple badges per user with one active at a time ("My Badges" rotation)
- Presets and importable/exportable badge packs
- Dedicated sidebar dashboard (black-themed) for managing badges without
  opening Discord's settings
- Badge data synced through a small Cloudflare Worker + KV backend, with
  server-side rate limiting

---

<details>
<summary><img src="https://files.catbox.moe/9d4gfc.png" width="30" height="30" align="absmiddle" /> $\Huge{\color{#FFB6C1}\textsf{Installation (click to expand)}}$</summary>
Follow the steps below to install the plugin manually.

### 1. Clone the Vencord repo & pnpm install
```
git clone https://github.com/Vendicated/Vencord
```
```
cd "YOURPATHHERE"
```
```
pnpm install
```
 
### 2. Locate your Vencord `userplugins` folder in `\Vencord\src`
 - If the folder doesn't exist, create it.
### 2. Create a new folder inside `userplugins` called `customBadges`
 
Copy every file from this project into it, keeping the same structure:
 
```
userplugins/customBadges/
├── index.tsx
├── native.ts
└── dashboard/
    ├── types.ts
    ├── bridge.ts
    ├── button.ts
    ├── buttonRegistry.ts
    ├── dashboardView.ts
    ├── html.ts
    └── wireSettings.ts
```
 
### 3. Rebuild Vencord
 
- Source build: run `pnpm build` (or `npm run build`), then `pnpm inject` if you haven't already injected Vencord into your Discord client.
- Installer-based build with plugin auto-detection: just restart Discord after copying the files in.
### 4. Enable the plugin
 
Open Discord → Vencord Settings → Plugins, find **CustomBadges**, and enable it.
 
### 5. Restart Discord
 
Ctrl/Cmd+R
 
</details>

<details>
<summary><img src="https://files.catbox.moe/4dplyc.png" width="30" height="30" align="absmiddle" /> $\Huge{\color{#FFB6C1}\textsf{Installation — Equicord (click to expand)}}$</summary>
Equicord is Vencord-based, so CustomBadges installs the exact same way — just point the clone at Equicord's repo instead of Vencord's.

### 1. Clone the Equicord repo & pnpm install
```
git clone https://github.com/Equicord/Equicord
```
```
cd "YOURPATHHERE"
```
```
pnpm install
```
 
### 2. Locate your Equicord `userplugins` folder in `\Equicord\src`
 - If the folder doesn't exist, create it.
### 2. Create a new folder inside `userplugins` called `customBadges`
 
Copy every file from this project into it, keeping the same structure:
 
```
userplugins/customBadges/
├── index.tsx
├── native.ts
└── dashboard/
    ├── types.ts
    ├── bridge.ts
    ├── button.ts
    ├── buttonRegistry.ts
    ├── dashboardView.ts
    ├── html.ts
    └── wireSettings.ts
```
 
### 3. Rebuild Equicord
 
- Source build: run `pnpm build` (or `npm run build`), then `pnpm inject` if you haven't already injected Equicord into your Discord client.
- Installer-based build with plugin auto-detection: just restart Discord after copying the files in.
### 4. Enable the plugin
 
Open Discord → Equicord Settings → Plugins, find **CustomBadges**, and enable it.
 
### 5. Restart Discord
 
Ctrl/Cmd+R
 
</details>

---

<img src="https://raw.githubusercontent.com/ItzMeShadow999/My-assets/main/usage-header.svg" alt="Usage" width="100%" />

- Open the plugin's settings tab in Vencord Settings to set your badge image,
  description, and style, **or**
- Use the new dashboard button added to your DM sidebar it opens a
  full-page dashboard where you can set your badge, switch between saved
  badges, import/apply presets, import a badge pack from a URL, or generate
  your own pack to share.
- Your badge is stored server-side (keyed to your Discord user ID) so it
  follows you across devices as long as the plugin is installed and enabled.

<img src="https://raw.githubusercontent.com/ItzMeShadow999/My-assets/main/backend-header.svg" alt="Backend (Self Hosting / Contributors)" width="100%" />

The `worker.js` + `wrangler.toml` in this project deploy to Cloudflare
Workers with a KV namespace for badge storage. If you want to run your own
instance instead of using the default endpoint:

1. `wrangler kv namespace create BADGES_KS` and put the resulting id into
   `wrangler.toml`.
2. `wrangler deploy`.
3. Point the plugin at your worker by passing your own `apiBase` where
   `native.ts`'s functions are called.

### Account Verification

Publishing, switching, or deleting a badge now requires proving you own the Discord account you're doing it as:

Click Verify Discord Account in settings. This opens your browser to the worker's /auth/start page.
Confirm you're signed in as the right account and follow the prompt there.
Copy the code it gives you back and paste it into the Session Token field in settings.

That token is what authorizes every write from then on (sent as a Bearer header) reading badges (yours or anyone else's) never required it and still doesn't. The token doesn't expire on its own; if a publish/switch/delete ever fails with an auth error, just re-verify and paste a fresh code. The token field itself is masked once you click away, so it's not left sitting in plain text in your settings.

If you ever lose track of your token, or think someone else got hold of it, hit Revoke Your Token this immediately kills that token server-side (on every device using it), and you'll need to verify again to get a new one.

---

## Badge Preview

**1. Hover** — shows the badge tooltip

<img src="https://files.catbox.moe/brmqre.png" width="500" />

**2. Click** — opens the full badge popup card

<img src="https://files.catbox.moe/unhdgj.png" width="500" />

---
<details> <summary><h2 style="display:inline-block; margin:0;"><img src="https://files.catbox.moe/gykp64.png" width="30" height="30" align="absmiddle" /> Update Catalog (click to expand)</h2></summary>

# CustomBadges — Patch Notes // V2
## Highlights

- **Account verification (session tokens)**   badge writes (set / switch / delete) now require a verified session token instead of being trusted on `userId` alone.
- **Dashboard gets its own opening/closing animation** and no longer hides Discord's real UI to render itself.
- **Standalone dashboard is now feature-complete with the Vencord settings tab**   tooltip/popup/owner-tag/mutual-guild toggles that previously only existed in Discord's native Settings are now wired into the dashboard too.
- **Badge Pack Sharing Guidelines panel**, in both the Vencord settings tab and the standalone dashboard, with a CRT power-off close animation.
- **Session token input** with an animated letter → dot masking effect.
- **Layout fix**: dashboard content no longer has a large dead gap on the left/right.

---

## `native.ts`

- Added `authHeaders()` / `requireSessionToken()` helpers.
- `setBadge`, `setActiveBadge`, `deleteBadge` now take a `sessionToken` argument and send it as a `Bearer` auth header; each throws `NOT_VERIFIED` if no token is present.
- Added `revokeOwnToken()`   calls `POST {apiBase}/self/revoke` to invalidate the current session token.

## `dashboard/bridge.ts`

- `DashboardBridge` interface extended with `verifyAccount`, `revokeSessionToken`, `switchToBadge`, `deleteBadgeSlot` so the standalone dashboard can call them (previously these lived only in `index.tsx` and weren't exposed to the dashboard).

## `dashboard/dashboardView.ts`

- **Mounting strategy changed**: the wrapper now mounts on `<body>` and is pinned over the main content area with `position: fixed` + `getBoundingClientRect()`, instead of being appended inside `mainArea` with its siblings hidden via `display: none`. Discord's message list and everything else underneath now keeps rendering normally the whole time   this is what fixed the blank-pane bug on close.
- Added a `resize` listener + light `setInterval` poll to reposition the wrapper if Discord's own layout shifts (sidebar/member-list toggle) without a `resize` event.
- **Open/close animation**: wrapper fades and scales in on open (`opacity 0→1`, `scale(0.97)→scale(1)`, slight `translateY`), and now animates back out on close instead of being removed instantly   `restoreDefaultView()` waits ~200ms before actually detaching it. Reopening mid-close cancels the pending removal.

## `dashboard/html.ts`

- New `shield` icon (used for the Account Verification section).
- New **Account Verification** section: Verify / Revoke buttons + session token field.
- New **session token input** styling   text is painted transparent over a real `<input>`, with a per-character overlay that morphs each letter into a masking dot on blur (and back on focus), including scroll-sync so it stays aligned once the token overflows the field width.
- New **preference toggle switches** in the dashboard itself (tooltip, popup, owner tag, append Vencord tag, hide own badge, restrict to mutual servers)   previously these only existed in Discord's native Settings tab.
- New **`ub-btn-danger-solid`** / **`ub-btn-link`** button styles.
- New **Badge Pack Sharing Guidelines panel** (`#ub-guidelines-panel` + backdrop)   format spec, pack-size note, content rules, submission steps, and a "Got it" close button. Closes with a CRT-style power-off collapse + flash instead of a plain fade.
- **Layout fix**: `.contentSection_b6bcee` / `.content_b6bcee` (Discord's own settings classes) were inheriting centering meant for a page that sits next to a nav sidebar; since the dashboard doesn't render that sidebar, this left a large empty gap on the left (and right) of the cards. Now forced flush-left and full-width.

## `dashboard/wireSettings.ts`

- Added `wireSwitch()` / `setSwitchValue()` generic toggle wiring, used for all the new dashboard preference switches.
- Added the session-token masking logic: `buildTokenChars()`, `setTokenMasked()`, `syncOverlayScroll()`, `escapeHtml()`.
- Added `openGuidelines()` / `closeGuidelines()` for the new guidelines panel (open resets and restarts the transition so it can be reopened right after closing; close waits out the 340ms CRT animation before clearing state).
- Added `updatePopupLockState()`   disables the popup/owner-tag controls when badge mode is `"vencord"` (Vencord Classic mode can't support the click-to-view popup).
- Added `renderMyBadgesList()`.

## `index.tsx`

- `describeBadgeApiError()` now handles the `NOT_VERIFIED` error kind.
- New settings entries: `verifyAccount` (opens `{apiBase}/auth/start` via Discord OAuth, identify scope only), `sessionToken`, `revokeToken`.
- New `verifyDiscordAccount()` and `revokeSessionToken()` functions.
- New `SessionTokenInput` and `RevokeTokenButton` React components (Vencord settings tab equivalent of the dashboard's token field/masking behavior).
- `switchToBadge()` and `deleteBadgeSlot()` are now `export`ed and pass `settings.store.sessionToken` through to `setActiveBadge` / `deleteBadge`.
- `setBadge` call site updated to pass the session token.
- Added `renderJsonHighlighted()`   simple JSON syntax highlighter (keys/strings/numbers/literals/punctuation) used when previewing a pack's JSON.
- Added `PackGuidelinesModal` component   the Vencord-settings-tab version of the guidelines panel, same CRT power-off close animation.
- "Make Pack" button extracted into its own `MakePackButton` component; badge pack action buttons grouped into `BadgePacksButtonsRow`.

## Unchanged

`dashboard/button.ts`, `dashboard/buttonRegistry.ts`, `dashboard/types.ts`   no differences.
</details>

---


<img src="https://raw.githubusercontent.com/ItzMeShadow999/My-assets/main/license-header.svg" alt="License" width="100%" />

This plugin is built for and depends on [Vencord](https://github.com/Vendicated/Vencord),
which is licensed under the **GNU General Public License v3.0 (or later)**.
In keeping with that, this plugin is also distributed under **GPL-3.0-or-later**.

That means: you're free to use, study, modify, and share this plugin, but if
you distribute a modified version, you must also make its source available
under the same license. See the full license text at
https://www.gnu.org/licenses/gpl-3.0.html, or the `LICENSE` file in this
project for the standard notice.

This is a third-party plugin and isn't affiliated with, endorsed by, or
supported by Discord Inc. Use of client modifications is against Discord's
Terms of Service  use at your own risk.

<img src="https://raw.githubusercontent.com/ItzMeShadow999/My-assets/main/community-header.svg" alt="Community & Support" width="100%" />

- **Found someone using this plugin to display NSFW, hateful, or otherwise
  abusive badge content?** Please report it  don't just block and move on.
- **Something broken or not working as expected?**
  1. Check the [FAQs](https://discord.com/channels/1533400308074549340/1533404426562179103) first  your issue may already be answered there.
  2. If it's not covered, ask in the [issues help chat](https://discord.com/channels/1533400308074549340/1533400758769287198).
  3. To report a bug, abuse, or a badge that violates the rules, use the [Reports chat](https://discord.com/channels/1533400308074549340/1533400476505215106).
- Join the server here: https://discord.gg/PUYaka9Hy8
- You can optionally tag [Shadow](https://discord.com/users/1065604516399026176) in the relevant channel for visibility  **please don't send DMs**, they're most likely filtered out and won't be seen.
