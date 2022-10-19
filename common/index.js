"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TinyML = void 0;
const common_1 = require("tinyml-core/common");
var TinyML;
(function (TinyML) {
    const escapeHtml = (unsafe) => {
        /* @ts-ignore */
        return unsafe.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;');
    };
    function translateBinaryArray(elements, options) {
        let html = '';
        for (let i = 0; i < elements.length; i++) {
            const element = elements[i];
            switch (true) {
                case element.isElement():
                    const e = element.get();
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
                    html += element.isRaw() ? escapeHtml(element.toString()) : element.toString();
            }
        }
        return html;
    }
    function translate(source, options = { preserveComments: true }) {
        let elements = common_1.Core.parse(source);
        return translateBinaryArray(elements, options);
    }
    TinyML.translate = translate;
    function t(textParts, ...expressions) {
        const raw = [String.raw(textParts, ...expressions)];
        return TinyML.translate(raw.join(''));
    }
    TinyML.t = t;
})(TinyML = exports.TinyML || (exports.TinyML = {}));
//# sourceMappingURL=index.js.map