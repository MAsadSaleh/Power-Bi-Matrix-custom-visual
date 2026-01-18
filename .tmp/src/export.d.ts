import { MatrixDataModel } from "./dataModel";
import { HierarchyManager } from "./hierarchy";
import { TotalsCalculator } from "./totals";
import { FormattingSettingsService } from "./formattingSettings";
export declare class ExportManager {
    exportToPDF(dataModel: MatrixDataModel, hierarchyManager: HierarchyManager, totalsCalculator: TotalsCalculator, formattingSettings: FormattingSettingsService): Promise<Blob>;
    exportToPowerPoint(dataModel: MatrixDataModel, hierarchyManager: HierarchyManager, totalsCalculator: TotalsCalculator, formattingSettings: FormattingSettingsService): Promise<Blob>;
    exportToExcel(dataModel: MatrixDataModel, hierarchyManager: HierarchyManager, totalsCalculator: TotalsCalculator, formattingSettings: FormattingSettingsService): Promise<Blob>;
    exportToCSV(dataModel: MatrixDataModel, hierarchyManager: HierarchyManager): string;
    getExportData(dataModel: MatrixDataModel, hierarchyManager: HierarchyManager, totalsCalculator: TotalsCalculator): any;
    private getNodePath;
}
//# sourceMappingURL=export.d.ts.map