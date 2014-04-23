<?php
/* This script verifies that the user has commented the code, and then asks them
 * to choose a password to go along with their account
 */
//start the session
session_start();
//variables for later (credit to jvvg)
$project_id = '10135908/';
$project_url = 'http://scratch.mit.edu/projects/' . $project_id;
$api_url = 'http://scratch.mit.edu/site-api/comments/project/' . $project_id . '?page=1&salt=' . md5(time()); //salt is to prevent caching
//check to see if the user is still in the session
if(empty($_SESSION['tmp_username']) || $_SESSION['tmp_username'] == "")
{
	//We need to send them back to step one
	header('Location: ./1.php');
}else{
	if(empty($_SESSION['tmp_user_code']))
	{
		//We need to send them back to step two
		header('Location: ./2.php');
	}else{
		//Check to verify that the user commented on the Scratch project (credit to jvvg)
		$data = file_get_contents($api_url);
		if(!$data){
			echo '<p>API access failed. Please try again later.</p>';
			exit;
		}
		$success = false;
		preg_match_all('%<div id="comments-\d+" class="comment.*?" data-comment-id="\d+">.*?<a href="/users/(.*?)">.*?<div class="content">(.*?)</div>%ms', $data, $matches);
		foreach ($matches[2] as $key => $val)
		{
			$user = $matches[1][$key];
			$comment = trim($val);
			if($user == $_SESSION['tmp_username'] && $comment == $_SESSION['tmp_user_code'])
			{
				$success = true;
				$_SESSION['verifieduser'] = $_SESSION['tmp_username'];
				//include the header
				include_once('../includes/header.php');
				?>
					<h2>Signup! ~Step 3</h2>
					<?php
					if(isset($_GET['error']) && $_GET['error'] != "")
					{
					?>
					<h3 style="color:red;">Please make sure that your passwords match!</h3>
					<?php } ?>
					<p>Please insert a password for your Go Everywhere account for <span class="color:orange;"><?php echo $_SESSION['verifieduser']; ?></span>.</p>
					<form style="padding: 5px;border: 1px solid black; width: 450px;" method="post" action="./4.php" enctype="application/x-www-form-urlencoded">
    						<label for="password">Go Everywhere Password: </label>
    						<input type="password" length="15" maxlength="20" id="password" name="password" /><br />
						<label for="password2">Go Everywhere Password: </label>
    						<input type="password" length="15" maxlength="20" id="password2" name="password2" /><br />
    						<input type="submit" value="Signup!" />
					</form>
				<?php
				//include the footer
				include_once('../includes/footer.php');
			}
			if(!$success)
			{
				//Didn't find it. Send the user to the last step
				header('Location: ./2.php');
			}
		}
	}
}
?>
