## TinyML
TinyML is a lightwidth markup language to make web pages.

------------
#### Incluiding on your project
This project is a newborn chick, Try it at your own risk:

```html
<!--  Thanks https://www.jsdelivr.com/ -->
<script src="https://cdn.jsdelivr.net/gh/Iuriiiii/TinyML@master/tinyml.min.js"></script>
```

#### Incluiding on your project
You should create a new TinyML object with the source to parse, check the parse and put the result in the main window object.

```javascript
function body()
{
    return document.documentElement;
}

window.onload = function()
{
    let allTmlCode = `

html{
    head{
        title{The title of the webpage}
    }
    body{
        div{
            Some content
        }
    }
}

`;
 
    let tml = new TinyML(allTmlCode);

    if(tml.parse())
        body().innerHTML = tml.html_source;
    else
        body().innerHTML = tml.description() + "<br>" + tml.code();

}
```