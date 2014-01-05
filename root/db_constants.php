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
 *
 * Please note that the GE server uses PostgreSQL. You will have a choice to use
 * PostgreSQL or MySQL. If MySQL, make sure USING_POSTGRESQL is set to false, and
 * change the MYSQL_* info to your server's info.
 * If PostgreSQL, change USING_POSTGRESQL to true, and change the POSTGRESQL_*
 * to your server's info.
 */
define("USING_POSTGRESQL", false);
/*
 * Change this to any of the following:
 * (depending on your choice of database)
 * (don't include parenthesis)
 * - mysql
 * - pgsql (PostgreSQL)
 * There's a lot more, but I don't think anyone will ever use them (IBM DB2?).
 * Just search "PHP PDO DSNs" on <favorite search engine> and you can find a list.
*/
define("DB_TYPE", "mysql");
// Change these (their purpose should be obvious)
define("DB_USER", "root");
define("DB_PASSWORD", "");
define("DB_SERVER", "127.0.0.1");
define("DB_DATABASE", "Go-Everywhere");
// This is automatically generated, so IGNORE IT!
// Unless Go Everywhere crashes on database connection. Some databases (like IBM DB2, Oracle, Firebird, SQLite, etc.) might need manual tweaking of this constant.
define("DB_CONNECTION_STRING", DB_TYPE . ":host=" . DB_SERVER . ";dbname=" . DB_DATABASE . ";charset=utf8");

//The salt for crypting users (change to be more secure)
define("LOGIN_SALT", "goev");

//A constant defining read-only mode (no inserting data)
define("GE_READ_ONLY", false);

// $db holds the PDO object used for connecting with the database.
// It stays null until db_connect.
$db = null;

function db_connect()
{
	global $db;
    $db = new PDO(DB_CONNECTION_STRING, DB_USER, DB_PASSWORD);
}
function db_query($q)
{
	global $db;
    return $db->query($q);
}
function db_fetch_array($result)
{
	global $db;
    return $result->fetch(PDO::FETCH_BOTH);
}
function db_num_rows($result)
{
	global $db;
	return $result->rowCount();
}
function db_free_result($result)
{
	global $db;
    $result->closeCursor();
}
function db_disconnect()
{
	global $db;
    $db = null;
}
