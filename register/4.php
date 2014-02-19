<?php
/* This script takes the verified user, and inserts them into the database */
//start the session
session_start();
//get the database info
$backTicks = "";
for($i = 0; $i < substr_count($_SERVER['SCRIPT_NAME'], '/') - 1; $i++)
{
    $backTicks .= "../";
}
require_once($backTicks . "db_constants.php");
//see if all the required info is here
if(isset($_SESSION['username']))
{
	//They shouldn't be here!
	header('Location: ../');
	exit;
}
if(empty($_SESSION['verifieduser']) || $_SESSION['verifieduser'] == "")
{
	//They are not verified. We should send them back to step one, and start over
	header('Location: ./1.php');
	exit;
}
if(empty($_POST['password']) || $_POST['password'] == "" || empty($_POST['password2']) || $_POST['password2'] == "")
{
	//They didn't fill out the last form correctly!
	header('Location: ./3.php');
	exit;
}
if($_POST['password'] != $_POST['password2'])
{
	//They didn't fill out the last form correctly!
	header('Location: ./3.php?error=yes');
	exit;
}
/*
//Okay, now we can begin to register them!
db_connect();
//See if they are already registered
$result = db_query("SELECT * FROM users WHERE user='" . mysql_real_escape_string($_SESSION['verifieduser']) . "'");
if(db_num_rows($result) > 0)
{
    	//They are already registered!
    	echo "<p>ERROR: You are already registered! Go log in instead!</p>";
}else{
    //Insert them into the database!
    db_query("INSERT INTO users VALUES('" . mysql_real_escape_string($_SESSION['verifieduser']) . "', '" . crypt($_POST['password'], LOGIN_SALT) . "', 1, 1, 0)");
    //Create folders for uploading projects
    mkdir("../../projects/" + $_SESSION['verifieduser']);
    //Log the user in
    session_start();
    //set user in the session
    $_SESSION ['username'] = $username;
    //set a cookie to the user
    //this can be improved even more, but I'm not to worried about it right now,
    //since it isn't so popular that people would hack users. But, we will improve on
    //security soon
    setCookie('user_id', $username);
    //unset all the other SESSION variables we had
    unset($_SESSION['verifieduser']);
    unset($_SESSION['tmp_username']);
    unset($_SESSION['tmp_user_code']);
    //send them on their way!
    header('Location: ../?verified=1');
}*/
header('Location: ../?verified=0&error=READONLY');
?>
