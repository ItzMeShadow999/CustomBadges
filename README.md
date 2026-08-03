<div align="center">

<img src="https://vencord.dev/assets/logo.png" alt="Vencord logo" width="90" />

# Custom Badges

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

## Features

- Custom profile badge: image, description, and color/shape/animation styling
- Multiple badges per user with one active at a time ("My Badges" rotation)
- Presets and importable/exportable badge packs
- Dedicated sidebar dashboard (black-themed) for managing badges without
  opening Discord's settings
- Badge data synced through a small Cloudflare Worker + KV backend, with
  server-side rate limiting

---

<details>
<summary><h2 style="display:inline-block; margin:0;"><img src="https://files.catbox.moe/9d4gfc.png" width="40" height="40" align="absmiddle" /> Installation (click to expand)</h2></summary>
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

## Usage

- Open the plugin's settings tab in Vencord Settings to set your badge image,
  description, and style, **or**
- Use the new dashboard button added to your DM sidebar it opens a
  full-page dashboard where you can set your badge, switch between saved
  badges, import/apply presets, import a badge pack from a URL, or generate
  your own pack to share.
- Your badge is stored server-side (keyed to your Discord user ID) so it
  follows you across devices as long as the plugin is installed and enabled.

### Backend (for self-hosting / contributors)

The `worker.js` + `wrangler.toml` in this project deploy to Cloudflare
Workers with a KV namespace for badge storage. If you want to run your own
instance instead of using the default endpoint:

1. `wrangler kv namespace create BADGES_KS` and put the resulting id into
   `wrangler.toml`.
2. `wrangler deploy`.
3. Point the plugin at your worker by passing your own `apiBase` where
   `native.ts`'s functions are called.

## License

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

## Community & Support

- **Found someone using this plugin to display NSFW, hateful, or otherwise
  abusive badge content?** Please report it  don't just block and move on.
- **Something broken or not working as expected?**
  1. Check the [FAQs](https://discord.com/channels/1533400308074549340/1533404426562179103) first  your issue may already be answered there.
  2. If it's not covered, ask in the [issues help chat](https://discord.com/channels/1533400308074549340/1533400758769287198).
  3. To report a bug, abuse, or a badge that violates the rules, use the [Reports chat](https://discord.com/channels/1533400308074549340/1533400476505215106).
- Join the server here: https://discord.gg/PUYaka9Hy8
- You can optionally tag [Shadow](https://discord.com/users/1065604516399026176) in the relevant channel for visibility  **please don't send DMs**, they're most likely filtered out and won't be seen.
