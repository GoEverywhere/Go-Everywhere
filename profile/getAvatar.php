<?php
$username = "";
// If username parameter is supplied, set the variable.
if (isset($_GET['username'])) {
    $username = $_GET['username'];
}
// Set Content-Type to make the PHP page look like a picture when viewed directly.
header("Content-Type: image/png");
//hold the default avatar for later
$echoMe = file_get_contents("default.png");
//If a user was given, go find their Scratch avatar
if ($username !== "") {
    $userPageContents = file_get_contents("http://scratch.mit.edu/users/" . $username . "/");
    
    $userPageDOM = new DOMDocument;
    $userPageDOM->loadHTML($userPageContents);
    
    if($userPageDOM)
    {
        //Keep it going
        $wholePage = simplexml_import_dom($userPageDOM);
        foreach($wholePage->xpath("//div") as $div)
        {
            $shouldBreak = false;
            switch((string)$div['class'])
            {
                case "avatar":
                    
                    //This div is the avatar div
                    $echoMe = file_get_contents("http:" . (string)$div->a[0]->img[0]['src']);
                    
                    break;
            }
            if($shouldBreak === true)
            {
                break;
            }
        }
    }
    
    //$echoMe = file_get_contents($avatarImageElement->src);
}
echo $echoMe;
?>