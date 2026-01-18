import { MatrixDataModel } from "./dataModel";
import { FormattingSettingsService } from "./formattingSettings";
export declare class RenderingEngine {
    private container;
    private host;
    private tableWrapper;
    private headerWrapper;
    private bodyWrapper;
    private rowHeaderWrapper;
    private table;
    private rowHeaderTable;
    private expandCollapseState;
    constructor(container: HTMLElement, host: powerbi.extensibility.visual.IVisualHost, expandCollapseState: Map<string, boolean>);
    private initializeDOM;
    render(dataModel: MatrixDataModel, formattingSettings: FormattingSettingsService, viewport: {
        width: number;
        height: number;
    }): void;
    private renderColumnHeaders;
    private renderRows;
    private renderRowHeaders;
    private syncScroll;
    getExpandCollapseElements(): NodeListOf<Element>;
}
//# sourceMappingURL=rendering.d.ts.map