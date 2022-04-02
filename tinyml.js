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
"use strict";

const SPECIAL_CHARS = ['á','é','í','ó','ú','Á','É','Í','Ó','Ú','ñ','Ñ'];

/* https://stackoverflow.com/questions/610406/javascript-equivalent-to-printf-string-format */
while(!String.prototype.format)
{
    String.prototype.format = function()
    {
        let args = arguments[0] instanceof Array ? arguments[0] : arguments;
        
        return this.replace(/{(\d+)}/g, function(match, number)
        { 
            return typeof(args[number]) != 'undefined' ? args[number] : match;
        });
    };
    break;
}

class Utils
{
    /*
    static isBetween(a,b,c)
    {
        return a >= b && a <= c;
    }
    */
    
    static isSpace(c)
    {
        return c === ' ' || c === '\t';
    }
    
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

Array.prototype.contains = function(v)
{
    for(let i = 0; i < this.length; i++)
        if(this[i] === v)
            return true;
    
    return false;
}

class TinyML
{
    /* SHOULD BE UNMODIFICABLE */
    static STATUS_SUCCESS = 0;
    //static ERROR_INVALID_SOURCE = 1;
    static STATUS_TAG_EXCPECTED = 2;
    static STATUS_SEPARATOR_EXCPECTED = 3;
    static STATUS_VALUE_EXPECTED = 4;
    //static STATUS_EXPECTED_BRACE_CLOSURE = 5;
    static STATUS_EXPECTED_BRACKET_CLOSURE = 6;
    //static STATUS_SQUARE_BRACKET_OPEN_EXPECTED = 7;
    static STATUS_INVALID_STRING_LOCATION = 8;
    static STATUS_INVALID_CHARACTER_AT_LOCATION = 9;
    static STATUS_INVALID_ESCAPE_CHARACTER = 10;
    static STATUS_INFINITE_COMMENT_DETECTED = 11;
    static STATUS_INVALID_BRACE_CLOSURE = 12;
    static STATUS_INVALID_CODE_BRACE_CLOSURE = 13;
    //static STATUS_EXPECTED_CODE_BRACE_CLOSURE = 14;
    static STATUS_FINAL_BRACE_CLOSURE_EXPECTED = 15;
    static STATUS_ENDLESS_ARGUMENTS = 16;
    static STATUS_EXPECTED_PARENTHESES_CLOSURE = 17;
    static STATUS_ENDLESS_CODE_SECTION = 18;
    static STATUS_EXPECTED_CODE_BRACE_FOR_TAG = 19;
    static PRE_PARSE_FUNCTION_OF = []; /* Pre parser functions */
    static POST_PARSE_FUNCTION_OF = []; /* Post parser functions */
    static NEED_CODE_KEY = ["script", "style"];
    static SHORT_TAGS = ["img", "br", "input", "link", "meta", "area", "source", "base", "col", "option", "embed", "hr", "param", "track"];
    
    static setPreParser(tag, f)
    {
        if(typeof(tag) === "string" && typeof(f) === "function" && (TinyML.PRE_PARSE_FUNCTION_OF[tag] = f))
            return true;
        
        return false;
    }
    
       static setPostParser(tag, f)
    {
        if(typeof(tag) === "string" && typeof(f) === "function" && (TinyML.POST_PARSE_FUNCTION_OF[tag] = f))
            return true;
        
        return false;
    }
    
    #i = 0;
    #args;
    
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
        /*
            { Opening brace
            } Closing brace
            [ Opening square bracket
            ] Closing square bracket
            ( Opening Parentheses
            ) Closing Parentheses
        */
        function getErrorDescription(status)
        {
            switch(status)
            {
                case TinyML.STATUS_SUCCESS: return "¡Success!";
                case TinyML.STATUS_TAG_EXCPECTED: return `Tag excepected at {0}`;
                case TinyML.STATUS_SEPARATOR_EXCPECTED: return `Separator ('[', '(', '{') expected at {0}`;
                case TinyML.STATUS_VALUE_EXPECTED: return `Value of tag '{0}' expected at {1}`;
                case TinyML.STATUS_FINAL_BRACE_CLOSURE_EXPECTED: return `Final brace closure '}' expected for code of tag '{0}'`;
                case TinyML.STATUS_INVALID_BRACE_CLOSURE: return `Invalid key closure '}' at {0}`;
                case TinyML.STATUS_INVALID_CODE_BRACE_CLOSURE: return `Invalid code key closure '!}' at {0}`;
                case TinyML.STATUS_ENDLESS_ARGUMENTS: return `Endless arguments detected, expected parentheses closure ')' for arguments of tag '{0}'`;
                case TinyML.STATUS_EXPECTED_PARENTHESES_CLOSURE: return `Expected ')' at {0}`;
                case TinyML.STATUS_SQUARE_BRACKET_OPEN_EXPECTED: return `Expected '[' at {0}`;
                case TinyML.STATUS_INVALID_STRING_LOCATION: return `Invalid string at {0}`;
                case TinyML.STATUS_INVALID_CHARACTER_AT_LOCATION: return `Invalid character at {0}`;
                case TinyML.STATUS_INVALID_ESCAPE_CHARACTER: return `Invalid escaped character '{0}' at {1}`;
                case TinyML.STATUS_INFINITE_COMMENT_DETECTED: return "Endless comment";
                case TinyML.STATUS_ENDLESS_CODE_SECTION: return `Endless code detected, expected code brace closure '!}' for tag '{0}'`;
                case TinyML.STATUS_EXPECTED_CODE_BRACE_FOR_TAG: return `The tag '{0}' need use code keys ('{!' and '!}')`;
                default: return "Unknown reason O.o";
            }
        }
        
        return getErrorDescription(this.status).format(this.#args);
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
    
    #error(status, args)
    {
        this.#args = args;
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
        
        this.actual_code = source;
        
loop:   for(i = 0; i < source_length; i++)
        {
            let c = source[i];
            this.#i = i;
    
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
                        return this.#error(TinyML.STATUS_SQUARE_BRACKET_OPEN_EXPECTED, [i]);
                    
                break;
                case '!':
                    if(isString || cor > 0 || lla > 0)
                        break;
                    
                    if(par > 0)
                        return this.#error(TinyML.STATUS_INVALID_CHARACTER_AT_LOCATION, [i]);
                    
                    if(source[i+1] === '}' && (++i))
                        isCode--;
                    
                    if(isCode < 0)
                        return this.#error(TinyML.STATUS_INVALID_CHARACTER_AT_LOCATION, [i]);
                    else if(isCode === 0)
                        break loop;
                        
                    
                break;
                case '>':
                case '<':
                    if(isString || cor > 0)
                        break;
                
                    if(par > 0)
                        return this.#error(TinyML.STATUS_INVALID_CHARACTER_AT_LOCATION, [i]);
                    
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
                        return this.#error(TinyML.STATUS_INVALID_STRING_LOCATION, [i]);
                    
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
                        return this.#error(TinyML.STATUS_SQUARE_BRACKET_OPEN_EXPECTED, [i]);
                    
                break;
                case '{':
                    if(isString || cor > 0 || par > 0 || isCode > 0 || isEscaped)
                        break;
                    
                    if(!tag)
                        return this.#error(TinyML.STATUS_TAG_EXCPECTED, [i]);
                    
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
                        return this.#error(TinyML.STATUS_INVALID_BRACE_CLOSURE, [i]);
                    
                break;
            }
            
            isOutside = (lla === 0) && (par === 0) && (cor === 0) && (isCode === 0) && (isString === false);
            
            if(cor > 0)
                continue;
            
            if(isEscaped)
            {
                escapedChar = this.#escapeTml(c);
                
                if(!escapedChar)
                    return this.#error(TinyML.STATUS_INVALID_ESCAPE_CHARACTER, [c, i]);
                
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
                
        }
        
        if(i < source_length)
            residue = source.substring(i+1);
        
        tag = tag.trim();
        
        if(i == source_length && tag)
        {
            content += tag;
            tag = "";
        }
        
        if(cor > 0)
            return this.#error(TinyML.STATUS_INFINITE_COMMENT_DETECTED);
        
        if(!tag)
            return content + residue;
        
        tag = tag.toLowerCase();
        
        if(lla > 0)
            return this.#error(TinyML.STATUS_FINAL_BRACE_CLOSURE_EXPECTED, [tag]);
        else if(par > 0)
            return this.#error(TinyML.STATUS_ENDLESS_ARGUMENTS, [tag]);
        else if(isCode > 0)
            return this.#error(TinyML.STATUS_ENDLESS_CODE_SECTION, [tag]);
        
        if((parsedResidue = this.process(residue)) === false)
            return false;
        
        if(argument && !Utils.isSpace(argument[0]))
            argument = ` ${argument}`;
        
        if(TinyML.NEED_CODE_KEY.contains(tag) && val)
            return this.#error(TinyML.STATUS_EXPECTED_CODE_BRACE_FOR_TAG, tag);
        
        tagContent = val || code;
        let parse_data = {content: content, tag: tag, arguments: argument, tag_content: tagContent, residue: parsedResidue, using_code_bracers: code !== ""};
        
        if(typeof(TinyML.PRE_PARSE_FUNCTION_OF[tag]) === "function")
            TinyML.PRE_PARSE_FUNCTION_OF[tag](parse_data);
        
        if(val)
            if((parse_data.tag_content = this.process(parse_data.tag_content)) === false)
                return false;
        
        if(typeof(TinyML.POST_PARSE_FUNCTION_OF[tag]) === "function")
            TinyML.POST_PARSE_FUNCTION_OF[tag](parse_data);

        if(TinyML.SHORT_TAGS.contains(tag))
            return `${parse_data.content}<${parse_data.tag}${parse_data.arguments}>${parse_data.residue}`;
        else
            return `${parse_data.content}<${parse_data.tag}${parse_data.arguments}>${parse_data.tag_content}</${parse_data.tag}>${parse_data.residue}`;
    }
    
    parse(source)
    {
        if((this.html = this.process(source || this.source)) === false)
            this.html = this.description() + "<br><hr><br>" + this.code();
        
        return this;
    }
    
    applyTo(element)
    {
        if(typeof(element) === "object" && element.innerHTML !== undefined)
            Utils.setInnerHtml(element, this.parse(this.source).html);
        
        return this;
    }
}

TinyML.POST_PARSE_FUNCTION_OF["xhtml"] = function(data)
{
    data.content = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">\n`;
    data.tag = "html";
}

TinyML.POST_PARSE_FUNCTION_OF["html4"] = function(data)
{
    data.content = `<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">\n`;
    data.tag = "html";
}

TinyML.POST_PARSE_FUNCTION_OF["html5"] = function(data)
{
    data.content = "<!DOCTYPE html>\n";
    data.tag = "html";
}

String.prototype.tinyML = function()
{
    return new TinyML(this + "");
}

if(typeof(jQuery) !== "undefined")
{
    jQuery.fn.applyTinyML() = function(source)
    {
        if(typeof(source) === "string")
            source.tinyML().applyTo(this);
        
        return this;
    }
}