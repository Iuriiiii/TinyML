import { Core } from 'tinyml-core/common';
export var TinyML;
(function (TinyML) {
    function translateBinaryArray(elements) {
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
                        html += `<${e.tag.text}${params}>` + translateBinaryArray(e.children) + `</${e.tag.text}>`;
                    // console.log(e);
                    break;
                case element.isRaw():
                    html += element.toString();
            }
        }
        return html;
    }
    function translate(source) {
        let elements = Core.parse(source);
        return translateBinaryArray(elements);
    }
    TinyML.translate = translate;
    function t(textParts, ...expressions) {
        const raw = [String.raw(textParts, ...expressions)];
        return TinyML.translate(raw.join(''));
    }
    TinyML.t = t;
})(TinyML || (TinyML = {}));
//# sourceMappingURL=index.js.map