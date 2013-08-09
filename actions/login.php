<?php
/* This is a temporary file for testing features that log people in
 * I am trying to get jvvg to let us use the Scratch verification
 * script that they use on ModShare and Scratch Wiki. I'm sure
 * he would let us use it, as we are close to Scratch as well.
 * If not, I guess we have to do it ourselves. It probably wouldn't
 * be that hard, but it would be nice to have it on the official
 * script.
 */
/* When using AJAX, make sure that you send the info with the GET
 * variable "returnonly=true", such like "http://localhost/Go-Everywhere/actions/login.php?returnonly=true"
 * or else the server will direct the page somewhere, where you only
 * want the data, and nothing else
 */
//Put the HTTP variables into variables
$username = $_POST['username'];
$password = $_POST['password'];
$returnonly = $_GET['returnonly'];
//make sure if there is an error to write it to this variable. Append to it, each error having a , between them
$errormessage = "";

//verify that the user is an actual user
$verified = false;
//Get the database functions
require_once("../../db_constants.php");
//Connect to the database
db_connect();
//Query the database to see if the user exists
//I don't know why, but when using the db_query function, it doesn't work. Maybe because it isn't returning a value?
$result = mysql_query("SELECT * FROM users WHERE user='" . mysql_real_escape_string($username) ."' AND passwd='" . sha1($password) . "'");
if(db_num_rows($result) > 0)
{
    //There is at least one user. There should be one, and only one.
    if(db_num_rows($result) > 1)
    {
        //This should have never happened. In a UI, you should inform the user to contact an admin ASAP
        $verified = false;
        $errormessage .= "multipleaccounts,";
    }else{
        //There is only one user. Now for the minor details.
        while($row = mysql_fetch_array($result))
        {
            if($row['scratch'] == 0)
            {
                //They didn't verify their Scratch account
                $verified = false;
                $errormessage .= "noscratch,";
            }
            //TODO: Improve ban (time based instead of Boolean based)
            else if($row['banned'] == 1)
            {
                //User is banned. Format the time to mm/dd/yyyy (after the : character)
                $verified = false;
                $errormessage .= "banned:forever";
            }
            else
            {
                //Nothing else, the user can be logged in
                $verified = true;
            }
        }
    }
}else{
    //The user is not registered, or the password was wrong.
    $verified = false;
    $errormessage .= "noaccounts,";
}

//Now too see what we need to do
if($verified)
{
    //Log the user in
    //start session
    session_start();
    //set user in the session (if they are already in, it will just restart the timer)
    $_SESSION ['username'] = $username;
    //set a cookie to the user
    //this can be improved even more, but I'm not to worried about it right now,
    //since it isn't so popular that people would hack users. But, we will improve on
    //security soon
    setCookie('user_id', $username);
}

//decide whether we should redirect the user or not
switch($returnonly)
{
    case "true":
    case "t":
    case "1":
    case "yes":
    case "y":
        //no, just echo data and exit
        if($verified)
        {
            echo "true";
        }else{
            echo "false?" . $errormessage;
        }
        break;
    default:
        //yes, take us to where we were before (or the home page)
        if(isset($_GET['redirect']) && $_GET['redirect'] != "")
        {
            //we have a specific page to go back to
            header('Location: ' . $_GET['redirect'] . '?message=' . $errormessage . '&verified=' . $verified);
        }else{
            //we weren't given a page, go to the home page
            header('Location: ../?message=' . $errormessage . '&verified=' . $verified);
        }
        break;
}
?>