<?php
/*
 * This script takes the parameters and puts them into PHP post
 * for uploading directly to ModShare. You also must supply a
 * username and password as well.
 */
function uploadToModshare($username, $password, $title, $description, $project)
{
    //Put the parameters into an array
    //Please note that the mod is going to be other, since Go Everywhere isn't an official mod yet
    $post_data = array(
        'title' => $title,
        'description' => $description,
        'mod' => 'other',
        'license' => 'ms',
        'project' => $project,
        'un' => $username,
        'pwd' => $password
    );
    //turn the array into a http URl (a=b&c=d)
    $data = http_build_query($post_data);
    //parse the URL for modshare
    $url = parse_url('http://modshare.org/upload/');
    //extract host and path
    $host = $url['host'];
    $path = $url['path'];
    //open a socket connection on port 80 - timeout: 30 sec
    $fp = fsockopen($host, 80, $errno, $errstr, 30);
    if($fp)
    {
        //Send the request headers
        fputs($fp, "POST $path HTTP/1.1\r\n");
        fputs($fp, "Host: $host\r\n");
        
        fputs($fp, "Content-type: application/x-www-form-urlencoded\r\n");
        fputs($fp, "Content-length: ". strlen($data) ."\r\n");
        fputs($fp, "Connection: close\r\n\r\n");
        fputs($fp, $data);
        
        $result = '';
        while(!feod($fp))
        {
            //receive the results of the request
            $result .= fgets($fp, 128);
        }
    }else{
        return array(
            'status' => 'err', 
            'error' => "$errstr ($errno)"
        );
    }
    //close the connection
    fclose($fp);
    // split the result header from the content
    $result = explode("\r\n\r\n", $result, 2);
 
    $header = isset($result[0]) ? $result[0] : '';
    $content = isset($result[1]) ? $result[1] : '';
 
    // return as structured array:
    return array(
        'status' => 'ok',
        'header' => $header,
        'content' => $content
    );
}
?>