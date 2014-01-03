<?php
$username = "";
// If username parameter is supplied, set the variable.
if (isset($_GET['username'])) {
    $username = $_GET['username'];
}
// Set Content-Type to make the PHP page look like a picture when viewed directly.
header("Content-Type: image/png");
// Check for avatar
$echoMe = file_get_contents("default.png");
$search = basename("../avatars/" . $username . ".png");
if (file_exists($search)) {
    $echoMe = file_get_contents($search);
}
echo $echoMe;
?>