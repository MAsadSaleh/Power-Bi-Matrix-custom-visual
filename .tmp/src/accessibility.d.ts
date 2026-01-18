import { MatrixDataModel } from "./dataModel";
import { HierarchyManager } from "./hierarchy";
import { RenderingEngine } from "./rendering";
export declare class AccessibilityManager {
    private container;
    private currentFocus;
    private isHighContrast;
    initialize(container: HTMLElement): void;
    update(dataModel: MatrixDataModel, hierarchyManager: HierarchyManager, renderingEngine: RenderingEngine): void;
    handleKeyboard(event: KeyboardEvent): boolean;
    private updateFocus;
    private activateCell;
    private clearFocus;
    private scrollPageUp;
    private scrollPageDown;
    private setupARIA;
    private updateARIALabels;
    private announceCell;
    private detectHighContrast;
    private applyHighContrastStyles;
    getCurrentFocus(): {
        row: number;
        column: number;
    } | null;
}
//# sourceMappingURL=accessibility.d.ts.map