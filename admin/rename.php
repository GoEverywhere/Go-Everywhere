<?php
/*
 * After the file is unzipped, we have to rename it so that the site will take effect
 * To do this, the unzipping file sends the user here, which will rename the folder "Go-Everywhere-master" into "Go-Everywhere"
 */
/*
 *THIS SCRIPT MUST BE COPIED TO THE ROOT DIRECTORY
 *THE SAME DIRECTORY THAT THE FOLDER "Go-Everywhere" EXISTS
 */
//rename the folder
rename("Go-Everywhere-master", "Go-Everywhere");
//and, we are done!
echo "Success! The site should have been updated, but you should go look and make sure.";
?>