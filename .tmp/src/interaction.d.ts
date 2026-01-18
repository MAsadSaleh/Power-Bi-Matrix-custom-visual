import { RenderingEngine } from "./rendering";
import { HierarchyManager } from "./hierarchy";
export interface SelectionState {
    selectedCells: Set<string>;
    selectedRows: Set<number>;
    selectedColumns: Set<number>;
    selectionStart: {
        row: number;
        column: number;
    } | null;
    isMultiSelect: boolean;
}
export declare class InteractionManager {
    private container;
    private selectionManager;
    private host;
    private renderingEngine;
    private hierarchyManager;
    private selectionState;
    private isMouseDown;
    private dragStart;
    constructor(container: HTMLElement, selectionManager: any, host: powerbi.extensibility.visual.IVisualHost, renderingEngine: RenderingEngine);
    setHierarchyManager(hierarchyManager: HierarchyManager): void;
    handleClick(event: MouseEvent): void;
    private handleExpandCollapse;
    private handleCellClick;
    handleMouseDown(event: MouseEvent): void;
    handleMouseUp(event: MouseEvent): void;
    handleContextMenu(event: MouseEvent): void;
    private selectCell;
    private toggleCellSelection;
    private selectBlock;
    private selectRow;
    private selectColumn;
    private clearSelection;
    private updateCellSelection;
    private applyCrossFiltering;
    getSelectionState(): SelectionState;
}
//# sourceMappingURL=interaction.d.ts.map