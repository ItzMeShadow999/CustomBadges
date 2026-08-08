export function buttonHtml(label = "User Dashboard", iconSvg?: string, isSelected = false): string {
    const selectedClass = isSelected ? "selected__972a0 selected_f88cfd" : "";

    const defaultIcon = `
        <svg class="linkButtonIcon__972a0" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M4 13h6a1 1 0 001-1V4a1 1 0 00-1-1H4a1 1 0 00-1 1v8a1 1 0 001 1zm1-8h4v6H5V5zm9 16h6a1 1 0 001-1v-8a1 1 0 00-1-1h-6a1 1 0 00-1 1v8a1 1 0 001 1zm1-8h4v6h-4v-6zM4 21h6a1 1 0 001-1v-4a1 1 0 00-1-1H4a1 1 0 00-1 1v4a1 1 0 001 1zm1-4h4v2H5v-2zm9-8h6a1 1 0 001-1V4a1 1 0 00-1-1h-6a1 1 0 00-1 1v4a1 1 0 001 1zm1-4h4v2h-4V5z"/>
        </svg>
    `;

    return `
        <div class="interactive_f88cfd interactive__972a0 linkButton__972a0 ${selectedClass}">
            <a class="link__972a0" style="cursor:pointer" tabindex="-1">
                <div class="layout__20a53 avatarWithText__972a0">
                    <div class="avatar__20a53">
                        ${iconSvg || defaultIcon}
                    </div>
                    <div class="content__20a53">
                        <div class="nameAndDecorators__20a53">
                            <div class="name__20a53 text-md/medium_cf4812">
                                ${label}
                            </div>
                        </div>
                    </div>
                </div>
            </a>
        </div>
    `;
}

export function headerBarHtml(): string {
    return `
        <section class="headerBar__1a9ce container__9293f themed__9293f" style="background-color: #000000; border-bottom: 1px solid rgba(255,255,255,0.06); font-family: 'gg sans', 'Noto Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;">
            <div class="upperContainer__9293f">
                <div class="children__9293f">
                    <svg aria-hidden="true" role="img" width="20" height="20" fill="none" viewBox="0 0 24 24" style="color: #949BA4; flex-shrink: 0;">
                        <path fill="currentColor" d="M4 13h6a1 1 0 001-1V4a1 1 0 00-1-1H4a1 1 0 00-1 1v8a1 1 0 001 1zm1-8h4v6H5V5zm9 16h6a1 1 0 001-1v-8a1 1 0 00-1-1h-6a1 1 0 00-1 1v8a1 1 0 001 1zm1-8h4v6h-4v-6zM4 21h6a1 1 0 001-1v-4a1 1 0 00-1-1H4a1 1 0 00-1 1v4a1 1 0 001 1zm1-4h4v2H5v-2zm9-8h6a1 1 0 001-1V4a1 1 0 00-1-1h-6a1 1 0 00-1 1v4a1 1 0 001 1zm1-4h4v2h-4V5z"/>
                    </svg>

                    <div class="container__26669">
                        <div class="tabs__26669 ub-tabs-container" role="tablist" id="ub-tabs-container">
                            <div class="tabWrapper__26669 titleWrapper__9293f ub-dash-tab" role="tab" tabindex="0" aria-selected="true" data-tab="badges" id="ub-tab-badges">
                                <h1 class="defaultColor__4bd52 text-md/medium_cf4812 tab__26669 selected__26669 title__9293f" data-text-variant="text-md/medium">
                                    Custom Badges
                                </h1>
                            </div>
                            <div class="tabWrapper__26669 titleWrapper__9293f ub-dash-tab" role="tab" tabindex="0" aria-selected="false" data-tab="style" id="ub-tab-style">
                                <h1 class="defaultColor__4bd52 text-md/medium_cf4812 tab__26669 title__9293f" data-text-variant="text-md/medium">
                                    Style Studio
                                </h1>
                            </div>
                            <div class="ub-tab-underline" id="ub-tab-underline"></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    `;
}

export function dashboardHtml(presetLabels: string[] = []): string {
    
    const icon = {
        
        toggle: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="10" rx="5"/><circle cx="15.5" cy="12" r="2.75" fill="currentColor" stroke="none"/></svg>`,
        
        pencil: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 19.5l1-4L16 5l3 3-10.5 10.5-4 1z"/><path d="M14 6.5l3 3"/></svg>`,
        
        eye: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12c2.5-4.2 6.2-6.5 10-6.5s7.5 2.3 10 6.5c-2.5 4.2-6.2 6.5-10 6.5S4.5 16.2 2 12z"/><circle cx="12" cy="12" r="2.75"/></svg>`,
        
        bolt: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><polyline points="2 6 8 12 2 18"/><polyline points="9 6 15 12 9 18"/><polyline points="16 6 22 12 16 18"/></svg>`,
        grid: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>`,
        
        box: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L20 6.5V15.5L12 20L4 15.5V6.5L12 2Z"/><path d="M12 2V11M12 11L20 6.5M12 11L4 6.5"/><path d="M14.5 5L14.5 9L17.5 7.5L17.5 3.7Z"/><path d="M6 13.2l3.4 1.7M6 15l2.6 1.3"/></svg>`,
        check: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
        trash: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>`,
        plus: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
        shield: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z"/><polyline points="9 12 11 14 15 10"/></svg>`
    };

    return `
        <style>
            
            #ub-dashboard-settings {
                --ub-bg: #000000;
                --ub-bg-card: #050505;
                --ub-bg-card-hover: #0a0a0a;
                --ub-bg-input: #0a0a0a;
                --ub-bg-input-hover: #0f0f0f;
                --ub-border: rgba(255, 255, 255, 0.06);
                --ub-border-strong: rgba(255, 255, 255, 0.10);
                --ub-text: #F2F3F5;
                --ub-text-secondary: #DBDEE1;
                --ub-text-muted: #B5BAC1;
                --ub-text-faint: #949BA4;
                --ub-accent: #5865F2;
                --ub-accent-2: #7289DA;
                --ub-accent-hover: #4752C4;
                --ub-accent-soft: rgba(88, 101, 242, 0.15);
                --ub-danger: #DA373C;
                --ub-positive: #23A55A;
                --ub-warning: #F0B232;
                --ub-radius-lg: 12px;
                --ub-radius: 8px;
                --ub-radius-sm: 6px;
                --ub-font: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;

                background-color: var(--ub-bg);
                color: var(--ub-text);
                font-family: var(--ub-font);
                font-size: 16px;
                line-height: 1.5;
                -webkit-font-smoothing: antialiased;
            }

            #ub-dashboard-settings * {
                font-family: var(--ub-font);
                box-sizing: border-box;
            }

            #ub-dashboard-settings .ub-section {
                background: var(--ub-bg-card);
                border: 1px solid var(--ub-border);
                border-radius: var(--ub-radius-lg);
                padding: 20px;
                margin-bottom: 16px;
                transition: border-color 150ms ease, background-color 150ms ease;
            }

            #ub-dashboard-settings .ub-section:hover {
                border-color: var(--ub-border-strong);
            }

            #ub-dashboard-settings .ub-section-head {
                display: flex;
                align-items: center;
                gap: 10px;
                margin-bottom: 16px;
                padding-left: 10px;
                border-left: 2px solid var(--ub-accent-2);
            }

            #ub-dashboard-settings .ub-section-icon {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 20px;
                height: 20px;
                color: var(--ub-accent-2);
                flex-shrink: 0;
                opacity: 0.9;
            }

            #ub-dashboard-settings .ub-eyebrow {
                font-size: 12px;
                font-weight: 700;
                letter-spacing: 0.03em;
                text-transform: uppercase;
                color: var(--ub-text-muted);
            }

            #ub-dashboard-settings .ub-section-title {
                font-size: 16px;
                font-weight: 600;
                color: var(--ub-text);
                margin: 0;
            }

            #ub-dashboard-settings .ub-field {
                margin-bottom: 16px;
            }

            #ub-dashboard-settings .ub-field:last-child {
                margin-bottom: 0;
            }

            #ub-dashboard-settings .ub-label {
                display: block;
                font-size: 12px;
                font-weight: 700;
                letter-spacing: 0.02em;
                text-transform: uppercase;
                color: var(--ub-text-muted);
                margin-bottom: 8px;
            }

            #ub-dashboard-settings .ub-hint {
                font-size: 14px;
                line-height: 1.5;
                color: var(--ub-text-faint);
                margin: 0 0 14px;
            }

            #ub-dashboard-settings .ub-input,
            #ub-dashboard-settings .ub-select {
                width: 100%;
                background: rgba(255, 255, 255, 0.04);
                backdrop-filter: blur(12px);
                -webkit-backdrop-filter: blur(12px);
                border: 1px solid rgba(255, 255, 255, 0.10);
                border-top-color: rgba(255, 255, 255, 0.16);
                border-radius: var(--ub-radius-sm);
                padding: 10px 12px;
                min-height: 40px;
                color: var(--ub-text);
                font-size: 14px;
                font-weight: 400;
                box-shadow:
                    inset 0 1px 0 rgba(255, 255, 255, 0.07),
                    0 2px 8px rgba(0, 0, 0, 0.35);
                transition: border-color 150ms ease, background 150ms ease, box-shadow 150ms ease;
            }

            #ub-dashboard-settings .ub-input::placeholder {
                color: var(--ub-text-faint);
            }

            #ub-dashboard-settings .ub-input:hover,
            #ub-dashboard-settings .ub-select:hover {
                background: rgba(255, 255, 255, 0.07);
                border-color: rgba(255, 255, 255, 0.18);
                border-top-color: rgba(255, 255, 255, 0.24);
                box-shadow:
                    inset 0 1px 0 rgba(255, 255, 255, 0.10),
                    0 2px 12px rgba(0, 0, 0, 0.4);
            }

            #ub-dashboard-settings .ub-input:focus-visible,
            #ub-dashboard-settings .ub-select:focus-visible {
                outline: none;
                background: rgba(255, 255, 255, 0.06);
                border-color: rgba(88, 101, 242, 0.6);
                border-top-color: rgba(88, 101, 242, 0.8);
                box-shadow:
                    inset 0 1px 0 rgba(255, 255, 255, 0.08),
                    0 0 0 3px rgba(88, 101, 242, 0.18),
                    0 2px 12px rgba(0, 0, 0, 0.4);
            }

            #ub-dashboard-settings .ub-select {
                cursor: pointer;
                appearance: none;
                background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23949ba4' stroke-width='2'><path d='M6 9l6 6 6-6'/></svg>");
                background-repeat: no-repeat;
                background-position: right 12px center;
                padding-right: 36px;
            }

            #ub-dashboard-settings .ub-btn {
                appearance: none;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                gap: 6px;
                border: none;
                border-radius: var(--ub-radius-sm);
                padding: 0 16px;
                min-height: 38px;
                font-size: 14px;
                font-weight: 600;
                cursor: pointer;
                color: var(--ub-text-secondary);
                background: #101010;
                border: 1px solid var(--ub-border-strong);
                transition: background-color 120ms ease, border-color 120ms ease, transform 80ms ease, color 120ms ease;
            }

            #ub-dashboard-settings .ub-btn:hover {
                background: #161616;
                border-color: rgba(255, 255, 255, 0.2);
                color: var(--ub-text);
            }

            #ub-dashboard-settings .ub-btn:active {
                transform: scale(0.97);
            }

            #ub-dashboard-settings .ub-btn:focus-visible {
                outline: none;
                box-shadow: 0 0 0 3px var(--ub-accent-soft);
                border-color: var(--ub-accent);
            }

            #ub-dashboard-settings .ub-btn-primary {
                background: var(--ub-accent);
                border-color: var(--ub-accent);
                color: #ffffff;
            }

            #ub-dashboard-settings .ub-btn-primary:hover {
                background: var(--ub-accent-hover);
                border-color: var(--ub-accent-hover);
                color: #ffffff;
            }

            #ub-dashboard-settings .ub-btn-danger {
                background: transparent;
                border-color: var(--ub-border-strong);
                color: var(--ub-danger);
            }

            #ub-dashboard-settings .ub-btn-danger:hover {
                background: rgba(218, 55, 60, 0.12);
                border-color: var(--ub-danger);
                color: #ff5c60;
            }

            #ub-dashboard-settings .ub-btn-danger-solid {
                background: var(--ub-danger);
                border-color: var(--ub-danger);
                color: #ffffff;
            }

            #ub-dashboard-settings .ub-btn-danger-solid:hover {
                background: #c42f33;
                border-color: #c42f33;
                color: #ffffff;
            }

            #ub-dashboard-settings .ub-btn-danger-solid:disabled {
                opacity: 0.5;
                cursor: default;
            }

            #ub-dashboard-settings .ub-btn-row {
                display: flex;
                flex-wrap: wrap;
                align-items: center;
                gap: 8px;
                margin-bottom: 16px;
            }

            #ub-dashboard-settings .ub-btn-link {
                appearance: none;
                background: none;
                border: none;
                padding: 0 4px;
                min-height: 38px;
                font-size: 13px;
                font-weight: 600;
                color: var(--ub-accent-2);
                cursor: pointer;
                transition: color 120ms ease;
            }

            #ub-dashboard-settings .ub-btn-link:hover {
                color: var(--ub-accent);
                text-decoration: underline;
            }

            #ub-dashboard-settings .ub-btn-link:focus-visible {
                outline: none;
                text-decoration: underline;
            }

            
            #ub-dashboard-settings .ub-token-wrap {
                position: relative;
            }

            #ub-dashboard-settings .ub-token-wrap input#ub-session-token::selection {
                color: transparent;
                background: var(--ub-accent-soft);
            }

            #ub-dashboard-settings .ub-token-wrap input#ub-session-token {
                color: transparent;
                caret-color: var(--ub-text);
                
                height: 40px;
                padding-top: 0;
                padding-bottom: 0;
                
                font-family: var(--font-code, Consolas, "Courier New", monospace);
                font-size: 14px;
                letter-spacing: 0;
            }

            #ub-dashboard-settings .ub-token-wrap input#ub-session-token.ub-token-empty {
                color: var(--ub-text-faint);
            }

            #ub-dashboard-settings .ub-token-overlay {
                position: absolute;
                inset: 0;
                height: 40px;
                
                border: 1px solid transparent;
                padding: 0 12px;
                pointer-events: none;
                overflow: hidden;
                font-family: var(--font-code, Consolas, "Courier New", monospace);
                font-size: 14px;
                line-height: 1;
                letter-spacing: 0;
            }

            #ub-dashboard-settings .ub-token-overlay-inner {
                display: block;
                height: 40px;
                line-height: 40px;
                white-space: nowrap;
                overflow-wrap: normal;
                word-break: keep-all;
                word-wrap: normal;
                
            }

            #ub-dashboard-settings .ub-token-overlay,
            #ub-dashboard-settings .ub-token-overlay * {
                font-family: var(--font-code, Consolas, "Courier New", monospace);
            }

            #ub-dashboard-settings .ub-token-char {
                position: relative;
                display: inline-block;
                vertical-align: middle;
                white-space: nowrap;
                overflow-wrap: normal;
                word-break: keep-all;
                word-wrap: normal;
                
                width: 1ch;
                height: 1em;
                line-height: 1;
                text-align: center;
            }

            #ub-dashboard-settings .ub-token-glyph {
                position: absolute;
                inset: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                transition: opacity 240ms ease, transform 240ms cubic-bezier(0.34, 1.56, 0.64, 1);
            }

            #ub-dashboard-settings .ub-token-glyph-letter {
                transform: translateY(-8px) scale(0.3) rotate(-20deg);
            }

            #ub-dashboard-settings .ub-token-glyph-dot {
                transform: translateY(8px) scale(0.3) rotate(20deg);
            }

            #ub-dashboard-settings .ub-token-glyph.ub-token-shown {
                opacity: 1;
                transform: translateY(0) scale(1) rotate(0deg);
            }

            
            #ub-guidelines-backdrop {
                display: none;
                position: fixed;
                inset: 0;
                z-index: 9998;
                background: rgba(0, 0, 0, 0.6);
                backdrop-filter: blur(3px);
                -webkit-backdrop-filter: blur(3px);
                opacity: 0;
                transition: opacity 260ms ease;
                pointer-events: none;
            }

            #ub-guidelines-backdrop.ub-backdrop-open {
                display: block;
                opacity: 1;
                pointer-events: auto;
            }

            
            
            .ub-guidelines-panel {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%) scale(0.94);
                width: 500px;
                max-width: 92vw;
                max-height: 84vh;
                z-index: 9999;
                background: #111214;
                border: 1px solid rgba(255,255,255,0.10);
                border-radius: 14px;
                box-shadow:
                    0 0 0 1px rgba(255,255,255,0.04),
                    0 8px 16px rgba(0,0,0,0.4),
                    0 24px 56px rgba(0,0,0,0.7);
                display: flex;
                flex-direction: column;
                padding: 28px 32px 32px;
                color: #F2F3F5;
                font-size: 14px;
                font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
                line-height: 1.6;
                overflow-y: auto;
                opacity: 0;
                transform-origin: center center;
                pointer-events: none;
                scrollbar-width: thin;
                scrollbar-color: #4a4a50 #1a1a1d;
                box-sizing: border-box;
            }

            .ub-guidelines-panel * {
                box-sizing: border-box;
                font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
            }

            .ub-guidelines-panel::-webkit-scrollbar {
                width: 10px;
            }

            .ub-guidelines-panel::-webkit-scrollbar-track {
                background: #1a1a1d;
                border-radius: 8px;
            }

            .ub-guidelines-panel::-webkit-scrollbar-thumb {
                background: #4a4a50;
                border-radius: 8px;
                border: 2px solid #1a1a1d;
            }

            .ub-guidelines-panel::-webkit-scrollbar-thumb:hover {
                background: #5c5c63;
            }

            .ub-guidelines-panel.ub-panel-open {
                transform: translate(-50%, -50%) scale(1);
                opacity: 1;
                pointer-events: auto;
                transition: transform 320ms cubic-bezier(0.16, 1, 0.3, 1), opacity 260ms ease-out;
            }

            .ub-guidelines-panel.ub-panel-closing {
                pointer-events: none;
                animation: ub-crt-off 340ms cubic-bezier(0.86, 0, 0.07, 1) forwards;
            }

            .ub-guidelines-panel.ub-panel-closing::after {
                content: "";
                position: absolute;
                inset: 0;
                background: #fff;
                opacity: 0;
                pointer-events: none;
                animation: ub-crt-flash 340ms ease-in forwards;
            }

            @keyframes ub-crt-off {
                0% { transform: translate(-50%, -50%) scaleY(1) scaleX(1); filter: brightness(1); opacity: 1; }
                45% { transform: translate(-50%, -50%) scaleY(0.015) scaleX(1); filter: brightness(2.2); opacity: 1; }
                70% { transform: translate(-50%, -50%) scaleY(0.015) scaleX(0.02); filter: brightness(2.6); opacity: 0.6; }
                100% { transform: translate(-50%, -50%) scaleY(0.015) scaleX(0.0001); filter: brightness(3); opacity: 0; }
            }

            @keyframes ub-crt-flash {
                0% { opacity: 0; }
                35% { opacity: 0.55; }
                55% { opacity: 0.15; }
                100% { opacity: 0; }
            }

            .ub-guidelines-close {
                position: absolute;
                top: 14px;
                right: 18px;
                background: none;
                border: none;
                color: #949BA4;
                font-size: 20px;
                cursor: pointer;
                line-height: 1;
                z-index: 1;
            }

            .ub-guidelines-close:hover {
                color: #F2F3F5;
            }

            .ub-guidelines-h2 {
                font-size: 20px;
                font-weight: 800;
                margin-bottom: 10px;
                color: #F2F3F5;
                letter-spacing: -0.01em;
                line-height: 1.3;
            }

            .ub-guidelines-h3 {
                font-size: 15px;
                font-weight: 700;
                margin: 18px 0 6px;
                color: #F2F3F5;
            }

            .ub-guidelines-code {
                display: block;
                background: #0a0a0a;
                border: 1px solid rgba(255,255,255,0.08);
                border-radius: 6px;
                padding: 14px 16px;
                font-family: "Consolas", "Menlo", "Courier New", monospace;
                font-size: 13px;
                line-height: 1.65;
                white-space: pre;
                overflow-x: auto;
                margin: 8px 0;
            }

            .ub-guidelines-code .k { color: #9cdcfe; }
            .ub-guidelines-code .s { color: #ce9178; }
            .ub-guidelines-code .n { color: #b5cea8; }
            .ub-guidelines-code .p { color: #808080; }

            .ub-guidelines-inline-code {
                background: #0a0a0a;
                border: 1px solid rgba(255,255,255,0.08);
                border-radius: 4px;
                padding: 1px 5px;
                font-family: "Consolas", "Menlo", "Courier New", monospace;
                font-size: 12px;
                color: #ce9178;
            }

            .ub-guidelines-note {
                background: #0f0f0f;
                border-radius: 6px;
                padding: 8px 12px;
                margin: 8px 0;
                border-left: 3px solid #949BA4;
                color: #DBDEE1;
                font-size: 13px;
            }

            .ub-guidelines-warn {
                background: #0f0f0f;
                border-radius: 6px;
                padding: 8px 12px;
                margin: 8px 0;
                border-left: 3px solid #F0B232;
                color: #DBDEE1;
                font-size: 13px;
            }

            .ub-guidelines-panel ul,
            .ub-guidelines-panel ol {
                margin: 6px 0 0 18px;
                padding: 0;
                color: #DBDEE1;
                font-size: 13.5px;
            }

            .ub-guidelines-panel li {
                margin-bottom: 4px;
            }

            .ub-guidelines-panel a {
                color: #7289DA;
                text-decoration: none;
            }

            .ub-guidelines-panel a:hover {
                text-decoration: underline;
            }

            .ub-guidelines-panel strong {
                color: #F2F3F5;
                font-weight: 700;
            }

            .ub-guidelines-panel .ub-btn {
                appearance: none;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                gap: 6px;
                border-radius: 6px;
                padding: 0 16px;
                min-height: 38px;
                font-size: 14px;
                font-weight: 600;
                cursor: pointer;
                transition: background-color 120ms ease, transform 80ms ease;
            }

            .ub-guidelines-panel .ub-btn-primary {
                background: #5865F2;
                border: 1px solid #5865F2;
                color: #ffffff;
            }

            .ub-guidelines-panel .ub-btn-primary:hover {
                background: #4752C4;
                border-color: #4752C4;
            }

            .ub-guidelines-panel .ub-btn-primary:active {
                transform: scale(0.97);
            }

            #ub-dashboard-settings .ub-preview-empty {
                font-size: 13px;
                color: var(--ub-text-faint);
                padding: 4px 0;
            }

            #ub-dashboard-settings .ub-preview-row {
                display: flex;
                align-items: center;
                gap: 10px;
                margin-bottom: 16px;
            }

            #ub-dashboard-settings .ub-preview-row-icon {
                object-fit: contain;
                flex-shrink: 0;
                display: block;
            }

            #ub-dashboard-settings .ub-preview-row-label {
                font-size: 12px;
                color: var(--ub-text-faint);
            }

            #ub-dashboard-settings .ub-popup-card {
                border-radius: 8px;
                padding: 20px 28px;
                text-align: center;
                min-width: 180px;
                width: fit-content;
                margin: 0;
                box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
                font-family: var(--font-primary, "gg sans", sans-serif);
                transition: background 160ms ease;
            }

            #ub-dashboard-settings .ub-popup-card img {
                width: 64px;
                height: 64px;
                object-fit: cover;
                margin: 0 auto 14px;
                display: block;
            }

            #ub-dashboard-settings .ub-popup-name {
                font-weight: 800;
                font-size: 16px;
                letter-spacing: 0.3px;
                line-height: 1.2;
            }

            #ub-dashboard-settings .ub-popup-by {
                font-size: 12px;
                color: #949ba4;
                margin-top: 4px;
            }

            #ub-dashboard-settings .ub-preview-warning {
                font-size: 11px;
                color: #f0b132;
                margin-top: 12px;
                line-height: 1.5;
            }

            #ub-dashboard-settings .ub-badge-row {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 10px 14px;
                background: var(--ub-bg-input);
                border: 1px solid var(--ub-border);
                border-radius: var(--ub-radius-sm);
                margin-bottom: 8px;
                transition: background-color 120ms ease, border-color 120ms ease;
            }

            #ub-dashboard-settings .ub-badge-row:hover {
                background: var(--ub-bg-input-hover);
                border-color: var(--ub-border-strong);
            }

            #ub-dashboard-settings .ub-badge-row.ub-badge-active {
                background: rgba(88, 101, 242, 0.10);
                border-color: rgba(88, 101, 242, 0.45);
                box-shadow: inset 0 0 0 1px rgba(88, 101, 242, 0.15);
            }

            #ub-dashboard-settings .ub-badge-thumb {
                width: 28px;
                height: 28px;
                border-radius: 50%;
                object-fit: cover;
                flex-shrink: 0;
                background: rgba(255,255,255,0.06);
                border: 1px solid var(--ub-border-strong);
            }

            #ub-dashboard-settings .ub-badge-row-name {
                flex: 1;
                font-size: 14px;
                font-weight: 500;
                color: var(--ub-text);
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            #ub-dashboard-settings .ub-badge-row-name .ub-badge-active-tag {
                font-size: 12px;
                font-weight: 600;
                color: var(--ub-text-muted);
                margin-left: 6px;
            }

            #ub-dashboard-settings .ub-badge-row-actions {
                display: flex;
                align-items: center;
                gap: 6px;
                flex-shrink: 0;
            }

            #ub-dashboard-settings .ub-badge-use-btn {
                appearance: none;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                border-radius: var(--ub-radius-sm);
                padding: 0 14px;
                min-height: 32px;
                font-size: 13px;
                font-weight: 600;
                cursor: pointer;
                background: var(--ub-accent);
                border: 1px solid var(--ub-accent);
                color: #ffffff;
                transition: background-color 120ms ease, border-color 120ms ease, transform 80ms ease;
            }
            #ub-dashboard-settings .ub-badge-use-btn:hover {
                background: var(--ub-accent-hover);
                border-color: var(--ub-accent-hover);
            }
            #ub-dashboard-settings .ub-badge-use-btn:active { transform: scale(0.96); }

            #ub-dashboard-settings .ub-badge-delete-btn {
                appearance: none;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                border-radius: var(--ub-radius-sm);
                padding: 0 14px;
                min-height: 32px;
                font-size: 13px;
                font-weight: 600;
                cursor: pointer;
                background: var(--ub-danger);
                border: 1px solid var(--ub-danger);
                color: #ffffff;
                transition: background-color 120ms ease, border-color 120ms ease, transform 80ms ease;
            }
            #ub-dashboard-settings .ub-badge-delete-btn:hover {
                background: #c42f33;
                border-color: #c42f33;
            }
            #ub-dashboard-settings .ub-badge-delete-btn:active { transform: scale(0.96); }

            #ub-dashboard-settings #ub-my-badges-list:empty::after {
                content: "No saved badges yet";
                font-size: 13px;
                color: var(--ub-text-faint);
                font-style: italic;
                display: block;
                padding: 4px 0 10px;
            }

            #ub-dashboard-settings .ub-divider {
                display: none;
            }

            #ub-dashboard-settings a:focus-visible,
            #ub-dashboard-settings button:focus-visible {
                outline: none;
            }

            @keyframes ub-gradient-flow {
                0%   { background-position: 0% 50%; }
                20%  { background-position: 80% 50%; }
                40%  { background-position: 160% 50%; }
                60%  { background-position: 240% 50%; }
                80%  { background-position: 320% 50%; }
                100% { background-position: 400% 50%; }
            }

            .ub-gradient-text {
                background: linear-gradient(90deg,
                    #2d3899,
                    #3a45a8,
                    #4752c4,
                    #4f5ed6,
                    #5865f2,
                    #5f6ef3,
                    #6677f4,
                    #7289da,
                    #6677f4,
                    #5f6ef3,
                    #5865f2,
                    #4f5ed6,
                    #4752c4,
                    #3a45a8,
                    #2d3899
                );
                background-size: 400% auto;
                -webkit-background-clip: text;
                background-clip: text;
                -webkit-text-fill-color: transparent;
                color: transparent;
                animation: ub-gradient-flow 14s ease-in-out infinite;
            }

            #ub-dashboard-settings .ub-dropdown {
                position: relative;
                width: 100%;
                user-select: none;
            }

            #ub-dashboard-settings .ub-dropdown-trigger {
                display: flex;
                align-items: center;
                justify-content: space-between;
                width: 100%;
                background: rgba(255, 255, 255, 0.04);
                backdrop-filter: blur(12px);
                -webkit-backdrop-filter: blur(12px);
                border: 1px solid rgba(255, 255, 255, 0.10);
                border-top-color: rgba(255, 255, 255, 0.16);
                border-radius: var(--ub-radius-sm);
                padding: 10px 12px;
                min-height: 40px;
                color: var(--ub-text);
                font-size: 14px;
                cursor: pointer;
                box-shadow:
                    inset 0 1px 0 rgba(255, 255, 255, 0.07),
                    0 2px 8px rgba(0, 0, 0, 0.35);
                transition: border-color 150ms ease, background 150ms ease, box-shadow 150ms ease;
            }

            #ub-dashboard-settings .ub-dropdown-trigger:hover {
                background: rgba(255, 255, 255, 0.07);
                border-color: rgba(255, 255, 255, 0.18);
                border-top-color: rgba(255, 255, 255, 0.24);
            }

            #ub-dashboard-settings .ub-dropdown.open .ub-dropdown-trigger {
                border-color: rgba(88, 101, 242, 0.6);
                border-top-color: rgba(88, 101, 242, 0.8);
                box-shadow:
                    inset 0 1px 0 rgba(255, 255, 255, 0.08),
                    0 0 0 3px rgba(88, 101, 242, 0.18);
                border-bottom-left-radius: 0;
                border-bottom-right-radius: 0;
            }

            #ub-dashboard-settings .ub-dropdown-arrow {
                flex-shrink: 0;
                color: var(--ub-text-faint);
                transition: transform 180ms ease;
            }

            #ub-dashboard-settings .ub-dropdown.open .ub-dropdown-arrow {
                transform: rotate(180deg);
            }

            #ub-dashboard-settings .ub-dropdown-menu {
                display: none;
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                z-index: 999;
                background: rgba(10, 10, 18, 0.82);
                backdrop-filter: blur(20px);
                -webkit-backdrop-filter: blur(20px);
                border: 1px solid rgba(88, 101, 242, 0.4);
                border-top: none;
                border-bottom-left-radius: var(--ub-radius-sm);
                border-bottom-right-radius: var(--ub-radius-sm);
                box-shadow:
                    0 8px 32px rgba(0, 0, 0, 0.6),
                    inset 0 0 0 1px rgba(255, 255, 255, 0.04);
                overflow: hidden;
            }

            #ub-dashboard-settings .ub-dropdown.open .ub-dropdown-menu {
                display: block;
            }

            #ub-dashboard-settings .ub-dropdown-option {
                padding: 10px 12px;
                font-size: 14px;
                color: var(--ub-text-secondary);
                cursor: pointer;
                transition: background 100ms ease, color 100ms ease;
            }

            #ub-dashboard-settings .ub-dropdown-option:hover {
                background: rgba(88, 101, 242, 0.2);
                color: var(--ub-text);
            }

            #ub-dashboard-settings .ub-dropdown-option.selected {
                background: rgba(88, 101, 242, 0.3);
                color: #ffffff;
                font-weight: 600;
            }

            .ub-dash-tab { cursor: pointer; }
            .ub-dash-tab h1 { color: #949BA4; letter-spacing: 0.002em; transition: color 120ms ease; }
            .ub-dash-tab[aria-selected="true"] h1 { color: #F2F3F5; }
            .ub-dash-tab:not([aria-selected="true"]):hover h1 { color: #DBDEE1; }

            .ub-tabs-container .tab__26669.selected__26669 {
                box-shadow: none !important;
                border-bottom: none !important;
            }

            .ub-tabs-container { position: relative; }

            .ub-tab-underline {
                position: absolute;
                bottom: 0;
                left: 0;
                width: 0;
                height: 2px;
                border-radius: 2px;
                background: linear-gradient(90deg,
                    #2d3899, #3a45a8, #4752c4, #4f5ed6, #5865f2,
                    #5f6ef3, #6677f4, #7289da, #6677f4, #5f6ef3,
                    #5865f2, #4f5ed6, #4752c4, #3a45a8, #2d3899
                );
                background-size: 400% auto;
                animation: ub-gradient-flow 3s linear infinite;
                transition: left 280ms cubic-bezier(0.65, 0, 0.35, 1), width 280ms cubic-bezier(0.65, 0, 0.35, 1);
                pointer-events: none;
                box-shadow: 0 0 6px rgba(88, 101, 242, 0.55);
            }

            @media (prefers-reduced-motion: reduce) {
                .ub-tab-underline {
                    animation: none;
                    transition: left 1ms, width 1ms;
                }
            }

            .ub-tabpanel {
                opacity: 1;
                transform: translateY(0);
                transition: opacity 160ms ease, transform 160ms ease;
            }
            .ub-tabpanel.ub-hidden { display: none; }
            .ub-tabpanel.ub-panel-fade-out {
                opacity: 0;
                transform: translateY(5px);
            }
            .ub-tabpanel.ub-panel-fade-in {
                opacity: 0;
                transform: translateY(-5px);
            }

            @media (prefers-reduced-motion: reduce) {
                .ub-tabpanel { transition: none; }
            }

            #ub-dashboard-settings .ub-choice-group {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
            }

            #ub-dashboard-settings .ub-choice {
                appearance: none;
                display: inline-flex;
                align-items: center;
                gap: 8px;
                flex: 1 1 0;
                justify-content: center;
                min-height: 40px;
                padding: 0 12px;
                background: rgba(255, 255, 255, 0.04);
                border: 1px solid rgba(255, 255, 255, 0.10);
                border-radius: var(--ub-radius-sm);
                color: var(--ub-text-secondary);
                font-size: 13px;
                font-weight: 600;
                cursor: pointer;
                transition: background-color 120ms ease, border-color 120ms ease, color 120ms ease;
            }

            #ub-dashboard-settings .ub-choice:hover {
                background: rgba(255, 255, 255, 0.07);
                border-color: rgba(255, 255, 255, 0.18);
                color: var(--ub-text);
            }

            #ub-dashboard-settings .ub-choice.selected {
                background: var(--ub-accent-soft);
                border-color: rgba(88, 101, 242, 0.6);
                color: #ffffff;
            }

            #ub-dashboard-settings .ub-choice:focus-visible {
                outline: none;
                box-shadow: 0 0 0 3px var(--ub-accent-soft);
            }

            @keyframes ub-preview-fade {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.35; }
            }

            #ub-dashboard-settings #ub-popup-anim-group .ub-choice:hover {
                animation: ub-preview-fade 1100ms ease-in-out infinite;
            }

            @media (prefers-reduced-motion: reduce) {
                #ub-dashboard-settings #ub-popup-anim-group .ub-choice:hover {
                    animation: none;
                }
            }

            #ub-dashboard-settings .ub-shape-swatch {
                display: block;
                width: 16px;
                height: 16px;
                flex-shrink: 0;
                background: currentColor;
                opacity: 0.9;
            }

            #ub-dashboard-settings .ub-color-row {
                display: flex;
                align-items: center;
                gap: 10px;
            }

            #ub-dashboard-settings .ub-color-input {
                appearance: none;
                -webkit-appearance: none;
                width: 40px;
                height: 40px;
                flex-shrink: 0;
                padding: 0;
                border: 2px solid rgba(255, 255, 255, 0.16);
                border-radius: 50%;
                cursor: pointer;
                background: none;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.35);
                transition: border-color 120ms ease, transform 80ms ease;
            }

            #ub-dashboard-settings .ub-color-input:hover {
                border-color: rgba(255, 255, 255, 0.32);
            }

            #ub-dashboard-settings .ub-color-input:active {
                transform: scale(0.95);
            }

            #ub-dashboard-settings .ub-color-input::-webkit-color-swatch-wrapper {
                padding: 0;
                border-radius: 50%;
            }

            #ub-dashboard-settings .ub-color-input::-webkit-color-swatch {
                border: none;
                border-radius: 50%;
            }

            #ub-dashboard-settings .ub-color-input::-moz-color-swatch {
                border: none;
                border-radius: 50%;
            }

            #ub-dashboard-settings .ub-color-hex {
                font-size: 13px;
                font-weight: 600;
                font-family: "Consolas", "Menlo", monospace;
                color: var(--ub-text-muted);
                text-transform: uppercase;
                letter-spacing: 0.02em;
            }

            #ub-dashboard-settings .ub-color-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 16px;
            }

            #ub-dashboard-settings .ub-field.ub-disabled {
                opacity: 0.4;
                pointer-events: none;
            }

            #ub-dashboard-settings .ub-switch-row {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 16px;
                padding: 10px 0;
                border-bottom: 1px solid rgba(255, 255, 255, 0.06);
            }

            #ub-dashboard-settings .ub-switch-row:last-child {
                border-bottom: none;
            }

            #ub-dashboard-settings .ub-switch-row.ub-disabled {
                opacity: 0.4;
                pointer-events: none;
            }

            #ub-dashboard-settings .ub-switch-copy {
                flex: 1;
            }

            #ub-dashboard-settings .ub-switch-label {
                font-size: 14px;
                font-weight: 600;
                color: var(--ub-text);
                margin-bottom: 2px;
            }

            #ub-dashboard-settings .ub-switch-desc {
                font-size: 12px;
                line-height: 1.4;
                color: var(--ub-text-faint);
            }

            #ub-dashboard-settings .ub-switch {
                position: relative;
                flex-shrink: 0;
                width: 40px;
                height: 24px;
                border-radius: 999px;
                border: none;
                background: rgba(255, 255, 255, 0.14);
                cursor: pointer;
                padding: 0;
                transition: background 200ms ease;
            }

            #ub-dashboard-settings .ub-switch::after {
                content: "";
                position: absolute;
                top: 3px;
                left: 3px;
                width: 18px;
                height: 18px;
                border-radius: 50%;
                background: #ffffff;
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
                transition: transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1);
            }

            #ub-dashboard-settings .ub-switch.on {
                background: var(--ub-accent);
            }

            #ub-dashboard-settings .ub-switch.on::after {
                transform: translateX(16px);
            }

            #ub-dashboard-settings .ub-switch:disabled {
                opacity: 0.4;
                cursor: not-allowed;
            }

            #ub-dashboard-settings .ub-value-pill {
                display: inline-block;
                margin-left: 8px;
                padding: 1px 8px;
                background: rgba(255, 255, 255, 0.06);
                border-radius: 999px;
                color: var(--ub-text-secondary);
                font-size: 11px;
                font-weight: 700;
                letter-spacing: 0;
                text-transform: none;
                vertical-align: middle;
            }

            #ub-dashboard-settings .ub-range {
                appearance: none;
                -webkit-appearance: none;
                width: 100%;
                height: 6px;
                border-radius: 999px;
                background: rgba(255, 255, 255, 0.10);
                outline: none;
                cursor: pointer;
                margin-top: 4px;
            }

            #ub-dashboard-settings .ub-range::-webkit-slider-runnable-track {
                width: 100%;
                height: 6px;
                border-radius: 999px;
                background: rgba(255, 255, 255, 0.18);
            }

            #ub-dashboard-settings .ub-range::-webkit-slider-thumb {
                appearance: none;
                -webkit-appearance: none;
                width: 18px;
                height: 18px;
                border-radius: 50%;
                background: var(--ub-accent);
                border: 3px solid #ffffff;
                box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
                cursor: pointer;
                transition: transform 80ms ease;
                
                margin-top: -6px;
            }

            #ub-dashboard-settings .ub-range::-webkit-slider-thumb:hover {
                transform: scale(1.1);
            }

            #ub-dashboard-settings .ub-range::-moz-range-thumb {
                width: 18px;
                height: 18px;
                border-radius: 50%;
                background: var(--ub-accent);
                border: 3px solid #ffffff;
                box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
                cursor: pointer;
            }

            #ub-dashboard-settings .ub-range::-moz-range-track {
                height: 6px;
                border-radius: 999px;
                background: rgba(255, 255, 255, 0.18);
            }

            /* Discord's own settings classes (contentSection_b6bcee / content_b6bcee)
               are built to sit centered next to a nav sidebar column. We don't render
               that sidebar, so their inherited centering was leaving a large empty
               gap on the left (and right) of the dashboard cards. Force it flush-left. */
            #ub-dashboard-content .contentSection_b6bcee {
                display: flex !important;
                justify-content: flex-start !important;
                width: 100%;
            }

            #ub-dashboard-content .content_b6bcee {
                margin: 0 !important;
                width: 100%;
            }

        </style>

        <div class="scroller__23746 thin_d125d2 scrollerBase_d125d2" dir="ltr" style="overflow: hidden scroll; flex: 1 1 auto; min-height: 0; padding: 24px; background-color: #000000; font-family: 'gg sans', 'Noto Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;">
            <section class="contentSection_b6bcee">
                <div class="content_b6bcee" style="max-width: 680px;">
                    <h2 id="ub-page-heading" class="display-lg_cf4812 ub-gradient-text" data-text-variant="display-lg" style="margin-bottom: 6px; font-weight: 800; font-size: 48px; letter-spacing: -0.02em; white-space: nowrap; line-height: 1.1;">
                        Custom Badges
                    </h2>
                    <p id="ub-page-subtitle" class="text-md/normal_cf4812" data-text-variant="text-md/normal" style="color: #949ba4; margin-bottom: 24px; font-size: 15px; line-height: 1.5;">
                        Adds a self-hosted custom badge with hover tooltip and click-to-view popup card, visible to anyone else running this plugin.
                    </p>

                    <div id="ub-dashboard-settings">
                    <div id="ub-panel-badges" class="ub-tabpanel">
                        <div class="ub-section">
                            <div class="ub-section-head">
                                <div class="ub-section-icon">${icon.toggle}</div>
                                <div>
                                    <div class="ub-eyebrow">Badge Injection Mode</div>
                                </div>
                            </div>
                            <div class="ub-field" style="margin-bottom: 0;">
                                <div class="ub-label">Badge Mode</div>
                                <div class="ub-dropdown" id="ub-badge-mode-dropdown">
                                    <div class="ub-dropdown-trigger" id="ub-badge-mode-trigger">
                                        <span class="ub-dropdown-value" id="ub-badge-mode-value">Original (DOM injection - full popup support)</span>
                                        <svg class="ub-dropdown-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
                                    </div>
                                    <div class="ub-dropdown-menu" id="ub-badge-mode-menu">
                                        <div class="ub-dropdown-option" data-value="original">Original (DOM injection - full popup support)</div>
                                        <div class="ub-dropdown-option" data-value="vencord">Vencord Classic [Limited] (BadgeAPI - popup disabled)</div>
                                    </div>
                                </div>
                                <input type="hidden" id="ub-badge-mode" value="original" />
                            </div>
                        </div>

                        <div class="ub-section">
                            <div class="ub-section-head">
                                <div class="ub-section-icon">${icon.shield}</div>
                                <div class="ub-eyebrow">Account Verification</div>
                            </div>
                            <p class="ub-hint">
                                Prove you own this Discord account so the server accepts badge changes as coming from you. No passwords or long-lived Discord tokens are ever stored - just a short-lived, revocable proof.
                            </p>
                            <div class="ub-btn-row">
                                <button type="button" id="ub-verify-account" class="ub-btn ub-btn-primary">Verify Discord Account</button>
                                <button type="button" id="ub-revoke-token" class="ub-btn ub-btn-danger-solid" disabled>Revoke Your Token</button>
                            </div>
                            <div class="ub-field" style="margin-bottom: 0;">
                                <div class="ub-label">Session Token</div>
                                <p class="ub-hint" style="margin-bottom: 8px;">Paste the token shown after verifying your account here.</p>
                                <div class="ub-token-wrap">
                                    <input id="ub-session-token" type="text" class="ub-input" placeholder="Paste your session token here" autocomplete="off" spellcheck="false" />
                                    <div id="ub-session-token-overlay" class="ub-token-overlay"><div id="ub-session-token-overlay-inner" class="ub-token-overlay-inner"></div></div>
                                </div>
                            </div>
                        </div>

                        <div class="ub-section">
                            <div class="ub-section-head">
                                <div class="ub-section-icon">${icon.pencil}</div>
                                <div class="ub-eyebrow">Edit Active Badge</div>
                            </div>
                            <div class="ub-field">
                                <div class="ub-label">Api Base Url</div>
                                <input id="ub-api-base-url" type="text" class="ub-input" placeholder="https://custom-badges.shadow-164.workers.dev" />
                            </div>
                            <div class="ub-field">
                                <div class="ub-label">My Badge Image Url</div>
                                <input id="ub-badge-image-url" type="text" class="ub-input" placeholder="https://..." />
                            </div>
                            <div class="ub-field" style="margin-bottom: 0;">
                                <div class="ub-label">My Badge Name</div>
                                <input id="ub-badge-name" type="text" class="ub-input" placeholder="Your badge name" />
                            </div>
                        </div>
                        <div class="ub-section">
                            <div class="ub-section-head">
                                <div class="ub-section-icon">${icon.eye}</div>
                                <div class="ub-eyebrow">Live Preview</div>
                            </div>
                            <div id="ub-live-preview">
                                <div id="ub-preview-empty" class="ub-preview-empty">
                                    Set your badge image and name above to see a live preview
                                </div>
                                <div id="ub-preview-content" class="ub-preview-content" style="display: none;">
                                    <div class="ub-preview-row">
                                        <img id="ub-preview-row-icon" class="ub-preview-row-icon" alt="" />
                                        <span class="ub-preview-row-label">Badge row icon</span>
                                    </div>
                                    <div id="ub-popup-card" class="ub-popup-card">
                                        <img id="ub-popup-img" class="ub-popup-img" alt="" />
                                        <div id="ub-popup-name" class="ub-popup-name"></div>
                                        <div id="ub-popup-by" class="ub-popup-by"></div>
                                    </div>
                                    <div id="ub-preview-warning" class="ub-preview-warning" style="display: none;">
                                        Couldn't sample colors from this image, showing the flat fallback background instead. This can happen if the host blocks cross-origin image reads. What others see may look different from this preview.
                                    </div>
                                </div>
                            </div>
                        </div>


                        <div class="ub-section">
                            <div class="ub-section-head">
                                <div class="ub-section-icon">${icon.bolt}</div>
                                <div class="ub-eyebrow">Quick Actions</div>
                            </div>
                            <div class="ub-btn-row">
                                <button id="ub-share-badge" class="ub-btn">Share Badge</button>
                                <button id="ub-revert-badge" class="ub-btn ub-btn-primary">Revert To Previous Badge</button>
                                <button id="ub-refresh-cache" class="ub-btn ub-btn-primary">Refresh Badge Cache</button>
                            </div>

                            <div class="ub-field">
                                <div class="ub-label">Import Badge Code</div>
                                <input id="ub-import-badge-code" type="text" class="ub-input" placeholder="Paste a badge code..." />
                            </div>
                            <button id="ub-import-badge" class="ub-btn" style="margin-bottom: 16px;">Import Badge</button>

                            <div class="ub-field">
                                <div class="ub-label">Selected Preset</div>
                                <div class="ub-dropdown" id="ub-selected-preset-dropdown">
                                    <div class="ub-dropdown-trigger" id="ub-selected-preset-trigger">
                                        <span class="ub-dropdown-value" id="ub-selected-preset-value">${presetLabels[0] ?? "No presets"}</span>
                                        <svg class="ub-dropdown-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
                                    </div>
                                    <div class="ub-dropdown-menu" id="ub-selected-preset-menu">
                                        ${presetLabels.map((label, i) => `<div class="ub-dropdown-option" data-value="${i}">${label}</div>`).join("\n                                        ")}
                                    </div>
                                </div>
                                <input type="hidden" id="ub-selected-preset" value="0" />
                            </div>
                            <button id="ub-apply-preset" class="ub-btn" style="margin-bottom: 0;">Apply Preset</button>
                        </div>

                        <div class="ub-section">
                            <div class="ub-section-head">
                                <div class="ub-section-icon">${icon.grid}</div>
                                <div class="ub-eyebrow">My Badges</div>
                            </div>
                            <p class="ub-hint">
                                Your saved badge slots. Click "Use" on any badge to make it active and publish it. Add a new slot to build another look - you can have up to 12.
                            </p>
                            <div id="ub-my-badges-list" style="margin-bottom: 10px;"></div>
                            <button id="ub-new-badge-slot" class="ub-btn ub-btn-primary">${icon.plus} New Badge Slot</button>
                        </div>

                        <div class="ub-section">
                            <div class="ub-section-head">
                                <div class="ub-section-icon">${icon.box}</div>
                                <div class="ub-eyebrow">Badge Packs</div>
                            </div>
                            <p class="ub-hint">
                                Import a pack of badges from a raw GitHub URL, or export your current badges as a pack to share with others.
                            </p>
                            <div class="ub-field">
                                <div class="ub-label">Import Pack from URL</div>
                                <p class="ub-hint" style="margin-bottom: 8px;">Raw GitHub URL to a badge pack JSON file (e.g. https://raw.githubusercontent.com/you/repo/main/packs/friend-group.json). Use the raw.githubusercontent.com link, not a github.com/blob/... page.</p>
                                <input id="ub-import-pack-url" type="text" class="ub-input" placeholder="https://raw.githubusercontent.com/ItzMeShadow999/Badges/main/packs/DiscordBadges.json" />
                            </div>
                            <div class="ub-btn-row" style="margin-bottom: 0; flex-wrap: wrap; gap: 8px;">
                                <button id="ub-import-pack" class="ub-btn ub-btn-primary">Import Pack</button>
                                <button id="ub-make-pack" class="ub-btn">Make Pack (Copy JSON)</button>
                                <button id="ub-browse-packs" class="ub-btn">Add More Packs</button>
                                <button id="ub-view-guidelines" type="button" class="ub-btn-link">View Publish Guide</button>
                            </div>
                        </div>

                        <div class="ub-section" style="margin-bottom: 0;">
                            <div class="ub-section-head">
                                <div class="ub-section-icon">${icon.toggle}</div>
                                <div class="ub-eyebrow">Behavior</div>
                            </div>

                            <div class="ub-switch-row">
                                <div class="ub-switch-copy">
                                    <div class="ub-switch-label">Show Tooltip</div>
                                    <div class="ub-switch-desc">Show a small tooltip when hovering a custom badge</div>
                                </div>
                                <button type="button" id="ub-show-tooltip" class="ub-switch on" role="switch" aria-checked="true"></button>
                            </div>

                            <div class="ub-switch-row" id="ub-show-popup-row">
                                <div class="ub-switch-copy">
                                    <div class="ub-switch-label">Show Popup</div>
                                    <div class="ub-switch-desc">Show a popup card when clicking a custom badge. Locked off in Vencord Classic [Limited] mode.</div>
                                </div>
                                <button type="button" id="ub-show-popup" class="ub-switch on" role="switch" aria-checked="true"></button>
                            </div>

                            <div class="ub-switch-row" id="ub-show-owner-tag-row">
                                <div class="ub-switch-copy">
                                    <div class="ub-switch-label">Show Owner Tag</div>
                                    <div class="ub-switch-desc">Show who created the badge underneath its name in the popup</div>
                                </div>
                                <button type="button" id="ub-show-owner-tag" class="ub-switch on" role="switch" aria-checked="true"></button>
                            </div>

                            <div class="ub-field" id="ub-owner-tag-format-field" style="margin-top: 12px;">
                                <div class="ub-label">Owner Tag Format</div>
                                <p class="ub-hint" style="margin-bottom: 8px;">Use <code>{username}</code> for the creator's username, and <code>{pluginusedate}</code> for the date they first started using this plugin.</p>
                                <input id="ub-owner-tag-format" type="text" class="ub-input" placeholder="By {username}" />
                            </div>

                            <div class="ub-switch-row">
                                <div class="ub-switch-copy">
                                    <div class="ub-switch-label">Append Vencord Tag</div>
                                    <div class="ub-switch-desc">Add a [Vencord] suffix after your badge name. Seen by everyone who views your badge.</div>
                                </div>
                                <button type="button" id="ub-append-vencord-tag" class="ub-switch" role="switch" aria-checked="false"></button>
                            </div>

                            <div class="ub-switch-row">
                                <div class="ub-switch-copy">
                                    <div class="ub-switch-label">Hide Own Badge</div>
                                    <div class="ub-switch-desc">Don't show my own badge to myself when viewing my own profile</div>
                                </div>
                                <button type="button" id="ub-hide-own-badge" class="ub-switch" role="switch" aria-checked="false"></button>
                            </div>

                            <div class="ub-switch-row">
                                <div class="ub-switch-copy">
                                    <div class="ub-switch-label">Restrict to Mutual Servers</div>
                                    <div class="ub-switch-desc">Only show your badge to people who share a server with you</div>
                                </div>
                                <button type="button" id="ub-restrict-mutual-guilds" class="ub-switch" role="switch" aria-checked="false"></button>
                            </div>
                        </div>
                    </div>

                    <div id="ub-panel-style" class="ub-tabpanel ub-hidden">
                        <div class="ub-section">
                            <div class="ub-section-head">
                                <div class="ub-section-icon">${icon.eye}</div>
                                <div class="ub-eyebrow">Icon Appearance</div>
                            </div>

                            <div class="ub-field">
                                <div class="ub-label">Icon Shape</div>
                                <div class="ub-choice-group" id="ub-icon-shape-group">
                                    <button type="button" class="ub-choice" data-value="circle">
                                        <span class="ub-shape-swatch" style="border-radius: 50%;"></span>
                                        Circle
                                    </button>
                                    <button type="button" class="ub-choice" data-value="rounded">
                                        <span class="ub-shape-swatch" style="border-radius: 5px;"></span>
                                        Rounded
                                    </button>
                                    <button type="button" class="ub-choice" data-value="square">
                                        <span class="ub-shape-swatch" style="border-radius: 0;"></span>
                                        Square
                                    </button>
                                </div>
                                <input type="hidden" id="ub-icon-shape" value="circle" />
                            </div>

                            <div class="ub-field">
                                <div class="ub-label">Icon Size <span class="ub-value-pill" id="ub-icon-size-value">22px</span></div>
                                <input type="range" id="ub-icon-size" class="ub-range" min="12" max="48" step="1" value="22" />
                            </div>

                            <div class="ub-field">
                                <div class="ub-label">Hover Effect</div>
                                <div class="ub-choice-group" id="ub-hover-effect-group">
                                    <button type="button" class="ub-choice" data-value="none">None</button>
                                    <button type="button" class="ub-choice" data-value="scale">Scale Up</button>
                                    <button type="button" class="ub-choice" data-value="glow">Glow</button>
                                </div>
                                <input type="hidden" id="ub-hover-effect" value="none" />
                            </div>

                            <div class="ub-field" id="ub-glow-color-field" style="margin-bottom: 0;">
                                <div class="ub-label">Glow Color</div>
                                <div class="ub-color-row">
                                    <input type="color" id="ub-glow-color" class="ub-color-input" value="#ffffff" />
                                    <span class="ub-color-hex" id="ub-glow-color-hex">#FFFFFF</span>
                                </div>
                            </div>
                        </div>

                        <div class="ub-section">
                            <div class="ub-section-head">
                                <div class="ub-section-icon">${icon.box}</div>
                                <div class="ub-eyebrow">Popup Card</div>
                            </div>

                            <div class="ub-field">
                                <div class="ub-label">Background</div>
                                <div class="ub-choice-group" id="ub-bg-mode-group">
                                    <button type="button" class="ub-choice" data-value="base">Base</button>
                                    <button type="button" class="ub-choice" data-value="sample">Sample Image</button>
                                    <button type="button" class="ub-choice" data-value="edit">Edit Gradient</button>
                                </div>
                                <input type="hidden" id="ub-bg-mode" value="base" />
                            </div>

                            <div class="ub-field" id="ub-gradient-fields">
                                <div class="ub-color-grid">
                                    <div>
                                        <div class="ub-label">Main Color</div>
                                        <div class="ub-color-row">
                                            <input type="color" id="ub-gradient-main" class="ub-color-input" value="#1d1d1d" />
                                            <span class="ub-color-hex" id="ub-gradient-main-hex">#1D1D1D</span>
                                        </div>
                                    </div>
                                    <div>
                                        <div class="ub-label">Second Color</div>
                                        <div class="ub-color-row">
                                            <input type="color" id="ub-gradient-secondary" class="ub-color-input" value="#2a2a38" />
                                            <span class="ub-color-hex" id="ub-gradient-secondary-hex">#2A2A38</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="ub-field">
                                <div class="ub-label">Name Color</div>
                                <div class="ub-color-row">
                                    <input type="color" id="ub-name-color" class="ub-color-input" value="#ffffff" />
                                    <span class="ub-color-hex" id="ub-name-color-hex">#FFFFFF</span>
                                </div>
                            </div>

                            <div class="ub-field" style="margin-bottom: 0;">
                                <div class="ub-label">Popup Animation</div>
                                <div class="ub-choice-group" id="ub-popup-anim-group">
                                    <button type="button" class="ub-choice" data-value="fade">Fade</button>
                                    <button type="button" class="ub-choice" data-value="scale">Scale</button>
                                    <button type="button" class="ub-choice" data-value="slide">Slide</button>
                                </div>
                                <input type="hidden" id="ub-popup-anim" value="fade" />
                            </div>
                        </div>
                        <div class="ub-section" style="margin-bottom: 0;">
                            <div class="ub-section-head">
                                <div class="ub-section-icon">${icon.eye}</div>
                                <div class="ub-eyebrow">Live Preview</div>
                            </div>
                            <div>
                                <div class="ub-preview-empty">
                                    Set your badge image and name in the Custom Badges tab to see a live preview
                                </div>
                                <div class="ub-preview-content" style="display: none;">
                                    <div class="ub-preview-row">
                                        <img class="ub-preview-row-icon" alt="" />
                                        <span class="ub-preview-row-label">Badge row icon</span>
                                    </div>
                                    <div class="ub-popup-card">
                                        <img class="ub-popup-img" alt="" />
                                        <div class="ub-popup-name"></div>
                                        <div class="ub-popup-by"></div>
                                    </div>
                                    <div class="ub-preview-warning" style="display: none;">
                                        Couldn't sample colors from this image, showing the flat fallback background instead. This can happen if the host blocks cross-origin image reads. What others see may look different from this preview.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>

        <div id="ub-guidelines-backdrop" class="ub-guidelines-backdrop" id="ub-guidelines-backdrop"></div>
        <div id="ub-guidelines-panel" class="ub-guidelines-panel">
            <button type="button" class="ub-guidelines-close" id="ub-guidelines-close" title="Close">✕</button>
            <div class="ub-guidelines-h2">📦 Badge Pack Sharing Guidelines</div>
            <div style="color: var(--ub-text-muted); font-size: 13.5px; margin-bottom: 18px; line-height: 1.55;">Before sharing a pack, make sure it meets these standards so everyone has a smooth experience importing it.</div>

            <div class="ub-guidelines-h3">Format</div>
            <div style="color: var(--ub-text-secondary); margin-bottom: 8px;">Your pack must be a valid JSON file hosted on <code class="ub-guidelines-inline-code">raw.githubusercontent.com</code> - no other hosts are accepted by the importer. The structure should look like this:</div>
            <code class="ub-guidelines-code"><span class="p">{</span>
  <span class="k">"version"</span><span class="p">:</span> <span class="n">1</span><span class="p">,</span>
  <span class="k">"badges"</span><span class="p">:</span> <span class="p">[</span>
    <span class="s">"base64encodedcode"</span><span class="p">,</span>
    <span class="s">"base64encodedcode"</span>
  <span class="p">]</span>
<span class="p">}</span></code>
            <div style="color: var(--ub-text-secondary);">Each entry in the <code class="ub-guidelines-inline-code">badges</code> array is a badge code generated by the <strong>Make Pack</strong> button in your dashboard.</div>

            <div class="ub-guidelines-h3">Pack Size</div>
            <div class="ub-guidelines-note">ⓘ The importer only loads the <strong>first 6 badges</strong> from any pack. The <strong>Make Pack</strong> button exports up to <strong>12 badges</strong> (your current plugin save limit). Technically packs can be as large as you want, but we recommend a minimum of <strong>6</strong> and a maximum of <strong>10–15</strong> for the best experience.</div>

            <div class="ub-guidelines-h3">Content Rules</div>
            <div class="ub-guidelines-warn">⚠️ Packs that break these rules will be removed without warning.</div>
            <ul>
                <li>Badges must use <strong>publicly accessible image URLs</strong> that won't die in a week (no Discord CDN links, no temp hosts)</li>
                <li>No NSFW, offensive, or hateful imagery</li>
                <li>No impersonation of other users, plugins, or brands</li>
            </ul>

            <div class="ub-guidelines-h3">How to Submit</div>
            <ol>
                <li>Generate your pack JSON using the <strong>Make Pack (Copy JSON)</strong> button</li>
                <li>Push it to the packs repo as <code class="ub-guidelines-inline-code">packs/your-pack-name.json</code> in <a href="https://github.com/ItzMeShadow999/Badges" target="_blank" rel="noopener noreferrer">https://github.com/ItzMeShadow999/Badges</a></li>
                <li>Open a PR with a short description of the theme</li>
            </ol>

            <div class="ub-guidelines-h3">Tips for a Good Pack</div>
            <ul>
                <li>Use a clear, descriptive filename (<code class="ub-guidelines-inline-code">anime-icons.json</code>, not <code class="ub-guidelines-inline-code">pack1.json</code>)</li>
                <li>All badges in a pack should share a <strong>theme or aesthetic</strong> - random assortments are harder to browse</li>
                <li>Test your pack with <strong>Import Pack from URL</strong> before submitting to make sure every badge imports cleanly</li>
            </ul>

            <div style="margin-top: 24px; display: flex; justify-content: flex-end; padding-top: 16px; border-top: 1px solid var(--ub-border);">
                <button type="button" id="ub-guidelines-close-btn" class="ub-btn ub-btn-primary">Got it</button>
            </div>
        </div>
    `;
}
