import { dashboardHtml, headerBarHtml } from "./html";
import { state } from "./types";
import { buttonRegistry } from "./buttonRegistry";
import { getDashboardBridge } from "./bridge";
import { wireDashboardSettings } from "./wireSettings";

const DASHBOARD_CANVAS_ID = "ub-dashboard-wrapper";

const ANIM_DURATION_MS = 200;
const ANIM_EASING = "cubic-bezier(0.16, 1, 0.3, 1)";

let closeTimeoutId: number | null = null;

function setClosedState(wrapper: HTMLElement) {
    wrapper.style.opacity = "0";
    wrapper.style.transform = "scale(0.97) translateY(10px)";
}

function setOpenState(wrapper: HTMLElement) {
    wrapper.style.opacity = "1";
    wrapper.style.transform = "scale(1) translateY(0)";
}

function getMainArea(): HTMLElement | null {
    return (
        (document.querySelector('div[class*="sidebar_"] + div') as HTMLElement) ||
        (document.querySelector('div[class*="base_"] div[class*="content_"] > div:nth-child(2)') as HTMLElement) ||
        document.querySelector("main")?.parentElement ||
        null
    );
}

let repositionHandlersBound = false;

function positionWrapperOverMainArea(wrapper: HTMLElement, mainArea: HTMLElement) {
    const rect = mainArea.getBoundingClientRect();
    wrapper.style.top = `${rect.top}px`;
    wrapper.style.left = `${rect.left}px`;
    wrapper.style.width = `${rect.width}px`;
    wrapper.style.height = `${rect.height}px`;
}

export function renderDashboardView(): void {
    if (!state.isDashboardActive) {
        restoreDefaultView();
        return;
    }

    const mainArea = getMainArea();
    if (!mainArea) return;

    let wrapper = document.getElementById(DASHBOARD_CANVAS_ID);

    if (!wrapper) {
        wrapper = document.createElement("div");
        wrapper.id = DASHBOARD_CANVAS_ID;

        wrapper.className = "page__5e434 container__955a3";
        wrapper.style.cssText = `
            display: flex;
            flex-direction: column;
            background-color: #000000;
            position: fixed;
            z-index: 100;
            overflow: hidden;
            transition: opacity ${ANIM_DURATION_MS}ms ${ANIM_EASING}, transform ${ANIM_DURATION_MS}ms ${ANIM_EASING};
            will-change: opacity, transform;
        `;
        setClosedState(wrapper);

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

    
    
    
    
    
    
    
    
    
    if (closeTimeoutId !== null) {
        window.clearTimeout(closeTimeoutId);
        closeTimeoutId = null;
    }

    const isNewlyMounted = !document.body.contains(wrapper);
    if (isNewlyMounted) {
        document.body.appendChild(wrapper);
    }

    positionWrapperOverMainArea(wrapper, mainArea);

    if (isNewlyMounted) {
        
        
        
        requestAnimationFrame(() => {
            requestAnimationFrame(() => setOpenState(wrapper as HTMLElement));
        });
    }

    if (!repositionHandlersBound) {
        repositionHandlersBound = true;

        const reposition = () => {
            if (!state.isDashboardActive) return;
            const area = getMainArea();
            const w = document.getElementById(DASHBOARD_CANVAS_ID);
            if (area && w) positionWrapperOverMainArea(w, area);
        };

        window.addEventListener("resize", reposition);
        
        
        
        setInterval(reposition, 500);
    }

    buttonRegistry.updateAllStates();
}

export function restoreDefaultView(): void {
    const wrapper = document.getElementById(DASHBOARD_CANVAS_ID);
    if (wrapper && closeTimeoutId === null) {
        setClosedState(wrapper);
        closeTimeoutId = window.setTimeout(() => {
            wrapper.remove();
            closeTimeoutId = null;
        }, ANIM_DURATION_MS);
    }

    buttonRegistry.updateAllStates();
}
