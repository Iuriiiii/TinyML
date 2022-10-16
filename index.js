"use strict";
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
    function translateBinaryArray(elements) {
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
                        html += "<".concat(e.tag.text).concat(params, ">") + translateBinaryArray(e.children) + "</".concat(e.tag.text, ">");
                    // console.log(e);
                    break;
                case element.isRaw():
                    html += element.toString();
            }
        }
        return html;
    }
    function translate(source) {
        var elements = common_1.Core.parse(source);
        return translateBinaryArray(elements);
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
