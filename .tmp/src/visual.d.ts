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
    private buildColumnHeadersD3;
    private buildMatrixRowsD3;
    private addMatrixDataCellsD3;
    private getMatrixCellValue;
    private clearVisual;
    private showError;
}
//# sourceMappingURL=visual.d.ts.map