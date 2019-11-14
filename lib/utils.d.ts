export declare function timeStart(): void;
export declare function timeEnd(): void;
export declare function noop(...args: any[]): void;
export declare function ensureArray<T>(arr: T | T[]): T[];
export declare function getStyles(element: HTMLElement, scanStyles: boolean | string[]): string;
export declare function loopStyles(el: HTMLElement, scanStyles: boolean | string[], ignoreTags?: string[]): void;
export interface Style {
    content: string;
    media?: string;
}
export declare function injectStyles(win: Window, styles: Style[]): void;
export declare function resolveImage(img: HTMLImageElement): Promise<unknown>;
//# sourceMappingURL=utils.d.ts.map