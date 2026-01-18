export interface PowerBITheme {
    name?: string;
    dataColors?: string[];
    background?: string;
    foreground?: string;
    tableAccent?: string;
    visualStyles?: {
        "*"?: {
            "*"?: {
                "*"?: any;
            };
        };
    };
}
export declare class ThemeManager {
    private currentTheme;
    private defaultTheme;
    applyTheme(theme: PowerBITheme | null): void;
    getTheme(): PowerBITheme;
    getDataColor(index: number): string;
    getBackgroundColor(): string;
    getForegroundColor(): string;
    getTableAccentColor(): string;
    parseThemeJSON(themeJSON: string): PowerBITheme | null;
    private validateTheme;
    private updateStyles;
    resetToDefault(): void;
}
//# sourceMappingURL=theme.d.ts.map