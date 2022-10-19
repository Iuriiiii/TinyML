export declare namespace TinyML {
    interface TranslateOptions {
        preserveComments: boolean;
    }
    export function translate(source: string, options?: TranslateOptions): string;
    export function t(textParts: any, ...expressions: any): string;
    export {};
}
