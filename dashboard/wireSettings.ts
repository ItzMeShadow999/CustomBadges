import { getDashboardBridge } from "./bridge";

export function wireDashboardSettings(root: HTMLElement) {
    const bridge = getDashboardBridge();
    if (!bridge) {
        console.warn("[UserDashboard] Dashboard bridge not set yet - settings form will not be wired up.");
        return;
    }

    const { settings } = bridge;

    const $ = <T extends HTMLElement>(id: string) => root.querySelector(`#${id}`) as T | null;

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
    });

    iconSize?.addEventListener("input", () => {
        if (iconSizeValue) iconSizeValue.textContent = `${iconSize.value}px`;
    });
    iconSize?.addEventListener("change", () => {
        settings.store.badgeIconSize = Number(iconSize.value);
        updatePreview();
    });

    wireChoiceGroup("ub-hover-effect-group", "ub-hover-effect", val => {
        settings.store.badgeHoverEffect = val;
        updateGlowFieldState();
    });

    glowColor?.addEventListener("input", () => {
        if (glowColorHex) glowColorHex.textContent = glowColor.value.toUpperCase();
    });
    glowColor?.addEventListener("change", () => {
        settings.store.badgeGlowColor = glowColor.value;
    });

    wireChoiceGroup("ub-bg-mode-group", "ub-bg-mode", val => {
        settings.store.popupBackgroundMode = val;
        updateGradientFieldsState();
        updatePreview();
    });

    gradientMain?.addEventListener("input", () => {
        if (gradientMainHex) gradientMainHex.textContent = gradientMain.value.toUpperCase();
    });
    gradientMain?.addEventListener("change", () => {
        settings.store.popupGradientMain = gradientMain.value;
        updatePreview();
    });

    gradientSecondary?.addEventListener("input", () => {
        if (gradientSecondaryHex) gradientSecondaryHex.textContent = gradientSecondary.value.toUpperCase();
    });
    gradientSecondary?.addEventListener("change", () => {
        settings.store.popupGradientSecondary = gradientSecondary.value;
        updatePreview();
    });

    nameColor?.addEventListener("input", () => {
        if (nameColorHex) nameColorHex.textContent = nameColor.value.toUpperCase();
    });
    nameColor?.addEventListener("change", () => {
        settings.store.badgeNameColor = nameColor.value;
        updatePreview();
    });

    wireChoiceGroup("ub-popup-anim-group", "ub-popup-anim", val => {
        settings.store.popupAnimationStyle = val;
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
    }

    syncFromStore();

    apiBaseUrl?.addEventListener("change", () => {
        settings.store.apiBaseUrl = apiBaseUrl.value;
    });

    badgeImageUrl?.addEventListener("input", updatePreview);
    badgeImageUrl?.addEventListener("change", () => {
        settings.store.myBadgeImageUrl = badgeImageUrl.value;
        updatePreview();
    });

    badgeName?.addEventListener("input", updatePreview);
    badgeName?.addEventListener("change", () => {
        settings.store.myBadgeName = badgeName.value;
        updatePreview();
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
}
