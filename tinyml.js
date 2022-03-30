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

const SPECIAL_CHARS = ['á','é','í','ó','ú','Á','É','Í','Ó','Ú','ñ','Ñ'];

class Utils
{
    /*
    static isBetween(a,b,c)
    {
        return a >= b && a <= c;
    }
    */
    
    static escapeHtml(c)
    {
        switch(c)
        {
            case '<':
                return "&lt;";
            case '>':
                return "&gt;";
            case '&':
                return "&amp;";
        }
    }
    
    /* https://stackoverflow.com/questions/2592092/executing-script-elements-inserted-with-innerhtml */
    static setInnerHtml(elm, html)
    {
        elm.innerHTML = html;
        
        Array.from(elm.querySelectorAll("script")).forEach(oldScript =>
        {
            const newScript = document.createElement("script");
            Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
            newScript.appendChild(document.createTextNode(oldScript.innerHTML));
            oldScript.parentNode.replaceChild(newScript, oldScript);
        });
    }
    
    /* https://stackoverflow.com/questions/384286/how-do-you-check-if-a-javascript-object-is-a-dom-object */
    static isElement(obj)
    {
        try
        {
            return obj instanceof HTMLElement;
        }
        catch(e)
        {
            return (typeof obj==="object") && (obj.nodeType===1) && (typeof obj.style === "object") && (typeof obj.ownerDocument ==="object");
        }
    }
}

class TinyML
{
    /* SHOULD BE UNMODIFICABLE */
    static STATUS_SUCCESS = 0;
    static ERROR_INVALID_SOURCE = 1;
    static STATUS_TAG_EXCPECTED = 2;
    static STATUS_SEPARATOR_EXCPECTED = 3;
    static STATUS_VALUE_EXPECTED = 4;
    static STATUS_EXPECTED_KEY_CLOSURE = 5;
    static STATUS_EXPECTED_BRACKET_CLOSURE = 6;
    static STATUS_BRACKET_OPEN_EXPECTED = 7;
    static STATUS_INVALID_STRING_LOCATION = 8;
    static STATUS_INVALID_CHARACTER_AT_LOCATION = 9;
    static STATUS_INVALID_ESCAPE_CHARACTER = 10;
    static STATUS_INFINITE_COMMENT_DETECTED = 11;
    static STATUS_INVALID_KEY_CLOSURE = 12;
    static STATUS_INVALID_CODE_KEY_CLOSURE = 13;
    static STATUS_EXPECTED_CODE_KEY_CLOSURE = 14;
    static TAG_PRE_PARSE = [];
    static TAG_POST_PARSE = [];
    
    #i = 0;
    
    constructor(source)
    {
        this.source = source;
        this.html = "";
        this.status = TinyML.STATUS_SUCCESS;
        this.actual_code = "";
    }
    
    code()
    {
        return this.actual_code;
    }
    
    description()
    {
        switch(this.status)
        {
            case TinyML.STATUS_SUCCESS: return "¡Success!";
            case TinyML.STATUS_TAG_EXCPECTED: return `Tag excepected at ${this.#i+1}`;
            case TinyML.STATUS_SEPARATOR_EXCPECTED: return `Separator ('[', '{') expected at ${this.#i+1}`;
            case TinyML.STATUS_VALUE_EXPECTED: return `Value of tag expected at ${this.#i+1}`;
            case TinyML.STATUS_EXPECTED_KEY_CLOSURE: return `Expected '}' at ${this.#i+1}`;
            case TinyML.STATUS_INVALID_KEY_CLOSURE: return `Invalid key closure '}' at ${this.#i+1}`;
            case TinyML.STATUS_INVALID_CODE_KEY_CLOSURE: return `Invalid code key closure '!}' at ${this.#i+1}`;
            case TinyML.STATUS_EXPECTED_PARENTHESIS_CLOSURE: return `Expected ')' at ${this.#i+1}`;
            case TinyML.STATUS_BRACKET_OPEN_EXPECTED: return `Expected '['`;
            case TinyML.STATUS_INVALID_STRING_LOCATION: return `Invalid string at ${this.#i+1}`;
            case TinyML.STATUS_INVALID_CHARACTER_AT_LOCATION: return `Invalid character at ${this.#i+1}`;
            case TinyML.STATUS_INVALID_ESCAPE_CHARACTER: return `Invalid escaped character at ${this.#i+1}`;
            case TinyML.STATUS_INFINITE_COMMENT_DETECTED: return "Endless comment";
            case TinyML.STATUS_EXPECTED_CODE_KEY_CLOSURE: return `Expected '!}' at ${this.#i+1}`;
            default: return "Unknown reason O.o";
        }
    }
    
    #escapeTml(c)
    {
        switch(c)
        {
            case '{':
            case '}':
            case '[':
            case ']':
                return c;
            case 'n':
                return "<br>";
            default:
                return null;
        }
    }
    
    #error(status)
    {
        return (this.status = status) === TinyML.STATUS_SUCCESS;
    }

    process(source)
    {
        if(!source)
            return "";
        
        let flag =  0, par = 0, lla = 0, cor = 0, isCode = 0,
        isString = !1, isOutside = !0, val = "", argument = "",
        tag = "", content = "", i, residue = "",
        source_length = source.length, ignore = !1,
        code = "", isEscaped = !1, escapedChar, skipChar, parsedResidue,tagContent;
        
        //console.info(source);
        //source = source.trim();
        this.actual_code = source;
        
loop:   for(i = 0; i < source_length; i++)
        {
            let c = source[i];
            this.#i = i;
    
            //if(c === undefined)
            //    break;
    
            switch(c)
            {
                case '\\':
                    if(lla > 0)
                        break;
                    
                    isEscaped = !isEscaped
                    
                    if(isEscaped)
                        continue loop;
                break;
                case '[':
                    if(isString || isEscaped || isCode > 0)
                        break;
                
                    if(par === 0 && lla === 0)
                        cor++;
                    
                break;
                case ']':
                    if(isString || isEscaped || isCode > 0)
                        break;
                    
                    if(par === 0 && lla === 0)
                    {
                        cor--;
                        c = '';
                    }
                    
                    if(cor < 0)
                        return this.#error(TinyML.STATUS_BRACKET_OPEN_EXPECTED);
                    
                break;
                case '!':
                    if(isString || cor > 0 || lla > 0)
                        break;
                    
                    if(par > 0)
                        return this.#error(TinyML.STATUS_INVALID_CHARACTER_AT_LOCATION);
                    
                    if(source[i+1] === '}' && (++i))
                        isCode--;
                    
                    if(isCode < 0)
                        return this.#error(TinyML.STATUS_INVALID_CHARACTER_AT_LOCATION);
                    else if(isCode === 0)
                        break loop;
                        
                    
                break;
                case '>':
                case '<':
                    if(isString || cor > 0)
                        break;
                
                    if(par > 0)
                        return this.#error(TinyML.STATUS_INVALID_CHARACTER_AT_LOCATION);
                    
                    if(lla === 1 && !ignore)
                        c = Utils.escapeHtml(c);
                
                break;
                case ':':
                    if(isString)
                        break;
                    
                    if(par > 0)
                        c = '=';
                    
                break;
                case ' ':
                case '\t':
                    if(isString || cor > 0 || !isOutside || isCode > 0 || lla > 0)
                        break;
                    
                    if(tag)
                        content += (tag + c);
                    
                    c = '';
                    tag = "";
                    
                break;
                case '"':
                    if(cor > 0)
                        break;
                    
                    if(isOutside)
                        return this.#error(TinyML.STATUS_INVALID_STRING_LOCATION);
                    
                    isString = !isString;
                    
                break;
                case '(':
                    if(isString || cor > 0 || lla > 0 || isCode > 0)
                        break;
                    
                    par++;
                    
                    if(par === 1)
                        c = '';
                    
                break;
                case ')':
                    if(isString || cor > 0 || lla > 0 || isCode > 0)
                        break;
                    
                    par--;
                    
                    if(par === 0)
                        c = '';
                    else if(par < 0)
                        return this.#error(TinyML.STATUS_BRACKET_OPEN_EXPECTED);
                    
                break;
                case '{':
                    if(isString || cor > 0 || par > 0 || isCode > 0 || isEscaped)
                        break;
                    
                    if(!tag)
                        return this.#error(TinyML.STATUS_TAG_EXCPECTED);
                    
                    lla++;
                    
                    if(lla === 1)
                        if(((c = '') === '') && source[i+1] === '!' && (++i) && lla--)
                            isCode++;
                break;
                case '}':
                    if(isString || cor > 0 || par > 0 || isEscaped || isCode)
                        break;
                    
                    lla--;
                    
                    if(lla === 0)
                        if(tag)
                            break loop;
                        else
                            c = '';
                    else if(lla < 0)
                        return this.#error(TinyML.STATUS_INVALID_KEY_CLOSURE);
                    
                break;
            }
            
            isOutside = (lla === 0) && (par === 0) && (cor === 0) && (isCode === 0) && (isString === false);
            
            if(cor > 0)
                continue;
            
            if(isEscaped)
            {
                escapedChar = this.#escapeTml(c);
                
                if(!escapedChar)
                    return this.#error(TinyML.STATUS_INVALID_ESCAPE_CHARACTER);
                
                tag += escapedChar;
                isEscaped = false;
            }
            else if(isOutside)
                tag += c;
            else if(tag)
            {
                if(par > 0)
                    argument += c;
                else if(isCode > 0)
                    code += c;
                else if (lla > 0)
                    val += c;
            }
            else
                content += c;
                
            
            //console.info("tag:", tag, "argument:", argument, "val:", val);
            //if(val)
            //    console.info("tag:", tag, "c", c, "i:", i, "isCode:", isCode, "lla:", lla, "par:", par, "argument:", argument, "val:", val);
            //else
            //    console.info("tag:", tag, "c", c, "i:", i, "isCode:", isCode, "lla:", lla, "par:", par, "argument:", argument, "code:", code);
        }
        
        //console.log("te tagÇ>>>>>>>>>>>>>>>>>>>>", tag);
        
        if(i < source_length)
            residue = source.substring(i+1);
        
        tag = tag.trim();
        
        if(i == source_length && tag)
        {
            content += tag;
            tag = "";
        }
        
        if(lla > 0)
            return this.#error(TinyML.STATUS_EXPECTED_KEY_CLOSURE);
        else if(par > 0)
            return this.#error(TinyML.STATUS_EXPECTED_PARENTHESIS_CLOSURE);
        else if(cor > 0)
            return this.#error(TinyML.STATUS_INFINITE_COMMENT_DETECTED);
        else if(isCode > 0)
            return this.#error(TinyML.STATUS_EXPECTED_CODE_KEY_CLOSURE);
            
        
        if(!tag)
            return content + residue;
        
        if((parsedResidue = this.process(residue)) === false)
            return false;
        
        if(argument)
            argument = ` ${argument}`;
        
        tagContent = val || code;
        let pre_parse_data = [], post_parse_data = [];
        
        if(typeof(TinyML.TAG_PRE_PARSE[tag]) === "function")
            pre_parse_data = TinyML.TAG_PRE_PARSE[tag](content, tag, argument, tagContent, parsedResidue);
        

        tagContent = pre_parse_data["tag_content"] || tagContent;
        tag = pre_parse_data["tag"] || tag;
        argument = pre_parse_data["arguments"] || argument;
        content = pre_parse_data["content"] || content;
        parsedResidue = pre_parse_data["residue"] || parsedResidue;
        
        if(val)
            tagContent = this.process(tagContent)
        
        if(typeof(TinyML.TAG_POST_PARSE[tag]) === "function")
            post_parse_data = TinyML.TAG_POST_PARSE[tag](content, tag, argument, tagContent , parsedResidue);

        tagContent = post_parse_data["tag_content"] || tagContent;
        tag = post_parse_data["tag"] || tag;
        argument = post_parse_data["arguments"] || argument;
        content = post_parse_data["content"] || content;
        parsedResidue = post_parse_data["residue"] || parsedResidue;

        return tagContent === false ? false : `${content}<${tag}${argument}>${tagContent}</${tag}>${parsedResidue}`;
    }
    
    parse(source, element)
    {
        if(Utils.isElement(source) && (element = source) && (source = this.source));
        
        let status = (this.html = this.process(source)) !== false;
        let html = status ? this.html : this.description() + "<br><hr><br>" + this.code();
        
        if(typeof(element) === "object" && element.innerHTML !== undefined)
            Utils.setInnerHtml(element, html);
        
        return this;
    }
}

TinyML.TAG_POST_PARSE["xhtml"] = function(content, tag, argument, tag_content, end)
{
    return {content: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">\n`, tag: "html"};
}

TinyML.TAG_POST_PARSE["html4"] = function(content, tag, argument, tag_content, end)
{
    return {content: `<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">\n`, tag: "html"};
}

TinyML.TAG_POST_PARSE["html5"] = function(content, tag, argument, tag_content, end)
{
    return {content: "<!DOCTYPE html>\n", tag: "html"};
}

String.prototype.tinyML = function(element)
{
    return new TinyML(this + "");
}