<?php
/* This script takes the verified user, and inserts them into the database */
//get the database info
require_once("../../db_constants.php");
//see if all the required info is here
if(isset($_SESSION['username']))
{
	//They shouldn't be here!
	header('Location: ../');
	exit;
}
if(empty($_SESSION['verifieduser']))
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
if($_POST['password'] == $_POST['password2'])
{
	//They didn't fill out the last form correctly!
	header('Location: ./3.php?error=yes');
	exit;
}
//Okay, now we can begin to register them!
db_connect();
//See if they are already registered
$result = mysql_query("SELECT * FROM users WHERE user='" . $_POST['username'] . "'");
if(mysql_num_rows($result) > 0)
{
    	//They are already registered!
    	$errormessage = "ERROR: You are already registered! Go log in instead!";
}else{
	//Insert them into the database!
	db_query("INSERT INTO users VALUES('" . $_POST['username'] . "', '" . sha1($_POST['password']) . "', 1, 1, 0)");
	//Log the user in
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
	header('Location: ./index.php');
	}
}
?>