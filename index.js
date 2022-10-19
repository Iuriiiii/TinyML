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
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
exports.TinyML = void 0;
var common_1 = require("tinyml-core/common");
var TinyML;
(function (TinyML) {
    var escapeHtml = function (unsafe) {
        /* @ts-ignore */
        return unsafe.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;');
    };
    function translateBinaryArray(elements, options) {
        var html = '';
        for (var i = 0; i < elements.length; i++) {
            var element = elements[i];
            switch (true) {
                case element.isElement():
                    var e = element.get();
                    var params = e.params !== undefined ? ' ' + e.paramsToString() : '';
                    if (e.children === undefined)
                        html += "<".concat(e.tag.text).concat(params, "/>");
                    else
                        html += "<".concat(e.tag.text).concat(params, ">") + translateBinaryArray(e.children, options) + "</".concat(e.tag.text, ">");
                    break;
                case element.isComment() && options.preserveComments:
                    html += "<!--".concat(element.toString(), "-->");
                    break;
                default:
                    html += element.isRaw() ? escapeHtml(element.toString()) : element.toString();
            }
        }
        return html;
    }
    function translate(source, options) {
        if (options === void 0) { options = { preserveComments: true }; }
        var elements = common_1.Core.parse(source);
        return translateBinaryArray(elements, options);
    }
    TinyML.translate = translate;
    function t(textParts) {
        var expressions = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            expressions[_i - 1] = arguments[_i];
        }
        var raw = [String.raw.apply(String, __spreadArray([textParts], expressions, false))];
        return TinyML.translate(raw.join(''));
    }
    TinyML.t = t;
})(TinyML = exports.TinyML || (exports.TinyML = {}));
console.log(TinyML.t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\nbody {\n    {<h1>This is a title</h1>}\n}\n"], ["\nbody {\n    {<h1>This is a title</h1>}\n}\n"]))));
var templateObject_1;
