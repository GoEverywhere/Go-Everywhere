<?php
//This script will display a project ID
//and eventually along with it's comments
//get the header
include_once("../includes/header.php");
//db info
require_once("../../db_constants.php");
//connect to the db
db_connect();
//make sure that there is a project id
$ID = mysql_real_escape_string($_GET['id']);
if(empty($ID) || $ID == "")
{
    //send them to the all projects page
    header("Location: ./index.php");
    exit;
}
//query the database
$result = mysql_query("SELECT * FROM projects WHERE id='" . $ID . "'") or die(mysql_error());
//see if there are any projects with that id
if(mysql_num_rows($result) < 0)
{
    //send them away
    header("Location: ./index.php");
    exit;
}
//get the info
$row = mysql_fetch_array($result);
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
    <iframe id="project_viewer" width="500" height="405" scrolling="no" src="./player/JsScratch/player.htm?project=<?php echo "../../../projects/" . $row['user'] . "/" . $row['id'] . ".sb"; ?>">Loading...</iframe>
    <div id="project_info">
        <h4><b>Description</b></h4>
        <p><?php echo $row['description']; ?></p>
    </div>
</center>
<?php
//include the footer
include_once("../includes/footer.php");
?>