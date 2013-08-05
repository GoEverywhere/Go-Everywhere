<?php
/* These are constants that you should include to a script anytime you want to
 * access the database. This file must exist in the root, and you should reference
 * it from there too (for good practice).
 *
 * The default values for the constants are meant for local MySQL servers, but you
 * can change it to whatever best suits your needs.
 *
 * I have been reading, and found that the mysql functions are deprecated in PHP 5.5
 * If this is the case, these functions will need to be changed to mysqli
 * equivalent. I do not have the time to learn mysqli, so i am going to
 * continue writing this in mysql functions. PLEASE REMOVE THIS NOTICE IF
 * YOU CHANGE TO MYSQLI!!!!!!!!!!!!!
 */
define("MYSQL_USER", "root");
define("MYSQL_PASSWORD", "";
define("MYSQL_SERVER", "127.0.0.1");
define("MYSQL_DATABASE", "Go-Everywhere");

function db_connect()
{
    //Call this function whenever you want to connect to the database
    //Connect to MySQL, die any errors (for now)
    mysql_connect(MYSQL_SERVER, MYSQL_USER, MYSQL_PASSWORD) or die ('Could not connect to MySQL: ' . mysql_error());
    //Connect to the database (a script for a default database setup, in an sql file, will be put on our site)
    mysql_select_db(MYSQL_DATABASE) or die ('Could not select database: ' . mysql_error());
}
function db_query($q)
{
    //Call this function whenever you want to query the database
    return mysql_query($q) or die ("Could not query: " . mysql_error();
}
function db_fetch_array($result)
{
    //Call this function whenever you want to get a row array from the query result
    return mysql_fetch_array($result);
}
function db_num_rows($result)
{
    //Call this function whenever you want to get the number of does returned from the query result
    return mysql_num_rows($result);
}
function db_free_result($result)
{
    //Call this function whenever you want to free your result
    return mysql_free_result($result);
}
function db_disconnect()
{
    //Call this function once you are done querying MySQL
    //There might be something extra we need to do, so just call this to be up to date
    mysql_close();
}