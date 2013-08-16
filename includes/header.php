<?php
//This script holds the header information needed for all the pages.
//Change this script to change all of the main pages at once

session_start(); //Always like to start the session, in case we use it later, and you can't use it after this

//I improved this, so that it will automaticly change on server
//This means that on local servers for testing, you do not have to change the $DOMAIN variable back and forth
//This is the global variable, which will hold the current domain we are using,
//in case we ever need to change it. use it as: "http://" + $DOMAIN + "/index.php"

    //This checks for https
    //The off is only on IIS
    if (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] != 'off') {
        //SSL connection
        if ($_SERVER["SERVER_PORT"] != "80") {
            $DOMAIN = "https://".$_SERVER["SERVER_NAME"].":".$_SERVER["SERVER_PORT"];
        } else {
            $DOMAIN = "https://".$_SERVER["SERVER_NAME"];
        }
    } else {
        //Not SSL
        if ($_SERVER["SERVER_PORT"] != "80") {
            $DOMAIN = "http://".$_SERVER["SERVER_NAME"].":".$_SERVER["SERVER_PORT"];
        } else {
            $DOMAIN = "http://".$_SERVER["SERVER_NAME"];
        }
    }

    
    $DOMAIN .= "/Go-Everywhere"; //Because of how I told all of you to set this up, you must run this in the "Go-Everywhere" folder
    //Ex. http://localhost/Go-Everywhere/ instead of http://localhost/ or http://localhost/develop/Go-Everywhere
    //This extra folder will also come in handy when we have the self extracting PHP script for Github

    //Start the session if the cookie is there, but the user is not existing in the session variable
    if((empty($_SESSION['username']) || $_SESSION['username'] == '') && (isset($_COOKIE['user_id']) && $_COOKIE['user_id'] != ''))
    {
        $_SESSION['username'] = $_GET['user_id'];
    }
?>
<!DOCTYPE html> <!-- we are using HTML5; this is the default DOCTYPE for it -->
<html>
    <head>
        <title>Go Everywhere!</title>
        
        <!-- HTML5 <script> tags don't require TYPE or LANGUAGE attributes, so we are fine with just this -->
        <script src="<?php echo $DOMAIN; ?>/scripts/jquery.min.js">
            /*
             * I personally like to use jQuery (http://jquery.com/)
             * as the syntax is clean, powerful, and simple
             * along with the many useful plugins we may use
             */
        </script>
        <script src="<?php echo $DOMAIN; ?>/scripts/jquery-migrate.min.js">
            /*
             * I am not used to the syntax of jQuery 2.x, however
             * some plugins use the new syntax, and some the old
             * so we add this plugin to simulate the old, deprecated functions
             */
        </script>
        <!-- .:ADD ANY JQUERY PLUGINS OR OTHER USEFUL FRAMEWORKS BELOW THIS LINE:. -->
        <script src="//ajax.googleapis.com/ajax/libs/jqueryui/1.10.3/jquery-ui.min.js">//jQuery UI effects, does not include the theme</script>
        <!-- .:ADD ANY JQUERY PLUGINS OR OTHER USEFUL FRAMEWORKS ABOVE THIS LINE:. -->
        
        <!-- .:ADD ANY EXTERNAL JAVASCRIPT BELOW THIS LINE:. -->
        <script src="<?php echo $DOMAIN; ?>/scripts/UI.js">//To get the correct style, JavaScript is needed to calculate height properly</script>
        <!-- .:ADD ANY EXTERNAL JAVASCRIPT ABOVE THIS LINE:. -->
        
        <!-- .:ADD ANY CSS LINKS BELOW THIS LINE:. -->
        <link href="<?php echo $DOMAIN; ?>/styles/desktop.css" rel="stylesheet" /> <!-- The CSS file for the header (this page). -->
        <!-- .:ADD ANY CSS LINKS ABOVE THIS LIKE:. -->
    </head>
    
    <body>
        <div id="header">
            <a href="<?php echo $DOMAIN; ?>/"><span id="logo">Go Everywhere</span></a>
            <div id="menuitems">
                <a href="<?php echo $DOMAIN; ?>/explore"><button class="menuitem">Explore</button></a>
                <a href="https://github.com/GoEverywhere/Go-Everywhere.git" target="_blank"><button class="menuitem">Fork us on Github!</button></a>
                <a href="http://scratch.mit.edu/discuss/topic/11087/" target="_blank"><button class="menuitem">Discuss on Official Thread!</button></a>
                <a href="<?php echo $DOMAIN; ?>/contribute.php"><button class="menuitem">How to contribute</button></a>
                <!--maybe this can be changed to float on the right. I sure don't know how to do it.-->
                <?php
                if(!isset($_SESSION['username']))
                {
                ?>
                <a style="float: right" id="signupButton" href="<?php echo $DOMAIN; ?>/register/"><button class="menuitem">Signup</button></a>
                <a style="float: right" id="loginButton" href="javascript:"><button class="menuitem">Login</button></a>
                <?php
                }else{
                ?>
                <a style="float: right" href="<?php echo $DOMAIN; ?>/profile"><button class="menuitem"><?php echo $_SESSION['username']; ?></button></a>
                <a style="float: right" href="<?php echo $DOMAIN; ?>/logout.php"><button class="menuitem">Logout</button></a>
                <?php
                }
                ?>
            </div>
            <div id="loginform">
                <form method="post" action="./actions/login.php" enctype="application/x-www-form-urlencoded">
                    <label for="username">Username: </label>
                    <input type="text" length="15" maxlength="20" id="username" name="username" /><br />
                    <label for="password">Password: </label>
                    <input type="password" length="20" maxlength="20" id="password" name="password" /><br />
                    <input type="submit" value="Login!" />
                </form>
            </div>
        </div>
        <div id="container"><!-- Something to help with styling -->
            <div id="content">
                <!--Let's see if they have JavaScript -->
                <noscript>
                    <h3 style="color:red;">Woah, there! Sorry, but you <u>must</u> have JavaScript to use most features on Go-Everywhere. Please go enable JavaScript!</h3>
                </noscript>
<!-- no need to add </html> or </body>, since that will be taken care of in footer.php-->
