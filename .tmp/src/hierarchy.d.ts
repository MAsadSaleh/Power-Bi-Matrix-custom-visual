import { HierarchyNode } from "./dataModel";
export declare class HierarchyManager {
    private rowHierarchy;
    private columnHierarchy;
    private sortSettings;
    processHierarchies(rowHierarchy: HierarchyNode[], columnHierarchy: HierarchyNode[], expandCollapseState: Map<string, boolean>): void;
    private applyExpandCollapseState;
    expandNode(nodeKey: string, isRow: boolean): void;
    collapseNode(nodeKey: string, isRow: boolean): void;
    toggleNode(nodeKey: string, isRow: boolean): void;
    expandAll(level: number, isRow: boolean): void;
    collapseAll(level: number, isRow: boolean): void;
    private expandAllAtLevel;
    private collapseAllAtLevel;
    drillDown(nodeKey: string, isRow: boolean): void;
    drillUp(nodeKey: string, isRow: boolean): void;
    reorderHierarchy(fieldName: string, newIndex: number, isRow: boolean): void;
    private findNode;
    private applySorting;
    setSortSettings(settings: {
        sortBy: "hierarchy" | "value";
        sortDirection: "asc" | "desc";
        sortColumns?: string[];
    }): void;
    getVisibleRows(): HierarchyNode[];
    getVisibleColumns(): HierarchyNode[];
    private flattenVisible;
    getRowHierarchy(): HierarchyNode[];
    getColumnHierarchy(): HierarchyNode[];
}
//# sourceMappingURL=hierarchy.d.ts.map