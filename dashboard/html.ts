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
        clock: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15.5 14"/></svg>`,
        trash: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>`,
        plus: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`
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

            #ub-dashboard-settings .ub-btn-row {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
                margin-bottom: 16px;
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
                padding: 10px 12px;
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

        </style>

        <div class="scroller__23746 thin_d125d2 scrollerBase_d125d2" dir="ltr" style="overflow: hidden scroll; padding: 24px; background-color: #000000; font-family: 'gg sans', 'Noto Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;">
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

                        <div class="ub-section" id="ub-writebudget-section">
                            <div class="ub-section-head">
                                <div class="ub-section-icon">${icon.clock}</div>
                                <div class="ub-eyebrow">Write Budget</div>
                            </div>
                            <div id="ub-writebudget-unverified" class="ub-field" style="margin-bottom: 0; display: flex; align-items: center; justify-content: space-between; gap: 12px;">
                                <p class="ub-hint" style="margin: 0;">Verify your Discord account to see your write budget.</p>
                                <button id="ub-writebudget-refresh-unverified" class="ub-btn" type="button">Refresh</button>
                            </div>
                            <div id="ub-writebudget-content" class="ub-field" style="margin-bottom: 0; display: none;">
                                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                                    <span id="ub-writebudget-label" style="font-size: 13px; opacity: 0.85;">Writes Remaining</span>
                                    <span id="ub-writebudget-count" style="font-size: 13px; font-weight: 700; font-variant-numeric: tabular-nums;">- / -</span>
                                </div>
                                <div style="height: 6px; border-radius: 999px; background: rgba(255,255,255,0.08); overflow: hidden; margin-bottom: 8px;">
                                    <div id="ub-writebudget-bar" style="height: 100%; border-radius: 999px; width: 0%; background: var(--ub-accent); transition: width 400ms cubic-bezier(0.4,0,0.2,1), background 400ms ease;"></div>
                                </div>
                                <div style="display: flex; justify-content: space-between; align-items: center;">
                                    <span id="ub-writebudget-reset" style="font-size: 12px; opacity: 0.6;"></span>
                                    <button id="ub-writebudget-refresh" class="ub-btn" type="button">Refresh</button>
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
                            <div id="ub-my-badges-list" class="ub-hint" style="font-style: italic; margin-bottom: 14px;">No saved badges yet</div>
                            <button id="ub-new-badge-slot" class="ub-btn ub-btn-primary">${icon.plus} New Badge Slot</button>
                        </div>

                        <div class="ub-section" style="margin-bottom: 0;">
                            <div class="ub-section-head">
                                <div class="ub-section-icon">${icon.box}</div>
                                <div class="ub-eyebrow">Badge Packs</div>
                            </div>
                            <p class="ub-hint">
                                Import a pack of badges from a raw GitHub URL, or export your current badges as a pack to share with others.
                            </p>
                            <div class="ub-field">
                                <div class="ub-label">Import Pack from URL</div>
                                <input id="ub-import-pack-url" type="text" class="ub-input" placeholder="https://raw.githubusercontent.com/..." />
                            </div>
                            <div class="ub-btn-row" style="margin-bottom: 0;">
                                <button id="ub-import-pack" class="ub-btn">Import Pack</button>
                                <button id="ub-make-pack" class="ub-btn ub-btn-primary">Make Pack (Copy JSON)</button>
                                <button id="ub-browse-packs" class="ub-btn ub-btn-primary">Add More Packs</button>
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
    `;
}
