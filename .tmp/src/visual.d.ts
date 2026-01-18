export declare class MatrixVisualReplica implements powerbi.extensibility.visual.IVisual {
    private host;
    private element;
    private formattingSettings;
    private dataModel;
    private renderingEngine;
    private container;
    private viewport;
    private expandCollapseState;
    constructor(options?: powerbi.extensibility.visual.VisualConstructorOptions);
    update(options: powerbi.extensibility.visual.VisualUpdateOptions): void;
    enumerateObjectInstances(options: powerbi.EnumerateVisualObjectInstancesOptions): powerbi.VisualObjectInstanceEnumeration;
    private setupEventHandlers;
    private clearVisual;
    private showError;
}
//# sourceMappingURL=visual.d.ts.map