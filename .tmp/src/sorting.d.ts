import { HierarchyNode } from "./dataModel";
import { MatrixDataModel } from "./dataModel";
export interface SortConfiguration {
    sortBy: "hierarchy" | "value";
    sortDirection: "asc" | "desc";
    sortColumns: string[];
    multiColumnSort: boolean;
}
export declare class SortingManager {
    private sortConfig;
    sort(nodes: HierarchyNode[], dataModel: MatrixDataModel, config: SortConfiguration): HierarchyNode[];
    private sortByHierarchy;
    private sortByValue;
    private getNodeValue;
    setSortConfiguration(config: SortConfiguration): void;
    getSortConfiguration(): SortConfiguration;
    toggleSortDirection(): void;
    addSortColumn(columnName: string): void;
    removeSortColumn(columnName: string): void;
    clearSort(): void;
}
//# sourceMappingURL=sorting.d.ts.map