/*
 * Data Model - Properly extracts data from Power BI DataViewMatrix
 * Matches native Matrix visual behavior exactly
 */

/// <reference path="../node_modules/powerbi-visuals-api/index.d.ts"/>

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
    valueColumnIndex?: number; // For value columns (Expense, Revenue)
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

export class MatrixDataModel {
    private matrixDataView: powerbi.DataViewMatrix | null = null;
    private valueColumns: powerbi.DataViewValueColumn[] = [];
    private rowLevels: number = 0;
    private columnLevels: number = 0;
    
    public processDataView(
        matrixDataView: powerbi.DataViewMatrix,
        expandCollapseState: Map<string, boolean>
    ): void {
        this.matrixDataView = matrixDataView;
        
        // Extract value columns
        if ((matrixDataView as any).valueRoot?.children) {
            this.valueColumns = (matrixDataView as any).valueRoot.children;
        }
        
        // Get hierarchy levels
        this.rowLevels = matrixDataView.rows?.levels?.length || 0;
        this.columnLevels = matrixDataView.columns?.levels?.length || 0;
    }

    public getRowHierarchy(expandCollapseState: Map<string, boolean>): MatrixRow[] {
        if (!this.matrixDataView?.rows?.root) {
            return [];
        }

        return this.buildRowHierarchy(
            this.matrixDataView.rows.root,
            0,
            [],
            expandCollapseState
        );
    }

    public getColumnHierarchy(expandCollapseState: Map<string, boolean>): MatrixColumn[] {
        if (!this.matrixDataView?.columns?.root) {
            return [];
        }

        const columnHierarchy = this.buildColumnHierarchy(
            this.matrixDataView.columns.root,
            0,
            [],
            expandCollapseState
        );

        // Add value columns to leaf nodes
        return this.addValueColumnsToColumns(columnHierarchy);
    }

    private buildRowHierarchy(
        node: powerbi.DataViewMatrixNode,
        level: number,
        path: string[],
        expandCollapseState: Map<string, boolean>
    ): MatrixRow[] {
        const currentPath = [...path, node.value?.toString() || ""];
        const pathKey = currentPath.join("|");
        const isExpanded = expandCollapseState.get(pathKey) ?? (node.children && node.children.length > 0);

        const matrixRow: MatrixRow = {
            node: node,
            level: level,
            path: currentPath,
            isExpanded: !!isExpanded,
            isSubtotal: !!(node.isSubtotal || false),
            children: [],
            indentLevel: level
        };

        if (isExpanded && node.children) {
            for (const child of node.children) {
                const childRows = this.buildRowHierarchy(child, level + 1, currentPath, expandCollapseState);
                childRows.forEach(childRow => {
                    childRow.parent = matrixRow;
                    matrixRow.children.push(childRow);
                });
            }
        }

        return [matrixRow];
    }

    private buildColumnHierarchy(
        node: powerbi.DataViewMatrixNode,
        level: number,
        path: string[],
        expandCollapseState: Map<string, boolean>
    ): MatrixColumn[] {
        const currentPath = [...path, node.value?.toString() || ""];
        const pathKey = currentPath.join("|");
        const isExpanded = expandCollapseState.get(pathKey) ?? (node.children && node.children.length > 0);

        const matrixColumn: MatrixColumn = {
            node: node,
            level: level,
            path: currentPath,
            isExpanded: !!isExpanded,
            children: []
        };

        if (isExpanded && node.children) {
            for (const child of node.children) {
                const childColumns = this.buildColumnHierarchy(child, level + 1, currentPath, expandCollapseState);
                childColumns.forEach(childCol => {
                    childCol.parent = matrixColumn;
                    matrixColumn.children.push(childCol);
                });
            }
        }

        return [matrixColumn];
    }

    private addValueColumnsToColumns(columns: MatrixColumn[]): MatrixColumn[] {
        const result: MatrixColumn[] = [];
        
        for (const col of columns) {
            if (col.children.length === 0) {
                // Leaf node - add value columns
                for (let i = 0; i < this.valueColumns.length; i++) {
                    result.push({
                        ...col,
                        valueColumnIndex: i,
                        children: []
                    });
                }
            } else {
                // Has children - recurse
                const expandedChildren = this.addValueColumnsToColumns(col.children);
                result.push({
                    ...col,
                    children: expandedChildren
                });
            }
        }

        return result;
    }

    public getFlattenedRows(rows: MatrixRow[]): MatrixRow[] {
        const result: MatrixRow[] = [];
        
        for (const row of rows) {
            result.push(row);
            if (row.isExpanded && row.children.length > 0) {
                result.push(...this.getFlattenedRows(row.children));
            }
        }

        return result;
    }

    public getFlattenedColumns(columns: MatrixColumn[]): MatrixColumn[] {
        const result: MatrixColumn[] = [];
        
        for (const col of columns) {
            result.push(col);
            if (col.isExpanded && col.children.length > 0) {
                result.push(...this.getFlattenedColumns(col.children));
            }
        }

        return result;
    }

    public getCellValue(
        rowPath: string[],
        columnPath: string[],
        valueColumnIndex: number
    ): MatrixCell | null {
        if (!this.matrixDataView?.rows?.root) {
            return null;
        }

        // Find row node
        const rowNode = this.findNodeByPath(this.matrixDataView.rows.root, rowPath);
        if (!rowNode || !rowNode.values) {
            return null;
        }

        // Get value from values object
        // DataViewMatrixNode.values is an object mapping column indices to values
        const valuesObj = rowNode.values as any;
        if (!valuesObj) {
            return null;
        }

        // Build all column paths to find index
        const allColumnPaths: { path: string[]; valueIndex: number }[] = [];
        if (this.matrixDataView.columns?.root) {
            this.collectAllColumnPaths(this.matrixDataView.columns.root, [], allColumnPaths);
        }

        // Find matching column index
        let columnIndex = -1;
        for (let i = 0; i < allColumnPaths.length; i++) {
            const colPath = allColumnPaths[i];
            if (this.pathsMatch(colPath.path, columnPath) && colPath.valueIndex === valueColumnIndex) {
                columnIndex = i;
                break;
            }
        }

        if (columnIndex < 0) {
            return null;
        }

        // Get value - values object uses numeric keys
        const value = valuesObj[columnIndex];
        if (value === null || value === undefined) {
            return null;
        }

        const numValue = typeof value === 'number' ? value : parseFloat(value.toString()) || null;
        const formattedValue = this.formatValue(numValue, valueColumnIndex);

        return {
            rowPath: rowPath,
            columnPath: columnPath,
            value: numValue,
            formattedValue: formattedValue,
            valueColumnIndex: valueColumnIndex
        };
    }

    private findNodeByPath(
        node: powerbi.DataViewMatrixNode,
        path: string[]
    ): powerbi.DataViewMatrixNode | null {
        if (path.length === 0) {
            return node;
        }

        const currentValue = node.value?.toString() || "";
        if (path[0] === currentValue) {
            if (path.length === 1) {
                return node;
            }

            if (node.children) {
                for (const child of node.children) {
                    const found = this.findNodeByPath(child, path.slice(1));
                    if (found) {
                        return found;
                    }
                }
            }
        }

        return null;
    }

    private collectAllColumnPaths(
        node: powerbi.DataViewMatrixNode,
        currentPath: string[],
        result: { path: string[]; valueIndex: number }[]
    ): void {
        const newPath = [...currentPath, node.value?.toString() || ""];

        if (!node.children || node.children.length === 0) {
            // Leaf node - add value columns
            for (let i = 0; i < this.valueColumns.length; i++) {
                result.push({ path: newPath, valueIndex: i });
            }
        } else {
            for (const child of node.children) {
                this.collectAllColumnPaths(child, newPath, result);
            }
        }
    }

    private pathsMatch(path1: string[], path2: string[]): boolean {
        if (path1.length !== path2.length) {
            return false;
        }
        for (let i = 0; i < path1.length; i++) {
            if (path1[i] !== path2[i]) {
                return false;
            }
        }
        return true;
    }

    private formatValue(value: number | null, valueColumnIndex: number): string {
        if (value === null) {
            return "";
        }

        if (this.valueColumns && this.valueColumns.length > valueColumnIndex) {
            const valueColumn = this.valueColumns[valueColumnIndex];
            const format = (valueColumn.source as any)?.format;
            if (format) {
                // Use Power BI formatting
                return this.applyFormat(value, format);
            }
        }

        // Default formatting
        return value.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    private applyFormat(value: number, format: string): string {
        // Basic number formatting
        if (format.includes('$') || format.includes('€') || format.includes('£')) {
            return value.toLocaleString(undefined, {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
        }

        // Decimal places
        const decimalMatch = format.match(/\.(0+)/);
        if (decimalMatch) {
            const decimals = decimalMatch[1].length;
            return value.toLocaleString(undefined, {
                minimumFractionDigits: decimals,
                maximumFractionDigits: decimals
            });
        }

        return value.toLocaleString();
    }

    public getValueColumns(): powerbi.DataViewValueColumn[] {
        return this.valueColumns;
    }

    public getRowLevels(): number {
        return this.rowLevels;
    }

    public getColumnLevels(): number {
        return this.columnLevels;
    }
}
