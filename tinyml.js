﻿/*
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
    static isBetween(a,b,c)
    {
        return a >= b && a <= c;
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
}

class TinyML
{
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
    
    #i = 0;
    #tag = "";
    #value = "";
    #argument = "";
    #valueCaptureStart = 0;
    
    constructor(source)
    {
        if(typeof(source) != "string")
            throw TinyML.ERROR_INVALID_SOURCE;
        
        this.html_source = "";
        this.source = source;
        //this.source_length = this.source.length;
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
            case TinyML.STATUS_EXPECTED_PARENTHESIS_CLOSURE: return `Expected ')' at ${this.#i+1}`;
            case TinyML.STATUS_BRACKET_OPEN_EXPECTED: return `Expected '['`;
            case TinyML.STATUS_INVALID_STRING_LOCATION: return `Invalid string at ${this.#i+1}`;
            case TinyML.STATUS_INVALID_CHARACTER_AT_LOCATION: return `Invalid character at ${this.#i+1}`;
            case TinyML.STATUS_INVALID_ESCAPE_CHARACTER: return `Invalid escaped character at ${this.#i+1}`;
            case TinyML.STATUS_INFINITE_COMMENT_DETECTED: return "Endless comment";
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
        
        let flag = 0;
        let par = 0;
        let lla = 0;
        let cor = 0;
        let isString = false;
        let isOutside = true;
        let val = "";
        let argument = "";
        let tag = "";
        let content = "";
        let i;
        let residue = "";
        let source_length = source.length;
        let ignore = false;
        let code = "";
        let isEscaped = false;
        
        //console.info(source);
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
                    if(isString || isEscaped)
                        break;
                
                    if(par === 0 && lla === 0)
                        cor++;
                    
                break;
                case ']':
                    if(isString || isEscaped)
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
                    
                    if(ignore || par > 0)
                        return this.#error(TinyML.STATUS_INVALID_CHARACTER_AT_LOCATION);
                    
                    if(ignore = lla === 0)
                        c = '';
                    
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
                    if(isString || cor > 0 || !isOutside)
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
                    if(isString || cor > 0)
                        break;
                    
                    if(lla === 0)
                        par++;
                    
                    if(par === 1)
                        c = '';
                    
                break;
                case ')':
                    if(isString || cor > 0)
                        break;
                    
                    if(lla === 0)
                    {
                        par--;
                        
                        if(par === 0)
                            c = '';
                    }
                    
                    if(par < 0)
                        return this.#error(TinyML.STATUS_BRACKET_OPEN_EXPECTED);
                    
                break;
                case '{':
                    if(isString || cor > 0 || isEscaped)
                        break;
                    
                    if(par === 0)
                        lla++;
                    
                    if(lla === 1)
                        c = '';
                    
                break;
                case '}':
                    if(isString || cor > 0 || isEscaped)
                        break;
                    
                    if(par === 0)
                        lla--;
                    
                    if(lla === 0)
                    {
                        if(tag)
                            break loop;
                        else
                            c = '';
                        
                        ignore = false;
                    }
                    
                break;
            }
            
            isOutside = (lla === 0) && (par === 0) && (cor === 0) && (isString === false);
            
            if(cor > 0)
                continue;
            
            if(isEscaped)
            {
                let escapedChar = this.#escapeTml(c);
                
                if(!escapedChar)
                    return this.#error(TinyML.STATUS_INVALID_ESCAPE_CHARACTER);
                
                tag += escapedChar;
                isEscaped = false;
            }
            else if(isOutside)
                tag += c;
            else if(par > 0 && tag)
                argument += c;
            else if (lla > 0 && tag)
                if(!ignore)
                    val += c;
                else
                    code += c;
            else
                content += c;
                
            
            //console.info("tag:", tag, "argument:", argument, "val:", val);
            //if(val)
            //    console.info("tag:", tag, "lla:", lla, "par:", par, "argument:", argument, "val:", val);
            //else
            //    console.info("tag:", tag, "lla:", lla, "par:", par, "argument:", argument, "code:", code);
        }
        
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
        
        if(!tag)
            return content + residue;
        
        let parsedResidue, parsedVal;
        
        if((parsedResidue = this.process(residue)) === false)
            return false;
        
        if(argument)
            argument = ` ${argument}`;
        
        if(val)
            if((parsedVal = this.process(val)) === false)
                return false;
            else
                return `${content}<${tag}${argument}>${parsedVal}</${tag}>${parsedResidue}`;

        return `${content}<${tag}${argument}>${code}</${tag}>${parsedResidue}`;
    }
    
    parse()
    {
        return (this.html_source = this.process(this.source)) !== false;
    }
    
    parseAndApply(element)
    {
        if(this.parse())
            Utils.setInnerHtml(element,this.html_source);
        else
            element.innerHTML = this.description() + "<br><br>" + this.code();
    }
}