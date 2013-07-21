<?php
//This script holds the header information needed for all the pages.
//Change this script to change all of the main pages at once

session_start(); //Always like to start the session, in case we use it later, and you can't use it after this

//I improved this, so that it will automaticly change on server
//This means that on local servers for testing, you do not have to change the $DOMAIN variable back and forth
//This is the global variable, which will hold the current domain we are using,
//in case we ever need to change it. use it as: "http://" + $DOMAIN + "/index.php"
    if ($_SERVER["SERVER_PORT"] != "80") {
        $DOMAIN = $_SERVER["SERVER_NAME"].":".$_SERVER["SERVER_PORT"];
    } else {
        $DOMAIN = $_SERVER["SERVER_NAME"];
    }
    $DOMAIN .= "/Go-Everywhere"; //Because of how I told all of you to set this up, you must run this in the "Go-Everywhere" folder
    //Ex. http://localhost/Go-Everywhere/ instead of http://localhost/ or http://localhost/develop/Go-Everywhere
    //This extra folder will also come in handy when we have the self extracting PHP script for Github

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
        <!-- .:ADD ANY EXTERNAL JAVASCRIPT BELOW THIS LINE:. -->
        <script src="http://<?php echo $DOMAIN; ?>/js/UI.js">//To get the correct style, JavaScript is needed to calculate height properly</script>
        <!-- .:ADD ANY EXTERNAL JAVASCRIPT ABOVE THIS LINE:. -->
        <!-- .:ADD ANY CSS LINKS BELOW THIS LINE:. -->
        <link href="http://<?php echo $DOMAIN; ?>/styles/desktop.css" rel="stylesheet" /> <!-- The CSS file for the header (this page). -->
        <!-- .:ADD ANY CSS LINKS ABOVE THIS LIKE:. -->
    </head>
    
    <body>
        <div id="header">
               <a href="http://<?php echo $DOMAIN; ?>/"><span id="logo">Go Everywhere</span></a>
            <div id="menuitems">
                <a href="http://github.com/GoEverywhere/Go-Everywhere.git" target="_blank"><button class="menuitem">Fork us on Github!</button></a>
                <a href="http://scratch.mit.edu/discuss/topic/11087/" target="_blank"><button class="menuitem">Discuss on Official Thread!</button></a>
            </div>
        </div>
        <div id="container"><!-- Something to help with styling -->
            <div id="content">
                
<!-- no need to add </html> or </body>, since that will be taken care of in footer.php -->