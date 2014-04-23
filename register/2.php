<?php
/* This script will generate the code and ask the user to comment it on the comment project */
session_start();
//variables for later (credit to jvvg)
$project_id = '10135908/';
$project_url = 'http://scratch.mit.edu/projects/' . $project_id;

if(isset($_SESSION['username']))
{
	//They shouldn't be here!
	header('Location: ../');
	exit;
}

if(empty($_POST['username']))
{
	//They shouldn't be here
	header('Location: 1.php');
}else{
	//Hold the user for later
	$_SESSION['tmp_username'] = $_POST['username'];
	$user_code = sha1(time() . $_POST['username']);
	//Hold the code for later
	$_SESSION['tmp_user_code'] = $user_code;
	//Inform the user to post the comment (credit to jvvg)
	include_once('../includes/header.php');
	echo '<h2>Signup! ~Step 2</h2>';
	echo '<p>Please go to the <a href="' . $project_url . '#comments" target="_BLANK">user verification project</a> and comment the following code: <span style="color:blue;">' . $user_code . '</span></p>';
	echo '<form action="./3.php" method="post" enctype="application/x-www-form-urlencoded"><p><input type="submit" value="I have commented the code, continue" /></p></form>';
	include_once('../includes/footer.php');	
}
?>
