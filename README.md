## TinyML
TinyML is a lightwidth markup language to design web pages.

------------
#### Incluiding on your project
This project is a newborn chick, Try it at your own risk:

```html
<!--  Thanks https://www.jsdelivr.com/ -->
<script src="https://cdn.jsdelivr.net/gh/Iuriiiii/TinyML@master/tinyml.min.js"></script>
```

#### Incluiding on your project
You can create a TinyML object directly from a string containing the TinyML code has you can see in the following example:

```javascript
function body()
{
    return document.documentElement;
}

window.onload = function()
{
    `html{
        head{
            title{The title of the webpage}
        }
        body{
            div{
                Some content
            }
        }
    }`.tinyML().parse(body());
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

If you want to put some argument on the tag, you just need to do:
```c
div(class="myclassname"){
	img(src="something.jpg"){}
}
```
If instead you want to put HTML code or another one, you just need to use the exclamation char:
```c
div(class="myclassname"){!
	<img src="something.jpg"/>
!}
```
This is usefull for style or script tags:
```c
style{!
	body{
		background-color: red;
	}
!}

script{!
	function min(a,b) {
		return a > b? b : a;
	}
!}
```
A tag will be considered as one when is followed by bracers ('{' and '}') or code bracers ('{!' and '!}').
```c
thisisatag{}
thisisatagtoo(){}
thisisn'tatag andthisneither
|@#~€¬¬¬{} [This is a tag]

thisisnotatag {}
```
A short tag as 'img' need be followed by one of these separators.
```c
img(arguments){} [ < the '{}' are required ]
```

To put comments inside of TinyML code, you will use the square brackets:
```c
div{
	[This is a comment]
	h3{This is a title}
}
```

#### The little API
Now, you are able to modify the content of the actual parsed tag before and after the parsing.

You need to create a function with a single argument to modify the tag data, after this you just need to set it in the location of your preference.

```js
/* The following array contains the functions what will it's be called before the TinyML tag_content parsing */
TinyML.PRE_PARSE_FUNCTION_OF    = []; /* Pre parser functions */

/* The following array contains the functions what will it's be called after the TinyML tag_content parsing */
TinyML.POST_PARSE_FUNCTION_OF = []; /* Post parser functions */
```

Knowing this, if you want to create a function what analize the "div" tag, you need to do:
```js
TinyML.PRE_PARSE_FUNCTION_OF["div"] = function(tag_data)
{
	/* Do something with the tag_data */
};
```

The single argument will be contain all the data of the current parsed tag.
```js
/* All the following members can be changed */
tag_data["content"]        /* The left side content of the tag */
tag_data["tag"]               /* The current tag */
tag_data["arguments"]   /* The arguments of the tag */
tag_data["tag_content"] /* The content of the body of the tag, HTML content if it's getted from TinyML.POST_PARSE_FUNCTION_OF, else TinyML content */
tag_data["residue"]         /* The content of the right side of the tag */
tag_data["using_code_bracers"] /* true if the tag is using the code bracers ('{!' and '!}') */
```

The format is the following (for the non-short tags).
```js
`${tag_data.content}<${tag_data.tag}${tag_data.arguments}>${tag_data.tag_content}</${tag_data.tag}>${tag_data.residue}`
```
For the short tags the output format is:
```js
`${tag_data.content}<${tag_data.tag}${tag_data.arguments}>${tag_data.residue}`
```
With all this information you will able to modify the tags of your preference or even implement your own tags.

```js
TinyML.PRE_PARSE_FUNCTION_OF["rev"] = function(tag_data)
{
	tag_data.tag_content = tag_data.tag_content.split("").reverse().join("");
};
```

Or you could use the `TinyML.setPreParser` and `TinyML.setPostParser` functions.

```js
TinyML.setPreParser("rev", function(tag_data)
{
    console.log(tag_data);
	tag_data.tag_content = tag_data.tag_content.split("").reverse().join("");
});
```