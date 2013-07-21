<?php
/* This script will download the current zip archive from Github to whatever server we are on at the moment
 * Then, extract it into the main directory, as to update the site
 */
//downlaod the zip from Github
file_put_contents("goev-tmp.zip", fopen("https://github.com/GoEverywhere/Go-Everywhere/archive/master.zip", 'r'));
//now, just to unzip it!
//create the ZipArchive object
$zip = new ZipArchive;
//open the zip
$res = $zip->open('goev-tmp.zip');
if ($res === TRUE) {
    //extract it to the current directory (for now, to see if this will all work)
    $zip->extractTo('../../');
    //close the zip
    $zip->close();
    //we are all done. Hooray!
    //Now, we go to a new script to finish the process
    header("../../rename.php");
} else {
    //Well, it failed
    echo 'Download was OK, but the extraction failed. Go check the logs and see why.';
}
?>