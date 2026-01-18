import { MatrixDataModel } from "./dataModel";
import { HierarchyManager } from "./hierarchy";
export interface VisibleRange {
    startRow: number;
    endRow: number;
    startColumn: number;
    endColumn: number;
    totalRows: number;
    totalColumns: number;
}
export declare class VirtualizationEngine {
    private container;
    private visibleRange;
    private rowHeight;
    private columnWidth;
    private bufferRows;
    private bufferColumns;
    private scrollTop;
    private scrollLeft;
    constructor(container: HTMLElement);
    update(viewport: {
        width: number;
        height: number;
    }, dataModel: MatrixDataModel, hierarchyManager: HierarchyManager): void;
    getVisibleRange(): VisibleRange;
    setScrollPosition(scrollTop: number, scrollLeft: number): void;
    getScrollPosition(): {
        scrollTop: number;
        scrollLeft: number;
    };
    setRowHeight(height: number): void;
    setColumnWidth(width: number): void;
    getRowHeight(): number;
    getColumnWidth(): number;
    getTotalHeight(): number;
    getTotalWidth(): number;
    private setupScrollHandlers;
    isRowVisible(rowIndex: number): boolean;
    isColumnVisible(columnIndex: number): boolean;
    getRowOffset(rowIndex: number): number;
    getColumnOffset(columnIndex: number): number;
}
//# sourceMappingURL=virtualization.d.ts.map