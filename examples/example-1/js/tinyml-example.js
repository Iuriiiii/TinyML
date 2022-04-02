function body()
{
    return document.documentElement;
}

/* https://stackoverflow.com/questions/14446447/how-to-read-a-local-text-file */
function readfile(file)
{
    let rawFile = new XMLHttpRequest();
    
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                rawFile.responseText.tinyML().applyTo(body());
            }
        }
    }
    
    rawFile.send(null);
}

window.onload = function()
{
    readfile("main.tml");
}