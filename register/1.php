<?php
/* This is the first step in the registration process.
 * The user will need to insert their Scratch username,
 * and go to the next step
 */
include_once('../includes/header.php');
if(isset($_SESSION['username']))
{
	//They shouldn't be here!
	header('Location: ../');
	exit;
}
$disabled = false; //True if registration should be disabled
if($disabled)
{
    echo "<h3 style='color:red;'>Sorry, registration is currently locked. Please try again later!</h3>";
}else{
?>
<h2>Signup!</h2>
<p>Please insert your existing <a href="http://scratch.mit.edu/" target="_blank">Scratch</a> account.</p>
<form style="padding: 5px;border: 1px solid black; width: 450px;" method="post" action="./2.php" enctype="application/x-www-form-urlencoded">
    <label for="username">Existing Scratch Username: </label>
    <input type="text" length="15" maxlength="20" id="username" name="username" /><br />
    <input type="submit" value="Signup!" />
</form>
<?php
}
include_once('../includes/footer.php');
?>
