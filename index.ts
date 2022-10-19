/*
MIT License

Copyright (c) 2022 Iuriiiii

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

import { Core } from 'tinyml-core/common';

export namespace TinyML {
    interface TranslateOptions {
        preserveComments: boolean
    }

    const escapeHtml = (unsafe: string): string => {
        /* @ts-ignore */
        return unsafe.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;');
    }

    function translateBinaryArray(elements: Core.Item[], options: TranslateOptions): string {
        let html = '';

        for (let i = 0; i < elements.length; i++) {
            const element = elements[i];

            switch (true) {
                case element.isElement():
                    const e = element.get<Core.Element>();
                    const params = e.params !== undefined ? ' ' + e.paramsToString() : '';
                    if (e.children === undefined)
                        html += `<${e.tag.text}${params}/>`;
                    else
                        html += `<${e.tag.text}${params}>` + translateBinaryArray(e.children, options) + `</${e.tag.text}>`;
                    break;
                case element.isComment() && options.preserveComments:
                    html += `<!--${element.toString()}-->`;
                    break;
                default:
                    html += element.isRaw() ? escapeHtml(element.toString()) : element.toString()
            }
        }

        return html;
    }

    export function translate(source: string, options: TranslateOptions = { preserveComments: true }): string {
        let elements = Core.parse(source);

        return translateBinaryArray(elements, options);
    }

    export function t(textParts: any, ...expressions: any) {
        const raw = [String.raw(textParts, ...expressions)];

        return TinyML.translate(raw.join(''));
    }
}