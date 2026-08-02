export const state = {
    isDashboardActive: false
};

export function setDashboardActive(active: boolean) {
    state.isDashboardActive = active;
}

export interface CustomSidebarButton {
    id: string;
    label: string;
    iconSvg: string;
    onClick: (event: MouseEvent) => void;
    isActive?: () => boolean;
}
