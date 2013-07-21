<?php
/*
 * After the file is unzipped, we have to rename it so that the site will take effect
 * To do this, the unzipping file sends the user here, which will rename the folder "Go-Everywhere-master" into "Go-Everywhere"
 */
function rmdirr($dirname)
{
// Sanity check
if (!file_exists($dirname)) {
return false;
}

// Simple delete for a file
if (is_file($dirname)) {
return unlink($dirname);
}

// Loop through the folder
$dir = dir($dirname);
while (false !== $entry = $dir->read()) {
// Skip pointers
if ($entry == '.' || $entry == '..') {
continue;
}

// Recurse
rmdirr("$dirname/$entry");
}

// Clean up
$dir->close();
return rmdir($dirname);
}
 
rmdirr("../../Go-Everywhere");
//rename the folder
rename("../../Go-Everywhere-master", "../../Go-Everywhere");
//and, we are done!
echo "Success! The site should have been updated, but you should go look and make sure.";
?>