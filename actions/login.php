<?php
/* Hello I got jvvg to let us use the Scratch Verification script 
 * that they use on ModShare and Scratch Wiki.When we finish 
 * Go Everywhere he is going into the credits section of it.
 */
<?php
if ($url == '/logout') {
    unset($_SESSION['uid']);
    header('Location: /'); die;
}
if (isset($_SESSION['uid'])) {
    header('Location: /'); die;
}
$page_title = 'Log in - GoEverywhere';

session_regenerate_id(); //regenerate session ID for security purposes
if (isset($_POST['un'])) {
    $result = $db->query('SELECT id FROM users
    WHERE LOWER(username) = LOWER(\'' . $db->escape($_POST['un']) . '\')
    AND password_hash=\'' . $db->escape(ms_hash($_POST['pwd'])) . '\'
    AND status=\'normal\'') or error('Failed to check user', __FILE__, __LINE__, $db->error()); //user exists?
    if ($db->num_rows($result)) {
        //good login, let's continue
        $user_info = $db->fetch_assoc($result);
        $_SESSION['uid'] = $user_info['id'];

        if ($_SESSION['banneduserid'] && $ms_user['id'] != $_SESSION['banneduserid']) {
            $db->query('INSERT INTO bans(message,user_id,ip,starts,expires)
            VALUES(\'You have been banned for trying to use an alternate account to get around a ban. Instead of using alternate accounts, please contact us about unbanning the original account.\',' . $user_info['id'] . ',\'' . $_SERVER['REMOTE_ADDR'] . '\',' . (time() + 60 * 20) . ',' . (time() + 60 * 60 * 24 * 3) . ')') or error('Failed to ban alternate account', __FILE__, __LINE__, $db->error());
            unset($_SESSION['banneduserid']);
        }

        addlog('User ' . $user_info['id'] . ' logged in');
        header('Location: /'); die;
    } else {
        $result = $db->query('SELECT id, password_hash, status FROM users WHERE LOWER(username) = LOWER(\'' . $db->escape($_POST['un']) . '\')');
        if ($db->num_rows($result)) {
            $user_info = $db->fetch_assoc($result);
            if($user_info['password_hash'] == 'reset') {
                header('Location: /forgot'); die;
            }
            if ($user_info['status'] == 'disabledbyadmin') {
                $db->query('INSERT INTO bans(user_id,ip,expires,message,type) VALUES(0,\'' . $db->escape($_SERVER['REMOTE_ADDR']) . '\',' . (time() + 60 * 60 * 24 * 7) . ',\'' . $db->escape('You have been automatically banned from logging in for attempting to log in to a disabled account.') . '\',\'login\')') or error('Failed to autoban', __FILE__, __LINE__, $db->error());
                echo 'Your account has been disabled by the Go Everywhere Team!.'; die;
            }
            //bad login, apprise the user of the situation
            echo '<h2>Invalid login</h2>
            <p>Invalid username or password. Hit the back button to try again.</p>
            <p><a href="/forgot">Forgot password?</a></p>';
        }
    }
} else {
?>
<h2>Log in</h2>
<p>Not registered yet? <a href="/register">Sign up!</a></p>
<form action="/login" method="post" enctype="multipart/form-data">
    <table border="0">
        <tr>
            <td>Username</td>
            <td><input type="text" name="un" /></td>
        </tr>
        <tr>
            <td>Password</td>
            <td><input type="password" name="pwd" /></td>
        </tr>
    </table>
    <input type="submit" value="Log in" />
</form>
<?php
}
?>
