<?php
//This script holds the header information needed for all the pages.
//Change this script to change all of the main pages at once

session_start(); //Always like to start the session, in case we use it later, and you can't use it after this

$DOMAIN = "goeverywhere.web44.net"; //This is the global variable, which will hold the current domain we are using,
                                    //in case we ever need to change it. use it as: "http://" + $DOMAIN + "/index.php"

?>
<!DOCTYPE html> <!-- we are using HTML5; this is the default DOCTYPE for it -->
<html>
    <head>
        <title>Go Everywhere!</title>
        
        <!-- HTML5 <script> tags don't require TYPE or LANGUAGE attributes, so we are fine with just this -->
        <script src="http://<?php echo $DOMAIN; ?>/scripts/jquery.min.js">
            /*
             * I personally like to use jQuery (http://jquery.com/)
             * as the syntax is clean, powerful, and simple
             * along with the many useful plugins we may use
             */
        </script>
        <script src="http://<?php echo $DOMAIN; ?>/scripts/jquery-migrate.min.js">
            /*
             * I am not used to the syntax of jQuery 2.x, however
             * some plugins use the new syntax, and some the old
             * so we add this plugin to simulate the old, deprecated functions
             */
        </script>
        <!-- .:ADD ANY JQUERY PLUGINS OR OTHER USEFUL FRAMEWORKS BELOW THIS LINE:. -->
        
        <!-- .:ADD ANY JQUERY PLUGINS OR OTHER USEFUL FRAMEWORKS ABOVE THIS LINE:. -->
    
    </head>

<!-- no need to add </html> or a <body> tag, since that will be taken care of in footer.php