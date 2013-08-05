<?php
include_once("./includes/header.php");
?>
<form method="post" action="./actions/login.php" enctype="application/x-www-form-urlencoded">
    <label for="username">Username: </label>
    <input type="text" length="15" maxlength="20" id="username" name="username" /><br />
    <label for="password">Password: </label>
    <input type="password" length="20" maxlength="20" id="password" name="password" /><br />
    <input type="submit" value="submit" />
</form>
<?php
include_once("./includes/footer.php");
?>