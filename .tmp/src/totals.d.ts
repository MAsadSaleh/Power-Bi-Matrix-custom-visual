import { MatrixDataModel } from "./dataModel";
import { HierarchyManager } from "./hierarchy";
export interface TotalsSettings {
    showRowSubtotals?: boolean;
    showColumnSubtotals?: boolean;
    showRowGrandTotals?: boolean;
    showColumnGrandTotals?: boolean;
    aggregationType?: "sum" | "average" | "min" | "max" | "count" | "distinctCount";
}
export interface TotalValue {
    value: number;
    formattedValue: string;
    isSubtotal: boolean;
    isGrandTotal: boolean;
}
export declare class TotalsCalculator {
    private rowSubtotals;
    private columnSubtotals;
    private rowGrandTotals;
    private columnGrandTotals;
    private settings;
    calculateTotals(dataModel: MatrixDataModel, hierarchyManager: HierarchyManager, settings: TotalsSettings): void;
    private calculateRowTotals;
    private calculateColumnTotals;
    private groupByLevel;
    private calculateSubtotal;
    private calculateGrandTotal;
    private aggregate;
    private formatValue;
    getRowSubtotal(key: string): TotalValue | undefined;
    getColumnSubtotal(key: string): TotalValue | undefined;
    getRowGrandTotal(columnIndex: number): TotalValue | undefined;
    getColumnGrandTotal(rowIndex: number): TotalValue | undefined;
}
//# sourceMappingURL=totals.d.ts.map