<?php
//Just log the user out, and send them on their way
session_start();
//unset the session
unset($_SESSION['username']);
//unset the cookie (force it to expire)
$pastdate = mktime(0,0,0,1,1,1970);
setcookie("user_id", "", $pastdate);
if(isset($_GET['redirect']) && $_GET['redirect'] == "")
{
    //redirect them to a specific page
    header('Location: http://' + $_GET['redirect']);
}else{
    //The home page will do
    header('Location: ./index.php');
}