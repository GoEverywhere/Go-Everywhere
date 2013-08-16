<?php
include_once("../includes/header.php");
//include database info
require_once("../../db_constants.php");
//connect to the database
db_connect();
//see if we need to view a certain user, or the curren't user's profile page
$displayOwn = true;
if(isset($_GET['user']) && $_GET['user'] != "")
{
    $displayOwn = false;
}
$user = $_SESSION['username'];
if(!$displayOwn)
{
    $user = $_GET['user'];
}
//query the user
$result = mysql_query("SELECT * FROM users WHERE user='" . mysql_real_escape_string($user) . "'") or die(mysql_error());
if(mysql_num_rows($result) == 0)
{
    //Error. No user. Should replace this with an error 404 page, when we get one
    echo "Error: No such user";
    exit;
}
$info = mysql_fetch_array($result);
?>

<!-- Someone add a profile picture thing and password change stuffs -->
<!-- I'll find the time to do this later if you don't want to -->
<h1><u>Under Construction</u></h1>

<?php
include_once("../includes/footer.php");
?>