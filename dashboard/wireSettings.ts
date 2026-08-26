import { getDashboardBridge } from "./bridge";

let writeBudgetIntervalId: ReturnType<typeof setInterval> | null = null;
let unsubscribeWriteBudget: (() => void) | null = null;

let unsubscribeSettingsChange: (() => void) | null = null;

function formatResetIn(resetAt: number): string {
    const msLeft = resetAt - Date.now();
    if (msLeft <= 0) return "";
    const h = Math.floor(msLeft / 3_600_000);
    const m = Math.floor((msLeft % 3_600_000) / 60_000);
    return `Resets in ${h > 0 ? `${h}h ` : ""}${m}m`;
}

export function unwireDashboardWriteBudget() {
    if (writeBudgetIntervalId !== null) {
        clearInterval(writeBudgetIntervalId);
        writeBudgetIntervalId = null;
    }
    if (unsubscribeWriteBudget) {
        unsubscribeWriteBudget();
        unsubscribeWriteBudget = null;
    }
}

export function unwireDashboardSettingsSync() {
    if (unsubscribeSettingsChange) {
        unsubscribeSettingsChange();
        unsubscribeSettingsChange = null;
    }
}

export function wireDashboardSettings(root: HTMLElement) {
    const bridge = getDashboardBridge();
    if (!bridge) {
        console.warn("[UserDashboard] Dashboard bridge not set yet - settings form will not be wired up.");
        return;
    }

    const { settings } = bridge;

    unwireDashboardSettingsSync();

    const $ = <T extends HTMLElement>(id: string) => root.querySelector(`#${id}`) as T | null;

    const applyButtons = [
        $<HTMLButtonElement>("ub-apply-badge-changes-badges"),
        $<HTMLButtonElement>("ub-apply-badge-changes-style")
    ].filter((b): b is HTMLButtonElement => !!b);
    const applyStatuses = [
        $<HTMLElement>("ub-apply-status-badges"),
        $<HTMLElement>("ub-apply-status-style")
    ].filter((s): s is HTMLElement => !!s);

    function renderApplyState() {
        if (!applyButtons.length) return;
        const hasBadge = !!(settings.store.myBadgeImageUrl && settings.store.myBadgeName);
        const pending = hasBadge && !!(bridge as any).hasPendingBadgeChanges?.();

        applyButtons.forEach(btn => {
            if (btn.dataset.busy === "1") return;
            btn.disabled = !hasBadge || !pending;
        });
        applyStatuses.forEach(el => {
            el.textContent = !hasBadge
                ? "Set your badge image and name to enable this"
                : pending
                    ? "You have unpublished changes"
                    : "Everything below is already published";
            el.classList.toggle("ub-pending", pending);
        });
    }

    async function onApplyBadgeChanges(btn: HTMLButtonElement) {
        if (btn.disabled) return;
        applyButtons.forEach(b => { b.dataset.busy = "1"; b.disabled = true; });
        const original = btn.textContent;
        btn.textContent = "Applying...";
        try {
            await (bridge as any).applyBadgeChanges?.();
        } finally {
            applyButtons.forEach(b => {
                delete b.dataset.busy;
                b.textContent = "Apply Badge Changes";
            });
            renderApplyState();
        }
    }

    applyButtons.forEach(btn => btn.addEventListener("click", () => onApplyBadgeChanges(btn)));

    const apiBaseUrl = $<HTMLInputElement>("ub-api-base-url");
    const badgeImageUrl = $<HTMLInputElement>("ub-badge-image-url");
    const badgeName = $<HTMLInputElement>("ub-badge-name");
    const importBadgeCode = $<HTMLInputElement>("ub-import-badge-code");
    const importPackUrl = $<HTMLInputElement>("ub-import-pack-url");

    const badgeModeInput = $<HTMLInputElement>("ub-badge-mode");
    const selectedPresetInput = $<HTMLInputElement>("ub-selected-preset");

    const iconSize = $<HTMLInputElement>("ub-icon-size");
    const iconSizeValue = $<HTMLElement>("ub-icon-size-value");
    const hoverEffectInput = $<HTMLInputElement>("ub-hover-effect");
    const glowColorField = $<HTMLElement>("ub-glow-color-field");
    const glowColor = $<HTMLInputElement>("ub-glow-color");
    const glowColorHex = $<HTMLElement>("ub-glow-color-hex");
    const bgModeInput = $<HTMLInputElement>("ub-bg-mode");
    const gradientFields = $<HTMLElement>("ub-gradient-fields");
    const gradientMain = $<HTMLInputElement>("ub-gradient-main");
    const gradientMainHex = $<HTMLElement>("ub-gradient-main-hex");
    const gradientSecondary = $<HTMLInputElement>("ub-gradient-secondary");
    const gradientSecondaryHex = $<HTMLElement>("ub-gradient-secondary-hex");
    const nameColor = $<HTMLInputElement>("ub-name-color");
    const nameColorHex = $<HTMLElement>("ub-name-color-hex");

    function wireDropdown(
        dropdownId: string,
        hiddenInputId: string,
        valueElId: string,
        onChange?: (val: string) => void
    ) {
        const dropdown = root.querySelector<HTMLElement>(`#${dropdownId}`);
        const hiddenInput = $<HTMLInputElement>(hiddenInputId);
        const valueEl = root.querySelector<HTMLElement>(`#${valueElId}`);
        const trigger = root.querySelector<HTMLElement>(`#${dropdownId} .ub-dropdown-trigger`);
        const menu = root.querySelector<HTMLElement>(`#${dropdownId} .ub-dropdown-menu`);
        if (!dropdown || !hiddenInput || !valueEl || !trigger || !menu) return;

        trigger.addEventListener("click", e => {
            e.stopPropagation();
            const isOpen = dropdown.classList.contains("open");

            root.querySelectorAll(".ub-dropdown.open").forEach(d => d.classList.remove("open"));
            if (!isOpen) dropdown.classList.add("open");
        });

        menu.querySelectorAll<HTMLElement>(".ub-dropdown-option").forEach(opt => {
            opt.addEventListener("click", () => {
                const val = opt.dataset.value ?? "";
                hiddenInput.value = val;
                valueEl.textContent = opt.textContent ?? "";
                menu.querySelectorAll(".ub-dropdown-option").forEach(o => o.classList.remove("selected"));
                opt.classList.add("selected");
                dropdown.classList.remove("open");
                onChange?.(val);
            });
        });
    }

    document.addEventListener("click", () => {
        root.querySelectorAll(".ub-dropdown.open").forEach(d => d.classList.remove("open"));
    });

    const TAB_COPY: Record<string, { title: string; subtitle: string; }> = {
        badges: {
            title: "Custom Badges",
            subtitle: "Adds a self-hosted custom badge with hover tooltip and click-to-view popup card, visible to anyone else running this plugin."
        },
        style: {
            title: "Styles Menu",
            subtitle: "Shape, size, hover effects, popup background, name color, and animation - everything that controls how your badge looks. Every change here is visible to anyone who views your badge."
        }
    };

    const pageHeading = root.querySelector<HTMLElement>("#ub-page-heading");
    const pageSubtitle = root.querySelector<HTMLElement>("#ub-page-subtitle");
    const tabUnderline = root.querySelector<HTMLElement>("#ub-tab-underline");
    const tabsContainer = root.querySelector<HTMLElement>("#ub-tabs-container");

    let activeTab = "badges";
    const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    function positionUnderline(tabEl: HTMLElement | null) {
        if (!tabUnderline || !tabsContainer || !tabEl) return;
        const containerRect = tabsContainer.getBoundingClientRect();
        const tabRect = tabEl.getBoundingClientRect();
        tabUnderline.style.left = `${tabRect.left - containerRect.left}px`;
        tabUnderline.style.width = `${tabRect.width}px`;
    }

    function switchTab(tab: string) {
        if (tab === activeTab) return;
        activeTab = tab;

        root.querySelectorAll<HTMLElement>(".ub-dash-tab").forEach(t => {
            const active = t.dataset.tab === tab;
            t.setAttribute("aria-selected", String(active));
            t.querySelector("h1")?.classList.toggle("selected__26669", active);
            if (active) positionUnderline(t);
        });

        const copy = TAB_COPY[tab] ?? TAB_COPY.badges;
        if (pageHeading) pageHeading.textContent = copy.title;
        if (pageSubtitle) pageSubtitle.textContent = copy.subtitle;

        const targetPanel = root.querySelector<HTMLElement>(`#ub-panel-${tab}`);
        const currentPanel = root.querySelector<HTMLElement>(".ub-tabpanel:not(.ub-hidden)");

        if (!targetPanel || targetPanel === currentPanel) return;

        if (prefersReducedMotion) {
            currentPanel?.classList.add("ub-hidden");
            targetPanel.classList.remove("ub-hidden");
            return;
        }

        currentPanel?.classList.add("ub-panel-fade-out");
        setTimeout(() => {
            currentPanel?.classList.add("ub-hidden");
            currentPanel?.classList.remove("ub-panel-fade-out");

            targetPanel.classList.remove("ub-hidden");
            targetPanel.classList.add("ub-panel-fade-in");
            requestAnimationFrame(() => {
                requestAnimationFrame(() => targetPanel.classList.remove("ub-panel-fade-in"));
            });
        }, 150);
    }

    root.querySelectorAll<HTMLElement>(".ub-dash-tab").forEach(t => {
        t.addEventListener("click", () => switchTab(t.dataset.tab ?? "badges"));
    });

    positionUnderline(root.querySelector<HTMLElement>('.ub-dash-tab[aria-selected="true"]'));
    window.addEventListener("resize", () => {
        positionUnderline(root.querySelector<HTMLElement>(`#ub-tab-${activeTab}`));
    });

    function wireChoiceGroup(
        groupId: string,
        hiddenInputId: string,
        onChange?: (val: string) => void
    ) {
        const group = root.querySelector<HTMLElement>(`#${groupId}`);
        const hiddenInput = $<HTMLInputElement>(hiddenInputId);
        if (!group || !hiddenInput) return;

        group.querySelectorAll<HTMLButtonElement>(".ub-choice").forEach(btn => {
            btn.addEventListener("click", () => {
                const val = btn.dataset.value ?? "";
                hiddenInput.value = val;
                group.querySelectorAll(".ub-choice").forEach(b => b.classList.remove("selected"));
                btn.classList.add("selected");
                onChange?.(val);
            });
        });
    }

    function setChoiceGroupValue(groupId: string, hiddenInputId: string, val: string) {
        const group = root.querySelector<HTMLElement>(`#${groupId}`);
        const hiddenInput = $<HTMLInputElement>(hiddenInputId);
        if (!group || !hiddenInput) return;
        hiddenInput.value = val;
        group.querySelectorAll<HTMLButtonElement>(".ub-choice").forEach(b => {
            b.classList.toggle("selected", b.dataset.value === val);
        });
    }

    wireDropdown("ub-badge-mode-dropdown", "ub-badge-mode", "ub-badge-mode-value", val => {
        settings.store.badgeMode = val;
        bridge.onBadgeModeChange(val);
    });

    wireDropdown("ub-selected-preset-dropdown", "ub-selected-preset", "ub-selected-preset-value", val => {
        settings.store.selectedPreset = val;
    });

    function updateGlowFieldState() {
        glowColorField?.classList.toggle("ub-disabled", hoverEffectInput?.value !== "glow");
    }
    function updateGradientFieldsState() {
        gradientFields?.classList.toggle("ub-disabled", bgModeInput?.value !== "edit");
    }

    wireChoiceGroup("ub-icon-shape-group", "ub-icon-shape", val => {
        settings.store.badgeIconShape = val;
        updatePreview();
        renderApplyState();
    });

    iconSize?.addEventListener("input", () => {
        if (iconSizeValue) iconSizeValue.textContent = `${iconSize.value}px`;
    });
    iconSize?.addEventListener("change", () => {
        settings.store.badgeIconSize = Number(iconSize.value);
        updatePreview();
        renderApplyState();
    });

    wireChoiceGroup("ub-hover-effect-group", "ub-hover-effect", val => {
        settings.store.badgeHoverEffect = val;
        updateGlowFieldState();
        renderApplyState();
    });

    glowColor?.addEventListener("input", () => {
        if (glowColorHex) glowColorHex.textContent = glowColor.value.toUpperCase();
    });
    glowColor?.addEventListener("change", () => {
        settings.store.badgeGlowColor = glowColor.value;
        renderApplyState();
    });

    wireChoiceGroup("ub-bg-mode-group", "ub-bg-mode", val => {
        settings.store.popupBackgroundMode = val;
        updateGradientFieldsState();
        updatePreview();
        renderApplyState();
    });

    gradientMain?.addEventListener("input", () => {
        if (gradientMainHex) gradientMainHex.textContent = gradientMain.value.toUpperCase();
    });
    gradientMain?.addEventListener("change", () => {
        settings.store.popupGradientMain = gradientMain.value;
        updatePreview();
        renderApplyState();
    });

    gradientSecondary?.addEventListener("input", () => {
        if (gradientSecondaryHex) gradientSecondaryHex.textContent = gradientSecondary.value.toUpperCase();
    });
    gradientSecondary?.addEventListener("change", () => {
        settings.store.popupGradientSecondary = gradientSecondary.value;
        updatePreview();
        renderApplyState();
    });

    nameColor?.addEventListener("input", () => {
        if (nameColorHex) nameColorHex.textContent = nameColor.value.toUpperCase();
    });
    nameColor?.addEventListener("change", () => {
        settings.store.badgeNameColor = nameColor.value;
        updatePreview();
        renderApplyState();
    });

    wireChoiceGroup("ub-popup-anim-group", "ub-popup-anim", val => {
        settings.store.popupAnimationStyle = val;
        renderApplyState();
    });

    const previewEmpties = Array.from(root.querySelectorAll<HTMLElement>(".ub-preview-empty"));
    const previewContents = Array.from(root.querySelectorAll<HTMLElement>(".ub-preview-content"));
    const previewRowIcons = Array.from(root.querySelectorAll<HTMLImageElement>(".ub-preview-row-icon"));
    const popupCards = Array.from(root.querySelectorAll<HTMLElement>(".ub-popup-card"));
    const popupImgs = Array.from(root.querySelectorAll<HTMLImageElement>(".ub-popup-img"));
    const popupNames = Array.from(root.querySelectorAll<HTMLElement>(".ub-popup-name"));
    const popupBys = Array.from(root.querySelectorAll<HTMLElement>(".ub-popup-by"));
    const previewWarnings = Array.from(root.querySelectorAll<HTMLElement>(".ub-preview-warning"));

    const radiusFor = (shape: string) => (shape === "circle" ? "50%" : shape === "rounded" ? "6px" : "0");

    let previewToken = 0;

    async function updatePreview() {
        const token = ++previewToken;

        const url = badgeImageUrl?.value.trim() ?? "";
        const name = badgeName?.value.trim() ?? "";

        if (!url || !name) {
            previewEmpties.forEach(el => el.style.display = "");
            previewContents.forEach(el => el.style.display = "none");
            return;
        }

        previewEmpties.forEach(el => el.style.display = "none");
        previewContents.forEach(el => el.style.display = "");

        const bridge = getDashboardBridge();
        const data = await bridge?.getPreviewData();
        if (token !== previewToken) return;

        const radius = radiusFor(data?.iconShape ?? "circle");

        previewRowIcons.forEach(el => {
            el.src = data?.imageUrl ?? url;
            el.style.width = `${data?.iconSize ?? 22}px`;
            el.style.height = `${data?.iconSize ?? 22}px`;
            el.style.borderRadius = radius;
        });

        popupCards.forEach(el => {
            el.style.background = data?.background ?? "#1d1d1d";
        });
        popupImgs.forEach(el => {
            el.src = data?.imageUrl ?? url;
            el.style.borderRadius = radius;
        });
        popupNames.forEach(el => {
            el.textContent = data?.displayName ?? name;
            el.style.color = data?.nameColor ?? "#ffffff";
        });
        popupBys.forEach(el => {
            el.textContent = data?.ownerTag ?? "";
            el.style.display = data?.ownerTag ? "" : "none";
        });
        previewWarnings.forEach(el => {
            el.style.display = data?.sampleFailed ? "" : "none";
        });
    }

    function syncFromStore() {
        if (apiBaseUrl) apiBaseUrl.value = settings.store.apiBaseUrl ?? "";
        if (badgeImageUrl) badgeImageUrl.value = settings.store.myBadgeImageUrl ?? "";
        if (badgeName) badgeName.value = settings.store.myBadgeName ?? "";

        const modeVal = settings.store.badgeMode ?? "original";
        if (badgeModeInput) badgeModeInput.value = modeVal;
        const modeOpt = root.querySelector<HTMLElement>(`#ub-badge-mode-menu .ub-dropdown-option[data-value="${modeVal}"]`);
        if (modeOpt) {
            root.querySelector("#ub-badge-mode-value")!.textContent = modeOpt.textContent ?? "";
            root.querySelectorAll("#ub-badge-mode-menu .ub-dropdown-option").forEach(o => o.classList.remove("selected"));
            modeOpt.classList.add("selected");
        }

        const presetVal = String(settings.store.selectedPreset ?? "0");
        if (selectedPresetInput) selectedPresetInput.value = presetVal;
        const presetOpt = root.querySelector<HTMLElement>(`#ub-selected-preset-menu .ub-dropdown-option[data-value="${presetVal}"]`);
        if (presetOpt) {
            root.querySelector("#ub-selected-preset-value")!.textContent = presetOpt.textContent ?? "";
            root.querySelectorAll("#ub-selected-preset-menu .ub-dropdown-option").forEach(o => o.classList.remove("selected"));
            presetOpt.classList.add("selected");
        }

        setChoiceGroupValue("ub-icon-shape-group", "ub-icon-shape", settings.store.badgeIconShape ?? "circle");

        const sizeVal = settings.store.badgeIconSize ?? 22;
        if (iconSize) iconSize.value = String(sizeVal);
        if (iconSizeValue) iconSizeValue.textContent = `${sizeVal}px`;

        setChoiceGroupValue("ub-hover-effect-group", "ub-hover-effect", settings.store.badgeHoverEffect ?? "none");

        const glowVal = settings.store.badgeGlowColor ?? "#ffffff";
        if (glowColor) glowColor.value = glowVal;
        if (glowColorHex) glowColorHex.textContent = glowVal.toUpperCase();
        updateGlowFieldState();

        setChoiceGroupValue("ub-bg-mode-group", "ub-bg-mode", settings.store.popupBackgroundMode ?? "base");

        const gradMainVal = settings.store.popupGradientMain ?? "#1d1d1d";
        if (gradientMain) gradientMain.value = gradMainVal;
        if (gradientMainHex) gradientMainHex.textContent = gradMainVal.toUpperCase();

        const gradSecVal = settings.store.popupGradientSecondary ?? "#2a2a38";
        if (gradientSecondary) gradientSecondary.value = gradSecVal;
        if (gradientSecondaryHex) gradientSecondaryHex.textContent = gradSecVal.toUpperCase();
        updateGradientFieldsState();

        const nameColorVal = settings.store.badgeNameColor ?? "#ffffff";
        if (nameColor) nameColor.value = nameColorVal;
        if (nameColorHex) nameColorHex.textContent = nameColorVal.toUpperCase();

        setChoiceGroupValue("ub-popup-anim-group", "ub-popup-anim", settings.store.popupAnimationStyle ?? "fade");

        updatePreview();
        renderApplyState();
    }

    syncFromStore();

    apiBaseUrl?.addEventListener("change", () => {
        settings.store.apiBaseUrl = apiBaseUrl.value;
    });

    badgeImageUrl?.addEventListener("input", updatePreview);
    badgeImageUrl?.addEventListener("change", () => {
        settings.store.myBadgeImageUrl = badgeImageUrl.value;
        updatePreview();
        renderApplyState();
    });

    badgeName?.addEventListener("input", updatePreview);
    badgeName?.addEventListener("change", () => {
        settings.store.myBadgeName = badgeName.value;
        updatePreview();
        renderApplyState();
    });

    $("ub-share-badge")?.addEventListener("click", () => bridge.shareMyBadge());
    $("ub-revert-badge")?.addEventListener("click", () => {
        bridge.revertBadge();
        syncFromStore();
    });
    $("ub-refresh-cache")?.addEventListener("click", () => bridge.refreshBadgeCache());

    $("ub-import-badge")?.addEventListener("click", () => {
        settings.store.importBadgeCode = importBadgeCode?.value ?? "";
        bridge.importBadgeFromCode();
        if (importBadgeCode) importBadgeCode.value = "";
        syncFromStore();
    });

    $("ub-apply-preset")?.addEventListener("click", () => {
        bridge.applySelectedPreset();
        syncFromStore();
    });

    $("ub-new-badge-slot")?.addEventListener("click", () => {
        bridge.createNewBadgeSlot();
        syncFromStore();
    });

    $("ub-import-pack")?.addEventListener("click", () => {
        settings.store.importPackUrl = importPackUrl?.value ?? "";
        bridge.importPackFromUrl();
        syncFromStore();
    });

    $("ub-make-pack")?.addEventListener("click", () => bridge.makePack());
    $("ub-browse-packs")?.addEventListener("click", () => bridge.browsePacks());

    unsubscribeSettingsChange = (bridge as any).subscribeSettingsChange?.(() => syncFromStore()) ?? null;

    wireWriteBudget(root, bridge);
}

function wireWriteBudget(root: HTMLElement, bridge: any) {
    const $ = <T extends HTMLElement>(id: string) => root.querySelector(`#${id}`) as T | null;

    const unverifiedEl = $<HTMLElement>("ub-writebudget-unverified");
    const contentEl = $<HTMLElement>("ub-writebudget-content");
    const labelEl = $<HTMLElement>("ub-writebudget-label");
    const countEl = $<HTMLElement>("ub-writebudget-count");
    const barEl = $<HTMLElement>("ub-writebudget-bar");
    const resetEl = $<HTMLElement>("ub-writebudget-reset");
    const refreshBtn = $<HTMLButtonElement>("ub-writebudget-refresh");
    const refreshBtnUnverified = $<HTMLButtonElement>("ub-writebudget-refresh-unverified");

    if (!unverifiedEl || !contentEl || !labelEl || !countEl || !barEl || !resetEl) return;

    if (writeBudgetIntervalId !== null) clearInterval(writeBudgetIntervalId);
    if (unsubscribeWriteBudget) unsubscribeWriteBudget();

    const maxWrites = (bridge as any).writeBudgetMaxWrites ?? 30;

    function render() {
        const verified = !!settingsStore().sessionToken;
        const budget = (bridge as any).getWriteBudget?.() ?? null;

        if (!verified) {
            unverifiedEl!.style.display = "flex";
            contentEl!.style.display = "none";
            return;
        }

        const hasReading = !!budget && typeof budget.remaining === "number";
        if (!hasReading) {

            unverifiedEl!.style.display = "none";
            contentEl!.style.display = "block";
            labelEl!.textContent = "Writes Remaining";
            return;
        }

        unverifiedEl!.style.display = "none";
        contentEl!.style.display = "block";

        const limit = budget.limit ?? maxWrites;
        const remaining = Math.max(0, budget.remaining);
        const pct = limit > 0 ? Math.max(0, Math.min(100, (remaining / limit) * 100)) : 0;
        const exhausted = remaining === 0;
        const low = !exhausted && remaining <= Math.ceil(limit * 0.2);
        const barColor = exhausted ? "var(--ub-danger)" : (low ? "var(--ub-warning)" : "var(--ub-accent)");

        labelEl!.textContent = exhausted ? "Write budget exhausted" : "Writes Remaining";
        labelEl!.style.color = exhausted ? "var(--ub-danger)" : "";
        labelEl!.style.fontWeight = exhausted ? "600" : "400";
        countEl!.textContent = `${remaining} / ${limit}`;
        barEl!.style.width = `${pct}%`;
        barEl!.style.background = barColor;

        resetEl!.textContent = budget.resetAt ? (formatResetIn(budget.resetAt) || "Refreshing…") : "";
    }

    function settingsStore() {
        return bridge.settings.store;
    }

    function tick() {
        const budget = (bridge as any).getWriteBudget?.() ?? null;
        if (budget?.resetAt && budget.resetAt - Date.now() <= 0) {

            (bridge as any).refreshWriteBudget?.();
        } else {
            render();
        }
    }

    async function doRefresh(btn: HTMLButtonElement | null) {
        if (!btn) return;
        const original = btn.textContent;
        btn.disabled = true;
        btn.textContent = "Refreshing...";
        try {
            await (bridge as any).refreshWriteBudget?.();
        } finally {
            btn.disabled = false;
            btn.textContent = original ?? "Refresh";
        }
    }

    refreshBtn?.addEventListener("click", () => doRefresh(refreshBtn));
    refreshBtnUnverified?.addEventListener("click", () => doRefresh(refreshBtnUnverified));

    unsubscribeWriteBudget = (bridge as any).subscribeWriteBudget?.(() => render()) ?? null;

    if (settingsStore().sessionToken) (bridge as any).refreshWriteBudget?.();

    render();
    writeBudgetIntervalId = setInterval(tick, 1000);
}
