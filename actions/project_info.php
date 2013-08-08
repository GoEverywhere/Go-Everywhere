<?php
//This file will echo out project info
header('Content-Type: text/xml');
//get database info
require_once("../../db_constants.php");
//connect to the database
db_connect();
//query the database for the project info
$result = mysql_query("SELECT * FROM projects WHERE id='" . $_GET['id'] . "'") or die("Could not query");
//get the array from the result
$row = mysql_fetch_array($result);
//echo the info
echo '<?xml version="1.0" ?>';
?>
<project>
    <info user="<?php echo $row['user']; ?>" id="<?php echo $row['id']; ?>" date="<?php echo $row['date']; ?>" title="<?php echo $row['title']; ?>" description="<?php echo $row['description']; ?>" />
</project>