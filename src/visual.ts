/*
 * Power BI Custom Visual - Matrix Visual Replica
 * Exact match to native Power BI Matrix visual
 */

/// <reference path="../node_modules/powerbi-visuals-api/index.d.ts"/>
import * as d3 from "d3";
import { FormattingSettingsService } from "./formattingSettings";
import { MatrixDataModel } from "./dataModel";
import { RenderingEngine } from "./rendering";

export class MatrixVisualReplica implements powerbi.extensibility.visual.IVisual {
    private host: powerbi.extensibility.visual.IVisualHost;
    private element: HTMLElement;
    private formattingSettings: FormattingSettingsService;
    private dataModel: MatrixDataModel;
    private renderingEngine: RenderingEngine;
    private container: HTMLElement;
    private viewport!: { width: number; height: number };
    private expandCollapseState: Map<string, boolean> = new Map();

    constructor(options?: powerbi.extensibility.visual.VisualConstructorOptions) {
        if (!options) {
            throw new Error("VisualConstructorOptions are required");
        }
        this.host = options.host;
        this.element = options.element;
        
        // Initialize services
        this.formattingSettings = new FormattingSettingsService();
        this.dataModel = new MatrixDataModel();
        
        // Create container
        this.container = document.createElement("div");
        this.container.className = "matrix-visual-container";
        this.element.appendChild(this.container);
        
        // Initialize rendering engine
        this.renderingEngine = new RenderingEngine(
            this.container,
            this.host,
            this.expandCollapseState
        );
        
        // Setup event handlers
        // this.setupEventHandlers();
    }

    public update(options: powerbi.extensibility.visual.VisualUpdateOptions) {
        try {
            console.log("Matrix Visual Update - Starting render");

            const dataView: powerbi.DataView = options.dataViews?.[0];
            if (!dataView) {
                console.log("No dataView available");
                this.clearVisual();
                return;
            }

            // Defensive check for matrix structure
            if (!dataView.matrix || !dataView.matrix.rows || !dataView.matrix.columns) {
                console.log("Matrix structure not available");
                this.clearVisual();
                return;
            }

            console.log("Matrix data available:", {
                hasRows: !!dataView.matrix.rows.root,
                hasColumns: !!dataView.matrix.columns.root,
                rowChildren: dataView.matrix.rows.root?.children?.length || 0,
                columnChildren: dataView.matrix.columns.root?.children?.length || 0
            });

            // Update viewport
            this.viewport = {
                width: options.viewport.width,
                height: options.viewport.height
            };

            // Update formatting settings
            this.formattingSettings.update(options.dataViews);

            // Clear container using D3
            d3.select(this.container).selectAll("*").remove();

            // Create table using D3
            const table = d3.select(this.container)
                .append("table")
                .style("border-collapse", "collapse")
                .style("width", "100%")
                .style("font-family", "Segoe UI, sans-serif")
                .style("font-size", "11px");

            // Create thead
            const thead = table.append("thead");
            const headerRow = thead.append("tr");

            // Add hierarchy header
            headerRow.append("th")
                .style("width", "200px")
                .style("padding", "8px")
                .style("border", "1px solid #ddd")
                .style("background-color", "#f8f8f8")
                .style("text-align", "left")
                .style("font-weight", "600")
                .text("Hierarchy");

            // Build column headers from matrix columns
            if (dataView.matrix.columns.root?.children) {
                this.buildColumnHeadersD3(headerRow, dataView.matrix.columns.root.children, dataView.matrix);
            }

            // Create tbody
            const tbody = table.append("tbody");

            // Recursively build rows from matrix rows
            if (dataView.matrix.rows.root?.children) {
                this.buildMatrixRowsD3(tbody, dataView.matrix.rows.root.children, 0, dataView.matrix);
            }

            console.log("Matrix Visual Update - Render completed successfully");

        } catch (error) {
            console.error("Error rendering matrix visual:", error);
            this.showError(`Error rendering matrix visual: ${error}`);
        }
    }

    public enumerateObjectInstances(
        options: powerbi.EnumerateVisualObjectInstancesOptions
    ): powerbi.VisualObjectInstanceEnumeration {
        return this.formattingSettings.enumerateObjectInstances(options);
    }

    private buildColumnHeadersD3(headerRow: d3.Selection<HTMLTableRowElement, unknown, null, undefined>, columnNodes: powerbi.DataViewMatrixNode[], matrix: powerbi.DataViewMatrix): void {
        console.log("Building column headers for", columnNodes.length, "column nodes");

        columnNodes.forEach(columnNode => {
            if (columnNode.children && columnNode.children.length > 0) {
                // Recursively build child headers
                this.buildColumnHeadersD3(headerRow, columnNode.children, matrix);
            } else {
                // Leaf column - add headers for Month and then Expense/Revenue
                console.log("Adding column header for:", columnNode.value);

                // Add Month header
                headerRow.append("th")
                    .style("padding", "8px")
                    .style("border", "1px solid #ddd")
                    .style("background-color", "#f8f8f8")
                    .style("text-align", "center")
                    .style("font-weight", "600")
                    .text(columnNode.value ? columnNode.value.toString() : "");

                // Add Expense and Revenue headers for this month
                headerRow.append("th")
                    .style("padding", "8px")
                    .style("border", "1px solid #ddd")
                    .style("background-color", "#f8f8f8")
                    .style("text-align", "center")
                    .style("font-weight", "600")
                    .text("Expense");

                headerRow.append("th")
                    .style("padding", "8px")
                    .style("border", "1px solid #ddd")
                    .style("background-color", "#f8f8f8")
                    .style("text-align", "center")
                    .style("font-weight", "600")
                    .text("Revenue");
            }
        });
    }

    private buildMatrixRowsD3(tbody: d3.Selection<HTMLTableSectionElement, unknown, null, undefined>, rowNodes: powerbi.DataViewMatrixNode[], level: number, matrix: powerbi.DataViewMatrix): void {
        console.log("Building matrix rows for level", level, "with", rowNodes.length, "nodes");

        rowNodes.forEach(rowNode => {
            const row = tbody.append("tr");

            // Add hierarchy cell with indentation
            const hierarchyCell = row.append("td")
                .style("padding", "8px")
                .style("border", "1px solid #ddd")
                .style("padding-left", `${(level * 20) + 8}px`)
                .style("background-color", "#f8f8f8")
                .text(rowNode.value ? rowNode.value.toString() : "");

            // Add expand/collapse indicator if has children
            if (rowNode.children && rowNode.children.length > 0) {
                const isExpanded = this.expandCollapseState.get(rowNode.value?.toString() || "") ?? true;

                hierarchyCell
                    .style("cursor", "pointer")
                    .on("click", () => {
                        const key = rowNode.value?.toString() || "";
                        const currentlyExpanded = this.expandCollapseState.get(key) ?? true;
                        this.expandCollapseState.set(key, !currentlyExpanded);
                        // Trigger re-render
                        this.host.refreshHostData();
                    });

                // Add expand/collapse text
                hierarchyCell.append("span")
                    .style("margin-right", "5px")
                    .text(isExpanded ? "▼" : "▶");
            }

            // Add data cells for each column combination
            if (matrix.columns.root?.children) {
                this.addMatrixDataCellsD3(row, matrix.columns.root.children, rowNode, matrix);
            }

            // Recursively add children if expanded
            if (rowNode.children && rowNode.children.length > 0) {
                const isExpanded = this.expandCollapseState.get(rowNode.value?.toString() || "") ?? true;
                if (isExpanded) {
                    this.buildMatrixRowsD3(tbody, rowNode.children, level + 1, matrix);
                }
            }
        });
    }

    private addMatrixDataCellsD3(row: d3.Selection<HTMLTableRowElement, unknown, null, undefined>, columnNodes: powerbi.DataViewMatrixNode[], rowNode: powerbi.DataViewMatrixNode, matrix: powerbi.DataViewMatrix): void {
        columnNodes.forEach(columnNode => {
            if (columnNode.children && columnNode.children.length > 0) {
                // Recursively add cells for child columns
                this.addMatrixDataCellsD3(row, columnNode.children, rowNode, matrix);
            } else {
                // For each leaf column, add Expense and Revenue cells
                // Get values from the row node's values array
                const expenseValue = this.getMatrixCellValue(rowNode, 0); // Expense is typically index 0
                const revenueValue = this.getMatrixCellValue(rowNode, 1); // Revenue is typically index 1

                console.log("Adding cells for row:", rowNode.value, "expense:", expenseValue, "revenue:", revenueValue);

                // Expense cell
                row.append("td")
                    .style("padding", "8px")
                    .style("border", "1px solid #ddd")
                    .style("text-align", "right")
                    .text(expenseValue || "");

                // Revenue cell
                row.append("td")
                    .style("padding", "8px")
                    .style("border", "1px solid #ddd")
                    .style("text-align", "right")
                    .text(revenueValue || "");
            }
        });
    }

    private getMatrixCellValue(rowNode: powerbi.DataViewMatrixNode, valueIndex: number): string | null {
        try {
            if (rowNode.values && rowNode.values[valueIndex]) {
                const value = rowNode.values[valueIndex];
                if (value && typeof value === 'object' && 'value' in value) {
                    const cellValue = (value as any).value;
                    return cellValue != null ? cellValue.toString() : null;
                }
            }
            return null;
        } catch (error) {
            console.error("Error getting matrix cell value:", error);
            return null;
        }
    }

    private clearVisual(): void {
        this.container.innerHTML = "";
    }

    private showError(message: string): void {
        this.container.innerHTML = `<div style="padding: 20px; color: #d13438;">${message}</div>`;
    }
}
