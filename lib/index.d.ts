import { Style } from './utils';
export interface Options {
    beforePrint?: (window: Window) => void;
    direction?: 'vertical' | 'horizontal';
    scanStyles?: boolean | string[] | 'common';
    css?: string;
    injectGlobalCss?: boolean;
    log?: boolean;
}
export interface PrintFn {
    (source: HTMLElement | HTMLElement[], options?: Options): Promise<void>;
    preview: (source: HTMLElement | HTMLElement[], options: Options) => Promise<void>;
}
export declare function generate(source: HTMLElement | HTMLElement[], options?: Options): {
    styles: Style[];
    body: string;
};
export declare function preview(source: HTMLElement | HTMLElement[], options?: Options): Promise<void>;
export declare function print(source: HTMLElement | HTMLElement[], options?: Options): Promise<void>;
declare const printFn: PrintFn;
export default printFn;
//# sourceMappingURL=index.d.ts.map