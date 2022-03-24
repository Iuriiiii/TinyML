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

#### TinyML syntax
To create a new tag you just need to write a text followed of a bracket key ({).

```c
html{
	head{
		title{The window title}
	}
	body{
		div{
			Something like you want
		}
	}
}
```

If you want to put some argument on a tag, you just need to do:
```c
div(class="myclassname"){
	img(src="something.jpg"){}
}
```
If instead you want to put HTML code or another one you just need to use the exclamation char:
```c
div(class="myclassname")!{
	<img src="something.jpg"/>
}
```
This is usefull to style or script tags:
```c
style!{
	body{
		background-color: red;
	}
}

script!{
	function min(a,b) {
		return a > b? b : a;
	}
}
```

To put comments inside of TinyML code, you will use the square brackets:
```c
div{
	[This is a comment]
	h3{This is a title}
}
```

![visitors](https://visitor-badge.laobi.icu/badge?page_id=TinyML)