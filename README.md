# TinyML
TinyML is a lightwidth markup language to design web pages.

## From `TinyML`

### translate

Traduces TinyML-syntax to HTML-syntax.

#### Parameters

🔹 <b>source: string</b> - The TinyML-syntax source to translate to HTML-syntax.

🔹 <b>options: TranslateOptions /* { preserveComments: boolean = true } */</b> - The options to use when translate.

#### Return

✅ The HTML.

❌ Throws error.

## Examples

<table>
<tr>
<th>Input</th>
<th>Output</th>
</tr>
<tr>
<td>

```
{<!DOCTYPE html>}
html(lang="en") {
    head {
        title {The page title}
    }
    body {
        [ This is a comment ]
        hr;
        div(class="container") {
            h1 {My first title}
            p {
                Lorem ipsum dolor sit;br;
                amet, consectetur
            }
        }
    }
}
```

</td>
<td>

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <title>The page title</title>
    </head>
    <body>
        <!-- This is a comment -->
        <hr/>
        <div class="container">
            <h1>My first title</h1>
            <p>
                Lorem ipsum dolor sit<br>
                amet, consectetur
            <p>
        </div>
    </body>
</html>
```

</td>
</tr>
</table>

<table>
<tr>
<th>Input</th>
<th>Output</th>
</tr>
<tr>
<td>

```
body {
    <h1>This is a title</h1>
}
```

</td>
<td>

```html
<body>
    &lt;h1&gt;This is a title&lt;/h1&gt;
</body>
```

</td>
</tr>

</td>
</tr>
</table>

<table>
<tr>
<th>Input</th>
<th>Output</th>
</tr>
<tr>
<td>

```
body {
    {<h1>This is a title</h1>}
}
```

</td>
<td>

```html
<body>
    <h1>This is a title</h1>
</body>
```

</td>
</tr>
</table>

<table>
<tr>
<th>Input</th>
<th>Output</th>
</tr>
<tr>
<td>

```
[body {
    {<h1>This is a title</h1>}
}]
```

</td>
<td>

```html
<!--<body>
    <h1>This is a title</h1>
</body>-->
```

</td>
</tr>
</table>

<table>
<tr>
<th>Input</th>
<th>Output</th>
</tr>
<tr>
<td>

```
body {
    [{<h1>This is a title</h1>}]
}
```

</td>
<td>

```html
<body>
    <!--{<h1>This is a title</h1>}-->
</body>
```

</td>
</tr>
</table>