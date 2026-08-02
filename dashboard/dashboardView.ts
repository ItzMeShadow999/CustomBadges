import { dashboardHtml, headerBarHtml } from "./html";
import { state } from "./types";
import { buttonRegistry } from "./buttonRegistry";
import { getDashboardBridge } from "./bridge";
import { wireDashboardSettings } from "./wireSettings";

const DASHBOARD_CANVAS_ID = "ub-dashboard-wrapper";

function getMainArea(): HTMLElement | null {
    return (
        (document.querySelector('div[class*="sidebar_"] + div') as HTMLElement) ||
        (document.querySelector('div[class*="base_"] div[class*="content_"] > div:nth-child(2)') as HTMLElement) ||
        document.querySelector("main")?.parentElement ||
        null
    );
}

export function renderDashboardView(): void {
    if (!state.isDashboardActive) {
        restoreDefaultView();
        return;
    }

    const mainArea = getMainArea();
    if (!mainArea) return;

    Array.from(mainArea.children).forEach(child => {
        const el = child as HTMLElement;
        if (el.id !== DASHBOARD_CANVAS_ID) {
            el.style.display = "none";
        }
    });

    let wrapper = document.getElementById(DASHBOARD_CANVAS_ID);

    if (!wrapper) {
        wrapper = document.createElement("div");
        wrapper.id = DASHBOARD_CANVAS_ID;

        wrapper.className = "page__5e434 container__955a3";
        wrapper.style.cssText = `
            display: flex;
            flex-direction: column;
            width: 100%;
            height: 100%;
            background-color: #000000;
            position: relative;
            z-index: 100;
            overflow: hidden;
        `;

        wrapper.innerHTML = `
            ${headerBarHtml()}
            <div id="ub-dashboard-content" style="
                display: flex;
                flex-direction: column;
                flex-grow: 1;
                box-sizing: border-box;
                overflow: hidden;
            ">
                ${dashboardHtml(getDashboardBridge()?.presetLabels ?? [])}
            </div>
        `;

        wireDashboardSettings(wrapper);
    }

    if (!mainArea.contains(wrapper)) {
        mainArea.appendChild(wrapper);
    }

    buttonRegistry.updateAllStates();
}

export function restoreDefaultView(): void {
    const mainArea = getMainArea();

    if (mainArea) {
        const wrapper = document.getElementById(DASHBOARD_CANVAS_ID);
        if (wrapper) {
            wrapper.remove();
        }

        Array.from(mainArea.children).forEach(child => {
            (child as HTMLElement).style.display = "";
        });
    }

    buttonRegistry.updateAllStates();
}
