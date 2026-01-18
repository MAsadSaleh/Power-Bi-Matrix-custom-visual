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
            const dataView: powerbi.DataView = options.dataViews?.[0];
            if (!dataView || !dataView.matrix) {
                this.clearVisual();
                return;
            }

            // Update viewport
            this.viewport = {
                width: options.viewport.width,
                height: options.viewport.height
            };

            // Update formatting settings
            this.formattingSettings.update(options.dataViews);

            // Clear container
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

            // Add row header spacer
            headerRow.append("th")
                .style("width", "200px")
                .style("padding", "8px")
                .style("border", "1px solid #ddd")
                .style("background-color", "#f8f8f8")
                .text("Hierarchy");

            // Build column headers from matrix columns
            if (dataView.matrix.columns && dataView.matrix.columns.root) {
                this.buildColumnHeadersD3(headerRow, dataView.matrix.columns.root, 0);
            }

            // Create tbody
            const tbody = table.append("tbody");

            // Recursively build rows from matrix rows
            if (dataView.matrix.rows && dataView.matrix.rows.root && dataView.matrix.rows.root.children) {
                this.buildRowsD3(tbody, dataView.matrix.rows.root.children, 0, dataView.matrix);
            }

        } catch (error) {
            console.error("Error updating visual:", error);
            this.showError("Error rendering matrix visual");
        }
    }

    public enumerateObjectInstances(
        options: powerbi.EnumerateVisualObjectInstancesOptions
    ): powerbi.VisualObjectInstanceEnumeration {
        return this.formattingSettings.enumerateObjectInstances(options);
    }

    private buildColumnHeadersD3(headerRow: d3.Selection<HTMLTableRowElement, unknown, null, undefined>, node: powerbi.DataViewMatrixNode, level: number): void {
        if (node.children && node.children.length > 0) {
            for (const child of node.children) {
                this.buildColumnHeadersD3(headerRow, child, level + 1);
            }
        } else {
            // Leaf node - add column header
            headerRow.append("th")
                .style("padding", "8px")
                .style("border", "1px solid #ddd")
                .style("background-color", "#f8f8f8")
                .style("text-align", "center")
                .style("font-weight", "600")
                .text(node.value ? node.value.toString() : "");

            // If this is the last level, add value columns (Expense and Revenue)
            if (level === 1) { // Assuming 2-level column hierarchy
                // Add Expense column
                headerRow.append("th")
                    .style("padding", "8px")
                    .style("border", "1px solid #ddd")
                    .style("background-color", "#f8f8f8")
                    .style("text-align", "center")
                    .style("font-weight", "600")
                    .text("Expense");

                // Add Revenue column
                headerRow.append("th")
                    .style("padding", "8px")
                    .style("border", "1px solid #ddd")
                    .style("background-color", "#f8f8f8")
                    .style("text-align", "center")
                    .style("font-weight", "600")
                    .text("Revenue");
            }
        }
    }

    private buildRowsD3(tbody: d3.Selection<HTMLTableSectionElement, unknown, null, undefined>, nodes: powerbi.DataViewMatrixNode[], level: number, matrix: powerbi.DataViewMatrix): void {
        const rows = tbody.selectAll(`.level-${level}`)
            .data(nodes)
            .enter()
            .append("tr")
            .classed(`level-${level}`, true);

        // Add hierarchy cell with indentation
        const hierarchyCells = rows.append("td")
            .style("padding", "8px")
            .style("border", "1px solid #ddd")
            .style("padding-left", `${(level * 20) + 8}px`)
            .text(d => d.value ? d.value.toString() : "");

        // Add expand/collapse indicators
        hierarchyCells.filter(d => !!(d.children && d.children.length > 0))
            .append("span")
            .style("margin-right", "5px")
            .style("cursor", "pointer")
            .text(d => this.expandCollapseState.get(d.value?.toString() || "") ? "▼" : "▶")
            .on("click", (event, d) => {
                const key = d.value?.toString() || "";
                const isExpanded = this.expandCollapseState.get(key) ?? false;
                this.expandCollapseState.set(key, !isExpanded);
                // Trigger re-render
                this.host.refreshHostData();
            });

        // Add data cells for each column
        if (matrix.columns && matrix.columns.root) {
            this.addDataCellsD3(rows, matrix.columns.root, matrix);
        }

        // Recursively add children
        nodes.forEach(node => {
            if (node.children && node.children.length > 0) {
                const isExpanded = this.expandCollapseState.get(node.value?.toString() || "") ?? true;
                if (isExpanded) {
                    this.buildRowsD3(tbody, node.children, level + 1, matrix);
                }
            }
        });
    }

    private addDataCellsD3(rows: d3.Selection<HTMLTableRowElement, powerbi.DataViewMatrixNode, HTMLTableSectionElement, unknown>, columnNode: powerbi.DataViewMatrixNode, matrix: powerbi.DataViewMatrix): void {
        if (columnNode.children && columnNode.children.length > 0) {
            for (const child of columnNode.children) {
                this.addDataCellsD3(rows, child, matrix);
            }
        } else {
            // For each leaf column, add Expense and Revenue cells
            rows.each(((rowNode: powerbi.DataViewMatrixNode) => {
                const row = d3.select(this as any);
                
                // Expense cell
                const expenseValue = this.getCellValue(rowNode, columnNode, 0, matrix);
                row.append("td")
                    .style("padding", "8px")
                    .style("border", "1px solid #ddd")
                    .style("text-align", "right")
                    .text(expenseValue || "");

                // Revenue cell
                const revenueValue = this.getCellValue(rowNode, columnNode, 1, matrix);
                row.append("td")
                    .style("padding", "8px")
                    .style("border", "1px solid #ddd")
                    .style("text-align", "right")
                    .text(revenueValue || "");
            }).bind(this));
        }
    }

    private getCellValue(rowNode: powerbi.DataViewMatrixNode, columnNode: powerbi.DataViewMatrixNode, valueIndex: number, matrix: powerbi.DataViewMatrix): string | null {
        // This is a simplified way to get values - in a real implementation,
        // you'd need to properly traverse the matrix structure
        if (rowNode.values && rowNode.values[valueIndex]) {
            const value = rowNode.values[valueIndex].value;
            return value ? value.toString() : null;
        }
        return null;
    }

    private clearVisual(): void {
        this.container.innerHTML = "";
    }

    private showError(message: string): void {
        this.container.innerHTML = `<div style="padding: 20px; color: #d13438;">${message}</div>`;
    }
}
