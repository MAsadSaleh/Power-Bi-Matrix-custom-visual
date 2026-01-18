/*
 * Formatting Settings Service - Manages all formatting pane options
 * Maps Power BI format model to visual formatting
 */

/// <reference path="../node_modules/powerbi-visuals-api/index.d.ts"/>

export interface RowHeaderSettings {
    fontFamily?: string;
    fontSize?: number;
    fontColor?: string;
    backgroundColor?: string;
    wordWrap?: boolean;
    alignment?: "left" | "center" | "right";
    border?: boolean;
}

export interface ColumnHeaderSettings {
    fontFamily?: string;
    fontSize?: number;
    fontColor?: string;
    backgroundColor?: string;
    wordWrap?: boolean;
    alignment?: "left" | "center" | "right";
    border?: boolean;
}

export interface ValueSettings {
    fontFamily?: string;
    fontSize?: number;
    fontColor?: string;
    backgroundColor?: string;
    alignment?: "left" | "center" | "right";
    numberFormat?: string;
    decimalPlaces?: number;
    conditionalFormatting?: "none" | "background" | "font" | "dataBars" | "icons";
}

export interface GridSettings {
    gridlines?: boolean;
    horizontalGridlines?: boolean;
    verticalGridlines?: boolean;
    rowBanding?: boolean;
    columnBanding?: boolean;
    bandingColor?: string;
    padding?: number;
    outlineStyle?: "stepped" | "none";
}

export interface TotalsSettings {
    showRowSubtotals?: boolean;
    showColumnSubtotals?: boolean;
    showRowGrandTotals?: boolean;
    showColumnGrandTotals?: boolean;
    subtotalFontFamily?: string;
    subtotalFontSize?: number;
    subtotalFontColor?: string;
    subtotalBackgroundColor?: string;
    grandTotalFontFamily?: string;
    grandTotalFontSize?: number;
    grandTotalFontColor?: string;
    grandTotalBackgroundColor?: string;
    subtotalSettings?: RowHeaderSettings;
    grandTotalSettings?: RowHeaderSettings;
}

export interface SortingSettings {
    sortBy?: "hierarchy" | "value";
    sortDirection?: "asc" | "desc";
}

export class FormattingSettingsService {
    private rowHeaderSettings: RowHeaderSettings = {
        fontFamily: "Segoe UI",
        fontSize: 11,
        fontColor: "#212121",
        backgroundColor: "#ffffff",
        wordWrap: false,
        alignment: "left",
        border: true
    };

    private columnHeaderSettings: ColumnHeaderSettings = {
        fontFamily: "Segoe UI",
        fontSize: 11,
        fontColor: "#212121",
        backgroundColor: "#f8f8f8",
        wordWrap: false,
        alignment: "center",
        border: true
    };

    private valueSettings: ValueSettings = {
        fontFamily: "Segoe UI",
        fontSize: 11,
        fontColor: "#212121",
        backgroundColor: "#ffffff",
        alignment: "right",
        numberFormat: "#,##0.00",
        decimalPlaces: 2,
        conditionalFormatting: "none"
    };

    private gridSettings: GridSettings = {
        gridlines: true,
        horizontalGridlines: true,
        verticalGridlines: true,
        rowBanding: false,
        columnBanding: false,
        bandingColor: "#f5f5f5",
        padding: 8,
        outlineStyle: "stepped"
    };

    private totalsSettings: TotalsSettings = {
        showRowSubtotals: true,
        showColumnSubtotals: true,
        showRowGrandTotals: true,
        showColumnGrandTotals: true,
        subtotalFontFamily: "Segoe UI",
        subtotalFontSize: 11,
        subtotalFontColor: "#212121",
        subtotalBackgroundColor: "#f0f0f0",
        grandTotalFontFamily: "Segoe UI",
        grandTotalFontSize: 11,
        grandTotalFontColor: "#212121",
        grandTotalBackgroundColor: "#e0e0e0",
        subtotalSettings: {
            fontFamily: "Segoe UI",
            fontSize: 11,
            fontColor: "#212121",
            backgroundColor: "#f0f0f0",
            alignment: "left"
        },
        grandTotalSettings: {
            fontFamily: "Segoe UI",
            fontSize: 11,
            fontColor: "#212121",
            backgroundColor: "#e0e0e0",
            alignment: "left"
        }
    };

    private sortingSettings: SortingSettings = {
        sortBy: "hierarchy",
        sortDirection: "asc"
    };

    public update(dataViews: powerbi.DataView[]): void {
        if (!dataViews || dataViews.length === 0) {
            return;
        }

        const dataView = dataViews[0];
        if (!dataView.metadata || !dataView.metadata.objects) {
            return;
        }

        const objects = dataView.metadata.objects;

        // Update row headers
        if (objects["rowHeaders"]) {
            this.updateRowHeaderSettings(objects["rowHeaders"]);
        }

        // Update column headers
        if (objects["columnHeaders"]) {
            this.updateColumnHeaderSettings(objects["columnHeaders"]);
        }

        // Update values
        if (objects["values"]) {
            this.updateValueSettings(objects["values"]);
        }

        // Update grid
        if (objects["grid"]) {
            this.updateGridSettings(objects["grid"]);
        }

        // Update totals
        if (objects["totals"]) {
            this.updateTotalsSettings(objects["totals"]);
        }

        // Update sorting
        if (objects["sorting"]) {
            this.updateSortingSettings(objects["sorting"]);
        }
    }

    private updateRowHeaderSettings(obj: any): void {
        if (obj["fontFamily"]) this.rowHeaderSettings.fontFamily = obj["fontFamily"];
        if (obj["fontSize"]) this.rowHeaderSettings.fontSize = obj["fontSize"];
        if (obj["fontColor"]) this.rowHeaderSettings.fontColor = obj["fontColor"].solid.color;
        if (obj["backgroundColor"]) this.rowHeaderSettings.backgroundColor = obj["backgroundColor"].solid.color;
        if (obj["wordWrap"] !== undefined) this.rowHeaderSettings.wordWrap = obj["wordWrap"];
        if (obj["alignment"]) this.rowHeaderSettings.alignment = obj["alignment"];
        if (obj["border"] !== undefined) this.rowHeaderSettings.border = obj["border"];
    }

    private updateColumnHeaderSettings(obj: any): void {
        if (obj["fontFamily"]) this.columnHeaderSettings.fontFamily = obj["fontFamily"];
        if (obj["fontSize"]) this.columnHeaderSettings.fontSize = obj["fontSize"];
        if (obj["fontColor"]) this.columnHeaderSettings.fontColor = obj["fontColor"].solid.color;
        if (obj["backgroundColor"]) this.columnHeaderSettings.backgroundColor = obj["backgroundColor"].solid.color;
        if (obj["wordWrap"] !== undefined) this.columnHeaderSettings.wordWrap = obj["wordWrap"];
        if (obj["alignment"]) this.columnHeaderSettings.alignment = obj["alignment"];
        if (obj["border"] !== undefined) this.columnHeaderSettings.border = obj["border"];
    }

    private updateValueSettings(obj: any): void {
        if (obj["fontFamily"]) this.valueSettings.fontFamily = obj["fontFamily"];
        if (obj["fontSize"]) this.valueSettings.fontSize = obj["fontSize"];
        if (obj["fontColor"]) this.valueSettings.fontColor = obj["fontColor"].solid.color;
        if (obj["backgroundColor"]) this.valueSettings.backgroundColor = obj["backgroundColor"].solid.color;
        if (obj["alignment"]) this.valueSettings.alignment = obj["alignment"];
        if (obj["numberFormat"]) this.valueSettings.numberFormat = obj["numberFormat"];
        if (obj["decimalPlaces"] !== undefined) this.valueSettings.decimalPlaces = obj["decimalPlaces"];
        if (obj["conditionalFormatting"]) this.valueSettings.conditionalFormatting = obj["conditionalFormatting"];
    }

    private updateGridSettings(obj: any): void {
        if (obj["gridlines"] !== undefined) this.gridSettings.gridlines = obj["gridlines"];
        if (obj["horizontalGridlines"] !== undefined) this.gridSettings.horizontalGridlines = obj["horizontalGridlines"];
        if (obj["verticalGridlines"] !== undefined) this.gridSettings.verticalGridlines = obj["verticalGridlines"];
        if (obj["rowBanding"] !== undefined) this.gridSettings.rowBanding = obj["rowBanding"];
        if (obj["columnBanding"] !== undefined) this.gridSettings.columnBanding = obj["columnBanding"];
        if (obj["bandingColor"]) this.gridSettings.bandingColor = obj["bandingColor"].solid.color;
        if (obj["padding"] !== undefined) this.gridSettings.padding = obj["padding"];
        if (obj["outlineStyle"]) this.gridSettings.outlineStyle = obj["outlineStyle"];
    }

    private updateTotalsSettings(obj: any): void {
        if (obj["showRowSubtotals"] !== undefined) this.totalsSettings.showRowSubtotals = obj["showRowSubtotals"];
        if (obj["showColumnSubtotals"] !== undefined) this.totalsSettings.showColumnSubtotals = obj["showColumnSubtotals"];
        if (obj["showRowGrandTotals"] !== undefined) this.totalsSettings.showRowGrandTotals = obj["showRowGrandTotals"];
        if (obj["showColumnGrandTotals"] !== undefined) this.totalsSettings.showColumnGrandTotals = obj["showColumnGrandTotals"];
        if (obj["subtotalFontFamily"]) this.totalsSettings.subtotalFontFamily = obj["subtotalFontFamily"];
        if (obj["subtotalFontSize"]) this.totalsSettings.subtotalFontSize = obj["subtotalFontSize"];
        if (obj["subtotalFontColor"]) this.totalsSettings.subtotalFontColor = obj["subtotalFontColor"].solid.color;
        if (obj["subtotalBackgroundColor"]) this.totalsSettings.subtotalBackgroundColor = obj["subtotalBackgroundColor"].solid.color;
        if (obj["grandTotalFontFamily"]) this.totalsSettings.grandTotalFontFamily = obj["grandTotalFontFamily"];
        if (obj["grandTotalFontSize"]) this.totalsSettings.grandTotalFontSize = obj["grandTotalFontSize"];
        if (obj["grandTotalFontColor"]) this.totalsSettings.grandTotalFontColor = obj["grandTotalFontColor"].solid.color;
        if (obj["grandTotalBackgroundColor"]) this.totalsSettings.grandTotalBackgroundColor = obj["grandTotalBackgroundColor"].solid.color;
    }

    private updateSortingSettings(obj: any): void {
        if (obj["sortBy"]) this.sortingSettings.sortBy = obj["sortBy"];
        if (obj["sortDirection"]) this.sortingSettings.sortDirection = obj["sortDirection"];
    }

    public enumerateObjectInstances(
        options: powerbi.EnumerateVisualObjectInstancesOptions
    ): powerbi.VisualObjectInstanceEnumeration {
        const objectName = options.objectName;
        const objectEnumeration: powerbi.VisualObjectInstance[] = [];

        switch (objectName) {
            case "rowHeaders":
                objectEnumeration.push({
                    objectName: "rowHeaders",
                    properties: {
                        fontFamily: this.rowHeaderSettings.fontFamily as any,
                        fontSize: this.rowHeaderSettings.fontSize as any,
                        fontColor: { solid: { color: this.rowHeaderSettings.fontColor } },
                        backgroundColor: { solid: { color: this.rowHeaderSettings.backgroundColor } },
                        wordWrap: this.rowHeaderSettings.wordWrap as any,
                        alignment: this.rowHeaderSettings.alignment as any,
                        border: this.rowHeaderSettings.border as any
                    },
                    selector: null as any
                });
                break;

            case "columnHeaders":
                objectEnumeration.push({
                    objectName: "columnHeaders",
                    properties: {
                        fontFamily: this.columnHeaderSettings.fontFamily as any,
                        fontSize: this.columnHeaderSettings.fontSize as any,
                        fontColor: { solid: { color: this.columnHeaderSettings.fontColor } },
                        backgroundColor: { solid: { color: this.columnHeaderSettings.backgroundColor } },
                        wordWrap: this.columnHeaderSettings.wordWrap as any,
                        alignment: this.columnHeaderSettings.alignment as any,
                        border: this.columnHeaderSettings.border as any
                    },
                    selector: null as any
                });
                break;

            case "values":
                objectEnumeration.push({
                    objectName: "values",
                    properties: {
                        fontFamily: this.valueSettings.fontFamily as any,
                        fontSize: this.valueSettings.fontSize as any,
                        fontColor: { solid: { color: this.valueSettings.fontColor } },
                        backgroundColor: { solid: { color: this.valueSettings.backgroundColor } },
                        alignment: this.valueSettings.alignment as any,
                        numberFormat: this.valueSettings.numberFormat as any,
                        decimalPlaces: this.valueSettings.decimalPlaces as any,
                        conditionalFormatting: this.valueSettings.conditionalFormatting as any
                    },
                    selector: null as any
                });
                break;

            case "grid":
                objectEnumeration.push({
                    objectName: "grid",
                    properties: {
                        gridlines: this.gridSettings.gridlines as any,
                        horizontalGridlines: this.gridSettings.horizontalGridlines as any,
                        verticalGridlines: this.gridSettings.verticalGridlines as any,
                        rowBanding: this.gridSettings.rowBanding as any,
                        columnBanding: this.gridSettings.columnBanding as any,
                        bandingColor: { solid: { color: this.gridSettings.bandingColor } },
                        padding: this.gridSettings.padding as any,
                        outlineStyle: this.gridSettings.outlineStyle as any
                    },
                    selector: null as any
                });
                break;

            case "totals":
                objectEnumeration.push({
                    objectName: "totals",
                    properties: {
                        showRowSubtotals: this.totalsSettings.showRowSubtotals as any,
                        showColumnSubtotals: this.totalsSettings.showColumnSubtotals as any,
                        showRowGrandTotals: this.totalsSettings.showRowGrandTotals as any,
                        showColumnGrandTotals: this.totalsSettings.showColumnGrandTotals as any,
                        subtotalFontFamily: this.totalsSettings.subtotalFontFamily as any,
                        subtotalFontSize: this.totalsSettings.subtotalFontSize as any,
                        subtotalFontColor: { solid: { color: this.totalsSettings.subtotalFontColor } },
                        subtotalBackgroundColor: { solid: { color: this.totalsSettings.subtotalBackgroundColor } },
                        grandTotalFontFamily: this.totalsSettings.grandTotalFontFamily as any,
                        grandTotalFontSize: this.totalsSettings.grandTotalFontSize as any,
                        grandTotalFontColor: { solid: { color: this.totalsSettings.grandTotalFontColor } },
                        grandTotalBackgroundColor: { solid: { color: this.totalsSettings.grandTotalBackgroundColor } }
                    },
                    selector: null as any
                });
                break;

            case "sorting":
                objectEnumeration.push({
                    objectName: "sorting",
                    properties: {
                        sortBy: this.sortingSettings.sortBy as any,
                        sortDirection: this.sortingSettings.sortDirection as any
                    },
                    selector: null as any
                });
                break;
        }

        return objectEnumeration;
    }

    public getRowHeaderSettings(): RowHeaderSettings {
        return { ...this.rowHeaderSettings };
    }

    public getColumnHeaderSettings(): ColumnHeaderSettings {
        return { ...this.columnHeaderSettings };
    }

    public getValueSettings(): ValueSettings {
        return { ...this.valueSettings };
    }

    public getGridSettings(): GridSettings {
        return { ...this.gridSettings };
    }

    public getTotalsSettings(): TotalsSettings {
        return { ...this.totalsSettings };
    }

    public getSortingSettings(): SortingSettings {
        return { ...this.sortingSettings };
    }
}
