export interface MatrixRow {
    node: powerbi.DataViewMatrixNode;
    level: number;
    path: string[];
    isExpanded: boolean;
    isSubtotal: boolean;
    children: MatrixRow[];
    parent?: MatrixRow;
    indentLevel: number;
}
export interface MatrixColumn {
    node: powerbi.DataViewMatrixNode;
    level: number;
    path: string[];
    isExpanded: boolean;
    valueColumnIndex?: number;
    children: MatrixColumn[];
    parent?: MatrixColumn;
}
export interface MatrixCell {
    rowPath: string[];
    columnPath: string[];
    value: number | null;
    formattedValue: string;
    valueColumnIndex: number;
}
export declare class MatrixDataModel {
    private matrixDataView;
    private valueColumns;
    private rowLevels;
    private columnLevels;
    processDataView(matrixDataView: powerbi.DataViewMatrix, expandCollapseState: Map<string, boolean>): void;
    getRowHierarchy(expandCollapseState: Map<string, boolean>): MatrixRow[];
    getColumnHierarchy(expandCollapseState: Map<string, boolean>): MatrixColumn[];
    private buildRowHierarchy;
    private buildColumnHierarchy;
    private addValueColumnsToColumns;
    getFlattenedRows(rows: MatrixRow[]): MatrixRow[];
    getFlattenedColumns(columns: MatrixColumn[]): MatrixColumn[];
    getCellValue(rowPath: string[], columnPath: string[], valueColumnIndex: number): MatrixCell | null;
    private findNodeByPath;
    private collectAllColumnPaths;
    private pathsMatch;
    private formatValue;
    private applyFormat;
    getValueColumns(): powerbi.DataViewValueColumn[];
    getRowLevels(): number;
    getColumnLevels(): number;
}
//# sourceMappingURL=dataModel.d.ts.map