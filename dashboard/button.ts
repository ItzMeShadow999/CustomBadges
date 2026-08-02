import { NavigationRouter } from "@webpack/common";

import { setDashboardActive, state } from "./types";
import { buttonRegistry } from "./buttonRegistry";
import { renderDashboardView } from "./dashboardView";

const DASHBOARD_BUTTON_ID = "user-dashboard";

export function registerDashboardButton() {
    buttonRegistry.register({
        id: DASHBOARD_BUTTON_ID,
        label: "User Dashboard",
        iconSvg: `
            <svg class="linkButtonIcon__972a0" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M4 13h6a1 1 0 001-1V4a1 1 0 00-1-1H4a1 1 0 00-1 1v8a1 1 0 001 1zm1-8h4v6H5V5zm9 16h6a1 1 0 001-1v-8a1 1 0 00-1-1h-6a1 1 0 00-1 1v8a1 1 0 001 1zm1-8h4v6h-4v-6zM4 21h6a1 1 0 001-1v-4a1 1 0 00-1-1H4a1 1 0 00-1 1v4a1 1 0 001 1zm1-4h4v2H5v-2zm9-8h6a1 1 0 001-1V4a1 1 0 00-1-1h-6a1 1 0 00-1 1v4a1 1 0 001 1zm1-4h4v2h-4V5z"/>
            </svg>
        `,
        isActive: () => state.isDashboardActive,
        onClick: e => {
            e.preventDefault();
            e.stopPropagation();

            setDashboardActive(!state.isDashboardActive);

            if (state.isDashboardActive && !window.location.pathname.startsWith("/channels/@me")) {
                NavigationRouter.transitionTo("/channels/@me");
            }

            setTimeout(() => {
                renderDashboardView();
                setupNativeButtonListeners();
            }, 50);
        }
    });
}

export function onRouteChanged() {
    let tries = 0;

    const tick = () => {
        if (insertDashboardButton()) {
            setupNativeButtonListeners();
            updateSelectionState();
            return;
        }

        if (++tries < 60) {
            requestAnimationFrame(tick);
        } else {

            setTimeout(() => {
                if (insertDashboardButton()) {
                    setupNativeButtonListeners();
                    updateSelectionState();
                }
            }, 500);
        }
    };

    requestAnimationFrame(tick);
}

function setupNativeButtonListeners() {
    const sidebar = document.querySelector('[class*="privateChannels_"]');
    if (!sidebar) return;

    const nativeButtons = sidebar.querySelectorAll('a, [class*="interactive_"]');

    nativeButtons.forEach(el => {
        if (el.closest('[id^="custom-sidebar-btn-"]') || el.getAttribute("data-ub-listener") === "true") return;

        el.setAttribute("data-ub-listener", "true");

        el.addEventListener("click", () => {
            if (state.isDashboardActive) {
                setDashboardActive(false);

                const href = (el as HTMLAnchorElement).getAttribute("href") || "";
                const isFriendsTab = href === "/channels/@me" || el.querySelector('[class*="friendsIcon_"]');

                renderDashboardView();

                if (isFriendsTab) {
                    NavigationRouter.transitionTo("/channels/@me");
                }
            }
        });
    });
}

export function updateSelectionState() {
    buttonRegistry.updateAllStates();

    if (state.isDashboardActive) {
        const sidebar = document.querySelector('[class*="privateChannels_"]');
        if (sidebar) {
            const selectedClasses = ["selected_f88cfd", "interactiveSelected__972a0"];
            sidebar.querySelectorAll('[class*="interactive_"]').forEach(el => {
                if (!el.closest('[id^="custom-sidebar-btn-"]')) {
                    selectedClasses.forEach(cls => el.classList.remove(cls));
                }
            });
        }
    }
}

export function insertDashboardButton(): boolean {
    registerDashboardButton();
    return buttonRegistry.renderAll();
}
