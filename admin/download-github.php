<?php
/* This script will download the current zip archive from GitHub to whatever server we are on at the moment
 * Then, extract it into the main directory, as to update the site
 */
// Download the zip from Github
file_put_contents("goev-tmp.zip", file_get_contents("https://codeload.github.com/GoEverywhere/Go-Everywhere/zip/master"));
// Now, just to unzip it!
// Create the ZipArchive object
$zip = new ZipArchive;
// Open the zip
$res = $zip->open('goev-tmp.zip');
if ($res === TRUE) {
    //extract it to the current directory (for now, to see if this will all work)
    $zip->extractTo('../');
    //close the zip
    $zip->close();
    //we are all done. Hooray!
    //Since we probably don't need the zip anymore,
    //and it is just using space, we will delete it
    unlink("goev-tmp.zip");
    //Now, we go to a new script to finish the process
    header("Location: rename.php");
} else {
    //Well, it failed
    echo 'Download was OK, but the extraction failed. Go check the logs and see why.';
}
?>
