export interface RowHeaderSettings {
    fontFamily?: string;
    fontSize?: number;
    fontColor?: string;
    backgroundColor?: string;
    wordWrap?: boolean;
    alignment?: "left" | "center" | "right";
    border?: boolean;
}
export interface ColumnHeaderSettings {
    fontFamily?: string;
    fontSize?: number;
    fontColor?: string;
    backgroundColor?: string;
    wordWrap?: boolean;
    alignment?: "left" | "center" | "right";
    border?: boolean;
}
export interface ValueSettings {
    fontFamily?: string;
    fontSize?: number;
    fontColor?: string;
    backgroundColor?: string;
    alignment?: "left" | "center" | "right";
    numberFormat?: string;
    decimalPlaces?: number;
    conditionalFormatting?: "none" | "background" | "font" | "dataBars" | "icons";
}
export interface GridSettings {
    gridlines?: boolean;
    horizontalGridlines?: boolean;
    verticalGridlines?: boolean;
    rowBanding?: boolean;
    columnBanding?: boolean;
    bandingColor?: string;
    padding?: number;
    outlineStyle?: "stepped" | "none";
}
export interface TotalsSettings {
    showRowSubtotals?: boolean;
    showColumnSubtotals?: boolean;
    showRowGrandTotals?: boolean;
    showColumnGrandTotals?: boolean;
    subtotalFontFamily?: string;
    subtotalFontSize?: number;
    subtotalFontColor?: string;
    subtotalBackgroundColor?: string;
    grandTotalFontFamily?: string;
    grandTotalFontSize?: number;
    grandTotalFontColor?: string;
    grandTotalBackgroundColor?: string;
    subtotalSettings?: RowHeaderSettings;
    grandTotalSettings?: RowHeaderSettings;
}
export interface SortingSettings {
    sortBy?: "hierarchy" | "value";
    sortDirection?: "asc" | "desc";
}
export declare class FormattingSettingsService {
    private rowHeaderSettings;
    private columnHeaderSettings;
    private valueSettings;
    private gridSettings;
    private totalsSettings;
    private sortingSettings;
    update(dataViews: powerbi.DataView[]): void;
    private updateRowHeaderSettings;
    private updateColumnHeaderSettings;
    private updateValueSettings;
    private updateGridSettings;
    private updateTotalsSettings;
    private updateSortingSettings;
    enumerateObjectInstances(options: powerbi.EnumerateVisualObjectInstancesOptions): powerbi.VisualObjectInstanceEnumeration;
    getRowHeaderSettings(): RowHeaderSettings;
    getColumnHeaderSettings(): ColumnHeaderSettings;
    getValueSettings(): ValueSettings;
    getGridSettings(): GridSettings;
    getTotalsSettings(): TotalsSettings;
    getSortingSettings(): SortingSettings;
}
//# sourceMappingURL=formattingSettings.d.ts.map