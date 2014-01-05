--- HOW TO EMBED sb2.js ---

Include all:

    <script type="text/javascript" src='script/ZipFile.complete.js'></script>
    <script type="text/javascript" src="http://canvg.googlecode.com/svn/trunk/rgbcolor.js"></script> 
    <script type="text/javascript" src="http://canvg.googlecode.com/svn/trunk/canvg.js"></script> 
    <script type="text/javascript" src='http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js'></script>
    <script type="text/javascript" src='http://ajax.googleapis.com/ajax/libs/jqueryui/1.7.2/jquery-ui.min.js'></script>
    <script type="text/javascript" src="script/sb2.js"></script>

Then add a canvas with id "scratch" anywhere on the page, eg:

    <canvas id='scratch' width='486' height='391' tabindex='1'></canvas>

And you're done! You can load files with the method ReadFile(url);

--- PROPERTIES ---

sb2.js has a couple of properties that you can set to change the way the player behaves. These are autoLoad, framed, scaledHeight and editorInit().

autoLoad is the file url loaded upon full loading of the player. If this isn't defined then the player will not load any file.

framed defines whether or not the sb2.js frame is used. Defaults to true.

scaledHeight should be equal to the height of the element when scaled via styles. Scale is assumed to be 1 if not defined.

editorInit() is called when the project is loaded. This is mainly for an editor interface, but you can use it for whatever you want.

Here's an example:

<script>
autoLoad = "examples/MarioBros.sb2";
framed = false;
</scipt>

This will load MarioBros.sb2 with no frame at normal scale. The width and height of the canvas should be 480x360 for a non framed project, so make sure to configure the canvas right.

--- FUNCTIONS ---

You can call these from anywhere in the page to control the player.

execGreenFlag() - executes Green Flag scripts. should always be called after stopAll().
stopAll() - stops all scripts.
