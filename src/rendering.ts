/*
 * Rendering Engine - Pixel-perfect rendering matching native Power BI Matrix
 */

/// <reference path="../node_modules/powerbi-visuals-api/index.d.ts"/>
import { MatrixDataModel, MatrixRow, MatrixColumn, MatrixCell } from "./dataModel";
import { FormattingSettingsService } from "./formattingSettings";

export class RenderingEngine {
    private container: HTMLElement;
    private host: powerbi.extensibility.visual.IVisualHost;
    private tableWrapper!: HTMLElement;
    private headerWrapper!: HTMLElement;
    private bodyWrapper!: HTMLElement;
    private rowHeaderWrapper!: HTMLElement;
    private table!: HTMLTableElement;
    private rowHeaderTable!: HTMLTableElement;
    private expandCollapseState: Map<string, boolean>;

    constructor(
        container: HTMLElement,
        host: powerbi.extensibility.visual.IVisualHost,
        expandCollapseState: Map<string, boolean>
    ) {
        this.container = container;
        this.host = host;
        this.expandCollapseState = expandCollapseState;
        this.initializeDOM();
    }

    private initializeDOM(): void {
        this.container.innerHTML = "";
        this.container.className = "matrix-visual-container";
        this.container.style.position = "relative";
        this.container.style.width = "100%";
        this.container.style.height = "100%";
        this.container.style.overflow = "hidden";
        this.container.style.fontFamily = "Segoe UI, -apple-system, BlinkMacSystemFont, sans-serif";
        this.container.style.fontSize = "11px";

        // Create wrapper structure for sticky headers
        this.tableWrapper = document.createElement("div");
        this.tableWrapper.className = "matrix-table-wrapper";
        this.tableWrapper.style.position = "relative";
        this.tableWrapper.style.width = "100%";
        this.tableWrapper.style.height = "100%";
        this.tableWrapper.style.overflow = "auto";

        // Header wrapper (sticky)
        this.headerWrapper = document.createElement("div");
        this.headerWrapper.className = "matrix-header-wrapper";
        this.headerWrapper.style.position = "sticky";
        this.headerWrapper.style.top = "0";
        this.headerWrapper.style.zIndex = "10";
        this.headerWrapper.style.backgroundColor = "#ffffff";

        // Body wrapper
        this.bodyWrapper = document.createElement("div");
        this.bodyWrapper.className = "matrix-body-wrapper";

        // Row header wrapper (sticky left)
        this.rowHeaderWrapper = document.createElement("div");
        this.rowHeaderWrapper.className = "matrix-row-header-wrapper";
        this.rowHeaderWrapper.style.position = "absolute";
        this.rowHeaderWrapper.style.left = "0";
        this.rowHeaderWrapper.style.top = "0";
        this.rowHeaderWrapper.style.zIndex = "11";
        this.rowHeaderWrapper.style.backgroundColor = "#ffffff";
        this.rowHeaderWrapper.style.boxShadow = "2px 0 4px rgba(0,0,0,0.1)";

        // Main table
        this.table = document.createElement("table");
        this.table.className = "matrix-table";
        this.table.style.borderCollapse = "collapse";
        this.table.style.width = "100%";
        this.table.style.tableLayout = "auto";
        this.table.cellSpacing = "0";
        this.table.cellPadding = "0";

        // Row header table
        this.rowHeaderTable = document.createElement("table");
        this.rowHeaderTable.className = "matrix-row-header-table";
        this.rowHeaderTable.style.borderCollapse = "collapse";
        this.rowHeaderTable.style.tableLayout = "auto";
        this.rowHeaderTable.cellSpacing = "0";
        this.rowHeaderTable.cellPadding = "0";

        this.tableWrapper.appendChild(this.headerWrapper);
        this.tableWrapper.appendChild(this.bodyWrapper);
        this.container.appendChild(this.tableWrapper);
        this.container.appendChild(this.rowHeaderWrapper);
    }

    public render(
        dataModel: MatrixDataModel,
        formattingSettings: FormattingSettingsService,
        viewport: { width: number; height: number }
    ): void {
        const rows = dataModel.getFlattenedRows(dataModel.getRowHierarchy(this.expandCollapseState));
        const columns = dataModel.getFlattenedColumns(dataModel.getColumnHierarchy(this.expandCollapseState));
        const valueColumns = dataModel.getValueColumns();

        // Clear previous render
        this.headerWrapper.innerHTML = "";
        this.bodyWrapper.innerHTML = "";
        this.rowHeaderWrapper.innerHTML = "";

        // Render column headers
        this.renderColumnHeaders(columns, dataModel.getRowLevels(), valueColumns, formattingSettings);

        // Render rows
        this.renderRows(rows, columns, dataModel, formattingSettings);

        // Render row headers (sticky)
        this.renderRowHeaders(rows, dataModel.getRowLevels(), formattingSettings);

        // Sync scroll
        this.syncScroll();
    }

    private renderColumnHeaders(
        columns: MatrixColumn[],
        rowLevels: number,
        valueColumns: powerbi.DataViewValueColumn[],
        formattingSettings: FormattingSettingsService
    ): void {
        const headerTable = document.createElement("table");
        headerTable.className = "matrix-header-table";
        headerTable.style.borderCollapse = "collapse";
        headerTable.style.width = "100%";
        headerTable.style.tableLayout = "auto";

        // Find max level
        const maxLevel = columns.length > 0 ? Math.max(...columns.map(c => c.level)) : 0;
        
        // Build header rows
        const headerRows: HTMLTableRowElement[] = [];
        for (let level = 0; level <= maxLevel; level++) {
            const row = document.createElement("tr");
            row.className = `header-row level-${level}`;
            headerRows.push(row);
        }

        // Add spacer for row headers
        const spacerWidth = rowLevels * 150;
        for (let level = 0; level <= maxLevel; level++) {
            const spacerCell = document.createElement("th");
            spacerCell.className = "header-spacer";
            spacerCell.style.width = `${spacerWidth}px`;
            spacerCell.style.minWidth = `${spacerWidth}px`;
            spacerCell.style.padding = "8px";
            spacerCell.style.border = "1px solid #e0e0e0";
            spacerCell.style.backgroundColor = "#f8f8f8";
            headerRows[level].appendChild(spacerCell);
        }

        // Group columns by hierarchy
        const columnMap = new Map<string, MatrixColumn[]>();
        for (const col of columns) {
            if (col.level === maxLevel) {
                // Leaf column - get parent path
                const parentPath = col.path.slice(0, -1);
                const key = parentPath.join("|");
                if (!columnMap.has(key)) {
                    columnMap.set(key, []);
                }
                columnMap.get(key)!.push(col);
            }
        }

        // Render column headers
        for (const [parentPathKey, leafColumns] of columnMap.entries()) {
            const parentPath = parentPathKey.split("|");
            
            // Render parent headers for each level
            for (let level = 0; level < parentPath.length; level++) {
                const pathPrefix = parentPath.slice(0, level + 1);
                const isLastLevel = level === parentPath.length - 1;
                const colspan = isLastLevel ? leafColumns.length : 1;
                
                // Check if this header was already added
                const existingHeader = headerRows[level].querySelector(`[data-path="${pathPrefix.join("|")}"]`);
                if (!existingHeader) {
                    const headerCell = document.createElement("th");
                    headerCell.className = `column-header level-${level}`;
                    headerCell.setAttribute("data-path", pathPrefix.join("|"));
                    if (colspan > 1) {
                        headerCell.setAttribute("colspan", colspan.toString());
                    }
                    headerCell.textContent = parentPath[level] || "";
                    headerCell.style.padding = "8px";
                    headerCell.style.border = "1px solid #e0e0e0";
                    headerCell.style.backgroundColor = "#f8f8f8";
                    headerCell.style.textAlign = "center";
                    headerCell.style.fontWeight = "600";
                    headerCell.style.whiteSpace = "nowrap";
                    headerRows[level].appendChild(headerCell);
                } else if (isLastLevel) {
                    // Update colspan for existing header
                    (existingHeader as HTMLElement).setAttribute("colspan", colspan.toString());
                }
            }

            // Render value column headers (leaf level)
            for (const leafCol of leafColumns) {
                const headerCell = document.createElement("th");
                headerCell.className = "column-header value-header";
                const valueCol = valueColumns[leafCol.valueColumnIndex || 0];
                headerCell.textContent = valueCol?.source?.displayName || valueCol?.source?.queryName || "";
                headerCell.style.padding = "8px";
                headerCell.style.border = "1px solid #e0e0e0";
                headerCell.style.backgroundColor = "#f8f8f8";
                headerCell.style.textAlign = "center";
                headerCell.style.fontWeight = "600";
                headerCell.style.whiteSpace = "nowrap";
                headerCell.style.minWidth = "100px";
                headerRows[maxLevel].appendChild(headerCell);
            }
        }

        // Append rows to table
        for (const row of headerRows) {
            headerTable.appendChild(row);
        }

        this.headerWrapper.appendChild(headerTable);
    }


    private renderRows(
        rows: MatrixRow[],
        columns: MatrixColumn[],
        dataModel: MatrixDataModel,
        formattingSettings: FormattingSettingsService
    ): void {
        const bodyTable = document.createElement("table");
        bodyTable.className = "matrix-body-table";
        bodyTable.style.borderCollapse = "collapse";
        bodyTable.style.width = "100%";
        bodyTable.style.tableLayout = "auto";

        for (const row of rows) {
            const tr = document.createElement("tr");
            tr.className = `data-row level-${row.level} ${row.isSubtotal ? "subtotal-row" : ""}`;
            tr.setAttribute("data-row-path", row.path.join("|"));

            // Add spacer for row headers
            const spacerCell = document.createElement("td");
            spacerCell.className = "row-spacer";
            spacerCell.style.width = `${dataModel.getRowLevels() * 150}px`;
            spacerCell.style.minWidth = `${dataModel.getRowLevels() * 150}px`;
            spacerCell.style.padding = "0";
            spacerCell.style.border = "none";
            tr.appendChild(spacerCell);

            // Render data cells - only render leaf columns
            const maxColLevel = columns.length > 0 ? Math.max(...columns.map(c => c.level)) : 0;
            for (const col of columns) {
                if (col.level === maxColLevel) {
                    // Leaf column
                    const cell = dataModel.getCellValue(
                        row.path,
                        col.path,
                        col.valueColumnIndex || 0
                    );

                    const td = document.createElement("td");
                    td.className = `data-cell ${row.isSubtotal ? "subtotal-cell" : ""}`;
                    td.textContent = cell?.formattedValue || "";
                    td.style.padding = "8px";
                    td.style.border = "1px solid #e0e0e0";
                    td.style.textAlign = "right";
                    td.style.whiteSpace = "nowrap";
                    td.style.fontSize = "11px";

                    if (row.isSubtotal) {
                        td.style.fontWeight = "600";
                        td.style.backgroundColor = "#f0f0f0";
                    }

                    tr.appendChild(td);
                }
            }

            bodyTable.appendChild(tr);
        }

        this.bodyWrapper.appendChild(bodyTable);
    }

    private renderRowHeaders(
        rows: MatrixRow[],
        rowLevels: number,
        formattingSettings: FormattingSettingsService
    ): void {
        this.rowHeaderTable.innerHTML = "";

        // Header row
        const headerRow = document.createElement("tr");
        for (let i = 0; i < rowLevels; i++) {
            const th = document.createElement("th");
            th.className = "row-header-header";
            th.style.padding = "8px";
            th.style.border = "1px solid #e0e0e0";
            th.style.backgroundColor = "#f8f8f8";
            th.style.fontWeight = "600";
            th.style.width = "150px";
            th.style.minWidth = "150px";
            headerRow.appendChild(th);
        }
        this.rowHeaderTable.appendChild(headerRow);

        // Data rows
        for (const row of rows) {
            const tr = document.createElement("tr");
            tr.className = `row-header-row level-${row.level}`;
            tr.style.height = "30px";

            for (let level = 0; level < rowLevels; level++) {
                const td = document.createElement("td");
                td.className = `row-header-cell level-${level}`;
                td.style.padding = "8px";
                td.style.border = "1px solid #e0e0e0";
                td.style.backgroundColor = "#ffffff";
                td.style.whiteSpace = "nowrap";
                td.style.width = "150px";
                td.style.minWidth = "150px";

                if (level === row.level) {
                    // This is the row's level
                    const indent = level * 20;
                    td.style.paddingLeft = `${8 + indent}px`;

                    // Expand/collapse indicator
                    if (row.node.children && row.node.children.length > 0) {
                        const indicator = document.createElement("span");
                        indicator.className = "expand-indicator";
                        indicator.textContent = row.isExpanded ? "−" : "+";
                        indicator.style.display = "inline-block";
                        indicator.style.width = "16px";
                        indicator.style.height = "16px";
                        indicator.style.marginRight = "4px";
                        indicator.style.textAlign = "center";
                        indicator.style.lineHeight = "16px";
                        indicator.style.cursor = "pointer";
                        indicator.style.userSelect = "none";
                        indicator.style.fontWeight = "bold";
                        indicator.style.fontSize = "14px";
                        indicator.setAttribute("data-path", row.path.join("|"));
                        td.appendChild(indicator);
                    }

                    td.appendChild(document.createTextNode(row.node.value?.toString() || ""));

                    if (row.isSubtotal) {
                        td.style.fontWeight = "600";
                        td.style.backgroundColor = "#f0f0f0";
                    }
                }

                tr.appendChild(td);
            }

            this.rowHeaderTable.appendChild(tr);
        }

        this.rowHeaderWrapper.appendChild(this.rowHeaderTable);
    }

    private syncScroll(): void {
        // Sync horizontal scroll between body and row headers
        this.tableWrapper.addEventListener("scroll", () => {
            this.rowHeaderWrapper.scrollTop = this.tableWrapper.scrollTop;
        });

        this.rowHeaderWrapper.addEventListener("scroll", () => {
            this.tableWrapper.scrollTop = this.rowHeaderWrapper.scrollTop;
        });
    }

    public getExpandCollapseElements(): NodeListOf<Element> {
        return this.rowHeaderWrapper.querySelectorAll(".expand-indicator");
    }
}
