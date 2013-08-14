<?php
/*
 * THIS FILE IS DEPRECATED!
 * It still exists for reference.
 * Registration is now located at /register/1.php
 *
//Start the session
session_start();
//get the database info
require_once("../db_constants.php");
//See if the user is already logged in
if(isset($_SESSION['username']))
{
    //They should not be here. Send them home.
    header('Location: index.php');
}else{
    //They are not logged in. Now to see whether we have filled out the form or not
    if($_GET['filled'] == "true")
    {
        //Yep. Now to see if they filled it out correctly.
        if(isset($_POST['username']) && $_POST['username'] != "" && isset($_POST['password']) && $_POST['password'] != "" && isset($_POST['password2']) && $_POST['password2'] != "" && isset($_POST['mpassword']) && $_POST['mpassword'] != "")
        {
            //Yep!
            //See if they their ModShare credentials are correct
            if (strstr(file_get_contents('http://modshare.org/api/authenticate/' . rawurlencode($_POST['username']) . '/' . rawurlencode($_POST['mpassword'])), 'false')) {
                $errormessage = "ERROR: Please make sure that your ModShare credentials are correct!";
            }else{
                //Yep!
                //Now to register them!
                //Connect to the database
                db_connect();
                //See if they are already registered
                $result = db_query("SELECT * FROM users WHERE user='" . mysql_real_escape_string($_POST['username']) . "'");
                if(db_num_rows($result) > 0)
                {
                    //They are already registered!
                    $errormessage = "ERROR: You are already registered! Go log in instead!";
                }else{
                    //Nope! Continue on!
                    //See if their passwords match
                    if($_POST['password'] != $_POST['password2'])
                    {
                        //Nope! Let them know that!
                        $errormessage = "ERROR: Please make sure that your passwords match!";
                    }else{
                        //Yes!
                        //Insert them into the database!
                        db_query("INSERT INTO users VALUES('" . mysql_real_escape_string($_POST['username']) . "', '" . crypt($_POST['password'], LOGIN_SALT) . "', 1, 1, 0)");
                        //Log the user in
                        //set user in the session
                        $_SESSION ['username'] = $username;
                        //set a cookie to the user
                        //this can be improved even more, but I'm not to worried about it right now,
                        //since it isn't so popular that people would hack users. But, we will improve on
                        //security soon
                        setCookie('user_id', $username);
                        //send them on their way!
                        header('Location: ./index.php');
                    }
                }
            }
        }else{
            //Nope! We need to tell them that
            $errormessage = "ERROR: Please make sure that you fill out the form completely!";
        }
    }else{
        //Well, we will show the form again.
    }
}
//include the header (if the above script doesn't redirect the user, then they must need to fill out the form)
include_once('./includes/header.php');
?>
<h2>Signup!</h2>
<p>Please fill in all the forms correctly. You are <u>required</u> to have a valid <a href="http://modshare.org/" target="_blank">ModShare</a> account. This is for security reasons, the main being so people won't pretend to be somebody they are not.</p>
<?php
if(isset($errormessage))
{
?>
<p style="color:red"><?php echo $errormessage; ?></p>
<?php
}
*/
?>
<!--<form style="padding: 5px;border: 1px solid black; width: 450px;" method="post" action="./register.php?filled=true" enctype="application/x-www-form-urlencoded">
    <label for="username">Existing ModShare Username: </label>
    <input type="text" length="15" maxlength="20" id="username" name="username" /><br />
    <label for="mpassword">Existing ModShare Password: </label>
    <input type="password" length="20" maxlength="20" id="mpassword" name="mpassword" /><br />
    <label for="password">Password for Go Everywhere: </label>
    <input type="password" length="20" maxlength="20" id="password" name="password" /><br />
    <label for="password2">Password for Go Everywhere Again: </label>
    <input type="password" length="20" maxlength="20" id="password2" name="password2" /><br />
    <input type="submit" value="Signup!" />
</form>-->
<?php
//include_once('./includes/footer.php');
?>