<?php
/*This script is temporarily going to display all of the projects in the database.
 *There is currently no limit to the projects on this page, it will load
 *ALL projects. If we had 200 projects, it would load all 200 projects. However,
 *this will be changed later. Go Everywhere doesn't have that many projects yet.
 *If this page is given with the GET request type, it will echo the info with that
 *data type. The default is HTML, however it will also accept xml, which will
 *echo the data as an XML document.
 */

//get the database info
$backTicks = "";
for($i = 0; $i < substr_count($_SERVER['SCRIPT_NAME'], '/') - 1; $i++)
{
    $backTicks .= "../";
}
require_once($backTicks . "db_constants.php");

//So that we have a "global" domain variables
if ($_SERVER["SERVER_PORT"] != "80") {
    $HDOMAIN = $_SERVER["SERVER_NAME"].":".$_SERVER["SERVER_PORT"];
} else {
    $HDOMAIN = $_SERVER["SERVER_NAME"];
}
//connect to the database
db_connect();
//query the projects table (to get project names)
$result = db_query("SELECT * FROM projects");
//see what type of data we have to echo out
switch($_GET['type'])
{
    case 'xml':
    case 'XML':
        $type = "xml";
        break;
    default:
        $type = "html";
        break;
}
//Echo the header
switch($type)
{
    case 'html':
        include_once('../includes/header.php');
        echo "<style type=\"text/css\">\nimg.projectthumbnail {\nwidth: 219;\nheight: 165;\n}\n</style>\n";
        echo "<h2>All Projects</h2>\n";
        echo "<table border=\"0\">\n";
        break;
    case 'xml':
        header ("Content-Type: text/xml");
        echo "<?xml version=\"1.0\" ?>\n";
        echo "<projects>\n";
        break;
}
//Go through each project
$num = 0;
while($row = db_fetch_array($result))
{
    //make sure that the project is shared before we put it up to be viewed
    if($row['shared'] == 1)
    {
        switch($type)
        {
            case 'html':
                //create table rows for organization (every first)
                $num++;
                if($num == 1)
                    echo "<tr>";
                //start the table data
                echo "<td>";
                //thumbnail image
                echo "<p><a href=\"" . $DOMAIN . "/explore/view.php?id=" . $row['id'] ."\"><img class=\"projectthumbnail\" width=\"219\" height=\"165\" alt=\"No project icon\" title=\"" . $row['title'] . "\" src=\"http://" . $HDOMAIN . "/projects/" . $row['user'] . "/" . $row['id'] . ".png\" /></a><br />\n";
                //credits (needs to be a link once we have user pages)
                echo "by " . $row['user'] . "</p>";
                echo "</td>\n";
                //close the table row for organization (every third)
                if($num == 3)
                {
                    echo "</tr>\n";
                }
                break;
            case 'xml':
                echo "<project id=\"" . $row['id'] . "\" user=\"" . $row['user'] ."\" title=\"" . $row['title'] ."\" />\n";
                break;
        }
    }
}
if($type == 'html')
{
    //close the remaining table row (if it is open)
    if($num < 3)
        echo "</tr>\n";
}
//Echo the footer
switch($type)
{
    case 'html':
        echo "</table>\n";
        include_once('../includes/footer.php');
        break;
    case 'xml':
        echo "</projects>\n";
        break;
}
?>