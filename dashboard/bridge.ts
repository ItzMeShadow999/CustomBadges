export interface DashboardPreviewData {
    imageUrl: string;
    displayName: string;
    ownerTag: string | null;
    nameColor: string;
    iconShape: string;
    iconSize: number;
    background: string;
    sampleFailed: boolean;
}

export interface DashboardBridge {
    settings: any;
    presetLabels: string[];
    getPreviewData: () => Promise<DashboardPreviewData | null>;
    shareMyBadge: () => void;
    revertBadge: () => void;
    refreshBadgeCache: () => void;
    importBadgeFromCode: () => void;
    applySelectedPreset: () => void;
    createNewBadgeSlot: () => void;
    importPackFromUrl: () => void;
    makePack: () => void;
    browsePacks: () => void;
    onBadgeModeChange: (mode: string) => void;
}

let bridge: DashboardBridge | null = null;

export function setDashboardBridge(b: DashboardBridge) {
    bridge = b;
}


export function getDashboardBridge(): DashboardBridge | null {
    return bridge;
}
