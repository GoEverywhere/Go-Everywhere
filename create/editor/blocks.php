<?php
/* Block image generating program. Stick text in the "label" GET variable to this script, and it will return a base image of the block.
 * The GET variable "type" can be either "command", "reporter", or "boolean". Defaults to "command".
 */
//Switch the GET variable to find the type
switch($_GET['type'])
{
    case "reporter":
        $type = "reporter";
        break;
    case "boolean":
        $type = "boolean";
        break;
    case "hat":
        $type = "hat";
        break;
    case "command":
    default:
        $type = "command";
        break;
}
//set the content header type
header('Content-Type: image/png');
//get the length of the label
$label_length = strlen($_GET['label']);
//get the width of the image (10 pixels per label length)
switch($type)
{
    case "reporter":
        $image_width = 21 + ($label_length * 10);
        //create the image
        $img = imagecreatetruecolor($image_width, 23);
        break;
    case "command":
        $image_width = 30 + ($label_length * 10);
        //create the image
        $img = imagecreatetruecolor($image_width, 24);
        break;
    case "boolean":
        $image_width = 21 + ($label_length * 10);
        //create the image
        $img = imagecreatetruecolor($image_width, 23);
        break;
    case "hat":
        $image_width = 10 + ($label_length * 10);
        //create the image
        $img = imagecreatetruecolor($image_width, 50);
        break;
}
// Make the background transparent
imagecolortransparent($im, imagecolorallocate($im, 0, 0, 0));
//create the color for the polygon (12-points) and string (white)
$block_color = imagecolorallocate($img, 109, 75, 242);
$string_color = imagecolorallocate($img, 255, 255, 255);
//create the polygon
switch($type)
{
    case "command":
        //make an array of points for the polygon
        $points = array(
            0, 0,
            10, 0,
            15, 3,
            25, 3,
            30, 0,
            $image_width, 0,
            $image_width, 20,
            30, 20,
            25, 23,
            15, 23,
            10, 20,
            0, 20,
        );
        imagefilledpolygon($img, $points, 12, $block_color);
        //draw the text onto the image
        imagestring($img, 5, 30, 2, $_GET['label'], $string_color);
        break;
    case "boolean":
        //make an array of points for the polygon
        $points = array(
            0, 11,
            10, 0,
            10 + ($label_length * 10), 0,
            20 + ($label_length * 10), 11,
            10 + ($label_length * 10), 22,
            10, 22
        );
        imagefilledpolygon($img, $points, 6, $block_color);
        //draw the text onto the image
        imagestring($img, 5, 13, 2, $_GET['label'], $string_color);
        break;
    case "reporter":
        //draw ellipses (beginning and end caps)
        imagefilledellipse($img, 11, 11, 22, 22, $block_color);
        imagefilledellipse($img, $image_width - 12, 11, 22, 22, $block_color);
        //draw rectangle for body
        imagefilledrectangle($img, 11, 0, $image_width - 12, 22, $block_color);
        //draw the text onto the image
        imagestring($img, 5, 13, 2, $_GET['label'], $string_color);
        break;
    case "hat":
        //draw arcs for top
        imagefilledarc($img, 50, 10, 100, 20, 180, 0, $block_color, IMG_ARC_PIE);
        //draw polygon for rest
        //make an array of points for the polygon
        $points = array(
            0, 10,
            10, 10,
            $image_width, 10,
            $image_width, 30,
            30, 30,
            25, 33,
            15, 33,
            10, 30,
            0, 30
        );
        imagefilledpolygon($img, $points, 9, $block_color);
        //draw the text onto the image
        imagestring($img, 5, 13, 12, $_GET['label'], $string_color);
        break;
}
//flush the image and exit
imagepng($img);
imagedestroy($img);
?>