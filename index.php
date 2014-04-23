<?php
//include the header (but make sure it is only once, to not redo any code that shouldn't)
include_once("./includes/header.php");
?>
<?php include_once("./includes/Mobile_Detect.php");
    $detect = new Mobile_Detect;
    if ($detect->isMobile() || $detect->isTablet()) {
        echo '<p style="background-color:yellow;">This website is a Scratch extension designed for mobile devices. Click <a href="/webapps/ios">here</a> to go to the Go Everywhere iOS site, better designed for mobile devices.';
    }
?>

<p>Go Everywhere is inspired by Scratch, to edit Scratch projects on mobile devices, via HTML5, and community made. Each supported device will have a specific stylesheet, making the interface more user-friendly. And for the devices that work, but are not specifically supported, a general stylesheet will be created, as temporary support for the device until we can get a stylesheet working.</p>
<h2><u>Why should I care? The Scratch Team is already working (or is going to work) on Scratch 2.0 in HTML5.</u></h2>
<p>Correct. However, there are several advantages. Since this is the community's version of Scratch, we can edit however we please. If we see a feature that we want, or don't like, we don't have to wait for official support. We can edit it, and use Go Everywhere until support is added. We can add blocks, user-interface design, and add advanced editing options. Our projects can also be transformed into native apps for Android, Steam, and iOS (however, with each platform, you have to commit the money yourself to submit apps). Whatever you want to do with your project is okay with us!</p>
<h2><u>Awesome! How can I help??</u></h2>
<p>Thanks for the offer! We can use the extra help. Before, we all had certain jobs, and were committed to getting them done. Some of us left, and some of us didn't finish our jobs. However, looking around, I noticed that this was not the best option for a community. There is no commitment, just do it when you feel like it. So, this is how it is going to work. You must have a Github account, as we will be using Github. Fork out repository at <a href="https://github.com/GoEverywhere/Go-Everywhere/" target="_blank">https://github.com/GoEverywhere/Go-Everywhere/</a> If somebody already has submitted a pull request that you wanted to work on, by all means, work on it! If yours is more compatible, or is better, smarter code, we will more likely use it!</p>
<br />
<h2><u>Helpful Links</u></h2>
<ul>
    <li><a href="http://scratch.mit.edu/discuss/topic/11087/?page=2#post-85547">Tutorial for pull requests (with images)</a></li>
    <li><a href="http://scratch.mit.edu/discuss/topic/11087/?page=2#post-85608">Tutorial for setting up server for local development (video)</a></li>
    <li><a href="http://scratch.mit.edu/discuss/topic/11087/?page=5#post-103458">Unofficial API documentation</a></li>
    <li><a href="http://scratch.mit.edu/discuss/topic/11087/?page=5#post-104384">Simulating iPhone screen on Windows</a></li>
    <li><a href="https://github.com/GoEverywhere/Go-Everywhere/wiki/Go-Everywhere-Project-format">Go Everywhere Project format documentation (deprecated)</a></li>
    <li><a href="http://scratch.mit.edu/discuss/post/224255/">MySQL Sample Database SQL file</a></li>
</ul>

<?php
//include the footer
include_once("./includes/footer.php");
?>