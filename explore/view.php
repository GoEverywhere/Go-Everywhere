<?php
//This script will display a project ID
//and eventually along with it's comments
//get the header
include_once("../includes/header.php");
//get the database info
$backTicks = "";
for($i = 0; $i < substr_count($_SERVER['SCRIPT_NAME'], '/') - 1; $i++)
{
    $backTicks .= "../";
}
require_once($backTicks . "db_constants.php");
//connect to the db
db_connect();
//make sure that there is a project id
$ID = db_escape($_GET['id']);
if(empty($ID) || $ID == "")
{
    //send them to the all projects page
    header("Location: ./index.php");
    exit;
}
//query the database
$result = db_query("SELECT * FROM projects WHERE id=" . $ID . "");
//see if there are any projects with that id
if(db_num_rows($result) < 0)
{
    //send them away
    header("Location: ./index.php");
    exit;
}
//get the info
$row = db_fetch_array($result);
//echo the data into the page.
?>
<style>
    #project_info {
        border: 1px inset black;
        width: 350px;
    }
</style>
<center>
    <h2><?php echo $row['title']; ?></h2>
    <iframe id="project_viewer" width="500" height="405" scrolling="no" src="./player/sb2.js/player.html?project=<?php echo urlencode($DOMAIN . "/projects/" . $row['user'] . "/" . $row['id'] . ".ge"); ?>">Loading...</iframe>
    <div id="project_info">
        <h4><b>Description</b></h4>
        <p><?php echo $row['description']; ?></p>
    </div>
</center>
<?php
//include the footer
include_once("../includes/footer.php");
?>