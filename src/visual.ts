/*
 * Power BI Custom Visual - Matrix Visual Replica
 * Exact match to native Power BI Matrix visual
 */

/// <reference path="../node_modules/powerbi-visuals-api/index.d.ts"/>
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
        this.setupEventHandlers();
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

            // Process data
            const matrixDataView: powerbi.DataViewMatrix = dataView.matrix;
            this.dataModel.processDataView(matrixDataView, this.expandCollapseState);

            // Render
            this.renderingEngine.render(
                this.dataModel,
                this.formattingSettings,
                this.viewport
            );

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

    private setupEventHandlers(): void {
        // Expand/collapse handlers
        this.container.addEventListener("click", (e) => {
            const target = e.target as HTMLElement;
            if (target.classList.contains("expand-indicator")) {
                const path = target.getAttribute("data-path");
                if (path) {
                    const isExpanded = this.expandCollapseState.get(path) ?? false;
                    this.expandCollapseState.set(path, !isExpanded);
                    // Trigger re-render by calling update again
                    // The expandCollapseState is already updated
                }
            }
        });
    }

    private clearVisual(): void {
        this.container.innerHTML = "";
    }

    private showError(message: string): void {
        this.container.innerHTML = `<div style="padding: 20px; color: #d13438;">${message}</div>`;
    }
}
