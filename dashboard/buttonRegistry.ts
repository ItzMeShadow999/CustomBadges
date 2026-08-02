import { buttonHtml } from "./html";
import { CustomSidebarButton } from "./types";

class SidebarButtonRegistry {
    private buttons: Map<string, CustomSidebarButton> = new Map();

    public register(button: CustomSidebarButton): void {
        this.buttons.set(button.id, button);
        this.renderAll();
    }

    public unregister(id: string): void {
        if (this.buttons.delete(id)) {
            const existingEl = document.getElementById(`custom-sidebar-btn-${id}`);
            existingEl?.remove();
        }
    }

    public getAll(): CustomSidebarButton[] {
        return Array.from(this.buttons.values());
    }

    private getSidebarContainer(): HTMLElement | null {
        return (
            document.querySelector('nav[class*="privateChannels_"] [role="list"]') ||
            document.querySelector('nav[class*="privateChannels_"]') ||
            document.querySelector('ul[class*="content_"]')
        );
    }

    public renderAll(): boolean {
        const sidebarContainer = this.getSidebarContainer();
        if (!sidebarContainer) return false;

        const dmHeader =
            sidebarContainer.querySelector('[class*="sectionDivider_"]') ||
            sidebarContainer.querySelector('h2[class*="headerText_"]')?.parentElement?.parentElement ||
            sidebarContainer.querySelector('[class*="privateChannel_"]');

        const navItems = sidebarContainer.querySelectorAll('[class*="listItem_"]:not([id^="custom-sidebar-btn-"])');
        const lastNavItem = navItems.length > 0 ? navItems[navItems.length - 1] : null;

        let injectedAny = false;

        for (const button of this.buttons.values()) {
            const elementId = `custom-sidebar-btn-${button.id}`;
            let buttonElement = document.getElementById(elementId);

            if (!buttonElement) {
                buttonElement = document.createElement("div");
                buttonElement.id = elementId;

                buttonElement.className = "channel__972a0 container_e45859";

                if (lastNavItem && lastNavItem.parentElement === sidebarContainer) {
                    lastNavItem.after(buttonElement);
                } else if (dmHeader && dmHeader.parentElement === sidebarContainer) {
                    sidebarContainer.insertBefore(buttonElement, dmHeader);
                } else {
                    sidebarContainer.appendChild(buttonElement);
                }
            }

            const isSelected = Boolean(button.isActive?.());
            buttonElement.innerHTML = buttonHtml(button.label, button.iconSvg, isSelected);

            const link = buttonElement.querySelector("a");
            if (link) {
                link.onclick = e => {
                    e.preventDefault();
                    button.onClick(e);
                    this.updateAllStates();
                };
            }

            injectedAny = true;
        }

        return injectedAny;
    }

    public updateAllStates(): void {
        for (const button of this.buttons.values()) {
            const el = document.getElementById(`custom-sidebar-btn-${button.id}`);
            if (!el) continue;

            const interactiveDiv = el.querySelector(".interactive_f88cfd");
            if (interactiveDiv) {
                if (button.isActive?.()) {
                    interactiveDiv.classList.add("selected__972a0", "selected_f88cfd");
                } else {
                    interactiveDiv.classList.remove("selected__972a0", "selected_f88cfd");
                }
            }
        }
    }
}

export const buttonRegistry = new SidebarButtonRegistry();
